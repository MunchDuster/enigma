const inputText = document.querySelector('.InputText');
const outputText = document.querySelector('.OutputText');
const variableParent = document.querySelector('.VariableParent');

console.log('running codecs');
var codecs = {
	'offset': {
		new: function () {
			return {
				inputs: ['string', 'number'],
				outputs: ['string'],
				getName: function () {
					return 'offset';
				},
				encode: ([msg, move]) => {
					console.log(`Offset input ${msg} and ${typeof move}`);
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
		}
	},
	'rotate': {
		new: function () {
			return {
				inputs: ['string', 'number'],
				outputs: ['string'],
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
		}
	},
	'multiply': {
		new: function () {
			return {
				inputs: ['string', 'number'],
				outputs: ['string'],
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
		}
	},
	'output': {
		new: function () {
			return {
				inputs: ['string'],
				outputs: [],
				getName: function () {
					return 'output';
				},
				encode: ([msg]) => {
					outputText.innerText = msg;
				},
				decode: () => {
					return [inputText.innerText];
				}
			};
		}
	},
	'input': {
		new: function () {
			return {
				inputs: [],
				outputs: ['string'],
				getName: function () {
					return 'input';
				},
				encode: () => {
					return [inputText.innerText];
				},
				decode: ([msg]) => {
					outputText.innerText = msg;
				}
			};
		}
	},
	'variable': {
		isEven: true,
		new: function (outputtype) {
			//make the elements to control the codec
			var outDiv = document.createElement('div');
			if (this.isEven) outDiv.classList.add('even');
			else outDiv.classList.add('odd');
			this.isEven = !this.isEven;

			var nameInput = document.createElement('input');
			nameInput.classList.add('VariableNameInput');
			nameInput.addEventListener('input', function () { if (renderCanvas != null) renderCanvas(); });
			nameInput.type = 'text';

			var nameLabel = document.createElement('label');
			nameLabel.innerText = 'Name';

			var valueInput = document.createElement('input');
			valueInput.classList.add('VariableValueInput');
			valueInput.type = (outputtype == 'text') ? 'text' : 'number';

			var valueLabel = document.createElement('label');
			valueLabel.innerText = 'Value';

			outDiv.appendChild(nameLabel);
			outDiv.appendChild(nameInput);
			outDiv.appendChild(valueLabel);
			outDiv.appendChild(valueInput);

			variableParent.appendChild(outDiv);

			return {
				inputs: [],
				outputs: [outputtype],
				type: outputtype,
				getName: function () { return nameInput.value; },
				encode: function () { return [outputtype == 'string' ? valueInput.value : parseInt(valueInput.value)]; },
				decode: function () { }
			};
		}
	},
	'random': {
		new: function (outputtype) {
			return {
				inputs: ['string',],
				outputs: ['string'],
				getName: function () { return 'random'; },
				encode: function ([msg, seed]) {
					if (seed == null) seed = 0;
					var newstr = "";
					var m = new MersenneTwister(parseInt(seed));
					//add noise to message
					for (var i = 0; i < msg.length; i++) {
						var randomNumber = Math.floor(m.random() * 6);

						for (var k = 0; k < randomNumber; k++) {
							newstr += String.fromCharCode(32 + Math.ceil(Math.random() * 94));
						}
						newstr += msg[i];
					}
					return [newstr];
				},
				decode: function ([msg, seed]) {
					var newstr = "";
					var m = new MersenneTwister(parseInt(seed));
					if (parseInt(seed) == 0) {
						return msg;
					}
					var j = 0;
					//skip through noise
					for (var i = 0; i < msg.length; i++) {
						j += Math.floor(m.random() * 6);
						if (msg[i + j] == undefined) {
							return newstr;
						}
						newstr += msg[i + j];
					}
					return [newstr];
				}
			};
		}
	}
};