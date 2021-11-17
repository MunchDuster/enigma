//private functions
function getModulesOrder() {
	var modulesOrder = [];
	function getInputModules(module) {
		//put into modules list
		modulesOrder.unshift(module);
		//increment order counter
		//got to the inputs
		for (var i = 0; i < module.inputs.length; i++) {
			if (module.inputs[i].connection != null) {
				var connectedModule = module.inputs[i].connection.outputPort.module;
				if (modulesOrder.includes(connectedModule)) {
					//remove from array at that place
					modulesOrder.splice(modulesOrder.indexOf(connectedModule), 1);
				}
				getInputModules(connectedModule);
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
	for (var i = 0; i < moduleList.length; i++) {
		var module = moduleList[i];

		//get the inputs values
		var inputValues = [];
		for (var j = 0; j < module.inputs.length; j++) {

			var port = module.inputs[j].connection.outputPort;
			console.log(port)
			inputValues.push(port.value);
		}
		//calculate output values
		var outputValues = module.codec.encode(inputValues);

		//no outputs, (output module reached)
		if (outputValues == null) {
			//end of modules
			return;
		}

		//set the connections values
		for (var j = 0; j < module.outputs.length; j++) {
			var port = module.outputs[j];
			port.value = outputValues[j];
			for (var k = 0; k < port.connections.length; k++) {
				var connection = port.connections[k];
				connection.value = outputValues[j];
			}
		}
	}
}
function decode() {
	console.log('decoding');
	var moduleList = getModulesOrder();

	//send data from extractors
	//all vars send their data to their connections	

	//now use them in correct order
	for (var i = moduleList.length - 1; i >= 0; i--) {
		var module = moduleList[i];

		//get the inputs values
		var inputValues = [];
		for (var j = 0; j < module.inputs.length; j++) {
			inputValues.push(module.inputs[j].value);
		}
		console.log('module: ' + module.name);
		console.log('inputs: ');
		console.log(inputValues);

		//calculate output values
		var outputValues = module.codec.decode(module.inputs, module.outputs);

		console.log('outputs: ');
		console.log(outputValues);

		//no outputs, (output module reached)
		if (outputValues == null) {
			//end of modules
			console.log('output reached');
			return;
		}

		//set the connections values
		for (var j = 0; j < module.outputs.length; j++) {
			module.inputs[j].value = outputValues[j];
		}
	}
}