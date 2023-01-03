/// Copyright (c) Pascal Brand
/// MIT License
///
///
/// TODO: click on arrow to close/open dropdown
/// TODO: keyboard arrow to select in the dropdown list
///

import { useState } from "react";
import './PbrDropdown.scss'

// icons
// search for icons at https://react-icons.github.io/react-icons/
import { SlMagnifier } from "react-icons/sl";
import { AiFillCaretDown, AiFillCaretUp } from "react-icons/ai"

const PbrDropdown = (
  {
    type,               // type of dropdown: dropdown, or searchbar
    initialValue,       // initial value of the box
    list,               // list of items to be shown in the dropdown when opened, or in the searchbar when guessing
    valueFromItem,      // how the item is printed
    onChange,
    onSelect,           // (index, item) function, called when an item is selected from the dropdown
  }
) => {
  // whether or not a list is shown below the button
  const [open, setOpen] = useState(false);
  const toggleOpen = () => { setOpen(!open); };

  // value shown in in the button
  const [value, setValue] = useState(initialValue);

  // function raised when an item from the list is selected
  const selectItem = ({ index, item }) => {
    setOpen(false);                           // close the dropdown or the guesses
    setValue(valueFromItem(item));            // set the new value to display in the button
    onSelect({ index: index, item: item });  // call the external callback for action with this selection
  }

  const Icon = () => {
    return (
      <>
        {(type === 'dropdown') && (open ? <AiFillCaretUp /> : <AiFillCaretDown />)}
        {(type === 'searchbar') && <SlMagnifier />}
      </>
    )
  }

  return (
    <div className="pbr-dropdown">
      <div className="pbr-dropdown__top">
        {(type === 'dropdown') &&
          <button onClick={toggleOpen}> {value} </button>}

        {(type === 'searchbar') &&
          <input
            type="text"
            value={value}
            onChange={(e) => { setOpen(true); setValue(e.target.value); onChange(e.target.value); }}
            onKeyUp={({key}) => {
              if ((key === "Enter") && list && open) {
                selectItem({ index: 0, item: list[0] })
              }}}
          />
        }

        <Icon />
      </div>

      {(list && open) ? (
        <ul className="pbr-dropdown__list">
          {list.map((item, index) => (
            <li key={index} className="pbr-dropdown__list-item">
              <button className="pbr-dropdown__list-item" onClick={() => selectItem({ index: index, item: item })}>
                {valueFromItem(item)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default PbrDropdown;
