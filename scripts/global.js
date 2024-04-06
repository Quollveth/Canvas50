//GLOBAL SCRIPT

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

function test(){
  console.log(localStorage.getItem(canvasStorageName));
}