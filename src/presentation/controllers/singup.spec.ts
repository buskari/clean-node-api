import { SignUpController } from './SignUpController'
import { MissingParamError } from './Errors/MissingParamError'

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
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if NO EMAIL is provided', () => {
    const sut = new SignUpController()
    const httpRequest = {
      body: {
        name: 'name_test',
        password: 'test_password',
        passwordConfirmation: 'test_confirmation'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
