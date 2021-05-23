<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

include '../mySQLphpClass.php';

function reArrayFiles(&$file_post) {
    $isMulti = is_array($file_post['name']);
    $file_count = $isMulti ? count($file_post['name']) : 1;
    $file_keys = array_keys($file_post);

    $file_ary = [];
    for ($i = 0; $i < $file_count; $i++) {
        foreach ($file_keys as $key) {
            if ($isMulti) {
                $file_ary[$i][$key] = $file_post[$key][$i];
            } else {
                $file_ary[$i][$key] = $file_post[$key];
            }
        }
    }

    return $file_ary;
}

if (isset($_POST['action'])) {

    if ($_POST['action'] == 'inSes') {
        $thing = new mySQLphpClass();

        $result = $thing->inSes($_POST['user'], $_POST['pass']);

        $rows = array();

        while ($r = $result->fetch_assoc()) {
            array_push($rows, $r);
        }
        echo json_encode($rows);
    }

    if ($_POST['action'] == 'regis') {
        $thing = new mySQLphpClass();

        $result = $thing->usuarios($_POST['user'], $_POST['pass'], $_POST['img'], null, null, 'I');

        $rows = array();
        while ($r = $result->fetch_assoc()) {
            array_push($rows, $r);
        }
        echo json_encode($rows);
    }

    if ($_POST['action'] == 'modif') {
        $thing = new mySQLphpClass();

        $result = $thing->usuarios($_POST['user'], $_POST['pass'], $_POST['img'], $_POST['newUser'], $_POST['newpass'], 'U');

        $rows = array();
        while ($r = $result->fetch_assoc()) {
            array_push($rows, $r);
        }
        echo json_encode($rows);
    }
}
?>

