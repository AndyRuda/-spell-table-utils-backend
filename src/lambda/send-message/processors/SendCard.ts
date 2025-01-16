import { APIGatewayProxyEvent } from "aws-lambda";
import { SendCardValidation } from "./validators/SendCardValidation";
import SocketClient from "../services/SocketClient";
import { endpoint } from "../const";
import GameManager from "../services/GameManager";

export default class sendCard{
    private event: APIGatewayProxyEvent
    private GameManager: GameManager
    
    constructor( event: APIGatewayProxyEvent){
        this.event = event
        this.GameManager = new  GameManager()
    }

    public async run(){
        const client = new SocketClient(endpoint);
        const connectionId = this.event.requestContext.connectionId!
        try {
            
            const sendCardValidation = new SendCardValidation(this.event)
            const data = sendCardValidation.process()
            data.action = "share-card"
            const allConnections  = await this.GameManager.getClientsBasedOnGameId(data.gameId) 
            await client.sendToAll(allConnections, data)
        } catch (e) {
            console.error(e)
            const error = e as {message: string }
            if(error && error.message){
                await client.sendToOne(connectionId, {error: error.message})
            }
        }

    }


}