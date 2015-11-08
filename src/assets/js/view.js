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
		input:'#basicInputUdemae,#basicInputRule,#basicInputWeapon,#basicInputComment',
		checkbox:'[name="basicInputStage"]'
	},
	events:{
		'click @ui.toggleButton':function toggleArea(e){
			$(e.currentTarget).closest('.js-toggleWrap').find('.js-toggleContent').toggle();
		},
		'change @ui.checkbox':function(e){
			//ステージのチェックボックス制御
			var $elem = $(e.currentTarget);
			var length = $('[name="basicInputStage"]').length

			if($elem.val() === 'none' && $elem.prop('checked')){

				$('[name="basicInputStage"]').not('#basicInputStage_none').prop('checked',false);
				$('[name="basicInputStage"]').not(':checked').prop('disabled',true);

			}else if($('[name="basicInputStage"]:checked').length === 2 ){

				$('[name="basicInputStage"]').not(':checked').prop('disabled',true);

			}else{

				$('[name="basicInputStage"]').not(':checked').prop('disabled',false);

			}

			//model sets
			var setData = {};
			setData.stage = [];
			$('[name="basicInputStage"]:checked').each(function(i,d){
				setData.stage.push($(this).val());
			});
			this.model.setting.set(setData);
			console.log('setting.model set = ' + this.model.setting.get('stage'));
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
			if($elem.attr('id') === 'basicInputWeapon'){
				key = 'weapon';
			}
			if($elem.attr('id') === 'basicInputComment'){
				key = 'template';
			}

			setData[key] = $elem.val();
			this.model.setting.set(setData);
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
			var node = app.funcs.optionGen(res.get('weapons'));
			$(this.el).find('#basicInputWeapon').html(node);
		});

		this.listenTo(this.model.stage,'sync',function(res){
			var node = app.funcs.checkboxGen(res.get('stage'),'basicInputStage');
			$(this.el).find('#basicInputStage').html(node);
		});

		this.model.stage.fetch();
		this.model.weapon.fetch();
	},
});
app.instans.View.InputForm = Marionette.View.extend({
	el:'.js-inputFormView',
	ui:{
		form:'#input'
	},
	events:{
		'submit @ui.form':function(e){
			e.preventDefault();
			console.log('submit func')
			var scoreData     = {};
			scoreData.kill    = $('#inputKill').val();
			scoreData.death   = $('#inputDeath').val();
			scoreData.rule    = this.model.setting.get('rule');
			scoreData.stage   = $('[name=inputStage]:checked').val();
			scoreData.result  = $('[name=inputResult]:checked').val();
			scoreData.weapon  = this.model.setting.get('weapon');
			scoreData.udemae  = this.model.setting.get('udemae');
			scoreData.comment = $('#InputComment').val();
			scoreData.userid  = app.model.users.currentUser;
			scoreData.date    = moment().format('YYYY-MM-DD HH:mm:ss');

			var setting = this.model.setting
			this.collection.create(scoreData,{
				wait:false,
				success:function(res){
					console.log(res)
					//log表示
					var node ='';
					node += '<div class="logArea">'
					node += '<p>'+res.get('rule') + ' - ' +res.get('kill')+'k'+res.get('death')+'d '+app.const.get('result')[res.get('result')].name+'</p>'
					node += '</div>'
					$('body').append(node)
					setTimeout(function(){
						$('.logArea').fadeOut(500,function(){
							$('.logArea').remove();
						})
					},3000)

					//form初期化
					var _temp;
					if(!setting.get('template')){
						_temp = '';
					}else{
						_temp = setting.get('template');
					}
					$('#InputComment').val(_temp);
					$('[name=inputResult]:checked').prop('checked',false);
					$('[name=inputStage]:checked').prop('checked',false);
					$('#inputKill').val('');
					$('#inputDeath').val('');
					var h = $('.js-inputFormView').offset()
					console.log(h)
					console.log(h.top)

					$('body,html').animate({
						scrollTop:h.top+'px'
					},500)
				}
			})
			return false;
		}
	},
	initialize:function(){
		if(!this.collection)	this.collection 	= new app.instans.Model.Scores();
		if(!this.model.setting)	this.model.setting  = new app.instans.Model.BasicSetting()
		if(!this.model.weapon)	this.model.weapon   = new app.instans.Model.Weapon();
		if(!this.model.stage)	this.model.stage    = new app.instans.Model.Stage();


		this.listenTo(this.model.setting,'change',this.setSetting)

		//初期化
		var vals = this.model.stage.get('stage');
		var node = app.funcs.radioGen(this.model.stage.get('stage'),'inputStage');
		$('#inputStageWrap').html(node);


	},
	setSetting:function(model){
		var obj = model.changed;
		if(_.keys(obj)[0] === 'stage'){
			$('#inputStageWrap').empty();
			var val = model.get('stage')
			console.log(val)
			var vals;
			if(val[0] === 'none' || !val){
				 vals = this.model.stage.get('stage');
				 var node = app.funcs.radioGen(this.model.stage.get('stage'),'inputStage');
				 $('#inputStageWrap').html(node);
			}else{
				vals = model.get('stage');
				var node = app.funcs.radioGen(vals,'inputStage');
				$('#inputStageWrap').html(node);
				$('#inputStageWrap li').eq(0).remove();
			}
		}
		if(_.keys(obj)[0] === 'template'){
			$('#InputComment').val(model.get('template'))
		}
	},
});

//output
app.instans.View.ScoreItem = Marionette.ItemView.extend({
	template:'#outputListTemp',
	tagName:'tr',
});

app.instans.View.ScoreList = Marionette.CompositeView.extend({
	el:'#outputListWrap',
	template:'#outputListWrapTemp',
	childViewContainer:function(){
		return 'tbody'
	},
	childView:app.instans.View.ScoreItem,
	ui:{},
	events:{},
	initialize:function(){
		this.listenTo(this.collection,'sync',this.render);
	},
	attachHtml:function(collectionView, childView){
		collectionView.$el.find('tbody').prepend(childView.el);
	},
});
app.instans.View.outputFileter = Marionette.View.extend({
})
//settings
app.instans.View.Setting = Marionette.View.extend({
	ui:{},
	events:{},
	initialize:function(){

	},
});
