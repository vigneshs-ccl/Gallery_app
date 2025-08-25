import "./App.css";
import AlbumForm from "./components/AlbumForm";
import AlbumsList from "./components/AlbumList";
import { Routes, Route } from "react-router-dom";
import PhotoList from "./components/PhotoList";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AlbumsList />} />
        <Route path="/album/create" element={<AlbumForm />} />
        <Route path="/album/edit/:id" element={<AlbumForm />} />
        <Route path="/photos/:id" element={<PhotoList />} />
      </Routes>
    </>
  );
}

export default App;
