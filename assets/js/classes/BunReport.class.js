class BunReport
{
  constructor(finder, loc, isKing)
  {
    //time is in UTC
    this.finder=finder;
    this.loc=loc;
    this.isKing=isKing;
    this.timeToClear=10000;//10 seconds
  }
}
