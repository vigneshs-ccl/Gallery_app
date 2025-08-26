import { useEffect, useState } from "react";
import type { Photo } from "../assets/Photo.model";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MdOutlineDeleteForever } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
const PhotoList: React.FC = () => {
  const navigate = useNavigate();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      axios
        .get<Photo[]>(`http://localhost:8000/album-photos?albumId=${id}`)
        .then((res) => {
          setPhotos(res.data);
        })
        .catch((err) => {
          console.error("Error fetching photos:", err);
        });
    }
  }, [id]);

  const handlePhotoDelete = async (id: string, e: React.FormEvent) => {
    e?.stopPropagation();
    setLoadingId(id);
    try {
      await axios.delete(
        `http://localhost:8000/album-photos/${id}`
      );
      setPhotos((prev) => prev.filter((photo) => photo.id !== id));
    } catch (err) {
      console.error("Error deleting resource:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="photo-list">
      <ToastContainer />
      <h2>Photos</h2>
      <button
        className="add-btn"
        onClick={() => navigate(`/album-photos/${id}/add-photo`)}
      >
        ➕ Add Photo
      </button>

      <button className="album-navigation" onClick={() => navigate("/")}>
        Back to Album
      </button>
      <div className="photo-grid">
        {photos.length > 0 ? (
          photos.map((photo) => (
            <div key={photo.id} className="photo-card">
              {loadingId === photo.id ? (
                <div className="spinner">⏳ Deleting...</div>
              ) : (
                <>
                  <img src={photo.url} alt={photo.title} />
                  <p>{photo.title}</p>
                  <div className="crud-btn">
                    <div>
                      <button className="edit" title="Edit Photo" type="button">
                        <CiEdit size={30} />
                      </button>
                    </div>
                    <div>
                      <button
                        type="button"
                        title="Delete Photo"
                        onClick={(e) => handlePhotoDelete(photo.id, e)}
                        className="delete"
                      >
                        <MdOutlineDeleteForever size={30} />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p>No photos found for this album.</p>
        )}
      </div>
    </div>
  );
};

export default PhotoList;
