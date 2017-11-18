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
    //TODO
  }
  turnDir(dir)
  {
    this.angle+=dir*this.turnSpeed;
  }
  tick()
  {
  
  }
}
