export const LESSONS = {
  "Advanced Type Inference": `// Advanced Type Inference
type Point = { x: number; y: number };
function logPoint(p: Point) {
    console.log(\`\${p.x}, \${p.y}\`);
}
const point = { x: 10, y: 20 };
logPoint(point); // 10, 20
  `,
  Generics: `// Generics
function identity<T>(arg: T): T {
    return arg;
}
const output = identity<string>("myString");
  `,
  "Namespaces & Modules": `// Namespaces
namespace MyNamespace {
    export const myVar: number = 10;
}
// Modules
import * as MyModule from './MyModule';
  `,
  "Interface & Classes": `// Interfaces
interface LabelledValue {
    label: string;
}
// Classes
class Greeter {
    greeting: string;
    constructor(message: string) {
      this.greeting = message;
    }
    greet() {
      return "Hello, " + this.greeting;
    }
}
  `,
  "Type Intersection & Union": `// Intersection
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    // ...
    return result;
}
// Union
function padLeft(value: string, padding: string | number) {
    // ...
}
  `,
  "Type Aliases": `// Type Aliases
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
let name: NameOrResolver = "Alice";
  `,
  "Type Guards": `// Type Guards
function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}
  `,
  "Mapped Types": `// Mapped Types
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
  `,
  "Declaration Merging": `// Declaration Merging
interface Box {
    height: number;
    width: number;
}
interface Box {
    scale: number;
}
let box: Box = { height: 5, width: 6, scale: 10 };
  `,
  Decorators: `// Decorators
function sealed(constructor: Function) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}

@sealed
class Greeter {
    greeting: string;
    constructor(message: string) {
      this.greeting = message;
    }
    greet() {
      return "Hello, " + this.greeting;
    }
}
  `,
};
