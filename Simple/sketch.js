/*
function setup() {
  // put setup code here
  createCanvas(400,400);
  background(255,200,100);
}

function draw() {
  ellipse(mouseX,mouseY,10,10);
  // put drawing code here
}
*/

/*
To Do:

functions:
addrungs(), etc
*/

//BEGIN VARIABLES
var numRails = 5;
var Ladders = [];
//var rungs = [];
var offset = 6000;
var solverSet = [];
var goalSet = [];
var tempValue;
//END VARIABLES

//BEGIN SETUP
function setup() {
	createCanvas(600, 600);
	frameRate(30);
	for (var i = 0; i < numRails - 1; i++) {
		let rungs = [];
		Ladders[i] = new Ladder(rungs, i);
	}
	for (var j = 0; j < numRails; j++) {
		goalSet[j] = Math.floor(random(0, numRails));
	}



}
//END SETUP

//BEGIN DRAW
function draw() {
	background(0);

	drawGUI();
	drawRails();
	drawRungs();
	Solver();
	drawSolver();

	for (var i = 0; i < Ladders.length; i++) {
		Ladders[i].display(Ladders[i].rungs.length);
	}
	if (keyIsPressed) {
		keyPressed();
	}
}
//END DRAW

//BEGIN GUI
function mousePressed() {
	//print(mouseX + "  " + mouseY);
	if (mouseY > ((1 / 5) * height) & mouseY < ((4 / 5) * height)) {
		interact(mouseX, mouseY);
	}
	for (var i = 0; i < Ladders.length; i++) {
		Ladders[i].printit();
	}
}

function keyPressed() {

	if (keyCode == LEFT_ARROW) {
		offset -= 3;
		//print(offset);
	}
	if (keyCode == RIGHT_ARROW) {
		offset += 3;
	}

}

function interact(X, Y) {
	addRung(X,Y);

}
//END GUI

function addRung(X,Y)
{
	for (var i = 0; i < numRails; i++) {
		if (X > getLeft(i) & X < getRight(i)) {
			append(Ladders[i].rungs, Y);
		}
	}
}

//BEGIN LADDER
function Ladder(_rungs, _ladderNum) {
	this.rungs = _rungs;
	this.ladderNum = _ladderNum;
}

Ladder.prototype.display = function(_length) {
	stroke(255);
	for (var i = 0; i < _length; i++) {
		line(getLeft(this.ladderNum), this.rungs[i], getLeft(this.ladderNum) + (width / numRails), this.rungs[i]);
		line(getRight(this.ladderNum) - (width / numRails), this.rungs[i], getRight(this.ladderNum), this.rungs[i]);
	}
}

Ladder.prototype.printit = function() {
	//print(this.rungs);
}
//END LADDER

//BEGIN DRAWING FUNCTIONS
function drawRails() {
	for (var i = 0; i < numRails; i++) {
		stroke(255);
		line(getLeft(i), (1 / 5) * height, getLeft(i), (4 / 5) * height);
		textSize(20);
		noStroke();
		fill(255);
		text(i + 1, getLeft(i) - 5, 100);
	}
}

function drawGUI() {
	noStroke(255);
	fill(255);
	textSize(32);
	text("Japanese Ladder Game!", 10, 42);

	noFill();
	if (mouseIsPressed) {
		stroke(0, 255, 0, 100);
	} else {
		stroke(255, 0, 0, 100);
	}
	ellipse(mouseX, mouseY, 15, 15);

}

function drawRungs() {
	stroke(255);
	for (var i = 0; i < Ladders.length; i++) {
		Ladders[i].display(Ladders[i].rungs.length);
	}
}

function drawSolver() {
	textSize(20);
	fill(255);
	//solved

	for (var i = 0; i < numRails; i++) {
		text(solverSet[i], getLeft(i) - 5, (4 / 5) * height + 25);
	}
	//goal
	for (var j = 0; j < numRails; j++) {
		text(goalSet[j], getLeft(j) - 5, (4 / 5) * height + 50);
	}
}
//END DRAWING FUNCTIONS

//BEGIN FUNCTIONS
function Solver() {
	for (var i = 0; i < numRails; i++) {
		solverSet[i] = i + 1;
	}

	for (var pixel = (height/5); pixel < ((4 / 5) * height); pixel++) {
		//print(pixel);
		for (var ladder = 0; ladder < Ladders.length; ladder++) {
			for (var element = 0; element < Ladders[ladder].rungs.length; element++) {
				if(Ladders[ladder].rungs[element] == pixel)
				{
					//console.log("this happened at: "+ladder+",  "+Ladders[ladder].rungs[element]);
					tempValue = solverSet[ladder];
					solverSet[ladder] = solverSet[ladder + 1];
					solverSet[ladder + 1] = tempValue;
					//console.log(tempValue);
			  	//swapValues(ladder);
				}
			}
		}
	}
	//do an indexof search
}

function swapValues(ladder) {
	tempValue = solverSet[ladder];
	solverSet[ladder] = solverSet[ladder + 1];
	solverSet[ladder + 1] = tempValue;
}

function generateRandom(min, max) {
	return int(random(0, numRails));
	/*
	var num = Math.floor(Math.random() * (max - min + 1)) + min;
  for (var i = 0; i < numRails; i++) {
		return (num === goalSet[i]) ? generateRandom(min, max) : num;
	}
	*/
}

function getLeft(index) {
	return (offset + ((index / numRails) * width) + (width / (2 * numRails))) % width;
}

function getRight(index) {
	return (offset + ((index / numRails) * width) + ((1.5 * width) / numRails)) % width;
}

function getCenter(index) {
	return (offset + ((index / numRails) * width) + (width / (numRails))) % width;
}
//END FUNCTIONS
