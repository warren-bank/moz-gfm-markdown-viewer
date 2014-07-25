window.addEventListener('load', function load(event) {
	window.removeEventListener('load', load, false);
	GFM_MarkdownViewer.init();
}, false);

if (!GFM_MarkdownViewer) {
	var GFM_MarkdownViewer = {

		prefs: null,
		load_prefs: function(){
			this.prefs = Components.classes["@mozilla.org/preferences-service;1"]
							.getService(Components.interfaces.nsIPrefService)
							.getBranch("extensions.gfm_markdown_viewer.");
		},

		init: function() {
			var appcontent = document.getElementById('appcontent');
			if (appcontent){
				this.load_prefs();
				appcontent.addEventListener('DOMContentLoaded', this.onPageLoad, true);
			}
		},

		onPageLoad: function(aEvent) {
			var self				= GFM_MarkdownViewer;
			var document			= aEvent.originalTarget;
			var is_gfmd				= false;
			var head, body, highlight, html_dom_tree;

			if (document.location.protocol.toLowerCase() === "view-source:"){return;}

			switch( document.contentType.toLowerCase() ){
				case 'text/vnd.daringfireball.markdown':
				case 'text/x-markdown':
				case 'text/markdown':
					is_gfmd			= true;
					break;
				case 'text/plain':
					is_gfmd			= 0;
					break;
			}

			if (is_gfmd === false){return;}

			if (is_gfmd !== true){
				// the location pathname ends with a markdown-related file extension
				(function(){
					var pattern		= /\.(md|markdown|mkd|mkdn|mkdown|rmarkdown)?$/;
					var ok			= (pattern.test( document.location.pathname.toLowerCase() ));
					if (ok)
						is_gfmd 	= true;
				})();
			}

			if (is_gfmd !== true){return;}

			document.title			= document.location.pathname.toLowerCase().replace(/^.*\/([^\/]+)$/,'$1');
			head					= document.head;
			body					= document.body;

			// prefs: syntax_highlighter
			highlight = {};
			highlight.theme			= self.prefs.getCharPref("syntax_highlighter.theme");
			highlight.enabled		= self.prefs.getBoolPref("syntax_highlighter.enabled");
			highlight.enabled		= (highlight.enabled && highlight.theme);

			(function(){
				var highlight_callback, HTMLParser, gfmd_string, html_string;

				if (highlight.enabled){
					highlight_callback = function(code, lang){
						// ------------------------------------------------
						// need to create a mapping..
						// from the languages officially supported by GFM:
						//     https://help.github.com/articles/github-flavored-markdown#syntax-highlighting
						//     https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml
						// to the languages supported by hightlight.js:
						//     http://highlightjs.org/download/
						// ------------------------------------------------
						// there's no way that I'm going to support the number of languages they do.
						// even if there were a library for each, that's just too much code to load into memory.
						// ------------------------------------------------
						// lets take a different approach..
						// the officially published build on the cdn supports:
						//     hljs.listLanguages() === ["coffeescript", "nginx", "json", "http", "javascript", "sql", "php", "makefile", "bash", "cpp", "perl", "ini", "apache", "java", "xml", "markdown", "cs", "ruby", "diff", "objectivec", "css", "python"]
						//
						// I'll bundle a copy of this distribution into the add-on;
						// map those languages that can be,
						// and the remainder won't be filtered through the highlighter.
						// ------------------------------------------------
						var hljs_lang, hljs_result;
						var add_hljs_div_wrapper = true;

						if (!lang){return code;}

						switch(lang.toLowerCase()){
							case 'coffeescript':
							case 'coffee':
							case 'coffee-script':
							case 'literate coffeescript':
								hljs_lang = 'coffeescript';
								break;
							case 'nginx':
							case 'nginxconf':
								hljs_lang = 'nginx';
								break;
							case 'json':
							case 'json5':
							case 'jsonld':
							case 'jsoniq':
							case 'ston':
								hljs_lang = 'json';
								break;
							case 'http':
								hljs_lang = 'http';
								break;
							case 'javascript':
							case 'js':
							case 'jscript':
							case 'node':
							case 'game maker language':
							case 'ecere projects':
								hljs_lang = 'javascript';
								break;
							case 'sql':
								hljs_lang = 'sql';
								break;
							case 'php':
							case 'php3':
							case 'php4':
							case 'php5':
							case 'phpt':
							case 'html+php':
							case 'phakefile':
							case 'twig':
							case 'zephir':
								hljs_lang = 'php';
								break;
							case 'makefile':
							case 'make':
							case 'gnumakefile':
								hljs_lang = 'makefile';
								break;
							case 'bash':
							case 'shell':
							case 'sh':
							case 'zsh':
							case 'shellsession':
							case 'sh-session':
							case 'gentoo ebuild':
							case 'gentoo eclass':
								hljs_lang = 'bash';
								break;
							case 'cpp':
							case 'c++':
							case 'c':
							case 'unified parallel c':
								hljs_lang = 'cpp';
								break;
							case 'perl':
							case 'perl4':
							case 'perl5':
							case 'perl6':
							case 'pl':
							case 'pod':
							case 'pm':
								hljs_lang = 'perl';
								break;
							case 'ini':
							case 'prefs':
							case 'properties':
								hljs_lang = 'ini';
								break;
							case 'apache':
							case 'apacheconf':
								hljs_lang = 'apache';
								break;
							case 'java':
							case 'groovy server pages':
							case 'groovy':
							case 'gsp':
							case 'java server pages':
							case 'jsp':
							case 'chuck':
							case 'processing':
							case 'unrealscript':
								hljs_lang = 'java';
								break;
							case 'xml':
							case 'rss':
							case 'xsd':
							case 'wsdl':
							case 'svg':
							case 'rdf':
							case 'eagle':
							case 'xproc':
								hljs_lang = 'xml';
								break;
							case 'markdown':
							case 'md':
							case 'mkd':
							case 'mkdn':
							case 'mkdown':
							case 'rmarkdown':
								hljs_lang = 'markdown';
								break;
							case 'cs':
							case 'c#':
							case 'csharp':
							case 'cshtml':
							case 'csx':
								hljs_lang = 'cs';
								break;
							case 'ruby':
							case 'jruby':
							case 'macruby':
							case 'rake':
							case 'rb':
							case 'rbx':
							case 'gemspec':
							case 'podspec':
							case 'rbuild':
							case 'crystal':
							case 'mirah':
							case 'ragel in ruby host':
								hljs_lang = 'ruby';
								break;
							case 'diff':
								hljs_lang = 'diff';
								break;
							case 'objectivec':
							case 'objective-c':
							case 'objc':
							case 'obj-c':
							case 'objectivec++':
							case 'objective-c++':
							case 'objc++':
							case 'obj-c++':
							case 'objectivecpp':
							case 'objective-cpp':
							case 'objcpp':
							case 'obj-cpp':
								hljs_lang = 'objectivec';
								break;
							case 'css':
							case 'less':
							case 'mask':
							case 'scss':
							case 'sass':
							case 'stylus':
							case 'styl':
								hljs_lang = 'css';
								break;
							case 'python':
							case 'py':
							case 'gyp':
							case 'xpy':
							case 'sage':
							case 'cython':
							case 'numpy':
							case 'numpyw':
								hljs_lang = 'python';
								break;
						}

						if (! hljs_lang){return code;}

						// the language is supported. pass it through the highlighter.
						try {
							hljs_result = hljs.highlight(hljs_lang, code, false);

							// the result will be wrapped in: <pre><code>
							// the github css sets the background-color for the <pre>, so even if I could add a class to it.. it wouldn't take priority.
							// what I can do, is to wrap the result in: <div class="hljs">
							// so the final result will be: <pre><code><div class="hljs">hljs_result</div></code></pre>
							if (add_hljs_div_wrapper){
								hljs_result.value = '<div class="hljs">' + hljs_result.value + '</div>';
							}
						}
						catch(e){return code;}

						return hljs_result.value;
					};
				}

				HTMLParser = function(aHTMLString){
					var html,body;
					html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);
					body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");

					html.documentElement.appendChild(body);

					body.appendChild(
						Components.classes["@mozilla.org/feed-unescapehtml;1"]
							.getService(Components.interfaces.nsIScriptableUnescapeHTML)
							.parseFragment(aHTMLString, false, null, body)
					);
					return body;
				};

				gfmd_string		= body.textContent;
				html_string		= marked(gfmd_string, {
					"highlight":	((highlight.enabled)? highlight_callback : false),
					"gfm":			true,
					"tables":		true,
					"breaks":		false,
					"pedantic":		false,
					"sanitize":		true,
					"smartLists":	true,
					"smartypants":	false
				});
				html_string		= '<div class="markdown-body">' + html_string + '</div>';
				html_dom_tree	= (HTMLParser(html_string)).firstChild;

			})();


			(function(){

				// add css files to head
				$C({
					"link_01": {
						"rel"		: "stylesheet",
						"type"		: "text/css",
						"href"		: ("resource://gfmdvskin/github-gfm.css")
					},
					"link_02": {
						"rel"		: "stylesheet",
						"type"		: "text/css",
						"href"		: ("resource://gfmdvskin/gfm-markdown-viewer.css")
					},
					"link_03": {
						"rel"		: "stylesheet",
						"type"		: "text/css",
						"href"		: ("resource://gfmdvskin/highlight_styles/" + highlight.theme.toLowerCase() + ".css"),
						"condition"	: (highlight.enabled)
					}
				}, head, document);

				// empty the body
				while (body.firstChild) {
					body.removeChild(body.firstChild);
				}

				body.appendChild(html_dom_tree);

			})();

		}
	};
}
