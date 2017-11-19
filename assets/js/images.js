var images={
  bun:[],
  heart:null
}
var revImages={
  bun:[]
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
  images.heart=new Image();
  images.heart.src="assets/img/heart.png";
}
