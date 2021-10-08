function portElement(port, module) {

	var line;
	var moveListener;
	var upListener;
	var startX, startY;
	var portX, portY;

	port.element.addEventListener('mousedown', (e) => {
		console.log('down on port.');
		//init start position
		startX = e.clientX;
		startY = e.clientY;

		//init line
		line = document.createElement('div');
		line.className = "Line";
		line.style.transformOrigin = '0 0';
		line.style.left = startX + 'px';//later as portx
		line.style.top = startY + 'px';//later as porty
		document.body.appendChild(line);

		//set the listeners
		moveListener = window.addEventListener('mousemove', dragLine);
		upListener = window.addEventListener('mouseup', OnMouseUp);
	});

	function dragLine(e) {
		//update the line
		var x = e.clientX,
			y = e.clientY,
			distx = x - startX,
			disty = y - startY,
			distance = Math.sqrt(distx * distx + disty * disty);

		//set to correct width
		line.style.width = distance + 'px';

		//rotate 
		var angle = Math.asin(disty / distance) * 180 / Math.PI;
		if (distx < 0) angle = angle * -1 - 180;
		line.style.transform = 'rotate(' + angle + 'deg)';
	}
	function OnMouseUp(e) {
		//set conenction if over acceptable port
		var hoverPort = getOverPort(e);
		if (hoverPort != null) {
			line.className += " Set";

			hoverPort.connection = port;
			port.connection = hoverPort;
			console.log(port);
		}
		//else remove line element
		else {
			line.remove();
		}

		//remove the listeners
		moveListener = window.removeEventListener('mousemove', dragLine);
		upListener = window.removeEventListener('mouseup', OnMouseUp);
	}

	function getOverPort(e) {
		var x = e.clientX;
		var y = e.clientY;
		var hoverElements = document.elementsFromPoint(x, y);

		for (var i = 0; i < hoverElements.length; i++) {
			if (hoverElements[i].classList.contains('Port')) {
				console.log('Hovering over port');
				return getPortFromElement(hoverElements[i]);
			}
		}
		console.log('Not hovering over port');
		return null;
	}

}
function CreatePort(element, module) {
	var obj = {
		element: element,
		//type: element.dataset.inputtype,
		module: module,
		connection: null
	};
	return obj;
}
function getPortFromElement(element) {

	for (var i = 0; i < modules.length; i++) {
		for (var j = 0; j < modules[i].inputs.length; j++) {
			if (modules[i].inputs[j].element == element) {
				console.log('port found');
				return modules[i].inputs[j];
			}
		}
		for (var j = 0; j < modules[i].outputs.length; j++) {
			if (modules[i].outputs[j].element == element) {
				console.log('port found');
				return modules[i].outputs[j];
			}
		}
	}
	console.log('Port not found');
	return null;
}