"use client";
import { useState, useEffect } from "react";
import { db } from "../../../../firebase.config";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  doc,
  getDoc,
} from "firebase/firestore";
import Link from "next/link";

const Process = () => {
  const [reviewCount, setReviewCount] = useState(0);
  const [topFeedback, setTopFeedback] = useState(null);

  useEffect(() => {
    const fetchTopFeedback = async () => {
      try {
        const feedbackRef = collection(db, "feedback");

        // 🔹 Get total review count
        const allSnap = await getDocs(feedbackRef);
        setReviewCount(allSnap.size);

        // 🔹 Get top rated + latest feedback (requires composite index)
        const q = query(
          feedbackRef,
          orderBy("rating", "desc"),
          orderBy("createdAt", "desc"),
          limit(1)
        );
        const topSnap = await getDocs(q);

        if (!topSnap.empty) {
          const docData = topSnap.docs[0].data();
          let userName = "Anonymous";

          if (docData.userId) {
            const userRef = doc(db, "users", docData.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              userName = userSnap.data().name || userName;
            }
          }

          setTopFeedback({ ...docData, userName });
        }
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };

    fetchTopFeedback();
  }, []);

  return (
    <div className="px-6 md:px-20 py-12 md:py-20 bg-gray-50" id="process">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="my-12">
          <h2 className="text-2xl md:text-3xl text-black font-bold font-serif mb-2">
            03 STAGES OF WORK
          </h2>
          <div className="w-16 h-0.5 bg-black"></div>
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Stage 1 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-3 text-black">Consultation</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Communication with the client, clarifying all the details and desires regarding the tattoo, discussing the design, placement, size, and other important details.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-3 text-black">
              Preparation of the application site
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Preparation of the skin surface on which the tattoo will be applied using special disinfectants.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-3 text-black">Template check</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              If necessary, the tattoo artist makes a template and applies it on the client's skin to optimize the location.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-3 text-black">Applying a tattoo</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Using a special tattoo device, the tattoo artist applies the tattoo on the client's skin.
            </p>
          </div>

          {/* Stage 5 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-3 text-black">Completion of the process</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              After the tattoo is finished, the artist disinfects the surface of the skin, applies protective film, and explains care instructions for the new tattoo.
            </p>
          </div>

          {/* Stage 6 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-lg mb-3 text-black">Control check</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              After a certain time during the healing period, the artist can check the result and correct any flaws if necessary.
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pt-8 border-t border-gray-300">
          {/* Left: Reviews Badge */}
          <Link href="user/#feedback">
          <div className="flex items-center gap-4">
            <div className="bg-black text-white px-6 py-3 rounded-full">
              <span className="font-bold text-lg">{reviewCount} REVIEWS</span>
            </div>
          </div>
          </Link>

          {/* Right: Top Review */}
          {topFeedback && (
            <div className="flex items-center gap-4 lg:flex-row-reverse max-w-xl bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
              {/* Avatar */}
              <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-black font-bold text-xl">
                {topFeedback.userName?.charAt(0).toUpperCase() || "U"}
              </div>

              {/* Review content */}
              <div className="text-left">
                <p className="font-bold text-lg text-black">{topFeedback.userName}</p>
                <p className="text-gray-600 text-sm leading-relaxed mt-1">
                  ⭐ {topFeedback.rating} / 5
                </p>
                <p className="text-gray-700 text-sm mt-2">{topFeedback.feedback}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Process;
