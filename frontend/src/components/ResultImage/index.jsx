import './style.css';
import { useRef, useState } from 'react';

import Button from '../Button';
import * as htmlToImage from 'html-to-image';

import { MdPreview } from 'react-icons/md';

const BACKGROUND_TYPE = {
  IMAGE: 'image',
  COLOR: 'color',
};

import ImagePaletteItem from '../ImagePaletteItem';

const DEFAULT_BACKGROUND_IMAGES = [
  'https://images.pexels.com/photos/1547813/pexels-photo-1547813.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2086622/pexels-photo-2086622.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/101529/pexels-photo-101529.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1666529/pexels-photo-1666529.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1624504/pexels-photo-1624504.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const DEFAULT_BACKGROUND_COLORS = [
  '#862e9c',
  '#6741d9',
  '#3b5bdb',
  '#1864ab',
  '#2f9e44',
  '#fcc419',
];

// eslint-disable-next-line react/prop-types
const ResultImage = ({ resultImage, originalImage }) => {
  const [backgroundColor, setBackgroundColor] = useState({
    type: BACKGROUND_TYPE.COLOR,
    value: 'transparent',
  });

  const [bgTextInput, setBgTextInput] = useState('');
  const downloadTagRef = useRef(null);
  const [isInPreviewMode, setIsInPreviewMode] = useState(false);
  const [backgroundBlurFactor, setBackgroundBlurFactor] = useState(0);

  const onChangeColorHandle = e => {
    setBackgroundColor({
      ...backgroundColor,
      type: BACKGROUND_TYPE.COLOR,
      value: e.target.value,
    });
    setBgTextInput('');
  };

  const onAddBackgroundHandle = () => {
    if (!bgTextInput) return;

    setBackgroundColor({
      ...backgroundColor,

      type: BACKGROUND_TYPE.IMAGE,
      value: bgTextInput,
    });
    setBgTextInput('');
  };

  const onDownloadHandle = async () => {
    const downloadUrl = await htmlToImage.toPng(
      document.querySelector('.resultImage_transparent')
    );

    const link = downloadTagRef.current;

    link.download = 'mynameiscoo..';
    link.href = downloadUrl;
    link.style.display = 'none';
    link.click();

    /* const canvas = await html2Canvas(
      document.querySelector('.resultImage_transparent'),
      { useCORS: true, scale: 2 }
    );
    const link = downloadTagRef.current;

    link.download = 'mynameiscoo..';
    link.href = canvas.toDataURL();
    link.style.display = 'none';
    link.click();
    */
  };

  return (
    <div className="resultImageContainer">
      <div className="resultImage_output">
        <div className="resultImage_transparent ">
          {backgroundColor.type === BACKGROUND_TYPE.COLOR && (
            <div
              className="bg_overlay"
              style={{
                background: backgroundColor.value,
                filter: `blur(${backgroundBlurFactor}px)`,
              }}
            ></div>
          )}
          {backgroundColor.type === BACKGROUND_TYPE.IMAGE && (
            <img
              src={backgroundColor.value}
              style={{
                filter: `blur(${backgroundBlurFactor}px)`,
              }}
              className="bg_overlay"
            ></img>
          )}
          <img
            src={originalImage}
            className="preview_img"
            style={{
              display: isInPreviewMode ? 'block' : 'none',
            }}
          />
          <div
            style={{
              backgroundImage: `url(${resultImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            className="resultImage"
          ></div>
        </div>
        <MdPreview
          size={36}
          style={{
            margin: '0 auto',
          }}
          onMouseDown={() => {
            setIsInPreviewMode(true);
          }}
          onMouseUp={() => {
            setIsInPreviewMode(false);
          }}
        ></MdPreview>
      </div>
      <div className="resultImage_input">
        <div className="backgroundUrl">
          <label
            id="colorLabel"
            style={{
              backgroundColor: backgroundColor.value,
            }}
            htmlFor="color"
          ></label>
          <div className="inputColorContainer">
            <input
              id="color"
              style={{}}
              onChange={onChangeColorHandle}
              type="color"
              name="sample"
            />
          </div>
          <div className="backgroundUrl_images">
            {DEFAULT_BACKGROUND_COLORS.map(color => (
              <ImagePaletteItem
                isImage={false}
                key={color}
                isActive={backgroundColor.value === color}
                imageUrl={color}
                onClick={() => {
                  setBackgroundColor({
                    ...backgroundColor,
                    type: BACKGROUND_TYPE.COLOR,
                    value: color,
                  });
                }}
              />
            ))}
          </div>
        </div>

        <div className="backgroundUrl">
          <input
            onChange={e => setBgTextInput(e.target.value)}
            type="text"
            value={bgTextInput}
            placeholder="Enter image url"
          />

          <div className="backgroundUrl_images">
            {DEFAULT_BACKGROUND_IMAGES.map(imgUrl => {
              return (
                <ImagePaletteItem
                  key={imgUrl}
                  imageUrl={imgUrl}
                  isActive={imgUrl === backgroundColor.value}
                  onClick={() => {
                    setBackgroundColor({
                      ...backgroundColor,
                      type: BACKGROUND_TYPE.IMAGE,
                      value: imgUrl,
                    });
                  }}
                />
              );
            })}
          </div>

          <Button onClick={onAddBackgroundHandle}>Add image background</Button>
        </div>

        <div className="backgroundUrl">
          <p>Adjust Background blur</p>
          <input
            value={backgroundBlurFactor}
            type="range"
            step={0.05}
            min={0}
            max={10}
            onChange={e => {
              setBackgroundBlurFactor(e.target.value);
            }}
          />
        </div>

        <a
          ref={downloadTagRef}
          href=""
          download={''}
          style={{ display: 'none' }}
        />

        <Button onClick={onDownloadHandle} bg="blue">
          Download
        </Button>
      </div>
    </div>
  );
};

export default ResultImage;
