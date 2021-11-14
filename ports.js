const ports = [];
var portNo = 0;

function CreatePortObj(module, isInput, place, type, name) {
	return {
		class: 'port',
		place: place,
		module: module,
		isInput: isInput,
		type: type,
		connections: isInput ? null : [],
		id: portNo++,
		name: name
	};
}

function CreateInputPort(module, place, type, name) {
	var obj = CreatePortObj(module, true, place, type, name)

	Object.defineProperty(obj, 'localX', {
		get: function () { return 8 * zoomMultiplier }
	});
	Object.defineProperty(obj, 'localY', {
		get: function () { return module.height * (place + 1) / (module.inputs.length + 1) }
	});

	ports.push(obj);
	return obj;
}
function CreateOutputPort(module, place, type, name) {
	var obj = CreatePortObj(module, false, place, type, name)

	Object.defineProperty(obj, 'localX', {
		get: function () { return module.width - 8 * zoomMultiplier }
	});
	Object.defineProperty(obj, 'localY', {
		get: function () { return module.height * (place + 1) / (module.outputs.length + 1) }
	});

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