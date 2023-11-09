class Borders{ 
constructor(){
    const canvas=document.getElementById("canvas");

    const m = canvas.width/2;
    const w = canvas.width;
    const h = canvas.height;

    this.a1 = {x:0.6*w,y:0};
    this.a2 = {x:0.6*w,y:0.7*h};
    this.b1 = {x:0.8*w,y:0.3*h};
    this.b2 = {x:0.8*w,y:h};
    this.c1 = {x:0,y:0.3*h};
    this.c2 = {x:0.4*w,y:0.3*h};
    this.d1 = {x:0.6*w,y:0.7*h};
    this.d2 = {x:0.2*w,y:0.7*h};
    this.e1 = {x:0,y:0};
    this.e2 = {x:0,y:h};
    this.e3 = {x:w,y:h};
    this.e4 = {x:w,y:0};
    this.borders = [[this.a1,this.a2],
                    [this.b1,this.b2],
                    [this.c1,this.c2],
                    [this.d1,this.d2],
                    [this.e1,this.e2],
                    [this.e2,this.e3],
                    [this.e3,this.e4],
                    [this.e4,this.e1]];
                    // [this.bottomLeft,this.bottomRight],
                    // [this.topLeft,this.topRight]];
}

draw(ctx){

this.borders.forEach(border=>{
    ctx.beginPath();
    ctx.lineWidth=5;
    ctx.strokeStyle = '#333333';
    ctx.moveTo(border[0].x,border[0].y);
    ctx.lineTo(border[1].x,border[1].y);
    ctx.stroke();
    ctx.lineWidth=3;
})
}
}