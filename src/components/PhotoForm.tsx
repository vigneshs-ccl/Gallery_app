import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PhotoForm: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // albumId
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Convert file → base64 string
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      toast.error("Please add a title and upload an image", {
        transition: Bounce,
      });
      return;
    }

    try {
      const base64Url = await toBase64(file);

      const newPhoto = {
        id: crypto.randomUUID(), // unique id
        albumId: id,
        title,
        url: base64Url, // base64 image stored in db.json
      };

      await axios.post("http://localhost:8000/album-photos", newPhoto);

      toast.success("Photo added successfully!", { transition: Bounce });
      navigate(`/album-photos/${id}`); // navigate back to album photos
    } catch (error) {
      console.error("Error adding photo:", error);
      toast.error("Failed to add photo", { transition: Bounce });
    }
  };

  return (
    <div className="form-container">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="photo-form">
        <h2>Add Photo</h2>
        <input
          type="text"
          placeholder="Photo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          className="file-input"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
        <button type="submit">Add Photo</button>
        
      </form>
      <button onClick={()=>navigate(`/album-photos/${id}`)} className="navigation-btn">Back to Photos</button>
    </div>
  );
};

export default PhotoForm;
