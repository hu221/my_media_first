<?php
$link=mysqli_connect('localhost','root','root','media');

$sql="SELECT * FROM `vip`";
$res=mysqli_query($link,$sql);
$data=mysqli_fetch_all($res,MYSQLI_ASSOC);
// echo json_encode($data);
$arr=array(
    "message"=>"获取商品列表成功",
    "code"=>1,
    "img"=>$data
);
echo json_encode($arr);
?>
