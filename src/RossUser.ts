const { Zosc } = require('../Zosc');
const { User } = require('../User');

class RossUser extends User {
    public lastSpoke: number = 0;
    public videoInput: number | null = null;
    public lastSwitch: number = 0;
    constructor(zosc:typeof Zosc,zoomID:number,userName:string) {
      super(zosc, zoomID, userName);
    }
}

export { RossUser };