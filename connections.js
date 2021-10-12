const connections = [];
var connectionNo = 0;
function CreateConnection(port1, port2) {
	/*
	don't connect if :
	1. trying to connect a port to itself
	2. trying to connect ports of different types
	3. trying to connect two input ports or two output ports
	*/
	if (port1 == port2 || port1.type.type != port2.type.type || port1.isInput == port2.isInput) {
		return;
	}


	var inputPort, outputPort;

	if (port1.isInput) {
		inputPort = port1;
		outputPort = port2;
	} else {
		inputPort = port2;
		outputPort = port1;
	}

	if (inputPort.connections != null) {
		DeleteConnectionToInput(inputPort);
	}

	inputPort.connections = outputPort;
	outputPort.connections.push(inputPort);

	var obj = {
		class: 'connection',
		inputPort: inputPort,
		outputPort: outputPort,
		id: connectionNo++
	};



	connections.push(obj);

	return obj;
}
function DeleteConnectionToInput(port) {
	function getIndex() {
		for (var i = 0; i < connections.length; i++) {
			var connection = connections[i];
			if (connection.inputPort === port) {
				return i;
			}
		}
		return -1;
	}
	var index = getIndex();
	if (index !== -1) {
		connections.splice(index, 1);
	} else {
		console.log(`Connection to port doesnt exist: ${port}`);
		console.log(port);
		console.log('hyas');
	}
}
function DeleteConnectionsToOutput(port) {
	function getIndex() {
		for (var i = 0; i < connections.length; i++) {
			var connection = connections[i];
			if (connection.outputPort === port) {
				return connection;
			}
		}
		return null;
	}
	var connection = getIndex();
	var founds = 0;
	while (connection != null) {
		founds++;
		DeleteConnection(connection);
		connection = getIndex();
	}
	if (founds == 0) {
		console.log(`Connection to port doesnt exist: ${port.id}`);
	}
}
function DeleteConnection(connection) {
	function getIndex() {
		for (var i = 0; i < connections.length; i++) {
			if (connections[i] === connection) {
				return i;
			}
		}
		return -1;
	}
	var index = getIndex();
	if (index != -1) {
		var connection = connections[index];
		connection.inputPort.connections = null;
		console.log(connection.outputPort.connections);
		connection.outputPort.connections.splice(connection.outputPort.connections.indexOf(connection.outputPort), 1);
		connections.splice(index, 1);
	} else {
		console.log(`connection doesnt exist: ${connection.id}`);
	}
}