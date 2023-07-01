import Zosc from "../Zosc";    // import the class
const Rosstalk = require("../Rosstalk");    // import the class
let zosc = new Zosc("10.10.80.21", 9090, 1234);    // create a new instance of the ZOSC class

console.log("App Started.");

var switcher = new Rosstalk({
    host: '10.10.80.51' // switcher ip
});

switcher.connect();

switcher.trans('ME:PP'); // transition to program