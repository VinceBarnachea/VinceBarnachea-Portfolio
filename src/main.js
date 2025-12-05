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
gsap.registerPlugin(
  ScrollTrigger,
  ScrollSmoother,
  SplitText,
  DrawSVGPlugin,
  MotionPathPlugin
);

$(document).ready(function () {
  console.log("Hello Devs! My Portfolio Revamp is WIP :)");

  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: ScrollTrigger.isTouch ? 0 : 1.1, // disable smooth on touch devices
    effects: true,
    // normalizeScroll: !ScrollTrigger.isTouch, // only normalize scroll on desktop
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
      start: "top+=75 top+=75",
      pin: true,
      anticipatePin: 2,
      scrub: true,
      end: () => totalWidthProj / 2,
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


var allChaptersHeight = $('.allchapters').outerHeight(true);
["chapter1", "chapter2","chapter3"].forEach(ch => {
  // Pin headers
  gsap.timeline({
    scrollTrigger: {
      trigger: `.${ch}-header`,
      start: "top top+=75",
      endTrigger: `.${ch}-contents`,
      end: "bottom top+=175",
      pin: `.${ch}-header`,
      pinSpacing: false,
      // markers: true
    }
  });

  // Animate background Y with scroll
  gsap.to(`.${ch}`, {
    backgroundPositionY: "-" +(5)+"px", // adjust to your total scroll distance
    ease: "none",
    scrollTrigger: {
      trigger: '.allchapters',
      start: "top top",
      end: "+=8000",
      scrub: true,
      // markers: true
    }
  });
});













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

const texts = ["Coming Soon!", "Work in Progress","Hello World"];
let index = 0;

function animateText() {
  const el = $(".comingsoon");
  el.text(texts[index]);

  const split = new SplitText(el, { type: "lines,words,chars" });

  gsap.from(split.chars, {
    y: 300,
    stagger: 0.05,
    duration: 1,
    yoyo: true,
    repeat: 1, // goes up and down once
    repeatDelay: 0.7, 
    ease: "power1.inOut",
    onComplete: () => {
      split.revert(); // clean up
      index = (index + 1) % texts.length; // move to next text
      animateText(); // recursively animate next text
    }
  });
}

animateText();
  }, 20000);
}); //Eng ng Ready Function


let resizeTimer;
let prevWidth = jQuery(window).width();

jQuery(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        let newWidth = jQuery(window).width();
        if (newWidth !== prevWidth) {
            location.reload();
        }
        prevWidth = newWidth; // update for next check
    }, 100); 
});
