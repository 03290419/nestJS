# Decorator

데코레이터는 `@expression` 과 같은 형식으로 사용한다.
`expression`은 데커레이팅된 선언에 대한 정보와 함께 런타임에 호출되는 `함수`여야 한다.

```js
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
  // Object.defineProperty() 를 통해 객체 속성을 { writable : true } 로 설정
  public data1 = 0;

  @readonly(true)
  public data2 = 0;
}

const tt = new Test();

tt.data1 = 2333;
tt.data2 = 2323;
```

데코레이터 패턴은 클래스를 수정하지 않고 클래스 멤버들의 정의를 수정 및 기능을 확장할 수 있는 구조적 패턴의 하나이다. 데코레이터 패턴을 사용하면 전체 기능에 신경쓰지 않고 특정 인스턴스에 초점을 맞출 수 있다.

메서드 데코레이터로 사용하기 위해서는 이렇게 정의해야 한다.

- 데코레이터는 `클래스 선언`, `메서드`, `접근자`, `프로퍼티` 또는 `매개변수`에 첨부할 수 있는 특수한 종류의 선언
- 데코레이터 함수에는 `target`, `key`, `descriptor`가 전달 (단, 어떤 멤버를 장식했느냐에 따라 인수가 달라짐)
- 메서드나 클래스 인스턴스가 만들어지는 **_런타임에 실행. 즉, 매번 실행되지 않음._**
- 데코레이터는 클래스 또는 클래스 내부의 `생성자`, `프로퍼티`, `접근자`, `메서드` 그리고 `매개변수`에만 장식될 수 있음

```js
function deco(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  console.log("데코레이터가 평가됨");
}

class TestClass {
  @deco
  test() {
    console.log("함수 호출됨");
  }
}

const t = new TestClass();
t.test();
```

데코레이터에 인수를 넘겨서 데코레이터의 동작을 변경하고 싶다면 데코레이터 팩토리, 즉 데코레이터를 리턴하는 함수를 만들면 된다.

```js
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
t2.test();
```

## 데코레이터 합성

```js
function first() {
  console.log("first(): factory evaluated!");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated!");
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log("second(): called");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {
    console.log("method is called");
  }
}

const e = new ExampleClass();
e.method();
```

각 데코레이터를 사용할 때는

1.  각 데코레이터의 표현은 위에서 아래로 평가된다.
2.  다음 결과는 아래에서 위로 함수로 호출 된다.

## Class Decorator

**클래스 데코레이터는 클래스 선언 직전에 선언**된다.
기존의 클래스 정의를 확장하는 용도로 사용할 수 있다.

클래스 데코레이터 매개변수로는 클래스 생성자 자체를 받는 특징이 있다.

- 클래스 데코레이터 매개변수
  - `argument(constructor)`: 클래스(생성자 함수)가 타입스크립트가 클래스를 실행할 때 클래스 생성자를 데코레이터의 `constructor` 파라미터로 자동 전달하므로, **생성자를 명시적으로 전달하지 않아도 된다.**
- 클래스 데코레이터 리턴값
  - class, void

```js

// 클래스 데코레이터 팩토리
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

```

데코레이터가 클래스 멤버를 확장/수정한 것을 알 수 있다.

```js
// 데코레이터 컨테이너
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
```

🤔 생성 선언부에서 파라미터로 넘긴 인자를 데코레이터가 덮어쓰는 이유

```js
// 프로토타입 확장
function classDecoratorFactoryUsingPrototypeExtend<
  T extends { new (...args: any[]): {} }
>(constructorFn: T) {
  constructorFn.prototype.print2 = function () {
    console.log("this is print2 ");
  };
  constructorFn.prototype.gender = "female";

  return class extends constructorFn {
    public name = "mark";
    public _age = 36;

    constructor(...args: any[]) {
      super(args);
    }

    public print() {
      console.log("this is print");
    }
  };
}

@classDecoratorFactoryUsingPrototypeExtend
class PrototypeExtendClass {}

console.log(new PrototypeExtendClass());
console.log((new PrototypeExtendClass() as any).print());
console.log((new PrototypeExtendClass() as any).print2());
console.log((new PrototypeExtendClass() as any).gender);
```

## Method Decorator

메서드 데코레이터는 메서드 선언 직전에 선언된다. 메서드의 속성 설명자(`PropertyDescriptor`)에 적용되고 메서드의 정의를 읽거나 수정할 수 있다.

❗️[property descriptor](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

선언 파일, 오버로드 메서드, 선언 클래스에 사용할 수 없다.

- 메서드 데코레이터 매개변수
  - `정적(static) 멤버가 속한 생성자 함수`이거나 `인스턴스 멤버에 대한 클래스의 프로토타입`
  - 멤버의 이름
  - 멤버의 속성 설명자 `PrototypeDescriptor`

만약 메서드 데코레이터가 값을 반환한다면 이는 해당 메서드의 속성 설명자가 된다.

세번째 인자 PropertyDescriptor 가 받을 수 있는 타입

```js
interface PropertyDescriptor{
  configurable?: boolean // 속성을 정의할 수 있는지의 여부
  enumerable?: boolean // 열거형인지 여부
  value?: any // 속성 값
  writable?: boolean // 수정 가능 여부
  get?(): any // getter
  set?(v:any): void; // setter
}
```

```js
function HandleError() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(target);
    console.log(propertyKey);
    console.log(descriptor);

    const method = descriptor.value;

    descriptor.value = function (...args: any) {
      try {
        method.apply(this, args);
      } catch (error) {
        console.error(error);
      }
    };
  };
}
class Greeter {
  @HandleError()
  hello() {
    throw new Error("테스트 에러");
  }
}

new Greeter();
new Greeter().hello();
```

장식한 `hello`가 호출될 때 특정 무엇인가를 동작시키고 싶거나, 행동을 제어하고 싶을 경우 재할당한 변수 `method`(`descriptor.value`)를 이용할 수 있다.

이때 `method`를 백업하는 과정에서 `this`를 `apply, call, bind`등으로 바인딩해줘야 한다는 점이다

```js
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
      originalMethod(args);
    };
  };
}

function thisBinding() {
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
```

`thisUnbinding` 데코레이터의 경우 `this` 는 `undefined`로 나타난다.

## Property Decorators

프로퍼티 데코레이터는 프로퍼티 선언 바로 전에 선언 된다. 프로퍼티 데코레이터는 메서드 데코레이터와 다르게 데코레이터 함수에 `Property Descriptor`가 인자로서 제공되지 않는다는 차이가 있다. 단, 프로퍼티 데코레이터도 마찬가지로 `Property Descriptor`형식의 객체를 반환해서 프로퍼티의 설정을 바꿀 수 있다.

- 프로퍼티 데코레이터 매개변수
  - `target`: `static`프로퍼티면 클래스의 생성자 함수, 인스턴스 프로퍼티라면 클래스의 `prototype`객체
  - `decoratorPropertyName`: 해당 `property`의 이름
- 프로퍼티 데코레이터 리턴 값
  - `Property Descriptor`
  - `void`

```js
function propertyDecorator(writable: boolean = true) {
  return function (target: any, decoratorPropertyName: any): any {
    return {
      value: 10,
      writable,
    };
  };
}

class propertyDecoratorTest {
  property = "property";
  @propertyDecorator(false)
  public unRewritable = 0;
  @propertyDecorator()
  public reWritable = 203;
}

console.log(new propertyDecoratorTest().unRewritable);
new propertyDecoratorTest().unRewritable = 2;
console.log(new propertyDecoratorTest().reWritable);
new propertyDecoratorTest().reWritable = 222;
```
