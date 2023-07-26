import { useEffect, useRef, useState } from "react";
import { useOutsideClick } from "../useOutsideClick";

export const EditableInput = ({
  name,
  value,
  placeholder,
  onChange,
  isTextArea = false,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const inputRef = useRef(null);

  const handleStartEdit = () => {
    setIsEditMode(true);
  };

  useOutsideClick(inputRef, () => {
    setIsEditMode(false);
  });

  useEffect(() => {
    if (isEditMode) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditMode]);

  return (
    <div className="editable-input">
      {!isEditMode && (
        <p
          className={isTextArea ? "textarea-placeholder" : "input-placeholder"}
          onClick={handleStartEdit}
        >
          {value || placeholder}
        </p>
      )}
      {isEditMode && !isTextArea && (
        <input
          type="text"
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onMouseLeave={() => setIsEditMode(false)}
          onClick={() => setIsEditMode(true)}
        />
      )}
      {isEditMode && isTextArea && (
        <textarea
          ref={inputRef}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onMouseLeave={() => setIsEditMode(false)}
          onClick={() => setIsEditMode(true)}
        />
      )}
    </div>
  );
};
