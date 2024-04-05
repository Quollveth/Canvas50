// DOM ELEMENTS
const drawBtn = document.getElementById('buttonDraw');
const eraseBtn = document.getElementById('buttonErase');
const gridBtn = document.getElementById('buttonGrid');
const rainbowBtn = document.getElementById('buttonRainbow');
const rainbowImg = document.getElementById('rainbowImg');

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

let bordersActive = true;
let rainbowActive = false;
let previousCell = null;

var CANVAS = {
    nCells: defaultCellSize,
    cellSize: 20,
    sizeX: defaultGridSize,
    sizeY: defaultGridSize,
    cells: [],
    colorData: []
}

colorInput.value = currentColor;

//LISTENERS

//draw
gridContainer.addEventListener('mousedown',()=>{
    mouseDown = true;
});
gridContainer.addEventListener('mouseup',()=>{
    mouseDown = false;
});

//grid size
gridSizeSliderX.addEventListener('input',()=>{
    CANVAS.sizeX = gridSizeSliderX.value;
})
gridSizeSliderY.addEventListener('input',()=>{
    CANVAS.sizeY = gridSizeSliderY.value;
})

gridSizeSliderX.addEventListener('mouseup',()=>{
    updateGridSize();
})
gridSizeSliderY.addEventListener('mouseup',()=>{
    updateGridSize();
})

//cell size
cellSizeSlider.addEventListener('input',()=>{
    CANVAS.cellSize = cellSizeSlider.value;
})
cellSizeSlider.addEventListener('mouseup',()=>{
    updateCellSize();
})

//color
colorInput.addEventListener('input',()=>{
    currentColor = colorInput.value;
    previousCell = null; //if you changed the color you can click on the same cell again
})

//buttons
drawBtn.addEventListener('click',()=>{
    toggleDrawMode();
});
eraseBtn.addEventListener('click',()=>{
    toggleEraseMode();
});
gridBtn.addEventListener('click',()=>{
    toggleGrid();
});
rainbowBtn.addEventListener('click',()=>{
    toggleRainbow();
});
wipeButton.addEventListener('click',()=>{
    wipeGrid();
});

//FUNCTIONS
function updateGridSize(){
    gridSizeText.innerText = `Grid Size: ${CANVAS.sizeX} x ${CANVAS.sizeY}`;
    initializeGrid();
}

function updateCellSize(){
    cellSizeText.innerText = `Cell Size: ${CANVAS.cellSize}`;
    CANVAS.cells.forEach((cell => {
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
                cell.style.backgroundColor = '#F5F5F5';
            }
        }
    }
}

function initializeGrid(){
    gridContainer.innerHTML = '';
    nCells = CANVAS.sizeX * CANVAS.sizeY;
    let currentElement;
    CANVAS.cells = [];

    for(let i=0;i<nCells;i++){
        currentElement = document.createElement('div');
        currentElement.id = `cell-${i}`;
        currentElement.classList.add('cell');
        
        if(bordersActive){
            currentElement.classList.add('cellBorder');
        }
        currentElement.addEventListener('mouseover',(e)=>{
            e.target.classList.add('cellHover');
        });
        currentElement.addEventListener('mouseout',(e)=>{
            e.target.classList.remove('cellHover');
        });
        currentElement.addEventListener('mousemove',(e)=>{
            cellClick(e.target);
        });
        currentElement.addEventListener('click',(e)=>{
            cellClick(e.target,true);
        });
        currentElement.addEventListener('dragstart', e => {
            e.preventDefault();
        });
        CANVAS.cells.push(currentElement);
        gridContainer.appendChild(currentElement);
    }
    gridContainer.style.gridTemplateColumns = `repeat(${CANVAS.sizeX}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${CANVAS.sizeY}, 1fr)`;
    updateCellSize();
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
    if(bordersActive){
        for(let i=0;i<nCells;i++){
            CANVAS.cells[i].classList.remove('cellBorder');
            gridBtn.classList.remove('active');
            bordersActive = false;
        }
    } else{        
        for(let i=0;i<nCells;i++){
            CANVAS.cells[i].classList.add('cellBorder');
            gridBtn.classList.add('active');
            bordersActive = true;
        }
    }
}

function wipeGrid(){
    previousCell = null;
    initializeGrid();
}

updateGridSize();