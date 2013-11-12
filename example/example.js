(function ($, Backbone) {

  'use strict';

  var Page = Backbone.View.extend({
    tagName: 'section',
    events: {
      'click .slideInRight': function () {
        stackView.push(new Page(), 'slideInRight', 'fadeOut');
      },
      'click .slideOutRight': function () {
        stackView.pop('slideOutRight', 'fadeIn');
      },
      'click .slideInBottom': function () {
        stackView.push(new Page(), 'slideInBottom');
      },
      'click .slideOutBottom': function () {
        stackView.pop('slideOutBottom', 'fadeIn');
      },
      'click .fadeIn': function () {
        stackView.push(new Page(), 'fadeIn');
      },
      'click .fadeOut': function () {
        stackView.pop('fadeOut');
      },
      'click .pop': function () {
        stackView.pop();
      },
      'click .slideInRightReplace': function () {
        stackView.replace(new Page(), 'slideInRight', 'slideOutLeft');
      },
      'click .slideInLeftReplace': function () {
        stackView.replace(new Page(), 'slideInLeft', 'slideOutRight');
      }
    },
    render: function () {
      this.$el.html('<button class="slideInRight">Slide In Right</button>' +
                    '<button class="slideOutRight">Slide Out Right</button><br>' +
                    '<button class="slideInBottom">Slide In Bottom</button>' +
                    '<button class="slideOutBottom">Slide Out Bottom</button><br>' +
                    '<button class="fadeIn">Fade In</button>' +
                    '<button class="fadeOut">Fade Out</button><br>' +
                    '<button class="pop">Pop</button><br>');
      return this;
    }
  });

  $(function () {
    window.stackView = new Backbone.StackView({el: '#stack'});
    window.stackView.push(new Page(), false);
  });

}(this.jQuery, this.Backbone));
