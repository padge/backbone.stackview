(function (Backbone) {

  'use strict';

  Backbone.StackView = Backbone.View.extend({
    stack: [],
    isAnimating: false,
    initialize: function (options) {
      options || (options = {});
      this.animationPrefix = options.animationPrefix || 'animated ';
      this.defaultPushAnimation = options.defaultPushAnimation || 'slideInRight';
      this.defaultPopAnimation = options.defaultPopAnimation || function (pushAnimation) {
        return pushAnimation.replace('In', 'Out');
      };
    },
    push: function (viewIn, viewInAnimation, viewOutAnimation, callback) {
      if (this.isAnimating) return false;

      if (viewOutAnimation) {
        viewOutAnimation = this.animationPrefix + viewOutAnimation;
        var viewOut = _.last(this.stack).view;
        var viewOutAnimationEnd = function () {
          viewOut.$el.removeClass(viewOutAnimation);
          viewOut.$el.off('webkitAnimationEnd', viewOutAnimationEnd);
        };
        viewOut.$el.on('webkitAnimationEnd', viewOutAnimationEnd);
        viewOut.$el.addClass(viewOutAnimation);
      }

      if (viewInAnimation !== false) {
        viewInAnimation || (viewInAnimation = this.defaultPushAnimation);
        viewInAnimation = this.animationPrefix + viewInAnimation;
        var viewInAnimationEnd = _.bind(function (e) {
          viewIn.$el.removeClass(viewInAnimation);
          viewIn.$el.off('webkitAnimationEnd', viewInAnimationEnd);
          this.isAnimating = false;
          if (callback) callback.call(this, e);
        }, this);
        this.isAnimating = true;
        viewIn.$el.on('webkitAnimationEnd', viewInAnimationEnd);
        viewIn.$el.addClass(viewInAnimation);
      }

      this.stack.push({view: viewIn, animation: viewInAnimation});
      this.$el.append(viewIn.render().$el);
    },
    pop: function (viewOutAnimation, viewInAnimation, callback) {
      if (this.isAnimating || !this.stack.length) return false;

      if (viewInAnimation && this.stack.length > 1) {
        viewInAnimation = this.animationPrefix + viewInAnimation;
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
        var popAnimation = _.isString(this.defaultPopAnimation)
          ? this.defaultPopAnimation
          : (lastItem.animation !== false
             ? this.defaultPopAnimation.call(this, lastItem.animation)
             : 'fadeOut');
        viewOutAnimation || (viewOutAnimation = popAnimation);
        viewOutAnimation = this.animationPrefix + viewOutAnimation;
        var onAnimationEnd = _.bind(function (e) {
          viewOut.$el.removeClass(viewOutAnimation);
          viewOut.$el.off('webkitAnimationEnd', onAnimationEnd);
          viewOut.undelegateEvents().remove();
          this.stack.splice(lastItemIndex, 1);
          this.isAnimating = false;
          if (callback) callback.call(this, e);
        }, this);
        this.isAnimating = true;
        viewOut.$el.on('webkitAnimationEnd', onAnimationEnd);
        viewOut.$el.addClass(viewOutAnimation);
      } else {
        viewOut.undelegateEvents().remove();
        this.stack.splice(lastItemIndex, 1);
        callback();
      }
    },
    replace: function (viewIn, viewInAnimation, viewOutAnimation, callback) {
      var lastItem = _.last(this.stack);
      var lastItemIndex = _.indexOf(this.stack, lastItem);
      var _callback = _.bind(function () {
        lastItem.view.undelegateEvents().remove();
        this.stack.splice(lastItemIndex, 1);
        if (callback) callback.apply(this, arguments);
      }, this);
      this.push.call(this, viewIn, viewInAnimation, viewOutAnimation, _callback);
    },
    clear: function () {
      _.each(this.stack, function (item) {
        item.view.undelegateEvents().remove();
      });
      this.stack = [];
    }
  });

}(this.Backbone));
