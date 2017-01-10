import Ember from 'ember';
import layout from '../templates/components/upload-file';
import config from '../config/environment';

export default Ember.Component.extend({
	store: Ember.inject.service('store'),

	layout: layout,
	folder: 'images',
	url: '',
	percent: 0,
	formId: 'upload',
	notAllowedFiles: false,
	multiple: true,
	changed: false,
	filesUpluad: [],
	progress: 0,
	clear: true,
	t: 'message',
	showLoader: false,

	actions: {
		delete: function (fileId) {
			var file = this.get('filesUpluad').findBy('id', fileId);
			if (file) {
				this.get('filesUpluad').removeObject(file)
				file.destroyRecord();
			}
		},
	},


	typeChanged: function () {

		this.set(type, t);
	}.observes('t'),

	clearAssets: function () {
		this.set('filesUpluad', []);
	}.observes('clear'),

	progressChanged: function () {
		this.$('.meter').css({width: this.get('_progress') + '%'});
	}.observes('_progress'),

	fileChange: function () {
		var _self = this;
		var formData = new FormData(this.$('#' + this.get('formId'))[0]);
		var files = [];
		this.set('filesUpluad', []);
		this.set('_progress', 0);
		$.ajax({
			url: config.adapter.upload,
			type: 'POST',
			data: formData,
			cache: false,
			contentType: false,
			processData: false,  
			xhrFields: {
				onprogress: function (progress) {
					var percentage = Math.floor((progress.total / progress.totalSize) * 100);
					_self.set('_progress', percentage);
					if (percentage === 100) {

					}
				}
			},
			success: function(payload)
			{	
				var promises = [];
				var store = _self.get('store');
				if (_self.get('multiple') == true) {
					payload.file.forEach(function (file) {
						var newFile = store.createRecord('asset', {path: file.fd, fileName: file.filename, type: file.type, owner: _self.get('session.account')});
						promises.push(newFile.save());
					});

					Ember.RSVP.all(promises).then(function (promises) {
						promises.forEach(function (file) {
							files.pushObject(file);
						});
						_self.set('files', files);
						_self.set('filesUpluad', files);
						_self.set('changed', true);
					});								
				} else {
					payload.file.forEach(function (file) {
						var newFile = store.createRecord('asset', {path: file.fd, fileName: file.filename, type: file.type, owner: _self.get('session.account')});
						newFile.save().then(function (f) {
							if (_self.get('files')) {
								_self.get('files').pushObject(f);
							} else {
								_self.set('file', f);
							}
							_self.get('filesUpluad').pushObject(file);
							_self.set('changed', true);
						})
					});					
				}
			}
		});
	}.observes('url'),
});