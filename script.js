async function loadPDF() {
    const storedPassword = localStorage.getItem('userPassword');
    if (!storedPassword) {
        alert("Please log in to view the PDF.");
        return;
    }

    const pdfUrl = 'pdf/your-pdf-file.pdf'; // Path to your PDF
    const loadingTask = pdfjsLib.getDocument(pdfUrl);

    try {
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1); // Load the first page

        const scale = 1.5;
        const viewport = page.getViewport({ scale });
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport }).promise;
    } catch (error) {
        console.error("Error loading PDF:", error);
    }
}

document.addEventListener('contextmenu', event => event.preventDefault());
loadPDF();
