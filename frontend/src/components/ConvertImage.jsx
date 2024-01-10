import { useState } from 'react';

/* eslint-disable react/prop-types */
const ConvertImage = ({ imageSrc, imageFile }) => {
  const [convertedImgUrl, setConvertedImgUrl] = useState(null);

  const convertClickHandle = async () => {
    const formData = new FormData();
    formData.append('file', imageFile);

    try {
      const response = await fetch('/logix/api/upload/', {
        method: 'PUT',
        body: formData,
      });

      const responseBody = await response.json();
      setConvertedImgUrl('/media/' + responseBody.filename);
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="convertContainer">
      <div className="converterContainer__imgs">
        <img
          className="selectedImg"
          src={imageSrc}
          alt="selected image by user"
        />
        {convertedImgUrl && (
          <img
            src={convertedImgUrl}
            alt="samplel 124"
            className="selectedImg"
          />
        )}
      </div>

      <button onClick={convertClickHandle}>convert</button>
    </div>
  );
};

export default ConvertImage;
