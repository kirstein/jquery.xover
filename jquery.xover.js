(function($) {

    var Xover = function(el, value, options) {
            if (typeof value === "undefined") {
                throw new Error("Value can't be undefined");
            }
            this.el      = el;
            this.$el     = $(el);
            this.options = options;
            this.value   = $.trim(value);
            this.text    = $.trim(this.$el.text());
    };

    Xover.prototype.init = function() {
        if (this.text !== this.value) {
            this.writeEl();
            this.writeTransformEl();
            this.manipulateEl();
        }
    };

    Xover.prototype.writeTransformEl = function() {
        var firstChange = this.getFirstChangePos(),
            $el, $appendElement, i;

        for (i = firstChange; i < this.value.length; i += 1) {
            $el = $('<span/>', {
                'class' : this.options.elClass + ' ' + this.options.elChangeClass,
                'text'  : this.value[i],
                'style' : 'display:none'
            });
            
            $el.appendTo(this.$el);
        }                
    };

    Xover.prototype.manipulateEl = function() {
        var root        = this,
            firstChange = this.getFirstChangePos(),
            $changeEls, $transisionEls, leftOffset;

        if (typeof firstChange !== 'undefined') {
            
            // List all elements that come after changed element.
            // Animate main elements.
            $changeEls = this.$el.children('span.' + this.options.elClass)
                             .filter(':nth-child(' + firstChange + ')')
                             .nextAll();

            // If no elements were found get all spans with elClass class.
            if (!$changeEls.length) {
                $changeEls = this.$el.children('span.' + this.options.elClass);
            }
            
            // Animate only spans without elChangeClass class.
            $transisionEls = $changeEls.filter(':not(.' + this.options.elChangeClass + ')')
                      .addClass(this.options.elTransision)
                      .animate({ 'top' : this.options.offset,
                                 'opacity' : '0' 
                               }, this.options.speed, function() {
                          $(this).remove(); 
                      });

            leftOffset = '-' + $transisionEls.length * $($transisionEls[0]).width() + 'px';

            this.$el.children('span.' + root.options.elChangeClass)
                .addClass(this.options.elTransision)
                .css({ left: leftOffset, 
                       top: '-' + this.options.offset
                }).show()
                .animate({ 'top' : '0' }, this.options.speed, function() {
                    $(this).removeClass(root.options.elChangeClass)
                           .removeClass(root.options.elTransision)
                           .css({ left : 0 });
                    }); 
        } 
    };

    /**
     * Returns the first changed character in the comparson to old and new value.
     */
    Xover.prototype.getFirstChangePos = function() {
         for (var i = 0; i < this.value.length; i += 1) {
             if (this.text.length < i || this.value[i] !== this.text[i]) {
                return i;
             }
         }
         if (this.value.length < this.text.length) {
            return this.value.length;
         }
    };

    Xover.prototype.writeEl = function() {
        var text = $.trim(this.$el.text()),
            $el  = $();

        for (i = 0; i < text.length; i += 1) {
            $el = $el.add('<span/>', {
                'class' : this.options.elClass,
                'text'  : text[i]
            });
        }
        this.$el.html($el);
    };

    $.fn.xover = function(value, options) {
        var root = this;

        if (typeof val === 'object' && typeof opt === 'undefined') {
            options = value;
            value   = option.value;
        }
        options = $.extend({}, $.fn.xover.options, options);
        return this.each(function() {
            new Xover(this, value, options).init();
        });
    };

    $.fn.xover.options = {
        value    : undefined,
        elClass  : 'xover-el',
        elChangeClass : 'xover-change',
        elTransision : 'xover-transision',
        speed    : 'slow',
        offset   : '10px'
    };
})(jQuery);
