// Sample data
let books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Fiction", status: "Available" },
    { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", category: "Fiction", status: "Available" },
    { id: 3, title: "1984", author: "George Orwell", category: "Fiction", status: "Borrowed" }
];

let members = [
    { id: 1, name: "John Doe", email: "john@example.com", phone: "1234567890", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321", status: "Active" }
];

let transactions = [
    { id: 1, bookId: 3, memberId: 1, issueDate: "2023-01-15", dueDate: "2023-02-15", status: "Active" }
];

// DOM Elements
const navLinks = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('.section');
const modals = document.querySelectorAll('.modal');
const closeButtons = document.querySelectorAll('.close');

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const sectionId = link.getAttribute('data-section');
        
        // Update active state
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show selected section
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === sectionId) {
                section.classList.add('active');
            }
        });
    });
});

// Modal Functions
function showAddBookModal() {
    document.getElementById('addBookModal').style.display = 'block';
}

function showAddMemberModal() {
    document.getElementById('addMemberModal').style.display = 'block';
}

function showIssueBookModal() {
    const bookSelect = document.getElementById('issueBook');
    const memberSelect = document.getElementById('issueMember');
    
    // Populate book dropdown
    bookSelect.innerHTML = '<option value="">Select Book</option>';
    books.forEach(book => {
        if (book.status === 'Available') {
            bookSelect.innerHTML += `<option value="${book.id}">${book.title}</option>`;
        }
    });
    
    // Populate member dropdown
    memberSelect.innerHTML = '<option value="">Select Member</option>';
    members.forEach(member => {
        if (member.status === 'Active') {
            memberSelect.innerHTML += `<option value="${member.id}">${member.name}</option>`;
        }
    });
    
    document.getElementById('issueBookModal').style.display = 'block';
}

// Close modals
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        modals.forEach(modal => {
            modal.style.display = 'none';
        });
    });
});

// Close modals when clicking outside
window.addEventListener('click', (event) => {
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
});

// Form Submissions
document.getElementById('addBookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newBook = {
        id: books.length + 1,
        title: document.getElementById('bookTitle').value,
        author: document.getElementById('bookAuthor').value,
        category: document.getElementById('bookCategory').value,
        status: 'Available'
    };
    
    books.push(newBook);
    updateBooksTable();
    document.getElementById('addBookModal').style.display = 'none';
    e.target.reset();
});

document.getElementById('addMemberForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newMember = {
        id: members.length + 1,
        name: document.getElementById('memberName').value,
        email: document.getElementById('memberEmail').value,
        phone: document.getElementById('memberPhone').value,
        status: 'Active'
    };
    
    members.push(newMember);
    updateMembersTable();
    document.getElementById('addMemberModal').style.display = 'none';
    e.target.reset();
});

document.getElementById('issueBookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const bookId = parseInt(document.getElementById('issueBook').value);
    const memberId = parseInt(document.getElementById('issueMember').value);
    const issueDate = document.getElementById('issueDate').value;
    const dueDate = document.getElementById('dueDate').value;
    
    // Update book status
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex].status = 'Borrowed';
    }
    
    // Add transaction
    const newTransaction = {
        id: transactions.length + 1,
        bookId,
        memberId,
        issueDate,
        dueDate,
        status: 'Active'
    };
    
    transactions.push(newTransaction);
    updateTransactionsTable();
    updateBooksTable();
    document.getElementById('issueBookModal').style.display = 'none';
    e.target.reset();
});

// Update Tables
function updateBooksTable() {
    const tbody = document.getElementById('booksTableBody');
    tbody.innerHTML = '';
    
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td>${book.status}</td>
            <td>
                <button class="action-btn" onclick="returnBook(${book.id})" ${book.status === 'Available' ? 'disabled' : ''}>
                    <i class="fas fa-undo"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateMembersTable() {
    const tbody = document.getElementById('membersTableBody');
    tbody.innerHTML = '';
    
    members.forEach(member => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.email}</td>
            <td>${member.phone}</td>
            <td>${member.status}</td>
            <td>
                <button class="action-btn" onclick="toggleMemberStatus(${member.id})">
                    <i class="fas fa-user-${member.status === 'Active' ? 'slash' : 'check'}"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function updateTransactionsTable() {
    const tbody = document.getElementById('transactionsTableBody');
    tbody.innerHTML = '';
    
    transactions.forEach(transaction => {
        const book = books.find(b => b.id === transaction.bookId);
        const member = members.find(m => m.id === transaction.memberId);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.id}</td>
            <td>${book ? book.title : 'Unknown'}</td>
            <td>${member ? member.name : 'Unknown'}</td>
            <td>${transaction.issueDate}</td>
            <td>${transaction.dueDate}</td>
            <td>${transaction.status}</td>
            <td>
                <button class="action-btn" onclick="returnBook(${transaction.bookId})" ${transaction.status === 'Returned' ? 'disabled' : ''}>
                    <i class="fas fa-undo"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Additional Functions
function returnBook(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex].status = 'Available';
    }
    
    const transactionIndex = transactions.findIndex(t => t.bookId === bookId && t.status === 'Active');
    if (transactionIndex !== -1) {
        transactions[transactionIndex].status = 'Returned';
    }
    
    updateBooksTable();
    updateTransactionsTable();
}

function toggleMemberStatus(memberId) {
    const memberIndex = members.findIndex(member => member.id === memberId);
    if (memberIndex !== -1) {
        members[memberIndex].status = members[memberIndex].status === 'Active' ? 'Inactive' : 'Active';
        updateMembersTable();
    }
}

// Initialize Charts
function initializeCharts() {
    // Book Circulation Chart
    const bookCirculationCtx = document.getElementById('bookCirculationChart').getContext('2d');
    new Chart(bookCirculationCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Books Borrowed',
                data: [12, 19, 15, 25, 22, 30],
                backgroundColor: '#4cd137'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Member Activity Chart
    const memberActivityCtx = document.getElementById('memberActivityChart').getContext('2d');
    new Chart(memberActivityCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Active Members',
                data: [65, 59, 80, 81, 56, 55],
                borderColor: '#4cd137',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateBooksTable();
    updateMembersTable();
    updateTransactionsTable();
    initializeCharts();
});

// Question Papers Functions
function showAddQuestionPaperModal() {
    document.getElementById('addQuestionPaperModal').style.display = 'block';
}

// Handle Question Paper Form Submission
document.getElementById('addQuestionPaperForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const paperData = {
        title: document.getElementById('paperTitle').value,
        category: document.getElementById('paperCategory').value,
        year: document.getElementById('paperYear').value,
        file: document.getElementById('paperFile').files[0]
    };
    
    // Here you would typically upload the file and save the data
    console.log('New question paper added:', paperData);
    
    // Close the modal and reset the form
    document.getElementById('addQuestionPaperModal').style.display = 'none';
    e.target.reset();
});

// Sample question papers data
const questionPapers = {
    '10th': [
        { title: 'Mathematics', year: 2023 },
        { title: 'Science', year: 2023 },
        { title: 'Social Science', year: 2023 }
    ],
    '12th': [
        { title: 'Physics', year: 2023 },
        { title: 'Chemistry', year: 2023 },
        { title: 'Mathematics', year: 2023 },
        { title: 'Biology', year: 2023 }
    ],
    'beu': [
        { title: '1st Semester', year: 2023 },
        { title: '2nd Semester', year: 2023 },
        { title: '3rd Semester', year: 2023 },
        { title: '4th Semester', year: 2023 },
        { title: '5th Semester', year: 2023 },
        { title: '6th Semester', year: 2023 },
        { title: '7th Semester', year: 2023 },
        { title: '8th Semester', year: 2023 }
    ],
    'jee': [
        { title: 'JEE Mains 2023', year: 2023 },
        { title: 'JEE Advanced 2023', year: 2023 },
        { title: 'Previous Years', year: 2022 }
    ],
    'neet': [
        { title: 'NEET 2023', year: 2023 },
        { title: 'Previous Years', year: 2022 }
    ],
    'other': [
        { title: 'GATE', year: 2023 },
        { title: 'UPSC', year: 2023 },
        { title: 'SSC', year: 2023 },
        { title: 'Banking', year: 2023 }
    ]
};

// Function to load question papers
function loadQuestionPapers() {
    const grid = document.querySelector('.question-papers-grid');
    if (!grid) return;

    for (const [category, papers] of Object.entries(questionPapers)) {
        const categoryDiv = document.querySelector(`.exam-category h3:contains('${category}')`)?.parentElement;
        if (categoryDiv) {
            const papersList = categoryDiv.querySelector('.papers-list');
            papers.forEach(paper => {
                const link = document.createElement('a');
                link.href = '#';
                link.className = 'paper-link';
                link.innerHTML = `<i class="fas fa-file-pdf"></i> ${paper.title}`;
                papersList.appendChild(link);
            });
        }
    }
}

// Initialize question papers when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadQuestionPapers();
}); 