app.instans = {};
app.instans.Model = {};
//基本設定
app.instans.Model.BasicSetting = Backbone.Model.extend({

})
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
	initialize:function(){
		this.isUser();
	},
	isUser:function(){
		console.log('start isUser');
		if(localStorage.getItem('users') === null ){
			this.create({
				id:0,
				name:'ユーザー1'
			});
			// localStorage[users] = 'users'
		}
	},
	localStorage: new Backbone.LocalStorage('users'),
});

//マスタ系
app.instans.Model.Weapon = Backbone.Model.extend({
	url:'./assets/js/json/weapon.json',
	parse:function(res){
		console.log('weapon parse')
		console.log(res);
		return res;
	}
});
app.instans.Model.Stage = Backbone.Model.extend({
	initialize:function(){
		console.log('stage init')
	},
	url:'./assets/js/json/stage.json',
});
app.instans.Model.Const = Backbone.Collection.extend({
	initialize:function(){

	},
});
