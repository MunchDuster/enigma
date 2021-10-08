const inputModule = document.querySelector('.ModulesInput');
const outputModule = document.querySelector('.ModulesOutput');

const inputText = document.querySelector('.InputText');
const outputText = document.querySelector('.OutputText');

function encode() {
	console.log('encoding');
	var startModule = getModuleFromElement(inputModule);
	console.log('startModule is ');
	console.log(startModule);
	var currentModules = [startModule.outputs[0].connection.module];

	startModule.outputs[0].connection.value = inputText.value;

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
				inputValues.push(module.inputs[j]);
			}
			var outputValues = getCodecFromName(module.name).encode(inputValues);
			console.log(currentModules[i]);
			if (outputValues == null) {
				outputText.innerText = currentModules[i].inputs[0].value;
				return;
			}
			for (var j = 0; j < outputValues.length; j++) {
				module.outputs[j].connection.value = outputValues[j];
				addToNextModules(module.outputs[j].connection.module);
			}
		}

		currentModules = nextModules;
	}

}