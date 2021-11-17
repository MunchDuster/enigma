var zoomMultiplier = 1,
	offset = Vector2.Zero;

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
		var gridS = gridSize,
			canvasTop = Vector2.ScreenToWorld(Vector2.Zero),
			canvasBottom = Vector2.ScreenToWorld(new Vector2(canvas.width, canvas.height)),
			canvasMiddle = canvasTop.lerp(canvasBottom, 0.5);


		ctx.beginPath();
		ctx.strokeStyle = colors.grid;
		ctx.lineWidth = gridThickness;
		//draw horizontal lines
		for (var middleY = canvasMiddle.y, n = 0; middleY + gridS * n <= canvasBottom.y; n++) {

			var y1 = middleY + gridS * n,
				y2 = middleY - gridS * n,
				screenY1 = Vector2.WorldToScreen(new Vector2(0, y1)).y + offset.y % gridS,
				screenY2 = Vector2.WorldToScreen(new Vector2(0, y2)).y + offset.y % gridS;

			ctx.moveTo(0, screenY1);
			ctx.lineTo(canvas.width, screenY1);
			ctx.stroke();

			ctx.moveTo(0, screenY2);
			ctx.lineTo(canvas.width, screenY2);
			ctx.stroke();
		}
		ctx.beginPath();
		for (var middleX = canvasMiddle.x, n = 0; middleX + gridS * n <= canvasBottom.x; n++) {

			var x1 = middleX + gridS * n,
				x2 = middleX - gridS * n,
				screenX1 = Vector2.WorldToScreen(new Vector2(x1, 0)).x + offset.x % gridS,
				screenX2 = Vector2.WorldToScreen(new Vector2(x2, 0)).x + offset.x % gridS

			ctx.moveTo(screenX1, 0);
			ctx.lineTo(screenX1, canvas.width);
			ctx.stroke();

			ctx.moveTo(screenX2, 0);
			ctx.lineTo(screenX2, canvas.width);
			ctx.stroke();
		}
	}
	//draw the connections
	function drawConnection(port1, port2) {
		//render line	
		ctx.strokeStyle = colors.port_set[port1.type];

		var startpoint = port1.screenPos;
		var endpoint = port2.screenPos;

		ctx.moveTo(startpoint.x, startpoint.y);
		ctx.lineTo(endpoint.x, endpoint.y);
		ctx.stroke();
	}
	//draw the modules
	function drawModule(module) {
		//get the module display corners
		var p0 = Vector2.WorldToScreen(module.pos),
			p1 = p0.add(module.size);

		//draw module box
		ctx.beginPath();
		ctx.fillStyle = colors.module_bg;
		ctx.moveTo(p0.x, p0.y);
		ctx.lineTo(p0.x, p1.y);
		ctx.lineTo(p1.x, p1.y);
		ctx.lineTo(p1.x, p0.y);
		ctx.fill();

		//draw module label
		ctx.beginPath();
		ctx.fillStyle = '#000000';
		ctx.font = moduleFont();
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillText(module.codec.getName(), lerp(p0.x, p1.x, 0.5), lerp(p0.y, p1.y, 0.5));

		//draw input ports
		for (var j = 0; j < module.inputs.length; j++) {
			var port = module.inputs[j],
				pos = port.screenPos,
				radius = portRadius * zoomMultiplier;

			//draw the port circle
			ctx.beginPath();
			ctx.fillStyle = colors.port_set[port.type];
			ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
			ctx.fill();
		}

		//draw output ports
		for (var j = 0; j < module.outputs.length; j++) {
			var port = module.outputs[j],
				pos = port.screenPos,
				radius = portRadius * zoomMultiplier;

			//draw the port circle
			ctx.beginPath();
			ctx.fillStyle = colors.port_set[port.type];
			ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
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