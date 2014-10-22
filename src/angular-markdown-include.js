/**
 * This code was largely inspired from the AngularJS source code.
 *
 * @license AngularJS v1.2.26
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */

(function() {
	var app = angular.module('angularMarkdownInclude', []);

	function isDefined(value) { return typeof value !== 'undefined'; }

	var mdIncludeDirective = ['$http', '$templateCache', '$anchorScroll', '$animate', '$sce',
					  function($http,   $templateCache,   $anchorScroll,   $animate,   $sce) {
		return {
			restrict: 'ECA',
			priority: 400,
			terminal: true,
			transclude: 'element',
			controller: angular.noop,
			compile: function(element, attr) {
				var srcExp = attr.ngInclude || attr.src,
				onloadExp = attr.onload || '',
				autoScrollExp = attr.autoscroll;

				return function(scope, $element, $attr, ctrl, $transclude) {
					var changeCounter = 0,
						currentScope,
						previousElement,
						currentElement;

					var cleanupLastIncludeContent = function() {
						if(previousElement) {
							previousElement.remove();
							previousElement = null;
						}
						if(currentScope) {
							currentScope.$destroy();
							currentScope = null;
						}
						if(currentElement) {
							$animate.leave(currentElement, function() {
								previousElement = null;
							});
							previousElement = currentElement;
							currentElement = null;
						}
					};

					scope.$watch($sce.parseAsResourceUrl(srcExp),
						function ngIncludeWatchAction(src) {
							var afterAnimation = function() {
								if (isDefined(autoScrollExp)
									&& (!autoScrollExp || scope.$eval(autoScrollExp))) {
									$anchorScroll();
								}
							};
							var thisChangeId = ++changeCounter;

							if (src) {
								$http.get(src, {cache: $templateCache})
									.success(function(response) {
										if (thisChangeId !== changeCounter) return;
										var newScope = scope.$new();
										ctrl.template = response;

										var clone = $transclude(newScope, function(clone) {
											cleanupLastIncludeContent();
											$animate.enter(clone, null, $element, afterAnimation);
										});

										currentScope = newScope;
										currentElement = clone;

										currentScope.$emit('$includeContentLoaded');
										scope.$eval(onloadExp);
									})
									.error(function() {
										if (thisChangeId !== changeCounter) return;
										var newScope = scope.$new();
										ctrl.template = 'Not found';

										var clone = $transclude(newScope, function(clone) {
											cleanupLastIncludeContent();
											$animate.enter(clone, null, $element, afterAnimation);
										});

										currentScope = newScope;
										currentElement = clone;

										currentScope.$emit('$includeContentError');
										scope.$eval(onloadExp);
									});

								scope.$emit('$includeContentRequested');
							} else {
								cleanupLastIncludeContent();
								ctrl.template = null;
							}
						}
					);
				};
			}
		};
	}];

	var mdIncludeFillContentDirective = ['$compile',
		function($compile) {
			return {
				restrict: 'ECA',
				priority: -400,
				require: 'mdInclude',
				link: function(scope, $element, $attr, ctrl) {
					var parserCallback = $attr['parser'] || 'angular.identity';
					var evalStr = parserCallback + '(ctrl.template)';
					var html = eval(evalStr);
					$element.html(html);

					if ($attr.script) {
						$element.append('<script>console.log("coucou");</script>');
						$element.append('<script src="' + $attr.script + '"></script>');
					}

					$compile($element.contents())(scope);
				}
			};
		}
	];

	app.directive({mdInclude: mdIncludeDirective})
		.directive({mdInclude: mdIncludeFillContentDirective});
})();