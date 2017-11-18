class BunReport
{
  constructor(finderName, loc)
  {
    //time is in UTC
    this.finderName=finderName;
    this.loc=loc;
    this.timeToClear=10000;//10 seconds
  }
}
