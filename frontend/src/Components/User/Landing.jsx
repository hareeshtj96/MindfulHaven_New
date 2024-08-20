import React from "react";
import landingImage from "../../../Public/banner/therapist_landing.jpg";
import stigma from "../../../Public/banner/Stigma.jpg";
import support from "../../../Public/banner/support.jpg";
import equalAccess from "../../../Public/banner/giving equal_access.jpg";
import aboutImg from "../../../Public/banner/About_us.webp";
import individualImg from '../../../Public/banner/individual.svg';
import anxiety from '../../../Public/banner/anxiety.jpeg';
import familyTherapy from '../../../Public/banner/family_therapy.svg';
import childImg from '../../../Public/banner/child.svg';
import coupleImg from '../../../Public/banner/couple.jpg';

function LandingPage() {
  return (
    <div>
      <section className="p-16" style={{ backgroundColor: "#E3F5DC" }}>
        <h1
          className="text-center text-3xl md:text-4xl font-bold"
          style={{ color: "#519638" }}
        >
          Impacting lives
        </h1>
      </section>

      <section className="flex flex-col md:flex-row items-center justify-between p-8">
        <div className="md:w-1/2">
          <img
            src={landingImage}
            alt="Impacting lives"
            className="w-full rounded-lg shadow-md"
          />
        </div>
        <div className="md:w-1/2 text-center md:text-center mt-4 md:mt-0">
          <h2
            className="text-5xl md:text-7xl font-bold"
            style={{ color: "#3A604E" }}
          >
            Your path to therapy, now easily available
          </h2>
        </div>
      </section>

      <section className="flex flex-col items-center justify-between p-8">
        <div className="text-center md:text-center w-full mb-8">
          <h2 className="text-4xl font-bold" style={{ color: "#3A604E" }}>
            What drives Us
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center md:space-x-24">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold" style={{ color: "#3A604E" }}>
              Reducing Stigma
            </h2>
            <img
              src={stigma}
              alt="Image 1"
              className="w-48 h-48 object-cover mt-4"
            />
          </div>

          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold" style={{ color: "#3A604E" }}>
              Providing Support
            </h2>
            <img
              src={support}
              alt="Image 2"
              className="w-48 h-48 object-cover mt-4"
            />
          </div>

          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl font-bold" style={{ color: "#3A604E" }}>
              Giving Equal Access
            </h2>
            <img
              src={equalAccess}
              alt="Image 3"
              className="w-48 h-48 object-cover mt-4"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#E3F5DC] py-8">
        <h2 className="text-center text-black text-3xl font-bold" style={{ color: "#3A604E" }}>
          We provide online care across India
        </h2>
      </section>

      <section className="py-8 px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: "#3A604E" }}>
            About Us
          </h2>

          <img
            src={aboutImg}
            alt="About Us"
            className="mx-auto mb-6 w-full md:w-1/2 h-auto object-cover"
          />

          <p
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "#3A604E" }}
          >
            At MindfulHaven, we connect you with top-tier counselors and
            personalized solutions, offering convenient video calls to support
            your mental wellness journey.
          </p>
        </div>
      </section>

    <section className="bg-[#E3F5DC] py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ color: "#3A604E" }}>
          We are the right provider for your needs
        </h2>
    </section>


    <section className="py-8">
    <div className="flex flex-wrap justify-center items-center gap-4">
        <div className="relative w-48 h-48 md:w-64 md:h-64">
            <img
                src={individualImg}
                alt="Image 1"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center text-white text-base font-bold p-2">
                Individual Therapy
            </div>
        </div>

        <div className="relative w-48 h-48 md:w-64 md:h-64">
            <img
                src={anxiety}
                alt="Image 2"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center text-white text-base font-bold p-2">
                Anxiety Therapy
            </div>
        </div>

        <div className="relative w-48 h-48 md:w-64 md:h-64">
            <img
                src={familyTherapy}
                alt="Image 3"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center text-white text-base font-bold p-2">
                Family Therapy
            </div>
        </div>

        <div className="relative w-48 h-48 md:w-64 md:h-64">
            <img
                src={childImg}
                alt="Image 4"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center text-white text-base font-bold p-2">
                Child Therapy
            </div>
        </div>

        <div className="relative w-48 h-48 md:w-64 md:h-64">
            <img
                src={coupleImg}
                alt="Image 5"
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end justify-center text-white text-base font-bold p-2">
                Couples Therapy
            </div>
        </div>
    </div>
</section>

        

    </div>
  );
}

export default LandingPage;
