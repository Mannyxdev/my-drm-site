export class PDFViewer {
    constructor(options) {
        this.canvas = options.container;
        this.ctx = this.canvas.getContext('2d');
        this.loadingScreen = options.loadingScreen;
        this.currentPageInput = options.currentPageInput;
        this.pageCountSpan = options.pageCountSpan;
        this.zoomSelect = options.zoomSelect;

        this.pdfDoc = null;
        this.currentPage = 1;
        this.zoom = 1;
        this.loading = false;

        this.setupEventListeners();
    }

    async loadDocument(url) {
        this.loading = true;
        this.loadingScreen.style.display = 'flex';

        try {
            const loadingTask = pdfjsLib.getDocument(url);
            this.pdfDoc = await loadingTask.promise;
            this.pageCountSpan.textContent = this.pdfDoc.numPages;
            await this.renderCurrentPage();
        } finally {
            this.loading = false;
            this.loadingScreen.style.display = 'none';
        }
    }

    async renderCurrentPage() {
        if (!this.pdfDoc || this.loading) return;

        this.loading = true;
        const page = await this.pdfDoc.getPage(this.currentPage);
        
        const viewport = page.getViewport({ scale: this.zoom });
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;

        const renderContext = {
            canvasContext: this.ctx,
            viewport: viewport
        };

        try {
            await page.render(renderContext).promise;
        } finally {
            this.loading = false;
        }

        this.currentPageInput.value = this.currentPage;
    }

    async previousPage() {
        if (this.currentPage <= 1) return;
        this.currentPage--;
        await this.renderCurrentPage();
    }

    async nextPage() {
        if (this.currentPage >= this.pdfDoc.numPages) return;
        this.currentPage++;
        await this.renderCurrentPage();
    }

    async zoomIn() {
        this.zoom *= 1.25;
        this.zoomSelect.value = this.zoom;
        await this.renderCurrentPage();
    }

    async zoomOut() {
        this.zoom *= 0.8;
        this.zoomSelect.value = this.zoom;
        await this.renderCurrentPage();
    }

    setupEventListeners() {
        this.currentPageInput.addEventListener('change', async () => {
            const pageNum = parseInt(this.currentPageInput.value);
            if (pageNum >= 1 && pageNum <= this.pdfDoc.numPages) {
                this.currentPage = pageNum;
                await this.renderCurrentPage();
            }
        });

        this.zoomSelect.addEventListener('change', async () => {
            this.zoom = parseFloat(this.zoomSelect.value);
            await this.renderCurrentPage();
        });
    }
}
