import React, { useEffect, useRef, useState } from 'react';
const Dropdown = ({ data,sendProductSelected }) => {
    const [isOpen, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    console.log("datata",data);
    
    const toggleDropdown = () => {
        
        setOpen(!isOpen)
        console.log("clicked",isOpen);
    };
    
    const handleItemClick = (id) => {
      const selectedLabel = data.find(item => item.id === id).label;
      setSelectedItem(selectedItem === id ? null : id);
      setOpen(false);
      sendProductSelected(selectedLabel);
    
    }


    
    return (
      <div className='dropdown'>
        <div className='dropdown-header' onClick={toggleDropdown}>
          {selectedItem !== null ? data.find(item => item.id === selectedItem).label : "Select your destination"}
          <i className={`fa fa-chevron-right icon ${isOpen ? "open" : ""}`}></i>
        </div>
        {isOpen && (
          <div className='dropdown-body'>
            {data.map(item => (
              <div 
                key={item.id} 
                className={`dropdown-item ${item.id === selectedItem ? "selected" : ""}`} 
                onClick={() => handleItemClick(item.id)}
              >
                <span className={`dropdown-item-dot ${item.id === selectedItem ? "selected" : ""}`}>• </span>
                {item.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }



export default Dropdown;