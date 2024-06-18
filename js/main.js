/*** navMenu ***/

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".navbar");
const arrows = document.querySelector (".arrows")

hamburger.addEventListener("click", mobileMenu);
arrows.addEventListener("click", Scroll);

function mobileMenu() {
    let v = navMenu.getBoundingClientRect();   
    if (v.top > 100) navMenu.scrollIntoView();
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

function Scroll() {
    let z = arrows.getBoundingClientRect();
    if (z.top > 100) navMenu.scrollIntoView();
}

const navLink = document.querySelectorAll(".navbar a");

navLink.forEach(n => n.addEventListener("click", closeMenu));

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

/*** rain effect ***/

function lines (){
    let sizeW = Math.random() * 12;
    let duration = Math.random () * 3;
    let e = document.createElement ('div');
    e.setAttribute ('class', 'circle');
    document.body.appendChild (e)
    
    e.style.width = 2+ sizeW+'px';
    e.style.left = Math.random () * ( innerWidth - 6 )+'px';
    e.style.animationDuration = 2 + duration + 's';

    setTimeout(function() {
        document.body.removeChild(e)
    }, 5000);
}

setInterval (function(){
    lines ();
},200) 

/*** carrousel ***/

const slidesContainer = document.querySelector(".slides-container");
const slide = document.querySelector(".slide");
const prevButton = document.querySelector(".arrow-prev");
const nextButton = document.querySelector(".arrow-next");

nextButton.addEventListener("click", foward)
                            
function foward() {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft += slideWidth;
}

prevButton.addEventListener("click", backward)
    
function backward(){
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft -= slideWidth;
};

