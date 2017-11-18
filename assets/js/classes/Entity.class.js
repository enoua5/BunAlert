class Entity
{
  constructor(x, y, angle, intim, imgs)
  {
    this.pos={x:x, y:y};
    this.angle=angle;
    //on a scale from -100 - 100, how scary is it?
    this.intim=intim;
    this.imgs=imgs;
    
    this.animFrame=0;
    this.animTimer=Infinity;
  }
}
