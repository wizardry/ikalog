app.instans = {};
app.instans.Model = {};
//基本設定
app.instans.Model.BasicSetting = Backbone.Model.extend({
	defaults:{
		id:0
	},
	localStorage: new Backbone.LocalStorage('setting'),
});
//閲覧フィルター
app.instans.Model.outputFilter = Backbone.Model.extend({

});
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
	model:app.instans.Model.Score,
	localStorage: new Backbone.LocalStorage('scores'),
});


//アカウント
app.instans.Model.User = Backbone.Model.extend({
	defaults:{
		name:''
	},
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
			this.currentUser = 0;
			localStorage.currentUser = 0;
			// localStorage[users] = 'users'
		}else{
			this.currentUser = localStorage.currentUser;
		}
	},
	currentUser:null,
	localStorage: new Backbone.LocalStorage('users'),
});

//マスタ系
app.instans.Model.Weapon = Backbone.Model.extend({
	url:'./assets/js/json/weapon.json',
	parse:function(res){
		console.log('weapon parse');
		console.log(res);
		return res;
	}
});
app.instans.Model.Stage = Backbone.Model.extend({
	initialize:function(){
		console.log('stage init');
	},
	url:'./assets/js/json/stage.json',
});
app.instans.Model.Const = Backbone.Model.extend({
	initialize:function(){

		//リザルトマスタ
		this.set({
			result:[{
					val:0,
					name:'ノックアウト勝ち'
				},{
					val:1,
					name:'タイムアップ勝ち'
				},{
					val:2,
					name:'タイムアップ負け'
				},{
					val:3,
					name:'ノックアウト負け'
			}]
		});
	},
});
