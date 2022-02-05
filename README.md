# Pixoo-TS

A TypeScript library to interface with a Divoom Pixoo 64

A decent chunk of this code is based off of https://github.com/SomethingWithComputers/pixoo (Python)

## Getting Started:

```ts
import Pixoo from 'pixoo';

const pixoo = new Pixoo('192.168.0.x', 64);

// initialize
await pixoo.init();

// draw image at (0, 0)
await pixoo.drawImage('./.tmp/art.jpg', [0, 0]);

// draw red text at (0, 10)
const red = [255, 0, 0];
await pixoo.drawText('Hello, World!', [0, 10], red);
```
