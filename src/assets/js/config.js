app 			= {};
app.model		={};
app.view		={};

//localstorage と ajaxの使い分け
Backbone.sync = function(method, model, options) {
  if(model.localStorage || (model.collection && model.collection.localStorage)  || !model.url) {
    return Backbone.localSync.call(this, method, model, options);
  }

  return Backbone.ajaxSync.call(this, method, model, options);
};

//router
app.Router = Backbone.Router.extend({
	routes:{
		'':'index',
		'top':'index',
		'view':'output',
		'howto':'howto',
		'settings':'settings'
	},
	index:function index(){
		$(function(){
			app.settingView = new app.instans.View.BasicInputForm({
				model:{
					weapon:app.model.weaponMaster,
					stage:app.model.stageMaster,
					setting:app.model.setting,
				}
			});
			var formView = new app.instans.View.InputForm();
			
		})
	},
	output:function index(){
		app.view.outputView.render();
	},
	howto:function index(){
		app.view.howtoView.render();
	},
	settings:function index(){
		app.view.settingsView.render();
	},
});