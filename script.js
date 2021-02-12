const textarea = document.getElementById("letxt");
const scriptContainer = document.getElementById("scrcont");
const outpt = document.getElementById("outpt");

var codecs;
function cleartxt() {
  textarea.innerText = "";
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
async function encode() {
  await updateScripts();
  var msg = textarea.innerText;

  for (var i = 0; i < codecs.length; i++) {
    msg = codecs[i].encode(
      msg,
      Number(document.getElementById(codecs[i].id).innerText)
    );
	console.log(Math.ceil(((i + 1) * 100) / (codecs.length + 1)));
	outpt.innerText = "Loading " + Math.ceil(i * 100 / (codecs.length - 1)) + "%";
  }
  outpt.innerText = msg;
}
async function decode() {
  await updateScripts();

  var msg = textarea.innerText;
  for (var i = codecs.length - 1; i > -1; i--) {
    msg = codecs[i].decode(
      msg,
      Number(document.getElementById(codecs[i].id).innerText)
    );
  }
  outpt.innerText = msg;
}
async function updateScripts() {
  outpt.innerText = "Loading 0%";
  scriptContainer.textContent = "";
  codecs = [];
  const ins = Array.from(document.getElementsByClassName("coder"));

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