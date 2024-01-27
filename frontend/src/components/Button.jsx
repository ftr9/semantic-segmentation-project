import './Button.css';

// eslint-disable-next-line react/prop-types
const Button = ({ onClick, children, bg = '#fab005' }) => {
  return (
    <button
      className="btn"
      style={{
        background: bg,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
