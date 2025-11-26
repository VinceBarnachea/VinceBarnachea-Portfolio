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

  const $cursorFlwr = $('.cursor-flwr');
  const $cursorPntr = $('.cursor-pntr');

  var mouseX = (event) => event.clientX;
  var mouseY = (event) => event.clientY;

  var positionElement = (event) => {
      var mouse = {
          x: mouseX(event),
          y: mouseY(event)
      };

      // Smoothly update the cursor position using CSS transform
      $cursorFlwr.css({
          transform: `translate3d(${(mouse.x-0)}px, ${(mouse.y-0)}px, 0)`
      });

      $cursorPntr.css({
          transform: `translate3d(${(mouse.x-0)}px, ${(mouse.y-0)}px, 0)`
      });
  };

  // Throttling the mousemove event
  var timer = false;
  $(window).on('mousemove', function(event) {
      clearTimeout(timer); // Clear any previous timeouts
      timer = setTimeout(function() {
          positionElement(event); // Call positionElement after 1ms
      }, 1);
  });

  $(document).on('click', function() {
        $cursorFlwr.addClass('expand');
        setTimeout(function() {
            $cursorFlwr.removeClass('expand');
        }, 200);
    });

    setTimeout(() => {
        gsap.to('body',
          {
            overflow: "hidden",
          }
        );
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
              yoyo: true,
              delay: 0.5 
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
              delay: 0.5,
              repeatDelay: 0.5
            }
          )
    }, 3000);
});
