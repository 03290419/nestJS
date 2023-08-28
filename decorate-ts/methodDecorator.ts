function methodDecorator() {
  return function (
    target: any,
    property: string,
    descriptor: PropertyDescriptor
  ) {
    let originalMethod = descriptor.value;
    descriptor.value = function (...args: any) {
      console.log("before");
      originalMethod.apply(this, args);
      console.log("after");
    };
  };
}

// class TTest {
//   property = "property";
//   hello: string;

//   constructor(m: string) {
//     this.hello = m;
//   }
//   @methodDecorator()
//   test() {
//     console.log("test");
//   }
// }

// new TTest("world").test();

function methodDecoratorLogingExample() {
  return function (
    target: any,
    property: string,
    descriptor: PropertyDescriptor
  ) {
    let originalMethod = descriptor.value;
    descriptor.value = function (...args: any) {
      let startTs = new Date().getTime();
      originalMethod.apply(this, args);
      console.log(args);

      let endTs = new Date().getTime();
      console.log(`실행시간: ${(endTs - startTs) / 1000}S`);
    };
  };
}
class TTest {
  property = "property";
  hello: string;

  constructor(m: string) {
    this.hello = m;
  }
  @methodDecoratorLogingExample()
  test(args) {
    console.log("test");
  }
}

new TTest("world").test("인수는여기에 넣음되는지 여기겠군용");
console.log(new TTest("world").hello);
