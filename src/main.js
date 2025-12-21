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
// // // `
// <div class="border-[2px] border-black px-6 py-2 flex items-center justify-center gap-3">
//               <svg class = "h-[40px] w-fit relative" fill="#16302b"  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="800px"
//                 height="800px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">

//               <g id="c133de6af664cd4f011a55de6b001a2b">

//               <path display="inline" d="M204.064,46.682v22.018h-56.302V0.501h56.302v24.13h-32.172v22.051H204.064z M261.941,24.631h22.492
//                   V0.501h-56.308c0,0,0,12.112,0,24.13c7.533,7.533,11.461,11.139,22.356,22.034c-6.369,0-22.356,0.022-22.356,0.021v22.014h56.308
//                   V46.682L261.941,24.631z M341.746,24.631h22.49V0.501H307.93c0,0,0,12.112,0,24.13c7.531,7.533,11.461,11.139,22.355,22.034
//                   c-6.365,0-22.355,0.022-22.355,0.021v22.014h56.307V46.682L341.746,24.631z M438.395,101.112l-34.203,370.486l-148.193,39.9
//                   l-148.196-39.9L73.605,101.112H438.395z M369.477,176.444H255.865h-115.62l5.529,44.739h110.091h6.184l-6.184,2.574
//                   l-106.067,44.177l3.518,43.73l102.549,0.333l54.963,0.175l-3.521,58.311l-51.442,14.484v-0.046l-0.422,0.116l-49.684-12.542
//                   l-3.015-36.195h-0.164h-46.085h-0.162l6.032,69.876l93.5,27.649v-0.05l0.168,0.05l93-27.146L361.1,267.935H255.865h-0.26
//                   l0.26-0.112l109.086-46.639L369.477,176.444z">

//               </path>

//               </g>
// ACF LOGO <svg class="h-[40px] w-fit" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 460"><path fill="#e6e6e6" d="M180.81 0h14.25l62.52.5a1.1 1.09-10.5 0 1 1 .68L320 150.19a.27.27 0 0 0 .5-.01C383.41-10.21 590.05-47.91 704.65 81.15a.2.2 0 0 0 .35-.14V1.98a.46.46 0 0 1 .46-.46l294.54.07v106.22l-185.01-.03q-.49 0-.49.49v82.23q0 .5.5.5h173.75q.5 0 .5.5l.01 101.95a.35.35 0 0 1-.56.28q-.31-.23-.7-.23H815.2a.74.74 0 0 0-.74.74L814.3 460H705.19l-.13-77.54q0-1.13-.75-.28c-66.74 75.37-172.34 98.16-264.59 57.35q-.55-.25-.32.31l7.02 16.98a.25.25 0 0 1-.23.34l-122.07-.56q-.55 0-.75-.52l-25.43-64.55q-.18-.46-.68-.46l-154.47-.24a.44.42-78.9 0 0-.4.28l-25.11 65.42q-.28.72-1.05.72l-115.78.01a.29.28-78.8 0 1-.26-.4L180.81 0Zm265.88 322.81c67.43 64.54 178.29 35.39 206.86-53.33a.72.71 9 0 1 .68-.49l50.27.02a.51.5-90 0 0 .5-.51v-74a.5.5 0 0 0-.5-.5h-50.22q-.44 0-.59-.42-16.23-48.14-59.32-72.5c-61.6-34.82-140.13-10.12-172.61 51.94-25.98 49.65-16 110.62 24.93 149.79Zm-263.8-35.53a.35.35 0 0 0 .33.47l75.06-.44a.35.35 0 0 0 .33-.47l-38.62-104.95a.35.35 0 0 0-.66.01l-36.44 105.38Z"/></svg>
//               </svg>
//               <h6 class="text-2xl font-black text-black relative top-[2px]">CSS</h6>
//             </div>

// // setupCounter(document.querySelector('#counter'))

import { gsap } from "gsap";
    
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(DrawSVGPlugin,MotionPathPlugin,ScrollTrigger,ScrollSmoother,ScrollToPlugin,SplitText);

// gsap.registerPlugin(
//   ScrollTrigger,
//   ScrollSmoother,
//   SplitText,
//   ScrollToPlugin,
//   DrawSVGPlugin,
//   MotionPathPlugin
// );

$(document).ready(function () {
  console.log("Hello Devs! My Portfolio Revamp is WIP :)");
  var headerHeight = $(".header-main").outerHeight(true);
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: ScrollTrigger.isTouch ? 0 : 1.1, // disable smooth on touch devices
    effects: true,
    normalizeScroll: !ScrollTrigger.isTouch, // only normalize scroll on desktop
  });

  $('nav a[href^="#"]').on("click", function (e) {
    const target = $(this).attr("href");

    if (!target || target === "#") return;

    const $section = $(target);
    if (!$section.length) return;

    e.preventDefault();

    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: $section[0],
        offsetY: 0,
      },
      ease: "power2.out",
    });
  });

  const $cursorFlwr = $(".cursor-flwr");
  const $cursorPntr = $(".cursor-pntr");

  var mouseX = (event) => event.clientX;
  var mouseY = (event) => event.clientY;

  var positionElement = (event) => {
    var mouse = {
      x: mouseX(event),
      y: mouseY(event),
    };

    // Smoothly update the cursor position using CSS transform
    $cursorFlwr.css({
      transform: `translate3d(${mouse.x - 0}px, ${mouse.y - 0}px, 0)`,
    });

    $cursorPntr.css({
      transform: `translate3d(${mouse.x - 0}px, ${mouse.y - 0}px, 0)`,
    });
  };

  // Throttling the mousemove event
  var timer = false;
  $(window).on("mousemove", function (event) {
    clearTimeout(timer); // Clear any previous timeouts
    timer = setTimeout(function () {
      positionElement(event); // Call positionElement after 1ms
    }, 1);
  });

  $(document).on("click", function () {
    $cursorFlwr.addClass("expand");
    setTimeout(function () {
      $cursorFlwr.removeClass("expand");
    }, 180);
  });

  $(".hvr-crsr").hover(
    function () {
      $cursorFlwr.addClass("hovered");
    },
    function () {
      $cursorFlwr.removeClass("hovered");
    }
  );

  $(".proj-cta-bg").hover(
    function () {
      const shareIcon = gsap.timeline();

      shareIcon
        .fromTo(
          ".boxshare",
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.25, ease: "power2.out" }
        )
        .fromTo(
          ".arrowshare",
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.25, ease: "power2.out" },
          ">"
        )
        .to(".arrowshare", {
          x: 2.5,
          y: -2.5,
          duration: 0.5,
          ease: "power2.out",
        });
    },
    function () {
      gsap.to(".arrowshare", {
        x: -1,
        y: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  );

  $(".prj-cta-non, .prj-cta-bg").hover(
    function () {
      const gitAnimation = gsap.timeline();

      gitAnimation
        // set initial stroke/fill
        .set("#projcat", { fill: "transparent", stroke: "#e6e6e6" })
        // animate the stroke drawing
        .fromTo(
          "#projcat",
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.8, ease: "power2.out" }
        )
        // fill the shape at the end
        .to("#projcat", {
          fill: "#e6e6e6",
          duration: 0.3,
          ease: "power1.inOut",
        });
    },
    function () {
      gsap.to("#projcat", {
        stroke: "transparent",
        fill: "#e6e6e6", // also reset fill
        duration: 0.5,
        ease: "power1.inOut",
      });
    }
  );

  $(".cta-plane").hover(
    function () {
      // circle + scale
      gsap.to(".planesvg", {
        duration: 1,
        scale: 2,
        ease: "power2.out",
        motionPath: {
          path: [
            { x: 50, y: 0 },
            { x: 0, y: -50 },
            { x: -50, y: 0 },
            { x: 0, y: 0 },
            { x: 5, y: 0 },
          ],
          autoRotate: true,
          curviness: 1.5,
        },
        onComplete() {
          // start shake after motion
          gsap.to(".planesvg", {
            x: "+=2",
            duration: 0.03,
            repeat: -1,
            yoyo: true,
            ease: "none",
          });
        },
      });
    },
    function () {
      gsap.killTweensOf(".planesvg");

      gsap.to(".planesvg", {
        duration: 1,
        scale: 1,
        x: 0,
        ease: "power2.out",
      });
    }
  );

  $('.clck2copy').on('click', function () {
    const text = $('.clck2copy-email').text();

    navigator.clipboard.writeText(text).then(() => {
      $('.clck2copy-status').text('COPIED !');
      $('.copy-svg').hide();
      $('.copied-svg').show();
    }).catch(() => {
      $('.clck2copy-status').text('FAILED TO COPY');
    });
  });

  gsap.fromTo(
    ".online",
    { opacity: 1 },
    {
      opacity: 0.5,
      duration: 1,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    }
  );

  var headerTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".home-landing-section",
      start: "center-=100 top",
      toggleActions: "play none none reverse",
    },
  });

  headerTL
    .from(".header-bg", {
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
    })
    .from(
      ".header-border",
      {
        clipPath: "inset(0% 100% 0% 0%)", // hidden from top
        duration: 0.5,
        ease: "power2.out",
      },
      "<"
    );

  var projRow = $(".projects-row").outerWidth(true);
  var sectionWidth = $(".max-container").width();
  var totalWidthProj = projRow - sectionWidth;

  var projectsTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".projects-section",
      start: "top+=" + headerHeight + " top+=" + headerHeight,
      pin: true,
      pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
      anticipatePin: 2,
      scrub: true,
      end: () => "+=" + totalWidthProj / 3,
      // markers: true,
    },
  });

  projectsTL
    .to(".projects-row", {
      x: "-" + totalWidthProj + "px",
      ease: "none",
    })
    .to(
      ".projects-grid",
      {
        backgroundPositionX: "-" + totalWidthProj / 10 + "px",
      },
      "<"
    );

  var totalCards = $(".projects-card").length;
  $(".projects-card").each(function (index, element) {
    // Show Project Card
    gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 80,
        scale: 0.9,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scale: 1,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          containerAnimation: projectsTL,
          start: "center right",
          end: "end right-=200",
          scrub: true,
          // markers: true,
        },
      }
    );

    // Count Current Project Card
    let current = String(index + 1).padStart(2, "0");
    $(".all-project-count").text(String(totalCards).padStart(2, "0"));
    ScrollTrigger.create({
      trigger: element,
      containerAnimation: projectsTL,
      start: "left center-=300",
      scrub: true,
      // markers: true,
      onEnter: () => {
        $(".project-count").text(current);
      },

      onEnterBack: () => {
        $(".project-count").text(current);
      },
    });
  });

  ScrollTrigger.create({
    trigger: ".projects-row",
    containerAnimation: projectsTL,
    start: "left left",
    end: "right right",
    scrub: true,
    onUpdate: (self) => {
      let percent = Math.round(self.progress * 100);

      $(".progress-value").text(percent + "%");

      $(".progress-fill").css("width", percent + "%");
    },
  });

  ["chapter1", "chapter2", "chapter3"].forEach((ch) => {
    // Pin headers
    gsap.timeline({
      scrollTrigger: {
        trigger: `.${ch}-header`,
        start: "top top+=" + headerHeight,
        endTrigger: `.${ch}-contents`,
        end: "bottom top+=" + (100 + headerHeight),
        pin: `.${ch}-header`,
        pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
        pinSpacing: false,
        // markers: true
      },
    });

    // Animate background Y with scroll
  });

  gsap.to(`.chapter3`, {
    backgroundPositionY: "-" + 5 + "px", // adjust to your total scroll distance
    ease: "none",
    scrollTrigger: {
      trigger: ".allchapters",
      start: "top top",
      end: "+=8000",
      scrub: true,
      // markers: true
    },
  });

  var slidingTextWidth = $(".sliding-text-row").outerWidth(true);
  var totalSlidingWidth = slidingTextWidth - sectionWidth;

  var slidingText = gsap.timeline({
    scrollTrigger: {
      trigger: ".sliding-text-section",
      start: "top 40%",
      pin: true,
      pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
      scrub: true,
      // markers: true,
      end: () => "+=" + totalSlidingWidth,
    },
  });

  slidingText.to(".sliding-text-row", {
    x: "-" + totalSlidingWidth + "px",
    ease: "none",
  });

  var slidingSvgHeight = $(".sliding-svg-section").outerHeight(true);
  ScrollTrigger.create({
    trigger: ".sliding-svg-section",
    start: "top top+=" + headerHeight,
    pin: true,
    pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
    endTrigger: ".skills-grid",
    end: "bottom top+=" + (slidingSvgHeight + headerHeight),
    pinSpacing: false,
    scrub: true,
    // markers: true,
  });

  var slideSVGLength = $(".sliding-svg-black").outerWidth(true) * 55;
  var slidingSVGTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".skills-section",
      start: "top bottom",
      end: () => "+=" + slideSVGLength * 5,
      scrub: true,
    },
  });

  slidingSVGTL
    .to(".sliding-svg-white div", {
      x: -+slideSVGLength + "px",
      ease: "none",
    })
    .to(
      ".sliding-svg-black div",
      {
        x: slideSVGLength + "px",
        ease: "none",
      },
      "<"
    );

  const gitAnimation = gsap.timeline();

  gitAnimation
    .fromTo(
      "#cat",
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 1.5, ease: "power2.out" }
    )
    .to(
      "#cat",
      {
        fill: "#e6e6e6", // change to whatever fill color you want
        duration: 0.3,
        ease: "power1.inOut",
      },
      ">"
    )
    .to("#cat", {
      stroke: "transparent",
      duration: 0.5,
      ease: "power1.inOut",
    }),
    "<";

  gsap.fromTo(
    ".lin",
    {
      drawSVG: "0%",
    },
    {
      drawSVG: "100%",
      duration: 2,
      ease: "power2.out",
    }
  );

  // setTimeout(() => {
  //   gsap.to("body", {
  //     overflow: "hidden",
  //   });
  //   gsap.to(".coming-soon-section", {
  //     top: 0,
  //     duration: 1,
  //   });

  //   gsap.to(".box", {
  //     rotate: 720,
  //     scale: 2,
  //     duration: 2,
  //     repeat: -1, // infinite loop
  //     yoyo: true,
  //     delay: 0.5,
  //   });

  //   const texts = ["Coming Soon!", "Work in Progress", "Hello World"];
  //   let index = 0;

  //   function animateText() {
  //     const el = $(".comingsoon");
  //     el.text(texts[index]);

  //     const split = new SplitText(el, { type: "lines,words,chars" });

  //     gsap.from(split.chars, {
  //       y: 300,
  //       stagger: 0.05,
  //       duration: 1,
  //       yoyo: true,
  //       repeat: 1, // goes up and down once
  //       repeatDelay: 0.7,
  //       ease: "power1.inOut",
  //       onComplete: () => {
  //         split.revert(); // clean up
  //         index = (index + 1) % texts.length; // move to next text
  //         animateText(); // recursively animate next text
  //       },
  //     });
  //   }

  //   animateText();
  // }, 30000);
}); //Eng ng Ready Function

let resizeTimer;
let prevWidth = jQuery(window).width();

jQuery(window).on("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    let newWidth = jQuery(window).width();
    if (newWidth !== prevWidth) {
      location.reload();
    }
    prevWidth = newWidth; // update for next check
  }, 100);
});
