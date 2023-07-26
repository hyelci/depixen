import "./App.css";
import { useState, useRef, useEffect } from "react";
import SquareIcon from "@mui/icons-material/Square";
import PlusIcon from "@mui/icons-material/Add";
import { IconButton } from "@mui/material";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { db, storage } from "./firebase";
import { EditableInput } from "./components/EditableInput";

const initialState = {
  inputName: "New Title",
  description: "New Description",
};

function App() {
  const [inputName, setInputName] = useState(initialState.inputName);
  const [description, setDescription] = useState(initialState.description);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAddButtonActive, setIsAddButtonActive] = useState(false);
  const [cardList, setCardList] = useState([]);
  const [percent, setPercent] = useState(0);
  const fileInput = useRef();

  useEffect(() => {
    if (inputName && description && selectedImage) {
      setIsAddButtonActive(true);
    } else {
      setIsAddButtonActive(false);
    }
  }, [inputName, description, selectedImage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAddButtonActive) {
      return;
    }
    try {
      const storageRef = ref(storage, `/files/${selectedImage.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedImage);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const percent = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );

          // update progress
          setPercent(percent);
        },
        (err) => console.log(err),
        async () => {
          setPercent(0);
          const imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
          await saveCard(imageUrl);
        }
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const saveCard = async (imageUrl) => {
    const docRef = await addDoc(collection(db, "cards"), {
      title: inputName,
      description: description,
      image: imageUrl,
    });
    setInputName(initialState.inputName);
    setDescription(initialState.description);
    setSelectedImage(null);
    console.log("Document written with ID: ", docRef.id);
    await fetchPost();
  };

  const fetchPost = async () => {
    const querySnapshot = await getDocs(collection(db, "cards"));

    const newData = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setCardList(newData);
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <div className="home">
      <form action="" onSubmit={handleSubmit}>
        <p className="title">New Title</p>

        <div className="form-content">
          <div>
            <EditableInput
              type="text"
              name="name"
              placeholder="New title"
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
            />
          </div>

          <div>
            <EditableInput
              isTextArea={true}
              name="description"
              placeholder="New description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>

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
              <div
                className="image-picker"
                onClick={() => fileInput.current.click()}
              >
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
          <div className="icon-button">
            <IconButton aria-label="create" type="submit">
              <SquareIcon
                color={isAddButtonActive ? "success" : "disabled"}
              ></SquareIcon>
            </IconButton>
          </div>
        </div>
      </form>

      {cardList.map((card) => {
        return (
          <div key={card.id}>
            <p className="title">{card.title}</p>
            <div className="form-content">
              <p>{card.description}</p>
              <img className="image" src={card.image} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
