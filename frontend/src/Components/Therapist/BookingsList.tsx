import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingAppointments } from "../../Redux/Store/Slices/therapistSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { unwrapResult } from "@reduxjs/toolkit";

interface Booking {
    id: string;
    user: {
        name: string;
        email: string;
        mobile: string;
    };
    slot: string;
    status: string;
}

function BookingsList() {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { therapistId } = useParams<{ therapistId: string }>();

    const { bookings, loading, error, totalPages } = useSelector((state: RootState) => state.therapist);

    const [bookingData, setBookingData] = useState<Booking[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);

    useEffect(() => {
        if (therapistId) {
            dispatch(fetchBookingAppointments({ therapistId, page: currentPage, limit: 6 }))
                .then((result) => {
                    const data = unwrapResult(result);
                    setBookingData(data.bookings);
                })
                .catch((err) => console.log(err));
        }
    }, [therapistId, dispatch, currentPage]);

    const handleViewBooking = (bookingId: string) => {
        navigate(`/therapist/booking_details/${bookingId}`, { state: { therapistId } });
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    if (loading) {
        return <p>Loading bookings...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Appointments</h2>

                {/* Booking list */}
                {Array.isArray(bookings) && bookings.length === 0 ? (
                    <p className="text-center">No bookings found.</p>
                ) : (
                    Array.isArray(bookings) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="border border-gray-300 shadow-lg rounded-lg p-4 bg-white"
                                >
                                    <div className="flex flex-col">
                                        <div className="mb-4">
                                            <p className="text-lg">
                                                Client: <span className="font-bold">{booking.user.name}</span>
                                            </p>
                                            <p className="text-lg">
                                                Client email:{" "}
                                                <span className="font-bold">{booking.user.email}</span>
                                            </p>
                                            <p className="text-lg">
                                                Client mobile:{" "}
                                                <span className="font-bold">{booking.user.mobile}</span>
                                            </p>
                                            <p className="text-gray-600 font-bold">
                                                Date:{" "}
                                                <span className="text-red-500">
                                                    {new Date(booking.slot).toLocaleDateString("en-GB", {
                                                        timeZone: "UTC",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                                , Time:{" "}
                                                <span className="text-red-500">
                                                    {new Date(booking.slot).toLocaleTimeString("en-GB", {
                                                        timeZone: "UTC",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        hour12: false,
                                                    })}
                                                </span>
                                            </p>

                                            <p
                                                className={`text-gray-600 font-bold ${
                                                    booking.status === "scheduled"
                                                        ? "text-blue-500"
                                                        : booking.status === "completed"
                                                        ? "text-green-500"
                                                        : booking.status === "cancelled"
                                                        ? "text-red-500"
                                                        : "text-gray-600"
                                                }`}
                                            >
                                                Status: {booking.status}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleViewBooking(booking.id)}
                                            className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-full hover:bg-blue-600 transition"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <p>
                        Page {currentPage} of {totalPages}
                    </p>
                    <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingsList;
