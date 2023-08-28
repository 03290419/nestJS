function readonly(writable: boolean) {
  return function (target: any, decoratedPropertyName: any): any {
    return {
      writable: !writable,
    };
  };
}

class Test {
  property = "property";

  @readonly(false)
  public data1 = 0;

  @readonly(true)
  public data2 = 0;
}

const tt = new Test();

tt.data1 = 2333;
tt.data2 = 2323;
