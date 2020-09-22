//获取元素
const bannerBox = document.querySelector(".banner_lunbotu > ul");
const vipBox = document.querySelector(".vip > ul");
const ofloorBox = document.querySelector(".star > .ofloor > .small");
const tfloorBox = document.querySelector(".star > .tfloor > .small");
const huiBox = document.querySelector(".hui_wrap ul");
//请求渲染二级菜单
let list = [];
getNavList();
function getNavList() {
  $.ajax({
    url: "../server/er.php",
    dataType: "json",
    success(res) {
      list = res.list.map((item) => {
        item.er_l = JSON.parse(item.er_l);
        item.er_c = JSON.parse(item.er_c);
        item.er_r = JSON.parse(item.er_r);
        return item;
      });

      //一级菜单上的鼠标移入事件
      $(".banner > .menu > ul > li").on("mouseover", function () {
        const index = $(this).index();
        // console.log(index);
        $(".menu ol").addClass("active");
        $(".menu ol")
          .html(template("er", list[index]))
          .find("li")
          .addClass("active");
      });
      //二级菜单上的鼠标移入事件
      $(".menu > ol").on("mouseover", function () {
        $(".menu ol").addClass("active");
      });
      //二级菜单上的鼠标移出事件
      $(".menu ol").on("mouseout", function () {
        $(".menu ol").removeClass("active");
      });
    },
  });
}
//轮播图
//请求轮播图数据
getTu();
function getTu() {
  $.ajax({
    url: "../server/lunbotu.php",
    dataType: "json",
    success(res) {
      img = res.img;
      bindTu(img);
    },
  });
}
function bindTu(img) {
  bannerBox.innerHTML = template("lunbotu", { img });
  f();
}

function f() {
  //设置变量
  let timer = 0;
  let index = 0;
  //生成焦点
  setPoint();
  function setPoint() {
    //创建ol里面的li
    for (let i = 0; i < $(".banner_lunbotu ul").children().length; i++) {
      const li = $("<li></li>");
      $(".banner_lunbotu ol").append(li);
    }
    //给ol里面的li添加属性
    $(".banner_lunbotu ol > .banner_lunbotu li").eq(0).addClass("active");
    //调整ol的宽度和位置
    const wid = $(".banner_lunbotu ol").outerWidth();
    $(".banner_lunbotu ol").css({
      width: "490",
      marginLeft: "-183",
    });
  }
  //复制元素
  copyEle();
  function copyEle() {
    const first = $(".banner_lunbotu ul").children().first().clone(true, true);
    const last = $(".banner_lunbotu ul").children().last().clone(true, true);
    $(".banner_lunbotu ul").append(first).prepend(last);
    //调整ul的宽度和位置
    $(".banner_lunbotu ul").css({
      width: $(".banner_lunbotu ul").children().length * 100 + "%",
      left: -1200,
    });
  }
  //运动
  autoPlay();
  function autoPlay() {
    timer = setInterval(function () {
      index++;

      $(".banner_lunbotu ul").animate(
        { left: -index * 1200 },
        1000,
        "linear",
        moveEnd
      );
    }, 5000);
  }
  // console.log("auto", index);
  //运动结束
  moveEnd();
  function moveEnd() {
    //运动到最后一张的话瞬间定位到第一张
    if (index == $(".banner_lunbotu ul > li").length - 1) {
      index = 1;
      $(".banner_lunbotu ul").css({
        left: -index * 1200,
      });
    }
    //运动到倒数第二张的时候定位到第0张
    if (index == $(".banner_lunbotu ul > li").length - 2) {
      index = 0;
      $(".banner_lunbotu ul").css({
        left: -index * 1200,
      });
    }
    // 焦点配套
    for (let i = 0; i < $(".banner_lunbotu ol > li").length; i++) {
      $(".banner_lunbotu ol > li").eq(i).removeClass("active");
    }
    $(".banner_lunbotu ol > li")
      .eq(index - 1)
      .addClass("active");
  }
  //移入移出和点击事件
  bindEvent();
  function bindEvent() {
    $(".banner_lunbotu").on("mouseover", () => {
      clearInterval(timer);
    });
    $(".banner_lunbotu").on("mouseout", () => {
      autoPlay();
    });
    //左右按钮点击事件
    $(".pre").click(function () {
      index--;
      $(".banner_lunbotu ul").animate(
        { left: -index * 1200 },
        1000,
        "linear",
        moveEnd
      );
    });
    $(".next").click(function () {
      index++;
      $(".banner_lunbotu ul").animate(
        { left: -index * 1200 },
        1000,
        "linear",
        moveEnd
      );
    });
    //焦点按钮点击事件
    $(".banner_lunbotu ol > li").click(function () {
      // console.log(this);
      $(this).addClass("active").siblings().removeClass("active");
      index = $(this).index();
      console.log(index);
      $(".banner_lunbotu ul").animate(
        { left: -(index + 1) * 1200 },
        1000,
        "linear",
        moveEnd
      );
    });
  }
  //切换标签页
}
//领券和vip部分请求渲染
getVip();
function getVip() {
  $.ajax({
    url: "../server/vip.php",
    dataType: "json",
    success(res) {
      img = res.img;
      // console.log(img);
      //渲染
      bindVip(img);
    },
  });
}
function bindVip(img) {
  vipBox.innerHTML = template("vip", { img });
}
//一楼商品请求渲染
let list_ofloor = [];
getOfloor();
function getOfloor() {
  $.ajax({
    url: "../server/ofloor.php",
    dataType: "json",
    success(res) {
      list_ofloor = res.list;
      bindOfloor(list_ofloor);
    },
  });
}
function bindOfloor(list) {
  ofloorBox.innerHTML = template("ofloor", { list });
}
//二楼商品请求渲染
let list_tfloor = [];
getTfloor();
function getTfloor() {
  $.ajax({
    url: "../server/ofloor.php",
    dataType: "json",
    success(res) {
      list_tfloor = res.list;
      bindTfloor(list_tfloor);
    },
  });
}
function bindTfloor(list) {
  tfloorBox.innerHTML = template("tfloor", { list });
}
//页面尾部会员界面请求渲染
let hui_wrap = [];
getHui();
function getHui() {
  $.ajax({
    url: "../server/hui_wrap.php",
    dataType: "json",
    success(res) {
      hui_wrap = res.list;
      bindHui(hui_wrap);
    },
  });
}
function bindHui(list) {
  huiBox.innerHTML = template("hui", { list });
}
//右下角微信二维码的移入事件
$(".server > ul > li > a > .gongzhonghao").on("mouseover", function () {
  $(".weixin").addClass("active");
});
//右下角微信二维码的移出事件
$(".server > ul > li > a > .gongzhonghao").on("mouseout", function () {
  $(".weixin").removeClass("active");
});
//返回顶部事件
// console.log($(".server > ul > li > a > .back"));
$(".server > ul > li > .back").on("click", function () {
  window.scrollTo({
    top: 0,
    left: 100,
    // behavior: 'smooth'
  });
});
//个人信息框鼠标移入事件
$(".lo_deng").on("mouseover", function () {
  $(".my_list").addClass("active");
});
//个人信息框鼠标移出事件
$(".my_list").on("mouseover", function () {
  $(".my_list").addClass("active");
});
$(".my_list").on("mouseout", function () {
  $(".my_list").removeClass("active");
});

//从session里面取数,在首页显示登录的用户名
$.ajax({
  url: "../server/qu_session.php",
  dataType: "json",
  success(res) {
    $(".lo_deng").html(res);
    let lo_deng_text = $(".lo_deng").html();
    console.log(lo_deng_text);
    //如果lo_deng的内容为登录
    if (lo_deng_text == "登录") {
      //购物车框鼠标移入事件
      $(".car_head").on("mouseover", function () {
        $(".car_a_list").addClass("active");
      });
      //购物车鼠标移出事件
      $(".car_a_list").on("mouseover", function () {
        $(".car_a_list").addClass("active");
      });
      $(".car_a_list").on("mouseout", function () {
        $(".car_a_list").removeClass("active");
      });
    } else {
      console.log("登录成功，显示该用户的购物车信息");
      // console.log($(".car_buy_show_num").html());
      //从localStroage里面取数
      var list_stor =
        JSON.parse(window.localStorage.getItem("list_stor")) || [];
      // console.log(list_stor);
      // 对取到的数进行操作
      var number = 0;
      list_stor.forEach(function (item, index) {
        number += item.cart_number;
        // console.log(number);
      });
      $(".car_buy_show_num").html(number);
      //购物车框鼠标移入事件
      $(".car_head").on("mouseover", function () {
        $(".car_buy_show").addClass("active");
      });
      //购物车鼠标移出事件
      $(".car_buy_show").on("mouseover", function () {
        $(".car_buy_show").addClass("active");
      });
      $(".car_buy_show").on("mouseout", function () {
        $(".car_buy_show").removeClass("active");
      });
    }
  },
});

//退出账户，删除session
$(".tuichu").on("click", function () {
  console.log("退出账号");
  $.ajax({
    url: "../server/delete_session.php",
    success(res) {
      window.location.href = "../html/shouye.html";
    },
  });
});
//搜索引擎输入框事件
$(".sear_inp").on("input", function () {
  // console.log(this.value);
  const str =
    "https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=32646,1446,32532,32327,32351,32046,32115,31321,32618,32503,22159&wd=" +
    this.value +
    "&req=2&bs=%E7%88%B1%E5%A5%87%E8%89%BA&csor=6&cb=fn&_=1598517558259";
  const script = document.createElement("script");
  script.src = str;
  document.body.appendChild(script);
  script.remove();
});
const ul = document.querySelector(".sear_tu_ul");
function fn(res) {
  if (!res.g) {
    ul.style.display = "none";
    return;
  }
  let str = "";
  res.g.forEach((item) => {
    str += `
      <li>${item.q}</li>
    `;
  });
  ul.innerHTML = str;
  ul.style.display = "block";
}
