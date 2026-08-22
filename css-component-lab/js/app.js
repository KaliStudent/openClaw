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
        els.urlLoading = $('#url-loading');
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
        els.supportModal = $('#support-modal');
        els.proModal = $('#pro-modal');
        els.toast = $('#toast');
    }

    // =========================================================
    // INIT
    // =========================================================
    function init() {
        cacheElements();

        // Landing tabs
        var tabsSlider = document.getElementById('tabs-slider');
        var landingTabs = $$('.landing__tab');
        
        function updateSlider(activeTab) {
            if (!tabsSlider || !activeTab) return;
            var tabsContainer = activeTab.parentElement;
            var containerRect = tabsContainer.getBoundingClientRect();
            var tabRect = activeTab.getBoundingClientRect();
            var offsetX = tabRect.left - containerRect.left;
            tabsSlider.style.width = tabRect.width + 'px';
            tabsSlider.style.transform = 'translateX(' + (offsetX - 4) + 'px)';
        }
        
        // Initialize slider position
        setTimeout(function() { updateSlider(document.querySelector('.landing__tab--active')); }, 0);
        
        landingTabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                var target = tab.dataset.target;
                landingTabs.forEach(function (t) { t.classList.remove('landing__tab--active'); });
                tab.classList.add('landing__tab--active');
                updateSlider(tab);
                $$('.landing__panel').forEach(function (p) { p.classList.remove('landing__panel--active'); });
                var panel = document.getElementById(target);
                if (panel) {
                    setTimeout(function() { panel.classList.add('landing__panel--active'); }, 50);
                }
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

        // Export buttons
        $('#copy-html-btn').addEventListener('click', handleCopyHTML);
        $('#copy-css-btn').addEventListener('click', handleCopyCSS);
        $('#open-codepen-btn').addEventListener('click', handleOpenCodePen);

        // Support modal triggers
        $('#footer-support-link').addEventListener('click', function(e) { e.preventDefault(); openSupportModal(); });
        $('#sidebar-support-btn').addEventListener('click', openSupportModal);
        $('#support-modal-close').addEventListener('click', closeSupportModal);
        els.supportModal.addEventListener('click', function(e) { if (e.target === this) closeSupportModal(); });

        // Pro modal
        $('#pro-modal-close').addEventListener('click', closeProModal);
        els.proModal.addEventListener('click', function(e) { if (e.target === this) closeProModal(); });

        // Resize
        initResize();

        // Ctrl+Enter shortcut
        document.addEventListener('keydown', function (e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                if (els.landingView.classList.contains('view--active')) {
                    handleRender();
                }
            }
            // Escape closes modals
            if (e.key === 'Escape') {
                closeSupportModal();
                closeProModal();
            }
        });
    }

    // =========================================================
    // TOAST
    // =========================================================
    function showToast(msg) {
        els.toast.textContent = msg;
        els.toast.classList.add('toast--visible');
        setTimeout(function() {
            els.toast.classList.remove('toast--visible');
        }, 2000);
    }

    // =========================================================
    // MODALS
    // =========================================================
    function openSupportModal() { els.supportModal.classList.add('active'); }
    function closeSupportModal() { els.supportModal.classList.remove('active'); }
    function openProModal() { els.proModal.classList.add('active'); }
    function closeProModal() { els.proModal.classList.remove('active'); }

    // =========================================================
    // EXPORT FUNCTIONALITY
    // =========================================================
    function handleCopyHTML() {
        if (!componentHTML) return;
        copyToClipboard(componentHTML);
        showToast('✓ HTML copied to clipboard');
    }

    function handleCopyCSS() {
        var css = userCSS || '';
        if (currentComponent && currentComponent.css) {
            css = currentComponent.css + '\n\n/* === User CSS === */\n' + userCSS;
        }
        copyToClipboard(css);
        showToast('✓ CSS copied to clipboard');
    }

    function handleOpenCodePen() {
        if (!componentHTML) return;
        var baseCSS = currentComponent ? (currentComponent.css || '') : '';
        var fullCSS = baseCSS + '\n\n' + userCSS;
        
        var data = {
            title: 'CSS Component Lab — ' + (currentComponent ? currentComponent.name : 'Export'),
            html: componentHTML,
            css: fullCSS,
            js: componentJS || '',
            editors: '110'
        };

        var json = JSON.stringify(data).replace(/"/g, '&quot;').replace(/'/g, '&apos;');
        
        // Create a form and POST to CodePen
        var form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://codepen.io/pen/define';
        form.target = '_blank';
        
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = 'data';
        input.value = JSON.stringify(data);
        
        form.appendChild(input);
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        showToast('✓ Opened in CodePen');
    }

    function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
        } else {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
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
                els.urlLoading.style.display = 'flex';
                var res = await fetch(url);
                if (!res.ok) throw new Error('HTTP ' + res.status);
                userCSS = await res.text();
            } catch (err) {
                alert('Failed to fetch CSS: ' + err.message);
                resetBtn();
                els.urlLoading.style.display = 'none';
                return;
            }
            els.urlLoading.style.display = 'none';
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
        activeTab = 'css';

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
        els.workspaceView.classList.remove('view--active');
        els.landingView.classList.add('view--active');
    }

    // =========================================================
    // SIDEBAR
    // =========================================================
    // Pro items (visual indicator only — these IDs get a Pro badge)
    var proItems = ['accordion', 'pricing-table', 'timeline', 'data-chart'];

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
                var isPro = proItems.indexOf(comp.id) !== -1;
                var proClass = isPro ? ' sidebar__item--pro' : '';
                html += '<div class="sidebar__item' + proClass + '" data-id="' + comp.id + '"' + (isPro ? ' data-pro="true"' : '') + '>';
                html += '<span class="sidebar__item-icon">' + comp.icon + '</span>';
                html += '<span>' + comp.name + '</span>';
                if (isPro) {
                    html += '<span class="sidebar__pro-badge"><span class="sidebar__pro-lock">🔒</span> PRO</span>';
                }
                html += '</div>';
            });
            html += '</div>';
        });

        els.componentList.innerHTML = html;
        els.componentList.onclick = function (e) {
            var item = e.target.closest('.sidebar__item');
            if (!item) return;
            if (item.dataset.pro === 'true') {
                openProModal();
                return;
            }
            selectComponent(item.dataset.id);
        };
    }

    // =========================================================
    // COMPONENT SELECTION
    // =========================================================
    function selectComponent(id) {
        var comp = ComponentLibrary.getById(id);
        if (!comp) return;

        saveCurrentTab();
        currentComponent = comp;

        // Highlight in sidebar
        els.componentList.querySelectorAll('.sidebar__item').forEach(function (el) {
            el.classList.toggle('sidebar__item--active', el.dataset.id === id);
        });

        componentHTML = comp.html || '';
        componentJS = comp.js || '';

        if (!userCSS.trim()) {
            userCSS = comp.css || '';
        }

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

    return { init };
})();
