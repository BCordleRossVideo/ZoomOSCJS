import Zosc from "../Zosc";	// import the class
let zosc = new Zosc("10.10.80.21",9090,1234);	// create a new instance of the ZOSC class
//const Breakoutrooms = [1,2,3,4,5,6]
//zosc.joinMeetingwithID("892722325988");	// join a meeting with ID 123


zosc.on("mute",(user)=>{
   //move User to Breakoutroom By Emoji
   console.log("Muted");
})




   

