document.getElementById('bg-color').addEventListener('change', function () {
    var bgColor = document.getElementById('bg-color').value;
    document.getElementById('bg-val').innerHTML = bgColor;
    localStorage["bg-color"] = bgColor;
});

document.getElementById('effect-color').addEventListener('change', function () {
    var effectColor = document.getElementById('effect-color').value;
    document.getElementById('effect-val').innerHTML = effectColor;
    localStorage["effect-color"] = effectColor;
});

document.getElementById('gauge-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('gauge-color').value;
    document.getElementById('gauge-val').innerHTML = gaugeColor;
    localStorage["gauge-color"] = gaugeColor;
});

$(document).ready(function () {
    document.getElementById('bg-val').innerHTML = localStorage["bg-color"];
    document.getElementById('effect-val').innerHTML = localStorage["effect-color"];
    document.getElementById('gauge-val').innerHTML = localStorage["gauge-color"];
    if (localStorage["bg-color"].length > 7)
        document.getElementById('bg-color').value = localStorage["bg-color"].substring(0, 7);
    else
        document.getElementById('bg-color').value = localStorage["bg-color"];
    if (localStorage["effect-color"].length > 7)
        document.getElementById('effect-color').value = localStorage["effect-color"].substring(0, 7);
    else
        document.getElementById('effect-color').value = localStorage["effect-color"];
    if (localStorage["gauge-color"].length > 7)
        document.getElementById('gauge-color').value = localStorage["gauge-color"].substring(0, 7);
    else
        document.getElementById('gauge-color').value = localStorage["gauge-color"];
});

function reset() {
    const reset = confirm("Are you sure you want to reset?");
    if (reset) {
        localStorage.clear();
        localStorage["bg-color"] = "#1F2F2F";
        localStorage["effect-color"] = "#FFA500C0";
        localStorage["gauge-color"] = "#00BFFF";
        location.reload();
    }
}

function save() {
    window.location.href = "/";
}