/**
 * CSS Component Lab — Main Application Controller
 * Orchestrates: landing view, workspace view, sidebar, editor, preview, resize
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
    let isInitialized = false;

    // DOM refs
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
    // INITIALIZATION
    // =========================================================
    function init() {
        if (isInitialized) return;
        isInitialized = true;

        cacheElements();
        bindEvents();
    }

    function bindEvents() {
        // Landing tab switching
        $$('.landing__tab').forEach(tab => {
            tab.addEventListener('click', () => switchLandingTab(tab));
        });

        // Render button
        els.renderBtn.addEventListener('click', handleRender);

        // Back to landing
        els.backBtn.addEventListener('click', handleBack);

        // Editor tabs (delegated)
        els.editorTabs.addEventListener('click', (e) => {
            const tab = e.target.closest('.pane__tab');
            if (tab && !tab.classList.contains('pane__tab--hidden')) {
                switchEditorTab(tab.dataset.lang);
            }
        });

        // Code editor live update
        let editorTimer = null;
        els.codeEditor.addEventListener('input', () => {
            clearTimeout(editorTimer);
            editorTimer = setTimeout(handleEditorChange, 250);
        });

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

        // Keyboard shortcut: Ctrl+Enter to render
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (els.landingView.classList.contains('view--active')) {
                    handleRender();
                }
            }
        });
    }

    // =========================================================
    // LANDING VIEW
    // =========================================================
    function switchLandingTab(tab) {
        const target = tab.dataset.target;
        $$('.landing__tab').forEach(t => t.classList.remove('landing__tab--active'));
        tab.classList.add('landing__tab--active');
        $$('.landing__panel').forEach(p => p.classList.remove('landing__panel--active'));
        const panel = document.getElementById(target);
        if (panel) panel.classList.add('landing__panel--active');
    }

    async function handleRender() {
        // Determine which input mode is active
        const activePanel = $('.landing__panel--active');

        if (activePanel && activePanel.id === 'url-input') {
            const url = els.urlInput.value.trim();
            if (!url) {
                els.urlInput.focus();
                return;
            }
            try {
                els.renderBtn.textContent = 'Fetching...';
                els.renderBtn.disabled = true;
                const res = await fetch(url);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                userCSS = await res.text();
            } catch (err) {
                alert('Failed to fetch CSS: ' + err.message);
                resetRenderBtn();
                return;
            }
        } else {
            userCSS = els.cssInput.value.trim();
        }

        // Allow empty CSS — components will show with their own defaults
        if (!userCSS) {
            userCSS = '';
        }

        // Parse
        try {
            parsedCSS = CSSParser.parse(userCSS);
        } catch (e) {
            parsedCSS = { variables: {}, rules: [], selectors: {}, mediaQueries: [], keyframes: [], raw: userCSS };
        }

        // Reset state for fresh workspace
        currentComponent = null;
        editorContent = { html: '', css: '', js: '' };
        activeTab = 'html';

        // Build and show
        buildComponentList();
        showWorkspace();

        // Select first component
        const allComponents = ComponentLibrary.getAll();
        if (allComponents.length > 0) {
            selectComponent(allComponents[0].id);
        }

        resetRenderBtn();
    }

    function resetRenderBtn() {
        els.renderBtn.disabled = false;
        els.renderBtn.innerHTML = '<span class="landing__render-icon">▶</span> Build Components';
    }

    // =========================================================
    // VIEW SWITCHING
    // =========================================================
    function showWorkspace() {
        els.landingView.classList.remove('view--active');
        els.workspaceView.classList.add('view--active');
    }

    function showLanding() {
        els.workspaceView.classList.remove('view--active');
        els.landingView.classList.add('view--active');
    }

    function handleBack() {
        // Reset workspace state
        currentComponent = null;
        editorContent = { html: '', css: '', js: '' };
        activeTab = 'html';
        els.codeEditor.value = '';

        // Clear preview
        try {
            const doc = els.previewFrame.contentDocument || els.previewFrame.contentWindow.document;
            doc.open();
            doc.write('');
            doc.close();
        } catch (e) {}

        showLanding();
    }

    // =========================================================
    // SIDEBAR / COMPONENT LIST
    // =========================================================
    function buildComponentList() {
        const components = ComponentLibrary.getAll();
        const categories = ComponentLibrary.categories;

        let html = '';
        categories.forEach(cat => {
            const catComponents = components.filter(c => c.category === cat.id);
            if (catComponents.length === 0) return;

            html += '<div class="sidebar__category">';
            html += '<div class="sidebar__category-title">' + cat.icon + ' ' + cat.name + '</div>';

            catComponents.forEach(comp => {
                html += '<div class="sidebar__item" data-id="' + comp.id + '">';
                html += '<span class="sidebar__item-icon">' + comp.icon + '</span>';
                html += '<span>' + comp.name + '</span>';
                html += '</div>';
            });

            html += '</div>';
        });

        els.componentList.innerHTML = html;

        // Bind clicks (delegated for safety)
        els.componentList.onclick = function (e) {
            const item = e.target.closest('.sidebar__item');
            if (item && item.dataset.id) {
                selectComponent(item.dataset.id);
            }
        };
    }

    function selectComponent(id) {
        const comp = ComponentLibrary.getById(id);
        if (!comp) return;

        currentComponent = comp;

        // Update sidebar active state
        els.componentList.querySelectorAll('.sidebar__item').forEach(item => {
            item.classList.toggle('sidebar__item--active', item.dataset.id === id);
        });

        // Set editor content from component template
        editorContent.html = comp.html || '';
        editorContent.css = comp.css || '';
        editorContent.js = comp.js || '';

        // Show/hide JS tab
        const jsTab = els.editorTabs.querySelector('[data-lang="js"]');
        if (editorContent.js) {
            jsTab.classList.remove('pane__tab--hidden');
        } else {
            jsTab.classList.add('pane__tab--hidden');
            if (activeTab === 'js') {
                activeTab = 'html';
            }
        }

        // Update tab UI and load content
        updateEditorTabUI();
        els.codeEditor.value = editorContent[activeTab] || '';

        // Render preview
        renderPreview();
    }

    // =========================================================
    // EDITOR
    // =========================================================
    function updateEditorTabUI() {
        els.editorTabs.querySelectorAll('.pane__tab').forEach(tab => {
            tab.classList.toggle('pane__tab--active', tab.dataset.lang === activeTab);
        });
    }

    function switchEditorTab(lang) {
        // Save current editor content before switching
        if (activeTab && els.codeEditor) {
            editorContent[activeTab] = els.codeEditor.value;
        }

        activeTab = lang;
        updateEditorTabUI();

        // Load the new tab's content
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
        els.codeEditor.value = editorContent[activeTab] || '';
        renderPreview();
    }

    // =========================================================
    // PREVIEW RENDERING
    // =========================================================
    function renderPreview() {
        const iframe = els.previewFrame;
        if (!iframe) return;

        let doc;
        try {
            doc = iframe.contentDocument || iframe.contentWindow.document;
        } catch (e) {
            return;
        }

        const bgColor = previewDarkBg ? '#1a1a2e' : '#ffffff';
        const textColor = previewDarkBg ? '#e4e4e7' : '#1a1a1a';

        // Build the preview HTML
        // Order matters: component default CSS first, then USER CSS on top so it overrides
        const previewHTML = '<!DOCTYPE html>\n' +
            '<html>\n<head>\n' +
            '<meta charset="UTF-8">\n' +
            '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
            '<style>\n' +
            '/* === Preview Reset === */\n' +
            '*, *::before, *::after { box-sizing: border-box; }\n' +
            'body {\n' +
            '  margin: 0;\n' +
            '  padding: 2rem;\n' +
            '  min-height: 100vh;\n' +
            '  background: ' + bgColor + ';\n' +
            '  color: ' + textColor + ';\n' +
            '  font-family: system-ui, -apple-system, sans-serif;\n' +
            '  font-size: 14px;\n' +
            '  line-height: 1.5;\n' +
            '}\n' +
            '.preview-wrapper {\n' +
            '  width: 100%;\n' +
            '  max-width: 800px;\n' +
            '  margin: 0 auto;\n' +
            '}\n' +
            '</style>\n' +
            '<style>\n/* === Component Default CSS === */\n' +
            escapeStyle(editorContent.css) + '\n</style>\n' +
            '<style>\n/* === Your CSS (applied on top) === */\n' +
            escapeStyle(userCSS) + '\n</style>\n' +
            '</head>\n<body>\n' +
            '<div class="preview-wrapper">\n' +
            editorContent.html + '\n' +
            '</div>\n' +
            (editorContent.js ? '<script>\n' + editorContent.js + '\n<\/script>\n' : '') +
            '</body>\n</html>';

        doc.open();
        doc.write(previewHTML);
        doc.close();
    }

    function escapeStyle(css) {
        // Prevent </style> injection from CSS content
        if (!css) return '';
        return css.replace(/<\/style>/gi, '<\\/style>');
    }

    function togglePreviewBg() {
        previewDarkBg = !previewDarkBg;
        els.previewBgToggle.textContent = previewDarkBg ? '◑' : '◐';
        renderPreview();
    }

    // =========================================================
    // RESIZE HANDLE
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
            els.previewFrame.style.pointerEvents = 'none';
            e.preventDefault();
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
    // BOOT
    // =========================================================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { init, renderPreview };
})();
