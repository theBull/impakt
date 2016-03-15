/// <reference path='../ui.mdl.ts' />

impakt.common.ui.factory('__router', [function() {

	var self = {
		templates: {},
		size: 0,
		index: 0,
		current: function() {
			return self.hasTemplates() ? self.templates[self.index] : null;
		},
		get: function(parent: string, templateName: string) {
			return self.templates[parent].filterFirst(function(template, index) {
				return templateName == template.name;
			});
		},
		add: function(parent: string, template: Common.Models.Template) {
			if(!self.templates[parent]) {
				self.templates[parent] = new Common.Models.TemplateCollection(parent);
				self.size++;
			}
			self.templates[parent].add(template);
		},
		push: function(parent: string, templates: Common.Models.Template[]) {
			for (var i = 0; i < templates.length; i++) {
				self.add(parent, templates[i]);
			}
		},
		next: function() {
			let oldIndex = self.index;
			if (self.hasTemplates()) {
				self.index = self.hasNextTemplate() ? self.index + 1 : 0;
			}
			console.log('next layer:', oldIndex, '->', self.index, self.templates);
		},
		prev: function() {
			if (self.hasTemplates()) {
				self.index = self.hasPrevTemplate() ? self.index - 1 : self.size - 1;
			}
		},
		to: function(index: number) {
			if (self.hasTemplates() && index >= 0 && index < self.size - 1) {
				self.index = index;
			}
		},
		hasTemplates: function() {
			return self.templates && self.size > 0;
		},
		hasNextTemplate: function() {
			return self.index < self.size - 1;
		},
		hasPrevTemplate: function() {
			return self.index > 0;
		}
	}
	return self;

}]);