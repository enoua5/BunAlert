function main()
{
  for(let i=0; i<world.entities.mobs.length; i++)
    world.entities.mobs[i].tick();
  bunTracker.tick()
  drawScene();
}
function drawNine(/*variable arg length*/)
{
  var arguments=Array.from(arguments);
  var ctx=arguments.pop();
  arguments[1]-=world.w;
  arguments[2]-=world.h;
  for(let i=0; i<3; i++)
  {
    for(let j=0; j<3; j++)
    {
      ctx.drawImage(...arguments);
      arguments[1]+=world.w;
    }
    arguments[2]+=world.h;
    arguments[1]-=world.w*3;
  }
}
function stringNine(/*variable arg length*/)
{
  var arguments=Array.from(arguments);
  var ctx=arguments.pop();
  arguments[1]-=world.w;
  arguments[2]-=world.h;
  for(let i=0; i<3; i++)
  {
    for(let j=0; j<3; j++)
    {
      ctx.fillText(...arguments);
      arguments[1]+=world.w;
    }
    arguments[2]+=world.h;
    arguments[1]-=world.w*3;
  }
}
function drawScene()
{
  var canvas=document.getElementById("canvas")
  var ctx=canvas.getContext('2d');
  ctx.fillStyle="#d2b48c";
  ctx.fillRect(-parseInt(canvas.width),-parseInt(canvas.height),
    parseInt(canvas.width)*3,parseInt(canvas.height)*3);
  //PLEASE OH PLEASE OH PLEASE DON'T LET THIS BE FINAL
  ctx.save();
  ctx.scale(0.5,0.5);
  ctx.translate(-world.entities.player.pos.x+800,
     -world.entities.player.pos.y+400-(300/2)+200);
  //ctx.strokeStyle="#000000";
  //ctx.lineWidth=10;
  //ctx.strokeRect(0,0,world.w,world.h);
  /*
  for(let i=0; i<world.entities.all.length; i++)
  {
    let e=world.entities.all[i];
    if(e instanceof Bun)
    {
      //ctx.fillStyle="#d2b48c";
      //if(e.currentMood=="RUN"||(e.prevMood=="RUN" && e.currentMood=="HOP"))
      //  ctx.fillStyle="#ff0000";
      //if(e.currentMood=="WANDER"||(e.prevMood=="WANDER" && e.currentMood=="HOP"))
      //  ctx.fillStyle="#00FFFF";
      //if(e.currentMood=="SIT")
      //  ctx.fillStyle="#0000ff";
      //ctx.fillRect(e.pos.x, e.pos.y, 5*e.size, 5*e.size);
      let angleTo=-Math.atan2(Math.sin(e.angle-Math.PI/2), Math.cos(e.angle-Math.PI/2));
      let face=Math.sign(angleTo)>0?1:0;
      let bunImg=e.imgs[face][e.animFrame];
      let ratio=bunImg.width/bunImg.height;
      ctx.drawImage(bunImg,
        parseInt(e.pos.x)-((10*e.size*ratio)/2), parseInt(e.pos.y-(10*e.size)),
        10*e.size*ratio, 10*e.size);
      if(e.isRunning())
      {
        ctx.fillStyle="#ff0000";
        ctx.textBaseline="bottom";
        ctx.textAlign="center";
        ctx.font="60px xkcd";
        ctx.fillText('!', parseInt(e.pos.x), parseInt(e.pos.y-(10*e.size)))
      }
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
  */
  for(let i=0; i<world.entities.buns.length; i++)
  {
    let e=world.entities.buns[i];
    let angleTo=-Math.atan2(Math.sin(e.angle-Math.PI/2), Math.cos(e.angle-Math.PI/2));
    let face=Math.sign(angleTo)>0?1:0;
    let bunImg=e.imgs[face][e.animFrame];
    let ratio=bunImg.width/bunImg.height;
    drawNine(bunImg,
      parseInt(e.pos.x)-((10*e.size*ratio)/2), parseInt(e.pos.y-(10*e.size)),
      10*e.size*ratio, 10*e.size, ctx);
    if(e.isRunning())
    {
      ctx.fillStyle="#ff0000";
      ctx.textBaseline="bottom";
      ctx.textAlign="center";
      ctx.font="60px xkcd";
      let offset=10*e.size*(face?0.5:-0.5);
      stringNine('!', parseInt(e.pos.x)+offset, parseInt(e.pos.y-(10*e.size)), ctx)
    }
    else if(e.reported)
    {
      let offset=10*e.size*(face?0.5:-0.5);
      drawNine(images.heart, parseInt(e.pos.x)-8+offset, parseInt(e.pos.y-(10*e.size))-20, 16, 16, ctx)
    }
  }
  
  for(let i=0; i<world.entities.hides.length; i++)
  {
    let e=world.entities.hides[i];
    let angleTo=-Math.atan2(Math.sin(e.angle-Math.PI/2), Math.cos(e.angle-Math.PI/2));
    let face=Math.sign(angleTo)>0;
    let hideImgs=face?images.hides:revImages.hides;
    let img=new Image();
    if(e instanceof Bush)
      img=hideImgs.bush;
    else if(e instanceof Rock)
      img=hideImgs.rock;
    else if(e instanceof Grass)
      img=hideImgs.grass
    drawNine(img, e.pos.x, e.pos.y, 100, 100, ctx);
  }
  for(let i=0; i<world.entities.watchers.length; i++)
  {
    let e=world.entities.watchers[i];
    let cImg=new Image();
    if(!(e instanceof Player))
    {
      let angleTo=-Math.atan2(Math.sin(e.angle-Math.PI/2), Math.cos(e.angle-Math.PI/2));
      let face=Math.sign(angleTo)>0?1:0;
      
      cImg=e.imgs[face].stand;
      if(e.currentMood==e.Mood.STEP)
      {
        cImg=e.imgs[face].walk[e.animFrame];
      }
      else if(e.currentMood==e.Mood.SAD)
      {
        cImg=e.imgs[face].cry;
      }
    }
    else
      cImg=e.correctImg;
    drawNine(cImg, e.pos.x-(100/2), e.pos.y-150, 100, 200, ctx);
    
    if(e instanceof Player && e.currentMood==e.Mood.SAD)
    {
      ctx.fillStyle="#0000ff";
      ctx.textBaseline="bottom";
      ctx.textAlign="center";
      ctx.font="60px xkcd";
      ctx.fillText("You are too sad to continue on.",
        parseInt(e.pos.x), parseInt(e.pos.y)+200);
      ctx.fillText("You must wait for a bun to come and cheer you up.",
        parseInt(e.pos.x), parseInt(e.pos.y)+300);
    }
    if(e.currentMood==e.Mood.SQUEEL)
    {
      drawNine(images.heart, e.pos.x+21-(75/2), e.pos.y-35-150, 32, 32, ctx);
    }
  }
  ctx.restore();
}
