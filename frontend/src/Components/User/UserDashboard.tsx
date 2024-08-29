import React, { useState } from "react";
import familyImg from "../../../Public/banner/family_therapy.jpg";
import individualImg from "../../../Public/banner/individual_therapy.jpg"
import childImg from '../../../Public/banner/child_therapy.jpg'
import coupleImg from '../../../Public/banner/couple_therapy.jpg'

function Dashboard() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    }
    return (
        <div className="p-6">
            <section className="mb-16">
                <h2 className="text-2xl font-bold">Welcome back</h2>
                <p>Manage your sessions here</p>
            </section>

            <section className="mb-16">
                <h2 className="text-2xl font-bold">Select your therapy</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="relative">
                        <img src={familyImg} alt="image1" className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
                                Family Therapy
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <img src={individualImg} alt="image2" className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
                                Individual Therapy
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <img src={childImg} alt="image3" className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
                                Child Therapy
                            </span>
                        </div>
                    </div>

                    <div className="relative">
                        <img src={coupleImg} alt="image4" className="w-full h-auto rounded-lg" />
                        <div className="absolute inset-0 flex items-end justify-center">
                            <span className="text-white font-bold text-lg bg-black bg-opacity-50 px-3 py-1 rounded">
                                Couple Therapy
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-bold text-center">MindfulHaven FAQs</h2>
                
                <ul className="list-none pl-0 mt-4 flex flex-col items-center mx-auto">
                    {[
                        {
                            question:"How many times per month can I see my therapists?",
                            answer: "You can see your therapist up to 4 times per month depending on your subscription plan"
                        },
                        {
                            question: "Does MindfulHaven provide family therapy?",
                            answer: "Yes, MindfulHaven offers a range of therapies including family therapy"
                        },
                        {
                            question: "What if I don't like the therapists?",
                            answer: "You can choose a different therapist at any time through your dashboard"
                        }
                    ].map((faq, index) => (
                        <li key={index} className="mb-4">
                            <button className="w-full text-left text-lg font-semibold focus:outline-none" onClick={() => toggleFAQ(index)}>{faq.question}

                            </button>
                            {activeIndex === index && (
                                <p className="mt-2 pl-4 text-gray-700">{faq.answer}</p>
                            )}
                        </li>
                    ))}
                </ul>
                
            </section>
        </div>
    )
}

export default Dashboard;