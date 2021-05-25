<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of configSQLphp
 *
 * @author ira3ck
 */

class configSQLphp {
    protected $serverName;
    protected $userName;
    protected $passCode;
    protected $dbName;
    protected $port;
    protected $socket;

    function configSQLphp() {
        $this -> serverName = 'localhost';
        $this -> userName = 'root';
        $this -> port = 3306;
        $this -> passCode = 'lio121';
        $this -> dbName = 'reypide';
        $this -> socket = "";
    }
}

