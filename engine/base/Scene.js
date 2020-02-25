import NameableParent from "./NamableParent.js"

export default class Scene extends NameableParent{
    
    constructor(name){
        super(name);
        
    }
    draw(ctx, width, height){
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,width, height)
        
        this.children.filter(i=>i.draw).forEach(i=>i.draw(ctx));

    }
    update(){
        this.children.filter(i=>i.update).forEach(i=>i.update());
    }

    pulse() {
        this.children.filter(i=>i.pulse).forEach(i=>i.pulse());
    }
}