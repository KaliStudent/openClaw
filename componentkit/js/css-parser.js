/**
 * CSS Parser Module
 * Parses a raw CSS string and extracts meaningful information:
 * - Custom properties (CSS variables)
 * - Class selectors and their properties
 * - Pseudo-class/state rules
 * - Identifies what "type" of component a rule likely targets
 */

const CSSParser = (function () {

    /**
     * Parse raw CSS text into structured data
     */
    function parse(cssText) {
        const result = {
            variables: {},       // :root / custom properties
            rules: [],           // All parsed rules
            selectors: {},       // Map of selector -> properties
            mediaQueries: [],    // @media rules
            keyframes: [],       // @keyframes
            raw: cssText
        };

        // Extract :root variables
        const rootMatch = cssText.match(/:root\s*\{([^}]+)\}/g);
        if (rootMatch) {
            rootMatch.forEach(block => {
                const propsRaw = block.match(/--[\w-]+\s*:\s*[^;]+/g);
                if (propsRaw) {
                    propsRaw.forEach(prop => {
                        const [name, ...valueParts] = prop.split(':');
                        const value = valueParts.join(':').trim();
                        result.variables[name.trim()] = value;
                    });
                }
            });
        }

        // Extract keyframes
        const keyframeRegex = /@keyframes\s+([\w-]+)\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/g;
        let kfMatch;
        while ((kfMatch = keyframeRegex.exec(cssText)) !== null) {
            result.keyframes.push({
                name: kfMatch[1],
                body: kfMatch[0]
            });
        }

        // Remove keyframes and media queries for simpler rule parsing
        let cleanCSS = cssText.replace(/@keyframes\s+[\w-]+\s*\{[^}]*(?:\{[^}]*\}[^}]*)*\}/g, '');
        cleanCSS = cleanCSS.replace(/@media[^{]+\{([\s\S]*?\})\s*\}/g, (match) => {
            result.mediaQueries.push(match);
            return '';
        });

        // Parse individual rules
        const ruleRegex = /([^{}@][^{]*)\{([^}]+)\}/g;
        let match;
        while ((match = ruleRegex.exec(cleanCSS)) !== null) {
            const selector = match[1].trim();
            const body = match[2].trim();

            if (selector.startsWith(':root')) continue;

            const properties = parseProperties(body);
            const rule = {
                selector,
                properties,
                raw: match[0]
            };

            result.rules.push(rule);
            result.selectors[selector] = properties;
        }

        return result;
    }

    /**
     * Parse a CSS property block into key-value pairs
     */
    function parseProperties(body) {
        const props = {};
        const declarations = body.split(';').filter(d => d.trim());
        declarations.forEach(decl => {
            const colonIdx = decl.indexOf(':');
            if (colonIdx === -1) return;
            const property = decl.substring(0, colonIdx).trim();
            const value = decl.substring(colonIdx + 1).trim();
            props[property] = value;
        });
        return props;
    }

    /**
     * Detect the likely component type a selector targets based on naming conventions
     */
    function detectComponentType(selector) {
        const s = selector.toLowerCase();

        const patterns = [
            { type: 'button', match: /\.btn|\.button|button|\.cta|\.action/ },
            { type: 'nav', match: /\.nav|nav|\.menu|\.header|header/ },
            { type: 'card', match: /\.card|\.panel|\.tile|\.box/ },
            { type: 'form', match: /\.form|form|\.field|\.input-group/ },
            { type: 'input', match: /\.input|input|\.text-field|textarea|\.search/ },
            { type: 'dropdown', match: /\.dropdown|\.select|select|\.menu(?!bar)/ },
            { type: 'toggle', match: /\.toggle|\.switch|\.checkbox|\.check/ },
            { type: 'radio', match: /\.radio/ },
            { type: 'loader', match: /\.loader|\.spinner|\.loading/ },
            { type: 'progress', match: /\.progress|\.bar/ },
            { type: 'tooltip', match: /\.tooltip|\.popover/ },
            { type: 'modal', match: /\.modal|\.dialog|\.overlay/ },
            { type: 'badge', match: /\.badge|\.tag|\.label|\.chip/ },
            { type: 'alert', match: /\.alert|\.notification|\.toast/ },
            { type: 'table', match: /\.table|table|thead|tbody/ },
            { type: 'link', match: /^a$|\.link/ },
            { type: 'heading', match: /^h[1-6]$|\.heading|\.title/ },
            { type: 'container', match: /\.container|\.wrapper|\.section|\.grid|\.layout/ },
            { type: 'footer', match: /\.footer|footer/ },
            { type: 'sidebar', match: /\.sidebar|aside/ },
        ];

        for (const p of patterns) {
            if (p.match.test(s)) return p.type;
        }

        return 'generic';
    }

    /**
     * Infer design tokens from parsed CSS (colors, fonts, spacing, etc.)
     */
    function inferDesignTokens(parsed) {
        const tokens = {
            colors: {
                primary: null,
                secondary: null,
                background: null,
                text: null,
                border: null,
                accent: null,
            },
            fonts: {
                body: null,
                heading: null,
                mono: null,
            },
            spacing: {},
            radius: null,
            shadows: [],
        };

        const vars = parsed.variables;

        // Try to find colors from variables
        for (const [name, value] of Object.entries(vars)) {
            const n = name.toLowerCase();
            if (/primary|brand|accent|main/.test(n) && isColor(value)) {
                tokens.colors.primary = tokens.colors.primary || value;
            }
            if (/secondary|alt/.test(n) && isColor(value)) {
                tokens.colors.secondary = tokens.colors.secondary || value;
            }
            if (/bg|background|base|surface/.test(n) && isColor(value)) {
                tokens.colors.background = tokens.colors.background || value;
            }
            if (/text|foreground|content/.test(n) && isColor(value)) {
                tokens.colors.text = tokens.colors.text || value;
            }
            if (/border/.test(n) && isColor(value)) {
                tokens.colors.border = tokens.colors.border || value;
            }
            if (/radius|rounded/.test(n)) {
                tokens.radius = tokens.radius || value;
            }
            if (/font.*sans|font.*body|font-family/.test(n)) {
                tokens.fonts.body = tokens.fonts.body || value;
            }
            if (/font.*head|font.*display/.test(n)) {
                tokens.fonts.heading = tokens.fonts.heading || value;
            }
            if (/font.*mono|font.*code/.test(n)) {
                tokens.fonts.mono = tokens.fonts.mono || value;
            }
        }

        // Scan rules for common property values as fallback
        for (const rule of parsed.rules) {
            const props = rule.properties;
            if (!tokens.colors.primary && props['background-color'] && isColor(props['background-color'])) {
                if (!/transparent|inherit|none|white|#fff/i.test(props['background-color'])) {
                    tokens.colors.primary = props['background-color'];
                }
            }
            if (!tokens.fonts.body && props['font-family']) {
                tokens.fonts.body = props['font-family'];
            }
            if (!tokens.radius && props['border-radius']) {
                tokens.radius = props['border-radius'];
            }
            if (props['box-shadow'] && props['box-shadow'] !== 'none') {
                tokens.shadows.push(props['box-shadow']);
            }
        }

        // Defaults
        tokens.colors.primary = tokens.colors.primary || '#6366f1';
        tokens.colors.secondary = tokens.colors.secondary || '#a855f7';
        tokens.colors.background = tokens.colors.background || '#ffffff';
        tokens.colors.text = tokens.colors.text || '#1a1a1a';
        tokens.colors.border = tokens.colors.border || '#e5e5e5';
        tokens.radius = tokens.radius || '8px';
        tokens.fonts.body = tokens.fonts.body || 'system-ui, sans-serif';

        return tokens;
    }

    function isColor(value) {
        return /^#|^rgb|^hsl|^oklch|^var\(--/.test(value.trim());
    }

    /**
     * Extract relevant CSS for a specific component type
     */
    function extractRelevantCSS(parsed, componentType) {
        const relevant = [];

        for (const rule of parsed.rules) {
            const type = detectComponentType(rule.selector);
            if (type === componentType || type === 'generic') {
                relevant.push(rule.raw);
            }
        }

        // Always include :root variables
        const rootMatch = parsed.raw.match(/:root\s*\{[^}]+\}/g);
        const rootCSS = rootMatch ? rootMatch.join('\n') : '';

        // Include relevant keyframes
        const keyframesCSS = parsed.keyframes.map(kf => kf.body).join('\n');

        return [rootCSS, ...relevant, keyframesCSS].filter(Boolean).join('\n\n');
    }

    return {
        parse,
        detectComponentType,
        inferDesignTokens,
        extractRelevantCSS,
        parseProperties
    };

})();

if (typeof module !== 'undefined') module.exports = CSSParser;
