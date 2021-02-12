codecs[codecs.length] = {
  decode: (msg,move) => {
    var newstr = "";
	console.log("unoffsetting by " + move);
    for (var i = 0; i < msg.length; i++) {
      newstr += String.fromCharCode(msg.charCodeAt(i) - move);
    }
    return newstr;
  },
  encode: (msg,move) => {
    var newstr = "";
	console.log("offsetting by " + move);
    for (var i = 0; i < msg.length; i++) {
      newstr += String.fromCharCode(msg.charCodeAt(i) + move);
    }
    return newstr;
  },
};