<?php
session_start();
if (isset($_SESSION['phone'])) {
  // $arr = array(
    $phone = $_SESSION['phone'];
    // $Id => $_SESSION['Id'],
  // );
} else {
  // $arr = array(
    $phone = '登录';

  // );
}
echo json_encode($phone);
?>
