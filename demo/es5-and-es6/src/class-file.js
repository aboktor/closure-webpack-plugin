export class MyClass {

  constructor(name) {

    this.name = name;

    this.unusedPrivate = 'foobar';
  }

  doPrivateUnusedStuff() {
    console.log("this is private and not used")
  }
  doPrivateStuff() {
    console.log('private stuff', this.name);
  }
  doStuff() {
    this.doPrivateStuff();
  }
}
