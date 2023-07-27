import PlusIcon from "@mui/icons-material/Add";
import { useRef } from "react";

const ImagePicker = ({ selectedImage, setSelectedImage }) => {
  const fileInput = useRef();
  return (
    <div>
      {selectedImage && (
        <div>
          <img
            className="image"
            alt="selected image"
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
        </div>
      )}

      {!selectedImage && (
        <div className="image-picker" onClick={() => fileInput.current.click()}>
          <PlusIcon sx={{ fontSize: 60 }} />
          <p className="image-text">IMAGE</p>
        </div>
      )}

      <input
        type="file"
        ref={fileInput}
        name="myImage"
        accept="image/png, image/gif, image/jpeg"
        style={{ display: "none" }}
        onChange={(event) => {
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
};

export default ImagePicker;
