import { APIGatewayProxyEvent } from "aws-lambda";
import { GameValidator } from "./validators/GameValidator";
import SendCard from "./SendCard";
import GameManager from "./../services/GameManager";

export default class leaveGame {
    private GameManager: GameManager
    private event: APIGatewayProxyEvent
    private conectionValidator: GameValidator
    private sendCard: SendCard

    constructor(event: APIGatewayProxyEvent){
        this.GameManager = new GameManager();
        this.event = event
        this.conectionValidator = new GameValidator(this.event)
        this.sendCard = new SendCard(this.event)

    }
    async run(){
        try {
            const { gameId, connectionId } = this.conectionValidator.process();
            
            const allCard = await this.GameManager.getClientsBasedOnGameId(gameId)
            console.log(allCard)
            const newConnectionsList = allCard.filter(( connection )=> connection !== connectionId)
            console.log(newConnectionsList)
            await this.GameManager.updateGameConnectionsByGameId(gameId, newConnectionsList)
        } catch (error) {
            console.log('Error putting item:', error);
        }
    } 
      
}