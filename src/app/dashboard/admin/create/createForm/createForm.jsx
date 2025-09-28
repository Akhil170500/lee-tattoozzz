"use client";
import { useState } from "react";
import { db } from "../../../../../firebase.config";
import { addDoc, collection, setDoc } from "firebase/firestore";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const CreateForm = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [bodyPart, setBodyPart] = useState("");

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const measurement = width && height ? `${width} x ${height}` : "";

    if (!title || !category || files.length === 0) {
      setError("Please fill in all fields and select files");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const docRef = await addDoc(collection(db, "design"), {
        title,
        category,
        description,
        measurement,
        bodyPart,
        createdAt: new Date(),
      });

      await setDoc(docRef, { design_id: docRef.id }, { merge: true });

      const uploadedUrls = [];
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "lee-tattoozzz_upload");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dbqg53ryr/image/upload",
          { method: "POST", body: formData }
        );

        const data = await response.json();
        if (data.secure_url) {
          uploadedUrls.push(data.public_id);
        }
      }

      await setDoc(docRef, { imageFiles: uploadedUrls }, { merge: true });

      // reset form
      setTitle("");
      setCategory("");
      setDescription("");
      setWidth("");
      setHeight("");
      setBodyPart("");
      setFiles([]);

      if (onClose) onClose(); // close popup after save
    } catch (err) {
      console.error(err);
      setError("Failed to save or upload files");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col p-4">
      {error && (
        <Typography color="error" mb={2}>
          {error}
        </Typography>
      )}

      <TextField
        name="title"
        label="Title"
        variant="standard"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />

      <FormControl variant="standard" className="mt-4" fullWidth>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="B">Band</MenuItem>
          <MenuItem value="P">Portrait</MenuItem>
          <MenuItem value="T">Text</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="standard" className="mt-4" fullWidth>
        <InputLabel id="body_part-label">Body Part</InputLabel>
        <Select
          labelId="body_part-label"
          value={bodyPart}
          onChange={(e) => setBodyPart(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value="Arm">Arm</MenuItem>
          <MenuItem value="Chest">Chest</MenuItem>
          <MenuItem value="Back">Back</MenuItem>
        </Select>
      </FormControl>

      <TextField
        name="description"
        label="Description"
        variant="standard"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        multiline
        rows={4}
        fullWidth
        className="mt-4"
      />

      <Box gap={2} className="mt-4 display flex" alignItems="end">
        <TextField
          label="Width"
          variant="standard"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          type="number"
          inputProps={{ step: "0.1" }}
          fullWidth
        />
        <Typography variant="body1" color="textSecondary">
          ×
        </Typography>
        <TextField
          label="Height"
          variant="standard"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          type="number"
          inputProps={{ step: "0.1" }}
          fullWidth
        />
      </Box>

      <Box my={4} display="flex" flexDirection="column" alignItems="center">
        <Button
          component="label"
          startIcon={<CloudUploadIcon />}
          variant="contained"
        >
          Select Files
          <input type="file" hidden multiple onChange={handleFileSelect} />
        </Button>

        {files.length > 0 && (
          <Box mt={2} display="flex" flexDirection="column" gap={1}>
            {files.map((file, index) => (
              <Typography key={index} variant="body2">
                {file.name}
              </Typography>
            ))}
          </Box>
        )}
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        className="mt-6"
        disabled={loading}
      >
        {loading ? "Saving & Uploading..." : "Save"}
      </Button>
    </form>
  );
};

export default CreateForm;
