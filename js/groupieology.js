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
		template: _.template($('#search-result-template').html()),
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}		
	});
	
	var Groupieology = Backbone.View.extend({
		el: '#groupiology-app',
		events: {
			'keypress #search' : 'search'
		},
		initialize : function() {
			/* create a simple performers collection to hold our search results */
			this.searchResults = new Performers();
			
			/* set up a listener function to update the search results div when the 
			 * Performers collection has changed */
			this.listenTo(this.searchResults, 'add', function(performer) {
				/* create a new performer view */
				var view = new PerformerView({ model: performer });
				
				/* append it to the search list */
				this.$('#search-results').append(view.render().el);
			});
		},
		search : function(event) {
			/* get the performer term */
			if (event.keyCode == 13) {
				var $term = $('input[id="search"]').val();
				this.searchResults.setSearchKey($term);
				this.searchResults.fetch();
			}
		}
	});
	var GroupieologyApp = new Groupieology();
});