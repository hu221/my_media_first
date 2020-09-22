<?php

// 1. 拿到前端传递来的数据
$goodsId = $_GET['goodsId'];

// 2. 去数据库找数据
$link = mysqli_connect('localhost', 'root', 'root', 'media');
$sql = "SELECT * FROM `list` WHERE `Id`='$goodsId'";
$res = mysqli_query($link, $sql);
$data = mysqli_fetch_all($res, MYSQLI_ASSOC);

// 3. 返回结果给前端
$arr = array(
    "message" => "获取商品信息成功",
    "code" => 1,
    "info" => $data[0]
);
echo json_encode($arr);
?>
