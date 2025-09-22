"use client";
import { useState, useEffect } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase.config";
import Link from "next/link";
import { db } from "../../../firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Button, TextField } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [lastname, setLastName] = useState("");
  const [dob, setDob] = useState(null);
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [localError, setLocalError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Destructure hook
  const [createUserWithEmailAndPassword, userCredential, loading, hookError] =
    useCreateUserWithEmailAndPassword(auth);

  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
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
          isAdmin: false, // You can set true manually if needed
        })
      );

      // reset form
      setEmail("");
      setPassword("");
      setName("");
      setLastName("");
      setGender("");
      setDob(null);

      //  Navigate after Firestore write
      router.push("/dashboard/user");
    } catch (error) {
      console.error("Failed to save user to Firestore:", error);
    }
  };

  useEffect(() => {
    if (userCredential) {
      const user = userCredential.user;
      saveUserToFirestore(user);
    }
  }, [userCredential]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-black">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-96 bg-gray-200 p-8 rounded shadow"
      >
        {(localError || hookError) && (
          <p className="text-red-600 mb-4">{localError || hookError.message}</p>
        )}
        <TextField
          name="email"
          id="email"
          type="email"
          label="Email"
          variant="standard"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          name="name"
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          label="First Name"
          variant="standard"
        />
        <TextField
          name="lastname"
          id="lastname"
          type="text"
          value={lastname}
          onChange={(event) => setLastName(event.target.value)}
          label="Last Name"
          variant="standard"
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

        <FormControl variant="standard">
          <InputLabel id="gender">Gender</InputLabel>
          <Select
            labelId="gender"
            id="gender"
            value={gender}
            onChange={(event) => setGender(event.target.value)}
            label="Gender"
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
            onChange={(dob) => setDob(dob)}
            disableFuture
            openTo="year"
            views={["year", "month", "day"]}
            slotProps={{
              textField: {
                variant: "standard",
                fullWidth: true,
              },
            }}
          />
        </LocalizationProvider>

        <Button type="submit" className="!mt-4" fullWidth variant="contained">
          {loading ? "Registering" : "Register"}
        </Button>
      </form>
      <p className="text-sm mt-4 text-white">
        Already have an account?{" "}
        <Link href="/login/signin" className="text-blue-500">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
