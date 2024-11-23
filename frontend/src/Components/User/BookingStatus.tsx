import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { useParams } from "react-router-dom";
import { getBookingDetails } from "../../Redux/Store/Slices/userSlice";

const BookingStatus = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const dispatch: AppDispatch = useDispatch();

  const bookingStatus = useSelector(
    (state: RootState) => state.user.appointmentData
  );
  console.log("booking status:", bookingStatus);

  const therapist = useSelector((state: RootState) => {
    const therapistList = [
      ...(state.user.therapists || []),
      ...(state.user.familyTherapists || []),
      ...(state.user.coupleTherapists || []),
      ...(state.user.individualTherapists || []),
    ];

    return therapistList.find(
      (t) =>
        t._id === bookingStatus?.therapistId ||
        t._id === bookingStatus?.data?.therapistId
    );
  });


  // const therapist = useSelector((state: RootState) => {
  //   const therapistList = [
  //     ...(state.user.therapists|| []),
  //     ...(state.user.familyTherapists || []),
  //     ...(state.user.coupleTherapists || []),
  //     ...(state.user.individualTherapists || []),
  //   ];

  //   return therapistList.find(
  //     (t) =>
  //       t._id === bookingStatus?.therapistId ||
  //       t._id === bookingStatus?.data?.therapistId
  //   );
  // });

  
  const loading = useSelector((state: RootState) => state.user.loading);
  const error = useSelector((state: RootState) => state.user.error);

  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingDetails({ bookingId }));
    }
  }, [dispatch, bookingId]);

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-600 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-800 mb-4">Your booking has been confirmed.</p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Booking Details
          </h3>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <p className="mb-2">
              <strong>Booking ID:</strong>{" "}
              {bookingStatus?._id || bookingStatus.data?._id || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Therapist ID:</strong> {therapist?._id || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Name:</strong> {therapist?.name || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {therapist?.email || "N/A"}
            </p>
            <p className="mb-2">
              <strong>Fees:</strong> ₹{(therapist?.fees ?? 0) + 80 || "N/A"}
            </p>
            <div className="mb-2">
              <strong>Date:</strong>{" "}
              {bookingStatus?.slot ?? bookingStatus?.data?.slot
                ? new Date(bookingStatus?.slot ?? bookingStatus?.data?.slot)
                    .toISOString()
                    .split("T")[0]
                : "N/A"}
            </div>

            <div className="mb-2">
              <strong>Time:</strong>{" "}
              {bookingStatus?.slot ?? bookingStatus?.data?.slot
                ? new Date(bookingStatus?.slot ?? bookingStatus?.data?.slot)
                    .toISOString()
                    .split("T")[1]
                    .split(".")[0]
                    .slice(0, 5)
                : "N/A"}
            </div>

            <p className="mb-2">
              <strong>Status:</strong>{" "}
              {bookingStatus?.data?.status ?? bookingStatus?.status ?? "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingStatus;
