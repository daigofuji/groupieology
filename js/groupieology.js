$(function() {
	
	var Performer = Backbone.Model.extend({
		
	});
	
	var Event = Backbone.Model.extend({
	
	});
	
	var Venue = Backbone.Model.extend({
	
	});
	
	var Events = Backbone.Collection.extend({
		model: Event
	});
	
	var Performers = Backbone.Collection.extend({
		model: Performer,
		parse: function(data) {
			var performers = [];
			if (typeof data.performers !== 'undefined') {
				$.each(data.performers, function(i,v) {
					performers.push(v);
				});
			}
			console.log(performers);
			return performers;			
		},
		fetch: function(options) {
			options = options || {};
			options.dataType = 'json';
			options.url = 'http://api.seatgeek.com/2/performers?q=' + this.searchKey;

			/* fetch the data */
			return Backbone.Collection.prototype.fetch.call(this, options);
		},
		setSearchKey: function(key) {
			this.searchKey = key;
		}
	});
	
	var PerformerView = Backbone.View.extend({
		tagName: 'div',
		className: 'performer',
		template: '',
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return $this;
		}		
	});
	
	var Groupieology = Backbone.View.extend({
		el: '#groupiology-app',
		events: {
			'click #find-performer' : 'search'
		},
		initialize : function() {
			/* create a simple performers collection to hold our search results */
			this.searchResults = new Performers();
		},
		search : function() {
			/* get the performer term */
			var $term = $('input[id="search"]').val();
			this.searchResults.setSearchKey($term);
			this.searchResults.fetch();			
		}
	});
	var GroupieologyApp = new Groupieology();
});