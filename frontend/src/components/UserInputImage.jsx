import { useRef } from 'react';
import Button from './Button';
import './UserInputImage.css';

// eslint-disable-next-line react/prop-types
const UserInputImage = ({ onUploadImageClick }) => {
  const fileInputRef = useRef();

  const btnClickHandle = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="userInputImage">
      <h1 className="userInputImage_header">
        Upload an image to remove the background
      </h1>
      <div className="fileInput">
        <input
          onChange={e => {
            onUploadImageClick(e.target.files[0]);
          }}
          ref={fileInputRef}
          type="file"
        />
      </div>
      <Button onClick={btnClickHandle}>Upload Image</Button>
      <p className="userInputImage_spanningTxt">or</p>
      <p>paste image or url</p>
    </div>
  );
};

export default UserInputImage;
