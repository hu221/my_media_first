// 1. 拿到传递过来商品 id
const obj = parseQueryString(window.location.search);

// 判断有没有商品 id , 如果没有, 跳转回列表页面
// if (!obj.Id) return (window.location.href = "../html/list_new.html");
const goodsId = obj.goodsId;
// console.log(goodsId);
// 2. 根据 goodsId 去请求数据
getGoodsInfo();
function getGoodsInfo() {
  $.ajax({
    url: "../server/goodsInfo.php",
    data: { goodsId },
    dataType: "json",
    success(res) {
      const { info } = res;
      bindHtml(info);
    },
  });
}
//渲染商品列表请求的数据
function bindHtml(goodsInfo) {
  //展示的图片
  const left_show_img = document.querySelector(".show img");
  //商品描述名字
  const desc = document.querySelector(".pro_right .desc");
  //商品价格
  const price = document.querySelector(".price_inner .new_price");
  //商品折后价
  const price_pro = document.querySelector(".price_inner .pro_price");
  //卖点
  const sell_point = document.querySelector(".pro_right h5");
  //用券
  const coupon = document.querySelector(".yongquan");
  //放大镜图片列表图片一
  const imgone = document.querySelector(".show_list .imgone");
  //放大镜图片列表图片二
  const imgtwo = document.querySelector(".show_list .imgtwo");
  //加入购物车按钮
  const btn_car = document.querySelector(".btn .car");

  left_show_img.src = goodsInfo.img;
  desc.innerHTML = goodsInfo.name;
  price.innerHTML = "￥ " + goodsInfo.price_pro;
  price_pro.innerHTML = "￥ " + goodsInfo.price;
  sell_point.innerHTML = goodsInfo.sell;
  coupon.innerHTML = goodsInfo.coupon;
  imgone.src = goodsInfo.img;
  imgone.dataset.show = goodsInfo.img;
  imgone.dataset.big = goodsInfo.img;
  imgtwo.src = goodsInfo.small_img;
  imgtwo.dataset.show = goodsInfo.small_img;
  imgtwo.dataset.big = goodsInfo.small_img;
  btn_car.dataset.goodsid = goodsInfo.Id;

  $(".btn .car").on("click", function () {
    addCart(goodsInfo, this);
  });
}

//面向对象放大镜
class Enlarge {
  constructor(ele) {
    this.ele = document.querySelector(ele);
    this.show = this.ele.querySelector(".show");
    this.mask = this.ele.querySelector(".mask");
    this.enlarge = this.ele.querySelector(".enlarge");
    this.list = this.ele.querySelector(".show_list");
    this.getProp();
    this.overOut();
    this.setScale();
    this.move();
    this.bindEvent();
  }
  // 1. 移入移出
  overOut() {
    // 移入 show 显示, 移出 show 隐藏
    this.show.addEventListener("mouseover", () => {
      this.mask.classList.add("active");
      this.enlarge.classList.add("active");
    });

    this.show.addEventListener("mouseout", () => {
      this.mask.classList.remove("active");
      this.enlarge.classList.remove("active");
    });
  }

  // 2-0. 获取尺寸这些事情提取出来
  getProp() {
    // 2-1. 获取遮罩层尺寸
    this.mask_width = parseInt(window.getComputedStyle(this.mask).width);
    this.mask_height = parseInt(window.getComputedStyle(this.mask).height);
    // 2-2. show 盒子尺寸
    this.show_width = this.show.offsetWidth;
    this.show_height = this.show.offsetHeight;
    // 2-3. 背景图尺寸
    const bg = window.getComputedStyle(this.enlarge).backgroundSize.split(" ");
    this.bg_width = parseInt(bg[0]);
    this.bg_height = parseInt(bg[1]);
  }

  // 2. 调整比例
  setScale() {
    // 2-4. 计算
    this.enlarge_width = (this.mask_width / this.show_width) * this.bg_width;
    this.enlarge_height =
      (this.mask_height / this.show_height) * this.bg_height;

    // 2-5. 设置
    this.enlarge.style.width = this.enlarge_width + "px";
    this.enlarge.style.height = this.enlarge_height + "px";
  }

  // 3. 动起来
  move() {
    // 3-1. 给 show 盒子绑定一个鼠标移动事件
    this.show.addEventListener("mousemove", (e) => {
      // 处理事件对象兼容
      e = e || window.event;

      // 3-2. 那坐标
      let x = e.offsetX - 100;
      let y = e.offsetY - 100;

      // 3-3. 边界值判断
      if (x <= 0) x = 0;
      if (y <= 0) y = 0;
      if (x >= this.show_width - this.mask_width)
        x = this.show_width - this.mask_width;
      if (y >= this.show_height - this.mask_height)
        y = this.show_height - this.mask_height;

      // 3-4. 给遮罩层赋值
      this.mask.style.left = x + "px";
      this.mask.style.top = y + "px";

      // 3-5. 右边跟着动
      const moveX = (this.enlarge_width * x) / this.mask_width;
      const moveY = (this.enlarge_height * y) / this.mask_height;

      // 3-6. 给背景图赋值
      this.enlarge.style.backgroundPosition = `-${moveX}px -${moveY}px`;
    });
  }

  // 4. 绑定事件
  bindEvent() {
    // 4-1. 给 this.list 绑定一个点击事件
    this.list.addEventListener("click", (e) => {
      // 处理事件对象兼容
      e = e || window.event;
      // 处理事件目标兼容
      const target = e.target || e.srcElement;

      if (target.nodeName === "IMG") {
        // 4-2. 切换边框显示
        for (let i = 0; i < this.list.children.length; i++) {
          this.list.children[i].classList.remove("active");
        }
        // 当前点击的是 img, 得让父元素有 active
        target.parentElement.classList.add("active");

        // 4-3. 换图片
        // 拿到当前点击的这个元素的身上的自定义属性
        const showImg = target.dataset.show;
        const enlargeImg = target.dataset.big;

        // 赋值给对应的值
        this.show.firstElementChild.src = showImg;
        this.enlarge.style.backgroundImage = `url(${enlargeImg})`;
      }
    });
  }
}

//加入购物车的点击按钮的函数(向localStorage里面存数)
function addCart(goodsInfo, that) {
  // 1. 在button上设置有data-goodsid属性，能确定商品的id,拿到这个属性
  let a_btn = $(that).data("goodsid");
  // console.log("a_btn", a_btn);
  // console.log("goodsInfo", goodsInfo);
  // 2. 把goodsInfo赋值给goods就可以
  var goods = goodsInfo;
  // console.log("goods", goods);
  goods.is_select = false;
  // 3. 先从 localStorage 里面获取一个数组
  var list_stor = JSON.parse(window.localStorage.getItem("list_stor")) || [];
  // 4. 向数组里面添加
  if (!list_stor.length) {
    // 数组没有内容就添加进去
    goods.cart_number = 1;
    list_stor.push(goods);
  } else {
    // 数组里面有内容
    // 4-2. 先看看数组里面是不是有这条数据
    // some() 只要数组里面又任意一条满足要求的就是 true
    // 看看数组(list_stor)里面是不是有一个 goods_id 和我点击的这个数据 id 一样的
    var res = list_stor.some(function (item) {
      return item.Id - 0 === a_btn;
    });
    if (res) {
      // 数组里面有你当前点击的这条数据
      // 把这条数据的 cart_number++
      // 找到索引 findIndex
      var index = list_stor.findIndex(function (item) {
        return item.Id - 0 === a_btn;
      });
      list_stor[index].cart_number++;
    } else {
      // 数组里面没有你当前点击的这条数据
      goods.cart_number = 1;
      list_stor.push(goods);
    }
  }

  // 5. 组装好的数组存起来
  window.localStorage.setItem("list_stor", JSON.stringify(list_stor));
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
      // console.log("登录成功，显示该用户的购物车信息");
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
//倒计时
// 目标时间
var target = new Date(2021, 7, 10, 18, 30, 00);
function daojishi() {
  // 获取当前时间
  var current = new Date();
  var diff = getTimeDifference(current, target);
  // console.log(diff)
  if (diff.day < 10) diff.day = "0" + diff.day;
  if (diff.hours < 10) diff.hours = "0" + diff.hours;
  if (diff.minutes < 10) diff.minutes = "0" + diff.minutes;
  if (diff.seconds < 10) diff.seconds = "0" + diff.seconds;

  const dayBox = document.querySelector("#dayBox");
  const hoursBox = document.querySelector("#hoursBox");
  const minutesBox = document.querySelector("#minutesBox");
  const secondsBox = document.querySelector("#secondsBox");
  dayBox.innerText = diff.day;
  hoursBox.innerText = diff.hours;
  minutesBox.innerText = diff.minutes;
  secondsBox.innerText = diff.seconds;
}
daojishi();
setInterval(daojishi, 1000);
//领取优惠券

