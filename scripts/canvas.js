//DOM ELEMENTS
const drawBtn = document.getElementById('buttonDraw');
const eraseBtn = document.getElementById('buttonErase');
const gridBtn = document.getElementById('buttonGrid');
const rainbowBtn = document.getElementById('buttonRainbow');
const rainbowImg = document.getElementById('rainbowImg');
const saveButton = document.getElementById('buttonSave');

const wipeButton = document.getElementById('confirmDelete');

const gridContainer = document.querySelector('.grid-container');
const colorInput = document.getElementById('drawColor');

const gridSizeText = document.getElementById('gridSizeText');
const gridSizeSliderX = document.getElementById('gridSizeX');
const gridSizeSliderY = document.getElementById('gridSizeY');

const cellSizeText = document.getElementById('cellSizeText');
const cellSizeSlider = document.getElementById('cellSize');

const makeSquareX = document.getElementById('makeSquareX');
const makeSquareY = document.getElementById('makeSquareY');

//VARIABLES
let activeTool = 'draw';
let currentColor = '#000000';

let mouseDown = false;

let bordersActive = false;
let rainbowActive = false;
let previousCell = null;

//js now has a preprocessor yay
//now i can load this file in multiple pages and the browser won't complain about 300 undefined references
//in any other page this will be null and all ifs will fail
const canvasTab = document.getElementById('CANVAS-HTML');

if(canvasTab){
//LISTENERS
//draw
gridContainer.addEventListener('mousedown',()=>{mouseDown = true;});
gridContainer.addEventListener('mouseup',()=>{mouseDown = false;});

//grid size
gridSizeSliderX.addEventListener('input',()=>{CANVAS.sizeX = gridSizeSliderX.value;})
gridSizeSliderY.addEventListener('input',()=>{CANVAS.sizeY = gridSizeSliderY.value;})

gridSizeSliderX.addEventListener('mouseup',()=>{updateGridSize();})
gridSizeSliderY.addEventListener('mouseup',()=>{updateGridSize();})

//cell size
cellSizeSlider.addEventListener('input',()=>{CANVAS.cellSize = cellSizeSlider.value;})
cellSizeSlider.addEventListener('mouseup',()=>{updateCellSize();})

//color
colorInput.addEventListener('input',()=>{
    currentColor = colorInput.value;
    previousCell = null; //if you changed the color you can click on the same cell again
})

//buttons
//yes these could be done with the onClick thing inside the buttons html, but it's not for reasons
drawBtn.addEventListener('click',()=>{toggleDrawMode();});
eraseBtn.addEventListener('click',()=>{toggleEraseMode();});
gridBtn.addEventListener('click',()=>{toggleGrid();});
rainbowBtn.addEventListener('click',()=>{toggleRainbow();});
wipeButton.addEventListener('click',()=>{wipeGrid();});
saveButton.addEventListener('click',()=>{saveCanvas();});
makeSquareX.addEventListener('click',()=>{makeGridSquare(true);});
makeSquareY.addEventListener('click',()=>{makeGridSquare(false);});

initialize();
}
//ENDIF

//FUNCTIONS
function updateGridSize(){
    if(canvasTab){updateUI();}
    makeNewGrid();
}

function updateCellSize(){
    if(canvasTab){updateUI();}
    CANVAS.cellElements.forEach((cell => {
        cell.style.minWidth = `${CANVAS.cellSize}px`;
        cell.style.minHeight = `${CANVAS.cellSize}px`;
    }));
}

function cellClick(cell,clicked = false){
    if(mouseDown || clicked){
        if(cell.id == previousCell){
            //do nothing
        } else {
            previousCell = cell.id;
            if(activeTool == 'draw'){
                if(rainbowActive){
                    //make a random color
                    currentColor = `#${((1 << 24) * Math.random() | 0).toString(16).padStart(6, "0")}`;
                    colorInput.value = currentColor;
                }
                cell.style.backgroundColor = `${currentColor}`;
            } else {
                //eraser tool
                cell.style.backgroundColor = 'transparent';
            }
        }
    }
}

function addCellListeners(cell){
    cell.addEventListener('mouseover',(e)=>{
        e.target.classList.add('cellHover');
    });
    cell.addEventListener('mouseout',(e)=>{
        e.target.classList.remove('cellHover');
    });
    cell.addEventListener('mousemove',(e)=>{
        cellClick(e.target);
    });
    cell.addEventListener('click',(e)=>{
        cellClick(e.target,true);
    });
    cell.addEventListener('dragstart', e => {
        e.preventDefault();
    });
}

function makeNewGrid(container = gridContainer,clickable = true){
    CANVAS.nCells = CANVAS.sizeX * CANVAS.sizeY;
    let currentElement;
    
    container.innerHTML = '';
    CANVAS.cellElements = [];
    for(let i=0;i<CANVAS.nCells;i++){
        currentElement = document.createElement('div');
        currentElement.id = `cell-${i}`;
        currentElement.style.backgroundColor = 'transparent';
        
        if(clickable){
            addCellListeners(currentElement);
        }

        CANVAS.cellElements.push(currentElement);
        container.appendChild(currentElement);
    }
    container.style.gridTemplateColumns = `repeat(${CANVAS.sizeX}, 1fr)`;
    container.style.gridTemplateRows = `repeat(${CANVAS.sizeY}, 1fr)`;

    updateCellSize();
    bordersActive = true;
    toggleGrid();
}

function saveCanvas(){
    CANVAS.cellData = {};
    //ignore transparent cells
    CANVAS.cellElements.filter(cell => {
        return cell.style.backgroundColor != 'transparent';
    }).forEach(cell => {
        CANVAS.cellData[cell.id] = cell.style.backgroundColor;
    });
    saveCanvasLocal(CANVAS);
}

function loadCanvas(toLoad,container = gridContainer,clickable = true){
    if(canvasTab){updateUI();}
    CANVAS.sizeX = toLoad.sizeX;
    CANVAS.sizeY = toLoad.sizeY;
    CANVAS.cellSize = toLoad.cellSize;
    
    makeNewGrid(container,clickable);

    CANVAS.cellElements.filter(cell => {
        return cell.id in toLoad.cellData;
    }).forEach(cell => {
        cell.style.backgroundColor = toLoad.cellData[cell.id];
    });
}

function updateUI(){
    gridSizeSliderX.value = CANVAS.sizeX;
    gridSizeSliderY.value = CANVAS.sizeY;
    cellSizeSlider.value = CANVAS.cellSize;
    gridSizeText.innerText = `Grid Size: ${CANVAS.sizeX} x ${CANVAS.sizeY}`;
    cellSizeText.innerText = `Cell Size: ${CANVAS.cellSize}`;
}

//BUTTONS
function toggleDrawMode(){
    activeTool = 'draw';
    drawBtn.classList.add('btn-info');
    eraseBtn.classList.remove('btn-info');
    previousCell = null; //when changing tools you can click on the same cell
}

function toggleEraseMode(){
    activeTool = 'erase';
    eraseBtn.classList.add('btn-info');
    drawBtn.classList.remove('btn-info');
    previousCell = null; //when changing tools you can click on the same cell
}

function toggleRainbow(){
    if(rainbowActive){
        rainbowActive = false;
        rainbowImg.src = 'imgs/rainbow-svgrepo-com(2).svg';
    } else {
        rainbowActive = true;
        rainbowImg.src = 'imgs/rainbow-svgrepo-com.svg';
    }
}

function toggleGrid(){
    CANVAS.cellElements.forEach(cell => {
        if(bordersActive){
            cell.classList.remove('cellBorder');
        }
        else {
            cell.classList.add('cellBorder');
        }
    });
    bordersActive = !bordersActive;    
}

function wipeGrid(){
    previousCell = null;
    makeNewGrid();
}

function makeGridSquare(fromX){
    if(fromX){
        CANVAS.sizeY = CANVAS.sizeX;
    }
    else {
        CANVAS.sizeX = CANVAS.sizeY;
    }
    makeNewGrid();
}

function initialize(){
    gridSizeSliderX.value = defaultX;
    gridSizeSliderY.value = defaultY;
    cellSizeSlider.value = defaultCellSize;
    updateGridSize();
    toggleDrawMode();
}