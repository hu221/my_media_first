//1、轮播图
//设置变量
let timer = 0;
let index = 0;
//获取焦点
setPoint();
function setPoint() {
  for (let i = 0; i < $(".banner_lunbotu > ul").children().length; i++) {
    const li = $("<li></li>");
    $(".banner_lunbotu > ol").append(li);
  }
  $(".banner_lunbotu > ol > li").eq(0).addClass("active");
  //调整ol的大小
  const ol_li = $(".banner_lunbotu > ol > li").length;
  // console.log(ol_li * 40);
  $(".banner_lunbotu > ol").css({
    width: "ol_li*40",
    //调整ol的位置
  });
}
//复制元素
copyEle();
function copyEle() {
  const first = $(".banner_lunbotu > ul > li").first().clone(true, true);
  // const last = $("ul > li").last().clone(true, true);
  $(".banner_lunbotu > ul").append(first);
  // $("ul").prepend(last);
  //调整ul的位置
  $(".banner_lunbotu > ul").css({
    width: $(".banner_lunbotu > ul").children().length * 100 + "%",
    //   left: -1200,
  });
}
//运动
autoPlay();
function autoPlay() {
  timer = setInterval(function () {
    index++;
    $(".banner_lunbotu > ul").animate(
      { left: -index * 1200 },
      500,
      "linear",
      moveEnd
    );
  }, 2500);
}
//运动结束
function moveEnd() {
  //最后一张瞬间定位到第0张
  if (index === $(".banner_lunbotu > ul >li").length - 1) {
    index = 0;
    $(".banner_lunbotu > ul").css({
      left: -index * 1200,
    });
  }
  //焦点配套
  $(".banner_lunbotu > ol > li").eq(index).siblings().removeClass("active");
  $(".banner_lunbotu > ol > li").eq(index).addClass("active");
}
//点击事件和移入移出事件
bindEvent();
function bindEvent() {
  //移入移出事件
  $(".banner_lunbotu").mouseover(function () {
    clearInterval(timer);
    $(".banner_lunbotu > div").addClass("active");
  });
  $(".banner_lunbotu").mouseout(function () {
    autoPlay();
    $(".banner_lunbotu > div").removeClass("active");
  });
  //焦点点击事件
  $(".banner_lunbotu > ol > li").click(function () {
    $(this).addClass("active").siblings().removeClass("active");
    const ol_index = $(this).index();
    //   console.log(ol_index);
    $(".banner_lunbotu > ul").animate(
      { left: -ol_index * 1200 },
      1000,
      "linear",
      moveEnd
    );
  });

  //左右按钮点击事件
  $(".banner_lunbotu > .left").click(function () {
    console.log($(this));
    index--;
    $(".banner_lunbotu > ul").animate(
      { left: -index * 1200 },
      1000,
      "linear",
      moveEnd
    );
  });
  $(".banner_lunbotu > .right").click(function () {
    console.log($(this));
    index++;
    $(".banner_lunbotu > ul").animate(
      { left: -index * 1200 },
      1000,
      "linear",
      moveEnd
    );
  });
}
//切换标签事件
changeTab();
function changeTab() {
  document.addEventListener("visibilitychange", () => {
    // document 身上有一个属性叫做 visibilityState
    // 表示当前页面的显示还是隐藏状态
    if (document.visibilityState === "hidden") {
      // 关闭定时器
      clearInterval(timer);
    } else if (document.visibilityState === "visible") {
      // 再次开启自动轮播
      autoPlay();
    }
  });
}


