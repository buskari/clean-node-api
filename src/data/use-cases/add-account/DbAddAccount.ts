import {
  Encrypter,
  AccountModel,
  AddAccount,
  AddAccountModel
} from './DbAddAccountInterfaces'

export class DbAddAccount implements AddAccount {
  constructor (private readonly encrypeter: Encrypter) {}

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypeter.encrypt(account.password)
    return new Promise(resolve => resolve(null))
  }
}
