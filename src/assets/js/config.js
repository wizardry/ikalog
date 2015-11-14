app 			= {};
app.model		={};
app.view		={};

//localstorage と ajaxの使い分け
// Backbone.sync = function(method, model, options) {
//   if(model.localStorage || (model.collection && model.collection.localStorage)  || !model.url) {
//     return Backbone.localSync.call(this, method, model, options);
//   }

//   return Backbone.ajaxSync.call(this, method, model, options);
// };

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
			var view;
			view = new app.instans.View.InputWrap({
				model:{
					weapon:app.model.weaponMaster,
					stage:app.model.stageMaster,
					setting:app.model.inputSetting
				},
				collection:app.model.scores,
			});
			console.log(view);
			$('.howtoPageBlock,.outputPageBlock,.settingPageBlock').hide();
			$('.inputPageBlock').show();
		});
	},
	output:function index(){
		$(function(){
			var scoreView , filterView;
			$('.outputPageBlock').show();
			$('.howtoPageBlock,.inputPageBlock,.settingPageBlock').hide();
			scoreView  = new app.instans.View.ScoreList({
				collection:app.model.scores
			});
			filterView = new app.instans.View.outputFileter({
				model:app.model.filter
			});
		});
	},
	howto:function index(){
		$(function(){
			// app.view.howtoView.render();
			$('.inputPageBlock,.outputPageBlock,.settingPageBlock').hide();
			$('.howtoPageBlock').show();
		});
	},
	settings:function index(){
		$(function(){
			// app.view.settingsView.render();
			var settingView = new app.instans.View.Setting({
					
				collection:{
					scores:app.model.scores,
					users:app.model.users,
				}
			});
			$('.howtoPageBlock,.outputPageBlock,.inputPageBlock').hide();
			$('.settingPageBlock').show();
		});
	},
});

//functions
app.funcs = {
	optionGen:function(data){
		var node = '';
		node += '<option value="none">設定しない</option>';
		_.each(data,function(modeldata,i){
			node += '<option value="'+modeldata+'">' +modeldata+ '</option>';
		});
		return node;
	},
	checkboxGen:function(data,name){
		var node = '';
		node += '<li>';
		node += '<input type="checkbox" value="none" name="'+name+'" id="'+name+'_none">';
		node += '<label for="'+name+'_none">設定しない</label>';
		node += '</li>';
		_.each(data,function(modeldata,i){
			node += '<li>';
			node += '<input type="checkbox" value="'+modeldata+'" name="'+name+'" id="'+name+'_'+i+'">';
			node += '<label for="'+name+'_'+i+'">'+modeldata+'</label>';
			node += '</li>';
		});
		return node;
	},
	radioGen:function(data,name){
		var node = '';
		node += '<li>';
		node += '<input type="radio" value="none" name="'+name+'" id="'+name+'_none">';
		node += '<label for="'+name+'_none">設定しない</label>';
		node += '</li>';
		_.each(data,function(modeldata,i){
			node += '<li>';
			node += '<input type="radio" value="'+modeldata+'" name="'+name+'" id="'+name+'_'+i+'">';
			node += '<label for="'+name+'_'+i+'">'+modeldata+'</label>';
			node += '</li>';
		});
		return node;
	}

};