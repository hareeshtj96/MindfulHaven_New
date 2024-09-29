import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduledBookingDetails, fetchCompletedBookingDetails, fetchCancelledBookingDetails, clearBookings } from "../../Redux/Store/Slices/userSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { Booking } from "../../Redux/Store/Slices/userSlice";
import  DefaultSkeleton  from '../../Components/MaterialUI/Shimmer';

const formatDateTime = (slot: string) => {
    const date = new Date(slot);

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'UTC'
    };

    const dateOptions: Intl.DateTimeFormatOptions = {
        day: 'numeric',        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    };

    const time = date.toLocaleTimeString('en-US', timeOptions);
    const formattedDate = date.toLocaleDateString('en-US', dateOptions);

    return { date: formattedDate, time };
};

const Session = () => {
    const dispatch: AppDispatch = useDispatch();
    const { scheduledBookings, cancelledBookings, completedBookings, error, status, totalPages, currentPage, completedCurrentPage, completedTotalPages, cancelledCurrentPage, cancelledTotalPages } = useSelector((state: RootState) => state.user);

    const states = useSelector((state: RootState) => state.user)
    console.log("states....", states);
    

    // const [upcomingPage, setUpcomingPage] = useState(1);
    // const [completedPage, setCompletedPage] = useState(1);
    // const [cancelledPage, setCancelledPage] = useState(1);

    const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
    const limit = 6;

    useEffect(() => {
        dispatch(clearBookings());

        switch (activeTab) {
            case "upcoming":
                dispatch(fetchScheduledBookingDetails({ page: currentPage, limit }));
                break;
            case "completed":
                dispatch(fetchCompletedBookingDetails({ page: completedCurrentPage, limit }));
                break;
            case "cancelled":
                dispatch(fetchCancelledBookingDetails({ page: cancelledCurrentPage, limit }));
                break;
            default:
                break;
        }
    }, [dispatch, limit, activeTab, currentPage, completedCurrentPage, cancelledCurrentPage]);

    // Show the shimmer loading effect when data is being fetched
    if (status === 'loading') {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Render multiple skeletons for loading state */}
                {Array.from({ length: limit }).map((_, index) => (
                    <DefaultSkeleton key={index} />
                ))}
            </div>
        );
    }
    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    const renderBookingCard = (booking: Booking) => {
        const { date, time } = formatDateTime(booking.slot);

        return (
            <div key={booking._id} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">Therapist ID: {booking.therapistId}</h4>
                <p className="text-gray-600">Booking Id: {booking._id}</p>
                <p className="text-gray-600">Date: {date}</p>
                <p className="text-gray-600">Time: {time}</p>
                <p className={`mt-2 text-sm ${
                    booking.status === "scheduled" ? "text-blue-500" :
                    booking.status === "completed" ? "text-green-500" :
                    "text-red-500"
                }`}>
                    Status: {booking.status}
                </p>
            </div>
        );
    };

   

    const getCurrentBookings = () => {
        switch (activeTab) {
            case 'upcoming':
                return scheduledBookings;
            case 'completed':
                return completedBookings;
            case 'cancelled':
                return cancelledBookings;
            default:
                return [];
        }
    };

    const currentBookings = getCurrentBookings();

    const getCurrentPage = () => {
        switch (activeTab) {
            case 'upcoming':
                return currentPage;
            case 'completed':
                return completedCurrentPage;
            case 'cancelled':
                return cancelledCurrentPage;
            default:
                return 1;
        }
    };

    // Retrieve the total pages based on the active tab
    const getTotalPages = () => {
        switch (activeTab) {
            case 'upcoming':
                return totalPages;
            case 'completed':
                return completedTotalPages;
            case 'cancelled':
                return cancelledTotalPages;
            default:
                return 1;
        }
    };

    const setCurrentPage = (newPage: number) => {
        switch (activeTab) {
            case 'upcoming':
                dispatch(fetchScheduledBookingDetails({ page: newPage, limit }));
                break;
            case 'completed':
                dispatch(fetchCompletedBookingDetails({ page: newPage, limit }));
                break;
            case 'cancelled':
                dispatch(fetchCancelledBookingDetails({ page: newPage, limit }));
                break;
            default:
                break;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 space-y-12">
            {/* Tab Navigation */}
            <div className="flex space-x-4">
                <button onClick={() => setActiveTab('upcoming')} className={`py-2 px-4 rounded ${activeTab === 'upcoming' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    Upcoming
                </button>
                <button onClick={() => setActiveTab('completed')} className={`py-2 px-4 rounded ${activeTab === 'completed' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    Completed
                </button>
                <button onClick={() => setActiveTab('cancelled')} className={`py-2 px-4 rounded ${activeTab === 'cancelled' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
                    Cancelled
                </button>
            </div>

            {/* Render Current Bookings */}
            <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-gray-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Sessions
                </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentBookings.length > 0 ? (
                 currentBookings.map(renderBookingCard)
                ) : (
                    <>
                    {Array.from({ length: limit }).map((_, index) => (
                    <DefaultSkeleton key={index} />
                    ))}
                        <p className="text-gray-500">No {activeTab} sessions.</p>
                    </>
                )}
            </div>
            </div>


            {/* Pagination */}
            <div className="flex justify-between mt-4">
                <button
                    onClick={() => setCurrentPage(Math.max(getCurrentPage() - 1, 1))}
                    disabled={getCurrentPage() === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {getCurrentPage()} of {getTotalPages()}</span>
                <button
                    onClick={() => setCurrentPage(Math.min(getCurrentPage() + 1, getTotalPages()))}
                    disabled={getCurrentPage() === getTotalPages()}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Session;
