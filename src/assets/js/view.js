app.instans.View = {};
//wrapper
app.instans.View.Body = Marionette.View.extend({
	ui:{},
	events:{},
	initialize:function(){

	},
});


//form
app.instans.View.BasicInputForm = Marionette.View.extend({
	el:'.js-basicSettingView',
	ui:{
		toggleButton:'.js-toggleTrigger',
		input:'#basicInputUdemae,#basicInputRule,#basicInputStage,#basicInputWeapon,#basicInputComment'
	},
	events:{
		'click @ui.toggleButton':function toggleArea(e){
			$(e.currentTarget).closest('.js-toggleWrap').find('.js-toggleContent').toggle();
		},
		'change @ui.input':function(e){
			var $elem = $(e.currentTarget);
			var setData = {};
			var key = '';
			if($elem.attr('id') === 'basicInputUdemae'){
				key = 'udemae';
			}
			if($elem.attr('id') === 'basicInputRule'){
				key = 'rule';
			}
			if($elem.attr('id') === 'basicInputStage'){
				key = 'stage';
			}
			if($elem.attr('id') === 'basicInputWeapon'){
				key = 'weapon';
			}
			if($elem.attr('id') === 'basicInputComment'){
				key = 'template';
			}

			setData[key] = $elem.val();
			this.model.setting.set(setData)
			console.log('setting.model set = ' + this.model.setting.get(key));

		}
	},
	model:{
		weapon:null,
		stage:null,
		setting:null,
	},
	collection:null,
	initialize:function(){
		console.log('basicsetting veiw init');
		if(!this.model.weapon)		this.model.weapon   = new app.instans.Model.Weapon();
		if(!this.model.stage)		this.model.stage    = new app.instans.Model.Stage();
		if(!this.model.setting)		this.model.setting  = new app.instans.Model.BasicSetting();

		this.listenTo(this.model.weapon,'sync',function(res){
			var node = this.optionGen(res.get('weapons'));
			$(this.el).find('#basicInputWeapon').html(node);
		});

		this.listenTo(this.model.stage,'sync',function(res){
			var node = this.optionGen(res.get('stage'));
			$(this.el).find('#basicInputStage').html(node);
		});

		this.model.stage.fetch();
		this.model.weapon.fetch();
	},
	optionGen:function(data){
		var node = '';
		node += '<option value="none">設定しない</option>'
		_.each(data,function(modeldata,i){
			node += '<option value="'+modeldata+'">' +modeldata+ '</option>'
		})
		return node;
	}
});
app.instans.View.InputForm = Marionette.View.extend({
	el:'.js-inputFormView',
	ui:{},
	events:{},
	initialize:function(){

	},
});

//output
app.instans.View.ScoreItem = Marionette.ItemView.extend({
	ui:{},
	events:{},
	initialize:function(){

	},
});

app.instans.View.ScoreList = Marionette.CompositeView.extend({
	ui:{},
	events:{},
	initialize:function(){

	},
});

//settings
app.instans.View.Setting = Marionette.View.extend({
	ui:{},
	events:{},
	initialize:function(){

	},
});
