import {
  Encrypter,
  AccountModel,
  AddAccount,
  AddAccountModel,
  AddAccountRepository
} from './DbAddAccountInterfaces'

export class DbAddAccount implements AddAccount {
  constructor (
    private readonly encrypeter: Encrypter,
    private readonly addAccountRepository: AddAccountRepository
  ) {}

  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const hashedPassword = await this.encrypeter.encrypt(accountData.password)
    const account = await this.addAccountRepository.add(
      Object.assign(
        {},
        accountData,
        { password: hashedPassword }
      )
    )
    return new Promise(resolve => resolve(account))
  }
}
