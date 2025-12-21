"use client";
import { FaWhatsapp } from "react-icons/fa6";
import { MdOutlineAddIcCall } from "react-icons/md";
import { IoLogoInstagram } from "react-icons/io5";
import { RiFacebookCircleLine } from "react-icons/ri";

const Contact = () => {
  return (
    <>
      <div
        className="px-6 md:px-20 py-12 md:py-20 bg-black text-white"
        id="contact"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center my-12">
            <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4">
              06 Contact Us
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Ready to start your tattoo journey? Get in touch with us through
              your preferred platform or visit our studio for a consultation.
            </p>
            <div className="w-20 h-0.5 bg-white mx-auto mt-6"></div>
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left */}
            <div className="space-y-6">
              <a
                href="tel:+919999999999"
                className="flex items-center gap-4 bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
              >
                <span className="text-xl">
                  <MdOutlineAddIcCall />
                </span>
                <div>
                  <h3 className="text-lg font-bold">Call Us</h3>
                  <p className="text-gray-400">+91 91136 00698</p>
                </div>
              </a>

              <a
                href="https://wa.me/919113600698"
                target="_blank"
                className="flex items-center gap-4 bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
              >
                <span className="text-xl">
                  <FaWhatsapp />
                </span>
                <div>
                  <h3 className="text-lg font-bold">WhatsApp</h3>
                  <p className="text-gray-400">Chat with us instantly</p>
                </div>
              </a>

              <a
                href="https://instagram.com/leeetattoozs"
                target="_blank"
                className="flex items-center gap-4 bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
              >
                <span className="text-xl">
                  <IoLogoInstagram />
                </span>
                <div>
                  <h3 className="text-lg font-bold">Instagram</h3>
                  <p className="text-gray-400">@leeetattoozs</p>
                </div>
              </a>

              <a
                href=""
                target="_blank"
                className="flex items-center gap-4 bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
              >
                <span className="text-xl">
                  <RiFacebookCircleLine />
                </span>
                <div>
                  <h3 className="text-lg font-bold">Facebook</h3>
                  <p className="text-gray-400">Follow us on Facebook</p>
                </div>
              </a>
            </div>

            {/* Map */}
            <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
              <h3 className="text-xl font-bold mb-4">Visit Our Studio</h3>
              <p className="text-gray-400 mb-4">
                Click below to get directions to our tattoo studio.
              </p>

              <a
                href="https://share.google/a5zkQmQL5TdCDdtBY"
                target="_blank"
                className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Open in Google Maps
              </a>

              <div className="mt-6 overflow-hidden rounded-lg border border-neutral-800">
                <iframe
                  src="https://www.google.com/maps?q=Your+Shop+Address&output=embed"
                  className="w-full h-64"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
