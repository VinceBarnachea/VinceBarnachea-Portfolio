// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// // document.querySelector('#app').innerHTML = `
// //   <div>
// //     <a href="https://vite.dev" target="_blank">
// //       <img src="${viteLogo}" class="logo" alt="Vite logo" />
// //     </a>
// //     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
// //       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
// //     </a>
// //     <h1>Hello Vite!</h1>
// //     <div class="card">
// //       <button id="counter" type="button"></button>
// //     </div>
// //     <p class="read-the-docs">
// //       Click on the Vite logo to learn more
// //     </p>
// //   </div>
// // `

// // setupCounter(document.querySelector('#counter'))
import { gsap } from "../node_modules/gsap/index.js";
    
import { ScrollTrigger } from "../node_modules/gsap/ScrollTrigger.js";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "../node_modules/gsap/ScrollSmoother.js";
import { SplitText } from "../node_modules/gsap/SplitText.js";

gsap.registerPlugin(ScrollTrigger,ScrollSmoother,SplitText);

gsap.to('.box',
  {
    rotate: 720,
    scale: 2,
    duration: 2,
    repeat: -1,   // infinite loop
    yoyo: true 
  }
);

var header = SplitText.create('.comingsoon',{ type: "words, chars" });

gsap.from(header.chars,
  {
    y: 300,
    stagger: 0.05,
    duration: 1,
        repeat: -1,   // infinite loop
    yoyo: true 
  }
)
