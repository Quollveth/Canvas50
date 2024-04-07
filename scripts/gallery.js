// DOM ELEMENTS

const carouselBody = document.getElementById('galleryCarousel');
const carouselWrapper = document.getElementById('galleryWrapper');
const indicatorsWrapper = document.getElementById('carousel-indicators');

const loadButton = document.getElementById('buttonLoad');
const deleteButton = document.getElementById('confirmDelete');

const canvasSizeText = document.getElementById('canvasSize');

const exportField = document.getElementById('exportField');
const exportButton = document.getElementById('exportString');
const importButton = document.getElementById('importString');

var savedCanvas = JSON.parse(localStorage.getItem(canvasStorageName));

// BUTTON EVENTS
loadButton.addEventListener('click',()=>{loadImage();});
deleteButton.addEventListener('click',()=>{deleteImage();});

exportButton.addEventListener('click',()=>{exportCanvas();});
importButton.addEventListener('click',()=>{importCanvas();});

sessionStorage.setItem(loadCanvas,'null');
if(savedCanvas == null){
    addCarouselItem();

    loadButton.classList.add('disabled');
    deleteButton.classList.add('disabled');
    exportButton.classList.add('disabled');
}
else{
    savedCanvas.forEach(e => {
        addCarouselItem(e);
    });
}

function addCarouselItem(hasCanvas = null){
    let newItem = document.createElement('div');
    newItem.id = `ci-${carouselWrapper.children.length}`;
    newItem.classList.add('carousel-item');
    let itemBody;

    if(hasCanvas){
        itemBody = createCanvas(hasCanvas);        
    } else {
        itemBody = document.createElement('img');
        itemBody.src = 'imgs/placeholder.png';
    }
    
    newItem.appendChild(itemBody);
    
    let indicator = document.createElement('li');
    indicator.setAttribute('data-target','#galleryCarousel');
    indicator.setAttribute('data-slide-to',newItem.id);

    if(newItem.id == 'ci-0'){
        newItem.classList.add('active');
        indicator.classList.add('active');
    }

    carouselWrapper.appendChild(newItem);
    indicatorsWrapper.appendChild(indicator);
}

function getCanvasIndex(){
    let current;
    //only one element can be active at a time
    current = Array.from(carouselWrapper.children).find(e => {
        return e.classList.contains('active');
    });
    return (current)?current.id : null;
}

function getCurrentCanvas(){
    let index = getCanvasIndex();
    if(!index){ //is null
        return;
    }
    index = index.slice(3); //index starts at ci-0 and goes up
    
    return savedCanvas[parseInt(index)];
}

function loadImage(){    
    let toLoad = getCurrentCanvas();

    sessionStorage.setItem(loadCanvas,JSON.stringify(toLoad));
    
    location.href = '/';
}

function deleteImage(){

}

function exportCanvas(){

}

function importCanvas(){

}

function createCanvas(toCreate){
    let container = document.createElement('div');

    container.style.display = 'grid';

    //square grid
    if(toCreate.sizeX == toCreate.sizeY){
        container.style.width = '500px';
        container.style.height = '500px';
    }
    //rectangular grid
    else {
        //make the longer side fill the container, center it and the smaller side has to cope and seethe
        container.style.border = '2px dashed rgba(0, 0, 0, 0.8)';
        //is it wide or tall?
        if (toCreate.sizeX < toCreate.sizeY) {
            //wide
            container.style.width = '500px';
            container.style.height = `${(toCreate.sizeY / toCreate.sizeX) * 500}px`; // Maintain aspect ratio
            container.style.marginTop = `${(500 - (toCreate.sizeY / toCreate.sizeX) * 500) / 2}px`; // Center vertically
        }
        else {
            //tall
            container.style.height = '500px';
            container.style.width = `${(toCreate.sizeX / toCreate.sizeY) * 500}px`; // Maintain aspect ratio
            container.style.marginLeft = `${(500 - (toCreate.sizeX / toCreate.sizeY) * 500) / 2}px`; // Center horizontally
        }
    }

    loadCanvas(toCreate,container,false);

    let body = document.createElement('div');
    body.classList.add('carousel-canvas');
    body.appendChild(container);
    return body;
}