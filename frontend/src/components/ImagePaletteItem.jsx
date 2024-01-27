import './ImagePaletteItem.css';

// eslint-disable-next-line react/prop-types
const ImagePaletteItem = ({ isImage = true, imageUrl, isActive, onClick }) => {
  return (
    <>
      {isImage ? (
        <img
          onClick={onClick}
          src={imageUrl}
          className={`imagePaletteItem ${isActive ? 'selected' : ''}`}
        ></img>
      ) : (
        <div
          style={{
            backgroundColor: imageUrl,
          }}
          onClick={onClick}
          className={`imagePaletteItem ${isActive ? 'selected' : ''}`}
        ></div>
      )}
    </>
  );
};

export default ImagePaletteItem;
