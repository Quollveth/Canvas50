// DOM ELEMENTS

const carouselBody = document.getElementById('galleryCarousel');
const carouselWrapper = document.getElementById('galleryWrapper');
const indicatorsWrapper = document.getElementById('carousel-indicators');

var savedCanvas = JSON.parse(localStorage.getItem(canvasStorageName));

if(savedCanvas == null){
    addCarouselItem();
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

        let options = document.createElement('div');
        options.classList.add('carousel-caption');
        
        let btnLoad = document.createElement('button');
        btnLoad.classList.add('btn-default');
        btnLoad.addEventListener('click',e => {
            loadImage(e.target.parentNode.id);
        });
        btnLoad.innerText = 'Load';
    
        let btnDel = document.createElement('button');
        btnDel.classList.add('btn-default');
        btnDel.addEventListener('click',e => {
            deleteImage(e.target.parentNode.id);
        });
        btnDel.innerText = 'Delete';
    
        options.appendChild(btnLoad);
        options.appendChild(btnDel);

        newItem.appendChild(options);
        
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

function loadImage(id){

}

function deleteImage(id){

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