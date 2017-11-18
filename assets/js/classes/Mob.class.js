class Mob extends Entity
{
  constructor(x,y,angle,intim,imgsrc, speed,turnSpeed)
  {
    super(x,y,angle,intim,imgsrc);
    this.speed=speed;
    this.turnSpeed=turnSpeed;
    this.vel={x:0, y:0};
  }
  moveForward()
  {
    const mult=2;
  
    let xComp=Math.cos(this.angle);
    let yComp=Math.sin(this.angle);
    
    let dx=this.speed*xComp*mult;
    let dy=this.speed*yComp*mult;
    
    let newX=this.pos.x+dx;
    let newY=this.pos.y+dy;
    
    this.pos.x=Math.min(Math.max(0,newX),world.w);
    this.pos.y=Math.min(Math.max(0,newY),world.h);
  }
  turnDir(dir)
  {
    this.angle+=dir*this.turnSpeed;
    //modulo it
    let n=this.angle;
    let m=Math.PI*2;
    this.angle=(((n % m) + m) % m);
  }
  tick()
  {
  
  }
}
