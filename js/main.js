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

/*** Brand wordmark typewriter — fire once when wordmark is fully visible
     (i.e. the sticky header has reached its pinned position at the top). ***/
const brandType = document.querySelectorAll(".brand-type");
if (brandType.length && "IntersectionObserver" in window) {
  const brandObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-typing");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 1 });
  brandType.forEach(el => brandObserver.observe(el));
}

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
  "Access is a system. Design it like one.",
  "Every workflow holds a credential. That makes it an identity.",
  "Granting access is easy. Removing it is the test.",
  "Identity engineering, and the automation around it.",
  ]
  }else { textArr = [
  "El acceso es un sistema. Diséñalo como tal.",
  "Todo flujo guarda una credencial. Eso lo vuelve una identidad.",
  "Dar acceso es fácil. Quitarlo es la prueba.",
  "Ingeniería de identidad, y la automatización a su alrededor.",
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
  //blink the cursor during the 1s pause before the first character appears
  if (letterIndex === 0) {
    typeCursor.classList.add("blinkAnim")
    setTimeout(() => {
      typeCursor.classList.remove("blinkAnim")
      myText.textContent += textArr[currentTextIndex][letterIndex]
      addLetter(letterIndex + 1)
    }, 1000)
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

prevButton.addEventListener("click", backward)

function backward() {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft -= slideWidth;
}

nextButton.addEventListener("click", forward)

function forward() {
  const slideWidth = slide.clientWidth;
  slidesContainer.scrollLeft += slideWidth;
}

/*** Hero animation ***/
/* Was <dotlottie-player>: a web component that pulled its renderer through a
   three-deep chain of dynamic imports, so the 64KB that does the actual drawing
   only started downloading after two round trips had already completed. This is
   lottie-web's light build instead -- one file, no waterfall, and the animation
   has no expressions, so the light build renders it identically.

   .lottie holds a reserved box and a CSS ring (see main.css) until the SVG is
   built. Failures and a hard timeout clear it too, so a load that never
   finishes does not leave the ring spinning forever. */

const lottieBox = document.querySelector(".lottie");
const lottieMount = document.getElementById("hero-lottie");

if (lottieBox && lottieMount && typeof lottie !== "undefined") {
  const lottieReady = () => lottieBox.classList.add("is-loaded");

  const heroAnimation = lottie.loadAnimation({
    container: lottieMount,
    renderer: "svg",
    loop: true,
    autoplay: true,
    path: "js/lottie/hero-identity.json",
  });

  // DOMLoaded is the point the SVG exists in the document; the other two are
  // there so a failed fetch or a malformed file still clears the ring.
  ["DOMLoaded", "data_failed", "error"].forEach(ev =>
    heroAnimation.addEventListener(ev, lottieReady)
  );
  setTimeout(lottieReady, 10000);
} else if (lottieBox) {
  // No player at all -- don't leave a ring spinning over an empty box.
  lottieBox.classList.add("is-loaded");
}
