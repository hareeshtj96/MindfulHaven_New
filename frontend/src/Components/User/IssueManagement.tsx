import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { useNavigate } from "react-router-dom";
import { submitIssue } from "../../Redux/Store/Slices/userSlice";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactStars from "react-rating-stars-component";
import { useSearchParams } from 'react-router-dom';

const IssueManagement: React.FC = () => {
    const [showYesForm, setShowYesForm] = useState(false);
    const [showNoForm, setShowNoForm] = useState(false);
    const [issueDescription, setIssueDescription] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const [rating, setRating] = useState(0);
    const [isSatisfied, setIsSatisfied] = useState<boolean | null>(null); 
    const [searchParams] = useSearchParams();

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const user = useSelector((state: RootState) => state.user.user);
    const roomId = searchParams.get('roomId');

    console.log('Room ID:', roomId);

    const handleSatisfactionClick = (satisfied: boolean) => {
        setIsSatisfied(satisfied);

        if (satisfied) {
            setShowYesForm(true); 
            setShowNoForm(false);
        } else {
            setShowNoForm(true); 
            setShowYesForm(false);
        }
    }

    const handleSubmitIssue = async () => {
        if (!issueDescription || (isSatisfied === false && !category) || rating === 0) {
            setError('Please provide a category and description.');
            return;
        }

        const issueData = {
            userId: user?.userId || "undefined",
            bookingId: roomId,
            description: issueDescription,
            category: category,
            status: 'pending',
            rating: rating
        };

        if (isSatisfied === false && category) {
            issueData.category = category;
        } else if (isSatisfied === true) {
            issueData.category = 'general'
        }

        try {
            const resultAction = await dispatch(submitIssue(issueData));

            if (submitIssue.fulfilled.match(resultAction)) {
                toast.success('Your issue has been submitted successfully', {
                    onClose: () => navigate('/sessions')
                });
            } else {
                toast.error('Failed to submit issue');
            }
        } catch (error) {
            toast.error('An error occurred while submitting the issue. Please try again.');
        } finally {
            // Reset form and navigate to the sessions page
            setShowYesForm(false);
            setShowNoForm(false);
            setIssueDescription('');
            setCategory('');
            setRating(0);
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
                        >Yes</button>

                        <button
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded"
                            onClick={() => handleSatisfactionClick(false)}
                        >No</button>
                    </div>
                </div>

                {/* Form for "Yes" - Rating and Feedback */}
                {showYesForm && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Rate the session</h3>

                        {/* Rating Component */}
                        <div className="mb-4">
                            <ReactStars
                                count={5}
                                value={rating}
                                onChange={(newRating: any) => setRating(newRating)}
                                size={24}
                                activeColor="#ffd700"
                            />
                        </div>

                        {/* Feedback */}
                        <textarea
                            value={issueDescription}
                            onChange={(e) => setIssueDescription(e.target.value)}
                            placeholder="Please leave your feedback"
                            className="w-full p-2 border rounded mb-4"
                            rows={4}
                        ></textarea>

                        {error && <p className="text-red-500 mb-4">{error}</p>}

                        <button
                            onClick={handleSubmitIssue}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded w-full"
                        >Submit Feedback</button>
                    </div>
                )}

                {/* Form for "No" - Category, Feedback, and Rating */}
                {showNoForm && (
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-4 text-gray-900">Please describe the issue</h3>

                        {/* Category */}
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

                        {/* Feedback */}
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
    );
}

export default IssueManagement;
