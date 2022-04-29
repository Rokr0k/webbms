localStorage["bg-color"] ||= "#1F2F2F";
localStorage["effect-color"] ||= "#FFA500";
localStorage["gauge-color"] ||= "#00BFFF";
localStorage["gear-color"] ||= "#DCDCDC";
localStorage["text-color"] ||= "#FFFFF0";
localStorage["bms-scratch-color"] ||= "#FF0000";
localStorage["bms-lower-color"] ||= "#FFFFFF";
localStorage["bms-higher-color"] ||= "#00BFFF";
localStorage["bms-mine-color"] ||= "#DC143C";
localStorage["bms-pgreat-color"] ||= "#C0C0C0";
localStorage["bms-great-color"] ||= "#FFD700";
localStorage["bms-good-color"] ||= "#ADFF2F";
localStorage["bms-bad-color"] ||= "#8A2BE2";
localStorage["bms-poor-color"] ||= "#8B0000";
localStorage["pms-0-color"] ||= "#FFFFFF";
localStorage["pms-1-color"] ||= "#FFFF00";
localStorage["pms-2-color"] ||= "#00FF00";
localStorage["pms-3-color"] ||= "#00FFFF";
localStorage["pms-4-color"] ||= "#FF0000";
localStorage["pms-mine-color"] ||= "#808080";
localStorage["pms-cool-color"] ||= "#FF80FF";
localStorage["pms-great-color"] ||= "#FFFF80";
localStorage["pms-bad-color"] ||= "#FF4040";
localStorage["pms-poor-color"] ||= "#40FFFF";
localStorage["bms-p1-0-u"] ||= "ShiftLeft";
localStorage["bms-p1-0-d"] ||= "ControlLeft";
localStorage["bms-p1-1"] ||= "KeyZ";
localStorage["bms-p1-2"] ||= "KeyS";
localStorage["bms-p1-3"] ||= "KeyX";
localStorage["bms-p1-4"] ||= "KeyD";
localStorage["bms-p1-5"] ||= "KeyC";
localStorage["bms-p1-6"] ||= "KeyF";
localStorage["bms-p1-7"] ||= "KeyV";
localStorage["bms-p2-0-u"] ||= "ShiftRight";
localStorage["bms-p2-0-d"] ||= "ControlRight";
localStorage["bms-p2-1"] ||= "KeyM";
localStorage["bms-p2-2"] ||= "KeyK";
localStorage["bms-p2-3"] ||= "Comma";
localStorage["bms-p2-4"] ||= "KeyL";
localStorage["bms-p2-5"] ||= "Period";
localStorage["bms-p2-6"] ||= "Semicolon";
localStorage["bms-p2-7"] ||= "Slash";
localStorage["pms-0"] ||= "KeyC";
localStorage["pms-1"] ||= "KeyF";
localStorage["pms-2"] ||= "KeyV";
localStorage["pms-3"] ||= "KeyG";
localStorage["pms-4"] ||= "KeyB";
localStorage["pms-5"] ||= "KeyH";
localStorage["pms-6"] ||= "KeyN";
localStorage["pms-7"] ||= "KeyJ";
localStorage["pms-8"] ||= "KeyM";
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

document.getElementById('bms-scratch-color').addEventListener('change', function () {
    var color = document.getElementById('bms-scratch-color').value;
    document.getElementById('bms-scratch-val').innerHTML = color.toUpperCase();
    localStorage["bms-scratch-color"] = color.toUpperCase();
});

document.getElementById('bms-lower-color').addEventListener('change', function () {
    var color = document.getElementById('bms-lower-color').value;
    document.getElementById('bms-lower-val').innerHTML = color.toUpperCase();
    localStorage["bms-lower-color"] = color.toUpperCase();
});

document.getElementById('bms-higher-color').addEventListener('change', function () {
    var color = document.getElementById('bms-higher-color').value;
    document.getElementById('bms-higher-val').innerHTML = color.toUpperCase();
    localStorage["bms-higher-color"] = color.toUpperCase();
});

document.getElementById('bms-mine-color').addEventListener('change', function () {
    var color = document.getElementById('bms-mine-color').value;
    document.getElementById('bms-mine-val').innerHTML = color.toUpperCase();
    localStorage["bms-mine-color"] = color.toUpperCase();
});

document.getElementById('bms-pgreat-color').addEventListener('change', function () {
    var color = document.getElementById('bms-pgreat-color').value;
    document.getElementById('bms-pgreat-val').innerHTML = color.toUpperCase();
    localStorage["bms-pgreat-color"] = color.toUpperCase();
});

document.getElementById('bms-great-color').addEventListener('change', function () {
    var color = document.getElementById('bms-great-color').value;
    document.getElementById('bms-great-val').innerHTML = color.toUpperCase();
    localStorage["bms-great-color"] = color.toUpperCase();
});

document.getElementById('bms-good-color').addEventListener('change', function () {
    var color = document.getElementById('bms-good-color').value;
    document.getElementById('bms-good-val').innerHTML = color.toUpperCase();
    localStorage["bms-good-color"] = color.toUpperCase();
});

document.getElementById('bms-bad-color').addEventListener('change', function () {
    var color = document.getElementById('bms-bad-color').value;
    document.getElementById('bms-bad-val').innerHTML = color.toUpperCase();
    localStorage["bms-bad-color"] = color.toUpperCase();
});

document.getElementById('bms-poor-color').addEventListener('change', function () {
    var color = document.getElementById('bms-poor-color').value;
    document.getElementById('bms-poor-val').innerHTML = color.toUpperCase();
    localStorage["bms-poor-color"] = color.toUpperCase();
});

document.getElementById('pms-0-color').addEventListener('change', function () {
    var color = document.getElementById('pms-0-color').value;
    document.getElementById('pms-0-val').innerHTML = color.toUpperCase();
    localStorage["pms-0-color"] = color.toUpperCase();
});

document.getElementById('pms-1-color').addEventListener('change', function () {
    var color = document.getElementById('pms-1-color').value;
    document.getElementById('pms-1-val').innerHTML = color.toUpperCase();
    localStorage["pms-1-color"] = color.toUpperCase();
});

document.getElementById('pms-2-color').addEventListener('change', function () {
    var color = document.getElementById('pms-2-color').value;
    document.getElementById('pms-2-val').innerHTML = color.toUpperCase();
    localStorage["pms-2-color"] = color.toUpperCase();
});

document.getElementById('pms-3-color').addEventListener('change', function () {
    var color = document.getElementById('pms-3-color').value;
    document.getElementById('pms-3-val').innerHTML = color.toUpperCase();
    localStorage["pms-3-color"] = color.toUpperCase();
});

document.getElementById('pms-4-color').addEventListener('change', function () {
    var color = document.getElementById('pms-4-color').value;
    document.getElementById('pms-4-val').innerHTML = color.toUpperCase();
    localStorage["pms-4-color"] = color.toUpperCase();
});

document.getElementById('pms-mine-color').addEventListener('change', function () {
    var color = document.getElementById('pms-mine-color').value;
    document.getElementById('pms-mine-val').innerHTML = color.toUpperCase();
    localStorage["pms-mine-color"] = color.toUpperCase();
});

document.getElementById('pms-cool-color').addEventListener('change', function () {
    var color = document.getElementById('pms-cool-color').value;
    document.getElementById('pms-cool-val').innerHTML = color.toUpperCase();
    localStorage["pms-cool-color"] = color.toUpperCase();
});

document.getElementById('pms-great-color').addEventListener('change', function () {
    var color = document.getElementById('pms-great-color').value;
    document.getElementById('pms-great-val').innerHTML = color.toUpperCase();
    localStorage["pms-great-color"] = color.toUpperCase();
});

document.getElementById('pms-bad-color').addEventListener('change', function () {
    var color = document.getElementById('pms-bad-color').value;
    document.getElementById('pms-bad-val').innerHTML = color.toUpperCase();
    localStorage["pms-bad-color"] = color.toUpperCase();
});

document.getElementById('pms-poor-color').addEventListener('change', function () {
    var color = document.getElementById('pms-poor-color').value;
    document.getElementById('pms-poor-val').innerHTML = color.toUpperCase();
    localStorage["pms-poor-color"] = color.toUpperCase();
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

    document.getElementById('bms-scratch-val').innerHTML = document.getElementById('bms-scratch-color').value = localStorage["bms-scratch-color"];
    document.getElementById('bms-lower-val').innerHTML = document.getElementById('bms-lower-color').value = localStorage["bms-lower-color"];
    document.getElementById('bms-higher-val').innerHTML = document.getElementById('bms-higher-color').value = localStorage["bms-higher-color"];
    document.getElementById('bms-mine-val').innerHTML = document.getElementById('bms-mine-color').value = localStorage["bms-mine-color"];
    document.getElementById('bms-pgreat-val').innerHTML = document.getElementById('bms-pgreat-color').value = localStorage["bms-pgreat-color"];
    document.getElementById('bms-great-val').innerHTML = document.getElementById('bms-great-color').value = localStorage["bms-great-color"];
    document.getElementById('bms-good-val').innerHTML = document.getElementById('bms-good-color').value = localStorage["bms-good-color"];
    document.getElementById('bms-bad-val').innerHTML = document.getElementById('bms-bad-color').value = localStorage["bms-bad-color"];
    document.getElementById('bms-poor-val').innerHTML = document.getElementById('bms-poor-color').value = localStorage["bms-poor-color"];

    document.getElementById('pms-0-val').innerHTML = document.getElementById('pms-0-color').value = localStorage["pms-0-color"];
    document.getElementById('pms-1-val').innerHTML = document.getElementById('pms-1-color').value = localStorage["pms-1-color"];
    document.getElementById('pms-2-val').innerHTML = document.getElementById('pms-2-color').value = localStorage["pms-2-color"];
    document.getElementById('pms-3-val').innerHTML = document.getElementById('pms-3-color').value = localStorage["pms-3-color"];
    document.getElementById('pms-4-val').innerHTML = document.getElementById('pms-4-color').value = localStorage["pms-4-color"];
    document.getElementById('pms-mine-val').innerHTML = document.getElementById('pms-mine-color').value = localStorage["pms-mine-color"];
    document.getElementById('pms-cool-val').innerHTML = document.getElementById('pms-cool-color').value = localStorage["pms-cool-color"];
    document.getElementById('pms-great-val').innerHTML = document.getElementById('pms-great-color').value = localStorage["pms-great-color"];
    document.getElementById('pms-bad-val').innerHTML = document.getElementById('pms-bad-color').value = localStorage["pms-bad-color"];
    document.getElementById('pms-poor-val').innerHTML = document.getElementById('pms-poor-color').value = localStorage["pms-poor-color"];

    document.getElementById('bms-p1-0-u').value = localStorage["bms-p1-0-u"];
    document.getElementById('bms-p1-0-d').value = localStorage["bms-p1-0-d"];
    document.getElementById('bms-p1-1').value = localStorage["bms-p1-1"];
    document.getElementById('bms-p1-2').value = localStorage["bms-p1-2"];
    document.getElementById('bms-p1-3').value = localStorage["bms-p1-3"];
    document.getElementById('bms-p1-4').value = localStorage["bms-p1-4"];
    document.getElementById('bms-p1-5').value = localStorage["bms-p1-5"];
    document.getElementById('bms-p1-6').value = localStorage["bms-p1-6"];
    document.getElementById('bms-p1-7').value = localStorage["bms-p1-7"];
    document.getElementById('bms-p2-0-u').value = localStorage["bms-p2-0-u"];
    document.getElementById('bms-p2-0-d').value = localStorage["bms-p2-0-d"];
    document.getElementById('bms-p2-1').value = localStorage["bms-p2-1"];
    document.getElementById('bms-p2-2').value = localStorage["bms-p2-2"];
    document.getElementById('bms-p2-3').value = localStorage["bms-p2-3"];
    document.getElementById('bms-p2-4').value = localStorage["bms-p2-4"];
    document.getElementById('bms-p2-5').value = localStorage["bms-p2-5"];
    document.getElementById('bms-p2-6').value = localStorage["bms-p2-6"];
    document.getElementById('bms-p2-7').value = localStorage["bms-p2-7"];

    document.getElementById("pms-0").value = localStorage["pms-0"];
    document.getElementById("pms-1").value = localStorage["pms-1"];
    document.getElementById("pms-2").value = localStorage["pms-2"];
    document.getElementById("pms-3").value = localStorage["pms-3"];
    document.getElementById("pms-4").value = localStorage["pms-4"];
    document.getElementById("pms-5").value = localStorage["pms-5"];
    document.getElementById("pms-6").value = localStorage["pms-6"];
    document.getElementById("pms-7").value = localStorage["pms-7"];
    document.getElementById("pms-8").value = localStorage["pms-8"];

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