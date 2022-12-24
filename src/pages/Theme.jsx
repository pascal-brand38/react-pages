import { useState, useEffect } from "react";


function setColor(setState, variable, newColor) {
  setState(newColor)
  document.documentElement.style.setProperty(variable, newColor);
  // getComputedStyle(document.documentElement).getPropertyValue('--body-bg-color')
}

function ColorTheme({ cssVar, state, setState }) {
  const cssVarStyle = {
    display: "flex",
    gap: "1rem",
  }
  return (
    <div style={ cssVarStyle }>
      <label> { cssVar } </label>
      <input 
        type = "color"
        defaultValue = { state }
        onChange = { (e) => { setColor(setState, cssVar, e.target.value); } }
        />
    </div>
  );
}


function Theme() {
  var [ color1, setColor1 ] = useState('#bc4123')
  var [ bodyBgColor, setBodyBgColor ] = useState('#2b3452')

  // useEffect( () => {
  //   console.log('useeffect ', getComputedStyle(document.documentElement).getPropertyValue('--color-1'))
  //   setColor(setPrimaryColor, '--color-1', getComputedStyle(document.documentElement).getPropertyValue('--color-1'));

  // }, []); // ran only once

  return (
    <>
      <h2> Themes</h2>

      <ColorTheme cssVar='--body-bg-color' state={bodyBgColor} setState={setBodyBgColor} />
      <ColorTheme cssVar='--color-1' state={color1} setState={setColor1} />

    </>
  );
}

export default Theme 
