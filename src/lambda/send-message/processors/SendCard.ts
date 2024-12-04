import { APIGatewayProxyEvent } from "aws-lambda";
import { SendCardValidation } from "./validators/SendCardValidation";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient , ScanCommand, UpdateCommand  } from "@aws-sdk/lib-dynamodb";

import SocketClient from "../services/SocketClient";
import { endpoint, DB_GAMES_TABLE } from "../const";

interface IClient  { 
    connections: string[], 
    gameId: string 
}

export default class sendCard{
    private event: APIGatewayProxyEvent
    private DynamoDBClient: DynamoDBClient
    private DynamoDBdocumentClient: DynamoDBDocumentClient
    
    constructor( event: APIGatewayProxyEvent){
        this.event = event
        this.DynamoDBClient = new  DynamoDBClient({region: 'us-east-1',})
        this.DynamoDBdocumentClient = DynamoDBDocumentClient.from(this.DynamoDBClient);
    }

    public async run(){
        const client = new SocketClient(endpoint);
        const connectionId = this.event.requestContext.connectionId!
        try {
            
            const sendCardValidation = new SendCardValidation(this.event)
            const data = sendCardValidation.process()
            data.action = "share-card"
            const allConnections  = await this.getClientsBasedOnGameId(data.gameId) 
            const messagesStatus = await client.sendToAll(allConnections, data)
            const goneResponses = messagesStatus
                .filter( 
                    (message)=> {
                        if(message.status === 'rejected' && message.reason.reason === 'GONE_CONNECTION'){
                            return true
                        }
                        return false
                    }
                ) as unknown as {reason: { ConnectionId : string }}[]
            const goneConnections = goneResponses.map( message => message.reason.ConnectionId)
            const newConnections =  allConnections.filter(connection => !goneConnections.includes(connection))
            await this.updateGameConnectionsByGameId(data.gameId, newConnections)
        } catch (e) {
            console.error(e)
            const error = e as {message: string }
            if(error && error.message){
                await client.sendToOne(connectionId, {error: error.message})
            }
        }

    }
    private async getClientsBasedOnGameId (gameId: string): Promise<string[]>{
        try {
            
            const params = {
                TableName: DB_GAMES_TABLE,
                FilterExpression: "gameId = :gameIdValue",
                ExpressionAttributeValues: {
                    ":gameIdValue": gameId,
                },
            }
            const result = await this.DynamoDBdocumentClient.send(new ScanCommand(params))
            if(!result.Items || result.Items?.length < 0){
                return []
            }

            const resultData = result.Items as IClient[]
            return resultData[0].connections;
        } catch (error) {
            console.log("Error on Scan Client by GameId", error);
            return []
        }

    }
    private async updateGameConnectionsByGameId (gameId: string, newConnections: string[]){
        try {
            const params = new UpdateCommand({
                TableName: DB_GAMES_TABLE,
                Key: {
                    gameId: gameId
                },
                UpdateExpression: "set connections = :newConnections",
                ExpressionAttributeValues: {
                    ":newConnections": newConnections,
                  },
            })

            await this.DynamoDBdocumentClient.send(params)  
        } catch (error) {
            console.log("Error on Update Game connections", error);
            return []
        }
    }

}