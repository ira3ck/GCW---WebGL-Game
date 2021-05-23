<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of mySQLphpClass
 *
 * @author ira3ck
 */
include 'configSQLphp.php';

class mySQLphpClass extends configSQLphp {

    public $connectionString;
    public $dataSet;
    private $sqlQuery;
    protected $databaseName;
    protected $hostName;
    protected $userName;
    protected $passCode;
    protected $puerto;
    protected $socket;

    function mySQLphpClass() {
        $this->connectionString = NULL;
        $this->sqlQuery = NULL;
        $this->dataSet = NULL;

        $dbPara = new configSQLphp();
        $this->databaseName = $dbPara->dbName;
        $this->hostName = $dbPara->serverName;
        $this->userName = $dbPara->userName;
        $this->passCode = $dbPara->passCode;
        $this->socket = $dbPara->socket;
        $this->puerto = $dbPara->port;
        $dbPara = NULL;
    }

    private function connect() {
        $this->connectionString = new mysqli($this->hostName, $this->userName, $this->passCode, $this->databaseName, $this->puerto, $this->socket)
                or die('Could not connect to the database server' . mysqli_connect_error());
    }

    private function byebye() {
        $this->connectionString->close();
    }

    function varQuery($string) {
        if ($string == null) {
            $string = "null";
        } else {
            $string = "'" . $string . "'";
        }
        return $string;
    }

    function usuarios($usuario, $contraseña, $imagen, $newUser, $newpass, $opc) {
        $this->connect();
        $sql = "call procdml_usuarios(" . $this->varQuery($usuario) . ", " . $this->varQuery($contraseña) . ", " . $this->varQuery($imagen) . ", "
         . $this->varQuery($newUser) . ", " . $this->varQuery($newpass) . ", " . $this->varQuery($opc) . ");";
        $result = $this->connectionString->query($sql);
        $this->byebye();
        return $result;
    }

    function inSes($usuario, $contraseña) {
        $this->connect();
        $sql = "call proc_inses(" . $this->varQuery($usuario) . ", " . $this->varQuery($contraseña) . ");";
        $result = $this->connectionString->query($sql);
        $this->byebye();
        //echo $sql;
        return $result;
    }

}
