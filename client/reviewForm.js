
Template.reviewForm.onRendered( () => {
Session.set('name', (Router.current().params.query["openid.ax.value.fullname"])),
console.log(Session.get('name'));
console.log(Session.equals('name', (Router.current().params.query["openid.ax.value.fullname"])));
console.log(Router.current().params.query);
console.log(Router.current().params.query["openid.identity"])
  // store identity in a session or persistant storage such as mongoDB?
  //Router.current().params.query["openid.identity"]
   Accounts.createUser({

     email: (Router.current().params.query["openid.ax.value.contact_email"]),
     password:'idc',

     profile: {
       username: (Router.current().params.query["openid.ax.value.fullname"]),
       likeScore: 0,
       dislikeScore:0,
       year: '1',
       school: 'Computing',
     }

   }
   , function(error) {console.log(error);} );

   var email = (Router.current().params.query["openid.ax.value.contact_email"]);
   var password ='idc';

   Meteor.loginWithPassword(email, password, function(err){
       if(err) {

         return false;
       } else {

         Router.go("/");

       }
     });


  });

Template.reviewForm.events({

	"submit .review-post": function() {
		//reviewName,semester,recommendation,diff,workload,steepness,reviewPost
		var hideName = event.target.hideName.value;
		var reviewName = event.target.reviewName.value;
		var semester = event.target.semester.value;
		var recommendation = event.target.recommendation.value;
		var diff = event.target.diff.value;
		var workload = event.target.workload.value;
    var webcast = event.target.webcast.value;
		var steepness = event.target.steepness.value;
		var reviewPost = event.target.reviewPost.value;
    var hashtag = event.target.hashtag.value;
		//add new column and labels!

		if (isNotEmpty(reviewName) &&
			isNotEmpty(reviewPost) && isNotEmpty(semester)) {

			Meteor.call('addUnapproved',hideName, reviewName, semester, recommendation, diff, workload, steepness, reviewPost, webcast,hashtag);
			//clear form

	 event.target.reviewName.value = "ACC1002: Financial Accounting";
	 event.target.reviewPost.value = "";
	 event.target.semester.value = "AY 14/15 SEMESTER ONE";
   event.target.recommendation.value = "5 (Being the most recommended)";
   event.target.diff.value = "Hard";
   event.target.workload.value = "High";
   event.target.webcast.value = "Yes";
   event.target.steepness.value = "High";
   event.target.hashtag.value = "#";


			Bert.alert("Your Review Was Submitted!", "success", "growl-top-right");

		} else {

			Bert.alert("Please fill in all fields", "danger", "growl-top-right");
		}

		return false; // prevent submit
	}
});

// Validation Rules

var isNotEmpty = function(value){
	if (value && value !== ''){
		return true;
	}
	Bert.alert("Please fill in all fields", "danger", "growl-top-right");
	return false;
};

Template.reviewForm.helpers({
  Modules() {
         console.log(Modules.find().count());
         return Modules.find({}, {sort: {ModuleCode:1}});
     },
});
