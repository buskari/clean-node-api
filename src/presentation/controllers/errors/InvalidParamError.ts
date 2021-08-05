export class InvalidParamError extends Error {
  constructor (invalidParam: string) {
    super(`Invalid param: ${invalidParam}`)
    this.name = 'InvalidParamError'
  }
}
