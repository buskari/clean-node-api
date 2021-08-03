import { SignUpController } from './SignUpController'
import { MissingParamError, InvalidParamError, ServerError } from './Errors'
import { EmailValidator } from '../interfaces/EmailValidator'

interface MakeSut {
  sut: SignUpController
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeSut = (): MakeSut => {
  const emailValidatorStub = makeEmailValidator()
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

  it('Should return 400 if NO PASSWORD CONFIRMATION is provided', () => {
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

  it('Should return 400 if password and pass confirmation does not match', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'name_test',
        email: 'test_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'invalid_pass_confirmation'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  it('Should return 400 if AN INVALID EMAIL is provided', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = {
      body: {
        name: 'name_test',
        email: 'test_invalid_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'test_password'
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
        passwordConfirmation: 'test_password'
      }
    }

    sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenCalledWith('test_email@mail.com')
  })

  it('Should return 500 if EmailValidator throws', () => {
    const emailValidatorStub = makeEmailValidator()
    const sut = new SignUpController(emailValidatorStub)
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'name_test',
        email: 'test_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'test_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })
})
