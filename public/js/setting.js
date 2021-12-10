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

document.getElementById('gear-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('gear-color').value;
    document.getElementById('gear-val').innerHTML = gaugeColor;
    localStorage["gear-color"] = gaugeColor;
});

document.getElementById('text-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('text-color').value;
    document.getElementById('text-val').innerHTML = gaugeColor;
    localStorage["text-color"] = gaugeColor;
});

document.getElementById('scratch-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('scratch-color').value;
    document.getElementById('scratch-val').innerHTML = gaugeColor;
    localStorage["scratch-color"] = gaugeColor;
});

document.getElementById('lower-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('lower-color').value;
    document.getElementById('lower-val').innerHTML = gaugeColor;
    localStorage["lower-color"] = gaugeColor;
});

document.getElementById('higher-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('higher-color').value;
    document.getElementById('higher-val').innerHTML = gaugeColor;
    localStorage["higher-color"] = gaugeColor;
});

document.getElementById('mine-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('mine-color').value;
    document.getElementById('mine-val').innerHTML = gaugeColor;
    localStorage["mine-color"] = gaugeColor;
});

document.getElementById('pgreat-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('pgreat-color').value;
    document.getElementById('pgreat-val').innerHTML = gaugeColor;
    localStorage["pgreat-color"] = gaugeColor;
});

document.getElementById('great-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('great-color').value;
    document.getElementById('great-val').innerHTML = gaugeColor;
    localStorage["great-color"] = gaugeColor;
});

document.getElementById('good-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('good-color').value;
    document.getElementById('good-val').innerHTML = gaugeColor;
    localStorage["good-color"] = gaugeColor;
});

document.getElementById('bad-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('bad-color').value;
    document.getElementById('bad-val').innerHTML = gaugeColor;
    localStorage["bad-color"] = gaugeColor;
});

document.getElementById('poor-color').addEventListener('change', function () {
    var gaugeColor = document.getElementById('poor-color').value;
    document.getElementById('poor-val').innerHTML = gaugeColor;
    localStorage["poor-color"] = gaugeColor;
});

$(document).ready(function () {
    document.getElementById('bg-val').innerHTML = localStorage["bg-color"];
    document.getElementById('effect-val').innerHTML = localStorage["effect-color"];
    document.getElementById('gauge-val').innerHTML = localStorage["gauge-color"];
    document.getElementById('gear-val').innerHTML = localStorage["gear-color"];
    document.getElementById('text-val').innerHTML = localStorage["text-color"];
    document.getElementById('scratch-val').innerHTML = localStorage["scratch-color"];
    document.getElementById('lower-val').innerHTML = localStorage["lower-color"];
    document.getElementById('higher-val').innerHTML = localStorage["higher-color"];
    document.getElementById('mine-val').innerHTML = localStorage["mine-color"];
    document.getElementById('pgreat-val').innerHTML = localStorage["pgreat-color"];
    document.getElementById('great-val').innerHTML = localStorage["great-color"];
    document.getElementById('good-val').innerHTML = localStorage["good-color"];
    document.getElementById('bad-val').innerHTML = localStorage["bad-color"];
    document.getElementById('poor-val').innerHTML = localStorage["poor-color"];

    document.getElementById('bg-color').value = localStorage["bg-color"];
    document.getElementById('effect-color').value = localStorage["effect-color"];
    document.getElementById('gauge-color').value = localStorage["gauge-color"];
    document.getElementById('gear-color').value = localStorage["gear-color"];
    document.getElementById('text-color').value = localStorage["text-color"];
    document.getElementById('scratch-color').value = localStorage["scratch-color"];
    document.getElementById('lower-color').value = localStorage["lower-color"];
    document.getElementById('higher-color').value = localStorage["higher-color"];
    document.getElementById('mine-color').value = localStorage["mine-color"];
    document.getElementById('pgreat-color').value = localStorage["pgreat-color"];
    document.getElementById('great-color').value = localStorage["great-color"];
    document.getElementById('good-color').value = localStorage["good-color"];
    document.getElementById('bad-color').value = localStorage["bad-color"];
    document.getElementById('poor-color').value = localStorage["poor-color"];
});

function reset() {
    const reset = confirm("Are you sure you want to reset?");
    if (reset) {
        localStorage.clear();
        localStorage["bg-color"] = "#1F2F2F";
        localStorage["effect-color"] = "#FFA500";
        localStorage["gauge-color"] = "#00BFFF";
        localStorage["gear-color"] = "#DCDCDC";
        localStorage["text-color"] = "#FFFFF0";
        localStorage["scratch-color"] = "#FF0000";
        localStorage["lower-color"] = "#FFFFFF";
        localStorage["higher-color"] = "#00BFFF";
        localStorage["mine-color"] = "#DC143C";
        localStorage["pgreat-color"] = "#FFFFFF";
        localStorage["great-color"] = "#FFD700";
        localStorage["good-color"] = "#ADFF2F";
        localStorage["bad-color"] = "#8A2BE2";
        localStorage["poor-color"] = "#8B0000";
        location.reload();
    }
}

function save() {
    window.location.href = "/";
}