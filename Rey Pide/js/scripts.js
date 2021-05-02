function redirect(site) {
    window.location.href = site;
}

function reload() {
    location.reload();
}

$(document).ready(function () {

    var soundIconIsMuted = false;
    var volume = 70;
    var sfxIconIsMuted = false;
    var sfx = 70;
    $("#volumeRange").val(volume);
    $('#volumeValue').text($("#volumeRange").val() + "%");
    $("#volumeSfxRange").val(sfx);
    $('#sfxValue').text($("#volumeSfxRange").val() + "%");

    $(function () {
        $('[data-toggle="popover"]').popover();
    });

    $("#howToBTN").popover({
        content: '<span class="popText px-3">¿Cómo jugar?</span>',
        html: true
    });

    $("#rankBTN").popover({
        content: '<span class="popText px-3">Ranking</span>',
        html: true
    });

    $("#confBTN").popover({
        content: '<span class="popText px-3">Ajustes</span>',
        html: true
    });

    $("#configBTN").hover(function () {
        $(this).addClass("fa-spin");
    }, function () {
        $(this).removeClass("fa-spin")
    });

    $(".menuBTN").hover(function () {
        $(this).closest(".hiddenInfo").css("animation-play-state", "running");
    }, function () {
        $(this).closest(".hiddenInfo").css("animation-play-state", "paused");
    });

    $("#soundBTN").click(function () {
        if (!soundIconIsMuted) {
            $(this).children("i").removeClass("bi-volume-up-fill");
            $(this).children("i").addClass("bi-volume-mute-fill");
            $("#volumeRange").val(0);
            $('#volumeValue').text(0 + "%");
            soundIconIsMuted = !soundIconIsMuted;
        }
        else {
            $(this).children("i").removeClass("bi-volume-mute-fill");
            $(this).children("i").addClass("bi-volume-up-fill");
            $("#volumeRange").val(volume);
            $('#volumeValue').text(volume + "%");
            soundIconIsMuted = !soundIconIsMuted;
        }
    })

    $('#volumeRange').change(function () {
        if (soundIconIsMuted) {
            $(this).children("i").removeClass("bi-volume-mute-fill");
            $(this).children("i").addClass("bi-volume-up-fill");
            soundIconIsMuted = false;
            $("#volumeRange").val(volume);
        }
        else {
            volume = $(this).val();
            var valor = volume + "%";
            $('#volumeValue').text(valor);
        }
    });

    $("#sfxBTN").click(function () {
        if (!sfxIconIsMuted) {
            $(this).children("i").removeClass("bi-volume-up-fill");
            $(this).children("i").addClass("bi-volume-mute-fill");
            $("#volumeSfxRange").val(0);
            $('#sfxValue').text(0 + "%");
            sfxIconIsMuted = !sfxIconIsMuted;
        }
        else {
            $(this).children("i").removeClass("bi-volume-mute-fill");
            $(this).children("i").addClass("bi-volume-up-fill");
            $("#volumeSfxRange").val(sfx);
            $('#sfxValue').text(sfx + "%");
            sfxIconIsMuted = !sfxIconIsMuted;
        }
    })

    $('#volumeSfxRange').change(function () {
        if (sfxIconIsMuted) {
            $(this).children("i").removeClass("bi-volume-mute-fill");
            $(this).children("i").addClass("bi-volume-up-fill");
            sfxIconIsMuted = false;
            $("#volumeSfxRange").val(sfx);
        }
        else {
            sfx = $(this).val();
            var valor = sfx + "%";
            $('#sfxValue').text(valor);
        }
    });

})