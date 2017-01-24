import Ember from 'ember';

export default Ember.Component.extend({
  
  socialApiClient: Ember.inject.service('facebook'), 

  tagName: 'div', 
  
  postToFeed: function (title, desc, url, image, caption) {
      var obj = {method: 'feed', link: url, picture: image, name: title, description: desc, caption: caption, redirect_uri: url, display: 'popup'};

      function callback(response) { console.log(response); }

      if (this.FB) {
        FB.ui(obj, callback);
      } else {
        this.get('socialApiClient').load().then(function(FB) {
          FB.ui(obj, callback);
        });
      }      
  },

  showShareDialog: function(e){
    
    var title = this.get('data-title'),
        desc = this.get('data-desc'),
        url = this.get('url'),
        caption = this.get('data-caption'),
        image = this.get('image');

    		this.postToFeed(title, desc, url, image, caption);
 			

  }.on('click')
});