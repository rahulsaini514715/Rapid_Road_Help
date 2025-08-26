import React, { useState, useEffect } from "react";
import "./Model_edit.css"; // Custom CSS file
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Model_edit = ({ show, garage, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    ownerName: "",
    garageName: "",
    email: "",
    phone: "",
    address: "",
    services: "",
  });

  useEffect(() => {
    if (garage) {
      setFormData({
        ownerName: garage.ownerName,
        garageName: garage.garageName,
        email: garage.email,
        phone: garage.phone,
        address: garage.address,
        services: garage.services,
      });
    }
  }, [garage]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onSave(formData);
  };

  if (!show) return null;

  return (
    <div className="custom-modal-overlay">
      <div className="custom-modal">
        <div className="custom-modal-header">
          <h5>Update Garage</h5>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="custom-modal-body">
          <div className="form-group">
            <label>Owner Name</label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Garage Name</label>
            <input
              type="text"
              name="garageName"
              value={formData.garageName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Services</label>
            <input
              type="text"
              name="services"
              value={formData.services}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="custom-modal-footer">
          <button className="btn-primary" onClick={handleSave}>
            Save Changes
          </button>
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Model_edit;
