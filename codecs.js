const inputText = document.querySelector('.InputText');
const outputText = document.querySelector('.OutputText');
const variableParent = document.querySelector('.VariableParent');

// multi codec vars
var vars = {
	isEven: true
};

// each codec is an object so that the constructors can have their own static vars
var codecs = {
	'add': {
		meta: {
			group: 'modifier',
		},
		new: function () {
			return {

				inputs: [
					{ type: 'chars', name: 'chars to add to' },
					{ type: 'numberlist', name: 'add amounts' }
				],
				outputs: [
					{ type: 'chars', name: 'output' }
				],
				getName: function () {
					return 'offset';
				},
				encode: ([chars, amts]) => {
					if (amts == null) amts = [1];
					for (var i = 0; i < chars.length; i++) {
						chars[i] += amts[i % amts.length];
					}
					return [chars];
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
		meta: {
			group: 'modifier',
		},
		new: function () {
			return {
				group: 'modifier',
				inputs: [
					{ type: 'chars', name: 'chars to rotate' },
					{ type: 'number', name: 'rotate amount' }
				],
				outputs: [
					{ type: 'chars', name: 'output' }
				],
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
		meta: {
			group: 'modifier',
		},
		new: function () {
			return {
				group: 'modifier',
				inputs: [
					{ type: 'chars', name: 'chars to multiply' },
					{ type: 'number', name: 'multiplier' }

				],
				outputs: [
					{ type: 'chars', name: 'result' }
				],
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
		meta: {
			group: 'static',
			info: 'sets output text'
		},
		new: function () {
			return {
				inputs: [
					{ type: 'string', name: 'output' }
				],
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
		meta: {
			group: 'static',
			info: 'get the input text'
		},
		new: function () {
			return {
				inputs: [],
				outputs: [
					{ type: 'string', name: 'input' }
				],
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
	'variable string': {
		meta: {
			group: 'variable',
			info: 'send text to connection'
		},
		varNo: 1,
		new: function () {
			function makeElements(codec) {
				//make the elements to control the codec
				var outDiv = document.createElement('div');
				if (this.isEven) outDiv.classList.add('even');
				else outDiv.classList.add('odd');
				this.isEven = !this.isEven;

				var nameInput = document.createElement('input');
				nameInput.classList.add('VariableNameInput');
				nameInput.addEventListener('input', function () { if (renderCanvas != null) renderCanvas(); });
				nameInput.type = 'text';
				nameInput.value = `Var ${codec.varNo++}`;
				var nameLabel = document.createElement('label');
				nameLabel.innerText = 'Name';

				var valueInput = document.createElement('input');
				valueInput.classList.add('VariableValueInput');
				valueInput.type = 'text';
				valueInput.value = 'beans';

				var valueLabel = document.createElement('label');
				valueLabel.innerText = 'Max';

				outDiv.appendChild(nameLabel);
				outDiv.appendChild(nameInput);
				outDiv.appendChild(valueLabel);
				outDiv.appendChild(valueInput);

				variableParent.appendChild(outDiv);

				return { nameInput, valueInput };
			}
			var { outDiv, nameInput, valueInput } = makeElements(this);
			return {
				inputs: [],
				outputs: [
					{ type: 'string', name: 'value' }
				],
				type: 'string',
				getName: function () { return nameInput.value; },
				encode: function () { return [valueInput.value]; },
				decode: function () { },
				delete: function () {
					outDiv.parentElement.removeChild(outDiv);
				}
			};
		}
	},
	'variable number': {
		meta: {
			group: 'variable',
			info: 'sends number to connection'
		},
		varNo: 1,
		new: function () {
			function makeElements(codec) {
				//make the elements to control the codec
				var outDiv = document.createElement('div');
				if (this.isEven) outDiv.classList.add('even');
				else outDiv.classList.add('odd');
				this.isEven = !this.isEven;

				var nameInput = document.createElement('input');
				nameInput.classList.add('VariableNameInput');
				nameInput.addEventListener('input', function () { if (renderCanvas != null) renderCanvas(); });
				nameInput.type = 'text';
				nameInput.value = `Var ${codec.varNo++}`;
				var nameLabel = document.createElement('label');
				nameLabel.innerText = 'Name';

				var valueInput = document.createElement('input');
				valueInput.classList.add('VariableValueInput');
				valueInput.type = 'number';
				valueInput.value = 'beans';

				var valueLabel = document.createElement('label');
				valueLabel.innerText = 'Value';

				outDiv.appendChild(nameLabel);
				outDiv.appendChild(nameInput);
				outDiv.appendChild(valueLabel);
				outDiv.appendChild(valueInput);

				variableParent.appendChild(outDiv);

				return { outDiv, nameInput, valueInput };
			}
			var { outDiv, nameInput, valueInput } = makeElements(this);
			return {
				inputs: [],
				outputs: [
					{ type: 'number', name: 'value' }
				],
				type: 'number',
				getName: function () { return nameInput.value; },
				encode: function () { return [parseInt(valueInput.value)]; },
				decode: function () { },
				delete: () => {
					outDiv.parentElement.removeChild(outDiv);
				}
			};
		}
	},
	'random number': {
		meta: {
			group: 'variable',
			info: 'generates x random numbers'
		},
		varNo: 1,
		new: function () {
			function makeElements(codec) {
				//make the elements to control the codec
				var outDiv = document.createElement('div');
				if (this.isEven) outDiv.classList.add('even');
				else outDiv.classList.add('odd');
				this.isEven = !this.isEven;

				var nameInput = document.createElement('input');
				nameInput.classList.add('VariableNameInput');
				nameInput.addEventListener('input', function () { if (renderCanvas != null) renderCanvas(); });
				nameInput.type = 'text';
				nameInput.value = `RNG ${codec.varNo++}`;

				var nameLabel = document.createElement('label');
				nameLabel.innerText = 'Name';

				var minInput = document.createElement('input');
				minInput.classList.add('VariableValueInput');
				minInput.type = 'number';
				minInput.value = 1;

				var minLabel = document.createElement('label');
				minLabel.innerText = 'Min';

				var maxInput = document.createElement('input');
				maxInput.classList.add('VariableValueInput');
				maxInput.type = 'number';
				maxInput.value = 4;

				var maxLabel = document.createElement('label');
				maxLabel.innerText = 'Max';

				outDiv.appendChild(nameLabel);
				outDiv.appendChild(nameInput);

				outDiv.appendChild(minLabel);
				outDiv.appendChild(minInput);

				outDiv.appendChild(maxLabel);
				outDiv.appendChild(maxInput);

				variableParent.appendChild(outDiv);

				return { outDiv: outDiv, nameInput: nameInput, maxInput: maxInput, minInput: minInput };
			}
			var { outDiv, nameInput, maxInput, minInput } = makeElements(this);

			return {
				inputs: [
					{ type: 'number', name: 'seed' },
					{ type: 'number', name: 'how many numbers to generate' },
				],
				outputs: [
					{ type: 'numberlist', name: 'random number' }
				],
				getName: function () { return nameInput.value; },
				encode: function ([seed, amount]) {
					if (seed == null) seed = 0;
					if (amount == null) amount = 1;
					var generator = new MersenneTwister(seed);
					// //add noise to message
					// for (var i = 0; i < msg.length; i++) {
					// 	var randomNumber = Math.floor(m.random() * 6);

					// 	for (var k = 0; k < randomNumber; k++) {
					// 		newstr += String.fromCharCode(32 + Math.ceil(Math.random() * 94));
					// 	}
					// 	newstr += msg[i];
					// }
					var numbers = [];
					var max = maxInput.value, min = minInput.value;
					for (var i = 0; i < amount; i++) {
						numbers.push(Math.floor(generator.random() * (max - min) + min));
					}
					return [numbers];
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
				},
				delete: function () {
					outDiv.parentElement.removeChild(outDiv);
				}
			};
		}
	},
	'random character': {
		meta: {
			group: 'variable',
			info: 'generates x random characters'
		},
		new: function () {
			return {

				inputs: [
					{ type: 'number', name: 'seed' },
					{ type: 'number', name: 'how many to generate' },
				],
				outputs: [
					{ type: 'chars', name: 'random characters' }
				],
				getName: function () { return 'Random char' },
				encode: function ([seed, amount]) {
					var m = new MersenneTwister(seed);
					var chars = [];
					for (var i = 0; i < amount; i++) {
						var randomNumber = m.random() * 200,
							charCode = randomNumber + 48;
						chars.push(charCode);
					}
					return [chars];
				},
				decode: function () { }
			};
		}
	},
	'text to chars': {
		meta: {
			group: 'converter',
			info: 'converts text to chars'
		},
		new: function () {
			return {

				inputs: [
					{ type: 'string', name: 'string to convert' }
				],
				outputs: [
					{ type: 'chars', name: 'coverted chars' }
				],
				getName: function () { return 'Text2Chars' },
				encode: function ([msg]) {
					var chars = [];
					for (var i = 0; i < msg.length; i++) {
						chars.push(msg.charCodeAt(i));
					}
					return [chars];
				},
				decode: function () { }
			};
		}
	},
	'chars to text': {
		meta: {
			group: 'converter',
			info: 'converts chars to text'
		},
		new: function () {
			return {
				inputs: [
					{ type: 'chars', name: 'chars to become text' },
				],
				outputs: [
					{ type: 'string', name: 'output text' }
				],
				getName: function () { return 'CharsToText' },
				encode: function ([chars]) {
					var str = '';
					for (var i = 0; i < chars.length; i++) {
						str += String.fromCharCode(chars[i]);
					}
					return [str];
				},
				decode: function () { }
			};
		}
	},
	'merge chars': {
		meta: {
			group: 'joiners and splitters',
			info: 'combine two chars inputs'
		},
		new: function () {
			return {
				inputs: [
					{ type: 'chars', name: 'chars1' },
					{ type: 'chars', name: 'chars2' },
					{ type: 'number', name: 'chunks' }
				],
				outputs: [
					{ type: 'chars', name: 'outputs chars' }
				],
				getName: function () { return 'MergeChars' },
				encode: function ([chars1, chars2, chunks]) {
					if (chunks == null) chunks = 1;
					var mergedChars = [];
					var chunkNo = 0;
					var i;
					while (chars1.length > 0 ?? chars2.length > 0) {
						for (i = 0; i < chars1.length && i < chunks[chunkNo]; i++) {
							mergedChars.push(chars1[i]);
						}
						chars1.splice(0, i);
						chunkNo++;

						for (i = 0; i < chars2.length && i < chunks[chunkNo]; i++) {
							mergedChars.push(chars2[i]);
						}
						chars2.splice(0, i);
						chunkNo++;
					}
					return [mergedChars];
				},
				decode: function () { }
			};
		}
	},
	'text length': {
		meta: {
			group: 'extractors',
			info: 'get the number of chars in text'
		},
		new: function () {
			return {
				inputs: [
					{ type: 'string', name: 'text' }
				],
				outputs: [
					{ type: 'number', name: 'length' }
				],
				getName: function () { return 'text length'; },
				encode: function ([txt]) { return [txt.length]; },
				decode: function () { }
			};
		}
	},
	'number list item': {
		meta: {
			group: 'extractors',
			info: 'get item from numberlist'
		},
		new: function () {
			return {
				inputs: [
					{ type: 'numberlist', name: 'list to pick number from' },
					{ type: 'number', name: 'number' }
				],
				outputs: [
					{ type: 'number', name: 'number chosen' }
				],
				getName: function () { return 'number list item' },
				encode: function ([list, index]) {
					if (index == null) index = 0;
					return [list[index]];
				},
				decode: function ([]) { return []; }
			};
		}
	},
	'number to list': {
		meta: {
			group: 'converter',
			info: 'converts a number to a list'
		},
		new: function () {
			return {
				inputs: [
					{ type: 'number', name: 'input' }
				],
				outputs: [
					{ type: 'numberlist', name: 'output' }
				],
				getName: function () { return 'number to list' },
				encode: function ([num]) { return [[num]]; },
				decode: function ([]) { return []; }
			};
		}
	},
};