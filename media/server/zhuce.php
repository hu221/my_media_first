<?php
$phone = trim($_GET['phone']);
$password = trim($_GET['password']);

//从数据库里面查询
$sql = "SELECT * FROM `login` WHERE `phone`='$phone'";

//连接数据库
$link = mysqli_connect('localhost', 'root', 'root', 'media');
$res = mysqli_query($link, $sql);
// res 是一个查询出来的结果， 我们看不懂
$data = mysqli_fetch_all($res, MYSQLI_ASSOC);
// 解析一下， 成为一个数组

/*
    array()

    array(
        "0" => array()
    )

    count($data)
*/

if (count($data)) {
    //如果不为空，就提示用户名已存在
    $arr = array(
        "message" => "用户名已存在php",
        "code" => 2
    );
    echo json_encode($arr);
} else {
    //如果为空，即数据库里面没有这条信息，就插入
    $link = mysqli_connect('localhost', 'root', 'root', 'media');
    $sqlin = "INSERT INTO `login` (`phone`, `password`) VALUES('$phone','$password')";
    $res = mysqli_query($link, $sqlin);
    /*
        查询需要解析
        增删改不需要解析
    */
    // $data = mysqli_fetch_all($res, MYSQLI_ASSOC);
    $arr = array(
        "message" => "注册成功，请登录",
        "code" => 1
    );
    echo json_encode($arr);
}
// 返回结果

?>
