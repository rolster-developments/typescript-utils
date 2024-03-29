import { Double } from './src/double';

function consoleDouble(d: Double) {
  console.log(d.decimals);
  console.log(d.exp);
  console.log(d.signed);
}

consoleDouble(Double.create(10.5453456565));
consoleDouble(Double.create(10.5453456565).roundFloor());
consoleDouble(Double.create(10.5453456565).roundCeil());
