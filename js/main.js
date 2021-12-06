(()=>{
gsap.registerPlugin(ScrollTrigger);
const scroll = new SmoothScroll('a[href*="#"]', {
	speed: 40
});
const currentSection = {
    elems:document.querySelectorAll(".current"),
    half:false
}
const storySection = {
    elems:document.querySelectorAll(".text_item"),
    half:true
}
let scrollTop;
let offsetList=[];
let scrollValue;
const introduce = document.querySelector('.introduce')
const phone = document.querySelector('.phone_area')
const bgItems = document.querySelectorAll(".bg_item")
const navItems = document.querySelectorAll(".nav li")
const navBar = document.querySelector(".nav_bar")

// 일정 시간 마다 실행
const throttle = (func, ms) => {
    let throttled = false;
    return () => {
        if (!throttled) {
            throttled = true;
            setTimeout(() => {
                func();
                throttled = false;
            }, ms);
        }
    };
};
// 마지막 한번만 실행
const debounce = (func, delay) => {
let timeoutId = null;
    return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, delay);
    };
};
// 스크롤 시 진행바 현황 구하기
const getscrollValue=()=>{
    scrollValue = document.body.scrollHeight - window.innerHeight;
}
// 스크롤 높이
const getScrollTop=()=>{
    scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
}
const offsetClac =function({elems,half}){
    this.elems = elems;
    this.half =half;
}
offsetClac.prototype.getOffsetTops = function(){
    let start;
    let end;

    this.arr = Array.prototype.slice.call(this.elems).map(elem=>{
        const [top, bottom] = [elem.offsetTop, elem.scrollHeight];
        if(this.half){
            start = top-bottom/2;
            end=top+bottom/2;
        }else{
            start=top;
            end=top+bottom;
        }
        return [start,end]
    })
    return this.arr;
}
const current = new offsetClac(currentSection);
const story = new offsetClac(storySection);
// 스크롤 진입 확인
const getOffsetVisible=(offsetTops,scrollTop,elems) =>{
    let targetIndex = -1;
    offsetTops.some(([start,end],i)=>{
        if (scrollTop >= start && scrollTop < end) {
                targetIndex = i;
                return true;
            }
    })
    const arr =Array.prototype.slice.call(elems);
    for(let i =0; i<arr.length; i++){
        i === targetIndex? arr[i].classList.add('visible'):arr[i].classList.remove('visible')
    }
}
const init = () => {
    getScrollTop();
    offsetList[0] = current.getOffsetTops()
    offsetList[1] = story.getOffsetTops()
    getOffsetVisible(offsetList[0],scrollTop,navItems)
    getscrollValue()
}
window.addEventListener("scroll", throttle(() => {
    getScrollTop();
    // introduce
    if(introduce.offsetTop/2 <= scrollTop && scrollTop <= introduce.offsetTop+introduce.clientHeight){
        introduce.classList.add("on")
    }else{
        introduce.classList.remove("on")
    }
    // phone
    if(phone.offsetTop*0.96 <= scrollTop && scrollTop <= phone.offsetTop+phone.clientHeight){
        phone.classList.add("on")
    }else{
        phone.classList.remove("on")
    }
    getOffsetVisible(offsetList[1],scrollTop,bgItems)
    getOffsetVisible(offsetList[0],scrollTop,navItems)
    // 진행바
    const ratio = scrollTop/scrollValue*100;
    navBar.style.width =`${ratio}%`;
}, 300));

window.addEventListener("resize",debounce(()=>{
    // 리사이즈시, 보여줄 화면 다시 갱신
    init();
    getOffsetVisible(offsetList[1],scrollTop,bgItems)
    getOffsetVisible(offsetList[0],scrollTop,currentSection.elems)
},300));

init();


// animation
gsap.utils.toArray('.ani').forEach((section, i) => {
    ScrollTrigger.create({
        trigger: section,
        start: "0% 50%",
        end: "150% 100%",
        once:true,
        toggleClass: {targets: section, className: "is-active"}
      });
});
// skill
ScrollTrigger.create({
    trigger: '.skill .contents',
    start: "0% 67%",
    end: "100% 100%",
    onUpdate: self=>{
        document.querySelector('.skill_bar').style.height=`${self.progress*100}%`
    }
  });
gsap.utils.toArray('.card_inner').forEach((section, i) => {
    const skill = gsap.timeline({
        scrollTrigger: {
                    trigger: section,
                    start:'top 60%',
                    end:'100% 100%',
                }
    });
    skill.to(section.querySelector('span'),0.3,{scale:1})
    .to(section.querySelector('.line'),0.3,{scale:1})
    .to(section.querySelector('.card_content'),0.3,{scale:1})
    .to(section.querySelector('.des'),0.3,{opacity:1})
    .to(section.querySelector('span'),0.3,{backgroundColor:'#fff'})
});
// phone app 애니메이션
let prevIndex =0;
const appElems =document.querySelectorAll(".app.move .pic");
const appBgElems=document.querySelectorAll(".phone_bg");
for(let i=0; i<appElems.length; i++){
    appElems[i].addEventListener("mouseenter",(e)=>{
        e.preventDefault()
        appBgElems[i].classList.add("active")
        prevIndex=i
       })
       appElems[i].addEventListener("mouseleave",e=>{
           appBgElems[prevIndex].classList.remove("active")
       })
}
window.addEventListener("load",()=>{
    setTimeout(()=>{
        document.querySelector(".loading").classList.remove("show")
    },300)
})
})();