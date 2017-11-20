var bunTracker={
  reports:[],
  notifications:[],
  tick:function(){
    for(let i=0; i<this.reports.length; i++)
    {
      this.reports[i].timeToClear-=20;
      if(this.reports[i].timeToClear<=0)
      {
        document.getElementById("tracker").removeChild(this.notifications[i]);
        this.notifications.splice(i, 1);
        this.reports.splice(i--, 1);
        continue;
      }
      //update compass
      let p1={x:world.entities.player.pos.x, y:world.entities.player.pos.y}
      //let p2=self.target;
      let p2={x:this.reports[i].loc.x, y:this.reports[i].loc.y};
      let dist1=Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2);
      //wrap-around
      let pw1={x:undefined,y:undefined}
      let pw2={x:undefined,y:undefined}
      pw1.x=(p1.x+(world.w/2))%world.w;
      pw1.y=(p1.y+(world.h/2))%world.h;
      pw2.x=(p2.x+(world.w/2))%world.w;
      pw2.y=(p2.y+(world.h/2))%world.h;
      let dist2=Math.sqrt((pw1.x-pw2.x)**2 + (pw1.y-pw2.y)**2);
      
      if(dist1<dist2)
      {
        var dist=dist1;
      }
      else
      {
        var dist=dist2;
        p1=pw1;
        p2=pw2;
      }
      
      let dx=p2.x - p1.x;
      let dy=p2.y - p1.y;
      let angleTo=Math.atan2(dy,dx);
      let deg=angleTo*(180/Math.PI);
      
      let arrow=this.notifications[i].getElementsByClassName("compArrow")[0];
      arrow.style.transform="rotate("+deg+"deg)";
      
    }
  },
  pushReport:function(report){
    for(let i=0; i<world.entities.watchers.length; i++)
      world.entities.watchers[i].hear(report);
    this.reports.push(report);
    
    let profilePic=new Image();
    profilePic.src=report.finder.imgs[1].profile.src;
    let pushNoti=document.createElement("div");
    let nameArea=document.createElement("p");
    nameArea.style.margin="0";
    let locArea=document.createElement("p");
    locArea.style.margin="0";
    
    //compass arrow
    let compArrow=document.createElement("span");
    compArrow.className="compArrow";
    compArrow.innerText="->";
    
    pushNoti.className="report";
    pushNoti.appendChild(profilePic);
    nameArea.innerHTML="<span>"+report.finder.username+
      " </span><span style='color:#00ff00'>("+
      parseInt(report.finder.popularity)+")</span>";
    locArea.innerText=(report.isKing?"King ":"")+
      "Bun at "+parseInt(report.loc.x)+", "
      +parseInt(report.loc.y)+"!";
    pushNoti.appendChild(nameArea);
    locArea.appendChild(compArrow);
    pushNoti.appendChild(locArea);
    
    this.notifications.push(pushNoti);
    document.getElementById("tracker").prepend(pushNoti);
  }
}
