import { PDFViewer } from './pdf-viewer.js';
import { setupGestures } from './gestures.js';
import { setupSearch } from './search.js';
import './security.js';

let pdfViewer;

document.addEventListener('DOMContentLoaded', async () => {
    pdfViewer = new PDFViewer({
        container: document.getElementById('pdf-viewer'),
        loadingScreen: document.getElementById('loading-screen'),
        currentPageInput: document.getElementById('current-page'),
        pageCountSpan: document.getElementById('page-count'),
        zoomSelect: document.getElementById('zoom-level')
    });

    // Initialize PDF viewer
    try {
        await pdfViewer.loadDocument('/pdfs/your-pdf-files-here.pdf');
    } catch (error) {
        console.error('Error loading PDF:', error);
        alert('Error loading PDF document');
    }

    // Setup event listeners
    setupControlButtons();
    setupDarkMode();
    setupGestures(pdfViewer);
    setupSearch(pdfViewer);
});

function setupControlButtons() {
    document.getElementById('previous-page').addEventListener('click', () => {
        pdfViewer.previousPage();
    });

    document.getElementById('next-page').addEventListener('click', () => {
        pdfViewer.nextPage();
    });

    document.getElementById('zoom-in').addEventListener('click', () => {
        pdfViewer.zoomIn();
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
        pdfViewer.zoomOut();
    });
}

function setupDarkMode() {
    const darkModeButton = document.getElementById('toggle-dark-mode');
    darkModeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    });
  // Restore dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
}
