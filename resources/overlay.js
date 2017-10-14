function openOverlay() {
    // document.getElementById("qOverlay").style.height = "100%";
    // document.getElementById("qOverlay").style.animation = "example";
    document.getElementById("all_filters").style.display = "none";
}

function closeOverlay() {
    // document.getElementById("qOverlay").style.height = "0%";
    document.getElementById("qOverlay").style.animationName = "close-overlay";
    document.getElementById("all_filters").style.display = "inline";
}
