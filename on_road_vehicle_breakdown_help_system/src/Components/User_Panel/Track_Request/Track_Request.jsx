import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../AuthContext/AuthContext";
import "./Track_Request.css";
import { Atom } from "react-loading-indicators";

function Track_Request() {
  const { token } = useContext(AuthContext); 
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; // ek page par kitne records dikhane hain

  // ✅ Fetch user bookings on mount
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return; 
      setLoading(true);
      try {
        const res = await fetch("http://localhost:8080/api/bookings/bookings/user", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        const data = await res.json();

        if (res.ok) {
          setBookings(data.data || []); 
        } else {
          alert(data.message || "Failed to fetch bookings");
        }
      } catch (err) {
        console.error(err);
        alert("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  // ✅ Pagination calculations
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
        <p>No requests found.</p>
      ) : (
        <div className="track-request-container">
          <div className="track-request-card">
            <h2 className="card-title">Your Requests</h2>

            <div className="requests-table-wrapper">
              <table className="requests-table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Service Type</th>
                    <th>Date</th>
                    <th>Mechanic</th>
                    <th>Phone</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>#{booking._id}</td>
                      <td>{booking.serviceName}</td>
                      <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                      <td style={{ textAlign: "center" }}>
                        {booking.assignedMechanic?.name || "-"}
                      </td>
                      <td style={{ textAlign: "center" }}>
                        {booking.assignedMechanic?.phone || "-"}
                      </td>
                      <td className={`status ${booking.status?.toLowerCase()}`}>
                        {booking.status || "Pending"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ✅ Pagination controls */}
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
        </div>
      )}
    </>
  );
}

export default Track_Request;
