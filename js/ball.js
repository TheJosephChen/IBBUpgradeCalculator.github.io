class ball {
    constructor(name, speed, power) {
        this.name = name;
        this.speed = speed;
        this.power = power;
    }
}

// create all ball objects
var basic = new ball("Basic", 0, 0);
var sniper = new ball("Sniper", 0, 0);
var splash = new ball("Splash", 0, 0);
var poison = new ball("Poison", 0, 0);
var demo = new ball("Demo", 0, 0);
var scatter = new ball("Scatter", 0, 0);
var pierce = new ball("Pierce", 0, 0);
var cash = new ball("Cash", 0, 0);
var sword = new ball("Sword", 0, 0);

var allBalls = [basic, sniper, splash, poison, demo, scatter, pierce, cash, sword];

// create ball selections
var ballBasic = [basic];
var ball175 = [sniper, splash];
var ball75k = ball175.concat([poison, demo]);
var ball175k = ball75k.concat([scatter]);
var ball15m = ball175k.concat([pierce, cash]);
var ball400b = ball15m.concat([sword]);
