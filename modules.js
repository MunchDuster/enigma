const modules = [];

function CreateModule(name) {
	function calculateHeight(numberOfINputs, outputs) {
		return Math.max(inputs, outputs)
	}
	var height = calculateHeight(codecs[name].inputs.length);
	//Set base object
	var obj = {
		class: 'module',
		x: 0,
		y: 0,
		inputs: [],
		outputs: [],
		height: 40,
		width: 100,
		name: name
	};

	function makeInputs() {
		// Get and return all inputs on element
		var inputEles = Array.from(element.getElementsByClassName('Input'));
		console.log(`There are ${inputEles.length} inputs`);
		var inputs = [];
		inputEles.forEach((ele) => {
			var port = CreatePort(ele, obj);
			portElement(port, obj);
			inputs.push(port);
		});

		return inputs;
	}
	function makeOutputs() {
		//Get and return all outputs on element
		var outputEles = Array.from(element.getElementsByClassName('Output'));
		var outputs = [];
		outputEles.forEach((ele) => {
			var port = CreatePort(ele, obj);
			console.log(port);
			portElement(port, obj);
			outputs.push(port);

		});
		return outputs;
	}

	obj.inputs = getInputs();
	obj.outputs = getOutputs();

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