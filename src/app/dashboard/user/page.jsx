"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Feedback from "./feedback/page";
import Process from "./process/page";

const CLOUDINARY_BASE_URL =
  "https://res.cloudinary.com/dbqg53ryr/image/upload/";

const HeroPage = () => {
  const name = useSelector((state) => state.auth.user?.name || "");
  const [images, setImages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "design"));
        const allImages = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.imageFiles && Array.isArray(data.imageFiles)) {
            data.imageFiles.forEach((fileName, idx) => {
              allImages.push({
                id: `${doc.id}-${idx}`,
                url: `${CLOUDINARY_BASE_URL}${fileName}.png`,
                title: data.title || "Untitled",
              });
            });
          }
        });

        setImages(allImages);
      } catch (err) {
        console.error("Failed to fetch images:", err);
      }
    };

    fetchImages();
  }, []);

  const topImages = images.slice(0, 10);

  return (
    <Box
      sx={{ bgcolor: "black", color: "white", minHeight: "100vh" }}
      id="home"
      className="pt-10 lg:pt-0"
    >
      {/* HERO SECTION */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          px: { xs: 3, md: 10 },
          py: { xs: 8, md: 12 },
        }}
      >
        {/* Text Left */}
        <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" } }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: "semibold",
              fontSize: { xs: 26, sm: 42, md: 58 },
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            TURN YOUR SKIN <br /> INTO A CANVAS
            <br /> WITH{" "}
            <span
              sx={{
                fontWeight: "bold",
                fontSize: { xs: 32, sm: 48, md: 64 },
                mb: 2,
                lineHeight: 1.2,
              }}
              style={{ color: "#ff4081" }}
            >
              LEE TATTOOS
            </span>
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "grey.400", mb: 4, fontSize: { xs: 14, md: 18 } }}
          >
            Individual style, limitless creativity: your story on the skin
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: "white",
              color: "white",
              px: { xs: 2, sm: 3, md: 4 }, // horizontal padding: smaller on mobile
              py: { xs: 0.5, sm: 1, md: 1 }, // vertical padding
              fontSize: { xs: 12, sm: 14, md: 16 }, // smaller font on mobile
              "&:hover": {
                bgcolor: "white",
                color: "black",
              },
            }}
          >
            Make an Appointment
          </Button>
        </Box>

        {/* Hero Image Right */}
<Box
  sx={{
    flex: 1,
    mt: { xs: 6, md: 0 },
    display: "flex",
    justifyContent: "center",
    position: "relative", // needed for overlay
  }}
>
  {/* Hero Image */}
  <img
    src="/images/hero.png"
    alt="Tattoo Hero"
    style={{
      maxWidth: "90%",
      borderRadius: "12px",
      objectFit: "cover",
      display: "block",
    }}
  />

  {/* Black smoky overlay at bottom */}
  <Box
    sx={{
      position: "absolute",
      bottom: 0,
      left: "5%",
      width: "90%",
      height: "40%", // how much smoke you want
      borderRadius: "0 0 12px 12px",
      background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
      pointerEvents: "none", // keeps it non-interactive
    }}
  />
</Box>

      </Box>

      {/* ABOUT US SECTION */}
      <div
        className="px-6 md:px-20 py-12 md:py-20 bg-gray-50 text-black"
        id="about-us"
      >
        <div className="flex flex-wrap items-start gap-12">
          {/* Left Column: Text */}
          <div className="w-full sm:w-1/2 sm:flex-1 order-1">
            <div className="my-12">
              <h2 className="text-2xl md:text-3xl text-black font-bold font-serif mb-2">
                01 About Us
              </h2>
              <div className="w-16 h-0.5 bg-black"></div>
            </div>

            <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
              At <strong>Lee Tattoos</strong>, every masterpiece begins with
              passion. Our studio was created to merge art, individuality, and
              expression — turning your vision into ink that lasts a lifetime.
              Founded with a commitment to excellence, we've become a trusted
              destination for those seeking authentic artistic expression.
            </p>

            <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
              From a single artist's dream to a trusted studio, we focus on
              unique designs, precision, and client satisfaction. Each tattoo
              tells a story, and we ensure yours is unforgettable.
              Skilled artists brings years of experience and diverse artistic
              backgrounds to create pieces that truly reflect your personality
              and vision.
            </p>

            <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
              We specialize in a wide range of styles including traditional,
              neo-traditional, realism, geometric, watercolor, and custom
              illustrations. Our state-of-the-art facility maintains the highest
              standards of cleanliness and safety, using only premium quality
              inks and sterilized equipment to ensure your health and peace of
              mind.
            </p>

            {/* <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
        Whether it's your first tattoo or another addition to your journey,{" "}
        <strong>Lee Tattoos</strong> delivers creativity, safety, and artistry.
        We believe in building lasting relationships with our clients, taking the time
        to understand your ideas and bringing them to life with meticulous attention to detail.
      </p>

      <p className="text-sm md:text-base text-gray-700 leading-relaxed">
        Our consultation process ensures every design is perfectly tailored to your
        preferences, body placement, and lifestyle. We're not just creating tattoos;
        we're crafting memories, celebrating milestones, and helping you express your
        unique story through the timeless art of tattooing. Visit us today and discover
        why <strong>Lee Tattoos</strong> is where art meets skin in perfect harmony.
      </p> */}
          </div>

          {/* Right Column: Images */}
          <div className="w-full sm:w-1/2 sm:flex-1 order-2">
            <div className="flex flex-col gap-4 h-full">
              {/* Big Image */}
              <div className="flex gap-2">
                <img
                src="/images/demo.jpg"
                className="w-full h-48 sm:h-56 md:h-72 object-cover rounded-lg shadow-lg"
              />
              <img
                  src="/images/studio.jfif"
                  className="flex-1 h-48 sm:h-56 md:h-72 object-cover rounded-lg shadow-md"
                />
              </div>

              {/* Two Small Images */}
              <div className="flex flex-col sm:flex-row gap-4">
                <img
                  src="/images/ink.jfif"
                  className="flex-1 h-60 object-cover rounded-lg shadow-md"
                />
                <img
                  src="/images/artist.jfif"
                  className="flex-1 h-60 object-cover rounded-lg shadow-md"
                />
                <img
                  src="/images/inks.jfif"
                  className="flex-1 h-60 object-cover rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GALLERY SECTION */}
      <div className="px-6 md:px-20 py-12 md:py-20 bg-black" id="gallery">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="my-12 flex flex-col items-center text-center">
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">
              02 GALLERY
            </h2>

            <p className="text-gray-400 text-sm max-w-md mb-2">
              Explore our collection of stunning tattoo designs created by our
              talented artists. Each piece tells a unique story and showcases
              our commitment to artistic excellence.
            </p>
            <div className="w-16 h-0.5 bg-white mb-4"></div>
          </div>

          {/* Gallery Wall Layout with consistent spacing */}
          <div className="grid grid-cols-12 gap-4 auto-rows-min">
            {/* Row 1 */}
            {topImages[0] && (
              <div className="col-span-6 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3]">
                <img
                  src={topImages[0].url}
                  alt={topImages[0].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-sm font-semibold text-center px-3">
                    {topImages[0].title}
                  </h3>
                </div>
              </div>
            )}

            {topImages[1] && (
              <div className="col-span-6 md:col-span-3 group relative overflow-hidden rounded-lg cursor-pointer aspect-square">
                <img
                  src={topImages[1].url}
                  alt={topImages[1].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-sm font-semibold text-center px-3">
                    {topImages[1].title}
                  </h3>
                </div>
              </div>
            )}

            {topImages[2] && (
              <div className="col-span-12 md:col-span-5 group relative overflow-hidden rounded-lg cursor-pointer aspect-[5/3]">
                <img
                  src={topImages[2].url}
                  alt={topImages[2].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-sm font-semibold text-center px-3">
                    {topImages[2].title}
                  </h3>
                </div>
              </div>
            )}

            {/* Row 2 */}
            {topImages[3] && (
              <div className="col-span-6 md:col-span-3 group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/4]">
                <img
                  src={topImages[3].url}
                  alt={topImages[3].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-sm font-semibold text-center px-3">
                    {topImages[3].title}
                  </h3>
                </div>
              </div>
            )}

            {topImages[4] && (
              <div className="col-span-6 md:col-span-5 group relative overflow-hidden rounded-lg cursor-pointer aspect-[5/4]">
                <img
                  src={topImages[4].url}
                  alt={topImages[4].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-sm font-semibold text-center px-3">
                    {topImages[4].title}
                  </h3>
                </div>
              </div>
            )}

            {topImages[5] && (
              <div className="col-span-12 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer aspect-square">
                <img
                  src={topImages[5].url}
                  alt={topImages[5].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-sm font-semibold text-center px-3">
                    {topImages[5].title}
                  </h3>
                </div>
              </div>
            )}

            {/* Row 3 */}
            {topImages[6] && (
              <div className="col-span-6 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/5]">
                <img
                  src={topImages[6].url}
                  alt={topImages[6].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-sm font-semibold text-center px-3">
                    {topImages[6].title}
                  </h3>
                </div>
              </div>
            )}

            {topImages[7] && (
              <div className="col-span-6 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3]">
                <img
                  src={topImages[7].url}
                  alt={topImages[7].title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
                  <h3 className="text-white text-sm font-semibold text-center px-3">
                    {topImages[7].title}
                  </h3>
                </div>
              </div>
            )}

            {/* Explore More Card */}
            <div className="col-span-12 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 hover:border-neutral-500 transition-all duration-300 aspect-square">
              <Link href={`user/designs`}>
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="w-12 h-12 mb-4 rounded-full bg-white bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
                    <svg
                      className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2 group-hover:text-gray-200 transition-colors duration-300">
                    View More
                  </h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                    Explore Gallery
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* STAGES OF WORK SECTION */}
<Process/>

      {/* FREQUENTLY ASKED QUESTIONS SECTION */}
      <div
        className="px-6 md:px-20 py-12 md:py-20 bg-black text-white"
        id="faq"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center my-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              04 Frequently Asked Questions
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Get answers to the most common questions about our tattoo
              services, process, and aftercare to help you make informed
              decisions.
            </p>
            <div className="w-20 h-0.5 bg-white mx-auto mt-6"></div>
          </div>

          {/* FAQ Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FAQ 1 */}
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">
                How much does a tattoo cost?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Tattoo pricing varies based on size, complexity, placement, and
                time required. We offer free consultations to provide accurate
                quotes. Usually tattoos start from 400 rupees per inch.
              </p>
            </div>

            {/* FAQ 2 */}
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">
                How long does the healing process take?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Complete healing takes 4-6 weeks. The initial healing phase
                (surface) takes about 2 weeks, while deeper layers continue
                healing. Follow our aftercare instructions carefully for optimal
                results and vibrant colors.
              </p>
            </div>

            {/* FAQ 3 */}
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">
                Can I bring my own design?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Absolutely! We encourage clients to bring their ideas, reference
                images, or custom designs. We will work with you to
                refine and adapt your design to work perfectly as a tattoo on
                your chosen placement.
              </p>
            </div>

            {/* FAQ 4 */}
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">
                What should I do before getting a tattoo?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Get a good night's sleep, eat a proper meal, stay hydrated,
                avoid alcohol for 24 hours, and wear comfortable clothing that
                provides easy access to the tattoo area and
                arrive on time.
              </p>
            </div>

            {/* FAQ 5 */}
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">
                Do you offer touch-ups?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Yes, we provide free touch-ups within the first month if
                needed (provided proper aftercare was followed). We stand behind
                our work and want you to be completely satisfied with your
                tattoo.
              </p>
            </div>

            {/* FAQ 6 */}
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
              <h3 className="text-xl font-bold mb-3 text-white">
                How do I book an appointment?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                You can book an appointment by clicking on <Link href="">Book an appointment</Link>, call us directly, or visit our
                studio. We recommend scheduling consultations 1-2 weeks in
                advance.
              </p>
            </div>
          </div>

          {/* Bottom Call-to-Action */}
          <div className="text-center mt-12 pt-8 border-t border-neutral-800">
            <h3 className="text-2xl font-bold my-4 text-white">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Don't see your question answered? We're here to help! Contact us
              directly or schedule a free consultation to discuss your tattoo
              ideas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300">
                Schedule Consultation
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* feedback */}
      <div>
        <Feedback/>
      </div>
    </Box>
  );
};

export default HeroPage;
