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
            $wrap = $('<span />', {
                'class' : this.options.elTransition
            }), i;

        this.$el.append($wrap);
        for (i = firstChange; i < this.value.length; i += 1) {
            $('<span/>', {
                'class' : this.options.elClass,
                'text'  : this.value[i]
            }).appendTo($wrap);
        }
    };

    Xover.prototype.manipulateEl = function() {
        var firstChange = this.getFirstChangePos();

        if (typeof firstChange !== 'undefined') {

            this.animateOldItems();
            this.animateNewItems();

        }
    };

    Xover.prototype.animateNewItems = function() {
        var firstChange = this.getFirstChangePos(),
            leftOffset  = '-' + (this.text.length - firstChange) * this._elWidth + 'px',
            root        = this,
            cssValues, animateValues;

        animateValues = { 'margin-top' : 0 };
        cssValues = { 'margin-left': leftOffset,
                      'margin-top' : '-' + this.options.offset,
                      'display'    : 'visible'
                    };

        function afterAnimate() {
            $(this).removeClass(root.options.elTransition)
                   .css({ 'margin-left' : 0 })
                   .children().unwrap();
        }
        this.$el.children('span.' + this.options.elTransition).css(cssValues).animate(animateValues, this.options.speed, afterAnimate);
    };

    Xover.prototype.animateOldItems = function() {
        var firstChange = this.getFirstChangePos(),
            $elToChange = this.$el.children('span.' + this.options.elClass),
            animateValues;

        if (firstChange) {
            $elToChange = $elToChange.filter(':nth-child(' + firstChange + ')').nextAll();
        }

        animateValues = { 'top' : this.options.offset,
                          'opacity' : 0
                        };

        function afterAnimate() {
            $(this).remove();
        }

        $elToChange.filter(':not(.' + this.options.elTransition + ')')
                   .animate(animateValues, this.options.speed, afterAnimate);
    };

    /**
     * Returns the first changed character in the comparison to old and new value.
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
            $el  = $(), i;

        for (i = 0; i < text.length; i += 1) {
            $el = $el.add('<span/>', {
                'class' : this.options.elClass,
                'text'  : text[i]
            });
        }
        this.$el.html($el);
        // Save the length of the first element
        this._elWidth = $($el[0]).width();
    };

    $.fn.xover = function(value, options) {
        if (typeof value === 'object' && typeof options === 'undefined') {
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
        elTransition : 'xover-transition',
        speed    : 'slow',
        offset   : '10px'
    };
})(jQuery);
