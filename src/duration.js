class Duration {
  constructor(value) {
    this.value = value;
  }

  dotted() {
    return new Duration(this.value * 1.5);   // 1 1/2 notes
  }

  doubleDotted() {
    return new Duration(this.value * 1.75);  // 1 3/4 notes
  }

  tripleDotted() {
    return new Duration(this.value * 1.875); // 1 7/8 notes
  }

  millis(tempo) {
    return (this.value / 32.0) * (120.0 / tempo) * 2000
  }

  gt(that) {
    return this.value > that.value;
  }

  minus(that) {
    return new Duration(this.value - that.value)
  }
}

const durations = {
  thirtySecond : new Duration(1),
  sixteenth    : new Duration(2),
  eighth       : new Duration(4),
  quarter      : new Duration(8),
  half         : new Duration(16),
  whole        : new Duration(32)
};

const defaultDuration = durations.quarter;

function parse(str) {
  switch(str.toLowerCase()) {
    case "1"     : return durations.whole;
    case "2"     : return durations.half;
    case "4"     : return durations.quarter;
    case "8"     : return durations.eighth;
    case "16"    : return durations.sixteenth;
    case "32"    : return durations.thirtySecond;
    case "1d"    : return durations.whole.dotted();
    case "2d"    : return durations.half.dotted();
    case "4d"    : return durations.quarter.dotted();
    case "8d"    : return durations.eighth.dotted();
    case "16d"   : return durations.sixteenth.dotted();
    case "32d"   : return durations.thirtySecond.dotted();
    case "1dd"   : return durations.whole.doubleDotted();
    case "2dd"   : return durations.half.doubleDotted();
    case "4dd"   : return durations.quarter.doubleDotted();
    case "8dd"   : return durations.eighth.doubleDotted();
    case "16dd"  : return durations.sixteenth.doubleDotted();
    case "32dd"  : return durations.thirtySecond.doubleDotted();
    case "1ddd"  : return durations.whole.tripleDotted();
    case "2ddd"  : return durations.half.tripleDotted();
    case "4ddd"  : return durations.quarter.tripleDotted();
    case "8ddd"  : return durations.eighth.tripleDotted();
    case "16ddd" : return durations.sixteenth.tripleDotted();
    case "32ddd" : return durations.thirtySecond.tripleDotted();
    default      : return undefined;
  }
}

export {
  durations,
  parse,
  defaultDuration as default
};