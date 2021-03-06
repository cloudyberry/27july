Template.hashtags.rendered = function() {
	$("#reviews-link").removeClass('selected');
	$("#profile-link").removeClass('selected');
	$("#rankings-link").removeClass('selected');
	$("#search-link").removeClass('selected');
	$("#login-link").removeClass('selected');
}
//go to collection and post to reviews page
Template.hashtags.helpers({
	hashtagged: function() {
		var reviews = Reviews.find({"hashtagged":1}, {sort: {createdAt: -1}});
		return reviews;
	},
	admin: function() {
		var adminId = Meteor.users.findOne({"emails.address": "e0201623@u.nus.edu"})._id;
		var userId = Meteor.userId();
		if (userId === adminId) {
		return true;
	}
	},

		comms: function() {
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
Template.hashtags.events({

	"click #hashtag": function() {
		var hashtag = Reviews.findOne({_id: this._id}).hashtag;
		console.log(hashtag);
		Meteor.call('endHashtag');
		Meteor.call('returnHashtag', hashtag);
	},

	"click #like": function() {
		if (!Meteor.userId()) {
			Bert.alert("Please log in to Vote", "danger", "growl-top-right");
		}
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
		if (!Meteor.userId()) {
			Bert.alert("Please log in to Vote", "danger", "growl-top-right");
		}
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
		if (!Meteor.userId()) {
			Bert.alert("Please log in to Comment", "danger", "growl-top-right");
		}
	//	var thisUser = Meteor.userId();
	//	var thisReview = Reviews.findOne({_id: this._id})._id;
	//	var reviewAuthor = Reviews.findOne({_id: this._id}).userId;
	Session.set('showCommentsId', this._id);
},

"click #hide-comment": function() {
	Session.set('showCommentsId', null);
},

});
