backbone.stackview
==================

Backbone.StackView manages your views on a stack with in *and out* CSS3 animations.

**Note:** This is very much still a work in progress/experiment. It has only
been tested on Chrome and iOS Safari.

By default Backbone.StackView works well with [Animate.css](https://daneden.me/animate/ "Animate.css").
However, backbone.stackview.css adds some animations not present in Animate.css, such as
slideInBottom and slideOutBottom.

## API

### initialize(options)
### push(viewIn, [viewInAnimation], [viewOutAnimation])
### pop([viewOutAnimation], [viewInAnimation])
