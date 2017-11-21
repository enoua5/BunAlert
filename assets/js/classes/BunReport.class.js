class BunReport
{
  constructor(finder, loc, isKing)
  {
    //time is in UTC
    this.finder=finder;
    this.loc={x:loc.x, y:loc.y};
    this.isKing=isKing;
    this.timeToClear=20000;//20 seconds
  }
}
