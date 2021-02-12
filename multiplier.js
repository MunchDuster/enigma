codecs[codecs.length] = {
  decode: (msg,move) => {
    var newstr = "";
    for (var i = 0; i < msg.length; i++) {
      newstr += String.fromCharCode(
        msg.charCodeAt(i) / parseInt(eval(move.replace("chr", i)))
      );
    }
    return newstr;
  },
  encode: (msg,move) => {
    var newstr = "";
    for (var i = 0; i < msg.length; i++) {
      newstr += String.fromCharCode(
        msg.charCodeAt(i) * parseInt(eval(move.replace("chr", i)))
      );
    }
    return newstr;
  },
};