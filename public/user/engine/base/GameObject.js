import NameableParent from "./NamableParent.js"

export default class GameObject extends NameableParent {
    constructor(x = 0, y = 0, scaleX = 1, scaleY = 1, rotation = 0) {
        super();
        [this.x, this.y, this.scaleX, this.scaleY, this.rotation] = [x, y, scaleX, scaleY, rotation];
        this.components = [];
    }
    addComponent(component) {
        this.components.push(component);
        component.gameObject = this;
        if(component.start)
            component.start();
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scaleX, this.scaleY);
        ctx.rotate(this.rotation);

        this.components.filter(i => i.draw).forEach(i => i.draw(ctx));

        //Now draw all the children
        this.children.filter(i=>i.draw).forEach(i => i.draw(ctx))

        ctx.restore();
    }
    update() {
        this.components.filter(i => i.update).forEach(i => i.update());

        //Now update all the children
        this.children.filter(i=>i.update).forEach(i => i.update());
    }
    getComponent(type) {
        let component = this.components.find(i => i instanceof type);
        if (component) return component;
        throw "Error, couldn't find type " + type;
    }
    pulse() {
        this.components.filter(i=>i.pulse).forEach(i=>i.pulse());
        this.children.filter(i=>i.pulse).forEach(i=>i.pulse());
    }
}