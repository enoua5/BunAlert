var images={
  bun:[],
  heart:new Image(),
  hides:{
    grass:new Image(),
    bush:new Image(),
    rock:new Image()
  },
  watchers:[],
  player:{
    profile: new Image(),
    stand: new Image(),
    cry: new Image(),
    walk: []
  }
}
var revImages={
  bun:[],
  hides:{
    grass:new Image(),
    bush:new Image(),
    rock:new Image()
  },
  watchers:[],
  player:{
    stand: new Image(),
    cry: new Image(),
    walk: []
  }
}
function loadImages()
{
  for(let i=0; i<4; i++)
  {
    images.bun.push(new Image());
    images.bun[i].src="assets/img/bun/bun"+(i+1)+".svg";
    revImages.bun.push(new Image());
    revImages.bun[i].src="assets/img/bun/bun"+(i+1)+".rev.svg";
  }
  
  let names=["cueball","megan","ponytail"];
  for(let i=0; i<names.length; i++)
  {
    let imgMap={
      profile: new Image(),
      stand: new Image(),
      cry: new Image(),
      walk: []
    };
    let folder="assets/img/watcher/"+names[i]+"/";
    imgMap.stand.src=folder+"stand.svg";
    imgMap.cry.src=folder+"cry.svg";
    imgMap.profile.src=folder+"profile.png";
    
    for(let j=0; j<8; j++)
    {
      imgMap.walk.push(new Image());
      imgMap.walk[j].src=folder+(j+1)+".svg";
    }
    
    this.images.watchers.push(imgMap);
    
    let rimgMap={
      stand: new Image(),
      cry: new Image(),
      walk: []
    };
    rimgMap.stand.src=folder+"stand.rev.svg";
    rimgMap.cry.src=folder+"cry.rev.svg";
    
    for(let j=0; j<8; j++)
    {
      rimgMap.walk.push(new Image());
      rimgMap.walk[j].src=folder+(j+1)+".rev.svg";
    }
    
    this.revImages.watchers.push(rimgMap);
  }
  images.player.profile.src="assets/img/watcher/beret/profile.png";
  images.player.stand.src="assets/img/watcher/beret/stand.svg";
  images.player.cry.src="assets/img/watcher/beret/cry.svg";
  revImages.player.stand.src="assets/img/watcher/beret/stand.rev.svg";
  revImages.player.cry.src="assets/img/watcher/beret/cry.rev.svg";
  for(let j=0; j<8; j++)
  {
    images.player.walk.push(new Image());
    images.player.walk[j].src="assets/img/watcher/beret/"+(j+1)+".svg";
    revImages.player.walk.push(new Image());
    revImages.player.walk[j].src="assets/img/watcher/beret/"+(j+1)+".rev.svg";
  }
  
  images.heart.src="assets/img/heart.png";
  images.hides.grass.src="assets/img/grass.svg";
  images.hides.bush.src="assets/img/bush.svg";
  images.hides.rock.src="assets/img/rock.svg";
  revImages.hides.grass.src="assets/img/grass.rev.svg";
  revImages.hides.bush.src="assets/img/bush.rev.svg";
  revImages.hides.rock.src="assets/img/rock.rev.svg";
}
