import $ from "jquery";

// Make jQuery global (important!)
window.$ = window.jQuery = $;
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

// SWIPER.JS
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';

import { Mascot } from "page-mascot";

gsap.registerPlugin(
  DrawSVGPlugin,
  MotionPathPlugin,
  ScrollTrigger,
  ScrollSmoother,
  ScrollToPlugin,
  SplitText,
);


// One shared pin type for every pin on the page
const PIN_TYPE = ScrollTrigger.isTouch ? "fixed" : "transform";

// Make jQuery global BEFORE loading Owl

// Now load Owl (it will attach to window.jQuery)
// import "owl.carousel";

$(function () {
  console.log("Hello Devs! My Portfolio Revamp is WIP :)");

  var headerHeight = $(".header-main").outerHeight(true);
  ScrollTrigger.config({ ignoreMobileResize: true });
  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: ScrollTrigger.isTouch ? 0 : 2.5, // disable smooth on touch devices
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
        backdropFilter: "blur(0px)",
      },
      {
        y: 0,
        backgroundColor: "rgba(22, 48, 43, 0.8)",
        backdropFilter: "blur(3px)",
      },
    );

    $(".burger-container").on("click", function () {
      isHeaderButtonToggled = !isHeaderButtonToggled;

      if (isHeaderButtonToggled) {
        burgerMenuTL.play();
        headerMenuTL.play();
        $('header').css({
          'mix-blend-mode':'normal',
          'backdrop-filter': 'blur(0px)',
        });
        $body.css("overflow", "hidden");
      } else {
        headerMenuTL.reverse();
        burgerMenuTL.reverse();
        $body.css("overflow", "auto");
        setTimeout(() => {
          $('header').css({
            'mix-blend-mode':'difference',
            'backdrop-filter': 'blur(5px)',
          });
        }, 400);
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

  // hover effects only on devices that really hover (taps fire fake hovers on phones)
  if (matchMedia("(hover: hover)").matches) {
    $(".prj-cta-non, .prj-cta-bg").hover(
      function () {
        const $cat = $(this).find(".projcat");
        gsap
          .timeline()
          .set($cat, { fill: "transparent", stroke: "#e6e6e6" })
          .fromTo(
            $cat,
            { drawSVG: "0%" },
            { drawSVG: "100%", duration: 0.8, ease: "power2.out" },
          )
          .to($cat, { fill: "#e6e6e6", duration: 0.3, ease: "power1.inOut" });
      },
      function () {
        gsap.to($(this).find(".projcat"), {
          stroke: "transparent",
          fill: "#e6e6e6",
          duration: 0.5,
          ease: "power1.inOut",
        });
      },
    );
  }

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

  // var headerTL = gsap.timeline({
  //   scrollTrigger: {
  //     trigger: ".home-landing-section",
  //     start: "top+=50 top",
  //     toggleActions: "play none none reverse",
  //   },
  // });

  // headerTL
  //   .from(".header-bg", {
  //     opacity: 0,
  //     duration: 0.5,
  //     ease: "power2.out",
  //   })
  //   .from(
  //     ".header-border",
  //     {
  //       clipPath: "inset(0% 100% 0% 0%)", // hidden from top
  //       duration: 0.5,
  //       ease: "power2.out",
  //     },
  //     "<",
  //   );

  var projectTitleHeaderTL = gsap.timeline({
    scrollTrigger:{
      trigger: ".project-titlecontainer",
      start: "bottom bottom-=200",
      // markers: true,
      pin: true,
      pinType: PIN_TYPE,
      scrub: true,
      // pinSpacing: false,
      
      end: "top top+=70",
    }
  });

  projectTitleHeaderTL
  .to(".title-wrapper",
    {
      y: "10vh",
      ease: "none",    
    }
  )
  .to(".projhead-title",
    {
      opacity: 0.7,
      scale: 0.75,
      ease: "none",
    },"<"
  );

  const $cue = $(".scroll-cue");

// Line grows and shrinks on a loop (same as your reference file)
gsap.fromTo(".scroll-cue-line",
  { scaleY: 0 },
  { scaleY: 1, duration: 1.2, ease: "power2.inOut", repeat: -1, yoyo: true }
);

// Fade in after the heading appears (your reference does this with the hero row)
gsap.from($cue[0], { opacity: 0, y: 20, duration: 0.8, delay: 0.6 });



const $cards = $(".project-card");
const $last = $cards.last();
const STACK_TOP = (headerHeight + 5);
const STACK_GAP = $(window).width() < 1024 ? 0 : 5;
const HOLD = 500;  // scroll distance during which the last card gets buried
const lastOffset = STACK_TOP + ($cards.length - 1) * STACK_GAP;

const BG_ACTIVE = "rgb(22, 48, 43)";
const BG_BURIED = "rgb(10, 20, 18)";
const pinType = PIN_TYPE;

const cardTriggers = []; // each card's pin ScrollTrigger (used by the nav + progress)

gsap.set($cards.toArray(), { backgroundColor: BG_ACTIVE, force3D: true });

// Release point for cards 1-8: same scroll position as the last card's release,
// measured by ScrollTrigger itself (no jQuery offset, no transform drift)
const releaseY = lastOffset - HOLD; // may be negative
const stackEndPos = `top top${releaseY >= 0 ? "+=" : "-="}${Math.abs(releaseY)}`;

// Same buried look for every card
const buryTimeline = (card) =>
  gsap.timeline({ defaults: { ease: "none" } })
    .to(card, {
      backgroundColor: BG_BURIED,
      scale: 0.92,
      transformOrigin: "center top",
      force3D: true,
    }, 0)
    .to($(card).children(".grid")[0], { opacity: 0.4 }, 0);

// ---------- Side nav, right (Tailwind) ----------
const NUM_IDLE    = "text-[10px] text-[#ddd]";
const NUM_ACTIVE  = "text-xs text-white font-bold";
const BAR_IDLE    = "w-2.5 bg-[#ddd]";
const BAR_ACTIVE  = "w-6 bg-[#e6e6e6]";
const NAV_HIDDEN  = "opacity-0 pointer-events-none";
const NAV_VISIBLE = "opacity-100 pointer-events-auto";

const $nav = $(
  `<ul class="fixed right-4 top-1/2 -translate-y-1/2 z-[200] hidden lg:flex flex-col gap-2 text-sm
              m-0 p-0 list-none transition-opacity duration-300 ${NAV_HIDDEN}"></ul>`
).appendTo("body");

// ---------- Progress bar, left (Tailwind) ----------
const $progress = $(`
  <div class="fixed left-4 top-1/2 -translate-y-1/2 z-[200] hidden lg:flex flex-col items-start gap-3
              text-[10px] text-[#ddd] transition-opacity duration-300 ${NAV_HIDDEN}">
    <span>START</span>
    <div class="flex items-stretch gap-3 h-48">
      <div class="relative w-0.5 h-full bg-[#444] rounded-sm">
        <div class="progress-fill absolute top-0 left-0 w-full h-0 bg-white rounded-sm"></div>
      </div>
      <span class="progress-pct self-center tabular-nums">0%</span>
    </div>
    <span>END</span>
  </div>
`).appendTo("body");

const $fill = $progress.find(".progress-fill");
const $pct  = $progress.find(".progress-pct");

function setProgress(p) {
  const pct = Math.round(p * 100);
  $fill.css("height", pct + "%");
  $pct.text(pct + "%");
}

let activeIndex = -1;

function setActive(index) {
  if (index === activeIndex) return;
  activeIndex = index;
  $nav.children("li").each(function (n) {
    const on = n === index;
    $(this).find(".num").toggleClass(NUM_ACTIVE, on).toggleClass(NUM_IDLE, !on);
    $(this).find(".bar").toggleClass(BAR_ACTIVE, on).toggleClass(BAR_IDLE, !on);
  });
}

// Active card = the last card whose pin has started
function syncNav(y) {
  let idx = 0;
  cardTriggers.forEach((st, n) => {
    if (y >= st.start - 1) idx = n;
  });
  setActive(idx);
}

$cards.each(function (i) {
  const $project = $(this);
  const $next = $cards.eq(i + 1);
  const isLast = i === $cards.length - 1;
  const startOffset = STACK_TOP + i * STACK_GAP;

  const count = String(i + 1).padStart(2, "0"); // 01, 02 ... 09, 10
  $project.find(".projCount").text(count);

  // Nav item for this card
  $nav.append(`
    <li data-index="${i}" class="flex items-center justify-end gap-3 cursor-pointer">
      <span class="num min-w-[18px] text-right transition-all duration-300 ${NUM_IDLE}">${count}</span>
      <span class="bar block h-0.5 rounded-sm transition-all duration-300 ${BAR_IDLE}"></span>
    </li>`);

  // ---------- Fancybox ----------
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

  // ---------- Swiper ----------
  const gallery = new Swiper($project.find(".browser-body")[0], {
    modules: [Pagination],
    slidesPerView: 1,
    grabCursor: true,
    pagination: {
      el: $project.find(".projgallery-pagination")[0],
      clickable: true,
      dynamicBullets: true,
      dynamicMainBullets: 1,
    },
  });

  // ---------- Stacking ----------
  $project.css("z-index", i + 1);

  if (!isLast) {
    // Pin until the whole stack is done
    cardTriggers[i] = ScrollTrigger.create({
      trigger: this,
      start: `top top+=${startOffset}`,
      endTrigger: $last[0],
      end: stackEndPos,
      pin: this,
      pinSpacing: false,
      pinType,
      // anticipatePin: 1,
      
    });

    // Buried when the next card slides over it
    ScrollTrigger.create({
      animation: buryTimeline(this),
      trigger: $next[0],
      start: "top bottom",
      end: `top top+=${startOffset + STACK_GAP}`,
      scrub: true,
      
      // once fully covered, stop painting this card's content
      onLeave: () => $project.addClass("is-buried"),
      onEnterBack: () => $project.removeClass("is-buried"),
      onRefresh: (self) => $project.toggleClass("is-buried", self.progress === 1),
    });

  } else {
    // LAST CARD: pin + buried animation in ONE ScrollTrigger
    cardTriggers[i] = ScrollTrigger.create({
      animation: buryTimeline(this),
      trigger: this,
      start: `top top+=${startOffset}`,
      end: `+=${HOLD}`,
      pin: this,
      pinSpacing: true,
      pinType,
      // anticipatePin: 1,
      scrub: true,
      
    });
  }
});

// ---------- Nav sync + visibility (created after the cards) ----------
ScrollTrigger.create({
  trigger: ".all-project-cards-wrapper",
  start: "top center",
  end: () => cardTriggers[cardTriggers.length - 1].end, // when the stack unpins
  
  onUpdate: (self) => syncNav(self.scroll()),
  onRefresh: (self) => syncNav(self.scroll()),
  onToggle: (self) => {
    $nav.add($progress)
      .toggleClass(NAV_VISIBLE, self.isActive)
      .toggleClass(NAV_HIDDEN, !self.isActive);
  },
});

// ---------- Progress: first card's pin start -> stack unpin ----------
ScrollTrigger.create({
  start: () => cardTriggers[0].start,
  end: () => cardTriggers[cardTriggers.length - 1].end,
  
  onUpdate: (self) => setProgress(self.progress),
  onRefresh: (self) => setProgress(self.progress),
});

// ---------- Click: jump to a specific card ----------
$nav.on("click", "li", function () {
  const st = cardTriggers[$(this).data("index")];
  $("html, body").stop().animate({ scrollTop: st.start + 1 }, 800);
});







// Offsets depend on final image sizes
$(window).on("load", () => {
  ScrollTrigger.refresh();
  // images decode late on phones, refresh once more after they settle
  setTimeout(() => ScrollTrigger.refresh(), 600);
});
document.fonts?.ready.then(() => ScrollTrigger.refresh());

  

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
        pinType: PIN_TYPE,
        pinSpacing: false,

        // markers: true
      },
    });

    // Animate background Y with scroll
  });


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
        pinType: PIN_TYPE,
        scrub: true,
         // re-runs the function values on resize/refresh
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
    pinType: PIN_TYPE,
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

  setHeroHeight();

  
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

// Lock the PARENT to the tallest combined (line 1 + line 2) pair,
// so the page never shifts, while the lines move inside it.
function lockParentHeight($el1, $el2, words1, words2) {
  const parent = $el1.parent()[0];
  const o1 = $el1.text();
  const o2 = $el2.text();

  parent.style.minHeight = "";
  $el1[0].style.height = "";

  let maxH = 0;
  words1.forEach(function (_, i) {
    $el1.text(words1[i]);
    $el2.text(words2[i]);
    maxH = Math.max(maxH, parent.getBoundingClientRect().height);
  });

  $el1.text(o1);
  $el2.text(o2);
  parent.style.minHeight = Math.ceil(maxH) + "px";
}

function cycleTextPair($el1, $el2, words1, words2, hold, offset) {
  let index = 0;
  let firstRun = true;
  const el1 = $el1[0];

  // block so the first line has a tweenable height
  gsap.set($el1, { display: "block" });

  // keep the actions row on its own layer so it doesn't repaint on every
  // height frame (this is what shows up as a blink)
  const actions = document.getElementById("landingActions");
  if (actions) {
    actions.style.willChange = "transform";
    actions.style.transform = "translateZ(0)";
    actions.style.backfaceVisibility = "hidden";
  }

  lockParentHeight($el1, $el2, words1, words2);

  gsap.set([$el1, $el2], { autoAlpha: 1 });

  function animate() {
    // 1. OLD height = whatever line 1 is right now (no reset to auto,
    //    so there is no extra layout change here)
    const oldH = el1.getBoundingClientRect().height;

    // 2. swap text and split FIRST, so the new height is measured
    //    on the final layout (SplitText wrappers included)
    $el1.text(words1[index]);
    $el2.text(words2[index]);

    const split1 = new SplitText(el1, { type: "words,chars" });
    const split2 = new SplitText($el2[0], { type: "words,chars" });

    // hide new chars immediately, before any frame can paint them
    gsap.set(split1.chars.concat(split2.chars), { y: 150 });

    // measure the NEW natural height with the height unlocked
    el1.style.height = "auto";
    const newH = el1.getBoundingClientRect().height;
    el1.style.height = oldH + "px"; // put it back before painting

    const tl = gsap.timeline({
      onComplete: function () {
        split1.revert();
        split2.revert();
        index = (index + 1) % words1.length;
        animate();
      },
    });

    // 3. slide line 2 and the row: height goes old -> new
    //    NO clearProps: it stays at newH, so there is no snap at the end
    if (!firstRun && Math.abs(oldH - newH) > 1) {
      tl.to(
        el1,
        {
          height: newH,
          duration: 0.7,
          ease: "power3.inOut",
        },
        0,
      );
    } else {
      el1.style.height = newH + "px";
    }
    firstRun = false;

    // IN: first element
    tl.to(
      split1.chars,
      { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.65, ease: "power4.out" },
      0.1,
    );

    // IN: second element, slightly delayed
    tl.to(
      split2.chars,
      { y: 0, autoAlpha: 1, stagger: 0.03, duration: 0.65, ease: "power4.out" },
      offset,
    );

    const inEnd = Math.max(
      0.1 + 0.65 + 0.03 * (split1.chars.length - 1),
      offset + 0.65 + 0.03 * (split2.chars.length - 1),
    );
    const outStart = inEnd + hold;

    // OUT: first element
    tl.to(
      split1.chars,
      { y: 150, stagger: 0.03, duration: 0.65, ease: "power4.in" },
      outStart,
    );

    // OUT: second element
    tl.to(
      split2.chars,
      { y: 150, stagger: 0.03, duration: 0.65, ease: "power4.in" },
      outStart + offset,
    );
  }

  animate();
}

// INIT
$(window).on("load", function () {
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
        0.3, // landing2nd delay behind landing1st (seconds)
      );
    }, 100);
  });
});