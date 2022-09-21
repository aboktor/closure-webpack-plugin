import { doStuff } from './second-file';
import { MyClass} from './class-file';
import { Result } from './function-class';

doStuff(); // Hello World
const res = new Result(1,2,3);
const thingToLog = res.ok;
console.log(thingToLog); // console.log(1)
new MyClass('NAME NAME').doStuff(); // console.log(private stuff NAME NAME)
const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

delay(5000).then(() =>
  import('./dynamic-file').then((dynamicModule) =>
    dynamicModule.doDynamicStuff() // append Dynamic Stuff
  )
);
