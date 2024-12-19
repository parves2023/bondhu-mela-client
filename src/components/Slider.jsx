import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Typewriter } from "react-simple-typewriter"; // Import useTypewriter hook

// Import images
import banner3 from "../assets/banner1.jpg";
import banner2 from "../assets/banner2.jpg";
import banner1 from "../assets/banner.jpg";

const Slider = () => {
  const banners = [
    {
      image: banner1,
      heading: "Connect Seamlessly",
      text: "আমাদের প্ল্যাটফর্মে নতুন বন্ধুত্ব তৈরি করুন এবং সবার সাথে সংযুক্ত থাকুন।",
    },
    {
      image: banner2,
      heading: "Share Your Story",
      text: "আপনার অনুভূতি শেয়ার করুন, মনের কথা বলুন এবং সম্পর্ক আরও গভীর করুন।",
    },
    {
      image: banner3,
      heading: "Stay Together",
      text: "বন্ধু, পরিবার এবং প্রিয়জনদের সাথে একই প্ল্যাটফর্মে সহজেই সংযোগ করুন।",
    },
  ];

  return (
    <div className="w-full h-[45vh] md:h-[35rem] container mx-auto">
      <Carousel
        showArrows
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        className="text-center"
      >
        {banners.map((banner, index) => {
          const { text } = banner;

          return (
            <div key={index} className="relative h-full">
              {/* Background Image */}
              <img
                src={banner.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-[45vh] md:h-[35rem] object-cover brightness-50 rounded-2xl"
              />

              {/* Centered Text with Typewriter Effect */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center">
                {/* Typewriter Effect for Heading */}
                <h2 className="text-3xl md:text-5xl font-bold">
                  Always <br />
                  <span>  
                    <Typewriter
                      words={[
                        banners[0].heading,
                        banners[1].heading,
                        banners[2].heading,
                      ]}
                      loop={Infinity} // Infinite looping
                      cursor
                      cursorStyle="🖋️❣" // Pen icon as cursor
                      typeSpeed={100} // Faster typing speed
                      deleteSpeed={70} // Faster deletion speed
                      delaySpeed={1000} // Shorter delay between word transitions
                    />
                  </span>
                </h2>
                <p className="mt-4 text-lg md:text-xl text-green-300">{text}</p>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Slider;
