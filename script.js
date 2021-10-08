const textarea = document.getElementById("letxt");
const scriptContainer = document.getElementById("scrcont");
const outpt = document.getElementById("outpt");

var lastIns = [];
var codecs;
function cleartxt() {
	outpt.innerText = "";
}
function swap() {
	var temp = textarea.innerText;
	textarea.innerText = outpt.innerText;
	outpt.innerText = temp;
}
function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
function saveset() {
	try {
		var savestuff = [];
		var i = 0;
		Array.from(document.getElementsByClassName("coder")).forEach((ele) => {
			if (i > 0) {
				savestuff += "Object";
			}
			savestuff += ele.id + "Splitter" + ele.innerText;
			i++;
		});
		localStorage.setItem(
			"settings",
			savestuff
		);
		alert("Saved.");

	} catch (e) {
		alert("Could not save.");
	}

}
function newId() {
	var id = "";
	for (var i = 0; i < 20; i++) {
		id += String.fromCharCode(Math.random(65, 90));
	}
	return id;
}
function resizeme(obj) {
	//obj.style.height = obj.scrollHeight;
}
async function copyText() {
	/* Get the text field */
	var range = document.createRange();
	range.selectNode(outpt);
	window.getSelection().removeAllRanges(); // clear current selection
	window.getSelection().addRange(range); // to select text
	document.execCommand("copy");
	window.getSelection().removeAllRanges(); // to deselect

	/* Alert the copied text */
}
//try to load saved setup
try {
	var savedInput = localStorage.getItem("input");
	var savedEncryptionMap = localStorage.getItem("encryption map");

	//setEncryptionMap(savedEncryptionMap)
} catch (e) {
	//alert("Could not load.");
}