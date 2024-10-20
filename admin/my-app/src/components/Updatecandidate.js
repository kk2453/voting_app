import React,{useContext,useState} from 'react'
import Notecontext from "../context/notes/NotesContext";
import { useNavigate } from "react-router-dom";

export default function Updatecandidate(props) {
    const a = useContext(Notecontext);
    const navigate = useNavigate();
    const [notes, setnotes] = useState({
        name: "",
        party: "",
      });
    const onchange = (e) => {
        setnotes({ ...notes, [e.target.name]: e.target.value });
    };
    const handleonClick = async (e) => {
      e.preventDefault();
      await a.updatecandidate(notes.id, notes.name, notes.party);
      window.location.reload();
      props.handleonClick2();
    };
    const handleonclickclose = async (e) => {
        e.preventDefault();
        navigate('/homeadmin');
        props.handleonClick2();
      };
  return (
    <div>
        <form className="container my-4">
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Name
        </label>
        <input
          type="text"
          className="form-control"
          id="name"
          name="name"
          onChange={onchange}
          value={notes.name}
        />
      </div>
      <div className="mb-3">
        <label htmlFor="party" className="form-label">
          party
        </label>
        <input
          type="text"
          className="form-control"
          id="party"
          name="party"
          onChange={onchange}
          value={notes.party}
        />
      </div>
      <div className="modal-footer mx-4">
              <button
                type="button"
                className="btn btn-secondary mx-2"
                onClick={handleonclickclose}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleonClick}
              >
                Update Candidate
              </button>
            </div>
    </form>
    </div>
  )
}
