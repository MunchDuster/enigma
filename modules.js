var modules = [];
var moduleNo = 0;

function CreateModule(name, codecData, id) {
	var codec = codecs[name].new(codecData);
	//Set base object
	var obj = {
		class: 'module',
		get worldX() { return this.x * zoomMultiplier + offsetX; },
		get worldY() { return this.y * zoomMultiplier + offsetY; },
		get height() { return (Math.max(this.inputs.length, this.outputs.length) * 15 + 20) * zoomMultiplier },
		get width() { return ctx.measureText(this.codec.getName()).width + 28 * zoomMultiplier },
		x: canvas.width / 2,
		y: canvas.height / 2,
		codec: codec,
		codecData: codecData,
		inputs: [],
		outputs: [],
		name: name,
		id: id == null ? moduleNo++ : id
	};

	function makeInputs() {
		// Get and return all inputs on element
		var inputs = codec.inputs;

		for (var i = 0; i < inputs.length; i++) {
			var port = CreateInputPort(obj, i, inputs[i].type, inputs[i].name);
			obj.inputs.push(port);
		}
	}
	function makeOutputs() {
		//Get and return all outputs on element
		var outputs = codec.outputs;
		for (var i = 0; i < outputs.length; i++) {
			var port = CreateOutputPort(obj, i, outputs[i].type, outputs[i].name);
			obj.outputs.push(port);
		}
	}

	makeInputs();
	makeOutputs();

	modules.push(obj);
	renderCanvas();
	return obj;
}
function DeleteModule(module) {
	function getIndex() {
		for (var i = 0; i < modules.length; i++) {
			if (modules[i].id === module.id) {
				return i;
			}
		}
		return -1;
	}
	var index = getIndex();
	if (index != -1) {
		modules.splice(index, 1);
	} else {
		console.log(`Module doesnt exist: ${module.id}`);
	}
}