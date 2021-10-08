var modules = [];

var moduleEles = Array.from(document.querySelectorAll('.DraggableItem'));
moduleEles.forEach((ele) => {
	createModule(ele);
});

function createModule(element) {
	//Set base object
	var obj = {
		element: element,
		inputs: [],
		outputs: [],
		name: element.dataset.function
	};

	function getInputs() {
		// Get and return all inputs on element
		var inputEles = Array.from(element.getElementsByClassName('Input'));
		console.log(`There are ${inputEles.length} inputs`);
		var inputs = [];
		inputEles.forEach((ele) => {
			var port = CreatePort(ele, obj);
			console.log('input port is: ');
			console.log(port);
			portElement(port, obj);
			inputs.push(port);
		});

		return inputs;
	}
	function getOutputs() {
		//Get and return all outputs on element
		var outputEles = Array.from(element.getElementsByClassName('Output'));
		console.log(`There are ${outputEles.length} outputs`);
		var outputs = [];
		outputEles.forEach((ele) => {
			var port = CreatePort(ele, obj);
			console.log('output port is: ');
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
function getModuleFromElement(element) {

	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];
		if (module.element == element) {
			console.log('Module found');
			return module;
		}
	}
	console.log('No module found');
	return null;
}


