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


var numRails = 5;
var Entire = [];
//var rungs = [];
var offset = 6000;
var solverSet = [];
var tempSolverSet = [];
var goalSet = [];
var temp;

function setup() {
	createCanvas(600, 600);
	for (var i = 0; i < numRails - 1; i++) {
		let rungs = [];
		Entire[i] = new Ladder(rungs, i);
	}
	for (var j = 0; j < numRails; j++) {
		goalSet[j] = Math.floor(random(0, numRails));
	}
	print(goalSet);
}

function draw() {
	background(100);

	drawGUI();
	drawRails();
	drawRungs();
	Solver();
	drawSolver();


	for (var i = 0; i < Entire.length; i++) {
		Entire[i].display(Entire[i].rungs.length);
	}

	if (keyIsPressed) {
		keyPressed();
	}

}

function mousePressed() {
	print(mouseX + "  " + mouseY);
	if (mouseY > ((1 / 5) * height) & mouseY < ((4 / 5) * height)) {
		interact(mouseX, mouseY);
	}
	for (var i = 0; i < Entire.length; i++) {
		Entire[i].printit();
	}
}

function keyPressed() {

	if (keyCode == LEFT_ARROW) {
		offset -= 3;
		print(offset);
	}
	if (keyCode == RIGHT_ARROW) {
		offset += 3;
	}

}

function interact(X, Y) {
	for (var i = 0; i < numRails; i++) {
		if (X > getLeft(i) & X < getRight(i)) {
			append(Entire[i].rungs, Y);
		}
	}
}

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
	print(this.rungs);
}


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
	for (var i = 0; i < Entire.length; i++) {
		Entire[i].display(Entire[i].rungs.length);
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

function Solver() {

	for (var i = 0; i < numRails; i++) {
		tempSolverSet[i] = i + 1;
	}
	solverSet = tempSolverSet;

	for (var pixel = 0; pixel < ((3 / 5) * height); pixel++) {
		for (var ladder = 0; ladder < Entire.length; ladder++) {
		  print(Entire[ladder].length);
			for (var element = 0; element < Entire[ladder].length; element++) {
			if(Entire[ladder][element] == pixel)
			{
			  print(ladder);
			  swapValues(ladder);
			}
			}
		}
	}
}

function swapValues(index) {
	temp = tempSolverSet[index];
	tempSolverSet[index] = tempSolverSet[index + 1];
	tempSolverSet[index + 1] = temp;
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
