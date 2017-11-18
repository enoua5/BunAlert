class Watcher extends Mob
{
  constructor(x,y,angle)
  {
    var intim=Random.randNormBetween(0, 100, 100, 10);
    var speed=Random.randNormBetween(0, 1, 0.5, 0.1);
    var turn=Random.randNormBetween(0, 1, 1/8, 0.01);
    
    super(x,y,angle,intim,[],speed,turn);
    
    this.viewDist=500;
    this.reportSpeed=1;
    
    this.username=Random.randSelect(
      [
        "TrashBun",
        "Bunologist",
        "Bunfeasible",
        "LeBun",
        "CinnamonBun",
        
        "ViolinRabbit",
        "RabbitWorship",
        "QuantumRabbit",
        "RabbitMagic",
        "RabbitLover",
        
        "Lagolas",
        "LagoLag",
        "LagoBun",
        "Lagomorph_irl",
        
        "Bunnies_R_Us",
        "BunnyLove",
        
        "TheFluffyOne",
        "LeFloof",
        "Hopz",
        "ThatBunThing",
        "JustMeAndMyBun",
        
        "guest user #"
      ]
    )+Random.randInt(1,9999);
    
    this.Mood={
      WANDER: "WANDER",
      RESPOND: "RESPOND",
      SQUEEL: "SQUEEL",
      STEP: "STEP" //sub-mood
    }
    this.currentMood=this.Mood.WANDER;
    this.prevMood=this.Mood.WANDER;
    //once this hits 0, it switches moods
    //max value is 100
    this._moodDepth=10;
  }
  //TODO: make all the AI for a bun watcher
  enterStep()
  {
    this.animTimer=100;
    this.prevMood=this.currentMood;
    this.currentMood=this.Mood.STEP;
    //DO NOT UPDATE MOOD DEPTH, WE ARE JUST RETURNING
  }
  getClosestBun() //returns the bun, its distance/*, and the angle to it*/
  {
        let nearest={dist: Infinity, pos: {x:Infinity,y:Infinity}};
        let theBun=null;
        let p1=this.pos
        for(let i=0; i<world.entities.buns.length; i++)
        {
          let e=world.entities.buns[i];
          let p2=e.pos;
          let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
          //TODO make this cleaner
          if(dist<nearest.dist && !(e.currentMood==e.Mood.RUN||(e.prevMood==e.Mood.RUN&&e.currentMood==e.Mood.HOP)))
          {
            nearest={dist:dist, pos:p2};
            theBun=e;
          }
        }
        
        //let dx=nearest.pos.x - self.pos.x;
        //let dy=nearest.pos.y - self.pos.y;
        //let absoluteAngle=Math.atan2(dy,dx);
        
        //let a=self.angle;
        //let b=absoluteAngle;
        //let angleTo=-Math.atan2(Math.sin(a-b), Math.cos(a-b));
        
        return {bun: theBun, dist: nearest.dist/*, angleTo: angleTo*/};
  }
  
  tick()
  {
    let moodTicks={
      WANDER:function(self)
      {
        if(Math.random()<0.1)
          self.turnDir(Random.randInt(-1,1));
        
        self.enterStep();
        
        if(self.getClosestBun().dist<self.viewDist)
        {
          self.prevMood=self.currentMood;
          self.currentMood=self.Mood.SQUEEL;
          self._moodDepth=100;
        }
      },
      RESPOND:function(self)
      {
      
      },
      SQUEEL:function(self)
      {
        let bun=self.getClosestBun();
        if(bun.dist>=self.viewDist)
        {
          self.prevMood=self.currentMood;
          self.currentMood=self.Mood.WANDER;
          self.turnDir(Random.randInt(-2,2));
          self._moodDepth=50;
          return;
        }
        bun=bun.bun;
        if(bun.beSeen(self.reportSpeed))
        {
          //CONGRATS! YOU REPORTED THE BUN!
          let report=new BunReport(self.username, bun.pos);
          bunTracker.pushReport(report);
        }
      },
      STEP:function(self)
      {
        self.moveForward();
        self.animTimer--;
        if(self.animTime<=0)
        {
          self.animTimer=100;
          self.animFrame++;
          if(self.animFrame>=self.imgs.length)
          {
            self.animFrame=0;
            self.animTimer=Infinity;
            self.currentMood=self.prevMood;
            self.prevMood=self.Mood.STEP;
            //DO NOT UPDATE MOOD DEPTH, WE ARE JUST RETURNING
          }
        }
      }
    }
    
    switch(this.currentMood)
    {
      case this.Mood.WANDER:
        moodTicks.WANDER(this);
        break;
      case this.Mood.RESPOND:
        moodTicks.RESPOND(this);
        break;
      case this.Mood.SQUEEL:
        moodTicks.SQUEEL(this);
        break;
      case this.Mood.STEP:
        moodTicks.STEP(this);
        break;
      default:
        console.warn("Watcher in unrecongnized state \""+this.currentMood+"\"");
    }
  }
}
