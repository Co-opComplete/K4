var gamepads = {};

function createDiv(gamepad) {
    var d = document.createElement("div");
    d.setAttribute("id", gamepad.id);
    var t = document.createElement("h1");
    t.appendChild(document.createTextNode("gamepad: " + gamepad.id));
    d.appendChild(t);
    var b = document.createElement("div");
    b.className = "buttons";
    for (var i = 0; i < gamepad.buttons.length; i++) {
        var e = document.createElement("span");
        e.className = "button";
        e.innerHTML = i;
        b.appendChild(e);
    }
    d.appendChild(b);
    var a = document.createElement("div");
    a.className = "axes";
    for (var i = 0; i < gamepad.axes.length; i++) {
        var e = document.createElement("progress");
        e.className = "axis";
        e.setAttribute("max", "2");
        e.setAttribute("value", "1");
        e.innerHTML = i;
        a.appendChild(e);
    }
    d.appendChild(a);
    document.getElementById("start").style.display = "none";

    return d;
}

function connectHandler(e) {
    var gamepad = e.gamepad;
    gamepads[e.gamepad.id] = gamepad;

    var div = createDiv(gamepad);
    document.body.appendChild(div);

    window.requestAnimationFrame(updateStatus);
}

function disconnectHandler(e) {
    var d = document.getElementById(e.gamepad.id);
    document.body.removeChild(d);
    delete gamepads[e.gamepad.id];
}

function updateStatus() {
    for (j in gamepads) {
        var gamepad = gamepads[j],
          d = document.getElementById(j),
          buttons = d.getElementsByClassName("button"),
          axes = d.getElementsByClassName("axis");

        for (var i = 0; i < gamepad.buttons.length; i++) {
            var b = buttons[i];
            if (gamepad.buttons[i]) {
                b.className = "button pressed";
            }
            else {
                b.className = "button";
            }
        }

        for (var i = 0; i < gamepad.axes.length; i++) {
            var a = axes[i];
            a.innerHTML = i + ": " + gamepad.axes[i].toFixed(4);
            a.setAttribute("value", gamepad.axes[i] + 1);
        }
    }

    window.requestAnimationFrame(updateStatus);
}

window.addEventListener("MozGamepadConnected", connectHandler);
window.addEventListener("MozGamepadDisconnected", disconnectHandler);