/*
 * ============================================================
 *  PORTFOLIO CONTENT — edit this file to update the website.
 * ============================================================
 *  Everything on the homepage (index.html), the opening CV
 *  popup, the CV section preview and the printable CV page
 *  (cv/index.html) is read from this one object, so the
 *  information stays consistent everywhere.
 *
 *  Placeholders:
 *   - A value of `null` means "not available yet". The site
 *     simply leaves that link out until a real URL is added.
 *   - Search this file for "TODO" to find every item to fill in.
 *
 *  After changing content, regenerate the downloadable PDF CV
 *  (see README.md → "Updating the CV PDF").
 */
window.PORTFOLIO = {
  profile: {
    fullName: 'Gidamasauda Thomas Gwasma',
    name: 'Gidah Thomas',
    initials: 'GT',
    roles: ['Software Developer', 'Software Engineering Student', 'UI/UX Designer'],
    location: 'Dar es Salaam, Tanzania',
    email: 'gidamasaudathomas@gmail.com',
    phone: '+255 620 116 944', // local format: 0620 116 944
    photo: 'images/gidah-photo.jpeg',
    headshot: 'images/gidah-headshot.jpg',
    avatar: 'images/gidah-avatar.jpg', // round portrait beside the name in the hero
    status: 'Open to Software Development Opportunities',
    coreStack: ['Java', 'Spring Boot', 'Yii2', 'React', 'MySQL', 'Figma'], // shown on the hero profile card
    headline: 'Building Practical Digital Solutions Through Technology',
    headlineHighlight: 'Digital Solutions', // part of the headline shown in the accent colour
    tagline: 'Building practical digital solutions through technology.',
    summary:
      'Software Engineering student at the University of Dodoma with practical experience in software development, database systems, system analysis, UI/UX design, and institutional information systems.',
    cvPdf: 'assets/cv/Gidah-Thomas-CV.pdf',
    cvPdfName: 'Gidah-Thomas-CV.pdf',
    cvPage: 'cv/index.html'
  },

  social: {
    github: 'https://github.com/GidahThomas',
    linkedin: 'https://www.linkedin.com/in/gidamasauda-thomas-8362b7324/',
    email: 'mailto:gidamasaudathomas@gmail.com',
    portfolio: 'https://gidah-thomas.vercel.app/'
  },

  about: {
    paragraphs: [
      'I am a Software Engineering student at the University of Dodoma and a software developer who builds practical systems for real organisations. My path into software engineering started with curiosity about how technology can make everyday work simpler, faster and more reliable.',
      'I began my degree at UDOM in 2023. My first industrial practical training, at the University of Dodoma, had me building web applications with Python/Django and PHP. My second, at the University of Dar es Salaam Computing Centre, covered the full lifecycle — requirements analysis and documentation, database design, system design, UI/UX design in Figma, and development.',
      'My approach to problem solving is to understand the people and processes first, model the data carefully, and then design interfaces and access rules that fit how an organisation actually works.',
      'I am especially interested in systems that serve institutions, organisations and underserved communities. My career direction is towards software engineering in FinTech and banking technology, cybersecurity and digital transformation.'
    ],
    stats: [
      { value: '5', label: 'Software Projects' },
      { value: 'BSc', label: 'Software Engineering' },
      { value: '2027', label: 'Expected Graduation' },
      { value: '2', label: 'Industrial Trainings' }
    ],
    focus: [
      'Practical problem solving',
      'Institutional information systems',
      'Digital transformation',
      'Financial technology',
      'Cybersecurity',
      'Continuous learning'
    ]
  },

  skills: [
    { title: 'Programming', icon: 'code', items: ['Java', 'Python', 'JavaScript', 'PHP', 'C++'] },
    { title: 'Web Development', icon: 'globe', items: ['HTML', 'CSS', 'React', 'Vite', 'Responsive Design'] },
    { title: 'Backend Development', icon: 'server', items: ['Spring Boot', 'Django', 'Yii2', 'Node.js', 'REST APIs', 'Authentication', 'Authorization'] },
    { title: 'Databases', icon: 'database', items: ['MySQL', 'SQL', 'Database Design', 'Database Schema Design'] },
    {
      title: 'Software Engineering',
      icon: 'cpu',
      items: ['System Analysis and Design', 'Requirements Engineering', 'Object-Oriented Programming', 'Software Architecture', 'CRUD Systems', 'API Development', 'Debugging', 'Troubleshooting']
    },
    { title: 'UI/UX Design', icon: 'pen', items: ['Figma', 'UI Design', 'UX Design', 'Wireframing', 'Prototyping'] },
    { title: 'Development Tools', icon: 'terminal', items: ['Git', 'GitHub', 'Visual Studio Code', 'IntelliJ IDEA', 'XAMPP', 'Command Line'] },
    { title: 'Professional Skills', icon: 'users', items: ['Team Collaboration', 'Technical Documentation', 'Problem Solving', 'Communication', 'Leadership'] }
  ],

  // Condensed skill list used on the CV (keep in sync with `skills` above)
  cvSkills: [
    'Java', 'Spring Boot', 'Python', 'Django', 'JavaScript', 'React', 'PHP', 'Yii2', 'HTML', 'CSS', 'MySQL', 'SQL', 'REST APIs',
    'Git', 'GitHub', 'Database Design', 'System Analysis and Design', 'UI/UX Design', 'Figma', 'Software Development'
  ],

  experience: [
    {
      role: 'Software Development Intern / Field Training Student',
      organization: 'University of Dar es Salaam Computing Centre (UCC)',
      department: 'Software Development',
      period: '2024/2025',
      points: [
        'Participated in software development activities in the Software Development department.',
        'Worked on the PMP institutional system.',
        'Performed system analysis and participated in requirements analysis.',
        'Prepared requirements and system documentation.',
        'Worked on database schema design.',
        'Contributed to development using the Yii2 framework.',
        'Designed user interfaces and user experience in Figma.',
        'Gained experience with institutional information systems.',
        'Collaborated with the project team and supervisors.'
      ],
      supervisors: [
        { label: 'Field Supervisor', name: 'Dr. Ngeze' },
        { label: 'Project Supervisor', name: 'Mr. Mikidadi' }
      ],
      tags: ['System Analysis', 'Requirements Documentation', 'Database Design', 'Yii2', 'UI/UX · Figma', 'Team Collaboration']
    },
    {
      role: 'Industrial Practical Training Student',
      organization: 'University of Dodoma (UDOM)',
      department: null, // TODO: add the department/unit if you want it shown
      period: '2023/2024',
      points: [
        'Developed a Land Price Prediction system using Python and Django.',
        'Developed a House Rent Management system using HTML, CSS, JavaScript and PHP.'
      ],
      supervisors: [], // TODO: add supervisors if you want them shown, e.g. { label: 'Supervisor', name: '...' }
      tags: ['Python', 'Django', 'PHP', 'JavaScript', 'HTML', 'CSS']
    }
  ],

  /*
   * Projects
   *  - status: short label shown on the card, e.g. 'Completed', 'In development'. null hides the badge.
   *  - image:  path to a real screenshot (e.g. 'images/projects/supportdesk.png').
   *            When null, the site draws an illustrated preview instead.
   *  - github / live: real URLs only. Leave null until one exists.
   */
  projects: [
    {
      id: 'supportdesk',
      title: 'SupportDesk System',
      category: 'Institutional Service Management',
      status: null, // TODO: set the project status, e.g. 'Completed' or 'In development'
      summary:
        'A digital platform for complaints, enquiries, service requests, visitor management, staff assignment, escalation and reporting.',
      description:
        'SupportDesk gives an institution one place to receive and track every client interaction — from a walk-in visitor to a formal complaint. Requests are routed to the right department, assigned to staff, escalated when they stall and monitored until they are resolved, while management sees performance indicators and resolution times on a dashboard.',
      tech: ['Web Application', 'Database Design', 'Role-Based Access', 'Dashboards & Reporting', 'System Analysis'], // TODO: add the actual frameworks/languages used (e.g. 'Yii2', 'MySQL')
      features: [
        'Visitor management', 'Client requests', 'Complaints', 'Enquiries', 'Service requests', 'Staff assignment',
        'Department routing', 'Escalation', 'Status tracking', 'Management dashboard', 'Performance indicators',
        'Resolution-time monitoring', 'Reporting', 'Analytics', 'Role-based access', 'Administrative management'
      ],
      preview: 'dashboard',
      image: null,
      github: null, // TODO: add repository URL
      live: null // TODO: add live demo URL if deployed
    },
    {
      id: 'student-management',
      title: 'Student Management System',
      category: 'University Information System',
      status: null, // TODO: set the project status
      summary:
        'A university-focused system for managing student academic and administrative records.',
      description:
        'The system models the full university structure — colleges, institutes, schools and departments — and keeps student and academic records in one consistent place. Access is role-based: Quality Assurance officers can view the information relevant to them without permission to modify student records.',
      tech: ['Web Application', 'Database Design', 'Authentication', 'Authorization', 'Role-Based Access'], // TODO: add the actual frameworks/languages used
      features: [
        'Student records', 'Academic information', 'Colleges', 'Institutes', 'Schools', 'Departments',
        'Administrative management', 'Role-based access', 'Quality Assurance (read-only) access',
        'Academic records', 'Institutional reporting'
      ],
      preview: 'records',
      image: null,
      github: null, // TODO: add repository URL
      live: null // TODO: add live demo URL if deployed
    },
    {
      id: 'pmp',
      title: 'PMP System',
      category: 'Institutional System · Field Training',
      status: 'Field training project',
      summary:
        'An institutional system developed during software development field training at the University of Dar es Salaam Computing Centre.',
      description:
        'Developed as part of a team during field training in the Software Development department of the University of Dar es Salaam Computing Centre (UCC), under professional supervision. My contributions spanned the lifecycle from requirements through to application development.',
      tech: ['Yii2', 'Requirements Analysis', 'Database Design', 'System Design', 'Figma'],
      features: [
        'Requirements analysis', 'System documentation', 'Database schema', 'System design', 'UI/UX design',
        'Application development', 'Team collaboration'
      ],
      featuresLabel: 'My contributions',
      preview: 'kanban',
      image: null,
      github: null, // Institutional project — repository may be private
      live: null
    },
    {
      id: 'land-price',
      title: 'Land Price Prediction System',
      category: 'Web Application · Industrial Training',
      status: 'Industrial training project',
      summary:
        'A web application that predicts land prices, built with Python and Django.',
      description:
        'Developed during my first industrial practical training at the University of Dodoma (2023/2024). The system is built with Python and the Django web framework to estimate land prices.',
      tech: ['Python', 'Django'], // TODO: add other tools used (e.g. the database or Python libraries)
      features: ['Land price prediction', 'Python back end', 'Django web application'], // TODO: replace with the system's actual features
      preview: 'prediction',
      image: null,
      github: null, // TODO: add repository URL
      live: null
    },
    {
      id: 'house-rent',
      title: 'House Rent Management System',
      category: 'Web Application · Industrial Training',
      status: 'Industrial training project',
      summary:
        'A web-based system for managing house rentals, built with HTML, CSS, JavaScript and PHP.',
      description:
        'Developed during my first industrial practical training at the University of Dodoma (2023/2024). The front end is built with HTML, CSS and JavaScript, with PHP on the server side.',
      tech: ['HTML', 'CSS', 'JavaScript', 'PHP'], // TODO: add the database used (e.g. MySQL)
      features: ['House rent management', 'Web front end (HTML, CSS, JavaScript)', 'PHP server-side logic'], // TODO: replace with the system's actual features
      preview: 'rental',
      image: null,
      github: null, // TODO: add repository URL
      live: null
    }
  ],

  education: [
    {
      degree: 'Bachelor of Science in Software Engineering',
      institution: 'University of Dodoma (UDOM)',
      period: '2023–2027',
      note: 'Expected graduation: 2027',
      courses: [
        'Advanced Java Programming', 'Object-Oriented Analysis and Design', 'Web Frameworks', 'Distributed Databases',
        'Data Mining and Data Warehousing', 'Operating Systems', 'ICT Security', 'Secure Systems', 'Compiler Design',
        'Database Systems', 'Software Engineering'
      ]
    }
  ],

  leadership: [
    {
      role: 'Secretary of Education and Innovation',
      organization: 'UDOSO CIVE — College of Informatics and Virtual Education',
      institution: 'University of Dodoma',
      period: '2026/2027',
      points: [
        'Academic communication',
        'Student academic support',
        'Education initiatives',
        'Innovation initiatives',
        'Student development',
        'Technology initiatives',
        'Communication between students and relevant stakeholders',
        'Supporting practical training issues',
        'Supporting academic information dissemination'
      ],
      impact:
        'Serves as a link between students of the College of Informatics and Virtual Education and academic stakeholders — keeping academic information flowing, raising student concerns including practical training issues, and supporting education, innovation and technology initiatives.'
    }
  ],

  interests: [
    { title: 'FinTech', icon: 'chart' },
    { title: 'Banking Technology', icon: 'bank' },
    { title: 'Cybersecurity', icon: 'shield' },
    { title: 'Digital Transformation', icon: 'refresh' },
    { title: 'Institutional Information Systems', icon: 'landmark' },
    { title: 'Software Engineering', icon: 'cpu' },
    { title: 'UI/UX Design', icon: 'pen' },
    { title: 'Technology Entrepreneurship', icon: 'sparkles' }
  ],

  services: [
    { title: 'Web Application Development', icon: 'globe', text: 'Responsive, secure web applications built on solid foundations.' },
    { title: 'Software System Development', icon: 'layers', text: 'Business and management systems from requirements to delivery.' },
    { title: 'Database Design', icon: 'database', text: 'Well-structured schemas designed for real workloads and reporting.' },
    { title: 'UI/UX Design', icon: 'pen', text: 'Wireframes and interactive prototypes in Figma before code.' },
    { title: 'System Analysis', icon: 'git', text: 'Requirements, process models and documentation that guide builds.' },
    { title: 'Institutional Information Systems', icon: 'landmark', text: 'Student, service-desk and records systems for institutions.' },
    { title: 'Software Maintenance & Improvement', icon: 'wrench', text: 'Fixing issues, adding features and improving existing systems.' },
    { title: 'Digital Solutions', icon: 'chart', text: 'Moving manual processes into dependable digital tools.' }
  ],

  cv: {
    title: 'View My Professional CV',
    text: 'Explore my education, technical skills, software projects, practical experience, leadership background, and professional interests.',
    profile:
      'Software Engineering student, software developer and UI/UX designer interested in developing practical digital systems that solve real-world problems. Gained practical experience through two industrial trainings: building Python/Django and PHP web applications at the University of Dodoma, and system analysis, requirements documentation, database design, Yii2 development and Figma-based UI/UX design at the University of Dar es Salaam Computing Centre. Particularly interested in digital transformation, institutional systems, FinTech, cybersecurity and technology entrepreneurship.',
    /*
     * Referees shown on the CV. Only add people who have agreed to act as referees.
     * Example: { name: 'Dr. Ngeze', title: 'Field Supervisor, UDSM Computing Centre', contact: 'email@example.com' }
     */
    references: [], // TODO: add referees; when empty the CV shows "Available upon request"
    // Opening CV popup: shown once per browser session (skipped for deep links such as /#contact).
    showOnLoad: true
  },

  contact: {
    // Form submissions are delivered by FormSubmit (https://formsubmit.co) — no backend needed.
    formEndpoint: 'https://formsubmit.co/ajax/gidamasaudathomas@gmail.com'
  },

  // `mobile: true` items appear only in the mobile menu, keeping the desktop bar uncluttered.
  nav: [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'education', label: 'Education' },
    { id: 'leadership', label: 'Leadership' },
    { id: 'interests', label: 'Interests', mobile: true },
    { id: 'services', label: 'Services' },
    { id: 'cv', label: 'CV', mobile: true },
    { id: 'contact', label: 'Contact' }
  ]
};
