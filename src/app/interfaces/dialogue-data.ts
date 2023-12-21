// All the data that needs to be returned from the checkout form
export interface DialogueData {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  address1: string
  address2?: string
  city: string
  county: string
  postcode: string
  country: string
  cardNumber: string
  expiry: string
  cvc: string
}
