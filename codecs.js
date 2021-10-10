const inputText = document.querySelector('.InputText');
const outputText = document.querySelector('.OutputText');
const variableParent = document.querySelector('.VariableParent');

var codecs = {
	'offset': {
		inputs: ['string', 'number'],
		outputs: ['string'],
		create: function () {
			var offsetCodec = {
				getName: function () {
					return 'offset';
				},
				encode: ([msg, move]) => {
					if (move == null) move = 1;
					var output = "";
					for (var i = 0; i < msg.length; i++) {
						output += String.fromCharCode(msg.charCodeAt(i) + move);
					}
					return [output];
				},
				decode: (msg, move) => {
					var output = "";
					for (var i = 0; i < msg.length; i++) {
						output += String.fromCharCode(
							msg.charCodeAt(i) - parseInt(eval(move.replace("chr", i)))
						);
					}
					return output;
				}
			};

			return offsetCodec;
		}

	},
	'rotate': {
		inputs: ['string', 'number'],
		outputs: ['string'],
		create: function () {
			var rotateCodec = {
				getName: function () {
					return 'rotate';
				},
				encode: ([msg, move]) => {
					if (move == null) move = 1;
					var output = "";
					for (var i = 0; i < msg.length; i++) {
						var num = (i + move) % msg.length;
						num = num < 0 ? msg.length + num : num;
						output += msg[num];
					}
					return [output];
				},
				decode: ([msg, move]) => {
					var output = "";
					for (var i = 0; i < msg.length; i++) {
						var num = (i - move) % msg.length;
						num = num < 0 ? msg.length + num : num;
						output += msg[num];
					}
					return [output];
				}
			};
			return rotateCodec;
		}
	},
	'multiply': {
		inputs: ['string', 'number'],
		outputs: ['string'],
		create: function () {
			var codec = {
				getName: function () {
					return 'multiply';
				},
				encode: ([msg, move]) => {
					if (move == null) move = 2;
					var output = "";
					for (var i = 0; i < msg.length; i++) {
						output +=
							String.fromCharCode(msg.charCodeAt(i) * move);
					}
					return [output];
				},
				decode: ([msg, move]) => {
					var output = "";
					for (var i = 0; i < msg.length; i++) {
						output += String.fromCharCode(msg.charCodeAt(i) / move);
					}
					return [output];
				}
			};
			return codec;
		}
	},
	'output': {
		inputs: ['string'],
		outputs: [],
		create: function () {
			var outputCodec = {
				getName: function () {
					return 'output';
				},
				encode: ([msg]) => {
					console.log(msg);
					outputText.innerText = msg;
				},
				decode: () => { }
			};
			return outputCodec;
		}
	},
	'input': {
		inputs: [],
		outputs: ['string'],
		create: function () {
			var inputCodec = {
				getName: function () {
					return 'input';
				},
				encode: () => {
					console.log('Input text is ' + inputText.innerText);
					return [inputText.innerText];
				},
				decode: () => { }
			};
			return inputCodec;
		}
	},
	'variable': {
		inputs: [],
		outputs: ['individually set'],
		create: function (outputtype) {
			console.log(`Variable type: ${outputtype}`);

			//set the output type
			this.outputs[0] = outputtype;

			//make the elements to control the codec
			var outDiv = document.createElement('div');

			var nameInput = document.createElement('input');
			nameInput.classList.add('VariableNameInput');
			nameInput.addEventListener('input', function () {
				if (renderCanvas != null) {
					renderCanvas();
				}
			});
			nameInput.type = 'text';

			var valueInput = document.createElement('input');
			valueInput.classList.add('VariableValueInput');
			valueInput.type = (outputtype == 'string') ? 'text' : 'number';

			outDiv.appendChild(nameInput);
			outDiv.appendChild(valueInput);
			variableParent.appendChild(outDiv);



			var variableCodec = {
				type: outputtype,
				nameElement: nameInput,
				valueElement: valueInput,
				getName: function () {
					return nameInput.value;
				},
				encode: function () {
					return [valueInput.value];
				},
				decode: function () {

				}
			};
			return variableCodec;
		}
	}

};