export class Duration {
  constructor(value) {
    this.value = value;
  }

  // Dotted, double-dotted, and triple-dotted variants.
  //
  // -> Duration
  get d() { return new Duration(this.value * 1.5); }   // 1 1/2 notes
  get dd() { return new Duration(this.value * 1.75); } // 1 3/4 notes
  get ddd() { return new Duration(this.value * 1.875); } // 1 7/8 notes

  // Duration -> Boolean
  gt(that) {
    return this.value > that.value;
  }

  // Duration -> Duration
  minus(that) {
    return new Duration(this.value - that.value)
  }
}

// Duration
export const thirtySecond = new Duration(1);
export const sixteenth    = new Duration(2);
export const eighth       = new Duration(4);
export const quarter      = new Duration(8);
export const half         = new Duration(16);
export const whole        = new Duration(32);

// String -> Or(Duration, Undefined)
export function parse(str) {
  switch(str.toLowerCase()) {
    case "w"     : return whole;
    case "h"     : return half;
    case "q"     : return quarter;
    case "e"     : return eighth;
    case "s"     : return sixteenth;
    case "t"     : return thirtySecond;
    case "w.d"   : return whole.d;
    case "h.d"   : return half.d;
    case "q.d"   : return quarter.d;
    case "e.d"   : return eighth.d;
    case "s.d"   : return sixteenth.d;
    case "t.d"   : return thirtySecond.d;
    case "w.dd"  : return whole.dd;
    case "h.dd"  : return half.dd;
    case "q.dd"  : return quarter.dd;
    case "e.dd"  : return eighth.dd;
    case "s.dd"  : return sixteenth.dd;
    case "t.dd"  : return thirtySecond.dd;
    case "w.ddd" : return whole.ddd;
    case "h.ddd" : return half.ddd;
    case "q.ddd" : return quarter.ddd;
    case "e.ddd" : return eighth.ddd;
    case "s.ddd" : return sixteenth.ddd;
    case "t.ddd" : return thirtySecond.ddd;
    default      : return undefined;
  }
}
