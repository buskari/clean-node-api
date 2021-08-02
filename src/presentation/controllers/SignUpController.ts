import { HttpRequest, HttpResponse } from '../interfaces/http'
import { Controller } from '../interfaces/controller'
import { badRequest } from './helpers/http-helper'
import { MissingParamError } from './Errors/MissingParamError'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const data = httpRequest.body
    const requiredFields = ['name', 'email']

    for (const field of requiredFields) {
      if (!data[field]) {
        return badRequest(new MissingParamError(field))
      }
    }
  }
}
