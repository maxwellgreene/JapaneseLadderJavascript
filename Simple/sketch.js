/*
To Do:

Add tracing pathways
add modes?
*/

//BEGIN VARIABLES
var numRails = 5;
var Ladders = [];
var offset = 6000;
var solverSet = [];
var goalSet = [];
var sameCounter = 0;
var minTranspositions = 0;
var tempBool = false; var tempValue;
var clickRad = 10; var rungRad = 2;
var startX,startY;
var mouseThresh = 2;
var moveLadder,moveRung;
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
		goalSet[j] = j+1;
	}
	shuffle(goalSet,true);
	minTranspositions = getMinTranspositions();
}
//END SETUP

//BEGIN DRAW
function draw() {
	background(100,205,145);

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
	startX = mouseX;
	startY = mouseY;

	fill(255);

	if(mouseX>400 && mouseX < 516 && mouseY > 15 && mouseY < 47)
	{
		if(mouseX < 432)
			{restartSketch(2);}
		if(mouseX > 442 && mouseX < 474)
			{restartSketch(1);}
		if(mouseX > 484)
			{restartSketch(0);}
	}
	setMovingRung(startX,startY);
}

function restartSketch(type)
{
	if(type == 2)
	{numRails++;}
	if(type == 1)
	{numRails--;}
	for (var i = 0; i < numRails+1; i++) {
		let rungs = [];
		Ladders[i] = new Ladder(rungs, i);
	}
	for (var j = 0; j < numRails; j++) {
		goalSet[j] = j+1;
	}
	shuffle(goalSet,true);
	minTranspositions = getMinTranspositions();
}

function mouseDragged()
{
	//Simply set value or moving rung to mouseY
	if (mouseY > ((1 / 5) * height) & mouseY < ((4 / 5) * height)) {
		Ladders[moveLadder].rungs[moveRung] = mouseY;
	}

	//Check for other guns on the SAME ladder.
	//Does not let rungs "collide" with other rungs
	for(var i=0;i<Ladders[moveLadder].rungs.length;i++)
	{
		if(i != moveRung &&
			Ladders[moveLadder].rungs[moveRung] < (Ladders[moveLadder].rungs[i]+2*(clickRad+2)) &&
			Ladders[moveLadder].rungs[moveRung] > (Ladders[moveLadder].rungs[i]-2*(clickRad+2)))
			{
				if(Ladders[moveLadder].rungs[moveRung] < (Ladders[moveLadder].rungs[i]))
				{Ladders[moveLadder].rungs[moveRung] = Ladders[moveLadder].rungs[i]-2*(clickRad);}
				if(Ladders[moveLadder].rungs[moveRung] > (Ladders[moveLadder].rungs[i]))
				{Ladders[moveLadder].rungs[moveRung] = Ladders[moveLadder].rungs[i]+2*(clickRad);}
			}
	}
	//Checks rungs on ladder to the left and does not let moveRung come within rungRad of it
	if(moveLadder >0)
	{
		for(var i=0;i<Ladders[moveLadder-1].rungs.length;i++)
		{
			if(//i != moveRung &&
				Ladders[moveLadder].rungs[moveRung] < (Ladders[moveLadder-1].rungs[i]+2*(rungRad+2)) &&
				Ladders[moveLadder].rungs[moveRung] > (Ladders[moveLadder-1].rungs[i]-2*(rungRad+2)))
				{
					if(Ladders[moveLadder].rungs[moveRung] <= (Ladders[moveLadder-1].rungs[i]))
					{Ladders[moveLadder].rungs[moveRung] = Ladders[moveLadder-1].rungs[i]-2*(rungRad);}
					if(Ladders[moveLadder].rungs[moveRung] > (Ladders[moveLadder-1].rungs[i]))
					{Ladders[moveLadder].rungs[moveRung] = Ladders[moveLadder-1].rungs[i]+2*(rungRad);}
				}
			}
	}
	//Checks rungs on ladder to the right and does not let moveRung come within rungRad of it
	if(moveLadder < numRails+1)
	{
		for(var i=0;i<Ladders[moveLadder+1].rungs.length;i++)
		{
			if(//i != moveRung &&
				Ladders[moveLadder].rungs[moveRung] < (Ladders[moveLadder+1].rungs[i]+2*(rungRad+2)) &&
				Ladders[moveLadder].rungs[moveRung] > (Ladders[moveLadder+1].rungs[i]-2*(rungRad+2)))
				{
					if(Ladders[moveLadder].rungs[moveRung] <= (Ladders[moveLadder+1].rungs[i]))
					{Ladders[moveLadder].rungs[moveRung] = Ladders[moveLadder+1].rungs[i]-2*(rungRad);}
					if(Ladders[moveLadder].rungs[moveRung] > (Ladders[moveLadder+1].rungs[i]))
					{Ladders[moveLadder].rungs[moveRung] = Ladders[moveLadder+1].rungs[i]+2*(rungRad);}
				}
		}
	}
}

function mouseReleased()
{
	if(abs(mouseX-startX) <= mouseThresh && abs(mouseY-startY) <= mouseThresh)
	{
		if (mouseY > ((1 / 5) * height) && mouseY < ((4 / 5) * height)) {
			interact(mouseX, mouseY);
		}
	}
	for (var i = 0; i < Ladders.length; i++) {
		Ladders[i].printit();
	}
	moveLadder = null; moveRung = null;
}

function keyPressed() {
	if (keyCode == LEFT_ARROW) {
		offset -= 3;
	}
	if (keyCode == RIGHT_ARROW) {
		offset += 3;
	}
}

function interact(X, Y) {
	tempBool = false;

	for(var i = 0;i<numRails;i++)
	{
		if(X<getRight(i) && X>getLeft(i))
		{
			for(var j=0;j<Ladders[i].rungs.length;j++)
			{
				if(Y<(Ladders[i].rungs[j]+clickRad) && Y>(Ladders[i].rungs[j]-clickRad))
				{
					Ladders[i].rungs.splice(j,1);
					tempBool = true;
				}
			}
		}
	}
	if(!tempBool)
	{
		addRung(X,Y);
	}
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
		strokeWeight(rungRad*2);
		line(getLeft(this.ladderNum), this.rungs[i], getLeft(this.ladderNum) + (width / numRails), this.rungs[i]);
		line(getRight(this.ladderNum) - (width / numRails), this.rungs[i], getRight(this.ladderNum), this.rungs[i]);
		strokeWeight(1);
		fill(255,0,0,4);
		noStroke();
		rect(getLeft(this.ladderNum), this.rungs[i]-clickRad, width/numRails , 2*clickRad);
		//rect(getRight(this.ladderNum) - (width / numRails), this.rungs[i]-clickRad, getRight(this.ladderNum)-getLeft(this.ladderNum), 2*clickRad);
		rect(getRight(this.ladderNum), this.rungs[i]-clickRad, -1*(width/numRails), 2*clickRad);
		stroke(255);
	}
}

Ladder.prototype.printit = function() {
	//print(this.rungs);
}
//END LADDER

//BEGIN DRAWING FUNCTIONS
function drawRails() {

	/*
	//draw shadows for rails
	for (var i = 0; i < numRails; i++) {
		stroke(50);	strokeWeight(5);
		line(getLeft(i), (4 / 5) * height, getLeft(i) + (3*height/5), 2*height/5);
	}
	*/

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

	fill(255,0,0,15);
	textSize(50);
	rect(400,15,32,32);
	rect(442,15,32,32);
	rect(484,15,32,32);

	stroke(255);
	strokeWeight(4);
	line(405,31,427,31); line(416,20,416,42);
	line(447,31,469,31);

	ellipse(500,31,17);

	noFill();
	strokeWeight(1);

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

	noStroke(0);
	fill(255,0,0);
	//solved
	for (var i = 0; i < numRails; i++) {
		text(solverSet[i], getLeft(i) - 5, (4 / 5) * height + 25);
	}

	//goal
	noStroke();
	fill(0,0,255);
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
		for (var ladder = 0; ladder < Ladders.length; ladder++) {
			for (var element = 0; element < Ladders[ladder].rungs.length; element++) {
				if(Ladders[ladder].rungs[element] == pixel)
				{
					tempValue = solverSet[ladder];
					solverSet[ladder] = solverSet[ladder + 1];
					solverSet[ladder + 1] = tempValue;
				}
			}
		}
	}

	if(goalVsSolver() && minTranspositions == getNumTranspositions())
	{
		textSize(25);
		stroke(0);
		fill(255);
		text("YOU WON!!", 25, height-25);
	}else
	 if(goalVsSolver() && minTranspositions < getNumTranspositions())
	 {
			textSize(12.5);
			noStroke();
			fill(255);
			text("CORRECT SOLUTION, TOO MANY TRANSPOSITIONS!!", 25,height-50);
			text("Your Solution: "+getNumTranspositions()+"   Optimal Solution: "+minTranspositions,25,height-35);
		}
}

function swapValues(ladder) {
	print(ladder);
	tempValue = solverSet[ladder];
	solverSet[ladder] = solverSet[ladder + 1];
	solverSet[ladder + 1] = tempValue;
}

function getMinTranspositions()
{
	sameCounter = 0;
	for(var i=0;i<goalSet.length-1;i++)
	{
		for(var j=i+1;j<goalSet.length;j++)
		{
			if(goalSet[j]<goalSet[i])
			{
				sameCounter+=1;
			}
		}
	}
	return sameCounter;
}

function getNumTranspositions()
{
	sameCounter = 0;
	for(var i=0;i<goalSet.length-1;i++)
	{
		sameCounter += Ladders[i].rungs.length;
	}
	return(sameCounter);
}

function goalVsSolver()
{
	sameCounter =  0;
	for(var index = 0; index<goalSet.length;index++)
	{
		if(goalSet[index] == solverSet[index])
		{
			sameCounter++;
		}
	}

	if(sameCounter == goalSet.length)
	{
		return (true);
	}else
	{
		return (false);
	}
}

function setMovingRung(startX,startY)
{
	for(var i = 0;i<numRails;i++)
	{
		if(startX<getRight(i) && startX>getLeft(i))
		{
			for(var j=0;j<Ladders[i].rungs.length;j++)
			{
				if(startY<(Ladders[i].rungs[j]+clickRad) && startY>(Ladders[i].rungs[j]-clickRad))
				{
					moveLadder = i; moveRung = j;
				}
			}
		}
	}
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
