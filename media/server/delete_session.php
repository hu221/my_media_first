<?php
session_start();
if (isset($_SESSION['phone'])) {
    unset($_SESSION['phone']);
    echo json_encode('删除成功');
    $phone = '登录';
  } else {
    $phone = '登录';
    
  }
  
  echo json_encode($phone);
?>
