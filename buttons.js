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
	console.log('saving');
	var saveModules = [];
	var saveConnections = [];
	for (var i = 0; i < modules.length; i++) {
		var module = modules[i];
		module.id = i;
		var saveModule = {
			name: module.name,
			codecData: module.codecData,
			x: module.x,
			y: module.y,
			id: module.id,
		};

		saveModules.push(saveModule);
	}
	for (var i = 0; i < connections.length; i++) {
		var connection = connections[i],
			saveConnection = {
				outputPort: {
					module: connection.outputPort.module.id,
					place: connection.outputPort.place,
				},
				inputPort: {
					module: connection.inputPort.module.id,
					place: connection.inputPort.place,
				},
			};
		saveConnections.push(saveConnection);
	}
	localStorage.setItem('modules', JSON.stringify(saveModules));
	localStorage.setItem('connections', JSON.stringify(saveConnections));
}

//Attempt to load saved data
try {
	console.log('attempting to load saved data.');
	var loadedModules = JSON.parse(localStorage.getItem('modules'));
	var loadedConnections = JSON.parse(localStorage.getItem('connections'));

	if (loadedModules == null && loadedConnections == null) throw 'No saved data to load';
	console.log(loadedModules, loadedConnections);
	setLoading(true);


	//Create the modules
	for (var index in loadedModules) {
		var loadedModule = loadedModules[index];
		var module = CreateModule(loadedModule.name, loadedModule.codecData, loadedModule.id);
		module.x = loadedModule.x;
		module.y = loadedModule.y;
	}

	//Create the connections
	for (var index in loadedConnections) {
		var loadedConnection = loadedConnections[index];
		//var connection = CreateConnection(loadedConnection.port, loadedConnection.)
		var port1Module = modules.find(module => {
			return module.id == loadedConnection.inputPort.module;
		}),
			port2Module = modules.find(module => {
				return module.id == loadedConnection.outputPort.module;
			});

		var port1 = port1Module.inputs[loadedConnection.inputPort.place],
			port2 = port2Module.outputs[loadedConnection.outputPort.place];


		var connection = CreateConnection(port1, port2);
	}

	setLoading(false);
} catch (e) {
	console.log('could not load saved data.');
	//Add input and output modules
	var inputModule = CreateModule('input');
	inputModule.x -= 180;

	var outputModule = CreateModule('output');
	outputModule.x += 180;



	CreateConnection(inputModule.outputs[0], outputModule.inputs[0]);
}


function hide(ele) {
	ele.style.display = 'none';
}
function show(ele) {
	ele.style.display = ele.style.display == 'inline-block' ? 'none' : 'inline-block';
}