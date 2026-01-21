const express = require("express");
const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const REST_PORT = 3000;
const WS_PORT = 8080;

app.use(express.json());

const wss = new WebSocket.Server({ port: WS_PORT });
const clients = new Map();

console.log(`WebSocket server running on ws://localhost:${WS_PORT}`);

wss.on("connection", (ws) => {
  const clientId = crypto.randomUUID();
  clients.set(clientId, ws);
  console.log(`Client connected: ${clientId}`);

  ws.send(JSON.stringify({ type: "register", clientId }));

  ws.on("message", (data) => {
    const message = JSON.parse(data);

    if (message.type === "file_chunk") {
      const filePath = path.join(__dirname, "downloads", message.filename);
      fs.appendFileSync(filePath, Buffer.from(message.chunk, "base64"));
    }

    if (message.type === "file_complete") {
      console.log(`File download complete: ${message.filename}`);
    }
  });

  ws.on("close", () => {
    clients.delete(clientId);
    console.log(`Client disconnected: ${clientId}`);
  });
});

// Trigger Download File
app.post("/download/:clientId", (req, res) => {
  const clientId = req.params.clientId;
  const ws = clients.get(clientId);

  if (!ws) {
    return res.status(404).json({ error: "Client not connected" });
  }

  ws.send(JSON.stringify({ type: "download_request" }));
  res.json({ message: `Download triggered for client ${clientId}` });
});

// List Connected Clients
app.get("/clients", (req, res) => {
  res.json({ clients: Array.from(clients.keys()) });
});

app.listen(REST_PORT, () => {
  console.log(`REST API server running on http://localhost:${REST_PORT}`);
});
