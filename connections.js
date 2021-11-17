var connections = [];
var connectionNo = 0;

class Connection {
	constructor(port1, port2) {
		/*
		don't connect if :
		1. trying to connect a port to itself
		2. trying to connect ports of different types
		3. trying to connect two input ports or two output ports
		*/
		if (port1 == port2 || port1.type.type != port2.type.type || port1.isInput == port2.isInput) {
			return;
		}


		if (port1.isInput) {
			this.inputPort = port1;
			this.outputPort = port2;
		} else {
			this.inputPort = port2;
			this.outputPort = port1;
		}

		if (this.inputPort.connections != null) {
			this.inputPort.connections.destroy();
		}
		this.inputPort.connection = this;
		this.outputPort.connections.push(this);

		this.id = connectionNo++;

		// add to connections list
		connections.push(this);

		//save the index
		this.index = connections.length - 1;

		renderCanvas();
	}

	destroy() {
		connections.splice(this.index, 1);
	}
}