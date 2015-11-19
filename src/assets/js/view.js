app.instans.View = {};
//wrapper
app.instans.View.Body = Marionette.View.extend({
	el:'body',
	ui:{
		toggleButton:'.js-toggleTrigger',
		toggleClose: '.js-toggleClose',
		radio:'input[type="radio"]'
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
		},
	},
	initialize:function(){

	},
});


//form
// BasicSettingのDOMとModel紐付け
app.instans.View.BasicInputForm = Marionette.View.extend({
	el:'.js-basicSettingView',
	parentView:null,
	ui:{
		input:'#basicInputUdemae,#basicInputRule,#basicInputWeapon,#basicInputComment',
		checkbox:'[name="basicInputStage"]'
	},
	events:{
		'change @ui.checkbox':function(e){
			console.log(this);
			this.checkboxControll();
			//model sets
			var setData = {};
			setData.stage = [];
			$('[name="basicInputStage"]:checked').each(function(i,d){
				setData.stage.push($(this).val());
			});
			this.model.setting.set(setData);
			console.log(this.model.setting);
			this.model.setting.save({
				success:function(res){
					console.log('save success res');
					console.log(res);
					
				}
			}).done(function(res){
				console.log('save done');
				console.log(res);
			});
			console.log('setting.model set = ' + this.model.setting.get('stage'));
		},
		'change @ui.input':function(e){
			console.log(e);
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
			this.model.setting.save();
			console.log('setting.model set = ' + this.model.setting.get(key));
		},
	},
	model:{
		weapon:null,
		stage:null,
		setting:null,
	},
	collection:null,
	initialize:function(){
		console.log('basicsetting veiw init');
		console.log(this);
	},
	checkboxControll:function(e){
		console.log('checkboxControll');
		console.log(e);
		console.log(this);
		//ステージのチェックボックス制御
		console.log($('#basicInputStage_none').prop('checked'));
		var length = $('[name="basicInputStage"]').length;
		if($('#basicInputStage_none').prop('checked')){
			console.log('basic setting isNone');
			$('[name="basicInputStage"]').not('#basicInputStage_none').prop('checked',false);
			$('[name="basicInputStage"]').not('#basicInputStage_none').prop('disabled',true);
			$('#basicInputStage_none').prop('checked',true);

		}else if($('[name="basicInputStage"]:checked').length === 2 ){
			console.log('basic setting is2Set');
			$('[name="basicInputStage"]').not(':checked').prop('disabled',true);

		}else{
			console.log('basic setting isNotSet');
			$('[name="basicInputStage"]').not(':checked').prop('disabled',false);

		}
	}
});

//戦績入力部分のDOMとModel紐付け
app.instans.View.InputForm = Marionette.View.extend({
	el:'.js-inputFormView',
	parentView:null,
	ui:{
		form:'#input'
	},
	events:{
		'submit @ui.form':function(e){
			e.preventDefault();
			console.log('submit func');
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

			var setting = this.model.setting;
			this.collection.create(scoreData,{
				wait:false,
				success:function(res){
					console.log(res);
					//log表示
					var node ='';
					node += '<div class="logArea">';
					node += '<p>';
					if(res.has('rule'))  node += res.get('rule') + ' - ';
					if(res.has('kill'))  node += res.get('kill') + 'k';
					if(res.has('death')) node += res.get('death')+'d ';
					if(res.has('result'))  node += app.const.get('result')[res.get('result')].name;
					node += '</p>';
					node += '</div>';
					$('body').append(node);
					setTimeout(function(){
						$('.logArea').fadeOut(500,function(){
							$('.logArea').remove();
						});
					},3000);

					//form初期化
					var _temp;
					if(setting.has('template')){
						_temp = '';
					}else{
						_temp = setting.get('template');
					}
					$('#InputComment').val(_temp);
					$('[name=inputResult]:checked').prop('checked',false);
					$('[name=inputStage]:checked').prop('checked',false);
					$('#inputKill').val('');
					$('#inputDeath').val('');
					var h = $('.js-inputFormView').offset();
					console.log(h);
					console.log(h.top);

					$('body,html').animate({
						scrollTop:h.top+'px'
					},500);
				}
			});
			return false;
		}
	},
	initialize:function(){
	},
});
app.instans.View.InputWrap = Marionette.View.extend({
	el:'.js-inputWrapView',
	view:{
		setting:null,
		form:null
	},
	initialize:function(){
		//VIEW SETTING --------------------------------------------
		// setting = 基本設定 , form = 戦績入力
		var self = this;
		this.view.setting = new app.instans.View.BasicInputForm({
			model:{
				setting:this.model.setting,
			}
		});
		console.log(this.view.setting);
		this.view.setting.parentView = this;

		this.view.form = new app.instans.View.InputForm({
			model:{
				setting:this.model.setting
			},
			collection:this.collection,
		});
		this.view.form.parentView = this;

		console.log(this.view.form);
		//LISTENTO SETTING ------------------------------------------
		var view = this.view;
		//weaponマスタ取得後に基本設定のブキにoptionを入れる
		view.setting.listenTo(this.model.weapon,'sync',function(res){
			self.weaponGenNode();
		});
		//stageマスタ取得後に基本設定のステージにoptionを入れる
		view.setting.listenTo(this.model.stage,'sync',function(res){
			self.stageGenNode();
		});
		//ストレージに保存されているsettingがあった場合フォームにそれらを前もって入れてあげる。
		// view.setting.listenTo(this.model.setting,'sync',function(res){
		// 	
		// });

		//基本設定が変更されると戦績のUIが変更されるようにする。
		//basicviewを反映させるためchange
		this.listenTo(this.model.setting,'change',this.setSettingChange);

		//fetchs マスタを持っていなかった場合のみfetchする。
		if(!this.model.weapon.has('weapons') || !this.model.stage.has('stage')){
			$.when(
				this.model.weapon.fetch(),
				this.model.stage.fetch()
			).done(function(){
				console.log(0);
				console.log(self.model.setting);
				//ブキ、ステージのセレクトが入った後に基本設定に変更が無ければ設定をfetchする
				if(!self.model.setting.hasChanged()){
					self.model.setting.fetch({sync:true}).done(function(res){
						console.log(res);
						//戦績入力部分
						self.setSettingFetch();

						//基本設定部分
						self.setLoadSetting();

					}).fail(function(res){
						if(res === 'Record Not Found'){
							self.inputStageSelectGen();
						}
						console.log(res);
					});

				}
			});
		}
		console.log(this.model.setting.hasChanged());

	},
	inputStageSelectGen:function (){
		//基本設定でステージを過去弄っていなければ戦績にステージを全部出す。
		if(!this.model.setting.has('stage')){
			//初期化
			var vals = this.model.stage.get('stage');
			var node = app.funcs.radioGen(this.model.stage.get('stage'),'inputStage');
			console.log(vals);
			$('#inputStageWrap').html(node);
		}else{
			console.log(this);
			this.setSettingFetch();
		}
	},
	weaponGenNode:function(){
		var node = '';
		node = app.funcs.optionGen(this.model.weapon.get('weapons'));
		$(this.view.setting.el).find('#basicInputWeapon').html(node);
	},
	stageGenNode:function(){
		var node = '';
		node = app.funcs.checkboxGen(this.model.stage.get('stage'),'basicInputStage');
		$(this.view.setting.el).find('#basicInputStage').html(node);
	},
	setSetting:function(a,b,c){
		console.log(a);
		console.log(b);
		console.log(c);
	},
	setSettingFetch:function(){
		//設定がFetch、変更されたときに戦績入力画面にデータを入れてあげる。
		//fetch && stage があること前提
		var change = this.model.setting.changed;
		var node = '';
		if('stage' in change){
			//指定しないを選択しているかどうか
			var isNone = $.inArray('none',change.stage) !== -1;

			if(!isNone){
				node = app.funcs.radioGen(change.stage,'inputStage');
			}else{
				node = app.funcs.radioGen(this.model.stage.get('stage'),'inputStage');
			}
			//DOM差し込みと、指定なしを削除
			$('#inputStageWrap').html(node).find('li').eq(0).remove();

		}
		if('template' in change){
			$('#InputComment').val(change.template);
		}

	},
	setSettingChange:function(model){
		console.log('setSettingChange');
		this.setSettingFetch();
	},
	setLoadSetting:function(){
		//setting Fetch時に 読み込んだデータを基本設定に入れてあげる。
		console.log('setLoadSetting fire');
		var setting = this.model.setting.toJSON();
		var self = this;

		console.log(this.model.setting.has('udemae'));
		if(this.model.setting.has('udemae')) {
			$('#basicInputUdemae').val(setting.udemae);
		}
		if(this.model.setting.has('rule')) {
			$('#basicInputRule').val(setting.rule);
		}
		if(this.model.setting.has('weapon')) {
			$('#basicInputWeapon').val(setting.weapon);
		}
		if(this.model.setting.has('template')) {
			$('#basicInputComment').val(setting.template);
		}
		if(this.model.setting.has('stage')){
			_.each(setting.stage,function(d,i){
				$('[name="basicInputStage"][value="'+d+'"]').prop('checked',true);
			});
			console.log(this.view.form);
			console.log(this.view.setting);
			this.view.setting.checkboxControll();
		}
	},

});

//output
app.instans.View.OutputWrapView = Marionette.View.extend({
	el:'.outputPageBlock',
	ui:{
		edit:'.js-edit'
	},
	events:{
		'click @ui.edit':'editFunction'
	},
	initialize:function(){
		var self = this;
		this.view = {};
		this.view.scoreView  = new app.instans.View.ScoreList({
			collection:self.collection
		});
		this.view.filterView = new app.instans.View.outputFileter({
			model:self.model.filter
		});
		this.view.editView = new app.instans.View.Edit({
			collection:self.collection,
			model:{
				weapon : self.model.weapon,
				stage  : self.model.stage,
				result : app.const,
				users  : app.model.users
			}
		});

		$('.js-editFormWrap').hide();
		$('.outputViewBlock').show();
	},
	editFunction:function(e){
		var pos     = $(window).scrollTop();
		var modelId = $(e.currentTarget).data('modelid');
		var model   = this.collection.get(modelId);
		console.log(model)
		this.view.editView.modelId = modelId;
		$('.editFormWrap').show();
		$('.outputViewBlock').hide();
		this.view.editView.setDataFunc();

	}

});
app.instans.View.ScoreItem = Marionette.ItemView.extend({
	template:'#outputListTemp',
	tagName:'div',
	className:'viewBlock',
	templateHelpers:{
		_result:function(){
			if(!this.result) return '未登録';
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
			return _stage;
		}
	},
	initialize:function(){

	},
});

app.instans.View.ScoreList = Marionette.CompositeView.extend({
	el:'#outputListWrap',
	template:'#outputListWrapTemp',
	childView:app.instans.View.ScoreItem,
	childViewContainer:function(){
		return '#sectionBlockWrap';
	},
	initialize:function(){
		this.listenTo(this.collection,'sync',this.math);
		this.listenTo(this.collection,'sync',this.isNull);
		this.listenTo(this.collection,'sync',this.render);
		this.collection.fetch();
		this.math();
		this.isNull();
	},
	attachHtml:function(collectionView, childView){
		console.log(collectionView)
		console.log(childView)
		collectionView.$el.find('.sectionBlock').prepend(childView.el);
	},
	math:function(){
		var killRatio,killAvg,winRatio;
		var len        = this.collection.length;
		var killTotal  = 0;
		var deathTotal = 0;
		var winlose    = [0,0];
		console.log(this.collection);
		_.each(this.collection.models,function(model,i){
			killTotal  = (!model.get('kill'))  ? 0 : killTotal + parseInt(model.get('kill'));
			deathTotal = (!model.get('death')) ? 0 : deathTotal + parseInt(model.get('death'));
			if(model.get('result') === '0' || model.get('result') === '1' ){
				winlose[0]++;
			}else if(model.get('result') === '2' || model.get('result') === '3' ){
				winlose[1]++;
			}
		});

		//0だと計算がおかしくなるため1にする
		// if(killTotal === 0)  killTotal  = 1;
		// if(deathTotal === 0) deathTotal = 1;
		// if(winlose[0] === 0) winlose[0] = 1;
		// if(winlose[1] === 0) winlose[1] = 1;
		console.log('k' + killTotal + ' d:' +  deathTotal + ' winlose[0]:' + winlose[1] + 'winlose[1]' + winlose[1]);
		console.log('ratio:'+ (killTotal / deathTotal) );
		console.log('avg:'+ (killTotal / deathTotal) );
		if(killTotal === 0 && deathTotal === 0){
			killRatio = 0;
		}else if(killTotal === 0 || deathTotal === 0){
			var _ary = [killTotal,deathTotal];
			killRatio = Math.max.apply(null,_ary);
		}else{
			killRatio = Math.floor( (killTotal / deathTotal) * 100 ) / 100;
		}

		killAvg   = [ 
						Math.floor( (killTotal / len) * 100) / 100 ,
						Math.floor( (deathTotal / len) * 100) / 100
					];
		winRatio  = Math.floor( (winlose[0] / len) * 100 );
		console.log('killRatio:' + killRatio + ' killAvg:' + killAvg + ' winRatio:' + winRatio);

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

});

//output edit
app.instans.View.Edit = Marionette.View.extend({
	el:'.js-editFormWrap',
	ui:{
		closeBtn:'.js-returnButton',
		input:'#editDeath,#editKill,#editComment,#editTimestampDate,#editTimestampTime',
		select:'#editUdemae,#editRule,#editWeapon,#editUser',
		radio:'[name=editStage],[name=editResult]'
	},
	events:{
		'click @ui.closeBtn':'returnFunc',
		'blur @ui.input':'changeInput',
		'blur @ui.select':'changeSelect',
		'change @ui.radio':'changeRadio',
	},
	modelId:'',
	returnFunc:function(){
		$('.js-editFormWrap').hide();
		$('.outputViewBlock').show();
	},
	initialize:function(){
		this.genDatasFunc();
	},
	genDatasFunc:function(){
		var self = this;
		console.log(_.isEmpty(this.model.stage.toJSON()))
		if(_.isEmpty(this.model.stage.toJSON())){
			console.log(this)
			this.model.stage.fetch().done(function(res){
				self.genStageFunc();
			}).always(function(res){
				console.log(res)
			})

		}else{
			this.genStageFunc();
		}
		if(_.isEmpty(this.model.weapon.toJSON())){
			console.log(this)
			this.model.weapon.fetch().done(function(){
				self.genWeaponFunc();
			})
		}else{
			this.genWeaponFunc();
		}

		if(_.isEmpty(this.model.users.toJSON())){
			this.model.users.fetch().done(function(){
				self.genUsersFunc();
			})
		}else{
			this.genUsersFunc();
		}
	},
	genWeaponFunc:function(){
		var node = '';
		console.log('genwepons start')
		node = app.funcs.optionGen(this.model.weapon.get('weapons'));
		$(this.el).find('#editWeapon').html(node);
	},
	genStageFunc:function(){
		var node = '';
		console.log(this.model.stage)
		node = app.funcs.radioGen(this.model.stage.get('stage'),'editStage');
		$(this.el).find('#editStageWrap').html(node);
	},
	genUsersFunc:function(){
		console.log(this.model.users.toJSON())
		node = '';
		node = app.funcs.optionObjGen(this.model.users.toJSON(),'id','name');
		$(this.el).find('#editUser').html(node);
	},
	setDataFunc:function(){
		var model = this.collection.get(this.modelId);
		var date = moment(model.get('date')).format('YYYY-MM-DD');
		var time = moment(model.get('date')).format('HH:mm:ss');
		$('#editUdemae').val(model.get('udemae'));
		$('#editRule').val(model.get('rule'));
		$('#editKill').val(model.get('kill'));
		$('#editDeath').val(model.get('death'));
		$('#editResult_'+model.get('result')).prop('checked',true);
		$('#editComment').val(model.get('comment'));
		$('#editTimestampDate').val(date);
		$('#editTimestampTime').val(time);

		//他Modelとの連携が必要
		$('[name=editStage][value="'+model.get('stage')+'"]').prop('checked',true);
		$('#editWeapon').val(model.get('weapon'));
		$('#editUser').val(model.get('userid'));
	},
	changeInput:function(e){
		var self = this;
		var model = this.collection.get(this.modelId)
		var id = $(e.currentTarget).attr('id');
		var key = '';
		var val = '';
		var setData = {};
		if( id === 'editTimestampDate') key = 'date';
		if( id === 'editTimestampTime') key = 'date';
		if( id === 'editKill')          key = 'kill';
		if( id === 'editDeath')         key = 'death';
		if( id === 'editComment')       key = 'comment';
		if(key === 'date'){
			val = $('#editTimestampDate').val() +' '+ $('#editTimestampTime').val();
		}else{
			val = $(e.currentTarget).val();
		}
		setData[key] = val
		model.set(setData);
		model.save();
	},
	changeSelect:function(e){
		var model = this.collection.get(this.modelId)
		var id = $(e.currentTarget).attr('id');
		var key = '';
		var val = '';
		var setData = {};

		if( id === 'editUdemae' )       key = 'udemae';
		if( id === 'editRule')          key = 'rule';
		if( id === 'editWeapon')        key = 'weapon';
		if( id === 'editUser')          key = 'userid';
		val = $(e.currentTarget).val();

		setData[key] = val;
		model.set(setData);
		model.save();

	},
	changeRadio:function(e){
		var model = this.collection.get(this.modelId)
		var name = $(e.currentTarget).attr('name');
		var key = '';
		var val = '';
		var setData = {};

		if( name === 'editStage' )  key = 'stage';
		if( name === 'editResult' ) key = 'result';
		val = $('[name='+name+']:checked').val();
		setData[key] = val;
		model.set(setData).save();
	},
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
		console.log(this.ui.userChangeForm);
		this.listenTo(this.collection.users,'change',this.setSelectUser);
		this.listenTo(this.collection.users,'update',this.setSelectUser);

		this.setSelectUser();
	},
	setSelectUser:function(){
		var node = '';
		_.each(this.collection.users.toJSON(),function(user,i){
			node += '<option value="' + user.id + '">' + user.name + '</option>';
		});
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
		});
		$(this.ui.userAddForm).find('#addUserName').val('');
		alert('ユーザー：' + username + 'を追加しました。\nアカウント変更から変更できます。');
	},
	userDel:function(e){
		var self = this ;
		console.log(this.collection.users);
		if(this.collection.users.length === 1){
			alert('これ以上ユーザーを削除できません。');
			return;
		}
		var modelId = $(this.ui.userDelForm).find('select').val();
		var userdata = this.collection.scores.where({'userid':modelId});
		var delYes = window.confirm('ユーザーに紐づいたスコア '+userdata.length+' 件もすべて削除してしまいます。\nよろしいですか？');
		if(!delYes) return;

		//scoreを削除
		_.each(userdata,function(user,i){
			self.collection.scores.get(user.id).destroy();
		});
		//userを削除後selectを再描画
		this.collection.users.get(modelId).destroy().always(function(res){
			self.setSelectUser();
			alert('削除しました');
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
		var delYes = window.confirm('ユーザーやスコアすべてを削除してしまいます。\nよろしいですか？');
		if(!delYes) return ;
		_.each(app.model.users.models,function(user,i){
			console.log(user);
			user.destroy();
		});
		_.each(app.model.scores.models,function(score,i){
			console.log(score);
			score.destroy();
		});
		localStorage.clear();
		location.reload();
	},
});
