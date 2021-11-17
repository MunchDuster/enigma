var modules = [];

class Module {
	constructor(name, codecData, id) {
		this.codec = codecs[name].new(codecData);
		this.pos = Vector2.ScreenToWorld(new Vector2(canvas.width / 2, canvas.height / 2));
		this.codecData = codecData;
		this.inputs = [];
		this.outputs = [];
		this.name = name;
		this.id = id;

		// Get and return all inputs on element
		var inputs = this.codec.inputs;

		for (var i = 0; i < inputs.length; i++) {
			var port = CreateInputPort(this, i, inputs[i].type, inputs[i].name);
			this.inputs.push(port);
		}

		// Get and return all outputs on element
		var outputs = this.codec.outputs;
		for (var i = 0; i < outputs.length; i++) {
			var port = CreateOutputPort(this, i, outputs[i].type, outputs[i].name);
			this.outputs.push(port);
		}

		// Add to the list
		modules.push(this);

		//set the index for the list
		this.index = modules.length - 1;

		//re-render the canvas
		renderCanvas();
	}
	get size() { return new Vector2(this.width, this.height); }
	get height() { return (Math.max(this.inputs.length, this.outputs.length) * 15 + 20) * zoomMultiplier }
	get width() {
		ctx.font = moduleFont();
		return ctx.measureText(this.codec.getName()).width + 32 * zoomMultiplier
	}

	delete() {
		modules.splice(this.index, 1);
	}
}