function cleartxt() {
	outputText.innerText = "";
}
function swap() {
	var temp = inputText.innerText;
	inputText.innerText = outputText.innerText;
	outputText.innerText = temp;
}
function copyText() {
	var range = document.createRange();
	range.selectNode(outputText);
	window.getSelection().removeAllRanges(); // clear current selection
	window.getSelection().addRange(range); // to select text
	document.execCommand("copy");
	window.getSelection().removeAllRanges(); // to deselect
}
function save() {
	var id = 0;
	var saveModules = [];
	var saveConnections = [];
	var savePorts = [];

	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];
		var saveInputs = [];
		var saveOutputs = [];

		for (var j = 0; j < module.inputs.length; j++) {
			var port = module.inputs[j],
				savePort = {
					id: id++,
					type: port.type,
					place: port.place,
				};

			savePorts.push(savePort);
			saveInputs.push(savePorts.indexOf(savePort));
		}
		for (var j = 0; j < module.outputs.length; j++) {
			var port = module.outputs[j],
				savePort = {
					id: id++,
					type: port.type,
					place: port.place,
				};

			savePorts.push(savePort);
			saveInputs.push(savePorts.indexOf(savePort));
		}

		var saveModule = {
			name: module.name,
			codecData: module.codecData,
			x: module.x,
			y: module.y,
			id: id++,
			inputs: saveInputs,
			outputs: saveOutputs,
		};
		module.id = id;

		saveModules.push(saveModule);
	}
	for (var i = 0; i < connections.length; i++) {
		var connection = connections[i],
			saveConnections = {
				port1: {
					place: connection.port1.place,
					id: connection.port1.id,
				},
				port2: {
					place: connection.port2.place,
					id: connection.port2.id,
				},
			};

		saveConnections.push(saveConnection);
	}
	localStorage.setItem('modules', JSON.stringify(saveModules));
	localStorage.setItem('connections', JSON.stringify(saveConnections));
}

//Attempt to load saved data
try {
	var loadedModules = JSON.parse(localStorage.getItem('modules'));
	var loadedConnections = JSON.parse(localStorage.getItem('connections'));

	//Create the modules
	for (var loadedModule in loadedModules) {
		var module = CreateModule(loadedModule.name, loadedModule.codecData);
		module.x = loadedModule.x;
		module.y = loadedModule.y;
	}

	//Create the connections
	for (var loadedConnection in loadedConnections) {
		//var connection = CreateConnection(loadedConnection.port, loadedConnection.)
	}
} catch (e) {
	console.error('Could not load: ', e);
}