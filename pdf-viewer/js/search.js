export function setupSearch(pdfViewer) {
    const searchInput = document.getElementById('search-input');
    const searchPrevious = document.getElementById('search-previous');
    const searchNext = document.getElementById('search-next');

    let currentMatch = -1;
    let matches = [];

    searchInput.addEventListener('input', async () => {
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length < 2) {
            matches = [];
            currentMatch = -1;
            return;
        }

        matches = await findMatches(searchTerm, pdfViewer.pdfDoc);
        currentMatch = matches.length > 0 ? 0 : -1;
        highlightMatch();
    });

    searchPrevious.addEventListener('click', () => {
        if (matches.length === 0) return;
        currentMatch = (currentMatch - 1 + matches.length) % matches.length;
        highlightMatch();
    });

    searchNext.addEventListener('click', () => {
        if (matches.length === 0) return;
        currentMatch = (currentMatch + 1) % matches.length;
        highlightMatch();
    });

    async function findMatches(searchTerm, pdfDoc) {
        const matches = [];
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            const textContent = await page.getTextContent();
            const text = textContent.items.map(item => item.str).join(' ');
            
            let index = -1;
            while ((index = text.toLowerCase().indexOf(searchTerm.toLowerCase(), index + 1)) !== -1) {
                matches.push({
                    pageNumber: i,
                    index: index
                });
            }
        }
        return matches;
    }

    async function highlightMatch() {
        if (currentMatch === -1) return;
        
        const match = matches[currentMatch];
        if (pdfViewer.currentPage !== match.pageNumber) {
            pdfViewer.currentPage = match.pageNumber;
            await pdfViewer.renderCurrentPage();
        }
        
        // Highlight the matched text on the canvas
        // This is a simplified version - you'd need to calculate actual coordinates
        const page = await pdfViewer.pdfDoc.getPage(match.pageNumber);
        const textContent = await page.getTextContent();
        // Implementation for highlighting would go here
    }
}
