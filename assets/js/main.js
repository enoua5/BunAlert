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
  ctx.fillStyle="#ffffff";
  ctx.fillRect(0,0,parseInt(canvas.width),parseInt(canvas.height));
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
        ctx.fillStyle="#0000ff"
    }
    else if(e instanceof Watcher)
      ctx.fillStyle="#000000";
    else if(e instanceof Bush)
      ctx.fillStyle="#00ff00";
    else if(e instanceof Rock)
      ctx.fillStyle="#808080";
    else if(e instanceof Grass)
      ctx.fillStyle="#ffff00";
    ctx.fillRect(e.pos.x, e.pos.y, 10, 10);
  }
}
