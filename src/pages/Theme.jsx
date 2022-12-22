import { useState, useEffect } from "react";


function setColor(setState, variable, newColor) {
  setState(newColor)
  document.documentElement.style.setProperty(variable, newColor);
  // getComputedStyle(document.documentElement).getPropertyValue('--secondary')
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
  var [ primaryColor, setPrimaryColor ] = useState('#bc4123')
  var [ secondaryColor, setSecondaryColor ] = useState('#2b3452')

  // useEffect( () => {
  //   console.log('useeffect ', getComputedStyle(document.documentElement).getPropertyValue('--primary'))
  //   setColor(setPrimaryColor, '--primary', getComputedStyle(document.documentElement).getPropertyValue('--primary'));

  // }, []); // ran only once

  return (
    <>
      <h2> Themes</h2>

      <ColorTheme cssVar='--primary' state={primaryColor} setState={setPrimaryColor} />
      <ColorTheme cssVar='--secondary' state={secondaryColor} setState={setSecondaryColor} />

    </>
  );
}

export default Theme 
