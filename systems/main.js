let renderState = {
    amountX: 10,
    amountY: 10,
    canvas: null,
    context: null,
    railbg: null,
    //every card has own canvas and context
    cardCanvases: [],
    cardContexts: []
};
 
let imageSources = [
    new ImageInfo("su160", "Lichen99", "CC-BY-SA 3.0"),
    new ImageInfo("ed250", "Jakub Halun", "CC-BY-SA 4.0"),
    new ImageInfo("ed161", "Jakub Murat", "CC-BY-SA 4.0"),
    new ImageInfo("31we", "Marcin Szala", "CC-BY-SA 4.0"),
    new ImageInfo("eu07", "Mateusz Wlodarczyk", "CC-BY-SA 4.0"),
    new ImageInfo("ep09", "Muri", "CC-BY-SA 4.0"),
    new ImageInfo("e4dcu", "Ryszard Rusak", "CC-BY-SA 2.0"),
    new ImageInfo("et22", "Akjam-Sen", "CC-BY-SA 4.0"),
    new ImageInfo("ty2", "Radoslaw Kolodziej", "CC-BY-SA 3.0"),
    new ImageInfo("sm42", "Radoslaw Kolodziej", "CC-BY-SA 2.5"),
    new ImageInfo("en57", "MOs810", "CC-BY-SA 4.0"),

];

let loadedImages = [];

function makeFullscreen() {
    renderState.canvas.requestFullscreen();
}

function resetGame() {

}

async function drawBackground() {
    renderState.context.drawImage(renderState.railbg, 0, 0, renderState.context.width, renderState.context.height);
}

async function drawCard(xpos, ypos, imageId) {
    renderState.context.drawImage(loadedImages[imageId], 10, 10, 80, 80);
}

async function init() {
    console.log("Initializing...");

    renderState.canvas = document.getElementById("field");
    renderState.context = renderState.canvas.getContext("2d");
    renderState.canvas.width = 500;
    renderState.canvas.height = 500;
    renderState.context.width = 500;
    renderState.context.height = 500;

    renderState.railbg = await loadImage(new ImageInfo("railbg.jpg", "Dietmar Rabich", "CC-BY-SA 4.0"));

    imageSources.forEach(async (val) => {
        loadedImages.push(await loadImage(val));
    });

    drawBackground();

    console.log("Done!");
}

init();
