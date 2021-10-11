//private functions
function getModulesOrder() {
	var modulesOrder = [];
	function getInputModules(module) {
		//put into modules list
		modulesOrder.push(module);
		//increment order counter
		//got to the inputs
		for (var i = 0; i < module.inputs.length; i++) {
			if (module.inputs[i].connections != null) {
				var connectedModule = module.inputs[i].connections.module;
				if (!modulesOrder.includes(connectedModule)) {
					getInputModules(connectedModule);
				} else {
					console.log('already in ilst');
					console.log(connectedModule);
				}
			} else {
				console.log('empty input');
			}
		}
	}
	var outputModule = modules.filter(module => { return module.name == 'output'; })[0];
	getInputModules(outputModule);

	return modulesOrder;
}
//public functions
function encode() {
	console.log('encoding');
	var moduleList = getModulesOrder();


	//now use them in correct order
	for (var i = moduleList.length - 1; i >= 0; i--) {
		var module = moduleList[i];

		//get the inputs values
		var inputValues = [];
		for (var j = 0; j < module.inputs.length; j++) {
			var port = module.inputs[j];
			inputValues.push(port.value);
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
			var port = module.outputs[j];
			port.value = outputValues[j];
			for (var k = 0; k < port.connections.length; k++) {
				var connection = port.connections[k];
				connection.value = outputValues[j];
				console.log('setting connection');
			}
		}
	}
}
function decode() {
	console.log('decoding');
	var moduleList = getInputModules();


	//now use them in correct order
	for (var i = moduleList.length - 1; i >= 0; i--) {
		var module = moduleList[i];

		//get the inputs values
		var inputValues = [];
		for (var j = 0; j < module.inputs.length; j++) {
			if (module.inputs[j].connections != null) {
				module.inputs[j].value = module.inputs[j].connections.value;
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