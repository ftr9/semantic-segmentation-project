import './style.css';
import Resultimg from '../../assets/resultImage.png';
import { useRef, useState } from 'react';
import html2Canvas from 'html2canvas';

const BACKGROUND_TYPE = {
  IMAGE: 'image',
  COLOR: 'color',
};

const ResultImage = () => {
  const [backgroundColor, setBackgroundColor] = useState({
    type: BACKGROUND_TYPE.COLOR,
    value: 'transparent',
  });

  const [bgTextInput, setBgTextInput] = useState('');
  const downloadTagRef = useRef(null);

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
    const canvas = await html2Canvas(
      document.querySelector('.resultImage_transparent'),
      { useCORS: true }
    );
    const link = downloadTagRef.current;

    link.download = 'mynameiscoo..';
    link.href = canvas.toDataURL();
    link.style.display = 'none';
    link.click();
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
              }}
            ></div>
          )}
          {backgroundColor.type === BACKGROUND_TYPE.IMAGE && (
            <img src={backgroundColor.value} className="bg_overlay"></img>
          )}
          <img src={Resultimg} alt="transparent image" />
        </div>
      </div>
      <div className="resultImage_input">
        <a
          style={{
            display: 'none',
          }}
        />
        <input onChange={onChangeColorHandle} type="color" name="sample" />
        <input
          onChange={e => setBgTextInput(e.target.value)}
          type="text"
          value={bgTextInput}
          placeholder="Enter image url"
        />
        <button onClick={onAddBackgroundHandle}>Add image background</button>
        <a
          ref={downloadTagRef}
          href=""
          download={''}
          style={{ display: 'none' }}
        />
        <button onClick={onDownloadHandle}>Download</button>
      </div>
    </div>
  );
};

export default ResultImage;
