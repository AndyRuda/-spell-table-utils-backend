import { APIGatewayProxyEvent } from "aws-lambda";
import { errors } from "../../const";
export interface sendCardBody{
    card: string
    gameId: string
    action: "send-card" | "share-card"
}

export class SendCardValidation {
    private event: APIGatewayProxyEvent
    constructor (event: APIGatewayProxyEvent){
        this.event = event
    }
    
    public process(){
        this.validateRequestContext()
        return this.validateRequestBody() as sendCardBody
    }

    private validateRequestContext(){
        if(!this.event.requestContext.connectionId){
            throw new Error(errors.INVALID_CONNECTION_ID)
        }

    }

    private validateRequestBody(){
        if(!this.event.body){
            throw new Error(errors.NO_BODY)
        }
        const body = JSON.parse(this.event.body)
        if(!body.card){
            throw new Error(errors.INVALID_BODY('card'))
        }
        if(!body.gameId){
            throw new Error(errors.INVALID_BODY('gameId'))
        }
        return body
    }
}