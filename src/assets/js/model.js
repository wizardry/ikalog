//スコア
app.instans.Model.Score = Backbone.Model.extend({
	defaults:{
		kill:'',
		death:'',
		rule:'',
		stage:'',
		result:'',
		weapon:'',
		udemae:'',
		comment:'',
		userid:'',
		date:'',
	}
});
app.instans.Model.Scores = Backbone.Collection.extend({

});


//アカウント
app.instans.Model.User = Backbone.Model.extend({
	defaults:{
		name:''
	}
});
app.instans.Model.Users = Backbone.Collection.extend({

});

//マスタ系
app.instans.Model.Weapon = Backbone.Model.extend({
	defaults:{
	},
	url:'./assets/js/json/weapon.json'
});
app.instans.Model.Stage = Backbone.Model.extend({
	defaults:{
	},
	url:'./assets/js/json/stage.json'
});
app.instans.Model.Const = Backbone.Collection.extend({
	initialize:function(){
		
	},
});
