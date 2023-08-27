export const LESSONS = {
  "Advanced Type Inference": `// Hello, Welcome to the first topic of this series, I hope you do enjoy the ride :)
/*
* AAAADV what? yeah Advanced type inference, let me explain what it is.
* Advanced type inference refers to the typing system of which typescript 
* can be used to detect the types at compile time in order to prevent unwanted errors.
* For example: Did you know types could be detected all the way at the object level? 😉
* Let's say you had a function who's parameter takes in an object called data.
* With typescript you can let your compiler know what types to expect in that data simply by inferening them 🙂.
*/
// Let me show you:
Interface DataType {
  a: string;
  b: number;
  c?: unknown; 🥷
}
function typeInfer (data: DataType) {
  console.log(data)
}
const data = {}
typeInfer(data) // ❌ Now the compiler is crying 😭.
// If you were using an IDE that supports typescript like VScode, you would see DataType's types,
// When you hover over the type with your mouse.
// Neat right!
// LET'S MOVE ON TO THE NEXT TOPIC, press continue and SCROLL AWAYYYY 🦅.`,
  Generics: `Generics 🤫
/* 
* You can think of generics as your special friend that can work with pretty much all data types.
* Eliminating the need for the compiler explicitly provide type inference.
* The keyword <T> which you can see in the below code is a generic, and it's used to infer the arg parameter as its type.
* This means arg can be any type and the compiler won't complain about it being passed into the function.
*/
function identity<T>(arg: T): T {
    return arg;
}
const output = identity<string>("myString");`,
  "Namespaces & Modules": `Namespaces 🏘️
/* 
* A namespace in typescript is a useful tool for organizing code into logical units be it functions, classes, variables...etc.
* Then group all of them by name which can be accessable via that name.
* The <export> keyword is way of letting the compiler know that both the namespace...
* and specific property can be accessible outside of the namespace.
*/
namespace MyNamespace {
    export const myVar: number = 10;
}

Modules 🫶
/*
* This is a way of organizing related code and using them in different files and directories.
* There two (2) types of modules - Internal Modules (This are namespaces) and External Modules.
* An external module is the code you see below and used along side the <export> keyword,
* to be accessible outside of the module.
*/
MyModule.ts
export const variable = 2

export const Afunc = () => {
  return 'nothing'
}
// file2.ts
import * as MyModule from './MyModule';
console.log(MyModule.variable) // 2.
console.log(MyModule.Afunc()) // nothing.
// file3.ts
import { variable, Afunc } from './MyModule';
console.log(variable) // 2.
console.log(Afunc()) // nothing.
  `,
  "Interface & Classes": `Interfaces 😷
/*
* An interface is a way of naming a structure, a type must possess.
*/
interface FormData {
    image: string;
}
/*
* Notice the interface is used to make sure the form conforms to the expected object in FormData?
* Beneath the FormData name exists a requirement this type must possess which is image.
* If it's furfilled the form would be allowed in this function else the compiler won't allow it.
* Typescript has this core feature whereby it focuses on type checking, Which is the shape that a value has.
* This is know as Duck-typing or Structural subtyping, This means that when we pass in FormData type what typescript sees is
* { image: string } as we make use of interfaces it acts as a name to hold this structural subtype.
*/
function uploadImage(form: FormData) {
  // uploading...
}

Classes 🎻
/*
* A class represents a blueprint of an object and all it nitty gritty qualities it should have.
* In typescript, you can define specific type a class must follow, an example can be seen below.
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
/*
* Like C# and Java you can also define a structure a class must follow,
* In typescript we can do this by simply using interfaces.
*/
interface CarType {
  brand: string;
  model: string;
  drive: () => void;
}
class Car implements CarType {
  brand = "camry";
  model = "2023";
  constructor(brand, model) {
    this.brand = brand
    this.model = model
  }

  drive () {}
}
  `,
  "Type Intersection & Union": `Type Intersection 🪡
/*
* Type Intersection, Well this topic is already self-explanatory as the name describes it.
* Its a combination of two or more types.
* The function you see below is expecting a return value that must be a combination of...
* The types T and U.
*/
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{};
    // ...
    return result;
}

Union 💍
/*
* Union represents types which can be between or any of the types its defined by.
* In the example you see below, the padLeft function takes a property called padding.
* Notice, padding's parameter type is string | number? This is a union type.
* This means padding can either be a string or number 🙂. 
*/
function padLeft(value: string, padding: string | number) {
    // ...
}`,
  "Type Aliases": `Type Aliases 🦹‍♂️
/*
* Type aliases are similar to interfaces but they can be used to name any types.
* For example: Tuples, primitives, unions...etc.
* They are just a way for providing another name for types, Hence the name Type aliases.
*/
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
let name: NameOrResolver = "Alice";
  `,
  "Type Guards": `// Type Guards 💂‍♂️
/*
* Type Guards is a way narrowing down types to a specific type in typescript.
* Here is a list of types of type guards that can be used in typescript:
* - typeof: It can be used to check the type of a property.
* - instanceof: It can be used to check if a property is an instance of a class.
* - in: It can be used to check if a property exists in an object.
* The example you see below is an demonstration of using Custom type guards.
* This is the most powerful option out all the type guards but it can lead to
* unexpected errors if not written properly.
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
  "Mapped Types": `Mapped Types 🗺️
/*
* Let me just start by saying mapped types are very cool 🤭.
* They can be used for modifying existing object types in the following ways:
* - Making object properties readonly.
* - Making object properties optional.
* - Excluding object properties.
* - Changing the types an object properties should expect.
* - Conditionally using types for properties based on a specific condition.
* Something cool to note is how Mapped types iteratively moves down an object.
* It uses the Propert Key gotten when the keyof keyword is used to get the key of an object.
* This then allows for the modification of the propety values as seen in the below code.
* In the code below, the Animal interface is being modified to become readonly.
* So now any values that possess this Readonly Animal type
* cannot be changed once it has been initially defined.
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
dog.specie = 'Golden retriever' // ❌ Now the compiler is crying 😭.`,
  "Declaration Merging": `Declaration Merging 👨‍⚖️
/*
* Declaration merging is another cool feature in typescript, I like 🤭.
* If you heard about the concept of function overloading in programming
* its similar in a way, but this time it involves types. 🤡
* See the code below? the interface both called Box.
* Initially the Box interface could just hold two types called width and height.
* After defining the next Box interface, its set to holder a new types called scale.
* This is Declaration merging, now the Box interfaces have merged into one.
* Now the Box interface requires all three types to be valid.
* Neat right!
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
  Decorators: `// Decorators 🎄
/* This is a feature introduced in es5.
* It provides a way to add annotations and meta programming syntax to class declarations and members,
* to be evaluated at runtime.
* It can be attached to classes, methods, properties, parameters and accessors.
* The code below seals the Greeter class and prevents it from further modification once initiated.
* Note: To test out this feature you need go to your tsconfig.json file in your typescript project.
* and in your compilerOptions set your target to ES5 and experimentalDecorators to true as seen the example below:
* {
*  "compilerOptions": {
*    "target": "ES5",
*    "experimentalDecorators": true
*  }
*}
*/
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
