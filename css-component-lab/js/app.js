/**
 * CSS Component Lab — Main Application Controller
 * Orchestrates: landing view, workspace view, sidebar, editor, preview, resize
 */

const App = (function () {
    // State
    let userCSS = '';
    let parsedCSS = null;
    let currentComponent = null;
    let editorContent = { html: '', css: '', js: '' };
    let activeTab = 'html';
    let previewDarkBg = false;

    // DOM refs
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

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
        els.landingTabs = $$('.landing__tab');
        els.landingPanels = $$('.landing__panel');
    }

    // =========================================================
    // INITIALIZATION
    // =========================================================
    function init() {
        cacheElements();
        bindEvents();
    }

    function bindEvents() {
        // Landing tab switching
        els.landingTabs.forEach(tab => {
            tab.addEventListener('click', () => switchLandingTab(tab));
        });

        // Render button
        els.renderBtn.addEventListener('click', handleRender);

        // Back to landing
        els.backBtn.addEventListener('click', showLanding);

        // Editor tabs
        els.editorTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.pane__tab');
            if (tab) switchEditorTab(tab.dataset.lang);
        });

        // Code editor live update
        els.codeEditor.addEventListener('input', debounce(handleEditorChange, 300));

        // Handle Tab key in editor
        els.codeEditor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = els.codeEditor.selectionStart;
                const end = els.codeEditor.selectionEnd;
                const val = els.codeEditor.value;
                els.codeEditor.value = val.substring(0, start) + '  ' + val.substring(end);
                els.codeEditor.selectionStart = els.codeEditor.selectionEnd = start + 2;
                handleEditorChange();
            }
        });

        // Preview controls
        els.previewBgToggle.addEventListener('click', togglePreviewBg);
        els.previewReset.addEventListener('click', resetComponent);

        // Resize handle
        initResize();

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl+Enter to render from landing
            if (e.ctrlKey && e.key === 'Enter' && els.landingView.classList.contains('view--active')) {
                handleRender();
            }
        });
    }

    // =========================================================
    // LANDING VIEW
    // =========================================================
    function switchLandingTab(tab) {
        const target = tab.dataset.target;
        els.landingTabs.forEach(t => t.classList.remove('landing__tab--active'));
        tab.classList.add('landing__tab--active');
        els.landingPanels.forEach(p => p.classList.remove('landing__panel--active'));
        document.getElementById(target).classList.add('landing__panel--active');
    }

    async function handleRender() {
        // Get CSS from active tab
        const activePanel = $('.landing__panel--active');
        if (activePanel.id === 'css-input') {
            userCSS = els.cssInput.value.trim();
        } else {
            const url = els.urlInput.value.trim();
            if (!url) return;
            try {
                els.renderBtn.textContent = 'Fetching...';
                const res = await fetch(url);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                userCSS = await res.text();
            } catch (err) {
                alert(`Failed to fetch CSS: ${err.message}`);
                els.renderBtn.innerHTML = '<span class="landing__render-icon">▶</span> Build Components';
                return;
            }
        }

        if (!userCSS) {
            // Use a minimal default so the user can still see components
            userCSS = `/* No CSS provided — showing components with defaults */`;
        }

        // Parse CSS
        parsedCSS = CSSParser.parse(userCSS);

        // Build workspace
        buildComponentList();
        showWorkspace();

        // Select first component
        const allComponents = ComponentLibrary.getAll();
        if (allComponents.length > 0) {
            selectComponent(allComponents[0].id);
        }
    }

    // =========================================================
    // WORKSPACE VIEW
    // =========================================================
    function showWorkspace() {
        els.landingView.classList.remove('view--active');
        els.workspaceView.classList.add('view--active');
    }

    function showLanding() {
        els.workspaceView.classList.remove('view--active');
        els.landingView.classList.add('view--active');
    }

    function buildComponentList() {
        const components = ComponentLibrary.getAll();
        const categories = ComponentLibrary.categories;

        let html = '';
        categories.forEach(cat => {
            const catComponents = components.filter(c => c.category === cat.id);
            if (catComponents.length === 0) return;

            html += `<div class="sidebar__category">
                <div class="sidebar__category-title">${cat.icon} ${cat.name}</div>`;

            catComponents.forEach(comp => {
                html += `<div class="sidebar__item" data-id="${comp.id}">
                    <span class="sidebar__item-icon">${comp.icon}</span>
                    <span>${comp.name}</span>
                </div>`;
            });

            html += '</div>';
        });

        els.componentList.innerHTML = html;

        // Bind clicks
        els.componentList.querySelectorAll('.sidebar__item').forEach(item => {
            item.addEventListener('click', () => selectComponent(item.dataset.id));
        });
    }

    function selectComponent(id) {
        const comp = ComponentLibrary.getById(id);
        if (!comp) return;

        currentComponent = comp;

        // Update sidebar active state
        els.componentList.querySelectorAll('.sidebar__item').forEach(item => {
            item.classList.toggle('sidebar__item--active', item.dataset.id === id);
        });

        // Set editor content
        editorContent.html = comp.html || '';
        editorContent.css = comp.css || '';
        editorContent.js = comp.js || '';

        // Show/hide JS tab
        const jsTab = els.editorTabs.querySelector('[data-lang="js"]');
        if (editorContent.js) {
            jsTab.classList.remove('pane__tab--hidden');
        } else {
            jsTab.classList.add('pane__tab--hidden');
            if (activeTab === 'js') switchEditorTab('html');
        }

        // Load current tab
        switchEditorTab(activeTab);

        // Render preview
        renderPreview();
    }

    // =========================================================
    // EDITOR
    // =========================================================
    function switchEditorTab(lang) {
        // Save current content
        editorContent[activeTab] = els.codeEditor.value;

        activeTab = lang;

        // Update tab UI
        els.editorTabs.querySelectorAll('.pane__tab').forEach(tab => {
            tab.classList.toggle('pane__tab--active', tab.dataset.lang === lang);
        });

        // Load content
        els.codeEditor.value = editorContent[lang] || '';
    }

    function handleEditorChange() {
        editorContent[activeTab] = els.codeEditor.value;
        renderPreview();
    }

    function resetComponent() {
        if (!currentComponent) return;
        editorContent.html = currentComponent.html || '';
        editorContent.css = currentComponent.css || '';
        editorContent.js = currentComponent.js || '';
        els.codeEditor.value = editorContent[activeTab];
        renderPreview();
    }

    // =========================================================
    // PREVIEW
    // =========================================================
    function renderPreview() {
        const iframe = els.previewFrame;
        const doc = iframe.contentDocument || iframe.contentWindow.document;

        const bgColor = previewDarkBg ? '#1a1a2e' : '#ffffff';

        const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
/* === USER CSS === */
${userCSS}

/* === COMPONENT CSS === */
${editorContent.css}

/* === Preview Shell === */
body {
    margin: 0;
    padding: 2rem;
    min-height: 100vh;
    background: ${bgColor};
    font-family: system-ui, -apple-system, sans-serif;
    display: flex;
    align-items: flex-start;
    justify-content: center;
}
.preview-wrapper {
    width: 100%;
    max-width: 800px;
}
</style>
</head>
<body>
<div class="preview-wrapper">
${editorContent.html}
</div>
${editorContent.js ? `<script>${editorContent.js}<\/script>` : ''}
</body>
</html>`;

        doc.open();
        doc.write(html);
        doc.close();
    }

    function togglePreviewBg() {
        previewDarkBg = !previewDarkBg;
        els.previewBgToggle.textContent = previewDarkBg ? '◑' : '◐';
        renderPreview();
    }

    // =========================================================
    // RESIZE
    // =========================================================
    function initResize() {
        let isResizing = false;
        let startX = 0;
        let startEditorWidth = 0;

        els.resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startEditorWidth = els.editorPane.offsetWidth;
            els.resizeHandle.classList.add('resize-handle--active');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            // Prevent iframe from capturing mouse
            els.previewFrame.style.pointerEvents = 'none';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            const dx = e.clientX - startX;
            const newWidth = startEditorWidth + dx;
            const mainArea = els.editorPane.parentElement;
            const minWidth = 250;
            const maxWidth = mainArea.offsetWidth - 250;

            if (newWidth >= minWidth && newWidth <= maxWidth) {
                els.editorPane.style.flex = 'none';
                els.editorPane.style.width = newWidth + 'px';
                els.previewPane.style.flex = '1';
            }
        });

        document.addEventListener('mouseup', () => {
            if (!isResizing) return;
            isResizing = false;
            els.resizeHandle.classList.remove('resize-handle--active');
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            els.previewFrame.style.pointerEvents = '';
        });
    }

    // =========================================================
    // UTILS
    // =========================================================
    function debounce(fn, ms) {
        let timer;
        return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), ms);
        };
    }

    // =========================================================
    // BOOT
    // =========================================================
    document.addEventListener('DOMContentLoaded', init);

    return { init };
})();
