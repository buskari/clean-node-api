import { Encrypter } from './../../interfaces/EncrypterInterface'
import { AccountModel } from './../../../domain/models/AccountModel'
import { AddAccount, AddAccountModel } from './../../../domain/use-cases/AddAccount'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypeter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypeter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
