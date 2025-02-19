import { PDFViewer } from './pdf-viewer.js';
import { GestureHandler } from './gestures.js';
import { SearchHandler } from './search.js';
import { SecurityHandler } from './security.js';

const pdfUrl = 'https://drive.google.com/uc?export=view&id=1z9tek-p_Q20Dbax4q6GyYtpBa4zWyZ6y';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1;
let canvas = document.getElementById('pdf-render');
let ctx = canvas.getContext('2d');

// Initialize PDF
pdfjsLib.getDocument({
    url: pdfUrl,
    httpHeaders: {
        'Access-Control-Allow-Origin': '*'
    }
}).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    document.getElementById('page-count').textContent = pdfDoc.numPages;
    renderPage(pageNum);
});

function renderPage(num) {
    pageRendering = true;
    pdfDoc.getPage(num).then(function(page) {
        let viewport = page.getViewport({scale: scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        let renderTask = page.render(renderContext);

        renderTask.promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });

    document.getElementById('page-num').textContent = num;
}

function queueRenderPage(num) {
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function onPrevPage() {
    if (pageNum <= 1) {
        return;
    }
    pageNum--;
    queueRenderPage(pageNum);
}

function onNextPage() {
    if (pageNum >= pdfDoc.numPages) {
        return;
    }
    pageNum++;
    queueRenderPage(pageNum);
}

document.getElementById('prev').addEventListener('click', onPrevPage);
document.getElementById('next').addEventListener('click', onNextPage);

// Zoom controls
document.getElementById('zoomIn').addEventListener('click', function() {
    scale *= 1.2;
    renderPage(pageNum);
});

document.getElementById('zoomOut').addEventListener('click', function() {
    scale *= 0.8;
    renderPage(pageNum);
});

// Reset zoom
document.getElementById('zoomReset').addEventListener('click', function() {
    scale = 1;
    renderPage(pageNum);
});

// Dark mode toggle
const darkModeToggle = document.getElementById('darkMode');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Fullscreen toggle
const fullscreenToggle = document.getElementById('fullscreen');
fullscreenToggle.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Initialize handlers
const viewer = new PDFViewer();
const gestureHandler = new GestureHandler();
const searchHandler = new SearchHandler();
const securityHandler = new SecurityHandler();
