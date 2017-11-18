class World
{
  constructor(w, h)
  {
    this.entities=[];
    this.mobs=[];//will contain refs to entities
    this.hides=[];//will contain refs to entities
    
    //add in the hides
    //every element is half as common as the one before it
    var hideTypes=[Grass, Rock, Bush];
    for(let i=0; i<(w*h)/25000; i++)
    {
      let type=0;
      //        +1 because it's the next one that matters
      while(type+1<hideTypes.length && Math.random()<=0.5)
        type++;
      
      let con=hideTypes[type].prototype.constructor
      let newEnt=new con(Math.random()*w,
                         Math.random()*h,
                         Math.random()*2*Math.PI
                        );
      
      this.entities.push(newEnt);
      this.hides.push(newEnt);
    }
    
    //add in the entities
    var entTypes=[]
  }
}
