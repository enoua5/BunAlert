class Random
{
  constructor()
  {
    this.m_w=123456789;
    this.m_z=987654321;
    this.mask=0xffffffff;
  }
  seed(i)
  {
    this.m_w=i;
    this.m_z=987654321;
  }
  random()
  {
    this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
    m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;
    var result = ((m_z << 16) + m_w) & mask;
    result /= 4294967296;
    return result + 0.5;
  }
  //specials
  static randInt(min, max, randClass)
  {
    var rand=randClass?randClass.random:Math.random;
    var range=max-min;
    return Math.floor(rand()*(range+1))+min;
  }
  static randNorm(mu, sig, randClass)
  {
    var rand=randClass?randClass.random:Math.random;
    var u=1-Math.random(); //subtration to flip [0,1) to (0,1] for the rare chance Math.random() == 0
	  var v=1-Math.random();
	  //box cox
	  var g=((-2*Math.log(u))**0.5)*Math.cos(2*Math.PI*v);
	  return sigma*g + mu;
  }
  static randNormBetween(min, max, mu, sig, randClass)
  {
    var r=Random.randNorm(mu, sig, randClass);
    return Math.max(Math.min(r, max),min);
  }
  static randSelect(arr, randClass)
  {
    var r=Random.randInt(0, arr.length-1, randClass);
    return arr[r];
  }
}
