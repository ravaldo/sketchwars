# Sketchwars
play now: [sketchwars.vercel.app](https://sketchwars.vercel.app/)

note: currently we are using a free-tier hosting service (render.com) for the backend which spins down with inactivity so the first time creating a game may take an extra 10-15 seconds. 


## About

This project is an homage to a great game called SketchParty, which is a digital adaptation of the popular party game Pictionary.
<div align="center">
  
![](https://i.imgur.com/u239weS.jpg)
</div>

The game is played with two devices; a large shared screen (usually a TV) and a tablet to draw on. A group of people gather in the same room and divide into two teams. Players take turns drawing a word or phrase on the tablet, while everyone else watches the drawing being created on the shared sceen and their teammates attempt to guess the correct answer within a time limit.


## How It Works
The iOS version is an app that is downloaded to an iPad or iPhone, and requires an AppleTV to cast the image to the TV (using AirPlay).

In our recreation, we developed the game as a React web application accessible via a public web page. Your TV and Tablet device simply need to visit the same URL and behind the scenes, we use websockets to synchronise the devices.


## Development

#### Server Setup
```
cd server
npm install
npm run server:dev
```
the backend (Express and WebSocket server) will be accessible at `localhost:9000`


#### Client Setup
```
cd client/sketchwars
npm install
npm start
```
the React app will be viewable at `localhost:3000`

#### Accessing the App
To access the app from a second device within your local network, you will to find the IP address of your machine on the LAN, eg. `192.168.0.10`, and use that in a browser on your second device with the correct port, eg. `http://192.168.0.10:3000`.

#### Handling CORS
Since the app operates across origins, you'll need to add the same IP address you used to access the app on the second device to the `allowedOrigins` list in `server/server.js`. This step is necessary to avoid CORS (Cross-Origin Resource Sharing) issues.
