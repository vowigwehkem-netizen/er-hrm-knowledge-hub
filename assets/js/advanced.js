
/* =====================================================
   ER/HRM KNOWLEDGE HUB
   ADVANCED APPLICATION FOUNDATION
   ===================================================== */

const ERHRMAdvanced = {

    version: "1.0.0",

    initialized: false,

    // Application configuration
    config: {
        appName: "ER/HRM Knowledge Hub",
        language: "en",
        defaultTheme: "light",
        developmentMode: true
    },

    // Initialize the advanced application
    init() {
        if (this.initialized) {
            return;
        }

        this.initialized = true;

        console.log(
            `${this.config.appName} Advanced Foundation Loaded`
        );

        this.detectEnvironment();
        this.setupAccessibility();
    },

    // Detect browser environment
    detectEnvironment() {
        this.environment = {
            online: navigator.onLine,
            mobile: /Android|iPhone|iPad/i.test(
                navigator.userAgent
            ),
            language: navigator.language || "en"
        };

        console.log("Environment:", this.environment);
    },

    // Basic accessibility support
    setupAccessibility() {
        document.documentElement.setAttribute(
            "data-app-version",
            this.version
        );
    },

    // Display application information
    getInfo() {
        return {
            name: this.config.appName,
            version: this.version,
            language: this.config.language,
            initialized: this.initialized
        };
    }
};

// Initialize when the page is ready
document.addEventListener("DOMContentLoaded", () => {
    ERHRMAdvanced.init();
});
