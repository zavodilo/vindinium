package org.jousse
package bot

case class Hero(
    id: Int,
    token: String,
    name: String,
    userId: Option[String],
    elo: Option[Int],
    pos: Pos,
    life: Int,
    gold: Int,
    driver: Driver,
    crash: Option[Crash]) {

  def moveTo(p: Pos) = copy(pos = p)

  def drinkBeer =
    if (gold >= -Hero.beerGold) withGold(Hero.beerGold).withLife(Hero.beerLife)
    else this

  def attack(enemy: Hero) = withLife(Hero.attackLife) -> enemy.withLife(Hero.defendLife)

  def fightMine = withLife(Hero.mineLife)

  def withLife(diff: Int) = copy(life = math.max(0, math.min(Hero.maxLife, life + diff)))

  def withGold(diff: Int) = copy(gold = math.max(0, gold + diff))

  def day = {
    val h = withLife(Hero.dayLife)
    if (h.isDead) h.withLife(1) else h
  }

  def reSpawn(p: Pos) = copy(life = Hero.maxLife, pos = p)

  def setCrash(c: Crash) = copy(crash = Some(c))
  def crashed = crash.isDefined

  def isAlive = life > 0
  def isDead = !isAlive

  def withName(name: String) = copy(name = name)

  def render = s"@$id"
}

object Hero {

  def apply(id: Int, name: String, userId: Option[String], elo: Option[Int], pos: Pos): Hero = Hero(
    id = id,
    token = RandomString(4),
    name = name,
    userId = userId,
    elo = elo,
    pos = pos,
    life = maxLife,
    gold = 0,
    driver = Driver.Http,
    crash = None)

  val maxLife = 100
  val beerLife = 50
  val beerGold = -2
  val dayLife = -1
  val mineLife = -20
  val attackLife = -10
  val defendLife = -20
}
