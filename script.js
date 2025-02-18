// Function to generate a random token
function generateToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 16; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

// Function to hash the token into a password (SHA-256)
async function generatePassword(token) {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 8); // Use first 8 characters as the password
}

// Function to handle login
function login(password) {
    const storedPassword = localStorage.getItem('userPassword');
    if (!storedPassword) {
        localStorage.setItem('userPassword', password);
        alert("Login successful! You are now logged in.");
        loadPDF();
    } else if (storedPassword === password) {
        alert("Welcome back! You are already logged in.");
        loadPDF();
    } else {
        alert("Invalid password. Please try again.");
    }
}

// Function to load and render the PDF
async function loadPDF() {
    const storedPassword = localStorage.getItem('userPassword');
    if (!storedPassword) {
        document.getElementById('loginMessage').textContent = "Please log in to view the PDF.";
        return;
    }

    document.getElementById('loginMessage').style.display = 'none';
    document.getElementById('pdfCanvas').style.display = 'block';

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

// Event listeners for token generation and login
document.getElementById('generateTokenButton').addEventListener('click', () => {
    const token = generateToken();
    alert(`Share this token with sales personnel: ${token}`);
    generatePassword(token).then(password => {
        alert(`Generated Password: ${password}`);
        document.getElementById('passwordInput').style.display = 'inline-block';
        document.getElementById('loginButton').style.display = 'inline-block';
    });
});

document.getElementById('loginButton').addEventListener('click', () => {
    const password = document.getElementById('passwordInput').value;
    if (password) {
        login(password);
    } else {
        alert("Please enter a password.");
    }
});

// Disable right-click and download
document.addEventListener('contextmenu', event => event.preventDefault());
