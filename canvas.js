const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

var dragItem, dragOffsetX, dragOffsetY;
var mousemoveListener, mouseupListener;

canvas.addEventListener('mouseenter', mousedown);

function mousedown(e) {
	dragItem = getClickItem(e);
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
	renderCanvas();
	if (dragItem != null) updateDrag(dragItem, e);
}
function mouseup(e) {
	if (dragItem != null) {
		//connect port if dragged a port onto another port
		var hoverItem = getClickItem(e);
		if (hoverItem != null && hoverItem.class == 'port') {
			console.log(port);
			CreateConnection(hoverItem, dragItem.port);
		}

		//remove listeners
		mousemoveListener = canvas.removeEventListener('mousemove', mousemove);
		mouseupListener = canvas.removeEventListener('mouseup', mouseup);
	}
}


function renderCanvas() {
	//Colors
	var colors = {
		module_bg: '#cfcfcf',
		module_text: '#000000',
		port: '#ff0000',
		line_temp: '#ff8080',
		line_set: '%ff0000'
	};
	//clear canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	//lerp function
	function lerp(a, b, c) {
		return a + (b - a) * c;
	}

	//draw modules and set connections
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];

		//get the module display corners
		const x0 = module.x,
			y0 = module.y,
			x1 = module.x + module.width,
			y1 = module.y + module.height;

		//draw module box
		ctx.moveTo(x0, y0);
		ctx.lineTo(x0, y1);
		ctx.lineTo(x1, y1);
		ctx.lineTo(x1, y0);

		ctx.fillStyle = colors.module_bg;
		ctx.fill();

		//draw module label
		ctx.moveTo(x0, y0);
		ctx.font = "15px Arial";
		ctx.fillText(module.name, 10, 50);


		//draw module input ports
		ctx.fillStyle = colors.port;
		for (var i = 0; i < module.inputs.length; i++) {
			var x = x0 + 5,
				y = lerp(y0, y1, i / module.inputs.length);

			module.inputs[i].x = x;
			module.inputs[i].y = y;

			ctx.arc(x, y, 3, 0, 2 * Math.PI);
		}

		//draw module output ports
		for (var i = 0; i < module.outputs.length; i++) {
			var x = x1 - 5,
				y = lerp(y0, y1, i / module.inputs.length);

			module.inputs[i].x = x;
			module.inputs[i].y = y;

			ctx.arc(x, y, 3, 0, 2 * Math.PI);
		}

		//draw module output connections
		for (var i = 0; i < module.outputs.length; i++) {
			const x2 = module.outputs[i].connection.x;
			const y2 = module.outputs[i].connection.y;
		}
	}
}
function getClickItem(e) {
	var x = e.offsetX,
		y = e.offsetY;
	console.log(`Clicked on ${x},${y}`);

	//functions used in main loop below
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
		for (var i = 0; i < module.inputs.length; i++) {
			var port = module.inputs[i],
				portx = port.x + module.x,
				porty = port.y + module.y,
				distance = Math.sqrt(portx * port.x + porty * port.y);

			//check if clicked on port.
			if (distance <= 3) {
				return createPortDrag(port);
			}
		}
		return null;
	}
	function pointIsOnConnection(connection) {
		function pointIsInBoundingBox
		for (var i = 0; i < connections.length; i++) {
			var connection = connections[i];
			//check if click point is in bounding box
			if (pointIsInBoundingBox(connection)) {

			}

			//check if click point is on line
		}
	}
	//find if clicked on port
	for (var i = 0; i < ports.length; i++) {
		var port = ports[i];

		if (pointIsOnPort())
	}
	//find if click on connection
	for (var i = 0; i < connections.length; i++) {
		var connection = connections[i];

		if (pointIsOnConnection(connection)) {
			return connection;
		}
	}
	//find if clicked on any module
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];

		if (pointIsOnModule(module)) {
			//not hovering over any port, return module
			return module;
		}
	}

}
function dragItem(item, e) {
	item.x = e.offsetX + dragOffsetX;
	item.y = e.offsetY + dragOffsetY;
}



//Add input and output modules
createModule('getInput');
createModule('getOutput');