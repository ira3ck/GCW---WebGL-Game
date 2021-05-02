var reloj = 10;

function elTiempo(deltatime){
    reloj -= 1 * deltatime;
    if (Math.floor(reloj) < 0)
        reloj = 0;

    $('.tiempo').text(Math.floor(reloj));
}