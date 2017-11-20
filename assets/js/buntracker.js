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
      }
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
    
    pushNoti.className="report";
    pushNoti.appendChild(profilePic);
    nameArea.innerHTML="<span>"+report.finder.username+
      " </span><span style='color:#00ff00'>("+
      parseInt(report.finder.popularity)+")</span>";
    locArea.innerText=(report.isKing?"King ":"")+
      "Bun at "+parseInt(report.loc.x)+", "
      +parseInt(report.loc.y)+"!";
    pushNoti.appendChild(nameArea);
    pushNoti.appendChild(locArea);
    
    this.notifications.push(pushNoti);
    document.getElementById("tracker").prepend(pushNoti);
  }
}
