import { HttpRequest, HttpResponse } from '../interfaces/http'
import { Controller } from '../interfaces/controller'
import { MissingParamError } from './Errors/MissingParamError'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const data = httpRequest.body

    if (!data.name) {
      return {
        statusCode: 400,
        body: new MissingParamError('name')
      }
    }

    if (!data.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email')
      }
    }
  }
}
