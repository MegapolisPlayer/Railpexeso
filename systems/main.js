// colors
// https://cd.brandcloud.pro/document/47790/104659

//STATE

let renderState = {
	amountX: 10,
	amountY: 10,
	amount: 100,
	forMatch: 2,
	canvas: null,
	context: null,
	railbg: null,
	cardSizeX: 100,
	cardSizeY: 100,
	isFullscreen: false
};
 
let gameState = {
	score: 0,
	amountMoves: 0,
	//we save ids of cards, -1 means card removed
	cardImageIds: [],
	//the clicked cards
	clickedCardsList: [],
	currentMatchedCard: -1, //image id
	currentMatchedCardId: -1, //card id
	deletedCards: [],
	win: false
};

//frankly, it should be the "low score" because we count as little moves as possible
let highscore = {
	highmoves: Number.MAX_VALUE
};

//IMAGES
//Modify if you want to change them

let imageSources = [
	new ImageInfo("PKPIC SU160", "pkp/su160.jpg", "Lichen99", "CC-BY-SA 3.0"),
	new ImageInfo("PKPIC ED250", "pkp/ed250.jpg", "Jakub Halun", "CC-BY-SA 4.0"),
	new ImageInfo("PKPIC ED161", "pkp/ed161.jpg", "Jakub Murat", "CC-BY-SA 4.0"),
	new ImageInfo("KD 31WE", "pkp/31we.jpg", "Marcin Szala", "CC-BY-SA 4.0"),
	new ImageInfo("PKPIC EU07", "pkp/eu07.jpg", "Mateusz Wlodarczyk", "CC-BY-SA 4.0"),
	new ImageInfo("PKPIC EP09", "pkp/ep09.jpg", "Muri", "CC-BY-SA 4.0"),
	new ImageInfo("PKPIC E4DCUd", "pkp/e4dcu.jpg", "Ryszard Rusak", "CC-BY-SA 2.0"),
	new ImageInfo("PKPC ET22", "pkp/et22.jpg", "Akjam-Sen", "CC-BY-SA 4.0"),
	new ImageInfo("PKP Ty2", "pkp/ty2.jpg", "Radoslaw Kolodziej", "CC-BY-SA 3.0"),
	new ImageInfo("PKPIC SM42", "pkp/sm42.jpg", "Radoslaw Kolodziej", "CC-BY-SA 2.5"),
	new ImageInfo("PREG EN57", "pkp/en57.jpg", "MOs810", "CC-BY-SA 4.0"),
	new ImageInfo("ČD 680", "cd/680.jpg", "Honza Groh", "CC-BY-SA 3.0"),
	new ImageInfo("ČD InterPanter", "cd/660.jpg", "Khlok235", "CC-BY-SA 4.0"),
	new ImageInfo("ČD 810", "cd/810.jpg", "Vít Javůrek", "CC0"),
	new ImageInfo("ČD RegioFox", "cd/844.jpg", "PetrS.", "CC-BY-SA 3.0"),
	new ImageInfo("ČD Laminátka", "cd/240.jpg", "Йиржи", "CC0"),
	new ImageInfo("ČD Eso", "cd/363.jpg", "Mö1997", "CC-BY-SA 4.0"),
	new ImageInfo("ČD Taurus", "cd/1216.jpg", "PetrS.", "CC-BY-SA 4.0"),
	new ImageInfo("ČD Traxx", "cd/traxx.jpg", "ČD Cargo", "CC-BY-SA 4.0"),
	new ImageInfo("ČD Bardotka", "cd/751.jpg", "Rainerhaufe", "CC-BY-SA 3.0"),
	new ImageInfo("ČD Banán/150", "cd/150.jpg", "Rainerhaufe", "CC-BY-SA 4.0")
];

//we take names from image sources, not from loaded images
let loadedImages = [];

//FUNCTIONS

function winHandler() {
	gameState.win = true;
	renderState.context.font = "bold 50px sans-serif";
	renderState.context.fillStyle = "#000000";
	renderState.context.fillText(
		"You won in "+gameState.amountMoves+" moves!",
		renderState.canvas.width*0.5,
		renderState.canvas.height*0.25,
	);
	if(gameState.amountMoves < highscore.highmoves) {
		highscore.highmoves = gameState.amountMoves;
		document.getElementById("highmoves").innerHTML = highscore.highmoves;
		renderState.context.fillText(
			"New highscore!",
			renderState.canvas.width*0.5,
			renderState.canvas.height*0.5,
		);
	}
}

function resetHigh() {
	highscore.highmoves = Number.MAX_VALUE;
	document.getElementById("highmoves").innerHTML = "0";
}

function makeFullscreen() {
	renderState.canvas.requestFullscreen();
}

function drawBackground(ux = 0, uy = 0, sx = renderState.context.width, sy = renderState.context.height) {
	renderState.context.fillStyle = "#FFFFFF";
	renderState.context.fillRect(ux, uy, sx, sy);
	renderState.context.globalAlpha = 0.2; //20% opacity
	renderState.context.drawImage(
		renderState.railbg, 
		ux, uy, sx, sy,
		ux, uy, sx, sy
	);
	renderState.context.globalAlpha = 1.0;
}

function drawCard(xpos, ypos, imageId, xscale=1) {
	renderState.context.fillStyle = "#009FDA";
	renderState.context.fillRect(
		xpos*renderState.cardSizeX+(renderState.cardSizeX*0.05)+((1-xscale)/2)*renderState.cardSizeX, 
		ypos*renderState.cardSizeY+(renderState.cardSizeY*0.05), 
		renderState.cardSizeX*0.9*xscale, renderState.cardSizeY*0.9
	);
	renderState.context.drawImage(
		loadedImages[imageId], 
		xpos*renderState.cardSizeX+(renderState.cardSizeX*0.1)+((1-xscale)/2)*renderState.cardSizeX, 
		ypos*renderState.cardSizeY+(renderState.cardSizeY*0.1), 
		renderState.cardSizeX*0.8*xscale, renderState.cardSizeY*0.8
	);
	renderState.context.fillStyle = "#FFFFFF";
	renderState.context.fillText(
		imageSources[imageId].name,
		xpos*renderState.cardSizeX+(renderState.cardSizeX*0.5), 
		ypos*renderState.cardSizeY+(renderState.cardSizeY*0.8), 
		renderState.cardSizeX*xscale //max width
	);
}

function drawCardBack(xpos, ypos, xscale=1) {
	renderState.context.fillStyle = "#009FDA";
	renderState.context.fillRect(
		xpos*renderState.cardSizeX+(renderState.cardSizeX*0.05)+((1-xscale)/2)*renderState.cardSizeX, 
		ypos*renderState.cardSizeY+(renderState.cardSizeY*0.05),
		renderState.cardSizeX*0.9*xscale, renderState.cardSizeY*0.9
	);

	renderState.context.fillStyle = "#FFFFFF";
	renderState.context.fillText(
		"Railpexeso",
		xpos*renderState.cardSizeX+(renderState.cardSizeX*0.5),
		ypos*renderState.cardSizeY+(renderState.cardSizeY*0.5),
		renderState.cardSizeX*xscale //max width
	);
}

function undrawCard(xpos, ypos) {
	drawBackground(
		xpos*renderState.cardSizeX, ypos*renderState.cardSizeY,
		renderState.cardSizeX, renderState.cardSizeY
	);
}

const ANIMATION_AMOUNT_STEPS = 20;
const ANIMATION_TOTAL_TIME = 250; //in ms, for each part (togehter takes 2n ms)

const ANIMATION_SCALE_STEP = 1/ANIMATION_AMOUNT_STEPS;

async function promiseTimer(milliseconds) {
	return new Promise((resolve) => {
		window.setTimeout((resolver) => {
			resolver();
		}, milliseconds, resolve)
	});
}

async function animation(appear, front, xpos, ypos, imageId) {
	for(let i = 0; i < ANIMATION_AMOUNT_STEPS; i++) {
		undrawCard(xpos, ypos);

		let step = appear ? i : ANIMATION_AMOUNT_STEPS-i;

		if(front) {
			drawCard(xpos, ypos, imageId, ANIMATION_SCALE_STEP*step);
		} else {
			drawCardBack(xpos, ypos, ANIMATION_SCALE_STEP*step);
		}

		await promiseTimer(ANIMATION_TOTAL_TIME/ANIMATION_AMOUNT_STEPS);
	}
	//final touch
	if(appear) {
		front ? drawCard(xpos, ypos, imageId) : drawCardBack(xpos, ypos);
	}
	else {
		undrawCard(xpos, ypos);
	}
}

async function animatedDisappear(front, xpos, ypos, imageId) {
	await animation(false, front, xpos, ypos, imageId);
}
async function animatedAppear(front, xpos, ypos, imageId) {
	await animation(true, front, xpos, ypos, imageId);
}

//prevent spamming and breaking game
let listenerActive = false;

async function onclickListener(event) {
	if(listenerActive) return;
	listenerActive = true;

	if(gameState.win) {
		if(renderState.isFullscreen) {
			document.exitFullscreen(); //leave if we won
		}
		else {
			reset();
		}
	}

	gameState.amountMoves++;
	document.getElementById("moves").innerHTML = gameState.amountMoves;

	//get pos of canvas
	let adjustedCardX = renderState.cardSizeX;
	let adjustedCardY = renderState.cardSizeY;
	let fsOffset = 0;

	if(renderState.isFullscreen) {
		//multiply sizes by change of scale
		let scale = document.fullscreenElement.height/renderState.canvas.height;
		adjustedCardX *= scale;
		adjustedCardY *= scale;
		fsOffset = (window.screen.width-renderState.canvas.width)/2;
	}

	let mouseX = Math.trunc((event.pageX - event.target.offsetLeft - fsOffset)/adjustedCardX);
	let mouseY = Math.trunc((event.pageY - event.target.offsetTop)/adjustedCardY);
	let cardId = mouseY*renderState.amountX+mouseX;

	if(gameState.deletedCards.includes(cardId)) {
		listenerActive = false;
		return; //clicked on a deleted card
	}
	if(cardId == gameState.currentMatchedCardId) {
		listenerActive = false;
		return; //clicked on current card
	}

	console.log("Canvas clicked at card "+mouseX+" "+mouseY+" (id "+cardId+")");

	let newCard = gameState.cardImageIds[cardId];

	//back disappears (false), front appears (true)
	await animatedDisappear(false, mouseX, mouseY);
	await animatedAppear(true, mouseX, mouseY, newCard);

	//continuation
	if(newCard == gameState.currentMatchedCard || gameState.currentMatchedCard == -1) {
		gameState.clickedCardsList.push({x: mouseX, y: mouseY, id: cardId});
		gameState.currentMatchedCard = newCard;
		gameState.currentMatchedCardId = cardId;
		console.log("Matching: "+gameState.currentMatchedCard);

		//win condition
		if(gameState.clickedCardsList.length == renderState.forMatch) {
			gameState.score++;
			document.getElementById("score").innerHTML = gameState.score;
			console.log("Matched: "+gameState.currentMatchedCard);
			gameState.currentMatchedCard = -1;
	
			//remove all cards
			gameState.clickedCardsList.forEach((val) => {
				undrawCard(val.x, val.y);
				gameState.deletedCards.push(val.id);
			});
			gameState.clickedCardsList = [];
	
			//winning condition
			if(gameState.deletedCards.length == renderState.amount) {
				winHandler();
				listenerActive = false;
				return;
			}
		}
	}
	//new card
	else {
		//close all other cards
		gameState.clickedCardsList.forEach(async (val) => {
			await animatedDisappear(true, val.x, val.y, gameState.cardImageIds[val.id]);
			await animatedAppear(false, val.x, val.y);
		});
		gameState.clickedCardsList = [];
		gameState.clickedCardsList.push({x: mouseX, y: mouseY, id: cardId});
		gameState.currentMatchedCard = newCard;
		gameState.currentMatchedCardId = cardId;
	}

	listenerActive = false;
}

async function init() {
	console.log("Initializing...");

	//handle highscore resets

	let newxsize = Number(document.getElementById("xpexeso").value);
	let newysize = Number(document.getElementById("ypexeso").value);
	let newformatch = Number(document.getElementById("matchamount").value);

	if(
		renderState.amountX != newxsize || 
		renderState.amountY != newysize ||
		renderState.forMatch != newformatch
	) {
		highscore.highmoves = Number.MAX_VALUE;
		document.getElementById("highmoves").innerHTML = "0";
		console.log("Highscore reset!");
	}

	renderState.amountX = newxsize;
	renderState.amountY = newysize;
	renderState.forMatch = newformatch;

	//setup render state

	renderState.canvas = document.getElementById("field");
	renderState.canvas.removeEventListener("click", onclickListener);
	renderState.canvas.addEventListener("click", onclickListener);
	renderState.context = renderState.canvas.getContext("2d");

	renderState.canvas.onfullscreenchange = () => {
		renderState.isFullscreen = !renderState.isFullscreen;
	};

	let parentElementMinSize = Math.min(
		renderState.canvas.parentElement.offsetWidth,
		renderState.canvas.parentElement.offsetHeight
	);

	renderState.canvas.width = parentElementMinSize;
	renderState.canvas.height = parentElementMinSize;
	renderState.context.width = parentElementMinSize;
	renderState.context.height = parentElementMinSize;
	renderState.context.textAlign = "center";
	renderState.context.textBaseline = "middle"; //vertical align

	renderState.context.font = "bold 50px sans-serif";

	renderState.context.fillStyle = "#FFFFFF";
	renderState.context.fillText(
		"Loading pexeso...",
		renderState.canvas.width*0.5,
		renderState.canvas.height*0.25,
	);

	renderState.amount = renderState.amountX * renderState.amountY;

	let warning = document.getElementById("warningPlace");
	warning.innerHTML = ""; //clear old warning(s)
	warning.style.display = "none";
	
	if(renderState.amount > imageSources.length*renderState.forMatch) {
		//make square
		renderState.amountX = Math.trunc(Math.sqrt(imageSources.length*renderState.forMatch));
		renderState.amountY = renderState.amountX;
		renderState.amount = renderState.amountX*renderState.amountY;

		warning.style.display = "block";
		warning.innerHTML = 
			"Warning! Size of field larger than amount of cards. "+
			"Size has been reduced to "+renderState.amountX+" by "+renderState.amountY+" to avoid repetition.\n";
	}

	renderState.cardSizeX = renderState.canvas.width/renderState.amountX;
	renderState.cardSizeY = renderState.canvas.height/renderState.amountY;

	//all matches are equal
	let equalizer = renderState.amount % renderState.forMatch;
	if(equalizer != 0) {
		renderState.amount -= equalizer;
		warning.style.display = "block";
		warning.innerHTML += 
			"Warning! "+equalizer+" extra card"+(equalizer>1?"s":"")+" removed to make pexeso pairs match up correctly!"
		;
	}

	renderState.context.font = "bold "+ (renderState.context.height/10)/renderState.amountY +"px sans-serif";

	renderState.railbg = await loadImage(
		new ImageInfo("Background", "railbg.jpg", "Dietmar Rabich", "CC-BY-SA 4.0"),
		parentElementMinSize, parentElementMinSize //size overrides
	);

	//cannot use forEach since it uses callback (and it is a pain with promises)
	for(let i = 0; i < imageSources.length; i++) {
		loadedImages.push(await loadImage(imageSources[i]));
	}

	//setup game state

	document.getElementById("score").innerHTML = "0";
	document.getElementById("moves").innerHTML = "0";

	gameState.score = 0;
	gameState.amountMoves = 0;
	gameState.currentMatchedCard = -1;
	gameState.clickedCardsList = [];
	gameState.cardImageIds = [];
	gameState.deletedCards = [];
	gameState.win = false;

	//create empty card array

	let unoccupiedSpots = [];
	let unoccupiedImages = [];

	for(let i = 0; i < renderState.amount; i++) {
		gameState.cardImageIds.push(0);
		unoccupiedSpots.push(i);
	}
	for(let i = 0; i < imageSources.length; i++) {
		unoccupiedImages.push(i);
	}

	//shuffle and randomize
	//custom algo: AMOUNT MATCHES times -
	//a) find random unoccupied spot
	//b) place image there
	//c) remove image and spot from possibilities

	let pairsAmount = renderState.amount / renderState.forMatch;
	console.log("Match amount "+pairsAmount);
	for(let i = 0; i < pairsAmount; i++) {
		let imageIdId = Math.trunc(Math.random()*unoccupiedImages.length);
		for(let j = 0; j < renderState.forMatch; j++) {
			let spotId = Math.trunc(Math.random()*unoccupiedSpots.length);

			gameState.cardImageIds[unoccupiedSpots[spotId]] = unoccupiedImages[imageIdId];

			unoccupiedSpots.splice(spotId, 1);
		}
		unoccupiedImages.splice(imageIdId, 1);
	}

	console.log(gameState.cardImageIds);

	//draw initial

	drawBackground();
	for(let i = 0; i < renderState.amount; i++) {
		drawCardBack(i % renderState.amountY, Math.trunc(i / renderState.amountX));
	}

	console.log("Done!");
}

async function reset() {
	document.getElementById("score").innerHTML = 0;
	init();
}

init();
