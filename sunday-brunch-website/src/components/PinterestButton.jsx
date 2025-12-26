import './PinterestButton.css';

const PinterestButton = ({ url, description, image }) => {
    const handlePin = (e) => {
        e.preventDefault();
        const pinUrl = `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(image)}&description=${encodeURIComponent(description)}`;
        window.open(pinUrl, '_blank', 'width=800,height=600');
    };

    return (
        <button
            className="pinterest-pin-it"
            onClick={handlePin}
            aria-label="Pin to Pinterest"
        >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.08 3.16 9.41 7.63 11.13-.1-.94-.2-2.39.04-3.41.22-.93 1.4-5.93 1.4-5.93s-.36-.71-.36-1.77c0-1.66.96-2.9 2.12-2.9 1 0 1.48.75 1.48 1.65 0 1-.64 2.5-.97 3.89-.28 1.17.58 2.12 1.73 2.12 2.08 0 3.68-2.19 3.68-5.35 0-2.8-2.01-4.75-4.88-4.75-3.32 0-5.26 2.49-5.26 5.06 0 1 .39 2.08.88 2.68.1.12.11.22.08.33-.09.37-.28 1.14-.32 1.29-.05.21-.16.25-.37.15-1.4-.65-2.27-2.7-2.27-4.35 0-3.54 2.57-6.8 7.42-6.8 3.9 0 6.93 2.77 6.93 6.49 0 3.87-2.43 6.99-5.82 6.99-1.14 0-2.21-.59-2.58-1.29l-.7 2.67c-.25.97-.94 2.19-1.4 2.94 1.12.35 2.3.54 3.53.54a12 12 0 100-24z" />
            </svg>
            <span>Pin It</span>
        </button>
    );
};

export default PinterestButton;
