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

document.getElementById('bg-t').addEventListener('change', function () {
    var gaugeColor = document.getElementById('bg-t').value;
    document.getElementById('bg-t-val').innerHTML = gaugeColor;
    localStorage["bg-color-t"] = gaugeColor;
});

document.getElementById('effect-t').addEventListener('change', function () {
    var gaugeColor = document.getElementById('effect-t').value;
    document.getElementById('effect-t-val').innerHTML = gaugeColor;
    localStorage["effect-color-t"] = gaugeColor;
});

document.getElementById('gauge-t').addEventListener('change', function () {
    var gaugeColor = document.getElementById('gauge-t').value;
    document.getElementById('gauge-t-val').innerHTML = gaugeColor;
    localStorage["gauge-color-t"] = gaugeColor;
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
    document.getElementById('bg-t-val').innerHTML = localStorage["bg-color-t"];
    document.getElementById('effect-t-val').innerHTML = localStorage["effect-color-t"];
    document.getElementById('gauge-t-val').innerHTML = localStorage["gauge-color-t"];
    document.getElementById('bg-t').value = localStorage["bg-color-t"];
    document.getElementById('effect-t').value = localStorage["effect-color-t"];
    document.getElementById('gauge-t').value = localStorage["gauge-color-t"];
});

function reset() {
    const reset = confirm("Are you sure you want to reset?");
    if (reset) {
        localStorage.clear();
        localStorage["bg-color"] = "#1F2F2F";
        localStorage["effect-color"] = "#FFA500";
        localStorage["gauge-color"] = "#00BFFF";
        localStorage["bg-color-t"] = 0;
        localStorage["effect-color-t"] = 192;
        localStorage["gauge-color-t"] = 0;
        location.reload();
    }
}

function save() {
    window.location.href = "/";
}