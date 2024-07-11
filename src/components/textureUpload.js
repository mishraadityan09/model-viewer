import React from 'react'

function TextureUpload({ show, onClose, title, children,textureReady,onApplyTexture }) {
    const handleClose = (e) => {
        onClose && onClose(e);
      };
    
      if (!show) {
        return null;
      }
      const handleApplyTexture = (e) => {
        onApplyTexture();
        onClose && onClose(e);
        
      };


  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{title}</h3>
        <div className='flex w-full gap-4'>{children}</div>
        {textureReady?<button onClick={handleApplyTexture}>
            Apply Texture
        </button>:null}
        <button onClick={handleClose}>
          Close
        </button>
      
      </div>
    </div>
  );
  
}

export default TextureUpload