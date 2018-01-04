/*
To Do:

*/

//BEGIN VARIABLES
var numRails = 5;
var Ladders = [];
//var rungs = [];
var offset = 6000;
var solverSet = [];
var goalSet = [];
var tempValue;
var sameCounter = 0;
var minTranspositions = 0;
var tempBool = false;
var clickRad = 10; var rungRad = 2;
var startX,startY;
var mouseThresh = 0;
var moveLadder,moveRung,moveLeftRung,moveRightRung;
var bordersize;
//END VARIABLES

//BEGIN SETUP
function setup() {
	createCanvas(600, 600);
	borderSize = width/((numRails+1)*3);
	frameRate(30);
	for (var i = 0; i < numRails - 1; i++) {
		let rungs = [];
		let leftRungs = [];
		let rightRungs = [];
		Ladders[i] = new Ladder(rungs, i, leftRungs, rightRungs);
	}
	for (var j = 0; j < numRails; j++) {
		if(random(2)>1)
		{goalSet[j] = -1*(j+1);}else
		{goalSet[j] = j+1;}
	}
	shuffle(goalSet,true);
	minTranspositions = getMinTranspositions();
	print(minTranspositions);
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

	if (keyIsPressed) {
		keyPressed();
	}
}
//END DRAW

//BEGIN GUI
function mousePressed() {
	startX = mouseX;
	startY = mouseY;

	setMovingRung(startX,startY);
}

function mouseDragged()
{
	if (mouseY > ((1 / 5) * height) & mouseY < ((4 / 5) * height)) {
		Ladders[moveLadder].rungs[moveRung] = mouseY;
		Ladders[moveLadder].rightRungs[moveRightRung] = mouseY;
		Ladders[moveLadder].leftRungs[moveLeftRung] = mouseY;
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
	//Checks rungs on ladder to the right and does not let moveRung come within rungRad of it
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
	moveLadder = null; moveRung = null; moveLeftRung = null; moveRightRung = null;
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
			for(var j=0;j<Ladders[i].leftRungs.length;j++)
			{
				if(Y<(Ladders[i].leftRungs[j]+clickRad) && Y>(Ladders[i].leftRungs[j]-clickRad))
				{
					Ladders[i].leftRungs.splice(j,1);
					tempBool = true;
				}
			}
			for(var j=0;j<Ladders[i].rightRungs.length;j++)
			{
				if(Y<(Ladders[i].rightRungs[j]+clickRad) && Y>(Ladders[i].rightRungs[j]-clickRad))
				{
					Ladders[i].rightRungs.splice(j,1);
					tempBool = true;
				}
			}
		}
	}
	if(!tempBool)
	{
		for(var i = 0;i<numRails;i++)
		{
			if(X<getRight(i)-borderSize && X>getLeft(i)+borderSize)
			{
				addRung(X,Y);
			}
			if(X<getLeft(i)+borderSize && X>getLeft(i))
			{
				addLeftRung(X,Y);
			}
			if(X>getRight(i)-borderSize && X<getRight(i))
			{
				addRightRung(X,Y);
			}
		}
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
function addLeftRung(X,Y)
{
	for (var i = 0; i < numRails; i++) {
		if (X > getLeft(i) & X < getRight(i)) {
			append(Ladders[i].leftRungs, Y);
		}
	}
}
function addRightRung(X,Y)
{
	for (var i = 0; i < numRails; i++) {
		if (X > getLeft(i) & X < getRight(i)) {
			append(Ladders[i].rightRungs, Y);
		}
	}
}

//BEGIN LADDER
function Ladder(_rungs, _ladderNum, _leftRungs, _rightRungs) {
	this.rungs = _rungs;
	this.ladderNum = _ladderNum;
	this.leftRungs = _leftRungs;
	this.rightRungs = _rightRungs;
}

Ladder.prototype.displayRungs = function(_length) {
	stroke(255);
	for (var i = 0; i < _length; i++) {
		strokeWeight(4);
		line(getLeft(this.ladderNum), this.rungs[i], getLeft(this.ladderNum) + (width / numRails), this.rungs[i]);
		line(getRight(this.ladderNum) - (width / numRails), this.rungs[i], getRight(this.ladderNum), this.rungs[i]);
		strokeWeight(1);
		fill(255,0,0,4);
		noStroke();
		rect(getLeft(this.ladderNum), this.rungs[i]-clickRad, getRight(this.ladderNum)-getLeft(this.ladderNum), 2*clickRad);
		rect(getRight(this.ladderNum) - (width / numRails), this.rungs[i]-clickRad, getRight(this.ladderNum)-getLeft(this.ladderNum), 2*clickRad);
		stroke(255);
	}
}

Ladder.prototype.displayLeftRungs = function(_length) {
	stroke(255);
	for (var i = 0; i < _length; i++) {
		strokeWeight(4);
		line(getLeft(this.ladderNum), this.leftRungs[i], getLeft(this.ladderNum) + (width / numRails), this.leftRungs[i]);
		line(getRight(this.ladderNum) - (width / numRails), this.leftRungs[i], getRight(this.ladderNum), this.leftRungs[i]);
		strokeWeight(1);
		fill(255);
		triangle(getCenter(this.ladderNum)+10,this.leftRungs[i]+10,getCenter(this.ladderNum)+10,this.leftRungs[i]-10,getCenter(this.ladderNum)-10,this.leftRungs[i]);
		strokeWeight(1);
		fill(255,0,0,4);
		noStroke();
		rect(getLeft(this.ladderNum), this.leftRungs[i]-clickRad, getRight(this.ladderNum)-getLeft(this.ladderNum), 2*clickRad);
		rect(getRight(this.ladderNum) - (width / numRails), this.leftRungs[i]-clickRad, getRight(this.ladderNum)-getLeft(this.ladderNum), 2*clickRad);
		stroke(255);
	}
}

Ladder.prototype.displayRightRungs = function(_length) {
	stroke(255);
	fill(255);
	for (var i = 0; i < _length; i++) {
		strokeWeight(4);
		line(getLeft(this.ladderNum), this.rightRungs[i], getLeft(this.ladderNum) + (width / numRails), this.rightRungs[i]);
		line(getRight(this.ladderNum) - (width / numRails), this.rightRungs[i], getRight(this.ladderNum), this.rightRungs[i]);
		strokeWeight(1);
		fill(255);
		triangle(getCenter(this.ladderNum)-10,this.rightRungs[i]-10,getCenter(this.ladderNum)-10,this.rightRungs[i]+10,getCenter(this.ladderNum)+10,this.rightRungs[i]);
		strokeWeight(1);
		fill(255,0,0,4);
		noStroke();
		rect(getLeft(this.ladderNum), this.rightRungs[i]-clickRad, getRight(this.ladderNum)-getLeft(this.ladderNum), 2*clickRad);
		rect(getRight(this.ladderNum) - (width / numRails), this.rightRungs[i]-clickRad, getRight(this.ladderNum)-getLeft(this.ladderNum), 2*clickRad);
		stroke(255);
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
		fill(255,0,0,5);
		noStroke();
		rect(getLeft(i),(height/5),borderSize,(3*height/5));
		rect(getRight(i)-borderSize,(height/5),borderSize,(3*height/5));
		textSize(20);
		noStroke();
		fill(255);
		text(i + 1, getLeft(i) - 5, 100);
	}
}

function drawGUI() {
	noStroke(255);
	fill(255);
	textSize(26);
	text("Japanese Ladder Game, Left & Right Edition!", 10, 42);

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
		Ladders[i].displayRungs(Ladders[i].rungs.length);
		Ladders[i].displayLeftRungs(Ladders[i].leftRungs.length);
		Ladders[i].displayRightRungs(Ladders[i].rightRungs.length);
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
					swapValues(ladder);
				}
			}
			for (var element = 0; element < Ladders[ladder].leftRungs.length; element++) {
				if(Ladders[ladder].leftRungs[element] == pixel)
				{
					swapValuesLeft(ladder);
				}
			}
			for (var element = 0; element < Ladders[ladder].rightRungs.length; element++) {
				if(Ladders[ladder].rightRungs[element] == pixel)
				{
					swapValuesRight(ladder);
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
	tempValue = solverSet[ladder];
	solverSet[ladder] = solverSet[ladder + 1];
	solverSet[ladder + 1] = tempValue;
}

function swapValuesRight(ladder) {
	tempValue = solverSet[ladder];
	solverSet[ladder] = -1*(solverSet[ladder + 1]);
	solverSet[ladder + 1] = tempValue;
}

function swapValuesLeft(ladder) {
	tempValue = solverSet[ladder];
	solverSet[ladder] = solverSet[ladder + 1];
	solverSet[ladder + 1] = -1*(tempValue);
}

function getMinTranspositions()
{
	sameCounter = 0;
	for(var i=0;i<goalSet.length-1;i++)
	{
		for(var j=i+1;j<goalSet.length;j++)
		{
			if(abs(goalSet[j])<abs(goalSet[i]))
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
			for(var j=0;j<Ladders[i].leftRungs.length;j++)
			{
				if(startY<(Ladders[i].leftRungs[j]+clickRad) && startY>(Ladders[i].leftRungs[j]-clickRad))
				{
					moveLadder = i; moveLeftRung = j;
				}
			}
			for(var j=0;j<Ladders[i].rightRungs.length;j++)
			{
				if(startY<(Ladders[i].rightRungs[j]+clickRad) && startY>(Ladders[i].rightRungs[j]-clickRad))
				{
					moveLadder = i; moveRightRung = j;
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
