<?php
$current = $_GET['current'];
$pagesize = $_GET['pagesize'];
$cate_one = $_GET['cate_one'];
$cate_two = $_GET['cate_two'];
$sort = $_GET['sort'];
$pi = $_GET['pi'];

$sql = "SELECT * FROM `list` WHERE `cate_one`='$cate_one'";
//根据二级分类拼接sql语句
if ($cate_two != "全部") {
    $sql = $sql . "AND `cate_two`='$cate_two'";
}
//根据匹数进行匹配
if ($pi != "全部") {
    $sql = $sql . "AND `pi`='$pi'";
}
//拼接按价格排序
$sql = $sql . " ORDER BY `price` $sort";
//拼接分页器
$start = ($current - 1) * $pagesize;
$sql = $sql . " LIMIT $start, $pagesize";


$link = mysqli_connect('localhost', 'root', 'root', 'media');
$res = mysqli_query($link, $sql);
$data = mysqli_fetch_all($res, MYSQLI_ASSOC);
// echo json_encode($cateone);
$arr = array(
    "message" => "获取商品列表成功",
    "code" => 1,
    "list" => $data
);
echo json_encode($arr);
?>