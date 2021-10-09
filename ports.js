const ports = [];
function CreatePort(module, isInput, place) {
	var x = isInput ? module.width - 6 : 6,
		y = module.height / (place + 2),
		obj = {
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