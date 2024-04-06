//GLOBAL SCRIPT
//this is now a header file

const defaultX = 80;
const defaultY = 40;
const defaultCellSize = 10;
const canvasStorageName = 'savedCanvas';

var CANVAS = {
  cellSize: defaultCellSize,
  sizeX: defaultX,
  sizeY: defaultY,
  nCells: defaultX * defaultY,
  //both arrays below represent the data of the cells, cellElements stores the actual DOM elements whiel cellData is serialized so it can be stored
  cellData: {},
  cellElements: []
}

function test(){
  let toSave = '[{"cellSize":"50","sizeX":"4","sizeY":"4","cellData":{"cell-0":"rgb(0, 0, 0)","cell-2":"rgb(0, 0, 0)","cell-8":"rgb(0, 0, 0)","cell-9":"rgb(0, 0, 0)"}},{"cellSize":"50","sizeX":"4","sizeY":"4","cellData":{"cell-2":"rgb(237, 51, 59)","cell-3":"rgb(237, 51, 59)","cell-6":"rgb(237, 51, 59)","cell-7":"rgb(237, 51, 59)","cell-8":"rgb(229, 165, 10)","cell-9":"rgb(229, 165, 10)","cell-12":"rgb(229, 165, 10)","cell-13":"rgb(229, 165, 10)"}},{"cellSize":"50","sizeX":"4","sizeY":"4","cellData":{"cell-0":"rgb(246, 211, 45)","cell-1":"rgb(98, 160, 234)","cell-2":"rgb(98, 160, 234)","cell-3":"rgb(98, 160, 234)","cell-4":"rgb(98, 160, 234)","cell-5":"rgb(98, 160, 234)","cell-6":"rgb(98, 160, 234)","cell-7":"rgb(98, 160, 234)","cell-8":"rgb(51, 209, 122)","cell-9":"rgb(51, 209, 122)","cell-10":"rgb(51, 209, 122)","cell-11":"rgb(51, 209, 122)","cell-12":"rgb(51, 209, 122)","cell-13":"rgb(51, 209, 122)","cell-14":"rgb(51, 209, 122)","cell-15":"rgb(51, 209, 122)"}}]';
  localStorage.setItem(canvasStorageName,toSave);
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