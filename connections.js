const connections = [];

function CreateConnection(port1, port2) {
	var obj = {
		class: 'connection',
		port1: port1,
		port2: port2,
		getOtherPort: (port) => {
			if (port == port1) return port1;
			else if (port == port2) return port2;
			else console.error('Invalid port at get other port of connection: ' + port);
		}
	};
	connections.push(obj);
	return obj;
}
function DeleteConnection(connection) {
	var index = connections.indexOf(connection);
	if (index !== -1) {
		connections.splice(index, 1);
	} else {
		console.log(`Connection doesnt exist: ${connection}`);
	}
}