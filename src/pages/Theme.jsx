/// Copyright (c) Pascal Brand
/// MIT License
///
/// Theme changer (colors,...) from css variables

import { useState, useRef } from "react";
import './Theme.scss';

/// get and set values of css variables
const cssVar = (name) => {
  // from https://stackoverflow.com/questions/62750308/getpropertyvalue-includes-whitespace-of-css-formating-when-retrieving-custom-c
  //    trim() to remove the whitespace in front and end of the css value
  //    as getPropertyValue reflects how the css is written (with whitespace or without)
  const init = useRef(getComputedStyle(document.documentElement).getPropertyValue(name).trim());

  const [value, setValue] = useState(init.current);

  const set = (newValue) => {
    setValue(newValue);
    document.documentElement.style.setProperty(name, newValue);
  };
  const addStep = (step) => {
    var reValue = /[+-]?\d+(\.\d+)?/g;
    var reUnit = /[a-zA-Z]+/g;
    const v = (parseFloat(value.match(reValue)) + step).toFixed(2);
    const unit = value.match(reUnit);
    console.log(v.toString() + unit)
    return v.toString() + unit;
  }

  const inc = (step) => { set(addStep(step)) }
  const dec = (step) => { set(addStep(-step)) }

  const reset = () => { set(init.current); }


  return { name, value, set, reset, inc, dec };
}

/// display an input button to choose the color of a css variable
function ChooseColorInTheme({ aCssVar }) {
  return (
    <div className="theme__item">
      <label> {aCssVar.name} </label>
      <label> {aCssVar.value} </label>
      <input
        type="color"
        value={aCssVar.value}
        onChange={(e) => { aCssVar.set(e.target.value); }}
      />
    </div>
  );
}

function DecInc({ aCssVar }) {
  return (
    <div className="theme__dec-inc">
      <button className="theme__dec-inc__dec" onClick={() => { aCssVar.dec(0.10); }}> - </button>
      <div className="theme__dec-inc__text"> {aCssVar.value} </div>
      <button className="theme__dec-inc__inc" onClick={() => { aCssVar.inc(0.10); }}> + </button>
    </div>
  );
}

/// display an input button to choose the color of a css variable
function ChooseSizeInTheme({ aCssVar }) {
  return (
    <div className="theme__item">
      <label> {aCssVar.name} </label>
      <DecInc aCssVar={aCssVar} />
    </div>
  );
}

function ThemeSize({ sizes, title }) {
  return (
    <>
      <h2 className="pbr-underline-all"> {title} </h2>
      {
        sizes.map((size, index) => {
          return ( <ChooseSizeInTheme key={index} aCssVar={size} /> );
        })
      }
    </>
  )
}

function ThemeColor({ colors, title }) {
  return (
    <>
      <h2 className="pbr-underline-all"> {title} </h2>
      {
        colors.map((color, index) => {
          return ( <ChooseColorInTheme key={index} aCssVar={color} /> );
        })
      }
    </>
  )
}
/// Display all css variable we are able to update
function Theme() {
  const colors = [
    cssVar('--body-color'),
    cssVar('--body-bg-color'),
    cssVar('--color-1'),
  ];

  const sizes = [
    cssVar('--root-font-size'),
    cssVar('--margin-xl'),
  ]

  const reset = () => {
    colors.forEach(color => { color.reset(); });
    sizes.forEach(size => { size.reset(); });
  }

  return (
    <>
      <h1> Themes</h1>
      <ThemeColor colors={colors} title='Colors' />
      <ThemeSize sizes={sizes} title='Sizes' />

      <button className="pbr-button"
        onClick={reset}>
        Reset
      </button>

    </>
  );
}

export default Theme