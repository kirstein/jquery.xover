/**
 * jQuery xover plugin v0.2
 */
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

    /**
     * Checks if the text is not the same as the value.
     * If its not the same writes out the new elements listing and animates them.
     */
    Xover.prototype.init = function() {
        if (this.text !== this.value) {
            // Mark the position of the first change
            this._changePos = this.getFirstChangePos();

            this.writeEl();
            this.writeTransformEl();
            this.manipulateEl();
        }
    };

    /**
     * Write temporary new values after the first changed value
     * New values will be wrapped in span.
     * Newly generated span will be appended to the element.
     */
    Xover.prototype.writeTransformEl = function() {
        var $wrap = $('<span />', {
                'class' : this.options.elTransition
            }), i;

        // Append the wrapper
        this.$el.append($wrap);

        // Loop through all the changed values. Append them to the wrapper in order
        for (i = this._changePos; i < this.value.length; i += 1) {
            $('<span/>', {
                'class' : this.options.elClass,
                'text'  : this.value[i]
            }).appendTo($wrap);
        }
    };

    /**
     * Animate changes to page.
     */
    Xover.prototype.manipulateEl = function() {
        if (typeof this._changePos !== 'undefined') {

            this.animateOldItems();
            this.animateNewItems();

        }
    };


    /**
     * Animate changed items to page.
     * Will position the wrapper with elements on top of the elements needed to be changed.
     * Animates the wrapper. After the animations have been done will unwrap the elements.
     */
    Xover.prototype.animateNewItems = function() {
        var leftOffset  = '-' + (this.text.length - this._changePos) * this._elWidth + 'px',
            root        = this,
            cssValues, animateValues;

        animateValues = { 'margin-top' : 0 };
        cssValues = {
                      'margin-left': leftOffset,
                      'margin-top' : '-' + this.options.offset,
                      'display'    : 'visible'
                    };

        // Animation callback.
        // Moves the wrapper back and unwraps elements.
        function afterAnimate() {
            $(this).css({ 'margin-left' : 0 })
                   .children().unwrap();
        }

        // Animation logic.
        this.$el.children('span.' + this.options.elTransition).css(cssValues).animate(animateValues, this.options.speed, afterAnimate);
    };

    /**
     * Animate changed elements.
     * Will search for all elements after the changed element.
     * Will animate all found elements and remove them at the end of the animation.
     */
    Xover.prototype.animateOldItems = function() {
        // Selects all elements with target class.
        var $elToChange = this.$el.children('span.' + this.options.elClass),
            animateValues;

        // Filters out all elements that come before change.
        // Needed because if we don't have a change position we need to animate all elements in container.
        if (this._changePos) {
            $elToChange = $elToChange.filter(':nth-child(' + this._changePos + ')').nextAll();
        }

        animateValues = { 'top' : this.options.offset,
                          'opacity' : 0
                        };

        // Animation callback.
        // Removes old elements.
        function afterAnimate() {
            $(this).remove();
        }

        // Animates elements
        $elToChange.filter(':not(.' + this.options.elTransition + ')').animate(animateValues, this.options.speed, afterAnimate);
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

    /**
     * Splits target selector to spans by each letter.
     * Marks down element Width after writing out
     */
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

    /**
     * Default values
     */
    $.fn.xover.options = {
        value    : undefined,
        elClass  : 'xover-el',
        elChangeClass : 'xover-change',
        elTransition : 'xover-transition',
        speed    : 'slow',
        offset   : '10px'
    };
})(jQuery);
