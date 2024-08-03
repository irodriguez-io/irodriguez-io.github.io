/*** Lock Potrait Mode ***/

  function lockOrientation() {
      // Check if the screen orientation API is supported
      if (screen.orientation) {
          screen.orientation.lock("portrait").catch(function(error) {
              console.log("Orientation lock failed: ", error);
          });
      } else {
          console.warn("Screen Orientation API not supported");
      }
  }

// Lock orientation on page load
window.addEventListener("load", lockOrientation);

// Optionally lock orientation on orientation change
window.addEventListener("orientationchange", lockOrientation);

/*** navMenu ***/
const navMenu = document.querySelector (".navbar")
const hamburger = document.querySelector(".hamburger");
const arrows = document.querySelector (".arrows");
const about = document.querySelector ("#about");

hamburger.addEventListener("click", mobileMenu);
arrows.addEventListener("click", Scroll);

function mobileMenu() { 
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
}

function Scroll() {
  about.scrollIntoView();
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


/*** Text Animation ***/

//speed at which text appears and disappears
const TEXT_UPDATING_SPEED = 55

//duration of type cursor blink animation
const BLINK_ANIM_DURATION = 2400

// chabge textArr depending on document language

const Docu = document.querySelector ("html")

const Lang = Docu.getAttribute("lang")

let textArr = []

if (Lang == "en-US") {
  textArr = [
  "Cyber Security",
  "Risk Management",
  "Business Continuity",
  "Regulatory Compliance",
  "Web Developement",
  ]
  }else { textArr = [
  "Cyber Seguridad",
  "Gestion de Riesgo",
  "Continuidad del Negocio",
  "Cumplimiento Normativo",
  "Desarrollo Web",
  ]}

let currentTextIndex = -1

const myText = document.querySelector(".text")
const typeCursor = document.querySelector(".cursor")

const addLetter = (letterIndex) => {
  //if reached the end of the text stop adding letters and animate cursor blink
  if (letterIndex >= textArr[currentTextIndex].length) {
    blinkTypeCursor()
    return
  }
  setTimeout(() => {
    //logic behind adding text
    myText.textContent += textArr[currentTextIndex][letterIndex]
    //recursion: call addLetter to add the next letter in the text
    addLetter(letterIndex + 1)
  }, TEXT_UPDATING_SPEED)
}

//remove letter with recursion
const removeLetter = (letterIndex) => {
  //if removed all stop removing letters and call updateText to start animating the next text
  if (letterIndex < 0) {
    updateText()
    return
  }
  setTimeout(() => {
    //logic behind removing text with slice
    myText.textContent = textArr[currentTextIndex].slice(0, letterIndex)
    //recursion: call removeLetter to remove the previous letter in the text
    removeLetter(letterIndex - 1)
  }, TEXT_UPDATING_SPEED)
}

//blink the cursor when not updating text
const blinkTypeCursor = () => {
  //add blink by adding blink animation class from css
  typeCursor.classList.add("blinkAnim")
  setTimeout(() => {
    //stop blinking by removing blink class 
    typeCursor.classList.remove("blinkAnim")
    // call removeLetter to start removing letter
    removeLetter(textArr[currentTextIndex].length)
  }, BLINK_ANIM_DURATION)
}

const updateText = () => {
  //change current text index to switch to next text
  currentTextIndex++
  //loop back if reached the end
  if (currentTextIndex === textArr.length) {
    currentTextIndex = 0
  }
  //call addLetter
  addLetter(0)
}

//initial text update after 1 seconds
setTimeout(() => updateText(), 1000)

/*** carrousel ***/

const slidesContainer = document.querySelector(".slides-container");
const slide = document.querySelector(".slide");
const prevButton = document.querySelector(".arrow-prev");
const nextButton = document.querySelector(".arrow-next");

nextButton.addEventListener("click", foward)
                            
function foward() {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft -= slideWidth;
}

prevButton.addEventListener("click", backward)
    
function backward(){
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft += slideWidth;
};

