import { Directive } from '@angular/core'
import { NG_VALIDATORS, AbstractControl, Validator, ValidationErrors, ValidatorFn } from '@angular/forms'

// Custom validation example using a directive. This example is only a regex...
// but it allows a custom error object to allow for specific user feedback
function phoneNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = /^\+?[0-9]+(?:[ -]*[0-9]){10,}$/.test(control.value ?? '')
    return isValid ? null : { invalidPhoneNumber: true }
  }
}

@Directive({
  selector: '[phoneValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PhoneValidatorDirective,
      multi: true
    }
  ]
})
export class PhoneValidatorDirective implements Validator {
  // A validate method that will call the custom validation function on the control
  public validate(control: AbstractControl): ValidationErrors | null {
    return phoneNumberValidator()(control)
  }
}

// Custom validation example using a directive. This example is only a regex...
// but it allows a custom error object to allow for specific user feedback
function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid =
      /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
        control.value ?? ''
      )
    return isValid ? null : { invalidEmail: true }
  }
}

@Directive({
  selector: '[emailValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: EmailValidatorDirective,
      multi: true
    }
  ]
})
export class EmailValidatorDirective implements Validator {
  // A validate method that will call the custom validation function on the control
  public validate(control: AbstractControl): ValidationErrors | null {
    return emailValidator()(control)
  }
}

// Custom validation example using a directive. This example is only a regex...
// but it allows a custom error object to allow for specific user feedback
function postcodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = /^[A-Za-z0-9\s-]{3,10}$/.test(control.value ?? '')
    return isValid ? null : { invalidPostcode: true }
  }
}

@Directive({
  selector: '[postcodeValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PostcodeValidatorDirective,
      multi: true
    }
  ]
})
export class PostcodeValidatorDirective implements Validator {
  // A validate method that will call the custom validation function on the control
  public validate(control: AbstractControl): ValidationErrors | null {
    return postcodeValidator()(control)
  }
}

// Custom validation example using a directive. This example is only a regex...
// but it allows a custom error object to allow for specific user feedback
function expiryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = /^(0[1-9]|1[0-2])\/\d{2}$/.test(control.value ?? '')
    return isValid ? null : { invalidExpiry: true }
  }
}

@Directive({
  selector: '[expiryValidator]',
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ExpiryValidatorDirective,
      multi: true
    }
  ]
})
export class ExpiryValidatorDirective implements Validator {
  // A validate method that will call the custom validation function on the control
  public validate(control: AbstractControl): ValidationErrors | null {
    return expiryValidator()(control)
  }
}
