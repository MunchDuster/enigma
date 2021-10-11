//Shape settings
var connectionThickness = 5,
	portRadius = 5,
	fontSize = 22;

//Colors
var colors = {
	module_bg: '#cfcfcf',
	module_text: '#000000',
	port_set: {
		'string': '#0000ff',
		'number': '#ff0000'
	},
	port_temp: {
		'string': '#8080ff',
		'number': '#ff8080'
	}
};

//get and prepare the canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var dragItem, dragOffsetX, dragOffsetY;
var mousemoveListener, mouseupListener;

//add mandatory listners
window.addEventListener('resize', resizeCanvas);
canvas.addEventListener('mousedown', mousedown);

//prevent the default right click options when right clicking on the canvas
canvas.addEventListener('contextmenu', function (e) {
	e.preventDefault();
}, false);

function mousedown(e) {
	//cehck for right click
	if (e.which == 3) {
		rightclick(e);
		return;
	}
	dragItem = getClickItem(e);
	console.log('mousedown');
	console.log(dragItem);
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
		//add the listeners
		mousemoveListener = canvas.addEventListener('mousemove', mousemove);
		mouseupListener = canvas.addEventListener('mouseup', mouseup);
	}
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
function mousemove(e) {
	renderCanvas(e);
	if (dragItem != null) updateDragItem(dragItem, e);
}
function mouseup(e) {
	if (dragItem != null) {
		//connect port if dragged a port onto another port
		var hoverItem = getClickItem(e);
		if (hoverItem != null && hoverItem.class == 'port drag') {
			CreateConnection(hoverItem.port, dragItem.port);
			delete hoverItem.render;
		}
		dragItem = null;

		//remove listeners
		mousemoveListener = canvas.removeEventListener('mousemove', mousemove);
		mouseupListener = canvas.removeEventListener('mouseup', mouseup);

		renderCanvas();
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
		ctx.font = fontSize + "px Arial";
		ctx.fillText(module.codec.getName(), x0 + 20, lerp(y0, y1, 0.5) + fontSize / 3);
	}

	//draw ports
	for (var i = 0; i < ports.length; i++) {
		var port = ports[i],
			x = port.x + port.module.x,
			y = port.y + port.module.y;

		ctx.beginPath();
		ctx.fillStyle = colors.port_set[port.type];
		ctx.arc(x, y, portRadius, 0, 2 * Math.PI);
		ctx.fill();
	}


	//draw connections
	ctx.lineWidth = connectionThickness;
	for (var i = 0; i < connections.length; i++) {
		var port1 = connections[i].inputPort, port2 = connections[i].outputPort;
		//render line
		ctx.beginPath();
		ctx.strokeStyle = colors.port_set[port1.type];
		ctx.moveTo(port1.x + port1.module.x, port1.y + port1.module.y,);
		ctx.lineTo(port2.x + port2.module.x, port2.y + port2.module.y,);
		ctx.stroke();
	}

	//draw the dragObject (if its a maybe connection)

	if (dragItem != null && dragItem.render != null && e != null) {
		dragItem.render(ctx, e);
	}
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
			render: function (ctx, e) {
				//render line
				ctx.strokeStyle = colors.port_temp[this.port.type];
				ctx.moveTo(port.x + port.module.x, port.y + port.module.y,);
				ctx.lineTo(e.offsetX, e.offsetY);
				ctx.stroke();
			},
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
		var x0 = connection.inputPort.x + connection.inputPort.module.x,
			y0 = connection.inputPort.y + connection.inputPort.module.y,
			x1 = connection.outputPort.x + connection.outputPort.module.x,
			y1 = connection.outputPort.y + connection.outputPort.module.y;

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
	console.log("resize");
	// ...then set the internal size to match
	canvas.width = canvas.parentElement.offsetWidth - 14;
	renderCanvas();
}
resizeCanvas();

//Add input and output modules
var inputModule = CreateModule('input');
inputModule.x = canvas.width / 2 - 200;
inputModule.y = canvas.height / 2;

var outputModule = CreateModule('output');
outputModule.x = canvas.width / 2 + 200;
outputModule.y = canvas.height / 2;



CreateConnection(inputModule.outputs[0], outputModule.inputs[0]);
renderCanvas();