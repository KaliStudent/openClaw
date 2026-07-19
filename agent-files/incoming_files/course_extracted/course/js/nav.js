/* =========================================================
   Shared Navigation Structure
   Call buildNav(rootPath) in each page to inject sidebar
   rootPath: relative path back to course root (e.g., '../..')
   ========================================================= */

const COURSE_NAV = [
  {
    id: 'M1', title: 'Welcome to the Course', icon: '👋',
    lessons: [
      { id: 'm1l1', file: 'modules/m01-welcome/lesson-01.html', title: 'What Are Icons?' },
      { id: 'm1l2', file: 'modules/m01-welcome/lesson-02.html', title: 'How to Use This Course' },
    ]
  },
  {
    id: 'M2', title: 'Universal Icons (Found Everywhere)', icon: '🌐',
    lessons: [
      { id: 'm2l1', file: 'modules/m02-universal/lesson-01.html', title: 'Navigation Icons' },
      { id: 'm2l2', file: 'modules/m02-universal/lesson-02.html', title: 'Search & Discovery Icons' },
      { id: 'm2l3', file: 'modules/m02-universal/lesson-03.html', title: 'Action Icons' },
      { id: 'm2l4', file: 'modules/m02-universal/lesson-04.html', title: 'Status & Notification Icons' },
      { id: 'm2l5', file: 'modules/m02-universal/lesson-05.html', title: 'Account & Settings Icons' },
    ]
  },
  {
    id: 'M3', title: 'Social Media Icons', icon: '💬',
    lessons: [
      { id: 'm3l1', file: 'modules/m03-social/lesson-01.html', title: 'Facebook Icons' },
      { id: 'm3l2', file: 'modules/m03-social/lesson-02.html', title: 'Instagram Icons' },
      { id: 'm3l3', file: 'modules/m03-social/lesson-03.html', title: 'X (Twitter) Icons' },
      { id: 'm3l4', file: 'modules/m03-social/lesson-04.html', title: 'Reddit Icons' },
    ]
  },
  {
    id: 'M4', title: 'Google Icons', icon: '🔍',
    lessons: [
      { id: 'm4l1', file: 'modules/m04-google/lesson-01.html', title: 'Google Search Icons' },
      { id: 'm4l2', file: 'modules/m04-google/lesson-02.html', title: 'Google App Icons' },
    ]
  },
  {
    id: 'M5', title: 'iPhone (iOS) Icons', icon: '📱',
    lessons: [
      { id: 'm5l1', file: 'modules/m05-ios/lesson-01.html', title: 'iPhone Status Bar' },
      { id: 'm5l2', file: 'modules/m05-ios/lesson-02.html', title: 'iPhone App Navigation' },
      { id: 'm5l3', file: 'modules/m05-ios/lesson-03.html', title: 'Built-in App Icons' },
    ]
  },
  {
    id: 'M6', title: 'Android Icons', icon: '🤖',
    lessons: [
      { id: 'm6l1', file: 'modules/m06-android/lesson-01.html', title: 'Android Status Bar' },
      { id: 'm6l2', file: 'modules/m06-android/lesson-02.html', title: 'Android Navigation & System Icons' },
    ]
  },
  {
    id: 'M7', title: 'AI Platform Icons', icon: '🤖',
    lessons: [
      { id: 'm7l1', file: 'modules/m07-ai/lesson-01.html', title: 'AI Chat & Feedback Icons' },
    ]
  },
  {
    id: 'M8', title: 'Review & Assessment', icon: '🏆',
    lessons: [
      { id: 'm8l1', file: 'modules/m08-review/lesson-01.html', title: 'Quick Reference Cheat Sheet' },
      { id: 'm8l2', file: 'modules/m08-review/quiz.html',      title: 'Final Knowledge Quiz' },
    ]
  },
];

function buildNav(rootPath = '') {
  const p = getProgress();
  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  let html = '<p class="sidebar-section-title">Course Modules</p>';
  COURSE_NAV.forEach(mod => {
    html += `<div class="nav-module-group">
      <button class="nav-module-title">
        <span class="mod-number">${mod.id}</span>
        ${mod.icon} ${mod.title}
      </button>
      <ul class="nav-lesson-list">`;
    mod.lessons.forEach(lesson => {
      const done = p[lesson.id] ? ' completed' : '';
      html += `<li><a href="${rootPath}${lesson.file}" data-lesson-id="${lesson.id}" class="${done}">${lesson.title}</a></li>`;
    });
    html += `</ul></div>`;
  });

  // Resources
  html += `<p class="sidebar-section-title" style="margin-top:1rem">Resources</p>
    <ul class="nav-lesson-list">
      <li><a href="${rootPath}glossary/index.html">📖 Glossary</a></li>
    </ul>`;

  sidebar.innerHTML = html;
}
