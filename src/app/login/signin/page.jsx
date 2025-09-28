"use client";
import { useState, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase.config"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { Button, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/redux/slices/authSlice";

const SignIn = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const [signInWithEmailAndPassword, userCredential, loading, hookError] =
    useSignInWithEmailAndPassword(auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    try {
      await signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setLocalError("Something went wrong.");
    }
  };

  const admin = useSelector((state) => state.auth.admin);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleUserLogin = async () => {
    if (userCredential) {
      const user = userCredential.user;
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDocRef);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          dispatch(
            login({
              user: {
                uid: user.uid,
                email: userData.email,
                name: userData.name,
              },
              admin: userData.admin,
            })
          );

          setEmail("");
          setPassword("");
        } else {
          console.warn("No user profile found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user from Firestore:", error);
      }
    }
  };

  useEffect(() => {
    if (userCredential) {
      handleUserLogin();
    }
  }, [userCredential]);

  useEffect(() => {
    if (isLoggedIn) {
      if (admin) {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    }
  }, [admin, isLoggedIn, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-96 bg-neutral-900 text-white p-8 rounded-2xl shadow-lg border border-neutral-800"
      >
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[#ff4081] to-[#ff4081]/70 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        {(localError || hookError) && (
          <p className="text-[#ff4081] mb-4 text-sm text-center">
            {localError || hookError.message}
          </p>
        )}

        <TextField
  id="email"
  type="email"
  label="Email"
  variant="standard"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  InputLabelProps={{ style: { color: "#fff" } }}
  InputProps={{ style: { color: "#fff" } }}
  sx={{
    marginBottom: 3,
    "& .MuiInput-underline:before": {
      borderBottomColor: "white", // default line color
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "white", // on hover
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#ff4081", // on focus
    },
  }}
/>

<TextField
  id="password"
  type={showPassword ? "text" : "password"}
  label="Password"
  variant="standard"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  InputLabelProps={{ style: { color: "#fff" } }}
  InputProps={{
    style: { color: "#fff" },
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          edge="end"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label="toggle password visibility"
          sx={{ color: "#fff" }}
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
  sx={{
    marginBottom: 4,
    "& .MuiInput-underline:before": {
      borderBottomColor: "white",
    },
    "& .MuiInput-underline:hover:before": {
      borderBottomColor: "white",
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: "#ff4081",
    },
  }}
/>


        <Button
          type="submit"
          fullWidth
          disabled={loading}
          sx={{
            background:
              "linear-gradient(90deg, #ff4081 0%, #ff4081cc 100%)",
            color: "#fff",
            fontWeight: "bold",
            borderRadius: "12px",
            textTransform: "none",
            "&:hover": {
              background: "linear-gradient(90deg, #ff4081cc 0%, #ff4081 100%)",
            },
            py: 1.5,
          }}
        >
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <p className="text-sm mt-6 text-neutral-400">
        Don’t have an account?{" "}
        <Link href="/login/signup" className="text-[#ff4081] font-semibold">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
