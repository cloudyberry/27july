Template.search.rendered = function() {
	$("#search-link").addClass('selected');
	$("#profile-link").removeClass('selected');
	$("#rankings-link").removeClass('selected');
	$("#reviews-link").removeClass('selected');
	$("#login-link").removeClass('selected');
}

Template.search.helpers({

	admin: function() {
		var adminId = Meteor.users.findOne({"emails.address": "e0201623@u.nus.edu"})._id;
		var userId = Meteor.userId();
		if (userId === adminId) {
		return true;
	}
	},

	reviews: function() {
		//get reviews from method: returnSearch
		//then sort by date
		var reviews = Reviews.find({"searched":1}, {sort: {createdAt: -1}});
		return reviews;
	},


	matchedReviews: function() {
			//get reviews from method: returnSearch
			//then sort by date
		var matched = Reviews.find({"matched":1}, {sort: {createdAt: -1}});
		return matched;
	},

	comms: function() {
		//sort by latest date on top
		var comms = Comments.find({}, {sort: {createdAt: -1}});
		return comms;
	},

	displayComments: function() {
		return Session.equals('showCommentsId', this._id);
	},

	liked: function () {
			return Session.equals('likeId', this._id);
	},
	disliked: function () {
			return Session.equals('dislikeId', this._id);
	}

});

Template.search.events({



	"submit .search-form": function() {
		//reviewName,semester,recommendation,diff,workload,steepness,reviewPost
		var reviewName = event.target.reviewName.value;
		Meteor.call('endSearch');
		Meteor.call('returnSearch', reviewName);
		return false; // prevent submit
	},

	"submit .match-form": function() {
		//reviewName,semester,recommendation,diff,workload,steepness,reviewPost
		var recommendation = event.target.recommendation.value;
		var diff = event.target.diff.value;
		var workload = event.target.workload.value;
		var webcast = event.target.webcast.value;
		var steepness = event.target.steepness.value;

		Meteor.call('endMatch');
		Meteor.call('returnMatch', recommendation, diff, workload, webcast, steepness);

		return false; // prevent submit
	},

		"click #hashtag": function() {
			var hashtag = Reviews.findOne({_id: this._id}).hashtag;
			console.log(hashtag);
			Meteor.call('endHashtag');
			Meteor.call('returnHashtag', hashtag);
		},

		"click #like": function() {
			Session.set('likeId', this._id);

			var thisUser = Meteor.userId();
			var thisReview = Reviews.findOne({_id: this._id})._id;
			var reviewAuthor =Reviews.findOne({_id: this._id}).userId;
			var Name =  Meteor.user().profile.username;
			var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

			  // detect voting by author
				// console.log(Reviews.findOne({_id: this._id}).userId);
				// console.log(Meteor.userId());
				// console.log(Reviews.findOne({_id: this._id}).userId==Meteor.userId());
				// console.log(Name==thisReviewsVotes);
				if (Reviews.findOne({_id: this._id}).userId==Meteor.userId()) {

				}
					else {
					Meteor.call("countVote", thisReview, Name);
					Meteor.call("userPointLike", reviewAuthor);
					Meteor.call("likeVote", thisUser, thisReview);

					if( (Session.get('dislikeId')!=null) ) {
						Meteor.call("countVote", thisReview, Name);
						Meteor.call("userPointunDislike", reviewAuthor);
						Meteor.call("undislikeVote", thisUser, thisReview);
						Session.set('dislikeId', null);
					}
				}
		},

		"click #unlike": function() {
			Session.set('likeId', null);
			//means never like
			var thisUser = Meteor.userId();
			var thisReview = Reviews.findOne({_id: this._id})._id;
			var reviewAuthor =Reviews.findOne({_id: this._id}).userId;
			var Name =  Meteor.user().profile.username;
			var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

			// //detect doublevoting
			// if (thisReviewsVotes.indexOf(Name) > -1) {
			// 	Bert.alert("You cannot vote twice", "danger", "growl-top-right");
			// 	// In the array!, meaning user has voted
			// } else {
				// Not in the Array, Do stuff.
				if (Reviews.findOne({_id: this._id}).userId==Meteor.userId()) {

				}
				else {
				Meteor.call("countVote", thisReview, Name);
				Meteor.call("userPointunLike", reviewAuthor);
				Meteor.call("unlikeVote", thisUser, thisReview);
				}
		},


		"click #dislike": function() {
			Session.set('dislikeId', this._id);
			var thisUser = Meteor.userId();
			var thisReview = Reviews.findOne({_id: this._id})._id;
			var reviewAuthor = Reviews.findOne({_id: this._id}).userId;
			//var Name = Meteor.user().username;
			var Name = Meteor.user().profile.username;;
			var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

			if (Reviews.findOne({_id: this._id}).userId==Meteor.userId()) {

			}
			else {
				// Not in the Array, Do stuff.
				Meteor.call("countVote", thisReview, Name);
				Meteor.call("userPointDislike", reviewAuthor);
				Meteor.call("dislikeVote", thisUser, thisReview);

				// console.log(Session.get('likeId'));
				if( (Session.get('likeId')!=null) ) {

					Meteor.call("countVote", thisReview, Name);
					Meteor.call("userPointunLike", reviewAuthor);
					Meteor.call("unlikeVote", thisUser, thisReview);
					Session.set('likeId', null);

				}
			}
		},

		"click #undislike": function() {
			Session.set('dislikeId', null);
			var thisUser = Meteor.userId();
			var thisReview = Reviews.findOne({_id: this._id})._id;
			var reviewAuthor = Reviews.findOne({_id: this._id}).userId;
			//var Name = Meteor.user().username;
			var Name = Meteor.user().profile.username;;
			var thisReviewsVotes = Reviews.findOne({_id: this._id}, {voted: {$in: Name}}).voted;

			if (Reviews.findOne({_id: this._id}).userId==Meteor.userId()) {

			}

			else {
				// Not in the Array, Do stuff.
				Meteor.call("countVote", thisReview, Name);
				Meteor.call("userPointunDislike", reviewAuthor);
				Meteor.call("undislikeVote", thisUser, thisReview);
			}
		},

		"click #showcomment": function() {
		//	var thisUser = Meteor.userId();
		//	var thisReview = Reviews.findOne({_id: this._id})._id;
		//	var reviewAuthor = Reviews.findOne({_id: this._id}).userId;
		Session.set('showCommentsId', this._id);
	},

	"click #hide-comment": function() {
		Session.set('showCommentsId', null);
	},
});

//returning a session that is selected
//checks if it is selected or empty
Template.User.helpers({
	selected: function() {
		return Session.equals("selectedReview", this.__originalId) ? "selected" : '';
	},
});

Template.User.events({
	'click': function() {
		Session.set("selectedReview", this.__originalId);
	}
});
