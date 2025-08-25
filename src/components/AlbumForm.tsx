import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlbumForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [inputValue, setInputValue] = useState<string>("");

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
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:8000/albums/${id}`, {
          title: inputValue,
        });
        alert("Album Updated Successfully!");
      } else {
        await axios.post("http://localhost:8000/albums", {
          title: inputValue,
        });

        toast.success("🦄 Wow so easy!", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
      }
      setInputValue("");
      navigate("/");
    } catch (err) {
      console.error("Error adding data:", err);
      alert("Failed to add data.");
    }
    // navigating to AlbumList page...
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
          value={inputValue}
          onChange={handleChange}
        />

        <button type="submit">{id ? "update" : "create"}</button>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          transition={Bounce}
        />
      </form>
    </div>
  );
};

export default AlbumForm;
