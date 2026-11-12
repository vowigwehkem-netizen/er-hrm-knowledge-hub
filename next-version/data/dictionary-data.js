
/**
 * ER/HRM Knowledge Hub
 * Global Employment Relations and Human Resource Management Dictionary
 *
 * This is the initial structured dataset.
 * More terms, references, examples and jurisdictions
 * will be added progressively.
 */

"use strict";

const dictionaryData = [

    {
        id: "er-001",
        term: "Absenteeism",
        letter: "A",
        category: "Employee Relations",
        definition: "Absenteeism refers to an employee's repeated or habitual absence from work, particularly when the absence is not properly authorised or justified.",
        practicalExample: "An employee repeatedly fails to report for scheduled shifts without informing the employer.",
        relatedTerms: ["Attendance Management", "Employee Turnover", "Workplace Discipline"],
        level: "Beginner"
    },

    {
        id: "er-002",
        term: "Arbitration",
        letter: "A",
        category: "Employment Relations",
        definition: "Arbitration is a dispute-resolution process in which an independent third party, known as an arbitrator, considers the arguments of disputing parties and makes a decision.",
        practicalExample: "An employer and a trade union refer a collective bargaining dispute to an agreed arbitrator.",
        relatedTerms: ["Conciliation", "Mediation", "Industrial Dispute"],
        level: "Intermediate"
    },

    {
        id: "er-003",
        term: "Collective Bargaining",
        letter: "C",
        category: "Employment Relations",
        definition: "Collective bargaining is the process through which employers or their representatives negotiate with workers' representatives or trade unions over employment conditions and workplace matters.",
        practicalExample: "A recognised trade union negotiates with management over wages, working hours and employee benefits.",
        relatedTerms: ["Trade Union", "Collective Agreement", "Industrial Relations"],
        level: "Intermediate"
    },

    {
        id: "er-004",
        term: "Constructive Dismissal",
        letter: "C",
        category: "Employment Relations",
        definition: "Constructive dismissal generally describes a situation in which an employee resigns because the employer's serious conduct or breach of contract makes continued employment untenable. Its legal definition and requirements vary by jurisdiction.",
        practicalExample: "An employee resigns following a serious unilateral change to a fundamental contractual condition, potentially giving rise to a constructive dismissal claim under applicable law.",
        relatedTerms: ["Wrongful Dismissal", "Employment Contract", "Termination of Employment"],
        level: "Advanced"
    },

    {
        id: "hr-001",
        term: "Employee Engagement",
        letter: "E",
        category: "Human Resource Management",
        definition: "Employee engagement refers to the level of employees' commitment, involvement and enthusiasm towards their work and organisation.",
        practicalExample: "An organisation introduces employee feedback sessions and recognition programmes to improve workplace engagement.",
        relatedTerms: ["Employee Motivation", "Organisational Commitment", "Job Satisfaction"],
        level: "Beginner"
    },

    {
        id: "hr-002",
        term: "Human Resource Analytics",
        letter: "H",
        category: "Human Resource Management",
        definition: "Human Resource Analytics is the systematic use of HR data, statistical methods and analytical techniques to understand workforce patterns and support evidence-based HR decisions.",
        practicalExample: "An HR department analyses recruitment and turnover data to identify why new employees leave within their first year.",
        relatedTerms: ["HR Metrics", "People Analytics", "Evidence-Based HRM"],
        level: "Advanced"
    },

    {
        id: "hr-003",
        term: "Job Analysis",
        letter: "J",
        category: "Human Resource Management",
        definition: "Job analysis is the systematic process of collecting and evaluating information about a job's duties, responsibilities, required skills and working conditions.",
        practicalExample: "An organisation studies the duties of an HR officer before preparing a job description and person specification.",
        relatedTerms: ["Job Description", "Job Specification", "Job Design"],
        level: "Beginner"
    },

    {
        id: "hr-004",
        term: "Job Evaluation",
        letter: "J",
        category: "Human Resource Management",
        definition: "Job evaluation is a systematic process of determining the relative value or worth of different jobs within an organisation for the purpose of establishing a fair and consistent pay structure.",
        practicalExample: "An organisation evaluates the responsibilities and skills required for HR, finance and administrative positions before establishing salary grades.",
        relatedTerms: ["Compensation Management", "Pay Structure", "Job Analysis"],
        level: "Intermediate"
    },

    {
        id: "hr-005",
        term: "Performance Appraisal",
        letter: "P",
        category: "Human Resource Management",
        definition: "Performance appraisal is a formal process of assessing an employee's work performance against established expectations, objectives and standards.",
        practicalExample: "A manager conducts a performance review to assess an employee's achievements, identify development needs and agree on future objectives.",
        relatedTerms: ["Performance Management", "Key Performance Indicators", "Employee Development"],
        level: "Beginner"
    },

    {
        id: "hr-006",
        term: "Strategic Human Resource Management",
        letter: "S",
        category: "Human Resource Management",
        definition: "Strategic Human Resource Management is the integration of HR policies and practices with an organisation's long-term goals and overall business strategy.",
        practicalExample: "A growing technology company develops a workforce plan, recruitment strategy and employee development programme to support its expansion goals.",
        relatedTerms: ["Human Resource Planning", "Organisational Strategy", "Talent Management"],
        level: "Advanced"
    },

    {
        id: "er-005",
        term: "Trade Union",
        letter: "T",
        category: "Employment Relations",
        definition: "A trade union is an organisation formed by workers to represent and advance their collective interests in employment matters.",
        practicalExample: "Workers join a recognised union to collectively negotiate employment conditions with their employer.",
        relatedTerms: ["Collective Bargaining", "Industrial Relations", "Collective Agreement"],
        level: "Beginner"
    },

    {
        id: "er-006",
        term: "Workplace Conflict",
        letter: "W",
        category: "Employment Relations",
        definition: "Workplace conflict refers to disagreement or tension between individuals or groups within an organisation arising from differences in interests, expectations, values or working relationships.",
        practicalExample: "Two departments disagree over resource allocation, requiring management intervention to resolve the issue.",
        relatedTerms: ["Conflict Management", "Negotiation", "Mediation"],
        level: "Beginner"
    }

];


/**
 * Retrieve all dictionary terms.
 */
function getAllDictionaryTerms() {
    return dictionaryData;
}


/**
 * Search dictionary terms.
 */
function searchDictionary(query) {

    const searchTerm = query.trim().toLowerCase();

    if (!searchTerm) {
        return dictionaryData;
    }

    return dictionaryData.filter(item =>
        item.term.toLowerCase().includes(searchTerm) ||
        item.definition.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.relatedTerms.some(term =>
            term.toLowerCase().includes(searchTerm)
        )
    );

}


/**
 * Retrieve terms by alphabet.
 */
function getDictionaryTermsByLetter(letter) {

    const selectedLetter = letter.toUpperCase();

    return dictionaryData.filter(item =>
        item.letter === selectedLetter
    );

}


/**
 * Retrieve terms by category.
 */
function getDictionaryTermsByCategory(category) {

    return dictionaryData.filter(item =>
        item.category.toLowerCase().includes(searchTerm) ||
item.practicalExample.toLowerCase().includes(searchTerm) ||
item.relatedTerms.some(term =>
    term.toLowerCase().includes(searchTerm)
)

      }
