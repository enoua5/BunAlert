var bunTracker={
  reports:[],
  tick:function(){
    for(let i=0; i<this.reports.length; i++)
    {
      this.reports[i].timeToClear-=20;
      if(this.reports[i].timeToClear<=0)
        this.reports.splice(i--, 1)
    }
  },
  pushReport:function(report){
    console.log(report)
    this.reports.push(report);
  }
}
