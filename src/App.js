import "./App.css";
import { useState, useRef, useEffect } from "react";
import SquareIcon from "@mui/icons-material/Square";
import { Grid, IconButton } from "@mui/material";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { db, storage } from "./firebase";
import { EditableInput } from "./components/EditableInput";
import Card from "./components/Card";
import ImagePicker from "./components/ImagePicker";

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

          <ImagePicker
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
          />

          <div className="icon-button">
            <IconButton aria-label="create" type="submit">
              <SquareIcon
                color={isAddButtonActive ? "success" : "disabled"}
              ></SquareIcon>
            </IconButton>
          </div>
        </div>
      </form>

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {cardList.map((card) => {
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={card.id}>
              <Card card={card} />
            </Grid>
          );
        })}
      </Grid>
    </div>
  );
}

export default App;
