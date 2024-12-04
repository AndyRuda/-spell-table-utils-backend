
# AWS Lambda WebSocket Example

This project demonstrates an AWS Lambda function configured to handle WebSocket connections using **API Gateway**. The Lambda processes specific WebSocket routes, sending messages to one or multiple connected clients.

## Features
- Handles WebSocket connections, default routes, and disconnections.
- Sends messages to individual clients or broadcasts to all connected clients.
- Utilizes the AWS SDK v3 `@aws-sdk/client-apigatewaymanagementapi` for WebSocket messaging.

---

## Project Structure
```plaintext
├── lambda       # All Lambdas Code
└── README.md    # Project documentation
```

### Key Functions
- **`sendToOne(id: string, body: {})`**  
  Sends a message to a specific WebSocket connection.

- **`sendToAll(ids: string[], body: {})`**  
  Broadcasts a message to multiple WebSocket connections.

- **`handler`**  
  Main Lambda function handling WebSocket routes:
  - `$connect`: Handles client connection.
  - `$disconnect`: Handles client disconnection.
  - `$default`: Fallback route.
  - `send-card`: Sends a public message to all connected clients.

---

## Prerequisites

### Requirements
- **AWS CLI**: Installed and configured with access to your AWS account.
- **Node.js**: v14 or higher.
- **wscat**: A WebSocket CLI tool for testing WebSocket connections.

Install `wscat` globally if you don't have it:
```bash
npm install -g wscat
```

---

## Deployment

1. **Install Dependencies**  
   Ensure you have installed all required dependencies:
   ```bash
   npm install
   ```

2. **Deploy Lambda**  
   Use the AWS CLI or a deployment framework like **Serverless Framework** or **AWS SAM** to deploy the Lambda.

3. **Configure API Gateway**  
   - Set up a **WebSocket API** in API Gateway.
   - Add the routes: `$connect`, `$disconnect`, `$default`, and `send-card`.
   - Integrate each route with the deployed Lambda.

---

## Testing End-to-End

### Test WebSocket Communication

1. **Connect to WebSocket Endpoint**  
   Use `wscat` to connect to the WebSocket API Gateway endpoint:
   ```bash
   wscat -c wss://es0m0d3w44.execute-api.us-east-1.amazonaws.com/prod/
   ```

2. **Send Messages**  
   Once connected, test sending a message using the `send-card` action:
   ```bash
   {"action": "send-card"}
   ```

3. **Observe Responses**  
   - The Lambda will broadcast a public message:  
     ```json
     {"publicMessage": "PUBLIC MESSAGE FROM AWS APIGETWAY"}
     ```