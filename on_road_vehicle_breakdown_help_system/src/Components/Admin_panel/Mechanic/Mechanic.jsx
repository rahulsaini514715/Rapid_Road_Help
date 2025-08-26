import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Mechanic.css";
import { Atom } from "react-loading-indicators";

const AssignGarage = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [garageInputs, setGarageInputs] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false); // ✅ Loading state
  const itemsPerPage = 8; // ✅ Show only 8 bookings per page

  // ✅ Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true); // start loading
      const res = await axios.get(
        "http://localhost:8080/api/bookings/getAllBookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      let data = [];
      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data.data) {
        data = res.data.data;
      }

      // ✅ Filter: Sirf wahi bookings jisme assignedMechanic pending hai
      const pending = data.filter(
        (b) => !b.assignedMechanic || !b.assignedMechanic.name
      );

      setBookings(pending);
    } catch (err) {
      console.error("Error fetching bookings:", err.response?.data || err.message);
      toast.error("🚨 Failed to fetch bookings!");
    } finally {
      setLoading(false); // stop loading
    }
  };

  useEffect(() => {
    if (token) fetchBookings();
  }, [token]);

  // ✅ Assign garage handler
  const handleAssignGarage = async (bookingId) => {
    const garageId = garageInputs[bookingId];
    if (!garageId) {
      toast.warning("⚠️ Please enter a garage ID!");
      return;
    }

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:8080/api/bookings/assignGarage/${bookingId}`,
        { garageId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Garage assigned successfully!");

      // ✅ Re-fetch bookings after assignment
      fetchBookings();
    } catch (err) {
      console.error("Error assigning garage:", err.response?.data || err.message);
      toast.error("🚨 Failed to assign garage!");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = bookings.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(bookings.length / itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <>
    {loading ? (
        <div className="loader-overlay">
          <Atom color="#a35b81ff" size="large" text="" textColor="" />
          
        </div>
      ) : bookings.length === 0 ? (
        <p className="no-bookings">No pending bookings found.</p>
      ) : (
    <div className="mechanic-container">
      <h2 className="title">📌 Pending Bookings (No Mechanic Assigned)</h2>
      

      
         <div className="table-wrapper">
          <table className="booking-table">
            <thead>
              <tr>
                <th style={{width:"20%"}}>Booking ID</th>
                <th style={{width:"10%"}}>Address</th>
                <th style={{width:"25%"}}>Garage</th>
                <th style={{width:"20%"}}>Assign Garage</th>
                <th style={{width:"15%"}}>Book Mech</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map((booking) => (
                <tr key={booking._id}>
                  <td>{booking._id}</td>
                  <td>{booking.address || "N/A"}</td>
                  <td>{booking.serviceName || "Not Assigned"}</td>
                  <td>
                    <input
                    style={{width:"80%"}}
                      type="text"
                      placeholder="Enter Garage ID"
                      value={garageInputs[booking._id] || ""}
                      onChange={(e) =>
                        setGarageInputs({
                          ...garageInputs,
                          [booking._id]: e.target.value.trim(),
                        })
                      }
                      className="garage-input"
                    />
                    
                  </td>

                  <td>
                    <button style={{width:"40%"}}
                      onClick={() => handleAssignGarage(booking._id)}
                      className="assign-btn"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>

          {/* ✅ Pagination Controls */}
          <div className="pagination">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="page-btn"
            >
              ⬅ Prev
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="page-btn"
            >
              Next ➡
            </button>
          </div>
        
      
    </div>
    )}
                <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false}  style={{ marginTop: "60px" }}/>

    </>
  );
};

export default AssignGarage;
