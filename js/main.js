import { PDFViewer } from './pdf-viewer.js';
import { GestureHandler } from './gestures.js';
import { SearchHandler } from './search.js';
import { SecurityHandler } from './security.js';

// Set worker source path
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

const pdfUrl = 'pdfs/your-pdf-files-here.pdf'; // Update this to your PDF path

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1;
let canvas = document.getElementById('pdf-render');
let ctx = canvas.getContext('2d');

// Load the PDF
pdfjsLib.getDocument(pdfUrl).promise
    .then(function(pdf) {
        pdfDoc = pdf;
        document.getElementById('page-count').textContent = pdf.numPages;
        renderPage(pageNum);
    })
    .catch(function(error) {
        console.error('Error loading PDF:', error);
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

        page.render(renderContext).promise.then(function() {
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

document.getElementById('zoomIn').addEventListener('click', function() {
    scale *= 1.2;
    renderPage(pageNum);
});

document.getElementById('zoomOut').addEventListener('click', function() {
    scale *= 0.8;
    renderPage(pageNum);
});

document.getElementById('zoomReset').addEventListener('click', function() {
    scale = 1;
    renderPage(pageNum);
});

const darkModeToggle = document.getElementById('darkMode');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

const fullscreenToggle = document.getElementById('fullscreen');
fullscreenToggle.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

const viewer = new PDFViewer();
const gestureHandler = new GestureHandler();
const searchHandler = new SearchHandler();
const securityHandler = new SecurityHandler();
