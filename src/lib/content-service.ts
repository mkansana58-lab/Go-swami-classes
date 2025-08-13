// For Fixed, Pre-built Student-facing content
export interface Topic {
  id: string;
  title: string;
  completed: boolean;
}

export interface Module {
  id: string;
  title: string;
  topics: Topic[];
}

export interface StudyPlan {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

export function getFixedContent(): StudyPlan[] {
    return [
        {
            id: 'nda-foundation',
            title: 'NDA Foundation Course',
            description: 'A comprehensive 12-week course covering all subjects for the National Defence Academy entrance exam.',
            modules: [
                {
                    id: 'nda-math-1',
                    title: 'Module 1: Mathematics - Algebra & Trigonometry',
                    topics: [
                        { id: 't1', title: 'Complex Numbers', completed: false },
                        { id: 't2', title: 'Quadratic Equations', completed: false },
                        { id: 't3', title: 'Sequences and Series', completed: false },
                        { id: 't4', title: 'Trigonometric Ratios and Identities', completed: false },
                        { id: 't5', title: 'Inverse Trigonometric Functions', completed: false },
                    ]
                },
                {
                    id: 'nda-gat-1',
                    title: 'Module 2: General Ability - English',
                    topics: [
                        { id: 't6', title: 'Spotting Errors', completed: false },
                        { id: 't7', title: 'Vocabulary (Synonyms/Antonyms)', completed: false },
                        { id: 't8', title: 'Reading Comprehension', completed: false },
                        { id: 't9', title: 'Sentence Improvement', completed: false },
                    ]
                },
                {
                    id: 'nda-gat-2',
                    title: 'Module 3: General Ability - History & Polity',
                    topics: [
                        { id: 't10', title: 'Indian Freedom Struggle', completed: false },
                        { id: 't11', title: 'Constitution of India: Features', completed: false },
                        { id: 't12', title: 'Panchayati Raj', completed: false },
                        { id: 't13', title: 'Mauryan and Gupta Empires', completed: false },
                    ]
                }
            ]
        },
        {
            id: 'af-xy',
            title: 'Air Force X & Y Group',
            description: 'A focused 8-week program for technical and non-technical trades in the Indian Air Force.',
            modules: [
                {
                    id: 'af-x-phy',
                    title: 'Module 1 (X Group): Physics',
                    topics: [
                        { id: 'p1', title: 'Kinematics', completed: false },
                        { id: 'p2', title: 'Laws of Motion', completed: false },
                        { id: 'p3', title: 'Thermodynamics', completed: false },
                        { id: 'p4', title: 'Optics', completed: false },
                    ]
                },
                {
                    id: 'af-y-raga',
                    title: 'Module 2 (Y Group): RAGA',
                    topics: [
                        { id: 'r1', title: 'Reasoning (Verbal and Non-Verbal)', completed: false },
                        { id: 'r2', title: 'General Awareness', completed: false },
                        { id: 'r3', title: 'Quantitative Aptitude', completed: false },
                    ]
                }
            ]
        }
    ];
}
