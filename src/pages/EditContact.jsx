import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"; 
import { initialStore } from "../store.js";
import { Link } from "react-router-dom";

export const EditContact = () => {
  const { store, dispatch } = useGlobalReducer();
  const { id } = useParams(); 
  const navigate = useNavigate();
  const API_BASE_URL = initialStore().urlBase;
  const AGENDA_SLUG = "test1234"; 

  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const contactIdNum = parseInt(id, 10); 
    const foundContact = store.contacts.find(contact => contact.id === contactIdNum);

    if (foundContact) {
      setContactData({
        name: foundContact.name || "",
        email: foundContact.email || "",
        phone: foundContact.phone || "",
        address: foundContact.address || "",
      });
      setLoading(false); 
    } else {
      setError(`Contact with ID ${id} not found in the list. Please go back and try again.`);
      setLoading(false);
      console.warn(`Contact with ID ${id} not found in store.contacts. Cannot fetch individually due to API limitations.`);
      
    }
  }, [id, store.contacts, navigate]); 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); 

    if (!contactData.name || !contactData.email || !contactData.phone || !contactData.address) {
        setError("All fields are required.");
        return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData), 
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`Failed to update contact: ${resp.status} - ${JSON.stringify(errorData)}`);
      }

      const updatedContact = await resp.json();
      dispatch({ type: "UPDATE_CONTACT", payload: updatedContact }); 
      navigate("/");
    } catch (err) {
      console.error("Error updating contact:", err);
      setError(`Error updating contact: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="container text-center my-5">Searching for contact in store...</div>;
  }

  if (error) {
    return (
        <div className="container text-center my-5">
            <div className="alert alert-danger" role="alert">
                {error}
            </div>
            <Link to="/" className="btn btn-primary mt-3">Go back to Contacts</Link>
        </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Edit Contact</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="fullName"
            name="name"
            value={contactData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={contactData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="tel"
            className="form-control"
            id="phone"
            name="phone"
            value={contactData.phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={contactData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-success">
            Save Changes
          </button>
          <Link to="/" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};