//Shape settings
var connectionThickness = 5,
	portRadius = 5;

//Colors
var colors = {
	module_bg: '#cfcfcf',
	module_text: '#000000',
	port: '#ff0000',
	line_temp: '#ff8080',
	line_set: '#ff0000'
};


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var dragItem, dragOffsetX, dragOffsetY;
var mousemoveListener, mouseupListener;

canvas.addEventListener('mousedown', mousedown);

function mousedown(e) {
	dragItem = getClickItem(e);
	console.log('mousedown');
	console.log(dragItem);
	if (dragItem != null) {
		//set the offset
		dragOffsetX = e.offsetX - dragItem.x;
		dragOffsetY = e.offsetY - dragItem.y;
		//add the listeners
		mousemoveListener = canvas.addEventListener('mousemove', mousemove);
		mouseupListener = canvas.addEventListener('mouseup', mouseup);
	}
}
function mousemove(e) {
	renderCanvas(e);
	if (dragItem != null) updateDragItem(dragItem, e);
}
function mouseup(e) {
	if (dragItem != null) {
		//connect port if dragged a port onto another port
		console.log('Find mouse up hover');
		var hoverItem = getClickItem(e);
		if (hoverItem != null && hoverItem.class == 'port drag') {
			console.log('Hovered over port')
			CreateConnection(hoverItem.port, dragItem.port);
		} else {
			dragItem = null;
			renderCanvas();
		}

		//remove listeners
		mousemoveListener = canvas.removeEventListener('mousemove', mousemove);
		mouseupListener = canvas.removeEventListener('mouseup', mouseup);
	}
}


function renderCanvas(e) {
	//clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);


	//lerp function
	function lerp(a, b, c) {
		return a + (b - a) * c;
	}

	//draw modules
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];
		//get the module display corners
		var x0 = module.x,
			y0 = module.y,
			x1 = module.x + module.width,
			y1 = module.y + module.height;

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
		ctx.font = "25px Arial";
		ctx.fillText(module.name, x0 + 20, y1 - 10);


		//draw module input ports
		ctx.beginPath();
		ctx.lineWidth = connectionThickness;
		ctx.fillStyle = colors.port;
		for (var j = 0; j < module.inputs.length; j++) {
			var x = module.inputs[j].x + module.x,
				y = module.inputs[j].y + module.y;
			ctx.arc(x, y, portRadius, 0, 2 * Math.PI);
			ctx.fill();
		}

		//draw module output ports
		for (var j = 0; j < module.outputs.length; j++) {
			var x = module.outputs[j].x + module.x,
				y = module.outputs[j].y + module.y;

			ctx.arc(x, y, portRadius, 0, 2 * Math.PI);
			ctx.fill();
		}


	}


	//draw connections
	ctx.beginPath();
	ctx.strokeStyle = colors.line_set;
	console.log(`There are ${connections.length} connections`);
	for (var i = 0; i < connections.length; i++) {
		var port1 = connections[i].port1, port2 = connections[i].port2;
		//render line
		ctx.moveTo(port1.x + port1.module.x, port1.y + port1.module.y,);
		ctx.lineTo(port2.x + port2.module.x, port2.y + port2.module.y,);
		ctx.stroke();
	}

	//draw the dragObject (if its a maybe connection)
	if (dragItem != null && dragItem.render != null) dragItem.render(ctx, e);
}
function getClickItem(e) {
	var x = e.offsetX,
		y = e.offsetY;

	//function used to create an item to drag to make a port connection
	function createPortDrag(port) {
		var obj = {
			class: 'port drag',
			x: e.offsetX,
			y: e.offsetY,
			port: port,
			render: (ctx, e) => {
				//render line
				ctx.strokeStyle = colors.line_temp;
				ctx.moveTo(port.x + port.module.x, port.y + port.module.y,);
				ctx.lineTo(e.offsetX, e.offsetY);
				ctx.stroke();
			},
			mouseup: (e) => {
				for (var i = 0; i < ports.length; i++) {
					var port2 = ports[i];

					if (pointIsOnPort(port) && port != port2) {
						CreateConnection(port, port2);
						return;
					}
				}
				renderCanvas();
			}
		};

		return obj;
	}
	//functions used to check if click on anything
	function pointIsOnModule(module) {
		var x0 = module.x,
			y0 = module.y,
			x1 = module.x + module.width,
			y1 = module.y + module.height;
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
		var x0 = connection.port1.x,
			y0 = connection.port2.y,
			x1 = connection.port1.x + connection.port1.module.x,
			y1 = connection.port2.y + connection.port2.module.y;

		function pointIsInBoundingBox() {
			if (x < Math.min(x0, x1) && x > Math.max(x0, x1) && y < Math.min(y0, y1) && y > Math.max(y0, y1)) {
				return true;
			} else {
				return false;
			}
		}
		function pointIsOnLine() {
			//based on y = mx + c

			var m = (y1 - y0) / (x1 - x0),
				c = y0 - m * x0, //c = y - mx
				calcY = m * x + c,//y = mx + c
				calcX = (y - c) / m,// x = (y - c) / m
				distY = y - calcY,
				distX = x - calcX;

			if (Math.min(distY, distX) <= connectionThickness) {
				return true;
			} else {
				return false;
			}
		}
		for (var i = 0; i < connections.length; i++) {
			var connection = connections[i];
			//check if click point is in bounding box and check if click point is on line
			if (pointIsInBoundingBox() && pointIsOnLine()) {
				return true;
			} else {
				return false;
			}
		}
	}
	//find if clicked on a port
	console.log(`There are ${ports.length} ports`);
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



//Add input and output modules
CreateModule('input');
CreateModule('output');

renderCanvas();