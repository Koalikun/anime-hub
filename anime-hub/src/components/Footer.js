function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3>Anime Collection</h3>
                    <p>Temukan dan jelajahi anime favorit Anda dari berbagai genre.</p>
                </div>
                
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><a href="#top">Kembali ke Atas</a></li>
                        <li><a href="#trending">Trending Anime</a></li>
                        <li><a href="#genres">Genre</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Powered By</h4>
                    <ul>
                        <li>
                            <a 
                                href="https://jikan.moe" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Jikan API
                            </a>
                        </li>
                        <li>
                            <a 
                                href="https://myanimelist.net" 
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                MyAnimeList
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="footer-bottom">
                <p>&copy; {currentYear} Anime Collection. All rights reserved.</p>
                <p>Created with ❤️ by Jonny Ganteng</p>
            </div>
        </footer>
    );
}

export default Footer; 