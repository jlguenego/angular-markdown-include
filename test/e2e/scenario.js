describe('angular-markdown-include', function() {

	describe('marked-highlight', function() {
		beforeEach(function() {
			browser.get('test/test_marked_highlight.html');
		});

		it('should have a title', function() {
			var title = element(by.css('#angular-markdown-include'));

			expect(title.getText()).toEqual('angular-markdown-include');
		});

		it('should highlight with highlightjs', function() {
			element.all(by.css('code.hljs')).then(function(items) {
				expect(items.length > 0).toBe(true);
			});
		});
	});

	describe('showdown-prettify', function() {
		beforeEach(function() {
			browser.get('test/test_showdown_prettify.html');
		});

		it('should have a title', function() {
			var title = element(by.css('#angularmarkdowninclude'));

			expect(title.getText()).toEqual('angular-markdown-include');
		});

		it('should highlight with prettify', function() {
			element.all(by.css('pre.prettyprinted')).then(function(items) {
				expect(items.length > 0).toBe(true);
			});
		});
	});
});