//GLOBAL SCRIPT

//starts up all tooltips
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});

//local storage for canvas
const canvasStorageName = 'savedCanvas';
localStorage.removeItem(canvasStorageName);

function saveCanvasLocal(canvas){
  let saved = localStorage.getItem(canvasStorageName);
  let canvasArray = [];
  
  if(saved != null){
    canvasArray = JSON.parse(saved);
  }

  let newCanvas = JSON.parse(JSON.stringify(canvas));
  //there has to be a better way to copy an object without a reference so the new 2 lines don't delete the fields from the original one
  delete newCanvas.nCells;
  delete newCanvas.cellElements;

  canvasArray.push(newCanvas);

  localStorage.setItem(canvasStorageName,JSON.stringify(canvasArray));

  console.log(localStorage.getItem(canvasStorageName));
}