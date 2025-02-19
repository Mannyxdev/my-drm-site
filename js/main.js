// main.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

// Path to your PDF file
const pdfUrl = 'pdfs/your-pdf-files-here.pdf';

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1;
let canvas = document.getElementById('pdf-render');
let ctx = canvas.getContext('2d');

// Fetch the PDF file and convert it to a blob URL
fetch(pdfUrl)
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);

        // Load the PDF from the blob URL
        pdfjsLib.getDocument(url)
            .promise
            .then(function(pdf) {
                pdfDoc = pdf;
                document.getElementById('page-count').textContent = pdf.numPages;
                renderPage(pageNum);
            })
            .catch(function(error) {
                console.error('Error loading PDF:', error);
                const errorMessage = document.createElement('div');
                errorMessage.style.color = 'red';
                errorMessage.style.padding = '20px';
                errorMessage.textContent = 'Error loading PDF. Please ensure the PDF file exists and is accessible.';
                canvas.parentNode.insertBefore(errorMessage, canvas);
            });
    })
    .catch(error => console.error('Error fetching PDF:', error));

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

        document.getElementById('page-num').textContent = num;
    });
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
