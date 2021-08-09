import { HttpResponse } from '../../controllers-interfaces/Http'
import { ServerError } from '../errors'

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
})

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
})

export const success = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
