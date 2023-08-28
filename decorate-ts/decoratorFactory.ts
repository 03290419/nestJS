function decoFactory(value: string) {
  console.log("데코레이터가 평가됨");
  return function (target: any, propertyKey, descriptor: PropertyDescriptor) {
    console.log(value);
  };
}

class TestClass2 {
  @decoFactory("HELLO")
  test() {
    console.log("함수 호출됨");
  }
}
const t2 = new TestClass2();
// t2.test();
