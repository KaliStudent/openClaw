/**
 * CSS Component Lab — Main Application Controller
 * Uses srcdoc for safe iframe rendering, throttled updates
 */

const App = (function () {
    'use strict';

    // State
    let userCSS = '';
    let parsedCSS = null;
    let currentComponent = null;
    let editorContent = { html: '', css: '', js: '' };
    let activeTab = 'html';
    let previewDarkBg = false;
    let renderPending = false;
    let renderRAF = null;

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
        $$('.landing__tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const target = tab.dataset.target;
                $$('.landing__tab').forEach(t => t.classList.remove('landing__tab--active'));
                tab.classList.add('landing__tab--active');
                $$('.landing__panel').forEach(p => p.classList.remove('landing__panel--active'));
                const panel = document.getElementById(target);
                if (panel) panel.classList.add('landing__panel--active');
            });
        });

        // Render button
        els.renderBtn.addEventListener('click', handleRender);

        // Back button
        els.backBtn.addEventListener('click', handleBack);

        // Editor tabs (delegated)
        els.editorTabs.addEventListener('click', function (e) {
            const tab = e.target.closest('.pane__tab');
            if (tab && !tab.classList.contains('pane__tab--hidden')) {
                // Save current
                editorContent[activeTab] = els.codeEditor.value;
                activeTab = tab.dataset.lang;
                updateTabUI();
                els.codeEditor.value = editorContent[activeTab] || '';
            }
        });

        // Editor input — wait 1 second after last keystroke before updating preview
        let editTimer = null;
        els.codeEditor.addEventListener('input', function () {
            if (editTimer) clearTimeout(editTimer);
            editTimer = setTimeout(function () {
                editorContent[activeTab] = els.codeEditor.value;
                scheduleRender();
            }, 1000);
        });

        // Tab key support
        els.codeEditor.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const s = this.selectionStart;
                const end = this.selectionEnd;
                this.value = this.value.substring(0, s) + '  ' + this.value.substring(end);
                this.selectionStart = this.selectionEnd = s + 2;
            }
        });

        // Preview toolbar
        els.previewBgToggle.addEventListener('click', function () {
            previewDarkBg = !previewDarkBg;
            els.previewBgToggle.textContent = previewDarkBg ? '◑' : '◐';
            scheduleRender();
        });

        els.previewReset.addEventListener('click', function () {
            if (!currentComponent) return;
            editorContent.html = currentComponent.html || '';
            editorContent.css = currentComponent.css || '';
            editorContent.js = currentComponent.js || '';
            els.codeEditor.value = editorContent[activeTab] || '';
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
    // RENDER (Landing → Workspace)
    // =========================================================
    async function handleRender() {
        const activePanel = $('.landing__panel--active');

        if (activePanel && activePanel.id === 'url-input') {
            const url = els.urlInput.value.trim();
            if (!url) return;
            try {
                els.renderBtn.textContent = 'Fetching...';
                els.renderBtn.disabled = true;
                const res = await fetch(url);
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

        // Reset state
        currentComponent = null;
        editorContent = { html: '', css: '', js: '' };
        activeTab = 'html';

        buildSidebar();
        els.landingView.classList.remove('view--active');
        els.workspaceView.classList.add('view--active');

        // Auto-select first
        const all = ComponentLibrary.getAll();
        if (all.length > 0) selectComponent(all[0].id);

        resetBtn();
    }

    function resetBtn() {
        els.renderBtn.disabled = false;
        els.renderBtn.innerHTML = '<span class="landing__render-icon">▶</span> Build Components';
    }

    function handleBack() {
        currentComponent = null;
        editorContent = { html: '', css: '', js: '' };
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
        const components = ComponentLibrary.getAll();
        const categories = ComponentLibrary.categories;
        let html = '';

        categories.forEach(function (cat) {
            const items = components.filter(function (c) { return c.category === cat.id; });
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
            const item = e.target.closest('.sidebar__item');
            if (item) selectComponent(item.dataset.id);
        };
    }

    // =========================================================
    // COMPONENT SELECTION
    // =========================================================
    function selectComponent(id) {
        const comp = ComponentLibrary.getById(id);
        if (!comp) return;
        currentComponent = comp;

        // Highlight
        els.componentList.querySelectorAll('.sidebar__item').forEach(function (el) {
            el.classList.toggle('sidebar__item--active', el.dataset.id === id);
        });

        // Load content
        editorContent.html = comp.html || '';
        editorContent.css = comp.css || '';
        editorContent.js = comp.js || '';

        // JS tab visibility
        const jsTab = els.editorTabs.querySelector('[data-lang="js"]');
        if (editorContent.js) {
            jsTab.classList.remove('pane__tab--hidden');
        } else {
            jsTab.classList.add('pane__tab--hidden');
            if (activeTab === 'js') activeTab = 'html';
        }

        updateTabUI();
        els.codeEditor.value = editorContent[activeTab] || '';
        scheduleRender();
    }

    function updateTabUI() {
        els.editorTabs.querySelectorAll('.pane__tab').forEach(function (tab) {
            tab.classList.toggle('pane__tab--active', tab.dataset.lang === activeTab);
        });
    }

    // =========================================================
    // PREVIEW — srcdoc approach (no document.write)
    // =========================================================
    function scheduleRender() {
        if (renderPending) return;
        renderPending = true;
        renderRAF = requestAnimationFrame(function () {
            renderPending = false;
            renderPreview();
        });
    }

    function renderPreview() {
        const bg = previewDarkBg ? '#1a1a2e' : '#ffffff';
        const fg = previewDarkBg ? '#e4e4e7' : '#1a1a1a';

        const html = [
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
            // Component default CSS (base styles)
            '<style>' + sanitizeCSS(editorContent.css) + '</style>',
            // User CSS on TOP — overrides component defaults
            '<style>' + sanitizeCSS(userCSS) + '</style>',
            '</head><body>',
            '<div class="preview-wrapper">',
            editorContent.html,
            '</div>',
            editorContent.js ? '<script>' + editorContent.js + '<\/script>' : '',
            '</body></html>'
        ].join('\n');

        // srcdoc is safer than document.write — no reflow loops
        els.previewFrame.srcdoc = html;
    }

    function sanitizeCSS(css) {
        if (!css) return '';
        // Escape closing style/script tags that could break out
        return css.replace(/<\/(style|script)/gi, '<\\/$1');
    }

    // =========================================================
    // RESIZE
    // =========================================================
    function initResize() {
        let dragging = false;
        let startX, startW;

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
            const dx = e.clientX - startX;
            const w = startW + dx;
            const parent = els.editorPane.parentElement;
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
