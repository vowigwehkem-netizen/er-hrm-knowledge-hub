
/**
 * ER/HRM KNOWLEDGE HUB
 * GLOBAL DICTIONARY MODULE
 * Version: 2.1.0
 *
 * Features:
 * - Global dictionary search
 * - A-Z alphabetical navigation
 * - Category filtering
 * - Full definitions
 * - Practical workplace examples
 * - Related concepts
 * - Data validation
 * - Accessible interactions
 * - Safe HTML rendering
 */

(function (window, document) {
    'use strict';

    // Prevent duplicate module registration.
    if (window.ERHRMDictionary) {
        return;
    }

    const state = {
        initialized: false,
        data: [],
        searchTerm: '',
        selectedLetter: 'ALL',
        selectedCategory: 'ALL',
        activeTermId: null
    };

    const elements = {
        search: null,
        alphabet: null,
        category: null,
        results: null,
        count: null,
        details: null
    };

    /**
     * Escape HTML before inserting text into the page.
     */
    function escapeHTML(value) {
        return String(value == null ? '' : value).replace(
            /[&<>"']/g,
            function (character) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#39;'
                }[character];
            }
        );
    }

    /**
     * Read dictionary data from the global lexical binding.
     *
     * dictionary-data.js declares:
     * const dictionaryData = [...]
     *
     * This function checks that binding without relying on
     * window.dictionaryData.
     */
    function getSourceData() {
        try {
            if (
                typeof dictionaryData !== 'undefined' &&
                Array.isArray(dictionaryData)
            ) {
                return dictionaryData;
            }
        } catch (error) {
            console.error('Dictionary data access failed:', error);
        }

        return null;
    }

    /**
     * Validate and normalize dictionary records.
     */
    function validateData(source) {
        if (!Array.isArray(source)) {
            return [];
        }

        return source.reduce(function (valid, item, index) {
            if (
                !item ||
                typeof item !== 'object' ||
                !item.term ||
                !item.definition
            ) {
                console.warn(
                    'Dictionary: Invalid record skipped at index ' + index
                );
                return valid;
            }

            const term = String(item.term).trim();

            if (!term) {
                return valid;
            }

            const relatedTerms = Array.isArray(item.relatedTerms)
                ? item.relatedTerms
                    .filter(function (term) {
                        return term != null && String(term).trim() !== '';
                    })
                    .map(function (term) {
                        return String(term).trim();
                    })
                : [];

            valid.push({
                id: String(item.id || 'dictionary-term-' + index),
                term: term,
                letter: term.charAt(0).toUpperCase(),
                category: String(item.category || 'General').trim(),
                definition: String(item.definition).trim(),
                practicalExample: String(
                    item.practicalExample || ''
                ).trim(),
                relatedTerms: relatedTerms,
                level: String(item.level || 'All Levels').trim()
            });

            return valid;
        }, []);
    }

    /**
     * Cache homepage elements.
     */
    function cacheElements() {
        elements.search = document.getElementById(
            'dictionary-search'
        );

        elements.alphabet = document.getElementById(
            'dictionary-alphabet'
        );

        elements.category = document.getElementById(
            'dictionary-category'
        );

        elements.results = document.getElementById(
            'dictionary-results'
        );

        elements.count = document.getElementById(
            'dictionary-count'
        );

        elements.details = document.getElementById(
            'dictionary-details'
        );

        return Boolean(
            elements.search &&
            elements.alphabet &&
            elements.category &&
            elements.results &&
            elements.count &&
            elements.details
        );
    }

    /**
     * Render A-Z navigation.
     */
    function renderAlphabet() {
        const letters = ['ALL'];

        for (let code = 65; code <= 90; code++) {
            letters.push(String.fromCharCode(code));
        }

        elements.alphabet.innerHTML = letters.map(function (letter) {
            const label = letter === 'ALL' ? 'All' : letter;
            const active = state.selectedLetter === letter;

            return `
                <button
                    type="button"
                    class="dictionary-letter ${active ? 'active' : ''}"
                    data-letter="${letter}"
                    aria-pressed="${active}"
                    aria-label="${
                        letter === 'ALL'
                            ? 'Show all dictionary terms'
                            : 'Show terms beginning with ' + letter
                    }">
                    ${label}
                </button>
            `;
        }).join('');
    }

    /**
     * Populate the category dropdown.
     */
    function renderCategories() {
        const categories = Array.from(
            new Set(
                state.data.map(function (item) {
                    return item.category;
                })
            )
        ).sort();

        const options = ['ALL', ...categories];

        elements.category.innerHTML = options.map(function (category) {
            const label = category === 'ALL'
                ? 'All Categories'
                : category;

            return `
                <option value="${escapeHTML(category)}">
                    ${escapeHTML(label)}
                </option>
            `;
        }).join('');

        elements.category.value = state.selectedCategory;
    }

    /**
     * Search and filter dictionary records.
     */
    function getFilteredData() {
        const query = state.searchTerm.toLowerCase();

        return state.data.filter(function (item) {
            const searchableText = [
                item.term,
                item.definition,
                item.category,
                item.practicalExample,
                ...item.relatedTerms
            ].join(' ').toLowerCase();

            const matchesSearch =
                !query || searchableText.includes(query);

            const matchesLetter =
                state.selectedLetter === 'ALL' ||
                item.letter === state.selectedLetter;

            const matchesCategory =
                state.selectedCategory === 'ALL' ||
                item.category === state.selectedCategory;

            return (
                matchesSearch &&
                matchesLetter &&
                matchesCategory
            );
        });
    }

    /**
     * Render dictionary result cards.
     */
    function renderResults() {
        const filtered = getFilteredData();

        elements.count.textContent =
            filtered.length + (
                filtered.length === 1
                    ? ' term found'
                    : ' terms found'
            );

        if (filtered.length === 0) {
            elements.results.innerHTML = `
                <div class="dictionary-empty-state" role="status">
                    <h3>No matching terms found</h3>
                    <p>
                        Try another search or change your filters.
                    </p>
                    <button
                        type="button"
                        class="dictionary-reset-button"
                        data-action="reset">
                        Reset Filters
                    </button>
                </div>
            `;
            return;
        }

        elements.results.innerHTML = filtered.map(function (item) {
            return `
                <article
                    class="dictionary-card"
                    data-id="${escapeHTML(item.id)}">

                    <span class="dictionary-category">
                        ${escapeHTML(item.category)}
                    </span>

                    <h3>${escapeHTML(item.term)}</h3>

                    <p>
                        ${escapeHTML(
                            item.definition.length > 150
                                ? item.definition.substring(0, 150) + '...'
                                : item.definition
                        )}
                    </p>

                    <span class="dictionary-level">
                        ${escapeHTML(item.level)}
                    </span>

                    <button
                        type="button"
                        class="dictionary-view-button"
                        data-action="view"
                        data-id="${escapeHTML(item.id)}">
                        View Full Definition
                    </button>

                </article>
            `;
        }).join('');
    }

    /**
     * Close the full definition panel.
     */
    function closeDetails() {
        state.activeTermId = null;

        if (elements.details) {
            elements.details.innerHTML = '';
            elements.details.hidden = true;
        }
    }

    /**
     * Display a complete dictionary definition.
     */
    function showDetails(termId) {
        const item = state.data.find(function (entry) {
            return entry.id === termId;
        });

        if (!item) return;

        state.activeTermId = item.id;

        const exampleHTML = item.practicalExample
            ? `
                <div class="detail-section">
                    <h3>Practical Workplace Example</h3>
                    <p>${escapeHTML(item.practicalExample)}</p>
                </div>
            `
            : '';

        const relatedHTML = item.relatedTerms.length
            ? `
                <div class="detail-section">
                    <h3>Related Concepts</h3>

                    <div class="related-terms">
                        ${item.relatedTerms.map(function (term) {
                            const related = state.data.find(function (entry) {
                                return entry.term.toLowerCase() ===
                                    term.toLowerCase();
                            });

                            return related
                                ? `
                                    <button
                                        type="button"
                                        class="related-term-link"
                                        data-id="${escapeHTML(related.id)}">
                                        ${escapeHTML(term)}
                                    </button>
                                `
                                : `<span>${escapeHTML(term)}</span>`;
                        }).join('')}
                    </div>
                </div>
            `
            : '';

        elements.details.innerHTML = `
            <div class="dictionary-detail-card">

                <button
                    type="button"
                    class="dictionary-close-button"
                    data-action="close"
                    aria-label="Close definition">
                    Close
                </button>

                <span class="dictionary-category">
                    ${escapeHTML(item.category)}
                </span>

                <h2>${escapeHTML(item.term)}</h2>

                <div class="detail-section">
                    <h3>Definition</h3>
                    <p>${escapeHTML(item.definition)}</p>
                </div>

                ${exampleHTML}

                ${relatedHTML}

                <p class="dictionary-level">
                    Learning Level: ${escapeHTML(item.level)}
                </p>

            </div>
        `;

        elements.details.hidden = false;

        elements.details.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }

    /**
     * Reset all filters.
     */
    function resetFilters() {
        state.searchTerm = '';
        state.selectedLetter = 'ALL';
        state.selectedCategory = 'ALL';

        elements.search.value = '';
        elements.category.value = 'ALL';

        closeDetails();
        renderAlphabet();
        renderResults();
    }

    /**
     * Update dictionary results after a filter change.
     */
    function updateResults() {
        closeDetails();
        renderResults();
    }

    /**
     * Register interactions using event delegation.
     */
    function setupEvents() {

        elements.search.addEventListener('input', function (event) {
            state.searchTerm = event.target.value.trim();
            updateResults();
        });

        elements.alphabet.addEventListener('click', function (event) {
            const button = event.target.closest('[data-letter]');

            if (!button || !elements.alphabet.contains(button)) {
                return;
            }

            state.selectedLetter = button.dataset.letter;

            closeDetails();
            renderAlphabet();
            renderResults();
        });

        elements.category.addEventListener('change', function (event) {
            state.selectedCategory = event.target.value;
            updateResults();
        });

        elements.results.addEventListener('click', function (event) {
            const resetButton = event.target.closest(
                '[data-action="reset"]'
            );

            if (resetButton) {
                resetFilters();
                return;
            }

            const viewButton = event.target.closest(
                '[data-action="view"]'
            );

            if (viewButton) {
                showDetails(viewButton.dataset.id);
            }
        });

        elements.details.addEventListener('click', function (event) {
            const closeButton = event.target.closest(
                '[data-action="close"]'
            );

            if (closeButton) {
                closeDetails();
                return;
            }

            const relatedButton = event.target.closest(
                '.related-term-link[data-id]'
            );

            if (relatedButton) {
                showDetails(relatedButton.dataset.id);
            }
        });
    }

    /**
     * Initialize the Dictionary Module.
     */
    function init() {
        if (state.initialized) return;

        if (!cacheElements()) {
            console.error(
                'ERHRMDictionary: One or more required homepage elements are missing.'
            );
            return;
        }

        const source = getSourceData();

        if (!source) {
            elements.results.innerHTML = `
                <div class="dictionary-error-banner" role="alert">
                    Dictionary data could not be loaded.
                    Please check the dictionary dataset.
                </div>
            `;

            console.error(
                'ERHRMDictionary: dictionaryData is unavailable.'
            );

            return;
        }

        state.data = validateData(source);

        if (state.data.length === 0) {
            elements.results.innerHTML = `
                <div class="dictionary-error-banner" role="alert">
                    No valid dictionary records are available.
                </div>
            `;
            return;
        }

        renderAlphabet();
        renderCategories();
        renderResults();
        setupEvents();

        state.initialized = true;

        console.log(
            'ER/HRM Dictionary initialized successfully:',
            state.data.length,
            'valid terms loaded.'
        );
    }

    /**
     * Public module interface.
     */
    window.ERHRMDictionary = {
        init: init,

        search: function (query) {
            if (!state.initialized) return;

            state.searchTerm = String(query || '');
            elements.search.value = state.searchTerm;

            updateResults();
        },

        reset: function () {
            if (!state.initialized) return;

            resetFilters();
        },

        getInfo: function () {
            return {
                version: '2.1.0',
                initialized: state.initialized,
                totalTerms: state.data.length
            };
        }
    };

    // Initialize after the homepage has loaded.
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window, document);
               
