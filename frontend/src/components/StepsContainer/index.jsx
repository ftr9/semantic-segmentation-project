import './index.css';
// eslint-disable-next-line react/prop-types
const StepsContainer = ({ children, hasRightImage = true }) => {
  return (
    <div
      className={`stepsContainer ${hasRightImage ? 'rightImageContainer' : ''}`}
    >
      {children}
    </div>
  );
};

export default StepsContainer;
