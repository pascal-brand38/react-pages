/// Copyright (c) Pascal Brand
/// MIT License
///
/// Theme changer (colors,...) from css variables
/// Note that react's state as useless as changing a css variable value update the
/// site rendering.


/// get and set values of css variables
const cssVar = {
  get: (name) => {
    // from https://stackoverflow.com/questions/62750308/getpropertyvalue-includes-whitespace-of-css-formating-when-retrieving-custom-c
    //    trim() to remove the whitespace in front and end of the css value
    //    as getPropertyValue reflects how the css is written (with whitespace or without)
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  },
  set: (name, value) => {
    document.documentElement.style.setProperty(name, value);
  },
}

/// display an input button to choose the color of a css variable
function ChooseColorInTheme({ nameCssVar }) {
  const cssVarStyle = {
    display: "flex",
    gap: "1rem",
  }
  return (
    <div style={ cssVarStyle }>
      <label> { nameCssVar } </label>
      <input 
        type = "color"
        defaultValue = { cssVar.get(nameCssVar)}
        onChange = { (e) => { cssVar.set(nameCssVar, e.target.value); } }
        />
    </div>
  );
}


/// Display all css variable we are able to update
function Theme() {
  return (
    <>
      <h2> Themes</h2>

      <ChooseColorInTheme nameCssVar='--body-color' />
      <ChooseColorInTheme nameCssVar='--body-bg-color' />
      <ChooseColorInTheme nameCssVar='--color-1' />

    </>
  );
}

export default Theme 
