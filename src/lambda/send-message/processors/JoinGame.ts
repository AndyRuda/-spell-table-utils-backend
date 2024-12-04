import { APIGatewayProxyEvent } from "aws-lambda";
import { GameValidator } from "./validators/GameValidator";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand  } from "@aws-sdk/lib-dynamodb";

export default class JoinGame {
    private DynamoDBClient: DynamoDBClient
    private DynamoDBdocumentClient: DynamoDBDocumentClient
    private tableConnectionsName = "spell-table-utils-games"
    private event: APIGatewayProxyEvent
    private conectionValidator: GameValidator

    constructor(event: APIGatewayProxyEvent){
        this.DynamoDBClient = new  DynamoDBClient({region: 'us-east-1',})
        this.DynamoDBdocumentClient = DynamoDBDocumentClient.from(this.DynamoDBClient);
        this.event = event
        this.conectionValidator = new GameValidator(this.event)

    }
    async registerGame(){
        try {
            const { gameId,connectionId } = this.conectionValidator.process();
            const params = {
                TableName: this.tableConnectionsName,
                Key: { gameId },
                UpdateExpression: "SET connections = list_append(if_not_exists(connections, :emptyList), :newConnection)",
                ExpressionAttributeValues: {
                  ":emptyList": [],
                  ":newConnection": [connectionId],
                },
              };
            await this.DynamoDBdocumentClient.send(new UpdateCommand (params))
        } catch (error) {
            console.log('Error putting item:', error);
        }
    } 
      
    async unRegisterConnection(){
    } 
}