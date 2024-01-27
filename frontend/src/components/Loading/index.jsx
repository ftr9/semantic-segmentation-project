import Lottie from 'lottie-react';
import cookingAnimationJson from '../../assets/animation/cooking.json';
import './index.css';

const Loading = () => {
  return (
    <div className="loadingIndicatorContainer">
      <Lottie
        className="loadingAnimation"
        animationData={cookingAnimationJson}
        loop
      />
      <h1>Preparing your image 🧨</h1>
      <p>Trying to generate best</p>
    </div>
  );
};

export default Loading;
