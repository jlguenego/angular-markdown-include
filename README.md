angular-markdown-include
========================

Angular module for including markdown and syntax highlighting.
This module brings the directive ```md-include```.

##Syntax

```html
<script src="path/to/jquery.min.js"></script>
<script src="path/to/angular.min.js"></script>
<script src="path/to/angular-markdown-include.min.js"></script>

<md-include src="'{mardown file url}'" [autoscroll] parser="{javascript function}" [script="{path to javascript file}"]></md-include>
```

Attributes:

- ```src```: URL of the markdown file. Be careful, it is surrounded by quotes.
- ```parser```: Javascript function taking one argument (the markdown file content)
and returning a string (the html content).
- ```autoscroll```: (optional) Like the autoscroll of Angular ```ng-include```.
- ```script```: (optional) Specify a script that will be appended at the end of the HTML content
and evaluated just after loading.


##Example

Here is an example using Marked and HighlightJS.

See the test directory for two real use cases.
- Showdown and Prettify
- Marked and HighlightJS

```html
<md-include src="'markdown/data.md'" autoscroll parser="myParser"></md-include>

<script>
function myParser(str) {
	var result = marked(str);
	var div = $('<div/>').html(result);

	div.find('pre').each(function(i, block) {
		var code = $(this).find('code');
		var lang = code.attr('class');
		console.log('lang=', lang);
		console.log('$(this)=', $(this));
		hljs.highlightBlock(code.get(0));
	});
	return div.html();
}
</script>
```

##Installation

###Simple method

Just download the angular-mardown-include.min.js.

###Bower

```sh
bower install angular-mardown-include
```

##Build

After installing with bower, you can do the following:

```sh
npm install
grunt
```

##Notes

Javascript library for markdown:
- [Marked](https://github.com/chjj/marked)
- [Showdown](https://github.com/showdownjs/showdown)

Javascript library for syntax highlighting:
- [HighlightJS](https://highlightjs.org/)
- [Prettify](https://code.google.com/p/google-code-prettify/)

##Issues

You can submit your issues on the
[Github system](https://github.com/jlguenego/angular-markdown-include/issues).

##License

[MIT](http://opensource.org/licenses/MIT)

##Authors
- Yannis THOMIAS
- Jean-Louis GUÉNÉGO