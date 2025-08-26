import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const AlbumForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputValue, setInputValue] = useState<string>("");
  const [error, setError] = useState<string>("");

  // fetching album data
  useEffect(() => {
    if (id) {
      axios
        .get(`http://localhost:8000/albums/${id}`)
        .then((res) => setInputValue(res.data.title))
        .catch((err) => console.error("Error fetching album:", err));
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setInputValue(value);
    validateInput(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:8000/albums/${id}`, {
          title: inputValue,
        });
        navigate("/", { state: { toast: "album Updated successfully!" } });
      } else {
        await axios.post("http://localhost:8000/albums", {
          title: inputValue,
        });
        // navigating to AlbumList page...
        navigate("/", { state: { toast: "album created successfully!" } });
      }
      // resetting the input field
      setInputValue("");
    } catch (err) {
      console.error("Error adding data:", err);
      toast.error("Failed to add data.");
    }
  };

  const validateInput = (value: string) => {
    if (!value) {
      setError("Album Name is required!");
    } else {
      setError("");
    }
  };
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="album-form">
        <h1>Create Album</h1>
        <input
          type="text"
          placeholder="Enter Album Name"
          name="album"
          id="album"
          required
          minLength={3}
          maxLength={50}
          value={inputValue}
          onChange={handleChange}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">{id ? "update" : "create"}</button>
      </form>
       <button className="navigation-btn" onClick={()=>{navigate("/")}}>Back to Album</button>
    </div>
  );
};

export default AlbumForm;
