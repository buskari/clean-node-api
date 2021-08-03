import { SignUpController } from './SignUpController'
import { MissingParamError } from './Errors/MissingParamError'
import { InvalidParamError } from './Errors/InvalidParamError'
import { EmailValidator } from '../interfaces/EmailValidator'
import { ServerError } from '../controllers/Errors/ServerError'

interface MakeSut {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

// interface EmailValidatorError {
//   isValid (email: string): Error
// }

// const makeEmailValidatorStubError = (): void => {
//   class EmailValidatorStub implements EmailValidatorError {
//     isValid (email: string): Error {
//       throw new Error()
//     }
//   }
// }

const makeSut = (): MakeSut => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorStub = new EmailValidatorStub()
  const sut = new SignUpController(emailValidatorStub)

  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUp Controller ', () => {
  it('Should return 400 if NO NAME is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'test_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'test_confirmation'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  it('Should return 400 if NO EMAIL is provided', () => {
    const { sut } = makeSut()
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

  it('Should return 400 if NO PASSWORD is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name_test',
        email: 'test_email@mail.com',
        passwordConfirmation: 'test_confirmation'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  it('Should return 400 if NO PASSWORD is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name_test',
        email: 'test_email@mail.com',
        password: 'test_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  it('Should return 400 if AN INVALID EMAIL is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'name_test',
        email: 'test_invalid_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'test_confirmation'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  it('Should email validator with email provided in the body of the request', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'name_test',
        email: 'test_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'test_confirmation'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('test_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', () => {
    class EmailValidatorStub implements EmailValidator {
      isValid (email: string): boolean {
        throw new Error()
      }
    }
    const emailValidatorStub = new EmailValidatorStub()
    const sut = new SignUpController(emailValidatorStub)
    jest.spyOn(emailValidatorStub, 'isValid')
    const httpRequest = {
      body: {
        name: 'name_test',
        email: 'test_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'test_confirmation'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
