import React from "react";
import PropTypes from "prop-types";

function Input({ label, labelProps, wrapperClass, onChange, id, options = [], ...props }) {
  return (
    <div className={`form-group ${wrapperClass ? wrapperClass : ""}`}>
      <label htmlFor={id}>{label}</label>
      <select className="form-control" {...props} id={id} onChange={e => onChange(e.target.value)}>
        {options.map(el => (
          <option key={`option-${el.value}`} value={el.value}>
            {el.label || el.value}
          </option>
        ))}
      </select>
    </div>
  );
}

Input.defaultProps = {
  type: "text",
  onChange: text => console.log("Value: ", text)
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string,
  label: PropTypes.string.isRequired,
  labelProps: PropTypes.object,
  wrapperClass: PropTypes.string,
  type: PropTypes.oneOf(["text", "password", "number"]),
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
  readonly: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  required: PropTypes.bool
};

export default Input;
