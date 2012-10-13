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
            this.change  = {
                'curr': null,
                'prev': null,
                'diff': null
            };
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

        $appendElement = this.$el.children('span:not(.'+ this.options.elChangeClass + '):nth-child('+ firstChange +')');

        for (i = firstChange; i < this.value.length; i += 1) {
            $el = $('<span/>', {
                'class' : this.options.elClass + ' ' + this.options.elChangeClass,
                'text'  : this.value[i],
                'style' : 'display:none'
            });
            
            if ($appendElement.length) {
                $el.insertAfter($appendElement);
            } else {
                this.$el.empty();
                $el.prependTo(this.$el);
            }

            $appendElement = $el;
        }                
    };

    Xover.prototype.manipulateEl = function() {
        var root        = this,
            firstChange = this.getFirstChangePos(),
            changeElems;

        // Animate temporary elements and change them to main ones.
        // Remove old main elements.
        function toggleClassesAndRem() {
            $(this).remove();
            animateNewElements();
        }

        function animateNewElements() {
            root.$el.children('span.' + root.options.elChangeClass).fadeIn(root.options.speed, function() {
                $(this).toggleClass(root.options.elChangeClass).toggleClass(root.options.elClass);
            }); 
        }

        if (typeof firstChange !== 'undefined') {
            
            // List all elements that come after changed element.
            // Animate main elements.

            changeElems = this.$el.children('span.' + this.options.elClass + ':nth-child(' + firstChange + ')')
                              .nextAll().filter(':not(.' + this.options.elChangeClass + ')');

            if (changeElems.length) {
                changeElems.fadeOut(this.options.speed, toggleClassesAndRem);
            } else {
                animateNewElements();
            }

        } else {
            // Debug
            console.error(this);
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
        change   : function() {},
        elClass  : 'xover-el',
        elChangeClass : 'xover-change',
        emptyVal : '&nbsp;',
        speed    : 'slow'
    };
})(jQuery);
