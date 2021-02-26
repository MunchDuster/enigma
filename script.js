const textarea = document.getElementById("letxt");
const scriptContainer = document.getElementById("scrcont");
const outpt = document.getElementById("outpt");
const ins = Array.from(document.getElementsByClassName("coder"));
const orderIn = Array.from(document.getElementsByClassName("order"))[0];
const footer = document.getElementById("footerboi");
//Setup the clamped
Array.from(document.getElementsByClassName("clamped")).forEach((element) => {
  var warnDiv = document.createElement("div");
  warnDiv.className = "warning";
  warnDiv.innerText =
    "Warning: Outside of bounds (" +
    element.getAttribute("minval") +
    " to " +
    element.getAttribute("maxval") + ").";
	element.addEventListener("input", () => {
		const max = Number(element.getAttribute("maxval"));
		const min = Number(element.getAttribute("minval"));
		const val = eval(element.innerText);
    if (Number.isNaN(val) || val >= min && val <= max) {
      warnDiv.style.display = "none";
    } else {
      warnDiv.style.display = "inline-block";
    }
  });
  element.parentNode.insertBefore(warnDiv, element.nextSibling);
});
//Setup the intOnlys
Array.from(document.getElementsByClassName("intOnly")).forEach((element) => {
	var warnDiv = document.createElement("div");
	warnDiv.className = "warning";
	warnDiv.innerText = "Warning: Input is not integer.";
	element.addEventListener('input', () => {
		var isOk = true;
		for (var i = 0; i < element.innerText.length; i++){
			var code = element.innerText.charCodeAt(i);
			if ((code < 48 || code >= 58) && code != 45) {//must be only 0 to 9 and -
				isOk = false;
				break;
			}
		}
		
		if (isOk) {
			warnDiv.style.display = "none";
		} else {
			warnDiv.style.display = "inline-block";
		}
	});
	element.parentNode.insertBefore(warnDiv, element.nextSibling);
});
//Setup the posOnlys
Array.from(document.getElementsByClassName("posOnly")).forEach((element) => {
	var warnDiv = document.createElement("div");
  warnDiv.className = "warning";
  warnDiv.innerText = "Warning: Input is not positive.";
  element.addEventListener("input", () => {
    if (element.innerText.indexOf('-') == -1) {
      warnDiv.style.display = "none";
    } else {
      warnDiv.style.display = "inline-block";
    }
  });
  element.parentNode.insertBefore(warnDiv, element.nextSibling);
});

//Keep the footer at the bottom of the page
var oriscroll = document.body.scrollHeight;
setInterval(async () => {
	if (document.body.scrollHeight > oriscroll) footer.style.position = 'static';
	else footer.style.position = 'absolute';
},50);
	
//Load all the codecs
var codecs = [];
(async () => {
	for (var i = 0; i < ins.length; i++) {
		var id = newId();
		var script = document.createElement("script");
		script.src = ins[i].getAttribute("funcs");
		script.id = id;
		script.async = false;
		var oldLength = codecs.length;
		scriptContainer.appendChild(script);

		var obj = document.getElementById(id);
		while (oldLength == codecs.length) {
			await wait(50);
		}
		codecs[i].id = ins[i].id;
	}
})();

function swap() {
  var temp = textarea.innerText;
  textarea.innerText = outpt.innerText;
  outpt.innerText = temp;
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function newId() {
  var id = "";
  for (var i = 0; i < 20; i++) {
    id += String.fromCharCode(65 + parseInt(Math.random() * 25));
  }
  return id;
}
function getOrder() {
  var arr = [];
  orderIn.outerText.split("").forEach((e, i) => {
    arr[i] = parseInt(e);
  });
  return arr;
}
function replace(what, withwhat) {
	var escapedFind = what.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  textarea.innerText = textarea.innerText.replace(
    new RegExp(escapedFind, "g"),
    withwhat
  );
}
async function encode() {
	outpt.innerText = "Loading...";
	var msg = textarea.innerText;
	var order = getOrder();
	
  for (var i = 0; i < order.length; i++) {
    msg = codecs[order[i]].encode(
      msg,
      document.getElementById(codecs[order[i]].id).innerText
	  );
  }
  outpt.innerText = msg;
}
async function decode() {
outpt.innerText = "Loading 0%";
	var msg = textarea.innerText;
	var order = getOrder();
  for (var i = order.length - 1; i > -1; i--) {
    msg = codecs[order[i]].decode(
      msg,
      document.getElementById(codecs[order[i]].id).innerText
    );
	outpt.innerText = "Loading " + Math.ceil((i * 100) / (order.length - 1)) + "%";
  }
  outpt.innerText = msg;
}
async function saveset() {
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
    localStorage.setItem("settings", savestuff);
    alert("Saved.");
  } catch (e) {
    alert("Could not save.");
  }
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
	var oldins = localStorage.getItem('settings').split("Object");
	var i=0;
	ins.forEach((ele)=>{
			var arr = oldins[i].split("Splitter");
			if(arr[0] == ele.id){
				ele.innerText = arr[1];
			}
			i++;
		
	});
} catch (e) {//Catch error
  alert("Could not load settings. Please click the Save Settings button to remove this message next time.");
  throw(e);
}