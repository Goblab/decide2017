import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('login');


  this.route('result', function() {
    this.route("view", {     
      path: ":guest_id/view"
    });
  });

  this.route("candidates", function() {
    this.route('presidents');
    this.route('assemblymen');
    
    this.route("view", {     
      path: ":candidate_id/view"
    });
  });

  this.route("alliances", function() {
    this.route("view", {     
      path: ":alliance_id/view"
    });
  });


  this.route('admin', function () {
      this.route("users", function() {
        this.route("new");

        this.route("edit", {
          path: ":user_id/edit"
        });

        this.route("show", {
          path: ":user_id"
        });
      });

      this.route("categories", function() {
        this.route("new");
        this.route("edit", {
          path: ":category_id/edit"
        });
      });
      
      this.route("positions", function() {
        this.route("new");
        this.route("edit", {
          path: ":position_id/edit"
        });
      });

      this.route("sections", function() {
        this.route("new");
        this.route("edit", {
          path: ":section_id/edit"
        });
      });      

      this.route("questions", function() {
        this.route("new");
        this.route("edit", {
          path: ":question_id/edit"
        });
      });

      this.route("alliances", function() {
        this.route("new");
        this.route("edit", {
          path: ":alliance_id/edit"
        });
      });

      this.route("candidates", function() {
        this.route("new");
        this.route("edit", {
          path: ":candidate_id/edit"
        });
      });   

  });
  this.route('methodology');
  this.route('papeletas');
});

export default Router;
