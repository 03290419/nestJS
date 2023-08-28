function reportableClassDecorator<T extends { new (...args: any[]): {} }>(
  constructor: T
) {
  return class extends constructor {
    reportingURL = "http://www.example.com";
    override = "override";
  };
}

// @reportableClassDecorator
class BugReport {
  override: string;
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}
@reportableClassDecorator
class TestReport {
  override: string;
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

const bug = new BugReport("Needs dark mode");
const test = new TestReport("whatever");
console.log(bug);
console.log(test);

function classDecorator(param1: string, param2: string) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      new_prop = param1;
      first_prop = param2;
    };
  };
}

@classDecorator("안녕하세요", "방가방가")
class containerTestClass {
  first_prop: string;
  constructor(m: string) {
    this.first_prop = m;
  }
}
console.log(new containerTestClass("hi"));
