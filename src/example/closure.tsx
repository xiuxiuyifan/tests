import { useCallback, useRef, useState } from 'react';

export default function ClosureComp() {
  const [count, setCount] = useState(0);

  const countRef = useRef(0);
  // 用 ref 值记录上一次的 count 值
  // ref 的值的引用始终不会改变，所以每次 increment 都会拿到最新的 count 值
  countRef.current = count;

  // useCallback 缓存函数，每次点击按钮时，increment 函数的引用不会改变
  const increment = useCallback(() => {
    setCount(count + 1);
    // eslint-disable-next-line
  }, []);
  return (
    <div>
      <p>Hello World: {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
      <button onClick={increment}>Click me</button>
    </div>
  );
}
