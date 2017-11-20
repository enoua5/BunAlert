class World
{
  constructor(w, h)
  {
    this.w=w;
    this.h=h;
    
    this.entities={
      all:[],
        mobs:[],
          buns:[],
          watchers:[],
            player:null,
        hides:[]
    }
    
    //add in the hides
    //every element is half as common as the one before it
    var hideTypes=[Grass, Rock, Bush];
    for(let i=0; i<(w*h)/500000; i++)
    {
      let type=0;
      //        +1 because it's the next one that matters
      while(type+1<hideTypes.length && Math.random()<=0.5)
        type++;
      
      let con=hideTypes[type].prototype.constructor;
      let newEnt=new con(Math.random()*w,
                         Math.random()*h,
                         Math.random()*2*Math.PI
                        );
      
      this.entities.all.push(newEnt);
      this.entities.hides.push(newEnt);
    }
    
    //add in the entities
    var numBuns=(w*h)/1000000;
    for(let i=0; i<numBuns; i++)
    {
      let newBun=new Bun(Math.random()*w,
                         Math.random()*h,
                         Math.random()*2*Math.PI
                        );
      this.entities.all.push(newBun);
      this.entities.mobs.push(newBun);
      this.entities.buns.push(newBun);
    }
    
    var numWatch=(w*h)/(250000*5);
    for(let i=0; i<numWatch; i++)
    {
      let newWatch=new Watcher(Math.random()*w,
                               Math.random()*h,
                               Math.random()*2*Math.PI
                              );
      this.entities.all.push(newWatch);
      this.entities.mobs.push(newWatch);
      this.entities.watchers.push(newWatch);
    }
    this.entities.watchers[0].username="Okami-Wildclaw";
    this.entities.watchers[0].imgs=[revImages.us.wild, images.us.wild];
    this.entities.watchers[1].username="Enoua5";
    this.entities.watchers[1].imgs=[revImages.us.iota, images.us.iota];
    
    let newPlayer=new Player(w/2,h/2);
    this.entities.all.push(newPlayer);
    this.entities.mobs.push(newPlayer);
    this.entities.watchers.push(newPlayer);
    this.entities.player=newPlayer;
  }
}
