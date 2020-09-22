//登录按钮的提交事件
const nameInp = document.querySelector(".type_mima input[name=phone]");
const pwdInp = document.querySelector(".type_mima input[name=password]");
$(".mima_form_deng").on("click", function (e) {
  //   console.log("点击事件成功");
  e = e || window.event;
  // 阻止默认事件
  e.preventDefault();

  let user = {
    phone: "",
    password: "",
  };
  user.phone = nameInp.value;
  user.password = pwdInp.value;
  if (!user.phone || !user.password) return alert("输入用户名和密码");
  $.ajax({
    url: "../server/login.php",
    data: user,
    dataType: "json",
    success(res) {
      const { code } = res;
      if (code === 1) {
        console.log("获取数据成功");
        window.location.href = "../html/shouye.html";
      } else if (code === 2) {
        // h3.style.display = "block";
        alert("用户名密码错误");
        console.log("获取数据失败");
      }
    },
  });
});
//在登陆界面点击注册按钮进入注册界面
$(".zhuce").on("click", function () {
  $(".denglu").removeClass("active");
  $(".zhuce_reg").addClass("active");
});
$(".already").on("click", function () {
  $(".zhuce_reg").removeClass("active");
  $(".denglu").addClass("active");
});
//注册的所有事件
const regnameInp = document.querySelector(".zhuce_reg input[name=regphone]");
const regpasswordInp = document.querySelector(
  ".zhuce_reg input[name=regpassword]"
);
$(".zhuce_btn").on("click", function (e) {
  e = e || window.event;
  // 阻止默认事件
  e.preventDefault();
  let regr = {
    phone: "",
    password: "",
  };
  regr.phone = regnameInp.value;
  regr.password = regpasswordInp.value;
  console.log(regr.phone);
  console.log(regr.password);

  $.ajax({
    url: "../server/zhuce.php",
    data: regr,
    dataType: "json",
    success(res) {
      console.log(res)
      const { code } = res;
      if (code === 1) {
        alert("注册成功，请登录");
        window.location.href = "../html/login.html";
      } else if (code === 2) {
        alert("用户名已存在");
      }
    },
  });
});
