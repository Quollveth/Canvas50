//GLOBAL SCRIPT
//this is now a header file

const defaultX = 80;
const defaultY = 40;
const defaultCellSize = 10;

var CANVAS = {
  cellSize: defaultCellSize,
  sizeX: defaultX,
  sizeY: defaultY,
  nCells: defaultX * defaultY,
  //both arrays below represent the data of the cells, cellElements stores the actual DOM elements whiel cellData is serialized so it can be stored
  cellData: {},
  cellElements: []
}

//starts up all tooltips
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

//this is stupid
function copyObject(obj){
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  let copy = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      copy[key] = copyObject(obj[key]);
    }
  }

  return copy;
}

//local storage for canvas
const canvasStorageName = 'savedCanvas';

function saveCanvasLocal(canvas){
  let saved = localStorage.getItem(canvasStorageName);
  let canvasArray = [];
  
  if(saved != null){
    canvasArray = JSON.parse(saved);
  }

  let newCanvas = copyObject(canvas);
  delete newCanvas.nCells;
  delete newCanvas.cellElements;

  canvasArray.push(newCanvas);

  localStorage.setItem(canvasStorageName,JSON.stringify(canvasArray,function replacer(key, value) { return value}));
}