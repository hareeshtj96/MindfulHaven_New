import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTherapistProfit } from '../../Redux/Store/Slices/therapistSlice';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Redux/Store/store";
import { Users, Clock, IndianRupee, ChevronRight } from "lucide-react";

function TherapistDashboard() {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();

    const therapist = useSelector((state: RootState) => state.therapist.currentTherapist);
    const therapistId = therapist?.therapistId;
    const { userName, mostBookedHour, totalProfit } = useSelector((state: RootState) => state.therapist);

    useEffect(() => {
        if (therapistId) {
            dispatch(fetchTherapistProfit({ therapistId }));
        }
    }, [dispatch, therapistId]);

    const handleContinue = () => {
        navigate("/therapist/therapist_details", { state: { therapistId } });
    };

    const stats = [
        {
            title: "Frequently Contacting Client",
            value: userName || "N/A",
            icon: Users,
            bgColor: "bg-blue-50",
            iconColor: "text-blue-500",
            borderColor: "border-blue-200",
            hoverBg: "hover:bg-blue-100"
        },
        {
            title: "Most Booked Hour",
            value: mostBookedHour ? `${mostBookedHour}:00` : "N/A",
            icon: Clock,
            bgColor: "bg-emerald-50",
            iconColor: "text-emerald-500",
            borderColor: "border-emerald-200",
            hoverBg: "hover:bg-emerald-100"
        },
        {
            title: "Your Total Profit",
            value: totalProfit ? `₹${totalProfit}` : "₹0",
            icon: IndianRupee,
            bgColor: "bg-purple-50",
            iconColor: "text-purple-500",
            borderColor: "border-purple-200",
            hoverBg: "hover:bg-purple-100"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {stats.map((stat, index) => (
                        <div 
                            key={index}
                            className={`relative overflow-hidden rounded-2xl border ${stat.borderColor} ${stat.bgColor} ${stat.hoverBg} 
                                      transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg p-6`}
                        >
                            {/* Background Decoration */}
                            <div className="absolute right-0 top-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white opacity-10"></div>
                            
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <p className="text-sm font-medium text-gray-600">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor} bg-opacity-50`}>
                                    <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Profile Update Section */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 mb-8">
                    {/* Background Decoration */}
                    <div className="absolute right-0 top-0 -mt-8 -mr-8 h-32 w-32 rounded-full bg-emerald-100 opacity-50"></div>
                    <div className="absolute left-0 bottom-0 -mb-8 -ml-8 h-32 w-32 rounded-full bg-teal-100 opacity-50"></div>
                    
                    <div className="relative p-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-1 bg-emerald-500 rounded-full"></div>
                                <p className="text-sm text-gray-700 font-medium">
                                    Update your profile details here
                                </p>
                            </div>
                            <button
                                onClick={handleContinue}
                                className="group flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white rounded-full 
                                         hover:bg-emerald-600 transition-all duration-300 font-medium 
                                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                Continue
                                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TherapistDashboard;