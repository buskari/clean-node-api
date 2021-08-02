import { HttpRequest, HttpResponse } from '../interfaces/http'
import { Controller } from '../interfaces/controller'
import { badRequest } from './helpers/http-helper'
import { MissingParamError } from './Errors/MissingParamError'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const data = httpRequest.body

    if (!data.name) {
      return badRequest(new MissingParamError('name'))
    }

    if (!data.email) {
      return badRequest(new MissingParamError('email'))
    }
  }
}
