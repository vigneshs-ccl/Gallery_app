import axios from "axios";
import type { Album } from "../assets/Album.model";
import React, { useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlbumCard: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("http://localhost:8000/albums")
      .then((response) => setAlbums(response.data))
      .catch((error) => {
        console.error("Error fetching data:", error); // Handle errors
      });
  }, []);

  const handleShowPhotos = (id: number) => {
    navigate(`/album-photos/${id}`);
  };

  const handleDelete = async (id: number, e: React.FormEvent) => {
    toast.error("Album Deleted!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
    setLoadingId(id);
    console.log(id);

    e?.stopPropagation();
    try {
      await axios.delete(`http://localhost:8000/albums/${id}`);
      setAlbums((prev) => prev.filter((album) => album.id !== id));
    } catch (err) {
      console.error("Error deleting resource:", err);
    } finally {
      setLoadingId(null); // removing spinner state
    }
  };

  const handleEdit = (id: number, e: React.FormEvent) => {
    e.stopPropagation();
    navigate(`/album/edit/${id}`);
  };
  return (
    <div className="album-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
      {albums.map((album) => (
        <li
          key={album.id}
          className="album-card"
          onClick={() => handleShowPhotos(album.id)}
        >
          {loadingId === album.id ? (
            <div className="spinner">⏳ Deleting...</div>
          ) : (
            <>
              <h1 className="text-white">{album.title}</h1>

              <button
                className="edit"
                type="button"
                title="Delete Album"
                onClick={(e) => handleEdit(album.id, e)}
              >
                <CiEdit size={30} />
              </button>
              <button
                type="button"
                title="Edit Album"
                className="delete"
                onClick={(e) => handleDelete(album.id, e)}
              >
                <MdOutlineDeleteForever size={30} />
              </button>
            </>
          )}
        </li>
      ))}
    </div>
  );
};

export default AlbumCard;
