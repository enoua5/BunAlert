function main()
{
  for(let i=0; i<world.entities.mobs.length; i++)
    world.entities.mobs[i].tick();
  bunTracker.tick()
  drawScene();
}
function drawScene()
{
  var canvas=document.getElementById("canvas")
  var ctx=canvas.getContext('2d');
  ctx.fillStyle="#d2b48c";
  ctx.fillRect(0,0,parseInt(canvas.width),parseInt(canvas.height));
  //PLEASE OH PLEASE OH PLEASE DON'T LET THIS BE FINAL
  ctx.save();
  ctx.scale(0.5,0.5);
  ctx.translate(-world.entities.player.pos.x+800,
     -world.entities.player.pos.y+400-(300/2)+200);
  for(let i=0; i<world.entities.all.length; i++)
  {
    let e=world.entities.all[i];
    if(e instanceof Bun)
    {
      ctx.fillStyle="#d2b48c";
      if(e.currentMood=="RUN"||(e.prevMood=="RUN" && e.currentMood=="HOP"))
        ctx.fillStyle="#ff0000";
      if(e.currentMood=="WANDER"||(e.prevMood=="WANDER" && e.currentMood=="HOP"))
        ctx.fillStyle="#00FFFF";
      if(e.currentMood=="SIT")
        ctx.fillStyle="#0000ff";
      //ctx.fillRect(e.pos.x, e.pos.y, 5*e.size, 5*e.size);
      let angleTo=-Math.atan2(Math.sin(e.angle-Math.PI/2), Math.cos(e.angle-Math.PI/2));
      let face=Math.sign(angleTo)>0?1:0;
      let bunImg=e.imgs[face][e.animFrame];
      let ratio=bunImg.width/bunImg.height;
      ctx.drawImage(bunImg,
        parseInt(e.pos.x), parseInt(e.pos.y),
        10*e.size*ratio, 10*e.size);
      continue;
    }
    else if(e instanceof Watcher)
    {
      ctx.fillStyle="#000000";
      if(e instanceof Player)
      {
        ctx.fillStyle="#800000";
      }
      ctx.fillRect(e.pos.x-(75/2), e.pos.y-150, 75, 150);
      if(e.currentMood=="SQUEEL")
      {
        ctx.drawImage(images.heart, e.pos.x+21-(75/2), e.pos.y-35-150, 32, 32);
      }
      continue;
    }
    else if(e instanceof Bush)
      ctx.fillStyle="#00ff00";
    else if(e instanceof Rock)
      ctx.fillStyle="#808080";
    else if(e instanceof Grass)
      ctx.fillStyle="#ffff00";
    ctx.fillRect(e.pos.x, e.pos.y, 50, 50);
  }
  ctx.restore();
}
