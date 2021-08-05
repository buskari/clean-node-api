import { SignUpController } from './SignUpController'
import { MissingParamError, InvalidParamError, ServerError } from '../errors'
import {
  EmailValidator,
  AddAccount,
  AddAccountModel,
  AccountModel
} from './signup-interfaces'

interface MakeSut {
  sut: SignUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

const makeAccountStub = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }

  return new AddAccountStub()
}

const makeSut = (): MakeSut => {
  const emailValidatorStub = makeEmailValidator()
  const addAccountStub = makeAccountStub()
  const sut = new SignUpController(emailValidatorStub, addAccountStub)

  return {
    sut,
    emailValidatorStub,
    addAccountStub
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
    const { sut, emailValidatorStub } = makeSut()
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

  it('Should call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    const httpRequest = {
      body: {
        name: 'name_test',
        email: 'test_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'test_password'
      }
    }

    sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'name_test',
      email: 'test_email@mail.com',
      password: 'test_password'
    })
  })

  it('Should return 500 if AddAccount throws', () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpRequest = {
      body: {
        name: 'test_name',
        email: 'test_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'test_password'
      }
    }

    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(500)
  })

  it('Should return 200 if valid data is provided', () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        name: 'test_name',
        email: 'test_email@mail.com',
        password: 'test_password',
        passwordConfirmation: 'test_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email@email.com',
      password: 'valid_password'
    })
  })
})
