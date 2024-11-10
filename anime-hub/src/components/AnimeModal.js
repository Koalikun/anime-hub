import "../styles/AnimeModal.css";

function AnimeModal({ anime, onClose }) {
    if (!anime) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>&times;</button>
                
                <div className="modal-header">
                    <img 
                        src={anime.images.jpg.large_image_url} 
                        alt={anime.title} 
                        className="modal-image"
                    />
                    <div className="modal-title-section">
                        <h2>{anime.title}</h2>
                        <div className="modal-stats">
                            <span className="stat">★ {anime.score}</span>
                            <span className="stat">{anime.episodes} Episodes</span>
                            <span className="stat">{anime.status}</span>
                        </div>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="modal-info">
                        <h3>Synopsis</h3>
                        <p>{anime.synopsis}</p>
                    </div>
                    
                    <div className="modal-details">
                        <div className="detail-item">
                            <h4>Genres</h4>
                            <div className="genres-list">
                                {anime.genres?.map(genre => (
                                    <span key={genre.mal_id} className="genre-tag">
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                        
                        <div className="detail-item">
                            <h4>Information</h4>
                            <ul className="info-list">
                                <li>Rating: {anime.rating}</li>
                                <li>Aired: {anime.aired?.string}</li>
                                <li>Duration: {anime.duration}</li>
                                <li>Studios: {anime.studios?.map(s => s.name).join(', ')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AnimeModal;