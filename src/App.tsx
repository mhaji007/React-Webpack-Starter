import './main.css'
import component from './component.js'
import logo from './logo.svg'
import React from 'react'
import { Counter } from './Counter'
import Test from './Test'

document.body.append(component())

export const App = () => {
  return (
    <>
      <h1>Hello from typescript</h1>
      <Test/>
      <img src={logo} alt="test logo" width="300" height="300" />
      <Counter />
    </>
  )
}
