import bcrypt from 'bcryptjs';
import { store } from './services/store.js';
import { config } from './config/env.js';
import { 
  IProfile, ISkill, IExperience, IEducation, 
  ICertification, IProject, IResearch, IAchievement, 
  IService, ITestimonial, IBlogPost, ISiteSettings 
} from './types/index.js';

async function seed() {
  console.log('[Seed] Initializing futuristic portfolio seed database...');

  // 1. Admin User
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(config.adminPassword, salt);
  
  // Reset or ensure admin user exists
  const existingUsers = store.getUsers();
  if (existingUsers.length === 0) {
    store.addUser({
      _id: 'admin_primary',
      name: 'Ased',
      email: config.adminEmail,
      password: hashedPassword,
      role: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    console.log(`[Seed] Created admin: ${config.adminEmail}`);
  }

  // 2. Profile
  const profileData: IProfile = {
    _id: 'profile_primary',
    name: 'Ased',
    initials: 'AS',
    title: 'Full Stack Engineer • AI/ML Practitioner • Cyber Security Researcher',
    titles: [
      'Full Stack Software Engineer',
      'AI / Machine Learning Practitioner',
      'Cyber Security Researcher',
      'Distributed Systems Architect'
    ],
    bio: 'Passionate computer science professional building scalable cloud architectures, intelligent machine learning systems, and resilient cybersecurity solutions with modern aesthetics.',
    shortBio: 'I build scalable web applications, intelligent systems and secure digital experiences.',
    philosophy: 'Code should be clean, resilient, and visually captivating. Engineering is the bridge between human curiosity and tangible societal impact.',
    location: 'Bengaluru, India / Remote Worldwide',
    email: 'ased@portfolio.dev',
    availabilityStatus: 'available',
    statusText: 'Available for high-impact opportunities & engineering roles',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
    resumeUrl: '/uploads/sample_resume.pdf',
    yearsOfExperience: 3,
    stats: [
      { label: 'Completed Projects', value: '20+', order: 1 },
      { label: 'Years Experience', value: '3+', order: 2 },
      { label: 'Open Source Repos', value: '30+', order: 3 },
      { label: 'Security Audits', value: '15+', order: 4 }
    ],
    socialLinks: [
      { platform: 'GitHub', url: 'https://github.com', icon: 'Github' },
      { platform: 'LinkedIn', url: 'https://linkedin.com', icon: 'Linkedin' },
      { platform: 'Twitter / X', url: 'https://x.com', icon: 'Twitter' },
      { platform: 'Email', url: 'mailto:ased@portfolio.dev', icon: 'Mail' }
    ],
    terminalWhoami: 'ased@mainframe:~$ Software Engineer & Cyber Researcher [Clearance: Level 5]',
    updatedAt: new Date().toISOString()
  };
  store.updateProfile(profileData);

  // 3. Skills
  const sampleSkills: Omit<ISkill, '_id'>[] = [
    // Frontend
    { name: 'React 19 & Next.js', category: 'frontend', proficiency: 96, years: 3, description: 'Component architecture, SSR/SSG, Server Actions, Hooks', icon: 'Atom', order: 1, featured: true, orbitRadius: 3.5, speed: 1.2 },
    { name: 'TypeScript', category: 'programming', proficiency: 94, years: 3, description: 'Strict typing, generics, ASTs, modular type systems', icon: 'FileCode2', order: 2, featured: true, orbitRadius: 4.2, speed: 0.9 },
    { name: 'Tailwind CSS', category: 'frontend', proficiency: 95, years: 3, description: 'Design systems, responsive layout, animations, arbitrary values', icon: 'Palette', order: 3, featured: true, orbitRadius: 4.8, speed: 1.1 },
    { name: 'Three.js & WebGL', category: 'frontend', proficiency: 88, years: 2, description: 'Shaders, 3D math, canvas rendering, particles, lighting', icon: 'Box', order: 4, featured: true, orbitRadius: 5.5, speed: 0.8 },
    
    // Backend
    { name: 'Node.js & Express', category: 'backend', proficiency: 92, years: 3, description: 'High-throughput REST APIs, middleware, streams, async loops', icon: 'Server', order: 5, featured: true, orbitRadius: 3.8, speed: 1.3 },
    { name: 'Python', category: 'programming', proficiency: 90, years: 3, description: 'FastAPI, PyTorch, NumPy, Pandas, automation scripts', icon: 'Binary', order: 6, featured: true, orbitRadius: 4.5, speed: 0.7 },
    { name: 'Go (Golang)', category: 'backend', proficiency: 82, years: 1, description: 'Goroutines, channels, microservices, network proxies', icon: 'Cpu', order: 7, featured: true, orbitRadius: 5.2, speed: 1.0 },

    // Database
    { name: 'PostgreSQL & SQL', category: 'database', proficiency: 90, years: 3, description: 'Schema normalization, indexing, joins, ACID transactions', icon: 'Database', order: 8, featured: true, orbitRadius: 3.6, speed: 1.1 },
    { name: 'MongoDB', category: 'database', proficiency: 88, years: 3, description: 'Document stores, aggregation pipelines, Mongoose schemas', icon: 'Layers', order: 9, featured: true, orbitRadius: 4.4, speed: 0.85 },
    { name: 'Redis', category: 'database', proficiency: 85, years: 2, description: 'Pub/Sub, memory cache, rate limiters, session stores', icon: 'Zap', order: 10, featured: true, orbitRadius: 5.0, speed: 1.15 },

    // AI / ML
    { name: 'PyTorch & ML', category: 'ai_ml', proficiency: 86, years: 2, description: 'Deep neural networks, computer vision, transfer learning', icon: 'BrainCircuit', order: 11, featured: true, orbitRadius: 4.0, speed: 0.95 },
    { name: 'LangChain & RAG', category: 'ai_ml', proficiency: 88, years: 2, description: 'Vector embeddings, LLM orchestration, semantic search', icon: 'Sparkles', order: 12, featured: true, orbitRadius: 4.7, speed: 1.05 },
    
    // Cyber Security
    { name: 'Network Security & Wireshark', category: 'cyber_security', proficiency: 87, years: 2, description: 'Packet sniffing, protocol analysis, firewall architectures', icon: 'ShieldCheck', order: 13, featured: true, orbitRadius: 4.1, speed: 0.9 },
    { name: 'OWASP & Pen-Testing', category: 'cyber_security', proficiency: 85, years: 2, description: 'Vulnerability assessment, XSS/SQLi mitigation, Burp Suite', icon: 'Lock', order: 14, featured: true, orbitRadius: 5.1, speed: 1.2 },

    // DevOps & Tools
    { name: 'Docker & Containers', category: 'devops', proficiency: 88, years: 2, description: 'Multi-stage builds, container isolation, compose orchestration', icon: 'Container', order: 15, featured: true, orbitRadius: 4.6, speed: 0.8 },
    { name: 'Linux Mainframe & Bash', category: 'tools', proficiency: 92, years: 3, description: 'Kernel parameters, shell scripting, systemd, SSH hardening', icon: 'Terminal', order: 16, featured: true, orbitRadius: 3.9, speed: 1.25 }
  ];

  // Clear existing skills and re-populate
  const existingSkills = store.getCollection<ISkill>('skills');
  if (existingSkills.length === 0) {
    sampleSkills.forEach(s => store.addItem<ISkill>('skills', s as ISkill));
    console.log(`[Seed] Seeded ${sampleSkills.length} skills.`);
  }

  // 4. Projects
  const sampleProjects: Omit<IProject, '_id'>[] = [
    {
      title: 'NeuralShield AI',
      slug: 'neuralshield-ai',
      shortDescription: 'Autonomous zero-day threat detection & intelligent intrusion prevention engine utilizing quantized transformer models.',
      detailedDescription: 'NeuralShield AI monitors ingress and egress enterprise network traffic in real time. Powered by an ensemble of lightweight quantized neural networks, it flags anomalous lateral movement, zero-day payload executions, and automated credential stuffing with sub-millisecond response latencies.',
      category: 'Cyber Security & AI',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
      ],
      technologies: ['Python', 'PyTorch', 'FastAPI', 'React', 'TypeScript', 'Tailwind CSS', 'Docker'],
      githubUrl: 'https://github.com/example/neuralshield-ai',
      liveUrl: 'https://neuralshield-demo.dev',
      caseStudyUrl: 'https://arxiv.org/abs/sample',
      isFeatured: true,
      completionDate: '2025-11-15',
      clientType: 'Research & Open Source',
      challenges: 'High packet volume caused significant GC pauses in naive implementations, dropping packets under DDoS simulation.',
      solution: 'Engineered zero-copy memory ring buffers in C/Python bindings and offloaded tensor matrix operations to ONNX runtime with TensorRT.',
      results: '99.4% detection rate across 2.4 million synthetic attack vectors with a 42% reduction in CPU utilization.',
      architectureDiagram: 'Client Traffic -> eBPF Filter -> Ring Buffer -> ONNX Quantized Model -> Alert WebSockets -> React HUD',
      statistics: [
        { label: 'Latency', value: '< 1.4ms' },
        { label: 'Accuracy', value: '99.4%' },
        { label: 'Throughput', value: '10 Gbps' },
        { label: 'Stars', value: '1.2k' }
      ],
      order: 1,
      published: true,
      views: 1840,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: 'FasalBandhu',
      slug: 'fasalbandhu',
      shortDescription: 'AI-powered precision agriculture platform offering real-time crop disease diagnosis and soil yield forecasts.',
      detailedDescription: 'FasalBandhu democratizes cutting-edge agricultural intelligence for smallholder farmers. By running localized computer vision models on mobile devices, farmers can instantly diagnose leaf blight, pest infestations, and micronutrient deficiencies without requiring active 5G connectivity.',
      category: 'AI / ML & Full Stack',
      thumbnail: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=800&auto=format&fit=crop&q=80'
      ],
      technologies: ['React 19', 'TypeScript', 'Node.js', 'Express', 'TensorFlow.js', 'MongoDB', 'Tailwind CSS'],
      githubUrl: 'https://github.com/example/fasalbandhu',
      liveUrl: 'https://fasalbandhu.dev',
      isFeatured: true,
      completionDate: '2025-08-20',
      clientType: 'Agritech Social Initiative',
      challenges: 'Intermittent field connectivity and wide variance in mobile camera resolutions in varying outdoor lighting.',
      solution: 'Integrated client-side TensorFlow.js inference with adaptive image normalization and local IndexedDB offline sync.',
      results: 'Over 14,000 diagnostic scans executed with 96.2% validation accuracy against agricultural laboratory standards.',
      architectureDiagram: 'Mobile Camera -> TF.js WebAssembly -> Offline Diagnosis -> Background Sync -> Express API -> Mongo Cluster',
      statistics: [
        { label: 'Scans Done', value: '14,000+' },
        { label: 'Model Accuracy', value: '96.2%' },
        { label: 'Offline Support', value: '100%' },
        { label: 'Active Farmers', value: '3,200+' }
      ],
      order: 2,
      published: true,
      views: 2450,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: 'AetherOS Hologram 3D',
      slug: 'aether-os-hologram',
      shortDescription: 'Cinematic WebGL holographic virtual desktop environment with spatial audio and interactive 3D computing.',
      detailedDescription: 'An experimental web-native operating interface built entirely with Three.js, React Three Fiber, and WebAudio. Features draggable spatial windows, dynamic holographic shaders, volumetric lighting, and interactive system telemetry.',
      category: 'Three.js & Graphics',
      thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800&auto=format&fit=crop&q=80'
      ],
      technologies: ['Three.js', 'React Three Fiber', 'GLSL Shaders', 'WebAudio API', 'TypeScript'],
      githubUrl: 'https://github.com/example/aether-os',
      liveUrl: 'https://aether-os.dev',
      isFeatured: true,
      completionDate: '2025-06-10',
      clientType: 'Experimental Creative Tech',
      challenges: 'Maintaining 60 FPS across integrated GPUs with complex glass refraction and post-processing bloom.',
      solution: 'Custom GLSL shaders with dynamic resolution scaling and instanced geometry batching for particle systems.',
      results: 'Flawless 60 FPS maintained on standard laptops, praised by design and 3D web communities.',
      architectureDiagram: 'Canvas -> R3F Canvas Manager -> Instanced Mesh Buffers -> Custom PostProcessing Pipeline -> Display Output',
      statistics: [
        { label: 'FPS Target', value: '60 FPS' },
        { label: 'Draw Calls', value: '< 25' },
        { label: 'Audio Nodes', value: '16 Spatial' },
        { label: 'Community Stars', value: '890+' }
      ],
      order: 3,
      published: true,
      views: 1980,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: 'CyberSentinel SIEM',
      slug: 'cybersentinel-siem',
      shortDescription: 'Real-time zero-trust packet inspector, distributed event correlation engine, and threat triage dashboard.',
      detailedDescription: 'Enterprise-grade SIEM engine capable of ingesting 200,000 syslog/NetFlow events per second. Correlates indicators of compromise (IoC) with MITRE ATT&CK framework mapping in an interactive cyber threat map.',
      category: 'Cyber Security',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80'
      ],
      technologies: ['Go', 'Node.js', 'React', 'Tailwind CSS', 'WebSockets', 'ClickHouse', 'Docker'],
      githubUrl: 'https://github.com/example/cybersentinel',
      liveUrl: 'https://cybersentinel.dev',
      isFeatured: false,
      completionDate: '2025-03-12',
      clientType: 'Enterprise Security Research',
      challenges: 'Correlating high-velocity distributed log streams without creating database write bottlenecks.',
      solution: 'Implemented Go concurrency pipelines writing to partitioned column-oriented storage with batch flushing.',
      results: 'Successfully handled 250k sustained events/sec in automated red-team stress simulations.',
      architectureDiagram: 'Log Collectors -> Go Ingestion Worker -> Ring Buffer -> ClickHouse -> WebSocket Broadcaster -> React Threat UI',
      statistics: [
        { label: 'Event Rate', value: '250k/sec' },
        { label: 'IoC Rules', value: '450+' },
        { label: 'Query Speed', value: '18ms' }
      ],
      order: 4,
      published: true,
      views: 1120,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: 'OmniFlow Event Mesh',
      slug: 'omniflow-mesh',
      shortDescription: 'High-throughput async event streaming mesh and state machine for distributed microservice topologies.',
      detailedDescription: 'A lightweight distributed event broker and workflow orchestrator designed for microservices requiring guaranteed message ordering, dead-letter automatic retries, and real-time distributed tracing.',
      category: 'Backend & Cloud',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80'
      ],
      technologies: ['TypeScript', 'Node.js', 'Redis', 'Kafka', 'Docker', 'OpenTelemetry'],
      githubUrl: 'https://github.com/example/omniflow',
      liveUrl: 'https://omniflow.dev',
      isFeatured: false,
      completionDate: '2024-12-05',
      clientType: 'Systems Engineering',
      challenges: 'Handling distributed split-brain scenarios and state recovery after network partition faults.',
      solution: 'Integrated Raft consensus protocol for leader election alongside Redis cluster failover mechanisms.',
      results: 'Zero message loss across 50 simulated pod restarts with instant state reconstitution.',
      architectureDiagram: 'Services -> Ingress Proxy -> Raft Quorum Node -> Topic Partition -> Subscriber Pool',
      statistics: [
        { label: 'Message Loss', value: '0.00%' },
        { label: 'P99 Latency', value: '3.2ms' },
        { label: 'Throughput', value: '50k msg/s' }
      ],
      order: 5,
      published: true,
      views: 890,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const existingProjects = store.getCollection<IProject>('projects');
  if (existingProjects.length === 0) {
    sampleProjects.forEach(p => store.addItem<IProject>('projects', p as IProject));
    console.log(`[Seed] Seeded ${sampleProjects.length} projects.`);
  }

  // 5. Experience
  const sampleExperience: Omit<IExperience, '_id'>[] = [
    {
      company: 'Aether Cloud Systems',
      position: 'Full Stack & Security Engineer',
      employmentType: 'Full-time',
      location: 'Bengaluru / Hybrid',
      startDate: '2024-01',
      endDate: 'Present',
      isCurrent: true,
      description: 'Lead developer on core cloud infrastructure dashboard and identity access management services.',
      responsibilities: [
        'Architected modern React 19 micro-frontend interfaces with sub-100ms first input delay.',
        'Hardened Node.js backend endpoints with role-based JWT, rate limiting, and zero-trust token rotation.',
        'Optimized PostgreSQL queries reducing complex analytics dashboard latency by 58%.'
      ],
      achievements: [
        'Recognized with Engineering Excellence Award for architecting zero-downtime database migration.',
        'Authored internal web security guidelines adopted across 6 cross-functional engineering teams.'
      ],
      technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Tailwind CSS', 'AWS'],
      order: 1
    },
    {
      company: 'CyberPulse Labs',
      position: 'Systems & Security Engineering Intern',
      employmentType: 'Internship',
      location: 'Remote',
      startDate: '2023-05',
      endDate: '2023-12',
      isCurrent: false,
      description: 'Conducted automated vulnerability assessments and developed security telemetry pipelines.',
      responsibilities: [
        'Implemented Wireshark automation scripts for continuous network protocol auditing.',
        'Built full-stack internal vulnerability triage dashboard using Express and React.',
        'Collaborated on pen-testing campaigns identifying OWASP Top 10 vulnerabilities in staging builds.'
      ],
      achievements: [
        'Patched 14 critical CVE vulnerabilities prior to annual ISO 27001 audit.',
        'Reduced manual triage turnaround time from 4 hours to 15 minutes.'
      ],
      technologies: ['Python', 'Linux', 'Wireshark', 'Bash', 'React', 'MongoDB'],
      order: 2
    },
    {
      company: 'DevForge Studios',
      position: 'Frontend Developer Intern',
      employmentType: 'Internship',
      location: 'Bengaluru, India',
      startDate: '2022-08',
      endDate: '2023-04',
      isCurrent: false,
      description: 'Built high-converting interactive web interfaces and real-time client analytics portals.',
      responsibilities: [
        'Developed reusable responsive component libraries with accessible keyboard navigation.',
        'Implemented Three.js 3D landing page animations increasing user engagement duration by 35%.'
      ],
      achievements: [
        'Shipped 8 commercial client web platforms on schedule with 100% test coverage for critical user flows.'
      ],
      technologies: ['React', 'TypeScript', 'Three.js', 'Tailwind CSS', 'Git'],
      order: 3
    }
  ];

  const existingExp = store.getCollection<IExperience>('experience');
  if (existingExp.length === 0) {
    sampleExperience.forEach(e => store.addItem<IExperience>('experience', e as IExperience));
    console.log(`[Seed] Seeded ${sampleExperience.length} experience entries.`);
  }

  // 6. Education
  const sampleEducation: Omit<IEducation, '_id'>[] = [
    {
      degree: 'Bachelor of Technology in Computer Science & Engineering',
      institution: 'Institute of Engineering & Technology',
      location: 'India',
      startYear: '2020',
      endYear: '2024',
      grade: '8.8 / 10 CGPA (Honors)',
      description: 'Specialized in Distributed Systems, Computer Networks, and Artificial Intelligence. Led collegiate cybersecurity CTF team and technical symposiums.',
      coursework: [
        'Data Structures & Algorithms',
        'Operating Systems & Kernel Design',
        'Cryptography & Network Security',
        'Distributed Cloud Computing',
        'Machine Learning & Neural Networks',
        'Database Management Systems'
      ],
      order: 1
    }
  ];

  const existingEdu = store.getCollection<IEducation>('education');
  if (existingEdu.length === 0) {
    sampleEducation.forEach(ed => store.addItem<IEducation>('education', ed as IEducation));
    console.log(`[Seed] Seeded ${sampleEducation.length} education entries.`);
  }

  // 7. Certifications
  const sampleCertifications: Omit<ICertification, '_id'>[] = [
    {
      title: 'CompTIA Security+ (SY0-701)',
      issuer: 'CompTIA',
      issueDate: '2024-05',
      expirationDate: '2027-05',
      credentialId: 'COMP0010203040',
      credentialUrl: 'https://comptia.org/verify/COMP0010203040',
      certificateImageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      description: 'Demonstrates baseline mastery in network security, threat mitigation, cryptography, and risk assessment.',
      order: 1
    },
    {
      title: 'AWS Certified Solutions Architect – Associate',
      issuer: 'Amazon Web Services',
      issueDate: '2024-08',
      expirationDate: '2027-08',
      credentialId: 'AWS-PSA-99214',
      credentialUrl: 'https://aws.amazon.com/verification',
      certificateImageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      description: 'Validates expertise in designing resilient, high-performing, secure, and cost-optimized architectures on AWS.',
      order: 2
    },
    {
      title: 'Deep Learning Specialization',
      issuer: 'DeepLearning.AI / Coursera',
      issueDate: '2023-11',
      credentialId: 'DL-SPEC-77310',
      credentialUrl: 'https://coursera.org/verify/specialization/DL-SPEC-77310',
      description: 'Comprehensive 5-course sequence covering Neural Networks, CNNs, RNNs, and hyperparameter tuning.',
      order: 3
    }
  ];

  const existingCert = store.getCollection<ICertification>('certifications');
  if (existingCert.length === 0) {
    sampleCertifications.forEach(c => store.addItem<ICertification>('certifications', c as ICertification));
    console.log(`[Seed] Seeded ${sampleCertifications.length} certifications.`);
  }

  // 8. Research
  const sampleResearch: Omit<IResearch, '_id'>[] = [
    {
      title: 'Adversarial Robustness in Quantized Deep Neural Networks',
      abstract: 'Investigates vulnerability thresholds of INT8 and INT4 quantized neural networks against projected gradient descent (PGD) attacks compared to full-precision FP32 baselines in resource-constrained IoT security edge devices.',
      researchQuestion: 'Does post-training quantization amplify sensitivity to adversarial perturbation in edge-deployed vision classifiers?',
      methodology: 'Evaluated ResNet-50 and MobileNetV3 models trained on ImageNet against adversarial epsilon perturbations across diverse quantization schemes.',
      dataset: 'ImageNet-1k & CIFAR-100',
      model: 'PyTorch Quantized ResNet-50 & MobileNetV3',
      results: 'Discovered that selective activation clipping preserves 92.4% adversarial robustness while yielding 3.8x inference speedups on edge processors.',
      publicationStatus: 'Peer-Reviewed Conference Paper',
      paperUrl: 'https://arxiv.org/abs/2401.sample',
      githubUrl: 'https://github.com/example/quantized-adversarial-research',
      metrics: [
        { label: 'Inference Speedup', value: '3.8x' },
        { label: 'Robustness Retained', value: '92.4%' },
        { label: 'Model Size Reduction', value: '74%' }
      ],
      order: 1,
      published: true,
      createdAt: new Date().toISOString()
    },
    {
      title: 'Zero-Knowledge Proofs for Privacy-Preserving Web Authentication',
      abstract: 'A formal analysis and implementation framework for zk-SNARK based decentralized authentication schemas eliminating centralized password hash databases.',
      researchQuestion: 'Can client-side zk-SNARK generation achieve acceptable latencies on mobile browser JavaScript engines?',
      methodology: 'Constructed custom Circom arithmetic circuits and verified proof generation benchmarks via WebAssembly inside React.',
      dataset: 'Synthetic authentication benchmark suite (100,000 runs)',
      model: 'Groth16 Proof Protocol via Circom & SnarkJS',
      results: 'Achieved sub-400ms proof generation on consumer devices with zero credential leakage over insecure networks.',
      publicationStatus: 'Open Research Technical Report',
      paperUrl: 'https://eprint.iacr.org/sample',
      githubUrl: 'https://github.com/example/zk-web-auth',
      metrics: [
        { label: 'Client Proof Time', value: '380ms' },
        { label: 'Verification Time', value: '4ms' },
        { label: 'Credential Leakage', value: '0 bytes' }
      ],
      order: 2,
      published: true,
      createdAt: new Date().toISOString()
    }
  ];

  const existingResearch = store.getCollection<IResearch>('research');
  if (existingResearch.length === 0) {
    sampleResearch.forEach(r => store.addItem<IResearch>('research', r as IResearch));
    console.log(`[Seed] Seeded ${sampleResearch.length} research papers.`);
  }

  // 9. Blog Posts
  const sampleBlogs: Omit<IBlogPost, '_id'>[] = [
    {
      title: 'Architecting Zero-Trust Authentication in Modern Web Distributed Systems',
      slug: 'architecting-zero-trust-authentication',
      excerpt: 'How to transition beyond legacy session cookies to cryptographically verifiable, ephemeral JWTs with automated public key rotation and zero-trust principles.',
      content: `## The Demise of Perimeter Security

In traditional web architectures, systems relied on a simple assumption: once a request passed through the perimeter firewall, it could be trusted. Microservices inside the private network communicated with little to no internal authentication.

Modern threats have rendered the "castle-and-moat" paradigm obsolete. 

### Core Zero-Trust Tenets

1. **Verify explicitly**: Always authenticate and authorize based on all available data points (identity, location, device health, service context).
2. **Use least privilege access**: Limit user and service access with Just-In-Time (JIT) and Just-Enough-Access (JEA).
3. **Assume breach**: Minimize blast radius by segmenting access, encrypting all end-to-end communication, and verifying continuously.

\`\`\`typescript
// Example: Asymmetric RS256 token verification middleware
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const verifyZeroTrustToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Security Context Missing' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.PUBLIC_KEY!, {
      algorithms: ['RS256'],
      issuer: 'auth.enterprise.mesh',
      audience: 'api.portfolio.internal'
    });
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Cryptographic Verification Failed' });
  }
};
\`\`\`

### Ephemeral Tokens & Token Rotation

By issuing access tokens with a strict 15-minute lifespan and implementing automated refresh token rotation with family detection, any stolen token is automatically neutralized upon next renewal.`,
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      author: 'Ased',
      category: 'Cyber Security',
      tags: ['Zero Trust', 'Security', 'JWT', 'Architecture', 'TypeScript'],
      readTimeMinutes: 6,
      publishDate: '2025-10-18',
      isPublished: true,
      isFeatured: true,
      seoTitle: 'Zero-Trust Authentication in Distributed Systems | Ased',
      seoDescription: 'Guide to building cryptographically resilient zero-trust auth architectures in Node.js and TypeScript.',
      views: 1250,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: 'Real-Time 3D Rendering on the Web: High-Performance Three.js & Shader Optimization',
      slug: 'real-time-3d-rendering-threejs-shaders',
      excerpt: 'Techniques for maintaining 60 FPS in WebGL hero scenes: geometry instancing, custom GLSL fragment shaders, and GPU memory management.',
      content: `## Why Most 3D Web Experiences Suffer from Stutter

Adding Three.js to a portfolio or marketing page is visually transformative, but poorly optimized scenes lead to frame drops, battery drain, and terrible Core Web Vitals (especially INP and LCP).

### 1. Batching Draw Calls with InstancedMesh

Instead of rendering 1,000 separate mesh instances—which results in 1,000 CPU-to-GPU draw calls—use \`InstancedMesh\`:

\`\`\`javascript
const geometry = new THREE.SphereGeometry(0.1, 16, 16);
const material = new THREE.MeshStandardMaterial({ color: 0x22D3EE });
const instancedMesh = new THREE.InstancedMesh(geometry, material, 1000);

const dummy = new THREE.Object3D();
for (let i = 0; i < 1000; i++) {
  dummy.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  );
  dummy.updateMatrix();
  instancedMesh.setMatrixAt(i, dummy.matrix);
}
scene.add(instancedMesh);
\`\`\`

### 2. Device Pixel Ratio (DPR) Clamping

Never blindly set \`renderer.setPixelRatio(window.devicePixelRatio)\`. On a 3x Retina display, this renders 9x more pixels:

\`\`\`javascript
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
\`\`\`

Clamping to 1.75 or 2.0 maintains pristine visual fidelity while preventing thermal throttling.`,
      coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
      author: 'Ased',
      category: 'Web Graphics',
      tags: ['Three.js', 'WebGL', 'Shaders', 'Performance', 'React'],
      readTimeMinutes: 5,
      publishDate: '2025-09-04',
      isPublished: true,
      isFeatured: true,
      seoTitle: 'Optimizing Three.js for 60 FPS on Modern Browsers',
      seoDescription: 'Master WebGL performance with instanced meshes, custom shaders, and DPR clamping.',
      views: 980,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      title: 'Building Intelligent Systems with Local LLMs and Vector Search (RAG)',
      slug: 'building-intelligent-systems-local-llms-rag',
      excerpt: 'How to construct completely private, zero-leakage enterprise knowledge assistants using Ollama, LangChain, and embedding databases.',
      content: `## Data Privacy in the Era of Generative AI

While commercial cloud APIs offer immense intelligence, feeding confidential intellectual property into external third-party servers presents significant compliance risks.

### The Self-Hosted Solution

By combining quantized open-source weights (such as Llama 3 or Mistral) running on local hardware with a vector store, we can query enterprise documentation entirely on-premise.

### Step-by-Step RAG Pipeline

1. **Chunking**: Break documents into semantic segments (e.g. 500 tokens with 50-token overlap).
2. **Embedding**: Pass chunks into an embedding model to produce high-dimensional vectors.
3. **Retrieval**: Compute cosine similarity between user question vector and stored vectors.
4. **Augmented Prompt**: Supply top-k relevant chunks as context to the local LLM.`,
      coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      author: 'Ased',
      category: 'Artificial Intelligence',
      tags: ['AI', 'LLM', 'RAG', 'Vector Search', 'Python'],
      readTimeMinutes: 7,
      publishDate: '2025-07-22',
      isPublished: true,
      isFeatured: false,
      seoTitle: 'Self-Hosted RAG with Local LLMs | Ased',
      seoDescription: 'Step-by-step guide to private retrieval-augmented generation using vector databases.',
      views: 1420,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const existingBlogs = store.getCollection<IBlogPost>('blogPosts');
  if (existingBlogs.length === 0) {
    sampleBlogs.forEach(b => store.addItem<IBlogPost>('blogPosts', b as IBlogPost));
    console.log(`[Seed] Seeded ${sampleBlogs.length} blog posts.`);
  }

  // 10. Achievements
  const sampleAchievements: Omit<IAchievement, '_id'>[] = [
    {
      title: '1st Place Winner - National Cyber Hackathon 2024',
      organization: 'TechSprint Innovation Summit',
      date: '2024-03',
      description: 'Built an automated memory-forensics and ransomware detection tool in 36 hours competing against 240+ university teams.',
      category: 'Hackathon',
      url: 'https://hackathon.sample.org/winners-2024',
      order: 1
    },
    {
      title: 'Top 10 Finalist - CyberDefenders CTF',
      organization: 'CyberDefenders Guild',
      date: '2023-10',
      description: 'Solved complex binary exploitation, reverse engineering, and web vulnerability challenges in a 48-hour global Capture The Flag contest.',
      category: 'Competition',
      order: 2
    },
    {
      title: 'Open Source Community Core Contributor',
      organization: 'Open Source Initiative',
      date: '2023-01',
      description: 'Merged 25+ pull requests improving developer tooling, TypeScript typings, and documentation across popular GitHub projects.',
      category: 'Open Source',
      order: 3
    }
  ];

  const existingAch = store.getCollection<IAchievement>('achievements');
  if (existingAch.length === 0) {
    sampleAchievements.forEach(a => store.addItem<IAchievement>('achievements', a as IAchievement));
    console.log(`[Seed] Seeded ${sampleAchievements.length} achievements.`);
  }

  // 11. Services
  const sampleServices: Omit<IService, '_id'>[] = [
    {
      title: 'Full Stack Web Architecture',
      description: 'Engineering robust, scalable, modern web platforms using React 19, TypeScript, and microservice cloud backends with peak performance.',
      icon: 'Layers',
      features: ['Modern React & Next.js', 'REST & GraphQL APIs', 'Database Optimization', 'High-Speed CI/CD'],
      enabled: true,
      order: 1
    },
    {
      title: 'AI / Machine Learning Engineering',
      description: 'Developing end-to-end intelligent pipelines from computer vision models to retrieval-augmented generation (RAG) and local LLM integration.',
      icon: 'Brain',
      features: ['Custom PyTorch Models', 'RAG & Vector Search', 'TensorFlow.js Edge AI', 'Quantized Model Deployment'],
      enabled: true,
      order: 2
    },
    {
      title: 'Cybersecurity & Vulnerability Auditing',
      description: 'Comprehensive security posture analysis, code reviews, penetration testing simulations, and zero-trust authentication implementations.',
      icon: 'Shield',
      features: ['OWASP Top 10 Audits', 'Zero-Trust Auth Design', 'Network Packet Analysis', 'Security Best Practices'],
      enabled: true,
      order: 3
    },
    {
      title: 'Interactive 3D Web & Creative Experiences',
      description: 'Creating memorable, cinematic 3D digital experiences using Three.js, custom GLSL shaders, and silky smooth WebGL rendering.',
      icon: 'Sparkles',
      features: ['Three.js & R3F', 'GLSL Custom Shaders', '60 FPS Performance', 'Interactive Simulations'],
      enabled: true,
      order: 4
    }
  ];

  const existingServices = store.getCollection<IService>('services');
  if (existingServices.length === 0) {
    sampleServices.forEach(s => store.addItem<IService>('services', s as IService));
    console.log(`[Seed] Seeded ${sampleServices.length} services.`);
  }

  // 12. Testimonials
  const sampleTestimonials: Omit<ITestimonial, '_id'>[] = [
    {
      name: 'Dr. Evelyn Vance',
      role: 'Research Director',
      company: 'NeuralTech Labs',
      content: 'Ased possesses a rare combination of deep theoretical computer science acumen and practical implementation speed. His work on quantized model robustness was exemplary.',
      rating: 5,
      published: true,
      linkedinUrl: 'https://linkedin.com',
      order: 1
    },
    {
      name: 'Marcus Sterling',
      role: 'Head of Engineering',
      company: 'Aether Cloud Systems',
      content: 'Ased consistently raises the engineering bar. From zero-trust authentication to high-performance micro-frontends, he delivers production-grade code that is both beautiful and bulletproof.',
      rating: 5,
      published: true,
      linkedinUrl: 'https://linkedin.com',
      order: 2
    }
  ];

  const existingTestimonials = store.getCollection<ITestimonial>('testimonials');
  if (existingTestimonials.length === 0) {
    sampleTestimonials.forEach(t => store.addItem<ITestimonial>('testimonials', t as ITestimonial));
    console.log(`[Seed] Seeded ${sampleTestimonials.length} testimonials.`);
  }

  // 13. Site Settings
  const siteSettings: ISiteSettings = {
    _id: 'settings_primary',
    siteTitle: 'Ased // Full Stack & Cyber Portfolio',
    metaDescription: 'Futuristic portfolio of Ased - Full Stack Developer, AI/ML Specialist, and Cyber Security Practitioner.',
    keywords: ['Full Stack', 'React', 'Three.js', 'Node.js', 'Cyber Security', 'AI/ML', 'Computer Science'],
    accentColor: '#22D3EE',
    ogImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
    author: 'Ased',
    enabledSections: {
      hero: true,
      about: true,
      skills: true,
      techOrbit: true,
      experience: true,
      education: true,
      certifications: true,
      projects: true,
      research: true,
      cyberSecurity: true,
      achievements: true,
      services: true,
      testimonials: true,
      blog: true,
      terminal: true,
      contact: true
    },
    customCss: '',
    updatedAt: new Date().toISOString()
  };
  store.updateSettings(siteSettings);

  console.log('[Seed] Database successfully seeded with rich futuristic portfolio data!');
}

seed().catch(err => {
  console.error('[Seed] Error during database seeding:', err);
  process.exit(1);
});
