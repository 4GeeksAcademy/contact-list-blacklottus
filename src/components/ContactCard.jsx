import { Link } from "react-router-dom";

export const ContactCard = (props) => {

    return (
        <div className="container">
            <li
                className="d-flex flex-row justify-content-between align-items-center border border-dark-subtle"
            >
                <div className="col-3 d-flex align-items-center justify-content-center m-3">
                    <img
                        src="https://avatar.iran.liara.run/public/48"
                        className="rounded-circle img-fluid user-picture py-1 h-25 "
                        alt="contact"
                    />
                </div>
                <div className="col-5 mx-2 py-2">
                    <p className="fs-5 fw-bold">{props.name}</p>
                    <p className="text-dark-emphasis">
                        <i className="fa-solid fa-location-dot me-2"></i>
                        {props.address}
                    </p>
                    <p className="text-dark-emphasis">
                        <i className="fa-solid fa-phone-flip me-2"></i>
                        {props.phone}
                    </p>
                    <p className="text-dark-emphasis">
                        <i className="fa-solid fa-envelope me-2"></i>
                        {props.email}
                    </p>
                </div>
                <div className="col-3 me-2 d-flex justify-content-end">
                    <button
                        className="btn border-0"
                        onClick={props.onEdit}
                        title="Edit Contact"
                    >
                        <i className="fa-solid fa-pencil fs-5 fw-bold mx-2"></i>
                    </button>

                    <button
                        className="btn border-0"
                        onClick={props.onDelete}
                        title="Delete Contact"
                    >
                        <i className="fa-solid fa-trash-can fs-5 fw-bold mx-2"></i>
                    </button>
                </div>
            </li>
        </div>
    )
}