const ports = [];
function CreatePort(module, isInput, place) {
	var obj = {
		class: 'port',
		x: x,
		y: y,
		type: isInput ? 'input' : 'output',
		connection: null,
	};


	return obj;
}
function DeletePort(port) {

}