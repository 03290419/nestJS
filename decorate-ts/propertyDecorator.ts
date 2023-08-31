// function propertyDecorator(writable: boolean = true) {
//   return function (target: any, decoratorPropertyName: any): any {
//     return {
//       value: 10,
//       writable,
//     };
//   };
// }

// class propertyDecoratorTest {
//   property = "property";
//   @propertyDecorator(false)
//   public unRewritable = 0;
//   @propertyDecorator()
//   public reWritable = 203;
// }

// console.log(new propertyDecoratorTest().unRewritable);
// new propertyDecoratorTest().unRewritable = 2;
// console.log(new propertyDecoratorTest().reWritable);
// new propertyDecoratorTest().reWritable = 222;

function SetDefaultValue(numberA: number, numberB: number) {
  return (target: any, propertyKey: string) => {
    const addableNumber = numberA * numberB;
    let value = 0;

    Object.defineProperty(target, propertyKey, {
      get() {
        return value + addableNumber;
      },
      set(newValue: any) {
        value = newValue - 30;
      },
    });
  };
}

class DataDefaultType {
  @SetDefaultValue(10, 20)
  num: number = 0;
}
const dataDefaultType = new DataDefaultType();
console.log(
  `num is ${(dataDefaultType.num = 30)}, 결과 :${dataDefaultType.num}`
);
console.log(
  `num is ${(dataDefaultType.num = 130)}, 결과 :${dataDefaultType.num}`
);
