import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Bounce, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageUploading from "react-images-uploading";
import type { ImageListType } from "react-images-uploading";
import type { Photo } from "../assets/Photo.model";

const PhotoForm: React.FC = () => {
  const { albumId, photoId } = useParams<{
    albumId: string;
    photoId?: string;
  }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [existingUrl, setExistingUrl] = useState<string | null>(null);
  const maxNumber = 1;

  // Load existing photo if editing
  useEffect(() => {
    if (photoId) {
      axios
        .get<Photo>(`http://localhost:8000/album-photos/${photoId}`)
        .then((res) => {
          setTitle(res.data.title);
          setExistingUrl(res.data.url);
        })
        .catch((err) => console.error("Error loading photo:", err));
    }
  }, [photoId]);

  const onChange = (imageList: ImageListType) => {
    setImages(imageList as never[]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || (!existingUrl && images.length === 0)) {
      toast.error("Please add a title and upload an image", {
        transition: Bounce,
      });
      return;
    }

    try {
      const photoData: Photo = {
        id: photoId ? photoId : crypto.randomUUID(),
        albumId: albumId!,
        title,
        url: images[0]?.dataURL ?? existingUrl!, // use new image if uploaded, otherwise old one
      };

      if (photoId) {
        // Update existing
        await axios.put(
          `http://localhost:8000/album-photos/${photoId}`,
          photoData
        );
      } else {
        // Add new
        await axios.post("http://localhost:8000/album-photos", photoData);
      }

      navigate(`/album-photos/${albumId}`, {
        state: {
          toastMessage: photoId
            ? "Photo Updated Successfully!"
            : "Photo Added Successfully!",
        },
      });
    } catch (err) {
      console.error("Error saving photo:", err);
      toast.error("Failed to save photo", { transition: Bounce });
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="photo-form">
        <h2>{photoId ? "Edit Photo" : "Add Photo"}</h2>
        <input
          type="text"
          placeholder="Photo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {existingUrl && images.length === 0 && (
          <div className="preview">
            <p>Current Image:</p>
            <img src={existingUrl} alt="preview" width={150} />
          </div>
        )}

        <ImageUploading
          value={images}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="dataURL"
        >
          {({
            imageList,
            onImageUpload,
            isDragging,
            dragProps,
            onImageRemoveAll,
            onImageUpdate,
          }) => (
            <div className="upload-image-wrapper">
              <button
                type="button"
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                {photoId ? "Change Image" : "Click or Drag to Upload"}
              </button>
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image.dataURL} alt="" width="170" />
                  <div className="image-item-btn-wrapper">
                    <button type="button" onClick={() => onImageUpdate(index)}>
                      Update
                    </button>
                    <button type="button" onClick={() => onImageRemoveAll()}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ImageUploading>

        <button type="submit">{photoId ? "Update Photo" : "Add Photo"}</button>
      </form>

      <button
        onClick={() => navigate(`/album-photos/${albumId}`)}
        className="navigation-btn"
      >
        Back to Photos
      </button>
    </div>
  );
};

export default PhotoForm;
