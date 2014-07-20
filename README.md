# GitHub Flavored Markdown (GFM) Viewer
Firefox add-on that dynamically renders pages written in raw markdown (.md) into HTML.
Supports the variation of markdown syntax used on GitHub.

## Screenshot

![Viewing a raw README file on GitHub](https://raw.githubusercontent.com/warren-bank/moz-gfm-markdown-viewer/screenshots/01.png)

## Summary
  * [marked.js](https://github.com/chjj/marked) is used to parse the markdown into an HTML string
  * [highlight.js](https://github.com/isagalaev/highlight.js) is used to provide syntax highlighting to blocks of code (contained within the markdown)
  * CSS style rules were taken directly from github.com.
    The only style rules that do not originate from GitHub
    are those that apply user-configurable color schemes to the syntax-highlighted code blocks.
    Never-the-less, the default color scheme is called 'github',
    and it sets the background color of code blocks to match the background color of non-highlighted "fenced code blocks". <sup><sub>(more about these under __Comments__)</sub></sup>

## Comments
  * GFM supports [syntax highlighting](https://help.github.com/articles/github-flavored-markdown#syntax-highlighting)
    for a very large number of [languages](https://raw.githubusercontent.com/github/linguist/master/lib/linguist/languages.yml).
    To avoid bloated code that hogs memory and kills browser performance,
    I made the decision to only support a limited subset of languages.
  * Rather than apply my own preferences in choosing which languages to support,
    I deferred judgement to the "official" [production build of highlight.js](https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.1/highlight.min.js);
    this is the distribution they host on a CDN and invite the public to use.
    > hljs.listLanguages()
```json
["coffeescript", "nginx", "json", "http", "javascript", "sql", "php", "makefile", "bash", "cpp", "perl", "ini", "apache", "java", "xml", "markdown", "cs", "ruby", "diff", "objectivec", "css", "python"]
```

    ..sounds good to me.
  * All other languages will be treated the same way as ["fenced code blocks"](https://help.github.com/articles/github-flavored-markdown#fenced-code-blocks).
    This is the terminology for code blocks that do not specify a language,
    and consequently do not receive any syntax highlighting.
    In either case, the code content will be displayed verbatim
    within a `<pre><code>` block, which is (attractively) styled using the normal GitHub CSS rules.

## Detection methodology

  * the add-on modifies all server responses that satisfy all of the following criteria:
    * the HTTP header 'content-type' is either:
      * 'text/plain'
      * 'text/markdown'
      * 'text/x-markdown'
      * 'text/vnd.daringfireball.markdown'
    * the location protocol is not 'view-source:'
    * the location pathname ends with either:

      > (md|markdown|mkd|mkdn|mkdown|rmarkdown)

## User Preferences:

  * syntax highlighting:
    * on/off toggle

      > default: on

    * choice of color scheme

      options consist of those provided by [highlight.js](https://github.com/isagalaev/highlight.js/tree/master/src/styles)

      > default: 'github'

## Examples

  > URLs to render in-browser after the add-on has been installed, which illustrate its functionality
    (..and provide the opportunity for a little shameless self-promotion)

  * [README: Firefox add-on "JSON-DataView"](https://raw.githubusercontent.com/warren-bank/moz-json-data-view/master/README.md)
  * [README: Firefox add-on "CoffeeBrew"](https://raw.githubusercontent.com/warren-bank/moz-coffee-brew/master/README.md)

## License

  > [GPLv2](http://www.gnu.org/licenses/gpl-2.0.txt)
