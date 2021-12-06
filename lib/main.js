"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function () {
  gsap.registerPlugin(ScrollTrigger);
  var scroll = new SmoothScroll('a[href*="#"]', {
    speed: 40
  });
  var currentSection = {
    elems: document.querySelectorAll(".current"),
    half: false
  };
  var storySection = {
    elems: document.querySelectorAll(".text_item"),
    half: true
  };
  var scrollTop;
  var offsetList = [];
  var scrollValue;
  var introduce = document.querySelector('.introduce');
  var phone = document.querySelector('.phone_area');
  var bgItems = document.querySelectorAll(".bg_item");
  var navItems = document.querySelectorAll(".nav li");
  var navBar = document.querySelector(".nav_bar"); // 일정 시간 마다 실행

  var throttle = function throttle(func, ms) {
    var throttled = false;
    return function () {
      if (!throttled) {
        throttled = true;
        setTimeout(function () {
          func();
          throttled = false;
        }, ms);
      }
    };
  }; // 마지막 한번만 실행


  var debounce = function debounce(func, delay) {
    var timeoutId = null;
    return function () {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(func, delay);
    };
  }; // 스크롤 시 진행바 현황 구하기


  var getscrollValue = function getscrollValue() {
    scrollValue = document.body.scrollHeight - window.innerHeight;
  }; // 스크롤 높이


  var getScrollTop = function getScrollTop() {
    scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  };

  var offsetClac = function offsetClac(_ref) {
    var elems = _ref.elems,
        half = _ref.half;
    this.elems = elems;
    this.half = half;
  };

  offsetClac.prototype.getOffsetTops = function () {
    var _this = this;

    var start;
    var end;
    this.arr = Array.prototype.slice.call(this.elems).map(function (elem) {
      var _ref2 = [elem.offsetTop, elem.scrollHeight],
          top = _ref2[0],
          bottom = _ref2[1];

      if (_this.half) {
        start = top - bottom / 2;
        end = top + bottom / 2;
      } else {
        start = top;
        end = top + bottom;
      }

      return [start, end];
    });
    return this.arr;
  };

  var current = new offsetClac(currentSection);
  var story = new offsetClac(storySection); // 스크롤 진입 확인

  var getOffsetVisible = function getOffsetVisible(offsetTops, scrollTop, elems) {
    var targetIndex = -1;
    offsetTops.some(function (_ref3, i) {
      var _ref4 = _slicedToArray(_ref3, 2),
          start = _ref4[0],
          end = _ref4[1];

      if (scrollTop >= start && scrollTop < end) {
        targetIndex = i;
        return true;
      }
    });
    var arr = Array.prototype.slice.call(elems);

    for (var i = 0; i < arr.length; i++) {
      i === targetIndex ? arr[i].classList.add('visible') : arr[i].classList.remove('visible');
    }
  };

  var init = function init() {
    getScrollTop();
    offsetList[0] = current.getOffsetTops();
    offsetList[1] = story.getOffsetTops();
    getOffsetVisible(offsetList[0], scrollTop, navItems);
    getscrollValue();
  };

  window.addEventListener("scroll", throttle(function () {
    getScrollTop(); // introduce

    if (introduce.offsetTop / 2 <= scrollTop && scrollTop <= introduce.offsetTop + introduce.clientHeight) {
      introduce.classList.add("on");
    } else {
      introduce.classList.remove("on");
    } // phone


    if (phone.offsetTop * 0.96 <= scrollTop && scrollTop <= phone.offsetTop + phone.clientHeight) {
      phone.classList.add("on");
    } else {
      phone.classList.remove("on");
    }

    getOffsetVisible(offsetList[1], scrollTop, bgItems);
    getOffsetVisible(offsetList[0], scrollTop, navItems); // 진행바

    var ratio = scrollTop / scrollValue * 100;
    navBar.style.width = "".concat(ratio, "%");
  }, 300));
  window.addEventListener("resize", debounce(function () {
    // 리사이즈시, 보여줄 화면 다시 갱신
    init();
    getOffsetVisible(offsetList[1], scrollTop, bgItems);
    getOffsetVisible(offsetList[0], scrollTop, currentSection.elems);
  }, 300));
  init(); // animation

  gsap.utils.toArray('.ani').forEach(function (section, i) {
    ScrollTrigger.create({
      trigger: section,
      start: "0% 50%",
      end: "150% 100%",
      once: true,
      toggleClass: {
        targets: section,
        className: "is-active"
      }
    });
  }); // skill

  ScrollTrigger.create({
    trigger: '.skill .contents',
    start: "0% 67%",
    end: "100% 100%",
    onUpdate: function onUpdate(self) {
      document.querySelector('.skill_bar').style.height = "".concat(self.progress * 100, "%");
    }
  });
  gsap.utils.toArray('.card_inner').forEach(function (section, i) {
    var skill = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
        end: '100% 100%'
      }
    });
    skill.to(section.querySelector('span'), 0.3, {
      scale: 1
    }).to(section.querySelector('.line'), 0.3, {
      scale: 1
    }).to(section.querySelector('.card_content'), 0.3, {
      scale: 1
    }).to(section.querySelector('.des'), 0.3, {
      opacity: 1
    }).to(section.querySelector('span'), 0.3, {
      backgroundColor: '#fff'
    });
  }); // phone app 애니메이션

  var prevIndex = 0;
  var appElems = document.querySelectorAll(".app.move .pic");
  var appBgElems = document.querySelectorAll(".phone_bg");

  var _loop = function _loop(i) {
    appElems[i].addEventListener("mouseenter", function (e) {
      e.preventDefault();
      appBgElems[i].classList.add("active");
      prevIndex = i;
    });
    appElems[i].addEventListener("mouseleave", function (e) {
      appBgElems[prevIndex].classList.remove("active");
    });
  };

  for (var i = 0; i < appElems.length; i++) {
    _loop(i);
  }

  window.addEventListener("load", function () {
    setTimeout(function () {
      document.querySelector(".loading").classList.remove("show");
    }, 300);
  });
})();