const zoomStep = 0.2,
	maxZoom = 2,
	minZoom = 0.4;


//vars
var dragItem, dragOffsetX, dragOffsetY, lastMoveX, lastMoveY, isActive = true, isMoving = false;
var mousemoveListener, mouseupListener;

//add mandatory listners
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mousemove', mousemove);
canvas.addEventListener('wheel', zoom);

//prevent the default right click options when right clicking on the canvas
canvas.addEventListener('contextmenu', function (e) {
	e.preventDefault();
}, false);

function mousedown(e) {
	hoverPort = null;
	//cehck for right click
	if (e.which == 3) {
		rightclick(e);
		return;
	}

	dragItem = getClickItem(e);
	if (dragItem != null) {
		if (dragItem.class == 'connection') {
			DeleteConnection(dragItem);
			dragItem = null;
			renderCanvas();
			return;

		}
		//set the offset
		dragOffsetX = e.offsetX - dragItem.x;
		dragOffsetY = e.offsetY - dragItem.y;
	}
	else {
		//moving across space
		//set the last to be this
		lastMoveX = e.offsetX;
		lastMoveY = e.offsetY;
		isMoving = true;
	}

	//add listener
	mouseupListener = canvas.addEventListener('mouseup', mouseup);
}
function rightclick(e) {
	console.log('right click');
	e.preventDefault();

	var rightclickItem = getClickItem(e);
	if (rightclickItem != null) {
		if (rightclickItem.class == 'module') {
			//delete the module, its ports and its connections

			var module = rightclickItem;
			console.log(module);

			if (module.name == 'input' || module.name == 'output') {
				//don't delete input or output modules
				return;
			}
			//get the codec to delete anything if it can (connected elements for inputs, etc)
			if (module.codec.delete) {
				module.codec.delete();
			}

			//delete the input ports and any connections to each
			for (var i = 0; i < module.inputs.length; i++) {
				var port = module.inputs[i];
				//delete any connections
				if (port.connections) {
					DeleteConnectionToInput(port);
				}
				//delete the port
				DeletePort(port);
			}
			//delete the output ports and any connections to each
			for (var i = 0; i < module.outputs.length; i++) {
				var port = module.outputs[i];
				//delete any connections
				if (port.connections) {
					DeleteConnectionsToOutput(port);
				}
				//delete the port
				DeletePort(port);
			}
			//dleete the module itself
			DeleteModule(module);
			renderCanvas();
		}
	}
}
function findHoverPort(e) {
	var x = e.offsetX + offsetX,
		y = e.offsetY + offsetY;
	for (var i = 0; i < ports.length; i++) {
		var port = ports[i],
			portx = port.localX + port.module.worldX,
			porty = port.localY + port.module.worldY,
			distx = x - portx,
			disty = y - porty,
			distance = Math.sqrt(distx * distx + disty * disty);

		//check if clicked on port.
		if (distance <= portRadius * zoomMultiplier) {
			return port;
		}
	}
	return null;
}
function mousemove(e) {
	//if dragging something
	if (dragItem != null) {
		updateDragItem(dragItem, e);
	}
	//if moving across space
	else if (isMoving) {
		offsetX += (e.offsetX - lastMoveX) * zoomMultiplier;
		offsetY += (e.offsetY - lastMoveY) * zoomMultiplier;

		lastMoveX = e.offsetX;
		lastMoveY = e.offsetY;
	}
	// neither of above, maybe hovering
	else {
		//find hover object port
		var clickItem = getClickItem(e);

		//hover other
		if (clickItem == null) return;

		if (clickItem.class == 'port drag') {
			showHoverInfo(e, clickItem.port.type.name)
		} else if (clickItem.class == 'module') {
			//showHoverInfo(e, codecs[module.name].meta.info);
		} else if (clickItem.class == 'connection') {
			showHoverInfo(e, 'connection passes ' + clickItem.inputPort.type.type);
		}
	}

	renderCanvas(e);
}
function mouseup(e) {
	hoverPort = null;
	if (dragItem != null) {
		//connect port if dragged a port onto another port
		var hoverItem = getClickItem(e);
		if (hoverItem != null && hoverItem.class == 'port drag') {
			CreateConnection(hoverItem.port, dragItem.port);
			delete hoverItem.render;
		}
		dragItem = null;

		//remove listener
		mouseupListener = canvas.removeEventListener('mouseup', mouseup);

		renderCanvas();
	}
	isMoving = false;
}


function getClickItem(e) {
	var x = e.offsetX,
		y = e.offsetY;

	//function used to create an item to drag to make a port connection
	function createPortDrag(port) {
		var obj = {
			class: 'port drag',
			x: x,
			y: y,
			port: port,
			render: function (ctx, e) {
				//render line
				ctx.strokeStyle = colors.port_temp[this.port.type.type];
				ctx.moveTo(port.x + port.module.screenX, port.y + port.module.screenY);
				ctx.lineTo(e.offsetX, e.offsetY);
				ctx.stroke();
			},
		};

		return obj;
	}
	//functions used to check if click on anything
	function pointIsOnModule(module) {
		var x0 = module.screenX,
			y0 = module.screenY,
			x1 = module.screenX + module.width,
			y1 = module.screenY + module.height;
		if (x > x0 && y > y0 && x < x1 && y < y1) {
			return true;
		}
		else {
			return false;
		}
	}
	function pointIsOnPort(port) {
		var portx = port.x + port.module.x,
			porty = port.y + port.module.y,
			distx = x - portx,
			disty = y - porty,
			distance = Math.sqrt(distx * distx + disty * disty);

		//check if clicked on port.
		if (distance <= portRadius) {
			return true;
		} else {
			return false;
		}

	}
	function pointIsOnConnection(connection) {
		var x0 = connection.inputPort.x + connection.inputPort.module.x,
			y0 = connection.inputPort.y + connection.inputPort.module.y,
			x1 = connection.outputPort.x + connection.outputPort.module.x,
			y1 = connection.outputPort.y + connection.outputPort.module.y;

		//check if is within bounds
		var xMin = Math.min(x0, x1) - connectionThickness / 2,
			xMax = Math.max(x0, x1) + connectionThickness / 2,
			yMin = Math.min(y0, y1) - connectionThickness / 2,
			yMax = Math.max(y0, y1) + connectionThickness / 2
		if (!(x >= xMin && x <= xMax && y >= yMin && y <= yMax)) {
			return false;
		}
		//based on y = mx + c
		var m = (y1 - y0) / (x1 - x0),
			c = y0 - m * x0, //c = y - mx
			calcY = m * x + c,//y = mx + c
			calcX = (y - c) / m,// x = (y - c) / m
			distY = Math.abs(y - calcY),
			distX = Math.abs(x - calcX);

		if (Math.min(distY, distX) <= connectionThickness / 2) {
			return true;
		} else {
			return false;
		}

	}
	//find if clicked on a port
	for (var i = 0; i < ports.length; i++) {
		var port = ports[i];

		if (pointIsOnPort(port)) {
			return createPortDrag(port);
		}
	}
	//find if clicked on a connection
	for (var i = 0; i < connections.length; i++) {
		var connection = connections[i];

		if (pointIsOnConnection(connection)) {
			return connection;
		}
	}
	//find if clicked on a module
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];

		if (pointIsOnModule(module)) {
			return module;
		}
	}
	//not clicked on anything
	return null;
}
function updateDragItem(item, e) {
	item.x = e.offsetX - dragOffsetX;
	item.y = e.offsetY - dragOffsetY;
}

function resizeCanvas() {
	canvas.width = canvas.parentElement.offsetWidth * 0.8 - canvas.style.margin;
	canvas.height = canvas.parentElement.offsetHeight;

	//canvas.style.width = canvas.width + 'px';
	//canvas.style.height = canvas.height + 'px';
	renderCanvas();
}

function setLoading(isLoading) {
	console.log('setting loading: ' + isLoading);
	console.log('stack trace: ', new Error('Whoops!').stack);
	isActive = !isLoading;
	if (isLoading) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		//draw loading text
		ctx.beginPath();
		ctx.font = '40px Arial';
		ctx.fillStyle = 'black';

		ctx.fillText('Loading', canvas.width / 2, canvas.height / 2);

	} else {
		renderCanvas();
	}
}

function zoom(event) {
	const clamp = (val, min, max) => { return Math.max(Math.min(val, max), min) };
	event.preventDefault();

	zoomMultiplier += Math.sign(-event.deltaY) * zoomStep;
	console.log(`Zoom is ${zoomMultiplier}`);

	// Restrict scale
	zoomMultiplier = clamp(zoomMultiplier, minZoom, maxZoom);
	renderCanvas();
}

resizeCanvas();