import { Request, Response } from 'express'
import { Endpoint, RequestType } from 'firebase-backend'

export default new Endpoint (
    'addMessage',
    RequestType.GET,
    (request, response) => {
        response.status(201).send("Works")
    }
)