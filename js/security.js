// Prevent right-click
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});
// Prevent keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Prevent Ctrl+S, Ctrl+P, Ctrl+Shift+I, F12
    if (
        (e.ctrlKey && (e.key === 's'  e.key === 'p')) 
        (e.ctrlKey && e.shiftKey && e.key === 'i') ||
        e.key === 'F12'
    ) {
        e.preventDefault();
        return false;
    }
});

// Prevent drag and drop
document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
});

// Disable text selection
document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
});

// Additional security measures
(function() {
    // Disable developer tools (won't work in all browsers)
    setInterval(() => {
        if (window.devtools.isOpen) {
            window.location.reload();
        }
    }, 1000);

    // Prevent iframe embedding
    if (window.self !== window.top) {
        window.top.location.href = window.self.location.href;
    }
})();
