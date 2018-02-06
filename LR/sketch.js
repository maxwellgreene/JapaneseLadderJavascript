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
var moveLadder,moveLeftRung,moveRightRung;
var bordersize;
//END VARIABLES

//BEGIN SETUP
function setup() {
	createCanvas(600, 600);
	borderSize = width/((numRails+1)*3);
	frameRate(30);
	for (var i = 0; i < numRails - 1; i++) {
		let leftRungs = [];
		let rightRungs = [];
		Ladders[i] = new Ladder(i, leftRungs, rightRungs);
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

	fill(255);
	if(mouseX>400 && mouseX < 558 && mouseY > 15 && mouseY < 47)
	{
		if(mouseX < 432)
			{restartSketch(0);}
		if(mouseX > 442 && mouseX < 474)
			{restartSketch(1);}
		if(mouseX > 484 && mouseX < 496)
			{restartSketch(2);}
		if(mouseX > 526)
		{
			for(var i=0;i<numRails+1;i++)
			{
				Ladders[i].leftRungs = [];
				Ladders[i].rightRungs = [];
			}
		}
	}
	setMovingRung(startX,startY);
}

function restartSketch(type)
{
	if(type == 2 && numRails < 13)
	{numRails++;}
	if(type == 0 && numRails > 2)
	{numRails--;}
	borderSize = width/((numRails+1)*3)
	for (var i = 0; i < numRails - 1; i++) {
		let leftRungs = [];
		let rightRungs = [];
		Ladders[i] = new Ladder(i, leftRungs, rightRungs);
	}
	goalSet = [];
	for (var j = 0; j < numRails; j++) {
		if(random(2)>1)
		{goalSet[j] = -1*(j+1);}else
		{goalSet[j] = j+1;}
	}
	shuffle(goalSet,true);
	minTranspositions = getMinTranspositions();
}

function mouseDragged()
{
	if (mouseY > ((1 / 5) * height) & mouseY < ((4 / 5) * height)) {
		if(moveRightRung != null)
		{Ladders[moveLadder].rightRungs[moveRightRung] = mouseY;}
		if(moveLeftRung != null)
		{Ladders[moveLadder].leftRungs[moveLeftRung] = mouseY;}
	}
	//Check for other guns on the SAME ladder.
	//Does not let rungs "collide" with other rungs

	for(var i=0;i<Ladders[moveLadder].leftRungs.length;i++)
	{
		if(i != moveLeftRung &&
			Ladders[moveLadder].leftRungs[moveLeftRung] < (Ladders[moveLadder].leftRungs[i]+2*(clickRad+2)) &&
			Ladders[moveLadder].leftRungs[moveLeftRung] > (Ladders[moveLadder].leftRungs[i]-2*(clickRad+2)))
			{
				if(Ladders[moveLadder].leftRungs[moveLeftRung] < (Ladders[moveLadder].leftRungs[i]))
				{Ladders[moveLadder].leftRungs[moveLeftRung] = Ladders[moveLadder].leftRungs[i]-2*(clickRad);}
				if(Ladders[moveLadder].leftRungs[moveLeftRung] > (Ladders[moveLadder].leftRungs[i]))
				{Ladders[moveLadder].leftRungs[moveLeftRung] = Ladders[moveLadder].leftRungs[i]+2*(clickRad);}
			}
	}
	//Checks rungs on ladder to the left and does not let moveRung come within rungRad of it
	if(moveLadder != 0)
	{
	for(var i=0;i<Ladders[moveLadder-1].leftRungs.length;i++)
	{
		if(//i != moveRung &&
			Ladders[moveLadder].leftRungs[moveLeftRung] < (Ladders[moveLadder-1].leftRungs[i]+2*(rungRad+2)) &&
			Ladders[moveLadder].leftRungs[moveLeftRung] > (Ladders[moveLadder-1].leftRungs[i]-2*(rungRad+2)))
			{
				if(Ladders[moveLadder].leftRungs[moveLeftRung] <= (Ladders[moveLadder-1].leftRungs[i]))
				{Ladders[moveLadder].leftRungs[moveLeftRung] = Ladders[moveLadder-1].leftRungs[i]-2*(rungRad);}
				if(Ladders[moveLadder].leftRungs[moveLeftRung] > (Ladders[moveLadder-1].leftRungs[i]))
				{Ladders[moveLadder].leftRungs[moveLeftRung] = Ladders[moveLadder-1].leftRungs[i]+2*(rungRad);}
			}
	}
	}
	//Checks rungs on ladder to the right and does not let moveRung come within rungRad of it
	if(moveLadder != numRails)
	{
	for(var i=0;i<Ladders[moveLadder+1].leftRungs.length;i++)
	{
		if(//i != moveRung &&
			Ladders[moveLadder].leftRungs[moveLeftRung] < (Ladders[moveLadder+1].leftRungs[i]+2*(rungRad+2)) &&
			Ladders[moveLadder].leftRungs[moveLeftRung] > (Ladders[moveLadder+1].leftRungs[i]-2*(rungRad+2)))
			{
				if(Ladders[moveLadder].leftRungs[moveLeftRung] <= (Ladders[moveLadder+1].leftRungs[i]))
				{Ladders[moveLadder].leftRungs[moveLeftRung] = Ladders[moveLadder+1].leftRungs[i]-2*(rungRad);}
				if(Ladders[moveLadder].leftRungs[moveLeftRung] > (Ladders[moveLadder+1].leftRungs[i]))
				{Ladders[moveLadder].leftRungs[moveLeftRung] = Ladders[moveLadder+1].leftRungs[i]+2*(rungRad);}
			}
	}
	}
	for(var i=0;i<Ladders[moveLadder].rightRungs.length;i++)
	{
		if(i != moveRightRung &&
			Ladders[moveLadder].rightRungs[moveRightRung] < (Ladders[moveLadder].rightRungs[i]+2*(clickRad+2)) &&
			Ladders[moveLadder].rightRungs[moveRightRung] > (Ladders[moveLadder].rightRungs[i]-2*(clickRad+2)))
			{
				if(Ladders[moveLadder].rightRungs[moveRightRung] < (Ladders[moveLadder].rightRungs[i]))
				{Ladders[moveLadder].rightRungs[moveRightRung] = Ladders[moveLadder].rightRungs[i]-2*(clickRad);}
				if(Ladders[moveLadder].rightRungs[moveRightRung] > (Ladders[moveLadder].rightRungs[i]))
				{Ladders[moveLadder].rightRungs[moveRightRung] = Ladders[moveLadder].rightRungs[i]+2*(clickRad);}
			}
	}
	//Checks rungs on ladder to the left and does not let moveRung come within rungRad of it
	if(moveLadder != 0)
	{
	for(var i=0;i<Ladders[moveLadder-1].rightRungs.length;i++)
	{
		if(//i != moveRung &&
			Ladders[moveLadder].rightRungs[moveRightRung] < (Ladders[moveLadder-1].rightRungs[i]+2*(rungRad+2)) &&
			Ladders[moveLadder].rightRungs[moveRightRung] > (Ladders[moveLadder-1].rightRungs[i]-2*(rungRad+2)))
			{
				if(Ladders[moveLadder].rightRungs[moveRightRung] <= (Ladders[moveLadder-1].rightRungs[i]))
				{Ladders[moveLadder].rightRungs[moveRightRung] = Ladders[moveLadder-1].rightRungs[i]-2*(rungRad);}
				if(Ladders[moveLadder].rightRungs[moveRightRung] > (Ladders[moveLadder-1].rightRungs[i]))
				{Ladders[moveLadder].rightRungs[moveRightRung] = Ladders[moveLadder-1].rightRungs[i]+2*(rungRad);}
			}
	}
	}
	//Checks rungs on ladder to the right and does not let moveRung come within rungRad of it
	if(moveLadder != numRails)
	{
	for(var i=0;i<Ladders[moveLadder+1].rightRungs.length;i++)
	{
		if(//i != moveRung &&
			Ladders[moveLadder].rightRungs[moveRightRung] < (Ladders[moveLadder+1].rightRungs[i]+2*(rungRad+2)) &&
			Ladders[moveLadder].rightRungs[moveRightRung] > (Ladders[moveLadder+1].rightRungs[i]-2*(rungRad+2)))
			{
				if(Ladders[moveLadder].rightRungs[moveRightRung] <= (Ladders[moveLadder+1].rightRungs[i]))
				{Ladders[moveLadder].rightRungs[moveRightRung] = Ladders[moveLadder+1].rightRungs[i]-2*(rungRad);}
				if(Ladders[moveLadder].rightRungs[moveRightRung] > (Ladders[moveLadder+1].rightRungs[i]))
				{Ladders[moveLadder].rightRungs[moveRightRung] = Ladders[moveLadder+1].rightRungs[i]+2*(rungRad);}
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
	moveLadder = null; moveLeftRung = null; moveRightRung = null;
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
function Ladder(_ladderNum, _leftRungs, _rightRungs) {
	this.ladderNum = _ladderNum;
	this.leftRungs = _leftRungs;
	this.rightRungs = _rightRungs;
}

/*
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
*/

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
		rect(getLeft(this.ladderNum), this.leftRungs[i]-clickRad, width/numRails , 2*clickRad);
		//rect(getRight(this.ladderNum) - (width / numRails), this.rungs[i]-clickRad, getRight(this.ladderNum)-getLeft(this.ladderNum), 2*clickRad);
		rect(getRight(this.ladderNum), this.leftRungs[i]-clickRad, -1*(width/numRails), 2*clickRad);
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
		fill(255,0,0,8);
		noStroke();
		if(i < numRails-1)
		{
			rect(getLeft(i),(height/5),borderSize,(3*height/5));
			rect(getRight(i)-borderSize,(height/5),borderSize,(3*height/5));
		}
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
	text("Japanese Ladder Game!", 10, 42);
	textSize(20);
	text("Left/Right Edition", 10, 66);

	fill(255,0,0,15);
	textSize(50);
	noStroke();

	rect(400,15,32,32);
	rect(442,15,32,32);
	rect(484,15,32,32);
	rect(526,15,32,32);

	stroke(255);
	strokeWeight(4);
	line(405,31,427,31);
	ellipse(458,31,17);
	line(489,31,511,31);	line(500,20,500,42);
	line(533,22,551,40);	line(533,40,551,22);

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

	noStroke();
	textSize(12.5);
	fill(255);
	text("Optimal Solution: "+minTranspositions,25,height-15);
}
//END DRAWING FUNCTIONS

//BEGIN FUNCTIONS
function Solver() {
	for (var i = 0; i < numRails; i++) {
		solverSet[i] = i + 1;
	}

	for (var pixel = (height/5); pixel < ((4 / 5) * height); pixel++) {
		for (var ladder = 0; ladder < Ladders.length; ladder++) {
			for (var elementLeft = 0; elementLeft < Ladders[ladder].leftRungs.length; elementLeft++) {
				if(Ladders[ladder].leftRungs[elementLeft] == pixel)
				{
					swapValuesLeft(ladder);
				}
			}
			for (var elementRight = 0; elementRight < Ladders[ladder].rightRungs.length; elementRight++) {
				if(Ladders[ladder].rightRungs[elementRight] == pixel)
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
		sameCounter += Ladders[i].leftRungs.length;
		sameCounter += Ladders[i].rightRungs.length;
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
	{return (true);}else
	{return (false);}
}

function setMovingRung(startX,startY)
{
	for(var i = 0;i<numRails;i++)
	{
		if(startX<getRight(i) && startX>getLeft(i))
		{
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
