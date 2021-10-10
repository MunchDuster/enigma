const ports = [];
function CreatePort(module, isInput, place, type, codecData) {
	var x = isInput ? 8 : module.width - 8,
		y = module.height / (place + 2),
		obj = {
			class: 'port',
			x: x,
			y: y,
			module: module,
			direction: isInput ? 'input' : 'output',
			type: type,
			connection: null,
			codecData: codecData
		};

	ports.push(obj);
	return obj;
}
function DeletePort(port) {

}