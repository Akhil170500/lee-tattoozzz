"use client";
import { useState, useEffect } from "react";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase.config"; // adjust path
import { useRouter } from "next/navigation";
import Link from "next/link";
import { db } from "../../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { Button, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { useSelector } from "react-redux";

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

  // useEffect(() => {
  //   if (userCredential) {
  //     localStorage.setItem("userEmail", email);
  //     router.push("/dashboard");
  //   }
  // }, [userCredential, router]);
const admin = useSelector((state) => state.auth.admin); //  RIGHT
const name = useSelector((state) => state.auth.user?.name || "");

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
    admin: userData.admin, //  no need to compare if already boolean
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

const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

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
    <div className="flex flex-col items-center justify-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-96 bg-gray-200 text-black p-8 rounded shadow"
      >
        {(localError || hookError) && (
          <p className="text-red-600 mb-4">{localError || hookError.message}</p>
        )}

        <TextField
          id="email"
          type="email"
          label="Email"
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          name="password"
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          label="Password"
          variant="standard"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  edge="end"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label="toggle password visibility"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* <label className="mb-2" htmlFor="email">
          Email
        </label>
        <input
          className="border-2 border-gray-300 p-2 mb-4 text-black"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /> */}

        {/* <label className="mb-2" htmlFor="password">
          Password
        </label>
        <input
          className="border border-gray-300 p-2 mb-4"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /> */}

        {/* <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          Sign In
        </button> */}

        <Button type="submit" className="!mt-4" fullWidth variant="contained">
          Sign In
        </Button>
      </form>

      <p className="text-sm mt-4">
        Don’t have an account?{" "}
        <Link href="/login/signup" className="text-blue-500">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
