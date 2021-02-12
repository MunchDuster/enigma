codecs[codecs.length] = {
  decode: (msg, move) => {
    var newstr = "";
    for (var i = 0; i < msg.length; i++) {
      	var num = (i - move) % msg.length;
        num = num < 0 ? msg.length - num : num;
        newstr += msg[num];
    }
    return newstr;
  },
  encode: (msg, move) => {
    var newstr = "";
    for (var i = 0; i < msg.length; i++) {
		var num = (i + move) % msg.length;
   		num = num < 0 ? msg.length - num : num;
    	newstr += msg[num];
    }
    return newstr;
  },
};
