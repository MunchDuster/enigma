const ports = [];
var portNo = 0;
function CreatePort(module, isInput, place, type) {
	var x = isInput ? 8 : module.width - 8,
		y = module.height / (place + 2),
		obj = {
			class: 'port',
			x: x,
			y: y,
			place: place,
			module: module,
			isInput: isInput,
			type: type,
			connections: isInput ? null : [],
			id: portNo++
		};

	ports.push(obj);
	return obj;
}
function DeletePort(port) {
	function getIndex() {
		for (var i = 0; i < ports.length; i++) {
			if (ports[i].id === port.id) {
				return i;
			}
		}
		return -1;
	}
	var index = getIndex();
	if (index != -1) {
		ports.splice(index, 1);
	} else {
		console.log(`Port doesnt exist: ${port.id}`);
	}
}