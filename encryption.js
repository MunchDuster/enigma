const inputModule = document.querySelector('.ModulesInput');
const outputModule = document.querySelector('.ModulesOutput');


function encode() {
	console.log('encoding');
	var startModule = getModuleFromElement(inputModule);
	var endModule = getModuleFromElement(outputModule);
	var currentModules = [startModule];

	while (currentModules.length > 0) {
		var nextModules = [];

		function addToNextModules(module) {
			if (nextModules.indexOf(module) == -1) {
				nextModules.push(module);
			}
		}

		for (var i = 0; i < currentModules.length; i++) {
			var module = currentModules[i];
			var inputValues = [];
			for (var j = 0; j < module.inputs.length; j++) {
				inputValues.push(module.inputs[j].value);
			}
			console.log('Input values: ', inputValues);
			var outputValues = getCodecFromName(module.name).encode(inputValues);
			console.log(module);

			if (outputValues == null) {
				//end of modules
				return;
			}

			for (var j = 0; j < module.outputs.length; j++) {
				module.outputs[j].connection.value = outputValues[j];
				addToNextModules(module.outputs[j].connection.module);
			}
		}

		currentModules = nextModules;
	}

}