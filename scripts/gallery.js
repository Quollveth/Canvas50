// DOM ELEMENTS

const carouselBody = document.getElementById('galleryCarousel');
const carouselWrapper = document.getElementById('galleryWrapper');
const indicatorsWrapper = document.getElementById('carousel-indicators');


let savedCanvas = JSON.parse(localStorage.getItem(canvasStorageName));

function addCarouselItem(){
    let newItem = document.createElement('div');
    newItem.id = `ci-${carouselWrapper.children.length}`;
    newItem.classList.add('carousel-item');
    let itemBody;

    itemBody = document.createElement('img');
    itemBody.src = 'https://via.placeholder.com/500';
    let temp = document.createElement('p');
    temp.innerText = newItem.id;
    newItem.appendChild(temp);

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

console.log(CANVAS);