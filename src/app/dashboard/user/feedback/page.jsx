"use client";
import { useState, useEffect } from "react";
import { db } from "../../../../firebase.config";
import { useSelector } from "react-redux";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import {
  Button,
  TextField,
  Rating,
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
} from "@mui/material";

const Feedback = () => {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const [localError, setLocalError] = useState(null);
  const [allFeedback, setAllFeedback] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const userId = user?.uid;

  // Fetch feedback with user details
  useEffect(() => {
    const feedbackRef = collection(db, "feedback");
    const q = query(feedbackRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const feedbackData = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          let userName = "Anonymous";

          if (data.userId) {
            const userRef = doc(db, "users", data.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              userName = userSnap.data().name || userName;
            }
          }

          return {
            id: docSnap.id,
            ...data,
            userName,
          };
        })
      );
      setAllFeedback(feedbackData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!feedback.trim()) {
      setLocalError("Feedback is required.");
      return;
    }
    if (!rating) {
      setLocalError("Please give a rating.");
      return;
    }

    try {
      const feedbackRef = collection(db, "feedback");
      await addDoc(feedbackRef, {
        userId,
        feedback,
        rating,
        createdAt: serverTimestamp(),
      });

      setFeedback("");
      setRating(0);
      setLocalError(null);
    } catch (error) {
      setLocalError("Failed to save feedback");
    }
  };

  return (
    <div className="px-6 md:px-20 py-12 md:py-20 bg-gray-50" id="feedback">

                <div className="px-6 md:px-12 gap-10">
            <h2 className="text-2xl md:text-3xl text-black font-bold font-serif mb-2">
              05 Customer Reviews
            </h2>
            <div className="w-16 h-0.5 bg-black"></div>
          </div>
<div className="flex flex-col md:flex-row min-h-screen bg-gray-50 p-6 md:p-12 gap-10">
        {/* Feedback Form */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white text-black p-8 rounded-xl border border-gray-200 w-full md:w-1/2"
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 1, textAlign: "left" }}
        >
          Share Your Feedback
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <TextField
          label="Your Feedback"
          variant="outlined"
          multiline
          rows={3}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />

        <Box mb={3}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Rating
          </Typography>
          <Rating
            name="rating"
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            size="medium"
            sx={{
              "& .MuiRating-iconFilled": { color: "#ff4081" },
              "& .MuiRating-iconHover": { color: "#ff4081" },
            }}
          />
        </Box>

        {localError && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {localError}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          disableElevation
          sx={{
            background: "#333",
            color: "#fff",
            fontWeight: "600",
            borderRadius: "8px",
            textTransform: "none",
            fontSize: "15px",
            "&:hover": {
              background: "#ff4081",
            },
            py: 1.2,
          }}
        >
          Submit
        </Button>
      </form>

      {/* Feedback List */}
      <div className="flex flex-col w-full md:w-1/2 bg-white p-8 rounded-xl border border-gray-200">
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 1, textAlign: "left" }}
          className="text-black"
        >
          Recent Reviews
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <div className="overflow-y-auto max-h-[500px] pr-2 space-y-3">
          {allFeedback.length === 0 ? (
            <Typography
              color="text.secondary"
              sx={{ textAlign: "center", mt: 10 }}
            >
              No feedback yet
            </Typography>
          ) : (
            allFeedback.map((item) => (
              <Paper
                key={item.id}
                sx={{
                  p: 2.5,
                  borderRadius: "10px",
                  border: "1px solid #e5e7eb",
                  background: "#fff",
                }}
              >
                <Box display="flex" alignItems="center" gap={2} mb={1}>
                  <Avatar
                    sx={{
                      bgcolor: "#f3f4f6",
                      color: "#111",
                      fontSize: "14px",
                    }}
                  >
                    {item.userName?.charAt(0) || "U"}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      fontWeight="600"
                      sx={{ lineHeight: 1.2 }}
                    >
                      {item.userName}
                    </Typography>
                    <Rating
                      value={item.rating}
                      readOnly
                      size="small"
                      sx={{
                        "& .MuiRating-iconFilled": { color: "#ff4081" },
                      }}
                    />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {item.feedback}
                </Typography>
              </Paper>
            ))
          )}
        </div>
      </div>
</div>
    </div>
  );
};

export default Feedback;
