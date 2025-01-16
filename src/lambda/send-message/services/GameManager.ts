import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DB_GAMES_TABLE } from "../const";

export interface IClient {
  connections: string[];
  gameId: string;
}

export default class GameManager {
  private DynamoDBClient: DynamoDBClient;
  private DynamoDBdocumentClient: DynamoDBDocumentClient;

  constructor() {
    this.DynamoDBClient = new DynamoDBClient({ region: "us-east-1" });
    this.DynamoDBdocumentClient = DynamoDBDocumentClient.from(
      this.DynamoDBClient
    );
  }

  public async getClientsBasedOnGameId(gameId: string): Promise<string[]> {
    try {
      const params = {
        TableName: DB_GAMES_TABLE,
        FilterExpression: "gameId = :gameIdValue",
        ExpressionAttributeValues: {
          ":gameIdValue": gameId,
        },
      };
      const result = await this.DynamoDBdocumentClient.send(
        new ScanCommand(params)
      );
      if (!result.Items || result.Items?.length < 0) {
        return [];
      }

      const resultData = result.Items as IClient[];
      return resultData[0].connections;
    } catch (error) {
      console.log("Error on Scan Client by GameId", error);
      return [];
    }
  }

  public async registerGame(gameId: string, connectionId: string, accountId: string) {
    try {
      const params = {
        TableName: DB_GAMES_TABLE,
        Key: { gameId },
        UpdateExpression:
          "SET connections = list_append(if_not_exists(connections, :emptyList), :newConnection)",
        ExpressionAttributeValues: {
          ":emptyList": [],
          ":newConnection": [connectionId],
        },
      };
      await this.DynamoDBdocumentClient.send(new UpdateCommand(params));
    } catch (error) {
      console.log("Error putting item:", error);
    }
  }

  public async updateGameConnectionsByGameId(
    gameId: string,
    newConnection: string[]
  ) {
    try {
      const params = new UpdateCommand({
        TableName: DB_GAMES_TABLE,
        Key: {
          gameId: gameId,
        },
        UpdateExpression: "set connections = :newConnections",
        ExpressionAttributeValues: {
          ":newConnections": newConnection,
        },
      });

      await this.DynamoDBdocumentClient.send(params);
    } catch (error) {
      console.log("Error on Update Game connections", error);
      return [];
    }
  }
}
