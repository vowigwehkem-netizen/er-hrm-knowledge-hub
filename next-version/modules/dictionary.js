
/* =========================================================
   ER/HRM KNOWLEDGE HUB
   GLOBAL DICTIONARY MODULE
   ========================================================= */

"use strict";

const ERHRMDictionary = {

    initialized: false,

    state: {
        searchQuery: "",
        selectedLetter: "ALL",
        selectedCategory: "ALL",
        selectedTerm: null
    },

    elements: {},

    /**
     * Initialise the dictionary module.
     */
    init() {

        if (this.initialized) return;

        if (typeof dictionaryData === "undefined") {
            console.error("Dictionary dataset not found.");
            return;
        }

        this.cacheElements();
        this.renderAlphabet();
        this.renderDictionary();
        this.setupEvents();

        this.initialized = true;

        console.log("ER/HRM Dictionary Module initialized.");

    },

    /**
     * Find and store required HTML elements.
     */
    cacheElements() {

        this.elements = {
            search: document.getElementById("dictionary-search"),
            alphabet: document.getElementById("dictionary-alphabet"),
            category: document.getElementById("dictionary-category"),
            results: document.getElementById("dictionary-results"),
            count: document.getElementById("dictionary-count"),
            details: document.getElementById("dictionary-details")
        };

    },

    /**
     * Display alphabet navigation.
     */
    renderAlphabet() {

        const container = this.elements.alphabet;

        if (!container) return;

        const letters = ["ALL", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

        container.innerHTML = letters.map(letter => `
            <button
                type="button"
                class="dictionary-letter ${
                    this.state.selectedLetter === letter ? "active" : ""
                }"
                data-letter="${letter}">
                ${letter}
            </button>
        `).join("");

    },

    /**
     * Display dictionary categories.
     */
    getCategories() {

        return [
            "ALL",
            ...new Set(dictionaryData.map(item => item.category))
        ];

    },

    /**
     * Filter dictionary records.
     */
    getFilteredTerms() {

        return dictionaryData.filter(item => {

            const query = this.state.searchQuery.toLowerCase();

            const matchesSearch =
                !query ||
                item.term.toLowerCase().includes(query) ||
                item.definition.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.relatedTerms.some(term =>
                    term.toLowerCase().includes(query)
                );

            const matchesLetter =
                this.state.selectedLetter === "ALL" ||
                item.letter === this.state.selectedLetter;

            const matchesCategory =
                this.state.selectedCategory === "ALL" ||
                item.category === this.state.selectedCategory;

            return (
                matchesSearch &&
                matchesLetter &&
                matchesCategory
            );

        });

    },

    /**
     * Render dictionary results.
     */
    renderDictionary() {

        const container = this.elements.results;

        if (!container) return;

        const terms = this.getFilteredTerms();

        if (this.elements.count) {
            this.elements.count.textContent =
                `${terms.length} terms found`;
        }

        if (terms.length === 0) {

            container.innerHTML = `
                <div class="dictionary-empty">
                    <h3>No matching terms found</h3>
                    <p>Try another search or select a different letter.</p>
                </div>
            `;

            return;
        }

        container.innerHTML = terms.map(item => `
            <article class="dictionary-card">

                <span class="dictionary-category">
                    ${this.escapeHTML(item.category)}
                </span>

                <h3>${this.escapeHTML(item.term)}</h3>

                <p>
                    ${this.escapeHTML(item.definition)}
                </p>

                <span class="dictionary-level">
                    ${this.escapeHTML(item.level)}
                </span>

                <button
                    type="button"
                    class="dictionary-view-button"
                    data-term-id="${this.escapeHTML(item.id)}">
                    View Full Definition
                </button>

            </article>
        `).join("");

    },

    /**
     * Display complete details of a selected term.
     */
    showTermDetails(termId) {

        const item = dictionaryData.find(
            term => term.id === termId
        );

        const container = this.elements.details;

        if (!item || !container) return;

        this.state.selectedTerm = item;

        container.innerHTML = `
            <div class="dictionary-detail-card">

                <button
                    type="button"
                    class="dictionary-close-button"
                    id="dictionary-close-details">
                    Close
                </button>

                <span class="dictionary-category">
                    ${this.escapeHTML(item.category)}
                </span>

                <h2>${this.escapeHTML(item.term)}</h2>

                <h3>Definition</h3>

                <p>${this.escapeHTML(item.definition)}</p>

                <h3>Practical Workplace Example</h3>

                <p>${this.escapeHTML(item.practicalExample)}</p>

                <h3>Related Concepts</h3>

                <div class="related-terms">
                    ${item.relatedTerms.map(term => `
                        <span>${this.escapeHTML(term)}</span>
                    `).join("")}
                </div>

                <p class="dictionary-level">
                    Learning Level: ${this.escapeHTML(item.level)}
                </p>

            </div>
        `;

        container.hidden = false;

        container.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    },

    /**
     * Escape HTML special characters before rendering data.
     */
    escapeHTML(value) {

        return String(value).replace(/[&<>"']/g, character => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[character]);

    },

    /**
     * Connect dictionary interactions.
     */
    setupEvents() {

        const search = this.elements.search;
        const alphabet = this.elements.alphabet;
        const category = this.elements.category;
        const results = this.elements.results;
        const details = this.elements.details;

        if (search) {

            search.addEventListener("input", event => {

                this.state.searchQuery = event.target.value;

                this.renderDictionary();

            });

        }

        if (alphabet) {

            alphabet.addEventListener("click", event => {

                const button = event.target.closest("[data-letter]");

                if (!button) return;

                this.state.selectedLetter =
                    button.dataset.letter;

                this.renderAlphabet();
                this.renderDictionary();

            });

        }

        if (category) {

            category.innerHTML = this.getCategories()
                .map(item => `
                    <option value="${this.escapeHTML(item)}">
                        ${this.escapeHTML(item)}
                    </option>
                `).join("");

            category.addEventListener("change", event => {

                this.state.selectedCategory = event.target.value;

                this.renderDictionary();

            });

        }

        if (results) {

            results.addEventListener("click", event => {

                const button = event.target.closest(
                    "[data-term-id]"
                );

                if (!button) return;

                this.showTermDetails(button.dataset.termId);

            });

        }

        if (details) {

            details.addEventListener("click", event => {

                if (
                    event.target.id === "dictionary-close-details"
                ) {

                    details.hidden = true;
                    this.state.selectedTerm = null;

                }

            });

        }

    }

};


/**
 * Initialise dictionary when the document is ready.
 */
document.addEventListener("DOMContentLoaded", () => {

    ERHRMDictionary.init();

});
          
