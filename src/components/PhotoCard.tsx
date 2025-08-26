import type { Photo } from "../assets/Photo.model";

const PhotoCard: React.FC<{ photo: Photo }> = ({ photo }) => {
  return (
    <div className="photo-card">
      <img src={photo.url} alt={photo.title} />
      <p>{photo.title}</p>
      
    </div>
  );
};

export default PhotoCard;
