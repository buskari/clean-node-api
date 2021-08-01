import { SignUpController } from './SignUpController'

describe('SignUp Controller ', () => {
  it('Should return 400 if NO NAME is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        email: 'test_email@gmail.com',
        password: 'test_password',
        passwordConfirmation: 'test_confirmation'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })
})
