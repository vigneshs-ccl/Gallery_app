import { useNavigate } from "react-router-dom";
import AlbumCard from "./AlbumCard";
import Header from "./Header";
import { IoMdAdd } from "react-icons/io";

const AlbumsList: React.FC = () => {
  const navigate = useNavigate();

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
