const ports = [];
var portNo = 0;

class Port {
	constructor(module, isInput, place, type, name) {
		this.i = place;
		this.module = module;
		this.isInput = isInput;
		this.type = type;
		this.connections = isInput ? null : [];
		this.id = portNo++;
		this.name = name;

		//Add to ports list
		ports.push(this);

		//Save the index in the list
		this.index = ports.length - 1;
	}

	get pos() {
		return this.localPos.add(this.module.pos);
	}

	get screenPos() {
		return Vector2.WorldToScreen(this.module.pos).add(this.localPos);
	}

	destroy() {
		ports.splice(this.index, 1);
	}
}

function CreateInputPort(module, place, type, name) {
	var port = new Port(module, true, place, type, name)

	Object.defineProperty(port, 'localPos', {
		get: function () {
			return new Vector2(
				8 * zoomMultiplier,
				module.height * (port.i + 1) / (module.inputs.length + 1)
			);
		}
	});

	return port;
}
function CreateOutputPort(module, place, type, name) {
	var port = new Port(module, false, place, type, name)

	Object.defineProperty(port, 'localPos', {
		get: function () {
			return new Vector2(
				module.width - 8 * zoomMultiplier,
				module.height * (port.i + 1) / (module.outputs.length + 1)
			);
		}
	});

	return port;
}