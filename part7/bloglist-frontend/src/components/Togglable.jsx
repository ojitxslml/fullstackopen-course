import { useState, useImperativeHandle, forwardRef } from "react";
import PropTypes from "prop-types";

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? "none" : "" };
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    };
  });

  return (
    <div>
      <div style={hideWhenVisible}>
        <button
          onClick={toggleVisibility}
          className="bg-sky-500 p-2 rounded-lg hover:bg-sky-600"
        >
          {props.buttonLabel}
        </button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button
          onClick={toggleVisibility}
          className="bg-red-500 text-white px-4 py-2 mt-4 w-[80px] rounded hover:bg-red-600"
        >
          cancel
        </button>
      </div>
    </div>
  );
});

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

Togglable.displayName = "Togglable";

export default Togglable;
