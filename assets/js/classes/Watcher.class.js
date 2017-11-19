class Watcher extends Mob
{
  constructor(x,y,angle)
  {
    var intim=Random.randNormBetween(0, 100, 100, 10);
    var speed=Random.randNormBetween(0, 4, 2, 0.1);
    var turn=Random.randNormBetween(0, 1, 1/8, 0.01);
    
    super(x,y,angle,intim,[],speed,turn);
    
    this.viewDist=500;
    this.reportSpeed=1;
    
    this.happiness=20;
    this.popularity=0;
    
    this.target=null;
    
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
          if(dist<nearest.dist && !e.isRunning())
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
  getBunsInView() //returns the buns, their distances
  {
        let ret=[];
        let p1=this.pos
        for(let i=0; i<world.entities.buns.length; i++)
        {
          let e=world.entities.buns[i];
          let p2=e.pos;
          let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
          if(dist<this.viewDist)
            ret.push({bun:e, dist:dist});
        }
        
        return ret;
  }
  hear(report)
  {
    if(!this.moveOverride)
    {
      if(Math.random()<report.isKing?0.9:0.5)
      {
        this.target=report.loc;
        
        this.prevMood=this.currentMood;
        this.currentMood=this.Mood.RESPOND;
        this._moodDepth=100;
      }
    }
  }
  
  tick()
  {
    let moodTicks={
      WANDER:function(self)
      {
        if(Math.random()<0.1)
          self.turnDir(Random.randInt(-2,2));
        
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
        let p1=self.pos;
        let p2=self.target;
        let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
        if(dist<300)
        {
          self.target=null;
          
          self.prevMood=self.currentMood;
          self.currentMood=self.Mood.WANDER;
          self._moodDepth=50;
          return;
        }
        
        let dx=p2.x - p1.x;
        let dy=p2.y - p1.y;
        let absoluteAngle=Math.atan2(dy,dx);
        
        let a=self.angle;
        let b=absoluteAngle;
        let angleTo=-Math.atan2(Math.sin(a-b), Math.cos(a-b));
        
        self.turnDir(Math.sign(angleTo));
        
        self.enterStep();
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
        /*
        bun=bun.bun;
        self.happiness+=1/(bun.size*10)
        if(bun.beSeen(self.reportSpeed))
        {
          //CONGRATS! YOU REPORTED THE BUN!
          self.popularity+=1/(bun.size/10);
          let report=new BunReport(self, bun.pos, bun.isKingBun());
          bunTracker.pushReport(report);
        }
        */
        //SEE ALL THE BUNS!
        let seenBuns=self.getBunsInView();
        for(let i=0; i<seenBuns.length; i++)
        {
          let bun=seenBuns[i].bun;
          self.happiness+=1/(bun.size*10);
          if(bun.beSeen(self.reportSpeed))
          {
            //CONGRATS! YOU REPORTED THE BUN!
            self.popularity+=1/(bun.size/10);
            let report=new BunReport(self, bun.pos, bun.isKingBun());
            bunTracker.pushReport(report);
          }
        }
      },
      STEP:function(self)
      {
        self.moveForward();
        self.animTimer--;
        if(self.animTimer<=0)
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
    
    if(this.getBunsInView().length==0)
      this.happiness-=0.01;
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
    
    if(this.moveOverride)
    {
      document.getElementById("coord").innerText=parseInt(this.pos.x)+", "
        +parseInt(this.pos.y);
      document.getElementById("hap").innerText=parseInt(this.happiness);
      document.getElementById("pop").innerText=parseInt(this.popularity);
      if(key[38]||key[87])//up
      {
        this.angle=3*(Math.PI/2);
        this.moveForward(true);
      }
      if(key[40]||key[83])//down
      {
        this.angle=Math.PI/2;
        this.moveForward(true);
      }
      if(key[37]||key[65])//left
      {
        this.angle=Math.PI;
        this.moveForward(true);
      }
      if(key[39]||key[68])//up
      {
        this.angle=0;
        this.moveForward(true);
      }
    }
  }
}
