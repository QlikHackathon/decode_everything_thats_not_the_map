function openOverlay() {
    document.getElementById("all_filters").style.display = "none";
}

function closeOverlay() {
    document.getElementById("qOverlay").style.animationName = "close-overlay";
    document.getElementById("all_filters").style.display = "inline";
}
