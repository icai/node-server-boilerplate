var app = (function() {
	var todos, content, list, add, edit, router;
	var showList = function() {
		content.empty().append(list.render().$el);
	}
	var showNewToDoForm = function() {
		content.empty().append(add.$el);
		add.delegateEvents();
	}
	var showEditToDoForm = function(data) {
		content.empty().append(edit.render(data).$el);		
	}
	var home = function() {
		router.navigate("", {trigger: true});
	}
	var RouterClass = Backbone.Router.extend({
		routes: {
			"new": "newToDo",
			"edit/:index": "editToDo",
			"": "list"
		},
		list: showList,
		newToDo: showNewToDoForm,
		editToDo: function(index) {
			showEditToDoForm({ index: index });
		}
	});
	var init = function() {
		todos = new app.collections.ToDos();
		list = new app.views.list({model: todos});
		edit = (new app.views.edit({model: todos}));
		add = (new app.views.add({model: todos})).render();
		content = $("#content");
		todos.fetch({ success: function() {
			router = new RouterClass();
			Backbone.history.start({
				pushState: true
			});
            $(document).on('click', 'a:not(.link_bypass):not([target="_blank"])', function(evt) {
                var self = this;
                var href = {
                    prop: $(self).prop("href"),
                    attr: $(self).attr("href")
                };
                if (evt.isDefaultPrevented()) return;
                var root = window.location.protocol + "//" + window.location.host + '/';
                if (
                    href.prop &&
                    href.prop.slice(0, root.length) === root
                ) {
                	router.navigate(href.attr, {trigger: true});
                    evt.preventDefault();
                    return false;
                }
            });

		}});
		add.on("saved", home);
		edit.on("edited", home);
	}
	return {
		models: {},
		collections: {},
		views: {},
		init: init
	}
})();