import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchScheduledBookingDetails, fetchCompletedBookingDetails, fetchCancelledBookingDetails, clearBookings,  joinSession, cancelAppointment } from "../../Redux/Store/Slices/userSlice";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { Booking } from "../../Redux/Store/Slices/userSlice";
import  DefaultSkeleton  from '../../Components/MaterialUI/Shimmer';
import { ZegoExpressEngine } from "zego-express-engine-webrtc";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';




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
    const navigate = useNavigate();
    const zegoEngineRef = useRef<ZegoExpressEngine | null>(null);
    const { scheduledBookings, cancelledBookings, completedBookings, error, status, totalPages, currentPage, completedCurrentPage, completedTotalPages, cancelledCurrentPage, cancelledTotalPages } = useSelector((state: RootState) => state.user);

    const user = useSelector((state: RootState) => state.user.user)
    console.log("states....", user);

    const userId = user?.userId;
    const name =user?.name;
    
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
                <h4 className="text-lg font-semibold mb-2">Therapist: {booking.therapist.name}</h4>
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

                {booking.status === "scheduled" && (
                <div className="flex justify-end mt-4">
                    <button 
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all mx-2"
                        onClick={() => handleJoinSession(booking._id, userId || "defaultUserId")}
                        
                    >
                        Join
                    </button>

                    <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-all"
                    onClick={() => handleCancelBooking(booking._id, userId || "defaultUserId")}>
                        Cancel Appointment
                    </button>
                   

                </div>
            )}
            </div>
        );
    };


    const getFilteredUpcomingBookings = () => {
        const upcoming =  scheduledBookings.filter(booking => {
            const bookingDate = new Date(booking.slot); 
          
            bookingDate.setMinutes(bookingDate.getMinutes() - (5 * 60 + 30))

            const currentDate = new Date();


            return bookingDate.getTime() > currentDate.getTime(); 
        });
        console.log("filtered upcoming bookings:", scheduledBookings);
        return upcoming;
        
    };

   

    const getCurrentBookings = () => {
        let bookings:any = [];
        switch (activeTab) {
            case 'upcoming':
                bookings = getFilteredUpcomingBookings()
                break;
            case 'completed':
                bookings = completedBookings;
                break;
            case 'cancelled':
                bookings = cancelledBookings;
                break;
            default:
                bookings = [];
                break;
        }
        const startIndex = (currentPage - 1) * limit;
        const endIndex = startIndex + limit;
        return bookings.slice(startIndex, endIndex)
    };

    const currentBookings = getCurrentBookings();

  

    const getTotalPages = () => {
        const totalBookings = activeTab === 'upcoming' ? getFilteredUpcomingBookings().length :
                              activeTab === 'completed' ? completedBookings.length :
                              cancelledBookings.length;
       
        return Math.max(Math.ceil(totalBookings / limit), 1);
    };


    const setCurrentPage = (newPage: number) => {
        const totalPages = getTotalPages();
        const validatedPage = Math.min(Math.max(newPage, 1), totalPages);

        switch (activeTab) {
            case 'upcoming':
                dispatch(fetchScheduledBookingDetails({ page: validatedPage, limit }));
                break;
            case 'completed':
                dispatch(fetchCompletedBookingDetails({ page: validatedPage, limit }));
                break;
            case 'cancelled':
                dispatch(fetchCancelledBookingDetails({ page: validatedPage, limit }));
                break;
            default:
                break;
        }
    };

    
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage)
    }

    // SOCKET CREATION

    let socket: WebSocket | null = null;

    const createSocket = () => {
        if (!socket || socket.readyState === WebSocket.CLOSED) {
           socket = new WebSocket(`ws://${window.location.hostname}:8080`);

            // event handler for successful connection
            socket.onopen = () => {
                console.log("Socket connection established");
                socket?.send('Hello from client');
            }

            // event handler for receiving messages
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('Message received from server:', data);
            }

            // event handler for connection closure
            socket.onclose = (event) => {
                console.log('socket closed:', event);
                setTimeout(createSocket, 1000); 
            }

            // event handler for errors
            socket.onerror = (error) => {
                console.error('Socket error:', error);
            }
        } else {
            console.log('Socket already exists');
        }
    };

   
    const handleJoinSession = async (bookingId: string, userId: string) => {
        try {
            const APP_ID = Number(import.meta.env.VITE_APP_ID) || 12345;
            console.log("App id:", APP_ID);

            const SECRET_URL = import.meta.env.VITE_APP_SERVER_URL || 'wss://webrtc.example.com'
            console.log("app secret:", SECRET_URL);

            // create a socket before joining the session
            createSocket();
           
            const resultAction = await dispatch(joinSession({ bookingId, role:'user', userId }))
            console.log("result action.....", resultAction);

            const { data: { roomId, roomToken }, status } = resultAction.payload;
            const token = roomToken;

            console.log("token..........", token)

            console.log("status......", status);
            console.log("room id:", roomId)

            if (status !== true) {
                throw new Error(`Failed to fetch room details: ${status}`)
            }

            6
            navigate(`/video-call/${roomId}`);
        } catch (error) {
            console.error('Failed to join session:', error);
        }
    }

    const handleEndSession = async () => {
        try {
            // Stop publishing local stream
            if (zegoEngineRef.current) {
                const localVideoRef = document.getElementById('localVideo') as HTMLVideoElement;
                const streamID = `stream_${userId}`;
                
                zegoEngineRef.current.stopPublishingStream(streamID);
                localVideoRef.srcObject = null; // Clear the local video element

                // Logout from the room
                await zegoEngineRef.current.logoutRoom();
                console.log("Successfully left the room");
            }
        } catch (error) {
            console.error('Failed to end session:', error);
        }
    };


    const handleCancelBooking = (bookingId: string, userId: string) => {
        dispatch(cancelAppointment({bookingId, userId}))
            .unwrap()
            .then((response) => {
                toast.success("Appointment cancelled successfully", {position:'top-right', autoClose:3000})
            })
            .catch((error) => {
                toast.error(`Failed to cancel appointment: ${error}`, {
                    position: 'top-right',
                    autoClose: 3000,
                })
            })
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
                    onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                    disabled={currentPage === 1}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <span>Page {currentPage} of {getTotalPages()}</span>
                <button
                    onClick={() => handlePageChange(Math.min(currentPage + 1, getTotalPages()))}
                    disabled={currentPage === getTotalPages()}
                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    Next
                </button>
            </div>


            
        </div>
    );
};

export default Session;
