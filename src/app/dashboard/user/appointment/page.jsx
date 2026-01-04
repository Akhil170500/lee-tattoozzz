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
} from "firebase/firestore";
import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import emailjs from "emailjs-com";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AppointmentBooking = () => {
  const [note, setNote] = useState("");
  const [image, setImage] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [appointments, setAppointments] = useState([]);

  const user = useSelector((state) => state.auth.user);
  const userId = user?.uid;

  /* ================= FETCH APPOINTMENTS ================= */
  useEffect(() => {
    const q = query(
      collection(db, "appointments"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAppointments(data);
    });

    return () => unsubscribe();
  }, []);

  /* ================= FILE ================= */
  const handleFileSelect = (e) => {
    if (e.target.files[0]) setImage(e.target.files[0]);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!note || !date || !time || !image) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      /* ---- Cloudinary ---- */
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "lee-tattoozzz_upload");

      const cloudinaryRes = await fetch(
        "https://api.cloudinary.com/v1_1/dbqg53ryr/image/upload",
        { method: "POST", body: formData }
      );

      const cloudinaryData = await cloudinaryRes.json();
      if (!cloudinaryData.secure_url) throw new Error("Image upload failed");

      const imageUrl = cloudinaryData.secure_url;

      /* ---- Firestore ---- */
      await addDoc(collection(db, "appointments"), {
        userId,
        note,
        date: date.toISOString(),
        time,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      const formattedDate = `${String(date.getDate()).padStart(
        2,
        "0"
      )}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;

      /* ---- EmailJS ---- */
      await emailjs.send(
        "service_dwm110q",
        "template_bv8r63k",
        {
          to_email: "akhilkuruba1705@gmail.com",
          subject: "New Appointment Booking",
          message: `
Hi Admin,

A user has submitted a new appointment request.

Here are the details:

User Email: ${user?.email}
Date: ${formattedDate}
Time: ${time}

User Note:
${note || "No additional notes."}

Reference Image:
${imageUrl}

Please review and follow up with the user.

Thanks,
Appointment Notification
`,
        },
        "e9JramyxYcvTamh_U"
      );

      setNote("");
      setImage(null);
      setDate(null);
      setTime("");
      toast.success("Appointment booked successfully!");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= STATUS ================= */
  const getStatus = (item) => {
    const now = new Date();
    const appointmentDate = new Date(item.date);
    const [h, m] = item.time.split(":");
    appointmentDate.setHours(h, m, 0, 0);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    if (appointmentDate >= todayStart && appointmentDate <= todayEnd)
      return "Today";
    if (appointmentDate > now) return "Pending";
    return "Closed";
  };

  const statusStyles = (status) => ({
    bg:
      status === "Today"
        ? "#eff6ff"
        : status === "Pending"
        ? "#fff7ed"
        : "#f3f4f6",
    color:
      status === "Today"
        ? "#2563eb"
        : status === "Pending"
        ? "#f97316"
        : "#374151",
  });

  const formatDate = (date) => {
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  return (
    <div className="px-6 md:px-20 py-12 md:py-20 bg-gray-50" id="appointment">
      <ToastContainer position="top-right" autoClose={3000} />
      {/* ===== HEADER ===== */}
      <div className="my-12">
        <h2 className="text-2xl md:text-3xl text-black font-bold font-serif mb-2">
          07 Appointment Booking
        </h2>
        <div className="w-16 h-0.5 bg-black"></div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* ================= LEFT FORM ================= */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col bg-white text-black p-8 rounded-xl border border-gray-200 w-full md:w-1/2"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 1, textAlign: "left" }}
          >
            Share Your Appointment Details
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <TextField
            label="Your Note"
            variant="outlined"
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <Box mb={3}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Select Date
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Select Date"
                value={date}
                onChange={(newDate) => setDate(newDate)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "8px",
                      },
                    }}
                  />
                )}
              />
            </LocalizationProvider>
          </Box>

          <TextField
            label="Time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <Button
            component="label"
            startIcon={<CloudUploadIcon />}
            variant="contained"
            size="large"
            fullWidth
            sx={{
              py: 2,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 500,
              backgroundColor: "#333",
              "&:hover": { backgroundColor: "#ff4081" },
              mb: 3,
            }}
          >
            Upload Image
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
            />
          </Button>

          {image && (
            <Paper sx={{ mt: 1, mb: 2, p: 2, backgroundColor: "#f3f4f6" }}>
              <Typography variant="body2">
                Selected Image: {image.name}
              </Typography>
            </Paper>
          )}

          {error && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {error}
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
              "&:hover": { background: "#ff4081" },
              py: 1.2,
            }}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Appointment"}
          </Button>
        </form>

        {/* ================= RIGHT LIST ================= */}
        <div className="flex flex-col bg-white p-8 rounded-xl border border-gray-200 w-full md:w-1/2 thin-scrollbar">
          <Typography fontWeight="bold">Appointments</Typography>
          <Divider sx={{ my: 2 }} />

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {appointments.length === 0 ? (
              <Typography>No appointments yet</Typography>
            ) : (
              appointments.map((item) => {
                const status = getStatus(item);
                const style = statusStyles(status);

                return (
                  <Paper
                    key={item.id}
                    sx={{ p: 2.5, border: "1px solid #e5e7eb" }}
                  >
                    <Box display="flex" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: style.bg,
                          color: style.color,
                          fontWeight: 700,
                        }}
                      >
                        {status.charAt(0)}
                      </Avatar>

                      <Box flex={1}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          mb={0.5}
                          className="flex-wrap items-center"
                        >
                          <Typography fontWeight={600}>
                            {formatDate(item.date)} • {item.time}
                          </Typography>

                          <Typography
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              borderRadius: "999px",
                              background: style.bg,
                              color: style.color,
                              fontSize: 12,
                              fontWeight: 600,
                              width: "max-content",
                            }}
                          >
                            {status}
                          </Typography>
                        </Box>

                        <Typography variant="body2" color="text.secondary">
                          {item.note}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;
