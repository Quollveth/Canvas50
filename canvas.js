// DOM ELEMENTS
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

//VARIABLES
const defaultGridSize = 16;
const defaultCellSize = 20;

let activeTool = 'draw';
let currentColor = '#000000';

let mouseDown = false;

let bordersActive = false;
let rainbowActive = false;
let previousCell = null;

var CANVAS = {
    cellSize: defaultCellSize,
    sizeX: defaultGridSize,
    sizeY: defaultGridSize,
    nCells: 0,
    //both arrays below represent the data of the cells, cellElements stores the actual DOM elements whiel cellData is serialized so it can be stored
    cellData: [],
    cellElements: []
}
colorInput.value = currentColor;

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

//FUNCTIONS
function updateGridSize(){
    gridSizeText.innerText = `Grid Size: ${CANVAS.sizeX} x ${CANVAS.sizeY}`;
    makeNewGrid();
}

function updateCellSize(){
    cellSizeText.innerText = `Cell Size: ${CANVAS.cellSize}`;
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

function serializeCell(cell){
    let obj = {};
    obj.id = cell.id;
    obj.color = cell.style.backgroundColor;

    return JSON.stringify(obj);
}

function makeNewGrid(){
    CANVAS.nCells = CANVAS.sizeX * CANVAS.sizeY;
    let currentElement;
    
    gridContainer.innerHTML = '';
    CANVAS.cellElements = [];
    for(let i=0;i<CANVAS.nCells;i++){
        currentElement = document.createElement('div');
        currentElement.id = `cell-${i}`;
        currentElement.style.backgroundColor = 'transparent';
        
        addCellListeners(currentElement);

        CANVAS.cellElements.push(currentElement);
        gridContainer.appendChild(currentElement);
    }
    gridContainer.style.gridTemplateColumns = `repeat(${CANVAS.sizeX}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${CANVAS.sizeY}, 1fr)`;

    updateCellSize();
    bordersActive = false;
    toggleGrid();
}

function saveCanvas(){
    CANVAS.cellElements.forEach(cell => {
        CANVAS.cellData.push(serializeCell(cell));
    });
    let savedCanvas = JSON.stringify(CANVAS,['cellSize','sizeX','sizeY','cellData']);
    console.log(savedCanvas);
}

//BUTTONS
function toggleDrawMode(){
    activeTool = 'draw';
    drawBtn.classList.add('btn-info');
    eraseBtn.classList.remove('btn-info');
}

function toggleEraseMode(){
    activeTool = 'erase';
    eraseBtn.classList.add('btn-info');
    drawBtn.classList.remove('btn-info');
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

updateGridSize();
toggleDrawMode();