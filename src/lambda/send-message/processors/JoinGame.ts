import { APIGatewayProxyEvent } from "aws-lambda";
import { GameValidator } from "./validators/GameValidator";
import GameManager from "../services/GameManager";


export default class JoinGame {
    private gameManager: GameManager
    private event: APIGatewayProxyEvent
    private conectionValidator: GameValidator

    constructor(event: APIGatewayProxyEvent){
        this.gameManager = new  GameManager()
        this.event = event
        this.conectionValidator = new GameValidator(this.event)

    }
    async registerGame(){
        try {
            const { gameId, connectionId, accountId } = this.conectionValidator.process();
            await this.gameManager.registerGame(gameId, connectionId, accountId);
        } catch (error) {
            console.log('Error putting item:', error);
        }
    } 
}