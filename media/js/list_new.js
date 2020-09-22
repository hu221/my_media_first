//准备一个默认列表
const listInfo = {
  current: 1,
  pagesize: 16,
  cate_one: "空调",
  cate_two: "全部",
  sort: "ASC", // 'DESC'
  pi: "全部",
};
// console.log("最开始cate_two的值:" + listInfo.cate_two);
//请求一级分类和二级分类
let cate_one_list = [];
let good_list = [];
getCateone();
function getCateone() {
  $.ajax({
    url: "../server/er.php",
    dataType: "json",
    success(res) {
      //   console.log("请求成功");
      //   console.log(res.list);
      cate_one_list = res.list;
      bindCateone(cate_one_list);
    },
  });
}
//渲染一级分类
function bindCateone(list) {
  $(".cate_one ul").html(template("cate_one", { list }));
  good_list = list;
  getYiCount();
}
//一级分类的点击事件(2个：商品列表+对应的二级分类)
$(".cate_one ul").on("click", "li", function () {
  //更改一级分类
  // console.log(this);
  var co_that = this.dataset.cate;
  listInfo.cate_one = co_that;

  const cateOne = this.dataset.cate;
  //渲染对应的二级分类
  const er_cate_list = JSON.parse(
    good_list.find((item) => item.category === cateOne).er_l
  );
  $(".cate_two ul").html(template("cate_two", { list: er_cate_list }));
  //获取分页器(一级分类默认的全部这类的商品列表)
  getYiCount();
});
//二级分类的点击事件(2个：二级分类筛选之后的商品列表+对应的再次筛选分类)
$(".cate_two ul").on("click", "li", function () {
  //筛选之后获取商品列表
  // console.log(this);
  var ct_that = this.dataset.cate;
  listInfo.cate_two = ct_that;
  // console.log("进行时:", listInfo.cate_two);
  getYiCount();
  //对应的再次筛选分类
  geterShai();
});
//空调匹数的点击事件(再次筛选之后的商品列表)
$(".pi ul").on("click", "li", function () {
  // console.log(this);
  var pi_that = this.dataset.cate;
  listInfo.pi = pi_that;
  // console.log(listInfo.pi);
  //再次筛选之后的商品列表
  getYiCount();
});

//请求分页器
function getYiCount() {
  $.ajax({
    url: "../server/fenyeqi.php",
    data: {
      current: listInfo.current,
      pagesize: listInfo.pagesize,
      cate_one: listInfo.cate_one,
      cate_two: listInfo.cate_two,
      sort: listInfo.sort,
      pi: listInfo.pi,
    },
    dataType: "json",
    success(res) {
      const { count } = res;
      bindPagi(count - 0);
    },
  });
}
//渲染分页器
const pagiBox = document.querySelector(".pagi");
function bindPagi(count) {
  const div = document.createElement("div");
  div.className = "pagination";
  pagiBox.append(div);

  new Pagination(".pagi > .pagination", {
    current: listInfo.current,
    pagesize: listInfo.pagesize,
    total: count,
    first: "首页",
    prev: "上一页",
    next: "下一页",
    last: "末页",
    go: "跳转",
    change(num) {
      listInfo.current = num;
      getGoodsList();
    },
  });
}
//请求商品列表
function getGoodsList() {
  $.ajax({
    url: "../server/goodsList.php",
    data: listInfo,
    dataType: "json",
    success(res) {
      const { list } = res;
      bindGoodsList(list);
    },
  });
}
//渲染商品列表
function bindGoodsList(list) {
  $(".goodslist ul").html(template("goodsTmp", { list }));
  //给商品列表的加入购物车界面添加事件
  $(".goodslist .car button").on("click", function () {
    console.log("button点击事件里面的this", this);
    addCart(list, this);
  });
}
//绑定排序按钮的事件
const sortBox = document.querySelector(".sort > ul");
sortBox.addEventListener("click", (e) => {
  // console.log(this);
  e = e || window.event;
  const target = e.target || e.srcElement;

  if (target.nodeName === "LI") {
    const sort = target.dataset.sort;
    listInfo.sort = sort;
    listInfo.current = 1;
    target.dataset.sort = sort === "ASC" ? "DESC" : "ASC";
    getCount();
    [...sortBox.children].forEach((item) => (item.className = ""));
    target.className = "active";
  }
});
//请求二级分类的点击筛选事件
function geterShai() {
  $.ajax({
    url: "../server/ershai.php",
    dataType: "json",
    success(res) {
      // console.log(res.list);
      list = res.list;
      // console.log(list);
      binderShai(list);
    },
  });
}
//渲染二级分类的点击筛选事件
function binderShai(list) {
  $(".pi ul").html(template("pi", { list }));
  $(".ding ul").html(template("ding", { list }));
  $(".cold ul").html(template("cold", { list }));
  $(".neng ul").html(template("neng", { list }));
}
//加入购物车的点击按钮的函数(向localStorage里面存数)
//另一个作用就是向用户登录的表里添加要加入购物车的商品信息
function addCart(list, that) {
  // 1. 在button上设置有data-goodsid属性，能确定商品的id,拿到这个属性
  let a_btn = $(that).data("goodsid");
  console.log("button上设置有data-goodsid属性", a_btn);
  // 2. 在原始数组里面找到数据
  var goods = list.find(function (item) {
    // console.log(item.Id);
    return item.Id - 0 === a_btn - 0;
  });
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
    console.log(res);
    if (res) {
      // 数组里面有你当前点击的这条数据
      // 把这条数据的 cart_number++
      // 找到索引 findIndex
      var index = list.findIndex(function (item) {
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
    console.log('从session里面取出来的数为',res);
    $(".lo_deng").html(res);
   let lo_deng_text = $(".lo_deng").html();
    // console.log("从session取数的登陆值", lo_deng_text);
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
