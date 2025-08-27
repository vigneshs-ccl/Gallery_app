import { useNavigate, useLocation } from "react-router-dom";
import AlbumCard from "./AlbumCard";
import Header from "./Header";
import { IoMdAdd } from "react-icons/io";
import { toast, Slide } from "react-toastify";
import { useEffect } from "react";

const AlbumsList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { toast?: string } | null;

    if (state?.toast === "album created successfully!") {
      toast.success("Added new Album!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      navigate(location.pathname, { replace: true });
    } else if (state?.toast === "album Updated successfully!") {
      toast.success("Updated Album!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Slide,
      });
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  const handleCreate = () => {
    navigate("/album/create");
  };
  return (
    <div className="album-list">
      <Header />
      <main>
        <h1 className="album-heading">Albums</h1>
        <div className="hover-underline" onClick={handleCreate}>
          <h4>
            Create Album
            <IoMdAdd />
          </h4>
        </div>
        
        <AlbumCard />
      </main>
    </div>
  );
};

export default AlbumsList;
