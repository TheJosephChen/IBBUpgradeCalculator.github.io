class ball {
    constructor(name, stats) {
        this.name = name;
        this.stats = stats;
    }
}

// create all ball objects
var basic = new ball("Basic", []);
var sniper = new ball("Sniper", []);
var splash = new ball("Splash", []);
var poison = new ball("Poison", []);
var demo = new ball("Demo", []);
var scatter = new ball("Scatter", []);
var pierce = new ball("Pierce", []);
var cash = new ball("Cash", []);
var sword = new ball("Sword", []);


// create ball selections
var ballBasic = [basic];
var ball175 = [sniper, splash];
var ball75k = ball175.concat([poison, demo]);
var ball175k = ball75k.concat([scatter]);
var ball15m = ball175k.concat([pierce, cash]);
var ball400b = ball15m.concat([sword]);

var allBalls = [basic, sniper, splash, poison, demo, scatter, pierce, cash, sword];
var allBallNames = ["Basic", "Sniper", "Splash", "Poison", "Demo", "Scatter", "Pierce", "Cash", "Sword"];
