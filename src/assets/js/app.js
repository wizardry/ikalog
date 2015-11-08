$(function(){
	var router = new app.Router();
	Backbone.history.start();

	//models
	app.model.users = new app.instans.Model.Users({
		model:new app.instans.Model.User()
	});
	app.model.users.fetch();

	app.model.weaponMaster = new app.instans.Model.Weapon();
	app.model.stageMaster  = new app.instans.Model.Stage();
	app.model.setting      = new app.instans.Model.BasicSetting();

	//views
	app.view.bodyView = new app.instans.View.Body();


})