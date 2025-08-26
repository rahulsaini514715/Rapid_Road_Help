import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Status_Update.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../AuthContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Atom } from "react-loading-indicators";

const Status_Update = () => {
  const { token } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all"); // status filter
  const [searchId, setSearchId] = useState(""); // search filter
  const itemsPerPage = 5;

  // Fetch bookings
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("http://localhost:8080/api/bookings/getAllBookings", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => toast.error("🚨 Error fetching bookings: " + err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // ✅ Apply filters (status + search by booking id)
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      filterStatus === "all" ? true : b.status === filterStatus;
    const matchesId = b._id.toLowerCase().includes(searchId.toLowerCase().trim());
    return matchesStatus && matchesId;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  // Update booking status
  const handleStatusChange = (id, newStatus) => {
    setLoading(true);
    axios
      .put(
        `http://localhost:8080/api/bookings/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setBookings(
          bookings.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
        );
        toast.success("✅ Status updated to " + newStatus);
      })
      .catch((err) => toast.error("🚨 Error updating status: " + err.message))
      .finally(() => setLoading(false));
  };

  // Delete booking
  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setBookings(bookings.filter((b) => b._id !== id));
        toast.success("🗑 Booking deleted successfully");
      })
      .catch((err) => toast.error("🚨 Error deleting booking: " + err.message))
      .finally(() => setLoading(false));
  };

  // Pagination controls
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <>
      {loading ? (
        <div className="loader-overlay">
          <Atom color="#a35b81ff" size="large" />
        </div>
      ) : (
        <div className="admin-container">
          <h2>Booking Admin Panel</h2>

          {/* ✅ Filters */}
          <div className="filter-container" style={{ marginBottom: "15px" }}>
            {/* Status Filter */}
            <label>Filter by Status: </label>
            <select
            className="filter-select"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // reset page on filter change
              }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="complete">Complete</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Search Filter */}
            <input
              type="text"
              className="search-filter-input"
              placeholder="Search by Booking ID"
              value={searchId}
              onChange={(e) => {
                setSearchId(e.target.value);
                setCurrentPage(1); // reset page when searching
              }}
              style={{ marginLeft: "10px", padding: "5px" }}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Booking Id</th>
                <th>Service Name</th>
                <th>Price</th>
                <th className="address-col">Address</th>
                <th>User</th>
                <th>Status</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.length > 0 ? (
                currentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking._id}</td>
                    <td>{booking.serviceName}</td>
                    <td>{booking.price}</td>
                    <td className="address-col" data-full={booking.address}>
                      {booking.address}
                    </td>
                    <td>
                      {booking.user?.username ||
                        booking.user?.email ||
                        "N/A"}
                    </td>
                    <td>
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(booking._id, e.target.value)
                        }
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="complete">Complete</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <FontAwesomeIcon
                        className="font-awesome-icon"
                        icon={faTrash}
                        onClick={() => handleDelete(booking._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={prevPage} disabled={currentPage === 1}>
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button onClick={nextPage} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>

          <ToastContainer position="top-center" autoClose={3000} />
        </div>
      )}
    </>
  );
};

export default Status_Update;
