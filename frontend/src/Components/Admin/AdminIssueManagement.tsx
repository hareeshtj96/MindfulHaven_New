import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "../../Redux/Store/store";
import { fetchIssues, resolveIssue } from "../../Redux/Store/Slices/adminSlice";
import Table from "../../Components/Common/Table"
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { button } from "@material-tailwind/react";

interface Issue {
    _id: string;
    userId: string;
    userName: string;
    therapistId: string;
    therapistName: string;
    category: string;
    description: string;
    status: string;
    isActive: boolean;
    bookingId: string;
    rating: number;
}

const AdminIssuesManagement: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  
  const { issues, loading, error } = useSelector(
    (state: RootState) => state.admin as { issues: Issue[]; loading: boolean; error: string | null }
  );
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // Fetch issues on component mount
  useEffect(() => {
    dispatch(fetchIssues())
      .unwrap()
      .catch(() => toast.error("Failed to load issues"));
  }, [dispatch]);

  // Define columns for the table
  const columns = ["User", "Therapist", "Category", "Description",  "Action"];

  const filteredIssues = issues.filter((issue) => !issue.rating)

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);

  const currentData = filteredIssues.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Format data for table
  const data = currentData.map((issue) => ({
    User: issue.userName,
    Therapist: issue.therapistName,
    Category: issue.category,
    Description: issue.description,
    Action: issue.status === "resolved" ? (
        <button
        className="bg-green-500 text-white px-2 py-1 rounded cursor not-allowed disabled"
        >
            Resolved
        </button>
    ) : (
        <button className="bg-red-500 text-white px-2 py-1 rounded"
        onClick={() => handleAction(issue._id, issue.status)}
        >
            Resolve
        </button>
    )
  }))


  // Handle loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Action handler
  const handleAction = (id: string, status: string) => {

    if (status === "resolved") {
        toast.info("The issue has already been resolved.")
        return;
    }
    
    dispatch(resolveIssue(id))
        .unwrap()
        .then(() => {
            toast.success("Issue resolved successfully")
            setTimeout(() => {
              dispatch(fetchIssues());
          }, 500);
        })
        .catch(() => {
            toast.error("Failed to resolve issue")
        })
  }

  // Pagination handler
  const handleNextPage = () => {
   if (currentPage < totalPages ) setCurrentPage(currentPage + 1);
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }


  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">Issues Management</h1>
      
      <Table columns={columns} data={data} />

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
        onClick={handlePreviousPage}
        disabled={currentPage === 1}
        >
            Previous
        </button>
        <p>Page {currentPage} of {totalPages}</p>

        <button
        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded"
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        >
            Next
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default AdminIssuesManagement;
