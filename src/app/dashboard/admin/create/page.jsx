"use client";
import { useState } from "react";
import { db } from "../../../../firebase.config";
import { addDoc, collection, setDoc } from "firebase/firestore";
import { Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography, Textarea } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const Create = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // handle file selection
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // handle upload and Firestore save
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!title || !category || files.length === 0) {
    setError("Please fill in all fields and select files");
    return;
  }

  setLoading(true);
  setError("");

  try {
    // Save Firestore document first
    const docRef = await addDoc(collection(db, "design"), {
      title,
      category,
      category,
      description,
      createdAt: new Date(),
    });

    await setDoc(docRef, { design_id: docRef.id }, { merge: true });

    // ✅ Declare uploadedUrls array
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
        uploadedUrls.push(data.public_id); // store only public ID / filename
      } else {
        console.error("Upload failed:", data);
      }
    }

    // Save uploaded URLs in Firestore
    await setDoc(docRef, { imageFiles: uploadedUrls }, { merge: true });

    console.log("✅ Document saved with ID:", docRef.id, "and uploaded images:", uploadedUrls);

    // Reset form
    setTitle("");
    setCategory("");
    setDescription("");
    setFiles([]);
  } catch (err) {
    console.error(err);
    setError("Failed to save or upload files");
  } finally {
    setLoading(false);
  }
};


  return (
    <Box className="flex flex-col items-center justify-center h-screen text-black">
      <form onSubmit={handleSubmit} className="flex flex-col w-96 bg-gray-200 p-8 rounded shadow">
        {error && <Typography color="error" mb={2}>{error}</Typography>}

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
            <MenuItem value=""><em>None</em></MenuItem>
            <MenuItem value="B">Band</MenuItem>
            <MenuItem value="P">Portrait</MenuItem>
            <MenuItem value="T">Text</MenuItem>
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


        {/* File Upload */}
        <Box mt={4} display="flex" flexDirection="column" alignItems="center" className="my-4">
          <Button
            component="label"
            startIcon={<CloudUploadIcon />}
            variant="contained"
          >
            Select Files
            <input
              type="file"
              hidden
              multiple
              onChange={handleFileSelect}
            />
          </Button>

          {/* Preview selected files */}
          {files.length > 0 && (
            <Box mt={2} display="flex" flexDirection="column" gap={1}>
              {files.map((file, index) => (
                <Typography key={index} variant="body2">{file.name}</Typography>
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
    </Box>
  );
};

export default Create;
