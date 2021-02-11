const textarea = document.getElementById("letxt");
		const scriptContainer = document.getElementById("scrcont");
		const outpt = document.getElementById("outpt");

		var codecs;
		function clear(){
			textarea.value = '';
			outpt.innerText = '';
		}
		function swap(){
			var temp = textarea.value;
			textarea.value = outpt.innerText;
			outpt.innerText = temp;
		}
		function wait(ms) {
			return new Promise(resolve => setTimeout(resolve, ms));
		}
		async function encode() {
			await updateScripts();
			var msg = textarea.value;
			
			for (var i = 0; i < codecs.length; i++) {
				
				msg = codecs[i].encode(msg, Number(document.getElementById(codecs[i].id).value));
			}
			outpt.innerText = msg;
		}
		async function decode() {
				await updateScripts();

				var msg = textarea.value;
				for (var i = codecs.length - 1; i > -1; i--) {
					msg = codecs[i].decode(msg, Number(document.getElementById(codecs[i].id).value));
				}
				outpt.innerText = msg;
			}
		async function updateScripts(){
			outpt.innerText = 'Loading...';
			scriptContainer.textContent = '';
			codecs = [];
			const ins = Array.from(document.getElementsByClassName("coder"));
			
			for(var i=0;i<ins.length;i++){
				var id = newId();
				var script = document.createElement("script");
				script.src = ins[i].getAttribute("funcs");
				script.id = id;
				script.async = false;
				var oldLength = codecs.length;
				scriptContainer.appendChild(script);
				
				var obj =  document.getElementById(id);
				while(oldLength >= codecs.length){
					await wait(50);
				}
				codecs[i].id = ins[i].id;
			}
			return null;
		}
		function newId(){
			var id = '';
			for(var i=0;i<20;i++){
				id += String.fromCharCode((Math.random(65, 90)));
			}
			return id;
		}
		