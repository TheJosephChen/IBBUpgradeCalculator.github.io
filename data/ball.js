class ball {
    constructor(name, stats) {
        this.name = name;
        this.stats = stats;
    }
}

// create all ball objects
var basic = new ball("Basic", 
    [[1,1],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]]);
var sniper = new ball("Sniper", 
    [[0,0],[1.375,4.2],[1.5,15.75],[1.625,63],[1.75,210],[1.938,945],[2.187,2730],[2.38,12600],[2.56,84000],[2.75,756000]]);
var splash = new ball("Splash", 
    [[0,0],[0.825,4],[0.9,15],[0.975,60],[1.05,200],[1.162,900],[1.312,2600],[1.43,12000],[1.54,80000],[1.65,720000]]);
var poison = new ball("Poison", 
    [[0,0],[0,0],[1.08,1.5],[1.17,1.65],[1.26,1.85],[1.396,2.1],[1.576,2.35],[1.71,2.7],[1.85,3],[1.98,3.3]]);
var demo = new ball("Demo", 
    [[0,0],[0,0],[0.54,300],[0.59,1200],[0.63,4000],[0.7,18000],[0.79,52000],[0.86,240000],[0.92,1600000],[0.99,14400000]]);
var scatter = new ball("Scatter", 
    [[0,0],[0,0],[0,0],[1.3,60],[1.4,200],[1.55,900],[1.75,2600],[1.9,12000],[2.05,80000],[2.2,720000]]);
var pierce = new ball("Pierce", 
    [[0,0],[0,0],[0,0],[0,0],[1.4,200],[1.55,900],[1.75,2600],[1.9,12000],[2.05,80000],[2.2,720000]]);
var cash = new ball("Cash", 
    [[0,0],[0,0],[0,0],[0,0],[1.54,0.35],[1.706,0.39],[1.925,0.43],[2.09,0.5],[2.26,0.58],[2.42,0.65]]);
var sword = new ball("Sword", 
    [[0,0],[0,0],[0,0],[0,0],[0,0],[1.938,1170],[2.187,3380],[2.38,15600],[2.56,104000],[2.75,936000]]);
var fire = new ball("Fire",
    [[0,0],[0,0],[0,0],[0,0],[0,0],[1.938,900],[2.187,2600],[2.38,12000],[2.56,80000],[2.75,720000]]);


// create ball selections
var ballBasic = [basic];
var ball175 = [sniper, splash];
var ball75k = ball175.concat([poison, demo]);
var ball175k = ball75k.concat([scatter]);
var ball15m = ball175k.concat([pierce, cash]);
var ball400b = ball15m.concat([sword, fire]);

var allBalls = [basic, sniper, splash, poison, demo, scatter, pierce, cash, sword, fire];
var allBallNames = ["Basic", "Sniper", "Splash", "Poison", "Demo", "Scatter", "Pierce", "Cash", "Sword", "Fire"];
var unlocks = ["Base", "$175", "$7.5k", "175k", "15m", "400b", "10q", "10s", "100O", "5aa"];
