function openOverlay() {
    document.getElementById("qOverlay").style.animationName = "open-overlay";
}

function closeOverlay() {
    document.getElementById("qOverlay").style.animationName = "close-overlay";
}

$(window).bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta < 0) {
        closeOverlay();
    }
})