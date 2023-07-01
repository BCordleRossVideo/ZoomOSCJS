//use axios to amke a request to the vmix api 3 times a seccond and convert it to json with xml-js
const axios = require('axios');
const convert = require('xml-js');
const threshold = 0.2;
const host = "http://10.32.3.66:8088/"
let last = [0,0];
let lastSpoke = [new Date(),new Date()]
let potentiallastSpoke = [new Date(),new Date()]
let alstspokethreshol = 5000;
let lastswitch =  new Date();
let delay = 0;
setInterval(() => {
    axios.get(host +'api')
    .then(function (response) {
        let json = JSON.parse(convert.xml2json(response.data, { compact: true, spaces: 4 }));
        jonas = json["vmix"]["inputs"]["input"][0]["_attributes"]["meterF1"];
        chirag = json["vmix"]["inputs"]["input"][1]["_attributes"]["meterF1"];
        //check if volume increased for jonas more then 0.01 since last 
        let jonasspeaking = false;
        let chiragspeaking = false;
        //detect if volume of chirag is still above thredshold 
        if (chirag > threshold) {
           
            lastSpoke[1] = new Date();
        }
        //detect if volume of chirag is still above thredshold 
        if (jonas > threshold) {
            lastSpoke[0] = new Date();

        }
        //check if jonas spoke is more then 0.5 away and less then  threshold away 
        jonasspeaking= new Date() - lastSpoke[0] > alstspokethreshol;
        //check if chirag spoke in the last 3 seconds
        chiragspeaking= new Date() - lastSpoke[1] > alstspokethreshol;

        if (jonasspeaking && !chiragspeaking ) {
            cut(5);
        }else
        //check if chirag startesspeaking and jonas didnt and is not speaking
        if (chiragspeaking && !jonasspeaking ) {
            cut(4)
           
        }else 
        //check if bot started speaking or are speaking 
        if ( jonasspeaking && chiragspeaking || !jonasspeaking && !chiragspeaking) {
            console.log("cut to both")
            cut(3)
        }
            })
},300)



function cut(id){
    //cut to the input with id trough vmix api 
    if(new Date() - lastswitch > delay){
    let url = ""
    axios.get(host +"api/?Function=CutDirect&Input=" + id)
    lastswitch = new Date();
    delay = 1000;
    }
}