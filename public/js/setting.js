localStorage["bg-color"] ||= "#1F2F2F";
localStorage["effect-color"] ||= "#FFA500";
localStorage["gauge-color"] ||= "#00BFFF";
localStorage["gear-color"] ||= "#DCDCDC";
localStorage["text-color"] ||= "#FFFFF0";
localStorage["scratch-color"] ||= "#FF0000";
localStorage["lower-color"] ||= "#FFFFFF";
localStorage["higher-color"] ||= "#00BFFF";
localStorage["mine-color"] ||= "#DC143C";
localStorage["pgreat-color"] ||= "#C0C0C0";
localStorage["great-color"] ||= "#FFD700";
localStorage["good-color"] ||= "#ADFF2F";
localStorage["bad-color"] ||= "#8A2BE2";
localStorage["poor-color"] ||= "#8B0000";
localStorage["p1-0"] ||= "ShiftLeft";
localStorage["p1-1"] ||= "KeyZ";
localStorage["p1-2"] ||= "KeyS";
localStorage["p1-3"] ||= "KeyX";
localStorage["p1-4"] ||= "KeyD";
localStorage["p1-5"] ||= "KeyC";
localStorage["p1-6"] ||= "KeyF";
localStorage["p1-7"] ||= "KeyV";
localStorage["p2-0"] ||= "ShiftRight";
localStorage["p2-1"] ||= "KeyM";
localStorage["p2-2"] ||= "KeyK";
localStorage["p2-3"] ||= "Comma";
localStorage["p2-4"] ||= "KeyL";
localStorage["p2-5"] ||= "Period";
localStorage["p2-6"] ||= "Semicolon";
localStorage["p2-7"] ||= "Slash";
localStorage["speed-down"] ||= "Digit1";
localStorage["speed-up"] ||= "Digit2";
localStorage["speed"] ||= 10;

document.getElementById('bg-color').addEventListener('change', function () {
    var color = document.getElementById('bg-color').value;
    document.getElementById('bg-val').innerHTML = color.toUpperCase();
    localStorage["bg-color"] = color.toUpperCase();
});

document.getElementById('effect-color').addEventListener('change', function () {
    var color = document.getElementById('effect-color').value;
    document.getElementById('effect-val').innerHTML = color.toUpperCase();
    localStorage["effect-color"] = color.toUpperCase();
});

document.getElementById('gauge-color').addEventListener('change', function () {
    var color = document.getElementById('gauge-color').value;
    document.getElementById('gauge-val').innerHTML = color.toUpperCase();
    localStorage["gauge-color"] = color.toUpperCase();
});

document.getElementById('gear-color').addEventListener('change', function () {
    var color = document.getElementById('gear-color').value;
    document.getElementById('gear-val').innerHTML = color.toUpperCase();
    localStorage["gear-color"] = color.toUpperCase();
});

document.getElementById('text-color').addEventListener('change', function () {
    var color = document.getElementById('text-color').value;
    document.getElementById('text-val').innerHTML = color.toUpperCase();
    localStorage["text-color"] = color.toUpperCase();
});

document.getElementById('scratch-color').addEventListener('change', function () {
    var color = document.getElementById('scratch-color').value;
    document.getElementById('scratch-val').innerHTML = color.toUpperCase();
    localStorage["scratch-color"] = color.toUpperCase();
});

document.getElementById('lower-color').addEventListener('change', function () {
    var color = document.getElementById('lower-color').value;
    document.getElementById('lower-val').innerHTML = color.toUpperCase();
    localStorage["lower-color"] = color.toUpperCase();
});

document.getElementById('higher-color').addEventListener('change', function () {
    var color = document.getElementById('higher-color').value;
    document.getElementById('higher-val').innerHTML = color.toUpperCase();
    localStorage["higher-color"] = color.toUpperCase();
});

document.getElementById('mine-color').addEventListener('change', function () {
    var color = document.getElementById('mine-color').value;
    document.getElementById('mine-val').innerHTML = color.toUpperCase();
    localStorage["mine-color"] = color.toUpperCase();
});

document.getElementById('pgreat-color').addEventListener('change', function () {
    var color = document.getElementById('pgreat-color').value;
    document.getElementById('pgreat-val').innerHTML = color.toUpperCase();
    localStorage["pgreat-color"] = color.toUpperCase();
});

document.getElementById('great-color').addEventListener('change', function () {
    var color = document.getElementById('great-color').value;
    document.getElementById('great-val').innerHTML = color.toUpperCase();
    localStorage["great-color"] = color.toUpperCase();
});

document.getElementById('good-color').addEventListener('change', function () {
    var color = document.getElementById('good-color').value;
    document.getElementById('good-val').innerHTML = color.toUpperCase();
    localStorage["good-color"] = color.toUpperCase();
});

document.getElementById('bad-color').addEventListener('change', function () {
    var color = document.getElementById('bad-color').value;
    document.getElementById('bad-val').innerHTML = color.toUpperCase();
    localStorage["bad-color"] = color.toUpperCase();
});

document.getElementById('poor-color').addEventListener('change', function () {
    var color = document.getElementById('poor-color').value;
    document.getElementById('poor-val').innerHTML = color.toUpperCase();
    localStorage["poor-color"] = color.toUpperCase();
});

document.getElementById('speed').addEventListener('change', function () {
    var speed = document.getElementById('speed').value;
    localStorage["speed"] = Math.round(speed * 10);
});

(function () {
    document.getElementById('bg-val').innerHTML = document.getElementById('bg-color').value = localStorage["bg-color"];
    document.getElementById('effect-val').innerHTML = document.getElementById('effect-color').value = localStorage["effect-color"];
    document.getElementById('gauge-val').innerHTML = document.getElementById('gauge-color').value = localStorage["gauge-color"];
    document.getElementById('gear-val').innerHTML = document.getElementById('gear-color').value = localStorage["gear-color"];
    document.getElementById('text-val').innerHTML = document.getElementById('text-color').value = localStorage["text-color"];
    document.getElementById('scratch-val').innerHTML = document.getElementById('scratch-color').value = localStorage["scratch-color"];
    document.getElementById('lower-val').innerHTML = document.getElementById('lower-color').value = localStorage["lower-color"];
    document.getElementById('higher-val').innerHTML = document.getElementById('higher-color').value = localStorage["higher-color"];
    document.getElementById('mine-val').innerHTML = document.getElementById('mine-color').value = localStorage["mine-color"];
    document.getElementById('pgreat-val').innerHTML = document.getElementById('pgreat-color').value = localStorage["pgreat-color"];
    document.getElementById('great-val').innerHTML = document.getElementById('great-color').value = localStorage["great-color"];
    document.getElementById('good-val').innerHTML = document.getElementById('good-color').value = localStorage["good-color"];
    document.getElementById('bad-val').innerHTML = document.getElementById('bad-color').value = localStorage["bad-color"];
    document.getElementById('poor-val').innerHTML = document.getElementById('poor-color').value = localStorage["poor-color"];

    document.getElementById('p1-0').value = localStorage["p1-0"];
    document.getElementById('p1-1').value = localStorage["p1-1"];
    document.getElementById('p1-2').value = localStorage["p1-2"];
    document.getElementById('p1-3').value = localStorage["p1-3"];
    document.getElementById('p1-4').value = localStorage["p1-4"];
    document.getElementById('p1-5').value = localStorage["p1-5"];
    document.getElementById('p1-6').value = localStorage["p1-6"];
    document.getElementById('p1-7').value = localStorage["p1-7"];
    document.getElementById('p2-0').value = localStorage["p2-0"];
    document.getElementById('p2-1').value = localStorage["p2-1"];
    document.getElementById('p2-2').value = localStorage["p2-2"];
    document.getElementById('p2-3').value = localStorage["p2-3"];
    document.getElementById('p2-4').value = localStorage["p2-4"];
    document.getElementById('p2-5').value = localStorage["p2-5"];
    document.getElementById('p2-6').value = localStorage["p2-6"];
    document.getElementById('p2-7').value = localStorage["p2-7"];
    document.getElementById('speed-down').value = localStorage["speed-down"];
    document.getElementById('speed-up').value = localStorage["speed-up"];
    document.getElementById('speed').value = parseFloat(localStorage["speed"]) / 10;
})();

function reset() {
    const reset = confirm("Are you sure you want to reset?");
    if (reset) {
        localStorage.clear();
        location.reload();
    }
}

function save() {
    window.location.href = "/";
}

function setKey(e, key) {
    var x = document.getElementById(key);
    x.value = e.code;
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem(key, x.value);
    e.preventDefault();
}