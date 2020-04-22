export default class Input{

    //---------------------------------------------------
    //Key handling members
    //---------------------------------------------------
    static keys = []; //What is the current state of each key?

    static down = [];   //Did the key go down this frame?
    static up = [];     //Did the key do up this frame?

    //When we start an update(), we shift to these arrays so we don't have mutating arrays mid-update
    static frameDown = [];  
    static frameUp = [];


    //---------------------------------------------------
    //Mouse handling members
    //---------------------------------------------------


    static mouseButtons = []; //What is the current State of the each button?

    static mouseButtonsDown = []; //Did the mouse button go down this frame?
    static mouseButtonsUp = [];     //Did the mouse button go up this frame?
    
    //When we start an update(), we shift these arrays so we don't have mutating arrays mid-update
    static frameMouseButtonsDown = [];  
    static frameMouseButtonsUp = [];
    
    static touch = false;
    static touchdown = false;
    static touchup = false;
    static frametouchdown = false;
    static frametouchup = false;
    
    static swapUpDownArrays(){
        this.frameDown = this.down;
        this.frameUp = this.up;
        this.down = [];
        this.up = [];

        this.frameMouseButtonsDown = this.mouseButtonsDown;
        this.frameMouseButtonsUp = this.mouseButtonsUp;
        this.mouseButtonsDown = [];
        this.mouseButtonsUp = [];

        this.frametouchdown = this.touchdown;
        this.frametouchup = this.touchup;
        this.touchdown = false;
        this.touchup = false;
    }

    //---------------------------------------------------
    //Key handling functions
    //---------------------------------------------------

    //Did the key come up this frame?
    static getKeyUp(key){
        return this.frameUp[key];
    }

    //Did the key go down the frame? [Remember, the OS may make it look like key repeated when they did not]
    static getKeyDown(key){
        return this.frameDown[key];
    }

    //Is the key pressed? Down (true) Up (false)
    static getKey(key){
        return this.keys[key];
    }

    //---------------------------------------------------
    //Mouse handling functions
    //---------------------------------------------------


    //Did the mouse button come up this frame?
    static getMouseButtonUp(button){
        return this.frameMouseButtonsUp[button];
    }

    //Did the mouse button go down this frame?
    static getMouseButtonDown(button){
        return this.frameMouseButtonsDown[button];
    }

    //Is the mouse button pressed? Down (true) Up (false)
    static getMouseButton(button){
        return this.mouseButtons[button];
    }

    
}