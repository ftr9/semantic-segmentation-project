import './App.css';
import UserInputImage from './components/UserInputImage';
import Header from './components/Header';
import { useState } from 'react';
import ResultImage from './components/ResultImage';
import Loading from './components/Loading';
import FrontImg2 from './assets/frontImg2.png';
import OverLay1 from './assets/overlay1.png';
import OverLay2 from './assets/overlay2.png';

import OverLay3 from './assets/overlay3.png';

import { FaAngleDown } from 'react-icons/fa';
import StepsContainer from './components/StepsContainer';

function App() {
  const [resultImageServer, setResultImageServer] = useState('');
  const [loadedLocalImage, setLoadedLocalImage] = useState('');
  const [isRemovingBackground, setRemovingBackground] = useState(false);

  const uploadImageToServer = async file => {
    //send to server
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/logix/api/upload/', {
        method: 'PUT',
        body: formData,
      });

      const responseBody = await response.json();
      setResultImageServer('/media/' + responseBody.filename);
    } catch (err) {
      console.log(err.message);
    }
  };

  const uploadImageHandle = async file => {
    //save original
    setRemovingBackground(true);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.addEventListener('load', async () => {
      setLoadedLocalImage(fileReader.result);
      await uploadImageToServer(file);
      setRemovingBackground(false);
    });
  };

  if (isRemovingBackground) {
    return <Loading />;
  }

  return (
    <div className="rootContainer">
      <Header />
      {!resultImageServer || !loadedLocalImage ? (
        <>
          <img className="main_img" src={FrontImg2} alt="front img" />
          <div className="section_1">
            <h1>Remove Background in 10 seconds</h1>
            <p>
              With our advanced AI technology, you can effortlessly remove
              complex hair structures from images, eliminating the need for
              hands-on editing in tools like Photoshop. Our powerful AI system
              analyzes and modifies images intelligently, offering a quick and
              precise solution for your editing needs.
            </p>

            <FaAngleDown size={32} color="black" />
          </div>

          <div className="inputImageContainer">
            <div className="inputImageContent">
              <UserInputImage onUploadImageClick={uploadImageHandle} />
            </div>
          </div>

          <StepsContainer>
            <div>
              <h1>Step 1</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
                deleniti beatae officia at provident pariatur optio dolorem,
                dolorum fugiat voluptas asperiores amet delectus modi aperiam
                dolor? Qui cum porro consectetur!
              </p>
            </div>
            <img src={OverLay1} alt="overlay 1" />
          </StepsContainer>
          <StepsContainer hasRightImage={false}>
            <img src={OverLay2} alt="overlay 2" />
            <div className="leftStepsContainer">
              <h1>Step 2</h1>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Minima
                ipsa tenetur saepe ad eveniet modi rerum excepturi laboriosam.
                Suscipit, obcaecati accusantium eius temporibus perferendis
                doloremque quisquam sint illo itaque debitis!
              </p>
            </div>
          </StepsContainer>
          <StepsContainer>
            <div>
              <h1>Step 3</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet
                fugiat a excepturi est! Beatae dolores quasi eum aperiam
                deleniti quia quo architecto non nam iusto incidunt magni,
                ducimus odio minus?
              </p>
            </div>
            <img src={OverLay3} alt="overlay 3" />
          </StepsContainer>
        </>
      ) : (
        <ResultImage
          originalImage={loadedLocalImage}
          resultImage={resultImageServer}
        />
      )}
    </div>
  );
}

export default App;
