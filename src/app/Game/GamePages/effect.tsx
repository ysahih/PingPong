
function randon(min : number , max : number)
 {
    return Math.round(Math.random() * (max - min)) + min;
 }


function pushEffect(myEffect : Effect[]  ,  numbertoadd : number   ,x : number , y : number , colormode : number)
{    
    for (let i = 0 ; i  < numbertoadd  && myEffect.length < 50 ; i++)
    {
        myEffect.push(new Effect(x , y , colormode));
    }
}


function pushColition(myEffect : Effect[]  ,  numbertoadd : number   ,x : number , y : number , colormode : number)
{    
    for (let i = 0 ; i  < numbertoadd  && myEffect.length < 50 ; i++)
    {
        myEffect.push(new Effect(x , y , colormode));
    }
} 


function PopColition( myEffect : ColitionEffect[])
{
    for (let i = 0 ; myEffect.length > 0 ; i++)
    {
        myEffect.pop();
    }
}


export  class Effect 
{
    x : number;
    y : number;
    radius : number;
    color : number;
    colormode : number;
    constructor(x : number , y : number , colormode : number)
    {
        this.x = x;
        this.y = y;
        this.x += randon(-1,1);
        this.y += randon(-1,1);
        this.radius = 3.5;
        this.colormode = colormode;
        if (colormode == 0)
            this.color = randon(180 , 220)
        else
        this.color = randon(0 , 55)
    }
    draw(ctx : CanvasRenderingContext2D)
    {
        ctx.beginPath();
        ctx.arc(this.x , this.y , this.radius , 0 , Math.PI * 2);
        ctx.fillStyle = `hsla(${this.color}, 100%, 55%, .5)`;
        ctx.fill();
        ctx.shadowColor = `hsla(${this.color}, 100%, 55%, .5)`;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.shadowColor = 'transparent'; 
        ctx.shadowBlur = 0;
        ctx.closePath();
    }

    reset (x : number , y : number)
    {
        this.x = x;
        this.y = y;
        this.x += randon(-1,1);
        this.y += randon(-1,1);
        this.radius = 4.5;
        if (this.colormode == 0)
            this.color = randon(180 , 220)
        else
        this.color = randon(0 , 55)
    }

    update(ballx : number , bally : number , colormode : number , shouldRotate : boolean)
    {
        if (this.radius <= 0)
            this.reset(ballx , bally);
        if (this.radius> 0.3)
        this.radius -= 0.5;
        if (shouldRotate == false)
        this.y += -2;
        else
        this.x += 2;
        this.colormode = colormode;
    }
}


export class ColitionEffect
{
    x : number;
    y : number;
    radius : number;
    color : number;
    colormode : number;
    lineWith : number;
    constructor(x : number , y : number , colormode : number)
    {
        this.x = x;
        this.y = y;
        this.x += randon(-1,1);
        this.y += randon(-1,1);
        this.radius = 20;
        
        this.colormode = colormode;
        this.lineWith = 4;
        if (colormode == 0)
            this.color = randon(0 , 55)
        else
            this.color = randon(180 , 220)
    }
    draw(ctx : CanvasRenderingContext2D)
    {
        ctx.beginPath();
        ctx.fillStyle = `hsla(${this.color}, 100%, 55%, .5)`;
        ctx.strokeStyle = ctx.strokeStyle = `hsla(${this.color}, 100%, 55%, .5)`;; // Set stroke color
        ctx.lineWidth = this.lineWith ; // Set stroke width
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fill();
        ctx.shadowColor = `hsla(${this.color}, 100%, 55%, .5)`;
        ctx.shadowBlur = 80;
        ctx.fill();
        ctx.shadowColor = 'transparent'; 
        ctx.shadowBlur = 0;
        ctx.closePath();
    }

    update( ballx : number , bally : number , colormode : number)
    {
        this.y = bally;
        this.x = ballx;
        this.colormode = colormode;
        if (colormode == 0)
            this.color = randon(0 , 55)
        else
            this.color = randon(180 , 220)
    }
}

