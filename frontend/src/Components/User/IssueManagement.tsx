import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { useNavigate } from "react-router-dom";
import { submitIssue } from "../../Redux/Store/Slices/userSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const IssueManagement: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [issueDescription, setIssueDescription] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user.user);
    console.log("user...", user);
    const bookingStatus = useSelector((state: RootState) => state.user.appointmentData);
    console.log("appontment data....", bookingStatus);

    const handleSatisfactionClick = (satisfied: boolean) => {
        if (satisfied) {
            navigate('/sessions')
        } else {
            setShowForm(true);
        }
    }

    const handleSubmitIssue =  async () => {
        if (!issueDescription || !category) {
            setError('Please provide a category and description.');
            return;
        }

        const issueData = {
            userId: user?.userId || "undefined",
            therapistId: bookingStatus?.therapistId,
            bookingId: bookingStatus?._id,
            description: issueDescription,
            category: category,
            status: 'pending',
        };

       try {
          const resultAction = await dispatch(submitIssue(issueData));

          if (submitIssue.fulfilled.match(resultAction)) {
            toast.success('Your issue has been submitted successfully', {
                onClose: () => navigate('/sessions')
            });
          } else {
            toast.error(`Failed to submit issue`)
          }
       } catch (error) {
            toast.error('An error occured while submitting the issue. Please try again.')
       } finally {
            setShowForm(false);
            setIssueDescription('');
            setCategory('');
       }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Are you satisfied with the session?</h2>
                    <p className="text-gray-700 mb-4">Please let us know your feedback.</p>

                    <div className="flex justify-center space-x-4">
                        <button
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded"
                        onClick={() => handleSatisfactionClick(true)}
                        >yes</button>

                        <button
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                        onClick={() => handleSatisfactionClick(false)}
                        >No</button>
                    </div>
                </div>

                {showForm && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Please describe the issue</h3>

                        <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full mb-4 p-2 border-rounded"
                        >
                            <option value="">Select Category</option>
                            <option value="therapist">Therapist</option>
                            <option value="payment">Payment</option>
                            <option value="technical">Technical</option>
                            <option value="other">Other</option>
                        </select>

                        <textarea
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        placeholder="Describe the issue"
                        className="w-full p-2 border rounded mb-4"
                        rows={4}
                        ></textarea>

                        {error && <p className="text-red-500 mb-4">{error}</p>}

                        <button
                        onClick={handleSubmitIssue}
                        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded w-full"
                        >Submit Issue</button>
                    </div>
                )}

            </div>
            <ToastContainer 
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
            />
        </div>
    )
}

export default IssueManagement;