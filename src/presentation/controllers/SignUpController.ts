export class SignUpController {
  handle (httpRequest: any): any {
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
