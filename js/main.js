// main.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

const pdfUrl = 'pdfs/your-pdf-files.here.pdf'; // Your PDF path

let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1;
let canvas = document.getElementById('pdf-render');
let ctx = canvas.getContext('2d');

console.log('Starting PDF load...');

// Load the PDF
const loadingTask = pdfjsLib.getDocument(pdfUrl);

loadingTask.onProgress = function(progress) {
    console.log(`Loading: ${progress.loaded}/${progress.total}`);
};

loadingTask.promise
    .then(function(pdf) {
        console.log('PDF loaded successfully');
        pdfDoc = pdf;
        document.getElementById('page-count').textContent = pdf.numPages;
        return renderPage(pageNum);
    })
    .catch(function(error) {
        console.error('Error loading PDF:', error);
        document.getElementById('pdf-render').insertAdjacentHTML('beforebegin', 
            `<div style="color: red;">Error loading PDF: ${error.message}</div>`);
    });

function renderPage(num) {
    console.log(`Rendering page ${num}`);
    pageRendering = true;

    return pdfDoc.getPage(num).then(function(page) {
        console.log(`Got page ${num}`);
        let viewport = page.getViewport({scale: scale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        let renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };

        return page.render(renderContext).promise.then(function() {
            console.log(`Page ${num} rendered successfully`);
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        }).catch(function(error) {
            console.error(`Error rendering page ${num}:`, error);
            pageRendering = false;
        });
    }).catch(function(error) {
        console.error(`Error getting page ${num}:`, error);
        pageRendering = false;
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
