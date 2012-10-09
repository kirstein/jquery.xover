(function($) {

    var Xover = function(el, value, options) {
            if (typeof value === "undefined") {
                throw new Error("Value can't be undefined");
            }
            this.el = el;
            this.$el = $(el);
            this.options = options;
            this.value = $.trim(value);
            this.change = {
                'curr': null,
                'prev': null,
                'diff': null
            };
        };

    Xover.prototype.init = function() {
        var root = this;

        if (this.isValueChanged()) {
            this.manipulateValues(function() {
                root.options.call(this, this.change.prev, this.change.diff);
            });
        }
    };

    Xover.prototype.isValueChanged = function() {
        var prevVal = this.$el.text() * 1,
            newVal = this.value * 1,
            notNumeric = isNaN(prevVal) && isNaN(newVal);

        if (!notNumeric && prevVal !== newVal) {
            this.change.prev = prevVal;
            this.change.diff = newVal - prevVal;
            this.change.curr = newVal;

            return true;
        }

        return false;
    };

    Xover.prototype.buildElement = function() {
        var currValue = this.change.curr.toString(),
            prevValue = this.change.prev.toString(),
            maxLength = Math.max(currValue.length, prevValue.length),
            $el       = $(),
            i;

        // Create empty spaces in front of real values
        for (i = 0; i < (maxLength - currValue.length); i += 1) {
            $el = $el.add('<span/>', {
                'class' : this.options.elClass,
                'html'  : this.options.emptyVal
            });
        }
        // Wrap each letter to span
        for (i = 0; i < currValue.length; i += 1) {
            $el = $el.add('<span/>', {
                'class' : this.options.elClass,
                'text'  : currValue[i]
            });
        }

        return $el;
    };

    Xover.prototype.manipulateValues = function() {
        var $newEl = this.buildElement();
        this.$el.html($newEl);
    };

    $.fn.xover = function(value, options) {
        var root = this;

        if (typeof val === 'object' && typeof opt === 'undefined') {
            options = value;
            value = option.value;
        }
        options = $.extend({}, $.fn.xover.options, options);
        return this.each(function() {
            new Xover(this, value, options).init();
        });
    };

    $.fn.xover.options = {
        value    : undefined,
        change   : function(prevVal, diff) {},
        elClass  : 'xover-el',
        emptyVal : '&nbsp;'
    };
})(jQuery);
