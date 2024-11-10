import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import debounce from 'lodash/debounce';
import AnimeModal from "../components/AnimeModal";
import AnimeSkeleton from "../components/AnimeSkeleton";
import BookmarkButton from "../components/BookmarkButton";
import ShareButton from "../components/ShareButton";
import ThemeSwitcher from "../components/ThemeSwitcher";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import "../styles/TrendingAnime.css";

function TrendingAnime() {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAnime, setSelectedAnime] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenre, setSelectedGenre] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isSearching, setIsSearching] = useState(false);

    // SEO - JSON-LD
    useEffect(() => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.innerHTML = JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Anime Collection",
            "description": "Jelajahi koleksi anime terlengkap dan terpopuler",
            "url": window.location.origin
        });
        document.head.appendChild(script);
        return () => document.head.removeChild(script);
    }, []);

    // Infinite scroll handler
    const handleScroll = useCallback(
        debounce(() => {
            if (
                window.innerHeight + window.scrollY >= 
                document.documentElement.scrollHeight - 100
            ) {
                if (hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            }
        }, 200),
        [hasMore, loading]
    );

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Debounce search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);

    // Fetch anime data
    useEffect(() => {
        const fetchAnime = async () => {
            try {
                setLoading(true);
                setIsSearching(!!debouncedSearch);

                const response = await fetch(
                    `http://localhost:5000/api/anime?page=${page}&q=${encodeURIComponent(debouncedSearch)}`
                );
                
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data && data.pagination) {
                    setHasMore(data.pagination.has_next_page);
                    setAnimeList(prev => 
                        page === 1 ? data.data : [...prev, ...data.data]
                    );
                }
            } catch (err) {
                console.error('Error:', err);
                setError("Gagal memuat anime. Silakan coba lagi nanti.");
            } finally {
                setLoading(false);
            }
        };

        fetchAnime();
    }, [page, debouncedSearch]);

    // Filter anime
    const filteredAnime = animeList.filter(anime => {
        const matchesSearch = anime.title.toLowerCase()
            .includes(searchQuery.toLowerCase());
        const matchesGenre = selectedGenre === "" || 
            anime.genres?.some(genre => genre.name === selectedGenre);
        return matchesSearch && matchesGenre;
    });

    const uniqueGenres = [...new Set(
        animeList.flatMap(anime => 
            anime.genres?.map(genre => genre.name) || []
        )
    )].sort();

    return (
        <main>
            <div className="trending-container">
                <header className="trending-header">
                    <div className="header-top">
                        <h1>Anime Collection</h1>
                        <ThemeSwitcher />
                    </div>
                    <p className="subtitle">
                        Jelajahi koleksi anime terlengkap dan terpopuler
                    </p>
                    
                    <section className="filters" aria-label="Filter anime">
                        <input
                            type="text"
                            placeholder="Cari anime..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                            aria-label="Cari anime"
                        />
                        
                        <select 
                            value={selectedGenre}
                            onChange={(e) => setSelectedGenre(e.target.value)}
                            className="genre-select"
                            aria-label="Pilih genre"
                        >
                            <option value="">Semua Genre</option>
                            {uniqueGenres.map(genre => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                    </section>
                </header>

                {isSearching && (
                    <div className="search-status">
                        Menampilkan hasil pencarian untuk: "{debouncedSearch}"
                    </div>
                )}

                <section className="anime-grid" aria-label="Daftar anime">
                    {filteredAnime.map(anime => (
                        <article 
                            key={anime.mal_id} 
                            className="anime-card"
                            onClick={() => setSelectedAnime(anime)}
                        >
                            <div className="anime-card-image">
                                <img 
                                    src={anime.images.jpg.large_image_url} 
                                    alt={`Poster ${anime.title}`}
                                    loading="lazy"
                                    width="225"
                                    height="319"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-image.jpg';
                                        e.target.onerror = null;
                                    }}
                                />
                                <div className="anime-overlay">
                                    <div className="anime-stats-overlay">
                                        <span className="anime-score">★ {anime.score || 'N/A'}</span>
                                        <span className="anime-members">
                                            👥 {(anime.members/1000).toFixed(1)}K
                                        </span>
                                    </div>
                                    <div className="action-buttons">
                                        <BookmarkButton anime={anime} />
                                        <ShareButton anime={anime} />
                                    </div>
                                </div>
                            </div>
                            <div className="anime-info">
                                <h2>{anime.title}</h2>
                                <div className="anime-stats">
                                    <span>{anime.episodes || '?'} Episodes</span>
                                    <span>{anime.status}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                    
                    {loading && [...Array(12)].map((_, index) => (
                        <AnimeSkeleton key={index} />
                    ))}
                </section>

                {error && <div className="error-message" role="alert">{error}</div>}
                
                {!loading && !hasMore && (
                    <div className="end-message">
                        Anda telah mencapai akhir daftar
                    </div>
                )}

                {!loading && filteredAnime.length === 0 && (
                    <div className="no-results">
                        Tidak ada anime yang ditemukan
                    </div>
                )}
            </div>

            <ScrollToTop />
            
            {selectedAnime && (
                <AnimeModal 
                    anime={selectedAnime} 
                    onClose={() => setSelectedAnime(null)} 
                />
            )}
            
            <Footer />
        </main>
    );
}

export default TrendingAnime;
