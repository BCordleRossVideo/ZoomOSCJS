import Zosc from "../Zosc";	// import the class

const express = require('express')

let zosc = new Zosc("10.10.80.21",9090,1234);	// create a new instance of the ZOSC class

console.log("ZOSC App Started.");

const app = express()
const port = 3000
app.post('/mute/:zoomID', (req, res) => {
   console.log("Muting user: " + req.params.zoomID);
   zosc.users[req.params.zoomID].mute();
   res.send('User Muted Successfully.');
});

app.post('/list', (req, res) => {
   console.log("Sending List Command");
   zosc.sendZoomCommand('list');
   res.send('List command sent.');
});

app.post('/ping', (req, res) => {
   console.log("Sending ping Command");
   zosc.sendZoomCommand('ping');
   res.send('Ping command sent.');
});

app.listen(port, () => {
   console.log(`Server is listening on port ${port}`);
 });

zosc.oscServer.on('message', function (msg, rinfo){
   console.log('Data:', msg);
   console.log('From:', rinfo);
   zosc.handleUpdate(msg);  
});

zosc.on("newUser",(user)=>{
   //Log the new user
   console.log("New user: " + zosc.printAllUsers());
});

zosc.oscServer.on('message', function(){
   // zosc.printAllUsers();
});

zosc.on("activeSpeaker", function() {
   // Add what you want to do when the activeSpeaker event is emitted here.
   console.log("Active speaker event has been emitted!");
});

//when User emits "mute", do something.
zosc.on('unmute', (zoomID)=>{
   // Add what you want to do when the activeSpeaker event is emitted here.
   console.log("Unmute event has been emitted:" + zosc.users[zoomID].toJSON());
});

zosc.on('mute', (zoomID)=>{
   // Add what you want to do when the activeSpeaker event is emitted here.
   console.log("Mute event has been emitted:" + zosc.users[zoomID].toJSON());
});

zosc.on("emojiChanged", function() {
   console.log("Emoji is: ");
});
// zosc.sendMeCommand("videoOn");