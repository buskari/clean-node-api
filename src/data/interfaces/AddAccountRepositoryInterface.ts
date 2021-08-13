import { AccountModel } from './../../domain/models/AccountModel'
import { AddAccountModel } from './../../domain/use-cases/AddAccount'

export interface AddAccountRepository {
  add (account: AddAccountModel): Promise<AccountModel>
}
