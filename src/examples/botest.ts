import Zosc from "../Zosc";	// import the class
import {Server,Client, ArgumentType} from 'node-osc';
import {EventEmitter }from "events";
import { User } from "../User";
import { UserCommands } from "../consts";

let zosc = new Zosc("10.10.80.21",9090,1234);	// create a new instance of the ZOSC class

console.log("App Started.");

zosc.on("newUser",(user)=>{
   //Log the new user
   console.log("New user") 
})

zosc.on("mute",(user)=>{
   console.log("User "+user.zoomID+" is now muted")
})

zosc.sendMeCommand("videoOn");

zosc.on("message",(message)=>{
      console.log(message);
   }
);

zosc.oscServer.on("message",(message)=>{
   console.log("Message Received: " + message);
   zosc.handleUpdate(message);
})