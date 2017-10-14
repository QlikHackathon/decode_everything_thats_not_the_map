function openOverlay() {
<<<<<<< HEAD
    document.getElementById("qOverlay").style.animationName = "open-overlay";
=======
>>>>>>> 14368d8902ee7c0eff2c385794ca7344b0904a7e
    document.getElementById("all_filters").style.display = "none";
}

function closeOverlay() {
    document.getElementById("qOverlay").style.animationName = "close-overlay";
    document.getElementById("all_filters").style.display = "inline";
}

$(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta < 0) {
        closeOverlay();
    }
})