const modules = [];
var moduleNo = 0;
function CreateModule(name, codecData) {
	var codec = codecs[name].new(codecData);

	function calculateHeight(inputs, outputs) {
		return Math.max(inputs, outputs) * 20 + 20;
	}
	var height = calculateHeight(codec.inputs.length, codec.outputs.length);
	//Set base object
	var obj = {
		class: 'module',
		x: canvas.width / 2,
		y: canvas.height / 2,
		codec: codec,
		codecData: codecData,
		inputs: [],
		outputs: [],
		height: height,
		width: 100,
		name: name,
		id: moduleNo++
	};

	function makeInputs() {
		// Get and return all inputs on element
		var inputs = codec.inputs;

		for (var i = 0; i < inputs.length; i++) {
			var port = CreatePort(obj, true, i, inputs[i]);
			obj.inputs.push(port);
		}
	}
	function makeOutputs() {
		//Get and return all outputs on element
		var outputs = codec.outputs;
		for (var i = 0; i < outputs.length; i++) {
			var port = CreatePort(obj, false, i, outputs[i]);
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