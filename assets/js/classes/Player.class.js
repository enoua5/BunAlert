class Player extends Watcher
{
  constructor(x,y)
  {
    super(x,y, 0);
    this.moveOverride=true;
    this.username="You";
  }
}
