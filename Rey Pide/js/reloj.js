    
    
    
    //////////////////////////////////
    ////Funciones que sirven mucho////
    //////////////////////////////////

    function elTiempo(deltatime) {
        reloj -= 1 * deltatime;
        if (Math.floor(reloj) < 0) {
            reloj = 0;
            $('#gameOver').show();
            return false;
        }
        $('.tiempo').text(Math.floor(reloj));
        return true;
    }

    function updateHUD(players) {
        $("#x").text(players[0].Bateria);

        $("#lifeP1").css('width', players[0].Bateria + '%')

        $("#y").text(players[1].Bateria);

        $("#lifeP2").css('width', 'calc(' + players[1].Bateria + '% - 40px)')

        $("#z").text("ScoreP1:" + players[0].Puntaje + " ScoreP2:" + players[1].Puntaje);
    }

    function contador(deltatime) {
        countDown -= 1 * deltatime;
        if (Math.floor(countDown) < 0) {
            countDown = 0;
            return true;
        }
        return false;
    }

    function highscore(one, two) {
        if (one > two)
            $('#highscore').text(one);
        else
            $('#highscore').text(two);
    }

    //////////////////////////////////
    //////////////////////////////////
    //////////////////////////////////