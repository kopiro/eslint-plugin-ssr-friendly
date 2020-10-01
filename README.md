# eslint-plugin-ssr-friendly

ESLint plugin that detects incorrect use of DOM globals properties in your code in
order to properly do Server-Side-Rendering.

The usual scenario is when you access `window` global object without waiting for a `componentDidMount`.

## Installation

```bash
npm i --dev eslint-plugin-ssr-friendly
```

Then add these to your eslintrc configuration:

```json
{
  "plugins": ["ssr-friendly"],
  "rules": {
    "ssr-friendly/ssr-friendly": "error"
  }
}
```

### What should be detected

```js
/* eslint-disable no-restricted-globals */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-vars */
import React from "react";

const isWindow = typeof window; // OK! you can check using typeof

const px = devicePixelRatio; // ERROR!
const windowInnerWidth = window.innerWidth; // ERROR!
const retina = devicePixelRatio > 2; // ERROR!
const secureAndRetina = isSecureContext && retina; // ERROR!
const dimensions = [screenX, screenY]; // ERROR!

const object = {
  devicePixelRatio: 1, // OK
  w: window, // ERROR!
  px: devicePixelRatio, // ERROR!
};

class X {
  // eslint-disable-next-line class-methods-use-this
  devicePixelRatio() {
    return window.innerHeight; // OK! it's in a custom class
  }

  get message() {
    return this.b;
  }
}

// eslint-disable-next-line no-undef
const x = new ChildNode(); // ERROR!
const fragment = new DocumentFragment(); // ERROR!

localStorage.setItem("test", "1"); // ERROR!
function normalFunction() {
  localStorage.setItem("test", "1"); // OK! it's wrapped in a function
}

const menubar = 1; // OK; even if shouldn't be done
const access = menubar.Component; // OK

function ReactFunctionComponent() {
  const myWidth = window.innerWidth; // ERROR! it's in the render-cycle of a React FC
  // eslint-disable-next-line no-undef
  useEffect(() => {
    document.title = "Title"; // OK! it's in the useEffect
  }, []);
  console.log(myWidth); // OK! console is a valid property in NodeJS
  return <div x={myWidth} />;
}

class ClassicComponent extends React.Component {
  constructor(props) {
    super(props);
    const devicePixelRatio = 1; // OK! this is not referring to the global devicePixelRatio
    this.matchMedia = window.matchMedia; // ERROR! use in constructor
  }

  componentDidMount() {
    this.postMessage = window.postMessage; // OK! use in componentDidMount
  }

  render() {
    return <div px={devicePixelRatio} />; // ERROR! use in render
  }
}
```
