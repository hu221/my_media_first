<?php
$cate_one = $_GET['cate_one'];
$cate_two = $_GET['cate_two'];
$pi = $_GET['pi'];
$sql = "SELECT count(*) c FROM `list` WHERE `cate_one`='$cate_one'";
//根据二级分类拼接sql语句
if ($cate_two != "全部") {
    $sql = $sql . "AND `cate_two`='$cate_two'";
}
//根据匹数进行匹配
if ($pi != "全部") {
    $sql = $sql . "AND `pi`='$pi'";
}
$link = mysqli_connect('localhost', 'root', 'root', 'media');
$res = mysqli_query($link, $sql);
$data = mysqli_fetch_all($res, MYSQLI_ASSOC);
// echo json_encode($cateone);
$arr = array(
    "message" => "获取商品列表成功",
    "code" => 1,
    "count" => $data[0]['c']
);
echo json_encode($arr);
?>
