import "./App.css";
import AlbumForm from "./components/AlbumForm";
import AlbumsList from "./components/AlbumList";
import { Routes, Route } from "react-router-dom";
import PhotoList from "./components/PhotoList";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PhotoForm from "./components/PhotoForm";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<AlbumsList />} />
        <Route path="/album/create" element={<AlbumForm />} />
        <Route path="/album/edit/:id" element={<AlbumForm />} />
        <Route path="/album-photos/:id" element={<PhotoList />} />
        <Route
          path="/album-photos/:albumId/add-photo"
          element={<PhotoForm />}
        />
        <Route
          path="/album-photos/:albumId/edit-photo/:photoId"
          element={<PhotoForm />}
        />
      </Routes>

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
        transition={Slide}
      />
    </>
  );
}

export default App;
