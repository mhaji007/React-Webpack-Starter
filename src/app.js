import React from 'react'
import ReactDOM from 'react-dom'
import component from './component.js'
import style from './main.css'

// These commented out imports are the alternative to:
// "useBuiltIns": "usage"
// in the .babelrc

// import "core-js/modules/es.object.values";
// import "core-js/modules/es.promise";

// This is required for generators, including async/await
// Note: It seems that async/await is not built on generators,
// but babel transpiles is to one for backwards support.

// import "regenerator-runtime/runtime";

function App() {
  return <h1> Hello React!</h1>
}

console.log('¡Hola!')
console.log('adifo')

// By default this set up does not include proposed features
// and therefore babel does not transpile them unless you explicilty opt in
// Take the following example, you see the result printed because you are using a modern browser but
// if you go to the main.js and search for "includes" you will see the original unaltered (un-transpiled) code/syntax
// The reason for this is that babel by default does not transpile methods that require polyfill because
// it will siginficantly bloat the final built (main.js)
// post css can modify and extend the final css output and allows for autoprefxing, polyfiling or fallbacks for cross browser support
// and reading from browserslist.rc config file helps in case the defaults that post css gives is not
// covering enough for targeted user demographic
console.log(['a', 'b', 'c'].includes('8'))

const elvenShieldRecipe = {
  leatherStrips: 2,
  ironIngot: 1,
  refinedMoonstone: 4,
}

// ES7 Object spread example
const elvenGauntletsRecipe = {
  ...elvenShieldRecipe,
  leather: 1,
  refinedMoonstone: 1,
}
console.log('ES7 Object spread example: ', elvenGauntletsRecipe)

// ES8 Object.values example
// Note: Will not transpile without babel/imported polyfills because it is a new method
console.log('ES8 Object.values example', Object.values(elvenGauntletsRecipe))

// Event queue block scoping example
// Check babel output to see that `let` isn't simply switched to `var`
// because the code would not have the same output.
for (let i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i)
  }, 1)
}

// async/await example from MDN
function resolveAfter2Seconds() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('resolved')
    }, 2000)
  })
}

async function asyncCall() {
  console.log('calling')
  const result = await resolveAfter2Seconds()
  console.log(result)
  // expected output: "resolved"
}

asyncCall()

document.body.append(component())

ReactDOM.render(<App />, document.getElementById('app'))

// Inject browser with the newest version of javascript on the fly without reload
if (module.hot) {
  module.hot.accept()
}
