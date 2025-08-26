import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext/AuthContext";
import "./History.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Atom } from "react-loading-indicators";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTypewriter, Cursor } from "react-simple-typewriter";
 


const History = () => {
  const { token } = useContext(AuthContext);
  const [completedBookings, setCompletedBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("http://localhost:8080/api/bookings/getHistory", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setCompletedBookings(res.data.data || []);
        toast.success();
      })
      .catch((err) => {
        console.error("Error fetching history:", err);
        toast.error("🚨 Failed to load booking history!");
      })
      .finally(() => setLoading(false));
  }, [token]);

  const filteredBookings = completedBookings.filter((booking) => {
    const term = searchTerm.toLowerCase();
    const user = booking.user ? booking.user.toString() : "";
    return (
      booking.serviceName.toLowerCase().includes(term) ||
      booking.address.toLowerCase().includes(term) ||
      user.toLowerCase().includes(term) ||
      booking.price.toString().includes(term)
    );
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const generatePDF = () => {
    if (filteredBookings.length === 0) {
      toast.warning("⚠️ No data to download!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Booking History", 14, 20);

    const tableColumn = ["Service Name", "Price", "Address", "User", "Date"];
    const tableRows = [];

    filteredBookings.forEach((booking) => {
      const rowData = [
        booking.serviceName,
        booking.price,
        booking.address,
        booking.user || "N/A",
        booking.completedAt ? new Date(booking.completedAt).toLocaleDateString() : "N/A",
      ];
      tableRows.push(rowData);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [40, 40, 40] },
    });

    doc.save("booking_history.pdf");
    toast.success("📄 PDF downloaded!");
  };



    //typing eefect
    const [text] = useTypewriter({
      words: ["Service Name..", "Enter Price...", "Enter Address...","Enter UserId"],
      loop: 0, // infinite loop
      delaySpeed: 1000
    });

  return (
    <>
    
      {loading ? (
        <div className="loader-overlay">
          <Atom color="#b4537d" size="large" text="" textColor="" />
        </div>
      ) : (
        <div className="history-container">
          <h2 style={{ marginBottom: "20px" }}>Booking History</h2>
          <div className="design">
            <input
              type="text"
              placeholder={text}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="History-search-input"
            />

            <button onClick={generatePDF} className="pdf-button">
              Download PDF
            </button>

            <table>
              <thead>
                <tr>
                  <th>Service Name</th>
                  <th>Price</th>
                  <th className="address-col">Address</th>
                  <th>User</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.length > 0 ? (
                  currentBookings.map((booking) => (
                    <tr key={booking._id}>
                      <td>{booking.serviceName}</td>
                      <td>{booking.price}</td>
                      <td className="address-col" data-full={booking.address}>
                        {booking.address}
                      </td>
                      <td>{booking.user || "N/A"}</td>
                      <td>
                        {booking.completedAt
                          ? new Date(booking.completedAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5">No bookings found.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button onClick={prevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </button>
            </div>
          </div>
        
      

      {/* Toastify container */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
    )}
    </>
    
  );
};

export default History;
