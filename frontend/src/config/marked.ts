import { marked } from "marked";
import hljs from "highlight.js";

marked.use({ silent: true });
const renderer = new marked.Renderer();
renderer.codespan = function (text: string) {
    return `<code style="font-weight: 900; padding: 1px 3px; border-radius: 3px;">${text}</code>`;
};
renderer.paragraph = function (text: string) {
    return `<p style="margin: 10px 0px;">${text}</p>`;
};
renderer.code = function (code: string, language: string, isEscaped: boolean) {
    // Check whether the given language is valid for highlight.js.
    const validLang = !!(language && hljs.getLanguage(language));
    // Highlight only if the language is valid.
    const highlighted = validLang
        ? hljs.highlight(code, { language }).value
        : code;
    // Render the highlighted code with `hljs` class.
    if (language) {
        return `<pre style="margin: 2px;"><div style="background-color: black; color: white; border-radius: 5px 5px 0px 0px"><p style="padding: 5px; margin: 0; display: flex; justify-content: space-between;">${language}<button class="copy-btn"><i class="fas fa-copy"></i></button></p></div><code class="hljs language-${language}" style="border-radius: 0px 0px 3px 3px; padding: 10px; scrollbar-width: thin;">${highlighted}</code></pre>`;
    } else {
        return `<pre style="padding: 0;"><code class="hljs language-${language}" style="padding: 10px; scrollbar-width: thin;">${highlighted}</code></pre>`;
    }
};
renderer.link = function (href: string, title: string, text: string) {
    return (
        '<a target="_blank" href="' +
        href +
        '" title="' +
        title +
        '">' +
        text +
        "</a>"
    );
};

// Set options for marked
marked.setOptions({
    headerIds: false,
    mangle: false,
    renderer: renderer,
    highlight: function (code: string, lang: any) {
        if (lang && hljs.getLanguage(lang)) {
            return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
    },
});


export default marked;
