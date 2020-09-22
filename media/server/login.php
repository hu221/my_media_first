<?php

$phone = trim($_GET['phone']);
$password = trim($_GET['password']);

//连接数据库
$link = mysqli_connect('localhost', 'root', 'root', 'media');
$sql = "SELECT * FROM `login` WHERE `phone`='$phone' AND `password`='$password'";
$res = mysqli_query($link, $sql);
$data = mysqli_fetch_all($res, MYSQLI_ASSOC);
// echo json_encode($data[0]);
// 3. 判断结果
if (count($data)) {
    //向session里面存数
    session_start();
    $_SESSION['login'] = 1;
    $_SESSION['phone'] = $data[0]['phone'];
    $_SESSION['Id'] = $data[0]['Id'];
    $arr = array(
        "message" => "登录成功",
        "code" => 1,
        "userId" => $data[0]['Id']
    );
} else {
    $arr = array(
        "message" => "登录失败",
        "code" => 2
    );
}

// 返回结果
echo json_encode($arr);
?>