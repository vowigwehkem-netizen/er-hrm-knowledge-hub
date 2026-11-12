
/* =========================================================
   ER/HRM KNOWLEDGE HUB
   Advanced Version - Core Application Engine
   ========================================================= */

"use strict";

/**
 * Main application controller.
 * Responsible for initialising the advanced platform
 * and managing shared application functionality.
 */

const ERHRMApp = {

    version: "2.0.0",

    initialized: false,

    config: {
        appName: "ER/HRM Knowledge Hub",
        language: "en",
        defaultTheme: "light",
        developmentMode: true
    },

    environment: {},

    /**
     * Initialise the application.
     */
    init() {

        if (this.initialized) {
            return;
        }

        this.detectEnvironment();
        this.setupNavigation();
        this.updateCurrentYear();
        this.setupAccessibility();

        this.initialized = true;

        console.log(
            `${this.config.appName} v${this.version} initialized successfully.`
        );
    },

    /**
     * Detect basic device and browser information.
     */
    detectEnvironment() {

        this.environment = {
            online: navigator.onLine,
            mobile: /Android|iPhone|iPad|iPod/i.test(
                navigator.userAgent
            ),
            language: navigator.language || "en"
        };

        console.log("Application environment:", this.environment);
    },

    /**
     * Handle mobile navigation.
     */
    setupNavigation() {

        const menuToggle = document.getElementById("menu-toggle");

        const navigation = document.getElementById(
            "main-navigation"
        );

        if (!menuToggle || !navigation) {
            console.warn("Navigation elements were not found.");
            return;
        }

        menuToggle.addEventListener("click", () => {

            const isExpanded =
                menuToggle.getAttribute("aria-expanded") === "true";

            navigation.classList.toggle("active");

            menuToggle.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            menuToggle.setAttribute(
                "aria-label",
                isExpanded ? "Open navigation" : "Close navigation"
            );

        });

        /**
         * Close mobile navigation after selecting a link.
         */
        navigation.querySelectorAll("a").forEach(link => {

            link.addEventListener("click", () => {

                navigation.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation"
                );

            });

        });

    },

    /**
     * Display the current year automatically.
     */
    updateCurrentYear() {

        const yearElement = document.getElementById(
            "current-year"
        );

        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }

    },

    /**
     * Add basic accessibility support.
     */
    setupAccessibility() {

        document.documentElement.setAttribute(
            "data-app-version",
            this.version
        );

        document.documentElement.setAttribute(
            "lang",
            this.config.language
        );

    },

    /**
     * Return basic application information.
     */
    getInfo() {

        return {
            name: this.config.appName,
            version: this.version,
            language: this.config.language,
            initialized: this.initialized,
            environment: this.environment
        };

    }

};


/**
 * Start the application when the document is ready.
 */
document.addEventListener("DOMContentLoaded", () => {

    ERHRMApp.init();

});


/**
 * Monitor internet connection changes.
 */
window.addEventListener("online", () => {

    ERHRMApp.environment.online = true;

    console.log("Internet connection restored.");

});


window.addEventListener("offline", () => {

    ERHRMApp.environment.online = false;

    console.log("Internet connection lost.");

});
