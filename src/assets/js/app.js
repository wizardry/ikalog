$(function(){
	var router = new app.Router();
	Backbone.history.start();

	window.onerror = function(msg,file,line,column,err){
		alert('ERR:'+msg);
	};

	//models=========================================

	//定数
	app.const = new app.instans.Model.Const();

	//ユーザー
	app.model.users = new app.instans.Model.Users({
		model:app.instans.Model.User
	});
	app.model.users.fetch();

	//基本設定
	app.model.weaponMaster = new app.instans.Model.Weapon();
	app.model.stageMaster  = new app.instans.Model.Stage();
	app.model.inputSetting = new app.instans.Model.BasicSetting();

	//スコア入力
	app.model.scores = new app.instans.Model.Scores();
	app.model.scores.fetch();
	app.model.filter = new app.instans.Model.outputFilter();

	//views
	app.view.bodyView = new app.instans.View.Body();

	
	setTimeout(function(){
		$(function(){
			// $('.contentOuter').nextAll('script').empty().attr('src','');
			$('.contentOuter').nextAll().wrap('<div style="position:relative;z-index:-1;display:none"></div>');
		});
	},300);
});