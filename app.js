/**
 * ER/HRM Knowledge Hub
 * Main Application Script
 * Dictionary and Page Navigation
 */

// Initialize the dictionary when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initDictionary();
});

/**
 * DICTIONARY FUNCTIONALITY
 */

function initDictionary() {
    const dictionaryContainer = document.getElementById('dictionary-list');
    const searchInput = document.getElementById('search-term');
    const alphabetFilterContainer = document.getElementById('alphabet-filter');

    if (!dictionaryContainer || !searchInput || !alphabetFilterContainer) {
        console.error('Dictionary HTML elements are missing.');
        return;
    }

    if (typeof erHrmDictionary === 'undefined') {
        dictionaryContainer.innerHTML =
            '<p>Dictionary data could not be loaded. Please check dictionary-data.js.</p>';
        return;
    }

    let currentFilterLetter = 'ALL';
    let currentSearchTerm = '';

    const alphabet = ['ALL', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];

    alphabetFilterContainer.innerHTML = alphabet.map(letter => `
        <button
            type="button"
            class="letter-btn ${letter === 'ALL' ? 'active' : ''}"
            data-letter="${letter}">
            ${letter}
        </button>
    `).join('');

    function renderTerms() {
        const filtered = erHrmDictionary.filter(item => {
            const term = (item.term || '').toLowerCase();
            const definition = (item.definition || '').toLowerCase();
            const category = (item.category || '').toLowerCase();
            const search = currentSearchTerm.toLowerCase();

            const matchesLetter =
                currentFilterLetter === 'ALL' ||
                term.toUpperCase().startsWith(currentFilterLetter);

            const matchesSearch =
                term.includes(search) ||
                definition.includes(search) ||
                category.includes(search);

            return matchesLetter && matchesSearch;
        });

        if (filtered.length === 0) {
            dictionaryContainer.innerHTML =
                '<p>No dictionary terms found. Try another search.</p>';
            return;
        }

        dictionaryContainer.innerHTML = filtered.map(item => `
            <article class="term-card">
                <span class="category-badge">${item.category}</span>
                <h4>${item.term}</h4>
                <p>${item.definition}</p>
            </article>
        `).join('');
    }

    searchInput.addEventListener('input', event => {
        currentSearchTerm = event.target.value.trim();
        renderTerms();
    });

    alphabetFilterContainer.addEventListener('click', event => {
        const button = event.target.closest('.letter-btn');

        if (!button) return;

        alphabetFilterContainer
            .querySelectorAll('.letter-btn')
            .forEach(btn => btn.classList.remove('active'));

        button.classList.add('active');
        currentFilterLetter = button.dataset.letter;

        renderTerms();
    });

    renderTerms();
}

/**
 * PAGE NAVIGATION
 * Switch between Dictionary and Learning Academy.
 */

function switchView(viewId, event) {
    if (event) {
        event.preventDefault();
    }

    const views = document.querySelectorAll('.view-section');
    const selectedView = document.getElementById(viewId);

    if (!selectedView) {
        console.error('Requested page section was not found:', viewId);
        return;
    }

    views.forEach(view => {
        view.classList.add('hidden');
    });

    selectedView.classList.remove('hidden');

    // Update active navigation link
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.classList.remove('active');
    });

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}
