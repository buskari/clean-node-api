export class SignUpController {
  handle (httpRequest: any): any {
    // const data = httpRequest.body

    // if (!httpRequest.body.name)
    return {
      statusCode: 400,
      body: new Error('Missing param: name')
    }
  }
}
