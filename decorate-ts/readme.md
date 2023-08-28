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

[ ] 생성 선언부에서 파라미터로 넘긴 인자를 데코레이터가 덮어쓰는 이유
