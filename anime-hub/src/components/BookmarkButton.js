import { useState, useEffect } from 'react';

function BookmarkButton({ anime }) {
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        setIsBookmarked(bookmarks.some(item => item.mal_id === anime.mal_id));
    }, [anime.mal_id]);

    const toggleBookmark = (e) => {
        e.stopPropagation();
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
        
        if (isBookmarked) {
            const newBookmarks = bookmarks.filter(item => item.mal_id !== anime.mal_id);
            localStorage.setItem('bookmarks', JSON.stringify(newBookmarks));
        } else {
            bookmarks.push(anime);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
        }
        
        setIsBookmarked(!isBookmarked);
    };

    return (
        <button 
            className={`bookmark-btn ${isBookmarked ? 'bookmarked' : ''}`}
            onClick={toggleBookmark}
            aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
        >
            {isBookmarked ? '★' : '☆'}
        </button>
    );
}

export default BookmarkButton;