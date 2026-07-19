/**
 * CSS Component Lab — Main Application Controller
 * 
 * Flow:
 * 1. User pastes CSS on landing page
 * 2. Workspace loads with components in sidebar
 * 3. Selecting a component shows:
 *    - HTML tab: the component's HTML (editable)
 *    - CSS tab: the USER's CSS (editable — this is what they're here to tweak)
 *    - JS tab: component JS if needed (editable)
 * 4. Preview shows: component HTML + component base CSS + user CSS on top
 * 5. Edits in CSS tab update the user CSS and re-render after 1s pause
 */

const App = (function () {
    'use strict';

    // State
    let userCSS = '';           // The CSS the user pasted (editable via CSS tab)
    let parsedCSS = null;
    let currentComponent = null;
    let componentHTML = '';     // Current component's HTML (editable via HTML tab)
    let componentJS = '';      // Current component's JS (editable via JS tab)
    let activeTab = 'html';
    let previewDarkBg = false;
    let renderPending = false;

    // DOM cache
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => [...document.querySelectorAll(sel)];
    const els = {};

    function cacheElements() {
        els.landingView = $('#landing-view');
        els.workspaceView = $('#workspace-view');
        els.cssInput = $('#css-paste');
        els.urlInput = $('#css-url');
        els.renderBtn = $('#render-btn');
        els.backBtn = $('#back-btn');
        els.componentList = $('#component-list');
        els.codeEditor = $('#code-editor');
        els.editorTabs = $('#editor-tabs');
        els.previewFrame = $('#preview-frame');
        els.previewBgToggle = $('#preview-bg-toggle');
        els.previewReset = $('#preview-reset');
        els.resizeHandle = $('#resize-handle');
        els.editorPane = $('#editor-pane');
        els.previewPane = $('#preview-pane');
    }

    // =========================================================
    // INIT
    // =========================================================
    function init() {
        cacheElements();

        // Landing tabs
        $$('.landing__tab').forEach(function (tab) {
            tab.addEventListener('click', function () {
                var target = tab.dataset.target;
                $$('.landing__tab').forEach(function (t) { t.classList.remove('landing__tab--active'); });
                tab.classList.add('landing__tab--active');
                $$('.landing__panel').forEach(function (p) { p.classList.remove('landing__panel--active'); });
                var panel = document.getElementById(target);
                if (panel) panel.classList.add('landing__panel--active');
            });
        });

        // Render button
        els.renderBtn.addEventListener('click', handleRender);

        // Back button
        els.backBtn.addEventListener('click', handleBack);

        // Editor tabs (delegated)
        els.editorTabs.addEventListener('click', function (e) {
            var tab = e.target.closest('.pane__tab');
            if (tab && !tab.classList.contains('pane__tab--hidden')) {
                switchTab(tab.dataset.lang);
            }
        });

        // Editor input — 1 second debounce after last keystroke
        var editTimer = null;
        els.codeEditor.addEventListener('input', function () {
            if (editTimer) clearTimeout(editTimer);
            editTimer = setTimeout(function () {
                saveCurrentTab();
                scheduleRender();
            }, 1000);
        });

        // Tab key in editor
        els.codeEditor.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                var s = this.selectionStart;
                var end = this.selectionEnd;
                this.value = this.value.substring(0, s) + '  ' + this.value.substring(end);
                this.selectionStart = this.selectionEnd = s + 2;
            }
        });

        // Preview background toggle — does NOT reset CSS
        els.previewBgToggle.addEventListener('click', function () {
            // Save any pending edits first
            saveCurrentTab();
            previewDarkBg = !previewDarkBg;
            els.previewBgToggle.textContent = previewDarkBg ? '◑' : '◐';
            scheduleRender();
        });

        // Reset button — resets component HTML/JS to defaults, keeps user CSS
        els.previewReset.addEventListener('click', function () {
            if (!currentComponent) return;
            componentHTML = currentComponent.html || '';
            componentJS = currentComponent.js || '';
            // Don't reset userCSS — that's the user's work
            if (activeTab === 'html') els.codeEditor.value = componentHTML;
            if (activeTab === 'js') els.codeEditor.value = componentJS;
            scheduleRender();
        });

        // Resize
        initResize();

        // Ctrl+Enter shortcut
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (els.landingView.classList.contains('view--active')) {
                    handleRender();
                }
            }
        });
    }

    // =========================================================
    // TAB MANAGEMENT
    // =========================================================
    function saveCurrentTab() {
        var val = els.codeEditor.value;
        if (activeTab === 'html') {
            componentHTML = val;
        } else if (activeTab === 'css') {
            userCSS = val;
        } else if (activeTab === 'js') {
            componentJS = val;
        }
    }

    function switchTab(lang) {
        // Save what's currently in the editor
        saveCurrentTab();

        activeTab = lang;
        updateTabUI();

        // Load the new tab's content
        if (lang === 'html') {
            els.codeEditor.value = componentHTML;
        } else if (lang === 'css') {
            els.codeEditor.value = userCSS;
        } else if (lang === 'js') {
            els.codeEditor.value = componentJS;
        }
    }

    function updateTabUI() {
        els.editorTabs.querySelectorAll('.pane__tab').forEach(function (tab) {
            tab.classList.toggle('pane__tab--active', tab.dataset.lang === activeTab);
        });
    }

    // =========================================================
    // RENDER (Landing → Workspace)
    // =========================================================
    async function handleRender() {
        var activePanel = $('.landing__panel--active');

        if (activePanel && activePanel.id === 'url-input') {
            var url = els.urlInput.value.trim();
            if (!url) return;
            try {
                els.renderBtn.textContent = 'Fetching...';
                els.renderBtn.disabled = true;
                var res = await fetch(url);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                userCSS = await res.text();
            } catch (err) {
                alert('Failed to fetch CSS: ' + err.message);
                resetBtn();
                return;
            }
        } else {
            userCSS = els.cssInput.value.trim();
        }

        try {
            parsedCSS = CSSParser.parse(userCSS);
        } catch (e) {
            parsedCSS = null;
        }

        // Reset component state
        currentComponent = null;
        componentHTML = '';
        componentJS = '';
        activeTab = 'html';

        buildSidebar();
        els.landingView.classList.remove('view--active');
        els.workspaceView.classList.add('view--active');

        // Auto-select first component
        var all = ComponentLibrary.getAll();
        if (all.length > 0) selectComponent(all[0].id);

        resetBtn();
    }

    function resetBtn() {
        els.renderBtn.disabled = false;
        els.renderBtn.innerHTML = '<span class="landing__render-icon">▶</span> Build Components';
    }

    function handleBack() {
        // Save current CSS edits back to the textarea so they persist
        saveCurrentTab();
        els.cssInput.value = userCSS;

        currentComponent = null;
        componentHTML = '';
        componentJS = '';
        activeTab = 'html';
        els.codeEditor.value = '';
        els.previewFrame.srcdoc = '';
        els.workspaceView.classList.remove('view--active');
        els.landingView.classList.add('view--active');
    }

    // =========================================================
    // SIDEBAR
    // =========================================================
    function buildSidebar() {
        var components = ComponentLibrary.getAll();
        var categories = ComponentLibrary.categories;
        var html = '';

        categories.forEach(function (cat) {
            var items = components.filter(function (c) { return c.category === cat.id; });
            if (items.length === 0) return;
            html += '<div class="sidebar__category">';
            html += '<div class="sidebar__category-title">' + cat.icon + ' ' + cat.name + '</div>';
            items.forEach(function (comp) {
                html += '<div class="sidebar__item" data-id="' + comp.id + '">';
                html += '<span class="sidebar__item-icon">' + comp.icon + '</span>';
                html += '<span>' + comp.name + '</span></div>';
            });
            html += '</div>';
        });

        els.componentList.innerHTML = html;
        els.componentList.onclick = function (e) {
            var item = e.target.closest('.sidebar__item');
            if (item) selectComponent(item.dataset.id);
        };
    }

    // =========================================================
    // COMPONENT SELECTION
    // =========================================================
    function selectComponent(id) {
        var comp = ComponentLibrary.getById(id);
        if (!comp) return;

        // Save any pending edits before switching
        saveCurrentTab();

        currentComponent = comp;

        // Highlight in sidebar
        els.componentList.querySelectorAll('.sidebar__item').forEach(function (el) {
            el.classList.toggle('sidebar__item--active', el.dataset.id === id);
        });

        // Load component HTML and JS (user CSS stays as-is)
        componentHTML = comp.html || '';
        componentJS = comp.js || '';

        // JS tab visibility
        var jsTab = els.editorTabs.querySelector('[data-lang="js"]');
        if (componentJS) {
            jsTab.classList.remove('pane__tab--hidden');
        } else {
            jsTab.classList.add('pane__tab--hidden');
            if (activeTab === 'js') activeTab = 'html';
        }

        updateTabUI();

        // Load current tab content into editor
        if (activeTab === 'html') {
            els.codeEditor.value = componentHTML;
        } else if (activeTab === 'css') {
            els.codeEditor.value = userCSS;
        } else if (activeTab === 'js') {
            els.codeEditor.value = componentJS;
        }

        scheduleRender();
    }

    // =========================================================
    // PREVIEW — srcdoc (safe, no document.write)
    // =========================================================
    function scheduleRender() {
        if (renderPending) return;
        renderPending = true;
        requestAnimationFrame(function () {
            renderPending = false;
            renderPreview();
        });
    }

    function renderPreview() {
        var bg = previewDarkBg ? '#1a1a2e' : '#ffffff';
        var fg = previewDarkBg ? '#e4e4e7' : '#1a1a1a';

        // Get the component's built-in base CSS (always applied, not shown in editor)
        var baseCSS = currentComponent ? (currentComponent.css || '') : '';

        var html = [
            '<!DOCTYPE html>',
            '<html><head><meta charset="UTF-8">',
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
            '<style>',
            '*, *::before, *::after { box-sizing: border-box; }',
            'body { margin:0; padding:2rem; min-height:100vh;',
            '  background:' + bg + '; color:' + fg + ';',
            '  font-family: system-ui, -apple-system, sans-serif;',
            '  font-size:14px; line-height:1.5; }',
            '.preview-wrapper { width:100%; max-width:800px; margin:0 auto; }',
            '</style>',
            // Component base CSS (built-in defaults — gives components shape)
            '<style>' + sanitize(baseCSS) + '</style>',
            // User CSS on top — this is what they edit and what overrides
            '<style>' + sanitize(userCSS) + '</style>',
            '</head><body>',
            '<div class="preview-wrapper">',
            componentHTML,
            '</div>',
            componentJS ? '<script>' + componentJS + '<\/script>' : '',
            '</body></html>'
        ].join('\n');

        els.previewFrame.srcdoc = html;
    }

    function sanitize(css) {
        if (!css) return '';
        return css.replace(/<\/(style|script)/gi, '<\\/$1');
    }

    // =========================================================
    // RESIZE
    // =========================================================
    function initResize() {
        var dragging = false;
        var startX, startW;

        els.resizeHandle.addEventListener('mousedown', function (e) {
            dragging = true;
            startX = e.clientX;
            startW = els.editorPane.offsetWidth;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            els.previewFrame.style.pointerEvents = 'none';
            e.preventDefault();
        });

        document.addEventListener('mousemove', function (e) {
            if (!dragging) return;
            var dx = e.clientX - startX;
            var w = startW + dx;
            var parent = els.editorPane.parentElement;
            if (w > 200 && w < parent.offsetWidth - 200) {
                els.editorPane.style.flex = 'none';
                els.editorPane.style.width = w + 'px';
                els.previewPane.style.flex = '1';
            }
        });

        document.addEventListener('mouseup', function () {
            if (!dragging) return;
            dragging = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            els.previewFrame.style.pointerEvents = '';
        });
    }

    // Boot
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { init };
})();
