function classDeco(param1, param2) {
  return function <T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
      newProperty = param1;
      hello = param2;
    };
  };
}

function thisUnbinding() {
  return function (target: any, property: any, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;
    descriptor.value = function (...args) {
      originalMethod.apply(this, args);
    };
  };
}

@classDeco("param1", "두비루비루라빠")
class thisBindigTest {
  property = "property";
  hello: string;
  @thisUnbinding()
  test() {
    console.log("test", this);
  }
}
new thisBindigTest().test();
