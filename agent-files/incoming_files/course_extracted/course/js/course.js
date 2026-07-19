/* =========================================================
   READING THE DIGITAL WORLD — Course JavaScript
   Handles: progress tracking, quiz logic, navigation
   ========================================================= */

// ── Progress Tracking ─────────────────────────────────────
const STORAGE_KEY = 'rdw_progress';

function getProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch { return {}; }
}
function saveProgress(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}
function markLessonComplete(lessonId) {
  const p = getProgress();
  p[lessonId] = true;
  saveProgress(p);
  updateProgressUI();
}
function isComplete(lessonId) { return !!getProgress()[lessonId]; }

function updateProgressUI() {
  const p = getProgress();
  const total = document.querySelectorAll('.nav-lesson-list a[data-lesson-id]').length;
  const done  = Object.keys(p).filter(k => p[k]).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const fill  = document.querySelector('.progress-bar-fill');
  const label = document.querySelector('.progress-label');
  if (fill)  fill.style.width = pct + '%';
  if (label) label.textContent = pct + '% Complete';

  // Mark completed lessons in nav
  document.querySelectorAll('.nav-lesson-list a[data-lesson-id]').forEach(link => {
    if (p[link.dataset.lessonId]) link.classList.add('completed');
  });
}

// ── Active Nav Highlight ──────────────────────────────────
function highlightCurrentLesson() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-lesson-list a').forEach(a => {
    if (a.getAttribute('href') && a.getAttribute('href').includes(page)) {
      a.classList.add('active');
      a.closest('.nav-module-group')?.querySelector('.nav-module-title')?.classList.add('active');
    }
  });
}

// ── Mark Complete Button ───────────────────────────────────
function initCompleteButton() {
  const btn = document.getElementById('mark-complete-btn');
  const lessonId = document.body.dataset.lessonId;
  if (!btn || !lessonId) return;

  if (isComplete(lessonId)) {
    btn.textContent = '✓ Completed';
    btn.classList.remove('btn-success');
    btn.classList.add('btn-secondary');
    btn.disabled = true;
  }
  btn.addEventListener('click', () => {
    markLessonComplete(lessonId);
    btn.textContent = '✓ Marked Complete!';
    btn.disabled = true;
    btn.classList.remove('btn-success');
    btn.classList.add('btn-secondary');
  });
}

// ── Quiz Logic ─────────────────────────────────────────────
function initQuiz() {
  document.querySelectorAll('.quiz-question').forEach(qEl => {
    const inputs  = qEl.querySelectorAll('input[type="radio"]');
    const fb      = qEl.querySelector('.quiz-feedback');
    const correct = qEl.dataset.correct;
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        if (!fb) return;
        fb.className = 'quiz-feedback';
        if (input.value === correct) {
          fb.textContent = '✓ Correct! ' + (qEl.dataset.correctMsg || 'Great job!');
          fb.classList.add('correct');
        } else {
          fb.textContent = '✗ Not quite. ' + (qEl.dataset.wrongMsg || 'Try again.');
          fb.classList.add('incorrect');
        }
      });
    });
  });
}

// ── Vocab Tooltips ─────────────────────────────────────────
function initVocabTooltips() {
  document.querySelectorAll('.vocab-term[data-def]').forEach(el => {
    el.setAttribute('title', el.dataset.def);
  });
}

// ── Mobile Nav Toggle ─────────────────────────────────────
function initMobileNav() {
  const toggle = document.getElementById('mobile-nav-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  highlightCurrentLesson();
  updateProgressUI();
  initCompleteButton();
  initQuiz();
  initVocabTooltips();
  initMobileNav();
});
