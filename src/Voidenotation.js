export function toFixed(x) {
    if (Math.abs(x) < 1.0) {
      var e = parseInt(x.toString().split('e-')[1]);
      if (e) {
          x *= Math.pow(10,e-1);
          x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
      }
    } 
    else {
      var f = parseInt(x.toString().split('+')[1]);
      if (f > 20) {
          f -= 20;
          x /= Math.pow(10,f);
          x += (new Array(f+1)).join('0');
      }
    }
    return x;
  }
