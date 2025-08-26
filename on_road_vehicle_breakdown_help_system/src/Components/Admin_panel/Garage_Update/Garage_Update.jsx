import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Garage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../AuthContext/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Atom } from "react-loading-indicators";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTypewriter } from "react-simple-typewriter";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; // optional JS for Bootstrap
import Model_edit from "./Model_edit";

const Garage_Admin = () => {
  const { token } = useContext(AuthContext);
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedGarage, setSelectedGarage] = useState(null);

  // Typing effect
  const [text] = useTypewriter({
    words: ["Search garages...", "Enter garage name...", "Enter phone or email..."],
    loop: 0,
    delaySpeed: 1000,
  });

  // Fetch garages
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/garages/getGarages`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setGarages(res.data))
      .catch((err) => toast.error("🚨 Error fetching garages: " + err.message))
      .finally(() => setLoading(false));
  }, [token]);

  // Delete garage
  const handleDelete = (id) => {
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/garages/garages/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setGarages(garages.filter((g) => g._id !== id));
        toast.success("🗑 Garage deleted successfully");
      })
      .catch((err) => toast.error("🚨 Error deleting garage: " + err.message))
      .finally(() => setLoading(false));
  };

  // Open modal
  const handleUpdate = (garage) => {
    setSelectedGarage(garage);
    setShowModal(true);
  };

  // Save modal changes
  const handleSave = (updatedGarage) => {
    if (!selectedGarage) return;
    setLoading(true);
    axios
      .put(
        `http://localhost:8080/api/garages/garagesUpdate/${selectedGarage._id}`,
        updatedGarage,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        setGarages(
          garages.map((g) => (g._id === selectedGarage._id ? res.data.garage : g))
        );
        toast.success("✏️ Garage updated successfully");
      })
      .catch((err) => toast.error("🚨 Error updating garage: " + err.message))
      .finally(() => setLoading(false));
    setShowModal(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedGarage(null);
  };

  // Filter garages
  const filteredGarages = garages.filter(
    (g) =>
      g.garageName.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase())
  );

  // PDF download
  const generatePDF = () => {
    if (filteredGarages.length === 0) {
      toast.warning("⚠️ No data to download!");
      return;
    }
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Garage History", 14, 20);

    const tableColumn = ["Garage Name", "Email", "Phone", "Address", "Services"];
    const tableRows = [];

    filteredGarages.forEach((garage) => {
      tableRows.push([
        garage.garageName,
        garage.email,
        garage.phone,
        garage.address,
        garage.services,
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 12 },
      headStyles: { fillColor: [40, 40, 40] },
    });

    doc.save("garage_history.pdf");
    toast.success("📄 PDF downloaded!");
  };

  return (
    <>
      {loading ? (
        <div className="loader-overlay">
          <Atom color="#a35b81ff" size="large" text="" textColor="" />
        </div>
      ) : (
        <div className="admin-container">
          <h2>Update Garage</h2>

          {/* Search */}
          <input
            type="text"
            placeholder={text}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="Garage-search-update-input"
          />

          {/* PDF */}
          <button className="pdf-button" onClick={generatePDF}>
            <FontAwesomeIcon icon={faFilePdf} /> Download PDF
          </button>

          {/* Table */}
          <table>
            <thead>
              <tr>
                <th>Owner Name</th>
                <th>Garage Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Services</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGarages.length > 0 ? (
                filteredGarages.map((garage) => (
                  <tr key={garage._id}>
                    <td>{garage.ownerName}</td>
                    <td>{garage.garageName}</td>
                    <td>{garage.email}</td>
                    <td>{garage.phone}</td>
                    <td>{garage.address}</td>
                    <td>{garage.services}</td>
                    <td>
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        className="pencil-icon"
                        title="Update Garage"
                        onClick={() => handleUpdate(garage)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="delete-icon"
                        title="Delete Garage"
                        onClick={() => handleDelete(garage._id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">No garages available.</td>
                </tr>
              )}
            </tbody>
          </table>

          <ToastContainer
            position="top-center"
            style={{ marginTop: "5px" }}
            autoClose={3000}
            hideProgressBar={false}
          />
        </div>
      )}

      {/* Update Modal */}
      <Model_edit
        show={showModal}
        garage={selectedGarage}
        onClose={handleClose}
        onSave={handleSave}
      />
    </>
  );
};

export default Garage_Admin;
