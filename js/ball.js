class ball {
    constructor(name, stats) {
        this.name = name;
        this.stats = stats;
    }
}

// create all ball objects
var basic = new ball("Basic", 
    [[1,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]);
var sniper = new ball("Sniper", 
    [[0,0],[1.375,4.2],[1.5,15.75],[1.625,63],[1.75,210],[1.938,945],[2.187,2730],[0,12600],[0,84000]]);
var splash = new ball("Splash", 
    [[0,0],[0.825,4],[0.9,15],[0.975,60],[1.05,200],[1.162,900],[1.312,2600],[0,12000],[0,80000]]);
var poison = new ball("Poison", 
    [[0,0],[0,0],[1.08,0],[1.17,0],[1.26,0],[1.396,0],[1.576,0],[0,0],[0,0]]);
var demo = new ball("Demo", 
    [[0,0],[0,0],[0.54,300],[0.59,1200],[0.63,4000],[0.7,18000],[0.79,52000],[0,240000],[0,1600000]]);
var scatter = new ball("Scatter", 
    [[0,0],[0,0],[0,0],[1.3,60],[1.4,200],[1.55,900],[1.75,2600],[0,12000],[0,80000]]);
var pierce = new ball("Pierce", 
    [[0,0],[0,0],[0,0],[0,0],[1.4,200],[1.55,900],[1.75,2600],[0,12000],[0,80000]]);
var cash = new ball("Cash", 
    [[0,0],[0,0],[0,0],[0,0],[1.54,0],[1.706,0],[1.925,0],[0,0],[0,0]]);
var sword = new ball("Sword", 
    [[0,0],[0,0],[0,0],[0,0],[0,0],[1.938,1170],[2.187,3380],[0,15600],[0,104000]]);


// create ball selections
var ballBasic = [basic];
var ball175 = [sniper, splash];
var ball75k = ball175.concat([poison, demo]);
var ball175k = ball75k.concat([scatter]);
var ball15m = ball175k.concat([pierce, cash]);
var ball400b = ball15m.concat([sword]);

var allBalls = [basic, sniper, splash, poison, demo, scatter, pierce, cash, sword];
var allBallNames = ["Basic", "Sniper", "Splash", "Poison", "Demo", "Scatter", "Pierce", "Cash", "Sword"];
