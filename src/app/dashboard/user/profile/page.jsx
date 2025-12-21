"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FaUser, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import Link from "next/link";
import { TailSpin } from 'react-loader-spinner'


const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", firebaseUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setUser(snap.data());
        } else {
          // fallback if user doc doesn't exist
          setUser({
            name: firebaseUser.displayName || "Unknown",
            email: firebaseUser.email,
          });
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <TailSpin
        height="80"
        width="80"
        color="#ff4081"
        ariaLabel="tail-spin-loading"
        visible={loading}
      />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        No user found. Please login.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-20 py-12">
      <div className="max-w-4xl mx-auto my-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold font-serif">
            My Profile
          </h1>
          <p className="text-gray-400 mt-2">Manage your personal information</p>
          <div className="w-20 h-0.5 bg-white mx-auto mt-4"></div>
        </div>

        {/* Profile Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 md:p-10">
          {/* Top Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-2 border-neutral-700"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-black flex items-center justify-center border-2 border-neutral-700 text-5xl font-bold text-white">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            )}

            {/* Basic Info */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold">
                {user.name} {""} {user.lastname}
              </h2>
              <p className="text-gray-400 mt-1">{user.email}</p>

            <Link href="/dashboard/user/editprofile">
              <button className="mt-4 bg-white text-black px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                Edit Profile
              </button>
            </Link>
            </div>
          </div>

          <div className="my-8 border-t border-neutral-800"></div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-center gap-4 bg-neutral-800 p-4 rounded-lg">
              <FaEnvelope className="text-xl text-gray-300" />
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4 bg-neutral-800 p-4 rounded-lg">
              <FaPhoneAlt className="text-xl text-gray-300" />
              <div>
                <p className="text-gray-400 text-sm">Gender</p>
                <p className="font-medium">
                  {user.gender === "F"
                    ? "Female"
                    : user.gender === "M"
                    ? "Male"
                    : "Other"}
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4 bg-neutral-800 p-4 rounded-lg">
              <FaMapMarkerAlt className="text-xl text-gray-300" />
              <div>
                <p className="text-gray-400 text-sm">Date of Birth</p>
                <p className="font-medium">
                  {user.dob && typeof user.dob.toDate === "function"
                    ? user.dob.toDate().toLocaleDateString()
                    : "-"}
                </p>
              </div>
            </div>

            {/* Joined */}
            <div className="flex items-center gap-4 bg-neutral-800 p-4 rounded-lg">
              <FaUser className="text-xl text-gray-300" />
              <div>
                <p className="text-gray-400 text-sm">Joined</p>
                <p className="font-medium">
                  {user.createdAt.toDate().toLocaleDateString() || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile CTA */}
        {/* <div className="md:hidden text-center mt-6">
          <button className="w-full bg-white text-black py-3 rounded-lg font-semibold">
            Edit Profile
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProfilePage;
