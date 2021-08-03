import { HttpRequest, HttpResponse, Controller, EmailValidator } from '../interfaces'
import { badRequest, serverError } from './helpers/http-helper'
import { MissingParamError, InvalidParamError } from './Errors'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const data = httpRequest.body
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!data[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (data.password !== data.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(data.email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
