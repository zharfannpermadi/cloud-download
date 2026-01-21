# How to Run the Project

## 1. Install Node.js
Make sure Node.js is installed:
node -v
npm -v

## 2. Install Dependencies
npm install express ws

## 3. Start the Server
cd server
node server.js

## 4. Start the Client (Open a New Terminal)
cd client
node client.js

## 5. Get Connected Clients (Using Postman/Insomnia)
METHOD: GET
URL: http://localhost:3000/clients 
here is the result
{
    "clients": [
        "9ae3858f-15ff-4d50-9007-08a0e6776c48"
    ]
}

## 6. Trigger Download using Client Id(Using Postman/Insomnia)
METHOD: POST 
URL: http://localhost:3000/download/:clientId 
example
http://localhost:3000/download/fe376684-3ca5-4e6b-863f-41c40106d14d

here is the result
{
    "message": "Download triggered for client fe376684-3ca5-4e6b-863f-41c40106d14d"
}

## 7. Check Downloaded File
The downloaded file will be saved in:
server/downloads/

######
```bash
Note:
This system supports all file types, including:
.txt .png .pdf .zip .mp4

Just place the file in:
client/data/

like this
client/data/sample.png

and update the file path in client.js.
like this
const FILE_PATH = path.join(__dirname, "data", "sample.png");