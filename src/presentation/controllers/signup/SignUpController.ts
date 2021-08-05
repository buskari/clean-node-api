import {
  HttpRequest,
  HttpResponse,
  Controller,
  EmailValidator,
  AddAccount
} from './signup-interfaces'
import { badRequest, serverError, success } from '../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../errors'

export class SignUpController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly addAccount: AddAccount
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, password, passwordConfirmation } = httpRequest.body
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      const isValid = this.emailValidator.isValid(email)

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      const account = await this.addAccount.add({
        name,
        email,
        password
      })

      return new Promise(resolve => resolve(success(account)))
    } catch (error) {
      return serverError()
    }
  }
}
