/**
 * ComponentKit — Main Application Controller (Enhanced)
 * 
 * Adds:
 * - Pro gate: Components 6+ locked for free users with blur overlay
 * - Toast notifications for pro features
 * - Pro upgrade modal
 * - Export Code / Save Project buttons (pro-gated)
 * - Toolbar integration
 */

const App = (function () {
    'use strict';

    // Constants
    const FREE_COMPONENT_LIMIT = 5; // First 5 components are free

    // State
    let userCSS = '';
    let parsedCSS = null;
    let currentComponent = null;
    let componentHTML = '';
    let componentJS = '';
    let activeTab = 'html';
    let previewDarkBg = false;
    let renderPending = false;
    let isProUser = false; // Simulated — always false for demo

    // DOM cache
    const $ = function (sel) { return document.querySelector(sel); };
    const $$ = function (sel) { return Array.from(document.querySelectorAll(sel)); };
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
        els.toast = $('#toast');
        els.toastMessage = $('#toast-message');
        els.toastAction = $('#toast-action');
        els.proModal = $('#pro-modal');
        els.proModalClose = $('#pro-modal-close');
        els.saveBtn = $('#save-project-btn');
        els.exportBtn = $('#export-code-btn');
        els.upgradeBtn = $('#upgrade-btn');
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

        // Editor input — 1 second debounce
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

        // Preview background toggle
        els.previewBgToggle.addEventListener('click', function () {
            saveCurrentTab();
            previewDarkBg = !previewDarkBg;
            els.previewBgToggle.textContent = previewDarkBg ? '◑' : '◐';
            scheduleRender();
        });

        // Reset button
        els.previewReset.addEventListener('click', function () {
            if (!currentComponent) return;
            componentHTML = currentComponent.html || '';
            componentJS = currentComponent.js || '';
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

        // Pro feature buttons
        els.saveBtn.addEventListener('click', function () {
            if (!isProUser) {
                showToast('Save Project is a Pro feature — Upgrade to save your work');
            }
        });

        els.exportBtn.addEventListener('click', function () {
            if (!isProUser) {
                showToast('Export Code is a Pro feature — Upgrade to export production code');
            }
        });

        // Upgrade button
        els.upgradeBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showProModal();
        });

        // Pro modal close
        els.proModalClose.addEventListener('click', hideProModal);
        els.proModal.addEventListener('click', function (e) {
            if (e.target === els.proModal) hideProModal();
        });

        // Toast action
        els.toastAction.addEventListener('click', function (e) {
            e.preventDefault();
            hideToast();
            showProModal();
        });

        // Escape key to close modal
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                hideProModal();
            }
        });
    }

    // =========================================================
    // TOAST
    // =========================================================
    var toastTimer = null;

    function showToast(message) {
        if (toastTimer) clearTimeout(toastTimer);
        els.toastMessage.textContent = message;
        els.toast.classList.add('toast--visible');
        toastTimer = setTimeout(function () {
            hideToast();
        }, 4000);
    }

    function hideToast() {
        els.toast.classList.remove('toast--visible');
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }
    }

    // =========================================================
    // PRO MODAL
    // =========================================================
    function showProModal() {
        els.proModal.classList.add('pro-modal-overlay--active');
    }

    function hideProModal() {
        els.proModal.classList.remove('pro-modal-overlay--active');
    }

    // =========================================================
    // PRO GATING
    // =========================================================
    function isComponentLocked(index) {
        return !isProUser && index >= FREE_COMPONENT_LIMIT;
    }

    function showProLockOverlay() {
        // Remove any existing overlay
        removeProLockOverlay();

        var overlay = document.createElement('div');
        overlay.className = 'pro-lock-overlay';
        overlay.id = 'pro-lock-active';
        overlay.innerHTML = [
            '<div class="pro-lock-overlay__icon">🔒</div>',
            '<div class="pro-lock-overlay__text">Pro Component</div>',
            '<div class="pro-lock-overlay__desc">Upgrade to Pro to unlock all 23+ components, export code, and save projects.</div>',
            '<button class="pro-lock-overlay__btn" id="pro-lock-upgrade">Upgrade to Pro</button>'
        ].join('');

        var mainArea = document.querySelector('.main-area');
        mainArea.appendChild(overlay);

        document.getElementById('pro-lock-upgrade').addEventListener('click', function () {
            showProModal();
        });
    }

    function removeProLockOverlay() {
        var existing = document.getElementById('pro-lock-active');
        if (existing) existing.remove();
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
        saveCurrentTab();
        activeTab = lang;
        updateTabUI();

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
        saveCurrentTab();
        els.cssInput.value = userCSS;

        currentComponent = null;
        componentHTML = '';
        componentJS = '';
        activeTab = 'html';
        els.codeEditor.value = '';
        els.previewFrame.srcdoc = '';
        removeProLockOverlay();
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
        var componentIndex = 0;

        categories.forEach(function (cat) {
            var items = components.filter(function (c) { return c.category === cat.id; });
            if (items.length === 0) return;
            html += '<div class="sidebar__category">';
            html += '<div class="sidebar__category-title">' + cat.icon + ' ' + cat.name + '</div>';
            items.forEach(function (comp) {
                var locked = isComponentLocked(componentIndex);
                var lockedClass = locked ? ' sidebar__item--locked' : '';
                html += '<div class="sidebar__item' + lockedClass + '" data-id="' + comp.id + '" data-index="' + componentIndex + '">';
                html += '<span class="sidebar__item-icon">' + comp.icon + '</span>';
                html += '<span>' + comp.name + '</span>';
                if (locked) {
                    html += '<span class="sidebar__pro-badge">PRO</span>';
                }
                html += '</div>';
                componentIndex++;
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

        // Find index
        var allComponents = ComponentLibrary.getAll();
        var index = allComponents.findIndex(function (c) { return c.id === id; });

        saveCurrentTab();
        currentComponent = comp;

        // Highlight in sidebar
        els.componentList.querySelectorAll('.sidebar__item').forEach(function (el) {
            el.classList.toggle('sidebar__item--active', el.dataset.id === id);
        });

        // Check if locked
        if (isComponentLocked(index)) {
            showProLockOverlay();
            componentHTML = comp.html || '';
            componentJS = comp.js || '';

            // Still show the code but with lock overlay
            var jsTab = els.editorTabs.querySelector('[data-lang="js"]');
            if (componentJS) {
                jsTab.classList.remove('pane__tab--hidden');
            } else {
                jsTab.classList.add('pane__tab--hidden');
                if (activeTab === 'js') activeTab = 'html';
            }
            updateTabUI();

            if (activeTab === 'html') els.codeEditor.value = componentHTML;
            else if (activeTab === 'css') els.codeEditor.value = userCSS;
            else if (activeTab === 'js') els.codeEditor.value = componentJS;

            scheduleRender();
            return;
        }

        // Not locked — remove any overlay
        removeProLockOverlay();

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
    // PREVIEW
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
            '<style>' + sanitize(baseCSS) + '</style>',
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

    return { init: init };
})();
