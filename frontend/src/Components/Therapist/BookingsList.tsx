import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingAppointments, joinTherapistVideo } from "../../Redux/Store/Slices/therapistSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { unwrapResult } from "@reduxjs/toolkit";

interface Booking {
    _id: string;
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

    const { bookings, loading, error } = useSelector((state: RootState) => state.therapist);
    console.log("bookings...........", bookings)

    const therapist = useSelector((state: RootState) => state)
    console.log("state:", therapist);
    

    const [bookingData, setBookingData] = useState<Booking[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [itemsPerPage] = useState<number>(6);

    useEffect(() => {
        if (therapistId) {
            dispatch(fetchBookingAppointments({ therapistId, page: currentPage, limit: 20 }))
                .then((result) => {
                    const data = unwrapResult(result);

                    const today = new Date();
                    today.setHours(0,0,0,0);
                    

                    const upcomingBookings = data.bookings.filter(booking => {
                        const bookingDate = new Date(booking.slot);
                        return bookingDate >= today;
                    })
                    setBookingData(upcomingBookings);
                    setTotalPages(Math.ceil(upcomingBookings.length / itemsPerPage));
                })
                .catch((err) => console.log(err));
        }
    }, [therapistId, dispatch, currentPage]);



    const handleViewBooking = async (bookingId: string) => {

        try {

            if (!therapistId) {
                throw new Error("Therapist ID is missing.");
            }
            
            console.log("booking id.....", bookingId);
            console.log("therapist id......", therapistId);
            const bookingDetails = await dispatch(joinTherapistVideo({ bookingId, therapistId }))
            console.log("booking details....", bookingDetails);

            const roomId = bookingDetails.payload?.data.roomId;

            if (!roomId) {
                throw new Error("Room ID not found for this booking.")
            }

            navigate(`/therapist/therapist_video_call/${roomId}`, {state: { therapistId }})
        } catch (error) {
            console.error("Failed to retrieve room Id:", error);
        }
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

    const paginatedBookings = bookingData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    console.log("Paginated Bookings:", paginatedBookings);


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
                {Array.isArray(paginatedBookings) && paginatedBookings.length === 0 ? (
                    <p className="text-center">No bookings found.</p>
                ) : (
                    Array.isArray(paginatedBookings) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedBookings.map((booking) => (
                                <div
                                    key={booking._id}
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
                                            onClick={() => handleViewBooking(booking._id)}
                                            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition"
                                        >
                                            Attend
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
