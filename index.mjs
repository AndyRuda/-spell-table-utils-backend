"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const client_apigatewaymanagementapi_1 = require("@aws-sdk/client-apigatewaymanagementapi");
const ENDPOINT = 'https://es0m0d3w44.execute-api.us-east-1.amazonaws.com/prod';
const CLIENT = new client_apigatewaymanagementapi_1.ApiGatewayManagementApiClient({ endpoint: ENDPOINT });
async function sendToOne(id, body) {
    try {
        const postCommand = new client_apigatewaymanagementapi_1.PostToConnectionCommand({
            ConnectionId: id,
            Data: JSON.stringify(body),
        });
        await CLIENT.send(postCommand);
    }
    catch (error) {
        console.log(error);
    }
}
async function sendToAll(ids, body) {
    const allMsg = ids.map(id => sendToOne(id, body));
    return Promise.all(allMsg);
}
const handler = async (event) => {
    let body = {};
    console.log(event);
    console.log(event.requestContext);
    console.log(event.body);
    const connectionId = event.requestContext.connectionId;
    const routeId = event.requestContext.routeKey;
    try {
        if (event.body)
            body = JSON.parse(event.body);
    }
    catch (error) {
        console.log(error);
    }
    switch (routeId) {
        case '$connect':
            break;
        case '$default':
            break;
        case '$disconnect':
            break;
        case 'send-card':
            await sendToAll([connectionId], { publicMessage: 'PUBLIC MESSAGE FROM AWS APIGETWAY' });
            break;
        default:
            break;
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};
exports.handler = handler;
