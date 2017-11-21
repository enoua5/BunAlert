class Player extends Watcher
{
  constructor(x,y)
  {
    super(x,y, 0);
    this.imgs=[revImages.player, images.player];
    this.moveOverride=true;
    this.username="You";
    this.correctImg=new Image();
    this.sAnimFrame=0;
  }
  extraStuff()
  {
    let e=this;
    let angleTo=-Math.atan2(Math.sin(e.angle-Math.PI/2), Math.cos(e.angle-Math.PI/2));
    let face=Math.sign(angleTo)>0?1:0;
    
    document.getElementById("coord").innerText=parseInt(this.pos.x)+", "
      +parseInt(this.pos.y);
    document.getElementById("hap").innerText=parseInt(this.happiness);
    document.getElementById("pop").innerText=parseInt(this.popularity);
    if(this.happiness>0)
    {
      let moved=false;
      if(window.mousepos==null)
      {
        if(key[38]||key[87])//up
        {
          this.angle=3*(Math.PI/2);
          this.moveForward(true);
          moved=true;
        }
        if(key[40]||key[83])//down
        {
          this.angle=Math.PI/2;
          this.moveForward(true);
          moved=true;
        }
        if(key[37]||key[65])//left
        {
          this.angle=Math.PI;
          this.moveForward(true);
          moved=true;
        }
        if(key[39]||key[68])//right
        {
          this.angle=0;
          this.moveForward(true);
          moved=true;
        }
      }
      else if(window.mousedown)
      {
        let c=document.getElementById("canvas");
        let p1={x:c.width/2, y:c.height/2}; //player pos on screen
        let p2=window.mousepos;
        
        let dx=p2.x-p1.x;
        let dy=p2.y-p1.y;
        let absoluteAngle=Math.atan2(dy,dx);
        this.angle=absoluteAngle;
        
        this.moveForward(true);
        
        moved=true;
      }
      if(moved)
      {
        this.sAnimFrame+=2/5;
        if(this.sAnimFrame>=this.imgs[face].walk.length)
          this.sAnimFrame=0;
        this.correctImg=this.imgs[face].walk[Math.floor(this.sAnimFrame)];
      }
      else
      {
        this.correctImg=this.imgs[face].stand;
        this.sAnimFrame=0;
      }
    }
    else
    {
      this.correctImg=this.imgs[face].cry;
      this.sAnimFrame=0;
    }
  }
}
