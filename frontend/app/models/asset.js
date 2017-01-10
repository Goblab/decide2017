import DS from 'ember-data';
import config from '../config/environment';

export default DS.Model.extend({
	owner: DS.belongsTo('user', {async: true}),
	fileName: DS.attr('string'),
	path: DS.attr('string'),
	type: DS.attr('string'),

	url: function () {
		return config.adapter.fileUrl + this.get('path');
	}.property('fileName', 'path'),

	fileType: function () {
		if (this.get('type')) {
			switch (this.get('type')) {
				case 'image/jpeg':
					return 'asset-preview-image';
					break;
				case 'image/png':
					return 'asset-preview-image';
					break;					
				case 'image/svg+xml':
					return 'asset-preview-image';
					break;			
				case 'application/pdf':
					return 'asset-preview-pdf';
					break;
				case 'video/mp4':
					return 'asset-preview-video';
					break;
				case 'audio/mp3':
					return 'asset-preview-audio';
					break;
				default:
					return 'asset-preview-file';
					break;
			}
		} else {
			return null;
		}
	}.property('type'),

	properties: function () {
		return {id: this.get('id'), fileName: this.get('fileName'), url: this.get('url')};
	}.property('type', 'fileName', 'path', 'url'),
});