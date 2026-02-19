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

// // setupCounter(document.querySelector('#counter'))
import $ from 'jquery';

import { gsap } from "gsap";
    
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(DrawSVGPlugin,MotionPathPlugin,ScrollTrigger,ScrollSmoother,ScrollToPlugin,SplitText);


$(document).ready(function () {
  console.log("Hello Devs! My Portfolio Revamp is WIP :)");


  
  var headerHeight = $(".header-main").outerHeight(true);
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: ScrollTrigger.isTouch ? 0 : 1, // disable smooth on touch devices
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
      duration: 0.5,
      scrollTo: {
        y: $section[0],
        offsetY: 0,
      },
      ease: "power2.out",
    });
  });
  
  $('.landingcta-secondary').on('click',function(){
    gsap.to(window,
      {
        duration: 0.5,
        scrollTo: "#projects-section",
        ease: "power2.out"
      }
    )
  });

    $('.landingcta-primary, .cta-plane').on('click',function(){
    gsap.to(window,
      {
        duration: 0.5,
        scrollTo: "#contact-section",
        ease: "power2.out"
      }
    )
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

  $(".cta-plane, .cta-plane-form").hover(
    function () {
      const $plane = $(this).find(".planesvg");

      gsap.to($plane, {
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
        onComplete: () => {
          // ✅ shake works now
          gsap.to($plane, {
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
      const $plane = $(this).find(".planesvg");

      gsap.killTweensOf($plane);

      gsap.to($plane, {
        duration: 1,
        scale: 1,
        x: 0,
        y: 0,
        rotation: 0,
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


    
  $('#projects-section').css('padding-top',(headerHeight+10)+"px");

  var projRow = $(".projects-row").outerWidth(true);
  var sectionWidth = $(".max-container").width();
  var totalWidthProj = projRow - sectionWidth;

  var projectsTL = gsap.timeline({
    scrollTrigger: {
      trigger: "#projects-section",
      start: "top top",
      pin: true,
      pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
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
          end: "end right-=250",
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
      start: "left center",
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
      end: () => "+=" + slideSVGLength * 4.5,
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

  setTimeout(() => {
    gsap.to("body", {
      overflow: "hidden",
    });
    gsap.to(".coming-soon-section", {
      top: 0,
      duration: 1,
    });

    gsap.to(".box", {
      rotate: 720,
      scale: 2,
      duration: 2,
      repeat: -1, // infinite loop
      yoyo: true,
      delay: 0.5,
    });

    const texts = ["Coming Soon!", "Work in Progress", "Hello World"];
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
        },
      });
    }

    animateText();
  }, 30000);



    $("#vinceForm").on("submit", function (e) {
              e.preventDefault(); // ⛔ stop reload

              emailjs.send("service_trvsn93", "template_3twd4qk", {
                name: $("#inpName").val(),
                email: $("#inpEmail").val(),
                time: new Date().toLocaleString(),
                message: $("#inpMessage").val()
              })
                .then(function (response) {
                  console.log("SUCCESS!", response.status, response.text);
                  alert("Your message has been sent successfully!");
                  $("#vinceForm")[0].reset();
                })
                .catch(function (error) {
                  console.error("FAILED...", error);
                  alert("Oops! Something went wrong. Please try again.");
                });
            });


}); //Eng ng Ready Function

let resizeTimer;
let prevWidth = $(window).width();

$(window).on("resize", function () {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    let newWidth = $(window).width();
    if (newWidth !== prevWidth) {
      location.reload();
    }
    prevWidth = newWidth; // update for next check
  }, 100);
});

 var servicesH = new SplitText('.landing1st, .landing2nd',
            {type: "lines,words,chars"}
        );

const landing1st = ["John Vincent", "Website", "Hello", "Web", "Design"];
const landing2nd = ["Barnachea", "Portfolio", "World", "Developer", "to Reality"];

function cycleText($el, words, hold) {
  // ScrollTrigger.refresh();
  let index = 0;
  let split;

  gsap.set($el, { autoAlpha: 1 });

  function animate() {
    $el.text(words[index]);

    // IMPORTANT: pass DOM element, not jQuery object
    split = new SplitText($el[0], {type:"lines,words,chars"});

    gsap.fromTo(
      split.chars,
      {
        y: 300,
        autoAlpha: 0
      },
      {
        y: 0,
        autoAlpha: 1,
        stagger: 0.04,
        duration: 0.5,
        ease: "power3.out",
        onComplete: function () {
          gsap.to(split.chars, {
            y: 300,
            autoAlpha: 0,
            stagger: 0.04,
            duration: 0.5,
            delay: hold,
            ease: "power3.in",
            onComplete: function () {
              split.revert();
              index = (index + 1) % words.length;
              animate();
            }
          });
        }
      }
    );
    // ScrollTrigger.refresh();
  }
  // ScrollTrigger.refresh();
  animate();
}

// INIT
$(window).on("load", function () {
  setTimeout(function () {
    cycleText($(".landing1st"), landing1st, 3);
    cycleText($(".landing2nd"), landing2nd, 2.7);
  }, 100);
  // ScrollTrigger.refresh();
});



