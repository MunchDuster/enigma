var zoomMultiplier = 1,
	offsetX = 0,
	offsetY = 0;

//Render settings
var connectionThickness = 5,
	portRadius = 5,
	moduleFontSize = 22,

	gridSize = 80,
	gridThickness = 2,
	moduleFont = () => { return moduleFontSize * zoomMultiplier + 'px Arial' },

	portFontSize = 16,
	portFont = () => { return portFontSize * zoomMultiplier + 'px Arial' },

	hoverInfoFontSize = 18,
	hoverInfoFont = () => { return hoverInfoFontSize * zoomMultiplier + 'px Arial' },

	zoomMultiplierFontSize = 22,
	zoomMultiplierFont = () => { return zoomMultiplierFontSize + 'px Arial' };

//Colors
var colors = {
	module_bg: '#cfcfcf',
	module_text: '#000000',
	grid: '#ccc',
	port_set: {
		'string': '#0000ff',
		'number': '#ff0000',
		'chars': '#ff7f00',
		'numberlist': '#22e62f'
	},
	port_temp: {
		'string': '#8080ff',
		'number': '#ff8080',
		'chars': '#f0cb8e',
		'numberlist': '#7ddc83'
	},
	hoverPort: '#b4b4b4',

};

//get and prepare the canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');


//lerp function
function lerp(a, b, c) {
	return a + (b - a) * c;
}
//show hover info for something
function showHoverInfo(e, text) {
	ctx.font = hoverInfoFont();
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	var textWidth = ctx.measureText(text).width,
		x0 = e.offsetX + 10,
		y1 = e.offsetY - 10,
		x1 = x0 + 16 + textWidth,
		y0 = y1 - hoverInfoFontSize - 6;

	//draw hover box
	ctx.beginPath();
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = colors.hoverPort;

	ctx.moveTo(x0, y0);
	ctx.lineTo(x0, y1);
	ctx.lineTo(x1, y1);
	ctx.lineTo(x1, y0);
	ctx.fill();

	//draw module label
	ctx.beginPath();
	ctx.fillStyle = '#000000';
	ctx.font = hoverInfoFont();
	ctx.fillText(text, lerp(x0, x1, 0.5), lerp(y0, y1, 0.5));
}
//update the canvas view, (except for hover info)
function renderCanvas(e) {
	if (!isActive) return;

	//clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//draw the background grid
	function drawGrid() {
		var gridS = gridSize * zoomMultiplier,
			offX = offsetX % gridS,
			offY = offsetY % gridS;

		ctx.beginPath();
		ctx.strokeStyle = colors.grid;
		ctx.lineWidth = gridThickness;
		//draw horizontal lines
		for (var y = offY; y <= canvas.height; y += gridS) {
			ctx.moveTo(0, y);
			ctx.lineTo(canvas.width, y);
			ctx.stroke();
		}
		//draw vertical lines
		for (var x = offX; x <= canvas.width; x += gridS) {
			ctx.moveTo(x, 0);
			ctx.lineTo(x, canvas.height);
			ctx.stroke();
		}
	}
	//draw the connections
	function drawConnection(port1, port2) {
		//render line	
		ctx.strokeStyle = colors.port_set[port1.type];
		ctx.moveTo(port1.localX + port1.module.worldX, port1.localY + port1.module.worldY);
		ctx.lineTo(port2.localX + port2.module.worldX, port2.localY + port2.module.worldY);
		ctx.stroke();
	}
	//draw the modules
	function drawModule(module) {
		//get the module display corners
		var x0 = module.worldX,
			y0 = module.worldY,
			x1 = module.worldX + module.width,
			y1 = module.worldY + module.height;

		//draw module box
		ctx.beginPath();
		ctx.fillStyle = colors.module_bg;
		ctx.moveTo(x0, y0);
		ctx.lineTo(x0, y1);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x1, y0);
		ctx.fill();

		//draw module label
		ctx.beginPath();
		ctx.fillStyle = '#000000';
		ctx.font = moduleFont();
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(module.codec.getName(), lerp(x0, x1, 0.5), lerp(y0, y1, 0.5));

		//draw input ports
		for (var j = 0; j < module.inputs.length; j++) {
			var port = module.inputs[j],
				x = port.localX + port.module.worldX,
				y = port.localY + port.module.worldY;

			//draw the port circle
			ctx.beginPath();
			ctx.fillStyle = colors.port_set[port.type];
			ctx.arc(x, y, portRadius * zoomMultiplier, 0, 2 * Math.PI);
			ctx.fill();
		}

		//draw output ports
		for (var j = 0; j < module.outputs.length; j++) {
			var port = module.outputs[j],
				x = port.localX + port.module.worldX,
				y = port.localY + port.module.worldY;

			//draw the port circle
			ctx.beginPath();
			ctx.fillStyle = colors.port_set[port.type];
			ctx.arc(x, y, portRadius * zoomMultiplier, 0, 2 * Math.PI);
			ctx.fill();
		}
	}
	//draw the zoom multiplier if zoomed in/out
	function drawZoom() {
		var text = 'x' + zoomMultiplier.toFixed(1);

		ctx.beginPath();
		ctx.textAlign = 'left';
		ctx.textBaseline = 'top';
		ctx.fillStyle = '#777';
		ctx.font = zoomMultiplierFont();
		ctx.fillText(text, 5, 5);
	}

	//draw the grid
	drawGrid();

	//draw modules
	ctx.font = moduleFont();
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];
		drawModule(module);
	}

	//draw connections
	ctx.beginPath();
	ctx.lineWidth = connectionThickness * zoomMultiplier;

	for (var i = 0; i < connections.length; i++) {
		var port1 = connections[i].inputPort, port2 = connections[i].outputPort;

		drawConnection(port1, port2);
	}

	drawZoom();

	//all of the below require e, if its null then stop here
	if (e == null) return;

	//draw the dragObject (if its a maybe connection)
	if (dragItem != null && dragItem.render != null) {
		dragItem.render(ctx, e);
	}
}