const WebSocket = require("ws");
const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "data", "sample.txt");
const ws = new WebSocket("ws://localhost:8080");

let clientId = null;

ws.on("open", () => {
  console.log("Connected to server");
});

ws.on("message", (data) => {
  const message = JSON.parse(data);

  if (message.type === "register") {
    clientId = message.clientId;
    console.log("Registered with clientId:", clientId);
  }

  if (message.type === "download_request") {
    console.log("Download request received");

    const stream = fs.createReadStream(FILE_PATH, { highWaterMark: 64 * 1024 });

    stream.on("data", (chunk) => {
      ws.send(
        JSON.stringify({
          type: "file_chunk",
          filename: path.basename(FILE_PATH),
          chunk: chunk.toString("base64"),
        })
      );
    });

    stream.on("end", () => {
      ws.send(
        JSON.stringify({
          type: "file_complete",
          filename: path.basename(FILE_PATH),
        })
      );
      console.log("File sent successfully");
    });
  }
});
