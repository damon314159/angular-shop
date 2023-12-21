import { type FirebaseApp, initializeApp } from 'firebase/app'
import { getDatabase, ref, push } from 'firebase/database'
import { Component, Inject, ViewChild } from '@angular/core'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose
} from '@angular/material/dialog'
import { FormsModule, NgForm } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { type DialogueData } from '../../interfaces/dialogue-data'
import { CommonModule } from '@angular/common'
import { MatSnackBar } from '@angular/material/snack-bar'
import {
  EmailValidatorDirective,
  ExpiryValidatorDirective,
  PhoneValidatorDirective,
  PostcodeValidatorDirective
} from './form-validators.directive'
import { CartService } from '../../services/cart.service'
import { Transaction } from '../../interfaces/transaction'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'

@Component({
  selector: 'app-checkout-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    CommonModule,
    PhoneValidatorDirective,
    EmailValidatorDirective,
    PostcodeValidatorDirective,
    ExpiryValidatorDirective
  ],
  templateUrl: './checkout-form.component.html',
  styleUrl: './checkout-form.component.scss'
})
export class CheckoutFormComponent {
  // Dependency injection in constructor
  constructor(
    public dialogueRef: MatDialogRef<CheckoutFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogueData,
    private readonly snackBar: MatSnackBar,
    private readonly cartService: CartService,
    private readonly http: HttpClient
  ) {}

  // View the form element that exists in the dialogue box
  @ViewChild('checkoutForm', { static: true })
  checkoutForm!: NgForm

  // Close the form on the cancel button
  onCancelClick(): void {
    this.dialogueRef.close()
  }

  // Method to submit the data to the database, taking the user info data, the items bought, and the costs
  async submitData(data: DialogueData, items: Transaction[], costs: Record<string, number>): Promise<void> {
    // Initialise the config item to use with the firebase real time db
    const firebaseConfig = {
      apiKey: 'DCE4D219D6F30FB6A15B93C5DA92D80CD9877995A7D57CD87048C940ECE40475782B863BAED5D84C6A7CB44E6D9110A0',
      authDomain: 'wywm-shop.firebaseapp.com',
      projectId: 'wywm-shop',
      databaseURL: 'https://wywm-shop-default-rtdb.firebaseio.com/',
      storageBucket: 'wywm-shop.appspot.com',
      messagingSenderId: '1042038869660',
      appId: '1:1042038869660:web:827615f46033e5459c6759'
    }
    // Get a reference to the data node 'orders'
    const app: FirebaseApp = initializeApp(firebaseConfig)
    const db = getDatabase(app)
    const dataRef = ref(db, 'orders')

    // Push a single object containing userData, items, costs to the db
    await push(dataRef, Object.assign({ userData: data }, { items }, { costs }))
  }

  // Method to send the email via an email API
  async sendEmail(data: DialogueData, items: Transaction[], costs: Record<string, number>): Promise<void> {
    // Set key and URL. Ideally the key would be stored in environment variables rather than in source
    const apiKey = 'BA765A87B76418FD6EA8CEC57D7C92A341F55FB07E153DA793350975F777DEFF6DB2C11CC8D1547F2889C542A91B2BBF'
    const apiUrl = 'https://api.elasticemail.com/v2/email/send?'
    // Initialise a format object for currency formatting in the email
    const currencyFormat = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

    // Fetch the email template html as text via http request
    const getEmailTemplate = (): Observable<string> => {
      return this.http.get('assets/email-template.html', { responseType: 'text' })
    }
    getEmailTemplate().subscribe((emailTemplateHTML) => {
      // When it is retrieved, replace all the blanks with the appropriate info
      const emailBodyHTML = emailTemplateHTML
        .replace('[CustomerName]', `${data.firstName} ${data.lastName}`)
        .replace(
          '[ProductDetails]',
          items.reduce(
            (html: string, item: Transaction) =>
              html +
              `<tr>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${currencyFormat.format(item.price)}</td>
              </tr>`,
            ''
          )
        )
        .replace('[TotalAmount]', currencyFormat.format(costs['total']))
        .replace('[ShippingName]', `${data.firstName} ${data.lastName}`)
        .replace('[ShippingAddressLine1-2]', `${data.address1}${data.address2 === '' ? '' : ',' + data.address2}`)
        .replace('[ShippingCity]', data.city)
        .replace('[ShippingCounty]', data.county)
        .replace('[ShippingPostcode]', data.postcode)
        .replace('[ShippingCountry]', data.country)
        .replace('[CardLast4]', data.cardNumber.slice(-4))

      // After it has been populated, create the email object as per API docs
      const emailData: Record<string, string | boolean> = {
        apikey: apiKey,
        from: 'wywmshopdb@gmail.com',
        to: data.email,
        subject: 'Order Confirmation',
        bodyHtml: emailBodyHTML,
        isTransactional: true
      }
      // Attempt to send the email, with a try... catch block for simple error handling
      const sendEmail = async (data: Record<string, string | boolean>): Promise<void> => {
        try {
          await fetch(apiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: Object.keys(data)
              .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
              .join('&')
          })
        } catch (error) {
          console.error('Error sending email:', error)
        }
      }
      void sendEmail(emailData)
    })
  }

  // When the form is submitted
  submitForm(): void {
    // Check for validity of the form
    if (this.checkoutForm.valid ?? false) {
      // If it was valid, close it with its data passed back
      this.dialogueRef.close(this.data)
      // Small success message
      this.snackBar.open('Checkout success', 'Close')

      // Retrieve cost and items info, then call the db and email methods
      const items = this.cartService.getCartItems().slice(0)
      const costs = this.cartService.getCosts()
      void this.submitData(this.data, items, costs)
      void this.sendEmail(this.data, items, costs)

      // Reset the cart and table, with a new message for successful completion
      this.cartService.clearCart()
      this.cartService.triggerTableRefresh()
      this.snackBar.open('Order Successful!', 'Close')
      return
    }
    // If it was invalid, mark all fields as touched to highlight empty required fields
    for (const control of Object.keys(this.checkoutForm.controls)) {
      this.checkoutForm.controls[control].markAsTouched()
    }
  }
}
