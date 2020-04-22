import Base from "../Base.js"

export default class RectangleComponent extends Base.Component{
    width;
    height;
    fill;
    stroke;
    constructor(width, height, fill, stroke){
        super();
        this.width = width;
        this.height = height;
        this.fill = fill;
        this.stroke = stroke;
    }
    draw(ctx){
        ctx.save();
        ctx.translate(-this.width/2, -this.height/2);
        ctx.fillStyle = this.fill;
        ctx.strokeStyle = this.stroke;
        ctx.fillRect(0,0, this.width, this.height);
        ctx.strokeRect(0, 0, this.width, this.height);
        ctx.restore();
    }
    update(){

    }
}