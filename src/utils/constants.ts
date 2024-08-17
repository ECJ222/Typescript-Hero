export const LESSONS = {
  'Advanced Type Inference': `
/*
* Advanced type inference refers to the typing system of TypeScript
* where it can detect types at compile time in order to prevent compile-time errors.
* For example: Did you know types could be detected all the way at the object level? 😉
*/

interface Data {
  a: string;
  b: number;
  c?: unknown;
}

function example(data: Data) {
  console.log(data);
}

example({}); // ❌ TypeScript will fail at compile time.`,
  Generics: `
/*
* You can think of generics like that extroverted friend you know can get along well with just about anyone.
* In TypeScript, Generics eliminate the need for the compiler to explicitly provide type inference.
* The keyword <T> in the code below is a generic type parameter, used to infer the type of the arg parameter.
* This means arg can be of any type and the compiler will understand the type passed to the function.
*/
  
function identity<T>(arg: T): T {
  return arg;
}
const output = identity<string>("myString");   
`,
  'Namespaces & Modules': `
/*
* Namespaces 🏘️: It's a useful tool for organizing code into logical units, be it functions, classes, variables, etc.
* You can group all of them by name and access them using that name.
* The export keyword is a way of letting the compiler know that both the namespace
* and specific properties can be accessible outside of the namespace.
*/

namespace MyNamespace {
    export const myVar: number = 10;
}

/*
* Modules: It's a way of organizing related code and using it in different files and directories.
* There are two types of modules - Internal Modules (these are namespaces) and External Modules.
* An external module is the code you see below and is used along with the export keyword
* to be accessible outside of the module.
*/

// file1.ts
export const number = 2

export const getNothing = () => {
  return 'nothing'
}

// file2.ts
import * as MyModule from './MyModule';
console.log(MyModule.number) // 2.
console.log(MyModule.getNothing()) // nothing.

// file3.ts
import { number, getNothing } from './MyModule';
console.log(number) // 2.
console.log(getNothing()) // nothing.
`,
  'Interface & Classes': `
// Interface 🎭: It's a way of naming a structure with the types it possesses.
interface Image {
  filename: string;
  data: string;
  size_in_bytes: number;
}

/**
* Notice that the interface is used to ensure the form conforms to the expected structure in Image?
* The Image interface requires the presence of filename, data, and size_in_bytes property.
* If this requirement is fulfilled, the image data will be allowed in this function; otherwise, the compiler will not allow it.
* TypeScript focuses on type checking, ensuring that values conform to a specific shape.
* This is known as Duck typing or Structural subtyping. This means that when we pass a FormData type,
* TypeScript sees it as { filename: string, data: string, size_in_bytes: number }. Interfaces serve as a way to name and hold this structural subtype.
*/

function upload(image: Image) {
  // uploading...
}

upload({}) // ❌ Property 'filename', 'data', and 'size_in_bytes' is missing in type '{}' but required in type 'Image'.

/**
* Classes 🏫: A class represents a blueprint of an object, defining all the necessary properties and methods it should have.
* In TypeScript, you can define the specific types a class must follow, as shown in the example below.
*/

class Greeter {
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    return "Hello, " + this.greeting;
  }
}

/**
* Like in C# and Java, you can also define a structure that a class must follow.
* In TypeScript, we can do this by using interfaces.
*/

interface CarType {
 brand: string;
 model: string;
 drive: () => void;
}

class Car implements CarType {
 brand: string = "camry";
 model: string = "2023";
 
 constructor(brand: string, model: string) {
   this.brand = brand;
   this.model = model;
 }

 drive() {
  // Do nothing.
 }
}

const car = new Car("toyota", "2023");
car.drive();
`,
  'Type Intersection & Union': `
/*
* Type Intersection 🪡: This topic is already somewhat self-explanatory as the name suggests.
* It's a combination of two or more types.
* The function below expects to return a value that combines the types T and U.
*/
function extend<T, U>(first: T, second: U): T & U {
    let result = {} as T & U;.
    return result;
}

/*
* Union Types 🤝: Union types represent values that can be one of several different types.
* In the example below, the padLeft function takes a parameter called padding.
* Notice, the type of the padding parameter is string | number, which is a union type.
* This means padding can either be a string or number.
*/

function padLeft(value: string, padding: string | number) {
  // Implementation based on the type of padding.
  if (typeof padding === "number") {
      // Handle as a number
  } else {
      // Handle as a string
  }
}
`,
  'Type Aliases': `
/*
* Type Aliases 🦹‍♂️: It's similar to interfaces but they can be used to name any type.
* For example: Tuples, primitives, unions, etc.
* They are just a way to provide another name for a type, hence the name Type aliases.
*/
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
const name: NameOrResolver = "Alice";
`,
  'Type Guards': `
/*
* Type Guards 💂‍♂️: Type guards are a way to narrow down the types of variables within TypeScript.
* Here is a list of different types of type guards that can be used in TypeScript:
* - typeof: Used to check the type of a variable (e.g., string, number).
* - instanceof: Used to check if a variable is an instance of a class.
* - in: Used to check if a property exists within an object.
* - is: Used to define custom type guards.
* 
* Below is an example of a custom type guard using the is keyword.
*/

interface Fish {
  specie: string;
  swim: () => void;
}
interface Bird {
  specie: string;
  fly: () => void;
}

function isFish(pet: Fish | Bird): pet is Fish {
    return (pet as Fish).swim !== undefined;
}

const fish: Fish =  {
  specie: 'tilapia',
  swim: () => {},
}
const bird: Bird =  {
  specie: 'Crow',
  fly: () => {},
}
console.log(isFish(fish)) // true
console.log(isFish(bird)) // false
`,
  'Mapped Types': `
/*
* Mapped Types 🗺️: Mapped types are very cool 🤭.
* They can be used for modifying existing object types in several ways:
* - Making object properties readonly.
* - Making object properties optional.
* - Excluding object properties.
* - Changing the types of object properties.
* - Conditionally using types for properties based on a specific condition.
* 
* Mapped types iteratively traverse an object. When the keyof keyword is used, it gets the keys of an object.
* This allows for the modification of property values, as seen in the example below.
* 
* In the code below, the Animal interface is modified to become readonly.
* Any values that possess this Readonly<Animal> type cannot be changed once they are initially defined.
*/

interface Animal {
  specie: string
}

type Readonly<T> = {
    readonly [PropertyKey in keyof T]: T[PropertyKey];
};
const dog: Readonly<Animal> = {
  specie: 'Labrador'
}
dog.specie = 'Golden retriever' // ❌ Now the compiler is crying 😭.
`,
  'Declaration Merging': `
/*
* Declaration Merging: Declaration merging is another cool feature in TypeScript, which I like 🤭.
* If you've heard about function overloading, declaration merging is somewhat similar but involves types.
* 
* In the code below, there are two interface declarations named Box.
* Initially, the Box interface holds two properties: height and width.
* After defining the second Box interface, it also includes a new property: scale.
* This is declaration merging. Now the Box interface requires all three properties to be valid.
* Neat, right?
*/
interface Box {
    height: number;
    width: number;
}
interface Box {
    scale: number;
}
let box: Box = { height: 5, width: 6, scale: 10 };
  `,
  Decorators: `
* Decorators: Introduced in ES5, decorators provide a way to add annotations and meta-programming syntax to class declarations and members, evaluated at runtime.
* They can be attached to classes, methods, properties, parameters, and accessors.
* 
* Note: To use decorators, you need to enable them in your TypeScript configuration.
* In your tsconfig.json file, set the target to "ES5" and experimentalDecorators to true, as shown below:
* {
*   "compilerOptions": {
*     "target": "ES5",
*     "experimentalDecorators": true
*   }
* }
  
// The code below demonstrates how to use a decorator to seal the Greeter class, preventing further modification after its instantiation.
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
`
}

export const MAX_LOADED_IMAGES = 45

export const FRAME_COUNT = 360

export const FRAME_TO_PAUSE = [36, 72, 108, 144, 180, 216, 252, 288, 302]

const [POS_X, POS_Y, POS_CENTER] = ['5%', '5%', '50%']

interface Position {
  top?: string
  left?: string
  right?: string
  bottom?: string
  transform?: string
}

export const POSITIONS: Position[] = [
  {
    top: POS_Y,
    left: POS_X
  },
  {
    top: POS_Y,
    right: POS_X
  },
  {
    bottom: POS_Y,
    left: POS_X
  },
  {
    bottom: POS_Y,
    right: POS_X
  },
  {
    top: POS_CENTER,
    left: POS_CENTER,
    transform: `translate(-${POS_CENTER}, -${POS_CENTER})`
  },
  {
    bottom: POS_X,
    left: POS_CENTER,
    transform: `translateX(-${POS_CENTER})`
  },
  {
    top: POS_Y,
    right: POS_X
  },
  {
    bottom: POS_Y,
    left: POS_X
  },
  {
    top: POS_Y,
    left: POS_X
  }
]
