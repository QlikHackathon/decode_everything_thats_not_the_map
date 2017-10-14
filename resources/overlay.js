function openOverlay() {
    document.getElementById("qOverlay").style.animationName = "open-overlay";
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