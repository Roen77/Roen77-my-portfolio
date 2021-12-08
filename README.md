# 포트폴리오
## 메뉴
- 홈
- 스토리
- 장점
- 기술
- 프로젝트

## 사용 라이브러리
|라이브러리|GSAP,ScrollTrigger|smooth-scroll|
|---|---|---|
|사용|스크롤 애니메이션 사용|부드러운 스크롤 사용|

## 이미지 출처
[픽사베이](https://pixabay.com/ko/)
<br>

[freepick](https://www.freepik.com/search?dates=any&format=search&page=1&sort=popular)
<br>

[flaticon](https://www.flaticon.com/)

## 내용 특이사항

- babel로 ES6 문법 처리

- 미디어 쿼리로 반응형 사이트 구성

- 스크롤 이벤트는 throttle과 debounce 를 적용

- es6에 추가된 클래스 문법에서 상속을 사용하여 함수 재사용이 가능한 것처럼, prototype을 사용하여 함수 재사용
```js
// 스크롤 시 반복되는 이벤트를 최적화 시키기 위해 throttle과 debounce 를 사용하여 불필요한 이벤트/함수 실행 빈도 수를 줄임
//  일정 시간마다 실행
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
//  마지막 한번만 실행
const debounce = (func, delay) => {
let timeoutId = null;
    return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, delay);
    };
};
//  스크롤 시 진행바 현황 구하기
const getscrollValue=()=>{
    scrollValue = document.body.scrollHeight - window.innerHeight;
}
// 스크롤 높이
const getScrollTop=()=>{
    scrollTop = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
}
const offsetClac =function({elems,half}){
    this.elems = elems;
    this.half =half;
}
// 요소의 상단에서 얼마나 떨어져 있는지 위치와 요소의 높이 구하기
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
// 각 섹션의 높이값 구하기
const current = new offsetClac(currnetSection);
//  스크롤 섹션의 높이값 구하기
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
// 처음에 무조건 실행될 함수
const init = () => {
    getScrollTop();
    offsetList[0] = current.getOffsetTops()
    offsetList[1] = story.getOffsetTops()
    getOffsetVisible(offsetList[0],scrollTop,navItems)
    getscrollValue()
}
// 스크롤 이벤트
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
```


