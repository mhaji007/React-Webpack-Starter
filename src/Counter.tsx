import { useState } from 'react'
import styles from './Counter.module.scss'

export const Counter = () => {
  const [count, setCount] = useState(0)
  return (
    <div>
      <h1 className={styles.purple}>h1 from counter</h1>
      <h3>Update the count and edit src/App.tsx, state is preserved.</h3>
      {process.env.APP_TEST}
      <button onClick={() => setCount((c) => c + 1)}>Count - {count}</button>
    </div>
  )
}
