import { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import SendCard from "./processors/SendCard";
import JoinGame from "./processors/JoinGame";


export const handler: Handler<APIGatewayProxyEvent, APIGatewayProxyResult> = async (event) => {  
  const routeId = event.requestContext.routeKey
  console.log(event)
  switch (routeId) {
    case '$connect':
      break;
    case '$default':
      break;
    case 'disconnect':
      break;
    case 'send-card':
      const SendCardHandler = new SendCard(event);
      await SendCardHandler.run()
      break;
    case 'join-game':
      const joinGameHandler = new JoinGame(event);
      await joinGameHandler.registerGame()
      break;
  
    default:
      break;
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({ok: 'ok'}),
  };

  return response;
};
