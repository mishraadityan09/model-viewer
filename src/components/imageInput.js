import React, { useState } from 'react';

const ImageUpload = ({ pbr, id,onImageUpload  }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [buttonText, setButtonText] = useState(pbr);

  const handleButtonClick = () => {
    document.getElementById(`file-${id}`).click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      onImageUpload(reader.result,id);  
      setImageSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      setButtonText('Browse another pic');
    }
  };

  return (
    <div className="image-container">
      {imageSrc && <img src={imageSrc} alt="Uploaded file" id="uploadImg" width="100" />}
      <div className="input">
        <input name="input" id={`file-${id}`} type="file" onChange={handleFileChange} style={{ display: 'none' }} />
        <input type="button" value={buttonText} id="upload" onClick={handleButtonClick} />
      </div>
    </div>
  );
};

export default ImageUpload;
