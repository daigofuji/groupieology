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
		model: Performer
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
		el: '',
		events: {
		
		},
		initialize : function() {
			/* set up the api endpoints */
			this.performerEndPoint = 'http://api.seatgeek.com/2/performers';
			
			/* create a simple performers collection to hold our search results */
			this.searchResults = new Performers();
			
		},
		search : function() {
			/* get the performer term */
			var $term = $('input[id="search"]').val();
			
			/* search */
			$.get({
				url: this.performerEndPoint,
				data: {
					q : $term
				},
				dataType: 'json',
				success: function(data, status, xhr) {
					/* parse through the results by grabbing the performer element */
					if (typeof data.performers !== 'undefined') {
						$.each(data.performers, function() {
							/* create a new performer model */
							var performer = new Performer(this);
							
							/* add it to the result set */
							this.performers.push(performer);
						});
					}					
				}
			});
		}
	});
}