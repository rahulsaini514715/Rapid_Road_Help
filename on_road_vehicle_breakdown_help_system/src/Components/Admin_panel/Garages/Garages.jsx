import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../AuthContext/AuthContext";
import "../History/History.css";
import "./Garage.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Atom } from "react-loading-indicators";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTypewriter, Cursor } from "react-simple-typewriter";



const GarageHistory = () => {
  const { token } = useContext(AuthContext);
  const [garages, setGarages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [serviceSearch, setServiceSearch] = useState(""); // search by services
  const [addressSearch, setAddressSearch] = useState(""); // search by address
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 5;

  // Fetch garages
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get("http://localhost:8080/api/garages/getGarages", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setGarages(res.data || []);
        toast.success();
      })
      .catch((err) => {
        console.error("Error fetching garages:", err);
        toast.error("🚨 Failed to load garages!");
      })
      .finally(() => setLoading(false));
  }, [token]);

  // Filter garages by services and address
  const filteredGarages = garages.filter((garage) => {
    const serviceTerm = serviceSearch.toLowerCase();
    const addressTerm = addressSearch.toLowerCase();

    const serviceMatch = garage.services?.toLowerCase().includes(serviceTerm);
    const addressMatch = garage.address?.toLowerCase().includes(addressTerm);

    return serviceMatch && addressMatch;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentGarages = filteredGarages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredGarages.length / itemsPerPage);

  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const generatePDF = () => {
  if (filteredGarages.length === 0) {
    toast.warning("⚠️ No data to download!");
    return;
  }

  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text("Garage History Report", 14, 20);
  
  // Date
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

  const tableColumn = [
    "Owner Name",
    "Garage Name",
    "Email",
    "Phone",
    "Address",
    "Services",
    "Created At"
  ];

  const tableRows = filteredGarages.map(garage => [
    garage.ownerName,
    garage.garageName,
    garage.email,
    garage.phone,
    garage.address,
    garage.services,
    garage.createdAt ? new Date(garage.createdAt).toLocaleDateString() : "N/A"
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 35,
    styles: { fontSize: 10, cellPadding: 3, overflow: 'linebreak', valign: 'middle' },
    headStyles: { fillColor: [63, 81, 181], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    columnStyles: {
      4: { cellWidth: 40 }, // Address
      5: { cellWidth: 40 }, // Services
      0: { cellWidth: 25 },
      1: { cellWidth: 25 },
      2: { cellWidth: 40 },
      3: { cellWidth: 25 },
      6: { cellWidth: 20 },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        data.settings.margin.left,
        doc.internal.pageSize.height - 10
      );
    },
  });

  doc.save("garage_history_report.pdf");
  toast.success("📄 PDF downloaded!");
};


 //typing eefect
    const [textservice] = useTypewriter({
      words: ["Enter Service Name.."],
      loop: 0, // infinite loop
      delaySpeed: 1000
    });

        const [textaddress] = useTypewriter({
      words: ["Enter Address..."],
      loop: 0, // infinite loop
      delaySpeed: 1000
    });


  return (
    <>
    
      {loading ? (
        <div className="loader-overlay">
          <Atom color="#a35b81ff" size="large" text="" textColor="" />
          
        </div>
      ) : (
        <div className="history-container">
          <h2 style={{ marginBottom: "20px" }}>All Available Garage</h2>
          <div className="design">
            <div className="search-section">
              <input
                type="text"
                placeholder={textservice}
                value={serviceSearch}
                onChange={(e) => {
                  setServiceSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="Garage-search-input"
              />
              <input
                type="text"
                placeholder={textaddress}
                value={addressSearch}
                onChange={(e) => {
                  setAddressSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="Garage-search-input"
              />
              <button onClick={generatePDF} className="pdf-button">
                Download PDF
              </button>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Garage Id</th>
                  
                  <th>Garage Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="address-col">Address</th>
                  <th>Services</th>
                 
                </tr>
              </thead>
              <tbody>
                {currentGarages.length > 0 ? (
                  currentGarages.map((garage) => (
                    <tr key={garage._id}>
                      <td className="address-col">{garage._id}</td>
                      <td className="address-col">{garage.garageName}</td>
                      <td className="address-col">{garage.email}</td>
                      <td>{garage.phone}</td>
                      <td className="address-col">{garage.address}</td>
                      <td>{garage.services}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No garages found.</td>
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
              <button onClick={nextPage} disabled={currentPage === totalPages || totalPages === 0}>
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

export default GarageHistory;
