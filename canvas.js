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
const defaultSize = 16;

let activeTool = 'draw';
let sizeX = defaultSize;
let sizeY = defaultSize;
let currentColor = '#000000';
let nCells;
let cells = [];
let mouseDown = false;
let bordersActive = true;
let rainbowActive = false;
let previousCell = null;
let cellSize = 20;

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
    sizeX = gridSizeSliderX.value;
})
gridSizeSliderY.addEventListener('input',()=>{
    sizeY = gridSizeSliderY.value;
})

gridSizeSliderX.addEventListener('mouseup',()=>{
    updateGridSize();
})
gridSizeSliderY.addEventListener('mouseup',()=>{
    updateGridSize();
})

//cell size
cellSizeSlider.addEventListener('input',()=>{
    cellSize = cellSizeSlider.value;
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
    gridSizeText.innerText = `Grid Size: ${sizeX} x ${sizeY}`;
    initializeGrid();
}

function updateCellSize(){
    cellSizeText.innerText = `Cell Size: ${cellSize}`;
    cells.forEach((cell => {
        cell.style.minWidth = `${cellSize}px`;
        cell.style.minHeight = `${cellSize}px`;
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
    nCells = sizeX * sizeY;
    let currentElement;
    cells = [];

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
        cells.push(currentElement);
        gridContainer.appendChild(currentElement);
    }
    gridContainer.style.gridTemplateColumns = `repeat(${sizeX}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${sizeY}, 1fr)`;
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
            cells[i].classList.remove('cellBorder');
            gridBtn.classList.remove('active');
            bordersActive = false;
        }
    } else{        
        for(let i=0;i<nCells;i++){
            cells[i].classList.add('cellBorder');
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