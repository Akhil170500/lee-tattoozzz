"use client";
import { useState, useEffect } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase.config";
import Link from "next/link";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import {
  Button,
  TextField,
  InputAdornment,
  IconButton,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [dob, setDob] = useState(null);
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const [createUserWithEmailAndPassword, userCredential, loading, hookError] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError(null);

    if (!email || !password) {
      setLocalError("Email and password are required.");
      return;
    }

    try {
      const res = await createUserWithEmailAndPassword(email, password);
      if (res && res.user) {
        await saveUserToFirestore(res.user);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setLocalError("Something went wrong.");
    }
  };

  const saveUserToFirestore = async (user) => {
    try {
      await setDoc(doc(db, "users", user.uid), {
        name,
        lastname,
        gender,
        email: user.email,
        createdAt: new Date(),
        user_type_code: "",
        dob: dob ? new Date(dob) : null,
      });
      dispatch(
        login({
          user: {
            uid: user.uid,
            email: user.email,
            name,
          },
          isAdmin: false,
        })
      );

      // reset form
      setEmail("");
      setPassword("");
      setName("");
      setLastName("");
      setGender("");
      setDob(null);

      router.push("/dashboard/user");
    } catch (error) {
      console.error("Failed to save user to Firestore:", error);
    }
  };

  useEffect(() => {
    if (userCredential) {
      saveUserToFirestore(userCredential.user);
    }
  }, [userCredential]);

  // 🔥 Shared styles for inputs
  const inputSx = {
    "& .MuiInput-underline:before": { borderBottomColor: "white" },
    "& .MuiInput-underline:hover:before": { borderBottomColor: "white" },
    "& .MuiInput-underline:after": { borderBottomColor: "#ff4081" },
    "& .MuiInputLabel-root": { color: "white" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#ff4081" },
    input: { color: "white" },
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-96 bg-neutral-900 p-8 rounded-2xl shadow-lg border border-neutral-800 text-white"
      >
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-[#ff4081] to-[#ff4081]/70 bg-clip-text text-transparent">
          Create Account
        </h2>

        {(localError || hookError) && (
          <p className="text-[#ff4081] mb-4 text-sm text-center">
            {localError || hookError.message}
          </p>
        )}

        <TextField
          name="email"
          id="email"
          type="email"
          label="Email"
          variant="standard"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ ...inputSx, mb: 3 }}
        />

        <TextField
          name="name"
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          label="First Name"
          variant="standard"
          sx={{ ...inputSx, mb: 3 }}
        />

        <TextField
          name="lastname"
          id="lastname"
          type="text"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
          label="Last Name"
          variant="standard"
          sx={{ ...inputSx, mb: 3 }}
        />

        <TextField
          name="password"
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="Password"
          variant="standard"
          sx={{ ...inputSx, mb: 3 }}
          InputProps={{
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
        />

        <FormControl variant="standard" sx={{ ...inputSx, mb: 3 }}>
          <InputLabel id="gender">Gender</InputLabel>
          <Select
            labelId="gender"
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            sx={{ color: "white" }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
            <MenuItem value="O">Other</MenuItem>
          </Select>
        </FormControl>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
  <DatePicker
    label="Date of Birth"
    value={dob}
    onChange={(v) => setDob(v)}
    disableFuture
    openTo="year"
    views={["year", "month", "day"]}
    slotProps={{
      textField: {
        variant: "standard",
        fullWidth: true,
        sx: {
          mb: 3,

          // 👇 target underline pseudo-elements strongly
          "& .MuiInputBase-root:before": {
            borderBottom: "1px solid !white !important",
          },
          "& .MuiInputBase-root:hover:not(.Mui-disabled):before": {
            borderBottom: "1px solid !white !important",
          },
          "& .MuiInputBase-root:after": {
            borderBottom: "2px solid #ff4081 !important",
          },

          // label
          "& label": { color: "white" },
          "& label.Mui-focused": { color: "#ff4081" },

          // input text
          "& input": { color: "white" },

          // calendar icon
          "& .MuiInputAdornment-root": { color: "white" },
          "& .MuiIconButton-root": { color: "white" },
          "& .MuiSvgIcon-root": { color: "white" },
        },
      },
    }}
  />
</LocalizationProvider>


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
              background:
                "linear-gradient(90deg, #ff4081cc 0%, #ff4081 100%)",
            },
            py: 1.5,
          }}
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>

      <p className="text-sm mt-6 text-neutral-400">
        Already have an account?{" "}
        <Link href="/login/signin" className="text-[#ff4081] font-semibold">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
