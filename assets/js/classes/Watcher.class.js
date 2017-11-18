class Watcher extends Mob
{
  constructor(x,y,angle)
  {
    var intim=Random.randNormBetween(0, 100, 50, 10);
    var speed=Random.randNormalBetween(0, 1, 0.5, 0.1);
    var turn=Random.randNormalBetween(0, 1, 1/8, 0.01);
    
    super(x,y,angle,intim,[],speed,turn);
  }
  //TODO: make all the AI for a bun watcher
}
