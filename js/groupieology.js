$(function() {
	var Groupieology = Groupieology || {};
	
	Groupieology.Performer = Backbone.Model.extend({
		
	});
	
	Groupieology.Event = Backbone.Model.extend({
	
	});
	
	Groupieology.Venue = Backbone.Model.extend({
	
	});
	
	Groupieology.Events = Backbone.Collection.extend({
		model: Groupieology.Event,
		parse: function(data) {
			var events = [];
			if (typeof data.events !== 'undefined') {
				$.each(data.events, function(i,v) {
					events.push(v);
				});
			}
			return events;			
		},
		fetch: function(options) {
			options = options || {};
			options.dataType = 'json';
			options.url = 'http://api.seatgeek.com/2/events?performers.id=' + this.searchKey;

			/* fetch the data */
			return Backbone.Collection.prototype.fetch.call(this, options);
		},
		setSearchKey: function(key) {
			this.searchKey = key;
		}
	});
	
	Groupieology.Performers = Backbone.Collection.extend({
		model: Groupieology.Performer,
		parse: function(data) {
			var performers = [];
			if (typeof data.performers !== 'undefined') {
				$.each(data.performers, function(i,v) {
					performers.push(v);
				});
			}
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
	
	Groupieology.PerformerView = Backbone.View.extend({
		tagName: 'li',
		className: 'performer',
		template: _.template($('#search-result-template').html()),
		render: function() {
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		}		
	});
	
	Groupieology.AppView = Backbone.View.extend({
		el: '#groupiology-app',
		events: {
			'keypress #search' : 'search'
		},
		initialize : function() {
			/* create a simple performers collection to hold our search results */
			this.searchResults = new Groupieology.Performers();
			
			/* set up a listener function to update the search results div when the 
			 * Performers collection has changed */
			this.listenTo(this.searchResults, 'add', function(performer) {
				/* create a new performer view */
				var view = new Groupieology.PerformerView({ model: performer });
				
				/* append it to the search list */				
				this.$('#content').append(view.render().el);
			});
		},
		search : function(event) {
			/* get the performer term */
			if (event.keyCode == 13) {
				var $term = $('input[id="search"]').val();
				this.searchResults.setSearchKey($term);
				this.$('#content').empty();
				this.searchResults.fetch();
			}
		}
	});
	
	Groupieology.Router = Backbone.Router.extend({
		routes: {
			'artist/:id': 'showArtistMap'
		},
		
		showArtistMap: function(id) {
			/* get the events for an artist */
			var artistEvents = new Groupieology.Events();
			artistEvents.setSearchKey(id);
			this.$('#content').empty();
			artistEvents.fetch();
		}
	});
	
	Groupieology.router = new Groupieology.Router();
	Backbone.history.start();
	Groupieology.app = new Groupieology.AppView();
});