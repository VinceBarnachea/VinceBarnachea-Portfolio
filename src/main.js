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
gsap.registerPlugin(ScrollTrigger,ScrollSmoother,SplitText);

$(document).ready(function(){
  console.log('Ready');

  ScrollSmoother.create({
        wrapper: "#smooth-wrapper",
        content: "#smooth-content",
        smooth: ScrollTrigger.isTouch ? 0 : 1.1, // disable smooth on touch devices
        effects: true,
        // normalizeScroll: !ScrollTrigger.isTouch, // only normalize scroll on desktop
    });


    setTimeout(() => {
        gsap.to('.coming-soon-section',
          {
              top: 0,
              duration: 1,
          }
        )

            gsap.to('.box',
            {
              rotate: 720,
              scale: 2,
              duration: 2,
              repeat: -1,   // infinite loop
              yoyo: true 
            }
          );

          var header = SplitText.create('.comingsoon',{ type: "lines, words, chars" });

          gsap.from(header.chars,
            {
              y: 300,
              stagger: 0.05,
              duration: 1,
                  repeat: -1,   // infinite loop
              yoyo: true,
              repeatDelay: 0.5
            }
          )
    }, 2000);
});
