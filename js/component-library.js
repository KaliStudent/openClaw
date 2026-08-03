/**
 * ComponentLibrary - Provides component template definitions for the CSS Component Lab.
 * Each component has an HTML template with standard class names that can be restyled by user CSS.
 */
const ComponentLibrary = (function () {
  'use strict';

  const categories = [
    { id: 'forms', name: 'Forms', icon: '📝' },
    { id: 'navigation', name: 'Navigation', icon: '🧭' },
    { id: 'feedback', name: 'Feedback', icon: '💬' },
    { id: 'layout', name: 'Layout', icon: '📐' },
    { id: 'content', name: 'Content', icon: '📄' },
    { id: 'pro', name: 'Pro', icon: '⭐' }
  ];

  const components = [
    // 1. Buttons
    {
      id: 'buttons',
      name: 'Buttons',
      icon: '🔘',
      category: 'forms',
      html: `<div class="btn-group-demo">
  <button class="btn btn-primary">Primary</button>
  <button class="btn btn-secondary">Secondary</button>
  <button class="btn btn-outline">Outline</button>
  <button class="btn btn-ghost">Ghost</button>
  <button class="btn btn-disabled" disabled>Disabled</button>
  <button class="btn btn-icon">
    <span class="icon">★</span> Icon
  </button>
  <div class="btn-group">
    <button class="btn btn-primary">Left</button>
    <button class="btn btn-primary">Center</button>
    <button class="btn btn-primary">Right</button>
  </div>
</div>`,
      css: `.btn-group-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 16px;
}
.btn {
  padding: 10px 20px;
  border: 2px solid #333;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #fff;
  color: #333;
}
.btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }
.btn:active { transform: translateY(0); }
.btn:focus { outline: 3px solid rgba(66,133,244,0.4); outline-offset: 2px; }
.btn-primary { background: #4285f4; color: #fff; border-color: #4285f4; }
.btn-primary:hover { background: #3367d6; border-color: #3367d6; }
.btn-secondary { background: #6c757d; color: #fff; border-color: #6c757d; }
.btn-secondary:hover { background: #5a6268; border-color: #5a6268; }
.btn-outline { background: transparent; color: #4285f4; border-color: #4285f4; }
.btn-outline:hover { background: #4285f4; color: #fff; }
.btn-ghost { background: transparent; border-color: transparent; color: #4285f4; }
.btn-ghost:hover { background: rgba(66,133,244,0.1); }
.btn-disabled { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
.btn-icon .icon { margin-right: 4px; }
.btn-group { display: inline-flex; }
.btn-group .btn { border-radius: 0; margin: 0; border-right-width: 0; }
.btn-group .btn:first-child { border-radius: 6px 0 0 6px; }
.btn-group .btn:last-child { border-radius: 0 6px 6px 0; border-right-width: 2px; }`,
      js: ''
    },

    // 2. Loaders / Spinners
    {
      id: 'loaders',
      name: 'Loaders / Spinners',
      icon: '⏳',
      category: 'feedback',
      html: `<div class="loaders-demo">
  <div class="loader-section">
    <h4>Spinner</h4>
    <div class="loader spinner"></div>
  </div>
  <div class="loader-section">
    <h4>Dots</h4>
    <div class="loader dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
  </div>
  <div class="loader-section">
    <h4>Pulse</h4>
    <div class="loader pulse"></div>
  </div>
</div>`,
      css: `.loaders-demo {
  display: flex;
  gap: 40px;
  padding: 24px;
  align-items: center;
  justify-content: center;
}
.loader-section { text-align: center; }
.loader-section h4 { margin-bottom: 12px; font-size: 13px; color: #666; }
.spinner {
  width: 40px; height: 40px;
  border: 4px solid #e0e0e0;
  border-top-color: #4285f4;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.dots { display: flex; gap: 6px; justify-content: center; }
.dot {
  width: 12px; height: 12px;
  background: #4285f4;
  border-radius: 50%;
  animation: dotBounce 1.4s ease-in-out infinite both;
}
.dot:nth-child(2) { animation-delay: 0.16s; }
.dot:nth-child(3) { animation-delay: 0.32s; }
@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0.4); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}
.pulse {
  width: 40px; height: 40px;
  background: #4285f4;
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 1; }
  50% { transform: scale(1.2); opacity: 0.5; }
  100% { transform: scale(0.8); opacity: 1; }
}`,
      js: ''
    },

    // 3. Nav Menu
    {
      id: 'nav-menu',
      name: 'Nav Menu',
      icon: '🧭',
      category: 'navigation',
      html: `<nav class="nav navbar">
  <div class="nav-brand">Brand</div>
  <ul class="nav-links">
    <li><a href="#" class="nav-link active">Home</a></li>
    <li><a href="#" class="nav-link">About</a></li>
    <li><a href="#" class="nav-link">Services</a></li>
    <li><a href="#" class="nav-link">Contact</a></li>
  </ul>
</nav>`,
      css: `.navbar {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  background: #1a1a2e;
  border-radius: 8px;
}
.nav-brand {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-right: auto;
}
.nav-links {
  display: flex;
  list-style: none;
  gap: 4px;
  margin: 0;
  padding: 0;
}
.nav-link {
  color: #ccc;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s;
}
.nav-link:hover { color: #fff; background: rgba(255,255,255,0.1); }
.nav-link.active { color: #fff; background: #4285f4; }`,
      js: ''
    },

    // 4. Dropdown Menu
    {
      id: 'dropdown',
      name: 'Dropdown Menu',
      icon: '📋',
      category: 'navigation',
      html: `<div class="dropdown-demo">
  <div class="dropdown">
    <button class="btn dropdown-toggle">Menu ▾</button>
    <ul class="dropdown-menu">
      <li><a href="#" class="dropdown-item">Profile</a></li>
      <li><a href="#" class="dropdown-item">Settings</a></li>
      <li><a href="#" class="dropdown-item">Notifications</a></li>
      <li class="dropdown-divider"></li>
      <li><a href="#" class="dropdown-item dropdown-item-danger">Logout</a></li>
    </ul>
  </div>
</div>`,
      css: `.dropdown-demo { padding: 16px; }
.dropdown { position: relative; display: inline-block; }
.dropdown-toggle {
  padding: 10px 20px;
  background: #4285f4;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 4px;
  min-width: 180px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  list-style: none;
  padding: 6px;
  z-index: 100;
}
.dropdown.open .dropdown-menu { display: block; }
.dropdown-item {
  display: block;
  padding: 10px 14px;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  font-size: 14px;
}
.dropdown-item:hover { background: #f0f4ff; color: #4285f4; }
.dropdown-item-danger { color: #e53935; }
.dropdown-item-danger:hover { background: #ffeaea; color: #c62828; }
.dropdown-divider { height: 1px; background: #e0e0e0; margin: 4px 0; }`,
      js: `document.querySelectorAll('.dropdown-toggle').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    var dd = this.closest('.dropdown');
    dd.classList.toggle('open');
  });
});
document.addEventListener('click', function() {
  document.querySelectorAll('.dropdown.open').forEach(function(dd) {
    dd.classList.remove('open');
  });
});`
    },

    // 5. Login Form
    {
      id: 'login-form',
      name: 'Login Form',
      icon: '🔐',
      category: 'forms',
      html: `<div class="form-container">
  <form class="form login-form">
    <h2 class="form-title">Sign In</h2>
    <div class="form-group">
      <label class="label" for="login-email">Email</label>
      <input class="input" type="email" id="login-email" placeholder="you@example.com">
    </div>
    <div class="form-group">
      <label class="label" for="login-password">Password</label>
      <input class="input" type="password" id="login-password" placeholder="••••••••">
    </div>
    <button class="btn btn-primary btn-block" type="submit">Sign In</button>
    <a href="#" class="form-link">Forgot password?</a>
  </form>
</div>`,
      css: `.form-container { padding: 24px; display: flex; justify-content: center; }
.form {
  width: 100%;
  max-width: 360px;
  padding: 32px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.form-title { margin: 0 0 24px; font-size: 22px; color: #1a1a2e; text-align: center; }
.form-group { margin-bottom: 18px; }
.label { display: block; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 6px; }
.input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.input:focus { outline: none; border-color: #4285f4; }
.btn-block { width: 100%; margin-top: 8px; }
.form-link { display: block; text-align: center; margin-top: 16px; color: #4285f4; font-size: 13px; text-decoration: none; }
.form-link:hover { text-decoration: underline; }`,
      js: ''
    },

    // 6. Contact Form
    {
      id: 'contact-form',
      name: 'Contact Form',
      icon: '✉️',
      category: 'forms',
      html: `<div class="form-container">
  <form class="form contact-form">
    <h2 class="form-title">Contact Us</h2>
    <div class="form-group">
      <label class="label" for="contact-name">Name</label>
      <input class="input" type="text" id="contact-name" placeholder="Your name">
    </div>
    <div class="form-group">
      <label class="label" for="contact-email">Email</label>
      <input class="input" type="email" id="contact-email" placeholder="you@example.com">
    </div>
    <div class="form-group">
      <label class="label" for="contact-message">Message</label>
      <textarea class="input textarea" id="contact-message" rows="4" placeholder="How can we help?"></textarea>
    </div>
    <button class="btn btn-primary btn-block" type="submit">Send Message</button>
  </form>
</div>`,
      css: `.form-container { padding: 24px; display: flex; justify-content: center; }
.form {
  width: 100%;
  max-width: 400px;
  padding: 32px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.form-title { margin: 0 0 24px; font-size: 22px; color: #1a1a2e; text-align: center; }
.form-group { margin-bottom: 18px; }
.label { display: block; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 6px; }
.input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.input:focus { outline: none; border-color: #4285f4; }
.textarea { resize: vertical; min-height: 80px; font-family: inherit; }
.btn-block { width: 100%; margin-top: 8px; }`,
      js: ''
    },

    // 7. Toggle Switch
    {
      id: 'toggle-switch',
      name: 'Toggle Switch',
      icon: '🔀',
      category: 'forms',
      html: `<div class="toggle-demo">
  <label class="toggle">
    <input type="checkbox" class="toggle-input" checked>
    <span class="toggle-slider"></span>
    <span class="toggle-label">Notifications</span>
  </label>
  <label class="toggle">
    <input type="checkbox" class="toggle-input">
    <span class="toggle-slider"></span>
    <span class="toggle-label">Dark Mode</span>
  </label>
  <label class="toggle">
    <input type="checkbox" class="toggle-input">
    <span class="toggle-slider"></span>
    <span class="toggle-label">Auto-save</span>
  </label>
</div>`,
      css: `.toggle-demo { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.toggle { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.toggle-input { display: none; }
.toggle-slider {
  width: 48px;
  height: 26px;
  background: #ccc;
  border-radius: 13px;
  position: relative;
  transition: background 0.3s;
  flex-shrink: 0;
}
.toggle-slider::after {
  content: '';
  position: absolute;
  top: 3px; left: 3px;
  width: 20px; height: 20px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.3s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.toggle-input:checked + .toggle-slider { background: #4285f4; }
.toggle-input:checked + .toggle-slider::after { transform: translateX(22px); }
.toggle-label { font-size: 14px; color: #333; }`,
      js: ''
    },

    // 8. Text Input
    {
      id: 'text-input',
      name: 'Text Input',
      icon: '✏️',
      category: 'forms',
      html: `<div class="input-demo">
  <div class="form-group">
    <label class="label">Default</label>
    <input class="input" type="text" placeholder="Enter text...">
  </div>
  <div class="form-group">
    <label class="label">Focused</label>
    <input class="input input-focus" type="text" value="Focused state">
  </div>
  <div class="form-group">
    <label class="label">Error</label>
    <input class="input input-error" type="text" value="Invalid input">
    <span class="input-hint input-hint-error">This field is required</span>
  </div>
  <div class="form-group">
    <label class="label">Disabled</label>
    <input class="input input-disabled" type="text" value="Cannot edit" disabled>
  </div>
</div>`,
      css: `.input-demo { padding: 24px; max-width: 360px; }
.form-group { margin-bottom: 18px; }
.label { display: block; font-size: 13px; font-weight: 600; color: #555; margin-bottom: 6px; }
.input {
  width: 100%;
  padding: 10px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.input:focus, .input-focus { outline: none; border-color: #4285f4; box-shadow: 0 0 0 3px rgba(66,133,244,0.15); }
.input-error { border-color: #e53935; }
.input-error:focus { box-shadow: 0 0 0 3px rgba(229,57,53,0.15); }
.input-hint { display: block; font-size: 12px; margin-top: 4px; }
.input-hint-error { color: #e53935; }
.input-disabled { background: #f5f5f5; color: #999; cursor: not-allowed; }`,
      js: ''
    },

    // 9. Search Box
    {
      id: 'search-box',
      name: 'Search Box',
      icon: '🔍',
      category: 'forms',
      html: `<div class="search-demo">
  <div class="search-box">
    <span class="search-icon">🔍</span>
    <input class="input search-input" type="text" placeholder="Search...">
    <button class="search-clear" title="Clear">✕</button>
  </div>
</div>`,
      css: `.search-demo { padding: 24px; display: flex; justify-content: center; }
.search-box {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
  border: 2px solid #e0e0e0;
  border-radius: 24px;
  padding: 4px 12px;
  background: #fff;
  transition: border-color 0.2s;
}
.search-box:focus-within { border-color: #4285f4; box-shadow: 0 0 0 3px rgba(66,133,244,0.1); }
.search-icon { font-size: 16px; margin-right: 8px; }
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  padding: 8px 0;
  background: transparent;
}
.search-clear {
  background: none;
  border: none;
  font-size: 16px;
  color: #999;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 50%;
}
.search-clear:hover { color: #333; background: #f0f0f0; }`,
      js: ''
    },

    // 10. Cards
    {
      id: 'cards',
      name: 'Cards',
      icon: '🃏',
      category: 'content',
      html: `<div class="cards-demo">
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">Basic Card</h3>
      <p class="card-text">A simple card with just text content. Cards are versatile containers for grouping related content.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-image">
      <div class="card-image-placeholder">📷 Image</div>
    </div>
    <div class="card-body">
      <h3 class="card-title">Card with Image</h3>
      <p class="card-text">This card has an image placeholder at the top.</p>
    </div>
  </div>
  <div class="card">
    <div class="card-body">
      <h3 class="card-title">Card with Actions</h3>
      <p class="card-text">This card has a footer with action buttons.</p>
    </div>
    <div class="card-footer">
      <button class="btn btn-primary btn-sm">Action</button>
      <button class="btn btn-ghost btn-sm">Cancel</button>
    </div>
  </div>
</div>`,
      css: `.cards-demo { padding: 24px; display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
.card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: box-shadow 0.2s, transform 0.2s;
}
.card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.1); transform: translateY(-2px); }
.card-image-placeholder {
  height: 120px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
}
.card-body { padding: 20px; }
.card-title { margin: 0 0 8px; font-size: 16px; color: #1a1a2e; }
.card-text { margin: 0; font-size: 14px; color: #666; line-height: 1.5; }
.card-footer { padding: 12px 20px; border-top: 1px solid #f0f0f0; display: flex; gap: 8px; }
.btn-sm { padding: 6px 14px; font-size: 13px; }`,
      js: ''
    },

    // 11. Container / Section
    {
      id: 'container-section',
      name: 'Container / Section',
      icon: '📦',
      category: 'layout',
      html: `<div class="section hero-section">
  <div class="container">
    <h1 class="hero-title">Welcome to the Lab</h1>
    <p class="hero-subtitle">A playground for CSS experimentation and component styling</p>
    <button class="btn btn-primary btn-lg">Get Started</button>
  </div>
</div>
<div class="section content-section">
  <div class="container">
    <h2 class="section-title">About This Project</h2>
    <p class="section-text">This is a content section demonstrating container and section styling. It uses standard class names that can be easily restyled with custom CSS.</p>
  </div>
</div>`,
      css: `.hero-section {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 60px 24px;
  text-align: center;
  border-radius: 8px 8px 0 0;
}
.container { max-width: 600px; margin: 0 auto; }
.hero-title { color: #fff; font-size: 28px; margin: 0 0 12px; }
.hero-subtitle { color: #aab; font-size: 16px; margin: 0 0 24px; }
.btn-lg { padding: 14px 28px; font-size: 16px; }
.content-section {
  padding: 40px 24px;
  background: #fafafa;
  border-radius: 0 0 8px 8px;
}
.section-title { font-size: 22px; color: #1a1a2e; margin: 0 0 12px; }
.section-text { font-size: 15px; color: #555; line-height: 1.6; margin: 0; }`,
      js: ''
    },

    // 12. 3-Column Layout
    {
      id: 'three-column-layout',
      name: '3-Column Layout',
      icon: '▦',
      category: 'layout',
      html: `<div class="columns-demo">
  <div class="row">
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">🚀 Fast</h3>
          <p class="card-text">Lightning-fast performance with optimized rendering and minimal overhead.</p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">🎨 Beautiful</h3>
          <p class="card-text">Crafted with attention to detail and modern design principles.</p>
        </div>
      </div>
    </div>
    <div class="col">
      <div class="card">
        <div class="card-body">
          <h3 class="card-title">🔧 Flexible</h3>
          <p class="card-text">Easily customizable to match any brand or design system.</p>
        </div>
      </div>
    </div>
  </div>
</div>`,
      css: `.columns-demo { padding: 24px; }
.row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.col { min-width: 0; }
.card {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  height: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.card-body { padding: 24px; text-align: center; }
.card-title { font-size: 16px; margin: 0 0 8px; }
.card-text { font-size: 14px; color: #666; line-height: 1.5; margin: 0; }`,
      js: ''
    },

    // 13. CSS Patterns
    {
      id: 'css-patterns',
      name: 'CSS Patterns',
      icon: '🎨',
      category: 'content',
      html: `<div class="patterns-demo">
  <div class="pattern-box pattern-stripes">
    <span class="pattern-label">Stripes</span>
  </div>
  <div class="pattern-box pattern-dots">
    <span class="pattern-label">Dots</span>
  </div>
  <div class="pattern-box pattern-checkerboard">
    <span class="pattern-label">Checkerboard</span>
  </div>
</div>`,
      css: `.patterns-demo {
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.pattern-box {
  height: 120px;
  border-radius: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 12px;
  border: 1px solid #e0e0e0;
}
.pattern-label {
  background: rgba(255,255,255,0.9);
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}
.pattern-stripes {
  background: repeating-linear-gradient(
    45deg,
    #667eea,
    #667eea 10px,
    #764ba2 10px,
    #764ba2 20px
  );
}
.pattern-dots {
  background-image: radial-gradient(circle, #4285f4 2px, transparent 2px);
  background-size: 16px 16px;
  background-color: #f0f4ff;
}
.pattern-checkerboard {
  background-image:
    linear-gradient(45deg, #ddd 25%, transparent 25%),
    linear-gradient(-45deg, #ddd 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #ddd 75%),
    linear-gradient(-45deg, transparent 75%, #ddd 75%);
  background-size: 20px 20px;
  background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
  background-color: #fff;
}`,
      js: ''
    },

    // 14. Tooltips
    {
      id: 'tooltips',
      name: 'Tooltips',
      icon: '💡',
      category: 'feedback',
      html: `<div class="tooltips-demo">
  <span class="tooltip-wrapper" data-tooltip="Tooltip on top" data-position="top">
    <button class="btn btn-outline">Top</button>
  </span>
  <span class="tooltip-wrapper" data-tooltip="Tooltip on bottom" data-position="bottom">
    <button class="btn btn-outline">Bottom</button>
  </span>
  <span class="tooltip-wrapper" data-tooltip="Tooltip on left" data-position="left">
    <button class="btn btn-outline">Left</button>
  </span>
  <span class="tooltip-wrapper" data-tooltip="Tooltip on right" data-position="right">
    <button class="btn btn-outline">Right</button>
  </span>
</div>`,
      css: `.tooltips-demo {
  padding: 60px 24px;
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.tooltip-wrapper::after {
  content: attr(data-tooltip);
  position: absolute;
  background: #1a1a2e;
  color: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s;
  z-index: 10;
}
.tooltip-wrapper:hover::after { opacity: 1; }
.tooltip-wrapper[data-position="top"]::after { bottom: 100%; left: 50%; transform: translateX(-50%); margin-bottom: 8px; }
.tooltip-wrapper[data-position="bottom"]::after { top: 100%; left: 50%; transform: translateX(-50%); margin-top: 8px; }
.tooltip-wrapper[data-position="left"]::after { right: 100%; top: 50%; transform: translateY(-50%); margin-right: 8px; }
.tooltip-wrapper[data-position="right"]::after { left: 100%; top: 50%; transform: translateY(-50%); margin-left: 8px; }
.btn-outline { padding: 10px 20px; border: 2px solid #4285f4; background: transparent; color: #4285f4; border-radius: 6px; cursor: pointer; font-weight: 600; }`,
      js: ''
    },

    // 15. Radio Buttons
    {
      id: 'radio-buttons',
      name: 'Radio Buttons',
      icon: '🔘',
      category: 'forms',
      html: `<div class="radio-demo">
  <fieldset class="radio-group">
    <legend class="radio-legend">Select a plan</legend>
    <label class="radio">
      <input type="radio" name="plan" class="radio-input" checked>
      <span class="radio-control"></span>
      <span class="radio-label">Free — $0/mo</span>
    </label>
    <label class="radio">
      <input type="radio" name="plan" class="radio-input">
      <span class="radio-control"></span>
      <span class="radio-label">Pro — $9/mo</span>
    </label>
    <label class="radio">
      <input type="radio" name="plan" class="radio-input">
      <span class="radio-control"></span>
      <span class="radio-label">Enterprise — $29/mo</span>
    </label>
  </fieldset>
</div>`,
      css: `.radio-demo { padding: 24px; }
.radio-group { border: none; padding: 0; margin: 0; }
.radio-legend { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; }
.radio {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background 0.2s;
}
.radio:hover { background: #f5f7ff; }
.radio-input { display: none; }
.radio-control {
  width: 20px; height: 20px;
  border: 2px solid #ccc;
  border-radius: 50%;
  position: relative;
  flex-shrink: 0;
  transition: border-color 0.2s;
}
.radio-control::after {
  content: '';
  position: absolute;
  top: 4px; left: 4px;
  width: 8px; height: 8px;
  border-radius: 50%;
  background: #4285f4;
  transform: scale(0);
  transition: transform 0.2s;
}
.radio-input:checked + .radio-control { border-color: #4285f4; }
.radio-input:checked + .radio-control::after { transform: scale(1); }
.radio-label { font-size: 14px; color: #333; }`,
      js: ''
    },

    // 16. Checkboxes
    {
      id: 'checkboxes',
      name: 'Checkboxes',
      icon: '☑️',
      category: 'forms',
      html: `<div class="checkbox-demo">
  <fieldset class="checkbox-group">
    <legend class="checkbox-legend">Select features</legend>
    <label class="checkbox">
      <input type="checkbox" class="checkbox-input" checked>
      <span class="checkbox-control"></span>
      <span class="checkbox-label">Dark mode</span>
    </label>
    <label class="checkbox">
      <input type="checkbox" class="checkbox-input" checked>
      <span class="checkbox-control"></span>
      <span class="checkbox-label">Notifications</span>
    </label>
    <label class="checkbox">
      <input type="checkbox" class="checkbox-input">
      <span class="checkbox-control"></span>
      <span class="checkbox-label">Auto-updates</span>
    </label>
    <label class="checkbox">
      <input type="checkbox" class="checkbox-input">
      <span class="checkbox-control"></span>
      <span class="checkbox-label">Analytics</span>
    </label>
  </fieldset>
</div>`,
      css: `.checkbox-demo { padding: 24px; }
.checkbox-group { border: none; padding: 0; margin: 0; }
.checkbox-legend { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; }
.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background 0.2s;
}
.checkbox:hover { background: #f5f7ff; }
.checkbox-input { display: none; }
.checkbox-control {
  width: 20px; height: 20px;
  border: 2px solid #ccc;
  border-radius: 4px;
  position: relative;
  flex-shrink: 0;
  transition: all 0.2s;
}
.checkbox-control::after {
  content: '✓';
  position: absolute;
  top: -1px; left: 3px;
  font-size: 14px;
  color: #fff;
  opacity: 0;
  transition: opacity 0.2s;
}
.checkbox-input:checked + .checkbox-control {
  background: #4285f4;
  border-color: #4285f4;
}
.checkbox-input:checked + .checkbox-control::after { opacity: 1; }
.checkbox-label { font-size: 14px; color: #333; }`,
      js: ''
    },

    // 17. Loading Bar
    {
      id: 'loading-bar',
      name: 'Loading Bar',
      icon: '⏱️',
      category: 'feedback',
      html: `<div class="loading-bar-demo">
  <h4>Indeterminate Loading</h4>
  <div class="loading-bar">
    <div class="loading-bar-track">
      <div class="loading-bar-fill loading-bar-indeterminate"></div>
    </div>
  </div>
  <h4>Striped Animated</h4>
  <div class="loading-bar">
    <div class="loading-bar-track">
      <div class="loading-bar-fill loading-bar-striped" style="width:75%"></div>
    </div>
  </div>
</div>`,
      css: `.loading-bar-demo { padding: 24px; }
.loading-bar-demo h4 { font-size: 13px; color: #666; margin: 0 0 8px; }
.loading-bar { margin-bottom: 24px; }
.loading-bar-track {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
.loading-bar-fill {
  height: 100%;
  background: #4285f4;
  border-radius: 4px;
  transition: width 0.4s ease;
}
.loading-bar-indeterminate {
  width: 40%;
  animation: indeterminate 1.5s ease-in-out infinite;
}
@keyframes indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}
.loading-bar-striped {
  background-image: linear-gradient(
    45deg,
    rgba(255,255,255,0.3) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255,255,255,0.3) 50%,
    rgba(255,255,255,0.3) 75%,
    transparent 75%
  );
  background-size: 20px 20px;
  animation: stripeMove 0.6s linear infinite;
}
@keyframes stripeMove { 0% { background-position: 0 0; } 100% { background-position: 20px 0; } }`,
      js: ''
    },

    // 18. Progress Bar
    {
      id: 'progress-bar',
      name: 'Progress Bar',
      icon: '📊',
      category: 'feedback',
      html: `<div class="progress-demo">
  <div class="progress">
    <div class="progress-label">
      <span>Upload Progress</span>
      <span class="progress-percent">72%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width: 72%"></div>
    </div>
  </div>
  <div class="progress">
    <div class="progress-label">
      <span>Storage Used</span>
      <span class="progress-percent">45%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill progress-fill-success" style="width: 45%"></div>
    </div>
  </div>
  <div class="progress">
    <div class="progress-label">
      <span>CPU Usage</span>
      <span class="progress-percent">89%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill progress-fill-danger" style="width: 89%"></div>
    </div>
  </div>
</div>`,
      css: `.progress-demo { padding: 24px; }
.progress { margin-bottom: 20px; }
.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 13px;
  color: #555;
  font-weight: 500;
}
.progress-percent { font-weight: 700; color: #333; }
.progress-track {
  width: 100%;
  height: 10px;
  background: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #4285f4;
  border-radius: 5px;
  transition: width 0.5s ease;
}
.progress-fill-success { background: #34a853; }
.progress-fill-danger { background: #e53935; }`,
      js: ''
    },

    // 19. 404 Page
    {
      id: '404-page',
      name: '404 Page',
      icon: '🚫',
      category: 'content',
      html: `<div class="error-page">
  <div class="error-code">404</div>
  <h2 class="error-title">Page Not Found</h2>
  <p class="error-message">Oops! The page you're looking for seems to have wandered off into the void.</p>
  <button class="btn btn-primary btn-lg">← Back to Home</button>
</div>`,
      css: `.error-page {
  text-align: center;
  padding: 60px 24px;
  background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
  border-radius: 12px;
}
.error-code {
  font-size: 96px;
  font-weight: 900;
  color: #4285f4;
  line-height: 1;
  margin-bottom: 12px;
  text-shadow: 4px 4px 0 rgba(66,133,244,0.1);
}
.error-title { font-size: 24px; color: #1a1a2e; margin: 0 0 12px; }
.error-message { font-size: 15px; color: #666; margin: 0 0 28px; max-width: 400px; margin-left: auto; margin-right: auto; line-height: 1.5; }
.btn-lg { padding: 14px 28px; font-size: 16px; border: none; border-radius: 8px; background: #4285f4; color: #fff; cursor: pointer; font-weight: 600; }
.btn-lg:hover { background: #3367d6; }`,
      js: ''
    },

    // 20. Alert / Notification
    {
      id: 'alerts',
      name: 'Alert / Notification',
      icon: '🔔',
      category: 'feedback',
      html: `<div class="alerts-demo">
  <div class="alert alert-success">
    <span class="alert-icon">✓</span>
    <div class="alert-content">
      <strong>Success!</strong> Your changes have been saved.
    </div>
  </div>
  <div class="alert alert-error">
    <span class="alert-icon">✕</span>
    <div class="alert-content">
      <strong>Error!</strong> Something went wrong. Please try again.
    </div>
  </div>
  <div class="alert alert-warning">
    <span class="alert-icon">⚠</span>
    <div class="alert-content">
      <strong>Warning!</strong> Your session will expire in 5 minutes.
    </div>
  </div>
  <div class="alert alert-info">
    <span class="alert-icon">ℹ</span>
    <div class="alert-content">
      <strong>Info:</strong> A new version is available for download.
    </div>
  </div>
</div>`,
      css: `.alerts-demo { padding: 24px; display: flex; flex-direction: column; gap: 12px; }
.alert {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 8px;
  border-left: 4px solid;
  font-size: 14px;
}
.alert-icon { font-size: 18px; flex-shrink: 0; width: 24px; text-align: center; }
.alert-content { flex: 1; }
.alert-success { background: #e8f5e9; border-color: #34a853; color: #2e7d32; }
.alert-error { background: #ffebee; border-color: #e53935; color: #c62828; }
.alert-warning { background: #fff8e1; border-color: #fb8c00; color: #e65100; }
.alert-info { background: #e3f2fd; border-color: #4285f4; color: #1565c0; }`,
      js: ''
    },

    // 21. Badge / Tag
    {
      id: 'badges',
      name: 'Badge / Tag',
      icon: '🏷️',
      category: 'content',
      html: `<div class="badges-demo">
  <div class="badge-row">
    <span class="badge badge-primary">Primary</span>
    <span class="badge badge-success">Success</span>
    <span class="badge badge-warning">Warning</span>
    <span class="badge badge-danger">Danger</span>
    <span class="badge badge-info">Info</span>
    <span class="badge badge-dark">Dark</span>
  </div>
  <div class="badge-row">
    <span class="badge badge-pill badge-primary">Pill</span>
    <span class="badge badge-pill badge-success">Active</span>
    <span class="badge badge-pill badge-warning">Pending</span>
    <span class="badge badge-pill badge-danger">3</span>
    <span class="badge badge-pill badge-info">New</span>
  </div>
  <div class="badge-row">
    <span class="tag">JavaScript</span>
    <span class="tag">CSS</span>
    <span class="tag">HTML</span>
    <span class="tag">React</span>
    <span class="tag">Node.js</span>
  </div>
</div>`,
      css: `.badges-demo { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.badge-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  color: #fff;
}
.badge-pill { border-radius: 50px; }
.badge-primary { background: #4285f4; }
.badge-success { background: #34a853; }
.badge-warning { background: #fb8c00; }
.badge-danger { background: #e53935; }
.badge-info { background: #00acc1; }
.badge-dark { background: #1a1a2e; }
.tag {
  display: inline-block;
  padding: 4px 12px;
  font-size: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 50px;
  color: #555;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
}
.tag:hover { background: #4285f4; color: #fff; border-color: #4285f4; }`,
      js: ''
    },

    // 22. Modal / Dialog
    {
      id: 'modal',
      name: 'Modal / Dialog',
      icon: '🪟',
      category: 'feedback',
      html: `<div class="modal-demo">
  <button class="btn btn-primary modal-open-btn">Open Modal</button>
  <div class="modal-overlay" id="demo-modal">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">Confirm Action</h3>
        <button class="modal-close">&times;</button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to proceed? This action cannot be undone.</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost modal-cancel-btn">Cancel</button>
        <button class="btn btn-primary modal-confirm-btn">Confirm</button>
      </div>
    </div>
  </div>
</div>`,
      css: `.modal-demo { padding: 24px; text-align: center; }
.modal-overlay {
  display: none;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(0,0,0,0.5);
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-overlay.active { display: flex; }
.modal {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 16px 48px rgba(0,0,0,0.2);
  animation: modalIn 0.2s ease-out;
}
@keyframes modalIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}
.modal-title { margin: 0; font-size: 18px; color: #1a1a2e; }
.modal-close { background: none; border: none; font-size: 24px; color: #999; cursor: pointer; padding: 0; line-height: 1; }
.modal-close:hover { color: #333; }
.modal-body { padding: 16px 24px; font-size: 14px; color: #555; line-height: 1.5; }
.modal-footer { padding: 0 24px 20px; display: flex; gap: 8px; justify-content: flex-end; }
.btn { padding: 10px 20px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; }
.btn-primary { background: #4285f4; color: #fff; }
.btn-ghost { background: transparent; color: #666; }`,
      js: `document.querySelector('.modal-open-btn').addEventListener('click', function() {
  document.getElementById('demo-modal').classList.add('active');
});
document.querySelector('.modal-close').addEventListener('click', function() {
  document.getElementById('demo-modal').classList.remove('active');
});
document.querySelector('.modal-cancel-btn').addEventListener('click', function() {
  document.getElementById('demo-modal').classList.remove('active');
});
document.querySelector('.modal-confirm-btn').addEventListener('click', function() {
  document.getElementById('demo-modal').classList.remove('active');
});
document.querySelector('.modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) this.classList.remove('active');
});`
    },

    // 23. Table
    {
      id: 'table',
      name: 'Table',
      icon: '📋',
      category: 'content',
      html: `<div class="table-demo">
  <table class="table table-striped">
    <thead>
      <tr>
        <th class="table-header">Name</th>
        <th class="table-header">Role</th>
        <th class="table-header">Status</th>
        <th class="table-header">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr class="table-row">
        <td class="table-cell">Alice Johnson</td>
        <td class="table-cell">Designer</td>
        <td class="table-cell"><span class="badge badge-success">Active</span></td>
        <td class="table-cell"><a href="#" class="table-link">Edit</a></td>
      </tr>
      <tr class="table-row">
        <td class="table-cell">Bob Smith</td>
        <td class="table-cell">Developer</td>
        <td class="table-cell"><span class="badge badge-success">Active</span></td>
        <td class="table-cell"><a href="#" class="table-link">Edit</a></td>
      </tr>
      <tr class="table-row">
        <td class="table-cell">Carol White</td>
        <td class="table-cell">Manager</td>
        <td class="table-cell"><span class="badge badge-warning">Away</span></td>
        <td class="table-cell"><a href="#" class="table-link">Edit</a></td>
      </tr>
      <tr class="table-row">
        <td class="table-cell">Dan Brown</td>
        <td class="table-cell">DevOps</td>
        <td class="table-cell"><span class="badge badge-danger">Offline</span></td>
        <td class="table-cell"><a href="#" class="table-link">Edit</a></td>
      </tr>
    </tbody>
  </table>
</div>`,
      css: `.table-demo { padding: 24px; overflow-x: auto; }
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e0e0e0;
}
.table-header {
  text-align: left;
  padding: 12px 16px;
  background: #f5f7fa;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
}
.table-cell { padding: 12px 16px; border-bottom: 1px solid #f0f0f0; color: #555; }
.table-striped .table-row:nth-child(even) { background: #fafbfc; }
.table-row:hover { background: #f0f4ff; }
.table-link { color: #4285f4; text-decoration: none; font-weight: 500; }
.table-link:hover { text-decoration: underline; }
.badge {
  display: inline-block;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 600;
  border-radius: 4px;
  color: #fff;
}
.badge-success { background: #34a853; }
.badge-warning { background: #fb8c00; }
.badge-danger { background: #e53935; }`,
      js: ''
    }
  ];

    // === PRO COMPONENTS (visual only, trigger Pro modal) ===
    {
      id: 'accordion',
      name: 'Accordion / Collapse',
      icon: '📂',
      category: 'pro',
      html: '',
      css: '',
      js: ''
    },
    {
      id: 'pricing-table',
      name: 'Pricing Table',
      icon: '💰',
      category: 'pro',
      html: '',
      css: '',
      js: ''
    },
    {
      id: 'timeline',
      name: 'Timeline',
      icon: '📅',
      category: 'pro',
      html: '',
      css: '',
      js: ''
    },
    {
      id: 'data-chart',
      name: 'Data Chart',
      icon: '📈',
      category: 'pro',
      html: '',
      css: '',
      js: ''
    }
  ];

  // Public API
  return {
    categories: categories,

    getAll: function () {
      return components.slice();
    },

    getById: function (id) {
      return components.find(function (c) { return c.id === id; }) || null;
    },

    getByCategory: function (category) {
      return components.filter(function (c) { return c.category === category; });
    }
  };
})();

// Support both module and script-tag usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ComponentLibrary;
}
