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
import {
  EmailValidatorDirective,
  ExpiryValidatorDirective,
  PhoneValidatorDirective,
  PostcodeValidatorDirective
} from './form-validators.directive'

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
  constructor(
    public dialogueRef: MatDialogRef<CheckoutFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogueData
  ) {}

  @ViewChild('checkoutForm', { static: true })
  checkoutForm!: NgForm

  onCancelClick(): void {
    this.dialogueRef.close()
  }

  submitForm(): void {
    if (this.checkoutForm.valid ?? false) {
      this.dialogueRef.close(this.data)
      return
    }
    for (const control of Object.keys(this.checkoutForm.controls)) {
      this.checkoutForm.controls[control].markAsTouched()
    }
  }
}
