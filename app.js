/**
 * ER/HRM Knowledge Hub - Core Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
    initDictionary();
});

function initDictionary() {
    const dictionaryContainer = document.getElementById('dictionary-list');
    const searchInput = document.getElementById('search-term');
    const alphabetFilterContainer = document.getElementById('alphabet-filter');
    
    if (!dictionaryContainer) return;

    // Render Alphabet Filter Buttons
    const alphabet = 'ALL-ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alphabetFilterContainer.innerHTML = alphabet.map(letter => {
        const char = letter === 'ALL-A' ? 'ALL' : letter;
        return `<button class="letter-btn ${letter === 'ALL-A' ? 'active' : ''}" data-letter="${letter}">${letter === 'ALL-A' ? 'ALL' : letter}</button>`;
    }).join('');

    // State Variable
    let currentFilterLetter = 'ALL-A';
    let currentSearchTerm = '';

    function renderTerms() {
        const filtered = erHrmDictionary.filter(item => {
            const matchesLetter = currentFilterLetter === 'ALL-A' || item.term.toUpperCase().startsWith(currentFilterLetter);
            const matchesSearch = item.term.toLowerCase().includes(currentSearchTerm.toLowerCase()) || 
                                  item.definition.toLowerCase().includes(currentSearchTerm.toLowerCase()) ||
                                  item.category.toLowerCase().includes(currentSearchTerm.toLowerCase());
            return matchesLetter && matchesSearch;
        });

        if (filtered.length === 0) {
            dictionaryContainer.innerHTML = '<p style="padding: 1rem; color: var(--text-muted);">No dictionary terms found matching your query.</p>';
            return;
        }

        dictionaryContainer.innerHTML = filtered.map(item => `
            <div class="term-card">
                <span class="category-badge">${item.category}</span>
                <h4>${item.term}</h4>
                <p>${item.definition}</p>
            </div>
        `).join('');
    }

    // Event Listeners
    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim();
        renderTerms();
    });

    alphabetFilterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('letter-btn')) {
            document.querySelectorAll('.letter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentFilterLetter = e.target.dataset.letter;
            renderTerms();
        }
    });

    // Initial render
    renderTerms();
              }
