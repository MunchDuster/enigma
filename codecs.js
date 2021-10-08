const inputText = document.querySelector('.InputText');
const outputText = document.querySelector('.OutputText');

var codecs = [
	{
		name: 'offset',
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
	{
		name: 'rotate',
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
	{
		name: 'multiply',
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
	{
		name: 'setOutput',
		encode: (msg) => { console.log(msg); outputText.innerText = msg; },
		decode: () => { }
	},
	{
		name: 'getInput',
		encode: () => { console.log('Input text is ' + inputText.innerText); return [inputText.innerText]; },
		decode: () => { }
	}


];


function getCodecFromName(name) {
	for (var i = 0; i < codecs.length; i++) {
		if (codecs[i].name == name) {
			console.log("codec found");
			return codecs[i];
		}
	}
	console.log("No codec found: " + name);
	return null;
}