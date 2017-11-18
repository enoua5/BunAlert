class Bun extends Mob
{
  constructor(x,y,angle)
  {
    size=Random.randNormBetween(1, 20, 10, 4);
    
    var speed=(size/10)**-1
    var turn=speed/4
    
    super(x,y,angle,0,[], speed,turn);
    this.size=size;
    
    //TODO set to true when reported, false when not seen
    this.seen=false;
    
    this.Mood={
      SIT: "SIT",
      RUN: "RUN",
      //HIDE: "HIDE", //covered by run
      GROUP_UP: "GROUP_UP",
      APPROACH: "APPROACH",
      WANDER: "WANDER",
      HOP: "HOP" //sub-mood
    };
    this.currentMood=this.Mood.SIT;
    this.prevMood=this.Mood.SIT;
    //once this hits 0, it switches moods
    //max value is 100
    this._moodDepth=10;
  }
  getIntimidation(world)
  {
    let p1=this.pos;
    const distStretch=10;
    
    let totalIntim=0;
    for(let i=0; i<world.entities.length; i++)
    {
      let e=world.entities[i];
      let p2=e.pos;
      let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2)/distStretch;
      
      let baseIntim=e.intim;
      
      baseIntim+=(this.isKingBun()*baseIntim); //king buns are twice as timid
      
      let normalized=baseIntim/(dist**2); //inverse square
      
      totalIntim+=normalized;
    }
    return totalIntim;
  }
  isKingBun()
  {
    return this.size<5;
  }
  
  checkIntimAndRun()
  {
    let intimidation=this.getIntimidation();
    if(intimidation>50)
    {
      this.prevMood=this.currentMood;
      this.currentMood=this.Mood.RUN;
      this._moodDepth=Math.min(100, intimidation);
      return;
    }
  }
  
  tick()
  {
    let moodTicks={
      SIT:function()
      {
        this.checkIntimAndRun();
        
        if(Math.random()<0.025)
          this._moodDepth--;
        
        if(this._moodDepth<=0)
        {
          this.prevMood=this.currentMood;
          this.currentMood=this.Mood.Wander;
          this._moodDepth=50;
        }
      },
      RUN:function()
      {
        let intimidation=this.getIntimidation();
        if(intimidation<=0)
        {
          this.prevMood=this.currentMood;
          this.currentMood=this.Mood.SIT;
          this._moodDepth=50;
          return;
        }
        //TODO find direction that has the least scary
        //this.turnDir(the less scary way)
        this.animTimer=100;
        this.prevMood=this.currentMood;
        this.currentMood=this.Mood.HOP;
        //DO NOT UPDATE MOOD DEPTH, WE WANT TO RETURN HERE
      },
      GROUP_UP:function()
      {
        this.checkIntimAndRun();
        //TODO find the nearest bun and approach
      },
      APPROACH:function()
      {
        this.checkIntimAndRun();
        //TODO find the nearest human and approach 
      },
      WANDER:function()
      {
        this.checkIntimAndRun();
        
        this.turnDir(Random.randSelect([-1,1]));
        
        if(Math.random()<0.2)
        {
          this.animTimer=100;
          this.prevMood=this.currentMood;
          this.currentMood=this.Mood.HOP;
          //DO NOT UPDATE MOOD DEPTH, WE WANT TO RETURN HERE
        }
        
        this._moodDepth--;
        if(this._moodDepth<=0)
        {
          if(Math.random()<0.5)
          {
            this.prevMood=this.currentMood;
            this.currentMood=this.Mood.SIT;
            this._moodDepth=50;
            return;
          }
          else if(Math.random()<0.8)
          {
            this.prevMood=this.currentMood;
            this.currentMood=this.Mood.GROUP_UP;
            this._moodDepth=50;
            return;
          }
          else
          {
            this.prevMood=this.currentMood;
            this.currentMood=this.Mood.APPROACH;
            this._moodDepth=50;
            return;
            
          }
        }
      },
      HOP:function()
      {
        this.moveForward();
        this.animTimer--;
        if(this.animTimer<=0)
        {
          this.animTimer=100;
          this.animFrame++;
          if(this.animFrame>=this.imgs)
          {
            this.animFrame=0;
            this.animTimer=Infinity;
            this.currentMood=this.prevMood;
            this.prevModd=this.Mood.HOP;
            //DO NOT UPDATE MOOD DEPTH, WE ARE JUST RETURNING
          }
        }
      }
    }
    switch(this.currentMood)
    {
      case this.Mood.SIT:
        moodTicks.SIT();
        break;
      case this.Mood.RUN:
        moodTicks.RUN();
        break;
      case this.Mood.GROUP_UP:
        moodTicks.GROUP_UP();
        break;
      case this.Mood.APPROACH:
        moodTicks.APPROACH();
        break;
      case this.Mood.WANDER:
        moodTicks.WANDER();
        break;
      case this.Mood.HOP:
        moodTicks.HOP();
        break;
      default:
        console.warn("Bun in unrecongnized state \""+this.currentMood+"\"");
    }
  }
}
