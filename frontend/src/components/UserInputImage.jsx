import Button from './Button';
import './UserInputImage.css';

const UserInputImage = () => {
  return (
    <div className="userInputImage">
      <h1 className="userInputImage_header">
        Upload an image to remove the background
      </h1>
      <Button />
      <p className="userInputImage_spanningTxt">or</p>
      <p>paste image or url</p>
    </div>
  );
};

export default UserInputImage;
