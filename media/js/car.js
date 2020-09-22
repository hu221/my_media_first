//从localstorage里面取数
var list_stor = JSON.parse(window.localStorage.getItem("list_stor")) || [];
//渲染页面的函数
bindHtml();
function bindHtml() {
  //准备变量
  var total = 0;
  var totalPrice = 0;
  // 3-1. 计算总价
  list_stor.forEach(function (item) {
    if (item.is_select === true) {
      // 把每一个的数量叠加
      total += item.cart_number;
      // 把每一个的 单价 * 数量 叠加
      totalPrice += item.cart_number * item.price;
    }
  });
  // 3-3. 全选按钮是不是要选中
  var selectAll = list_stor.every(function (item) {
    return item.is_select;
  });
  $(".cart_body").html(
    template("cart_list", {
      list_stor: list_stor,
      selectAll: selectAll,
      total: total,
      totalPrice: totalPrice,
    })
  );
  // 把最新的数组存储进去
  // 发送一个请求
  // $.ajax({
  //   url: '../server/cart.php',
  //   method: 'POST',
  //   data: {
  //     cartList: JSON.stringify(list_stor) // '[ {}, {}, {} ]'
  //   },
  //   success (res) {
  //     console.log(res)
  //   }
  // })
  window.localStorage.setItem("list_stor", JSON.stringify(list_stor));
}
//删除按钮
$(".cart_body").on("click", ".delet", function () {
  var id = this.dataset.id - 0;
  list_stor = list_stor.filter(function (t) {
    return t.Id - 0 != id;
  });
  bindHtml();
});
//数量减少按钮
$(".cart_body").on("click", ".item_num .minus", function () {
  var id = this.dataset.id - 0;
  var goods = list_stor.find(function (t) {
    return t.Id - 0 === id;
  });
  // 判断一下
  if (goods.cart_number === 1) return;
  goods.cart_number--;
  bindHtml();
});
//数量增加按钮
$(".cart_body").on("click", ".item_num .plus", function () {
  var id = this.dataset.id - 0;
  var goods = list_stor.find(function (t) {
    return t.Id - 0 === id;
  });
  // 判断是不是到了最大值
  if (goods.cart_number === goods.goods_number) return;
  goods.cart_number++;
  bindHtml();
});
//选择按钮
$(".cart_body").on("click", ".select-item", function () {
  var id = this.dataset.id - 0;
  var goods = list_stor.find(function (t) {
    return t.Id - 0 === id;
  });
  // 修改 goods 里面得 isSelect
  goods.is_select = !goods.is_select;
  // 从新渲染页面
  bindHtml();
});
//全选按钮
$(".cart_body").on("click", ".select-all", function () {
  var type = this.checked;
  list_stor.forEach(function (t) {
    t.is_select = type;
  });
  bindHtml();
});
//清空购物车
$(".sum_shixiao").on("click", function () {
  list_stor = [];
  bindHtml();
});
//结算按钮
$(".order").on("click", function () {
  window.location.href = "./pay.html?p=" + totalPrice;
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
