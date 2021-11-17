const zoomStep = 0.1,
	maxZoom = 2,
	minZoom = 0.4;

//vars
var dragItem, dragOffset = Vector2.Zero, lastMove = Vector2.Zero, isActive = true, isMoving = false;
var mousemoveListener, mouseupListener;

//add mandatory listners
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mousemove', mousemove);
canvas.addEventListener('mouseleave', mouseleave);
canvas.addEventListener('wheel', zoom);

//prevent the default right click options when right clicking on the canvas
canvas.addEventListener('contextmenu', function (e) {
	e.preventDefault();
}, false);

function mousedown(e) {
	hoverPort = null;
	//check for right click
	if (e.which == 3) {
		rightclick(e);
		return;
	}

	dragItem = getClickItem(e);
	if (dragItem != null) {
		if (dragItem instanceof Connection) {
			dragItem.destroy();
			renderCanvas();
			return;
		}
		//set the offset
		var item = Vector2.WorldToScreen(dragItem.pos);
		dragOffset = new Vector2(e.offsetX - item.x, e.offsetY - item.y);
	}
	else {
		//moving across space
		//set the last to be this
		lastMove = new Vector2(e.offsetX - canvas.width / 2, e.offsetY - canvas.height / 2);
		isMoving = true;
	}

	//add listener
	mouseupListener = canvas.addEventListener('mouseup', mouseup);
}
function mousemove(e) {
	//if dragging something
	if (dragItem != null) {
		updateDragItem(dragItem, e);
	}
	//if moving across space
	else if (isMoving) {
		var pos = new Vector2(e.offsetX - canvas.width / 2, e.offsetY - canvas.height / 2);
		offset = offset.add(pos.subtract(lastMove));

		lastMove = pos;
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
			new Connection(hoverItem.port, dragItem.port);
			delete hoverItem.render;
		}
		dragItem = null;

		//remove listener
		mouseupListener = canvas.removeEventListener('mouseup', mouseup);

		renderCanvas();
	}
	isMoving = false;
}
function mouseleave(e) {
	dragItem = null;
	renderCanvas();
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
	var x = e.offsetX / zoomMultiplier + offsetX,
		y = e.offsetY / zoomMultiplier + offsetY;
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
function getClickItem(e) {
	var screenPos = new Vector2(e.offsetX, e.offsetY);
	var pos = Vector2.ScreenToWorld(screenPos);

	//function used to create an item to drag to make a port connection
	function createPortDrag(port) {
		var obj = {
			class: 'port drag',
			pos: pos,
			port: port,
			render: function (ctx, e) {
				var startPos = port.screenPos;

				//render line
				ctx.beginPath();
				ctx.strokeStyle = colors.port_temp[this.port.type];

				ctx.moveTo(startPos.x, startPos.y);



				ctx.lineTo(e.offsetX, e.offsetY);
				ctx.stroke();

				ctx.beginPath();
				ctx.fillStyle = colors.port_temp[this.port.type];
				ctx.arc(startPos.x, startPos.y, connectionThickness * zoomMultiplier / 2, 0, 2 * Math.PI);
				ctx.fill();

				ctx.beginPath();
				ctx.arc(e.offsetX, e.offsetY, connectionThickness * zoomMultiplier / 2, 0, 2 * Math.PI);
				ctx.fill();


			},
		};

		return obj;
	}
	//functions used to check if click on anything
	function pointIsOnModule(module) {
		var p0 = module.pos,
			p1 = p0.add(module.size);

		if (pos.x > p0.x && pos.y > p0.y && pos.x < p1.x && pos.y < p1.y) {
			return true;
		}
		else {
			return false;
		}
	}
	function pointIsOnPort(port) {
		var portScreenPos = port.screenPos,
			offset = portScreenPos.subtract(screenPos),
			distance = offset.magnitude;

		//draw the port circle
		ctx.beginPath();
		ctx.fillStyle = colors.port_set[port.type];
		ctx.arc(portScreenPos.x, portScreenPos.y, portRadius * zoomMultiplier, 0, 2 * Math.PI);
		ctx.fill();

		//check if clicked on port.
		if (distance <= portRadius * zoomMultiplier) {
			return true;
		}
		else {
			return false;
		}
	}
	function pointIsOnConnection(connection) {
		var p0 = connection.inputPort.screenPos,
			p1 = connection.outputPort.screenPos;

		function getClosestPoint() {
			//based on y = mx + c
			//uses perpendicular of line that goes through point (e.offsetX, e.offsetY) 
			// perpendicular: y = -x/m + d
			// user click point is (Px, Py) i.e (screenPos.x, screenPos.y) and closest point to that on line is (Cx, Cy) i.e (closestX, closestY)

			var m = (p1.y - p0.y) / (p1.x - p0.x); // m = (y1 - y0) / (x1 - x0)

			if (m == 0) {
				//d is negative infinity when m = 0, the formula below brakes
				return new Vector2(screenPos.x, p1.y);//y = c (user input x, line height)
			}

			var c = p0.y - m * p0.x, //c = y - mx
				d = screenPos.y + screenPos.x / m, //d = Px + Py/m
				closestX = (d - c) / (m + 1 / m), //Cx = (d - c) / (m + (1 / m))
				closestY = closestX * m + c; //Cy = Cx * m + c
			return new Vector2(closestX, closestY); //vector from (Cx, Cy) to (Px, Py)
		}

		//check if is within bounds
		var xMin = Math.min(p0.x, p1.x) - connectionThickness * zoomMultiplier / 2,
			xMax = Math.max(p0.x, p1.x) + connectionThickness * zoomMultiplier / 2,
			yMin = Math.min(p0.y, p1.y) - connectionThickness * zoomMultiplier / 2,
			yMax = Math.max(p0.y, p1.y) + connectionThickness * zoomMultiplier / 2;

		//return false if outside bounds
		if (screenPos.x < xMin || screenPos.x > xMax || screenPos.y < yMin || screenPos.y > yMax) {
			return false;
		}

		var offset = getClosestPoint().subtract(screenPos),
			distance = offset.magnitude;

		if (distance <= connectionThickness * zoomMultiplier / 2) {
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
	var screenOffset = new Vector2(e.offsetX, e.offsetY);
	item.pos = Vector2.ScreenToWorld(screenOffset.subtract(dragOffset));
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

	// Restrict scale
	zoomMultiplier = clamp(zoomMultiplier, minZoom, maxZoom);
	renderCanvas();
}

resizeCanvas();