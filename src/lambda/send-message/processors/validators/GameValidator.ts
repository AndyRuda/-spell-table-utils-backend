import { APIGatewayProxyEvent } from "aws-lambda";
import { errors } from "../../const";
export interface joinGameBody{
    connectionId: string
    gameId: string
    accountId: string
}

export class GameValidator {
    private event: APIGatewayProxyEvent
    constructor (event: APIGatewayProxyEvent){
        this.event = event
    }
    
    public process(): joinGameBody{
        const connectionId = this.validateRequestContext()
        const body = this.validateRequestBody()
        return { connectionId, gameId: body.gameId, accountId: body.accountId }
    }

    private validateRequestContext(){
        if(!this.event.requestContext.connectionId){
            throw new Error(errors.INVALID_CONNECTION_ID)
        }
        return this.event.requestContext.connectionId
    }

    private validateRequestBody(){
        if(!this.event.body){
            throw new Error(errors.NO_BODY)
        }
        const body = JSON.parse(this.event.body)
        if(!body.gameId){
            throw new Error(errors.INVALID_BODY('gameId'))
        }
        if(!body.accountId){
            throw new Error(errors.INVALID_BODY('accountId'))
        }
        return body
    }
}