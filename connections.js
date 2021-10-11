const connections = [];

function CreateConnection(port1, port2) {
	/*
	don't connect if :
	1. trying to connect a port to itself
	2. trying to connect ports of different types
	3. trying to connect two input ports or two output ports
	*/
	if (port1 == port2 || port1.type != port2.type || port1.isInput == port2.isInput) {
		return;
	}


	port1.connection = port2;
	port2.connection = port1;


	var inputPort, outputPort;
	if (port1.isInput) {
		inputPort = port1;
		outputPort = port2;
	} else {
		inputPort = port2;
		outputPort = port1;
	}


	var obj = {
		class: 'connection',
		inputPort: inputPort,
		outputPort: outputPort,
	};



	connections.push(obj);

	return obj;
}
function DeleteConnection(connection) {
	var index = connections.indexOf(connection);
	if (index !== -1) {
		connections.splice(index, 1);
	} else {
		console.log(`Module doesnt exist: ${connection}`);
	}
}