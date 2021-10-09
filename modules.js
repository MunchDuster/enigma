const modules = [];

function CreateModule(name) {
	function calculateHeight(inputs, outputs) {
		return Math.max(inputs, outputs) * 20 + 20;
	}
	var height = calculateHeight(codecs[name].inputs.length, codecs[name].outputs.length);
	//Set base object
	var obj = {
		class: 'module',
		x: canvas.width / 2 + Math.random() * 100,
		y: canvas.height / 2 + Math.random() * 100,
		inputs: [],
		outputs: [],
		height: height,
		width: 100,
		name: name,
	};

	function makeInputs() {
		// Get and return all inputs on element
		var inputs = codecs[name].inputs;

		for (var i = 0; i < inputs.length; i++) {
			var port = CreatePort(obj, true, i, inputs[i]);
			obj.inputs.push(port);
		}
	}
	function makeOutputs() {
		//Get and return all outputs on element
		var outputs = codecs[name].outputs;
		for (var i = 0; i < outputs.length; i++) {
			var port = CreatePort(obj, false, i, outputs[i]);
			obj.outputs.push(port);
		}
	}

	makeInputs();
	makeOutputs();

	modules.push(obj);
	return obj;
}
function DeleteModule(module) {
	var index = modules.indexOf(module);
	if (index !== -1) {
		modules.splice(index, 1);
	} else {
		console.log(`Module doesnt exist: ${module}`);
	}
}