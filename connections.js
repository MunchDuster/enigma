const connections = [];

function CreateConnection(port1, port2) {
	var obj = {
		class: 'connection',
		port2: port1,
		port2: port2
	};

	port1.connection = port2;
	port2.connection = port1;

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