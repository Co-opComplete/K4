var canvas;
var highPowerColor = "#75FF47";
var mediumPowerColor = "#FF8330";
var lowPowerColor = "#FF1919";
var socket;
var batteryPower = 100;

var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();

createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.createElement("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

DrawBattery = function(power)
{
	var color;
	
	if (power > 60) { color = highPowerColor; }
	else if (power > 30) { color = mediumPowerColor; }
	else { color = lowPowerColor; }
	

	var context = canvas.getContext("2d");
	
	context.save();
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.lineWidth = 2;
	context.strokeStyle = color;
	context.globalAlpha = 0.6;
	
	// inner ring
	context.beginPath();
	context.arc(100, 100, 20, 0, 2 * Math.PI);
	context.stroke();
	
	// outer ring
	context.beginPath();
	context.arc(100, 100, 26, 0, 2 * Math.PI);
	context.stroke();
	
	// fill ring
	context.lineWidth = 6;
	
	context.beginPath();
	context.arc(100, 100, 23,  3 * Math.PI / 2, (2 * Math.PI * (power / 100)) + (3 * Math.PI / 2));
	context.stroke();
	
	// draw text
	if (power < 100)
	{
	context.fillStyle = color;
	context.font = "18px sans-serif";
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(power, 100, 100);
	}
		
	context.restore();
}

function Connect() {
	if (!socket)
	{
		socket = io.connect('http://k4-dev.cmgeneral.local:3002/hud');

		socket.on('event', function(data){
			console.log(data);
			socket.emit('response', {response: 'response'});
		});
		
		socket.on('connect', function() {
			console.log('Connected');
		});
	
		socket.on('disconnect', function() {
			console.log('Disconnected');
		});
		
		socket.on('battery', function(data) {
			DrawBattery(data.power);
		});
	}
	else
	{ socket.socket.reconnect(); }
}

$(function()
{
	canvas = createHiDPICanvas(500, 500);
	$('#container').append(canvas);
	
	Connect();
	
	setInterval(function() {
		if (!socket.socket.connected) { Connect(); }
	}, 1000);
});