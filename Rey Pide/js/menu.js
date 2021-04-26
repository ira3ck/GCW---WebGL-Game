$(document).ready(function(){

    $('#nivelesBTN').hide();

    $('#localBTN').click(function(){
        $(this).parent().parent().hide();
        $('#nivelesBTN').show();
    });

});