// Disable right-click
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
  alert('Right-click is disabled for security reasons.');
});

// Disable keyboard shortcuts for inspect element
document.addEventListener('keydown', (event) => {
  const forbiddenKeys = ['F12', 'Control+Shift+I', 'Control+Shift+C', 'Control+U'];
  if (
    event.key === 'F12' ||
    (event.ctrlKey && event.shiftKey && event.key === 'I') ||
    (event.ctrlKey && event.shiftKey && event.key === 'C') ||
    (event.ctrlKey && event.key === 'U')
  ) {
    event.preventDefault();
    alert('Inspect element is disabled for security reasons.');
  }
});

// PDF.js setup
const pdfUrl = 'example.pdf'; // Replace with your PDF file path
let pdfDoc = null;
let currentPage = 1;
let scale = 1.5;

const canvas = document.getElementById('pdf-canvas');
const ctx = canvas.getContext('2d');

// Render a specific page
async function renderPage(pageNum) {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext = {
    canvasContext: ctx,
    viewport: viewport,
  };
  await page.render(renderContext);

  document.getElementById('page-num').textContent = pageNum;
}

// Load the PDF
pdfjsLib.getDocument(pdfUrl).promise.then((doc) => {
  pdfDoc = doc;
  document.getElementById('page-count').textContent = pdfDoc.numPages;
  renderPage(currentPage);
});

// Page navigation
document.getElementById('prev-page').addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage(currentPage);
  }
});

document.getElementById('next-page').addEventListener('click', () => {
  if (currentPage < pdfDoc.numPages) {
    currentPage++;
    renderPage(currentPage);
  }
});

// Zoom functionality
document.getElementById('zoom-in').addEventListener('click', () => {
  scale += 0.25;
  renderPage(currentPage);
});

document.getElementById('zoom-out').addEventListener('click', () => {
  if (scale > 0.5) {
    scale -= 0.25;
    renderPage(currentPage);
  }
});

// Search functionality
document.getElementById('search-btn').addEventListener('click', async () => {
  const searchTerm = document.getElementById('search-input').value.trim();
  if (!searchTerm) {
    alert('Please enter a search term.');
    return;
  }

  const page = await pdfDoc.getPage(currentPage);
  const textContent = await page.getTextContent();
  const items = textContent.items.map((item) => item.str);
  const matches = items.filter((text) => text.includes(searchTerm));

  if (matches.length > 0) {
    alert(`Found "${searchTerm}" on this page.`);
  } else {
    alert(`"${searchTerm}" not found on this page.`);
  }
});
