localStorage["bg-color"] = localStorage["bg-color"] || "#1F2F2F";
localStorage["effect-color"] = localStorage["effect-color"] || "#FFA500";
localStorage["gauge-color"] = localStorage["gauge-color"] || "#00BFFF";
localStorage["gear-color"] = localStorage["gear-color"] || "#DCDCDC";
localStorage["text-color"] = localStorage["text-color"] || "#FFFFF0";
localStorage["scratch-color"] = localStorage["scratch-color"] || "#FF0000";
localStorage["lower-color"] = localStorage["lower-color"] || "#FFFFFF";
localStorage["higher-color"] = localStorage["higher-color"] || "#00BFFF";
localStorage["mine-color"] = localStorage["mine-color"] || "#DC143C";
localStorage["great-color"] = localStorage["great-color"] || "#FFD700";
localStorage["good-color"] = localStorage["good-color"] || "#ADFF2F";
localStorage["bad-color"] = localStorage["bad-color"] || "#8A2BE2";
localStorage["poor-color"] = localStorage["poor-color"] || "#8B0000";

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
    document.getElementById('great-color').value = localStorage["great-color"];
    document.getElementById('good-color').value = localStorage["good-color"];
    document.getElementById('bad-color').value = localStorage["bad-color"];
    document.getElementById('poor-color').value = localStorage["poor-color"];

    document.getElementById('p1-scratch').value = localStorage["p1-0"];
    document.getElementById('p1-1').value = localStorage["p1-1"];
    document.getElementById('p1-2').value = localStorage["p1-2"];
    document.getElementById('p1-3').value = localStorage["p1-3"];
    document.getElementById('p1-4').value = localStorage["p1-4"];
    document.getElementById('p1-5').value = localStorage["p1-5"];
    document.getElementById('p1-6').value = localStorage["p1-6"];
    document.getElementById('p1-7').value = localStorage["p1-7"];
    document.getElementById('p2-scratch').value = localStorage["p2-0"];
    document.getElementById('p2-1').value = localStorage["p2-1"];
    document.getElementById('p2-2').value = localStorage["p2-2"];
    document.getElementById('p2-3').value = localStorage["p2-3"];
    document.getElementById('p2-4').value = localStorage["p2-4"];
    document.getElementById('p2-5').value = localStorage["p2-5"];
    document.getElementById('p2-6').value = localStorage["p2-6"];
    document.getElementById('p2-7').value = localStorage["p2-7"];
    document.getElementById('speed-down').value = localStorage["speed-down"];
    document.getElementById('speed-up').value = localStorage["speed-up"];
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
        localStorage["great-color"] = "#FFD700";
        localStorage["good-color"] = "#ADFF2F";
        localStorage["bad-color"] = "#8A2BE2";
        localStorage["poor-color"] = "#8B0000";
        localStorage["p1-0"] = "ShiftLeft";
        localStorage["p1-1"] = "KeyZ";
        localStorage["p1-2"] = "KeyS";
        localStorage["p1-3"] = "KeyX";
        localStorage["p1-4"] = "KeyD";
        localStorage["p1-5"] = "KeyC";
        localStorage["p1-6"] = "KeyF";
        localStorage["p1-7"] = "KeyV";
        localStorage["p2-0"] = "ShiftRight";
        localStorage["p2-1"] = "KeyM";
        localStorage["p2-2"] = "KeyK";
        localStorage["p2-3"] = "Comma";
        localStorage["p2-4"] = "KeyL";
        localStorage["p2-5"] = "Period";
        localStorage["p2-6"] = "SemiColon";
        localStorage["p2-7"] = "Slash";
        localStorage["speed-down"] = "Digit1";
        localStorage["speed-up"] = "Digit2";
        location.reload();
    }
}

function save() {
    window.location.href = "/";
}

function p1_scratch(e) {
    var x = document.getElementById("p1-scratch");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p1-0", x.value);
}
function p1_1(e) {
    var x = document.getElementById("p1-1");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p1-1", x.value);
}
function p1_2(e) {
    var x = document.getElementById("p1-2");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p1-2", x.value);
}
function p1_3(e) {
    var x = document.getElementById("p1-3");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p1-3", x.value);
}
function p1_4(e) {
    var x = document.getElementById("p1-4");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p1-4", x.value);
}
function p1_5(e) {
    var x = document.getElementById("p1-5");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p1-5", x.value);
}
function p1_6(e) {
    var x = document.getElementById("p1-6");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p1-6", x.value);
}
function p1_7(e) {
    var x = document.getElementById("p1-7");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p1-7", x.value);
}
function p2_scratch(e) {
    var x = document.getElementById("p2-scratch");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p2-0", x.value);
}
function p2_1(e) {
    var x = document.getElementById("p2-1");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p2-1", x.value);
}
function p2_2(e) {
    var x = document.getElementById("p2-2");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p2-2", x.value);
}
function p2_3(e) {
    var x = document.getElementById("p2-3");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p2-3", x.value);
}
function p2_4(e) {
    var x = document.getElementById("p2-4");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p2-4", x.value);
}
function p2_5(e) {
    var x = document.getElementById("p2-5");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p2-5", x.value);
}
function p2_6(e) {
    var x = document.getElementById("p2-6");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("p2-6", x.value);
}
function p2_7(e) {
    var x = document.getElementById("p2-7");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("speed-down", x.value);
}
function speed_down(e) {
    var x = document.getElementById("speed-down");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("speed-down", x.value);
}
function speed_up(e) {
    var x = document.getElementById("speed-up");
    if (e.code === "Digit1" || e.code === "Digit2" || e.code === "Numpad1" || e.code === "Numpad2") {
        alert("You can't use this key!");
    } else {
        for (var i = 0; i <= 7; i++) {
            if (localStorage[`p1-${i}`] === e.code || localStorage[`p2-${i}`] === e.code || localStorage["speed-down"] === e.code || localStorage["speed-up"] === e.code) {
                alert("Already used!");
                x.value = "";
                break;
            }
            x.value = e.code;
        }
    }
    x.disabled = true;
    x.disabled = false;
    localStorage.setItem("speed-up", x.value);
}