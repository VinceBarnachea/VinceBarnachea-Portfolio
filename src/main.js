import $ from "jquery";

// Make jQuery global (important!)
window.$ = window.jQuery = $;
import("owl.carousel");
import { gsap } from "gsap";

import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// ScrollSmoother requires ScrollTrigger
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { SplitText } from "gsap/SplitText";

// FANCYBOX
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

import { Mascot } from "page-mascot";

gsap.registerPlugin(
  DrawSVGPlugin,
  MotionPathPlugin,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
);

// Make jQuery global BEFORE loading Owl

// Now load Owl (it will attach to window.jQuery)
// import "owl.carousel";

$(function () {
  console.log("Hello Devs! My Portfolio Revamp is WIP :)");

  var headerHeight = $(".header-main").outerHeight(true);
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: ScrollTrigger.isTouch ? 0 : 1, // disable smooth on touch devices
    effects: true,
    normalizeScroll: !ScrollTrigger.isTouch, // only normalize scroll on desktop
  });

  $.fn.marquee = function (opts) {
    const speed = (opts && opts.speed) || 60; // px per second
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    return this.each(function () {
      const track = this;
      const $track = $(track);
      const $parent = $track.parent();
      const $originals = $track.children().clone(); // pristine copy of one set
      let setWidth = 0,
        parentW = 0,
        x = 0,
        last = 0,
        paused = false,
        raf = 0;

      // Layout width that ignores transforms on parents (scale animations, etc.)
      const scaleOf = (el) =>
        el.getBoundingClientRect().width / el.offsetWidth || 1;

      function measure() {
        let w = 0;
        const s = scaleOf(track);
        $track
          .children()
          .slice(0, $originals.length)
          .each(function () {
            w += this.getBoundingClientRect().width / s;
          });
        return w;
      }

      function build() {
        // remember how far through the loop we are, so a rebuild doesn't snap back
        const progress = setWidth ? -x / setWidth : 0;

        $track.empty().append($originals.clone());
        setWidth = measure();
        parentW = Math.max($parent[0].clientWidth, window.innerWidth);

        const copies = Math.ceil(parentW / setWidth) + 1;
        for (let i = 0; i < copies; i++) {
          $originals.clone().attr("aria-hidden", "true").appendTo($track);
        }

        x = -progress * setWidth;
        last = 0;
        cancelAnimationFrame(raf);
        if (!reduce) raf = requestAnimationFrame(tick);
      }

      // Rebuild only if the numbers really changed (ignores rebuild's own changes)
      function check() {
        const w = measure();
        const p = Math.max($parent[0].clientWidth, window.innerWidth);
        if (Math.abs(w - setWidth) > 0.5 || Math.abs(p - parentW) > 0.5)
          build();
      }

      function tick(t) {
        if (!last) last = t;
        const dt = Math.min((t - last) / 1000, 0.05); // ignore long frame pauses
        last = t;
        if (!paused) {
          x -= speed * dt;
          x %= setWidth; // always lands inside one set
          track.style.transform = "translate3d(" + x + "px,0,0)";
        }
        raf = requestAnimationFrame(tick);
      }

      // Pause on hover
      // $track.on("mouseenter", () => (paused = true))
      //       .on("mouseleave", () => (paused = false));

      // Re-measure whenever the strip or its parent changes size
      let pending = 0;
      const schedule = () => {
        cancelAnimationFrame(pending);
        pending = requestAnimationFrame(check);
      };
      if ("ResizeObserver" in window) {
        const ro = new ResizeObserver(schedule);
        ro.observe($parent[0]);
        ro.observe(document.documentElement);
      } else {
        $(window).on("resize", schedule);
      }

      // Don't jump after the tab was hidden
      document.addEventListener("visibilitychange", () => {
        last = 0;
      });

      // Wait for fonts so widths are right, and re-check if more fonts load later
      document.fonts.ready.then(build);
      document.fonts.addEventListener?.("loadingdone", schedule);
    });
  };

  // PAGE MASCOT
  (() => {
    const SABLAY_HEADS = "/mascots/sablay-directions.webp";
    const SABLAY_FACES = "/mascots/sablay-reactions.webp";
    const mascotEl = document.getElementById("mascot");
    if (!mascotEl) return;

    // all 9 reactions: love, wink, laugh, confused, surprised, sad, shy, sleepy, cool
    const FACE_CELLS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    // random ranges (milliseconds / multipliers)
    const HOLD_MIN_MS = 1000,
      HOLD_MAX_MS = 1000; // how long the reaction stays
    const BOUNCE_MIN_MS = 500,
      BOUNCE_MAX_MS = 800; // how long the bounce lasts
    const STRETCH_MIN = 1.08,
      STRETCH_MAX = 1.22; // how tall the head stretches
    const BOUNCE_ON = true; // false turns the bounce off

    let faceHoldUntil = 0; // head tracking is paused until this timestamp
    let faceResetTimer;
    let bounceAnim = null;
    let cursorX = null,
      cursorY = null; // last known cursor position

    const calmMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const randBetween = (lo, hi) => lo + Math.random() * (hi - lo);

    // preload + decode both sheets so the first click has no delay
    [SABLAY_HEADS, SABLAY_FACES].forEach((sheetUrl) => {
      const preloadImg = new Image();
      preloadImg.src = sheetUrl;
      preloadImg.decode?.().catch(() => {});
    });

    // show cell 0–8 of a sheet (row-major, top-left to bottom-right)
    function drawCell(sheetUrl, cellIndex) {
      const cellCol = cellIndex % 3,
        cellRow = Math.floor(cellIndex / 3);
      mascotEl.style.backgroundImage = `url(${sheetUrl})`;
      mascotEl.style.backgroundPosition = `${cellCol * 50}% ${cellRow * 50}%`;
    }

    // head-only bounce with random strength; the bottom edge stays pinned
    function bounceMascot() {
      if (!BOUNCE_ON || calmMotion.matches || !mascotEl.animate) return;
      const stretch = randBetween(STRETCH_MIN, STRETCH_MAX); // e.g. 1.15
      const squash = 1 - (stretch - 1) * 0.55; // matching squash
      const wide = 1 + (stretch - 1) * 0.4; // sideways squish
      const thin = 1 - (stretch - 1) * 0.35;
      bounceAnim?.cancel();
      mascotEl.style.transformOrigin = "50% 100%";
      bounceAnim = mascotEl.animate(
        [
          { transform: "scale(1, 1)", offset: 0 },
          { transform: `scale(${wide}, ${squash})`, offset: 0.15 }, // squash down
          { transform: `scale(${thin}, ${stretch})`, offset: 0.4 }, // head stretches up
          {
            transform: `scale(${1 + (wide - 1) * 0.6}, ${1 - (1 - squash) * 0.5})`,
            offset: 0.65,
          }, // land
          { transform: `scale(1, ${1 + (stretch - 1) * 0.25})`, offset: 0.82 }, // small rebound
          { transform: "scale(1, 1)", offset: 1 },
        ],
        {
          duration: randBetween(BOUNCE_MIN_MS, BOUNCE_MAX_MS),
          easing: "cubic-bezier(.3,.7,.4,1)",
        },
      );
    }

    // point the head at the last known cursor position
    function aimHead() {
      if (cursorX === null || Date.now() < faceHoldUntil) return;
      const box = mascotEl.getBoundingClientRect();
      const offX = cursorX - (box.left + box.width / 2);
      const offY = cursorY - (box.top + box.height / 2);
      if (Math.hypot(offX, offY) < box.width * 0.5)
        return drawCell(SABLAY_HEADS, 4); // dead zone
      const diagonalBias = 0.4; // how diagonal before it counts
      const headCol =
        Math.abs(offX) < Math.abs(offY) * diagonalBias ? 1 : offX < 0 ? 0 : 2;
      const headRow =
        Math.abs(offY) < Math.abs(offX) * diagonalBias ? 1 : offY < 0 ? 0 : 2;
      drawCell(SABLAY_HEADS, headRow * 3 + headCol);
    }

    drawCell(SABLAY_HEADS, 4); // start looking straight ahead

    // poke: random face, random hold time, random bounce, then back to tracking
    mascotEl.addEventListener("click", () => {
      const nextFace =
        FACE_CELLS[Math.floor(Math.random() * FACE_CELLS.length)];
      const holdMs = Math.round(randBetween(HOLD_MIN_MS, HOLD_MAX_MS));

      faceHoldUntil = Date.now() + holdMs;
      drawCell(SABLAY_FACES, nextFace);
      bounceMascot();
      clearTimeout(faceResetTimer);
      faceResetTimer = setTimeout(() => {
        faceHoldUntil = 0;
        cursorX === null ? drawCell(SABLAY_HEADS, 4) : aimHead(); // resume tracking right away
      }, holdMs);
    });

    // head follows the cursor (desktop only, skipped on touch screens)
    if (matchMedia("(pointer: fine)").matches) {
      addEventListener("pointermove", (evt) => {
        cursorX = evt.clientX;
        cursorY = evt.clientY;
        aimHead();
      });
      // keep the head correct while the page scrolls under a still cursor
      addEventListener("scroll", aimHead, { passive: true });
    }
  })();

  // TIME
  const phTime = document.getElementById("phTime");
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  function updateTime() {
    phTime.textContent = fmt.format(new Date());
    // wake up exactly on the next minute
    setTimeout(updateTime, 60000 - (Date.now() % 60000));
  }
  updateTime();

  $("#marquee").marquee({ speed: 100 });

  $('nav a[href^="#"], .href-target a[href^="#"]').on("click", function (e) {
    const target = $(this).attr("href");

    if (!target || target === "#") return;

    const $section = $(target);
    if (!$section.length) return;

    e.preventDefault();

    gsap.to(window, {
      duration: 0.5,
      scrollTo: {
        y: $section[0],
        offsetY: headerHeight,
      },
      ease: "power2.out",
    });
  });

  let isHeaderButtonToggled = false;

  const $body = $("body");

  if ($(window).width() < 1025) {
    const burgerMenuTL = gsap.timeline({
      paused: true,
      defaults: { duration: 0.3, ease: "back.out(2)" },
    });

    const headerMenuTL = gsap.timeline({
      paused: true,
      defaults: { duration: 0.4, ease: "power2.out" },
    });

    burgerMenuTL
      .to(".brg-1", { y: 8 })
      .to(".brg-3", { y: -8 }, "<")
      .to(".brg-2", { autoAlpha: 0, scaleX: 0 }, "<")
      .to(".brg-1", { rotation: 45 })
      .to(".brg-3", { rotation: -45 }, "<");

    headerMenuTL.fromTo(
      ".nav-menu",
      {
        y: "-100%",
        backgroundColor: "#16302bcc",
      },
      {
        y: 0,
        backgroundColor: "#16302bcc",
      },
    );

    $(".burger-container").on("click", function () {
      isHeaderButtonToggled = !isHeaderButtonToggled;

      if (isHeaderButtonToggled) {
        burgerMenuTL.play();
        headerMenuTL.play();
        $body.css("overflow", "hidden");
      } else {
        headerMenuTL.reverse();
        burgerMenuTL.reverse();
        $body.css("overflow", "auto");
      }
    });
  }

  $(".landingcta-secondary").on("click", function () {
    gsap.to(window, {
      duration: 0.5,
      scrollTo: "#projects-section",
      ease: "power2.out",
    });
  });

  $(".landingcta-primary, .cta-plane").on("click", function () {
    gsap.to(window, {
      duration: 0.5,
      scrollTo: "#contact-section",
      ease: "power2.out",
    });
  });

  const $cursorFlwr = $(".cursor-flwr");
  const $cursorPntr = $(".cursor-pntr");

  let mouseX = 0;
  let mouseY = 0;
  let rafId = null;

  function updateCursor() {
    const transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    $cursorFlwr.css("transform", transform);
    $cursorPntr.css("transform", transform);

    rafId = null;
  }

  $(window).on("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(updateCursor);
    }
  });

  $(document).on("click", () => {
    $cursorFlwr.addClass("expand");

    setTimeout(() => {
      $cursorFlwr.removeClass("expand");
    }, 180);
  });

  $(".hvr-crsr").hover(
    () => $cursorFlwr.addClass("hovered"),
    () => $cursorFlwr.removeClass("hovered"),
  );

  $(".proj-cta-bg").hover(
    function () {
      const shareIcon = gsap.timeline();

      shareIcon
        .fromTo(
          ".boxshare",
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.25, ease: "power2.out" },
        )
        .fromTo(
          ".arrowshare",
          { drawSVG: "0%" },
          { drawSVG: "100%", duration: 0.25, ease: "power2.out" },
          ">",
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
    },
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
          { drawSVG: "100%", duration: 0.8, ease: "power2.out" },
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
    },
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
    },
  );

  $(".clck2copy").on("click", function () {
    const text = $(".clck2copy-email").text();

    navigator.clipboard
      .writeText(text)
      .then(() => {
        $(".clck2copy-status").text("COPIED !");
        $(".copy-svg").hide();
        $(".copied-svg").show();
      })
      .catch(() => {
        $(".clck2copy-status").text("FAILED TO COPY");
      });
  });

  var headerTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".home-landing-section",
      start: "top+=50 top",
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
      "<",
    );

  $("#projects-section").css("padding-top", headerHeight + 10 + "px");

  var projRow = $(".projects-row").outerWidth(true);
  var sectionWidth = $(".max-container").width();
  var totalWidthProj = projRow - sectionWidth;
  var projSpeed = $(window).width() < 768 ? 1.5 : 3.5;

  var projectsTL = gsap.timeline({
    scrollTrigger: {
      trigger: "#projects-section",
      start: "top top",
      pin: true,
      pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
      scrub: true,
      end: () => "+=" + totalWidthProj / projSpeed,
      // markers: true,
    },
  });

  projectsTL.to(".projects-row", {
    x: "-" + totalWidthProj + "px",
    ease: "none",
  });

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
      },
    );

    // Count Current Project Card
    let current = String(index + 1).padStart(2, "0");
    $(this).find('.projCount').text(current);
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

  var chptstickyHeight = $(".chpt-sticky").outerHeight(true);
  ["chapter1", "chapter2", "chapter3"].forEach((ch) => {
    // Pin headers
    gsap.timeline({
      scrollTrigger: {
        trigger: `.${ch}-header`,
        start: "top top+=" + headerHeight,
        endTrigger: `.${ch}-contents`,
        end: "bottom top+=" + (chptstickyHeight + headerHeight),
        pin: `.${ch}-header`,
        pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
        pinSpacing: false,

        // markers: true
      },
    });

    // Animate background Y with scroll
  });

  // gsap.to(`.chapter3`, {
  //   backgroundPositionY: "-" + 5 + "px", // adjust to your total scroll distance
  //   ease: "none",
  //   scrollTrigger: {
  //     trigger: ".allchapters",
  //     start: "top top",
  //     end: "+=8000",
  //     scrub: true,
  //     // markers: true
  //   },
  // });

  var $sectionSlidingText = $(".sliding-text-section");
  var $rowSlidingText = $(".sliding-text-row");
  if (!$sectionSlidingText.length || !$rowSlidingText.length) return;

  // Distance the text has to travel, recalculated on every refresh
  function getDistance() {
    var $container = $rowSlidingText.parent(); // .max-container
    var visibleWidth = $container.width(); // content width, excludes padding
    return Math.max(0, $rowSlidingText[0].scrollWidth - visibleWidth);
  }

  function initSlidingText() {
    gsap.to($rowSlidingText[0], {
      x: function () {
        return -getDistance();
      },
      ease: "none",
      scrollTrigger: {
        trigger: $sectionSlidingText[0],
        start: "top 40%",
        end: function () {
          return "+=" + getDistance();
        },
        pin: true,
        pinType: ScrollTrigger.isTouch ? "fixed" : "transform",
        scrub: true,
        invalidateOnRefresh: true, // re-runs the function values on resize/refresh
        // markers: true,
      },
    });

    ScrollTrigger.refresh();
  }

  // Wait for fonts + all assets before measuring
  var fontsReady =
    document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve();

  var windowLoaded = new Promise(function (resolve) {
    if (document.readyState === "complete") {
      resolve();
    } else {
      $(window).one("load", resolve);
    }
  });

  Promise.all([fontsReady, windowLoaded]).then(initSlidingText);

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

  var svgSpeed = $(window).width() < 1024 ? 1.5 : 2.5;
var slidingSVGTL = null;

function initSlidingSVG() {
  // kill the old timeline and its ScrollTrigger (needed when re-running on resize)
  if (slidingSVGTL) {
    if (slidingSVGTL.scrollTrigger) slidingSVGTL.scrollTrigger.kill();
    slidingSVGTL.kill();
  }

  svgSpeed = $(window).width() < 1024 ? 1.25 : 2;

  var loops = {}; // wrap distance for each row

  $(".sliding-svg-white, .sliding-svg-black").each(function () {
    var $row = $(this);
    var key = $row.hasClass("sliding-svg-white") ? "white" : "black";
    var $track = $row.children(".sliding-svg-track");

    // build the track once, or reset it if it already exists
    if ($track.length) {
      $track.children(".is-clone").remove();
      gsap.set($track[0], { x: 0 });
    } else {
      $row.wrapInner('<div class="sliding-svg-track"></div>');
      $track = $row.children(".sliding-svg-track");
    }

    var gap = parseFloat($row.css("column-gap")) || 0;

    $row.css({ overflow: "hidden", justifyContent: "flex-start" });
    $track.css({
      display: "flex",
      flexDirection: "row",
      flexShrink: 0,
      width: "max-content",
      columnGap: gap + "px",
    });

    var $items = $track.children().not(".is-clone");

    // width of one full set of items + one gap = the loop distance
    var distance = $track.outerWidth() + gap;

    // clone enough sets so the row is always filled while looping
    var sets = Math.ceil($row.width() / distance) + 1;
    for (var i = 0; i < sets; i++) {
      $items.clone().addClass("is-clone").attr("aria-hidden", "true").appendTo($track);
    }

    loops[key] = distance;
  });

  // same as your original code
  var slideSVGLength = $(".sliding-svg-black").outerWidth(true) * 55;

  var wrapWhite = gsap.utils.wrap(-loops.white, 0);
  var wrapBlack = gsap.utils.wrap(-loops.black, 0);

  slidingSVGTL = gsap.timeline({
    scrollTrigger: {
      trigger: ".skills-section",
      start: "top bottom",
      end: () => "+=" + slideSVGLength * svgSpeed,
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  slidingSVGTL
    .to(".sliding-svg-white .sliding-svg-track", {
      x: -slideSVGLength,
      ease: "none",
      modifiers: {
        x: function (x) {
          return wrapWhite(parseFloat(x)) + "px";
        },
      },
    })
    .to(
      ".sliding-svg-black .sliding-svg-track",
      {
        x: slideSVGLength,
        ease: "none",
        modifiers: {
          x: function (x) {
            return wrapBlack(parseFloat(x)) + "px";
          },
        },
      },
      "<",
    );
}

initSlidingSVG();

// re-measure after fonts/images load and when the window is resized
var svgResizeTimer;
$(window).on("load", initSlidingSVG);
$(window).on("resize", function () {
  clearTimeout(svgResizeTimer);
  svgResizeTimer = setTimeout(initSlidingSVG, 200);
});

  const gitAnimation = gsap.timeline();

  (gitAnimation
    .fromTo(
      "#cat",
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 1.5, ease: "power2.out" },
    )
    .to(
      "#cat",
      {
        fill: "#e6e6e6", // change to whatever fill color you want
        duration: 0.3,
        ease: "power1.inOut",
      },
      ">",
    )
    .to("#cat", {
      stroke: "transparent",
      duration: 0.5,
      ease: "power1.inOut",
    }),
    "<");

  gsap.fromTo(
    ".lin",
    {
      drawSVG: "0%",
    },
    {
      drawSVG: "100%",
      duration: 2,
      ease: "power2.out",
    },
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

  $("#vinceForm").on("submit", function (e) {
    e.preventDefault();
    var origContentBtn = $("#form-sbmt h6").html();
    $("#form-sbmt h6").text("SENDING...");

    emailjs
      .send("service_trvsn93", "template_3twd4qk", {
        name: $("#inpName").val(),
        email: $("#inpEmail").val(),
        time: new Date().toLocaleString(),
        message: $("#inpMessage").val(),
      })
      .then(function (response) {
        console.log("SUCCESS!", response.status, response.text);
        alert("Your message has been sent successfully!");
        $("#vinceForm")[0].reset();
        $("#form-sbmt h6").html(origContentBtn);
      })
      .catch(function (error) {
        console.error("FAILED...", error);
        $("#form-sbmt h6").html(origContentBtn);
      });
  });

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
  setHeroHeight();

  $(".projects-card").each(function () {
    Fancybox.bind(this, '[data-fancybox="project-gallery"]', {
      animated: true,
      dragToClose: true,
      caption: true,
      Toolbar: {
        display: {
          left: [],
          middle: ["counter"],
          right: ["zoom", "fullscreen", "close"],
        },
      },
      Carousel: {
        Autoplay: {
          autoStart: true,
          timeout: 3000,
          showProgressbar: true,
          pauseOnHover: false,
        },
      },
    });
  });
}); //End ng Ready Function

function setHeroHeight() {
  const headerHeight = $(".header-main").outerHeight(true);
  const loopBottom = $(".loop-elements").outerHeight(true);

  $(".hero-section").css({
    "padding-top": headerHeight + 12,
    "padding-bottom": loopBottom + 32,
  });
}

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

const landing1st = [
  "John Vincent",
  "Website",
  "Hello",
  "Web",
  "Design",
  "Let's",
  "Your Vision",
];
const landing2nd = [
  "Barnachea",
  "Portfolio",
  "World",
  "Developer",
  "to Reality",
  "Work Together",
  "My Code",
];

// Measure every word once and lock the element to the tallest one,
// so swapping text never changes the page height (no layout shift,
// so ScrollTrigger/ScrollSmoother never have anything to re-measure).
function lockHeight($el, words) {
  const el = $el[0];
  const original = $el.text();

  el.style.minHeight = "";
  let maxH = 0;
  words.forEach(function (word) {
    $el.text(word);
    maxH = Math.max(maxH, el.getBoundingClientRect().height);
  });

  $el.text(original);
  el.style.minHeight = Math.ceil(maxH) + "px";
}

function cycleTextPair($el1, $el2, words1, words2, hold, offset) {
  let index = 0;

  // Lock heights BEFORE animating so nothing below the hero ever moves
  lockHeight($el1, words1);
  lockHeight($el2, words2);

  // One refresh, after the final layout is settled (NOT inside the loop)
  ScrollTrigger.refresh();

  gsap.set([$el1, $el2], { autoAlpha: 1 });

  function animate() {
    // Set text and split both elements
    $el1.text(words1[index]);
    $el2.text(words2[index]);

    // "words,chars" only: no extra line wrappers that can change the height
    const split1 = new SplitText($el1[0], { type: "words,chars" });
    const split2 = new SplitText($el2[0], { type: "words,chars" });

    const tl = gsap.timeline({
      onComplete: function () {
        split1.revert();
        split2.revert();
        index = (index + 1) % words1.length;
        animate();
      },
    });

    // IN: first element
    tl.fromTo(
      split1.chars,
      { y: 50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.5, ease: "power3.out" },
      0,
    );

    // IN: second element, slightly delayed
    tl.fromTo(
      split2.chars,
      { y: 50, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, stagger: 0.04, duration: 0.5, ease: "power3.out" },
      offset,
    );

    // Compute when the longest "in" finishes, then hold
    const inEnd = Math.max(
      0.5 + 0.04 * (split1.chars.length - 1),
      offset + 0.5 + 0.04 * (split2.chars.length - 1),
    );
    const outStart = inEnd + hold;

    // OUT: first element
    tl.to(
      split1.chars,
      { y: 50, autoAlpha: 0, stagger: 0.04, duration: 0.5, ease: "power3.in" },
      outStart,
    );

    // OUT: second element, same delay offset
    tl.to(
      split2.chars,
      { y: 50, autoAlpha: 0, stagger: 0.04, duration: 0.5, ease: "power3.in" },
      outStart + offset,
    );

    // ❌ removed: ScrollTrigger.refresh();  <- this caused the blink every cycle
  }

  animate();
}

// INIT
$(window).on("load", function () {
  // wait for fonts so the locked heights are measured with the real font
  const fontsReady =
    document.fonts && document.fonts.ready
      ? document.fonts.ready
      : Promise.resolve();

  fontsReady.then(function () {
    setTimeout(function () {
      cycleTextPair(
        $("#landing1st"),
        $("#landing2nd"),
        landing1st,
        landing2nd,
        2.7, // hold time
        0.5, // landing2nd delay behind landing1st (seconds)
      );
    }, 100);
  });
});