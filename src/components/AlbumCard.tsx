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

  const [query, setQuery] = useState<string>("");
  const navigate = useNavigate();

  const fetchAlbums = async () => {
    try {
      const response = await axios.get<Album[]>("http://localhost:8000/albums");
      setAlbums(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch all posts on first render
  useEffect(() => {
    fetchAlbums();
  }, []);

  // search filter
  const filteredAlbums = albums.filter((album) =>
    album.title.toLowerCase().includes(query.toLowerCase())
  );

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
    <>
      {/* search functionality for album */}
      <div className="search-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search Album"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
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

        {filteredAlbums.length > 0 ? (
          filteredAlbums.map((album) => (
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
                    title="Edit Album"
                    onClick={(e) => handleEdit(album.id, e)}
                  >
                    <CiEdit size={30} />
                  </button>
                  <button
                    type="button"
                    title="Delete Album"
                    className="delete"
                    onClick={(e) => handleDelete(album.id, e)}
                  >
                    <MdOutlineDeleteForever size={30} />
                  </button>
                </>
              )}
            </li>
          ))
        ) : (
          <p>NO ITEMS FOUND</p>
        )}
      </div>
    </>
  );
};

export default AlbumCard;
