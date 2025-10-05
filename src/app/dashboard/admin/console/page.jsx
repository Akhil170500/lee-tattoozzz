"use client";
import { db } from "@/firebase.config";
import { Box, Typography } from "@mui/material";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import AgeChart from "./ageChart/page";
import GenderChart from "./genderChart/page";
import UsersPerGraph from "./usersPer/page";
import FeedbackChart from "./feedbackChart/page";
import UsersTable from "./allUsersTable/page";

const Console = () => {
  const [usersData, setUsersData] = useState([]);
  const [feedbackData, setFeedbackData] = useState([]);
  const [designData, setDesignData] = useState([]);

  const getConsoleChartData = async () => {
    // users
    const usersRef = collection(db, "users");
    const users = await getDocs(usersRef);
    setUsersData(users.docs.map((doc) => doc.data()));

    // feedback
    const feedbackRef = collection(db, "feedback");
    const feedback = await getDocs(feedbackRef);
    setFeedbackData(feedback.docs.map((doc) => doc.data()));

    // design
    const designRef = collection(db, "design");
    const design = await getDocs(designRef);
    setDesignData(design.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getConsoleChartData();
  }, []);

  return (
    <div className="p-4 bg-black text-white mt-10">
      <div>
        <h3 className="my-4 font-bold text-2xl">Admin Dashboard</h3>
      </div>

<div className="flex flex-col gap-4">
        {/* Responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Age chart */}
        <Box className="bg-neutral-900 rounded-lg shadow border border-gray-800 p-3">
          <Typography
            variant="subtitle1"
            className="text-white font-semibold mb-2"
          >
            Users by Age
          </Typography>
          <AgeChart usersDob={usersData.map((user) => user.dob)} />
        </Box>

        {/* Gender chart */}
        <Box className="bg-neutral-900 rounded-lg shadow border border-gray-800 p-3">
          <Typography
            variant="subtitle1"
            className="text-white font-semibold mb-2"
          >
            Users by Gender
          </Typography>
          <GenderChart usersGender={usersData.map((user) => user.gender)} />
        </Box>

        {/* Feedback chart */}
        <Box className="bg-neutral-900 rounded-lg shadow border border-gray-800 p-3">
          <Typography
            variant="subtitle1"
            className="text-white font-semibold mb-2"
          >
            Feedback Count
          </Typography>
          <FeedbackChart
            feedbackCount={feedbackData.map((feedback) => feedback.rating)}
          />
        </Box>
      </div>

      {/* Users per duration chart */}
      <Box className="bg-neutral-900 rounded-lg shadow border border-gray-800 p-3">
        <Typography
          variant="subtitle1"
          className="text-white font-semibold mb-2"
        >
          Users per Duration
        </Typography>
        <UsersPerGraph
          usersCreatedAt={usersData.map((user) => user.createdAt)}
        />
      </Box>

      {/* Users table - spans full width */}
      <Box className="bg-neutral-900 rounded-lg shadow border border-gray-800 p-3 md:col-span-2 lg:col-span-3">
        <Typography
          variant="subtitle1"
          className="text-white font-semibold mb-2"
        >
          All Users
        </Typography>
        <UsersTable usersTableData={usersData} />
      </Box>
</div>
    </div>
  );
};

export default Console;
