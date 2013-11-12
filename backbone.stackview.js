(function (_, Backbone) {

  'use strict';

  Backbone.StackView = Backbone.View.extend({
    stack: [],
    isAnimating: false,
    defaults: {
      animationPrefix: 'animated ',
      defaultPushAnimation: 'slideInRight',
      defaultPopAnimation: function (pushAnimation) {
        return pushAnimation.replace('In', 'Out');
      }
    },
    initialize: function (options) {
      options = options || {};
      this.options = _.defaults({}, this.defaults, options);
    },
    push: function (viewIn, viewInAnimation, viewOutAnimation) {
      if (this.isAnimating) { return false; }

      if (viewOutAnimation) {
        viewOutAnimation = this.options.animationPrefix + viewOutAnimation;
        var viewOut = _.last(this.stack).view;
        var viewOutAnimationEnd = function () {
          viewOut.$el.removeClass(viewOutAnimation);
          viewOut.$el.off('webkitAnimationEnd', viewOutAnimationEnd);
        };
        viewOut.$el.on('webkitAnimationEnd', viewOutAnimationEnd);
        viewOut.$el.addClass(viewOutAnimation);
      }

      if (viewInAnimation !== false) {
        viewInAnimation = viewInAnimation || this.options.defaultPushAnimation;
        viewInAnimation = this.options.animationPrefix + viewInAnimation;
        var viewInAnimationEnd = _.bind(function (e) {
          viewIn.$el.removeClass(viewInAnimation);
          viewIn.$el.off('webkitAnimationEnd', viewInAnimationEnd);
          this.isAnimating = false;
        }, this);
        this.isAnimating = true;
        viewIn.$el.on('webkitAnimationEnd', viewInAnimationEnd);
        viewIn.$el.addClass(viewInAnimation);
      }

      this.stack.push({view: viewIn, animation: viewInAnimation});
      this.$el.append(viewIn.render().$el);
    },
    pop: function (viewOutAnimation, viewInAnimation) {
      if (this.isAnimating || !this.stack.length) { return false; }

      if (viewInAnimation && this.stack.length > 1) {
        viewInAnimation = this.options.animationPrefix + viewInAnimation;
        var viewIn = _.first(_.last(this.stack, 2)).view;
        var viewInAnimationEnd = function () {
          viewIn.$el.removeClass(viewInAnimation);
          viewIn.$el.off('webkitAnimationEnd', viewInAnimationEnd);
        };
        viewIn.$el.on('webkitAnimationEnd', viewInAnimationEnd);
        viewIn.$el.addClass(viewInAnimation);
      }

      var lastItem = _.last(this.stack);
      var lastItemIndex = _.indexOf(this.stack, lastItem);
      var viewOut = lastItem.view;

      if (viewOutAnimation !== false) {
        var popAnimation = _.isString(this.options.defaultPopAnimation)
          ? this.options.defaultPopAnimation
          : (lastItem.animation !== false
             ? this.options.defaultPopAnimation.call(this, lastItem.animation)
             : 'fadeOut');
        viewOutAnimation = viewOutAnimation || popAnimation;
        viewOutAnimation = this.options.animationPrefix + viewOutAnimation;
        var onAnimationEnd = _.bind(function (e) {
          viewOut.$el.removeClass(viewOutAnimation);
          viewOut.$el.off('webkitAnimationEnd', onAnimationEnd);
          viewOut.undelegateEvents().remove();
          this.stack.splice(lastItemIndex, 1);
          this.isAnimating = false;
        }, this);
        this.isAnimating = true;
        viewOut.$el.on('webkitAnimationEnd', onAnimationEnd);
        viewOut.$el.addClass(viewOutAnimation);
      } else {
        viewOut.undelegateEvents().remove();
        this.stack.splice(lastItemIndex, 1);
      }
    }
  });

}(this._, this.Backbone));
