import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { initialStore } from "../store.js";

const API_BASE_URL = initialStore().urlBase;

export const AddContact = () => {
  const { dispatch } = useGlobalReducer();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newContact = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
    };

    try {
      const resp = await fetch(`${API_BASE_URL}/agendas/test1234/contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });


      if (!resp.ok) {

        let errorData = {};
        try {
          errorData = await resp.json();
        } catch (jsonError) {
          console.error("Error parsing API error response:", jsonError);
        }
        throw new Error(`Error ${resp.status}: ${JSON.stringify(errorData)}`);
      }


      const createdContact = await resp.json();


      dispatch({ type: "ADD_CONTACT", payload: createdContact });


      navigate("/");

    } catch (error) {
      console.error("Failed to create contact:", error);
      alert(`Hubo un error al crear el contacto: ${error.message}`);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="text-center">Add Contact</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name">Name:</label>
          <input
            className="form-control"
            type="text"
            placeholder="Full Name"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email">Email:</label>
          <input
            className="form-control"
            type="email"
            placeholder="Enter email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone">Phone:</label>
          <input
            className="form-control"
            type="tel"
            placeholder="Enter phone"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address">Address:</label>
          <input
            className="form-control"
            type="text"
            placeholder="Enter address"
            id="address"
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div>
          <button type="submit" className="btn btn-primary me-3">
            Add Contact
          </button>
        </div>
        <Link to="/" className="py-3">
          or get back to Contacts
        </Link>
      </form>
    </div>
  );
};