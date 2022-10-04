gsap.registerPlugin(ScrollTrigger);
//gsap.registerPlugin(ScrollToPlugin);

// Horizontal snapping sections

var stepIndicators = gsap.utils.toArray(".step");

stepIndicators.forEach((step) => {
  ScrollTrigger.create({
    trigger: step,
    scroller: step, //start: "top bottom",
    start: () => step.offsetTop,
    onEnter: moveNavBuddyDown,
    onEnterBack: moveNavBuddyUp,
  });
});

function moveNavBuddyDown() {
  console.log("move nav down");
}

function moveNavBuddyUp() {
  console.log("move nav up");
}

let duration = 400,
  sections = gsap.utils.toArray(".panel"),
  sectionIncrement = duration / (sections.length - 1),
  tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".container.horizontal-scroll",
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      start: "top top",
      end: () =>
        "+=" +
        document.querySelector(".container.horizontal-scroll").offsetWidth,
    },
  });

tl.to(sections, {
  xPercent: -100 * (sections.length - 1),
  duration: duration,
  ease: "none",
});

// everything below this is just for the fading/scaling up which is NOT scrubbed - it's all dynamic, triggered when each section enters/leaves so that the fading/scaling occurs at a consistent rate no matter how fast you scroll!

sections.forEach((section, index) => {
  let tween = gsap.from(section, {
    opacity: 0,
    //scale: 0.6,
    duration: 1,
    //force3D: true,
    paused: true,
  });
  addSectionCallbacks(tl, {
    start: sectionIncrement * (index - 0.99),
    end: sectionIncrement * (index + 0.99),
    onEnter: () => tween.play(),
    onLeave: () => tween.reverse(),
    onEnterBack: () => tween.play(),
    onLeaveBack: () => tween.reverse(),
  });
  index || tween.progress(1); // the first tween should be at its end (already faded/scaled in)
});

// helper function that lets us define a section in a timeline that spans between two times (start/end) and lets us add onEnter/onLeave/onEnterBack/onLeaveBack callbacks
function addSectionCallbacks(
  timeline,
  { start, end, param, onEnter, onLeave, onEnterBack, onLeaveBack }
) {
  let trackDirection = (animation) => {
      // just adds a "direction" property to the animation that tracks the moment-by-moment playback direction (1 = forward, -1 = backward)
      let onUpdate = animation.eventCallback("onUpdate"), // in case it already has an onUpdate
        prevTime = animation.time();
      animation.direction = animation.reversed() ? -1 : 1;
      animation.eventCallback("onUpdate", () => {
        let time = animation.time();
        if (prevTime !== time) {
          animation.direction = time < prevTime ? -1 : 1;
          prevTime = time;
        }
        onUpdate && onUpdate.call(animation);
      });
    },
    empty = (v) => v; // in case one of the callbacks isn't defined
  timeline.direction || trackDirection(timeline); // make sure direction tracking is enabled on the timeline
  start >= 0 &&
    timeline.add(
      () => ((timeline.direction < 0 ? onLeaveBack : onEnter) || empty)(param),
      start
    );
  end <= timeline.duration() &&
    timeline.add(
      () => ((timeline.direction < 0 ? onEnterBack : onLeave) || empty)(param),
      end
    );
}

//  Fin Horizontal snapping sections

//  Navigation
//  https://codepen.io/akapowl/pen/XWMxLGN/a82e21f8d9c7bce0059159ced099666d

document.querySelectorAll(".anchor").forEach((element) => {
  element.addEventListener("click", function () {
    const id = this.getAttribute("href").split("#")[1];
    gsap.to(window, {
      scrollTo:
        document.getElementById(id).offsetLeft *
        (document.querySelector(".container").offsetWidth /
          (document.querySelector(".container").offsetWidth -
            window.innerWidth)),
      duration: 2,
    });
  });
});

// Fin Navigation

//  Animations

const pageWrap = document.querySelector("#pageWrap");

const sectionOffreUn = document.querySelector("#offreUn");
const sectionOffreDeux = document.querySelector("#offreDeux");
const sectionSituationsH = document.querySelector("#situationsH");
const sectionSituationsV = document.querySelector("#situationsV");

//  Section Offre 1
function sectionOffreUnGSAP() {
  let sectionOffreUnGSAPTL = gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger: sectionOffreUn,
      scrub: 1,
      start: () =>
        "top top-=" +
        (sectionOffreUn.offsetLeft - window.innerWidth) *
          (pageWrap.offsetWidth / (pageWrap.offsetWidth - window.innerWidth)),
      end: () =>
        "+=" +
        (sectionOffreUn.offsetWidth + window.innerWidth) *
          (pageWrap.offsetWidth / (pageWrap.offsetWidth - window.innerWidth)),
      //start: "0% 100%",
      //end: "100% 0%",
      // scroller:"#offreUn",
      //horizontal: true,
      markers: "true",
    },
  });

  sectionOffreUnGSAPTL
    .from(".container-offre-un", { y: 0, ease: "none" })
    .to(".container-offre-un", { y: -300, ease: "power1.out" });
}

// function sectionOffreDeuxGSAP() {
//   let sectionOffreDeuxGSAPTL = gsap.timeline({
//     paused: true,
//     scrollTrigger: {
//       trigger: sectionOffreDeux,
//       scrub: 1,
//       start: () =>
//         "top top-=" +
//         (sectionOffreDeux.offsetLeft - window.innerWidth) *
//           (pageWrap.offsetWidth / (pageWrap.offsetWidth - window.innerWidth)),
//       end: () =>
//         "+=" +
//         (sectionOffreDeux.offsetWidth + window.innerWidth) *
//           (pageWrap.offsetWidth / (pageWrap.offsetWidth - window.innerWidth)),
//       markers: "true"
//     }
//   });

//   sectionOffreDeuxGSAPTL
//     .from(".container-offre", { y: 0, ease: "none" })
//     .from(".container-situations", { y: -300, ease: "none" })
//     .to(".container-offre", { y: -300, ease: "none" })
//     .to(".container-situations", { y: 0, ease: "power1.out" });
// }

//  From Offre To Situations
function sectionSituationsHGSAP() {
  let sectionSituationsHGSAPTL = gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger: sectionSituationsH,
      scrub: 1,
      start: () =>
        "top top-=" +
        (sectionSituationsH.offsetLeft - window.innerWidth) *
          (pageWrap.offsetWidth / (pageWrap.offsetWidth - window.innerWidth)),
      end: () =>
        "+=" +
        (sectionSituationsH.offsetWidth + window.innerWidth) *
          (pageWrap.offsetWidth / (pageWrap.offsetWidth - window.innerWidth)),
      markers: "true",
    },
  });

  sectionSituationsHGSAPTL
    .from(".container-situationsH", { x: "-100vw", y: -300, ease: "none" })
    .to(".container-situationsH", { y: 0, ease: "power1.out" });
}

//  From Situations (h) To Situations (v)
function sectionSituationsVGSAP() {
  let sectionSituationsVGSAPTL = gsap.timeline({
    paused: true,
    scrollTrigger: {
      trigger: sectionSituationsV,
      scrub: 1,

      //anticipatePin: 1,

      start: () =>
        "top top-=" +
        (sectionSituationsV.offsetLeft - window.innerWidth) *
          (pageWrap.offsetWidth / (pageWrap.offsetWidth - window.innerWidth)),
      end: () =>
        "+=" +
        (sectionSituationsV.offsetWidth + window.innerWidth) *
          (pageWrap.offsetWidth / (pageWrap.offsetWidth - window.innerWidth)),

      markers: "true",
    },
  });

  sectionSituationsVGSAPTL
    //.from(".situationsV-container", { y: -300, ease: "none" })
    //.to(".situationsV-container", { y: 0, ease: "power1.out" })
    .to(".situationsV-container", { x: 0, ease: "power1.out" })
    .to(".situationsV-container", {
      //      positon: "absolute",
      rotation: "-90",
      ease: "power1.out",
    });
}

window.onload = () => {
  sectionOffreUnGSAP();
  // sectionOffreDeuxGSAP();
  sectionSituationsHGSAP();
  sectionSituationsVGSAP();
};
