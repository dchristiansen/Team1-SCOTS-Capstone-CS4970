let inputInstance = new class Input{

    //---------------------------------------------------
    //Key handling members
    //---------------------------------------------------
    keys = []; //What is the current state of each key?

    down = [];   //Did the key go down this frame?
    up = [];     //Did the key do up this frame?

    //When we start an update(), we shift to these arrays so we don't have mutating arrays mid-update
    frameDown = [];  
    frameUp = [];


    //---------------------------------------------------
    //Mouse handling members
    //---------------------------------------------------


    mouseButtons = []; //What is the current State of the each button?

    mouseButtonsDown = []; //Did the mouse button go down this frame?
    mouseButtonsUp = [];     //Did the mouse button go up this frame?
    
    //When we start an update(), we shift these arrays so we don't have mutating arrays mid-update
    frameMouseButtonsDown = [];  
    frameMouseButtonsUp = [];
    
    touch = false;
    touchdown = false;
    touchup = false;
    frametouchdown = false;
    frametouchup = false;
    
    swapUpDownArrays(){
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
    getKeyUp(key){
        return this.frameUp[key];
    }

    //Did the key go down the frame? [Remember, the OS may make it look like key repeated when they did not]
    getKeyDown(key){
        return this.frameDown[key];
    }

    //Is the key pressed? Down (true) Up (false)
    getKey(key){
        return this.keys[key];
    }

    //---------------------------------------------------
    //Mouse handling functions
    //---------------------------------------------------


    //Did the mouse button come up this frame?
    getMouseButtonUp(button){
        return this.frameMouseButtonsUp[button];
    }

    //Did the mouse button go down this frame?
    getMouseButtonDown(button){
        return this.frameMouseButtonsDown[button];
    }

    //Is the mouse button pressed? Down (true) Up (false)
    getMouseButton(button){
        return this.mouseButtons[button];
    }

    
}

export default inputInstance;