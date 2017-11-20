class Bun extends Mob
{
  constructor(x,y,angle)
  {
    var size=Random.randNormBetween(1, 20, 7, 2);
    
    var speed=Math.min((size/10)**-1, 2)
    var turn=speed/8;
    
    super(x,y,angle,0,[images.bun, revImages.bun], speed,turn);
    this.size=size;
    
    this.size=size;
    
    //vars for being reported
    this.timeToReport=100;
    this.reportTimer=0;
    this.reported=false;
    this.reportCooldownMax=1000;
    this.reportCooldown=0;
    
    this.Mood={
      SIT: "SIT",
      RUN: "RUN",
      //HIDE: "HIDE", //covered by run
      GROUP_UP: "GROUP_UP",
      APPROACH: "APPROACH",
      WANDER: "WANDER",
      HOP: "HOP" //sub-mood
    };
    this.currentMood=this.Mood.WANDER;
    this.prevMood=this.Mood.SIT;
    //once this hits 0, it switches moods
    //max value is 100
    this._moodDepth=10;
  }
  getIntimidation()
  {
    //let p1=this.pos;
    let p1={x:this.pos.x, y:this.pos.y};
    const distStretch=10;
    
    let totalIntim=0;
    for(let i=0; i<world.entities.all.length; i++)
    {
      let e=world.entities.all[i];
      //let p2=e.pos;
      let p2={x:e.pos.x, y:e.pos.y};
      if(p1.x==p2.x && p1.y==p2.y)
        continue;
      let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2)/distStretch;
      
      let baseIntim=e.intim;
      
      baseIntim+=(this.isKingBun()*baseIntim); //king buns are twice as timid
      
      let normalized=baseIntim/(dist**2); //inverse square
      
      totalIntim+=normalized;
    }
    //again for the wrap around
    p1.x=(p1.x+(world.w/2))%world.w;
    p1.y=(p1.y+(world.h/2))%world.h;
    for(let i=0; i<world.entities.all.length; i++)
    {
      let e=world.entities.all[i];
      //let p2=e.pos;
      let p2={x:e.pos.x, y:e.pos.y};
      p2.x=(p2.x+(world.w/2))%world.w;
      p2.y=(p2.y+(world.h/2))%world.h;
      if(p1.x==p2.x && p1.y==p2.y)
        continue;
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
  isRunning()
  {
    return this.currentMood==this.Mood.RUN||
      (this.prevMood==this.Mood.RUN&&this.currentMood==this.Mood.HOP);
  }
  
  checkIntimAndRun()
  {
    let intimidation=this.getIntimidation();
    if(intimidation>0)
    {
      this.prevMood=this.currentMood;
      this.currentMood=this.Mood.RUN;
      this._moodDepth=Math.min(100, intimidation);
      return;
    }
  }
  enterHop()
  {
    this.animTimer=100;
    this.prevMood=this.currentMood;
    this.currentMood=this.Mood.HOP;
    //DO NOT UPDATE MOOD DEPTH, WE ARE JUST RETURNING
  }
  beSeen(reportSpeed)
  {
    if(!this.reported)
    {
      this.reportTimer+=reportSpeed;
      if(this.reportTimer>=this.timeToReport)
      {
        this.reported=true;
        this.reportCooldown=this.reportCooldownMax;
        return true;
      }
    }
    else
    {
        this.reportCooldown=this.reportCooldownMax;
    }
    return false;
  }
  
  tick()
  {
    if(this.reported)
    {
      this.reportCooldown--;
      if(this.reportCooldown<=0)
      {
        this.reported=false;
        this.reportTimer=0;
      }
    }
    let moodTicks={
      SIT:function(self)
      {
        self.checkIntimAndRun();
        
        if(Math.random()<0.125)
          self._moodDepth--;
        
        if(self._moodDepth<=0)
        {
          self.prevMood=self.currentMood;
          self.currentMood=self.Mood.WANDER;
          self.turnDir(Random.randInt(-2,2));
          self._moodDepth=50;
        }
      },
      RUN:function(self)
      {
        let intimidation=self.getIntimidation();
        if(intimidation<=0)
        {
          self.prevMood=self.currentMood;
          self.currentMood=self.Mood.SIT;
          self._moodDepth=20;
          return;
        }
        
        let nearest={dist: Infinity, pos: {x:Infinity,y:Infinity}};
        //let p1=self.pos;
        let p1={x:self.pos.x, y:self.pos.y};
        for(let i=0; i<world.entities.watchers.length; i++)
        {
          let e=world.entities.watchers[i];
          //let p2=e.pos;
          let p2={x:e.pos.x, y:e.pos.y};
          let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
          
          if(dist<nearest.dist)
            nearest={dist:dist, pos:p2};
        }
        //and for the wrap-around
        p1.x=(p1.x+(world.w/2))%world.w;
        p1.y=(p1.y+(world.h/2))%world.h;
        for(let i=0; i<world.entities.watchers.length; i++)
        {
          let e=world.entities.watchers[i];
          //let p2=e.pos;
          let p2={x:e.pos.x, y:e.pos.y};
          p2.x=(p2.x+(world.w/2))%world.w;
          p2.y=(p2.y+(world.h/2))%world.h;
          let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
          
          if(dist<nearest.dist)
            nearest={dist:dist, pos:p2};
        }
        
        let dx=nearest.pos.x - self.pos.x;
        let dy=nearest.pos.y - self.pos.y;
        let absoluteAngle=Math.atan2(dy,dx);
        
        let a=self.angle;
        let b=absoluteAngle;
        let angleTo=Math.atan2(Math.sin(a-b), Math.cos(a-b));
        
        self.turnDir(Math.sign(angleTo));
        
        self.enterHop();
      },
      GROUP_UP:function(self)
      {
        self.checkIntimAndRun();
        
        let nearest={dist: Infinity, pos: {x:Infinity,y:Infinity}};
        //let p1=self.pos
        let p1={x:self.pos.x, y:self.pos.y};
        for(let i=0; i<world.entities.buns.length; i++)
        {
          let e=world.entities.buns[i];
          //let p2=e.pos;
          let p2={x:e.pos.x, y:e.pos.y};
          if(p1.x==p2.x && p1.y==p2.y)
            continue;
          let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
          
          if(dist<nearest.dist)
            nearest={dist:dist, pos:p2};
        }
        //wrap-around
        p1.x=(p1.x+(world.w/2))%world.w;
        p1.y=(p1.y+(world.h/2))%world.h;
        for(let i=0; i<world.entities.buns.length; i++)
        {
          let e=world.entities.buns[i];
          //let p2=e.pos;
          let p2={x:e.pos.x, y:e.pos.y};
          p2.x=(p2.x+(world.w/2))%world.w;
          p2.y=(p2.y+(world.h/2))%world.h;
          if(p1.x==p2.x && p1.y==p2.y)
            continue;
          let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
          
          if(dist<nearest.dist)
            nearest={dist:dist, pos:p2};
        }
        let dx=nearest.pos.x - self.pos.x;
        let dy=nearest.pos.y - self.pos.y;
        let absoluteAngle=Math.atan2(dy,dx);
        
        let a=self.angle;
        let b=absoluteAngle;
        let angleTo=-Math.atan2(Math.sin(a-b), Math.cos(a-b));
        
        self.turnDir(Math.sign(angleTo));
        
        self.enterHop();
        
        self._moodDepth--;
        
        if(self._moodDepth<=0 || nearest.dist<20)
        {
          self.prevMood=self.currentMood;
          self.currentMood=self.Mood.SIT;
          self._moodDepth=20;
        }
      },
      APPROACH:function(self)
      {
        //self.checkIntimAndRun();
        
        let nearest={dist: Infinity, pos: {x:Infinity,y:Infinity}};
        //let p1=self.pos
        let p1={x:self.pos.x, y:self.pos.y};
        for(let i=0; i<world.entities.watchers.length; i++)
        {
          let e=world.entities.watchers[i];
          //let p2=e.pos;
          let p2={x:e.pos.x, y:e.pos.y};
          let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
          
          if(dist<nearest.dist)
            nearest={dist:dist, pos:p2};
        }
        //wrap-around
        p1.x=(p1.x+(world.w/2))%world.w;
        p1.y=(p1.y+(world.h/2))%world.h;
        for(let i=0; i<world.entities.watchers.length; i++)
        {
          let e=world.entities.watchers[i];
          //let p2=e.pos;
          let p2={x:e.pos.x, y:e.pos.y};
          p1.x=(p1.x+(world.w/2))%world.w;
          p1.y=(p1.y+(world.h/2))%world.h;
          let dist=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
          
          if(dist<nearest.dist)
            nearest={dist:dist, pos:p2};
        }
        
        let dx=nearest.pos.x - self.pos.x;
        let dy=nearest.pos.y - self.pos.y;
        let absoluteAngle=Math.atan2(dy,dx);
        
        let a=self.angle;
        let b=absoluteAngle;
        let angleTo=-Math.atan2(Math.sin(a-b), Math.cos(a-b));
        
        self.turnDir(Math.sign(angleTo));
        
        self.enterHop();
        
        self._moodDepth--;
        
        if(self._moodDepth<=0 || nearest.dist<20)
        {
          self.prevMood=self.currentMood;
          self.currentMood=self.Mood.SIT;
          self._moodDepth=20;
        }
      },
      WANDER:function(self)
      {
        self.checkIntimAndRun();
        
        //self.turnDir(Random.randSelect([-1,1]));
        
        if(Math.random()<0.2)
        {
          self.enterHop();
        }
        
        self._moodDepth--;
        if(self._moodDepth<=0)
        {
          if(Math.random()<0.5)
          {
            self.prevMood=self.currentMood;
            self.currentMood=self.Mood.SIT;
            self._moodDepth=20;
            return;
          }
          else if(Math.random()<0.8)
          {
            self.prevMood=self.currentMood;
            self.currentMood=self.Mood.GROUP_UP;
            self._moodDepth=50;
            return;
          }
          else
          {
            self.prevMood=self.currentMood;
            self.currentMood=self.Mood.APPROACH;
            self._moodDepth=50;
            return;
            
          }
        }
      },
      HOP:function(self)
      {
        self.moveForward();
        self.animTimer-=20;
        if(self.animTimer<=0)
        {
          self.animTimer=100;
          self.animFrame++;
          if(self.animFrame>=self.imgs[0].length)
          {
            self.animFrame=0;
            self.animTimer=Infinity;
            self.currentMood=self.prevMood;
            self.prevMood=self.Mood.HOP;
            //DO NOT UPDATE MOOD DEPTH, WE ARE JUST RETURNING
          }
        }
      }
    }
    switch(this.currentMood)
    {
      case this.Mood.SIT:
        moodTicks.SIT(this);
        break;
      case this.Mood.RUN:
        moodTicks.RUN(this);
        break;
      case this.Mood.GROUP_UP:
        moodTicks.GROUP_UP(this);
        break;
      case this.Mood.APPROACH:
        moodTicks.APPROACH(this);
        break;
      case this.Mood.WANDER:
        moodTicks.WANDER(this);
        break;
      case this.Mood.HOP:
        moodTicks.HOP(this);
        break;
      default:
        console.warn("Bun in unrecongnized state \""+this.currentMood+"\"");
    }
  }
}
