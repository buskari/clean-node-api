import { EmailValidator } from './../presentation/controllers-interfaces/EmailValidator'

export class EmailValidatorAdapter implements EmailValidator {
  isValid (email: string): boolean {
    return false
  }
}
