import { HttpRequest, HttpResponse } from '../interfaces/Http'
import { Controller } from '../interfaces/Controller'
import { badRequest, serverError } from './helpers/http-helper'
import { MissingParamError } from './Errors/MissingParamError'
import { EmailValidator } from '../interfaces/EmailValidator'
import { InvalidParamError } from './Errors/InvalidParamError'

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

      const isValid = this.emailValidator.isValid(data.email)

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      throw new Error()
    } catch (error) {
      return serverError()
    }
  }
}
