class Circle {
    radius;
    fill;
    stroke;
    x;
    y;
    goalRadius;
    smallRadius;
    largeRadius
    constructor(x, y, radius, fill, stroke) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.largeRadius = radius;
        this.smallRadius = 0.9 * this.largeRadius;
        this.fill = fill;
        this.stroke = stroke;
        this.goalRadius = radius;
    }
    draw(ctx) {
        if (this.goalRadius > this.radius){
            this.radius += 5;
        }
        else if (this.goalRadius < this.radius){
            this.radius -= 5;
        }
        if (this.radius == this.largeRadius){
            this.fill = "white";
        }
        ctx.save();
        {
            ctx.translate(this.x, this.y);
            ctx.fillStyle = this.fill;
            ctx.strokeStyle = this.stroke;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
    }
    update() { }
}

export default Circle;