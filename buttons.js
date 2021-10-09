function cleartxt() {
	outputText.innerText = "";
}
function swap() {
	var temp = inputText.innerText;
	inputText.innerText = outputText.innerText;
	outputText.innerText = temp;
}
function copyText() {
	var range = document.createRange();
	range.selectNode(outputText);
	window.getSelection().removeAllRanges(); // clear current selection
	window.getSelection().addRange(range); // to select text
	document.execCommand("copy");
	window.getSelection().removeAllRanges(); // to deselect
}