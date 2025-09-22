"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../firebase.config"; // adjust path
import { collection, getDocs } from "firebase/firestore";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dbqg53ryr/image/upload/";

const Dashboard = () => {
  const name = useSelector((state) => state.auth.user?.name || "");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "design"));
        const allImages = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.imageFiles && Array.isArray(data.imageFiles)) {
            // construct full URLs
            data.imageFiles.forEach((fileName) => {
              allImages.push(`${CLOUDINARY_BASE_URL}${fileName}.png`); // add extension
            });
          }
        });

        setImages(allImages);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-primary mb-6">Welcome, {name}</h1>

      <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
        {images.length === 0 && <p>No images found.</p>}

        {images.map((url, idx) => (
          <img
            key={idx}
            src={url}
            alt={`uploaded-${idx}`}
            className="w-full h-48 object-cover rounded shadow"
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
