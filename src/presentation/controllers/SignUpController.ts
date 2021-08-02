import { HttpRequest, HttpResponse } from '../interfaces/http'
import { Controller } from '../interfaces/controller'

export class SignUpController implements Controller {
  handle (httpRequest: HttpRequest): HttpResponse {
    const data = httpRequest.body

    if (!data.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }

    if (!data.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }
  }
}
