"use client";
import { useState, useEffect } from "react";
import { db } from "../../../../../firebase.config";
import {
  collection,
  getDocs,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import ReactECharts from "echarts-for-react";
import { Box, Typography } from "@mui/material";

const CreateCharts = () => {
  const [bodyPartCount, setBodyPartCount] = useState({});
  const [categoryCount, setCategoryCount] = useState({});

  const collectionRef = collection(db, "design");

  const getChartData = async () => {
    try {
      const uniqueParts = new Set();
      const uniqueCategories = new Set();

      const docsSnap = await getDocs(collectionRef);
      docsSnap.forEach((doc) => {
        const data = doc.data();
        if (data.bodyPart) uniqueParts.add(data.bodyPart);
        if (data.category) uniqueCategories.add(data.category);
      });

      const partCount = {};
      const catCount = {};

      for (const part of uniqueParts) {
        const q = query(collectionRef, where("bodyPart", "==", part));
        const snap = await getCountFromServer(q);
        partCount[part] = snap.data().count;
      }

      for (const cat of uniqueCategories) {
        const q = query(collectionRef, where("category", "==", cat));
        const snap = await getCountFromServer(q);
        catCount[cat] = snap.data().count;
      }

      setBodyPartCount(partCount);
      setCategoryCount(catCount);
    } catch (err) {
      console.error("Error fetching chart data:", err);
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  const bodyPartData = Object.keys(bodyPartCount).map((key) => ({
    name: key,
    value: bodyPartCount[key],
  }));
  const categoryData = Object.keys(categoryCount).map((key) => ({
    name: key,
    value: categoryCount[key],
  }));

  // Shared chart style
  const commonPieOptions = (data) => ({
    tooltip: {
      trigger: "item",
      formatter: "{b}: {c} ({d}%)",
    },
    legend: {
      bottom: "0%",
      textStyle: { color: "#ccc" },
    },
    series: [
      {
        type: "pie",
        radius: ["40%", "70%"],
        data,
        label: {
          show: true, // ✅ labels visible
          color: "#fff", // ✅ white label text
          fontSize: 12,
          shadowBlur: 0, // ✅ no shadow
          shadowColor: "transparent", // ✅ ensure no blur
          formatter: "{b}: {c}",
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: "#888", // subtle gray connector lines
          },
        },
      },
    ],
  });

  return (
    <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Body Part Pie Chart */}
      <Box className="bg-black rounded-lg border border-gray-700 p-4 flex flex-col items-center justify-center text-gray-100">
        <Typography className="mb-2 font-semibold text-lg text-white">
          Body Part Distribution
        </Typography>
        <ReactECharts
          option={commonPieOptions(bodyPartData)}
          style={{ height: "250px", width: "100%" }}
        />
      </Box>

      {/* Category Pie Chart */}
      <Box className="bg-black rounded-lg border border-gray-700 p-4 flex flex-col items-center justify-center text-gray-100">
        <Typography className="mb-2 font-semibold text-lg text-white">
          Category Distribution
        </Typography>
        <ReactECharts
          option={commonPieOptions(categoryData)}
          style={{ height: "250px", width: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default CreateCharts;
