import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { ContactCard } from "../components/ContactCard.jsx";
import { initialStore } from "../store.js";

export const Contacts = () => {
  const { store, dispatch } = useGlobalReducer();
  const navigate = useNavigate(); 
  const API_BASE_URL = initialStore().urlBase;
  const AGENDA_SLUG = "test1234";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const createUserAgenda = async () => {
    console.log(`Attempting to create agenda: ${AGENDA_SLUG}`);
    try {
      const resp = await fetch(`${API_BASE_URL}/agendas/${AGENDA_SLUG}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        if (resp.status === 400 && errorData.detail && errorData.detail.includes("agenda already exists")) {
            console.log(`Agenda '${AGENDA_SLUG}' already exists. Skipping creation.`);
            
        } else {
            throw new Error(`Failed to create agenda ${AGENDA_SLUG}: ${resp.status} - ${JSON.stringify(errorData)}`);
        }
      } else {
        console.log(`Agenda '${AGENDA_SLUG}' created successfully.`);
      }
    } catch (err) {
      console.error(err);
      setError(`Error creating agenda: ${err.message}`);
    }
  };

  const getAllContacts = async () => {
    setLoading(true);
    setError(null);
    console.log(`Fetching contacts for agenda: ${AGENDA_SLUG}`);

    try {
      const resp = await fetch(`${API_BASE_URL}/agendas/${AGENDA_SLUG}/contacts`);

      if (resp.status === 404) {
        console.warn(`Agenda '${AGENDA_SLUG}' not found. Attempting to create...`);
        await createUserAgenda();
        
        const retryResp = await fetch(`${API_BASE_URL}/agendas/${AGENDA_SLUG}/contacts`);
        if (!retryResp.ok) {
          const errorData = await retryResp.json();
          throw new Error(`Error ${retryResp.status} on retry fetch: ${JSON.stringify(errorData)}`);
        }
        const retryData = await retryResp.json();
        
        const contactsArray = retryData.contacts || retryData.results || retryData;
        if (!Array.isArray(contactsArray)) {
            throw new Error("API did not return an array for contacts after retry.");
        }
        dispatch({ type: "SET_CONTACTS", payload: contactsArray });
      } else if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`Error ${resp.status}: ${JSON.stringify(errorData)}`);
      } else {
        const data = await resp.json();

        const contactsArray = data.contacts || data.results || data;
        if (!Array.isArray(contactsArray)) {
            throw new Error("API did not return an array for contacts.");
        }
        dispatch({ type: "SET_CONTACTS", payload: contactsArray });
      }
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setError(`Error loading contacts: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (contactId) => {
    console.log(`Attempting to delete contact ID: ${contactId}`);
    try {
      const resp = await fetch(`${API_BASE_URL}/agendas/${AGENDA_SLUG}/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`Failed to delete contact: ${resp.status} - ${JSON.stringify(errorData)}`);
      }

      dispatch({ type: "DELETE_CONTACT", payload: contactId });
      console.log(`Contact ID ${contactId} deleted successfully.`);

    } catch (err) {
      console.error("Error deleting contact:", err);
      alert(`Hubo un error al eliminar el contacto: ${err.message}`);
    }
  };

  const editContact = async (contactId, updatedContactData) => {
    console.log(`Attempting to edit contact ID: ${contactId} with data:`, updatedContactData);
    try {
      const resp = await fetch(`${API_BASE_URL}/agendas/${AGENDA_SLUG}/contacts/${contactId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedContactData),
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(`Failed to edit contact: ${resp.status} - ${JSON.stringify(errorData)}`);
      }

      const updatedContact = await resp.json();
      dispatch({ type: "UPDATE_CONTACT", payload: updatedContact });
      console.log(`Contact ID ${contactId} updated successfully.`, updatedContact);

    } catch (err) {
      console.error("Error editing contact:", err);
      alert(`Hubo un error al editar el contacto: ${err.message}`);
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 text-end my-4">
          <Link to={"/add-contact"} className="btn btn-success">
            Add new contact
          </Link>
        </div>
        <div className="col-12 col-lg-8">
          <ul className="list-group-flush">
            {loading ? (
              <li className="list-group-item text-center">Loading contacts...</li>
            ) : error ? (
              <li className="list-group-item text-center text-danger">{error}</li>
            ) : !Array.isArray(store.contacts) || store.contacts.length === 0 ? (
              <li className="text-center">No contacts found for this agenda. Add one!</li>
            ) : (
              store.contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  id={contact.id}
                  name={contact.name}
                  address={contact.address}
                  phone={contact.phone}
                  email={contact.email}
                  onDelete={() => deleteContact(contact.id)}
                  onEdit={() => navigate(`/edit-contact/${contact.id}`)}
                />
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};