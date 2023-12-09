import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark-dimmed.css';

const renderer = new marked.Renderer();
renderer.codespan = function(text) {
	return `<code class="my-custom-class">${text}</code>`;
};
renderer.code = function(code, language, isEscaped) {
	// Check whether the given language is valid for highlight.js.
	const validLang = !!(language && hljs.getLanguage(language));
	// Highlight only if the language is valid.
	const highlighted = validLang ? hljs.highlight(code, { language }).value : code;
	// Render the highlighted code with `hljs` class.
	if (language) {
		return `<pre class="my-custom-code-class hljs ${language}" style="padding: 0;"><div style="background-color: black; color: white;"><p style="padding: 5px; margin: 0; display: flex; justify-content: space-between;">${language}<button class="copy-btn"><i class="bi bi-clipboard"></i></button></p></div><code class="hljs ${language}" style="padding: 15px;">${highlighted}</code></pre>`;
	} else {
		return `<pre class="my-custom-code-class" style="padding: 0;"><code class="hljs ${language}" style="padding: 15px;">${highlighted}</code></pre>`;
	}
};
renderer.link = function( href, title, text ) {
	return `<a target="_blank" style="color: lightblue;" href="`+ href +'" title="' + title + '">' + text + '</a>';
}
renderer.paragraph = function(text) {
  return `<p class="chat-paragraph">${text}</p>`;
};
renderer.list = function(body, ordered, start) {
  if (ordered) {
    return `<ol style="padding: 5px 20px;">${body}</ol>`
  } else {
    return `<ul style="padding: 5px 20px;">${body}</ul>`;
  }
}

// Set options for marked
marked.setOptions({
  headerIds: false,
  mangle: false,
  renderer: renderer,
  highlight: function (code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

export default marked;