
/**
 * ER/HRM Knowledge Hub - Learning Academy Interaction Script
 */

let currentPathwayId = 'undergraduate';
let currentActiveCourse = null;

function initAcademy() {
    if (typeof learningPathways === 'undefined') {
        console.error('Learning Academy dataset could not be loaded.');
        return;
    }

    renderPathwayTabs();
    loadPathway(currentPathwayId);
}

function renderPathwayTabs() {
    const tabsContainer = document.getElementById('pathway-tabs');
    if (!tabsContainer) return;

    tabsContainer.innerHTML = learningPathways.map(pathway => `
        <button class="pathway-tab ${pathway.id === currentPathwayId ? 'active' : ''}"
                onclick="selectPathway('${pathway.id}')">
            ${pathway.name}
        </button>
    `).join('');
}

function selectPathway(pathwayId) {
    currentPathwayId = pathwayId;
    currentActiveCourse = null;

    renderPathwayTabs();
    loadPathway(pathwayId);
    backToCatalog();
}

function loadPathway(pathwayId) {
    const pathway = learningPathways.find(p => p.id === pathwayId);
    if (!pathway) return;

    const infoBox = document.getElementById('pathway-info');
    const catalogContainer = document.getElementById('course-catalog');

    if (!infoBox || !catalogContainer) return;

    infoBox.innerHTML = `
        <h4>${pathway.name}</h4>
        <p>${pathway.description}</p>
    `;

    catalogContainer.innerHTML = pathway.courses.map(course => `
        <div class="course-card">
            <div>
                <span class="course-category-badge">${course.category}</span>
                <h5>${course.title}</h5>
                <p>${course.description}</p>
            </div>
            <button class="btn-primary" onclick="openCourse('${course.id}')">
                Start Course &rarr;
            </button>
        </div>
    `).join('');
}

function openCourse(courseId) {
    const pathway = learningPathways.find(p => p.id === currentPathwayId);
    if (!pathway) return;

    const course = pathway.courses.find(c => c.id === courseId);
    if (!course) return;

    currentActiveCourse = course;

    document.getElementById('course-catalog').classList.add('hidden');
    document.getElementById('pathway-info').classList.add('hidden');
    document.getElementById('pathway-tabs').classList.add('hidden');

    const detailView = document.getElementById('course-detail-view');
    const contentArea = document.getElementById('course-content-area');

    if (!detailView || !contentArea) return;

    detailView.classList.remove('hidden');

    const objectivesHTML = course.objectives.map(obj =>
        `<li>${obj}</li>`
    ).join('');

    const lessonsHTML = course.lessons.map(lesson => `
        <div class="lesson-box">
            <h5>${lesson.title}</h5>
            <p>${lesson.content}</p>
            <p><strong>Practical Example:</strong> ${lesson.practicalExample}</p>
            <p><strong>Learning Activity:</strong> ${lesson.activity}</p>
        </div>
    `).join('');

    contentArea.innerHTML = `
        <span class="course-category-badge">${course.category}</span>
        <h3 style="color: var(--primary-navy); margin-bottom: 0.5rem;">
            ${course.title}
        </h3>

        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">
            ${course.description}
        </p>

        <div style="background: var(--bg-light); padding: 1.25rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem;">
            <h5 style="color: var(--primary-navy); margin-bottom: 0.5rem;">
                Learning Objectives
            </h5>
            <ul style="padding-left: 1.25rem; color: var(--text-dark);">
                ${objectivesHTML}
            </ul>
        </div>

        <h4 style="color: var(--primary-navy); margin-bottom: 1rem;">
            Structured Lessons
        </h4>

        ${lessonsHTML}

        <div class="quiz-box">
            <h4 style="color: var(--primary-navy); margin-bottom: 0.5rem;">
                Knowledge Assessment Quiz
            </h4>

            <p style="font-weight: 600; margin-bottom: 1rem;">
                ${course.quiz.question}
            </p>

            <div class="quiz-options">
                ${course.quiz.options.map((opt, idx) => `
                    <button class="quiz-option-btn"
                            onclick="submitQuizAnswer('${course.id}', ${idx})">
                        ${String.fromCharCode(65 + idx)}. ${opt}
                    </button>
                `).join('')}
            </div>

            <div id="quiz-feedback"></div>
        </div>
    `;
}

function submitQuizAnswer(courseId, selectedIdx) {
    const pathway = learningPathways.find(p => p.id === currentPathwayId);
    if (!pathway) return;

    const course = pathway.courses.find(c => c.id === courseId);
    if (!course) return;

    const feedbackDiv = document.getElementById('quiz-feedback');
    if (!feedbackDiv) return;

    if (selectedIdx === course.quiz.correctIndex) {
        feedbackDiv.innerHTML = `
            <div class="quiz-result correct">
                Correct! ${course.quiz.explanation}
            </div>
        `;
    } else {
        feedbackDiv.innerHTML = `
            <div class="quiz-result incorrect">
                Incorrect. The correct answer is option
                ${String.fromCharCode(65 + course.quiz.correctIndex)}.
                ${course.quiz.explanation}
            </div>
        `;
    }
}

function backToCatalog() {
    const detailView = document.getElementById('course-detail-view');
    const catalog = document.getElementById('course-catalog');
    const info = document.getElementById('pathway-info');
    const tabs = document.getElementById('pathway-tabs');

    if (detailView) detailView.classList.add('hidden');
    if (catalog) catalog.classList.remove('hidden');
    if (info) info.classList.remove('hidden');
    if (tabs) tabs.classList.remove('hidden');

    currentActiveCourse = null;
}

document.addEventListener('DOMContentLoaded', initAcademy);
