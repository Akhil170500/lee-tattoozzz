"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../firebase.config";
import { collection, getDocs } from "firebase/firestore";
import { Box, Typography, Button, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dbqg53ryr/image/upload/";

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
    <Box sx={{ bgcolor: "black", color: "white", minHeight: "100vh" }} id="home">
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
            TURN YOUR SKIN <br /> INTO A CANVAS<br/> WITH <span 
            sx={{
              fontWeight: "bold",
              fontSize: { xs: 32, sm: 48, md: 64 },
              mb: 2,
              lineHeight: 1.2,
            }}
            style={{ color: '#ff4081' }}>LEE TATTOOS</span>
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
          }}
        >
          <img
            src="/images/hero.png" // put your hero image here
            alt="Tattoo Hero"
            style={{
              maxWidth: "90%",
              borderRadius: "12px",
              objectFit: "cover",
            }}
          />
        </Box>
      </Box>

{/* ABOUT US SECTION */}
<div className="px-6 md:px-20 py-12 md:py-20 bg-white text-black" id="about-us">
  <div className="flex flex-wrap items-start gap-12">
    {/* Left Column: Text */}
    <div className="w-full sm:w-1/2 sm:flex-1 order-1">
      <div className="mb-12">
      <h2 className="text-2xl md:text-3xl text-black font-bold font-serif mb-2">
        01 About Us
      </h2>
      <div className="w-16 h-0.5 bg-black"></div>
    </div>

      <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
        At <strong>Lee Tattoos</strong>, every masterpiece begins with passion. Our studio
        was created to merge art, individuality, and expression — turning your
        vision into ink that lasts a lifetime. Founded with a commitment to excellence,
        we've become a trusted destination for those seeking authentic artistic expression.
      </p>

      <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
        From a single artist's dream to a trusted studio, we focus on unique
        designs, precision, and client satisfaction. Each tattoo tells a story,
        and we ensure yours is unforgettable. Our team of skilled artists brings
        years of experience and diverse artistic backgrounds to create pieces that
        truly reflect your personality and vision.
      </p>

      <p className="text-sm md:text-base text-gray-700 mb-4 leading-relaxed">
        We specialize in a wide range of styles including traditional, neo-traditional,
        realism, geometric, watercolor, and custom illustrations. Our state-of-the-art
        facility maintains the highest standards of cleanliness and safety, using only
        premium quality inks and sterilized equipment to ensure your health and peace of mind.
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
        <img
          src="/studio.jpg"
          alt="Tattoo Studio"
          className="w-full h-48 sm:h-56 md:h-72 object-cover rounded-lg shadow-lg"
        />

        {/* Two Small Images */}
        <div className="flex flex-col sm:flex-row gap-4">
          <img
            src="/artist-working.jpg"
            alt="Tattoo Artist"
            className="flex-1 h-32 sm:h-32 md:h-36 object-cover rounded-lg shadow-md"
          />
          <img
            src="/tattoo-client.jpg"
            alt="Tattoo on Client"
            className="flex-1 h-32 sm:h-32 md:h-36 object-cover rounded-lg shadow-md"
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
    <div className="mb-12 flex flex-col items-center text-center">
      <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">
        02 GALLERY
      </h2>
      
      <p className="text-gray-400 text-sm max-w-md mb-2">
        Explore our collection of stunning tattoo designs created by our talented artists. 
        Each piece tells a unique story and showcases our commitment to artistic excellence.
      </p>
      <div className="w-16 h-0.5 bg-white mb-4"></div>
    </div>

    {/* Gallery Wall Layout with consistent spacing */}
    <div className="grid grid-cols-12 gap-4 auto-rows-min">
      
      {/* Row 1 */}
      {topImages[0] && (
        <div className="col-span-6 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3]"
             >
          <img src={topImages[0].url} alt={topImages[0].title} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <h3 className="text-white text-sm font-semibold text-center px-3">{topImages[0].title}</h3>
          </div>
        </div>
      )}
      
      {topImages[1] && (
        <div className="col-span-6 md:col-span-3 group relative overflow-hidden rounded-lg cursor-pointer aspect-square"
             >
          <img src={topImages[1].url} alt={topImages[1].title} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <h3 className="text-white text-sm font-semibold text-center px-3">{topImages[1].title}</h3>
          </div>
        </div>
      )}

      {topImages[2] && (
        <div className="col-span-12 md:col-span-5 group relative overflow-hidden rounded-lg cursor-pointer aspect-[5/3]"
             >
          <img src={topImages[2].url} alt={topImages[2].title} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <h3 className="text-white text-sm font-semibold text-center px-3">{topImages[2].title}</h3>
          </div>
        </div>
      )}

      {/* Row 2 */}
      {topImages[3] && (
        <div className="col-span-6 md:col-span-3 group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/4]"
             >
          <img src={topImages[3].url} alt={topImages[3].title} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <h3 className="text-white text-sm font-semibold text-center px-3">{topImages[3].title}</h3>
          </div>
        </div>
      )}

      {topImages[4] && (
        <div className="col-span-6 md:col-span-5 group relative overflow-hidden rounded-lg cursor-pointer aspect-[5/4]"
             >
          <img src={topImages[4].url} alt={topImages[4].title} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <h3 className="text-white text-sm font-semibold text-center px-3">{topImages[4].title}</h3>
          </div>
        </div>
      )}

      {topImages[5] && (
        <div className="col-span-12 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer aspect-square"
             >
          <img src={topImages[5].url} alt={topImages[5].title} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <h3 className="text-white text-sm font-semibold text-center px-3">{topImages[5].title}</h3>
          </div>
        </div>
      )}

      {/* Row 3 */}
      {topImages[6] && (
        <div className="col-span-6 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/5]"
             >
          <img src={topImages[6].url} alt={topImages[6].title} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <h3 className="text-white text-sm font-semibold text-center px-3">{topImages[6].title}</h3>
          </div>
        </div>
      )}

      {topImages[7] && (
        <div className="col-span-6 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer aspect-[4/3]"
             >
          <img src={topImages[7].url} alt={topImages[7].title} 
               className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity duration-300 flex items-center justify-center">
            <h3 className="text-white text-sm font-semibold text-center px-3">{topImages[7].title}</h3>
          </div>
        </div>
      )}

      {/* Explore More Card */}
        <div className="col-span-12 md:col-span-4 group relative overflow-hidden rounded-lg cursor-pointer bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 hover:border-neutral-500 transition-all duration-300 aspect-square">
        <Link href={`user/designs`}>
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 mb-4 rounded-full bg-white bg-opacity-20 flex items-center justify-center group-hover:bg-opacity-30 transition-all duration-300">
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
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
<div className="px-6 md:px-20 py-12 md:py-20 bg-gray-50" id="process">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-12">
      <h2 className="text-2xl md:text-3xl text-black font-bold font-serif mb-2">
        03 STAGES OF WORK
      </h2>
      <div className="w-16 h-0.5 bg-black"></div>
    </div>

    {/* Stages Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {/* Stage 1: Consultation */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-3 text-black">Consultation</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Communication with the client, clarifying all the details and desires regarding the tattoo, discussing the design, placement, size and other important details.
        </p>
      </div>

      {/* Stage 2: Preparation */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-3 text-black">Preparation of the application site</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Preparation of the skin surface on which the tattoo will be applied using special disinfectants.
        </p>
      </div>

      {/* Stage 3: Template Check */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-3 text-black">Template check</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          If necessary, the tattoo artist makes a template and applies it on the client's skin to optimize the location.
        </p>
      </div>

      {/* Stage 4: Applying Tattoo */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-3 text-black">Applying a tattoo</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          Using a special tattoo device, the tattoo artist applies the tattoo on the client's skin.
        </p>
      </div>

      {/* Stage 5: Completion */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-3 text-black">Completion of the process</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          After the tattoo is finished, the artist disinfects the surface of the skin, applies protective film, and explains care instructions so as to care for the new tattoo.
        </p>
      </div>

      {/* Stage 6: Control Check */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="font-bold text-lg mb-3 text-black">Control check</h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          After a certain time during the healing period, the artist can result, correct any flaws or cosmology, if necessary.
        </p>
      </div>
    </div>

    {/* Reviews Section */}
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pt-8 border-t border-gray-300">
      {/* Left: Reviews Badge */}
      <div className="flex items-center gap-4">
        <div className="bg-black text-white px-6 py-3 rounded-full">
          <span className="font-bold text-lg">96 REVIEWS</span>
        </div>
      </div>

      {/* Right: Artist Info */}
      <div className="flex items-center gap-4 lg:flex-row-reverse">
        <div className="text-right lg:text-left">
          <p className="font-bold text-lg text-black">Alexander Mitchell</p>
          <p className="text-gray-600 text-sm leading-relaxed max-w-md">
            Creative tattoo studio owner and tattoo artist. Has been providing unique tattoos to clients for more than 10 years. Professional and can handle almost all styles and requirements, will discuss and educate your ideas.
          </p>
        </div>
        <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0 overflow-hidden">
          <img 
            src="/artist-profile.jpg" 
            alt="Alexander Mitchell"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  </div>
</div>

{/* FREQUENTLY ASKED QUESTIONS SECTION */}
<div className="px-6 md:px-20 py-12 md:py-20 bg-black text-white" id="faq">
  <div className="max-w-6xl mx-auto">
    {/* Header */}
    <div className="text-center mb-12">
      <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
        04 Frequently Asked Questions
      </h2>
      <p className="text-gray-400 text-lg max-w-2xl mx-auto">
        Get answers to the most common questions about our tattoo services, 
        process, and aftercare to help you make informed decisions.
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
          Tattoo pricing varies based on size, complexity, placement, and time required. 
          We offer free consultations to provide accurate quotes. Small tattoos start 
          from $100, while larger pieces are quoted hourly at $150-200/hour.
        </p>
      </div>

      {/* FAQ 2 */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
        <h3 className="text-xl font-bold mb-3 text-white">
          How long does the healing process take?
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Complete healing takes 4-6 weeks. The initial healing phase (surface) takes 
          about 2 weeks, while deeper layers continue healing. Follow our aftercare 
          instructions carefully for optimal results and vibrant colors.
        </p>
      </div>

      {/* FAQ 3 */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
        <h3 className="text-xl font-bold mb-3 text-white">
          Can I bring my own design?
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Absolutely! We encourage clients to bring their ideas, reference images, 
          or custom designs. Our artists will work with you to refine and adapt 
          your design to work perfectly as a tattoo on your chosen placement.
        </p>
      </div>

      {/* FAQ 4 */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
        <h3 className="text-xl font-bold mb-3 text-white">
          What should I do before getting a tattoo?
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Get a good night's sleep, eat a proper meal, stay hydrated, avoid alcohol 
          for 24 hours, and wear comfortable clothing that provides easy access to 
          the tattoo area. Bring a valid ID and arrive on time.
        </p>
      </div>

      {/* FAQ 5 */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
        <h3 className="text-xl font-bold mb-3 text-white">
          Do you offer touch-ups?
        </h3>
        <p className="text-gray-300 leading-relaxed">
          Yes, we provide free touch-ups within the first 6 months if needed 
          (provided proper aftercare was followed). We stand behind our work 
          and want you to be completely satisfied with your tattoo.
        </p>
      </div>

      {/* FAQ 6 */}
      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors duration-300">
        <h3 className="text-xl font-bold mb-3 text-white">
          How do I book an appointment?
        </h3>
        <p className="text-gray-300 leading-relaxed">
          You can book through our website, call us directly, or visit our studio. 
          We recommend scheduling consultations 1-2 weeks in advance, and tattoo 
          sessions may require 2-4 weeks notice depending on complexity.
        </p>
      </div>

    </div>

    {/* Bottom Call-to-Action */}
    <div className="text-center mt-12 pt-8 border-t border-neutral-800">
      <h3 className="text-2xl font-bold mb-4 text-white">
        Still have questions?
      </h3>
      <p className="text-gray-400 mb-6 max-w-xl mx-auto">
        Don't see your question answered? We're here to help! Contact us directly 
        or schedule a free consultation to discuss your tattoo ideas.
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
    </Box>
  );
};

export default HeroPage;
