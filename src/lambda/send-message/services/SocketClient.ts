import { PostToConnectionCommand, ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi"

export default class SocketClient {
    private CLIENT: ApiGatewayManagementApiClient
    constructor( endpoint: string ){
        this.CLIENT = new  ApiGatewayManagementApiClient({ endpoint })

    }
    async sendToOne(id: string, body: {}): Promise<{reason: string, ConnectionId?: string}>{
      try {
        const postCommand = new PostToConnectionCommand({
          ConnectionId: id,
          Data: JSON.stringify(body),
        });
        await this.CLIENT.send(postCommand);
        return { reason: `Message sent to ${id}` };
      } catch (e) {
        console.log(e)
        const error = e as { name: string }
        if (error.name === "GoneException") {
          return Promise.reject({ reason: 'GONE_CONNECTION', ConnectionId: id });
        }
        return Promise.reject({ reason: '💀 INTERNAL SERVER ERROR'});

      }
    } 
      
    async sendToAll(ids: string[], body: {}){
      const allMsg = ids.map(id => this.sendToOne(id, body))
      return Promise.allSettled(allMsg)
    } 
}