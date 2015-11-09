app.instans.View = {};
//wrapper
app.instans.View.Body = Marionette.View.extend({
	el:'body',
	ui:{
		toggleButton:'.js-toggleTrigger',
		toggleClose: '.js-toggleClose'
	},
	events:{
		'click @ui.toggleButton':function toggleArea(e){
			var $elem = $(e.currentTarget);
			$elem.closest('.js-toggleWrap').find('.js-toggleContent').toggle();
			if($elem.hasClass('current')){
				$elem.removeClass('current');
			}else{
				$elem.addClass('current');
			}
		},
		'click @ui.toggleClose':function(e){
			var $elem = $(e.currentTarget);
			$elem.closest('.js-toggleWrap').find('.js-toggleContent').toggle();
			$elem.closest('.js-toggleWrap').find('.js-toggleTrigger').removeClass('current');
		}
	},
	initialize:function(){

	},
});


//form
app.instans.View.BasicInputForm = Marionette.View.extend({
	el:'.js-basicSettingView',
	ui:{
		input:'#basicInputUdemae,#basicInputRule,#basicInputWeapon,#basicInputComment',
		checkbox:'[name="basicInputStage"]'
	},
	events:{
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
	tagName:'div',
	className:'viewBlock',
	templateHelpers:{
		_result:function(){
			return app.const.get('result')[this.result].name;
		},
		resultClass:function(res){
			var classname = '';
			if(this.result === '0' || this.result === '1'){
				classname =  'resWin';
			}else{
				classname =  'resLose';
			}
			return classname;
		},
		_rule:function(){
			var _rule = this.rule;
			if(!this.rule || this.rule === 'none'){
				_rule = '設定なし';
			}
			return _rule;
		},
		_stage:function(){
			var _stage = this.stage;
			if(!this.rule || this.rule === 'none'){
				_stage = '設定なし';
			}
			return _stage
		}
	},
});

app.instans.View.ScoreList = Marionette.CompositeView.extend({
	el:'#outputListWrap',
	template:'#outputListWrapTemp',
	childViewContainer:function(){
		return '.sectionBlock';
	},
	childView:app.instans.View.ScoreItem,
	ui:{},
	events:{},
	initialize:function(){
		this.listenTo(this.collection,'sync',this.render);
		this.listenTo(this.collection,'sync',this.math);
		this.listenTo(this.collection,'sync',this.isNull);
		this.math();
		this.isNull();
	},
	attachHtml:function(collectionView, childView){
		collectionView.$el.find('.sectionBlock').prepend(childView.el);
	},
	math:function(){
		var killRatio,killAvg,winRatio;
		var len        = this.collection.length;
		var killTotal  = 0;
		var deathTotal = 0
		var winlose    = [0,0]
		console.log(this.collection)
		_.each(this.collection.models,function(model,i){
			console.log(model)
			console.log(i)
			killTotal  = killTotal + parseInt(model.get('kill'));
			deathTotal = deathTotal + parseInt(model.get('death'));
			if(model.get('result') === '0' || model.get('result') === '1' ){
				winlose[0]++
			}else{
				winlose[1]++
			}
		});
		killRatio = Math.floor( (killTotal / deathTotal) * 100 ) / 100;
		killAvg   = [ 
						Math.floor( (killTotal / len) * 100) / 100 ,
						Math.floor( (deathTotal / len) * 100) / 100
					];
		winRatio  = Math.floor( (winlose[0] / len) * 100 )
		console.log('killRatio:' + killRatio + ' killAvg:' + killAvg + ' winRatio:' + winRatio)

		$('.js-scoreRatio').html(killRatio+'<span>kill</span>');
		$('.js-scoreAverage').html(killAvg[0] + '<span>k</span> / ' + killAvg[1] + '<span>d</span>');
		$('.js-winRatio').html(winRatio + '<span>%</span>');
	},
	isNull:function(){
		if(this.collection.length === 0){
			$('.nullField').show();
		}else{
			$('.nullField').hide();
		}
	}
});
app.instans.View.outputFileter = Marionette.View.extend({
})
//settings
app.instans.View.Setting = Marionette.View.extend({
	el:'.js-settingView',
	ui:{
		'userChangeForm' : '#userChangeForm',
		'userAddForm'    : '#userAddForm',
		'userDelForm'    : '#userDelForm',
		'exportButton'   : '#exportForm',
		'importButton'   : '#importForm',
		'dataDelButton'  : '#allDeleteForm',
	},
	events:{
		'submit @ui.userChangeForm' : 'userChange',
		'submit @ui.userAddForm'    : 'userAdd',
		'submit @ui.userDelForm'    : 'userDel',
		'click @ui.exportButton'    : 'exportFunc',
		'click @ui.importButton'    : 'importFunc',
		'click @ui.dataDelButton'   : 'dataDelete',
	},
	initialize:function(){
		console.log('setting view init');
		console.log(this.ui.userChangeForm)
		this.listenTo(this.collection.users,'change',this.setSelectUser);
		this.listenTo(this.collection.users,'update',this.setSelectUser);

		this.setSelectUser();
	},
	setSelectUser:function(){
		var node = '';
		_.each(this.collection.users.toJSON(),function(user,i){
			node += '<option value="' + user.id + '">' + user.name + '</option>';
		})
		$(this.ui.userChangeForm).find('select').html(node);
		$(this.ui.userDelForm).find('select').html(node);

	},
	userChange:function(e){
		localStorage.currentUser = $(this.ui.userChangeForm).find('select').val();
		this.collection.users.currentUser = localStorage.currentUser;
	},
	userAdd:function(e){
		if($(this.ui.userAddForm).find('#addUserName').val() === ''){
			return;
		}
		var username = $(this.ui.userAddForm).find('#addUserName').val();
		this.collection.users.create({
			name:username
		})
		$(this.ui.userAddForm).find('#addUserName').val('');
		alert('ユーザー：' + username + 'を追加しました。\nアカウント変更から変更できます。')
	},
	userDel:function(e){
		var self = this ;
		console.log(this.collection.users)
		if(this.collection.users.length === 1){
			alert('これ以上ユーザーを削除できません。');
			return;
		}
		var modelId = $(this.ui.userDelForm).find('select').val();
		var userdata = this.collection.scores.where({'userid':modelId})
		var delYes = window.confirm('ユーザーに紐づいたスコア '+userdata.length+' 件もすべて削除してしまいます。\nよろしいですか？')
		if(!delYes) return;

		//scoreを削除
		_.each(userdata,function(user,i){
			self.collection.scores.get(user.id).destroy();
		});
		//userを削除後selectを再描画
		this.collection.users.get(modelId).destroy().always(function(res){
			self.setSelectUser();
			alert('削除しました')
		});
	},
	exportFunc:function(e){
		alert('未実装');
	},
	importFunc:function(e){
		alert('未実装');
	},
	dataDelete:function(e){
		alert('未実装');
		var delYes = window.confirm('ユーザーやスコアすべてを削除してしまいます。\nよろしいですか？')
		if(!delYes) return ;
		_.each(app.model.users.models,function(user,i){
			console.log(user)
			user.destroy();
		});
		_.each(app.model.scores.models,function(score,i){
			console.log(score)
			score.destroy();
		});
		localStorage.clear();
		location.reload();
	},
});
