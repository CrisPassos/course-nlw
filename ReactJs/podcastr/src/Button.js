import React, { useState } from "react";

function Button(props) {
  const [counter, setCounter] = useState(1);

  function increment() {
    setCounter(counter + 1);
  }

  return (
    <>
      <span>{counter}</span>
      <button onClick={increment}>{props.children}</button>
      <br />
    </>
  );
}

export default Button;
