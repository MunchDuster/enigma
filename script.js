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
/*function getIndicesOf(searchStr, str, caseSensitive) {
  var searchStrLen = searchStr.length;
  if (searchStrLen == 0) {
    return [];
  }
  var startIndex = 0,
    index,
    indices = [];
  if (!caseSensitive) {
    str = str.toLowerCase();
    searchStr = searchStr.toLowerCase();
  }
  while ((index = str.indexOf(searchStr, startIndex)) > -1) {
    indices.push(index);
    startIndex = index + searchStrLen;
  }
  return indices;
}*/
async function encode() {
outpt.innerText = "Loading 0%";
  await updateScripts();
  var msg = textarea.innerText;

  for (var i = 0; i < codecs.length; i++) {
    msg = codecs[i].encode(
      msg,
      document.getElementById(codecs[i].id).innerText
    );
	outpt.innerText = "Loading " + Math.ceil((i * 100) / (codecs.length - 1)) + "%";
  }
  outpt.innerText = msg;
}
async function saveset(){
	try{
	var savestuff = [];
	var i=0;
	Array.from(document.getElementsByClassName("coder")).forEach((ele)=>{
	if(i>0){
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
		
	}catch(e){
		alert("Could not save.");
	}
	
}
async function decode() {
outpt.innerText = "Loading 0%";
  await updateScripts();

  var msg = textarea.innerText;
  for (var i = codecs.length - 1; i > -1; i--) {
    msg = codecs[i].decode(
      msg,
      document.getElementById(codecs[i].id).innerText
    );
	outpt.innerText = "Loading " + Math.ceil((i * 100) / (codecs.length - 1)) + "%";
  }
  outpt.innerText = msg;
}
async function updateScripts() {
	scriptContainer.textContent = "";
  	const ins = Array.from(document.getElementsByClassName("coder"));
  	if (ins != lastIns) {
    	codecs = [];
   		for (var i = 0; i < ins.length; i++) {
    		var id = newId();
			var script = document.createElement("script");
      		script.src = ins[i].getAttribute("funcs");
      		script.id = id;
      		script.async = false;
      		var oldLength = codecs.length;
      		scriptContainer.appendChild(script);

      		var obj = document.getElementById(id);
      		while (oldLength >= codecs.length) {
        		await wait(50);
      		}
      		codecs[i].id = ins[i].id;
		}
		lastIns = ins;
    }
  return null;
}
function newId() {
  var id = "";
  for (var i = 0; i < 20; i++) {
    id += String.fromCharCode(Math.random(65, 90));
  }
  return id;
}
function resizeme(obj){
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
	updateScripts();
	var oldins = localStorage.getItem('settings').split("Object");
	var ins = Array.from(document.getElementsByClassName("coder"));
	var i=0;
	ins.forEach((ele)=>{
			var arr = oldins[i].split("Splitter");
			if(arr[0] == ele.id){
				ele.innerText = arr[1];
			}
			i++;
		
	});
} catch (e) {
  alert("Could not load.");
  throw(e);
}