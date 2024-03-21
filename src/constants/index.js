import {
  frontend,
  backend,
  ux,
  prototyping,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  redux,
  tailwind,
  nodejs,
  git,
  figma,
  postgresql,
  mongodb,
  coverhunt,
  kelhel,
  microverse,
  soundboard,
  todolist,
  pictureyard,
  leptonmaps,
  cryptosky,
  mentorstudents
} from '../assets';

export const navLinks = [
  {
    id: 'about',
    title: 'About',
  },
  {
    id: 'projects',
    title: 'Projects',
  },
  {
    id: 'contact',
    title: 'Contact',
  },
];

const services = [
  {
    title: 'Frontend Developer',
    icon: frontend,
  },
  {
    title: 'Backend Developer',
    icon: backend,
  },
  {
    title: 'UI/UX Design',
    icon: ux,
  },
  {
    title: 'Software Testing',
    icon: prototyping,
  },
];

const technologies = [
  {
    name: 'HTML 5',
    icon: html,
  },
  {
    name: 'CSS 3',
    icon: css,
  },
  {
    name: 'JavaScript',
    icon: javascript,
  },
  {
    name: 'TypeScript',
    icon: typescript,
  },
  {
    name: 'React JS',
    icon: reactjs,
  },
  {
    name: 'Redux Toolkit',
    icon: redux,
  },
  {
    name: 'Tailwind CSS',
    icon: tailwind,
  },
  {
    name: 'Node JS',
    icon: nodejs,
  },
  {
    name: 'postgresql',
    icon: postgresql,
  },
  {
    name: 'git',
    icon: git,
  },
  {
    name: 'figma',
    icon: figma,
  },
  {
    name: 'mongodb',
    icon: mongodb,
  },
];

const experiences = [
  {
    title: 'Software Engineer (MERN)',
    company_name: 'TalkValley EdTech',
    icon: coverhunt,
    iconBg: '#333333',
    date: 'Aug 2020 - Dec 2021',
  },
  {
    title: 'Software Engineer',
    company_name: 'Tark Technologies',
    icon: microverse,
    iconBg: '#333333',
    date: 'Jan 2022 - Dec 2022',
  },
  {
    title: 'Frontend Developer',
    company_name: 'Lepton Software',
    icon: kelhel,
    iconBg: '#333333',
    date: 'Feb 2023 - Present',
  },
];

const projects = [
  {
    id: 'project-5',
    name: 'Lepton Maps',
    description:
      'Our SaaS company specializes in providing a range of GeoIntelligence services',
    tags: [
      {
        name: 'nextjs',
        color: 'blue-text-gradient',
      },
      {
        name: 'supabase',
        color: 'green-text-gradient',
      },
      {
        name: 'css',
        color: 'pink-text-gradient',
      },
    ],
    image: leptonmaps,
    repo: 'https://github.com/amanchhetri/',
    demo: 'https://leptonmaps.com/',
  },
  {
    id: 'project-6',
    name: 'MentorStudents',
    description: 'We help you empower your students to speak with college mentors and get insiders view on college programs of interest',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'mongodb',
        color: 'green-text-gradient',
      },
      {
        name: 'next',
        color: 'pink-text-gradient',
      },
    ],
    image: mentorstudents,
    repo: 'https://github.com/amanchhetri/',
    demo: 'https://mentorstudents.org/',
  },
  {
    id: 'project-4',
    name: 'Crypto Sky',
    description: 'A website showcasing a comprehensive list of cryptocurrency coins along with their respective price graphs provides users with valuable insights and information about the cryptocurrency market.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'mongodb',
        color: 'green-text-gradient',
      },
      {
        name: 'tailwind',
        color: 'pink-text-gradient',
      },
    ],
    image: cryptosky,
    repo: 'https://github.com/amanchhetri/crytpo-sky',
    demo: 'https://crytpo-sky.vercel.app/#/',
  },
  {
    id: 'project-2',
    name: 'SoundBoard',
    description:
      'Sounds triggered by keystrokes using Paper.js and ReactHowler.',
    tags: [
      {
        name: 'react',
        color: 'blue-text-gradient',
      },
      {
        name: 'restapi',
        color: 'green-text-gradient',
      },
      {
        name: 'scss',
        color: 'pink-text-gradient',
      },
    ],
    image: soundboard,
    repo: 'https://github.com/amanchhetri/SoundBoard',
    demo: 'https://sound-board-eight.vercel.app/',
  },
  {
    id: 'project-3',
    name: 'PictureYard',
    description: 'A single-page application (SPA) built with React, featuring a collection of images, offers a dynamic and responsive user experience.',
    tags: [
      {
        name: 'nextjs',
        color: 'blue-text-gradient',
      },
      {
        name: 'supabase',
        color: 'green-text-gradient',
      },
      {
        name: 'css',
        color: 'pink-text-gradient',
      },
    ],
    image: pictureyard,
    repo: 'https://github.com/amanchhetri/PictureYard',
    demo: 'https://picture-yard.vercel.app/',
  },
  // {
  //   id: 'project-4',
  //   name: 'Todo List',
  //   description: `A todo list application built with React.js provides a user-friendly interface for managing tasks and staying organized.`,
  //   tags: [
  //     {
  //       name: 'nextjs',
  //       color: 'blue-text-gradient',
  //     },
  //     {
  //       name: 'supabase',
  //       color: 'green-text-gradient',
  //     },
  //     {
  //       name: 'css',
  //       color: 'pink-text-gradient',
  //     },
  //   ],
  //   image: todolist,
  //   repo: 'https://github.com/amanchhetri/todo-list',
  //   demo: 'https://todo-app-iota-blond-86.vercel.app/',
  // },
];

export { services, technologies, experiences, projects };
