(function (window) {
  //获取元素
  const goodsBox = document.querySelector(".list > ul");
  const cateBox = document.querySelector(".filter .cate ul");
  const jixingBox = document.querySelector(".filter .jixing ul");
  //准备一个列表信息
  const listInfo = {
    current: 1,
    pagesize: 2,
    cate_one: "空调",
    cate_two: "全部",
  };
  //筛选框请求渲染
  let shai = [];
  //筛选框的默认列表
  const list_info = {
    cate_one: "空调",
    cate_two: "全部",
  };

  let goods_list = [];
  //请求筛选部分的数据
  getShai();
  function getShai() {
    $.ajax({
      url: "../server/er.php",
      dataType: "json",
      success(res) {
        shai = res.list;
        bindShai(shai);
      },
    });
  }
  //渲染筛选部分的数据
  function bindShai(list) {
    cateBox.innerHTML = template("shai", { list });
    goods_list = list;
    // console.log(goods_list);
  }
  // 一级分类的点击事件(事件委托给 li)
  $(cateBox).on("click", "li", function () {
    // cate 是一级分类的名称
    const cate = this.dataset.cate;
    // 1. 渲染二级分类
    // 比如你拿到的是 空调
    // 去 list 里面找到 category === ‘空调’
    const er_cate_list = JSON.parse(
      goods_list.find((item) => item.category === cate).er_l
    );
    // console.log(er_cate_list);
    //模板引擎渲染二级列表
    $(".jixing ul").html(template("er_cate_list", { list: er_cate_list }));

    // 2. 获取商品列表
    list_info.cate_one = cate;
    list_info.cate_two = "全部";
    // getGoodsList();
    getShang();
  });
  //二级分类的点击事件
  $(".jixing ul").on("click", "li", function () {
    listInfo.cate_two = $(this).text();
    console.log(listInfo.cate_two)
    // 获取二级分类的名称
    // const cate_two = this.dataset.cate;
    // list_info.cate_two = cate_two;
    //1、获取商品列表
    // getGoodsList();
    getShang();
  });
  //商品列表部分

  // getGoodsList();
  function getGoodsList() {
    // console.group("发送 ajax 请求请求 商品列表");
    getShang();
    // console.log(list_info);
    // console.log(
    //   `我要请求一级分类为 ${list_info.cate_one}, 并且二级分类为 ${list_info.cate_two} 的商品列表`
    // );
    // console.groupEnd();
  }
  //请求商品列表
  function getShang() {
    $.ajax({
      url: "../server/goodsList.php",
      method: "get",
      data: listInfo,
      dataType: "json",
      success(res) {
        // console.log("获取商品列表成功");
        // console.log(res);
        list = res.list;
        bindShang(list);
      },
    });
  }
  //渲染商品列表
  function bindShang(list) {
    $(".list ul").html(template("goodsTmp", { list }));
  }
})(window);
