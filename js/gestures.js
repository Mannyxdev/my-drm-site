export function setupGestures(pdfViewer) {
    let touchStartX = 0;
    let touchStartY = 0;
    let initialPinchDistance = 0;
    let currentZoom = 1;

    const container = document.getElementById('pdf-container');

    container.addEventListener('touchstart', handleTouchStart, false);
    container.addEventListener('touchmove', handleTouchMove, false);
    container.addEventListener('touchend', handleTouchEnd, false);

    function handleTouchStart(event) {
        if (event.touches.length === 2) {
            // Pinch gesture started
            initialPinchDistance = getPinchDistance(event);
            currentZoom = pdfViewer.zoom;
        } else if (event.touches.length === 1) {
            // Single touch for swipe
            touchStartX = event.touches[0].clientX;
            touchStartY = event.touches[0].clientY;
        }
    }
  function handleTouchMove(event) {
        if (event.touches.length === 2) {
            // Handle pinch zoom
            event.preventDefault();
            const currentDistance = getPinchDistance(event);
            const scale = currentDistance / initialPinchDistance;
            pdfViewer.zoom = currentZoom * scale;
            pdfViewer.renderCurrentPage();
        }
    }

    function handleTouchEnd(event) {
        if (event.touches.length === 0) {
            // Handle swipe
            const touchEndX = event.changedTouches[0].clientX;
            const touchEndY = event.changedTouches[0].clientY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;

            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > 50) {
                    pdfViewer.previousPage();
                } else if (deltaX < -50) {
                    pdfViewer.nextPage();
                }
            }
        }
    }

    function getPinchDistance(event) {
        const touch1 = event.touches[0];
        const touch2 = event.touches[1];
        return Math.sqrt(
            Math.pow(touch2.clientX - touch1.clientX, 2) +
            Math.pow(touch2.clientY - touch1.clientY, 2)
        );
    }
}
