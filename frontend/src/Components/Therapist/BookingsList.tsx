import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchBookingAppointments, joinTherapistVideo, cancelAppointmentByTherapist } from "../../Redux/Store/Slices/therapistSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

type TabType = 'upcoming' | 'completed' | 'cancelled';

function BookingsList() {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const { therapistId } = useParams<{ therapistId: string }>();

    const { bookings, loading, error } = useSelector((state: RootState) => state.therapist);

    const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [itemsPerPage] = useState<number>(6);
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');



    useEffect(() => {
        if (therapistId) {
            dispatch(fetchBookingAppointments({ therapistId, page: currentPage, limit: 100 }))
                .then((result) => {
                    const data = unwrapResult(result);
                    filterBookings(data.bookings);
                })
                .catch((err) => console.log(err));
        }
    }, [therapistId, dispatch, currentPage, activeTab, itemsPerPage]);



    useEffect(() => {
        if (bookings) {
            filterBookings(bookings);
        }
    }, [bookings, activeTab]);



    const filterBookings = (allBookings: Booking[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = allBookings.filter(booking => {
            const bookingDate = new Date(booking.slot);
            switch (activeTab) {
                case 'upcoming':
                    return bookingDate >= today && booking.status === 'scheduled';
                case 'completed':
                    return booking.status === 'completed';
                case 'cancelled':
                    return booking.status === 'cancelled';
                default:
                    return false;
            }
        });

        setFilteredBookings(filtered);
    };

    const handleViewBooking = async (bookingId: string) => {
        try {
            if (!therapistId) {
                throw new Error("Therapist ID is missing.");
            }

            const bookingDetails = await dispatch(joinTherapistVideo({ bookingId, therapistId }));
            const roomId = bookingDetails.payload?.data.roomId;

            if (!roomId) {
                throw new Error("Room ID not found for this booking.")
            }

            navigate(`/therapist/therapist_video_call/${roomId}`, { state: { therapistId } });
        } catch (error) {
            console.error("Failed to retrieve room Id:", error);
        }
    };


    const ConfirmCancelToast = ({ onConfirm, closeToast }: { onConfirm: () => void; closeToast: () => void }) => (
        <div>
            <p>Do you really want to cancel this appointment?</p>
            <button
                onClick={() => {
                    onConfirm();
                    closeToast();
                }}
                style={{
                    width: '120px',
                    padding: '10px',
                    background: 'green',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    marginRight: '20px',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'darkgreen')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'green')}
            >
                Yes
            </button>
            <button
                onClick={closeToast}
                style={{
                    width: '120px',
                    padding: '10px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'darkred')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'red')}
            >
                No
            </button>
        </div>
    );


    const handleCancelAppointment = async (bookingId: string) => {
        const showConfirmationToast = () => {
            toast(
                ({ closeToast }) => (
                    <ConfirmCancelToast
                        onConfirm={async () => {
                            try {
                                const result = await dispatch(cancelAppointmentByTherapist({ bookingId }));

                                if (result) {
                                    toast.success("Appointment cancelled successfully!", {
                                        position: "top-right",
                                        autoClose: 5000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                    });

                                    if (therapistId)
                                        dispatch(fetchBookingAppointments({
                                            therapistId,
                                            page: currentPage,
                                            limit: 20
                                        }));
                                }
                            } catch (error) {
                                toast.error("Failed to cancel the appointment.", {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                });
                                console.error("Error cancelling appointment:", error);
                            }
                        }}
                        closeToast={closeToast}
                    />
                ),
                {
                    position: "top-right",
                    autoClose: false,
                    closeOnClick: false,
                    draggable: false,
                    hideProgressBar: true,
                }
            );
        };
        // Call the custom confirmation toast
        showConfirmationToast();
    };



    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        };
    }

    const paginatedBookings = filteredBookings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-green-500"></div>
        </div>
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-7xl p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Appointments</h2>

                {/* Tabs */}
                <div className="flex space-x-4 mb-6">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`py-2 px-4 rounded ${activeTab === 'upcoming' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Upcoming
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`py-2 px-4 rounded ${activeTab === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Completed
                    </button>
                    <button
                        onClick={() => setActiveTab('cancelled')}
                        className={`py-2 px-4 rounded ${activeTab === 'cancelled' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        Cancelled
                    </button>
                </div>

                {/* Booking list */}
                {paginatedBookings.length === 0 ? (
                    <p className="text-center">No {activeTab} bookings found.</p>
                ) : (
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
                                            Client email: <span className="font-bold">{booking.user.email}</span>
                                        </p>
                                        <p className="text-lg">
                                            Client mobile: <span className="font-bold">{booking.user.mobile}</span>
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
                                            className={`text-gray-600 font-bold ${booking.status === "scheduled"
                                                ? "text-blue-500"
                                                : booking.status === "completed"
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                                }`}
                                        >
                                            Status: {booking.status}
                                        </p>
                                    </div>
                                    {booking.status === "scheduled" && (
                                        <div className="flex flex-col space-y-2 mt-4">
                                            <button
                                                onClick={() => handleViewBooking(booking._id)}
                                                className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-full hover:bg-green-600 transition"
                                            >
                                                Attend Video
                                            </button>
                                            <button
                                                onClick={() => handleCancelAppointment(booking._id)}
                                                className="w-full bg-red-500 text-white font-bold py-2 px-4 rounded-full hover:bg-red-600 transition"
                                            >
                                                Cancel Appointment
                                            </button>
                                        </div>

                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
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