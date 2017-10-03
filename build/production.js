"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*! responsive-nav.js 1.0.39
 * https://github.com/viljamis/responsive-nav.js
 * http://responsive-nav.com
 *
 * Copyright (c) 2015 @viljamis
 * Available under the MIT license
 */

/* global Event */
(function (document, window, index) {
  // Index is used to keep multiple navs on the same page namespaced

  "use strict";

  var responsiveNav = function responsiveNav(el, options) {

    var computed = !!window.getComputedStyle;

    /**
     * getComputedStyle polyfill for old browsers
     */
    if (!computed) {
      window.getComputedStyle = function (el) {
        this.el = el;
        this.getPropertyValue = function (prop) {
          var re = /(\-([a-z]){1})/g;
          if (prop === "float") {
            prop = "styleFloat";
          }
          if (re.test(prop)) {
            prop = prop.replace(re, function () {
              return arguments[2].toUpperCase();
            });
          }
          return el.currentStyle[prop] ? el.currentStyle[prop] : null;
        };
        return this;
      };
    }
    /* exported addEvent, removeEvent, getChildren, setAttributes, addClass, removeClass, forEach */

    /**
     * Add Event
     * fn arg can be an object or a function, thanks to handleEvent
     * read more at: http://www.thecssninja.com/javascript/handleevent
     *
     * @param  {element}  element
     * @param  {event}    event
     * @param  {Function} fn
     * @param  {boolean}  bubbling
     */
    var addEvent = function addEvent(el, evt, fn, bubble) {
      if ("addEventListener" in el) {
        // BBOS6 doesn't support handleEvent, catch and polyfill
        try {
          el.addEventListener(evt, fn, bubble);
        } catch (e) {
          if ((typeof fn === "undefined" ? "undefined" : _typeof(fn)) === "object" && fn.handleEvent) {
            el.addEventListener(evt, function (e) {
              // Bind fn as this and set first arg as event object
              fn.handleEvent.call(fn, e);
            }, bubble);
          } else {
            throw e;
          }
        }
      } else if ("attachEvent" in el) {
        // check if the callback is an object and contains handleEvent
        if ((typeof fn === "undefined" ? "undefined" : _typeof(fn)) === "object" && fn.handleEvent) {
          el.attachEvent("on" + evt, function () {
            // Bind fn as this
            fn.handleEvent.call(fn);
          });
        } else {
          el.attachEvent("on" + evt, fn);
        }
      }
    },


    /**
     * Remove Event
     *
     * @param  {element}  element
     * @param  {event}    event
     * @param  {Function} fn
     * @param  {boolean}  bubbling
     */
    removeEvent = function removeEvent(el, evt, fn, bubble) {
      if ("removeEventListener" in el) {
        try {
          el.removeEventListener(evt, fn, bubble);
        } catch (e) {
          if ((typeof fn === "undefined" ? "undefined" : _typeof(fn)) === "object" && fn.handleEvent) {
            el.removeEventListener(evt, function (e) {
              fn.handleEvent.call(fn, e);
            }, bubble);
          } else {
            throw e;
          }
        }
      } else if ("detachEvent" in el) {
        if ((typeof fn === "undefined" ? "undefined" : _typeof(fn)) === "object" && fn.handleEvent) {
          el.detachEvent("on" + evt, function () {
            fn.handleEvent.call(fn);
          });
        } else {
          el.detachEvent("on" + evt, fn);
        }
      }
    },


    /**
     * Get the children of any element
     *
     * @param  {element}
     * @return {array} Returns matching elements in an array
     */
    getChildren = function getChildren(e) {
      if (e.children.length < 1) {
        throw new Error("The Nav container has no containing elements");
      }
      // Store all children in array
      var children = [];
      // Loop through children and store in array if child != TextNode
      for (var i = 0; i < e.children.length; i++) {
        if (e.children[i].nodeType === 1) {
          children.push(e.children[i]);
        }
      }
      return children;
    },


    /**
     * Sets multiple attributes at once
     *
     * @param {element} element
     * @param {attrs}   attrs
     */
    setAttributes = function setAttributes(el, attrs) {
      for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
      }
    },


    /**
     * Adds a class to any element
     *
     * @param {element} element
     * @param {string}  class
     */
    addClass = function addClass(el, cls) {
      if (el.className.indexOf(cls) !== 0) {
        el.className += " " + cls;
        el.className = el.className.replace(/(^\s*)|(\s*$)/g, "");
      }
    },


    /**
     * Remove a class from any element
     *
     * @param  {element} element
     * @param  {string}  class
     */
    removeClass = function removeClass(el, cls) {
      var reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
      el.className = el.className.replace(reg, " ").replace(/(^\s*)|(\s*$)/g, "");
    },


    /**
     * forEach method that passes back the stuff we need
     *
     * @param  {array}    array
     * @param  {Function} callback
     * @param  {scope}    scope
     */
    forEach = function forEach(array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, i, array[i]);
      }
    };

    var nav,
        opts,
        navToggle,
        styleElement = document.createElement("style"),
        htmlEl = document.documentElement,
        hasAnimFinished,
        isMobile,
        navOpen;

    var ResponsiveNav = function ResponsiveNav(el, options) {
      var i;

      /**
       * Default options
       * @type {Object}
       */
      this.options = {
        animate: true, // Boolean: Use CSS3 transitions, true or false
        transition: 284, // Integer: Speed of the transition, in milliseconds
        label: "Menu", // String: Label for the navigation toggle
        insert: "before", // String: Insert the toggle before or after the navigation
        customToggle: "", // Selector: Specify the ID of a custom toggle
        closeOnNavClick: false, // Boolean: Close the navigation when one of the links are clicked
        openPos: "relative", // String: Position of the opened nav, relative or static
        navClass: "nav-collapse", // String: Default CSS class. If changed, you need to edit the CSS too!
        navActiveClass: "js-nav-active", // String: Class that is added to <html> element when nav is active
        jsClass: "js", // String: 'JS enabled' class which is added to <html> element
        init: function init() {}, // Function: Init callback
        open: function open() {}, // Function: Open callback
        close: function close() {} // Function: Close callback
      };

      // User defined options
      for (i in options) {
        this.options[i] = options[i];
      }

      // Adds "js" class for <html>
      addClass(htmlEl, this.options.jsClass);

      // Wrapper
      this.wrapperEl = el.replace("#", "");

      // Try selecting ID first
      if (document.getElementById(this.wrapperEl)) {
        this.wrapper = document.getElementById(this.wrapperEl);

        // If element with an ID doesn't exist, use querySelector
      } else if (document.querySelector(this.wrapperEl)) {
        this.wrapper = document.querySelector(this.wrapperEl);

        // If element doesn't exists, stop here.
      } else {
        throw new Error("The nav element you are trying to select doesn't exist");
      }

      // Inner wrapper
      this.wrapper.inner = getChildren(this.wrapper);

      // For minification
      opts = this.options;
      nav = this.wrapper;

      // Init
      this._init(this);
    };

    ResponsiveNav.prototype = {

      /**
       * Unattaches events and removes any classes that were added
       */
      destroy: function destroy() {
        this._removeStyles();
        removeClass(nav, "closed");
        removeClass(nav, "opened");
        removeClass(nav, opts.navClass);
        removeClass(nav, opts.navClass + "-" + this.index);
        removeClass(htmlEl, opts.navActiveClass);
        nav.removeAttribute("style");
        nav.removeAttribute("aria-hidden");

        removeEvent(window, "resize", this, false);
        removeEvent(window, "focus", this, false);
        removeEvent(document.body, "touchmove", this, false);
        removeEvent(navToggle, "touchstart", this, false);
        removeEvent(navToggle, "touchend", this, false);
        removeEvent(navToggle, "mouseup", this, false);
        removeEvent(navToggle, "keyup", this, false);
        removeEvent(navToggle, "click", this, false);

        if (!opts.customToggle) {
          navToggle.parentNode.removeChild(navToggle);
        } else {
          navToggle.removeAttribute("aria-hidden");
        }
      },

      /**
       * Toggles the navigation open/close
       */
      toggle: function toggle() {
        if (hasAnimFinished === true) {
          if (!navOpen) {
            this.open();
          } else {
            this.close();
          }
        }
      },

      /**
       * Opens the navigation
       */
      open: function open() {
        if (!navOpen) {
          removeClass(nav, "closed");
          addClass(nav, "opened");
          addClass(htmlEl, opts.navActiveClass);
          addClass(navToggle, "active");
          nav.style.position = opts.openPos;
          setAttributes(nav, { "aria-hidden": "false" });
          navOpen = true;
          opts.open();
        }
      },

      /**
       * Closes the navigation
       */
      close: function close() {
        if (navOpen) {
          addClass(nav, "closed");
          removeClass(nav, "opened");
          removeClass(htmlEl, opts.navActiveClass);
          removeClass(navToggle, "active");
          setAttributes(nav, { "aria-hidden": "true" });

          // If animations are enabled, wait until they finish
          if (opts.animate) {
            hasAnimFinished = false;
            setTimeout(function () {
              nav.style.position = "absolute";
              hasAnimFinished = true;
            }, opts.transition + 10);

            // Animations aren't enabled, we can do these immediately
          } else {
            nav.style.position = "absolute";
          }

          navOpen = false;
          opts.close();
        }
      },

      /**
       * Resize is called on window resize and orientation change.
       * It initializes the CSS styles and height calculations.
       */
      resize: function resize() {

        // Resize watches navigation toggle's display state
        if (window.getComputedStyle(navToggle, null).getPropertyValue("display") !== "none") {

          isMobile = true;
          setAttributes(navToggle, { "aria-hidden": "false" });

          // If the navigation is hidden
          if (nav.className.match(/(^|\s)closed(\s|$)/)) {
            setAttributes(nav, { "aria-hidden": "true" });
            nav.style.position = "absolute";
          }

          this._createStyles();
          this._calcHeight();
        } else {

          isMobile = false;
          setAttributes(navToggle, { "aria-hidden": "true" });
          setAttributes(nav, { "aria-hidden": "false" });
          nav.style.position = opts.openPos;
          this._removeStyles();
        }
      },

      /**
       * Takes care of all even handling
       *
       * @param  {event} event
       * @return {type} returns the type of event that should be used
       */
      handleEvent: function handleEvent(e) {
        var evt = e || window.event;

        switch (evt.type) {
          case "touchstart":
            this._onTouchStart(evt);
            break;
          case "touchmove":
            this._onTouchMove(evt);
            break;
          case "touchend":
          case "mouseup":
            this._onTouchEnd(evt);
            break;
          case "click":
            this._preventDefault(evt);
            break;
          case "keyup":
            this._onKeyUp(evt);
            break;
          case "focus":
          case "resize":
            this.resize(evt);
            break;
        }
      },

      /**
       * Initializes the widget
       */
      _init: function _init() {
        this.index = index++;

        addClass(nav, opts.navClass);
        addClass(nav, opts.navClass + "-" + this.index);
        addClass(nav, "closed");
        hasAnimFinished = true;
        navOpen = false;

        this._closeOnNavClick();
        this._createToggle();
        this._transitions();
        this.resize();

        /**
         * On IE8 the resize event triggers too early for some reason
         * so it's called here again on init to make sure all the
         * calculated styles are correct.
         */
        var self = this;
        setTimeout(function () {
          self.resize();
        }, 20);

        addEvent(window, "resize", this, false);
        addEvent(window, "focus", this, false);
        addEvent(document.body, "touchmove", this, false);
        addEvent(navToggle, "touchstart", this, false);
        addEvent(navToggle, "touchend", this, false);
        addEvent(navToggle, "mouseup", this, false);
        addEvent(navToggle, "keyup", this, false);
        addEvent(navToggle, "click", this, false);

        /**
         * Init callback here
         */
        opts.init();
      },

      /**
       * Creates Styles to the <head>
       */
      _createStyles: function _createStyles() {
        if (!styleElement.parentNode) {
          styleElement.type = "text/css";
          document.getElementsByTagName("head")[0].appendChild(styleElement);
        }
      },

      /**
       * Removes styles from the <head>
       */
      _removeStyles: function _removeStyles() {
        if (styleElement.parentNode) {
          styleElement.parentNode.removeChild(styleElement);
        }
      },

      /**
       * Creates Navigation Toggle
       */
      _createToggle: function _createToggle() {

        // If there's no toggle, let's create one
        if (!opts.customToggle) {
          var toggle = document.createElement("a");
          toggle.innerHTML = opts.label;
          setAttributes(toggle, {
            "href": "#",
            "class": "nav-toggle"
          });

          // Determine where to insert the toggle
          if (opts.insert === "after") {
            nav.parentNode.insertBefore(toggle, nav.nextSibling);
          } else {
            nav.parentNode.insertBefore(toggle, nav);
          }

          navToggle = toggle;

          // There is a toggle already, let's use that one
        } else {
          var toggleEl = opts.customToggle.replace("#", "");

          if (document.getElementById(toggleEl)) {
            navToggle = document.getElementById(toggleEl);
          } else if (document.querySelector(toggleEl)) {
            navToggle = document.querySelector(toggleEl);
          } else {
            throw new Error("The custom nav toggle you are trying to select doesn't exist");
          }
        }
      },

      /**
       * Closes the navigation when a link inside is clicked.
       */
      _closeOnNavClick: function _closeOnNavClick() {
        if (opts.closeOnNavClick) {
          var links = nav.getElementsByTagName("a"),
              self = this;
          forEach(links, function (i, el) {
            addEvent(links[i], "click", function () {
              if (isMobile) {
                self.toggle();
              }
            }, false);
          });
        }
      },

      /**
       * Prevents the default functionality.
       *
       * @param  {event} event
       */
      _preventDefault: function _preventDefault(e) {
        if (e.preventDefault) {
          if (e.stopImmediatePropagation) {
            e.stopImmediatePropagation();
          }
          e.preventDefault();
          e.stopPropagation();
          return false;

          // This is strictly for old IE
        } else {
          e.returnValue = false;
        }
      },

      /**
       * On touch start we get the location of the touch.
       *
       * @param  {event} event
       */
      _onTouchStart: function _onTouchStart(e) {
        if (!Event.prototype.stopImmediatePropagation) {
          this._preventDefault(e);
        }
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.touchHasMoved = false;

        /**
         * Remove mouseup event completely here to avoid
         * double triggering the event.
         */
        removeEvent(navToggle, "mouseup", this, false);
      },

      /**
       * Check if the user is scrolling instead of tapping.
       *
       * @param  {event} event
       */
      _onTouchMove: function _onTouchMove(e) {
        if (Math.abs(e.touches[0].clientX - this.startX) > 10 || Math.abs(e.touches[0].clientY - this.startY) > 10) {
          this.touchHasMoved = true;
        }
      },

      /**
       * On touch end toggle the navigation.
       *
       * @param  {event} event
       */
      _onTouchEnd: function _onTouchEnd(e) {
        this._preventDefault(e);
        if (!isMobile) {
          return;
        }

        // If the user isn't scrolling
        if (!this.touchHasMoved) {

          // If the event type is touch
          if (e.type === "touchend") {
            this.toggle();
            return;

            // Event type was click, not touch
          } else {
            var evt = e || window.event;

            // If it isn't a right click, do toggling
            if (!(evt.which === 3 || evt.button === 2)) {
              this.toggle();
            }
          }
        }
      },

      /**
       * For keyboard accessibility, toggle the navigation on Enter
       * keypress too.
       *
       * @param  {event} event
       */
      _onKeyUp: function _onKeyUp(e) {
        var evt = e || window.event;
        if (evt.keyCode === 13) {
          this.toggle();
        }
      },

      /**
       * Adds the needed CSS transitions if animations are enabled
       */
      _transitions: function _transitions() {
        if (opts.animate) {
          var objStyle = nav.style,
              transition = "max-height " + opts.transition + "ms";

          objStyle.WebkitTransition = objStyle.MozTransition = objStyle.OTransition = objStyle.transition = transition;
        }
      },

      /**
       * Calculates the height of the navigation and then creates
       * styles which are later added to the page <head>
       */
      _calcHeight: function _calcHeight() {
        var savedHeight = 0;
        for (var i = 0; i < nav.inner.length; i++) {
          savedHeight += nav.inner[i].offsetHeight;
        }

        var innerStyles = "." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened{max-height:" + savedHeight + "px !important} ." + opts.jsClass + " ." + opts.navClass + "-" + this.index + ".opened.dropdown-active {max-height:9999px !important}";

        if (styleElement.styleSheet) {
          styleElement.styleSheet.cssText = innerStyles;
        } else {
          styleElement.innerHTML = innerStyles;
        }

        innerStyles = "";
      }

    };

    /**
     * Return new Responsive Nav
     */
    return new ResponsiveNav(el, options);
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = responsiveNav;
  } else {
    window.responsiveNav = responsiveNav;
  }
})(document, window, 0);
"use strict";

var nav = responsiveNav(".nav-collapse");
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc3BvbnNpdmUtbmF2LmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbImRvY3VtZW50Iiwid2luZG93IiwiaW5kZXgiLCJyZXNwb25zaXZlTmF2IiwiZWwiLCJvcHRpb25zIiwiY29tcHV0ZWQiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsInByb3AiLCJyZSIsInRlc3QiLCJyZXBsYWNlIiwiYXJndW1lbnRzIiwidG9VcHBlckNhc2UiLCJjdXJyZW50U3R5bGUiLCJhZGRFdmVudCIsImV2dCIsImZuIiwiYnViYmxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImUiLCJoYW5kbGVFdmVudCIsImNhbGwiLCJhdHRhY2hFdmVudCIsInJlbW92ZUV2ZW50IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImRldGFjaEV2ZW50IiwiZ2V0Q2hpbGRyZW4iLCJjaGlsZHJlbiIsImxlbmd0aCIsIkVycm9yIiwiaSIsIm5vZGVUeXBlIiwicHVzaCIsInNldEF0dHJpYnV0ZXMiLCJhdHRycyIsImtleSIsInNldEF0dHJpYnV0ZSIsImFkZENsYXNzIiwiY2xzIiwiY2xhc3NOYW1lIiwiaW5kZXhPZiIsInJlbW92ZUNsYXNzIiwicmVnIiwiUmVnRXhwIiwiZm9yRWFjaCIsImFycmF5IiwiY2FsbGJhY2siLCJzY29wZSIsIm5hdiIsIm9wdHMiLCJuYXZUb2dnbGUiLCJzdHlsZUVsZW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiaHRtbEVsIiwiZG9jdW1lbnRFbGVtZW50IiwiaGFzQW5pbUZpbmlzaGVkIiwiaXNNb2JpbGUiLCJuYXZPcGVuIiwiUmVzcG9uc2l2ZU5hdiIsImFuaW1hdGUiLCJ0cmFuc2l0aW9uIiwibGFiZWwiLCJpbnNlcnQiLCJjdXN0b21Ub2dnbGUiLCJjbG9zZU9uTmF2Q2xpY2siLCJvcGVuUG9zIiwibmF2Q2xhc3MiLCJuYXZBY3RpdmVDbGFzcyIsImpzQ2xhc3MiLCJpbml0Iiwib3BlbiIsImNsb3NlIiwid3JhcHBlckVsIiwiZ2V0RWxlbWVudEJ5SWQiLCJ3cmFwcGVyIiwicXVlcnlTZWxlY3RvciIsImlubmVyIiwiX2luaXQiLCJwcm90b3R5cGUiLCJkZXN0cm95IiwiX3JlbW92ZVN0eWxlcyIsInJlbW92ZUF0dHJpYnV0ZSIsImJvZHkiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJ0b2dnbGUiLCJzdHlsZSIsInBvc2l0aW9uIiwic2V0VGltZW91dCIsInJlc2l6ZSIsIm1hdGNoIiwiX2NyZWF0ZVN0eWxlcyIsIl9jYWxjSGVpZ2h0IiwiZXZlbnQiLCJ0eXBlIiwiX29uVG91Y2hTdGFydCIsIl9vblRvdWNoTW92ZSIsIl9vblRvdWNoRW5kIiwiX3ByZXZlbnREZWZhdWx0IiwiX29uS2V5VXAiLCJfY2xvc2VPbk5hdkNsaWNrIiwiX2NyZWF0ZVRvZ2dsZSIsIl90cmFuc2l0aW9ucyIsInNlbGYiLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImFwcGVuZENoaWxkIiwiaW5uZXJIVE1MIiwiaW5zZXJ0QmVmb3JlIiwibmV4dFNpYmxpbmciLCJ0b2dnbGVFbCIsImxpbmtzIiwicHJldmVudERlZmF1bHQiLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCJzdG9wUHJvcGFnYXRpb24iLCJyZXR1cm5WYWx1ZSIsIkV2ZW50Iiwic3RhcnRYIiwidG91Y2hlcyIsImNsaWVudFgiLCJzdGFydFkiLCJjbGllbnRZIiwidG91Y2hIYXNNb3ZlZCIsIk1hdGgiLCJhYnMiLCJ3aGljaCIsImJ1dHRvbiIsImtleUNvZGUiLCJvYmpTdHlsZSIsIldlYmtpdFRyYW5zaXRpb24iLCJNb3pUcmFuc2l0aW9uIiwiT1RyYW5zaXRpb24iLCJzYXZlZEhlaWdodCIsIm9mZnNldEhlaWdodCIsImlubmVyU3R5bGVzIiwic3R5bGVTaGVldCIsImNzc1RleHQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7Ozs7O0FBUUE7QUFDQyxXQUFVQSxRQUFWLEVBQW9CQyxNQUFwQixFQUE0QkMsS0FBNUIsRUFBbUM7QUFDbEM7O0FBRUE7O0FBRUEs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bEIsSUFBaUNBLE9BQU9DLE9BQTVDLEVBQXFEO0FBQ25ERCxXQUFPQyxPQUFQLEdBQWlCeEksYUFBakI7QUFDRCxHQUZELE1BRU87QUFDTEYsV0FBT0UsYUFBUCxHQUF1QkEsYUFBdkI7QUFDRDtBQUVGLENBN29CQSxFQTZvQkNILFFBN29CRCxFQTZvQldDLE1BN29CWCxFQTZvQm1CLENBN29CbkIsQ0FBRDs7O0FDVEEsSUFBSWlELE1BQU0vQyxjQUFjLGVBQWQsQ0FBViIsImZpbGUiOiJwcm9kdWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyohIHJlc3BvbnNpdmUtbmF2LmpzIDEuMC4zOVxuICogaHR0cHM6Ly9naXRodWIuY29tL3ZpbGphbWlzL3Jlc3BvbnNpdmUtbmF2LmpzXG4gKiBodHRwOi8vcmVzcG9uc2l2ZS1uYXYuY29tXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE1IEB2aWxqYW1pc1xuICogQXZhaWxhYmxlIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG5cbi8qIGdsb2JhbCBFdmVudCAqL1xuKGZ1bmN0aW9uIChkb2N1bWVudCwgd2luZG93LCBpbmRleCkge1xuICAvLyBJbmRleCBpcyB1c2VkIHRvIGtlZXAgbXVsdGlwbGUgbmF2cyBvbiB0aGUgc2FtZSBwYWdlIG5hbWVzcGFjZWRcblxuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgcmVzcG9uc2l2ZU5hdiA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuXG4gICAgdmFyIGNvbXB1dGVkID0gISF3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZTtcblxuICAgIC8qKlxuICAgICAqIGdldENvbXB1dGVkU3R5bGUgcG9seWZpbGwgZm9yIG9sZCBicm93c2Vyc1xuICAgICAqL1xuICAgIGlmICghY29tcHV0ZWQpIHtcbiAgICAgIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlID0gZnVuY3Rpb24oZWwpIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLmdldFByb3BlcnR5VmFsdWUgPSBmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgICAgdmFyIHJlID0gLyhcXC0oW2Etel0pezF9KS9nO1xuICAgICAgICAgIGlmIChwcm9wID09PSBcImZsb2F0XCIpIHtcbiAgICAgICAgICAgIHByb3AgPSBcInN0eWxlRmxvYXRcIjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlLnRlc3QocHJvcCkpIHtcbiAgICAgICAgICAgIHByb3AgPSBwcm9wLnJlcGxhY2UocmUsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGFyZ3VtZW50c1syXS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBlbC5jdXJyZW50U3R5bGVbcHJvcF0gPyBlbC5jdXJyZW50U3R5bGVbcHJvcF0gOiBudWxsO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH07XG4gICAgfVxuICAgIC8qIGV4cG9ydGVkIGFkZEV2ZW50LCByZW1vdmVFdmVudCwgZ2V0Q2hpbGRyZW4sIHNldEF0dHJpYnV0ZXMsIGFkZENsYXNzLCByZW1vdmVDbGFzcywgZm9yRWFjaCAqL1xuXG4gICAgLyoqXG4gICAgICogQWRkIEV2ZW50XG4gICAgICogZm4gYXJnIGNhbiBiZSBhbiBvYmplY3Qgb3IgYSBmdW5jdGlvbiwgdGhhbmtzIHRvIGhhbmRsZUV2ZW50XG4gICAgICogcmVhZCBtb3JlIGF0OiBodHRwOi8vd3d3LnRoZWNzc25pbmphLmNvbS9qYXZhc2NyaXB0L2hhbmRsZWV2ZW50XG4gICAgICpcbiAgICAgKiBAcGFyYW0gIHtlbGVtZW50fSAgZWxlbWVudFxuICAgICAqIEBwYXJhbSAge2V2ZW50fSAgICBldmVudFxuICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICAgICAqIEBwYXJhbSAge2Jvb2xlYW59ICBidWJibGluZ1xuICAgICAqL1xuICAgIHZhciBhZGRFdmVudCA9IGZ1bmN0aW9uIChlbCwgZXZ0LCBmbiwgYnViYmxlKSB7XG4gICAgICAgIGlmIChcImFkZEV2ZW50TGlzdGVuZXJcIiBpbiBlbCkge1xuICAgICAgICAgIC8vIEJCT1M2IGRvZXNuJ3Qgc3VwcG9ydCBoYW5kbGVFdmVudCwgY2F0Y2ggYW5kIHBvbHlmaWxsXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBmbiwgYnViYmxlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSBcIm9iamVjdFwiICYmIGZuLmhhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICAgIGVsLmFkZEV2ZW50TGlzdGVuZXIoZXZ0LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIC8vIEJpbmQgZm4gYXMgdGhpcyBhbmQgc2V0IGZpcnN0IGFyZyBhcyBldmVudCBvYmplY3RcbiAgICAgICAgICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKGZuLCBlKTtcbiAgICAgICAgICAgICAgfSwgYnViYmxlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFwiYXR0YWNoRXZlbnRcIiBpbiBlbCkge1xuICAgICAgICAgIC8vIGNoZWNrIGlmIHRoZSBjYWxsYmFjayBpcyBhbiBvYmplY3QgYW5kIGNvbnRhaW5zIGhhbmRsZUV2ZW50XG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gXCJvYmplY3RcIiAmJiBmbi5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgZWwuYXR0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIC8vIEJpbmQgZm4gYXMgdGhpc1xuICAgICAgICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKGZuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5hdHRhY2hFdmVudChcIm9uXCIgKyBldnQsIGZuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIEV2ZW50XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZWxlbWVudH0gIGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSAgICBldmVudFxuICAgICAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gICAgICAgKiBAcGFyYW0gIHtib29sZWFufSAgYnViYmxpbmdcbiAgICAgICAqL1xuICAgICAgcmVtb3ZlRXZlbnQgPSBmdW5jdGlvbiAoZWwsIGV2dCwgZm4sIGJ1YmJsZSkge1xuICAgICAgICBpZiAoXCJyZW1vdmVFdmVudExpc3RlbmVyXCIgaW4gZWwpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnQsIGZuLCBidWJibGUpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09IFwib2JqZWN0XCIgJiYgZm4uaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgICAgZWwucmVtb3ZlRXZlbnRMaXN0ZW5lcihldnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgZm4uaGFuZGxlRXZlbnQuY2FsbChmbiwgZSk7XG4gICAgICAgICAgICAgIH0sIGJ1YmJsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcImRldGFjaEV2ZW50XCIgaW4gZWwpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSBcIm9iamVjdFwiICYmIGZuLmhhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICBlbC5kZXRhY2hFdmVudChcIm9uXCIgKyBldnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgZm4uaGFuZGxlRXZlbnQuY2FsbChmbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuZGV0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEdldCB0aGUgY2hpbGRyZW4gb2YgYW55IGVsZW1lbnRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtlbGVtZW50fVxuICAgICAgICogQHJldHVybiB7YXJyYXl9IFJldHVybnMgbWF0Y2hpbmcgZWxlbWVudHMgaW4gYW4gYXJyYXlcbiAgICAgICAqL1xuICAgICAgZ2V0Q2hpbGRyZW4gPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoZS5jaGlsZHJlbi5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIE5hdiBjb250YWluZXIgaGFzIG5vIGNvbnRhaW5pbmcgZWxlbWVudHNcIik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gU3RvcmUgYWxsIGNoaWxkcmVuIGluIGFycmF5XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICAvLyBMb29wIHRocm91Z2ggY2hpbGRyZW4gYW5kIHN0b3JlIGluIGFycmF5IGlmIGNoaWxkICE9IFRleHROb2RlXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZS5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChlLmNoaWxkcmVuW2ldLm5vZGVUeXBlID09PSAxKSB7XG4gICAgICAgICAgICBjaGlsZHJlbi5wdXNoKGUuY2hpbGRyZW5baV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2hpbGRyZW47XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFNldHMgbXVsdGlwbGUgYXR0cmlidXRlcyBhdCBvbmNlXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtlbGVtZW50fSBlbGVtZW50XG4gICAgICAgKiBAcGFyYW0ge2F0dHJzfSAgIGF0dHJzXG4gICAgICAgKi9cbiAgICAgIHNldEF0dHJpYnV0ZXMgPSBmdW5jdGlvbiAoZWwsIGF0dHJzKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBhdHRycykge1xuICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFkZHMgYSBjbGFzcyB0byBhbnkgZWxlbWVudFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gZWxlbWVudFxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9ICBjbGFzc1xuICAgICAgICovXG4gICAgICBhZGRDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gICAgICAgIGlmIChlbC5jbGFzc05hbWUuaW5kZXhPZihjbHMpICE9PSAwKSB7XG4gICAgICAgICAgZWwuY2xhc3NOYW1lICs9IFwiIFwiICsgY2xzO1xuICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKC8oXlxccyopfChcXHMqJCkvZyxcIlwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmUgYSBjbGFzcyBmcm9tIGFueSBlbGVtZW50XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZWxlbWVudH0gZWxlbWVudFxuICAgICAgICogQHBhcmFtICB7c3RyaW5nfSAgY2xhc3NcbiAgICAgICAqL1xuICAgICAgcmVtb3ZlQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNscykge1xuICAgICAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIihcXFxcc3xeKVwiICsgY2xzICsgXCIoXFxcXHN8JClcIik7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IGVsLmNsYXNzTmFtZS5yZXBsYWNlKHJlZywgXCIgXCIpLnJlcGxhY2UoLyheXFxzKil8KFxccyokKS9nLFwiXCIpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBmb3JFYWNoIG1ldGhvZCB0aGF0IHBhc3NlcyBiYWNrIHRoZSBzdHVmZiB3ZSBuZWVkXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7YXJyYXl9ICAgIGFycmF5XG4gICAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gY2FsbGJhY2tcbiAgICAgICAqIEBwYXJhbSAge3Njb3BlfSAgICBzY29wZVxuICAgICAgICovXG4gICAgICBmb3JFYWNoID0gZnVuY3Rpb24gKGFycmF5LCBjYWxsYmFjaywgc2NvcGUpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNhbGxiYWNrLmNhbGwoc2NvcGUsIGksIGFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgIHZhciBuYXYsXG4gICAgICBvcHRzLFxuICAgICAgbmF2VG9nZ2xlLFxuICAgICAgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpLFxuICAgICAgaHRtbEVsID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxuICAgICAgaGFzQW5pbUZpbmlzaGVkLFxuICAgICAgaXNNb2JpbGUsXG4gICAgICBuYXZPcGVuO1xuXG4gICAgdmFyIFJlc3BvbnNpdmVOYXYgPSBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIERlZmF1bHQgb3B0aW9uc1xuICAgICAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vcHRpb25zID0ge1xuICAgICAgICAgIGFuaW1hdGU6IHRydWUsICAgICAgICAgICAgICAgICAgICAvLyBCb29sZWFuOiBVc2UgQ1NTMyB0cmFuc2l0aW9ucywgdHJ1ZSBvciBmYWxzZVxuICAgICAgICAgIHRyYW5zaXRpb246IDI4NCwgICAgICAgICAgICAgICAgICAvLyBJbnRlZ2VyOiBTcGVlZCBvZiB0aGUgdHJhbnNpdGlvbiwgaW4gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgbGFiZWw6IFwiTWVudVwiLCAgICAgICAgICAgICAgICAgICAgLy8gU3RyaW5nOiBMYWJlbCBmb3IgdGhlIG5hdmlnYXRpb24gdG9nZ2xlXG4gICAgICAgICAgaW5zZXJ0OiBcImJlZm9yZVwiLCAgICAgICAgICAgICAgICAgLy8gU3RyaW5nOiBJbnNlcnQgdGhlIHRvZ2dsZSBiZWZvcmUgb3IgYWZ0ZXIgdGhlIG5hdmlnYXRpb25cbiAgICAgICAgICBjdXN0b21Ub2dnbGU6IFwiXCIsICAgICAgICAgICAgICAgICAvLyBTZWxlY3RvcjogU3BlY2lmeSB0aGUgSUQgb2YgYSBjdXN0b20gdG9nZ2xlXG4gICAgICAgICAgY2xvc2VPbk5hdkNsaWNrOiBmYWxzZSwgICAgICAgICAgIC8vIEJvb2xlYW46IENsb3NlIHRoZSBuYXZpZ2F0aW9uIHdoZW4gb25lIG9mIHRoZSBsaW5rcyBhcmUgY2xpY2tlZFxuICAgICAgICAgIG9wZW5Qb3M6IFwicmVsYXRpdmVcIiwgICAgICAgICAgICAgIC8vIFN0cmluZzogUG9zaXRpb24gb2YgdGhlIG9wZW5lZCBuYXYsIHJlbGF0aXZlIG9yIHN0YXRpY1xuICAgICAgICAgIG5hdkNsYXNzOiBcIm5hdi1jb2xsYXBzZVwiLCAgICAgICAgIC8vIFN0cmluZzogRGVmYXVsdCBDU1MgY2xhc3MuIElmIGNoYW5nZWQsIHlvdSBuZWVkIHRvIGVkaXQgdGhlIENTUyB0b28hXG4gICAgICAgICAgbmF2QWN0aXZlQ2xhc3M6IFwianMtbmF2LWFjdGl2ZVwiLCAgLy8gU3RyaW5nOiBDbGFzcyB0aGF0IGlzIGFkZGVkIHRvIDxodG1sPiBlbGVtZW50IHdoZW4gbmF2IGlzIGFjdGl2ZVxuICAgICAgICAgIGpzQ2xhc3M6IFwianNcIiwgICAgICAgICAgICAgICAgICAgIC8vIFN0cmluZzogJ0pTIGVuYWJsZWQnIGNsYXNzIHdoaWNoIGlzIGFkZGVkIHRvIDxodG1sPiBlbGVtZW50XG4gICAgICAgICAgaW5pdDogZnVuY3Rpb24oKXt9LCAgICAgICAgICAgICAgIC8vIEZ1bmN0aW9uOiBJbml0IGNhbGxiYWNrXG4gICAgICAgICAgb3BlbjogZnVuY3Rpb24oKXt9LCAgICAgICAgICAgICAgIC8vIEZ1bmN0aW9uOiBPcGVuIGNhbGxiYWNrXG4gICAgICAgICAgY2xvc2U6IGZ1bmN0aW9uKCl7fSAgICAgICAgICAgICAgIC8vIEZ1bmN0aW9uOiBDbG9zZSBjYWxsYmFja1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFVzZXIgZGVmaW5lZCBvcHRpb25zXG4gICAgICAgIGZvciAoaSBpbiBvcHRpb25zKSB7XG4gICAgICAgICAgdGhpcy5vcHRpb25zW2ldID0gb3B0aW9uc1tpXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZHMgXCJqc1wiIGNsYXNzIGZvciA8aHRtbD5cbiAgICAgICAgYWRkQ2xhc3MoaHRtbEVsLCB0aGlzLm9wdGlvbnMuanNDbGFzcyk7XG5cbiAgICAgICAgLy8gV3JhcHBlclxuICAgICAgICB0aGlzLndyYXBwZXJFbCA9IGVsLnJlcGxhY2UoXCIjXCIsIFwiXCIpO1xuXG4gICAgICAgIC8vIFRyeSBzZWxlY3RpbmcgSUQgZmlyc3RcbiAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMud3JhcHBlckVsKSkge1xuICAgICAgICAgIHRoaXMud3JhcHBlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMud3JhcHBlckVsKTtcblxuICAgICAgICAvLyBJZiBlbGVtZW50IHdpdGggYW4gSUQgZG9lc24ndCBleGlzdCwgdXNlIHF1ZXJ5U2VsZWN0b3JcbiAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMud3JhcHBlckVsKSkge1xuICAgICAgICAgIHRoaXMud3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy53cmFwcGVyRWwpO1xuXG4gICAgICAgIC8vIElmIGVsZW1lbnQgZG9lc24ndCBleGlzdHMsIHN0b3AgaGVyZS5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgbmF2IGVsZW1lbnQgeW91IGFyZSB0cnlpbmcgdG8gc2VsZWN0IGRvZXNuJ3QgZXhpc3RcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbm5lciB3cmFwcGVyXG4gICAgICAgIHRoaXMud3JhcHBlci5pbm5lciA9IGdldENoaWxkcmVuKHRoaXMud3JhcHBlcik7XG5cbiAgICAgICAgLy8gRm9yIG1pbmlmaWNhdGlvblxuICAgICAgICBvcHRzID0gdGhpcy5vcHRpb25zO1xuICAgICAgICBuYXYgPSB0aGlzLndyYXBwZXI7XG5cbiAgICAgICAgLy8gSW5pdFxuICAgICAgICB0aGlzLl9pbml0KHRoaXMpO1xuICAgICAgfTtcblxuICAgIFJlc3BvbnNpdmVOYXYucHJvdG90eXBlID0ge1xuXG4gICAgICAvKipcbiAgICAgICAqIFVuYXR0YWNoZXMgZXZlbnRzIGFuZCByZW1vdmVzIGFueSBjbGFzc2VzIHRoYXQgd2VyZSBhZGRlZFxuICAgICAgICovXG4gICAgICBkZXN0cm95OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuX3JlbW92ZVN0eWxlcygpO1xuICAgICAgICByZW1vdmVDbGFzcyhuYXYsIFwiY2xvc2VkXCIpO1xuICAgICAgICByZW1vdmVDbGFzcyhuYXYsIFwib3BlbmVkXCIpO1xuICAgICAgICByZW1vdmVDbGFzcyhuYXYsIG9wdHMubmF2Q2xhc3MpO1xuICAgICAgICByZW1vdmVDbGFzcyhuYXYsIG9wdHMubmF2Q2xhc3MgKyBcIi1cIiArIHRoaXMuaW5kZXgpO1xuICAgICAgICByZW1vdmVDbGFzcyhodG1sRWwsIG9wdHMubmF2QWN0aXZlQ2xhc3MpO1xuICAgICAgICBuYXYucmVtb3ZlQXR0cmlidXRlKFwic3R5bGVcIik7XG4gICAgICAgIG5hdi5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKTtcblxuICAgICAgICByZW1vdmVFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQod2luZG93LCBcImZvY3VzXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQoZG9jdW1lbnQuYm9keSwgXCJ0b3VjaG1vdmVcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwidG91Y2hzdGFydFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KG5hdlRvZ2dsZSwgXCJ0b3VjaGVuZFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KG5hdlRvZ2dsZSwgXCJtb3VzZXVwXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcImtleXVwXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcImNsaWNrXCIsIHRoaXMsIGZhbHNlKTtcblxuICAgICAgICBpZiAoIW9wdHMuY3VzdG9tVG9nZ2xlKSB7XG4gICAgICAgICAgbmF2VG9nZ2xlLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobmF2VG9nZ2xlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBuYXZUb2dnbGUucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVG9nZ2xlcyB0aGUgbmF2aWdhdGlvbiBvcGVuL2Nsb3NlXG4gICAgICAgKi9cbiAgICAgIHRvZ2dsZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaGFzQW5pbUZpbmlzaGVkID09PSB0cnVlKSB7XG4gICAgICAgICAgaWYgKCFuYXZPcGVuKSB7XG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBPcGVucyB0aGUgbmF2aWdhdGlvblxuICAgICAgICovXG4gICAgICBvcGVuOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghbmF2T3Blbikge1xuICAgICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgXCJjbG9zZWRcIik7XG4gICAgICAgICAgYWRkQ2xhc3MobmF2LCBcIm9wZW5lZFwiKTtcbiAgICAgICAgICBhZGRDbGFzcyhodG1sRWwsIG9wdHMubmF2QWN0aXZlQ2xhc3MpO1xuICAgICAgICAgIGFkZENsYXNzKG5hdlRvZ2dsZSwgXCJhY3RpdmVcIik7XG4gICAgICAgICAgbmF2LnN0eWxlLnBvc2l0aW9uID0gb3B0cy5vcGVuUG9zO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXMobmF2LCB7XCJhcmlhLWhpZGRlblwiOiBcImZhbHNlXCJ9KTtcbiAgICAgICAgICBuYXZPcGVuID0gdHJ1ZTtcbiAgICAgICAgICBvcHRzLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDbG9zZXMgdGhlIG5hdmlnYXRpb25cbiAgICAgICAqL1xuICAgICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKG5hdk9wZW4pIHtcbiAgICAgICAgICBhZGRDbGFzcyhuYXYsIFwiY2xvc2VkXCIpO1xuICAgICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgXCJvcGVuZWRcIik7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MoaHRtbEVsLCBvcHRzLm5hdkFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICByZW1vdmVDbGFzcyhuYXZUb2dnbGUsIFwiYWN0aXZlXCIpO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXMobmF2LCB7XCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0pO1xuXG4gICAgICAgICAgLy8gSWYgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZCwgd2FpdCB1bnRpbCB0aGV5IGZpbmlzaFxuICAgICAgICAgIGlmIChvcHRzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIGhhc0FuaW1GaW5pc2hlZCA9IGZhbHNlO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIG5hdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICAgICAgaGFzQW5pbUZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH0sIG9wdHMudHJhbnNpdGlvbiArIDEwKTtcblxuICAgICAgICAgIC8vIEFuaW1hdGlvbnMgYXJlbid0IGVuYWJsZWQsIHdlIGNhbiBkbyB0aGVzZSBpbW1lZGlhdGVseVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmF2T3BlbiA9IGZhbHNlO1xuICAgICAgICAgIG9wdHMuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZXNpemUgaXMgY2FsbGVkIG9uIHdpbmRvdyByZXNpemUgYW5kIG9yaWVudGF0aW9uIGNoYW5nZS5cbiAgICAgICAqIEl0IGluaXRpYWxpemVzIHRoZSBDU1Mgc3R5bGVzIGFuZCBoZWlnaHQgY2FsY3VsYXRpb25zLlxuICAgICAgICovXG4gICAgICByZXNpemU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBSZXNpemUgd2F0Y2hlcyBuYXZpZ2F0aW9uIHRvZ2dsZSdzIGRpc3BsYXkgc3RhdGVcbiAgICAgICAgaWYgKHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKG5hdlRvZ2dsZSwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZShcImRpc3BsYXlcIikgIT09IFwibm9uZVwiKSB7XG5cbiAgICAgICAgICBpc01vYmlsZSA9IHRydWU7XG4gICAgICAgICAgc2V0QXR0cmlidXRlcyhuYXZUb2dnbGUsIHtcImFyaWEtaGlkZGVuXCI6IFwiZmFsc2VcIn0pO1xuXG4gICAgICAgICAgLy8gSWYgdGhlIG5hdmlnYXRpb24gaXMgaGlkZGVuXG4gICAgICAgICAgaWYgKG5hdi5jbGFzc05hbWUubWF0Y2goLyhefFxccyljbG9zZWQoXFxzfCQpLykpIHtcbiAgICAgICAgICAgIHNldEF0dHJpYnV0ZXMobmF2LCB7XCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0pO1xuICAgICAgICAgICAgbmF2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2NyZWF0ZVN0eWxlcygpO1xuICAgICAgICAgIHRoaXMuX2NhbGNIZWlnaHQoKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGlzTW9iaWxlID0gZmFsc2U7XG4gICAgICAgICAgc2V0QXR0cmlidXRlcyhuYXZUb2dnbGUsIHtcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwifSk7XG4gICAgICAgICAgc2V0QXR0cmlidXRlcyhuYXYsIHtcImFyaWEtaGlkZGVuXCI6IFwiZmFsc2VcIn0pO1xuICAgICAgICAgIG5hdi5zdHlsZS5wb3NpdGlvbiA9IG9wdHMub3BlblBvcztcbiAgICAgICAgICB0aGlzLl9yZW1vdmVTdHlsZXMoKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUYWtlcyBjYXJlIG9mIGFsbCBldmVuIGhhbmRsaW5nXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKiBAcmV0dXJuIHt0eXBlfSByZXR1cm5zIHRoZSB0eXBlIG9mIGV2ZW50IHRoYXQgc2hvdWxkIGJlIHVzZWRcbiAgICAgICAqL1xuICAgICAgaGFuZGxlRXZlbnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBldnQgPSBlIHx8IHdpbmRvdy5ldmVudDtcblxuICAgICAgICBzd2l0Y2ggKGV2dC50eXBlKSB7XG4gICAgICAgIGNhc2UgXCJ0b3VjaHN0YXJ0XCI6XG4gICAgICAgICAgdGhpcy5fb25Ub3VjaFN0YXJ0KGV2dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ0b3VjaG1vdmVcIjpcbiAgICAgICAgICB0aGlzLl9vblRvdWNoTW92ZShldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidG91Y2hlbmRcIjpcbiAgICAgICAgY2FzZSBcIm1vdXNldXBcIjpcbiAgICAgICAgICB0aGlzLl9vblRvdWNoRW5kKGV2dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJjbGlja1wiOlxuICAgICAgICAgIHRoaXMuX3ByZXZlbnREZWZhdWx0KGV2dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJrZXl1cFwiOlxuICAgICAgICAgIHRoaXMuX29uS2V5VXAoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZvY3VzXCI6XG4gICAgICAgIGNhc2UgXCJyZXNpemVcIjpcbiAgICAgICAgICB0aGlzLnJlc2l6ZShldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEluaXRpYWxpemVzIHRoZSB3aWRnZXRcbiAgICAgICAqL1xuICAgICAgX2luaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4Kys7XG5cbiAgICAgICAgYWRkQ2xhc3MobmF2LCBvcHRzLm5hdkNsYXNzKTtcbiAgICAgICAgYWRkQ2xhc3MobmF2LCBvcHRzLm5hdkNsYXNzICsgXCItXCIgKyB0aGlzLmluZGV4KTtcbiAgICAgICAgYWRkQ2xhc3MobmF2LCBcImNsb3NlZFwiKTtcbiAgICAgICAgaGFzQW5pbUZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgbmF2T3BlbiA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2Nsb3NlT25OYXZDbGljaygpO1xuICAgICAgICB0aGlzLl9jcmVhdGVUb2dnbGUoKTtcbiAgICAgICAgdGhpcy5fdHJhbnNpdGlvbnMoKTtcbiAgICAgICAgdGhpcy5yZXNpemUoKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogT24gSUU4IHRoZSByZXNpemUgZXZlbnQgdHJpZ2dlcnMgdG9vIGVhcmx5IGZvciBzb21lIHJlYXNvblxuICAgICAgICAgKiBzbyBpdCdzIGNhbGxlZCBoZXJlIGFnYWluIG9uIGluaXQgdG8gbWFrZSBzdXJlIGFsbCB0aGVcbiAgICAgICAgICogY2FsY3VsYXRlZCBzdHlsZXMgYXJlIGNvcnJlY3QuXG4gICAgICAgICAqL1xuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHNlbGYucmVzaXplKCk7XG4gICAgICAgIH0sIDIwKTtcblxuICAgICAgICBhZGRFdmVudCh3aW5kb3csIFwicmVzaXplXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQod2luZG93LCBcImZvY3VzXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQoZG9jdW1lbnQuYm9keSwgXCJ0b3VjaG1vdmVcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChuYXZUb2dnbGUsIFwidG91Y2hzdGFydFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KG5hdlRvZ2dsZSwgXCJ0b3VjaGVuZFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KG5hdlRvZ2dsZSwgXCJtb3VzZXVwXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQobmF2VG9nZ2xlLCBcImtleXVwXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQobmF2VG9nZ2xlLCBcImNsaWNrXCIsIHRoaXMsIGZhbHNlKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogSW5pdCBjYWxsYmFjayBoZXJlXG4gICAgICAgICAqL1xuICAgICAgICBvcHRzLmluaXQoKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBTdHlsZXMgdG8gdGhlIDxoZWFkPlxuICAgICAgICovXG4gICAgICBfY3JlYXRlU3R5bGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghc3R5bGVFbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICBzdHlsZUVsZW1lbnQudHlwZSA9IFwidGV4dC9jc3NcIjtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmVzIHN0eWxlcyBmcm9tIHRoZSA8aGVhZD5cbiAgICAgICAqL1xuICAgICAgX3JlbW92ZVN0eWxlczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUpIHtcbiAgICAgICAgICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgTmF2aWdhdGlvbiBUb2dnbGVcbiAgICAgICAqL1xuICAgICAgX2NyZWF0ZVRvZ2dsZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gdG9nZ2xlLCBsZXQncyBjcmVhdGUgb25lXG4gICAgICAgIGlmICghb3B0cy5jdXN0b21Ub2dnbGUpIHtcbiAgICAgICAgICB2YXIgdG9nZ2xlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImFcIik7XG4gICAgICAgICAgdG9nZ2xlLmlubmVySFRNTCA9IG9wdHMubGFiZWw7XG4gICAgICAgICAgc2V0QXR0cmlidXRlcyh0b2dnbGUsIHtcbiAgICAgICAgICAgIFwiaHJlZlwiOiBcIiNcIixcbiAgICAgICAgICAgIFwiY2xhc3NcIjogXCJuYXYtdG9nZ2xlXCJcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIC8vIERldGVybWluZSB3aGVyZSB0byBpbnNlcnQgdGhlIHRvZ2dsZVxuICAgICAgICAgIGlmIChvcHRzLmluc2VydCA9PT0gXCJhZnRlclwiKSB7XG4gICAgICAgICAgICBuYXYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodG9nZ2xlLCBuYXYubmV4dFNpYmxpbmcpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuYXYucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUodG9nZ2xlLCBuYXYpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5hdlRvZ2dsZSA9IHRvZ2dsZTtcblxuICAgICAgICAvLyBUaGVyZSBpcyBhIHRvZ2dsZSBhbHJlYWR5LCBsZXQncyB1c2UgdGhhdCBvbmVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdG9nZ2xlRWwgPSBvcHRzLmN1c3RvbVRvZ2dsZS5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcblxuICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b2dnbGVFbCkpIHtcbiAgICAgICAgICAgIG5hdlRvZ2dsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvZ2dsZUVsKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodG9nZ2xlRWwpKSB7XG4gICAgICAgICAgICBuYXZUb2dnbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRvZ2dsZUVsKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIGN1c3RvbSBuYXYgdG9nZ2xlIHlvdSBhcmUgdHJ5aW5nIHRvIHNlbGVjdCBkb2Vzbid0IGV4aXN0XCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDbG9zZXMgdGhlIG5hdmlnYXRpb24gd2hlbiBhIGxpbmsgaW5zaWRlIGlzIGNsaWNrZWQuXG4gICAgICAgKi9cbiAgICAgIF9jbG9zZU9uTmF2Q2xpY2s6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKG9wdHMuY2xvc2VPbk5hdkNsaWNrKSB7XG4gICAgICAgICAgdmFyIGxpbmtzID0gbmF2LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiYVwiKSxcbiAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICAgIGZvckVhY2gobGlua3MsIGZ1bmN0aW9uIChpLCBlbCkge1xuICAgICAgICAgICAgYWRkRXZlbnQobGlua3NbaV0sIFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgICAgICAgICAgICBzZWxmLnRvZ2dsZSgpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUHJldmVudHMgdGhlIGRlZmF1bHQgZnVuY3Rpb25hbGl0eS5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqL1xuICAgICAgX3ByZXZlbnREZWZhdWx0OiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgaWYgKGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgICBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgLy8gVGhpcyBpcyBzdHJpY3RseSBmb3Igb2xkIElFXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZS5yZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIE9uIHRvdWNoIHN0YXJ0IHdlIGdldCB0aGUgbG9jYXRpb24gb2YgdGhlIHRvdWNoLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSBldmVudFxuICAgICAgICovXG4gICAgICBfb25Ub3VjaFN0YXJ0OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoIUV2ZW50LnByb3RvdHlwZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICB0aGlzLl9wcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXJ0WCA9IGUudG91Y2hlc1swXS5jbGllbnRYO1xuICAgICAgICB0aGlzLnN0YXJ0WSA9IGUudG91Y2hlc1swXS5jbGllbnRZO1xuICAgICAgICB0aGlzLnRvdWNoSGFzTW92ZWQgPSBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogUmVtb3ZlIG1vdXNldXAgZXZlbnQgY29tcGxldGVseSBoZXJlIHRvIGF2b2lkXG4gICAgICAgICAqIGRvdWJsZSB0cmlnZ2VyaW5nIHRoZSBldmVudC5cbiAgICAgICAgICovXG4gICAgICAgIHJlbW92ZUV2ZW50KG5hdlRvZ2dsZSwgXCJtb3VzZXVwXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2hlY2sgaWYgdGhlIHVzZXIgaXMgc2Nyb2xsaW5nIGluc3RlYWQgb2YgdGFwcGluZy5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqL1xuICAgICAgX29uVG91Y2hNb3ZlOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAoTWF0aC5hYnMoZS50b3VjaGVzWzBdLmNsaWVudFggLSB0aGlzLnN0YXJ0WCkgPiAxMCB8fFxuICAgICAgICBNYXRoLmFicyhlLnRvdWNoZXNbMF0uY2xpZW50WSAtIHRoaXMuc3RhcnRZKSA+IDEwKSB7XG4gICAgICAgICAgdGhpcy50b3VjaEhhc01vdmVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBPbiB0b3VjaCBlbmQgdG9nZ2xlIHRoZSBuYXZpZ2F0aW9uLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSBldmVudFxuICAgICAgICovXG4gICAgICBfb25Ub3VjaEVuZDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdGhpcy5fcHJldmVudERlZmF1bHQoZSk7XG4gICAgICAgIGlmICghaXNNb2JpbGUpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiB0aGUgdXNlciBpc24ndCBzY3JvbGxpbmdcbiAgICAgICAgaWYgKCF0aGlzLnRvdWNoSGFzTW92ZWQpIHtcblxuICAgICAgICAgIC8vIElmIHRoZSBldmVudCB0eXBlIGlzIHRvdWNoXG4gICAgICAgICAgaWYgKGUudHlwZSA9PT0gXCJ0b3VjaGVuZFwiKSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgcmV0dXJuO1xuXG4gICAgICAgICAgLy8gRXZlbnQgdHlwZSB3YXMgY2xpY2ssIG5vdCB0b3VjaFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2YXIgZXZ0ID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG5cbiAgICAgICAgICAgIC8vIElmIGl0IGlzbid0IGEgcmlnaHQgY2xpY2ssIGRvIHRvZ2dsaW5nXG4gICAgICAgICAgICBpZiAoIShldnQud2hpY2ggPT09IDMgfHwgZXZ0LmJ1dHRvbiA9PT0gMikpIHtcbiAgICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogRm9yIGtleWJvYXJkIGFjY2Vzc2liaWxpdHksIHRvZ2dsZSB0aGUgbmF2aWdhdGlvbiBvbiBFbnRlclxuICAgICAgICoga2V5cHJlc3MgdG9vLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSBldmVudFxuICAgICAgICovXG4gICAgICBfb25LZXlVcDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGV2dCA9IGUgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICBpZiAoZXZ0LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBBZGRzIHRoZSBuZWVkZWQgQ1NTIHRyYW5zaXRpb25zIGlmIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWRcbiAgICAgICAqL1xuICAgICAgX3RyYW5zaXRpb25zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChvcHRzLmFuaW1hdGUpIHtcbiAgICAgICAgICB2YXIgb2JqU3R5bGUgPSBuYXYuc3R5bGUsXG4gICAgICAgICAgICB0cmFuc2l0aW9uID0gXCJtYXgtaGVpZ2h0IFwiICsgb3B0cy50cmFuc2l0aW9uICsgXCJtc1wiO1xuXG4gICAgICAgICAgb2JqU3R5bGUuV2Via2l0VHJhbnNpdGlvbiA9XG4gICAgICAgICAgb2JqU3R5bGUuTW96VHJhbnNpdGlvbiA9XG4gICAgICAgICAgb2JqU3R5bGUuT1RyYW5zaXRpb24gPVxuICAgICAgICAgIG9ialN0eWxlLnRyYW5zaXRpb24gPSB0cmFuc2l0aW9uO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENhbGN1bGF0ZXMgdGhlIGhlaWdodCBvZiB0aGUgbmF2aWdhdGlvbiBhbmQgdGhlbiBjcmVhdGVzXG4gICAgICAgKiBzdHlsZXMgd2hpY2ggYXJlIGxhdGVyIGFkZGVkIHRvIHRoZSBwYWdlIDxoZWFkPlxuICAgICAgICovXG4gICAgICBfY2FsY0hlaWdodDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2F2ZWRIZWlnaHQgPSAwO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5hdi5pbm5lci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHNhdmVkSGVpZ2h0ICs9IG5hdi5pbm5lcltpXS5vZmZzZXRIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaW5uZXJTdHlsZXMgPSBcIi5cIiArIG9wdHMuanNDbGFzcyArIFwiIC5cIiArIG9wdHMubmF2Q2xhc3MgKyBcIi1cIiArIHRoaXMuaW5kZXggKyBcIi5vcGVuZWR7bWF4LWhlaWdodDpcIiArIHNhdmVkSGVpZ2h0ICsgXCJweCAhaW1wb3J0YW50fSAuXCIgKyBvcHRzLmpzQ2xhc3MgKyBcIiAuXCIgKyBvcHRzLm5hdkNsYXNzICsgXCItXCIgKyB0aGlzLmluZGV4ICsgXCIub3BlbmVkLmRyb3Bkb3duLWFjdGl2ZSB7bWF4LWhlaWdodDo5OTk5cHggIWltcG9ydGFudH1cIjtcblxuICAgICAgICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICAgICAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gaW5uZXJTdHlsZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3R5bGVFbGVtZW50LmlubmVySFRNTCA9IGlubmVyU3R5bGVzO1xuICAgICAgICB9XG5cbiAgICAgICAgaW5uZXJTdHlsZXMgPSBcIlwiO1xuICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJldHVybiBuZXcgUmVzcG9uc2l2ZSBOYXZcbiAgICAgKi9cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNpdmVOYXYoZWwsIG9wdGlvbnMpO1xuXG4gIH07XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHJlc3BvbnNpdmVOYXY7XG4gIH0gZWxzZSB7XG4gICAgd2luZG93LnJlc3BvbnNpdmVOYXYgPSByZXNwb25zaXZlTmF2O1xuICB9XG5cbn0oZG9jdW1lbnQsIHdpbmRvdywgMCkpO1xuIiwidmFyIG5hdiA9IHJlc3BvbnNpdmVOYXYoXCIubmF2LWNvbGxhcHNlXCIpO1xuIl19
