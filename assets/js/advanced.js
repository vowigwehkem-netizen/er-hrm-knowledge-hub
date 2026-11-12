/* =====================================================
   ER/HRM KNOWLEDGE HUB
   ADVANCED APPLICATION FOUNDATION
   ===================================================== */

const ERHRMAdvanced = {
    version: "1.0.0",
    initialized: false,

    config: {
        appName: "ER/HRM Knowledge Hub",
        language: "en",
        defaultTheme: "light",
        developmentMode: true
    },

    init() {
        if (this.initialized) return;

        this.initialized = true;

        console.log(
            `${this.config.appName} Advanced Foundation Loaded`
        );

        this.detectEnvironment();
        this.setupAccessibility();
    },

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

    setupAccessibility() {
        document.documentElement.setAttribute(
            "data-app-version",
            this.version
        );
    },

    getInfo() {
        return {
            name: this.config.appName,
            version: this.version,
            language: this.config.language,
            initialized: this.initialized
        };
    }
};

document.addEventListener("DOMContentLoaded", () => {
    ERHRMAdvanced.init();
});
