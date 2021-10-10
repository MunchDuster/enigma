function encode() {
	console.log('encoding');
	var modulesOrder = [];
	function addToModulesOrder(module, order) {
		if (order < modulesOrder.length) {
			modulesOrder.splice(order, 0, module);
		} else {
			modulesOrder.push(module);
		}
	}
	function getInputModules(module, order) {
		console.log(`order is ${order}`);
		//put into modules list
		addToModulesOrder(module, order);
		//increment order counter
		order++;
		//got to the inputs
		console.log(`There are ${module.inputs.length} inputs.`);
		for (var i = 0; i < module.inputs.length; i++) {
			if (module.inputs[i].connection != null) {
				var connectedModule = module.inputs[i].connection.module;
				if (!modulesOrder.includes(connectedModule)) {
					getInputModules(connectedModule, order);
				}
			}
		}
	}

	var outputModule = modules.filter(module => { return module.name == 'output'; })[0];
	getInputModules(outputModule, 0);


	//now use them in correct order
	for (var i = modulesOrder.length - 1; i >= 0; i--) {
		var module = modulesOrder[i];
		console.log(`Module ${i} is`);

		//get the inputs values
		var inputValues = [];
		for (var j = 0; j < module.inputs.length; j++) {
			if (module.inputs[j].connection != null) {

				module.inputs[j].value = module.inputs[j].connection.value;
			} else {
				console.log('no connection');
			}
			inputValues.push(module.inputs[j].value);
		}

		//calculate output values
		var outputValues = module.codec.encode(inputValues);

		//no outputs, (output module reached)
		if (outputValues == null) {
			//end of modules
			console.log('output reached');
			return;
		}

		//set the connections values
		for (var j = 0; j < module.outputs.length; j++) {
			module.outputs[j].value = outputValues[j];
		}
	}

}