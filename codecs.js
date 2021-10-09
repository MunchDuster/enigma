const inputText = document.querySelector('.InputText');
const outputText = document.querySelector('.OutputText');

var codecs = {
	'offset': {
		inputs: ['string', 'number'],
		outputs: ['text'],

		encode: ([msg, move]) => {
			if (move == null) move = 1;
			console.log(`Offset message: `);
			console.log(msg);
			var output = "";
			for (var i = 0; i < msg.length; i++) {
				output += String.fromCharCode(msg.charCodeAt(i) + move);
			}
			console.log('Offset output: ', output);
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
	},
	'rotate': {
		inputs: ['string', 'number'],
		outputs: ['string'],
		encode: (msg, move) => {
			var output = "";
			for (var i = 0; i < msg.length; i++) {
				var num = (i + move) % msg.length;
				num = num < 0 ? msg.length + num : num;
				output += msg[num];
			}
			return output;
		},
		decode: (msg, move) => {
			var output = "";
			for (var i = 0; i < msg.length; i++) {
				var num = (i - move) % msg.length;
				num = num < 0 ? msg.length + num : num;
				output += msg[num];
			}
			return output;
		}
	},
	'multiply': {
		inputs: ['string', 'number'],
		outputs: ['string'],
		encode: (msg, move) => {
			var output = "";
			for (var i = 0; i < msg.length; i++) {
				output += String.fromCharCode(msg.charCodeAt(i) * move);
			}
			return output;
		},
		decode: (msg, move) => {
			var output = "";
			for (var i = 0; i < msg.length; i++) {
				output += String.fromCharCode(msg.charCodeAt(i) / move);
			}
			return output;
		}
	},
	'output': {
		inputs: ['string'],
		outputs: [],
		encode: (msg) => {
			console.log(msg);
			outputText.innerText = msg;
		},
		decode: () => { }
	},
	'input': {
		inputs: [],
		outputs: ['string'],
		encode: (empty) => {
			console.log('Input text is ' + inputText.innerText);
			return [inputText.innerText];
		},
		decode: () => { }
	}
};