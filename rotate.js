codecs[codecs.length] = {
  decode: (msg, move) => {
    var newstr = "";
    for (var i = 0; i < msg.length; i++) {
      newstr += msg[i - move % msg.length];
    }
    return newstr;
  },
  encode: (msg, move) => {
    var newstr = "";

    for (var i = 0; i < msg.length; i++) {
      newstr += msg[(i + move) % msg.length];
    }
    return newstr;
  },
};
