'use strict';

// ==================================================
// fancyBox v3.1.25
//
// Licensed GPLv3 for open source use
// or fancyBox Commercial License for commercial use
//
// http://fancyapps.com/fancybox/
// Copyright 2017 fancyApps
//
// ==================================================
;(function (window, document, $, undefined) {
    'use strict';

    // If there's no jQuery, fancyBox can't work
    // =========================================

    if (!$) {
        return;
    }

    // Check if fancyBox is already initialized
    // ========================================

    if ($.fn.fancybox) {

        $.error('fancyBox already initialized');

        return;
    }

    // Private default settings
    // ========================

    var defaults = {

        // Enable infinite gallery navigation
        loop: false,

        // Space around image, ignored if zoomed-in or viewport smaller than 800px
        margin: [44, 0],

        // Horizontal space between slides
        gutter: 50,

        // Enable keyboard navigation
        keyboard: true,

        // Should display navigation arrows at the screen edges
        arrows: true,

        // Should display infobar (counter and arrows at the top)
        infobar: false,

        // Should display toolbar (buttons at the top)
        toolbar: true,

        // What buttons should appear in the top right corner.
        // Buttons will be created using templates from `btnTpl` option
        // and they will be placed into toolbar (class="fancybox-toolbar"` element)
        buttons: ['slideShow', 'fullScreen', 'thumbs', 'close'],

        // Detect "idle" time in seconds
        idleTime: 4,

        // Should display buttons at top right corner of the content
        // If 'auto' - they will be created for content having type 'html', 'inline' or 'ajax'
        // Use template from `btnTpl.smallBtn` for customization
        smallBtn: 'auto',

        // Disable right-click and use simple image protection for images
        protect: false,

        // Shortcut to make content "modal" - disable keyboard navigtion, hide buttons, etc
        modal: false,

        image: {

            // Wait for images to load before displaying
            // Requires predefined image dimensions
            // If 'auto' - will zoom in thumbnail if 'width' and 'height' attributes are found
            preload: "auto"

        },

        ajax: {

            // Object containing settings for ajax request
            settings: {

                // This helps to indicate that request comes from the modal
                // Feel free to change naming
                data: {
                    fancybox: true
                }
            }

        },

        iframe: {

            // Iframe template
            tpl: '<iframe id="fancybox-frame{rnd}" name="fancybox-frame{rnd}" class="fancybox-iframe" frameborder="0" vspace="0" hspace="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen allowtransparency="true" src=""></iframe>',

            // Preload iframe before displaying it
            // This allows to calculate iframe content width and height
            // (note: Due to "Same Origin Policy", you can't get cross domain data).
            preload: true,

            // Custom CSS styling for iframe wrapping element
            // You can use this to set custom iframe dimensions
            css: {},

            // Iframe tag attributes
            attr: {
                scrolling: 'auto'
            }

        },

        // Open/close animation type
        // Possible values:
        //   false            - disable
        //   "zoom"           - zoom images from/to thumbnail
        //   "fade"
        //   "zoom-in-out"
        //
        animationEffect: "zoom",

        // Duration in ms for open/close animation
        animationDuration: 366,

        // Should image change opacity while zooming
        // If opacity is 'auto', then opacity will be changed if image and thumbnail have different aspect ratios
        zoomOpacity: 'auto',

        // Transition effect between slides
        //
        // Possible values:
        //   false            - disable
        //   "fade'
        //   "slide'
        //   "circular'
        //   "tube'
        //   "zoom-in-out'
        //   "rotate'
        //
        transitionEffect: "fade",

        // Duration in ms for transition animation
        transitionDuration: 366,

        // Custom CSS class for slide element
        slideClass: '',

        // Custom CSS class for layout
        baseClass: '',

        // Base template for layout
        baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1">' + '<div class="fancybox-bg"></div>' + '<div class="fancybox-inner">' + '<div class="fancybox-infobar">' + '<button data-fancybox-prev title="{{PREV}}" class="fancybox-button fancybox-button--left"></button>' + '<div class="fancybox-infobar__body">' + '<span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span>' + '</div>' + '<button data-fancybox-next title="{{NEXT}}" class="fancybox-button fancybox-button--right"></button>' + '</div>' + '<div class="fancybox-toolbar">' + '{{BUTTONS}}' + '</div>' + '<div class="fancybox-navigation">' + '<button data-fancybox-prev title="{{PREV}}" class="fancybox-arrow fancybox-arrow--left" />' + '<button data-fancybox-next title="{{NEXT}}" class="fancybox-arrow fancybox-arrow--right" />' + '</div>' + '<div class="fancybox-stage"></div>' + '<div class="fancybox-caption-wrap">' + '<div class="fancybox-caption"></div>' + '</div>' + '</div>' + '</div>',

        // Loading indicator template
        spinnerTpl: '<div class="fancybox-loading"></div>',

        // Error message template
        errorTpl: '<div class="fancybox-error"><p>{{ERROR}}<p></div>',

        btnTpl: {
            slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}"></button>',
            fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}"></button>',
            thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}"></button>',
            close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}"></button>',

            // This small close button will be appended to your html/inline/ajax content by default,
            // if "smallBtn" option is not set to false
            smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>'
        },

        // Container is injected into this element
        parentEl: 'body',

        // Focus handling
        // ==============

        // Try to focus on the first focusable element after opening
        autoFocus: true,

        // Put focus back to active element after closing
        backFocus: true,

        // Do not let user to focus on element outside modal content
        trapFocus: true,

        // Module specific options
        // =======================

        fullScreen: {
            autoStart: false
        },

        touch: {
            vertical: true, // Allow to drag content vertically
            momentum: true // Continue movement after releasing mouse/touch when panning
        },

        // Hash value when initializing manually,
        // set `false` to disable hash change
        hash: null,

        // Customize or add new media types
        // Example:
        /*
        media : {
            youtube : {
                params : {
                    autoplay : 0
                }
            }
        }
        */
        media: {},

        slideShow: {
            autoStart: false,
            speed: 4000
        },

        thumbs: {
            autoStart: false, // Display thumbnails on opening
            hideOnClose: true // Hide thumbnail grid when closing animation starts
        },

        // Callbacks
        //==========

        // See Documentation/API/Events for more information
        // Example:
        /*
            afterShow: function( instance, current ) {
                 console.info( 'Clicked element:' );
                 console.info( current.opts.$orig );
            }
        */

        onInit: $.noop, // When instance has been initialized

        beforeLoad: $.noop, // Before the content of a slide is being loaded
        afterLoad: $.noop, // When the content of a slide is done loading

        beforeShow: $.noop, // Before open animation starts
        afterShow: $.noop, // When content is done loading and animating

        beforeClose: $.noop, // Before the instance attempts to close. Return false to cancel the close.
        afterClose: $.noop, // After instance has been closed

        onActivate: $.noop, // When instance is brought to front
        onDeactivate: $.noop, // When other instance has been activated


        // Interaction
        // ===========

        // Use options below to customize taken action when user clicks or double clicks on the fancyBox area,
        // each option can be string or method that returns value.
        //
        // Possible values:
        //   "close"           - close instance
        //   "next"            - move to next gallery item
        //   "nextOrClose"     - move to next gallery item or close if gallery has only one item
        //   "toggleControls"  - show/hide controls
        //   "zoom"            - zoom image (if loaded)
        //   false             - do nothing

        // Clicked on the content
        clickContent: function clickContent(current, event) {
            return current.type === 'image' ? 'zoom' : false;
        },

        // Clicked on the slide
        clickSlide: 'close',

        // Clicked on the background (backdrop) element
        clickOutside: 'close',

        // Same as previous two, but for double click
        dblclickContent: false,
        dblclickSlide: false,
        dblclickOutside: false,

        // Custom options when mobile device is detected
        // =============================================

        mobile: {
            clickContent: function clickContent(current, event) {
                return current.type === 'image' ? 'toggleControls' : false;
            },
            clickSlide: function clickSlide(current, event) {
                return current.type === 'image' ? 'toggleControls' : "close";
            },
            dblclickContent: function dblclickContent(current, event) {
                return current.type === 'image' ? 'zoom' : false;
            },
            dblclickSlide: function dblclickSlide(current, event) {
                return current.type === 'image' ? 'zoom' : false;
            }
        },

        // Internationalization
        // ============

        lang: 'en',
        i18n: {
            'en': {
                CLOSE: 'Close',
                NEXT: 'Next',
                PREV: 'Previous',
                ERROR: 'The requested content cannot be loaded. <br/> Please try again later.',
                PLAY_START: 'Start slideshow',
                PLAY_STOP: 'Pause slideshow',
                FULL_SCREEN: 'Full screen',
                THUMBS: 'Thumbnails'
            },
            'de': {
                CLOSE: 'Schliessen',
                NEXT: 'Weiter',
                PREV: 'Zurück',
                ERROR: 'Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.',
                PLAY_START: 'Diaschau starten',
                PLAY_STOP: 'Diaschau beenden',
                FULL_SCREEN: 'Vollbild',
                THUMBS: 'Vorschaubilder'
            }
        }

    };

    // Few useful variables and methods
    // ================================

    var $W = $(window);
    var $D = $(document);

    var called = 0;

    // Check if an object is a jQuery object and not a native JavaScript object
    // ========================================================================

    var isQuery = function isQuery(obj) {
        return obj && obj.hasOwnProperty && obj instanceof $;
    };

    // Handle multiple browsers for "requestAnimationFrame" and "cancelAnimationFrame"
    // ===============================================================================

    var requestAFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
        // if all else fails, use setTimeout
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    }();

    // Detect the supported transition-end event property name
    // =======================================================

    var transitionEnd = function () {
        var t,
            el = document.createElement("fakeelement");

        var transitions = {
            "transition": "transitionend",
            "OTransition": "oTransitionEnd",
            "MozTransition": "transitionend",
            "WebkitTransition": "webkitTransitionEnd"
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }();

    // Force redraw on an element.
    // This helps in cases where the browser doesn't redraw an updated element properly.
    // =================================================================================

    var forceRedraw = function forceRedraw($el) {
        return $el && $el.length && $el[0].offsetHeight;
    };

    // Class definition
    // ================

    var FancyBox = function FancyBox(content, opts, index) {
        var self = this;

        self.opts = $.extend(true, { index: index }, defaults, opts || {});

        // Exclude buttons option from deep merging
        if (opts && $.isArray(opts.buttons)) {
            self.opts.buttons = opts.buttons;
        }

        self.id = self.opts.id || ++called;
        self.group = [];

        self.currIndex = parseInt(self.opts.index, 10) || 0;
        self.prevIndex = null;

        self.prevPos = null;
        self.currPos = 0;

        self.firstRun = null;

        // Create group elements from original item collection
        self.createGroup(content);

        if (!self.group.length) {
            return;
        }

        // Save last active element and current scroll position
        self.$lastFocus = $(document.activeElement).blur();

        // Collection of gallery objects
        self.slides = {};

        self.init(content);
    };

    $.extend(FancyBox.prototype, {

        // Create DOM structure
        // ====================

        init: function init() {
            var self = this;

            var testWidth, $container, buttonStr;

            var firstItemOpts = self.group[self.currIndex].opts;

            self.scrollTop = $D.scrollTop();
            self.scrollLeft = $D.scrollLeft();

            // Hide scrollbars
            // ===============

            if (!$.fancybox.getInstance() && !$.fancybox.isMobile && $('body').css('overflow') !== 'hidden') {
                testWidth = $('body').width();

                $('html').addClass('fancybox-enabled');

                // Compare body width after applying "overflow: hidden"
                testWidth = $('body').width() - testWidth;

                // If width has changed - compensate missing scrollbars by adding right margin
                if (testWidth > 1) {
                    $('head').append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar, .fancybox-enabled body { margin-right: ' + testWidth + 'px; }</style>');
                }
            }

            // Build html markup and set references
            // ====================================

            // Build html code for buttons and insert into main template
            buttonStr = '';

            $.each(firstItemOpts.buttons, function (index, value) {
                buttonStr += firstItemOpts.btnTpl[value] || '';
            });

            // Create markup from base template, it will be initially hidden to
            // avoid unnecessary work like painting while initializing is not complete
            $container = $(self.translate(self, firstItemOpts.baseTpl.replace('\{\{BUTTONS\}\}', buttonStr))).addClass('fancybox-is-hidden').attr('id', 'fancybox-container-' + self.id).addClass(firstItemOpts.baseClass).data('FancyBox', self).prependTo(firstItemOpts.parentEl);

            // Create object holding references to jQuery wrapped nodes
            self.$refs = {
                container: $container
            };

            ['bg', 'inner', 'infobar', 'toolbar', 'stage', 'caption'].forEach(function (item) {
                self.$refs[item] = $container.find('.fancybox-' + item);
            });

            // Check for redundant elements
            if (!firstItemOpts.arrows || self.group.length < 2) {
                $container.find('.fancybox-navigation').remove();
            }

            if (!firstItemOpts.infobar) {
                self.$refs.infobar.remove();
            }

            if (!firstItemOpts.toolbar) {
                self.$refs.toolbar.remove();
            }

            self.trigger('onInit');

            // Bring to front and enable events
            self.activate();

            // Build slides, load and reveal content
            self.jumpTo(self.currIndex);
        },

        // Simple i18n support - replaces object keys found in template
        // with corresponding values
        // ============================================================

        translate: function translate(obj, str) {
            var arr = obj.opts.i18n[obj.opts.lang];

            return str.replace(/\{\{(\w+)\}\}/g, function (match, n) {
                var value = arr[n];

                if (value === undefined) {
                    return match;
                }

                return value;
            });
        },

        // Create array of gally item objects
        // Check if each object has valid type and content
        // ===============================================

        createGroup: function createGroup(content) {
            var self = this;
            var items = $.makeArray(content);

            $.each(items, function (i, item) {
                var obj = {},
                    opts = {},
                    data = [],
                    $item,
                    type,
                    src,
                    srcParts;

                // Step 1 - Make sure we have an object
                // ====================================

                if ($.isPlainObject(item)) {

                    // We probably have manual usage here, something like
                    // $.fancybox.open( [ { src : "image.jpg", type : "image" } ] )

                    obj = item;
                    opts = item.opts || item;
                } else if ($.type(item) === 'object' && $(item).length) {

                    // Here we propbably have jQuery collection returned by some selector

                    $item = $(item);
                    data = $item.data();

                    opts = 'options' in data ? data.options : {};
                    opts = $.type(opts) === 'object' ? opts : {};

                    obj.src = 'src' in data ? data.src : opts.src || $item.attr('href');

                    ['width', 'height', 'thumb', 'type', 'filter'].forEach(function (item) {
                        if (item in data) {
                            opts[item] = data[item];
                        }
                    });

                    if ('srcset' in data) {
                        opts.image = { srcset: data.srcset };
                    }

                    opts.$orig = $item;

                    if (!obj.type && !obj.src) {
                        obj.type = 'inline';
                        obj.src = item;
                    }
                } else {

                    // Assume we have a simple html code, for example:
                    // $.fancybox.open( '<div><h1>Hi!</h1></div>' );

                    obj = {
                        type: 'html',
                        src: item + ''
                    };
                }

                // Each gallery object has full collection of options
                obj.opts = $.extend(true, {}, self.opts, opts);

                if ($.fancybox.isMobile) {
                    obj.opts = $.extend(true, {}, obj.opts, obj.opts.mobile);
                }

                // Step 2 - Make sure we have content type, if not - try to guess
                // ==============================================================

                type = obj.type || obj.opts.type;
                src = obj.src || '';

                if (!type && src) {
                    if (src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)) {
                        type = 'image';
                    } else if (src.match(/\.(pdf)((\?|#).*)?$/i)) {
                        type = 'pdf';
                    } else if (src.charAt(0) === '#') {
                        type = 'inline';
                    }
                }

                obj.type = type;

                // Step 3 - Some adjustments
                // =========================

                obj.index = self.group.length;

                // Check if $orig and $thumb objects exist
                if (obj.opts.$orig && !obj.opts.$orig.length) {
                    delete obj.opts.$orig;
                }

                if (!obj.opts.$thumb && obj.opts.$orig) {
                    obj.opts.$thumb = obj.opts.$orig.find('img:first');
                }

                if (obj.opts.$thumb && !obj.opts.$thumb.length) {
                    delete obj.opts.$thumb;
                }

                // Caption is a "special" option, it can be passed as a method
                if ($.type(obj.opts.caption) === 'function') {
                    obj.opts.caption = obj.opts.caption.apply(item, [self, obj]);
                } else if ('caption' in data) {
                    obj.opts.caption = data.caption;
                }

                // Make sure we have caption as a string
                obj.opts.caption = obj.opts.caption === undefined ? '' : obj.opts.caption + '';

                // Check if url contains "filter" used to filter the content
                // Example: "ajax.html #something"
                if (type === 'ajax') {
                    srcParts = src.split(/\s+/, 2);

                    if (srcParts.length > 1) {
                        obj.src = srcParts.shift();

                        obj.opts.filter = srcParts.shift();
                    }
                }

                if (obj.opts.smallBtn == 'auto') {

                    if ($.inArray(type, ['html', 'inline', 'ajax']) > -1) {
                        obj.opts.toolbar = false;
                        obj.opts.smallBtn = true;
                    } else {
                        obj.opts.smallBtn = false;
                    }
                }

                // If the type is "pdf", then simply load file into iframe
                if (type === 'pdf') {
                    obj.type = 'iframe';

                    obj.opts.iframe.preload = false;
                }

                // Hide all buttons and disable interactivity for modal items
                if (obj.opts.modal) {

                    obj.opts = $.extend(true, obj.opts, {
                        // Remove buttons
                        infobar: 0,
                        toolbar: 0,

                        smallBtn: 0,

                        // Disable keyboard navigation
                        keyboard: 0,

                        // Disable some modules
                        slideShow: 0,
                        fullScreen: 0,
                        thumbs: 0,
                        touch: 0,

                        // Disable click event handlers
                        clickContent: false,
                        clickSlide: false,
                        clickOutside: false,
                        dblclickContent: false,
                        dblclickSlide: false,
                        dblclickOutside: false
                    });
                }

                // Step 4 - Add processed object to group
                // ======================================

                self.group.push(obj);
            });
        },

        // Attach an event handler functions for:
        //   - navigation buttons
        //   - browser scrolling, resizing;
        //   - focusing
        //   - keyboard
        //   - detect idle
        // ======================================

        addEvents: function addEvents() {
            var self = this;

            self.removeEvents();

            // Make navigation elements clickable
            self.$refs.container.on('click.fb-close', '[data-fancybox-close]', function (e) {
                e.stopPropagation();
                e.preventDefault();

                self.close(e);
            }).on('click.fb-prev touchend.fb-prev', '[data-fancybox-prev]', function (e) {
                e.stopPropagation();
                e.preventDefault();

                self.previous();
            }).on('click.fb-next touchend.fb-next', '[data-fancybox-next]', function (e) {
                e.stopPropagation();
                e.preventDefault();

                self.next();
            });

            // Handle page scrolling and browser resizing
            $W.on('orientationchange.fb resize.fb', function (e) {

                if (e && e.originalEvent && e.originalEvent.type === "resize") {

                    requestAFrame(function () {
                        self.update();
                    });
                } else {

                    self.$refs.stage.hide();

                    setTimeout(function () {
                        self.$refs.stage.show();

                        self.update();
                    }, 500);
                }
            });

            // Trap keyboard focus inside of the modal, so the user does not accidentally tab outside of the modal
            // (a.k.a. "escaping the modal")
            $D.on('focusin.fb', function (e) {
                var instance = $.fancybox ? $.fancybox.getInstance() : null;

                if (instance.isClosing || !instance.current || !instance.current.opts.trapFocus || $(e.target).hasClass('fancybox-container') || $(e.target).is(document)) {
                    return;
                }

                if (instance && $(e.target).css('position') !== 'fixed' && !instance.$refs.container.has(e.target).length) {
                    e.stopPropagation();

                    instance.focus();

                    // Sometimes page gets scrolled, set it back
                    $W.scrollTop(self.scrollTop).scrollLeft(self.scrollLeft);
                }
            });

            // Enable keyboard navigation
            $D.on('keydown.fb', function (e) {
                var current = self.current,
                    keycode = e.keyCode || e.which;

                if (!current || !current.opts.keyboard) {
                    return;
                }

                if ($(e.target).is('input') || $(e.target).is('textarea')) {
                    return;
                }

                // Backspace and Esc keys
                if (keycode === 8 || keycode === 27) {
                    e.preventDefault();

                    self.close(e);

                    return;
                }

                // Left arrow and Up arrow
                if (keycode === 37 || keycode === 38) {
                    e.preventDefault();

                    self.previous();

                    return;
                }

                // Righ arrow and Down arrow
                if (keycode === 39 || keycode === 40) {
                    e.preventDefault();

                    self.next();

                    return;
                }

                self.trigger('afterKeydown', e, keycode);
            });

            // Hide controls after some inactivity period
            if (self.group[self.currIndex].opts.idleTime) {
                self.idleSecondsCounter = 0;

                $D.on('mousemove.fb-idle mouseenter.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle', function () {
                    self.idleSecondsCounter = 0;

                    if (self.isIdle) {
                        self.showControls();
                    }

                    self.isIdle = false;
                });

                self.idleInterval = window.setInterval(function () {

                    self.idleSecondsCounter++;

                    if (self.idleSecondsCounter >= self.group[self.currIndex].opts.idleTime) {
                        self.isIdle = true;
                        self.idleSecondsCounter = 0;

                        self.hideControls();
                    }
                }, 1000);
            }
        },

        // Remove events added by the core
        // ===============================

        removeEvents: function removeEvents() {
            var self = this;

            $W.off('orientationchange.fb resize.fb');
            $D.off('focusin.fb keydown.fb .fb-idle');

            this.$refs.container.off('.fb-close .fb-prev .fb-next');

            if (self.idleInterval) {
                window.clearInterval(self.idleInterval);

                self.idleInterval = null;
            }
        },

        // Change to previous gallery item
        // ===============================

        previous: function previous(duration) {
            return this.jumpTo(this.currPos - 1, duration);
        },

        // Change to next gallery item
        // ===========================

        next: function next(duration) {
            return this.jumpTo(this.currPos + 1, duration);
        },

        // Switch to selected gallery item
        // ===============================

        jumpTo: function jumpTo(pos, duration, slide) {
            var self = this,
                firstRun,
                loop,
                current,
                previous,
                canvasWidth,
                currentPos,
                transitionProps;

            var groupLen = self.group.length;

            if (self.isSliding || self.isClosing || self.isAnimating && self.firstRun) {
                return;
            }

            pos = parseInt(pos, 10);
            loop = self.current ? self.current.opts.loop : self.opts.loop;

            if (!loop && (pos < 0 || pos >= groupLen)) {
                return false;
            }

            firstRun = self.firstRun = self.firstRun === null;

            if (groupLen < 2 && !firstRun && !!self.isSliding) {
                return;
            }

            previous = self.current;

            self.prevIndex = self.currIndex;
            self.prevPos = self.currPos;

            // Create slides
            current = self.createSlide(pos);

            if (groupLen > 1) {
                if (loop || current.index > 0) {
                    self.createSlide(pos - 1);
                }

                if (loop || current.index < groupLen - 1) {
                    self.createSlide(pos + 1);
                }
            }

            self.current = current;
            self.currIndex = current.index;
            self.currPos = current.pos;

            self.trigger('beforeShow', firstRun);

            self.updateControls();

            currentPos = $.fancybox.getTranslate(current.$slide);

            current.isMoved = (currentPos.left !== 0 || currentPos.top !== 0) && !current.$slide.hasClass('fancybox-animated');
            current.forcedDuration = undefined;

            if ($.isNumeric(duration)) {
                current.forcedDuration = duration;
            } else {
                duration = current.opts[firstRun ? 'animationDuration' : 'transitionDuration'];
            }

            duration = parseInt(duration, 10);

            // Fresh start - reveal container, current slide and start loading content
            if (firstRun) {

                if (current.opts.animationEffect && duration) {
                    self.$refs.container.css('transition-duration', duration + 'ms');
                }

                self.$refs.container.removeClass('fancybox-is-hidden');

                forceRedraw(self.$refs.container);

                self.$refs.container.addClass('fancybox-is-open');

                // Make first slide visible (to display loading icon, if needed)
                current.$slide.addClass('fancybox-slide--current');

                self.loadSlide(current);

                self.preload();

                return;
            }

            // Clean up
            $.each(self.slides, function (index, slide) {
                $.fancybox.stop(slide.$slide);
            });

            // Make current that slide is visible even if content is still loading
            current.$slide.removeClass('fancybox-slide--next fancybox-slide--previous').addClass('fancybox-slide--current');

            // If slides have been dragged, animate them to correct position
            if (current.isMoved) {
                canvasWidth = Math.round(current.$slide.width());

                $.each(self.slides, function (index, slide) {
                    var pos = slide.pos - current.pos;

                    $.fancybox.animate(slide.$slide, {
                        top: 0,
                        left: pos * canvasWidth + pos * slide.opts.gutter
                    }, duration, function () {

                        slide.$slide.removeAttr('style').removeClass('fancybox-slide--next fancybox-slide--previous');

                        if (slide.pos === self.currPos) {
                            current.isMoved = false;

                            self.complete();
                        }
                    });
                });
            } else {
                self.$refs.stage.children().removeAttr('style');
            }

            // Start transition that reveals current content
            // or wait when it will be loaded

            if (current.isLoaded) {
                self.revealContent(current);
            } else {
                self.loadSlide(current);
            }

            self.preload();

            if (previous.pos === current.pos) {
                return;
            }

            // Handle previous slide
            // =====================

            transitionProps = 'fancybox-slide--' + (previous.pos > current.pos ? 'next' : 'previous');

            previous.$slide.removeClass('fancybox-slide--complete fancybox-slide--current fancybox-slide--next fancybox-slide--previous');

            previous.isComplete = false;

            if (!duration || !current.isMoved && !current.opts.transitionEffect) {
                return;
            }

            if (current.isMoved) {
                previous.$slide.addClass(transitionProps);
            } else {

                transitionProps = 'fancybox-animated ' + transitionProps + ' fancybox-fx-' + current.opts.transitionEffect;

                $.fancybox.animate(previous.$slide, transitionProps, duration, function () {
                    previous.$slide.removeClass(transitionProps).removeAttr('style');
                });
            }
        },

        // Create new "slide" element
        // These are gallery items  that are actually added to DOM
        // =======================================================

        createSlide: function createSlide(pos) {

            var self = this;
            var $slide;
            var index;

            index = pos % self.group.length;
            index = index < 0 ? self.group.length + index : index;

            if (!self.slides[pos] && self.group[index]) {
                $slide = $('<div class="fancybox-slide"></div>').appendTo(self.$refs.stage);

                self.slides[pos] = $.extend(true, {}, self.group[index], {
                    pos: pos,
                    $slide: $slide,
                    isLoaded: false
                });

                self.updateSlide(self.slides[pos]);
            }

            return self.slides[pos];
        },

        // Scale image to the actual size of the image
        // ===========================================

        scaleToActual: function scaleToActual(x, y, duration) {

            var self = this;

            var current = self.current;
            var $what = current.$content;

            var imgPos, posX, posY, scaleX, scaleY;

            var canvasWidth = parseInt(current.$slide.width(), 10);
            var canvasHeight = parseInt(current.$slide.height(), 10);

            var newImgWidth = current.width;
            var newImgHeight = current.height;

            if (!(current.type == 'image' && !current.hasError) || !$what || self.isAnimating) {
                return;
            }

            $.fancybox.stop($what);

            self.isAnimating = true;

            x = x === undefined ? canvasWidth * 0.5 : x;
            y = y === undefined ? canvasHeight * 0.5 : y;

            imgPos = $.fancybox.getTranslate($what);

            scaleX = newImgWidth / imgPos.width;
            scaleY = newImgHeight / imgPos.height;

            // Get center position for original image
            posX = canvasWidth * 0.5 - newImgWidth * 0.5;
            posY = canvasHeight * 0.5 - newImgHeight * 0.5;

            // Make sure image does not move away from edges
            if (newImgWidth > canvasWidth) {
                posX = imgPos.left * scaleX - (x * scaleX - x);

                if (posX > 0) {
                    posX = 0;
                }

                if (posX < canvasWidth - newImgWidth) {
                    posX = canvasWidth - newImgWidth;
                }
            }

            if (newImgHeight > canvasHeight) {
                posY = imgPos.top * scaleY - (y * scaleY - y);

                if (posY > 0) {
                    posY = 0;
                }

                if (posY < canvasHeight - newImgHeight) {
                    posY = canvasHeight - newImgHeight;
                }
            }

            self.updateCursor(newImgWidth, newImgHeight);

            $.fancybox.animate($what, {
                top: posY,
                left: posX,
                scaleX: scaleX,
                scaleY: scaleY
            }, duration || 330, function () {
                self.isAnimating = false;
            });

            // Stop slideshow
            if (self.SlideShow && self.SlideShow.isActive) {
                self.SlideShow.stop();
            }
        },

        // Scale image to fit inside parent element
        // ========================================

        scaleToFit: function scaleToFit(duration) {

            var self = this;

            var current = self.current;
            var $what = current.$content;
            var end;

            if (!(current.type == 'image' && !current.hasError) || !$what || self.isAnimating) {
                return;
            }

            $.fancybox.stop($what);

            self.isAnimating = true;

            end = self.getFitPos(current);

            self.updateCursor(end.width, end.height);

            $.fancybox.animate($what, {
                top: end.top,
                left: end.left,
                scaleX: end.width / $what.width(),
                scaleY: end.height / $what.height()
            }, duration || 330, function () {
                self.isAnimating = false;
            });
        },

        // Calculate image size to fit inside viewport
        // ===========================================

        getFitPos: function getFitPos(slide) {
            var self = this;
            var $what = slide.$content;

            var imgWidth = slide.width;
            var imgHeight = slide.height;

            var margin = slide.opts.margin;

            var canvasWidth, canvasHeight, minRatio, width, height;

            if (!$what || !$what.length || !imgWidth && !imgHeight) {
                return false;
            }

            // Convert "margin to CSS style: [ top, right, bottom, left ]
            if ($.type(margin) === "number") {
                margin = [margin, margin];
            }

            if (margin.length == 2) {
                margin = [margin[0], margin[1], margin[0], margin[1]];
            }

            if ($W.width() < 800) {
                margin = [0, 0, 0, 0];
            }

            // We can not use $slide width here, because it can have different diemensions while in transiton
            canvasWidth = parseInt(self.$refs.stage.width(), 10) - (margin[1] + margin[3]);
            canvasHeight = parseInt(self.$refs.stage.height(), 10) - (margin[0] + margin[2]);

            minRatio = Math.min(1, canvasWidth / imgWidth, canvasHeight / imgHeight);

            width = Math.floor(minRatio * imgWidth);
            height = Math.floor(minRatio * imgHeight);

            // Use floor rounding to make sure it really fits
            return {
                top: Math.floor((canvasHeight - height) * 0.5) + margin[0],
                left: Math.floor((canvasWidth - width) * 0.5) + margin[3],
                width: width,
                height: height
            };
        },

        // Update position and content of all slides
        // =========================================

        update: function update() {

            var self = this;

            $.each(self.slides, function (key, slide) {
                self.updateSlide(slide);
            });
        },

        // Update slide position and scale content to fit
        // ==============================================

        updateSlide: function updateSlide(slide) {

            var self = this;
            var $what = slide.$content;

            if ($what && (slide.width || slide.height)) {
                $.fancybox.stop($what);

                $.fancybox.setTranslate($what, self.getFitPos(slide));

                if (slide.pos === self.currPos) {
                    self.updateCursor();
                }
            }

            slide.$slide.trigger('refresh');

            self.trigger('onUpdate', slide);
        },

        // Update cursor style depending if content can be zoomed
        // ======================================================

        updateCursor: function updateCursor(nextWidth, nextHeight) {

            var self = this;
            var isScaledDown;

            var $container = self.$refs.container.removeClass('fancybox-is-zoomable fancybox-can-zoomIn fancybox-can-drag fancybox-can-zoomOut');

            if (!self.current || self.isClosing) {
                return;
            }

            if (self.isZoomable()) {

                $container.addClass('fancybox-is-zoomable');

                if (nextWidth !== undefined && nextHeight !== undefined) {
                    isScaledDown = nextWidth < self.current.width && nextHeight < self.current.height;
                } else {
                    isScaledDown = self.isScaledDown();
                }

                if (isScaledDown) {

                    // If image is scaled down, then, obviously, it can be zoomed to full size
                    $container.addClass('fancybox-can-zoomIn');
                } else {

                    if (self.current.opts.touch) {

                        // If image size ir largen than available available and touch module is not disable,
                        // then user can do panning
                        $container.addClass('fancybox-can-drag');
                    } else {
                        $container.addClass('fancybox-can-zoomOut');
                    }
                }
            } else if (self.current.opts.touch) {
                $container.addClass('fancybox-can-drag');
            }
        },

        // Check if current slide is zoomable
        // ==================================

        isZoomable: function isZoomable() {

            var self = this;

            var current = self.current;
            var fitPos;

            if (!current || self.isClosing) {
                return;
            }

            // Assume that slide is zoomable if
            //   - image is loaded successfuly
            //   - click action is "zoom"
            //   - actual size of the image is smaller than available area
            if (current.type === 'image' && current.isLoaded && !current.hasError && (current.opts.clickContent === 'zoom' || $.isFunction(current.opts.clickContent) && current.opts.clickContent(current) === "zoom")) {

                fitPos = self.getFitPos(current);

                if (current.width > fitPos.width || current.height > fitPos.height) {
                    return true;
                }
            }

            return false;
        },

        // Check if current image dimensions are smaller than actual
        // =========================================================

        isScaledDown: function isScaledDown() {

            var self = this;

            var current = self.current;
            var $what = current.$content;

            var rez = false;

            if ($what) {
                rez = $.fancybox.getTranslate($what);
                rez = rez.width < current.width || rez.height < current.height;
            }

            return rez;
        },

        // Check if image dimensions exceed parent element
        // ===============================================

        canPan: function canPan() {

            var self = this;

            var current = self.current;
            var $what = current.$content;

            var rez = false;

            if ($what) {
                rez = self.getFitPos(current);
                rez = Math.abs($what.width() - rez.width) > 1 || Math.abs($what.height() - rez.height) > 1;
            }

            return rez;
        },

        // Load content into the slide
        // ===========================

        loadSlide: function loadSlide(slide) {

            var self = this,
                type,
                $slide;
            var ajaxLoad;

            if (slide.isLoading) {
                return;
            }

            if (slide.isLoaded) {
                return;
            }

            slide.isLoading = true;

            self.trigger('beforeLoad', slide);

            type = slide.type;
            $slide = slide.$slide;

            $slide.off('refresh').trigger('onReset').addClass('fancybox-slide--' + (type || 'unknown')).addClass(slide.opts.slideClass);

            // Create content depending on the type

            switch (type) {

                case 'image':

                    self.setImage(slide);

                    break;

                case 'iframe':

                    self.setIframe(slide);

                    break;

                case 'html':

                    self.setContent(slide, slide.src || slide.content);

                    break;

                case 'inline':

                    if ($(slide.src).length) {
                        self.setContent(slide, $(slide.src));
                    } else {
                        self.setError(slide);
                    }

                    break;

                case 'ajax':

                    self.showLoading(slide);

                    ajaxLoad = $.ajax($.extend({}, slide.opts.ajax.settings, {
                        url: slide.src,
                        success: function success(data, textStatus) {

                            if (textStatus === 'success') {
                                self.setContent(slide, data);
                            }
                        },
                        error: function error(jqXHR, textStatus) {

                            if (jqXHR && textStatus !== 'abort') {
                                self.setError(slide);
                            }
                        }
                    }));

                    $slide.one('onReset', function () {
                        ajaxLoad.abort();
                    });

                    break;

                default:

                    self.setError(slide);

                    break;

            }

            return true;
        },

        // Use thumbnail image, if possible
        // ================================

        setImage: function setImage(slide) {

            var self = this;
            var srcset = slide.opts.image.srcset;

            var found, temp, pxRatio, windowWidth;

            // If we have "srcset", then we need to find matching "src" value.
            // This is necessary, because when you set an src attribute, the browser will preload the image
            // before any javascript or even CSS is applied.
            if (srcset) {
                pxRatio = window.devicePixelRatio || 1;
                windowWidth = window.innerWidth * pxRatio;

                temp = srcset.split(',').map(function (el) {
                    var ret = {};

                    el.trim().split(/\s+/).forEach(function (el, i) {
                        var value = parseInt(el.substring(0, el.length - 1), 10);

                        if (i === 0) {
                            return ret.url = el;
                        }

                        if (value) {
                            ret.value = value;
                            ret.postfix = el[el.length - 1];
                        }
                    });

                    return ret;
                });

                // Sort by value
                temp.sort(function (a, b) {
                    return a.value - b.value;
                });

                // Ok, now we have an array of all srcset values
                for (var j = 0; j < temp.length; j++) {
                    var el = temp[j];

                    if (el.postfix === 'w' && el.value >= windowWidth || el.postfix === 'x' && el.value >= pxRatio) {
                        found = el;
                        break;
                    }
                }

                // If not found, take the last one
                if (!found && temp.length) {
                    found = temp[temp.length - 1];
                }

                if (found) {
                    slide.src = found.url;

                    // If we have default width/height values, we can calculate height for matching source
                    if (slide.width && slide.height && found.postfix == 'w') {
                        slide.height = slide.width / slide.height * found.value;
                        slide.width = found.value;
                    }
                }
            }

            // This will be wrapper containing both ghost and actual image
            slide.$content = $('<div class="fancybox-image-wrap"></div>').addClass('fancybox-is-hidden').appendTo(slide.$slide);

            // If we have a thumbnail, we can display it while actual image is loading
            // Users will not stare at black screen and actual image will appear gradually
            if (slide.opts.preload !== false && slide.opts.width && slide.opts.height && (slide.opts.thumb || slide.opts.$thumb)) {

                slide.width = slide.opts.width;
                slide.height = slide.opts.height;

                slide.$ghost = $('<img />').one('error', function () {

                    $(this).remove();

                    slide.$ghost = null;

                    self.setBigImage(slide);
                }).one('load', function () {

                    self.afterLoad(slide);

                    self.setBigImage(slide);
                }).addClass('fancybox-image').appendTo(slide.$content).attr('src', slide.opts.thumb || slide.opts.$thumb.attr('src'));
            } else {

                self.setBigImage(slide);
            }
        },

        // Create full-size image
        // ======================

        setBigImage: function setBigImage(slide) {
            var self = this;
            var $img = $('<img />');

            slide.$image = $img.one('error', function () {

                self.setError(slide);
            }).one('load', function () {

                // Clear timeout that checks if loading icon needs to be displayed
                clearTimeout(slide.timouts);

                slide.timouts = null;

                if (self.isClosing) {
                    return;
                }

                slide.width = this.naturalWidth;
                slide.height = this.naturalHeight;

                if (slide.opts.image.srcset) {
                    $img.attr('sizes', '100vw').attr('srcset', slide.opts.image.srcset);
                }

                self.hideLoading(slide);

                if (slide.$ghost) {

                    slide.timouts = setTimeout(function () {
                        slide.timouts = null;

                        slide.$ghost.hide();
                    }, Math.min(300, Math.max(1000, slide.height / 1600)));
                } else {
                    self.afterLoad(slide);
                }
            }).addClass('fancybox-image').attr('src', slide.src).appendTo(slide.$content);

            if ($img[0].complete) {
                $img.trigger('load');
            } else if ($img[0].error) {
                $img.trigger('error');
            } else {

                slide.timouts = setTimeout(function () {
                    if (!$img[0].complete && !slide.hasError) {
                        self.showLoading(slide);
                    }
                }, 100);
            }
        },

        // Create iframe wrapper, iframe and bindings
        // ==========================================

        setIframe: function setIframe(slide) {
            var self = this,
                opts = slide.opts.iframe,
                $slide = slide.$slide,
                $iframe;

            slide.$content = $('<div class="fancybox-content' + (opts.preload ? ' fancybox-is-hidden' : '') + '"></div>').css(opts.css).appendTo($slide);

            $iframe = $(opts.tpl.replace(/\{rnd\}/g, new Date().getTime())).attr(opts.attr).appendTo(slide.$content);

            if (opts.preload) {

                self.showLoading(slide);

                // Unfortunately, it is not always possible to determine if iframe is successfully loaded
                // (due to browser security policy)

                $iframe.on('load.fb error.fb', function (e) {
                    this.isReady = 1;

                    slide.$slide.trigger('refresh');

                    self.afterLoad(slide);
                });

                // Recalculate iframe content size
                // ===============================

                $slide.on('refresh.fb', function () {
                    var $wrap = slide.$content,
                        $contents,
                        $body,
                        scrollWidth,
                        frameWidth,
                        frameHeight;

                    if ($iframe[0].isReady !== 1) {
                        return;
                    }

                    // Check if content is accessible,
                    // it will fail if frame is not with the same origin

                    try {
                        $contents = $iframe.contents();
                        $body = $contents.find('body');
                    } catch (ignore) {}

                    // Calculate dimensions for the wrapper
                    if ($body && $body.length && !(opts.css.width !== undefined && opts.css.height !== undefined)) {

                        scrollWidth = $iframe[0].contentWindow.document.documentElement.scrollWidth;

                        frameWidth = Math.ceil($body.outerWidth(true) + ($wrap.width() - scrollWidth));
                        frameHeight = Math.ceil($body.outerHeight(true));

                        // Resize wrapper to fit iframe content
                        $wrap.css({
                            'width': opts.css.width === undefined ? frameWidth + ($wrap.outerWidth() - $wrap.innerWidth()) : opts.css.width,
                            'height': opts.css.height === undefined ? frameHeight + ($wrap.outerHeight() - $wrap.innerHeight()) : opts.css.height
                        });
                    }

                    $wrap.removeClass('fancybox-is-hidden');
                });
            } else {

                this.afterLoad(slide);
            }

            $iframe.attr('src', slide.src);

            if (slide.opts.smallBtn === true) {
                slide.$content.prepend(self.translate(slide, slide.opts.btnTpl.smallBtn));
            }

            // Remove iframe if closing or changing gallery item
            $slide.one('onReset', function () {

                // This helps IE not to throw errors when closing
                try {

                    $(this).find('iframe').hide().attr('src', '//about:blank');
                } catch (ignore) {}

                $(this).empty();

                slide.isLoaded = false;
            });
        },

        // Wrap and append content to the slide
        // ======================================

        setContent: function setContent(slide, content) {

            var self = this;

            if (self.isClosing) {
                return;
            }

            self.hideLoading(slide);

            slide.$slide.empty();

            if (isQuery(content) && content.parent().length) {

                // If content is a jQuery object, then it will be moved to the slide.
                // The placeholder is created so we will know where to put it back.
                // If user is navigating gallery fast, then the content might be already inside fancyBox
                // =====================================================================================

                // Make sure content is not already moved to fancyBox
                content.parent('.fancybox-slide--inline').trigger('onReset');

                // Create temporary element marking original place of the content
                slide.$placeholder = $('<div></div>').hide().insertAfter(content);

                // Make sure content is visible
                content.css('display', 'inline-block');
            } else if (!slide.hasError) {

                // If content is just a plain text, try to convert it to html
                if ($.type(content) === 'string') {
                    content = $('<div>').append($.trim(content)).contents();

                    // If we have text node, then add wrapping element to make vertical alignment work
                    if (content[0].nodeType === 3) {
                        content = $('<div>').html(content);
                    }
                }

                // If "filter" option is provided, then filter content
                if (slide.opts.filter) {
                    content = $('<div>').html(content).find(slide.opts.filter);
                }
            }

            slide.$slide.one('onReset', function () {

                // Put content back
                if (slide.$placeholder) {
                    slide.$placeholder.after(content.hide()).remove();

                    slide.$placeholder = null;
                }

                // Remove custom close button
                if (slide.$smallBtn) {
                    slide.$smallBtn.remove();

                    slide.$smallBtn = null;
                }

                // Remove content and mark slide as not loaded
                if (!slide.hasError) {
                    $(this).empty();

                    slide.isLoaded = false;
                }
            });

            slide.$content = $(content).appendTo(slide.$slide);

            if (slide.opts.smallBtn && !slide.$smallBtn) {
                slide.$smallBtn = $(self.translate(slide, slide.opts.btnTpl.smallBtn)).appendTo(slide.$content.filter('div').first());
            }

            this.afterLoad(slide);
        },

        // Display error message
        // =====================

        setError: function setError(slide) {

            slide.hasError = true;

            slide.$slide.removeClass('fancybox-slide--' + slide.type);

            this.setContent(slide, this.translate(slide, slide.opts.errorTpl));
        },

        // Show loading icon inside the slide
        // ==================================

        showLoading: function showLoading(slide) {

            var self = this;

            slide = slide || self.current;

            if (slide && !slide.$spinner) {
                slide.$spinner = $(self.opts.spinnerTpl).appendTo(slide.$slide);
            }
        },

        // Remove loading icon from the slide
        // ==================================

        hideLoading: function hideLoading(slide) {

            var self = this;

            slide = slide || self.current;

            if (slide && slide.$spinner) {
                slide.$spinner.remove();

                delete slide.$spinner;
            }
        },

        // Adjustments after slide content has been loaded
        // ===============================================

        afterLoad: function afterLoad(slide) {

            var self = this;

            if (self.isClosing) {
                return;
            }

            slide.isLoading = false;
            slide.isLoaded = true;

            self.trigger('afterLoad', slide);

            self.hideLoading(slide);

            if (slide.opts.protect && slide.$content && !slide.hasError) {

                // Disable right click
                slide.$content.on('contextmenu.fb', function (e) {
                    if (e.button == 2) {
                        e.preventDefault();
                    }

                    return true;
                });

                // Add fake element on top of the image
                // This makes a bit harder for user to select image
                if (slide.type === 'image') {
                    $('<div class="fancybox-spaceball"></div>').appendTo(slide.$content);
                }
            }

            self.revealContent(slide);
        },

        // Make content visible
        // This method is called right after content has been loaded or
        // user navigates gallery and transition should start
        // ============================================================

        revealContent: function revealContent(slide) {

            var self = this;
            var $slide = slide.$slide;

            var effect,
                effectClassName,
                duration,
                opacity,
                end,
                start = false;

            effect = slide.opts[self.firstRun ? 'animationEffect' : 'transitionEffect'];
            duration = slide.opts[self.firstRun ? 'animationDuration' : 'transitionDuration'];

            duration = parseInt(slide.forcedDuration === undefined ? duration : slide.forcedDuration, 10);

            if (slide.isMoved || slide.pos !== self.currPos || !duration) {
                effect = false;
            }

            // Check if can zoom
            if (effect === 'zoom' && !(slide.pos === self.currPos && duration && slide.type === 'image' && !slide.hasError && (start = self.getThumbPos(slide)))) {
                effect = 'fade';
            }

            // Zoom animation
            // ==============

            if (effect === 'zoom') {
                end = self.getFitPos(slide);

                end.scaleX = end.width / start.width;
                end.scaleY = end.height / start.height;

                delete end.width;
                delete end.height;

                // Check if we need to animate opacity
                opacity = slide.opts.zoomOpacity;

                if (opacity == 'auto') {
                    opacity = Math.abs(slide.width / slide.height - start.width / start.height) > 0.1;
                }

                if (opacity) {
                    start.opacity = 0.1;
                    end.opacity = 1;
                }

                // Draw image at start position
                $.fancybox.setTranslate(slide.$content.removeClass('fancybox-is-hidden'), start);

                forceRedraw(slide.$content);

                // Start animation
                $.fancybox.animate(slide.$content, end, duration, function () {
                    self.complete();
                });

                return;
            }

            self.updateSlide(slide);

            // Simply show content
            // ===================

            if (!effect) {
                forceRedraw($slide);

                slide.$content.removeClass('fancybox-is-hidden');

                if (slide.pos === self.currPos) {
                    self.complete();
                }

                return;
            }

            $.fancybox.stop($slide);

            effectClassName = 'fancybox-animated fancybox-slide--' + (slide.pos > self.prevPos ? 'next' : 'previous') + ' fancybox-fx-' + effect;

            $slide.removeAttr('style').removeClass('fancybox-slide--current fancybox-slide--next fancybox-slide--previous').addClass(effectClassName);

            slide.$content.removeClass('fancybox-is-hidden');

            //Force reflow for CSS3 transitions
            forceRedraw($slide);

            $.fancybox.animate($slide, 'fancybox-slide--current', duration, function (e) {
                $slide.removeClass(effectClassName).removeAttr('style');

                if (slide.pos === self.currPos) {
                    self.complete();
                }
            }, true);
        },

        // Check if we can and have to zoom from thumbnail
        //================================================

        getThumbPos: function getThumbPos(slide) {

            var self = this;
            var rez = false;

            // Check if element is inside the viewport by at least 1 pixel
            var isElementVisible = function isElementVisible($el) {
                var element = $el[0];

                var elementRect = element.getBoundingClientRect();
                var parentRects = [];

                var visibleInAllParents;

                while (element.parentElement !== null) {
                    if ($(element.parentElement).css('overflow') === 'hidden' || $(element.parentElement).css('overflow') === 'auto') {
                        parentRects.push(element.parentElement.getBoundingClientRect());
                    }

                    element = element.parentElement;
                }

                visibleInAllParents = parentRects.every(function (parentRect) {
                    var visiblePixelX = Math.min(elementRect.right, parentRect.right) - Math.max(elementRect.left, parentRect.left);
                    var visiblePixelY = Math.min(elementRect.bottom, parentRect.bottom) - Math.max(elementRect.top, parentRect.top);

                    return visiblePixelX > 0 && visiblePixelY > 0;
                });

                return visibleInAllParents && elementRect.bottom > 0 && elementRect.right > 0 && elementRect.left < $(window).width() && elementRect.top < $(window).height();
            };

            var $thumb = slide.opts.$thumb;
            var thumbPos = $thumb ? $thumb.offset() : 0;
            var slidePos;

            if (thumbPos && $thumb[0].ownerDocument === document && isElementVisible($thumb)) {
                slidePos = self.$refs.stage.offset();

                rez = {
                    top: thumbPos.top - slidePos.top + parseFloat($thumb.css("border-top-width") || 0),
                    left: thumbPos.left - slidePos.left + parseFloat($thumb.css("border-left-width") || 0),
                    width: $thumb.width(),
                    height: $thumb.height(),
                    scaleX: 1,
                    scaleY: 1
                };
            }

            return rez;
        },

        // Final adjustments after current gallery item is moved to position
        // and it`s content is loaded
        // ==================================================================

        complete: function complete() {

            var self = this;

            var current = self.current;
            var slides = {};

            if (current.isMoved || !current.isLoaded || current.isComplete) {
                return;
            }

            current.isComplete = true;

            current.$slide.siblings().trigger('onReset');

            // Trigger any CSS3 transiton inside the slide
            forceRedraw(current.$slide);

            current.$slide.addClass('fancybox-slide--complete');

            // Remove unnecessary slides
            $.each(self.slides, function (key, slide) {
                if (slide.pos >= self.currPos - 1 && slide.pos <= self.currPos + 1) {
                    slides[slide.pos] = slide;
                } else if (slide) {

                    $.fancybox.stop(slide.$slide);

                    slide.$slide.unbind().remove();
                }
            });

            self.slides = slides;

            self.updateCursor();

            self.trigger('afterShow');

            // Try to focus on the first focusable element
            if ($(document.activeElement).is('[disabled]') || current.opts.autoFocus && !(current.type == 'image' || current.type === 'iframe')) {
                self.focus();
            }
        },

        // Preload next and previous slides
        // ================================

        preload: function preload() {
            var self = this;
            var next, prev;

            if (self.group.length < 2) {
                return;
            }

            next = self.slides[self.currPos + 1];
            prev = self.slides[self.currPos - 1];

            if (next && next.type === 'image') {
                self.loadSlide(next);
            }

            if (prev && prev.type === 'image') {
                self.loadSlide(prev);
            }
        },

        // Try to find and focus on the first focusable element
        // ====================================================

        focus: function focus() {
            var current = this.current;
            var $el;

            if (this.isClosing) {
                return;
            }

            // Skip for images and iframes
            $el = current && current.isComplete ? current.$slide.find('button,:input,[tabindex],a').filter(':not([disabled]):visible:first') : null;
            $el = $el && $el.length ? $el : this.$refs.container;

            $el.focus();
        },

        // Activates current instance - brings container to the front and enables keyboard,
        // notifies other instances about deactivating
        // =================================================================================

        activate: function activate() {
            var self = this;

            // Deactivate all instances
            $('.fancybox-container').each(function () {
                var instance = $(this).data('FancyBox');

                // Skip self and closing instances
                if (instance && instance.uid !== self.uid && !instance.isClosing) {
                    instance.trigger('onDeactivate');
                }
            });

            if (self.current) {
                if (self.$refs.container.index() > 0) {
                    self.$refs.container.prependTo(document.body);
                }

                self.updateControls();
            }

            self.trigger('onActivate');

            self.addEvents();
        },

        // Start closing procedure
        // This will start "zoom-out" animation if needed and clean everything up afterwards
        // =================================================================================

        close: function close(e, d) {

            var self = this;
            var current = self.current;

            var effect, duration;
            var $what, opacity, start, end;

            var done = function done() {
                self.cleanUp(e);
            };

            if (self.isClosing) {
                return false;
            }

            self.isClosing = true;

            // If beforeClose callback prevents closing, make sure content is centered
            if (self.trigger('beforeClose', e) === false) {
                self.isClosing = false;

                requestAFrame(function () {
                    self.update();
                });

                return false;
            }

            // Remove all events
            // If there are multiple instances, they will be set again by "activate" method
            self.removeEvents();

            if (current.timouts) {
                clearTimeout(current.timouts);
            }

            $what = current.$content;
            effect = current.opts.animationEffect;
            duration = $.isNumeric(d) ? d : effect ? current.opts.animationDuration : 0;

            // Remove other slides
            current.$slide.off(transitionEnd).removeClass('fancybox-slide--complete fancybox-slide--next fancybox-slide--previous fancybox-animated');

            current.$slide.siblings().trigger('onReset').remove();

            // Trigger animations
            if (duration) {
                self.$refs.container.removeClass('fancybox-is-open').addClass('fancybox-is-closing');
            }

            // Clean up
            self.hideLoading(current);

            self.hideControls();

            self.updateCursor();

            // Check if possible to zoom-out
            if (effect === 'zoom' && !(e !== true && $what && duration && current.type === 'image' && !current.hasError && (end = self.getThumbPos(current)))) {
                effect = 'fade';
            }

            if (effect === 'zoom') {
                $.fancybox.stop($what);

                start = $.fancybox.getTranslate($what);

                start.width = start.width * start.scaleX;
                start.height = start.height * start.scaleY;

                // Check if we need to animate opacity
                opacity = current.opts.zoomOpacity;

                if (opacity == 'auto') {
                    opacity = Math.abs(current.width / current.height - end.width / end.height) > 0.1;
                }

                if (opacity) {
                    end.opacity = 0;
                }

                start.scaleX = start.width / end.width;
                start.scaleY = start.height / end.height;

                start.width = end.width;
                start.height = end.height;

                $.fancybox.setTranslate(current.$content, start);

                $.fancybox.animate(current.$content, end, duration, done);

                return true;
            }

            if (effect && duration) {

                // If skip animation
                if (e === true) {
                    setTimeout(done, duration);
                } else {
                    $.fancybox.animate(current.$slide.removeClass('fancybox-slide--current'), 'fancybox-animated fancybox-slide--previous fancybox-fx-' + effect, duration, done);
                }
            } else {
                done();
            }

            return true;
        },

        // Final adjustments after removing the instance
        // =============================================

        cleanUp: function cleanUp(e) {
            var self = this,
                instance;

            self.current.$slide.trigger('onReset');

            self.$refs.container.empty().remove();

            self.trigger('afterClose', e);

            // Place back focus
            if (self.$lastFocus && !!self.current.opts.backFocus) {
                self.$lastFocus.focus();
            }

            self.current = null;

            // Check if there are other instances
            instance = $.fancybox.getInstance();

            if (instance) {
                instance.activate();
            } else {

                $W.scrollTop(self.scrollTop).scrollLeft(self.scrollLeft);

                $('html').removeClass('fancybox-enabled');

                $('#fancybox-style-noscroll').remove();
            }
        },

        // Call callback and trigger an event
        // ==================================

        trigger: function trigger(name, slide) {
            var args = Array.prototype.slice.call(arguments, 1),
                self = this,
                obj = slide && slide.opts ? slide : self.current,
                rez;

            if (obj) {
                args.unshift(obj);
            } else {
                obj = self;
            }

            args.unshift(self);

            if ($.isFunction(obj.opts[name])) {
                rez = obj.opts[name].apply(obj, args);
            }

            if (rez === false) {
                return rez;
            }

            if (name === 'afterClose') {
                $D.trigger(name + '.fb', args);
            } else {
                self.$refs.container.trigger(name + '.fb', args);
            }
        },

        // Update infobar values, navigation button states and reveal caption
        // ==================================================================

        updateControls: function updateControls(force) {

            var self = this;

            var current = self.current;
            var index = current.index;
            var opts = current.opts;
            var caption = opts.caption;
            var $caption = self.$refs.caption;

            // Recalculate content dimensions
            current.$slide.trigger('refresh');

            self.$caption = caption && caption.length ? $caption.html(caption) : null;

            if (!self.isHiddenControls) {
                self.showControls();
            }

            // Update info and navigation elements
            $('[data-fancybox-count]').html(self.group.length);
            $('[data-fancybox-index]').html(index + 1);

            $('[data-fancybox-prev]').prop('disabled', !opts.loop && index <= 0);
            $('[data-fancybox-next]').prop('disabled', !opts.loop && index >= self.group.length - 1);
        },

        // Hide toolbar and caption
        // ========================

        hideControls: function hideControls() {

            this.isHiddenControls = true;

            this.$refs.container.removeClass('fancybox-show-infobar fancybox-show-toolbar fancybox-show-caption fancybox-show-nav');
        },

        showControls: function showControls() {

            var self = this;
            var opts = self.current ? self.current.opts : self.opts;
            var $container = self.$refs.container;

            self.isHiddenControls = false;
            self.idleSecondsCounter = 0;

            $container.toggleClass('fancybox-show-toolbar', !!(opts.toolbar && opts.buttons)).toggleClass('fancybox-show-infobar', !!(opts.infobar && self.group.length > 1)).toggleClass('fancybox-show-nav', !!(opts.arrows && self.group.length > 1)).toggleClass('fancybox-is-modal', !!opts.modal);

            if (self.$caption) {
                $container.addClass('fancybox-show-caption ');
            } else {
                $container.removeClass('fancybox-show-caption');
            }
        },

        // Toggle toolbar and caption
        // ==========================

        toggleControls: function toggleControls() {

            if (this.isHiddenControls) {
                this.showControls();
            } else {
                this.hideControls();
            }
        }

    });

    $.fancybox = {

        version: "3.1.25",
        defaults: defaults,

        // Get current instance and execute a command.
        //
        // Examples of usage:
        //
        //   $instance = $.fancybox.getInstance();
        //   $.fancybox.getInstance().jumpTo( 1 );
        //   $.fancybox.getInstance( 'jumpTo', 1 );
        //   $.fancybox.getInstance( function() {
        //       console.info( this.currIndex );
        //   });
        // ======================================================

        getInstance: function getInstance(command) {
            var instance = $('.fancybox-container:not(".fancybox-is-closing"):first').data('FancyBox');
            var args = Array.prototype.slice.call(arguments, 1);

            if (instance instanceof FancyBox) {

                if ($.type(command) === 'string') {
                    instance[command].apply(instance, args);
                } else if ($.type(command) === 'function') {
                    command.apply(instance, args);
                }

                return instance;
            }

            return false;
        },

        // Create new instance
        // ===================

        open: function open(items, opts, index) {
            return new FancyBox(items, opts, index);
        },

        // Close current or all instances
        // ==============================

        close: function close(all) {
            var instance = this.getInstance();

            if (instance) {
                instance.close();

                // Try to find and close next instance

                if (all === true) {
                    this.close();
                }
            }
        },

        // Close instances and unbind all events
        // ==============================

        destroy: function destroy() {

            this.close(true);

            $D.off('click.fb-start');
        },

        // Try to detect mobile devices
        // ============================

        isMobile: document.createTouch !== undefined && /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent),

        // Detect if 'translate3d' support is available
        // ============================================

        use3d: function () {
            var div = document.createElement('div');

            return window.getComputedStyle && window.getComputedStyle(div).getPropertyValue('transform') && !(document.documentMode && document.documentMode < 11);
        }(),

        // Helper function to get current visual state of an element
        // returns array[ top, left, horizontal-scale, vertical-scale, opacity ]
        // =====================================================================

        getTranslate: function getTranslate($el) {
            var matrix;

            if (!$el || !$el.length) {
                return false;
            }

            matrix = $el.eq(0).css('transform');

            if (matrix && matrix.indexOf('matrix') !== -1) {
                matrix = matrix.split('(')[1];
                matrix = matrix.split(')')[0];
                matrix = matrix.split(',');
            } else {
                matrix = [];
            }

            if (matrix.length) {

                // If IE
                if (matrix.length > 10) {
                    matrix = [matrix[13], matrix[12], matrix[0], matrix[5]];
                } else {
                    matrix = [matrix[5], matrix[4], matrix[0], matrix[3]];
                }

                matrix = matrix.map(parseFloat);
            } else {
                matrix = [0, 0, 1, 1];

                var transRegex = /\.*translate\((.*)px,(.*)px\)/i;
                var transRez = transRegex.exec($el.eq(0).attr('style'));

                if (transRez) {
                    matrix[0] = parseFloat(transRez[2]);
                    matrix[1] = parseFloat(transRez[1]);
                }
            }

            return {
                top: matrix[0],
                left: matrix[1],
                scaleX: matrix[2],
                scaleY: matrix[3],
                opacity: parseFloat($el.css('opacity')),
                width: $el.width(),
                height: $el.height()
            };
        },

        // Shortcut for setting "translate3d" properties for element
        // Can set be used to set opacity, too
        // ========================================================

        setTranslate: function setTranslate($el, props) {
            var str = '';
            var css = {};

            if (!$el || !props) {
                return;
            }

            if (props.left !== undefined || props.top !== undefined) {
                str = (props.left === undefined ? $el.position().left : props.left) + 'px, ' + (props.top === undefined ? $el.position().top : props.top) + 'px';

                if (this.use3d) {
                    str = 'translate3d(' + str + ', 0px)';
                } else {
                    str = 'translate(' + str + ')';
                }
            }

            if (props.scaleX !== undefined && props.scaleY !== undefined) {
                str = (str.length ? str + ' ' : '') + 'scale(' + props.scaleX + ', ' + props.scaleY + ')';
            }

            if (str.length) {
                css.transform = str;
            }

            if (props.opacity !== undefined) {
                css.opacity = props.opacity;
            }

            if (props.width !== undefined) {
                css.width = props.width;
            }

            if (props.height !== undefined) {
                css.height = props.height;
            }

            return $el.css(css);
        },

        // Simple CSS transition handler
        // =============================

        animate: function animate($el, to, duration, callback, leaveAnimationName) {
            var event = transitionEnd || 'transitionend';

            if ($.isFunction(duration)) {
                callback = duration;
                duration = null;
            }

            if (!$.isPlainObject(to)) {
                $el.removeAttr('style');
            }

            $el.on(event, function (e) {

                // Skip events from child elements and z-index change
                if (e && e.originalEvent && (!$el.is(e.originalEvent.target) || e.originalEvent.propertyName == 'z-index')) {
                    return;
                }

                $el.off(event);

                if ($.isPlainObject(to)) {

                    if (to.scaleX !== undefined && to.scaleY !== undefined) {
                        $el.css('transition-duration', '0ms');

                        to.width = Math.round($el.width() * to.scaleX);
                        to.height = Math.round($el.height() * to.scaleY);

                        to.scaleX = 1;
                        to.scaleY = 1;

                        $.fancybox.setTranslate($el, to);
                    }
                } else if (leaveAnimationName !== true) {
                    $el.removeClass(to);
                }

                if ($.isFunction(callback)) {
                    callback(e);
                }
            });

            if ($.isNumeric(duration)) {
                $el.css('transition-duration', duration + 'ms');
            }

            if ($.isPlainObject(to)) {
                $.fancybox.setTranslate($el, to);
            } else {
                $el.addClass(to);
            }

            $el.data("timer", setTimeout(function () {
                $el.trigger('transitionend');
            }, duration + 16));
        },

        stop: function stop($el) {
            clearTimeout($el.data("timer"));

            $el.off(transitionEnd);
        }

    };

    // Default click handler for "fancyboxed" links
    // ============================================

    function _run(e) {
        var target = e.currentTarget,
            opts = e.data ? e.data.options : {},
            items = opts.selector ? $(opts.selector) : e.data ? e.data.items : [],
            value = $(target).attr('data-fancybox') || '',
            index = 0,
            active = $.fancybox.getInstance();

        e.preventDefault();
        e.stopPropagation();

        // Avoid opening multiple times
        if (active && active.current.opts.$orig.is(target)) {
            return;
        }

        // Get all related items and find index for clicked one
        if (value) {
            items = items.length ? items.filter('[data-fancybox="' + value + '"]') : $('[data-fancybox="' + value + '"]');
            index = items.index(target);

            // Sometimes current item can not be found
            // (for example, when slider clones items)
            if (index < 0) {
                index = 0;
            }
        } else {
            items = [target];
        }

        $.fancybox.open(items, opts, index);
    }

    // Create a jQuery plugin
    // ======================

    $.fn.fancybox = function (options) {
        var selector;

        options = options || {};
        selector = options.selector || false;

        if (selector) {

            $('body').off('click.fb-start', selector).on('click.fb-start', selector, {
                options: options
            }, _run);
        } else {

            this.off('click.fb-start').on('click.fb-start', {
                items: this,
                options: options
            }, _run);
        }

        return this;
    };

    // Self initializing plugin
    // ========================

    $D.on('click.fb-start', '[data-fancybox]', _run);
})(window, document, window.jQuery || jQuery);

// ==========================================================================
//
// Media
// Adds additional media type support
//
// ==========================================================================
;(function ($) {

    'use strict';

    // Formats matching url to final form

    var format = function format(url, rez, params) {
        if (!url) {
            return;
        }

        params = params || '';

        if ($.type(params) === "object") {
            params = $.param(params, true);
        }

        $.each(rez, function (key, value) {
            url = url.replace('$' + key, value || '');
        });

        if (params.length) {
            url += (url.indexOf('?') > 0 ? '&' : '?') + params;
        }

        return url;
    };

    // Object containing properties for each media type

    var defaults = {
        youtube: {
            matcher: /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(watch\?(.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(.*)|[\w-]{11}|\?listType=(.*)&list=(.*))(.*)/i,
            params: {
                autoplay: 1,
                autohide: 1,
                fs: 1,
                rel: 0,
                hd: 1,
                wmode: 'transparent',
                enablejsapi: 1,
                html5: 1
            },
            paramPlace: 8,
            type: 'iframe',
            url: '//www.youtube.com/embed/$4',
            thumb: '//img.youtube.com/vi/$4/hqdefault.jpg'
        },

        vimeo: {
            matcher: /^.+vimeo.com\/(.*\/)?([\d]+)(.*)?/,
            params: {
                autoplay: 1,
                hd: 1,
                show_title: 1,
                show_byline: 1,
                show_portrait: 0,
                fullscreen: 1,
                api: 1
            },
            paramPlace: 3,
            type: 'iframe',
            url: '//player.vimeo.com/video/$2'
        },

        metacafe: {
            matcher: /metacafe.com\/watch\/(\d+)\/(.*)?/,
            type: 'iframe',
            url: '//www.metacafe.com/embed/$1/?ap=1'
        },

        dailymotion: {
            matcher: /dailymotion.com\/video\/(.*)\/?(.*)/,
            params: {
                additionalInfos: 0,
                autoStart: 1
            },
            type: 'iframe',
            url: '//www.dailymotion.com/embed/video/$1'
        },

        vine: {
            matcher: /vine.co\/v\/([a-zA-Z0-9\?\=\-]+)/,
            type: 'iframe',
            url: '//vine.co/v/$1/embed/simple'
        },

        instagram: {
            matcher: /(instagr\.am|instagram\.com)\/p\/([a-zA-Z0-9_\-]+)\/?/i,
            type: 'image',
            url: '//$1/p/$2/media/?size=l'
        },

        // Examples:
        // http://maps.google.com/?ll=48.857995,2.294297&spn=0.007666,0.021136&t=m&z=16
        // https://www.google.com/maps/@37.7852006,-122.4146355,14.65z
        // https://www.google.com/maps/place/Googleplex/@37.4220041,-122.0833494,17z/data=!4m5!3m4!1s0x0:0x6c296c66619367e0!8m2!3d37.4219998!4d-122.0840572
        gmap_place: {
            matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(((maps\/(place\/(.*)\/)?\@(.*),(\d+.?\d+?)z))|(\?ll=))(.*)?/i,
            type: 'iframe',
            url: function url(rez) {
                return '//maps.google.' + rez[2] + '/?ll=' + (rez[9] ? rez[9] + '&z=' + Math.floor(rez[10]) + (rez[12] ? rez[12].replace(/^\//, "&") : '') : rez[12]) + '&output=' + (rez[12] && rez[12].indexOf('layer=c') > 0 ? 'svembed' : 'embed');
            }
        },

        // Examples:
        // https://www.google.com/maps/search/Empire+State+Building/
        // https://www.google.com/maps/search/?api=1&query=centurylink+field
        // https://www.google.com/maps/search/?api=1&query=47.5951518,-122.3316393
        gmap_search: {
            matcher: /(maps\.)?google\.([a-z]{2,3}(\.[a-z]{2})?)\/(maps\/search\/)(.*)/i,
            type: 'iframe',
            url: function url(rez) {
                return '//maps.google.' + rez[2] + '/maps?q=' + rez[5].replace('query=', 'q=').replace('api=1', '') + '&output=embed';
            }
        }
    };

    $(document).on('onInit.fb', function (e, instance) {

        $.each(instance.group, function (i, item) {

            var url = item.src || '',
                type = false,
                media,
                thumb,
                rez,
                params,
                urlParams,
                o,
                provider;

            // Skip items that already have content type
            if (item.type) {
                return;
            }

            media = $.extend(true, {}, defaults, item.opts.media);

            // Look for any matching media type
            $.each(media, function (n, el) {
                rez = url.match(el.matcher);
                o = {};
                provider = n;

                if (!rez) {
                    return;
                }

                type = el.type;

                if (el.paramPlace && rez[el.paramPlace]) {
                    urlParams = rez[el.paramPlace];

                    if (urlParams[0] == '?') {
                        urlParams = urlParams.substring(1);
                    }

                    urlParams = urlParams.split('&');

                    for (var m = 0; m < urlParams.length; ++m) {
                        var p = urlParams[m].split('=', 2);

                        if (p.length == 2) {
                            o[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                        }
                    }
                }

                params = $.extend(true, {}, el.params, item.opts[n], o);

                url = $.type(el.url) === "function" ? el.url.call(this, rez, params, item) : format(el.url, rez, params);
                thumb = $.type(el.thumb) === "function" ? el.thumb.call(this, rez, params, item) : format(el.thumb, rez);

                if (provider === 'vimeo') {
                    url = url.replace('&%23', '#');
                }

                return false;
            });

            // If it is found, then change content type and update the url

            if (type) {
                item.src = url;
                item.type = type;

                if (!item.opts.thumb && !(item.opts.$thumb && item.opts.$thumb.length)) {
                    item.opts.thumb = thumb;
                }

                if (type === 'iframe') {
                    $.extend(true, item.opts, {
                        iframe: {
                            preload: false,
                            attr: {
                                scrolling: "no"
                            }
                        }
                    });

                    item.contentProvider = provider;

                    item.opts.slideClass += ' fancybox-slide--' + (provider == 'gmap_place' || provider == 'gmap_search' ? 'map' : 'video');
                }
            } else {

                // If no content type is found, then set it to `image` as fallback
                item.type = 'image';
            }
        });
    });
})(window.jQuery);

// ==========================================================================
//
// Guestures
// Adds touch guestures, handles click and tap events
//
// ==========================================================================
;(function (window, document, $) {
    'use strict';

    var requestAFrame = function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame ||
        // if all else fails, use setTimeout
        function (callback) {
            return window.setTimeout(callback, 1000 / 60);
        };
    }();

    var cancelAFrame = function () {
        return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.oCancelAnimationFrame || function (id) {
            window.clearTimeout(id);
        };
    }();

    var pointers = function pointers(e) {
        var result = [];

        e = e.originalEvent || e || window.e;
        e = e.touches && e.touches.length ? e.touches : e.changedTouches && e.changedTouches.length ? e.changedTouches : [e];

        for (var key in e) {

            if (e[key].pageX) {
                result.push({ x: e[key].pageX, y: e[key].pageY });
            } else if (e[key].clientX) {
                result.push({ x: e[key].clientX, y: e[key].clientY });
            }
        }

        return result;
    };

    var distance = function distance(point2, point1, what) {
        if (!point1 || !point2) {
            return 0;
        }

        if (what === 'x') {
            return point2.x - point1.x;
        } else if (what === 'y') {
            return point2.y - point1.y;
        }

        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    };

    var isClickable = function isClickable($el) {

        if ($el.is('a,button,input,select,textarea') || $.isFunction($el.get(0).onclick) || $el.data('selectable')) {
            return true;
        }

        // Check for attributes like data-fancybox-next or data-fancybox-close
        for (var i = 0, atts = $el[0].attributes, n = atts.length; i < n; i++) {
            if (atts[i].nodeName.substr(0, 14) === 'data-fancybox-') {
                return true;
            }
        }

        return false;
    };

    var hasScrollbars = function hasScrollbars(el) {
        var overflowY = window.getComputedStyle(el)['overflow-y'];
        var overflowX = window.getComputedStyle(el)['overflow-x'];

        var vertical = (overflowY === 'scroll' || overflowY === 'auto') && el.scrollHeight > el.clientHeight;
        var horizontal = (overflowX === 'scroll' || overflowX === 'auto') && el.scrollWidth > el.clientWidth;

        return vertical || horizontal;
    };

    var isScrollable = function isScrollable($el) {
        var rez = false;

        while (true) {
            rez = hasScrollbars($el.get(0));

            if (rez) {
                break;
            }

            $el = $el.parent();

            if (!$el.length || $el.hasClass('fancybox-stage') || $el.is('body')) {
                break;
            }
        }

        return rez;
    };

    var Guestures = function Guestures(instance) {
        var self = this;

        self.instance = instance;

        self.$bg = instance.$refs.bg;
        self.$stage = instance.$refs.stage;
        self.$container = instance.$refs.container;

        self.destroy();

        self.$container.on('touchstart.fb.touch mousedown.fb.touch', $.proxy(self, 'ontouchstart'));
    };

    Guestures.prototype.destroy = function () {
        this.$container.off('.fb.touch');
    };

    Guestures.prototype.ontouchstart = function (e) {
        var self = this;

        var $target = $(e.target);
        var instance = self.instance;
        var current = instance.current;
        var $content = current.$content;

        var isTouchDevice = e.type == 'touchstart';

        // Do not respond to both events
        if (isTouchDevice) {
            self.$container.off('mousedown.fb.touch');
        }

        // Ignore clicks while zooming or closing
        if (!current || self.instance.isAnimating || self.instance.isClosing) {
            e.stopPropagation();
            e.preventDefault();

            return;
        }

        // Ignore right click
        if (e.originalEvent && e.originalEvent.button == 2) {
            return;
        }

        // Ignore taping on links, buttons, input elements
        if (!$target.length || isClickable($target) || isClickable($target.parent())) {
            return;
        }

        // Ignore clicks on the scrollbar
        if (e.originalEvent.clientX > $target[0].clientWidth + $target.offset().left) {
            return;
        }

        self.startPoints = pointers(e);

        // Prevent zooming if already swiping
        if (!self.startPoints || self.startPoints.length > 1 && instance.isSliding) {
            return;
        }

        self.$target = $target;
        self.$content = $content;
        self.canTap = true;

        $(document).off('.fb.touch');

        $(document).on(isTouchDevice ? 'touchend.fb.touch touchcancel.fb.touch' : 'mouseup.fb.touch mouseleave.fb.touch', $.proxy(self, "ontouchend"));
        $(document).on(isTouchDevice ? 'touchmove.fb.touch' : 'mousemove.fb.touch', $.proxy(self, "ontouchmove"));

        if (!(instance.current.opts.touch || instance.canPan()) || !($target.is(self.$stage) || self.$stage.find($target).length)) {

            // Prevent ghosting
            if ($target.is('img')) {
                e.preventDefault();
            }

            return;
        }

        e.stopPropagation();

        if (!($.fancybox.isMobile && (isScrollable(self.$target) || isScrollable(self.$target.parent())))) {
            e.preventDefault();
        }

        self.canvasWidth = Math.round(current.$slide[0].clientWidth);
        self.canvasHeight = Math.round(current.$slide[0].clientHeight);

        self.startTime = new Date().getTime();
        self.distanceX = self.distanceY = self.distance = 0;

        self.isPanning = false;
        self.isSwiping = false;
        self.isZooming = false;

        self.sliderStartPos = self.sliderLastPos || { top: 0, left: 0 };
        self.contentStartPos = $.fancybox.getTranslate(self.$content);
        self.contentLastPos = null;

        if (self.startPoints.length === 1 && !self.isZooming) {
            self.canTap = !instance.isSliding;

            if (current.type === 'image' && (self.contentStartPos.width > self.canvasWidth + 1 || self.contentStartPos.height > self.canvasHeight + 1)) {

                $.fancybox.stop(self.$content);

                self.$content.css('transition-duration', '0ms');

                self.isPanning = true;
            } else {

                self.isSwiping = true;
            }

            self.$container.addClass('fancybox-controls--isGrabbing');
        }

        if (self.startPoints.length === 2 && !instance.isAnimating && !current.hasError && current.type === 'image' && (current.isLoaded || current.$ghost)) {
            self.isZooming = true;

            self.isSwiping = false;
            self.isPanning = false;

            $.fancybox.stop(self.$content);

            self.$content.css('transition-duration', '0ms');

            self.centerPointStartX = (self.startPoints[0].x + self.startPoints[1].x) * 0.5 - $(window).scrollLeft();
            self.centerPointStartY = (self.startPoints[0].y + self.startPoints[1].y) * 0.5 - $(window).scrollTop();

            self.percentageOfImageAtPinchPointX = (self.centerPointStartX - self.contentStartPos.left) / self.contentStartPos.width;
            self.percentageOfImageAtPinchPointY = (self.centerPointStartY - self.contentStartPos.top) / self.contentStartPos.height;

            self.startDistanceBetweenFingers = distance(self.startPoints[0], self.startPoints[1]);
        }
    };

    Guestures.prototype.ontouchmove = function (e) {

        var self = this;

        self.newPoints = pointers(e);

        if ($.fancybox.isMobile && (isScrollable(self.$target) || isScrollable(self.$target.parent()))) {
            e.stopPropagation();

            self.canTap = false;

            return;
        }

        if (!(self.instance.current.opts.touch || self.instance.canPan()) || !self.newPoints || !self.newPoints.length) {
            return;
        }

        self.distanceX = distance(self.newPoints[0], self.startPoints[0], 'x');
        self.distanceY = distance(self.newPoints[0], self.startPoints[0], 'y');

        self.distance = distance(self.newPoints[0], self.startPoints[0]);

        // Skip false ontouchmove events (Chrome)
        if (self.distance > 0) {

            if (!(self.$target.is(self.$stage) || self.$stage.find(self.$target).length)) {
                return;
            }

            e.stopPropagation();
            e.preventDefault();

            if (self.isSwiping) {
                self.onSwipe();
            } else if (self.isPanning) {
                self.onPan();
            } else if (self.isZooming) {
                self.onZoom();
            }
        }
    };

    Guestures.prototype.onSwipe = function () {

        var self = this;

        var swiping = self.isSwiping;
        var left = self.sliderStartPos.left || 0;
        var angle;

        if (swiping === true) {

            if (Math.abs(self.distance) > 10) {

                self.canTap = false;

                if (self.instance.group.length < 2 && self.instance.opts.touch.vertical) {
                    self.isSwiping = 'y';
                } else if (self.instance.isSliding || self.instance.opts.touch.vertical === false || self.instance.opts.touch.vertical === 'auto' && $(window).width() > 800) {
                    self.isSwiping = 'x';
                } else {
                    angle = Math.abs(Math.atan2(self.distanceY, self.distanceX) * 180 / Math.PI);

                    self.isSwiping = angle > 45 && angle < 135 ? 'y' : 'x';
                }

                self.instance.isSliding = self.isSwiping;

                // Reset points to avoid jumping, because we dropped first swipes to calculate the angle
                self.startPoints = self.newPoints;

                $.each(self.instance.slides, function (index, slide) {
                    $.fancybox.stop(slide.$slide);

                    slide.$slide.css('transition-duration', '0ms');

                    slide.inTransition = false;

                    if (slide.pos === self.instance.current.pos) {
                        self.sliderStartPos.left = $.fancybox.getTranslate(slide.$slide).left;
                    }
                });

                //self.instance.current.isMoved = true;

                // Stop slideshow
                if (self.instance.SlideShow && self.instance.SlideShow.isActive) {
                    self.instance.SlideShow.stop();
                }
            }
        } else {

            if (swiping == 'x') {

                // Sticky edges
                if (self.distanceX > 0 && (self.instance.group.length < 2 || self.instance.current.index === 0 && !self.instance.current.opts.loop)) {
                    left = left + Math.pow(self.distanceX, 0.8);
                } else if (self.distanceX < 0 && (self.instance.group.length < 2 || self.instance.current.index === self.instance.group.length - 1 && !self.instance.current.opts.loop)) {
                    left = left - Math.pow(-self.distanceX, 0.8);
                } else {
                    left = left + self.distanceX;
                }
            }

            self.sliderLastPos = {
                top: swiping == 'x' ? 0 : self.sliderStartPos.top + self.distanceY,
                left: left
            };

            if (self.requestId) {
                cancelAFrame(self.requestId);

                self.requestId = null;
            }

            self.requestId = requestAFrame(function () {

                if (self.sliderLastPos) {
                    $.each(self.instance.slides, function (index, slide) {
                        var pos = slide.pos - self.instance.currPos;

                        $.fancybox.setTranslate(slide.$slide, {
                            top: self.sliderLastPos.top,
                            left: self.sliderLastPos.left + pos * self.canvasWidth + pos * slide.opts.gutter
                        });
                    });

                    self.$container.addClass('fancybox-is-sliding');
                }
            });
        }
    };

    Guestures.prototype.onPan = function () {

        var self = this;

        var newOffsetX, newOffsetY, newPos;

        self.canTap = false;

        if (self.contentStartPos.width > self.canvasWidth) {
            newOffsetX = self.contentStartPos.left + self.distanceX;
        } else {
            newOffsetX = self.contentStartPos.left;
        }

        newOffsetY = self.contentStartPos.top + self.distanceY;

        newPos = self.limitMovement(newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height);

        newPos.scaleX = self.contentStartPos.scaleX;
        newPos.scaleY = self.contentStartPos.scaleY;

        self.contentLastPos = newPos;

        if (self.requestId) {
            cancelAFrame(self.requestId);

            self.requestId = null;
        }

        self.requestId = requestAFrame(function () {
            $.fancybox.setTranslate(self.$content, self.contentLastPos);
        });
    };

    // Make panning sticky to the edges
    Guestures.prototype.limitMovement = function (newOffsetX, newOffsetY, newWidth, newHeight) {

        var self = this;

        var minTranslateX, minTranslateY, maxTranslateX, maxTranslateY;

        var canvasWidth = self.canvasWidth;
        var canvasHeight = self.canvasHeight;

        var currentOffsetX = self.contentStartPos.left;
        var currentOffsetY = self.contentStartPos.top;

        var distanceX = self.distanceX;
        var distanceY = self.distanceY;

        // Slow down proportionally to traveled distance

        minTranslateX = Math.max(0, canvasWidth * 0.5 - newWidth * 0.5);
        minTranslateY = Math.max(0, canvasHeight * 0.5 - newHeight * 0.5);

        maxTranslateX = Math.min(canvasWidth - newWidth, canvasWidth * 0.5 - newWidth * 0.5);
        maxTranslateY = Math.min(canvasHeight - newHeight, canvasHeight * 0.5 - newHeight * 0.5);

        if (newWidth > canvasWidth) {

            //   ->
            if (distanceX > 0 && newOffsetX > minTranslateX) {
                newOffsetX = minTranslateX - 1 + Math.pow(-minTranslateX + currentOffsetX + distanceX, 0.8) || 0;
            }

            //    <-
            if (distanceX < 0 && newOffsetX < maxTranslateX) {
                newOffsetX = maxTranslateX + 1 - Math.pow(maxTranslateX - currentOffsetX - distanceX, 0.8) || 0;
            }
        }

        if (newHeight > canvasHeight) {

            //   \/
            if (distanceY > 0 && newOffsetY > minTranslateY) {
                newOffsetY = minTranslateY - 1 + Math.pow(-minTranslateY + currentOffsetY + distanceY, 0.8) || 0;
            }

            //   /\
            if (distanceY < 0 && newOffsetY < maxTranslateY) {
                newOffsetY = maxTranslateY + 1 - Math.pow(maxTranslateY - currentOffsetY - distanceY, 0.8) || 0;
            }
        }

        return {
            top: newOffsetY,
            left: newOffsetX
        };
    };

    Guestures.prototype.limitPosition = function (newOffsetX, newOffsetY, newWidth, newHeight) {

        var self = this;

        var canvasWidth = self.canvasWidth;
        var canvasHeight = self.canvasHeight;

        if (newWidth > canvasWidth) {
            newOffsetX = newOffsetX > 0 ? 0 : newOffsetX;
            newOffsetX = newOffsetX < canvasWidth - newWidth ? canvasWidth - newWidth : newOffsetX;
        } else {

            // Center horizontally
            newOffsetX = Math.max(0, canvasWidth / 2 - newWidth / 2);
        }

        if (newHeight > canvasHeight) {
            newOffsetY = newOffsetY > 0 ? 0 : newOffsetY;
            newOffsetY = newOffsetY < canvasHeight - newHeight ? canvasHeight - newHeight : newOffsetY;
        } else {

            // Center vertically
            newOffsetY = Math.max(0, canvasHeight / 2 - newHeight / 2);
        }

        return {
            top: newOffsetY,
            left: newOffsetX
        };
    };

    Guestures.prototype.onZoom = function () {

        var self = this;

        // Calculate current distance between points to get pinch ratio and new width and height

        var currentWidth = self.contentStartPos.width;
        var currentHeight = self.contentStartPos.height;

        var currentOffsetX = self.contentStartPos.left;
        var currentOffsetY = self.contentStartPos.top;

        var endDistanceBetweenFingers = distance(self.newPoints[0], self.newPoints[1]);

        var pinchRatio = endDistanceBetweenFingers / self.startDistanceBetweenFingers;

        var newWidth = Math.floor(currentWidth * pinchRatio);
        var newHeight = Math.floor(currentHeight * pinchRatio);

        // This is the translation due to pinch-zooming
        var translateFromZoomingX = (currentWidth - newWidth) * self.percentageOfImageAtPinchPointX;
        var translateFromZoomingY = (currentHeight - newHeight) * self.percentageOfImageAtPinchPointY;

        //Point between the two touches

        var centerPointEndX = (self.newPoints[0].x + self.newPoints[1].x) / 2 - $(window).scrollLeft();
        var centerPointEndY = (self.newPoints[0].y + self.newPoints[1].y) / 2 - $(window).scrollTop();

        // And this is the translation due to translation of the centerpoint
        // between the two fingers

        var translateFromTranslatingX = centerPointEndX - self.centerPointStartX;
        var translateFromTranslatingY = centerPointEndY - self.centerPointStartY;

        // The new offset is the old/current one plus the total translation

        var newOffsetX = currentOffsetX + (translateFromZoomingX + translateFromTranslatingX);
        var newOffsetY = currentOffsetY + (translateFromZoomingY + translateFromTranslatingY);

        var newPos = {
            top: newOffsetY,
            left: newOffsetX,
            scaleX: self.contentStartPos.scaleX * pinchRatio,
            scaleY: self.contentStartPos.scaleY * pinchRatio
        };

        self.canTap = false;

        self.newWidth = newWidth;
        self.newHeight = newHeight;

        self.contentLastPos = newPos;

        if (self.requestId) {
            cancelAFrame(self.requestId);

            self.requestId = null;
        }

        self.requestId = requestAFrame(function () {
            $.fancybox.setTranslate(self.$content, self.contentLastPos);
        });
    };

    Guestures.prototype.ontouchend = function (e) {

        var self = this;
        var dMs = Math.max(new Date().getTime() - self.startTime, 1);

        var swiping = self.isSwiping;
        var panning = self.isPanning;
        var zooming = self.isZooming;

        self.endPoints = pointers(e);

        self.$container.removeClass('fancybox-controls--isGrabbing');

        $(document).off('.fb.touch');

        if (self.requestId) {
            cancelAFrame(self.requestId);

            self.requestId = null;
        }

        self.isSwiping = false;
        self.isPanning = false;
        self.isZooming = false;

        if (self.canTap) {
            return self.onTap(e);
        }

        self.speed = 366;

        // Speed in px/ms
        self.velocityX = self.distanceX / dMs * 0.5;
        self.velocityY = self.distanceY / dMs * 0.5;

        self.speedX = Math.max(self.speed * 0.5, Math.min(self.speed * 1.5, 1 / Math.abs(self.velocityX) * self.speed));

        if (panning) {
            self.endPanning();
        } else if (zooming) {
            self.endZooming();
        } else {
            self.endSwiping(swiping);
        }

        return;
    };

    Guestures.prototype.endSwiping = function (swiping) {

        var self = this;
        var ret = false;

        self.instance.isSliding = false;
        self.sliderLastPos = null;

        // Close if swiped vertically / navigate if horizontally
        if (swiping == 'y' && Math.abs(self.distanceY) > 50) {

            // Continue vertical movement
            $.fancybox.animate(self.instance.current.$slide, {
                top: self.sliderStartPos.top + self.distanceY + self.velocityY * 150,
                opacity: 0
            }, 150);

            ret = self.instance.close(true, 300);
        } else if (swiping == 'x' && self.distanceX > 50 && self.instance.group.length > 1) {
            ret = self.instance.previous(self.speedX);
        } else if (swiping == 'x' && self.distanceX < -50 && self.instance.group.length > 1) {
            ret = self.instance.next(self.speedX);
        }

        if (ret === false && (swiping == 'x' || swiping == 'y')) {
            self.instance.jumpTo(self.instance.current.index, 150);
        }

        self.$container.removeClass('fancybox-is-sliding');
    };

    // Limit panning from edges
    // ========================

    Guestures.prototype.endPanning = function () {

        var self = this;
        var newOffsetX, newOffsetY, newPos;

        if (!self.contentLastPos) {
            return;
        }

        if (self.instance.current.opts.touch.momentum === false) {
            newOffsetX = self.contentLastPos.left;
            newOffsetY = self.contentLastPos.top;
        } else {

            // Continue movement
            newOffsetX = self.contentLastPos.left + self.velocityX * self.speed;
            newOffsetY = self.contentLastPos.top + self.velocityY * self.speed;
        }

        newPos = self.limitPosition(newOffsetX, newOffsetY, self.contentStartPos.width, self.contentStartPos.height);

        newPos.width = self.contentStartPos.width;
        newPos.height = self.contentStartPos.height;

        $.fancybox.animate(self.$content, newPos, 330);
    };

    Guestures.prototype.endZooming = function () {

        var self = this;

        var current = self.instance.current;

        var newOffsetX, newOffsetY, newPos, reset;

        var newWidth = self.newWidth;
        var newHeight = self.newHeight;

        if (!self.contentLastPos) {
            return;
        }

        newOffsetX = self.contentLastPos.left;
        newOffsetY = self.contentLastPos.top;

        reset = {
            top: newOffsetY,
            left: newOffsetX,
            width: newWidth,
            height: newHeight,
            scaleX: 1,
            scaleY: 1
        };

        // Reset scalex/scaleY values; this helps for perfomance and does not break animation
        $.fancybox.setTranslate(self.$content, reset);

        if (newWidth < self.canvasWidth && newHeight < self.canvasHeight) {
            self.instance.scaleToFit(150);
        } else if (newWidth > current.width || newHeight > current.height) {
            self.instance.scaleToActual(self.centerPointStartX, self.centerPointStartY, 150);
        } else {

            newPos = self.limitPosition(newOffsetX, newOffsetY, newWidth, newHeight);

            // Switch from scale() to width/height or animation will not work correctly
            $.fancybox.setTranslate(self.content, $.fancybox.getTranslate(self.$content));

            $.fancybox.animate(self.$content, newPos, 150);
        }
    };

    Guestures.prototype.onTap = function (e) {
        var self = this;
        var $target = $(e.target);

        var instance = self.instance;
        var current = instance.current;

        var endPoints = e && pointers(e) || self.startPoints;

        var tapX = endPoints[0] ? endPoints[0].x - self.$stage.offset().left : 0;
        var tapY = endPoints[0] ? endPoints[0].y - self.$stage.offset().top : 0;

        var where;

        var process = function process(prefix) {

            var action = current.opts[prefix];

            if ($.isFunction(action)) {
                action = action.apply(instance, [current, e]);
            }

            if (!action) {
                return;
            }

            switch (action) {

                case "close":

                    instance.close(self.startEvent);

                    break;

                case "toggleControls":

                    instance.toggleControls(true);

                    break;

                case "next":

                    instance.next();

                    break;

                case "nextOrClose":

                    if (instance.group.length > 1) {
                        instance.next();
                    } else {
                        instance.close(self.startEvent);
                    }

                    break;

                case "zoom":

                    if (current.type == 'image' && (current.isLoaded || current.$ghost)) {

                        if (instance.canPan()) {
                            instance.scaleToFit();
                        } else if (instance.isScaledDown()) {
                            instance.scaleToActual(tapX, tapY);
                        } else if (instance.group.length < 2) {
                            instance.close(self.startEvent);
                        }
                    }

                    break;
            }
        };

        // Ignore right click
        if (e.originalEvent && e.originalEvent.button == 2) {
            return;
        }

        // Skip if current slide is not in the center
        if (instance.isSliding) {
            return;
        }

        // Skip if clicked on the scrollbar
        if (tapX > $target[0].clientWidth + $target.offset().left) {
            return;
        }

        // Check where is clicked
        if ($target.is('.fancybox-bg,.fancybox-inner,.fancybox-outer,.fancybox-container')) {
            where = 'Outside';
        } else if ($target.is('.fancybox-slide')) {
            where = 'Slide';
        } else if (instance.current.$content && instance.current.$content.has(e.target).length) {
            where = 'Content';
        } else {
            return;
        }

        // Check if this is a double tap
        if (self.tapped) {

            // Stop previously created single tap
            clearTimeout(self.tapped);
            self.tapped = null;

            // Skip if distance between taps is too big
            if (Math.abs(tapX - self.tapX) > 50 || Math.abs(tapY - self.tapY) > 50 || instance.isSliding) {
                return this;
            }

            // OK, now we assume that this is a double-tap
            process('dblclick' + where);
        } else {

            // Single tap will be processed if user has not clicked second time within 300ms
            // or there is no need to wait for double-tap
            self.tapX = tapX;
            self.tapY = tapY;

            if (current.opts['dblclick' + where] && current.opts['dblclick' + where] !== current.opts['click' + where]) {
                self.tapped = setTimeout(function () {
                    self.tapped = null;

                    process('click' + where);
                }, 300);
            } else {
                process('click' + where);
            }
        }

        return this;
    };

    $(document).on('onActivate.fb', function (e, instance) {
        if (instance && !instance.Guestures) {
            instance.Guestures = new Guestures(instance);
        }
    });

    $(document).on('beforeClose.fb', function (e, instance) {
        if (instance && instance.Guestures) {
            instance.Guestures.destroy();
        }
    });
})(window, document, window.jQuery);

// ==========================================================================
//
// SlideShow
// Enables slideshow functionality
//
// Example of usage:
// $.fancybox.getInstance().SlideShow.start()
//
// ==========================================================================
;(function (document, $) {
    'use strict';

    var SlideShow = function SlideShow(instance) {
        this.instance = instance;
        this.init();
    };

    $.extend(SlideShow.prototype, {
        timer: null,
        isActive: false,
        $button: null,
        speed: 3000,

        init: function init() {
            var self = this;

            self.$button = self.instance.$refs.toolbar.find('[data-fancybox-play]').on('click', function () {
                self.toggle();
            });

            if (self.instance.group.length < 2 || !self.instance.group[self.instance.currIndex].opts.slideShow) {
                self.$button.hide();
            }
        },

        set: function set() {
            var self = this;

            // Check if reached last element
            if (self.instance && self.instance.current && (self.instance.current.opts.loop || self.instance.currIndex < self.instance.group.length - 1)) {
                self.timer = setTimeout(function () {
                    self.instance.next();
                }, self.instance.current.opts.slideShow.speed || self.speed);
            } else {
                self.stop();
                self.instance.idleSecondsCounter = 0;
                self.instance.showControls();
            }
        },

        clear: function clear() {
            var self = this;

            clearTimeout(self.timer);

            self.timer = null;
        },

        start: function start() {
            var self = this;
            var current = self.instance.current;

            if (self.instance && current && (current.opts.loop || current.index < self.instance.group.length - 1)) {

                self.isActive = true;

                self.$button.attr('title', current.opts.i18n[current.opts.lang].PLAY_STOP).addClass('fancybox-button--pause');

                if (current.isComplete) {
                    self.set();
                }
            }
        },

        stop: function stop() {
            var self = this;
            var current = self.instance.current;

            self.clear();

            self.$button.attr('title', current.opts.i18n[current.opts.lang].PLAY_START).removeClass('fancybox-button--pause');

            self.isActive = false;
        },

        toggle: function toggle() {
            var self = this;

            if (self.isActive) {
                self.stop();
            } else {
                self.start();
            }
        }

    });

    $(document).on({
        'onInit.fb': function onInitFb(e, instance) {
            if (instance && !instance.SlideShow) {
                instance.SlideShow = new SlideShow(instance);
            }
        },

        'beforeShow.fb': function beforeShowFb(e, instance, current, firstRun) {
            var SlideShow = instance && instance.SlideShow;

            if (firstRun) {

                if (SlideShow && current.opts.slideShow.autoStart) {
                    SlideShow.start();
                }
            } else if (SlideShow && SlideShow.isActive) {
                SlideShow.clear();
            }
        },

        'afterShow.fb': function afterShowFb(e, instance, current) {
            var SlideShow = instance && instance.SlideShow;

            if (SlideShow && SlideShow.isActive) {
                SlideShow.set();
            }
        },

        'afterKeydown.fb': function afterKeydownFb(e, instance, current, keypress, keycode) {
            var SlideShow = instance && instance.SlideShow;

            // "P" or Spacebar
            if (SlideShow && current.opts.slideShow && (keycode === 80 || keycode === 32) && !$(document.activeElement).is('button,a,input')) {
                keypress.preventDefault();

                SlideShow.toggle();
            }
        },

        'beforeClose.fb onDeactivate.fb': function beforeCloseFbOnDeactivateFb(e, instance) {
            var SlideShow = instance && instance.SlideShow;

            if (SlideShow) {
                SlideShow.stop();
            }
        }
    });

    // Page Visibility API to pause slideshow when window is not active
    $(document).on("visibilitychange", function () {
        var instance = $.fancybox.getInstance();
        var SlideShow = instance && instance.SlideShow;

        if (SlideShow && SlideShow.isActive) {
            if (document.hidden) {
                SlideShow.clear();
            } else {
                SlideShow.set();
            }
        }
    });
})(document, window.jQuery);

// ==========================================================================
//
// FullScreen
// Adds fullscreen functionality
//
// ==========================================================================
;(function (document, $) {
    'use strict';

    // Collection of methods supported by user browser

    var fn = function () {

        var fnMap = [['requestFullscreen', 'exitFullscreen', 'fullscreenElement', 'fullscreenEnabled', 'fullscreenchange', 'fullscreenerror'],
        // new WebKit
        ['webkitRequestFullscreen', 'webkitExitFullscreen', 'webkitFullscreenElement', 'webkitFullscreenEnabled', 'webkitfullscreenchange', 'webkitfullscreenerror'],
        // old WebKit (Safari 5.1)
        ['webkitRequestFullScreen', 'webkitCancelFullScreen', 'webkitCurrentFullScreenElement', 'webkitCancelFullScreen', 'webkitfullscreenchange', 'webkitfullscreenerror'], ['mozRequestFullScreen', 'mozCancelFullScreen', 'mozFullScreenElement', 'mozFullScreenEnabled', 'mozfullscreenchange', 'mozfullscreenerror'], ['msRequestFullscreen', 'msExitFullscreen', 'msFullscreenElement', 'msFullscreenEnabled', 'MSFullscreenChange', 'MSFullscreenError']];

        var val;
        var ret = {};
        var i, j;

        for (i = 0; i < fnMap.length; i++) {
            val = fnMap[i];

            if (val && val[1] in document) {
                for (j = 0; j < val.length; j++) {
                    ret[fnMap[0][j]] = val[j];
                }

                return ret;
            }
        }

        return false;
    }();

    // If browser does not have Full Screen API, then simply unset default button template and stop
    if (!fn) {

        if ($ && $.fancybox) {
            $.fancybox.defaults.btnTpl.fullScreen = false;
        }

        return;
    }

    var FullScreen = {

        request: function request(elem) {

            elem = elem || document.documentElement;

            elem[fn.requestFullscreen](elem.ALLOW_KEYBOARD_INPUT);
        },
        exit: function exit() {

            document[fn.exitFullscreen]();
        },
        toggle: function toggle(elem) {

            elem = elem || document.documentElement;

            if (this.isFullscreen()) {
                this.exit();
            } else {
                this.request(elem);
            }
        },
        isFullscreen: function isFullscreen() {

            return Boolean(document[fn.fullscreenElement]);
        },
        enabled: function enabled() {

            return Boolean(document[fn.fullscreenEnabled]);
        }
    };

    $(document).on({
        'onInit.fb': function onInitFb(e, instance) {
            var $container;

            var $button = instance.$refs.toolbar.find('[data-fancybox-fullscreen]');

            if (instance && !instance.FullScreen && instance.group[instance.currIndex].opts.fullScreen) {
                $container = instance.$refs.container;

                $container.on('click.fb-fullscreen', '[data-fancybox-fullscreen]', function (e) {

                    e.stopPropagation();
                    e.preventDefault();

                    FullScreen.toggle($container[0]);
                });

                if (instance.opts.fullScreen && instance.opts.fullScreen.autoStart === true) {
                    FullScreen.request($container[0]);
                }

                // Expose API
                instance.FullScreen = FullScreen;
            } else {
                $button.hide();
            }
        },

        'afterKeydown.fb': function afterKeydownFb(e, instance, current, keypress, keycode) {

            // "P" or Spacebar
            if (instance && instance.FullScreen && keycode === 70) {
                keypress.preventDefault();

                instance.FullScreen.toggle(instance.$refs.container[0]);
            }
        },

        'beforeClose.fb': function beforeCloseFb(instance) {
            if (instance && instance.FullScreen) {
                FullScreen.exit();
            }
        }
    });

    $(document).on(fn.fullscreenchange, function () {
        var instance = $.fancybox.getInstance();

        // If image is zooming, then force to stop and reposition properly
        if (instance.current && instance.current.type === 'image' && instance.isAnimating) {
            instance.current.$content.css('transition', 'none');

            instance.isAnimating = false;

            instance.update(true, true, 0);
        }

        instance.trigger('onFullscreenChange', FullScreen.isFullscreen());
    });
})(document, window.jQuery);

// ==========================================================================
//
// Thumbs
// Displays thumbnails in a grid
//
// ==========================================================================
;(function (document, $) {
    'use strict';

    var FancyThumbs = function FancyThumbs(instance) {
        this.instance = instance;
        this.init();
    };

    $.extend(FancyThumbs.prototype, {

        $button: null,
        $grid: null,
        $list: null,
        isVisible: false,

        init: function init() {
            var self = this;

            var first = self.instance.group[0],
                second = self.instance.group[1];

            self.$button = self.instance.$refs.toolbar.find('[data-fancybox-thumbs]');

            if (self.instance.group.length > 1 && self.instance.group[self.instance.currIndex].opts.thumbs && (first.type == 'image' || first.opts.thumb || first.opts.$thumb) && (second.type == 'image' || second.opts.thumb || second.opts.$thumb)) {

                self.$button.on('click', function () {
                    self.toggle();
                });

                self.isActive = true;
            } else {
                self.$button.hide();

                self.isActive = false;
            }
        },

        create: function create() {
            var instance = this.instance,
                list,
                src;

            this.$grid = $('<div class="fancybox-thumbs"></div>').appendTo(instance.$refs.container);

            list = '<ul>';

            $.each(instance.group, function (i, item) {

                src = item.opts.thumb || (item.opts.$thumb ? item.opts.$thumb.attr('src') : null);

                if (!src && item.type === 'image') {
                    src = item.src;
                }

                if (src && src.length) {
                    list += '<li data-index="' + i + '"  tabindex="0" class="fancybox-thumbs-loading"><img data-src="' + src + '" /></li>';
                }
            });

            list += '</ul>';

            this.$list = $(list).appendTo(this.$grid).on('click', 'li', function () {
                instance.jumpTo($(this).data('index'));
            });

            this.$list.find('img').hide().one('load', function () {

                var $parent = $(this).parent().removeClass('fancybox-thumbs-loading'),
                    thumbWidth = $parent.outerWidth(),
                    thumbHeight = $parent.outerHeight(),
                    width,
                    height,
                    widthRatio,
                    heightRatio;

                width = this.naturalWidth || this.width;
                height = this.naturalHeight || this.height;

                //Calculate thumbnail width/height and center it

                widthRatio = width / thumbWidth;
                heightRatio = height / thumbHeight;

                if (widthRatio >= 1 && heightRatio >= 1) {
                    if (widthRatio > heightRatio) {
                        width = width / heightRatio;
                        height = thumbHeight;
                    } else {
                        width = thumbWidth;
                        height = height / widthRatio;
                    }
                }

                $(this).css({
                    width: Math.floor(width),
                    height: Math.floor(height),
                    'margin-top': Math.min(0, Math.floor(thumbHeight * 0.3 - height * 0.3)),
                    'margin-left': Math.min(0, Math.floor(thumbWidth * 0.5 - width * 0.5))
                }).show();
            }).each(function () {
                this.src = $(this).data('src');
            });
        },

        focus: function focus() {

            if (this.instance.current) {
                this.$list.children().removeClass('fancybox-thumbs-active').filter('[data-index="' + this.instance.current.index + '"]').addClass('fancybox-thumbs-active').focus();
            }
        },

        close: function close() {
            this.$grid.hide();
        },

        update: function update() {

            this.instance.$refs.container.toggleClass('fancybox-show-thumbs', this.isVisible);

            if (this.isVisible) {

                if (!this.$grid) {
                    this.create();
                }

                this.instance.trigger('onThumbsShow');

                this.focus();
            } else if (this.$grid) {
                this.instance.trigger('onThumbsHide');
            }

            // Update content position
            this.instance.update();
        },

        hide: function hide() {
            this.isVisible = false;
            this.update();
        },

        show: function show() {
            this.isVisible = true;
            this.update();
        },

        toggle: function toggle() {
            this.isVisible = !this.isVisible;
            this.update();
        }

    });

    $(document).on({

        'onInit.fb': function onInitFb(e, instance) {
            if (instance && !instance.Thumbs) {
                instance.Thumbs = new FancyThumbs(instance);
            }
        },

        'beforeShow.fb': function beforeShowFb(e, instance, item, firstRun) {
            var Thumbs = instance && instance.Thumbs;

            if (!Thumbs || !Thumbs.isActive) {
                return;
            }

            if (item.modal) {
                Thumbs.$button.hide();

                Thumbs.hide();

                return;
            }

            if (firstRun && instance.opts.thumbs.autoStart === true) {
                Thumbs.show();
            }

            if (Thumbs.isVisible) {
                Thumbs.focus();
            }
        },

        'afterKeydown.fb': function afterKeydownFb(e, instance, current, keypress, keycode) {
            var Thumbs = instance && instance.Thumbs;

            // "G"
            if (Thumbs && Thumbs.isActive && keycode === 71) {
                keypress.preventDefault();

                Thumbs.toggle();
            }
        },

        'beforeClose.fb': function beforeCloseFb(e, instance) {
            var Thumbs = instance && instance.Thumbs;

            if (Thumbs && Thumbs.isVisible && instance.opts.thumbs.hideOnClose !== false) {
                Thumbs.close();
            }
        }

    });
})(document, window.jQuery);

// ==========================================================================
//
// Hash
// Enables linking to each modal
//
// ==========================================================================
;(function (document, window, $) {
    'use strict';

    // Simple $.escapeSelector polyfill (for jQuery prior v3)

    if (!$.escapeSelector) {
        $.escapeSelector = function (sel) {
            var rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\x80-\uFFFF\w-]/g;
            var fcssescape = function fcssescape(ch, asCodePoint) {
                if (asCodePoint) {
                    // U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
                    if (ch === "\0") {
                        return '\uFFFD';
                    }

                    // Control characters and (dependent upon position) numbers get escaped as code points
                    return ch.slice(0, -1) + "\\" + ch.charCodeAt(ch.length - 1).toString(16) + " ";
                }

                // Other potentially-special ASCII characters get backslash-escaped
                return "\\" + ch;
            };

            return (sel + "").replace(rcssescape, fcssescape);
        };
    }

    // Create new history entry only once
    var shouldCreateHistory = true;

    // Variable containing last hash value set by fancyBox
    // It will be used to determine if fancyBox needs to close after hash change is detected
    var currentHash = null;

    // Throttling the history change
    var timerID = null;

    // Get info about gallery name and current index from url
    function parseUrl() {
        var hash = window.location.hash.substr(1);
        var rez = hash.split('-');
        var index = rez.length > 1 && /^\+?\d+$/.test(rez[rez.length - 1]) ? parseInt(rez.pop(-1), 10) || 1 : 1;
        var gallery = rez.join('-');

        // Index is starting from 1
        if (index < 1) {
            index = 1;
        }

        return {
            hash: hash,
            index: index,
            gallery: gallery
        };
    }

    // Trigger click evnt on links to open new fancyBox instance
    function triggerFromUrl(url) {
        var $el;

        if (url.gallery !== '') {

            // If we can find element matching 'data-fancybox' atribute, then trigger click event for that ..
            $el = $("[data-fancybox='" + $.escapeSelector(url.gallery) + "']").eq(url.index - 1);

            if (!$el.length) {
                // .. if not, try finding element by ID
                $el = $("#" + $.escapeSelector(url.gallery) + "");
            }

            if ($el.length) {
                shouldCreateHistory = false;

                $el.trigger('click');
            }
        }
    }

    // Get gallery name from current instance
    function getGalleryID(instance) {
        var opts;

        if (!instance) {
            return false;
        }

        opts = instance.current ? instance.current.opts : instance.opts;

        return opts.hash || (opts.$orig ? opts.$orig.data('fancybox') : '');
    }

    // Star when DOM becomes ready
    $(function () {

        // Small delay is used to allow other scripts to process "dom ready" event
        setTimeout(function () {

            // Check if this module is not disabled
            if ($.fancybox.defaults.hash === false) {
                return;
            }

            // Update hash when opening/closing fancyBox
            $(document).on({
                'onInit.fb': function onInitFb(e, instance) {
                    var url, gallery;

                    if (instance.group[instance.currIndex].opts.hash === false) {
                        return;
                    }

                    url = parseUrl();
                    gallery = getGalleryID(instance);

                    // Make sure gallery start index matches index from hash
                    if (gallery && url.gallery && gallery == url.gallery) {
                        instance.currIndex = url.index - 1;
                    }
                },

                'beforeShow.fb': function beforeShowFb(e, instance, current) {
                    var gallery;

                    if (!current || current.opts.hash === false) {
                        return;
                    }

                    gallery = getGalleryID(instance);

                    // Update window hash
                    if (gallery && gallery !== '') {

                        if (window.location.hash.indexOf(gallery) < 0) {
                            instance.opts.origHash = window.location.hash;
                        }

                        currentHash = gallery + (instance.group.length > 1 ? '-' + (current.index + 1) : '');

                        if ('replaceState' in window.history) {
                            if (timerID) {
                                clearTimeout(timerID);
                            }

                            timerID = setTimeout(function () {
                                window.history[shouldCreateHistory ? 'pushState' : 'replaceState']({}, document.title, window.location.pathname + window.location.search + '#' + currentHash);

                                timerID = null;

                                shouldCreateHistory = false;
                            }, 300);
                        } else {
                            window.location.hash = currentHash;
                        }
                    }
                },

                'beforeClose.fb': function beforeCloseFb(e, instance, current) {
                    var gallery, origHash;

                    if (timerID) {
                        clearTimeout(timerID);
                    }

                    if (current.opts.hash === false) {
                        return;
                    }

                    gallery = getGalleryID(instance);
                    origHash = instance && instance.opts.origHash ? instance.opts.origHash : '';

                    // Remove hash from location bar
                    if (gallery && gallery !== '') {

                        if ('replaceState' in history) {
                            window.history.replaceState({}, document.title, window.location.pathname + window.location.search + origHash);
                        } else {
                            window.location.hash = origHash;

                            // Keep original scroll position
                            $(window).scrollTop(instance.scrollTop).scrollLeft(instance.scrollLeft);
                        }
                    }

                    currentHash = null;
                }
            });

            // Check if need to close after url has changed
            $(window).on('hashchange.fb', function () {
                var url = parseUrl();

                if ($.fancybox.getInstance()) {
                    if (currentHash && currentHash !== url.gallery + '-' + url.index && !(url.index === 1 && currentHash == url.gallery)) {
                        currentHash = null;

                        $.fancybox.close();
                    }
                } else if (url.gallery !== '') {
                    triggerFromUrl(url);
                }
            });

            // Check current hash and trigger click event on matching element to start fancyBox, if needed
            triggerFromUrl(parseUrl());
        }, 50);
    });
})(document, window, window.jQuery);
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

jQuery(document).ready(function ($) {

		$("[data-fancybox]").fancybox({
				loop: true
		});
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5mYW5jeWJveC5qcyIsInJlc3BvbnNpdmUtbmF2LmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImRvY3VtZW50IiwiJCIsInVuZGVmaW5lZCIsImZuIiwiZmFuY3lib3giLCJlcnJvciIsImRlZmF1bHRzIiwibG9vcCIsIm1hcmdpbiIsImd1dHRlciIsImtleWJvYXJkIiwiYXJyb3dzIiwiaW5mb2JhciIsInRvb2xiYXIiLCJidXR0b25zIiwiaWRsZVRpbWUiLCJzbWFsbEJ0biIsInByb3RlY3QiLCJtb2RhbCIsImltYWdlIiwicHJlbG9hZCIsImFqYXgiLCJzZXR0aW5ncyIsImRhdGEiLCJpZnJhbWUiLCJ0cGwiLCJjc3MiLCJhdHRyIiwic2Nyb2xsaW5nIiwiYW5pbWF0aW9uRWZmZWN0IiwiYW5pbWF0aW9uRHVyYXRpb24iLCJ6b29tT3BhY2l0eSIsInRyYW5zaXRpb25FZmZlY3QiLCJ0cmFuc2l0aW9uRHVyYXRpb24iLCJzbGlkZUNsYXNzIiwiYmFzZUNsYXNzIiwiYmFzZVRwbCIsInNwaW5uZXJUcGwiLCJlcnJvclRwbCIsImJ0blRwbCIsInNsaWRlU2hvdyIsImZ1bGxTY3JlZW4iLCJ0aHVtYnMiLCJjbG9zZSIsInBhcmVudEVsIiwiYXV0b0ZvY3VzIiwiYmFja0ZvY3VzIiwidHJhcEZvY3VzIiwiYXV0b1N0YXJ0IiwidG91Y2giLCJ2ZXJ0aWNhbCIsIm1vbWVudHVtIiwiaGFzaCIsIm1lZGlhIiwic3BlZWQiLCJoaWRlT25DbG9zZSIsIm9uSW5pdCIsIm5vb3AiLCJiZWZvcmVMb2FkIiwiYWZ0ZXJMb2FkIiwiYmVmb3JlU2hvdyIsImFmdGVyU2hvdyIsImJlZm9yZUNsb3NlIiwiYWZ0ZXJDbG9zZSIsIm9uQWN0aXZhdGUiLCJvbkRlYWN0aXZhdGUiLCJjbGlja0NvbnRlbnQiLCJjdXJyZW50IiwiZXZlbnQiLCJ0eXBlIiwiY2xpY2tTbGlkZSIsImNsaWNrT3V0c2lkZSIsImRibGNsaWNrQ29udGVudCIsImRibGNsaWNrU2xpZGUiLCJkYmxjbGlja091dHNpZGUiLCJtb2JpbGUiLCJsYW5nIiwiaTE4biIsIkNMT1NFIiwiTkVYVCIsIlBSRVYiLCJFUlJPUiIsIlBMQVlfU1RBUlQiLCJQTEFZX1NUT1AiLCJGVUxMX1NDUkVFTiIsIlRIVU1CUyIsIiRXIiwiJEQiLCJjYWxsZWQiLCJpc1F1ZXJ5Iiwib2JqIiwiaGFzT3duUHJvcGVydHkiLCJyZXF1ZXN0QUZyYW1lIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwid2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwibW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwib1JlcXVlc3RBbmltYXRpb25GcmFtZSIsImNhbGxiYWNrIiwic2V0VGltZW91dCIsInRyYW5zaXRpb25FbmQiLCJ0IiwiZWwiLCJjcmVhdGVFbGVtZW50IiwidHJhbnNpdGlvbnMiLCJzdHlsZSIsImZvcmNlUmVkcmF3IiwiJGVsIiwibGVuZ3RoIiwib2Zmc2V0SGVpZ2h0IiwiRmFuY3lCb3giLCJjb250ZW50Iiwib3B0cyIsImluZGV4Iiwic2VsZiIsImV4dGVuZCIsImlzQXJyYXkiLCJpZCIsImdyb3VwIiwiY3VyckluZGV4IiwicGFyc2VJbnQiLCJwcmV2SW5kZXgiLCJwcmV2UG9zIiwiY3VyclBvcyIsImZpcnN0UnVuIiwiY3JlYXRlR3JvdXAiLCIkbGFzdEZvY3VzIiwiYWN0aXZlRWxlbWVudCIsImJsdXIiLCJzbGlkZXMiLCJpbml0IiwicHJvdG90eXBlIiwidGVzdFdpZHRoIiwiJGNvbnRhaW5lciIsImJ1dHRvblN0ciIsImZpcnN0SXRlbU9wdHMiLCJzY3JvbGxUb3AiLCJzY3JvbGxMZWZ0IiwiZ2V0SW5zdGFuY2UiLCJpc01vYmlsZSIsIndpZHRoIiwiYWRkQ2xhc3MiLCJhcHBlbmQiLCJlYWNoIiwidmFsdWUiLCJ0cmFuc2xhdGUiLCJyZXBsYWNlIiwicHJlcGVuZFRvIiwiJHJlZnMiLCJjb250YWluZXIiLCJmb3JFYWNoIiwiaXRlbSIsImZpbmQiLCJyZW1vdmUiLCJ0cmlnZ2VyIiwiYWN0aXZhdGUiLCJqdW1wVG8iLCJzdHIiLCJhcnIiLCJtYXRjaCIsIm4iLCJpdGVtcyIsIm1ha2VBcnJheSIsImkiLCIkaXRlbSIsInNyYyIsInNyY1BhcnRzIiwiaXNQbGFpbk9iamVjdCIsIm9wdGlvbnMiLCJzcmNzZXQiLCIkb3JpZyIsImNoYXJBdCIsIiR0aHVtYiIsImNhcHRpb24iLCJhcHBseSIsInNwbGl0Iiwic2hpZnQiLCJmaWx0ZXIiLCJpbkFycmF5IiwicHVzaCIsImFkZEV2ZW50cyIsInJlbW92ZUV2ZW50cyIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0IiwicHJldmlvdXMiLCJuZXh0Iiwib3JpZ2luYWxFdmVudCIsInVwZGF0ZSIsInN0YWdlIiwiaGlkZSIsInNob3ciLCJpbnN0YW5jZSIsImlzQ2xvc2luZyIsInRhcmdldCIsImhhc0NsYXNzIiwiaXMiLCJoYXMiLCJmb2N1cyIsImtleWNvZGUiLCJrZXlDb2RlIiwid2hpY2giLCJpZGxlU2Vjb25kc0NvdW50ZXIiLCJpc0lkbGUiLCJzaG93Q29udHJvbHMiLCJpZGxlSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImhpZGVDb250cm9scyIsIm9mZiIsImNsZWFySW50ZXJ2YWwiLCJkdXJhdGlvbiIsInBvcyIsInNsaWRlIiwiY2FudmFzV2lkdGgiLCJjdXJyZW50UG9zIiwidHJhbnNpdGlvblByb3BzIiwiZ3JvdXBMZW4iLCJpc1NsaWRpbmciLCJpc0FuaW1hdGluZyIsImNyZWF0ZVNsaWRlIiwidXBkYXRlQ29udHJvbHMiLCJnZXRUcmFuc2xhdGUiLCIkc2xpZGUiLCJpc01vdmVkIiwibGVmdCIsInRvcCIsImZvcmNlZER1cmF0aW9uIiwiaXNOdW1lcmljIiwicmVtb3ZlQ2xhc3MiLCJsb2FkU2xpZGUiLCJzdG9wIiwiTWF0aCIsInJvdW5kIiwiYW5pbWF0ZSIsInJlbW92ZUF0dHIiLCJjb21wbGV0ZSIsImNoaWxkcmVuIiwiaXNMb2FkZWQiLCJyZXZlYWxDb250ZW50IiwiaXNDb21wbGV0ZSIsImFwcGVuZFRvIiwidXBkYXRlU2xpZGUiLCJzY2FsZVRvQWN0dWFsIiwieCIsInkiLCIkd2hhdCIsIiRjb250ZW50IiwiaW1nUG9zIiwicG9zWCIsInBvc1kiLCJzY2FsZVgiLCJzY2FsZVkiLCJjYW52YXNIZWlnaHQiLCJoZWlnaHQiLCJuZXdJbWdXaWR0aCIsIm5ld0ltZ0hlaWdodCIsImhhc0Vycm9yIiwidXBkYXRlQ3Vyc29yIiwiU2xpZGVTaG93IiwiaXNBY3RpdmUiLCJzY2FsZVRvRml0IiwiZW5kIiwiZ2V0Rml0UG9zIiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJtaW5SYXRpbyIsIm1pbiIsImZsb29yIiwia2V5Iiwic2V0VHJhbnNsYXRlIiwibmV4dFdpZHRoIiwibmV4dEhlaWdodCIsImlzU2NhbGVkRG93biIsImlzWm9vbWFibGUiLCJmaXRQb3MiLCJpc0Z1bmN0aW9uIiwicmV6IiwiY2FuUGFuIiwiYWJzIiwiYWpheExvYWQiLCJpc0xvYWRpbmciLCJzZXRJbWFnZSIsInNldElmcmFtZSIsInNldENvbnRlbnQiLCJzZXRFcnJvciIsInNob3dMb2FkaW5nIiwidXJsIiwic3VjY2VzcyIsInRleHRTdGF0dXMiLCJqcVhIUiIsIm9uZSIsImFib3J0IiwiZm91bmQiLCJ0ZW1wIiwicHhSYXRpbyIsIndpbmRvd1dpZHRoIiwiZGV2aWNlUGl4ZWxSYXRpbyIsImlubmVyV2lkdGgiLCJtYXAiLCJyZXQiLCJ0cmltIiwic3Vic3RyaW5nIiwicG9zdGZpeCIsInNvcnQiLCJhIiwiYiIsImoiLCJ0aHVtYiIsIiRnaG9zdCIsInNldEJpZ0ltYWdlIiwiJGltZyIsIiRpbWFnZSIsImNsZWFyVGltZW91dCIsInRpbW91dHMiLCJuYXR1cmFsV2lkdGgiLCJuYXR1cmFsSGVpZ2h0IiwiaGlkZUxvYWRpbmciLCJtYXgiLCIkaWZyYW1lIiwiRGF0ZSIsImdldFRpbWUiLCJpc1JlYWR5IiwiJHdyYXAiLCIkY29udGVudHMiLCIkYm9keSIsInNjcm9sbFdpZHRoIiwiZnJhbWVXaWR0aCIsImZyYW1lSGVpZ2h0IiwiY29udGVudHMiLCJpZ25vcmUiLCJjb250ZW50V2luZG93IiwiZG9jdW1lbnRFbGVtZW50IiwiY2VpbCIsIm91dGVyV2lkdGgiLCJvdXRlckhlaWdodCIsImlubmVySGVpZ2h0IiwicHJlcGVuZCIsImVtcHR5IiwicGFyZW50IiwiJHBsYWNlaG9sZGVyIiwiaW5zZXJ0QWZ0ZXIiLCJub2RlVHlwZSIsImh0bWwiLCJhZnRlciIsIiRzbWFsbEJ0biIsImZpcnN0IiwiJHNwaW5uZXIiLCJidXR0b24iLCJlZmZlY3QiLCJlZmZlY3RDbGFzc05hbWUiLCJvcGFjaXR5Iiwic3RhcnQiLCJnZXRUaHVtYlBvcyIsImlzRWxlbWVudFZpc2libGUiLCJlbGVtZW50IiwiZWxlbWVudFJlY3QiLCJnZXRCb3VuZGluZ0NsaWVudFJlY3QiLCJwYXJlbnRSZWN0cyIsInZpc2libGVJbkFsbFBhcmVudHMiLCJwYXJlbnRFbGVtZW50IiwiZXZlcnkiLCJwYXJlbnRSZWN0IiwidmlzaWJsZVBpeGVsWCIsInJpZ2h0IiwidmlzaWJsZVBpeGVsWSIsImJvdHRvbSIsInRodW1iUG9zIiwib2Zmc2V0Iiwic2xpZGVQb3MiLCJvd25lckRvY3VtZW50IiwicGFyc2VGbG9hdCIsInNpYmxpbmdzIiwidW5iaW5kIiwicHJldiIsInVpZCIsImJvZHkiLCJkIiwiZG9uZSIsImNsZWFuVXAiLCJuYW1lIiwiYXJncyIsIkFycmF5Iiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwidW5zaGlmdCIsImZvcmNlIiwiJGNhcHRpb24iLCJpc0hpZGRlbkNvbnRyb2xzIiwicHJvcCIsInRvZ2dsZUNsYXNzIiwidG9nZ2xlQ29udHJvbHMiLCJ2ZXJzaW9uIiwiY29tbWFuZCIsIm9wZW4iLCJhbGwiLCJkZXN0cm95IiwiY3JlYXRlVG91Y2giLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidXNlM2QiLCJkaXYiLCJnZXRDb21wdXRlZFN0eWxlIiwiZ2V0UHJvcGVydHlWYWx1ZSIsImRvY3VtZW50TW9kZSIsIm1hdHJpeCIsImVxIiwiaW5kZXhPZiIsInRyYW5zUmVnZXgiLCJ0cmFuc1JleiIsImV4ZWMiLCJwcm9wcyIsInBvc2l0aW9uIiwidHJhbnNmb3JtIiwidG8iLCJsZWF2ZUFuaW1hdGlvbk5hbWUiLCJwcm9wZXJ0eU5hbWUiLCJfcnVuIiwiY3VycmVudFRhcmdldCIsInNlbGVjdG9yIiwiYWN0aXZlIiwialF1ZXJ5IiwiZm9ybWF0IiwicGFyYW1zIiwicGFyYW0iLCJ5b3V0dWJlIiwibWF0Y2hlciIsImF1dG9wbGF5IiwiYXV0b2hpZGUiLCJmcyIsInJlbCIsImhkIiwid21vZGUiLCJlbmFibGVqc2FwaSIsImh0bWw1IiwicGFyYW1QbGFjZSIsInZpbWVvIiwic2hvd190aXRsZSIsInNob3dfYnlsaW5lIiwic2hvd19wb3J0cmFpdCIsImZ1bGxzY3JlZW4iLCJhcGkiLCJtZXRhY2FmZSIsImRhaWx5bW90aW9uIiwiYWRkaXRpb25hbEluZm9zIiwidmluZSIsImluc3RhZ3JhbSIsImdtYXBfcGxhY2UiLCJnbWFwX3NlYXJjaCIsInVybFBhcmFtcyIsIm8iLCJwcm92aWRlciIsIm0iLCJwIiwiZGVjb2RlVVJJQ29tcG9uZW50IiwiY29udGVudFByb3ZpZGVyIiwiY2FuY2VsQUZyYW1lIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSIsIm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lIiwib0NhbmNlbEFuaW1hdGlvbkZyYW1lIiwicG9pbnRlcnMiLCJyZXN1bHQiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJwYWdlWCIsInBhZ2VZIiwiY2xpZW50WCIsImNsaWVudFkiLCJkaXN0YW5jZSIsInBvaW50MiIsInBvaW50MSIsIndoYXQiLCJzcXJ0IiwicG93IiwiaXNDbGlja2FibGUiLCJnZXQiLCJvbmNsaWNrIiwiYXR0cyIsImF0dHJpYnV0ZXMiLCJub2RlTmFtZSIsInN1YnN0ciIsImhhc1Njcm9sbGJhcnMiLCJvdmVyZmxvd1kiLCJvdmVyZmxvd1giLCJzY3JvbGxIZWlnaHQiLCJjbGllbnRIZWlnaHQiLCJob3Jpem9udGFsIiwiY2xpZW50V2lkdGgiLCJpc1Njcm9sbGFibGUiLCJHdWVzdHVyZXMiLCIkYmciLCJiZyIsIiRzdGFnZSIsInByb3h5Iiwib250b3VjaHN0YXJ0IiwiJHRhcmdldCIsImlzVG91Y2hEZXZpY2UiLCJzdGFydFBvaW50cyIsImNhblRhcCIsInN0YXJ0VGltZSIsImRpc3RhbmNlWCIsImRpc3RhbmNlWSIsImlzUGFubmluZyIsImlzU3dpcGluZyIsImlzWm9vbWluZyIsInNsaWRlclN0YXJ0UG9zIiwic2xpZGVyTGFzdFBvcyIsImNvbnRlbnRTdGFydFBvcyIsImNvbnRlbnRMYXN0UG9zIiwiY2VudGVyUG9pbnRTdGFydFgiLCJjZW50ZXJQb2ludFN0YXJ0WSIsInBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WCIsInBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WSIsInN0YXJ0RGlzdGFuY2VCZXR3ZWVuRmluZ2VycyIsIm9udG91Y2htb3ZlIiwibmV3UG9pbnRzIiwib25Td2lwZSIsIm9uUGFuIiwib25ab29tIiwic3dpcGluZyIsImFuZ2xlIiwiYXRhbjIiLCJQSSIsImluVHJhbnNpdGlvbiIsInJlcXVlc3RJZCIsIm5ld09mZnNldFgiLCJuZXdPZmZzZXRZIiwibmV3UG9zIiwibGltaXRNb3ZlbWVudCIsIm5ld1dpZHRoIiwibmV3SGVpZ2h0IiwibWluVHJhbnNsYXRlWCIsIm1pblRyYW5zbGF0ZVkiLCJtYXhUcmFuc2xhdGVYIiwibWF4VHJhbnNsYXRlWSIsImN1cnJlbnRPZmZzZXRYIiwiY3VycmVudE9mZnNldFkiLCJsaW1pdFBvc2l0aW9uIiwiY3VycmVudFdpZHRoIiwiY3VycmVudEhlaWdodCIsImVuZERpc3RhbmNlQmV0d2VlbkZpbmdlcnMiLCJwaW5jaFJhdGlvIiwidHJhbnNsYXRlRnJvbVpvb21pbmdYIiwidHJhbnNsYXRlRnJvbVpvb21pbmdZIiwiY2VudGVyUG9pbnRFbmRYIiwiY2VudGVyUG9pbnRFbmRZIiwidHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWCIsInRyYW5zbGF0ZUZyb21UcmFuc2xhdGluZ1kiLCJvbnRvdWNoZW5kIiwiZE1zIiwicGFubmluZyIsInpvb21pbmciLCJlbmRQb2ludHMiLCJvblRhcCIsInZlbG9jaXR5WCIsInZlbG9jaXR5WSIsInNwZWVkWCIsImVuZFBhbm5pbmciLCJlbmRab29taW5nIiwiZW5kU3dpcGluZyIsInJlc2V0IiwidGFwWCIsInRhcFkiLCJ3aGVyZSIsInByb2Nlc3MiLCJwcmVmaXgiLCJhY3Rpb24iLCJzdGFydEV2ZW50IiwidGFwcGVkIiwidGltZXIiLCIkYnV0dG9uIiwidG9nZ2xlIiwic2V0IiwiY2xlYXIiLCJrZXlwcmVzcyIsImhpZGRlbiIsImZuTWFwIiwidmFsIiwiRnVsbFNjcmVlbiIsInJlcXVlc3QiLCJlbGVtIiwicmVxdWVzdEZ1bGxzY3JlZW4iLCJBTExPV19LRVlCT0FSRF9JTlBVVCIsImV4aXQiLCJleGl0RnVsbHNjcmVlbiIsImlzRnVsbHNjcmVlbiIsIkJvb2xlYW4iLCJmdWxsc2NyZWVuRWxlbWVudCIsImVuYWJsZWQiLCJmdWxsc2NyZWVuRW5hYmxlZCIsImZ1bGxzY3JlZW5jaGFuZ2UiLCJGYW5jeVRodW1icyIsIiRncmlkIiwiJGxpc3QiLCJpc1Zpc2libGUiLCJzZWNvbmQiLCJjcmVhdGUiLCJsaXN0IiwiJHBhcmVudCIsInRodW1iV2lkdGgiLCJ0aHVtYkhlaWdodCIsIndpZHRoUmF0aW8iLCJoZWlnaHRSYXRpbyIsIlRodW1icyIsImVzY2FwZVNlbGVjdG9yIiwic2VsIiwicmNzc2VzY2FwZSIsImZjc3Nlc2NhcGUiLCJjaCIsImFzQ29kZVBvaW50IiwiY2hhckNvZGVBdCIsInRvU3RyaW5nIiwic2hvdWxkQ3JlYXRlSGlzdG9yeSIsImN1cnJlbnRIYXNoIiwidGltZXJJRCIsInBhcnNlVXJsIiwibG9jYXRpb24iLCJwb3AiLCJnYWxsZXJ5Iiwiam9pbiIsInRyaWdnZXJGcm9tVXJsIiwiZ2V0R2FsbGVyeUlEIiwib3JpZ0hhc2giLCJoaXN0b3J5IiwidGl0bGUiLCJwYXRobmFtZSIsInNlYXJjaCIsInJlcGxhY2VTdGF0ZSIsInJlc3BvbnNpdmVOYXYiLCJjb21wdXRlZCIsInJlIiwidG9VcHBlckNhc2UiLCJjdXJyZW50U3R5bGUiLCJhZGRFdmVudCIsImV2dCIsImJ1YmJsZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJoYW5kbGVFdmVudCIsImF0dGFjaEV2ZW50IiwicmVtb3ZlRXZlbnQiLCJyZW1vdmVFdmVudExpc3RlbmVyIiwiZGV0YWNoRXZlbnQiLCJnZXRDaGlsZHJlbiIsIkVycm9yIiwic2V0QXR0cmlidXRlcyIsImF0dHJzIiwic2V0QXR0cmlidXRlIiwiY2xzIiwiY2xhc3NOYW1lIiwicmVnIiwiUmVnRXhwIiwiYXJyYXkiLCJzY29wZSIsIm5hdiIsIm5hdlRvZ2dsZSIsInN0eWxlRWxlbWVudCIsImh0bWxFbCIsImhhc0FuaW1GaW5pc2hlZCIsIm5hdk9wZW4iLCJSZXNwb25zaXZlTmF2IiwidHJhbnNpdGlvbiIsImxhYmVsIiwiaW5zZXJ0IiwiY3VzdG9tVG9nZ2xlIiwiY2xvc2VPbk5hdkNsaWNrIiwib3BlblBvcyIsIm5hdkNsYXNzIiwibmF2QWN0aXZlQ2xhc3MiLCJqc0NsYXNzIiwid3JhcHBlckVsIiwiZ2V0RWxlbWVudEJ5SWQiLCJ3cmFwcGVyIiwicXVlcnlTZWxlY3RvciIsImlubmVyIiwiX2luaXQiLCJfcmVtb3ZlU3R5bGVzIiwicmVtb3ZlQXR0cmlidXRlIiwicGFyZW50Tm9kZSIsInJlbW92ZUNoaWxkIiwicmVzaXplIiwiX2NyZWF0ZVN0eWxlcyIsIl9jYWxjSGVpZ2h0IiwiX29uVG91Y2hTdGFydCIsIl9vblRvdWNoTW92ZSIsIl9vblRvdWNoRW5kIiwiX3ByZXZlbnREZWZhdWx0IiwiX29uS2V5VXAiLCJfY2xvc2VPbk5hdkNsaWNrIiwiX2NyZWF0ZVRvZ2dsZSIsIl90cmFuc2l0aW9ucyIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYXBwZW5kQ2hpbGQiLCJpbm5lckhUTUwiLCJpbnNlcnRCZWZvcmUiLCJuZXh0U2libGluZyIsInRvZ2dsZUVsIiwibGlua3MiLCJzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24iLCJyZXR1cm5WYWx1ZSIsIkV2ZW50Iiwic3RhcnRYIiwic3RhcnRZIiwidG91Y2hIYXNNb3ZlZCIsIm9ialN0eWxlIiwiV2Via2l0VHJhbnNpdGlvbiIsIk1velRyYW5zaXRpb24iLCJPVHJhbnNpdGlvbiIsInNhdmVkSGVpZ2h0IiwiaW5uZXJTdHlsZXMiLCJzdHlsZVNoZWV0IiwiY3NzVGV4dCIsIm1vZHVsZSIsImV4cG9ydHMiLCJyZWFkeSJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUUsV0FBVUEsTUFBVixFQUFrQkMsUUFBbEIsRUFBNEJDLENBQTVCLEVBQStCQyxTQUEvQixFQUEwQztBQUN4Qzs7QUFFQTtBQUNBOztBQUVBLFFBQUssQ0FBQ0QsQ0FBTixFQUFVO0FBQ047QUFDSDs7QUFFRDtBQUNBOztBQUVBLFFBQUtBLEVBQUVFLEVBQUYsQ0FBS0MsUUFBVixFQUFxQjs7QUFFakJILFVBQUVJLEtBQUYsQ0FBUSw4QkFBUjs7QUFFQTtBQUNIOztBQUVEO0FBQ0E7O0FBRUEsUUFBSUMsV0FBVzs7QUFFWDtBQUNBQyxjQUFPLEtBSEk7O0FBS1g7QUFDQUMsZ0JBQVMsQ0FBQyxFQUFELEVBQUssQ0FBTCxDQU5FOztBQVFYO0FBQ0FDLGdCQUFTLEVBVEU7O0FBV1g7QUFDQUMsa0JBQVcsSUFaQTs7QUFjWDtBQUNBQyxnQkFBUyxJQWZFOztBQWlCWDtBQUNBQyxpQkFBVSxLQWxCQzs7QUFvQlg7QUFDQUMsaUJBQVUsSUFyQkM7O0FBdUJYO0FBQ0E7QUFDQTtBQUNBQyxpQkFBVSxDQUNOLFdBRE0sRUFFTixZQUZNLEVBR04sUUFITSxFQUlOLE9BSk0sQ0ExQkM7O0FBaUNYO0FBQ0FDLGtCQUFXLENBbENBOztBQW9DWDtBQUNBO0FBQ0E7QUFDQUMsa0JBQVcsTUF2Q0E7O0FBeUNYO0FBQ0FDLGlCQUFVLEtBMUNDOztBQTRDWDtBQUNBQyxlQUFR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QnRELHVCQUFhc0QsVUFBYixDQUF3QkMsT0FBeEIsR0FBa0NGLFdBQWxDO0FBQ0QsU0FGRCxNQUVPO0FBQ0xyRCx1QkFBYXFDLFNBQWIsR0FBeUJnQixXQUF6QjtBQUNEOztBQUVEQSxzQkFBYyxFQUFkO0FBQ0Q7O0FBN1l1QixLQUExQjs7QUFpWkE7OztBQUdBLFdBQU8sSUFBSWpELGFBQUosQ0FBa0JoakIsRUFBbEIsRUFBc0JrRSxPQUF0QixDQUFQO0FBRUQsR0Fob0JEOztBQWtvQkEsTUFBSSxPQUFPa2lCLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE9BQU9DLE9BQTVDLEVBQXFEO0FBQ25ERCxXQUFPQyxPQUFQLEdBQWlCcEYsYUFBakI7QUFDRCxHQUZELE1BRU87QUFDTHZuQixXQUFPdW5CLGFBQVAsR0FBdUJBLGFBQXZCO0FBQ0Q7QUFFRixDQTdvQkEsRUE2b0JDdG5CLFFBN29CRCxFQTZvQldELE1BN29CWCxFQTZvQm1CLENBN29CbkIsQ0FBRDs7O0FDVEEsSUFBSWdwQixNQUFNekIsY0FBYyxlQUFkLENBQVY7O0FBRUFoTixPQUFPdGEsUUFBUCxFQUFpQjJzQixLQUFqQixDQUF1QixVQUFVMXNCLENBQVYsRUFBYzs7QUFFbkNBLElBQUUsaUJBQUYsRUFBcUJHLFFBQXJCLENBQThCO0FBQzlCRyxVQUFXO0FBRG1CLEdBQTlCO0FBSUQsQ0FORCIsImZpbGUiOiJwcm9kdWN0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbi8vIGZhbmN5Qm94IHYzLjEuMjVcbi8vXG4vLyBMaWNlbnNlZCBHUEx2MyBmb3Igb3BlbiBzb3VyY2UgdXNlXG4vLyBvciBmYW5jeUJveCBDb21tZXJjaWFsIExpY2Vuc2UgZm9yIGNvbW1lcmNpYWwgdXNlXG4vL1xuLy8gaHR0cDovL2ZhbmN5YXBwcy5jb20vZmFuY3lib3gvXG4vLyBDb3B5cmlnaHQgMjAxNyBmYW5jeUFwcHNcbi8vXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuOyhmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgLy8gSWYgdGhlcmUncyBubyBqUXVlcnksIGZhbmN5Qm94IGNhbid0IHdvcmtcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaWYgKCAhJCApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgZmFuY3lCb3ggaXMgYWxyZWFkeSBpbml0aWFsaXplZFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGlmICggJC5mbi5mYW5jeWJveCApIHtcclxuXHJcbiAgICAgICAgJC5lcnJvcignZmFuY3lCb3ggYWxyZWFkeSBpbml0aWFsaXplZCcpO1xyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJpdmF0ZSBkZWZhdWx0IHNldHRpbmdzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB2YXIgZGVmYXVsdHMgPSB7XHJcblxyXG4gICAgICAgIC8vIEVuYWJsZSBpbmZpbml0ZSBnYWxsZXJ5IG5hdmlnYXRpb25cclxuICAgICAgICBsb29wIDogZmFsc2UsXHJcblxyXG4gICAgICAgIC8vIFNwYWNlIGFyb3VuZCBpbWFnZSwgaWdub3JlZCBpZiB6b29tZWQtaW4gb3Igdmlld3BvcnQgc21hbGxlciB0aGFuIDgwMHB4XHJcbiAgICAgICAgbWFyZ2luIDogWzQ0LCAwXSxcclxuXHJcbiAgICAgICAgLy8gSG9yaXpvbnRhbCBzcGFjZSBiZXR3ZWVuIHNsaWRlc1xyXG4gICAgICAgIGd1dHRlciA6IDUwLFxyXG5cclxuICAgICAgICAvLyBFbmFibGUga2V5Ym9hcmQgbmF2aWdhdGlvblxyXG4gICAgICAgIGtleWJvYXJkIDogdHJ1ZSxcclxuXHJcbiAgICAgICAgLy8gU2hvdWxkIGRpc3BsYXkgbmF2aWdhdGlvbiBhcnJvd3MgYXQgdGhlIHNjcmVlbiBlZGdlc1xyXG4gICAgICAgIGFycm93cyA6IHRydWUsXHJcblxyXG4gICAgICAgIC8vIFNob3VsZCBkaXNwbGF5IGluZm9iYXIgKGNvdW50ZXIgYW5kIGFycm93cyBhdCB0aGUgdG9wKVxyXG4gICAgICAgIGluZm9iYXIgOiBmYWxzZSxcclxuXHJcbiAgICAgICAgLy8gU2hvdWxkIGRpc3BsYXkgdG9vbGJhciAoYnV0dG9ucyBhdCB0aGUgdG9wKVxyXG4gICAgICAgIHRvb2xiYXIgOiB0cnVlLFxyXG5cclxuICAgICAgICAvLyBXaGF0IGJ1dHRvbnMgc2hvdWxkIGFwcGVhciBpbiB0aGUgdG9wIHJpZ2h0IGNvcm5lci5cclxuICAgICAgICAvLyBCdXR0b25zIHdpbGwgYmUgY3JlYXRlZCB1c2luZyB0ZW1wbGF0ZXMgZnJvbSBgYnRuVHBsYCBvcHRpb25cclxuICAgICAgICAvLyBhbmQgdGhleSB3aWxsIGJlIHBsYWNlZCBpbnRvIHRvb2xiYXIgKGNsYXNzPVwiZmFuY3lib3gtdG9vbGJhclwiYCBlbGVtZW50KVxyXG4gICAgICAgIGJ1dHRvbnMgOiBbXHJcbiAgICAgICAgICAgICdzbGlkZVNob3cnLFxyXG4gICAgICAgICAgICAnZnVsbFNjcmVlbicsXHJcbiAgICAgICAgICAgICd0aHVtYnMnLFxyXG4gICAgICAgICAgICAnY2xvc2UnXHJcbiAgICAgICAgXSxcclxuXHJcbiAgICAgICAgLy8gRGV0ZWN0IFwiaWRsZVwiIHRpbWUgaW4gc2Vjb25kc1xyXG4gICAgICAgIGlkbGVUaW1lIDogNCxcclxuXHJcbiAgICAgICAgLy8gU2hvdWxkIGRpc3BsYXkgYnV0dG9ucyBhdCB0b3AgcmlnaHQgY29ybmVyIG9mIHRoZSBjb250ZW50XHJcbiAgICAgICAgLy8gSWYgJ2F1dG8nIC0gdGhleSB3aWxsIGJlIGNyZWF0ZWQgZm9yIGNvbnRlbnQgaGF2aW5nIHR5cGUgJ2h0bWwnLCAnaW5saW5lJyBvciAnYWpheCdcclxuICAgICAgICAvLyBVc2UgdGVtcGxhdGUgZnJvbSBgYnRuVHBsLnNtYWxsQnRuYCBmb3IgY3VzdG9taXphdGlvblxyXG4gICAgICAgIHNtYWxsQnRuIDogJ2F1dG8nLFxyXG5cclxuICAgICAgICAvLyBEaXNhYmxlIHJpZ2h0LWNsaWNrIGFuZCB1c2Ugc2ltcGxlIGltYWdlIHByb3RlY3Rpb24gZm9yIGltYWdlc1xyXG4gICAgICAgIHByb3RlY3QgOiBmYWxzZSxcclxuXHJcbiAgICAgICAgLy8gU2hvcnRjdXQgdG8gbWFrZSBjb250ZW50IFwibW9kYWxcIiAtIGRpc2FibGUga2V5Ym9hcmQgbmF2aWd0aW9uLCBoaWRlIGJ1dHRvbnMsIGV0Y1xyXG4gICAgICAgIG1vZGFsIDogZmFsc2UsXHJcblxyXG4gICAgICAgIGltYWdlIDoge1xyXG5cclxuICAgICAgICAgICAgLy8gV2FpdCBmb3IgaW1hZ2VzIHRvIGxvYWQgYmVmb3JlIGRpc3BsYXlpbmdcclxuICAgICAgICAgICAgLy8gUmVxdWlyZXMgcHJlZGVmaW5lZCBpbWFnZSBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIC8vIElmICdhdXRvJyAtIHdpbGwgem9vbSBpbiB0aHVtYm5haWwgaWYgJ3dpZHRoJyBhbmQgJ2hlaWdodCcgYXR0cmlidXRlcyBhcmUgZm91bmRcclxuICAgICAgICAgICAgcHJlbG9hZCA6IFwiYXV0b1wiLFxyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBhamF4IDoge1xyXG5cclxuICAgICAgICAgICAgLy8gT2JqZWN0IGNvbnRhaW5pbmcgc2V0dGluZ3MgZm9yIGFqYXggcmVxdWVzdFxyXG4gICAgICAgICAgICBzZXR0aW5ncyA6IHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUaGlzIGhlbHBzIHRvIGluZGljYXRlIHRoYXQgcmVxdWVzdCBjb21lcyBmcm9tIHRoZSBtb2RhbFxyXG4gICAgICAgICAgICAgICAgLy8gRmVlbCBmcmVlIHRvIGNoYW5nZSBuYW1pbmdcclxuICAgICAgICAgICAgICAgIGRhdGEgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmFuY3lib3ggOiB0cnVlXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgaWZyYW1lIDoge1xyXG5cclxuICAgICAgICAgICAgLy8gSWZyYW1lIHRlbXBsYXRlXHJcbiAgICAgICAgICAgIHRwbCA6ICc8aWZyYW1lIGlkPVwiZmFuY3lib3gtZnJhbWV7cm5kfVwiIG5hbWU9XCJmYW5jeWJveC1mcmFtZXtybmR9XCIgY2xhc3M9XCJmYW5jeWJveC1pZnJhbWVcIiBmcmFtZWJvcmRlcj1cIjBcIiB2c3BhY2U9XCIwXCIgaHNwYWNlPVwiMFwiIHdlYmtpdEFsbG93RnVsbFNjcmVlbiBtb3phbGxvd2Z1bGxzY3JlZW4gYWxsb3dGdWxsU2NyZWVuIGFsbG93dHJhbnNwYXJlbmN5PVwidHJ1ZVwiIHNyYz1cIlwiPjwvaWZyYW1lPicsXHJcblxyXG4gICAgICAgICAgICAvLyBQcmVsb2FkIGlmcmFtZSBiZWZvcmUgZGlzcGxheWluZyBpdFxyXG4gICAgICAgICAgICAvLyBUaGlzIGFsbG93cyB0byBjYWxjdWxhdGUgaWZyYW1lIGNvbnRlbnQgd2lkdGggYW5kIGhlaWdodFxyXG4gICAgICAgICAgICAvLyAobm90ZTogRHVlIHRvIFwiU2FtZSBPcmlnaW4gUG9saWN5XCIsIHlvdSBjYW4ndCBnZXQgY3Jvc3MgZG9tYWluIGRhdGEpLlxyXG4gICAgICAgICAgICBwcmVsb2FkIDogdHJ1ZSxcclxuXHJcbiAgICAgICAgICAgIC8vIEN1c3RvbSBDU1Mgc3R5bGluZyBmb3IgaWZyYW1lIHdyYXBwaW5nIGVsZW1lbnRcclxuICAgICAgICAgICAgLy8gWW91IGNhbiB1c2UgdGhpcyB0byBzZXQgY3VzdG9tIGlmcmFtZSBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIGNzcyA6IHt9LFxyXG5cclxuICAgICAgICAgICAgLy8gSWZyYW1lIHRhZyBhdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIGF0dHIgOiB7XHJcbiAgICAgICAgICAgICAgICBzY3JvbGxpbmcgOiAnYXV0bydcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBPcGVuL2Nsb3NlIGFuaW1hdGlvbiB0eXBlXHJcbiAgICAgICAgLy8gUG9zc2libGUgdmFsdWVzOlxyXG4gICAgICAgIC8vICAgZmFsc2UgICAgICAgICAgICAtIGRpc2FibGVcclxuICAgICAgICAvLyAgIFwiem9vbVwiICAgICAgICAgICAtIHpvb20gaW1hZ2VzIGZyb20vdG8gdGh1bWJuYWlsXHJcbiAgICAgICAgLy8gICBcImZhZGVcIlxyXG4gICAgICAgIC8vICAgXCJ6b29tLWluLW91dFwiXHJcbiAgICAgICAgLy9cclxuICAgICAgICBhbmltYXRpb25FZmZlY3QgOiBcInpvb21cIixcclxuXHJcbiAgICAgICAgLy8gRHVyYXRpb24gaW4gbXMgZm9yIG9wZW4vY2xvc2UgYW5pbWF0aW9uXHJcbiAgICAgICAgYW5pbWF0aW9uRHVyYXRpb24gOiAzNjYsXHJcblxyXG4gICAgICAgIC8vIFNob3VsZCBpbWFnZSBjaGFuZ2Ugb3BhY2l0eSB3aGlsZSB6b29taW5nXHJcbiAgICAgICAgLy8gSWYgb3BhY2l0eSBpcyAnYXV0bycsIHRoZW4gb3BhY2l0eSB3aWxsIGJlIGNoYW5nZWQgaWYgaW1hZ2UgYW5kIHRodW1ibmFpbCBoYXZlIGRpZmZlcmVudCBhc3BlY3QgcmF0aW9zXHJcbiAgICAgICAgem9vbU9wYWNpdHkgOiAnYXV0bycsXHJcblxyXG4gICAgICAgIC8vIFRyYW5zaXRpb24gZWZmZWN0IGJldHdlZW4gc2xpZGVzXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBQb3NzaWJsZSB2YWx1ZXM6XHJcbiAgICAgICAgLy8gICBmYWxzZSAgICAgICAgICAgIC0gZGlzYWJsZVxyXG4gICAgICAgIC8vICAgXCJmYWRlJ1xyXG4gICAgICAgIC8vICAgXCJzbGlkZSdcclxuICAgICAgICAvLyAgIFwiY2lyY3VsYXInXHJcbiAgICAgICAgLy8gICBcInR1YmUnXHJcbiAgICAgICAgLy8gICBcInpvb20taW4tb3V0J1xyXG4gICAgICAgIC8vICAgXCJyb3RhdGUnXHJcbiAgICAgICAgLy9cclxuICAgICAgICB0cmFuc2l0aW9uRWZmZWN0IDogXCJmYWRlXCIsXHJcblxyXG4gICAgICAgIC8vIER1cmF0aW9uIGluIG1zIGZvciB0cmFuc2l0aW9uIGFuaW1hdGlvblxyXG4gICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbiA6IDM2NixcclxuXHJcbiAgICAgICAgLy8gQ3VzdG9tIENTUyBjbGFzcyBmb3Igc2xpZGUgZWxlbWVudFxyXG4gICAgICAgIHNsaWRlQ2xhc3MgOiAnJyxcclxuXHJcbiAgICAgICAgLy8gQ3VzdG9tIENTUyBjbGFzcyBmb3IgbGF5b3V0XHJcbiAgICAgICAgYmFzZUNsYXNzIDogJycsXHJcblxyXG4gICAgICAgIC8vIEJhc2UgdGVtcGxhdGUgZm9yIGxheW91dFxyXG4gICAgICAgIGJhc2VUcGxcdDpcclxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1jb250YWluZXJcIiByb2xlPVwiZGlhbG9nXCIgdGFiaW5kZXg9XCItMVwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1iZ1wiPjwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1pbm5lclwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtaW5mb2JhclwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXByZXYgdGl0bGU9XCJ7e1BSRVZ9fVwiIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tbGVmdFwiPjwvYnV0dG9uPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWluZm9iYXJfX2JvZHlcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8c3BhbiBkYXRhLWZhbmN5Ym94LWluZGV4Pjwvc3Bhbj4mbmJzcDsvJm5ic3A7PHNwYW4gZGF0YS1mYW5jeWJveC1jb3VudD48L3NwYW4+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxidXR0b24gZGF0YS1mYW5jeWJveC1uZXh0IHRpdGxlPVwie3tORVhUfX1cIiBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLXJpZ2h0XCI+PC9idXR0b24+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtdG9vbGJhclwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAne3tCVVRUT05TfX0nICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1uYXZpZ2F0aW9uXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtcHJldiB0aXRsZT1cInt7UFJFVn19XCIgY2xhc3M9XCJmYW5jeWJveC1hcnJvdyBmYW5jeWJveC1hcnJvdy0tbGVmdFwiIC8+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtbmV4dCB0aXRsZT1cInt7TkVYVH19XCIgY2xhc3M9XCJmYW5jeWJveC1hcnJvdyBmYW5jeWJveC1hcnJvdy0tcmlnaHRcIiAvPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXN0YWdlXCI+PC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1jYXB0aW9uLXdyYXBcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1jYXB0aW9uXCI+PC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAnPC9kaXY+JyxcclxuXHJcbiAgICAgICAgLy8gTG9hZGluZyBpbmRpY2F0b3IgdGVtcGxhdGVcclxuICAgICAgICBzcGlubmVyVHBsIDogJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1sb2FkaW5nXCI+PC9kaXY+JyxcclxuXHJcbiAgICAgICAgLy8gRXJyb3IgbWVzc2FnZSB0ZW1wbGF0ZVxyXG4gICAgICAgIGVycm9yVHBsIDogJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1lcnJvclwiPjxwPnt7RVJST1J9fTxwPjwvZGl2PicsXHJcblxyXG4gICAgICAgIGJ0blRwbCA6IHtcclxuICAgICAgICAgICAgc2xpZGVTaG93ICA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtcGxheSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLXBsYXlcIiB0aXRsZT1cInt7UExBWV9TVEFSVH19XCI+PC9idXR0b24+JyxcclxuICAgICAgICAgICAgZnVsbFNjcmVlbiA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtZnVsbHNjcmVlbiBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWZ1bGxzY3JlZW5cIiB0aXRsZT1cInt7RlVMTF9TQ1JFRU59fVwiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgIHRodW1icyAgICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXRodW1icyBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLXRodW1ic1wiIHRpdGxlPVwie3tUSFVNQlN9fVwiPjwvYnV0dG9uPicsXHJcbiAgICAgICAgICAgIGNsb3NlICAgICAgOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWNsb3NlIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tY2xvc2VcIiB0aXRsZT1cInt7Q0xPU0V9fVwiPjwvYnV0dG9uPicsXHJcblxyXG4gICAgICAgICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXHJcbiAgICAgICAgICAgIC8vIGlmIFwic21hbGxCdG5cIiBvcHRpb24gaXMgbm90IHNldCB0byBmYWxzZVxyXG4gICAgICAgICAgICBzbWFsbEJ0biAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWNsb3NlLXNtYWxsXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ29udGFpbmVyIGlzIGluamVjdGVkIGludG8gdGhpcyBlbGVtZW50XHJcbiAgICAgICAgcGFyZW50RWwgOiAnYm9keScsXHJcblxyXG5cclxuICAgICAgICAvLyBGb2N1cyBoYW5kbGluZ1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIC8vIFRyeSB0byBmb2N1cyBvbiB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnQgYWZ0ZXIgb3BlbmluZ1xyXG4gICAgICAgIGF1dG9Gb2N1cyA6IHRydWUsXHJcblxyXG4gICAgICAgIC8vIFB1dCBmb2N1cyBiYWNrIHRvIGFjdGl2ZSBlbGVtZW50IGFmdGVyIGNsb3NpbmdcclxuICAgICAgICBiYWNrRm9jdXMgOiB0cnVlLFxyXG5cclxuICAgICAgICAvLyBEbyBub3QgbGV0IHVzZXIgdG8gZm9jdXMgb24gZWxlbWVudCBvdXRzaWRlIG1vZGFsIGNvbnRlbnRcclxuICAgICAgICB0cmFwRm9jdXMgOiB0cnVlLFxyXG5cclxuXHJcbiAgICAgICAgLy8gTW9kdWxlIHNwZWNpZmljIG9wdGlvbnNcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBmdWxsU2NyZWVuIDoge1xyXG4gICAgICAgICAgICBhdXRvU3RhcnQgOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB0b3VjaCA6IHtcclxuICAgICAgICAgICAgdmVydGljYWwgOiB0cnVlLCAgLy8gQWxsb3cgdG8gZHJhZyBjb250ZW50IHZlcnRpY2FsbHlcclxuICAgICAgICAgICAgbW9tZW50dW0gOiB0cnVlICAgLy8gQ29udGludWUgbW92ZW1lbnQgYWZ0ZXIgcmVsZWFzaW5nIG1vdXNlL3RvdWNoIHdoZW4gcGFubmluZ1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEhhc2ggdmFsdWUgd2hlbiBpbml0aWFsaXppbmcgbWFudWFsbHksXHJcbiAgICAgICAgLy8gc2V0IGBmYWxzZWAgdG8gZGlzYWJsZSBoYXNoIGNoYW5nZVxyXG4gICAgICAgIGhhc2ggOiBudWxsLFxyXG5cclxuICAgICAgICAvLyBDdXN0b21pemUgb3IgYWRkIG5ldyBtZWRpYSB0eXBlc1xyXG4gICAgICAgIC8vIEV4YW1wbGU6XHJcbiAgICAgICAgLypcclxuICAgICAgICBtZWRpYSA6IHtcclxuICAgICAgICAgICAgeW91dHViZSA6IHtcclxuICAgICAgICAgICAgICAgIHBhcmFtcyA6IHtcclxuICAgICAgICAgICAgICAgICAgICBhdXRvcGxheSA6IDBcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAqL1xyXG4gICAgICAgIG1lZGlhIDoge30sXHJcblxyXG4gICAgICAgIHNsaWRlU2hvdyA6IHtcclxuICAgICAgICAgICAgYXV0b1N0YXJ0IDogZmFsc2UsXHJcbiAgICAgICAgICAgIHNwZWVkICAgICA6IDQwMDBcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICB0aHVtYnMgOiB7XHJcbiAgICAgICAgICAgIGF1dG9TdGFydCAgIDogZmFsc2UsICAgLy8gRGlzcGxheSB0aHVtYm5haWxzIG9uIG9wZW5pbmdcclxuICAgICAgICAgICAgaGlkZU9uQ2xvc2UgOiB0cnVlICAgICAvLyBIaWRlIHRodW1ibmFpbCBncmlkIHdoZW4gY2xvc2luZyBhbmltYXRpb24gc3RhcnRzXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2FsbGJhY2tzXHJcbiAgICAgICAgLy89PT09PT09PT09XHJcblxyXG4gICAgICAgIC8vIFNlZSBEb2N1bWVudGF0aW9uL0FQSS9FdmVudHMgZm9yIG1vcmUgaW5mb3JtYXRpb25cclxuICAgICAgICAvLyBFeGFtcGxlOlxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgICAgIGFmdGVyU2hvdzogZnVuY3Rpb24oIGluc3RhbmNlLCBjdXJyZW50ICkge1xyXG4gICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyggJ0NsaWNrZWQgZWxlbWVudDonICk7XHJcbiAgICAgICAgICAgICAgICAgY29uc29sZS5pbmZvKCBjdXJyZW50Lm9wdHMuJG9yaWcgKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICovXHJcblxyXG4gICAgICAgIG9uSW5pdCAgICAgICA6ICQubm9vcCwgIC8vIFdoZW4gaW5zdGFuY2UgaGFzIGJlZW4gaW5pdGlhbGl6ZWRcclxuXHJcbiAgICAgICAgYmVmb3JlTG9hZCAgIDogJC5ub29wLCAgLy8gQmVmb3JlIHRoZSBjb250ZW50IG9mIGEgc2xpZGUgaXMgYmVpbmcgbG9hZGVkXHJcbiAgICAgICAgYWZ0ZXJMb2FkICAgIDogJC5ub29wLCAgLy8gV2hlbiB0aGUgY29udGVudCBvZiBhIHNsaWRlIGlzIGRvbmUgbG9hZGluZ1xyXG5cclxuICAgICAgICBiZWZvcmVTaG93ICAgOiAkLm5vb3AsICAvLyBCZWZvcmUgb3BlbiBhbmltYXRpb24gc3RhcnRzXHJcbiAgICAgICAgYWZ0ZXJTaG93ICAgIDogJC5ub29wLCAgLy8gV2hlbiBjb250ZW50IGlzIGRvbmUgbG9hZGluZyBhbmQgYW5pbWF0aW5nXHJcblxyXG4gICAgICAgIGJlZm9yZUNsb3NlICA6ICQubm9vcCwgIC8vIEJlZm9yZSB0aGUgaW5zdGFuY2UgYXR0ZW1wdHMgdG8gY2xvc2UuIFJldHVybiBmYWxzZSB0byBjYW5jZWwgdGhlIGNsb3NlLlxyXG4gICAgICAgIGFmdGVyQ2xvc2UgICA6ICQubm9vcCwgIC8vIEFmdGVyIGluc3RhbmNlIGhhcyBiZWVuIGNsb3NlZFxyXG5cclxuICAgICAgICBvbkFjdGl2YXRlICAgOiAkLm5vb3AsICAvLyBXaGVuIGluc3RhbmNlIGlzIGJyb3VnaHQgdG8gZnJvbnRcclxuICAgICAgICBvbkRlYWN0aXZhdGUgOiAkLm5vb3AsICAvLyBXaGVuIG90aGVyIGluc3RhbmNlIGhhcyBiZWVuIGFjdGl2YXRlZFxyXG5cclxuXHJcbiAgICAgICAgLy8gSW50ZXJhY3Rpb25cclxuICAgICAgICAvLyA9PT09PT09PT09PVxyXG5cclxuICAgICAgICAvLyBVc2Ugb3B0aW9ucyBiZWxvdyB0byBjdXN0b21pemUgdGFrZW4gYWN0aW9uIHdoZW4gdXNlciBjbGlja3Mgb3IgZG91YmxlIGNsaWNrcyBvbiB0aGUgZmFuY3lCb3ggYXJlYSxcclxuICAgICAgICAvLyBlYWNoIG9wdGlvbiBjYW4gYmUgc3RyaW5nIG9yIG1ldGhvZCB0aGF0IHJldHVybnMgdmFsdWUuXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBQb3NzaWJsZSB2YWx1ZXM6XHJcbiAgICAgICAgLy8gICBcImNsb3NlXCIgICAgICAgICAgIC0gY2xvc2UgaW5zdGFuY2VcclxuICAgICAgICAvLyAgIFwibmV4dFwiICAgICAgICAgICAgLSBtb3ZlIHRvIG5leHQgZ2FsbGVyeSBpdGVtXHJcbiAgICAgICAgLy8gICBcIm5leHRPckNsb3NlXCIgICAgIC0gbW92ZSB0byBuZXh0IGdhbGxlcnkgaXRlbSBvciBjbG9zZSBpZiBnYWxsZXJ5IGhhcyBvbmx5IG9uZSBpdGVtXHJcbiAgICAgICAgLy8gICBcInRvZ2dsZUNvbnRyb2xzXCIgIC0gc2hvdy9oaWRlIGNvbnRyb2xzXHJcbiAgICAgICAgLy8gICBcInpvb21cIiAgICAgICAgICAgIC0gem9vbSBpbWFnZSAoaWYgbG9hZGVkKVxyXG4gICAgICAgIC8vICAgZmFsc2UgICAgICAgICAgICAgLSBkbyBub3RoaW5nXHJcblxyXG4gICAgICAgIC8vIENsaWNrZWQgb24gdGhlIGNvbnRlbnRcclxuICAgICAgICBjbGlja0NvbnRlbnQgOiBmdW5jdGlvbiggY3VycmVudCwgZXZlbnQgKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50LnR5cGUgPT09ICdpbWFnZScgPyAnem9vbScgOiBmYWxzZTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBDbGlja2VkIG9uIHRoZSBzbGlkZVxyXG4gICAgICAgIGNsaWNrU2xpZGUgOiAnY2xvc2UnLFxyXG5cclxuICAgICAgICAvLyBDbGlja2VkIG9uIHRoZSBiYWNrZ3JvdW5kIChiYWNrZHJvcCkgZWxlbWVudFxyXG4gICAgICAgIGNsaWNrT3V0c2lkZSA6ICdjbG9zZScsXHJcblxyXG4gICAgICAgIC8vIFNhbWUgYXMgcHJldmlvdXMgdHdvLCBidXQgZm9yIGRvdWJsZSBjbGlja1xyXG4gICAgICAgIGRibGNsaWNrQ29udGVudCA6IGZhbHNlLFxyXG4gICAgICAgIGRibGNsaWNrU2xpZGUgICA6IGZhbHNlLFxyXG4gICAgICAgIGRibGNsaWNrT3V0c2lkZSA6IGZhbHNlLFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ3VzdG9tIG9wdGlvbnMgd2hlbiBtb2JpbGUgZGV2aWNlIGlzIGRldGVjdGVkXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIG1vYmlsZSA6IHtcclxuICAgICAgICAgICAgY2xpY2tDb250ZW50IDogZnVuY3Rpb24oIGN1cnJlbnQsIGV2ZW50ICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQudHlwZSA9PT0gJ2ltYWdlJyA/ICd0b2dnbGVDb250cm9scycgOiBmYWxzZTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY2xpY2tTbGlkZSA6IGZ1bmN0aW9uKCBjdXJyZW50LCBldmVudCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBjdXJyZW50LnR5cGUgPT09ICdpbWFnZScgPyAndG9nZ2xlQ29udHJvbHMnIDogXCJjbG9zZVwiO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYmxjbGlja0NvbnRlbnQgOiBmdW5jdGlvbiggY3VycmVudCwgZXZlbnQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSAnaW1hZ2UnID8gJ3pvb20nIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRibGNsaWNrU2xpZGUgOiBmdW5jdGlvbiggY3VycmVudCwgZXZlbnQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSAnaW1hZ2UnID8gJ3pvb20nIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gSW50ZXJuYXRpb25hbGl6YXRpb25cclxuICAgICAgICAvLyA9PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgbGFuZyA6ICdlbicsXHJcbiAgICAgICAgaTE4biA6IHtcclxuICAgICAgICAgICAgJ2VuJyA6IHtcclxuICAgICAgICAgICAgICAgIENMT1NFICAgICAgIDogJ0Nsb3NlJyxcclxuICAgICAgICAgICAgICAgIE5FWFQgICAgICAgIDogJ05leHQnLFxyXG4gICAgICAgICAgICAgICAgUFJFViAgICAgICAgOiAnUHJldmlvdXMnLFxyXG4gICAgICAgICAgICAgICAgRVJST1IgICAgICAgOiAnVGhlIHJlcXVlc3RlZCBjb250ZW50IGNhbm5vdCBiZSBsb2FkZWQuIDxici8+IFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyxcclxuICAgICAgICAgICAgICAgIFBMQVlfU1RBUlQgIDogJ1N0YXJ0IHNsaWRlc2hvdycsXHJcbiAgICAgICAgICAgICAgICBQTEFZX1NUT1AgICA6ICdQYXVzZSBzbGlkZXNob3cnLFxyXG4gICAgICAgICAgICAgICAgRlVMTF9TQ1JFRU4gOiAnRnVsbCBzY3JlZW4nLFxyXG4gICAgICAgICAgICAgICAgVEhVTUJTICAgICAgOiAnVGh1bWJuYWlscydcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgJ2RlJyA6IHtcclxuICAgICAgICAgICAgICAgIENMT1NFICAgICAgIDogJ1NjaGxpZXNzZW4nLFxyXG4gICAgICAgICAgICAgICAgTkVYVCAgICAgICAgOiAnV2VpdGVyJyxcclxuICAgICAgICAgICAgICAgIFBSRVYgICAgICAgIDogJ1p1csO8Y2snLFxyXG4gICAgICAgICAgICAgICAgRVJST1IgICAgICAgOiAnRGllIGFuZ2Vmb3JkZXJ0ZW4gRGF0ZW4ga29ubnRlbiBuaWNodCBnZWxhZGVuIHdlcmRlbi4gPGJyLz4gQml0dGUgdmVyc3VjaGVuIFNpZSBlcyBzcMOkdGVyIG5vY2htYWwuJyxcclxuICAgICAgICAgICAgICAgIFBMQVlfU1RBUlQgIDogJ0RpYXNjaGF1IHN0YXJ0ZW4nLFxyXG4gICAgICAgICAgICAgICAgUExBWV9TVE9QICAgOiAnRGlhc2NoYXUgYmVlbmRlbicsXHJcbiAgICAgICAgICAgICAgICBGVUxMX1NDUkVFTiA6ICdWb2xsYmlsZCcsXHJcbiAgICAgICAgICAgICAgICBUSFVNQlMgICAgICA6ICdWb3JzY2hhdWJpbGRlcidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEZldyB1c2VmdWwgdmFyaWFibGVzIGFuZCBtZXRob2RzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHZhciAkVyA9ICQod2luZG93KTtcclxuICAgIHZhciAkRCA9ICQoZG9jdW1lbnQpO1xyXG5cclxuICAgIHZhciBjYWxsZWQgPSAwO1xyXG5cclxuXHJcbiAgICAvLyBDaGVjayBpZiBhbiBvYmplY3QgaXMgYSBqUXVlcnkgb2JqZWN0IGFuZCBub3QgYSBuYXRpdmUgSmF2YVNjcmlwdCBvYmplY3RcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHZhciBpc1F1ZXJ5ID0gZnVuY3Rpb24gKCBvYmogKSB7XHJcbiAgICAgICAgcmV0dXJuIG9iaiAmJiBvYmouaGFzT3duUHJvcGVydHkgJiYgb2JqIGluc3RhbmNlb2YgJDtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIEhhbmRsZSBtdWx0aXBsZSBicm93c2VycyBmb3IgXCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIiBhbmQgXCJjYW5jZWxBbmltYXRpb25GcmFtZVwiXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdmFyIHJlcXVlc3RBRnJhbWUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICAgICAgLy8gaWYgYWxsIGVsc2UgZmFpbHMsIHVzZSBzZXRUaW1lb3V0XHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxuXHJcblxyXG4gICAgLy8gRGV0ZWN0IHRoZSBzdXBwb3J0ZWQgdHJhbnNpdGlvbi1lbmQgZXZlbnQgcHJvcGVydHkgbmFtZVxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIHZhciB0cmFuc2l0aW9uRW5kID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgdCwgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZmFrZWVsZW1lbnRcIik7XHJcblxyXG4gICAgICAgIHZhciB0cmFuc2l0aW9ucyA9IHtcclxuICAgICAgICAgICAgXCJ0cmFuc2l0aW9uXCIgICAgICA6IFwidHJhbnNpdGlvbmVuZFwiLFxyXG4gICAgICAgICAgICBcIk9UcmFuc2l0aW9uXCIgICAgIDogXCJvVHJhbnNpdGlvbkVuZFwiLFxyXG4gICAgICAgICAgICBcIk1velRyYW5zaXRpb25cIiAgIDogXCJ0cmFuc2l0aW9uZW5kXCIsXHJcbiAgICAgICAgICAgIFwiV2Via2l0VHJhbnNpdGlvblwiOiBcIndlYmtpdFRyYW5zaXRpb25FbmRcIlxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZvciAodCBpbiB0cmFuc2l0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJhbnNpdGlvbnNbdF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9KSgpO1xyXG5cclxuXHJcbiAgICAvLyBGb3JjZSByZWRyYXcgb24gYW4gZWxlbWVudC5cclxuICAgIC8vIFRoaXMgaGVscHMgaW4gY2FzZXMgd2hlcmUgdGhlIGJyb3dzZXIgZG9lc24ndCByZWRyYXcgYW4gdXBkYXRlZCBlbGVtZW50IHByb3Blcmx5LlxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdmFyIGZvcmNlUmVkcmF3ID0gZnVuY3Rpb24oICRlbCApIHtcclxuICAgICAgICByZXR1cm4gKCAkZWwgJiYgJGVsLmxlbmd0aCAmJiAkZWxbMF0ub2Zmc2V0SGVpZ2h0ICk7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBDbGFzcyBkZWZpbml0aW9uXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdmFyIEZhbmN5Qm94ID0gZnVuY3Rpb24oIGNvbnRlbnQsIG9wdHMsIGluZGV4ICkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgc2VsZi5vcHRzICA9ICQuZXh0ZW5kKCB0cnVlLCB7IGluZGV4IDogaW5kZXggfSwgZGVmYXVsdHMsIG9wdHMgfHwge30gKTtcclxuXHJcbiAgICAgICAgLy8gRXhjbHVkZSBidXR0b25zIG9wdGlvbiBmcm9tIGRlZXAgbWVyZ2luZ1xyXG4gICAgICAgIGlmICggb3B0cyAmJiAkLmlzQXJyYXkoIG9wdHMuYnV0dG9ucyApICkge1xyXG4gICAgICAgICAgICBzZWxmLm9wdHMuYnV0dG9ucyA9IG9wdHMuYnV0dG9ucztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuaWQgICAgPSBzZWxmLm9wdHMuaWQgfHwgKytjYWxsZWQ7XHJcbiAgICAgICAgc2VsZi5ncm91cCA9IFtdO1xyXG5cclxuICAgICAgICBzZWxmLmN1cnJJbmRleCA9IHBhcnNlSW50KCBzZWxmLm9wdHMuaW5kZXgsIDEwICkgfHwgMDtcclxuICAgICAgICBzZWxmLnByZXZJbmRleCA9IG51bGw7XHJcblxyXG4gICAgICAgIHNlbGYucHJldlBvcyA9IG51bGw7XHJcbiAgICAgICAgc2VsZi5jdXJyUG9zID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5maXJzdFJ1biA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBncm91cCBlbGVtZW50cyBmcm9tIG9yaWdpbmFsIGl0ZW0gY29sbGVjdGlvblxyXG4gICAgICAgIHNlbGYuY3JlYXRlR3JvdXAoIGNvbnRlbnQgKTtcclxuXHJcbiAgICAgICAgaWYgKCAhc2VsZi5ncm91cC5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNhdmUgbGFzdCBhY3RpdmUgZWxlbWVudCBhbmQgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cclxuICAgICAgICBzZWxmLiRsYXN0Rm9jdXMgPSAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmJsdXIoKTtcclxuXHJcbiAgICAgICAgLy8gQ29sbGVjdGlvbiBvZiBnYWxsZXJ5IG9iamVjdHNcclxuICAgICAgICBzZWxmLnNsaWRlcyA9IHt9O1xyXG5cclxuICAgICAgICBzZWxmLmluaXQoIGNvbnRlbnQgKTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgICQuZXh0ZW5kKEZhbmN5Qm94LnByb3RvdHlwZSwge1xyXG5cclxuICAgICAgICAvLyBDcmVhdGUgRE9NIHN0cnVjdHVyZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGluaXQgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIHRlc3RXaWR0aCwgJGNvbnRhaW5lciwgYnV0dG9uU3RyO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZpcnN0SXRlbU9wdHMgPSBzZWxmLmdyb3VwWyBzZWxmLmN1cnJJbmRleCBdLm9wdHM7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNjcm9sbFRvcCAgPSAkRC5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgc2VsZi5zY3JvbGxMZWZ0ID0gJEQuc2Nyb2xsTGVmdCgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIEhpZGUgc2Nyb2xsYmFyc1xyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgICAgIGlmICggISQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKSAmJiAhJC5mYW5jeWJveC5pc01vYmlsZSAmJiAkKCAnYm9keScgKS5jc3MoJ292ZXJmbG93JykgIT09ICdoaWRkZW4nICkge1xyXG4gICAgICAgICAgICAgICAgdGVzdFdpZHRoID0gJCggJ2JvZHknICkud2lkdGgoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCAnaHRtbCcgKS5hZGRDbGFzcyggJ2ZhbmN5Ym94LWVuYWJsZWQnICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ29tcGFyZSBib2R5IHdpZHRoIGFmdGVyIGFwcGx5aW5nIFwib3ZlcmZsb3c6IGhpZGRlblwiXHJcbiAgICAgICAgICAgICAgICB0ZXN0V2lkdGggPSAkKCAnYm9keScgKS53aWR0aCgpIC0gdGVzdFdpZHRoO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIHdpZHRoIGhhcyBjaGFuZ2VkIC0gY29tcGVuc2F0ZSBtaXNzaW5nIHNjcm9sbGJhcnMgYnkgYWRkaW5nIHJpZ2h0IG1hcmdpblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0ZXN0V2lkdGggPiAxICkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoICdoZWFkJyApLmFwcGVuZCggJzxzdHlsZSBpZD1cImZhbmN5Ym94LXN0eWxlLW5vc2Nyb2xsXCIgdHlwZT1cInRleHQvY3NzXCI+LmNvbXBlbnNhdGUtZm9yLXNjcm9sbGJhciwgLmZhbmN5Ym94LWVuYWJsZWQgYm9keSB7IG1hcmdpbi1yaWdodDogJyArIHRlc3RXaWR0aCArICdweDsgfTwvc3R5bGU+JyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gQnVpbGQgaHRtbCBtYXJrdXAgYW5kIHNldCByZWZlcmVuY2VzXHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICAgICAgLy8gQnVpbGQgaHRtbCBjb2RlIGZvciBidXR0b25zIGFuZCBpbnNlcnQgaW50byBtYWluIHRlbXBsYXRlXHJcbiAgICAgICAgICAgIGJ1dHRvblN0ciA9ICcnO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKCBmaXJzdEl0ZW1PcHRzLmJ1dHRvbnMsIGZ1bmN0aW9uKCBpbmRleCwgdmFsdWUgKSB7XHJcbiAgICAgICAgICAgICAgICBidXR0b25TdHIgKz0gKCBmaXJzdEl0ZW1PcHRzLmJ0blRwbFsgdmFsdWUgXSB8fCAnJyApO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBtYXJrdXAgZnJvbSBiYXNlIHRlbXBsYXRlLCBpdCB3aWxsIGJlIGluaXRpYWxseSBoaWRkZW4gdG9cclxuICAgICAgICAgICAgLy8gYXZvaWQgdW5uZWNlc3Nhcnkgd29yayBsaWtlIHBhaW50aW5nIHdoaWxlIGluaXRpYWxpemluZyBpcyBub3QgY29tcGxldGVcclxuICAgICAgICAgICAgJGNvbnRhaW5lciA9ICQoIHNlbGYudHJhbnNsYXRlKCBzZWxmLCBmaXJzdEl0ZW1PcHRzLmJhc2VUcGwucmVwbGFjZSggJ1xce1xce0JVVFRPTlNcXH1cXH0nLCBidXR0b25TdHIgKSApIClcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ2ZhbmN5Ym94LWlzLWhpZGRlbicgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoJ2lkJywgJ2ZhbmN5Ym94LWNvbnRhaW5lci0nICsgc2VsZi5pZClcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggZmlyc3RJdGVtT3B0cy5iYXNlQ2xhc3MgKVxyXG4gICAgICAgICAgICAgICAgLmRhdGEoICdGYW5jeUJveCcsIHNlbGYgKVxyXG4gICAgICAgICAgICAgICAgLnByZXBlbmRUbyggZmlyc3RJdGVtT3B0cy5wYXJlbnRFbCApO1xyXG5cclxuICAgICAgICAgICAgLy8gQ3JlYXRlIG9iamVjdCBob2xkaW5nIHJlZmVyZW5jZXMgdG8galF1ZXJ5IHdyYXBwZWQgbm9kZXNcclxuICAgICAgICAgICAgc2VsZi4kcmVmcyA9IHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lciA6ICRjb250YWluZXJcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIFsgJ2JnJywgJ2lubmVyJywgJ2luZm9iYXInLCAndG9vbGJhcicsICdzdGFnZScsICdjYXB0aW9uJyBdLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi4kcmVmc1sgaXRlbSBdID0gJGNvbnRhaW5lci5maW5kKCAnLmZhbmN5Ym94LScgKyBpdGVtICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgZm9yIHJlZHVuZGFudCBlbGVtZW50c1xyXG4gICAgICAgICAgICBpZiAoICFmaXJzdEl0ZW1PcHRzLmFycm93cyB8fCBzZWxmLmdyb3VwLmxlbmd0aCA8IDIgKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJy5mYW5jeWJveC1uYXZpZ2F0aW9uJykucmVtb3ZlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggIWZpcnN0SXRlbU9wdHMuaW5mb2JhciApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuJHJlZnMuaW5mb2Jhci5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCAhZmlyc3RJdGVtT3B0cy50b29sYmFyICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi4kcmVmcy50b29sYmFyLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoICdvbkluaXQnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBCcmluZyB0byBmcm9udCBhbmQgZW5hYmxlIGV2ZW50c1xyXG4gICAgICAgICAgICBzZWxmLmFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBCdWlsZCBzbGlkZXMsIGxvYWQgYW5kIHJldmVhbCBjb250ZW50XHJcbiAgICAgICAgICAgIHNlbGYuanVtcFRvKCBzZWxmLmN1cnJJbmRleCApO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBTaW1wbGUgaTE4biBzdXBwb3J0IC0gcmVwbGFjZXMgb2JqZWN0IGtleXMgZm91bmQgaW4gdGVtcGxhdGVcclxuICAgICAgICAvLyB3aXRoIGNvcnJlc3BvbmRpbmcgdmFsdWVzXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIHRyYW5zbGF0ZSA6IGZ1bmN0aW9uKCBvYmosIHN0ciApIHtcclxuICAgICAgICAgICAgdmFyIGFyciA9IG9iai5vcHRzLmkxOG5bIG9iai5vcHRzLmxhbmcgXTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBzdHIucmVwbGFjZSgvXFx7XFx7KFxcdyspXFx9XFx9L2csIGZ1bmN0aW9uKG1hdGNoLCBuKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBhcnJbbl07XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB2YWx1ZSA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBhcnJheSBvZiBnYWxseSBpdGVtIG9iamVjdHNcclxuICAgICAgICAvLyBDaGVjayBpZiBlYWNoIG9iamVjdCBoYXMgdmFsaWQgdHlwZSBhbmQgY29udGVudFxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGNyZWF0ZUdyb3VwIDogZnVuY3Rpb24gKCBjb250ZW50ICkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiAgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgaXRlbXMgPSAkLm1ha2VBcnJheSggY29udGVudCApO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKGl0ZW1zLCBmdW5jdGlvbiggaSwgaXRlbSApIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogID0ge30sXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cyA9IHt9LFxyXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBbXSxcclxuICAgICAgICAgICAgICAgICAgICAkaXRlbSxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNyYyxcclxuICAgICAgICAgICAgICAgICAgICBzcmNQYXJ0cztcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDEgLSBNYWtlIHN1cmUgd2UgaGF2ZSBhbiBvYmplY3RcclxuICAgICAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggJC5pc1BsYWluT2JqZWN0KCBpdGVtICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIHByb2JhYmx5IGhhdmUgbWFudWFsIHVzYWdlIGhlcmUsIHNvbWV0aGluZyBsaWtlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gJC5mYW5jeWJveC5vcGVuKCBbIHsgc3JjIDogXCJpbWFnZS5qcGdcIiwgdHlwZSA6IFwiaW1hZ2VcIiB9IF0gKVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBvYmogID0gaXRlbTtcclxuICAgICAgICAgICAgICAgICAgICBvcHRzID0gaXRlbS5vcHRzIHx8IGl0ZW07XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggJC50eXBlKCBpdGVtICkgPT09ICdvYmplY3QnICYmICQoIGl0ZW0gKS5sZW5ndGggKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEhlcmUgd2UgcHJvcGJhYmx5IGhhdmUgalF1ZXJ5IGNvbGxlY3Rpb24gcmV0dXJuZWQgYnkgc29tZSBzZWxlY3RvclxyXG5cclxuICAgICAgICAgICAgICAgICAgICAkaXRlbSA9ICQoIGl0ZW0gKTtcclxuICAgICAgICAgICAgICAgICAgICBkYXRhICA9ICRpdGVtLmRhdGEoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cyA9ICdvcHRpb25zJyBpbiBkYXRhID8gZGF0YS5vcHRpb25zIDoge307XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cyA9ICQudHlwZSggb3B0cyApID09PSAnb2JqZWN0JyA/IG9wdHMgOiB7fTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnNyYyAgPSAnc3JjJyBpbiBkYXRhID8gZGF0YS5zcmMgOiAoIG9wdHMuc3JjIHx8ICRpdGVtLmF0dHIoICdocmVmJyApICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIFsgJ3dpZHRoJywgJ2hlaWdodCcsICd0aHVtYicsICd0eXBlJywgJ2ZpbHRlcicgXS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBpdGVtIGluIGRhdGEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcHRzWyBpdGVtIF0gPSBkYXRhWyBpdGVtIF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAnc3Jjc2V0JyBpbiBkYXRhICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRzLmltYWdlID0geyBzcmNzZXQgOiBkYXRhLnNyY3NldCB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cy4kb3JpZyA9ICRpdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoICFvYmoudHlwZSAmJiAhb2JqLnNyYyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnR5cGUgPSAnaW5saW5lJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNyYyAgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBBc3N1bWUgd2UgaGF2ZSBhIHNpbXBsZSBodG1sIGNvZGUsIGZvciBleGFtcGxlOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vICQuZmFuY3lib3gub3BlbiggJzxkaXY+PGgxPkhpITwvaDE+PC9kaXY+JyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBvYmogPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgOiAnaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYyAgOiBpdGVtICsgJydcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBFYWNoIGdhbGxlcnkgb2JqZWN0IGhhcyBmdWxsIGNvbGxlY3Rpb24gb2Ygb3B0aW9uc1xyXG4gICAgICAgICAgICAgICAgb2JqLm9wdHMgPSAkLmV4dGVuZCggdHJ1ZSwge30sIHNlbGYub3B0cywgb3B0cyApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggJC5mYW5jeWJveC5pc01vYmlsZSApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoub3B0cyA9ICQuZXh0ZW5kKCB0cnVlLCB7fSwgb2JqLm9wdHMsIG9iai5vcHRzLm1vYmlsZSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDIgLSBNYWtlIHN1cmUgd2UgaGF2ZSBjb250ZW50IHR5cGUsIGlmIG5vdCAtIHRyeSB0byBndWVzc1xyXG4gICAgICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgICAgICAgICB0eXBlID0gb2JqLnR5cGUgfHwgb2JqLm9wdHMudHlwZTtcclxuICAgICAgICAgICAgICAgIHNyYyAgPSBvYmouc3JjIHx8ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggIXR5cGUgJiYgc3JjICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc3JjLm1hdGNoKC8oXmRhdGE6aW1hZ2VcXC9bYS16MC05K1xcLz1dKiwpfChcXC4oanAoZXxnfGVnKXxnaWZ8cG5nfGJtcHx3ZWJwfHN2Z3xpY28pKChcXD98IykuKik/JCkvaSkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnaW1hZ2UnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzcmMubWF0Y2goL1xcLihwZGYpKChcXD98IykuKik/JC9pKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdwZGYnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzcmMuY2hhckF0KDApID09PSAnIycgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnaW5saW5lJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgb2JqLnR5cGUgPSB0eXBlO1xyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDMgLSBTb21lIGFkanVzdG1lbnRzXHJcbiAgICAgICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICAgICAgb2JqLmluZGV4ID0gc2VsZi5ncm91cC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgJG9yaWcgYW5kICR0aHVtYiBvYmplY3RzIGV4aXN0XHJcbiAgICAgICAgICAgICAgICBpZiAoIG9iai5vcHRzLiRvcmlnICYmICFvYmoub3B0cy4kb3JpZy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG9iai5vcHRzLiRvcmlnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggIW9iai5vcHRzLiR0aHVtYiAmJiBvYmoub3B0cy4kb3JpZyApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy4kdGh1bWIgPSBvYmoub3B0cy4kb3JpZy5maW5kKCAnaW1nOmZpcnN0JyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggb2JqLm9wdHMuJHRodW1iICYmICFvYmoub3B0cy4kdGh1bWIubGVuZ3RoICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmoub3B0cy4kdGh1bWI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2FwdGlvbiBpcyBhIFwic3BlY2lhbFwiIG9wdGlvbiwgaXQgY2FuIGJlIHBhc3NlZCBhcyBhIG1ldGhvZFxyXG4gICAgICAgICAgICAgICAgaWYgKCAkLnR5cGUoIG9iai5vcHRzLmNhcHRpb24gKSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy5jYXB0aW9uID0gb2JqLm9wdHMuY2FwdGlvbi5hcHBseSggaXRlbSwgWyBzZWxmLCBvYmogXSApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICdjYXB0aW9uJyBpbiBkYXRhICkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5vcHRzLmNhcHRpb24gPSBkYXRhLmNhcHRpb247XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIHdlIGhhdmUgY2FwdGlvbiBhcyBhIHN0cmluZ1xyXG4gICAgICAgICAgICAgICAgb2JqLm9wdHMuY2FwdGlvbiA9IG9iai5vcHRzLmNhcHRpb24gPT09IHVuZGVmaW5lZCA/ICcnIDogb2JqLm9wdHMuY2FwdGlvbiArICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHVybCBjb250YWlucyBcImZpbHRlclwiIHVzZWQgdG8gZmlsdGVyIHRoZSBjb250ZW50XHJcbiAgICAgICAgICAgICAgICAvLyBFeGFtcGxlOiBcImFqYXguaHRtbCAjc29tZXRoaW5nXCJcclxuICAgICAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ2FqYXgnICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNyY1BhcnRzID0gc3JjLnNwbGl0KC9cXHMrLywgMik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc3JjUGFydHMubGVuZ3RoID4gMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNyYyA9IHNyY1BhcnRzLnNoaWZ0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy5maWx0ZXIgPSBzcmNQYXJ0cy5zaGlmdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIG9iai5vcHRzLnNtYWxsQnRuID09ICdhdXRvJyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAkLmluQXJyYXkoIHR5cGUsIFsnaHRtbCcsICdpbmxpbmUnLCAnYWpheCddICkgPiAtMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLm9wdHMudG9vbGJhciAgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLm9wdHMuc21hbGxCdG4gPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy5zbWFsbEJ0biA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdGhlIHR5cGUgaXMgXCJwZGZcIiwgdGhlbiBzaW1wbHkgbG9hZCBmaWxlIGludG8gaWZyYW1lXHJcbiAgICAgICAgICAgICAgICBpZiAoIHR5cGUgPT09ICdwZGYnICkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai50eXBlID0gJ2lmcmFtZSc7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9iai5vcHRzLmlmcmFtZS5wcmVsb2FkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSGlkZSBhbGwgYnV0dG9ucyBhbmQgZGlzYWJsZSBpbnRlcmFjdGl2aXR5IGZvciBtb2RhbCBpdGVtc1xyXG4gICAgICAgICAgICAgICAgaWYgKCBvYmoub3B0cy5tb2RhbCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLm9wdHMgPSAkLmV4dGVuZCh0cnVlLCBvYmoub3B0cywge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZW1vdmUgYnV0dG9uc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbmZvYmFyIDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbGJhciA6IDAsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbWFsbEJ0biA6IDAsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEaXNhYmxlIGtleWJvYXJkIG5hdmlnYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5Ym9hcmQgOiAwLFxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRGlzYWJsZSBzb21lIG1vZHVsZXNcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGVTaG93ICA6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bGxTY3JlZW4gOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aHVtYnMgICAgIDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG91Y2ggICAgICA6IDAsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEaXNhYmxlIGNsaWNrIGV2ZW50IGhhbmRsZXJzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrQ29udGVudCAgICA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja1NsaWRlICAgICAgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tPdXRzaWRlICAgIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRibGNsaWNrQ29udGVudCA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYmxjbGlja1NsaWRlICAgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2tPdXRzaWRlIDogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3RlcCA0IC0gQWRkIHByb2Nlc3NlZCBvYmplY3QgdG8gZ3JvdXBcclxuICAgICAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5ncm91cC5wdXNoKCBvYmogKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQXR0YWNoIGFuIGV2ZW50IGhhbmRsZXIgZnVuY3Rpb25zIGZvcjpcclxuICAgICAgICAvLyAgIC0gbmF2aWdhdGlvbiBidXR0b25zXHJcbiAgICAgICAgLy8gICAtIGJyb3dzZXIgc2Nyb2xsaW5nLCByZXNpemluZztcclxuICAgICAgICAvLyAgIC0gZm9jdXNpbmdcclxuICAgICAgICAvLyAgIC0ga2V5Ym9hcmRcclxuICAgICAgICAvLyAgIC0gZGV0ZWN0IGlkbGVcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBhZGRFdmVudHMgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5yZW1vdmVFdmVudHMoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE1ha2UgbmF2aWdhdGlvbiBlbGVtZW50cyBjbGlja2FibGVcclxuICAgICAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIub24oJ2NsaWNrLmZiLWNsb3NlJywgJ1tkYXRhLWZhbmN5Ym94LWNsb3NlXScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5jbG9zZSggZSApO1xyXG5cclxuICAgICAgICAgICAgfSkub24oICdjbGljay5mYi1wcmV2IHRvdWNoZW5kLmZiLXByZXYnLCAnW2RhdGEtZmFuY3lib3gtcHJldl0nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYucHJldmlvdXMoKTtcclxuXHJcbiAgICAgICAgICAgIH0pLm9uKCAnY2xpY2suZmItbmV4dCB0b3VjaGVuZC5mYi1uZXh0JywgJ1tkYXRhLWZhbmN5Ym94LW5leHRdJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLm5leHQoKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIEhhbmRsZSBwYWdlIHNjcm9sbGluZyBhbmQgYnJvd3NlciByZXNpemluZ1xyXG4gICAgICAgICAgICAkVy5vbignb3JpZW50YXRpb25jaGFuZ2UuZmIgcmVzaXplLmZiJywgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggZSAmJiBlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LnR5cGUgPT09IFwicmVzaXplXCIgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlcXVlc3RBRnJhbWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kcmVmcy5zdGFnZS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuJHJlZnMuc3RhZ2Uuc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gVHJhcCBrZXlib2FyZCBmb2N1cyBpbnNpZGUgb2YgdGhlIG1vZGFsLCBzbyB0aGUgdXNlciBkb2VzIG5vdCBhY2NpZGVudGFsbHkgdGFiIG91dHNpZGUgb2YgdGhlIG1vZGFsXHJcbiAgICAgICAgICAgIC8vIChhLmsuYS4gXCJlc2NhcGluZyB0aGUgbW9kYWxcIilcclxuICAgICAgICAgICAgJEQub24oJ2ZvY3VzaW4uZmInLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSAkLmZhbmN5Ym94ID8gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpIDogbnVsbDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGluc3RhbmNlLmlzQ2xvc2luZyB8fCAhaW5zdGFuY2UuY3VycmVudCB8fCAhaW5zdGFuY2UuY3VycmVudC5vcHRzLnRyYXBGb2N1cyB8fCAkKCBlLnRhcmdldCApLmhhc0NsYXNzKCAnZmFuY3lib3gtY29udGFpbmVyJyApIHx8ICQoIGUudGFyZ2V0ICkuaXMoIGRvY3VtZW50ICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggaW5zdGFuY2UgJiYgJCggZS50YXJnZXQgKS5jc3MoICdwb3NpdGlvbicgKSAhPT0gJ2ZpeGVkJyAmJiAhaW5zdGFuY2UuJHJlZnMuY29udGFpbmVyLmhhcyggZS50YXJnZXQgKS5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UuZm9jdXMoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gU29tZXRpbWVzIHBhZ2UgZ2V0cyBzY3JvbGxlZCwgc2V0IGl0IGJhY2tcclxuICAgICAgICAgICAgICAgICAgICAkVy5zY3JvbGxUb3AoIHNlbGYuc2Nyb2xsVG9wICkuc2Nyb2xsTGVmdCggc2VsZi5zY3JvbGxMZWZ0ICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIEVuYWJsZSBrZXlib2FyZCBuYXZpZ2F0aW9uXHJcbiAgICAgICAgICAgICRELm9uKCdrZXlkb3duLmZiJywgZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjdXJyZW50ID0gc2VsZi5jdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIGtleWNvZGUgPSBlLmtleUNvZGUgfHwgZS53aGljaDtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICFjdXJyZW50IHx8ICFjdXJyZW50Lm9wdHMua2V5Ym9hcmQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggJChlLnRhcmdldCkuaXMoJ2lucHV0JykgfHwgJChlLnRhcmdldCkuaXMoJ3RleHRhcmVhJykgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEJhY2tzcGFjZSBhbmQgRXNjIGtleXNcclxuICAgICAgICAgICAgICAgIGlmICgga2V5Y29kZSA9PT0gOCB8fCBrZXljb2RlID09PSAyNyApIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY2xvc2UoIGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIExlZnQgYXJyb3cgYW5kIFVwIGFycm93XHJcbiAgICAgICAgICAgICAgICBpZiAoIGtleWNvZGUgPT09IDM3IHx8IGtleWNvZGUgPT09IDM4ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcmV2aW91cygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gUmlnaCBhcnJvdyBhbmQgRG93biBhcnJvd1xyXG4gICAgICAgICAgICAgICAgaWYgKCBrZXljb2RlID09PSAzOSB8fCBrZXljb2RlID09PSA0MCApIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCdhZnRlcktleWRvd24nLCBlLCBrZXljb2RlKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gSGlkZSBjb250cm9scyBhZnRlciBzb21lIGluYWN0aXZpdHkgcGVyaW9kXHJcbiAgICAgICAgICAgIGlmICggc2VsZi5ncm91cFsgc2VsZi5jdXJySW5kZXggXS5vcHRzLmlkbGVUaW1lICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5pZGxlU2Vjb25kc0NvdW50ZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICRELm9uKCdtb3VzZW1vdmUuZmItaWRsZSBtb3VzZWVudGVyLmZiLWlkbGUgbW91c2VsZWF2ZS5mYi1pZGxlIG1vdXNlZG93bi5mYi1pZGxlIHRvdWNoc3RhcnQuZmItaWRsZSB0b3VjaG1vdmUuZmItaWRsZSBzY3JvbGwuZmItaWRsZSBrZXlkb3duLmZiLWlkbGUnLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmlkbGVTZWNvbmRzQ291bnRlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc2VsZi5pc0lkbGUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvd0NvbnRyb2xzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmlzSWRsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5pZGxlSW50ZXJ2YWwgPSB3aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyKys7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc2VsZi5pZGxlU2Vjb25kc0NvdW50ZXIgPj0gc2VsZi5ncm91cFsgc2VsZi5jdXJySW5kZXggXS5vcHRzLmlkbGVUaW1lICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlzSWRsZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaGlkZUNvbnRyb2xzKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sIDEwMDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBSZW1vdmUgZXZlbnRzIGFkZGVkIGJ5IHRoZSBjb3JlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICByZW1vdmVFdmVudHMgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICRXLm9mZiggJ29yaWVudGF0aW9uY2hhbmdlLmZiIHJlc2l6ZS5mYicgKTtcclxuICAgICAgICAgICAgJEQub2ZmKCAnZm9jdXNpbi5mYiBrZXlkb3duLmZiIC5mYi1pZGxlJyApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kcmVmcy5jb250YWluZXIub2ZmKCAnLmZiLWNsb3NlIC5mYi1wcmV2IC5mYi1uZXh0JyApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzZWxmLmlkbGVJbnRlcnZhbCApIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKCBzZWxmLmlkbGVJbnRlcnZhbCApO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuaWRsZUludGVydmFsID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBDaGFuZ2UgdG8gcHJldmlvdXMgZ2FsbGVyeSBpdGVtXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBwcmV2aW91cyA6IGZ1bmN0aW9uKCBkdXJhdGlvbiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuanVtcFRvKCB0aGlzLmN1cnJQb3MgLSAxLCBkdXJhdGlvbiApO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBDaGFuZ2UgdG8gbmV4dCBnYWxsZXJ5IGl0ZW1cclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgbmV4dCA6IGZ1bmN0aW9uKCBkdXJhdGlvbiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuanVtcFRvKCB0aGlzLmN1cnJQb3MgKyAxLCBkdXJhdGlvbiApO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBTd2l0Y2ggdG8gc2VsZWN0ZWQgZ2FsbGVyeSBpdGVtXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBqdW1wVG8gOiBmdW5jdGlvbiAoIHBvcywgZHVyYXRpb24sIHNsaWRlICkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBmaXJzdFJ1bixcclxuICAgICAgICAgICAgICAgIGxvb3AsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgcHJldmlvdXMsXHJcbiAgICAgICAgICAgICAgICBjYW52YXNXaWR0aCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQb3MsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uUHJvcHM7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3JvdXBMZW4gPSBzZWxmLmdyb3VwLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGlmICggc2VsZi5pc1NsaWRpbmcgfHwgc2VsZi5pc0Nsb3NpbmcgfHwgKCBzZWxmLmlzQW5pbWF0aW5nICYmIHNlbGYuZmlyc3RSdW4gKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcG9zICA9IHBhcnNlSW50KCBwb3MsIDEwICk7XHJcbiAgICAgICAgICAgIGxvb3AgPSBzZWxmLmN1cnJlbnQgPyBzZWxmLmN1cnJlbnQub3B0cy5sb29wIDogc2VsZi5vcHRzLmxvb3A7XHJcblxyXG4gICAgICAgICAgICBpZiAoICFsb29wICYmICggcG9zIDwgMCB8fCBwb3MgPj0gZ3JvdXBMZW4gKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlyc3RSdW4gPSBzZWxmLmZpcnN0UnVuID0gKCBzZWxmLmZpcnN0UnVuID09PSBudWxsICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdyb3VwTGVuIDwgMiAmJiAhZmlyc3RSdW4gJiYgISFzZWxmLmlzU2xpZGluZyApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcHJldmlvdXMgPSBzZWxmLmN1cnJlbnQ7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByZXZJbmRleCA9IHNlbGYuY3VyckluZGV4O1xyXG4gICAgICAgICAgICBzZWxmLnByZXZQb3MgICA9IHNlbGYuY3VyclBvcztcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBzbGlkZXNcclxuICAgICAgICAgICAgY3VycmVudCA9IHNlbGYuY3JlYXRlU2xpZGUoIHBvcyApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBncm91cExlbiA+IDEgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGxvb3AgfHwgY3VycmVudC5pbmRleCA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVTbGlkZSggcG9zIC0gMSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbG9vcCB8fCBjdXJyZW50LmluZGV4IDwgZ3JvdXBMZW4gLSAxICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlU2xpZGUoIHBvcyArIDEgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5jdXJyZW50ICAgPSBjdXJyZW50O1xyXG4gICAgICAgICAgICBzZWxmLmN1cnJJbmRleCA9IGN1cnJlbnQuaW5kZXg7XHJcbiAgICAgICAgICAgIHNlbGYuY3VyclBvcyAgID0gY3VycmVudC5wb3M7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoICdiZWZvcmVTaG93JywgZmlyc3RSdW4gKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlQ29udHJvbHMoKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZSggY3VycmVudC4kc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnQuaXNNb3ZlZCAgICAgICAgPSAoIGN1cnJlbnRQb3MubGVmdCAhPT0gMCB8fCBjdXJyZW50UG9zLnRvcCAhPT0gMCApICYmICFjdXJyZW50LiRzbGlkZS5oYXNDbGFzcyggJ2ZhbmN5Ym94LWFuaW1hdGVkJyApO1xyXG4gICAgICAgICAgICBjdXJyZW50LmZvcmNlZER1cmF0aW9uID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkLmlzTnVtZXJpYyggZHVyYXRpb24gKSApIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQuZm9yY2VkRHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gY3VycmVudC5vcHRzWyBmaXJzdFJ1biA/ICdhbmltYXRpb25EdXJhdGlvbicgOiAndHJhbnNpdGlvbkR1cmF0aW9uJyBdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHBhcnNlSW50KCBkdXJhdGlvbiwgMTAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZyZXNoIHN0YXJ0IC0gcmV2ZWFsIGNvbnRhaW5lciwgY3VycmVudCBzbGlkZSBhbmQgc3RhcnQgbG9hZGluZyBjb250ZW50XHJcbiAgICAgICAgICAgIGlmICggZmlyc3RSdW4gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBjdXJyZW50Lm9wdHMuYW5pbWF0aW9uRWZmZWN0ICYmIGR1cmF0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyLmNzcyggJ3RyYW5zaXRpb24tZHVyYXRpb24nLCBkdXJhdGlvbiArICdtcycgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLiRyZWZzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWlzLWhpZGRlbicgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3JjZVJlZHJhdyggc2VsZi4kcmVmcy5jb250YWluZXIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLiRyZWZzLmNvbnRhaW5lci5hZGRDbGFzcyggJ2ZhbmN5Ym94LWlzLW9wZW4nICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBmaXJzdCBzbGlkZSB2aXNpYmxlICh0byBkaXNwbGF5IGxvYWRpbmcgaWNvbiwgaWYgbmVlZGVkKVxyXG4gICAgICAgICAgICAgICAgY3VycmVudC4kc2xpZGUuYWRkQ2xhc3MoICdmYW5jeWJveC1zbGlkZS0tY3VycmVudCcgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmxvYWRTbGlkZSggY3VycmVudCApO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYucHJlbG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2xlYW4gdXBcclxuICAgICAgICAgICAgJC5lYWNoKHNlbGYuc2xpZGVzLCBmdW5jdGlvbiggaW5kZXgsIHNsaWRlICkge1xyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5zdG9wKCBzbGlkZS4kc2xpZGUgKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIGN1cnJlbnQgdGhhdCBzbGlkZSBpcyB2aXNpYmxlIGV2ZW4gaWYgY29udGVudCBpcyBzdGlsbCBsb2FkaW5nXHJcbiAgICAgICAgICAgIGN1cnJlbnQuJHNsaWRlLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtc2xpZGUtLW5leHQgZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzJyApLmFkZENsYXNzKCAnZmFuY3lib3gtc2xpZGUtLWN1cnJlbnQnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBzbGlkZXMgaGF2ZSBiZWVuIGRyYWdnZWQsIGFuaW1hdGUgdGhlbSB0byBjb3JyZWN0IHBvc2l0aW9uXHJcbiAgICAgICAgICAgIGlmICggY3VycmVudC5pc01vdmVkICkge1xyXG4gICAgICAgICAgICAgICAgY2FudmFzV2lkdGggPSBNYXRoLnJvdW5kKCBjdXJyZW50LiRzbGlkZS53aWR0aCgpICk7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKHNlbGYuc2xpZGVzLCBmdW5jdGlvbiggaW5kZXgsIHNsaWRlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBzbGlkZS5wb3MgLSBjdXJyZW50LnBvcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKCBzbGlkZS4kc2xpZGUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wICA6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgOiAoIHBvcyAqIGNhbnZhc1dpZHRoICkgKyAoIHBvcyAqIHNsaWRlLm9wdHMuZ3V0dGVyIClcclxuICAgICAgICAgICAgICAgICAgICB9LCBkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS4kc2xpZGUucmVtb3ZlQXR0cignc3R5bGUnKS5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LXNsaWRlLS1uZXh0IGZhbmN5Ym94LXNsaWRlLS1wcmV2aW91cycgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc2xpZGUucG9zID09PSBzZWxmLmN1cnJQb3MgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50LmlzTW92ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuJHJlZnMuc3RhZ2UuY2hpbGRyZW4oKS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFN0YXJ0IHRyYW5zaXRpb24gdGhhdCByZXZlYWxzIGN1cnJlbnQgY29udGVudFxyXG4gICAgICAgICAgICAvLyBvciB3YWl0IHdoZW4gaXQgd2lsbCBiZSBsb2FkZWRcclxuXHJcbiAgICAgICAgICAgIGlmICggY3VycmVudC5pc0xvYWRlZCApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmV2ZWFsQ29udGVudCggY3VycmVudCApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubG9hZFNsaWRlKCBjdXJyZW50ICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJlbG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBwcmV2aW91cy5wb3MgPT09IGN1cnJlbnQucG9zICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBIYW5kbGUgcHJldmlvdXMgc2xpZGVcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uUHJvcHMgPSAnZmFuY3lib3gtc2xpZGUtLScgKyAoIHByZXZpb3VzLnBvcyA+IGN1cnJlbnQucG9zID8gJ25leHQnIDogJ3ByZXZpb3VzJyApO1xyXG5cclxuICAgICAgICAgICAgcHJldmlvdXMuJHNsaWRlLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtc2xpZGUtLWNvbXBsZXRlIGZhbmN5Ym94LXNsaWRlLS1jdXJyZW50IGZhbmN5Ym94LXNsaWRlLS1uZXh0IGZhbmN5Ym94LXNsaWRlLS1wcmV2aW91cycgKTtcclxuXHJcbiAgICAgICAgICAgIHByZXZpb3VzLmlzQ29tcGxldGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggIWR1cmF0aW9uIHx8ICggIWN1cnJlbnQuaXNNb3ZlZCAmJiAhY3VycmVudC5vcHRzLnRyYW5zaXRpb25FZmZlY3QgKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBjdXJyZW50LmlzTW92ZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91cy4kc2xpZGUuYWRkQ2xhc3MoIHRyYW5zaXRpb25Qcm9wcyApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uUHJvcHMgPSAnZmFuY3lib3gtYW5pbWF0ZWQgJyArIHRyYW5zaXRpb25Qcm9wcyArICcgZmFuY3lib3gtZngtJyArIGN1cnJlbnQub3B0cy50cmFuc2l0aW9uRWZmZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guYW5pbWF0ZSggcHJldmlvdXMuJHNsaWRlLCB0cmFuc2l0aW9uUHJvcHMsIGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91cy4kc2xpZGUucmVtb3ZlQ2xhc3MoIHRyYW5zaXRpb25Qcm9wcyApLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBcInNsaWRlXCIgZWxlbWVudFxyXG4gICAgICAgIC8vIFRoZXNlIGFyZSBnYWxsZXJ5IGl0ZW1zICB0aGF0IGFyZSBhY3R1YWxseSBhZGRlZCB0byBET01cclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGNyZWF0ZVNsaWRlIDogZnVuY3Rpb24oIHBvcyApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyICRzbGlkZTtcclxuICAgICAgICAgICAgdmFyIGluZGV4O1xyXG5cclxuICAgICAgICAgICAgaW5kZXggPSBwb3MgJSBzZWxmLmdyb3VwLmxlbmd0aDtcclxuICAgICAgICAgICAgaW5kZXggPSBpbmRleCA8IDAgPyBzZWxmLmdyb3VwLmxlbmd0aCArIGluZGV4IDogaW5kZXg7XHJcblxyXG4gICAgICAgICAgICBpZiAoICFzZWxmLnNsaWRlc1sgcG9zIF0gJiYgc2VsZi5ncm91cFsgaW5kZXggXSApIHtcclxuICAgICAgICAgICAgICAgICRzbGlkZSA9ICQoJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1zbGlkZVwiPjwvZGl2PicpLmFwcGVuZFRvKCBzZWxmLiRyZWZzLnN0YWdlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5zbGlkZXNbIHBvcyBdID0gJC5leHRlbmQoIHRydWUsIHt9LCBzZWxmLmdyb3VwWyBpbmRleCBdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zICAgICAgOiBwb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlICAgOiAkc2xpZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNMb2FkZWQgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlU2xpZGUoIHNlbGYuc2xpZGVzWyBwb3MgXSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5zbGlkZXNbIHBvcyBdO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBTY2FsZSBpbWFnZSB0byB0aGUgYWN0dWFsIHNpemUgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBzY2FsZVRvQWN0dWFsIDogZnVuY3Rpb24oIHgsIHksIGR1cmF0aW9uICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIHZhciAkd2hhdCAgID0gY3VycmVudC4kY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbWdQb3MsIHBvc1gsIHBvc1ksIHNjYWxlWCwgc2NhbGVZO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNhbnZhc1dpZHRoICA9IHBhcnNlSW50KCBjdXJyZW50LiRzbGlkZS53aWR0aCgpLCAxMCApO1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzSGVpZ2h0ID0gcGFyc2VJbnQoIGN1cnJlbnQuJHNsaWRlLmhlaWdodCgpLCAxMCApO1xyXG5cclxuICAgICAgICAgICAgdmFyIG5ld0ltZ1dpZHRoICA9IGN1cnJlbnQud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBuZXdJbWdIZWlnaHQgPSBjdXJyZW50LmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICggISggY3VycmVudC50eXBlID09ICdpbWFnZScgJiYgIWN1cnJlbnQuaGFzRXJyb3IpIHx8ICEkd2hhdCB8fCBzZWxmLmlzQW5pbWF0aW5nKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuZmFuY3lib3guc3RvcCggJHdoYXQgKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuaXNBbmltYXRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgeCA9IHggPT09IHVuZGVmaW5lZCA/IGNhbnZhc1dpZHRoICAqIDAuNSAgOiB4O1xyXG4gICAgICAgICAgICB5ID0geSA9PT0gdW5kZWZpbmVkID8gY2FudmFzSGVpZ2h0ICogMC41ICA6IHk7XHJcblxyXG4gICAgICAgICAgICBpbWdQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZSggJHdoYXQgKTtcclxuXHJcbiAgICAgICAgICAgIHNjYWxlWCAgPSBuZXdJbWdXaWR0aCAgLyBpbWdQb3Mud2lkdGg7XHJcbiAgICAgICAgICAgIHNjYWxlWSAgPSBuZXdJbWdIZWlnaHQgLyBpbWdQb3MuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgLy8gR2V0IGNlbnRlciBwb3NpdGlvbiBmb3Igb3JpZ2luYWwgaW1hZ2VcclxuICAgICAgICAgICAgcG9zWCA9ICggY2FudmFzV2lkdGggKiAwLjUgIC0gbmV3SW1nV2lkdGggKiAwLjUgKTtcclxuICAgICAgICAgICAgcG9zWSA9ICggY2FudmFzSGVpZ2h0ICogMC41IC0gbmV3SW1nSGVpZ2h0ICogMC41ICk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgaW1hZ2UgZG9lcyBub3QgbW92ZSBhd2F5IGZyb20gZWRnZXNcclxuICAgICAgICAgICAgaWYgKCBuZXdJbWdXaWR0aCA+IGNhbnZhc1dpZHRoICkge1xyXG4gICAgICAgICAgICAgICAgcG9zWCA9IGltZ1Bvcy5sZWZ0ICogc2NhbGVYIC0gKCAoIHggKiBzY2FsZVggKSAtIHggKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHBvc1ggPiAwICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggcG9zWCA8ICBjYW52YXNXaWR0aCAtIG5ld0ltZ1dpZHRoICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1ggPSBjYW52YXNXaWR0aCAtIG5ld0ltZ1dpZHRoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIG5ld0ltZ0hlaWdodCA+IGNhbnZhc0hlaWdodCkge1xyXG4gICAgICAgICAgICAgICAgcG9zWSA9IGltZ1Bvcy50b3AgICogc2NhbGVZIC0gKCAoIHkgKiBzY2FsZVkgKSAtIHkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHBvc1kgPiAwICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggcG9zWSA8ICBjYW52YXNIZWlnaHQgLSBuZXdJbWdIZWlnaHQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zWSA9IGNhbnZhc0hlaWdodCAtIG5ld0ltZ0hlaWdodDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi51cGRhdGVDdXJzb3IoIG5ld0ltZ1dpZHRoLCBuZXdJbWdIZWlnaHQgKTtcclxuXHJcbiAgICAgICAgICAgICQuZmFuY3lib3guYW5pbWF0ZSggJHdoYXQsIHtcclxuICAgICAgICAgICAgICAgIHRvcCAgICA6IHBvc1ksXHJcbiAgICAgICAgICAgICAgICBsZWZ0ICAgOiBwb3NYLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVYIDogc2NhbGVYLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVZIDogc2NhbGVZXHJcbiAgICAgICAgICAgIH0sIGR1cmF0aW9uIHx8IDMzMCwgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmlzQW5pbWF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gU3RvcCBzbGlkZXNob3dcclxuICAgICAgICAgICAgaWYgKCBzZWxmLlNsaWRlU2hvdyAmJiBzZWxmLlNsaWRlU2hvdy5pc0FjdGl2ZSApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuU2xpZGVTaG93LnN0b3AoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBTY2FsZSBpbWFnZSB0byBmaXQgaW5zaWRlIHBhcmVudCBlbGVtZW50XHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBzY2FsZVRvRml0IDogZnVuY3Rpb24oIGR1cmF0aW9uICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIHZhciAkd2hhdCAgID0gY3VycmVudC4kY29udGVudDtcclxuICAgICAgICAgICAgdmFyIGVuZDtcclxuXHJcbiAgICAgICAgICAgIGlmICggISggY3VycmVudC50eXBlID09ICdpbWFnZScgJiYgIWN1cnJlbnQuaGFzRXJyb3IpIHx8ICEkd2hhdCB8fCBzZWxmLmlzQW5pbWF0aW5nICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LnN0b3AoICR3aGF0ICk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmlzQW5pbWF0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGVuZCA9IHNlbGYuZ2V0Rml0UG9zKCBjdXJyZW50ICk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnVwZGF0ZUN1cnNvciggZW5kLndpZHRoLCBlbmQuaGVpZ2h0ICk7XHJcblxyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoICR3aGF0LCB7XHJcbiAgICAgICAgICAgICAgICB0b3AgICAgOiBlbmQudG9wLFxyXG4gICAgICAgICAgICAgICAgbGVmdCAgIDogZW5kLmxlZnQsXHJcbiAgICAgICAgICAgICAgICBzY2FsZVggOiBlbmQud2lkdGggIC8gJHdoYXQud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgIHNjYWxlWSA6IGVuZC5oZWlnaHQgLyAkd2hhdC5oZWlnaHQoKVxyXG4gICAgICAgICAgICB9LCBkdXJhdGlvbiB8fCAzMzAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2FsY3VsYXRlIGltYWdlIHNpemUgdG8gZml0IGluc2lkZSB2aWV3cG9ydFxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgZ2V0Rml0UG9zIDogZnVuY3Rpb24oIHNsaWRlICkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiAgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgJHdoYXQgPSBzbGlkZS4kY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbWdXaWR0aCAgPSBzbGlkZS53aWR0aDtcclxuICAgICAgICAgICAgdmFyIGltZ0hlaWdodCA9IHNsaWRlLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXJnaW4gPSBzbGlkZS5vcHRzLm1hcmdpbjtcclxuXHJcbiAgICAgICAgICAgIHZhciBjYW52YXNXaWR0aCwgY2FudmFzSGVpZ2h0LCBtaW5SYXRpbywgd2lkdGgsIGhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICggISR3aGF0IHx8ICEkd2hhdC5sZW5ndGggfHwgKCAhaW1nV2lkdGggJiYgIWltZ0hlaWdodCkgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENvbnZlcnQgXCJtYXJnaW4gdG8gQ1NTIHN0eWxlOiBbIHRvcCwgcmlnaHQsIGJvdHRvbSwgbGVmdCBdXHJcbiAgICAgICAgICAgIGlmICggJC50eXBlKCBtYXJnaW4gKSA9PT0gXCJudW1iZXJcIiApIHtcclxuICAgICAgICAgICAgICAgIG1hcmdpbiA9IFsgbWFyZ2luLCBtYXJnaW4gXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBtYXJnaW4ubGVuZ3RoID09IDIgKSB7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW4gPSBbIG1hcmdpblswXSwgbWFyZ2luWzFdLCBtYXJnaW5bMF0sIG1hcmdpblsxXSBdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoICRXLndpZHRoKCkgPCA4MDAgKSB7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW4gPSBbIDAsIDAsIDAsIDAgXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gV2UgY2FuIG5vdCB1c2UgJHNsaWRlIHdpZHRoIGhlcmUsIGJlY2F1c2UgaXQgY2FuIGhhdmUgZGlmZmVyZW50IGRpZW1lbnNpb25zIHdoaWxlIGluIHRyYW5zaXRvblxyXG4gICAgICAgICAgICBjYW52YXNXaWR0aCAgPSBwYXJzZUludCggc2VsZi4kcmVmcy5zdGFnZS53aWR0aCgpLCAxMCApICAtICggbWFyZ2luWyAxIF0gKyBtYXJnaW5bIDMgXSApO1xyXG4gICAgICAgICAgICBjYW52YXNIZWlnaHQgPSBwYXJzZUludCggc2VsZi4kcmVmcy5zdGFnZS5oZWlnaHQoKSwgMTAgKSAtICggbWFyZ2luWyAwIF0gKyBtYXJnaW5bIDIgXSApO1xyXG5cclxuICAgICAgICAgICAgbWluUmF0aW8gPSBNYXRoLm1pbigxLCBjYW52YXNXaWR0aCAvIGltZ1dpZHRoLCBjYW52YXNIZWlnaHQgLyBpbWdIZWlnaHQgKTtcclxuXHJcbiAgICAgICAgICAgIHdpZHRoICA9IE1hdGguZmxvb3IoIG1pblJhdGlvICogaW1nV2lkdGggKTtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5mbG9vciggbWluUmF0aW8gKiBpbWdIZWlnaHQgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVzZSBmbG9vciByb3VuZGluZyB0byBtYWtlIHN1cmUgaXQgcmVhbGx5IGZpdHNcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHRvcCAgICA6IE1hdGguZmxvb3IoICggY2FudmFzSGVpZ2h0IC0gaGVpZ2h0ICkgKiAwLjUgKSArIG1hcmdpblsgMCBdLFxyXG4gICAgICAgICAgICAgICAgbGVmdCAgIDogTWF0aC5mbG9vciggKCBjYW52YXNXaWR0aCAgLSB3aWR0aCApICAqIDAuNSApICsgbWFyZ2luWyAzIF0sXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAgOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodCA6IGhlaWdodFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIHBvc2l0aW9uIGFuZCBjb250ZW50IG9mIGFsbCBzbGlkZXNcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICB1cGRhdGUgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICQuZWFjaCggc2VsZi5zbGlkZXMsIGZ1bmN0aW9uKCBrZXksIHNsaWRlICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVTbGlkZSggc2xpZGUgKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBVcGRhdGUgc2xpZGUgcG9zaXRpb24gYW5kIHNjYWxlIGNvbnRlbnQgdG8gZml0XHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICB1cGRhdGVTbGlkZSA6IGZ1bmN0aW9uKCBzbGlkZSApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmICA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciAkd2hhdCA9IHNsaWRlLiRjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkd2hhdCAmJiAoIHNsaWRlLndpZHRoIHx8IHNsaWRlLmhlaWdodCApICkge1xyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5zdG9wKCAkd2hhdCApO1xyXG5cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCAkd2hhdCwgc2VsZi5nZXRGaXRQb3MoIHNsaWRlICkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHNsaWRlLnBvcyA9PT0gc2VsZi5jdXJyUG9zICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlQ3Vyc29yKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNsaWRlLiRzbGlkZS50cmlnZ2VyKCAncmVmcmVzaCcgKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlciggJ29uVXBkYXRlJywgc2xpZGUgKTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIGN1cnNvciBzdHlsZSBkZXBlbmRpbmcgaWYgY29udGVudCBjYW4gYmUgem9vbWVkXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIHVwZGF0ZUN1cnNvciA6IGZ1bmN0aW9uKCBuZXh0V2lkdGgsIG5leHRIZWlnaHQgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBpc1NjYWxlZERvd247XHJcblxyXG4gICAgICAgICAgICB2YXIgJGNvbnRhaW5lciA9IHNlbGYuJHJlZnMuY29udGFpbmVyLnJlbW92ZUNsYXNzKCdmYW5jeWJveC1pcy16b29tYWJsZSBmYW5jeWJveC1jYW4tem9vbUluIGZhbmN5Ym94LWNhbi1kcmFnIGZhbmN5Ym94LWNhbi16b29tT3V0Jyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoICFzZWxmLmN1cnJlbnQgfHwgc2VsZi5pc0Nsb3NpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggc2VsZi5pc1pvb21hYmxlKCkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcyggJ2ZhbmN5Ym94LWlzLXpvb21hYmxlJyApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbmV4dFdpZHRoICE9PSB1bmRlZmluZWQgJiYgbmV4dEhlaWdodCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzU2NhbGVkRG93biA9IG5leHRXaWR0aCA8IHNlbGYuY3VycmVudC53aWR0aCAmJiBuZXh0SGVpZ2h0IDwgc2VsZi5jdXJyZW50LmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlzU2NhbGVkRG93biA9IHNlbGYuaXNTY2FsZWREb3duKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBpc1NjYWxlZERvd24gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIGltYWdlIGlzIHNjYWxlZCBkb3duLCB0aGVuLCBvYnZpb3VzbHksIGl0IGNhbiBiZSB6b29tZWQgdG8gZnVsbCBzaXplXHJcbiAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnZmFuY3lib3gtY2FuLXpvb21JbicpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc2VsZi5jdXJyZW50Lm9wdHMudG91Y2ggKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbWFnZSBzaXplIGlyIGxhcmdlbiB0aGFuIGF2YWlsYWJsZSBhdmFpbGFibGUgYW5kIHRvdWNoIG1vZHVsZSBpcyBub3QgZGlzYWJsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiB1c2VyIGNhbiBkbyBwYW5uaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoJ2ZhbmN5Ym94LWNhbi1kcmFnJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoJ2ZhbmN5Ym94LWNhbi16b29tT3V0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIHNlbGYuY3VycmVudC5vcHRzLnRvdWNoICkge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnZmFuY3lib3gtY2FuLWRyYWcnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgY3VycmVudCBzbGlkZSBpcyB6b29tYWJsZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgaXNab29tYWJsZSA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIHZhciBmaXRQb3M7XHJcblxyXG4gICAgICAgICAgICBpZiAoICFjdXJyZW50IHx8IHNlbGYuaXNDbG9zaW5nICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBc3N1bWUgdGhhdCBzbGlkZSBpcyB6b29tYWJsZSBpZlxyXG4gICAgICAgICAgICAvLyAgIC0gaW1hZ2UgaXMgbG9hZGVkIHN1Y2Nlc3NmdWx5XHJcbiAgICAgICAgICAgIC8vICAgLSBjbGljayBhY3Rpb24gaXMgXCJ6b29tXCJcclxuICAgICAgICAgICAgLy8gICAtIGFjdHVhbCBzaXplIG9mIHRoZSBpbWFnZSBpcyBzbWFsbGVyIHRoYW4gYXZhaWxhYmxlIGFyZWFcclxuICAgICAgICAgICAgaWYgKCBjdXJyZW50LnR5cGUgPT09ICdpbWFnZScgJiYgY3VycmVudC5pc0xvYWRlZCAmJiAhY3VycmVudC5oYXNFcnJvciAmJlxyXG4gICAgICAgICAgICAgICAgKCBjdXJyZW50Lm9wdHMuY2xpY2tDb250ZW50ID09PSAnem9vbScgfHwgKCAkLmlzRnVuY3Rpb24oIGN1cnJlbnQub3B0cy5jbGlja0NvbnRlbnQgKSAmJiBjdXJyZW50Lm9wdHMuY2xpY2tDb250ZW50KCBjdXJyZW50ICkgPT09ICBcInpvb21cIiApIClcclxuICAgICAgICAgICAgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZml0UG9zID0gc2VsZi5nZXRGaXRQb3MoIGN1cnJlbnQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGN1cnJlbnQud2lkdGggPiBmaXRQb3Mud2lkdGggfHwgY3VycmVudC5oZWlnaHQgPiBmaXRQb3MuaGVpZ2h0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgY3VycmVudCBpbWFnZSBkaW1lbnNpb25zIGFyZSBzbWFsbGVyIHRoYW4gYWN0dWFsXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGlzU2NhbGVkRG93biA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIHZhciAkd2hhdCAgID0gY3VycmVudC4kY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXogPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggJHdoYXQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXogPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZSggJHdoYXQgKTtcclxuICAgICAgICAgICAgICAgIHJleiA9IHJlei53aWR0aCA8IGN1cnJlbnQud2lkdGggfHwgcmV6LmhlaWdodCA8IGN1cnJlbnQuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV6O1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgaW1hZ2UgZGltZW5zaW9ucyBleGNlZWQgcGFyZW50IGVsZW1lbnRcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBjYW5QYW4gOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gc2VsZi5jdXJyZW50O1xyXG4gICAgICAgICAgICB2YXIgJHdoYXQgICA9IGN1cnJlbnQuJGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmV6ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoICR3aGF0ICkge1xyXG4gICAgICAgICAgICAgICAgcmV6ID0gc2VsZi5nZXRGaXRQb3MoIGN1cnJlbnQgKTtcclxuICAgICAgICAgICAgICAgIHJleiA9IE1hdGguYWJzKCAkd2hhdC53aWR0aCgpIC0gcmV6LndpZHRoICkgPiAxICB8fCBNYXRoLmFicyggJHdoYXQuaGVpZ2h0KCkgLSByZXouaGVpZ2h0ICkgPiAxO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlejtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIExvYWQgY29udGVudCBpbnRvIHRoZSBzbGlkZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBsb2FkU2xpZGUgOiBmdW5jdGlvbiggc2xpZGUgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIHR5cGUsICRzbGlkZTtcclxuICAgICAgICAgICAgdmFyIGFqYXhMb2FkO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzbGlkZS5pc0xvYWRpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggc2xpZGUuaXNMb2FkZWQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNsaWRlLmlzTG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoICdiZWZvcmVMb2FkJywgc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgIHR5cGUgICA9IHNsaWRlLnR5cGU7XHJcbiAgICAgICAgICAgICRzbGlkZSA9IHNsaWRlLiRzbGlkZTtcclxuXHJcbiAgICAgICAgICAgICRzbGlkZVxyXG4gICAgICAgICAgICAgICAgLm9mZiggJ3JlZnJlc2gnIClcclxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCAnb25SZXNldCcgKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnZmFuY3lib3gtc2xpZGUtLScgKyAoIHR5cGUgfHwgJ3Vua25vd24nICkgKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCBzbGlkZS5vcHRzLnNsaWRlQ2xhc3MgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBjb250ZW50IGRlcGVuZGluZyBvbiB0aGUgdHlwZVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoICggdHlwZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdpbWFnZSc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0SW1hZ2UoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnaWZyYW1lJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRJZnJhbWUoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnaHRtbCc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0Q29udGVudCggc2xpZGUsIHNsaWRlLnNyYyB8fCBzbGlkZS5jb250ZW50ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnaW5saW5lJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAkKCBzbGlkZS5zcmMgKS5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0Q29udGVudCggc2xpZGUsICQoIHNsaWRlLnNyYyApICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0RXJyb3IoIHNsaWRlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FqYXgnOlxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNob3dMb2FkaW5nKCBzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhamF4TG9hZCA9ICQuYWpheCggJC5leHRlbmQoIHt9LCBzbGlkZS5vcHRzLmFqYXguc2V0dGluZ3MsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsIDogc2xpZGUuc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24gKCBkYXRhLCB0ZXh0U3RhdHVzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0Q29udGVudCggc2xpZGUsIGRhdGEgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yIDogZnVuY3Rpb24gKCBqcVhIUiwgdGV4dFN0YXR1cyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGpxWEhSICYmIHRleHRTdGF0dXMgIT09ICdhYm9ydCcgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRFcnJvciggc2xpZGUgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZS5vbmUoICdvblJlc2V0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhamF4TG9hZC5hYm9ydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0RXJyb3IoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIFVzZSB0aHVtYm5haWwgaW1hZ2UsIGlmIHBvc3NpYmxlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgc2V0SW1hZ2UgOiBmdW5jdGlvbiggc2xpZGUgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsZiAgID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHNyY3NldCA9IHNsaWRlLm9wdHMuaW1hZ2Uuc3Jjc2V0O1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvdW5kLCB0ZW1wLCBweFJhdGlvLCB3aW5kb3dXaWR0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgXCJzcmNzZXRcIiwgdGhlbiB3ZSBuZWVkIHRvIGZpbmQgbWF0Y2hpbmcgXCJzcmNcIiB2YWx1ZS5cclxuICAgICAgICAgICAgLy8gVGhpcyBpcyBuZWNlc3NhcnksIGJlY2F1c2Ugd2hlbiB5b3Ugc2V0IGFuIHNyYyBhdHRyaWJ1dGUsIHRoZSBicm93c2VyIHdpbGwgcHJlbG9hZCB0aGUgaW1hZ2VcclxuICAgICAgICAgICAgLy8gYmVmb3JlIGFueSBqYXZhc2NyaXB0IG9yIGV2ZW4gQ1NTIGlzIGFwcGxpZWQuXHJcbiAgICAgICAgICAgIGlmICggc3Jjc2V0ICkge1xyXG4gICAgICAgICAgICAgICAgcHhSYXRpbyAgICAgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xyXG4gICAgICAgICAgICAgICAgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAgKiBweFJhdGlvO1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXAgPSBzcmNzZXQuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKCBlbCApIHtcclxuICAgICAgICAgICAgXHRcdHZhciByZXQgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIFx0XHRlbC50cmltKCkuc3BsaXQoL1xccysvKS5mb3JFYWNoKGZ1bmN0aW9uICggZWwsIGkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlSW50KCBlbC5zdWJzdHJpbmcoMCwgZWwubGVuZ3RoIC0gMSksIDEwICk7XHJcblxyXG4gICAgICAgICAgICBcdFx0XHRpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgIFx0XHRcdFx0cmV0dXJuICggcmV0LnVybCA9IGVsICk7XHJcbiAgICAgICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQudmFsdWUgICA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnBvc3RmaXggPSBlbFsgZWwubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBcdFx0fSk7XHJcblxyXG4gICAgICAgICAgICBcdFx0cmV0dXJuIHJldDtcclxuICAgICAgICAgICAgXHR9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTb3J0IGJ5IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB0ZW1wLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgLSBiLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gT2ssIG5vdyB3ZSBoYXZlIGFuIGFycmF5IG9mIGFsbCBzcmNzZXQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCB0ZW1wLmxlbmd0aDsgaisrICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHRlbXBbIGogXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAoIGVsLnBvc3RmaXggPT09ICd3JyAmJiBlbC52YWx1ZSA+PSB3aW5kb3dXaWR0aCApIHx8ICggZWwucG9zdGZpeCA9PT0gJ3gnICYmIGVsLnZhbHVlID49IHB4UmF0aW8gKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIG5vdCBmb3VuZCwgdGFrZSB0aGUgbGFzdCBvbmVcclxuICAgICAgICAgICAgICAgIGlmICggIWZvdW5kICYmIHRlbXAubGVuZ3RoICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdGVtcFsgdGVtcC5sZW5ndGggLSAxIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBmb3VuZCApIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZS5zcmMgPSBmb3VuZC51cmw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgZGVmYXVsdCB3aWR0aC9oZWlnaHQgdmFsdWVzLCB3ZSBjYW4gY2FsY3VsYXRlIGhlaWdodCBmb3IgbWF0Y2hpbmcgc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzbGlkZS53aWR0aCAmJiBzbGlkZS5oZWlnaHQgJiYgZm91bmQucG9zdGZpeCA9PSAndycgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmhlaWdodCA9ICggc2xpZGUud2lkdGggLyBzbGlkZS5oZWlnaHQgKSAqIGZvdW5kLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS53aWR0aCAgPSBmb3VuZC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgd2lsbCBiZSB3cmFwcGVyIGNvbnRhaW5pbmcgYm90aCBnaG9zdCBhbmQgYWN0dWFsIGltYWdlXHJcbiAgICAgICAgICAgIHNsaWRlLiRjb250ZW50ID0gJCgnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWltYWdlLXdyYXBcIj48L2Rpdj4nKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnZmFuY3lib3gtaXMtaGlkZGVuJyApXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oIHNsaWRlLiRzbGlkZSApO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSB0aHVtYm5haWwsIHdlIGNhbiBkaXNwbGF5IGl0IHdoaWxlIGFjdHVhbCBpbWFnZSBpcyBsb2FkaW5nXHJcbiAgICAgICAgICAgIC8vIFVzZXJzIHdpbGwgbm90IHN0YXJlIGF0IGJsYWNrIHNjcmVlbiBhbmQgYWN0dWFsIGltYWdlIHdpbGwgYXBwZWFyIGdyYWR1YWxseVxyXG4gICAgICAgICAgICBpZiAoIHNsaWRlLm9wdHMucHJlbG9hZCAhPT0gZmFsc2UgJiYgc2xpZGUub3B0cy53aWR0aCAmJiBzbGlkZS5vcHRzLmhlaWdodCAmJiAoIHNsaWRlLm9wdHMudGh1bWIgfHwgc2xpZGUub3B0cy4kdGh1bWIgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzbGlkZS53aWR0aCAgPSBzbGlkZS5vcHRzLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgc2xpZGUuaGVpZ2h0ID0gc2xpZGUub3B0cy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgc2xpZGUuJGdob3N0ID0gJCgnPGltZyAvPicpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uZSgnZXJyb3InLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS4kZ2hvc3QgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRCaWdJbWFnZSggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAub25lKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFmdGVyTG9hZCggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0QmlnSW1hZ2UoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnZmFuY3lib3gtaW1hZ2UnIClcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oIHNsaWRlLiRjb250ZW50IClcclxuICAgICAgICAgICAgICAgICAgICAuYXR0ciggJ3NyYycsIHNsaWRlLm9wdHMudGh1bWIgfHwgc2xpZGUub3B0cy4kdGh1bWIuYXR0ciggJ3NyYycgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldEJpZ0ltYWdlKCBzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGZ1bGwtc2l6ZSBpbWFnZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgc2V0QmlnSW1hZ2UgOiBmdW5jdGlvbiAoIHNsaWRlICkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciAkaW1nID0gJCgnPGltZyAvPicpO1xyXG5cclxuICAgICAgICAgICAgc2xpZGUuJGltYWdlID0gJGltZ1xyXG4gICAgICAgICAgICAgICAgLm9uZSgnZXJyb3InLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRFcnJvciggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uZSgnbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciB0aW1lb3V0IHRoYXQgY2hlY2tzIGlmIGxvYWRpbmcgaWNvbiBuZWVkcyB0byBiZSBkaXNwbGF5ZWRcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoIHNsaWRlLnRpbW91dHMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUudGltb3V0cyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc2VsZi5pc0Nsb3NpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLndpZHRoICA9IHRoaXMubmF0dXJhbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzbGlkZS5vcHRzLmltYWdlLnNyY3NldCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGltZy5hdHRyKCAnc2l6ZXMnLCAnMTAwdncnICkuYXR0ciggJ3NyY3NldCcsIHNsaWRlLm9wdHMuaW1hZ2Uuc3Jjc2V0ICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVMb2FkaW5nKCBzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHNsaWRlLiRnaG9zdCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLnRpbW91dHMgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUudGltb3V0cyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuJGdob3N0LmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIE1hdGgubWluKCAzMDAsIE1hdGgubWF4KCAxMDAwLCBzbGlkZS5oZWlnaHQgLyAxNjAwICkgKSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFmdGVyTG9hZCggc2xpZGUgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ2ZhbmN5Ym94LWltYWdlJyApXHJcbiAgICAgICAgICAgICAgICAuYXR0cignc3JjJywgc2xpZGUuc3JjKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCBzbGlkZS4kY29udGVudCApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkaW1nWzBdLmNvbXBsZXRlICkge1xyXG4gICAgICAgICAgICAgICAgICAkaW1nLnRyaWdnZXIoICdsb2FkJyApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIGlmKCAkaW1nWzBdLmVycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICRpbWcudHJpZ2dlciggJ2Vycm9yJyApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzbGlkZS50aW1vdXRzID0gc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoICEkaW1nWzBdLmNvbXBsZXRlICYmICFzbGlkZS5oYXNFcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93TG9hZGluZyggc2xpZGUgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBpZnJhbWUgd3JhcHBlciwgaWZyYW1lIGFuZCBiaW5kaW5nc1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBzZXRJZnJhbWUgOiBmdW5jdGlvbiggc2xpZGUgKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmXHQ9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBvcHRzICAgID0gc2xpZGUub3B0cy5pZnJhbWUsXHJcbiAgICAgICAgICAgICAgICAkc2xpZGVcdD0gc2xpZGUuJHNsaWRlLFxyXG4gICAgICAgICAgICAgICAgJGlmcmFtZTtcclxuXHJcbiAgICAgICAgICAgIHNsaWRlLiRjb250ZW50ID0gJCgnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWNvbnRlbnQnICsgKCBvcHRzLnByZWxvYWQgPyAnIGZhbmN5Ym94LWlzLWhpZGRlbicgOiAnJyApICsgJ1wiPjwvZGl2PicpXHJcbiAgICAgICAgICAgICAgICAuY3NzKCBvcHRzLmNzcyApXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oICRzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgJGlmcmFtZSA9ICQoIG9wdHMudHBsLnJlcGxhY2UoL1xce3JuZFxcfS9nLCBuZXcgRGF0ZSgpLmdldFRpbWUoKSkgKVxyXG4gICAgICAgICAgICAgICAgLmF0dHIoIG9wdHMuYXR0ciApXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oIHNsaWRlLiRjb250ZW50ICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIG9wdHMucHJlbG9hZCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnNob3dMb2FkaW5nKCBzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVuZm9ydHVuYXRlbHksIGl0IGlzIG5vdCBhbHdheXMgcG9zc2libGUgdG8gZGV0ZXJtaW5lIGlmIGlmcmFtZSBpcyBzdWNjZXNzZnVsbHkgbG9hZGVkXHJcbiAgICAgICAgICAgICAgICAvLyAoZHVlIHRvIGJyb3dzZXIgc2VjdXJpdHkgcG9saWN5KVxyXG5cclxuICAgICAgICAgICAgICAgICRpZnJhbWUub24oJ2xvYWQuZmIgZXJyb3IuZmInLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1JlYWR5ID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuJHNsaWRlLnRyaWdnZXIoICdyZWZyZXNoJyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmFmdGVyTG9hZCggc2xpZGUgKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlY2FsY3VsYXRlIGlmcmFtZSBjb250ZW50IHNpemVcclxuICAgICAgICAgICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgICAgICAgICAkc2xpZGUub24oJ3JlZnJlc2guZmInLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHdyYXAgPSBzbGlkZS4kY29udGVudCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRlbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYm9keSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lSGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoICRpZnJhbWVbMF0uaXNSZWFkeSAhPT0gMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY29udGVudCBpcyBhY2Nlc3NpYmxlLFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGl0IHdpbGwgZmFpbCBpZiBmcmFtZSBpcyBub3Qgd2l0aCB0aGUgc2FtZSBvcmlnaW5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRlbnRzID0gJGlmcmFtZS5jb250ZW50cygpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYm9keSAgICAgPSAkY29udGVudHMuZmluZCgnYm9keScpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENhbGN1bGF0ZSBkaW1lbnNpb25zIGZvciB0aGUgd3JhcHBlclxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggJGJvZHkgJiYgJGJvZHkubGVuZ3RoICYmICEoIG9wdHMuY3NzLndpZHRoICE9PSB1bmRlZmluZWQgJiYgb3B0cy5jc3MuaGVpZ2h0ICE9PSB1bmRlZmluZWQgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFdpZHRoID0gJGlmcmFtZVswXS5jb250ZW50V2luZG93LmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxXaWR0aDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lV2lkdGhcdD0gTWF0aC5jZWlsKCAkYm9keS5vdXRlcldpZHRoKHRydWUpICsgKCAkd3JhcC53aWR0aCgpIC0gc2Nyb2xsV2lkdGggKSApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmcmFtZUhlaWdodFx0PSBNYXRoLmNlaWwoICRib2R5Lm91dGVySGVpZ2h0KHRydWUpICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBSZXNpemUgd3JhcHBlciB0byBmaXQgaWZyYW1lIGNvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHdyYXAuY3NzKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICd3aWR0aCcgIDogb3B0cy5jc3Mud2lkdGggID09PSB1bmRlZmluZWQgPyBmcmFtZVdpZHRoICArICggJHdyYXAub3V0ZXJXaWR0aCgpICAtICR3cmFwLmlubmVyV2lkdGgoKSApICA6IG9wdHMuY3NzLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2hlaWdodCcgOiBvcHRzLmNzcy5oZWlnaHQgPT09IHVuZGVmaW5lZCA/IGZyYW1lSGVpZ2h0ICsgKCAkd3JhcC5vdXRlckhlaWdodCgpIC0gJHdyYXAuaW5uZXJIZWlnaHQoKSApIDogb3B0cy5jc3MuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtaXMtaGlkZGVuJyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFmdGVyTG9hZCggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRpZnJhbWUuYXR0ciggJ3NyYycsIHNsaWRlLnNyYyApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzbGlkZS5vcHRzLnNtYWxsQnRuID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICAgICAgc2xpZGUuJGNvbnRlbnQucHJlcGVuZCggc2VsZi50cmFuc2xhdGUoIHNsaWRlLCBzbGlkZS5vcHRzLmJ0blRwbC5zbWFsbEJ0biApICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBpZnJhbWUgaWYgY2xvc2luZyBvciBjaGFuZ2luZyBnYWxsZXJ5IGl0ZW1cclxuICAgICAgICAgICAgJHNsaWRlLm9uZSggJ29uUmVzZXQnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBoZWxwcyBJRSBub3QgdG8gdGhyb3cgZXJyb3JzIHdoZW4gY2xvc2luZ1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCggdGhpcyApLmZpbmQoICdpZnJhbWUnICkuaGlkZSgpLmF0dHIoICdzcmMnLCAnLy9hYm91dDpibGFuaycgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggaWdub3JlICkge31cclxuXHJcbiAgICAgICAgICAgICAgICAkKCB0aGlzICkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzbGlkZS5pc0xvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBXcmFwIGFuZCBhcHBlbmQgY29udGVudCB0byB0aGUgc2xpZGVcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBzZXRDb250ZW50IDogZnVuY3Rpb24gKCBzbGlkZSwgY29udGVudCApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmICggc2VsZi5pc0Nsb3NpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmcoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICBzbGlkZS4kc2xpZGUuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggaXNRdWVyeSggY29udGVudCApICYmIGNvbnRlbnQucGFyZW50KCkubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIGNvbnRlbnQgaXMgYSBqUXVlcnkgb2JqZWN0LCB0aGVuIGl0IHdpbGwgYmUgbW92ZWQgdG8gdGhlIHNsaWRlLlxyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHBsYWNlaG9sZGVyIGlzIGNyZWF0ZWQgc28gd2Ugd2lsbCBrbm93IHdoZXJlIHRvIHB1dCBpdCBiYWNrLlxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdXNlciBpcyBuYXZpZ2F0aW5nIGdhbGxlcnkgZmFzdCwgdGhlbiB0aGUgY29udGVudCBtaWdodCBiZSBhbHJlYWR5IGluc2lkZSBmYW5jeUJveFxyXG4gICAgICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBjb250ZW50IGlzIG5vdCBhbHJlYWR5IG1vdmVkIHRvIGZhbmN5Qm94XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LnBhcmVudCggJy5mYW5jeWJveC1zbGlkZS0taW5saW5lJyApLnRyaWdnZXIoICdvblJlc2V0JyApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB0ZW1wb3JhcnkgZWxlbWVudCBtYXJraW5nIG9yaWdpbmFsIHBsYWNlIG9mIHRoZSBjb250ZW50XHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kcGxhY2Vob2xkZXIgPSAkKCAnPGRpdj48L2Rpdj4nICkuaGlkZSgpLmluc2VydEFmdGVyKCBjb250ZW50ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGNvbnRlbnQgaXMgdmlzaWJsZVxyXG4gICAgICAgICAgICAgICAgY29udGVudC5jc3MoJ2Rpc3BsYXknLCAnaW5saW5lLWJsb2NrJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhc2xpZGUuaGFzRXJyb3IgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgY29udGVudCBpcyBqdXN0IGEgcGxhaW4gdGV4dCwgdHJ5IHRvIGNvbnZlcnQgaXQgdG8gaHRtbFxyXG4gICAgICAgICAgICAgICAgaWYgKCAkLnR5cGUoIGNvbnRlbnQgKSA9PT0gJ3N0cmluZycgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICQoJzxkaXY+JykuYXBwZW5kKCAkLnRyaW0oIGNvbnRlbnQgKSApLmNvbnRlbnRzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgdGV4dCBub2RlLCB0aGVuIGFkZCB3cmFwcGluZyBlbGVtZW50IHRvIG1ha2UgdmVydGljYWwgYWxpZ25tZW50IHdvcmtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvbnRlbnRbMF0ubm9kZVR5cGUgPT09IDMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAkKCc8ZGl2PicpLmh0bWwoIGNvbnRlbnQgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgXCJmaWx0ZXJcIiBvcHRpb24gaXMgcHJvdmlkZWQsIHRoZW4gZmlsdGVyIGNvbnRlbnRcclxuICAgICAgICAgICAgICAgIGlmICggc2xpZGUub3B0cy5maWx0ZXIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICQoJzxkaXY+JykuaHRtbCggY29udGVudCApLmZpbmQoIHNsaWRlLm9wdHMuZmlsdGVyICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzbGlkZS4kc2xpZGUub25lKCdvblJlc2V0JywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFB1dCBjb250ZW50IGJhY2tcclxuICAgICAgICAgICAgICAgIGlmICggc2xpZGUuJHBsYWNlaG9sZGVyICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLiRwbGFjZWhvbGRlci5hZnRlciggY29udGVudC5oaWRlKCkgKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuJHBsYWNlaG9sZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgY3VzdG9tIGNsb3NlIGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgaWYgKCBzbGlkZS4kc21hbGxCdG4gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuJHNtYWxsQnRuLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzbGlkZS4kc21hbGxCdG4gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBjb250ZW50IGFuZCBtYXJrIHNsaWRlIGFzIG5vdCBsb2FkZWRcclxuICAgICAgICAgICAgICAgIGlmICggIXNsaWRlLmhhc0Vycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2xpZGUuJGNvbnRlbnQgPSAkKCBjb250ZW50ICkuYXBwZW5kVG8oIHNsaWRlLiRzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzbGlkZS5vcHRzLnNtYWxsQnRuICYmICFzbGlkZS4kc21hbGxCdG4gKSB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kc21hbGxCdG4gPSAkKCBzZWxmLnRyYW5zbGF0ZSggc2xpZGUsIHNsaWRlLm9wdHMuYnRuVHBsLnNtYWxsQnRuICkgKS5hcHBlbmRUbyggc2xpZGUuJGNvbnRlbnQuZmlsdGVyKCdkaXYnKS5maXJzdCgpICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMuYWZ0ZXJMb2FkKCBzbGlkZSApO1xyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIERpc3BsYXkgZXJyb3IgbWVzc2FnZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBzZXRFcnJvciA6IGZ1bmN0aW9uICggc2xpZGUgKSB7XHJcblxyXG4gICAgICAgICAgICBzbGlkZS5oYXNFcnJvciA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBzbGlkZS4kc2xpZGUucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1zbGlkZS0tJyArIHNsaWRlLnR5cGUgKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudCggc2xpZGUsIHRoaXMudHJhbnNsYXRlKCBzbGlkZSwgc2xpZGUub3B0cy5lcnJvclRwbCApICk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBTaG93IGxvYWRpbmcgaWNvbiBpbnNpZGUgdGhlIHNsaWRlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBzaG93TG9hZGluZyA6IGZ1bmN0aW9uKCBzbGlkZSApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHNsaWRlID0gc2xpZGUgfHwgc2VsZi5jdXJyZW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzbGlkZSAmJiAhc2xpZGUuJHNwaW5uZXIgKSB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kc3Bpbm5lciA9ICQoIHNlbGYub3B0cy5zcGlubmVyVHBsICkuYXBwZW5kVG8oIHNsaWRlLiRzbGlkZSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIFJlbW92ZSBsb2FkaW5nIGljb24gZnJvbSB0aGUgc2xpZGVcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGhpZGVMb2FkaW5nIDogZnVuY3Rpb24oIHNsaWRlICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgc2xpZGUgPSBzbGlkZSB8fCBzZWxmLmN1cnJlbnQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNsaWRlICYmIHNsaWRlLiRzcGlubmVyICkge1xyXG4gICAgICAgICAgICAgICAgc2xpZGUuJHNwaW5uZXIucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHNsaWRlLiRzcGlubmVyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBBZGp1c3RtZW50cyBhZnRlciBzbGlkZSBjb250ZW50IGhhcyBiZWVuIGxvYWRlZFxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGFmdGVyTG9hZCA6IGZ1bmN0aW9uKCBzbGlkZSApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmICggc2VsZi5pc0Nsb3NpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNsaWRlLmlzTG9hZGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICBzbGlkZS5pc0xvYWRlZCAgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCAnYWZ0ZXJMb2FkJywgc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmcoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNsaWRlLm9wdHMucHJvdGVjdCAmJiBzbGlkZS4kY29udGVudCAmJiAhc2xpZGUuaGFzRXJyb3IgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRGlzYWJsZSByaWdodCBjbGlja1xyXG4gICAgICAgICAgICAgICAgc2xpZGUuJGNvbnRlbnQub24oICdjb250ZXh0bWVudS5mYicsIGZ1bmN0aW9uKCBlICkge1xyXG4gICAgICAgICAgICAgICAgICAgICBpZiAoIGUuYnV0dG9uID09IDIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBBZGQgZmFrZSBlbGVtZW50IG9uIHRvcCBvZiB0aGUgaW1hZ2VcclxuICAgICAgICAgICAgICAgIC8vIFRoaXMgbWFrZXMgYSBiaXQgaGFyZGVyIGZvciB1c2VyIHRvIHNlbGVjdCBpbWFnZVxyXG4gICAgICAgICAgICAgICAgaWYgKCBzbGlkZS50eXBlID09PSAnaW1hZ2UnICkge1xyXG4gICAgICAgICAgICAgICAgICAgICQoICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtc3BhY2ViYWxsXCI+PC9kaXY+JyApLmFwcGVuZFRvKCBzbGlkZS4kY29udGVudCApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5yZXZlYWxDb250ZW50KCBzbGlkZSApO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gTWFrZSBjb250ZW50IHZpc2libGVcclxuICAgICAgICAvLyBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgcmlnaHQgYWZ0ZXIgY29udGVudCBoYXMgYmVlbiBsb2FkZWQgb3JcclxuICAgICAgICAvLyB1c2VyIG5hdmlnYXRlcyBnYWxsZXJ5IGFuZCB0cmFuc2l0aW9uIHNob3VsZCBzdGFydFxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICByZXZlYWxDb250ZW50IDogZnVuY3Rpb24oIHNsaWRlICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgICA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciAkc2xpZGUgPSBzbGlkZS4kc2xpZGU7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWZmZWN0LCBlZmZlY3RDbGFzc05hbWUsIGR1cmF0aW9uLCBvcGFjaXR5LCBlbmQsIHN0YXJ0ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBlZmZlY3QgICA9IHNsaWRlLm9wdHNbIHNlbGYuZmlyc3RSdW4gPyAnYW5pbWF0aW9uRWZmZWN0JyAgIDogJ3RyYW5zaXRpb25FZmZlY3QnIF07XHJcbiAgICAgICAgICAgIGR1cmF0aW9uID0gc2xpZGUub3B0c1sgc2VsZi5maXJzdFJ1biA/ICdhbmltYXRpb25EdXJhdGlvbicgOiAndHJhbnNpdGlvbkR1cmF0aW9uJyBdO1xyXG5cclxuICAgICAgICAgICAgZHVyYXRpb24gPSBwYXJzZUludCggc2xpZGUuZm9yY2VkRHVyYXRpb24gPT09IHVuZGVmaW5lZCA/IGR1cmF0aW9uIDogc2xpZGUuZm9yY2VkRHVyYXRpb24sIDEwICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNsaWRlLmlzTW92ZWQgfHwgc2xpZGUucG9zICE9PSBzZWxmLmN1cnJQb3MgfHwgIWR1cmF0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGNhbiB6b29tXHJcbiAgICAgICAgICAgIGlmICggZWZmZWN0ID09PSAnem9vbScgJiYgISggc2xpZGUucG9zID09PSBzZWxmLmN1cnJQb3MgJiYgZHVyYXRpb24gJiYgc2xpZGUudHlwZSA9PT0gJ2ltYWdlJyAmJiAhc2xpZGUuaGFzRXJyb3IgJiYgKCBzdGFydCA9IHNlbGYuZ2V0VGh1bWJQb3MoIHNsaWRlICkgKSApICkge1xyXG4gICAgICAgICAgICAgICAgZWZmZWN0ID0gJ2ZhZGUnO1xyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gWm9vbSBhbmltYXRpb25cclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgICAgIGlmICggZWZmZWN0ID09PSAnem9vbScgKSB7XHJcbiAgICAgICAgICAgICAgICBlbmQgPSBzZWxmLmdldEZpdFBvcyggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBlbmQuc2NhbGVYID0gZW5kLndpZHRoICAvIHN0YXJ0LndpZHRoO1xyXG4gICAgICAgICAgICAgICAgZW5kLnNjYWxlWSA9IGVuZC5oZWlnaHQgLyBzdGFydC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgZGVsZXRlIGVuZC53aWR0aDtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbmQuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHdlIG5lZWQgdG8gYW5pbWF0ZSBvcGFjaXR5XHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5ID0gc2xpZGUub3B0cy56b29tT3BhY2l0eTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIG9wYWNpdHkgPT0gJ2F1dG8nICkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHkgPSBNYXRoLmFicyggc2xpZGUud2lkdGggLyBzbGlkZS5oZWlnaHQgLSBzdGFydC53aWR0aCAvIHN0YXJ0LmhlaWdodCApID4gMC4xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggb3BhY2l0eSApIHtcclxuICAgICAgICAgICAgICAgICAgICBzdGFydC5vcGFjaXR5ID0gMC4xO1xyXG4gICAgICAgICAgICAgICAgICAgIGVuZC5vcGFjaXR5ICAgPSAxO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIERyYXcgaW1hZ2UgYXQgc3RhcnQgcG9zaXRpb25cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCBzbGlkZS4kY29udGVudC5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWlzLWhpZGRlbicgKSwgc3RhcnQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3JjZVJlZHJhdyggc2xpZGUuJGNvbnRlbnQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdGFydCBhbmltYXRpb25cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guYW5pbWF0ZSggc2xpZGUuJGNvbnRlbnQsIGVuZCwgZHVyYXRpb24sIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlU2xpZGUoIHNsaWRlICk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gU2ltcGx5IHNob3cgY29udGVudFxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICBpZiAoICFlZmZlY3QgKSB7XHJcbiAgICAgICAgICAgICAgICBmb3JjZVJlZHJhdyggJHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2xpZGUuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1pcy1oaWRkZW4nICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcyApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LnN0b3AoICRzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgZWZmZWN0Q2xhc3NOYW1lID0gJ2ZhbmN5Ym94LWFuaW1hdGVkIGZhbmN5Ym94LXNsaWRlLS0nICsgKCBzbGlkZS5wb3MgPiBzZWxmLnByZXZQb3MgPyAnbmV4dCcgOiAncHJldmlvdXMnICkgKyAnIGZhbmN5Ym94LWZ4LScgKyBlZmZlY3Q7XHJcblxyXG4gICAgICAgICAgICAkc2xpZGUucmVtb3ZlQXR0ciggJ3N0eWxlJyApLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtc2xpZGUtLWN1cnJlbnQgZmFuY3lib3gtc2xpZGUtLW5leHQgZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzJyApLmFkZENsYXNzKCBlZmZlY3RDbGFzc05hbWUgKTtcclxuXHJcbiAgICAgICAgICAgIHNsaWRlLiRjb250ZW50LnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtaXMtaGlkZGVuJyApO1xyXG5cclxuICAgICAgICAgICAgLy9Gb3JjZSByZWZsb3cgZm9yIENTUzMgdHJhbnNpdGlvbnNcclxuICAgICAgICAgICAgZm9yY2VSZWRyYXcoICRzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKCAkc2xpZGUsICdmYW5jeWJveC1zbGlkZS0tY3VycmVudCcsIGR1cmF0aW9uLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2xpZGUucmVtb3ZlQ2xhc3MoIGVmZmVjdENsYXNzTmFtZSApLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHNsaWRlLnBvcyA9PT0gc2VsZi5jdXJyUG9zICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY29tcGxldGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0sIHRydWUpO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgY2FuIGFuZCBoYXZlIHRvIHpvb20gZnJvbSB0aHVtYm5haWxcclxuICAgICAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBnZXRUaHVtYlBvcyA6IGZ1bmN0aW9uKCBzbGlkZSApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHJleiAgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIGVsZW1lbnQgaXMgaW5zaWRlIHRoZSB2aWV3cG9ydCBieSBhdCBsZWFzdCAxIHBpeGVsXHJcbiAgICAgICAgICAgIHZhciBpc0VsZW1lbnRWaXNpYmxlID0gZnVuY3Rpb24oICRlbCApIHtcclxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50ID0gJGVsWzBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBlbGVtZW50UmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFyZW50UmVjdHMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdmlzaWJsZUluQWxsUGFyZW50cztcclxuXHJcbiAgICAgICAgICAgICAgICB3aGlsZSAoIGVsZW1lbnQucGFyZW50RWxlbWVudCAhPT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoICQoZWxlbWVudC5wYXJlbnRFbGVtZW50KS5jc3MoJ292ZXJmbG93JykgPT09ICdoaWRkZW4nICB8fCAkKGVsZW1lbnQucGFyZW50RWxlbWVudCkuY3NzKCdvdmVyZmxvdycpID09PSAnYXV0bycgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcmVudFJlY3RzLnB1c2goZWxlbWVudC5wYXJlbnRFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmlzaWJsZUluQWxsUGFyZW50cyA9IHBhcmVudFJlY3RzLmV2ZXJ5KGZ1bmN0aW9uKHBhcmVudFJlY3Qpe1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2aXNpYmxlUGl4ZWxYID0gTWF0aC5taW4oZWxlbWVudFJlY3QucmlnaHQsIHBhcmVudFJlY3QucmlnaHQpIC0gTWF0aC5tYXgoZWxlbWVudFJlY3QubGVmdCwgcGFyZW50UmVjdC5sZWZ0KTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmlzaWJsZVBpeGVsWSA9IE1hdGgubWluKGVsZW1lbnRSZWN0LmJvdHRvbSwgcGFyZW50UmVjdC5ib3R0b20pIC0gTWF0aC5tYXgoZWxlbWVudFJlY3QudG9wLCBwYXJlbnRSZWN0LnRvcCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2aXNpYmxlUGl4ZWxYID4gMCAmJiB2aXNpYmxlUGl4ZWxZID4gMDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB2aXNpYmxlSW5BbGxQYXJlbnRzICYmXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFJlY3QuYm90dG9tID4gMCAmJiBlbGVtZW50UmVjdC5yaWdodCA+IDAgJiZcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50UmVjdC5sZWZ0IDwgJCh3aW5kb3cpLndpZHRoKCkgJiYgZWxlbWVudFJlY3QudG9wIDwgJCh3aW5kb3cpLmhlaWdodCgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgdmFyICR0aHVtYiAgID0gc2xpZGUub3B0cy4kdGh1bWI7XHJcbiAgICAgICAgICAgIHZhciB0aHVtYlBvcyA9ICR0aHVtYiA/ICR0aHVtYi5vZmZzZXQoKSA6IDA7XHJcbiAgICAgICAgICAgIHZhciBzbGlkZVBvcztcclxuXHJcbiAgICAgICAgICAgIGlmICggdGh1bWJQb3MgJiYgJHRodW1iWzBdLm93bmVyRG9jdW1lbnQgPT09IGRvY3VtZW50ICYmIGlzRWxlbWVudFZpc2libGUoICR0aHVtYiApICkge1xyXG4gICAgICAgICAgICAgICAgc2xpZGVQb3MgPSBzZWxmLiRyZWZzLnN0YWdlLm9mZnNldCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJleiA9IHtcclxuICAgICAgICAgICAgICAgICAgICB0b3AgICAgOiB0aHVtYlBvcy50b3AgIC0gc2xpZGVQb3MudG9wICArIHBhcnNlRmxvYXQoICR0aHVtYi5jc3MoIFwiYm9yZGVyLXRvcC13aWR0aFwiICkgfHwgMCApLFxyXG4gICAgICAgICAgICAgICAgICAgIGxlZnQgICA6IHRodW1iUG9zLmxlZnQgLSBzbGlkZVBvcy5sZWZ0ICsgcGFyc2VGbG9hdCggJHRodW1iLmNzcyggXCJib3JkZXItbGVmdC13aWR0aFwiICkgfHwgMCApLFxyXG4gICAgICAgICAgICAgICAgICAgIHdpZHRoICA6ICR0aHVtYi53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlaWdodCA6ICR0aHVtYi5oZWlnaHQoKSxcclxuICAgICAgICAgICAgICAgICAgICBzY2FsZVggOiAxLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlWSA6IDFcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXo7XHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIEZpbmFsIGFkanVzdG1lbnRzIGFmdGVyIGN1cnJlbnQgZ2FsbGVyeSBpdGVtIGlzIG1vdmVkIHRvIHBvc2l0aW9uXHJcbiAgICAgICAgLy8gYW5kIGl0YHMgY29udGVudCBpcyBsb2FkZWRcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgY29tcGxldGUgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gc2VsZi5jdXJyZW50O1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVzICA9IHt9O1xyXG5cclxuICAgICAgICAgICAgaWYgKCBjdXJyZW50LmlzTW92ZWQgfHwgIWN1cnJlbnQuaXNMb2FkZWQgfHwgY3VycmVudC5pc0NvbXBsZXRlICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50LmlzQ29tcGxldGUgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgY3VycmVudC4kc2xpZGUuc2libGluZ3MoKS50cmlnZ2VyKCAnb25SZXNldCcgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgYW55IENTUzMgdHJhbnNpdG9uIGluc2lkZSB0aGUgc2xpZGVcclxuICAgICAgICAgICAgZm9yY2VSZWRyYXcoIGN1cnJlbnQuJHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICBjdXJyZW50LiRzbGlkZS5hZGRDbGFzcyggJ2ZhbmN5Ym94LXNsaWRlLS1jb21wbGV0ZScgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSB1bm5lY2Vzc2FyeSBzbGlkZXNcclxuICAgICAgICAgICAgJC5lYWNoKCBzZWxmLnNsaWRlcywgZnVuY3Rpb24oIGtleSwgc2xpZGUgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIHNsaWRlLnBvcyA+PSBzZWxmLmN1cnJQb3MgLSAxICYmIHNsaWRlLnBvcyA8PSBzZWxmLmN1cnJQb3MgKyAxICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1sgc2xpZGUucG9zIF0gPSBzbGlkZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzbGlkZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJC5mYW5jeWJveC5zdG9wKCBzbGlkZS4kc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuJHNsaWRlLnVuYmluZCgpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuc2xpZGVzID0gc2xpZGVzO1xyXG5cclxuICAgICAgICAgICAgc2VsZi51cGRhdGVDdXJzb3IoKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlciggJ2FmdGVyU2hvdycgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRyeSB0byBmb2N1cyBvbiB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnRcclxuICAgICAgICAgICAgaWYgKCAkKCBkb2N1bWVudC5hY3RpdmVFbGVtZW50ICkuaXMoICdbZGlzYWJsZWRdJyApIHx8ICggY3VycmVudC5vcHRzLmF1dG9Gb2N1cyAmJiAhKCBjdXJyZW50LnR5cGUgPT0gJ2ltYWdlJyB8fCBjdXJyZW50LnR5cGUgPT09ICdpZnJhbWUnICkgKSApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuZm9jdXMoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gUHJlbG9hZCBuZXh0IGFuZCBwcmV2aW91cyBzbGlkZXNcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBwcmVsb2FkIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIG5leHQsIHByZXY7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNlbGYuZ3JvdXAubGVuZ3RoIDwgMiApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmV4dCAgPSBzZWxmLnNsaWRlc1sgc2VsZi5jdXJyUG9zICsgMSBdO1xyXG4gICAgICAgICAgICBwcmV2ICA9IHNlbGYuc2xpZGVzWyBzZWxmLmN1cnJQb3MgLSAxIF07XHJcblxyXG4gICAgICAgICAgICBpZiAoIG5leHQgJiYgbmV4dC50eXBlID09PSAnaW1hZ2UnICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5sb2FkU2xpZGUoIG5leHQgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBwcmV2ICYmIHByZXYudHlwZSA9PT0gJ2ltYWdlJyApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubG9hZFNsaWRlKCBwcmV2ICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIFRyeSB0byBmaW5kIGFuZCBmb2N1cyBvbiB0aGUgZmlyc3QgZm9jdXNhYmxlIGVsZW1lbnRcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGZvY3VzIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50O1xyXG4gICAgICAgICAgICB2YXIgJGVsO1xyXG5cclxuICAgICAgICAgICAgaWYgKCB0aGlzLmlzQ2xvc2luZyApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU2tpcCBmb3IgaW1hZ2VzIGFuZCBpZnJhbWVzXHJcbiAgICAgICAgICAgICRlbCA9IGN1cnJlbnQgJiYgY3VycmVudC5pc0NvbXBsZXRlID8gY3VycmVudC4kc2xpZGUuZmluZCgnYnV0dG9uLDppbnB1dCxbdGFiaW5kZXhdLGEnKS5maWx0ZXIoJzpub3QoW2Rpc2FibGVkXSk6dmlzaWJsZTpmaXJzdCcpIDogbnVsbDtcclxuICAgICAgICAgICAgJGVsID0gJGVsICYmICRlbC5sZW5ndGggPyAkZWwgOiB0aGlzLiRyZWZzLmNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgICRlbC5mb2N1cygpO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBBY3RpdmF0ZXMgY3VycmVudCBpbnN0YW5jZSAtIGJyaW5ncyBjb250YWluZXIgdG8gdGhlIGZyb250IGFuZCBlbmFibGVzIGtleWJvYXJkLFxyXG4gICAgICAgIC8vIG5vdGlmaWVzIG90aGVyIGluc3RhbmNlcyBhYm91dCBkZWFjdGl2YXRpbmdcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgYWN0aXZhdGUgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIERlYWN0aXZhdGUgYWxsIGluc3RhbmNlc1xyXG4gICAgICAgICAgICAkKCAnLmZhbmN5Ym94LWNvbnRhaW5lcicgKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9ICQodGhpcykuZGF0YSggJ0ZhbmN5Qm94JyApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNraXAgc2VsZiBhbmQgY2xvc2luZyBpbnN0YW5jZXNcclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS51aWQgIT09IHNlbGYudWlkICYmICFpbnN0YW5jZS5pc0Nsb3NpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS50cmlnZ2VyKCAnb25EZWFjdGl2YXRlJyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNlbGYuY3VycmVudCApIHtcclxuICAgICAgICAgICAgICAgIGlmICggc2VsZi4kcmVmcy5jb250YWluZXIuaW5kZXgoKSA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIucHJlcGVuZFRvKCBkb2N1bWVudC5ib2R5ICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDb250cm9scygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoICdvbkFjdGl2YXRlJyApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5hZGRFdmVudHMoKTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIFN0YXJ0IGNsb3NpbmcgcHJvY2VkdXJlXHJcbiAgICAgICAgLy8gVGhpcyB3aWxsIHN0YXJ0IFwiem9vbS1vdXRcIiBhbmltYXRpb24gaWYgbmVlZGVkIGFuZCBjbGVhbiBldmVyeXRoaW5nIHVwIGFmdGVyd2FyZHNcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgY2xvc2UgOiBmdW5jdGlvbiggZSwgZCApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmICAgID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgZWZmZWN0LCBkdXJhdGlvbjtcclxuICAgICAgICAgICAgdmFyICR3aGF0LCBvcGFjaXR5LCBzdGFydCwgZW5kO1xyXG5cclxuICAgICAgICAgICAgdmFyIGRvbmUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuY2xlYW5VcCggZSApO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzZWxmLmlzQ2xvc2luZyApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5pc0Nsb3NpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgYmVmb3JlQ2xvc2UgY2FsbGJhY2sgcHJldmVudHMgY2xvc2luZywgbWFrZSBzdXJlIGNvbnRlbnQgaXMgY2VudGVyZWRcclxuICAgICAgICAgICAgaWYgKCBzZWxmLnRyaWdnZXIoICdiZWZvcmVDbG9zZScsIGUgKSA9PT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmlzQ2xvc2luZyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIHJlcXVlc3RBRnJhbWUoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBldmVudHNcclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgYXJlIG11bHRpcGxlIGluc3RhbmNlcywgdGhleSB3aWxsIGJlIHNldCBhZ2FpbiBieSBcImFjdGl2YXRlXCIgbWV0aG9kXHJcbiAgICAgICAgICAgIHNlbGYucmVtb3ZlRXZlbnRzKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGN1cnJlbnQudGltb3V0cyApIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCggY3VycmVudC50aW1vdXRzICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICR3aGF0ICAgID0gY3VycmVudC4kY29udGVudDtcclxuICAgICAgICAgICAgZWZmZWN0ICAgPSBjdXJyZW50Lm9wdHMuYW5pbWF0aW9uRWZmZWN0O1xyXG4gICAgICAgICAgICBkdXJhdGlvbiA9ICQuaXNOdW1lcmljKCBkICkgPyBkIDogKCBlZmZlY3QgPyBjdXJyZW50Lm9wdHMuYW5pbWF0aW9uRHVyYXRpb24gOiAwICk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgb3RoZXIgc2xpZGVzXHJcbiAgICAgICAgICAgIGN1cnJlbnQuJHNsaWRlLm9mZiggdHJhbnNpdGlvbkVuZCApLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtc2xpZGUtLWNvbXBsZXRlIGZhbmN5Ym94LXNsaWRlLS1uZXh0IGZhbmN5Ym94LXNsaWRlLS1wcmV2aW91cyBmYW5jeWJveC1hbmltYXRlZCcgKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnQuJHNsaWRlLnNpYmxpbmdzKCkudHJpZ2dlciggJ29uUmVzZXQnICkucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBUcmlnZ2VyIGFuaW1hdGlvbnNcclxuICAgICAgICAgICAgaWYgKCBkdXJhdGlvbiApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtaXMtb3BlbicgKS5hZGRDbGFzcyggJ2ZhbmN5Ym94LWlzLWNsb3NpbmcnICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIENsZWFuIHVwXHJcbiAgICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmcoIGN1cnJlbnQgKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuaGlkZUNvbnRyb2xzKCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnVwZGF0ZUN1cnNvcigpO1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgcG9zc2libGUgdG8gem9vbS1vdXRcclxuICAgICAgICAgICAgaWYgKCBlZmZlY3QgPT09ICd6b29tJyAmJiAhKCBlICE9PSB0cnVlICYmICR3aGF0ICYmIGR1cmF0aW9uICYmIGN1cnJlbnQudHlwZSA9PT0gJ2ltYWdlJyAmJiAhY3VycmVudC5oYXNFcnJvciAmJiAoIGVuZCA9IHNlbGYuZ2V0VGh1bWJQb3MoIGN1cnJlbnQgKSApICkgKSB7XHJcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggZWZmZWN0ID09PSAnem9vbScgKSB7XHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LnN0b3AoICR3aGF0ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZSggJHdoYXQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGFydC53aWR0aCAgPSBzdGFydC53aWR0aCAgKiBzdGFydC5zY2FsZVg7XHJcbiAgICAgICAgICAgICAgICBzdGFydC5oZWlnaHQgPSBzdGFydC5oZWlnaHQgKiBzdGFydC5zY2FsZVk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgd2UgbmVlZCB0byBhbmltYXRlIG9wYWNpdHlcclxuICAgICAgICAgICAgICAgIG9wYWNpdHkgPSBjdXJyZW50Lm9wdHMuem9vbU9wYWNpdHk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBvcGFjaXR5ID09ICdhdXRvJyApIHtcclxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5ID0gTWF0aC5hYnMoIGN1cnJlbnQud2lkdGggLyBjdXJyZW50LmhlaWdodCAtIGVuZC53aWR0aCAvIGVuZC5oZWlnaHQgKSA+IDAuMTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIG9wYWNpdHkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW5kLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHN0YXJ0LnNjYWxlWCA9IHN0YXJ0LndpZHRoICAvIGVuZC53aWR0aDtcclxuICAgICAgICAgICAgICAgIHN0YXJ0LnNjYWxlWSA9IHN0YXJ0LmhlaWdodCAvIGVuZC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhcnQud2lkdGggID0gZW5kLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgc3RhcnQuaGVpZ2h0ID0gZW5kLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZSggY3VycmVudC4kY29udGVudCwgc3RhcnQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoIGN1cnJlbnQuJGNvbnRlbnQsIGVuZCwgZHVyYXRpb24sIGRvbmUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBlZmZlY3QgJiYgZHVyYXRpb24gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgc2tpcCBhbmltYXRpb25cclxuICAgICAgICAgICAgICAgIGlmICggZSA9PT0gdHJ1ZSApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCBkb25lLCBkdXJhdGlvbiApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKCBjdXJyZW50LiRzbGlkZS5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LXNsaWRlLS1jdXJyZW50JyApLCAnZmFuY3lib3gtYW5pbWF0ZWQgZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzIGZhbmN5Ym94LWZ4LScgKyBlZmZlY3QsIGR1cmF0aW9uLCBkb25lICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZG9uZSgpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gRmluYWwgYWRqdXN0bWVudHMgYWZ0ZXIgcmVtb3ZpbmcgdGhlIGluc3RhbmNlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGNsZWFuVXAgOiBmdW5jdGlvbiggZSApIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmN1cnJlbnQuJHNsaWRlLnRyaWdnZXIoICdvblJlc2V0JyApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIuZW1wdHkoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlciggJ2FmdGVyQ2xvc2UnLCBlICk7XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjZSBiYWNrIGZvY3VzXHJcbiAgICAgICAgICAgIGlmICggc2VsZi4kbGFzdEZvY3VzICYmICEhc2VsZi5jdXJyZW50Lm9wdHMuYmFja0ZvY3VzICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi4kbGFzdEZvY3VzLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuY3VycmVudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgb3RoZXIgaW5zdGFuY2VzXHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBpbnN0YW5jZSApIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICRXLnNjcm9sbFRvcCggc2VsZi5zY3JvbGxUb3AgKS5zY3JvbGxMZWZ0KCBzZWxmLnNjcm9sbExlZnQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCAnaHRtbCcgKS5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWVuYWJsZWQnICk7XHJcblxyXG4gICAgICAgICAgICAgICAgJCggJyNmYW5jeWJveC1zdHlsZS1ub3Njcm9sbCcgKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2FsbCBjYWxsYmFjayBhbmQgdHJpZ2dlciBhbiBldmVudFxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgdHJpZ2dlciA6IGZ1bmN0aW9uKCBuYW1lLCBzbGlkZSApIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcclxuICAgICAgICAgICAgICAgIHNlbGYgID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIG9iaiAgID0gc2xpZGUgJiYgc2xpZGUub3B0cyA/IHNsaWRlIDogc2VsZi5jdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgcmV6O1xyXG5cclxuICAgICAgICAgICAgaWYgKCBvYmogKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoIG9iaiApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHNlbGY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFyZ3MudW5zaGlmdCggc2VsZiApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkLmlzRnVuY3Rpb24oIG9iai5vcHRzWyBuYW1lIF0gKSApIHtcclxuICAgICAgICAgICAgICAgIHJleiA9IG9iai5vcHRzWyBuYW1lIF0uYXBwbHkoIG9iaiwgYXJncyApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHJleiA9PT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV6O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIG5hbWUgPT09ICdhZnRlckNsb3NlJyApIHtcclxuICAgICAgICAgICAgICAgICRELnRyaWdnZXIoIG5hbWUgKyAnLmZiJywgYXJncyApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyLnRyaWdnZXIoIG5hbWUgKyAnLmZiJywgYXJncyApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBVcGRhdGUgaW5mb2JhciB2YWx1ZXMsIG5hdmlnYXRpb24gYnV0dG9uIHN0YXRlcyBhbmQgcmV2ZWFsIGNhcHRpb25cclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgdXBkYXRlQ29udHJvbHMgOiBmdW5jdGlvbiAoIGZvcmNlICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgID0gc2VsZi5jdXJyZW50O1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggICAgPSBjdXJyZW50LmluZGV4O1xyXG4gICAgICAgICAgICB2YXIgb3B0cyAgICAgPSBjdXJyZW50Lm9wdHM7XHJcbiAgICAgICAgICAgIHZhciBjYXB0aW9uICA9IG9wdHMuY2FwdGlvbjtcclxuICAgICAgICAgICAgdmFyICRjYXB0aW9uID0gc2VsZi4kcmVmcy5jYXB0aW9uO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgY29udGVudCBkaW1lbnNpb25zXHJcbiAgICAgICAgICAgIGN1cnJlbnQuJHNsaWRlLnRyaWdnZXIoICdyZWZyZXNoJyApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi4kY2FwdGlvbiA9IGNhcHRpb24gJiYgY2FwdGlvbi5sZW5ndGggPyAkY2FwdGlvbi5odG1sKCBjYXB0aW9uICkgOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAhc2VsZi5pc0hpZGRlbkNvbnRyb2xzICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93Q29udHJvbHMoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gVXBkYXRlIGluZm8gYW5kIG5hdmlnYXRpb24gZWxlbWVudHNcclxuICAgICAgICAgICAgJCgnW2RhdGEtZmFuY3lib3gtY291bnRdJykuaHRtbCggc2VsZi5ncm91cC5sZW5ndGggKTtcclxuICAgICAgICAgICAgJCgnW2RhdGEtZmFuY3lib3gtaW5kZXhdJykuaHRtbCggaW5kZXggKyAxICk7XHJcblxyXG4gICAgICAgICAgICAkKCdbZGF0YS1mYW5jeWJveC1wcmV2XScpLnByb3AoJ2Rpc2FibGVkJywgKCAhb3B0cy5sb29wICYmIGluZGV4IDw9IDAgKSApO1xyXG4gICAgICAgICAgICAkKCdbZGF0YS1mYW5jeWJveC1uZXh0XScpLnByb3AoJ2Rpc2FibGVkJywgKCAhb3B0cy5sb29wICYmIGluZGV4ID49IHNlbGYuZ3JvdXAubGVuZ3RoIC0gMSApICk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEhpZGUgdG9vbGJhciBhbmQgY2FwdGlvblxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBoaWRlQ29udHJvbHMgOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuQ29udHJvbHMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kcmVmcy5jb250YWluZXIucmVtb3ZlQ2xhc3MoJ2ZhbmN5Ym94LXNob3ctaW5mb2JhciBmYW5jeWJveC1zaG93LXRvb2xiYXIgZmFuY3lib3gtc2hvdy1jYXB0aW9uIGZhbmN5Ym94LXNob3ctbmF2Jyk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIHNob3dDb250cm9scyA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgb3B0cyA9IHNlbGYuY3VycmVudCA/IHNlbGYuY3VycmVudC5vcHRzIDogc2VsZi5vcHRzO1xyXG4gICAgICAgICAgICB2YXIgJGNvbnRhaW5lciA9IHNlbGYuJHJlZnMuY29udGFpbmVyO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5pc0hpZGRlbkNvbnRyb2xzICAgPSBmYWxzZTtcclxuICAgICAgICAgICAgc2VsZi5pZGxlU2Vjb25kc0NvdW50ZXIgPSAwO1xyXG5cclxuICAgICAgICAgICAgJGNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCdmYW5jeWJveC1zaG93LXRvb2xiYXInLCAhISggb3B0cy50b29sYmFyICYmIG9wdHMuYnV0dG9ucyApIClcclxuICAgICAgICAgICAgICAgIC50b2dnbGVDbGFzcygnZmFuY3lib3gtc2hvdy1pbmZvYmFyJywgISEoIG9wdHMuaW5mb2JhciAmJiBzZWxmLmdyb3VwLmxlbmd0aCA+IDEgKSApXHJcbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2ZhbmN5Ym94LXNob3ctbmF2JywgICAgICEhKCBvcHRzLmFycm93cyAmJiBzZWxmLmdyb3VwLmxlbmd0aCA+IDEgKSApXHJcbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2ZhbmN5Ym94LWlzLW1vZGFsJywgICAgICEhb3B0cy5tb2RhbCApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzZWxmLiRjYXB0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcyggJ2ZhbmN5Ym94LXNob3ctY2FwdGlvbiAnKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICRjb250YWluZXIucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1zaG93LWNhcHRpb24nICk7XHJcbiAgICAgICAgICAgfVxyXG5cclxuICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgIC8vIFRvZ2dsZSB0b29sYmFyIGFuZCBjYXB0aW9uXHJcbiAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgIHRvZ2dsZUNvbnRyb2xzIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgIGlmICggdGhpcy5pc0hpZGRlbkNvbnRyb2xzICkge1xyXG4gICAgICAgICAgICAgICB0aGlzLnNob3dDb250cm9scygpO1xyXG5cclxuICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICB0aGlzLmhpZGVDb250cm9scygpO1xyXG4gICAgICAgICAgIH1cclxuXHJcbiAgICAgICB9LFxyXG5cclxuXHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgJC5mYW5jeWJveCA9IHtcclxuXHJcbiAgICAgICAgdmVyc2lvbiAgOiBcIjMuMS4yNVwiLFxyXG4gICAgICAgIGRlZmF1bHRzIDogZGVmYXVsdHMsXHJcblxyXG5cclxuICAgICAgICAvLyBHZXQgY3VycmVudCBpbnN0YW5jZSBhbmQgZXhlY3V0ZSBhIGNvbW1hbmQuXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBFeGFtcGxlcyBvZiB1c2FnZTpcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgJGluc3RhbmNlID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG4gICAgICAgIC8vICAgJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpLmp1bXBUbyggMSApO1xyXG4gICAgICAgIC8vICAgJC5mYW5jeWJveC5nZXRJbnN0YW5jZSggJ2p1bXBUbycsIDEgKTtcclxuICAgICAgICAvLyAgICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vICAgICAgIGNvbnNvbGUuaW5mbyggdGhpcy5jdXJySW5kZXggKTtcclxuICAgICAgICAvLyAgIH0pO1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBnZXRJbnN0YW5jZSA6IGZ1bmN0aW9uICggY29tbWFuZCApIHtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gJCgnLmZhbmN5Ym94LWNvbnRhaW5lcjpub3QoXCIuZmFuY3lib3gtaXMtY2xvc2luZ1wiKTpmaXJzdCcpLmRhdGEoICdGYW5jeUJveCcgKTtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgICAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggaW5zdGFuY2UgaW5zdGFuY2VvZiBGYW5jeUJveCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICQudHlwZSggY29tbWFuZCApID09PSAnc3RyaW5nJyApIHtcclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZVsgY29tbWFuZCBdLmFwcGx5KCBpbnN0YW5jZSwgYXJncyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICQudHlwZSggY29tbWFuZCApID09PSAnZnVuY3Rpb24nICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbW1hbmQuYXBwbHkoIGluc3RhbmNlLCBhcmdzICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiBpbnN0YW5jZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBpbnN0YW5jZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgb3BlbiA6IGZ1bmN0aW9uICggaXRlbXMsIG9wdHMsIGluZGV4ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IEZhbmN5Qm94KCBpdGVtcywgb3B0cywgaW5kZXggKTtcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2xvc2UgY3VycmVudCBvciBhbGwgaW5zdGFuY2VzXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGNsb3NlIDogZnVuY3Rpb24gKCBhbGwgKSB7XHJcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXMuZ2V0SW5zdGFuY2UoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggaW5zdGFuY2UgKSB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZS5jbG9zZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRyeSB0byBmaW5kIGFuZCBjbG9zZSBuZXh0IGluc3RhbmNlXHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBhbGwgPT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIENsb3NlIGluc3RhbmNlcyBhbmQgdW5iaW5kIGFsbCBldmVudHNcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgZGVzdHJveSA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdGhpcy5jbG9zZSggdHJ1ZSApO1xyXG5cclxuICAgICAgICAgICAgJEQub2ZmKCAnY2xpY2suZmItc3RhcnQnICk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBUcnkgdG8gZGV0ZWN0IG1vYmlsZSBkZXZpY2VzXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBpc01vYmlsZSA6IGRvY3VtZW50LmNyZWF0ZVRvdWNoICE9PSB1bmRlZmluZWQgJiYgL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5L2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcclxuXHJcblxyXG4gICAgICAgIC8vIERldGVjdCBpZiAndHJhbnNsYXRlM2QnIHN1cHBvcnQgaXMgYXZhaWxhYmxlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgdXNlM2QgOiAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZGl2ICkuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJykgJiYgIShkb2N1bWVudC5kb2N1bWVudE1vZGUgJiYgZG9jdW1lbnQuZG9jdW1lbnRNb2RlIDwgMTEpO1xyXG4gICAgICAgIH0oKSksXHJcblxyXG5cclxuICAgICAgICAvLyBIZWxwZXIgZnVuY3Rpb24gdG8gZ2V0IGN1cnJlbnQgdmlzdWFsIHN0YXRlIG9mIGFuIGVsZW1lbnRcclxuICAgICAgICAvLyByZXR1cm5zIGFycmF5WyB0b3AsIGxlZnQsIGhvcml6b250YWwtc2NhbGUsIHZlcnRpY2FsLXNjYWxlLCBvcGFjaXR5IF1cclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgZ2V0VHJhbnNsYXRlIDogZnVuY3Rpb24oICRlbCApIHtcclxuICAgICAgICAgICAgdmFyIG1hdHJpeDtcclxuXHJcbiAgICAgICAgICAgIGlmICggISRlbCB8fCAhJGVsLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbWF0cml4ICA9ICRlbC5lcSggMCApLmNzcygndHJhbnNmb3JtJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIG1hdHJpeCAmJiBtYXRyaXguaW5kZXhPZiggJ21hdHJpeCcgKSAhPT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICBtYXRyaXggPSBtYXRyaXguc3BsaXQoJygnKVsxXTtcclxuICAgICAgICAgICAgICAgIG1hdHJpeCA9IG1hdHJpeC5zcGxpdCgnKScpWzBdO1xyXG4gICAgICAgICAgICAgICAgbWF0cml4ID0gbWF0cml4LnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXRyaXggPSBbXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBtYXRyaXgubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIElFXHJcbiAgICAgICAgICAgICAgICBpZiAoIG1hdHJpeC5sZW5ndGggPiAxMCApIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXggPSBbIG1hdHJpeFsxM10sIG1hdHJpeFsxMl0sIG1hdHJpeFswXSwgbWF0cml4WzVdIF07XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXggPSBbIG1hdHJpeFs1XSwgbWF0cml4WzRdLCBtYXRyaXhbMF0sIG1hdHJpeFszXV07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbWF0cml4ID0gbWF0cml4Lm1hcChwYXJzZUZsb2F0KTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBtYXRyaXggPSBbIDAsIDAsIDEsIDEgXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNSZWdleCA9IC9cXC4qdHJhbnNsYXRlXFwoKC4qKXB4LCguKilweFxcKS9pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRyYW5zUmV6ID0gdHJhbnNSZWdleC5leGVjKCAkZWwuZXEoIDAgKS5hdHRyKCdzdHlsZScpICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0cmFuc1JleiApIHtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXhbIDAgXSA9IHBhcnNlRmxvYXQoIHRyYW5zUmV6WzJdICk7XHJcbiAgICAgICAgICAgICAgICAgICAgbWF0cml4WyAxIF0gPSBwYXJzZUZsb2F0KCB0cmFuc1JlelsxXSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdG9wICAgICA6IG1hdHJpeFsgMCBdLFxyXG4gICAgICAgICAgICAgICAgbGVmdCAgICA6IG1hdHJpeFsgMSBdLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVYICA6IG1hdHJpeFsgMiBdLFxyXG4gICAgICAgICAgICAgICAgc2NhbGVZICA6IG1hdHJpeFsgMyBdLFxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eSA6IHBhcnNlRmxvYXQoICRlbC5jc3MoJ29wYWNpdHknKSApLFxyXG4gICAgICAgICAgICAgICAgd2lkdGggICA6ICRlbC53aWR0aCgpLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0ICA6ICRlbC5oZWlnaHQoKVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gU2hvcnRjdXQgZm9yIHNldHRpbmcgXCJ0cmFuc2xhdGUzZFwiIHByb3BlcnRpZXMgZm9yIGVsZW1lbnRcclxuICAgICAgICAvLyBDYW4gc2V0IGJlIHVzZWQgdG8gc2V0IG9wYWNpdHksIHRvb1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIHNldFRyYW5zbGF0ZSA6IGZ1bmN0aW9uKCAkZWwsIHByb3BzICkge1xyXG4gICAgICAgICAgICB2YXIgc3RyICA9ICcnO1xyXG4gICAgICAgICAgICB2YXIgY3NzICA9IHt9O1xyXG5cclxuICAgICAgICAgICAgaWYgKCAhJGVsIHx8ICFwcm9wcyApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBwcm9wcy5sZWZ0ICE9PSB1bmRlZmluZWQgfHwgcHJvcHMudG9wICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgPSAoIHByb3BzLmxlZnQgPT09IHVuZGVmaW5lZCA/ICRlbC5wb3NpdGlvbigpLmxlZnQgOiBwcm9wcy5sZWZ0ICkgICsgJ3B4LCAnICsgKCBwcm9wcy50b3AgPT09IHVuZGVmaW5lZCA/ICRlbC5wb3NpdGlvbigpLnRvcCA6IHByb3BzLnRvcCApICsgJ3B4JztcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRoaXMudXNlM2QgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gJ3RyYW5zbGF0ZTNkKCcgKyBzdHIgKyAnLCAwcHgpJztcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0ciA9ICd0cmFuc2xhdGUoJyArIHN0ciArICcpJztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBwcm9wcy5zY2FsZVggIT09IHVuZGVmaW5lZCAmJiBwcm9wcy5zY2FsZVkgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIHN0ciA9IChzdHIubGVuZ3RoID8gc3RyICsgJyAnIDogJycpICsgJ3NjYWxlKCcgKyBwcm9wcy5zY2FsZVggKyAnLCAnICsgcHJvcHMuc2NhbGVZICsgJyknO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHN0ci5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgICAgICBjc3MudHJhbnNmb3JtID0gc3RyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHByb3BzLm9wYWNpdHkgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIGNzcy5vcGFjaXR5ID0gcHJvcHMub3BhY2l0eTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBwcm9wcy53aWR0aCAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgY3NzLndpZHRoID0gcHJvcHMud2lkdGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggcHJvcHMuaGVpZ2h0ICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBjc3MuaGVpZ2h0ID0gcHJvcHMuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gJGVsLmNzcyggY3NzICk7XHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIFNpbXBsZSBDU1MgdHJhbnNpdGlvbiBoYW5kbGVyXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgYW5pbWF0ZSA6IGZ1bmN0aW9uICggJGVsLCB0bywgZHVyYXRpb24sIGNhbGxiYWNrLCBsZWF2ZUFuaW1hdGlvbk5hbWUgKSB7XHJcbiAgICAgICAgICAgIHZhciBldmVudCA9IHRyYW5zaXRpb25FbmQgfHwgJ3RyYW5zaXRpb25lbmQnO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkLmlzRnVuY3Rpb24oIGR1cmF0aW9uICkgKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoICEkLmlzUGxhaW5PYmplY3QoIHRvICkgKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGVsLm9uKCBldmVudCwgZnVuY3Rpb24oZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNraXAgZXZlbnRzIGZyb20gY2hpbGQgZWxlbWVudHMgYW5kIHotaW5kZXggY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBpZiAoIGUgJiYgZS5vcmlnaW5hbEV2ZW50ICYmICggISRlbC5pcyggZS5vcmlnaW5hbEV2ZW50LnRhcmdldCApIHx8IGUub3JpZ2luYWxFdmVudC5wcm9wZXJ0eU5hbWUgPT0gJ3otaW5kZXgnICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRlbC5vZmYoIGV2ZW50ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCAkLmlzUGxhaW5PYmplY3QoIHRvICkgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggdG8uc2NhbGVYICE9PSB1bmRlZmluZWQgJiYgdG8uc2NhbGVZICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbC5jc3MoICd0cmFuc2l0aW9uLWR1cmF0aW9uJywgJzBtcycgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvLndpZHRoICA9IE1hdGgucm91bmQoICRlbC53aWR0aCgpICAqIHRvLnNjYWxlWCApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0by5oZWlnaHQgPSBNYXRoLnJvdW5kKCAkZWwuaGVpZ2h0KCkgKiB0by5zY2FsZVkgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvLnNjYWxlWCA9IDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvLnNjYWxlWSA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZSggJGVsLCB0byApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBsZWF2ZUFuaW1hdGlvbk5hbWUgIT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCB0byApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggJC5pc0Z1bmN0aW9uKCBjYWxsYmFjayApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCBlICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICggJC5pc051bWVyaWMoIGR1cmF0aW9uICkgKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwuY3NzKCAndHJhbnNpdGlvbi1kdXJhdGlvbicsIGR1cmF0aW9uICsgJ21zJyApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoICQuaXNQbGFpbk9iamVjdCggdG8gKSApIHtcclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCAkZWwsIHRvICk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsLmFkZENsYXNzKCB0byApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkZWwuZGF0YShcInRpbWVyXCIsIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwudHJpZ2dlciggJ3RyYW5zaXRpb25lbmQnICk7XHJcbiAgICAgICAgICAgIH0sIGR1cmF0aW9uICsgMTYpKTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RvcCA6IGZ1bmN0aW9uKCAkZWwgKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCggJGVsLmRhdGEoXCJ0aW1lclwiKSApO1xyXG5cclxuICAgICAgICAgICAgJGVsLm9mZiggdHJhbnNpdGlvbkVuZCApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBEZWZhdWx0IGNsaWNrIGhhbmRsZXIgZm9yIFwiZmFuY3lib3hlZFwiIGxpbmtzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGZ1bmN0aW9uIF9ydW4oIGUgKSB7XHJcbiAgICAgICAgdmFyIHRhcmdldFx0PSBlLmN1cnJlbnRUYXJnZXQsXHJcbiAgICAgICAgICAgIG9wdHNcdD0gZS5kYXRhID8gZS5kYXRhLm9wdGlvbnMgOiB7fSxcclxuICAgICAgICAgICAgaXRlbXNcdD0gb3B0cy5zZWxlY3RvciA/ICQoIG9wdHMuc2VsZWN0b3IgKSA6ICggZS5kYXRhID8gZS5kYXRhLml0ZW1zIDogW10gKSxcclxuICAgICAgICAgICAgdmFsdWVcdD0gJCh0YXJnZXQpLmF0dHIoICdkYXRhLWZhbmN5Ym94JyApIHx8ICcnLFxyXG4gICAgICAgICAgICBpbmRleFx0PSAwLFxyXG4gICAgICAgICAgICBhY3RpdmUgID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgICAgLy8gQXZvaWQgb3BlbmluZyBtdWx0aXBsZSB0aW1lc1xyXG4gICAgICAgIGlmICggYWN0aXZlICYmIGFjdGl2ZS5jdXJyZW50Lm9wdHMuJG9yaWcuaXMoIHRhcmdldCApICkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBHZXQgYWxsIHJlbGF0ZWQgaXRlbXMgYW5kIGZpbmQgaW5kZXggZm9yIGNsaWNrZWQgb25lXHJcbiAgICAgICAgaWYgKCB2YWx1ZSApIHtcclxuICAgICAgICAgICAgaXRlbXMgPSBpdGVtcy5sZW5ndGggPyBpdGVtcy5maWx0ZXIoICdbZGF0YS1mYW5jeWJveD1cIicgKyB2YWx1ZSArICdcIl0nICkgOiAkKCAnW2RhdGEtZmFuY3lib3g9XCInICsgdmFsdWUgKyAnXCJdJyApO1xyXG4gICAgICAgICAgICBpbmRleCA9IGl0ZW1zLmluZGV4KCB0YXJnZXQgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNvbWV0aW1lcyBjdXJyZW50IGl0ZW0gY2FuIG5vdCBiZSBmb3VuZFxyXG4gICAgICAgICAgICAvLyAoZm9yIGV4YW1wbGUsIHdoZW4gc2xpZGVyIGNsb25lcyBpdGVtcylcclxuICAgICAgICAgICAgaWYgKCBpbmRleCA8IDAgKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaXRlbXMgPSBbIHRhcmdldCBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5mYW5jeWJveC5vcGVuKCBpdGVtcywgb3B0cywgaW5kZXggKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgalF1ZXJ5IHBsdWdpblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICQuZm4uZmFuY3lib3ggPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBzZWxlY3RvcjtcclxuXHJcbiAgICAgICAgb3B0aW9ucyAgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHNlbGVjdG9yID0gb3B0aW9ucy5zZWxlY3RvciB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCBzZWxlY3RvciApIHtcclxuXHJcbiAgICAgICAgICAgICQoICdib2R5JyApLm9mZiggJ2NsaWNrLmZiLXN0YXJ0Jywgc2VsZWN0b3IgKS5vbiggJ2NsaWNrLmZiLXN0YXJ0Jywgc2VsZWN0b3IsIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMgOiBvcHRpb25zXHJcbiAgICAgICAgICAgIH0sIF9ydW4gKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub2ZmKCAnY2xpY2suZmItc3RhcnQnICkub24oICdjbGljay5mYi1zdGFydCcsIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zICAgOiB0aGlzLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA6IG9wdGlvbnNcclxuICAgICAgICAgICAgfSwgX3J1bik7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBTZWxmIGluaXRpYWxpemluZyBwbHVnaW5cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRELm9uKCAnY2xpY2suZmItc3RhcnQnLCAnW2RhdGEtZmFuY3lib3hdJywgX3J1biApO1xyXG5cclxufSggd2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSB8fCBqUXVlcnkgKSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gTWVkaWFcclxuLy8gQWRkcyBhZGRpdGlvbmFsIG1lZGlhIHR5cGUgc3VwcG9ydFxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG47KGZ1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gRm9ybWF0cyBtYXRjaGluZyB1cmwgdG8gZmluYWwgZm9ybVxyXG5cclxuXHR2YXIgZm9ybWF0ID0gZnVuY3Rpb24gKHVybCwgcmV6LCBwYXJhbXMpIHtcclxuXHRcdGlmICggIXVybCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBhcmFtcyA9IHBhcmFtcyB8fCAnJztcclxuXHJcblx0XHRpZiAoICQudHlwZShwYXJhbXMpID09PSBcIm9iamVjdFwiICkge1xyXG5cdFx0XHRwYXJhbXMgPSAkLnBhcmFtKHBhcmFtcywgdHJ1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0JC5lYWNoKHJleiwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJyQnICsga2V5LCB2YWx1ZSB8fCAnJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAocGFyYW1zLmxlbmd0aCkge1xyXG5cdFx0XHR1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPiAwID8gJyYnIDogJz8nKSArIHBhcmFtcztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdXJsO1xyXG5cdH07XHJcblxyXG5cdC8vIE9iamVjdCBjb250YWluaW5nIHByb3BlcnRpZXMgZm9yIGVhY2ggbWVkaWEgdHlwZVxyXG5cclxuXHR2YXIgZGVmYXVsdHMgPSB7XHJcblx0XHR5b3V0dWJlIDoge1xyXG5cdFx0XHRtYXRjaGVyIDogLyh5b3V0dWJlXFwuY29tfHlvdXR1XFwuYmV8eW91dHViZVxcLW5vY29va2llXFwuY29tKVxcLyh3YXRjaFxcPyguKiYpP3Y9fHZcXC98dVxcL3xlbWJlZFxcLz8pPyh2aWRlb3Nlcmllc1xcP2xpc3Q9KC4qKXxbXFx3LV17MTF9fFxcP2xpc3RUeXBlPSguKikmbGlzdD0oLiopKSguKikvaSxcclxuXHRcdFx0cGFyYW1zICA6IHtcclxuXHRcdFx0XHRhdXRvcGxheSA6IDEsXHJcblx0XHRcdFx0YXV0b2hpZGUgOiAxLFxyXG5cdFx0XHRcdGZzICA6IDEsXHJcblx0XHRcdFx0cmVsIDogMCxcclxuXHRcdFx0XHRoZCAgOiAxLFxyXG5cdFx0XHRcdHdtb2RlIDogJ3RyYW5zcGFyZW50JyxcclxuXHRcdFx0XHRlbmFibGVqc2FwaSA6IDEsXHJcblx0XHRcdFx0aHRtbDUgOiAxXHJcblx0XHRcdH0sXHJcblx0XHRcdHBhcmFtUGxhY2UgOiA4LFxyXG5cdFx0XHR0eXBlICA6ICdpZnJhbWUnLFxyXG5cdFx0XHR1cmwgICA6ICcvL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8kNCcsXHJcblx0XHRcdHRodW1iIDogJy8vaW1nLnlvdXR1YmUuY29tL3ZpLyQ0L2hxZGVmYXVsdC5qcGcnXHJcblx0XHR9LFxyXG5cclxuXHRcdHZpbWVvIDoge1xyXG5cdFx0XHRtYXRjaGVyIDogL14uK3ZpbWVvLmNvbVxcLyguKlxcLyk/KFtcXGRdKykoLiopPy8sXHJcblx0XHRcdHBhcmFtcyAgOiB7XHJcblx0XHRcdFx0YXV0b3BsYXkgOiAxLFxyXG5cdFx0XHRcdGhkIDogMSxcclxuXHRcdFx0XHRzaG93X3RpdGxlICAgIDogMSxcclxuXHRcdFx0XHRzaG93X2J5bGluZSAgIDogMSxcclxuXHRcdFx0XHRzaG93X3BvcnRyYWl0IDogMCxcclxuXHRcdFx0XHRmdWxsc2NyZWVuICAgIDogMSxcclxuXHRcdFx0XHRhcGkgOiAxXHJcblx0XHRcdH0sXHJcblx0XHRcdHBhcmFtUGxhY2UgOiAzLFxyXG5cdFx0XHR0eXBlIDogJ2lmcmFtZScsXHJcblx0XHRcdHVybCA6ICcvL3BsYXllci52aW1lby5jb20vdmlkZW8vJDInXHJcblx0XHR9LFxyXG5cclxuXHRcdG1ldGFjYWZlIDoge1xyXG5cdFx0XHRtYXRjaGVyIDogL21ldGFjYWZlLmNvbVxcL3dhdGNoXFwvKFxcZCspXFwvKC4qKT8vLFxyXG5cdFx0XHR0eXBlICAgIDogJ2lmcmFtZScsXHJcblx0XHRcdHVybCAgICAgOiAnLy93d3cubWV0YWNhZmUuY29tL2VtYmVkLyQxLz9hcD0xJ1xyXG5cdFx0fSxcclxuXHJcblx0XHRkYWlseW1vdGlvbiA6IHtcclxuXHRcdFx0bWF0Y2hlciA6IC9kYWlseW1vdGlvbi5jb21cXC92aWRlb1xcLyguKilcXC8/KC4qKS8sXHJcblx0XHRcdHBhcmFtcyA6IHtcclxuXHRcdFx0XHRhZGRpdGlvbmFsSW5mb3MgOiAwLFxyXG5cdFx0XHRcdGF1dG9TdGFydCA6IDFcclxuXHRcdFx0fSxcclxuXHRcdFx0dHlwZSA6ICdpZnJhbWUnLFxyXG5cdFx0XHR1cmwgIDogJy8vd3d3LmRhaWx5bW90aW9uLmNvbS9lbWJlZC92aWRlby8kMSdcclxuXHRcdH0sXHJcblxyXG5cdFx0dmluZSA6IHtcclxuXHRcdFx0bWF0Y2hlciA6IC92aW5lLmNvXFwvdlxcLyhbYS16QS1aMC05XFw/XFw9XFwtXSspLyxcclxuXHRcdFx0dHlwZSAgICA6ICdpZnJhbWUnLFxyXG5cdFx0XHR1cmwgICAgIDogJy8vdmluZS5jby92LyQxL2VtYmVkL3NpbXBsZSdcclxuXHRcdH0sXHJcblxyXG5cdFx0aW5zdGFncmFtIDoge1xyXG5cdFx0XHRtYXRjaGVyIDogLyhpbnN0YWdyXFwuYW18aW5zdGFncmFtXFwuY29tKVxcL3BcXC8oW2EtekEtWjAtOV9cXC1dKylcXC8/L2ksXHJcblx0XHRcdHR5cGUgICAgOiAnaW1hZ2UnLFxyXG5cdFx0XHR1cmwgICAgIDogJy8vJDEvcC8kMi9tZWRpYS8/c2l6ZT1sJ1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBFeGFtcGxlczpcclxuXHRcdC8vIGh0dHA6Ly9tYXBzLmdvb2dsZS5jb20vP2xsPTQ4Ljg1Nzk5NSwyLjI5NDI5NyZzcG49MC4wMDc2NjYsMC4wMjExMzYmdD1tJno9MTZcclxuXHRcdC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9AMzcuNzg1MjAwNiwtMTIyLjQxNDYzNTUsMTQuNjV6XHJcblx0XHQvLyBodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvcGxhY2UvR29vZ2xlcGxleC9AMzcuNDIyMDA0MSwtMTIyLjA4MzM0OTQsMTd6L2RhdGE9ITRtNSEzbTQhMXMweDA6MHg2YzI5NmM2NjYxOTM2N2UwIThtMiEzZDM3LjQyMTk5OTghNGQtMTIyLjA4NDA1NzJcclxuXHRcdGdtYXBfcGxhY2UgOiB7XHJcblx0XHRcdG1hdGNoZXIgOiAvKG1hcHNcXC4pP2dvb2dsZVxcLihbYS16XXsyLDN9KFxcLlthLXpdezJ9KT8pXFwvKCgobWFwc1xcLyhwbGFjZVxcLyguKilcXC8pP1xcQCguKiksKFxcZCsuP1xcZCs/KXopKXwoXFw/bGw9KSkoLiopPy9pLFxyXG5cdFx0XHR0eXBlICAgIDogJ2lmcmFtZScsXHJcblx0XHRcdHVybCAgICAgOiBmdW5jdGlvbiAocmV6KSB7XHJcblx0XHRcdFx0cmV0dXJuICcvL21hcHMuZ29vZ2xlLicgKyByZXpbMl0gKyAnLz9sbD0nICsgKCByZXpbOV0gPyByZXpbOV0gKyAnJno9JyArIE1hdGguZmxvb3IoICByZXpbMTBdICApICsgKCByZXpbMTJdID8gcmV6WzEyXS5yZXBsYWNlKC9eXFwvLywgXCImXCIpIDogJycgKSAgOiByZXpbMTJdICkgKyAnJm91dHB1dD0nICsgKCByZXpbMTJdICYmIHJlelsxMl0uaW5kZXhPZignbGF5ZXI9YycpID4gMCA/ICdzdmVtYmVkJyA6ICdlbWJlZCcgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBFeGFtcGxlczpcclxuXHRcdC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvRW1waXJlK1N0YXRlK0J1aWxkaW5nL1xyXG5cdFx0Ly8gaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL3NlYXJjaC8/YXBpPTEmcXVlcnk9Y2VudHVyeWxpbmsrZmllbGRcclxuXHRcdC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvP2FwaT0xJnF1ZXJ5PTQ3LjU5NTE1MTgsLTEyMi4zMzE2MzkzXHJcblx0XHRnbWFwX3NlYXJjaCA6IHtcclxuXHRcdFx0bWF0Y2hlciA6IC8obWFwc1xcLik/Z29vZ2xlXFwuKFthLXpdezIsM30oXFwuW2Etel17Mn0pPylcXC8obWFwc1xcL3NlYXJjaFxcLykoLiopL2ksXHJcblx0XHRcdHR5cGUgICAgOiAnaWZyYW1lJyxcclxuXHRcdFx0dXJsICAgICA6IGZ1bmN0aW9uIChyZXopIHtcclxuXHRcdFx0XHRyZXR1cm4gJy8vbWFwcy5nb29nbGUuJyArIHJlelsyXSArICcvbWFwcz9xPScgKyByZXpbNV0ucmVwbGFjZSgncXVlcnk9JywgJ3E9JykucmVwbGFjZSgnYXBpPTEnLCAnJykgKyAnJm91dHB1dD1lbWJlZCc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQkKGRvY3VtZW50KS5vbignb25Jbml0LmZiJywgZnVuY3Rpb24gKGUsIGluc3RhbmNlKSB7XHJcblxyXG5cdFx0JC5lYWNoKGluc3RhbmNlLmdyb3VwLCBmdW5jdGlvbiggaSwgaXRlbSApIHtcclxuXHJcblx0XHRcdHZhciB1cmxcdCA9IGl0ZW0uc3JjIHx8ICcnLFxyXG5cdFx0XHRcdHR5cGUgPSBmYWxzZSxcclxuXHRcdFx0XHRtZWRpYSxcclxuXHRcdFx0XHR0aHVtYixcclxuXHRcdFx0XHRyZXosXHJcblx0XHRcdFx0cGFyYW1zLFxyXG5cdFx0XHRcdHVybFBhcmFtcyxcclxuXHRcdFx0XHRvLFxyXG5cdFx0XHRcdHByb3ZpZGVyO1xyXG5cclxuXHRcdFx0Ly8gU2tpcCBpdGVtcyB0aGF0IGFscmVhZHkgaGF2ZSBjb250ZW50IHR5cGVcclxuXHRcdFx0aWYgKCBpdGVtLnR5cGUgKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRtZWRpYSA9ICQuZXh0ZW5kKCB0cnVlLCB7fSwgZGVmYXVsdHMsIGl0ZW0ub3B0cy5tZWRpYSApO1xyXG5cclxuXHRcdFx0Ly8gTG9vayBmb3IgYW55IG1hdGNoaW5nIG1lZGlhIHR5cGVcclxuXHRcdFx0JC5lYWNoKG1lZGlhLCBmdW5jdGlvbiAoIG4sIGVsICkge1xyXG5cdFx0XHRcdHJleiA9IHVybC5tYXRjaChlbC5tYXRjaGVyKTtcclxuXHRcdFx0XHRvICAgPSB7fTtcclxuXHRcdFx0XHRwcm92aWRlciA9IG47XHJcblxyXG5cdFx0XHRcdGlmICghcmV6KSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR0eXBlID0gZWwudHlwZTtcclxuXHJcblx0XHRcdFx0aWYgKCBlbC5wYXJhbVBsYWNlICYmIHJlelsgZWwucGFyYW1QbGFjZSBdICkge1xyXG5cdFx0XHRcdFx0dXJsUGFyYW1zID0gcmV6WyBlbC5wYXJhbVBsYWNlIF07XHJcblxyXG5cdFx0XHRcdFx0aWYgKCB1cmxQYXJhbXNbIDAgXSA9PSAnPycgKSB7XHJcblx0XHRcdFx0XHRcdHVybFBhcmFtcyA9IHVybFBhcmFtcy5zdWJzdHJpbmcoMSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dXJsUGFyYW1zID0gdXJsUGFyYW1zLnNwbGl0KCcmJyk7XHJcblxyXG5cdFx0XHRcdFx0Zm9yICggdmFyIG0gPSAwOyBtIDwgdXJsUGFyYW1zLmxlbmd0aDsgKyttICkge1xyXG5cdFx0XHRcdFx0XHR2YXIgcCA9IHVybFBhcmFtc1sgbSBdLnNwbGl0KCc9JywgMik7XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoIHAubGVuZ3RoID09IDIgKSB7XHJcblx0XHRcdFx0XHRcdFx0b1sgcFswXSBdID0gZGVjb2RlVVJJQ29tcG9uZW50KCBwWzFdLnJlcGxhY2UoL1xcKy9nLCBcIiBcIikgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cGFyYW1zID0gJC5leHRlbmQoIHRydWUsIHt9LCBlbC5wYXJhbXMsIGl0ZW0ub3B0c1sgbiBdLCBvICk7XHJcblxyXG5cdFx0XHRcdHVybCAgID0gJC50eXBlKGVsLnVybCkgPT09IFwiZnVuY3Rpb25cIiA/IGVsLnVybC5jYWxsKHRoaXMsIHJleiwgcGFyYW1zLCBpdGVtKSA6IGZvcm1hdChlbC51cmwsIHJleiwgcGFyYW1zKTtcclxuXHRcdFx0XHR0aHVtYiA9ICQudHlwZShlbC50aHVtYikgPT09IFwiZnVuY3Rpb25cIiA/IGVsLnRodW1iLmNhbGwodGhpcywgcmV6LCBwYXJhbXMsIGl0ZW0pIDogZm9ybWF0KGVsLnRodW1iLCByZXopO1xyXG5cclxuXHRcdFx0XHRpZiAoIHByb3ZpZGVyID09PSAndmltZW8nICkge1xyXG5cdFx0XHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJyYlMjMnLCAnIycpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdC8vIElmIGl0IGlzIGZvdW5kLCB0aGVuIGNoYW5nZSBjb250ZW50IHR5cGUgYW5kIHVwZGF0ZSB0aGUgdXJsXHJcblxyXG5cdFx0XHRpZiAoIHR5cGUgKSB7XHJcblx0XHRcdFx0aXRlbS5zcmMgID0gdXJsO1xyXG5cdFx0XHRcdGl0ZW0udHlwZSA9IHR5cGU7XHJcblxyXG5cdFx0XHRcdGlmICggIWl0ZW0ub3B0cy50aHVtYiAmJiAhKCBpdGVtLm9wdHMuJHRodW1iICYmIGl0ZW0ub3B0cy4kdGh1bWIubGVuZ3RoICkgKSB7XHJcblx0XHRcdFx0XHRpdGVtLm9wdHMudGh1bWIgPSB0aHVtYjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmICggdHlwZSA9PT0gJ2lmcmFtZScgKSB7XHJcblx0XHRcdFx0XHQkLmV4dGVuZCh0cnVlLCBpdGVtLm9wdHMsIHtcclxuXHRcdFx0XHRcdFx0aWZyYW1lIDoge1xyXG5cdFx0XHRcdFx0XHRcdHByZWxvYWQgOiBmYWxzZSxcclxuXHRcdFx0XHRcdFx0XHRhdHRyIDoge1xyXG5cdFx0XHRcdFx0XHRcdFx0c2Nyb2xsaW5nIDogXCJub1wiXHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRpdGVtLmNvbnRlbnRQcm92aWRlciA9IHByb3ZpZGVyO1xyXG5cclxuXHRcdFx0XHRcdGl0ZW0ub3B0cy5zbGlkZUNsYXNzICs9ICcgZmFuY3lib3gtc2xpZGUtLScgKyAoIHByb3ZpZGVyID09ICdnbWFwX3BsYWNlJyB8fCBwcm92aWRlciA9PSAnZ21hcF9zZWFyY2gnID8gJ21hcCcgOiAndmlkZW8nICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0Ly8gSWYgbm8gY29udGVudCB0eXBlIGlzIGZvdW5kLCB0aGVuIHNldCBpdCB0byBgaW1hZ2VgIGFzIGZhbGxiYWNrXHJcblx0XHRcdFx0aXRlbS50eXBlID0gJ2ltYWdlJztcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cclxuXHR9KTtcclxuXHJcbn0od2luZG93LmpRdWVyeSkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIEd1ZXN0dXJlc1xyXG4vLyBBZGRzIHRvdWNoIGd1ZXN0dXJlcywgaGFuZGxlcyBjbGljayBhbmQgdGFwIGV2ZW50c1xyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG47KGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50LCAkKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgcmVxdWVzdEFGcmFtZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBhbGwgZWxzZSBmYWlscywgdXNlIHNldFRpbWVvdXRcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG5cclxuXHJcbiAgICB2YXIgY2FuY2VsQUZyYW1lID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICAgICAgd2luZG93Lm9DYW5jZWxBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChpZCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxuXHJcblxyXG5cdHZhciBwb2ludGVycyA9IGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuXHRcdGUgPSBlLm9yaWdpbmFsRXZlbnQgfHwgZSB8fCB3aW5kb3cuZTtcclxuXHRcdGUgPSBlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA/IGUudG91Y2hlcyA6ICggZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aCA/IGUuY2hhbmdlZFRvdWNoZXMgOiBbIGUgXSApO1xyXG5cclxuXHRcdGZvciAoIHZhciBrZXkgaW4gZSApIHtcclxuXHJcblx0XHRcdGlmICggZVsga2V5IF0ucGFnZVggKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goIHsgeCA6IGVbIGtleSBdLnBhZ2VYLCB5IDogZVsga2V5IF0ucGFnZVkgfSApO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggZVsga2V5IF0uY2xpZW50WCApIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCggeyB4IDogZVsga2V5IF0uY2xpZW50WCwgeSA6IGVbIGtleSBdLmNsaWVudFkgfSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgZGlzdGFuY2UgPSBmdW5jdGlvbiggcG9pbnQyLCBwb2ludDEsIHdoYXQgKSB7XHJcblx0XHRpZiAoICFwb2ludDEgfHwgIXBvaW50MiApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB3aGF0ID09PSAneCcgKSB7XHJcblx0XHRcdHJldHVybiBwb2ludDIueCAtIHBvaW50MS54O1xyXG5cclxuXHRcdH0gZWxzZSBpZiAoIHdoYXQgPT09ICd5JyApIHtcclxuXHRcdFx0cmV0dXJuIHBvaW50Mi55IC0gcG9pbnQxLnk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIE1hdGguc3FydCggTWF0aC5wb3coIHBvaW50Mi54IC0gcG9pbnQxLngsIDIgKSArIE1hdGgucG93KCBwb2ludDIueSAtIHBvaW50MS55LCAyICkgKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgaXNDbGlja2FibGUgPSBmdW5jdGlvbiggJGVsICkge1xyXG5cclxuXHRcdGlmICggJGVsLmlzKCdhLGJ1dHRvbixpbnB1dCxzZWxlY3QsdGV4dGFyZWEnKSB8fCAkLmlzRnVuY3Rpb24oICRlbC5nZXQoMCkub25jbGljayApIHx8ICRlbC5kYXRhKCdzZWxlY3RhYmxlJykgKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGZvciBhdHRyaWJ1dGVzIGxpa2UgZGF0YS1mYW5jeWJveC1uZXh0IG9yIGRhdGEtZmFuY3lib3gtY2xvc2VcclxuXHRcdGZvciAoIHZhciBpID0gMCwgYXR0cyA9ICRlbFswXS5hdHRyaWJ1dGVzLCBuID0gYXR0cy5sZW5ndGg7IGkgPCBuOyBpKysgKSB7XHJcbiAgICAgICAgICAgIGlmICggYXR0c1tpXS5ub2RlTmFtZS5zdWJzdHIoMCwgMTQpID09PSAnZGF0YS1mYW5jeWJveC0nICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG5cdCBcdHJldHVybiBmYWxzZTtcclxuXHR9O1xyXG5cclxuXHR2YXIgaGFzU2Nyb2xsYmFycyA9IGZ1bmN0aW9uKCBlbCApIHtcclxuXHRcdHZhciBvdmVyZmxvd1kgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZWwgKVsnb3ZlcmZsb3cteSddO1xyXG5cdFx0dmFyIG92ZXJmbG93WCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKCBlbCApWydvdmVyZmxvdy14J107XHJcblxyXG5cdFx0dmFyIHZlcnRpY2FsICAgPSAob3ZlcmZsb3dZID09PSAnc2Nyb2xsJyB8fCBvdmVyZmxvd1kgPT09ICdhdXRvJykgJiYgZWwuc2Nyb2xsSGVpZ2h0ID4gZWwuY2xpZW50SGVpZ2h0O1xyXG5cdFx0dmFyIGhvcml6b250YWwgPSAob3ZlcmZsb3dYID09PSAnc2Nyb2xsJyB8fCBvdmVyZmxvd1ggPT09ICdhdXRvJykgJiYgZWwuc2Nyb2xsV2lkdGggPiBlbC5jbGllbnRXaWR0aDtcclxuXHJcblx0XHRyZXR1cm4gdmVydGljYWwgfHwgaG9yaXpvbnRhbDtcclxuXHR9O1xyXG5cclxuXHR2YXIgaXNTY3JvbGxhYmxlID0gZnVuY3Rpb24gKCAkZWwgKSB7XHJcblx0XHR2YXIgcmV6ID0gZmFsc2U7XHJcblxyXG5cdFx0d2hpbGUgKCB0cnVlICkge1xyXG5cdFx0XHRyZXpcdD0gaGFzU2Nyb2xsYmFycyggJGVsLmdldCgwKSApO1xyXG5cclxuXHRcdFx0aWYgKCByZXogKSB7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdCRlbCA9ICRlbC5wYXJlbnQoKTtcclxuXHJcblx0XHRcdGlmICggISRlbC5sZW5ndGggfHwgJGVsLmhhc0NsYXNzKCAnZmFuY3lib3gtc3RhZ2UnICkgfHwgJGVsLmlzKCAnYm9keScgKSApIHtcclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiByZXo7XHJcblx0fTtcclxuXHJcblxyXG5cdHZhciBHdWVzdHVyZXMgPSBmdW5jdGlvbiAoIGluc3RhbmNlICkge1xyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdHNlbGYuaW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuXHJcblx0XHRzZWxmLiRiZyAgICAgICAgPSBpbnN0YW5jZS4kcmVmcy5iZztcclxuXHRcdHNlbGYuJHN0YWdlICAgICA9IGluc3RhbmNlLiRyZWZzLnN0YWdlO1xyXG5cdFx0c2VsZi4kY29udGFpbmVyID0gaW5zdGFuY2UuJHJlZnMuY29udGFpbmVyO1xyXG5cclxuXHRcdHNlbGYuZGVzdHJveSgpO1xyXG5cclxuXHRcdHNlbGYuJGNvbnRhaW5lci5vbiggJ3RvdWNoc3RhcnQuZmIudG91Y2ggbW91c2Vkb3duLmZiLnRvdWNoJywgJC5wcm94eShzZWxmLCAnb250b3VjaHN0YXJ0JykgKTtcclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMuJGNvbnRhaW5lci5vZmYoICcuZmIudG91Y2gnICk7XHJcblx0fTtcclxuXHJcblx0R3Vlc3R1cmVzLnByb3RvdHlwZS5vbnRvdWNoc3RhcnQgPSBmdW5jdGlvbiggZSApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHR2YXIgJHRhcmdldCAgPSAkKCBlLnRhcmdldCApO1xyXG5cdFx0dmFyIGluc3RhbmNlID0gc2VsZi5pbnN0YW5jZTtcclxuXHRcdHZhciBjdXJyZW50ICA9IGluc3RhbmNlLmN1cnJlbnQ7XHJcblx0XHR2YXIgJGNvbnRlbnQgPSBjdXJyZW50LiRjb250ZW50O1xyXG5cclxuXHRcdHZhciBpc1RvdWNoRGV2aWNlID0gKCBlLnR5cGUgPT0gJ3RvdWNoc3RhcnQnICk7XHJcblxyXG5cdFx0Ly8gRG8gbm90IHJlc3BvbmQgdG8gYm90aCBldmVudHNcclxuXHRcdGlmICggaXNUb3VjaERldmljZSApIHtcclxuXHQgICAgICAgIHNlbGYuJGNvbnRhaW5lci5vZmYoICdtb3VzZWRvd24uZmIudG91Y2gnICk7XHJcblx0ICAgIH1cclxuXHJcblx0XHQvLyBJZ25vcmUgY2xpY2tzIHdoaWxlIHpvb21pbmcgb3IgY2xvc2luZ1xyXG5cdFx0aWYgKCAhY3VycmVudCB8fCBzZWxmLmluc3RhbmNlLmlzQW5pbWF0aW5nIHx8IHNlbGYuaW5zdGFuY2UuaXNDbG9zaW5nICkge1xyXG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWdub3JlIHJpZ2h0IGNsaWNrXHJcblx0XHRpZiAoIGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQuYnV0dG9uID09IDIgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBJZ25vcmUgdGFwaW5nIG9uIGxpbmtzLCBidXR0b25zLCBpbnB1dCBlbGVtZW50c1xyXG5cdFx0aWYgKCAhJHRhcmdldC5sZW5ndGggfHwgaXNDbGlja2FibGUoICR0YXJnZXQgKSB8fCBpc0NsaWNrYWJsZSggJHRhcmdldC5wYXJlbnQoKSApICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWdub3JlIGNsaWNrcyBvbiB0aGUgc2Nyb2xsYmFyXHJcblx0XHRpZiAoIGUub3JpZ2luYWxFdmVudC5jbGllbnRYID4gJHRhcmdldFswXS5jbGllbnRXaWR0aCArICR0YXJnZXQub2Zmc2V0KCkubGVmdCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuc3RhcnRQb2ludHMgPSBwb2ludGVycyggZSApO1xyXG5cclxuXHRcdC8vIFByZXZlbnQgem9vbWluZyBpZiBhbHJlYWR5IHN3aXBpbmdcclxuXHRcdGlmICggIXNlbGYuc3RhcnRQb2ludHMgfHwgKCBzZWxmLnN0YXJ0UG9pbnRzLmxlbmd0aCA+IDEgJiYgaW5zdGFuY2UuaXNTbGlkaW5nICkgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxmLiR0YXJnZXQgID0gJHRhcmdldDtcclxuXHRcdHNlbGYuJGNvbnRlbnQgPSAkY29udGVudDtcclxuXHRcdHNlbGYuY2FuVGFwICAgPSB0cnVlO1xyXG5cclxuXHRcdCQoZG9jdW1lbnQpLm9mZiggJy5mYi50b3VjaCcgKTtcclxuXHJcblx0XHQkKGRvY3VtZW50KS5vbiggaXNUb3VjaERldmljZSA/ICd0b3VjaGVuZC5mYi50b3VjaCB0b3VjaGNhbmNlbC5mYi50b3VjaCcgOiAnbW91c2V1cC5mYi50b3VjaCBtb3VzZWxlYXZlLmZiLnRvdWNoJywgICQucHJveHkoc2VsZiwgXCJvbnRvdWNoZW5kXCIpKTtcclxuXHRcdCQoZG9jdW1lbnQpLm9uKCBpc1RvdWNoRGV2aWNlID8gJ3RvdWNobW92ZS5mYi50b3VjaCcgOiAnbW91c2Vtb3ZlLmZiLnRvdWNoJywgICQucHJveHkoc2VsZiwgXCJvbnRvdWNobW92ZVwiKSk7XHJcblxyXG5cdFx0aWYgKCAhKGluc3RhbmNlLmN1cnJlbnQub3B0cy50b3VjaCB8fCBpbnN0YW5jZS5jYW5QYW4oKSApIHx8ICEoICR0YXJnZXQuaXMoIHNlbGYuJHN0YWdlICkgfHwgc2VsZi4kc3RhZ2UuZmluZCggJHRhcmdldCApLmxlbmd0aCApICkge1xyXG5cclxuXHRcdFx0Ly8gUHJldmVudCBnaG9zdGluZ1xyXG5cdFx0XHRpZiAoICR0YXJnZXQuaXMoJ2ltZycpICkge1xyXG5cdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0aWYgKCAhKCAkLmZhbmN5Ym94LmlzTW9iaWxlICYmICggaXNTY3JvbGxhYmxlKCBzZWxmLiR0YXJnZXQgKSB8fCBpc1Njcm9sbGFibGUoIHNlbGYuJHRhcmdldC5wYXJlbnQoKSApICkgKSApIHtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuY2FudmFzV2lkdGggID0gTWF0aC5yb3VuZCggY3VycmVudC4kc2xpZGVbMF0uY2xpZW50V2lkdGggKTtcclxuXHRcdHNlbGYuY2FudmFzSGVpZ2h0ID0gTWF0aC5yb3VuZCggY3VycmVudC4kc2xpZGVbMF0uY2xpZW50SGVpZ2h0ICk7XHJcblxyXG5cdFx0c2VsZi5zdGFydFRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHRcdHNlbGYuZGlzdGFuY2VYID0gc2VsZi5kaXN0YW5jZVkgPSBzZWxmLmRpc3RhbmNlID0gMDtcclxuXHJcblx0XHRzZWxmLmlzUGFubmluZyA9IGZhbHNlO1xyXG5cdFx0c2VsZi5pc1N3aXBpbmcgPSBmYWxzZTtcclxuXHRcdHNlbGYuaXNab29taW5nID0gZmFsc2U7XHJcblxyXG5cdFx0c2VsZi5zbGlkZXJTdGFydFBvcyAgPSBzZWxmLnNsaWRlckxhc3RQb3MgfHwgeyB0b3A6IDAsIGxlZnQ6IDAgfTtcclxuXHRcdHNlbGYuY29udGVudFN0YXJ0UG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoIHNlbGYuJGNvbnRlbnQgKTtcclxuXHRcdHNlbGYuY29udGVudExhc3RQb3MgID0gbnVsbDtcclxuXHJcblx0XHRpZiAoIHNlbGYuc3RhcnRQb2ludHMubGVuZ3RoID09PSAxICYmICFzZWxmLmlzWm9vbWluZyApIHtcclxuXHRcdFx0c2VsZi5jYW5UYXAgPSAhaW5zdGFuY2UuaXNTbGlkaW5nO1xyXG5cclxuXHRcdFx0aWYgKCBjdXJyZW50LnR5cGUgPT09ICdpbWFnZScgJiYgKCBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aCA+IHNlbGYuY2FudmFzV2lkdGggKyAxIHx8IHNlbGYuY29udGVudFN0YXJ0UG9zLmhlaWdodCA+IHNlbGYuY2FudmFzSGVpZ2h0ICsgMSApICkge1xyXG5cclxuXHRcdFx0XHQkLmZhbmN5Ym94LnN0b3AoIHNlbGYuJGNvbnRlbnQgKTtcclxuXHJcblx0XHRcdFx0c2VsZi4kY29udGVudC5jc3MoICd0cmFuc2l0aW9uLWR1cmF0aW9uJywgJzBtcycgKTtcclxuXHJcblx0XHRcdFx0c2VsZi5pc1Bhbm5pbmcgPSB0cnVlO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdFx0c2VsZi5pc1N3aXBpbmcgPSB0cnVlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzZWxmLiRjb250YWluZXIuYWRkQ2xhc3MoJ2ZhbmN5Ym94LWNvbnRyb2xzLS1pc0dyYWJiaW5nJyk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBzZWxmLnN0YXJ0UG9pbnRzLmxlbmd0aCA9PT0gMiAmJiAhaW5zdGFuY2UuaXNBbmltYXRpbmcgJiYgIWN1cnJlbnQuaGFzRXJyb3IgJiYgY3VycmVudC50eXBlID09PSAnaW1hZ2UnICYmICggY3VycmVudC5pc0xvYWRlZCB8fCBjdXJyZW50LiRnaG9zdCApICkge1xyXG5cdFx0XHRzZWxmLmlzWm9vbWluZyA9IHRydWU7XHJcblxyXG5cdFx0XHRzZWxmLmlzU3dpcGluZyA9IGZhbHNlO1xyXG5cdFx0XHRzZWxmLmlzUGFubmluZyA9IGZhbHNlO1xyXG5cclxuXHRcdFx0JC5mYW5jeWJveC5zdG9wKCBzZWxmLiRjb250ZW50ICk7XHJcblxyXG5cdFx0XHRzZWxmLiRjb250ZW50LmNzcyggJ3RyYW5zaXRpb24tZHVyYXRpb24nLCAnMG1zJyApO1xyXG5cclxuXHRcdFx0c2VsZi5jZW50ZXJQb2ludFN0YXJ0WCA9ICggKCBzZWxmLnN0YXJ0UG9pbnRzWzBdLnggKyBzZWxmLnN0YXJ0UG9pbnRzWzFdLnggKSAqIDAuNSApIC0gJCh3aW5kb3cpLnNjcm9sbExlZnQoKTtcclxuXHRcdFx0c2VsZi5jZW50ZXJQb2ludFN0YXJ0WSA9ICggKCBzZWxmLnN0YXJ0UG9pbnRzWzBdLnkgKyBzZWxmLnN0YXJ0UG9pbnRzWzFdLnkgKSAqIDAuNSApIC0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG5cclxuXHRcdFx0c2VsZi5wZXJjZW50YWdlT2ZJbWFnZUF0UGluY2hQb2ludFggPSAoIHNlbGYuY2VudGVyUG9pbnRTdGFydFggLSBzZWxmLmNvbnRlbnRTdGFydFBvcy5sZWZ0ICkgLyBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aDtcclxuXHRcdFx0c2VsZi5wZXJjZW50YWdlT2ZJbWFnZUF0UGluY2hQb2ludFkgPSAoIHNlbGYuY2VudGVyUG9pbnRTdGFydFkgLSBzZWxmLmNvbnRlbnRTdGFydFBvcy50b3AgICkgLyBzZWxmLmNvbnRlbnRTdGFydFBvcy5oZWlnaHQ7XHJcblxyXG5cdFx0XHRzZWxmLnN0YXJ0RGlzdGFuY2VCZXR3ZWVuRmluZ2VycyA9IGRpc3RhbmNlKCBzZWxmLnN0YXJ0UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzFdICk7XHJcblx0XHR9XHJcblxyXG5cdH07XHJcblxyXG5cdEd1ZXN0dXJlcy5wcm90b3R5cGUub250b3VjaG1vdmUgPSBmdW5jdGlvbiggZSApIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0c2VsZi5uZXdQb2ludHMgPSBwb2ludGVycyggZSApO1xyXG5cclxuXHRcdGlmICggJC5mYW5jeWJveC5pc01vYmlsZSAmJiAoIGlzU2Nyb2xsYWJsZSggc2VsZi4kdGFyZ2V0ICkgfHwgaXNTY3JvbGxhYmxlKCBzZWxmLiR0YXJnZXQucGFyZW50KCkgKSApICkge1xyXG5cdFx0XHRlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuXHRcdFx0c2VsZi5jYW5UYXAgPSBmYWxzZTtcclxuXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoICEoIHNlbGYuaW5zdGFuY2UuY3VycmVudC5vcHRzLnRvdWNoIHx8IHNlbGYuaW5zdGFuY2UuY2FuUGFuKCkgKSB8fCAhc2VsZi5uZXdQb2ludHMgfHwgIXNlbGYubmV3UG9pbnRzLmxlbmd0aCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuZGlzdGFuY2VYID0gZGlzdGFuY2UoIHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzBdLCAneCcgKTtcclxuXHRcdHNlbGYuZGlzdGFuY2VZID0gZGlzdGFuY2UoIHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzBdLCAneScgKTtcclxuXHJcblx0XHRzZWxmLmRpc3RhbmNlID0gZGlzdGFuY2UoIHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzBdICk7XHJcblxyXG5cdFx0Ly8gU2tpcCBmYWxzZSBvbnRvdWNobW92ZSBldmVudHMgKENocm9tZSlcclxuXHRcdGlmICggc2VsZi5kaXN0YW5jZSA+IDAgKSB7XHJcblxyXG5cdFx0XHRpZiAoICEoIHNlbGYuJHRhcmdldC5pcyggc2VsZi4kc3RhZ2UgKSB8fCBzZWxmLiRzdGFnZS5maW5kKCBzZWxmLiR0YXJnZXQgKS5sZW5ndGggKSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdGlmICggc2VsZi5pc1N3aXBpbmcgKSB7XHJcblx0XHRcdFx0c2VsZi5vblN3aXBlKCk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCBzZWxmLmlzUGFubmluZyApIHtcclxuXHRcdFx0XHRzZWxmLm9uUGFuKCk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCBzZWxmLmlzWm9vbWluZyApIHtcclxuXHRcdFx0XHRzZWxmLm9uWm9vbSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLm9uU3dpcGUgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIHN3aXBpbmcgPSBzZWxmLmlzU3dpcGluZztcclxuXHRcdHZhciBsZWZ0ICAgID0gc2VsZi5zbGlkZXJTdGFydFBvcy5sZWZ0IHx8IDA7XHJcblx0XHR2YXIgYW5nbGU7XHJcblxyXG5cdFx0aWYgKCBzd2lwaW5nID09PSB0cnVlICkge1xyXG5cclxuXHRcdFx0aWYgKCBNYXRoLmFicyggc2VsZi5kaXN0YW5jZSApID4gMTAgKSAge1xyXG5cclxuXHRcdFx0XHRzZWxmLmNhblRhcCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRpZiAoIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiAmJiBzZWxmLmluc3RhbmNlLm9wdHMudG91Y2gudmVydGljYWwgKSB7XHJcblx0XHRcdFx0XHRzZWxmLmlzU3dpcGluZyAgPSAneSc7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIHNlbGYuaW5zdGFuY2UuaXNTbGlkaW5nIHx8IHNlbGYuaW5zdGFuY2Uub3B0cy50b3VjaC52ZXJ0aWNhbCA9PT0gZmFsc2UgfHwgKCBzZWxmLmluc3RhbmNlLm9wdHMudG91Y2gudmVydGljYWwgPT09ICdhdXRvJyAmJiAkKCB3aW5kb3cgKS53aWR0aCgpID4gODAwICkgKSB7XHJcblx0XHRcdFx0XHRzZWxmLmlzU3dpcGluZyAgPSAneCc7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRhbmdsZSA9IE1hdGguYWJzKCBNYXRoLmF0YW4yKCBzZWxmLmRpc3RhbmNlWSwgc2VsZi5kaXN0YW5jZVggKSAqIDE4MCAvIE1hdGguUEkgKTtcclxuXHJcblx0XHRcdFx0XHRzZWxmLmlzU3dpcGluZyA9ICggYW5nbGUgPiA0NSAmJiBhbmdsZSA8IDEzNSApID8gJ3knIDogJ3gnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c2VsZi5pbnN0YW5jZS5pc1NsaWRpbmcgPSBzZWxmLmlzU3dpcGluZztcclxuXHJcblx0XHRcdFx0Ly8gUmVzZXQgcG9pbnRzIHRvIGF2b2lkIGp1bXBpbmcsIGJlY2F1c2Ugd2UgZHJvcHBlZCBmaXJzdCBzd2lwZXMgdG8gY2FsY3VsYXRlIHRoZSBhbmdsZVxyXG5cdFx0XHRcdHNlbGYuc3RhcnRQb2ludHMgPSBzZWxmLm5ld1BvaW50cztcclxuXHJcblx0XHRcdFx0JC5lYWNoKHNlbGYuaW5zdGFuY2Uuc2xpZGVzLCBmdW5jdGlvbiggaW5kZXgsIHNsaWRlICkge1xyXG5cdFx0XHRcdFx0JC5mYW5jeWJveC5zdG9wKCBzbGlkZS4kc2xpZGUgKTtcclxuXHJcblx0XHRcdFx0XHRzbGlkZS4kc2xpZGUuY3NzKCAndHJhbnNpdGlvbi1kdXJhdGlvbicsICcwbXMnICk7XHJcblxyXG5cdFx0XHRcdFx0c2xpZGUuaW5UcmFuc2l0aW9uID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBzbGlkZS5wb3MgPT09IHNlbGYuaW5zdGFuY2UuY3VycmVudC5wb3MgKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuc2xpZGVyU3RhcnRQb3MubGVmdCA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKCBzbGlkZS4kc2xpZGUgKS5sZWZ0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvL3NlbGYuaW5zdGFuY2UuY3VycmVudC5pc01vdmVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0Ly8gU3RvcCBzbGlkZXNob3dcclxuXHRcdFx0XHRpZiAoIHNlbGYuaW5zdGFuY2UuU2xpZGVTaG93ICYmIHNlbGYuaW5zdGFuY2UuU2xpZGVTaG93LmlzQWN0aXZlICkge1xyXG5cdFx0XHRcdFx0c2VsZi5pbnN0YW5jZS5TbGlkZVNob3cuc3RvcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRpZiAoIHN3aXBpbmcgPT0gJ3gnICkge1xyXG5cclxuXHRcdFx0XHQvLyBTdGlja3kgZWRnZXNcclxuXHRcdFx0XHRpZiAoIHNlbGYuZGlzdGFuY2VYID4gMCAmJiAoIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiB8fCAoIHNlbGYuaW5zdGFuY2UuY3VycmVudC5pbmRleCA9PT0gMCAmJiAhc2VsZi5pbnN0YW5jZS5jdXJyZW50Lm9wdHMubG9vcCApICkgKSB7XHJcblx0XHRcdFx0XHRsZWZ0ID0gbGVmdCArIE1hdGgucG93KCBzZWxmLmRpc3RhbmNlWCwgMC44ICk7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIHNlbGYuZGlzdGFuY2VYIDwgMCAmJiAoIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiB8fCAoIHNlbGYuaW5zdGFuY2UuY3VycmVudC5pbmRleCA9PT0gc2VsZi5pbnN0YW5jZS5ncm91cC5sZW5ndGggLSAxICYmICFzZWxmLmluc3RhbmNlLmN1cnJlbnQub3B0cy5sb29wICkgKSApIHtcclxuXHRcdFx0XHRcdGxlZnQgPSBsZWZ0IC0gTWF0aC5wb3coIC1zZWxmLmRpc3RhbmNlWCwgMC44ICk7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsZWZ0ID0gbGVmdCArIHNlbGYuZGlzdGFuY2VYO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYuc2xpZGVyTGFzdFBvcyA9IHtcclxuXHRcdFx0XHR0b3AgIDogc3dpcGluZyA9PSAneCcgPyAwIDogc2VsZi5zbGlkZXJTdGFydFBvcy50b3AgKyBzZWxmLmRpc3RhbmNlWSxcclxuXHRcdFx0XHRsZWZ0IDogbGVmdFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKCBzZWxmLnJlcXVlc3RJZCApIHtcclxuXHRcdFx0XHRjYW5jZWxBRnJhbWUoIHNlbGYucmVxdWVzdElkICk7XHJcblxyXG5cdFx0XHRcdHNlbGYucmVxdWVzdElkID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZi5yZXF1ZXN0SWQgPSByZXF1ZXN0QUZyYW1lKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHRpZiAoIHNlbGYuc2xpZGVyTGFzdFBvcyApIHtcclxuXHRcdFx0XHRcdCQuZWFjaChzZWxmLmluc3RhbmNlLnNsaWRlcywgZnVuY3Rpb24oIGluZGV4LCBzbGlkZSApIHtcclxuXHRcdFx0XHRcdFx0dmFyIHBvcyA9IHNsaWRlLnBvcyAtIHNlbGYuaW5zdGFuY2UuY3VyclBvcztcclxuXHJcblx0XHRcdFx0XHRcdCQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCBzbGlkZS4kc2xpZGUsIHtcclxuXHRcdFx0XHRcdFx0XHR0b3AgIDogc2VsZi5zbGlkZXJMYXN0UG9zLnRvcCxcclxuXHRcdFx0XHRcdFx0XHRsZWZ0IDogc2VsZi5zbGlkZXJMYXN0UG9zLmxlZnQgKyAoIHBvcyAqIHNlbGYuY2FudmFzV2lkdGggKSArICggcG9zICogc2xpZGUub3B0cy5ndXR0ZXIgKVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcyggJ2ZhbmN5Ym94LWlzLXNsaWRpbmcnICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLm9uUGFuID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdHZhciBuZXdPZmZzZXRYLCBuZXdPZmZzZXRZLCBuZXdQb3M7XHJcblxyXG5cdFx0c2VsZi5jYW5UYXAgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAoIHNlbGYuY29udGVudFN0YXJ0UG9zLndpZHRoID4gc2VsZi5jYW52YXNXaWR0aCApIHtcclxuXHRcdFx0bmV3T2Zmc2V0WCA9IHNlbGYuY29udGVudFN0YXJ0UG9zLmxlZnQgKyBzZWxmLmRpc3RhbmNlWDtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRuZXdPZmZzZXRYID0gc2VsZi5jb250ZW50U3RhcnRQb3MubGVmdDtcclxuXHRcdH1cclxuXHJcblx0XHRuZXdPZmZzZXRZID0gc2VsZi5jb250ZW50U3RhcnRQb3MudG9wICsgc2VsZi5kaXN0YW5jZVk7XHJcblxyXG5cdFx0bmV3UG9zID0gc2VsZi5saW1pdE1vdmVtZW50KCBuZXdPZmZzZXRYLCBuZXdPZmZzZXRZLCBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aCwgc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0ICk7XHJcblxyXG5cdFx0bmV3UG9zLnNjYWxlWCA9IHNlbGYuY29udGVudFN0YXJ0UG9zLnNjYWxlWDtcclxuXHRcdG5ld1Bvcy5zY2FsZVkgPSBzZWxmLmNvbnRlbnRTdGFydFBvcy5zY2FsZVk7XHJcblxyXG5cdFx0c2VsZi5jb250ZW50TGFzdFBvcyA9IG5ld1BvcztcclxuXHJcblx0XHRpZiAoIHNlbGYucmVxdWVzdElkICkge1xyXG5cdFx0XHRjYW5jZWxBRnJhbWUoIHNlbGYucmVxdWVzdElkICk7XHJcblxyXG5cdFx0XHRzZWxmLnJlcXVlc3RJZCA9IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5yZXF1ZXN0SWQgPSByZXF1ZXN0QUZyYW1lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZSggc2VsZi4kY29udGVudCwgc2VsZi5jb250ZW50TGFzdFBvcyApO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Ly8gTWFrZSBwYW5uaW5nIHN0aWNreSB0byB0aGUgZWRnZXNcclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLmxpbWl0TW92ZW1lbnQgPSBmdW5jdGlvbiggbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3V2lkdGgsIG5ld0hlaWdodCApIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIG1pblRyYW5zbGF0ZVgsIG1pblRyYW5zbGF0ZVksIG1heFRyYW5zbGF0ZVgsIG1heFRyYW5zbGF0ZVk7XHJcblxyXG5cdFx0dmFyIGNhbnZhc1dpZHRoICA9IHNlbGYuY2FudmFzV2lkdGg7XHJcblx0XHR2YXIgY2FudmFzSGVpZ2h0ID0gc2VsZi5jYW52YXNIZWlnaHQ7XHJcblxyXG5cdFx0dmFyIGN1cnJlbnRPZmZzZXRYID0gc2VsZi5jb250ZW50U3RhcnRQb3MubGVmdDtcclxuXHRcdHZhciBjdXJyZW50T2Zmc2V0WSA9IHNlbGYuY29udGVudFN0YXJ0UG9zLnRvcDtcclxuXHJcblx0XHR2YXIgZGlzdGFuY2VYID0gc2VsZi5kaXN0YW5jZVg7XHJcblx0XHR2YXIgZGlzdGFuY2VZID0gc2VsZi5kaXN0YW5jZVk7XHJcblxyXG5cdFx0Ly8gU2xvdyBkb3duIHByb3BvcnRpb25hbGx5IHRvIHRyYXZlbGVkIGRpc3RhbmNlXHJcblxyXG5cdFx0bWluVHJhbnNsYXRlWCA9IE1hdGgubWF4KDAsIGNhbnZhc1dpZHRoICAqIDAuNSAtIG5ld1dpZHRoICAqIDAuNSApO1xyXG5cdFx0bWluVHJhbnNsYXRlWSA9IE1hdGgubWF4KDAsIGNhbnZhc0hlaWdodCAqIDAuNSAtIG5ld0hlaWdodCAqIDAuNSApO1xyXG5cclxuXHRcdG1heFRyYW5zbGF0ZVggPSBNYXRoLm1pbiggY2FudmFzV2lkdGggIC0gbmV3V2lkdGgsICBjYW52YXNXaWR0aCAgKiAwLjUgLSBuZXdXaWR0aCAgKiAwLjUgKTtcclxuXHRcdG1heFRyYW5zbGF0ZVkgPSBNYXRoLm1pbiggY2FudmFzSGVpZ2h0IC0gbmV3SGVpZ2h0LCBjYW52YXNIZWlnaHQgKiAwLjUgLSBuZXdIZWlnaHQgKiAwLjUgKTtcclxuXHJcblx0XHRpZiAoIG5ld1dpZHRoID4gY2FudmFzV2lkdGggKSB7XHJcblxyXG5cdFx0XHQvLyAgIC0+XHJcblx0XHRcdGlmICggZGlzdGFuY2VYID4gMCAmJiBuZXdPZmZzZXRYID4gbWluVHJhbnNsYXRlWCApIHtcclxuXHRcdFx0XHRuZXdPZmZzZXRYID0gbWluVHJhbnNsYXRlWCAtIDEgKyBNYXRoLnBvdyggLW1pblRyYW5zbGF0ZVggKyBjdXJyZW50T2Zmc2V0WCArIGRpc3RhbmNlWCwgMC44ICkgfHwgMDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gICAgPC1cclxuXHRcdFx0aWYgKCBkaXN0YW5jZVggIDwgMCAmJiBuZXdPZmZzZXRYIDwgbWF4VHJhbnNsYXRlWCApIHtcclxuXHRcdFx0XHRuZXdPZmZzZXRYID0gbWF4VHJhbnNsYXRlWCArIDEgLSBNYXRoLnBvdyggbWF4VHJhbnNsYXRlWCAtIGN1cnJlbnRPZmZzZXRYIC0gZGlzdGFuY2VYLCAwLjggKSB8fCAwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggbmV3SGVpZ2h0ID4gY2FudmFzSGVpZ2h0ICkge1xyXG5cclxuXHRcdFx0Ly8gICBcXC9cclxuXHRcdFx0aWYgKCBkaXN0YW5jZVkgPiAwICYmIG5ld09mZnNldFkgPiBtaW5UcmFuc2xhdGVZICkge1xyXG5cdFx0XHRcdG5ld09mZnNldFkgPSBtaW5UcmFuc2xhdGVZIC0gMSArIE1hdGgucG93KC1taW5UcmFuc2xhdGVZICsgY3VycmVudE9mZnNldFkgKyBkaXN0YW5jZVksIDAuOCApIHx8IDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vICAgL1xcXHJcblx0XHRcdGlmICggZGlzdGFuY2VZIDwgMCAmJiBuZXdPZmZzZXRZIDwgbWF4VHJhbnNsYXRlWSApIHtcclxuXHRcdFx0XHRuZXdPZmZzZXRZID0gbWF4VHJhbnNsYXRlWSArIDEgLSBNYXRoLnBvdyAoIG1heFRyYW5zbGF0ZVkgLSBjdXJyZW50T2Zmc2V0WSAtIGRpc3RhbmNlWSwgMC44ICkgfHwgMDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR0b3AgIDogbmV3T2Zmc2V0WSxcclxuXHRcdFx0bGVmdCA6IG5ld09mZnNldFhcclxuXHRcdH07XHJcblxyXG5cdH07XHJcblxyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLmxpbWl0UG9zaXRpb24gPSBmdW5jdGlvbiggbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3V2lkdGgsIG5ld0hlaWdodCApIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIGNhbnZhc1dpZHRoICA9IHNlbGYuY2FudmFzV2lkdGg7XHJcblx0XHR2YXIgY2FudmFzSGVpZ2h0ID0gc2VsZi5jYW52YXNIZWlnaHQ7XHJcblxyXG5cdFx0aWYgKCBuZXdXaWR0aCA+IGNhbnZhc1dpZHRoICkge1xyXG5cdFx0XHRuZXdPZmZzZXRYID0gbmV3T2Zmc2V0WCA+IDAgPyAwIDogbmV3T2Zmc2V0WDtcclxuXHRcdFx0bmV3T2Zmc2V0WCA9IG5ld09mZnNldFggPCBjYW52YXNXaWR0aCAtIG5ld1dpZHRoID8gY2FudmFzV2lkdGggLSBuZXdXaWR0aCA6IG5ld09mZnNldFg7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdC8vIENlbnRlciBob3Jpem9udGFsbHlcclxuXHRcdFx0bmV3T2Zmc2V0WCA9IE1hdGgubWF4KCAwLCBjYW52YXNXaWR0aCAvIDIgLSBuZXdXaWR0aCAvIDIgKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBuZXdIZWlnaHQgPiBjYW52YXNIZWlnaHQgKSB7XHJcblx0XHRcdG5ld09mZnNldFkgPSBuZXdPZmZzZXRZID4gMCA/IDAgOiBuZXdPZmZzZXRZO1xyXG5cdFx0XHRuZXdPZmZzZXRZID0gbmV3T2Zmc2V0WSA8IGNhbnZhc0hlaWdodCAtIG5ld0hlaWdodCA/IGNhbnZhc0hlaWdodCAtIG5ld0hlaWdodCA6IG5ld09mZnNldFk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdC8vIENlbnRlciB2ZXJ0aWNhbGx5XHJcblx0XHRcdG5ld09mZnNldFkgPSBNYXRoLm1heCggMCwgY2FudmFzSGVpZ2h0IC8gMiAtIG5ld0hlaWdodCAvIDIgKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0dG9wICA6IG5ld09mZnNldFksXHJcblx0XHRcdGxlZnQgOiBuZXdPZmZzZXRYXHJcblx0XHR9O1xyXG5cclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLm9uWm9vbSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHQvLyBDYWxjdWxhdGUgY3VycmVudCBkaXN0YW5jZSBiZXR3ZWVuIHBvaW50cyB0byBnZXQgcGluY2ggcmF0aW8gYW5kIG5ldyB3aWR0aCBhbmQgaGVpZ2h0XHJcblxyXG5cdFx0dmFyIGN1cnJlbnRXaWR0aCAgPSBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aDtcclxuXHRcdHZhciBjdXJyZW50SGVpZ2h0ID0gc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0O1xyXG5cclxuXHRcdHZhciBjdXJyZW50T2Zmc2V0WCA9IHNlbGYuY29udGVudFN0YXJ0UG9zLmxlZnQ7XHJcblx0XHR2YXIgY3VycmVudE9mZnNldFkgPSBzZWxmLmNvbnRlbnRTdGFydFBvcy50b3A7XHJcblxyXG5cdFx0dmFyIGVuZERpc3RhbmNlQmV0d2VlbkZpbmdlcnMgPSBkaXN0YW5jZSggc2VsZi5uZXdQb2ludHNbMF0sIHNlbGYubmV3UG9pbnRzWzFdICk7XHJcblxyXG5cdFx0dmFyIHBpbmNoUmF0aW8gPSBlbmREaXN0YW5jZUJldHdlZW5GaW5nZXJzIC8gc2VsZi5zdGFydERpc3RhbmNlQmV0d2VlbkZpbmdlcnM7XHJcblxyXG5cdFx0dmFyIG5ld1dpZHRoICA9IE1hdGguZmxvb3IoIGN1cnJlbnRXaWR0aCAgKiBwaW5jaFJhdGlvICk7XHJcblx0XHR2YXIgbmV3SGVpZ2h0ID0gTWF0aC5mbG9vciggY3VycmVudEhlaWdodCAqIHBpbmNoUmF0aW8gKTtcclxuXHJcblx0XHQvLyBUaGlzIGlzIHRoZSB0cmFuc2xhdGlvbiBkdWUgdG8gcGluY2gtem9vbWluZ1xyXG5cdFx0dmFyIHRyYW5zbGF0ZUZyb21ab29taW5nWCA9IChjdXJyZW50V2lkdGggIC0gbmV3V2lkdGgpICAqIHNlbGYucGVyY2VudGFnZU9mSW1hZ2VBdFBpbmNoUG9pbnRYO1xyXG5cdFx0dmFyIHRyYW5zbGF0ZUZyb21ab29taW5nWSA9IChjdXJyZW50SGVpZ2h0IC0gbmV3SGVpZ2h0KSAqIHNlbGYucGVyY2VudGFnZU9mSW1hZ2VBdFBpbmNoUG9pbnRZO1xyXG5cclxuXHRcdC8vUG9pbnQgYmV0d2VlbiB0aGUgdHdvIHRvdWNoZXNcclxuXHJcblx0XHR2YXIgY2VudGVyUG9pbnRFbmRYID0gKChzZWxmLm5ld1BvaW50c1swXS54ICsgc2VsZi5uZXdQb2ludHNbMV0ueCkgLyAyKSAtICQod2luZG93KS5zY3JvbGxMZWZ0KCk7XHJcblx0XHR2YXIgY2VudGVyUG9pbnRFbmRZID0gKChzZWxmLm5ld1BvaW50c1swXS55ICsgc2VsZi5uZXdQb2ludHNbMV0ueSkgLyAyKSAtICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHQvLyBBbmQgdGhpcyBpcyB0aGUgdHJhbnNsYXRpb24gZHVlIHRvIHRyYW5zbGF0aW9uIG9mIHRoZSBjZW50ZXJwb2ludFxyXG5cdFx0Ly8gYmV0d2VlbiB0aGUgdHdvIGZpbmdlcnNcclxuXHJcblx0XHR2YXIgdHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWCA9IGNlbnRlclBvaW50RW5kWCAtIHNlbGYuY2VudGVyUG9pbnRTdGFydFg7XHJcblx0XHR2YXIgdHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWSA9IGNlbnRlclBvaW50RW5kWSAtIHNlbGYuY2VudGVyUG9pbnRTdGFydFk7XHJcblxyXG5cdFx0Ly8gVGhlIG5ldyBvZmZzZXQgaXMgdGhlIG9sZC9jdXJyZW50IG9uZSBwbHVzIHRoZSB0b3RhbCB0cmFuc2xhdGlvblxyXG5cclxuXHRcdHZhciBuZXdPZmZzZXRYID0gY3VycmVudE9mZnNldFggKyAoIHRyYW5zbGF0ZUZyb21ab29taW5nWCArIHRyYW5zbGF0ZUZyb21UcmFuc2xhdGluZ1ggKTtcclxuXHRcdHZhciBuZXdPZmZzZXRZID0gY3VycmVudE9mZnNldFkgKyAoIHRyYW5zbGF0ZUZyb21ab29taW5nWSArIHRyYW5zbGF0ZUZyb21UcmFuc2xhdGluZ1kgKTtcclxuXHJcblx0XHR2YXIgbmV3UG9zID0ge1xyXG5cdFx0XHR0b3AgICAgOiBuZXdPZmZzZXRZLFxyXG5cdFx0XHRsZWZ0ICAgOiBuZXdPZmZzZXRYLFxyXG5cdFx0XHRzY2FsZVggOiBzZWxmLmNvbnRlbnRTdGFydFBvcy5zY2FsZVggKiBwaW5jaFJhdGlvLFxyXG5cdFx0XHRzY2FsZVkgOiBzZWxmLmNvbnRlbnRTdGFydFBvcy5zY2FsZVkgKiBwaW5jaFJhdGlvXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYuY2FuVGFwID0gZmFsc2U7XHJcblxyXG5cdFx0c2VsZi5uZXdXaWR0aCAgPSBuZXdXaWR0aDtcclxuXHRcdHNlbGYubmV3SGVpZ2h0ID0gbmV3SGVpZ2h0O1xyXG5cclxuXHRcdHNlbGYuY29udGVudExhc3RQb3MgPSBuZXdQb3M7XHJcblxyXG5cdFx0aWYgKCBzZWxmLnJlcXVlc3RJZCApIHtcclxuXHRcdFx0Y2FuY2VsQUZyYW1lKCBzZWxmLnJlcXVlc3RJZCApO1xyXG5cclxuXHRcdFx0c2VsZi5yZXF1ZXN0SWQgPSBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYucmVxdWVzdElkID0gcmVxdWVzdEFGcmFtZShmdW5jdGlvbigpIHtcclxuXHRcdFx0JC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoIHNlbGYuJGNvbnRlbnQsIHNlbGYuY29udGVudExhc3RQb3MgKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLm9udG91Y2hlbmQgPSBmdW5jdGlvbiggZSApIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZE1zICA9IE1hdGgubWF4KCAobmV3IERhdGUoKS5nZXRUaW1lKCkgKSAtIHNlbGYuc3RhcnRUaW1lLCAxKTtcclxuXHJcblx0XHR2YXIgc3dpcGluZyA9IHNlbGYuaXNTd2lwaW5nO1xyXG5cdFx0dmFyIHBhbm5pbmcgPSBzZWxmLmlzUGFubmluZztcclxuXHRcdHZhciB6b29taW5nID0gc2VsZi5pc1pvb21pbmc7XHJcblxyXG5cdFx0c2VsZi5lbmRQb2ludHMgPSBwb2ludGVycyggZSApO1xyXG5cclxuXHRcdHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWNvbnRyb2xzLS1pc0dyYWJiaW5nJyApO1xyXG5cclxuXHRcdCQoZG9jdW1lbnQpLm9mZiggJy5mYi50b3VjaCcgKTtcclxuXHJcblx0XHRpZiAoIHNlbGYucmVxdWVzdElkICkge1xyXG5cdFx0XHRjYW5jZWxBRnJhbWUoIHNlbGYucmVxdWVzdElkICk7XHJcblxyXG5cdFx0XHRzZWxmLnJlcXVlc3RJZCA9IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5pc1N3aXBpbmcgPSBmYWxzZTtcclxuXHRcdHNlbGYuaXNQYW5uaW5nID0gZmFsc2U7XHJcblx0XHRzZWxmLmlzWm9vbWluZyA9IGZhbHNlO1xyXG5cclxuXHRcdGlmICggc2VsZi5jYW5UYXAgKSAge1xyXG5cdFx0XHRyZXR1cm4gc2VsZi5vblRhcCggZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuc3BlZWQgPSAzNjY7XHJcblxyXG5cdFx0Ly8gU3BlZWQgaW4gcHgvbXNcclxuXHRcdHNlbGYudmVsb2NpdHlYID0gc2VsZi5kaXN0YW5jZVggLyBkTXMgKiAwLjU7XHJcblx0XHRzZWxmLnZlbG9jaXR5WSA9IHNlbGYuZGlzdGFuY2VZIC8gZE1zICogMC41O1xyXG5cclxuXHRcdHNlbGYuc3BlZWRYID0gTWF0aC5tYXgoIHNlbGYuc3BlZWQgKiAwLjUsIE1hdGgubWluKCBzZWxmLnNwZWVkICogMS41LCAoIDEgLyBNYXRoLmFicyggc2VsZi52ZWxvY2l0eVggKSApICogc2VsZi5zcGVlZCApICk7XHJcblxyXG5cdFx0aWYgKCBwYW5uaW5nICkge1xyXG5cdFx0XHRzZWxmLmVuZFBhbm5pbmcoKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKCB6b29taW5nICkge1xyXG5cdFx0XHRzZWxmLmVuZFpvb21pbmcoKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWxmLmVuZFN3aXBpbmcoIHN3aXBpbmcgKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm47XHJcblx0fTtcclxuXHJcblx0R3Vlc3R1cmVzLnByb3RvdHlwZS5lbmRTd2lwaW5nID0gZnVuY3Rpb24oIHN3aXBpbmcgKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0dmFyIHJldCA9IGZhbHNlO1xyXG5cclxuXHRcdHNlbGYuaW5zdGFuY2UuaXNTbGlkaW5nID0gZmFsc2U7XHJcblx0XHRzZWxmLnNsaWRlckxhc3RQb3MgICAgICA9IG51bGw7XHJcblxyXG5cdFx0Ly8gQ2xvc2UgaWYgc3dpcGVkIHZlcnRpY2FsbHkgLyBuYXZpZ2F0ZSBpZiBob3Jpem9udGFsbHlcclxuXHRcdGlmICggc3dpcGluZyA9PSAneScgJiYgTWF0aC5hYnMoIHNlbGYuZGlzdGFuY2VZICkgPiA1MCApIHtcclxuXHJcblx0XHRcdC8vIENvbnRpbnVlIHZlcnRpY2FsIG1vdmVtZW50XHJcblx0XHRcdCQuZmFuY3lib3guYW5pbWF0ZSggc2VsZi5pbnN0YW5jZS5jdXJyZW50LiRzbGlkZSwge1xyXG5cdFx0XHRcdHRvcCAgICAgOiBzZWxmLnNsaWRlclN0YXJ0UG9zLnRvcCArIHNlbGYuZGlzdGFuY2VZICsgKCBzZWxmLnZlbG9jaXR5WSAqIDE1MCApLFxyXG5cdFx0XHRcdG9wYWNpdHkgOiAwXHJcblx0XHRcdH0sIDE1MCApO1xyXG5cclxuXHRcdFx0cmV0ID0gc2VsZi5pbnN0YW5jZS5jbG9zZSggdHJ1ZSwgMzAwICk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICggc3dpcGluZyA9PSAneCcgJiYgc2VsZi5kaXN0YW5jZVggPiA1MCAmJiBzZWxmLmluc3RhbmNlLmdyb3VwLmxlbmd0aCA+IDEgKSB7XHJcblx0XHRcdHJldCA9IHNlbGYuaW5zdGFuY2UucHJldmlvdXMoIHNlbGYuc3BlZWRYICk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICggc3dpcGluZyA9PSAneCcgJiYgc2VsZi5kaXN0YW5jZVggPCAtNTAgICYmIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoID4gMSApIHtcclxuXHRcdFx0cmV0ID0gc2VsZi5pbnN0YW5jZS5uZXh0KCBzZWxmLnNwZWVkWCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggcmV0ID09PSBmYWxzZSAmJiAoIHN3aXBpbmcgPT0gJ3gnIHx8IHN3aXBpbmcgPT0gJ3knICkgKSB7XHJcblx0XHRcdHNlbGYuaW5zdGFuY2UuanVtcFRvKCBzZWxmLmluc3RhbmNlLmN1cnJlbnQuaW5kZXgsIDE1MCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWlzLXNsaWRpbmcnICk7XHJcblxyXG5cdH07XHJcblxyXG5cdC8vIExpbWl0IHBhbm5pbmcgZnJvbSBlZGdlc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLmVuZFBhbm5pbmcgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3UG9zO1xyXG5cclxuXHRcdGlmICggIXNlbGYuY29udGVudExhc3RQb3MgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHNlbGYuaW5zdGFuY2UuY3VycmVudC5vcHRzLnRvdWNoLm1vbWVudHVtID09PSBmYWxzZSApIHtcclxuXHRcdFx0bmV3T2Zmc2V0WCA9IHNlbGYuY29udGVudExhc3RQb3MubGVmdDtcclxuXHRcdFx0bmV3T2Zmc2V0WSA9IHNlbGYuY29udGVudExhc3RQb3MudG9wO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHQvLyBDb250aW51ZSBtb3ZlbWVudFxyXG5cdFx0XHRuZXdPZmZzZXRYID0gc2VsZi5jb250ZW50TGFzdFBvcy5sZWZ0ICsgKCBzZWxmLnZlbG9jaXR5WCAqIHNlbGYuc3BlZWQgKTtcclxuXHRcdFx0bmV3T2Zmc2V0WSA9IHNlbGYuY29udGVudExhc3RQb3MudG9wICArICggc2VsZi52ZWxvY2l0eVkgKiBzZWxmLnNwZWVkICk7XHJcblx0XHR9XHJcblxyXG5cdFx0bmV3UG9zID0gc2VsZi5saW1pdFBvc2l0aW9uKCBuZXdPZmZzZXRYLCBuZXdPZmZzZXRZLCBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aCwgc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0ICk7XHJcblxyXG5cdFx0IG5ld1Bvcy53aWR0aCAgPSBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aDtcclxuXHRcdCBuZXdQb3MuaGVpZ2h0ID0gc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0O1xyXG5cclxuXHRcdCQuZmFuY3lib3guYW5pbWF0ZSggc2VsZi4kY29udGVudCwgbmV3UG9zLCAzMzAgKTtcclxuXHR9O1xyXG5cclxuXHJcblx0R3Vlc3R1cmVzLnByb3RvdHlwZS5lbmRab29taW5nID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdHZhciBjdXJyZW50ID0gc2VsZi5pbnN0YW5jZS5jdXJyZW50O1xyXG5cclxuXHRcdHZhciBuZXdPZmZzZXRYLCBuZXdPZmZzZXRZLCBuZXdQb3MsIHJlc2V0O1xyXG5cclxuXHRcdHZhciBuZXdXaWR0aCAgPSBzZWxmLm5ld1dpZHRoO1xyXG5cdFx0dmFyIG5ld0hlaWdodCA9IHNlbGYubmV3SGVpZ2h0O1xyXG5cclxuXHRcdGlmICggIXNlbGYuY29udGVudExhc3RQb3MgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRuZXdPZmZzZXRYID0gc2VsZi5jb250ZW50TGFzdFBvcy5sZWZ0O1xyXG5cdFx0bmV3T2Zmc2V0WSA9IHNlbGYuY29udGVudExhc3RQb3MudG9wO1xyXG5cclxuXHRcdHJlc2V0ID0ge1xyXG5cdFx0ICAgXHR0b3AgICAgOiBuZXdPZmZzZXRZLFxyXG5cdFx0ICAgXHRsZWZ0ICAgOiBuZXdPZmZzZXRYLFxyXG5cdFx0ICAgXHR3aWR0aCAgOiBuZXdXaWR0aCxcclxuXHRcdCAgIFx0aGVpZ2h0IDogbmV3SGVpZ2h0LFxyXG5cdFx0XHRzY2FsZVggOiAxLFxyXG5cdFx0XHRzY2FsZVkgOiAxXHJcblx0ICAgfTtcclxuXHJcblx0ICAgLy8gUmVzZXQgc2NhbGV4L3NjYWxlWSB2YWx1ZXM7IHRoaXMgaGVscHMgZm9yIHBlcmZvbWFuY2UgYW5kIGRvZXMgbm90IGJyZWFrIGFuaW1hdGlvblxyXG5cdCAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCBzZWxmLiRjb250ZW50LCByZXNldCApO1xyXG5cclxuXHRcdGlmICggbmV3V2lkdGggPCBzZWxmLmNhbnZhc1dpZHRoICYmIG5ld0hlaWdodCA8IHNlbGYuY2FudmFzSGVpZ2h0ICkge1xyXG5cdFx0XHRzZWxmLmluc3RhbmNlLnNjYWxlVG9GaXQoIDE1MCApO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAoIG5ld1dpZHRoID4gY3VycmVudC53aWR0aCB8fCBuZXdIZWlnaHQgPiBjdXJyZW50LmhlaWdodCApIHtcclxuXHRcdFx0c2VsZi5pbnN0YW5jZS5zY2FsZVRvQWN0dWFsKCBzZWxmLmNlbnRlclBvaW50U3RhcnRYLCBzZWxmLmNlbnRlclBvaW50U3RhcnRZLCAxNTAgKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0bmV3UG9zID0gc2VsZi5saW1pdFBvc2l0aW9uKCBuZXdPZmZzZXRYLCBuZXdPZmZzZXRZLCBuZXdXaWR0aCwgbmV3SGVpZ2h0ICk7XHJcblxyXG5cdFx0XHQvLyBTd2l0Y2ggZnJvbSBzY2FsZSgpIHRvIHdpZHRoL2hlaWdodCBvciBhbmltYXRpb24gd2lsbCBub3Qgd29yayBjb3JyZWN0bHlcclxuXHRcdFx0JC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoIHNlbGYuY29udGVudCwgJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoIHNlbGYuJGNvbnRlbnQgKSApO1xyXG5cclxuXHRcdFx0JC5mYW5jeWJveC5hbmltYXRlKCBzZWxmLiRjb250ZW50LCBuZXdQb3MsIDE1MCApO1xyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLm9uVGFwID0gZnVuY3Rpb24oZSkge1xyXG5cdFx0dmFyIHNlbGYgICAgPSB0aGlzO1xyXG5cdFx0dmFyICR0YXJnZXQgPSAkKCBlLnRhcmdldCApO1xyXG5cclxuXHRcdHZhciBpbnN0YW5jZSA9IHNlbGYuaW5zdGFuY2U7XHJcblx0XHR2YXIgY3VycmVudCAgPSBpbnN0YW5jZS5jdXJyZW50O1xyXG5cclxuXHRcdHZhciBlbmRQb2ludHMgPSAoIGUgJiYgcG9pbnRlcnMoIGUgKSApIHx8IHNlbGYuc3RhcnRQb2ludHM7XHJcblxyXG5cdFx0dmFyIHRhcFggPSBlbmRQb2ludHNbMF0gPyBlbmRQb2ludHNbMF0ueCAtIHNlbGYuJHN0YWdlLm9mZnNldCgpLmxlZnQgOiAwO1xyXG5cdFx0dmFyIHRhcFkgPSBlbmRQb2ludHNbMF0gPyBlbmRQb2ludHNbMF0ueSAtIHNlbGYuJHN0YWdlLm9mZnNldCgpLnRvcCAgOiAwO1xyXG5cclxuXHRcdHZhciB3aGVyZTtcclxuXHJcblx0XHR2YXIgcHJvY2VzcyA9IGZ1bmN0aW9uICggcHJlZml4ICkge1xyXG5cclxuXHRcdFx0dmFyIGFjdGlvbiA9IGN1cnJlbnQub3B0c1sgcHJlZml4IF07XHJcblxyXG5cdFx0XHRpZiAoICQuaXNGdW5jdGlvbiggYWN0aW9uICkgKSB7XHJcblx0XHRcdFx0YWN0aW9uID0gYWN0aW9uLmFwcGx5KCBpbnN0YW5jZSwgWyBjdXJyZW50LCBlIF0gKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCAhYWN0aW9uKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRzd2l0Y2ggKCBhY3Rpb24gKSB7XHJcblxyXG5cdFx0XHRcdGNhc2UgXCJjbG9zZVwiIDpcclxuXHJcblx0XHRcdFx0XHRpbnN0YW5jZS5jbG9zZSggc2VsZi5zdGFydEV2ZW50ICk7XHJcblxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlIFwidG9nZ2xlQ29udHJvbHNcIiA6XHJcblxyXG5cdFx0XHRcdFx0aW5zdGFuY2UudG9nZ2xlQ29udHJvbHMoIHRydWUgKTtcclxuXHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgXCJuZXh0XCIgOlxyXG5cclxuXHRcdFx0XHRcdGluc3RhbmNlLm5leHQoKTtcclxuXHJcblx0XHRcdFx0YnJlYWs7XHJcblxyXG5cdFx0XHRcdGNhc2UgXCJuZXh0T3JDbG9zZVwiIDpcclxuXHJcblx0XHRcdFx0XHRpZiAoIGluc3RhbmNlLmdyb3VwLmxlbmd0aCA+IDEgKSB7XHJcblx0XHRcdFx0XHRcdGluc3RhbmNlLm5leHQoKTtcclxuXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5jbG9zZSggc2VsZi5zdGFydEV2ZW50ICk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlIFwiem9vbVwiIDpcclxuXHJcblx0XHRcdFx0XHRpZiAoIGN1cnJlbnQudHlwZSA9PSAnaW1hZ2UnICYmICggY3VycmVudC5pc0xvYWRlZCB8fCBjdXJyZW50LiRnaG9zdCApICkge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCBpbnN0YW5jZS5jYW5QYW4oKSApIHtcclxuXHRcdFx0XHRcdFx0XHRpbnN0YW5jZS5zY2FsZVRvRml0KCk7XHJcblxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCBpbnN0YW5jZS5pc1NjYWxlZERvd24oKSApIHtcclxuXHRcdFx0XHRcdFx0XHRpbnN0YW5jZS5zY2FsZVRvQWN0dWFsKCB0YXBYLCB0YXBZICk7XHJcblxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKCBpbnN0YW5jZS5ncm91cC5sZW5ndGggPCAyICkge1xyXG5cdFx0XHRcdFx0XHRcdGluc3RhbmNlLmNsb3NlKCBzZWxmLnN0YXJ0RXZlbnQgKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRicmVhaztcclxuXHRcdFx0fVxyXG5cclxuXHRcdH07XHJcblxyXG5cdFx0Ly8gSWdub3JlIHJpZ2h0IGNsaWNrXHJcblx0XHRpZiAoIGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQuYnV0dG9uID09IDIgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBTa2lwIGlmIGN1cnJlbnQgc2xpZGUgaXMgbm90IGluIHRoZSBjZW50ZXJcclxuXHRcdGlmICggaW5zdGFuY2UuaXNTbGlkaW5nICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2tpcCBpZiBjbGlja2VkIG9uIHRoZSBzY3JvbGxiYXJcclxuXHRcdGlmICggdGFwWCA+ICR0YXJnZXRbMF0uY2xpZW50V2lkdGggKyAkdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDaGVjayB3aGVyZSBpcyBjbGlja2VkXHJcblx0XHRpZiAoICR0YXJnZXQuaXMoICcuZmFuY3lib3gtYmcsLmZhbmN5Ym94LWlubmVyLC5mYW5jeWJveC1vdXRlciwuZmFuY3lib3gtY29udGFpbmVyJyApICkge1xyXG5cdFx0XHR3aGVyZSA9ICdPdXRzaWRlJztcclxuXHJcblx0XHR9IGVsc2UgaWYgKCAkdGFyZ2V0LmlzKCAnLmZhbmN5Ym94LXNsaWRlJyApICkge1xyXG5cdFx0XHR3aGVyZSA9ICdTbGlkZSc7XHJcblxyXG5cdFx0fSBlbHNlIGlmICAoIGluc3RhbmNlLmN1cnJlbnQuJGNvbnRlbnQgJiYgaW5zdGFuY2UuY3VycmVudC4kY29udGVudC5oYXMoIGUudGFyZ2V0ICkubGVuZ3RoICkge1xyXG5cdFx0IFx0d2hlcmUgPSAnQ29udGVudCc7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGlmIHRoaXMgaXMgYSBkb3VibGUgdGFwXHJcblx0XHRpZiAoIHNlbGYudGFwcGVkICkge1xyXG5cclxuXHRcdFx0Ly8gU3RvcCBwcmV2aW91c2x5IGNyZWF0ZWQgc2luZ2xlIHRhcFxyXG5cdFx0XHRjbGVhclRpbWVvdXQoIHNlbGYudGFwcGVkICk7XHJcblx0XHRcdHNlbGYudGFwcGVkID0gbnVsbDtcclxuXHJcblx0XHRcdC8vIFNraXAgaWYgZGlzdGFuY2UgYmV0d2VlbiB0YXBzIGlzIHRvbyBiaWdcclxuXHRcdFx0aWYgKCBNYXRoLmFicyggdGFwWCAtIHNlbGYudGFwWCApID4gNTAgfHwgTWF0aC5hYnMoIHRhcFkgLSBzZWxmLnRhcFkgKSA+IDUwIHx8IGluc3RhbmNlLmlzU2xpZGluZyApIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gT0ssIG5vdyB3ZSBhc3N1bWUgdGhhdCB0aGlzIGlzIGEgZG91YmxlLXRhcFxyXG5cdFx0XHRwcm9jZXNzKCAnZGJsY2xpY2snICsgd2hlcmUgKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0Ly8gU2luZ2xlIHRhcCB3aWxsIGJlIHByb2Nlc3NlZCBpZiB1c2VyIGhhcyBub3QgY2xpY2tlZCBzZWNvbmQgdGltZSB3aXRoaW4gMzAwbXNcclxuXHRcdFx0Ly8gb3IgdGhlcmUgaXMgbm8gbmVlZCB0byB3YWl0IGZvciBkb3VibGUtdGFwXHJcblx0XHRcdHNlbGYudGFwWCA9IHRhcFg7XHJcblx0XHRcdHNlbGYudGFwWSA9IHRhcFk7XHJcblxyXG5cdFx0XHRpZiAoIGN1cnJlbnQub3B0c1sgJ2RibGNsaWNrJyArIHdoZXJlIF0gJiYgY3VycmVudC5vcHRzWyAnZGJsY2xpY2snICsgd2hlcmUgXSAhPT0gY3VycmVudC5vcHRzWyAnY2xpY2snICsgd2hlcmUgXSApIHtcclxuXHRcdFx0XHRzZWxmLnRhcHBlZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzZWxmLnRhcHBlZCA9IG51bGw7XHJcblxyXG5cdFx0XHRcdFx0cHJvY2VzcyggJ2NsaWNrJyArIHdoZXJlICk7XHJcblxyXG5cdFx0XHRcdH0sIDMwMCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHByb2Nlc3MoICdjbGljaycgKyB3aGVyZSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH07XHJcblxyXG5cdCQoZG9jdW1lbnQpLm9uKCdvbkFjdGl2YXRlLmZiJywgZnVuY3Rpb24gKGUsIGluc3RhbmNlKSB7XHJcblx0XHRpZiAoIGluc3RhbmNlICYmICFpbnN0YW5jZS5HdWVzdHVyZXMgKSB7XHJcblx0XHRcdGluc3RhbmNlLkd1ZXN0dXJlcyA9IG5ldyBHdWVzdHVyZXMoIGluc3RhbmNlICk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdCQoZG9jdW1lbnQpLm9uKCdiZWZvcmVDbG9zZS5mYicsIGZ1bmN0aW9uIChlLCBpbnN0YW5jZSkge1xyXG5cdFx0aWYgKCBpbnN0YW5jZSAmJiBpbnN0YW5jZS5HdWVzdHVyZXMgKSB7XHJcblx0XHRcdGluc3RhbmNlLkd1ZXN0dXJlcy5kZXN0cm95KCk7XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cclxufSh3aW5kb3csIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gU2xpZGVTaG93XHJcbi8vIEVuYWJsZXMgc2xpZGVzaG93IGZ1bmN0aW9uYWxpdHlcclxuLy9cclxuLy8gRXhhbXBsZSBvZiB1c2FnZTpcclxuLy8gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpLlNsaWRlU2hvdy5zdGFydCgpXHJcbi8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbjsoZnVuY3Rpb24gKGRvY3VtZW50LCAkKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgU2xpZGVTaG93ID0gZnVuY3Rpb24oIGluc3RhbmNlICkge1xyXG5cdFx0dGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG5cdFx0dGhpcy5pbml0KCk7XHJcblx0fTtcclxuXHJcblx0JC5leHRlbmQoIFNsaWRlU2hvdy5wcm90b3R5cGUsIHtcclxuXHRcdHRpbWVyICAgIDogbnVsbCxcclxuXHRcdGlzQWN0aXZlIDogZmFsc2UsXHJcblx0XHQkYnV0dG9uICA6IG51bGwsXHJcblx0XHRzcGVlZCAgICA6IDMwMDAsXHJcblxyXG5cdFx0aW5pdCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRzZWxmLiRidXR0b24gPSBzZWxmLmluc3RhbmNlLiRyZWZzLnRvb2xiYXIuZmluZCgnW2RhdGEtZmFuY3lib3gtcGxheV0nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRzZWxmLnRvZ2dsZSgpO1xyXG5cdFx0XHR9KTtcclxuXHJcblx0XHRcdGlmICggc2VsZi5pbnN0YW5jZS5ncm91cC5sZW5ndGggPCAyIHx8ICFzZWxmLmluc3RhbmNlLmdyb3VwWyBzZWxmLmluc3RhbmNlLmN1cnJJbmRleCBdLm9wdHMuc2xpZGVTaG93ICkge1xyXG5cdFx0XHRcdHNlbGYuJGJ1dHRvbi5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0c2V0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIHJlYWNoZWQgbGFzdCBlbGVtZW50XHJcblx0XHRcdGlmICggc2VsZi5pbnN0YW5jZSAmJiBzZWxmLmluc3RhbmNlLmN1cnJlbnQgJiYgKHNlbGYuaW5zdGFuY2UuY3VycmVudC5vcHRzLmxvb3AgfHwgc2VsZi5pbnN0YW5jZS5jdXJySW5kZXggPCBzZWxmLmluc3RhbmNlLmdyb3VwLmxlbmd0aCAtIDEgKSkge1xyXG5cdFx0XHRcdHNlbGYudGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0c2VsZi5pbnN0YW5jZS5uZXh0KCk7XHJcblxyXG5cdFx0XHRcdH0sIHNlbGYuaW5zdGFuY2UuY3VycmVudC5vcHRzLnNsaWRlU2hvdy5zcGVlZCB8fCBzZWxmLnNwZWVkKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZi5zdG9wKCk7XHJcblx0XHRcdFx0c2VsZi5pbnN0YW5jZS5pZGxlU2Vjb25kc0NvdW50ZXIgPSAwO1xyXG5cdFx0XHRcdHNlbGYuaW5zdGFuY2Uuc2hvd0NvbnRyb2xzKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdGNsZWFyIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGNsZWFyVGltZW91dCggc2VsZi50aW1lciApO1xyXG5cclxuXHRcdFx0c2VsZi50aW1lciA9IG51bGw7XHJcblx0XHR9LFxyXG5cclxuXHRcdHN0YXJ0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0dmFyIGN1cnJlbnQgPSBzZWxmLmluc3RhbmNlLmN1cnJlbnQ7XHJcblxyXG5cdFx0XHRpZiAoIHNlbGYuaW5zdGFuY2UgJiYgY3VycmVudCAmJiAoIGN1cnJlbnQub3B0cy5sb29wIHx8IGN1cnJlbnQuaW5kZXggPCBzZWxmLmluc3RhbmNlLmdyb3VwLmxlbmd0aCAtIDEgKSkge1xyXG5cclxuXHRcdFx0XHRzZWxmLmlzQWN0aXZlID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0c2VsZi4kYnV0dG9uXHJcblx0XHRcdFx0XHQuYXR0ciggJ3RpdGxlJywgY3VycmVudC5vcHRzLmkxOG5bIGN1cnJlbnQub3B0cy5sYW5nIF0uUExBWV9TVE9QIClcclxuXHRcdFx0XHRcdC5hZGRDbGFzcyggJ2ZhbmN5Ym94LWJ1dHRvbi0tcGF1c2UnICk7XHJcblxyXG5cdFx0XHRcdGlmICggY3VycmVudC5pc0NvbXBsZXRlICkge1xyXG5cdFx0XHRcdFx0c2VsZi5zZXQoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0c3RvcCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHRcdHZhciBjdXJyZW50ID0gc2VsZi5pbnN0YW5jZS5jdXJyZW50O1xyXG5cclxuXHRcdFx0c2VsZi5jbGVhcigpO1xyXG5cclxuXHRcdFx0c2VsZi4kYnV0dG9uXHJcblx0XHRcdFx0LmF0dHIoICd0aXRsZScsIGN1cnJlbnQub3B0cy5pMThuWyBjdXJyZW50Lm9wdHMubGFuZyBdLlBMQVlfU1RBUlQgKVxyXG5cdFx0XHRcdC5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWJ1dHRvbi0tcGF1c2UnICk7XHJcblxyXG5cdFx0XHRzZWxmLmlzQWN0aXZlID0gZmFsc2U7XHJcblx0XHR9LFxyXG5cclxuXHRcdHRvZ2dsZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0XHRpZiAoIHNlbGYuaXNBY3RpdmUgKSB7XHJcblx0XHRcdFx0c2VsZi5zdG9wKCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNlbGYuc3RhcnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9KTtcclxuXHJcblx0JChkb2N1bWVudCkub24oe1xyXG5cdFx0J29uSW5pdC5mYicgOiBmdW5jdGlvbihlLCBpbnN0YW5jZSkge1xyXG5cdFx0XHRpZiAoIGluc3RhbmNlICYmICFpbnN0YW5jZS5TbGlkZVNob3cgKSB7XHJcblx0XHRcdFx0aW5zdGFuY2UuU2xpZGVTaG93ID0gbmV3IFNsaWRlU2hvdyggaW5zdGFuY2UgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQnYmVmb3JlU2hvdy5mYicgOiBmdW5jdGlvbihlLCBpbnN0YW5jZSwgY3VycmVudCwgZmlyc3RSdW4pIHtcclxuXHRcdFx0dmFyIFNsaWRlU2hvdyA9IGluc3RhbmNlICYmIGluc3RhbmNlLlNsaWRlU2hvdztcclxuXHJcblx0XHRcdGlmICggZmlyc3RSdW4gKSB7XHJcblxyXG5cdFx0XHRcdGlmICggU2xpZGVTaG93ICYmIGN1cnJlbnQub3B0cy5zbGlkZVNob3cuYXV0b1N0YXJ0ICkge1xyXG5cdFx0XHRcdFx0U2xpZGVTaG93LnN0YXJ0KCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggU2xpZGVTaG93ICYmIFNsaWRlU2hvdy5pc0FjdGl2ZSApICB7XHJcblx0XHRcdFx0U2xpZGVTaG93LmNsZWFyKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0J2FmdGVyU2hvdy5mYicgOiBmdW5jdGlvbihlLCBpbnN0YW5jZSwgY3VycmVudCkge1xyXG5cdFx0XHR2YXIgU2xpZGVTaG93ID0gaW5zdGFuY2UgJiYgaW5zdGFuY2UuU2xpZGVTaG93O1xyXG5cclxuXHRcdFx0aWYgKCBTbGlkZVNob3cgJiYgU2xpZGVTaG93LmlzQWN0aXZlICkge1xyXG5cdFx0XHRcdFNsaWRlU2hvdy5zZXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQnYWZ0ZXJLZXlkb3duLmZiJyA6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50LCBrZXlwcmVzcywga2V5Y29kZSkge1xyXG5cdFx0XHR2YXIgU2xpZGVTaG93ID0gaW5zdGFuY2UgJiYgaW5zdGFuY2UuU2xpZGVTaG93O1xyXG5cclxuXHRcdFx0Ly8gXCJQXCIgb3IgU3BhY2ViYXJcclxuXHRcdFx0aWYgKCBTbGlkZVNob3cgJiYgY3VycmVudC5vcHRzLnNsaWRlU2hvdyAmJiAoIGtleWNvZGUgPT09IDgwIHx8IGtleWNvZGUgPT09IDMyICkgJiYgISQoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCkuaXMoICdidXR0b24sYSxpbnB1dCcgKSApIHtcclxuXHRcdFx0XHRrZXlwcmVzcy5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0XHRTbGlkZVNob3cudG9nZ2xlKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0J2JlZm9yZUNsb3NlLmZiIG9uRGVhY3RpdmF0ZS5mYicgOiBmdW5jdGlvbihlLCBpbnN0YW5jZSkge1xyXG5cdFx0XHR2YXIgU2xpZGVTaG93ID0gaW5zdGFuY2UgJiYgaW5zdGFuY2UuU2xpZGVTaG93O1xyXG5cclxuXHRcdFx0aWYgKCBTbGlkZVNob3cgKSB7XHJcblx0XHRcdFx0U2xpZGVTaG93LnN0b3AoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQvLyBQYWdlIFZpc2liaWxpdHkgQVBJIHRvIHBhdXNlIHNsaWRlc2hvdyB3aGVuIHdpbmRvdyBpcyBub3QgYWN0aXZlXHJcblx0JChkb2N1bWVudCkub24oXCJ2aXNpYmlsaXR5Y2hhbmdlXCIsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGluc3RhbmNlICA9ICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKTtcclxuXHRcdHZhciBTbGlkZVNob3cgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5TbGlkZVNob3c7XHJcblxyXG5cdFx0aWYgKCBTbGlkZVNob3cgJiYgU2xpZGVTaG93LmlzQWN0aXZlICkge1xyXG5cdFx0XHRpZiAoIGRvY3VtZW50LmhpZGRlbiApIHtcclxuXHRcdFx0XHRTbGlkZVNob3cuY2xlYXIoKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0U2xpZGVTaG93LnNldCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG59KGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5KSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gRnVsbFNjcmVlblxyXG4vLyBBZGRzIGZ1bGxzY3JlZW4gZnVuY3Rpb25hbGl0eVxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG47KGZ1bmN0aW9uIChkb2N1bWVudCwgJCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gQ29sbGVjdGlvbiBvZiBtZXRob2RzIHN1cHBvcnRlZCBieSB1c2VyIGJyb3dzZXJcclxuXHR2YXIgZm4gPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdHZhciBmbk1hcCA9IFtcclxuXHRcdFx0W1xyXG5cdFx0XHRcdCdyZXF1ZXN0RnVsbHNjcmVlbicsXHJcblx0XHRcdFx0J2V4aXRGdWxsc2NyZWVuJyxcclxuXHRcdFx0XHQnZnVsbHNjcmVlbkVsZW1lbnQnLFxyXG5cdFx0XHRcdCdmdWxsc2NyZWVuRW5hYmxlZCcsXHJcblx0XHRcdFx0J2Z1bGxzY3JlZW5jaGFuZ2UnLFxyXG5cdFx0XHRcdCdmdWxsc2NyZWVuZXJyb3InXHJcblx0XHRcdF0sXHJcblx0XHRcdC8vIG5ldyBXZWJLaXRcclxuXHRcdFx0W1xyXG5cdFx0XHRcdCd3ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbicsXHJcblx0XHRcdFx0J3dlYmtpdEV4aXRGdWxsc2NyZWVuJyxcclxuXHRcdFx0XHQnd2Via2l0RnVsbHNjcmVlbkVsZW1lbnQnLFxyXG5cdFx0XHRcdCd3ZWJraXRGdWxsc2NyZWVuRW5hYmxlZCcsXHJcblx0XHRcdFx0J3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLFxyXG5cdFx0XHRcdCd3ZWJraXRmdWxsc2NyZWVuZXJyb3InXHJcblxyXG5cdFx0XHRdLFxyXG5cdFx0XHQvLyBvbGQgV2ViS2l0IChTYWZhcmkgNS4xKVxyXG5cdFx0XHRbXHJcblx0XHRcdFx0J3dlYmtpdFJlcXVlc3RGdWxsU2NyZWVuJyxcclxuXHRcdFx0XHQnd2Via2l0Q2FuY2VsRnVsbFNjcmVlbicsXHJcblx0XHRcdFx0J3dlYmtpdEN1cnJlbnRGdWxsU2NyZWVuRWxlbWVudCcsXHJcblx0XHRcdFx0J3dlYmtpdENhbmNlbEZ1bGxTY3JlZW4nLFxyXG5cdFx0XHRcdCd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJyxcclxuXHRcdFx0XHQnd2Via2l0ZnVsbHNjcmVlbmVycm9yJ1xyXG5cclxuXHRcdFx0XSxcclxuXHRcdFx0W1xyXG5cdFx0XHRcdCdtb3pSZXF1ZXN0RnVsbFNjcmVlbicsXHJcblx0XHRcdFx0J21vekNhbmNlbEZ1bGxTY3JlZW4nLFxyXG5cdFx0XHRcdCdtb3pGdWxsU2NyZWVuRWxlbWVudCcsXHJcblx0XHRcdFx0J21vekZ1bGxTY3JlZW5FbmFibGVkJyxcclxuXHRcdFx0XHQnbW96ZnVsbHNjcmVlbmNoYW5nZScsXHJcblx0XHRcdFx0J21vemZ1bGxzY3JlZW5lcnJvcidcclxuXHRcdFx0XSxcclxuXHRcdFx0W1xyXG5cdFx0XHRcdCdtc1JlcXVlc3RGdWxsc2NyZWVuJyxcclxuXHRcdFx0XHQnbXNFeGl0RnVsbHNjcmVlbicsXHJcblx0XHRcdFx0J21zRnVsbHNjcmVlbkVsZW1lbnQnLFxyXG5cdFx0XHRcdCdtc0Z1bGxzY3JlZW5FbmFibGVkJyxcclxuXHRcdFx0XHQnTVNGdWxsc2NyZWVuQ2hhbmdlJyxcclxuXHRcdFx0XHQnTVNGdWxsc2NyZWVuRXJyb3InXHJcblx0XHRcdF1cclxuXHRcdF07XHJcblxyXG5cdFx0dmFyIHZhbDtcclxuXHRcdHZhciByZXQgPSB7fTtcclxuXHRcdHZhciBpLCBqO1xyXG5cclxuXHRcdGZvciAoIGkgPSAwOyBpIDwgZm5NYXAubGVuZ3RoOyBpKysgKSB7XHJcblx0XHRcdHZhbCA9IGZuTWFwWyBpIF07XHJcblxyXG5cdFx0XHRpZiAoIHZhbCAmJiB2YWxbIDEgXSBpbiBkb2N1bWVudCApIHtcclxuXHRcdFx0XHRmb3IgKCBqID0gMDsgaiA8IHZhbC5sZW5ndGg7IGorKyApIHtcclxuXHRcdFx0XHRcdHJldFsgZm5NYXBbIDAgXVsgaiBdIF0gPSB2YWxbIGogXTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHJldHVybiByZXQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSkoKTtcclxuXHJcblx0Ly8gSWYgYnJvd3NlciBkb2VzIG5vdCBoYXZlIEZ1bGwgU2NyZWVuIEFQSSwgdGhlbiBzaW1wbHkgdW5zZXQgZGVmYXVsdCBidXR0b24gdGVtcGxhdGUgYW5kIHN0b3BcclxuXHRpZiAoICFmbiApIHtcclxuXHJcblx0XHRpZiAoICQgJiYgJC5mYW5jeWJveCApIHtcclxuXHRcdFx0JC5mYW5jeWJveC5kZWZhdWx0cy5idG5UcGwuZnVsbFNjcmVlbiA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdHZhciBGdWxsU2NyZWVuID0ge1xyXG5cclxuXHRcdHJlcXVlc3QgOiBmdW5jdGlvbiAoIGVsZW0gKSB7XHJcblxyXG5cdFx0XHRlbGVtID0gZWxlbSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblxyXG5cdFx0XHRlbGVtWyBmbi5yZXF1ZXN0RnVsbHNjcmVlbiBdKCBlbGVtLkFMTE9XX0tFWUJPQVJEX0lOUFVUICk7XHJcblxyXG5cdFx0fSxcclxuXHRcdGV4aXQgOiBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0XHRkb2N1bWVudFsgZm4uZXhpdEZ1bGxzY3JlZW4gXSgpO1xyXG5cclxuXHRcdH0sXHJcblx0XHR0b2dnbGUgOiBmdW5jdGlvbiAoIGVsZW0gKSB7XHJcblxyXG5cdFx0XHRlbGVtID0gZWxlbSB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XHJcblxyXG5cdFx0XHRpZiAoIHRoaXMuaXNGdWxsc2NyZWVuKCkgKSB7XHJcblx0XHRcdFx0dGhpcy5leGl0KCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMucmVxdWVzdCggZWxlbSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHRcdGlzRnVsbHNjcmVlbiA6IGZ1bmN0aW9uKCkgIHtcclxuXHJcblx0XHRcdHJldHVybiBCb29sZWFuKCBkb2N1bWVudFsgZm4uZnVsbHNjcmVlbkVsZW1lbnQgXSApO1xyXG5cclxuXHRcdH0sXHJcblx0XHRlbmFibGVkIDogZnVuY3Rpb24oKSAge1xyXG5cclxuXHRcdFx0cmV0dXJuIEJvb2xlYW4oIGRvY3VtZW50WyBmbi5mdWxsc2NyZWVuRW5hYmxlZCBdICk7XHJcblxyXG5cdFx0fVxyXG5cdH07XHJcblxyXG5cdCQoZG9jdW1lbnQpLm9uKHtcclxuXHRcdCdvbkluaXQuZmInIDogZnVuY3Rpb24oZSwgaW5zdGFuY2UpIHtcclxuXHRcdFx0dmFyICRjb250YWluZXI7XHJcblxyXG5cdFx0XHR2YXIgJGJ1dHRvbiA9IGluc3RhbmNlLiRyZWZzLnRvb2xiYXIuZmluZCgnW2RhdGEtZmFuY3lib3gtZnVsbHNjcmVlbl0nKTtcclxuXHJcblx0XHRcdGlmICggaW5zdGFuY2UgJiYgIWluc3RhbmNlLkZ1bGxTY3JlZW4gJiYgaW5zdGFuY2UuZ3JvdXBbIGluc3RhbmNlLmN1cnJJbmRleCBdLm9wdHMuZnVsbFNjcmVlbiApIHtcclxuXHRcdFx0XHQkY29udGFpbmVyID0gaW5zdGFuY2UuJHJlZnMuY29udGFpbmVyO1xyXG5cclxuXHRcdFx0XHQkY29udGFpbmVyLm9uKCdjbGljay5mYi1mdWxsc2NyZWVuJywgJ1tkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW5dJywgZnVuY3Rpb24oZSkge1xyXG5cclxuXHRcdFx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdFx0RnVsbFNjcmVlbi50b2dnbGUoICRjb250YWluZXJbIDAgXSApO1xyXG5cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0aWYgKCBpbnN0YW5jZS5vcHRzLmZ1bGxTY3JlZW4gJiYgaW5zdGFuY2Uub3B0cy5mdWxsU2NyZWVuLmF1dG9TdGFydCA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRcdEZ1bGxTY3JlZW4ucmVxdWVzdCggJGNvbnRhaW5lclsgMCBdICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBFeHBvc2UgQVBJXHJcblx0XHRcdFx0aW5zdGFuY2UuRnVsbFNjcmVlbiA9IEZ1bGxTY3JlZW47XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdCRidXR0b24uaGlkZSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHQnYWZ0ZXJLZXlkb3duLmZiJyA6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50LCBrZXlwcmVzcywga2V5Y29kZSkge1xyXG5cclxuXHRcdFx0Ly8gXCJQXCIgb3IgU3BhY2ViYXJcclxuXHRcdFx0aWYgKCBpbnN0YW5jZSAmJiBpbnN0YW5jZS5GdWxsU2NyZWVuICYmIGtleWNvZGUgPT09IDcwICkge1xyXG5cdFx0XHRcdGtleXByZXNzLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLkZ1bGxTY3JlZW4udG9nZ2xlKCBpbnN0YW5jZS4kcmVmcy5jb250YWluZXJbIDAgXSApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHQnYmVmb3JlQ2xvc2UuZmInIDogZnVuY3Rpb24oIGluc3RhbmNlICkge1xyXG5cdFx0XHRpZiAoIGluc3RhbmNlICYmIGluc3RhbmNlLkZ1bGxTY3JlZW4gKSB7XHJcblx0XHRcdFx0RnVsbFNjcmVlbi5leGl0KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChkb2N1bWVudCkub24oZm4uZnVsbHNjcmVlbmNoYW5nZSwgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaW5zdGFuY2UgPSAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCk7XHJcblxyXG5cdFx0Ly8gSWYgaW1hZ2UgaXMgem9vbWluZywgdGhlbiBmb3JjZSB0byBzdG9wIGFuZCByZXBvc2l0aW9uIHByb3Blcmx5XHJcblx0XHRpZiAoIGluc3RhbmNlLmN1cnJlbnQgJiYgaW5zdGFuY2UuY3VycmVudC50eXBlID09PSAnaW1hZ2UnICYmIGluc3RhbmNlLmlzQW5pbWF0aW5nICkge1xyXG5cdFx0XHRpbnN0YW5jZS5jdXJyZW50LiRjb250ZW50LmNzcyggJ3RyYW5zaXRpb24nLCAnbm9uZScgKTtcclxuXHJcblx0XHRcdGluc3RhbmNlLmlzQW5pbWF0aW5nID0gZmFsc2U7XHJcblxyXG5cdFx0XHRpbnN0YW5jZS51cGRhdGUoIHRydWUsIHRydWUsIDAgKTtcclxuXHRcdH1cclxuXHJcblx0XHRpbnN0YW5jZS50cmlnZ2VyKCdvbkZ1bGxzY3JlZW5DaGFuZ2UnLCBGdWxsU2NyZWVuLmlzRnVsbHNjcmVlbigpICk7XHJcblxyXG5cdH0pO1xyXG5cclxufShkb2N1bWVudCwgd2luZG93LmpRdWVyeSkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIFRodW1ic1xyXG4vLyBEaXNwbGF5cyB0aHVtYm5haWxzIGluIGEgZ3JpZFxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG47KGZ1bmN0aW9uIChkb2N1bWVudCwgJCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0dmFyIEZhbmN5VGh1bWJzID0gZnVuY3Rpb24oIGluc3RhbmNlICkge1xyXG5cdFx0dGhpcy5pbnN0YW5jZSA9IGluc3RhbmNlO1xyXG5cdFx0dGhpcy5pbml0KCk7XHJcblx0fTtcclxuXHJcblx0JC5leHRlbmQoIEZhbmN5VGh1bWJzLnByb3RvdHlwZSwge1xyXG5cclxuXHRcdCRidXR0b25cdFx0OiBudWxsLFxyXG5cdFx0JGdyaWRcdFx0OiBudWxsLFxyXG5cdFx0JGxpc3RcdFx0OiBudWxsLFxyXG5cdFx0aXNWaXNpYmxlXHQ6IGZhbHNlLFxyXG5cclxuXHRcdGluaXQgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0dmFyIGZpcnN0ICA9IHNlbGYuaW5zdGFuY2UuZ3JvdXBbMF0sXHJcblx0XHRcdFx0c2Vjb25kID0gc2VsZi5pbnN0YW5jZS5ncm91cFsxXTtcclxuXHJcblx0XHRcdHNlbGYuJGJ1dHRvbiA9IHNlbGYuaW5zdGFuY2UuJHJlZnMudG9vbGJhci5maW5kKCAnW2RhdGEtZmFuY3lib3gtdGh1bWJzXScgKTtcclxuXHJcblx0XHRcdGlmICggc2VsZi5pbnN0YW5jZS5ncm91cC5sZW5ndGggPiAxICYmIHNlbGYuaW5zdGFuY2UuZ3JvdXBbIHNlbGYuaW5zdGFuY2UuY3VyckluZGV4IF0ub3B0cy50aHVtYnMgJiYgKFxyXG5cdFx0ICAgIFx0XHQoIGZpcnN0LnR5cGUgPT0gJ2ltYWdlJyAgfHwgZmlyc3Qub3B0cy50aHVtYiAgfHwgZmlyc3Qub3B0cy4kdGh1bWIgKSAmJlxyXG5cdFx0ICAgIFx0XHQoIHNlY29uZC50eXBlID09ICdpbWFnZScgfHwgc2Vjb25kLm9wdHMudGh1bWIgfHwgc2Vjb25kLm9wdHMuJHRodW1iIClcclxuXHRcdFx0KSkge1xyXG5cclxuXHRcdFx0XHRzZWxmLiRidXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzZWxmLnRvZ2dsZSgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRzZWxmLmlzQWN0aXZlID0gdHJ1ZTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZi4kYnV0dG9uLmhpZGUoKTtcclxuXHJcblx0XHRcdFx0c2VsZi5pc0FjdGl2ZSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRjcmVhdGUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZSxcclxuXHRcdFx0XHRsaXN0LFxyXG5cdFx0XHRcdHNyYztcclxuXHJcblx0XHRcdHRoaXMuJGdyaWQgPSAkKCc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtdGh1bWJzXCI+PC9kaXY+JykuYXBwZW5kVG8oIGluc3RhbmNlLiRyZWZzLmNvbnRhaW5lciApO1xyXG5cclxuXHRcdFx0bGlzdCA9ICc8dWw+JztcclxuXHJcblx0XHRcdCQuZWFjaChpbnN0YW5jZS5ncm91cCwgZnVuY3Rpb24oIGksIGl0ZW0gKSB7XHJcblxyXG5cdFx0XHRcdHNyYyA9IGl0ZW0ub3B0cy50aHVtYiB8fCAoIGl0ZW0ub3B0cy4kdGh1bWIgPyBpdGVtLm9wdHMuJHRodW1iLmF0dHIoJ3NyYycpIDogbnVsbCApO1xyXG5cclxuXHRcdFx0XHRpZiAoICFzcmMgJiYgaXRlbS50eXBlID09PSAnaW1hZ2UnICkge1xyXG5cdFx0XHRcdFx0c3JjID0gaXRlbS5zcmM7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoIHNyYyAmJiBzcmMubGVuZ3RoICkge1xyXG5cdFx0XHRcdFx0bGlzdCArPSAnPGxpIGRhdGEtaW5kZXg9XCInICsgaSArICdcIiAgdGFiaW5kZXg9XCIwXCIgY2xhc3M9XCJmYW5jeWJveC10aHVtYnMtbG9hZGluZ1wiPjxpbWcgZGF0YS1zcmM9XCInICsgc3JjICsgJ1wiIC8+PC9saT4nO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0bGlzdCArPSAnPC91bD4nO1xyXG5cclxuXHRcdFx0dGhpcy4kbGlzdCA9ICQoIGxpc3QgKS5hcHBlbmRUbyggdGhpcy4kZ3JpZCApLm9uKCdjbGljaycsICdsaScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGluc3RhbmNlLmp1bXBUbyggJCh0aGlzKS5kYXRhKCdpbmRleCcpICk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0dGhpcy4kbGlzdC5maW5kKCdpbWcnKS5oaWRlKCkub25lKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHRcdHZhciAkcGFyZW50XHRcdD0gJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZmFuY3lib3gtdGh1bWJzLWxvYWRpbmcnKSxcclxuXHRcdFx0XHRcdHRodW1iV2lkdGhcdD0gJHBhcmVudC5vdXRlcldpZHRoKCksXHJcblx0XHRcdFx0XHR0aHVtYkhlaWdodFx0PSAkcGFyZW50Lm91dGVySGVpZ2h0KCksXHJcblx0XHRcdFx0XHR3aWR0aCxcclxuXHRcdFx0XHRcdGhlaWdodCxcclxuXHRcdFx0XHRcdHdpZHRoUmF0aW8sXHJcblx0XHRcdFx0XHRoZWlnaHRSYXRpbztcclxuXHJcblx0XHRcdFx0d2lkdGggID0gdGhpcy5uYXR1cmFsV2lkdGhcdHx8IHRoaXMud2lkdGg7XHJcblx0XHRcdFx0aGVpZ2h0ID0gdGhpcy5uYXR1cmFsSGVpZ2h0XHR8fCB0aGlzLmhlaWdodDtcclxuXHJcblx0XHRcdFx0Ly9DYWxjdWxhdGUgdGh1bWJuYWlsIHdpZHRoL2hlaWdodCBhbmQgY2VudGVyIGl0XHJcblxyXG5cdFx0XHRcdHdpZHRoUmF0aW8gID0gd2lkdGggIC8gdGh1bWJXaWR0aDtcclxuXHRcdFx0XHRoZWlnaHRSYXRpbyA9IGhlaWdodCAvIHRodW1iSGVpZ2h0O1xyXG5cclxuXHRcdFx0XHRpZiAod2lkdGhSYXRpbyA+PSAxICYmIGhlaWdodFJhdGlvID49IDEpIHtcclxuXHRcdFx0XHRcdGlmICh3aWR0aFJhdGlvID4gaGVpZ2h0UmF0aW8pIHtcclxuXHRcdFx0XHRcdFx0d2lkdGggID0gd2lkdGggLyBoZWlnaHRSYXRpbztcclxuXHRcdFx0XHRcdFx0aGVpZ2h0ID0gdGh1bWJIZWlnaHQ7XHJcblxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0d2lkdGggID0gdGh1bWJXaWR0aDtcclxuXHRcdFx0XHRcdFx0aGVpZ2h0ID0gaGVpZ2h0IC8gd2lkdGhSYXRpbztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdCQodGhpcykuY3NzKHtcclxuXHRcdFx0XHRcdHdpZHRoICAgICAgICAgOiBNYXRoLmZsb29yKHdpZHRoKSxcclxuXHRcdFx0XHRcdGhlaWdodCAgICAgICAgOiBNYXRoLmZsb29yKGhlaWdodCksXHJcblx0XHRcdFx0XHQnbWFyZ2luLXRvcCcgIDogTWF0aC5taW4oIDAsIE1hdGguZmxvb3IodGh1bWJIZWlnaHQgKiAwLjMgLSBoZWlnaHQgKiAwLjMgKSApLFxyXG5cdFx0XHRcdFx0J21hcmdpbi1sZWZ0JyA6IE1hdGgubWluKCAwLCBNYXRoLmZsb29yKHRodW1iV2lkdGggICogMC41IC0gd2lkdGggICogMC41ICkgKVxyXG5cdFx0XHRcdH0pLnNob3coKTtcclxuXHJcblx0XHRcdH0pXHJcblx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHRoaXMuc3JjID0gJCggdGhpcyApLmRhdGEoICdzcmMnICk7XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdH0sXHJcblxyXG5cdFx0Zm9jdXMgOiBmdW5jdGlvbigpIHtcclxuXHJcblx0XHRcdGlmICggdGhpcy5pbnN0YW5jZS5jdXJyZW50ICkge1xyXG5cdFx0XHRcdHRoaXMuJGxpc3RcclxuXHRcdFx0XHRcdC5jaGlsZHJlbigpXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2ZhbmN5Ym94LXRodW1icy1hY3RpdmUnKVxyXG5cdFx0XHRcdFx0LmZpbHRlcignW2RhdGEtaW5kZXg9XCInICsgdGhpcy5pbnN0YW5jZS5jdXJyZW50LmluZGV4ICArICdcIl0nKVxyXG5cdFx0XHRcdFx0LmFkZENsYXNzKCdmYW5jeWJveC10aHVtYnMtYWN0aXZlJylcclxuXHRcdFx0XHRcdC5mb2N1cygpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fSxcclxuXHJcblx0XHRjbG9zZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLiRncmlkLmhpZGUoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0XHR0aGlzLmluc3RhbmNlLiRyZWZzLmNvbnRhaW5lci50b2dnbGVDbGFzcyggJ2ZhbmN5Ym94LXNob3ctdGh1bWJzJywgdGhpcy5pc1Zpc2libGUgKTtcclxuXHJcblx0XHRcdGlmICggdGhpcy5pc1Zpc2libGUgKSB7XHJcblxyXG5cdFx0XHRcdGlmICggIXRoaXMuJGdyaWQgKSB7XHJcblx0XHRcdFx0XHR0aGlzLmNyZWF0ZSgpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dGhpcy5pbnN0YW5jZS50cmlnZ2VyKCAnb25UaHVtYnNTaG93JyApO1xyXG5cclxuXHRcdFx0XHR0aGlzLmZvY3VzKCk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCB0aGlzLiRncmlkICkge1xyXG5cdFx0XHRcdHRoaXMuaW5zdGFuY2UudHJpZ2dlciggJ29uVGh1bWJzSGlkZScgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gVXBkYXRlIGNvbnRlbnQgcG9zaXRpb25cclxuXHRcdFx0dGhpcy5pbnN0YW5jZS51cGRhdGUoKTtcclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdGhpZGUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0c2hvdyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcblx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHRvZ2dsZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmlzVmlzaWJsZSA9ICF0aGlzLmlzVmlzaWJsZTtcclxuXHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdH1cclxuXHJcblx0fSk7XHJcblxyXG5cdCQoZG9jdW1lbnQpLm9uKHtcclxuXHJcblx0XHQnb25Jbml0LmZiJyA6IGZ1bmN0aW9uKGUsIGluc3RhbmNlKSB7XHJcblx0XHRcdGlmICggaW5zdGFuY2UgJiYgIWluc3RhbmNlLlRodW1icyApIHtcclxuXHRcdFx0XHRpbnN0YW5jZS5UaHVtYnMgPSBuZXcgRmFuY3lUaHVtYnMoIGluc3RhbmNlICk7XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0J2JlZm9yZVNob3cuZmInIDogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGl0ZW0sIGZpcnN0UnVuKSB7XHJcblx0XHRcdHZhciBUaHVtYnMgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5UaHVtYnM7XHJcblxyXG5cdFx0XHRpZiAoICFUaHVtYnMgfHwgIVRodW1icy5pc0FjdGl2ZSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggaXRlbS5tb2RhbCApIHtcclxuXHRcdFx0XHRUaHVtYnMuJGJ1dHRvbi5oaWRlKCk7XHJcblxyXG5cdFx0XHRcdFRodW1icy5oaWRlKCk7XHJcblxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBmaXJzdFJ1biAmJiBpbnN0YW5jZS5vcHRzLnRodW1icy5hdXRvU3RhcnQgPT09IHRydWUgKSB7XHJcblx0XHRcdFx0VGh1bWJzLnNob3coKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCBUaHVtYnMuaXNWaXNpYmxlICkge1xyXG5cdFx0XHRcdFRodW1icy5mb2N1cygpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdCdhZnRlcktleWRvd24uZmInIDogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGN1cnJlbnQsIGtleXByZXNzLCBrZXljb2RlKSB7XHJcblx0XHRcdHZhciBUaHVtYnMgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5UaHVtYnM7XHJcblxyXG5cdFx0XHQvLyBcIkdcIlxyXG5cdFx0XHRpZiAoIFRodW1icyAmJiBUaHVtYnMuaXNBY3RpdmUgJiYga2V5Y29kZSA9PT0gNzEgKSB7XHJcblx0XHRcdFx0a2V5cHJlc3MucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0VGh1bWJzLnRvZ2dsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdCdiZWZvcmVDbG9zZS5mYicgOiBmdW5jdGlvbiggZSwgaW5zdGFuY2UgKSB7XHJcblx0XHRcdHZhciBUaHVtYnMgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5UaHVtYnM7XHJcblxyXG5cdFx0XHRpZiAoIFRodW1icyAmJiBUaHVtYnMuaXNWaXNpYmxlICYmIGluc3RhbmNlLm9wdHMudGh1bWJzLmhpZGVPbkNsb3NlICE9PSBmYWxzZSApIHtcclxuXHRcdFx0XHRUaHVtYnMuY2xvc2UoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9KTtcclxuXHJcbn0oZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkpKTtcclxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vL1xyXG4vLyBIYXNoXHJcbi8vIEVuYWJsZXMgbGlua2luZyB0byBlYWNoIG1vZGFsXHJcbi8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbjsoZnVuY3Rpb24gKGRvY3VtZW50LCB3aW5kb3csICQpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdC8vIFNpbXBsZSAkLmVzY2FwZVNlbGVjdG9yIHBvbHlmaWxsIChmb3IgalF1ZXJ5IHByaW9yIHYzKVxyXG5cdGlmICggISQuZXNjYXBlU2VsZWN0b3IgKSB7XHJcblx0XHQkLmVzY2FwZVNlbGVjdG9yID0gZnVuY3Rpb24oIHNlbCApIHtcclxuXHRcdFx0dmFyIHJjc3Nlc2NhcGUgPSAvKFtcXDAtXFx4MWZcXHg3Zl18Xi0/XFxkKXxeLSR8W15cXHg4MC1cXHVGRkZGXFx3LV0vZztcclxuXHRcdFx0dmFyIGZjc3Nlc2NhcGUgPSBmdW5jdGlvbiggY2gsIGFzQ29kZVBvaW50ICkge1xyXG5cdFx0XHRcdGlmICggYXNDb2RlUG9pbnQgKSB7XHJcblx0XHRcdFx0XHQvLyBVKzAwMDAgTlVMTCBiZWNvbWVzIFUrRkZGRCBSRVBMQUNFTUVOVCBDSEFSQUNURVJcclxuXHRcdFx0XHRcdGlmICggY2ggPT09IFwiXFwwXCIgKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBcIlxcdUZGRkRcIjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBDb250cm9sIGNoYXJhY3RlcnMgYW5kIChkZXBlbmRlbnQgdXBvbiBwb3NpdGlvbikgbnVtYmVycyBnZXQgZXNjYXBlZCBhcyBjb2RlIHBvaW50c1xyXG5cdFx0XHRcdFx0cmV0dXJuIGNoLnNsaWNlKCAwLCAtMSApICsgXCJcXFxcXCIgKyBjaC5jaGFyQ29kZUF0KCBjaC5sZW5ndGggLSAxICkudG9TdHJpbmcoIDE2ICkgKyBcIiBcIjtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIE90aGVyIHBvdGVudGlhbGx5LXNwZWNpYWwgQVNDSUkgY2hhcmFjdGVycyBnZXQgYmFja3NsYXNoLWVzY2FwZWRcclxuXHRcdFx0XHRyZXR1cm4gXCJcXFxcXCIgKyBjaDtcclxuXHRcdFx0fTtcclxuXHJcblx0XHRcdHJldHVybiAoIHNlbCArIFwiXCIgKS5yZXBsYWNlKCByY3NzZXNjYXBlLCBmY3NzZXNjYXBlICk7XHJcblx0XHR9O1xyXG5cdH1cclxuXHJcblx0Ly8gQ3JlYXRlIG5ldyBoaXN0b3J5IGVudHJ5IG9ubHkgb25jZVxyXG5cdHZhciBzaG91bGRDcmVhdGVIaXN0b3J5ID0gdHJ1ZTtcclxuXHJcblx0Ly8gVmFyaWFibGUgY29udGFpbmluZyBsYXN0IGhhc2ggdmFsdWUgc2V0IGJ5IGZhbmN5Qm94XHJcblx0Ly8gSXQgd2lsbCBiZSB1c2VkIHRvIGRldGVybWluZSBpZiBmYW5jeUJveCBuZWVkcyB0byBjbG9zZSBhZnRlciBoYXNoIGNoYW5nZSBpcyBkZXRlY3RlZFxyXG4gICAgdmFyIGN1cnJlbnRIYXNoID0gbnVsbDtcclxuXHJcblx0Ly8gVGhyb3R0bGluZyB0aGUgaGlzdG9yeSBjaGFuZ2VcclxuXHR2YXIgdGltZXJJRCA9IG51bGw7XHJcblxyXG5cdC8vIEdldCBpbmZvIGFib3V0IGdhbGxlcnkgbmFtZSBhbmQgY3VycmVudCBpbmRleCBmcm9tIHVybFxyXG4gICAgZnVuY3Rpb24gcGFyc2VVcmwoKSB7XHJcbiAgICAgICAgdmFyIGhhc2ggICAgPSB3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoIDEgKTtcclxuICAgICAgICB2YXIgcmV6ICAgICA9IGhhc2guc3BsaXQoICctJyApO1xyXG4gICAgICAgIHZhciBpbmRleCAgID0gcmV6Lmxlbmd0aCA+IDEgJiYgL15cXCs/XFxkKyQvLnRlc3QoIHJlelsgcmV6Lmxlbmd0aCAtIDEgXSApID8gcGFyc2VJbnQoIHJlei5wb3AoIC0xICksIDEwICkgfHwgMSA6IDE7XHJcbiAgICAgICAgdmFyIGdhbGxlcnkgPSByZXouam9pbiggJy0nICk7XHJcblxyXG5cdFx0Ly8gSW5kZXggaXMgc3RhcnRpbmcgZnJvbSAxXHJcblx0XHRpZiAoIGluZGV4IDwgMSApIHtcclxuXHRcdFx0aW5kZXggPSAxO1xyXG5cdFx0fVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBoYXNoICAgIDogaGFzaCxcclxuICAgICAgICAgICAgaW5kZXggICA6IGluZGV4LFxyXG4gICAgICAgICAgICBnYWxsZXJ5IDogZ2FsbGVyeVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG5cdC8vIFRyaWdnZXIgY2xpY2sgZXZudCBvbiBsaW5rcyB0byBvcGVuIG5ldyBmYW5jeUJveCBpbnN0YW5jZVxyXG5cdGZ1bmN0aW9uIHRyaWdnZXJGcm9tVXJsKCB1cmwgKSB7XHJcblx0XHR2YXIgJGVsO1xyXG5cclxuICAgICAgICBpZiAoIHVybC5nYWxsZXJ5ICE9PSAnJyApIHtcclxuXHJcblx0XHRcdC8vIElmIHdlIGNhbiBmaW5kIGVsZW1lbnQgbWF0Y2hpbmcgJ2RhdGEtZmFuY3lib3gnIGF0cmlidXRlLCB0aGVuIHRyaWdnZXIgY2xpY2sgZXZlbnQgZm9yIHRoYXQgLi5cclxuXHRcdFx0JGVsID0gJCggXCJbZGF0YS1mYW5jeWJveD0nXCIgKyAkLmVzY2FwZVNlbGVjdG9yKCB1cmwuZ2FsbGVyeSApICsgXCInXVwiICkuZXEoIHVybC5pbmRleCAtIDEgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggISRlbC5sZW5ndGggKSB7XHJcblx0XHRcdFx0Ly8gLi4gaWYgbm90LCB0cnkgZmluZGluZyBlbGVtZW50IGJ5IElEXHJcblx0XHRcdFx0JGVsID0gJCggXCIjXCIgKyAkLmVzY2FwZVNlbGVjdG9yKCB1cmwuZ2FsbGVyeSApICsgXCJcIiApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoICRlbC5sZW5ndGggKSB7XHJcblx0XHRcdFx0c2hvdWxkQ3JlYXRlSGlzdG9yeSA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHQkZWwudHJpZ2dlciggJ2NsaWNrJyApO1xyXG5cdFx0XHR9XHJcblxyXG4gICAgICAgIH1cclxuXHR9XHJcblxyXG5cdC8vIEdldCBnYWxsZXJ5IG5hbWUgZnJvbSBjdXJyZW50IGluc3RhbmNlXHJcblx0ZnVuY3Rpb24gZ2V0R2FsbGVyeUlEKCBpbnN0YW5jZSApIHtcclxuXHRcdHZhciBvcHRzO1xyXG5cclxuXHRcdGlmICggIWluc3RhbmNlICkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0b3B0cyA9IGluc3RhbmNlLmN1cnJlbnQgPyBpbnN0YW5jZS5jdXJyZW50Lm9wdHMgOiBpbnN0YW5jZS5vcHRzO1xyXG5cclxuXHRcdHJldHVybiBvcHRzLmhhc2ggfHwgKCBvcHRzLiRvcmlnID8gb3B0cy4kb3JpZy5kYXRhKCAnZmFuY3lib3gnICkgOiAnJyAgKTtcclxuXHR9XHJcblxyXG5cdC8vIFN0YXIgd2hlbiBET00gYmVjb21lcyByZWFkeVxyXG4gICAgJChmdW5jdGlvbigpIHtcclxuXHJcblx0XHQvLyBTbWFsbCBkZWxheSBpcyB1c2VkIHRvIGFsbG93IG90aGVyIHNjcmlwdHMgdG8gcHJvY2VzcyBcImRvbSByZWFkeVwiIGV2ZW50XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgaWYgdGhpcyBtb2R1bGUgaXMgbm90IGRpc2FibGVkXHJcblx0XHRcdGlmICggJC5mYW5jeWJveC5kZWZhdWx0cy5oYXNoID09PSBmYWxzZSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFVwZGF0ZSBoYXNoIHdoZW4gb3BlbmluZy9jbG9zaW5nIGZhbmN5Qm94XHJcblx0XHQgICAgJChkb2N1bWVudCkub24oe1xyXG5cdFx0XHRcdCdvbkluaXQuZmInIDogZnVuY3Rpb24oIGUsIGluc3RhbmNlICkge1xyXG5cdFx0XHRcdFx0dmFyIHVybCwgZ2FsbGVyeTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIGluc3RhbmNlLmdyb3VwWyBpbnN0YW5jZS5jdXJySW5kZXggXS5vcHRzLmhhc2ggPT09IGZhbHNlICkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0dXJsICAgICA9IHBhcnNlVXJsKCk7XHJcblx0XHRcdFx0XHRnYWxsZXJ5ID0gZ2V0R2FsbGVyeUlEKCBpbnN0YW5jZSApO1xyXG5cclxuXHRcdFx0XHRcdC8vIE1ha2Ugc3VyZSBnYWxsZXJ5IHN0YXJ0IGluZGV4IG1hdGNoZXMgaW5kZXggZnJvbSBoYXNoXHJcblx0XHRcdFx0XHRpZiAoIGdhbGxlcnkgJiYgdXJsLmdhbGxlcnkgJiYgZ2FsbGVyeSA9PSB1cmwuZ2FsbGVyeSApIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2UuY3VyckluZGV4ID0gdXJsLmluZGV4IC0gMTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0fSxcclxuXHJcblx0XHRcdFx0J2JlZm9yZVNob3cuZmInIDogZnVuY3Rpb24oIGUsIGluc3RhbmNlLCBjdXJyZW50ICkge1xyXG5cdFx0XHRcdFx0dmFyIGdhbGxlcnk7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCAhY3VycmVudCB8fCBjdXJyZW50Lm9wdHMuaGFzaCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHQgICAgICAgICAgICBnYWxsZXJ5ID0gZ2V0R2FsbGVyeUlEKCBpbnN0YW5jZSApO1xyXG5cclxuXHRcdCAgICAgICAgICAgIC8vIFVwZGF0ZSB3aW5kb3cgaGFzaFxyXG5cdFx0ICAgICAgICAgICAgaWYgKCBnYWxsZXJ5ICYmIGdhbGxlcnkgIT09ICcnICkge1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCB3aW5kb3cubG9jYXRpb24uaGFzaC5pbmRleE9mKCBnYWxsZXJ5ICkgPCAwICkge1xyXG5cdFx0XHQgICAgICAgICAgICAgICAgaW5zdGFuY2Uub3B0cy5vcmlnSGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoO1xyXG5cdFx0XHQgICAgICAgICAgICB9XHJcblxyXG5cdFx0XHRcdFx0XHRjdXJyZW50SGFzaCA9IGdhbGxlcnkgKyAoIGluc3RhbmNlLmdyb3VwLmxlbmd0aCA+IDEgPyAnLScgKyAoIGN1cnJlbnQuaW5kZXggKyAxICkgOiAnJyApO1xyXG5cclxuXHRcdFx0XHRcdFx0aWYgKCAncmVwbGFjZVN0YXRlJyBpbiB3aW5kb3cuaGlzdG9yeSApIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIHRpbWVySUQgKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRjbGVhclRpbWVvdXQoIHRpbWVySUQgKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRpbWVySUQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0d2luZG93Lmhpc3RvcnlbIHNob3VsZENyZWF0ZUhpc3RvcnkgPyAncHVzaFN0YXRlJyA6ICdyZXBsYWNlU3RhdGUnIF0oIHt9ICwgZG9jdW1lbnQudGl0bGUsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggKyAnIycgKyAgY3VycmVudEhhc2ggKTtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHR0aW1lcklEID0gbnVsbDtcclxuXHJcblx0XHRcdFx0XHRcdFx0XHRzaG91bGRDcmVhdGVIaXN0b3J5ID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdFx0XHRcdH0sIDMwMCk7XHJcblxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gY3VycmVudEhhc2g7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHQgICAgICAgICAgICB9XHJcblxyXG5cdFx0ICAgICAgICB9LFxyXG5cclxuXHRcdFx0XHQnYmVmb3JlQ2xvc2UuZmInIDogZnVuY3Rpb24oIGUsIGluc3RhbmNlLCBjdXJyZW50ICkge1xyXG5cdFx0XHRcdFx0dmFyIGdhbGxlcnksIG9yaWdIYXNoO1xyXG5cclxuXHRcdFx0XHRcdGlmICggdGltZXJJRCApIHtcclxuXHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB0aW1lcklEICk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBjdXJyZW50Lm9wdHMuaGFzaCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybjtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRnYWxsZXJ5ICA9IGdldEdhbGxlcnlJRCggaW5zdGFuY2UgKTtcclxuXHRcdFx0XHRcdG9yaWdIYXNoID0gaW5zdGFuY2UgJiYgaW5zdGFuY2Uub3B0cy5vcmlnSGFzaCA/IGluc3RhbmNlLm9wdHMub3JpZ0hhc2ggOiAnJztcclxuXHJcblx0XHQgICAgICAgICAgICAvLyBSZW1vdmUgaGFzaCBmcm9tIGxvY2F0aW9uIGJhclxyXG5cdFx0ICAgICAgICAgICAgaWYgKCBnYWxsZXJ5ICYmIGdhbGxlcnkgIT09ICcnICkge1xyXG5cclxuXHRcdCAgICAgICAgICAgICAgICBpZiAoICdyZXBsYWNlU3RhdGUnIGluIGhpc3RvcnkgKSB7XHJcblx0XHRcdFx0XHRcdFx0d2luZG93Lmhpc3RvcnkucmVwbGFjZVN0YXRlKCB7fSAsIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoICsgb3JpZ0hhc2ggKTtcclxuXHJcblx0XHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24uaGFzaCA9IG9yaWdIYXNoO1xyXG5cclxuXHRcdFx0XHRcdFx0XHQvLyBLZWVwIG9yaWdpbmFsIHNjcm9sbCBwb3NpdGlvblxyXG5cdFx0XHRcdFx0XHRcdCQoIHdpbmRvdyApLnNjcm9sbFRvcCggaW5zdGFuY2Uuc2Nyb2xsVG9wICkuc2Nyb2xsTGVmdCggaW5zdGFuY2Uuc2Nyb2xsTGVmdCApO1xyXG5cdFx0ICAgICAgICAgICAgICAgIH1cclxuXHRcdCAgICAgICAgICAgIH1cclxuXHJcblx0XHRcdFx0XHRjdXJyZW50SGFzaCA9IG51bGw7XHJcblx0XHQgICAgICAgIH1cclxuXHRcdCAgICB9KTtcclxuXHJcblx0XHRcdC8vIENoZWNrIGlmIG5lZWQgdG8gY2xvc2UgYWZ0ZXIgdXJsIGhhcyBjaGFuZ2VkXHJcblx0XHRcdCQod2luZG93KS5vbignaGFzaGNoYW5nZS5mYicsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciB1cmwgPSBwYXJzZVVybCgpO1xyXG5cclxuXHRcdFx0XHRpZiAoICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKSApIHtcclxuXHRcdFx0XHRcdGlmICggY3VycmVudEhhc2ggJiYgY3VycmVudEhhc2ggIT09IHVybC5nYWxsZXJ5ICsgJy0nICsgdXJsLmluZGV4ICYmICEoIHVybC5pbmRleCA9PT0gMSAmJiBjdXJyZW50SGFzaCA9PSB1cmwuZ2FsbGVyeSApICkge1xyXG5cdFx0XHRcdFx0XHRjdXJyZW50SGFzaCA9IG51bGw7XHJcblxyXG5cdFx0XHRcdFx0XHQkLmZhbmN5Ym94LmNsb3NlKCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIHVybC5nYWxsZXJ5ICE9PSAnJyApIHtcclxuXHRcdFx0XHRcdHRyaWdnZXJGcm9tVXJsKCB1cmwgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgY3VycmVudCBoYXNoIGFuZCB0cmlnZ2VyIGNsaWNrIGV2ZW50IG9uIG1hdGNoaW5nIGVsZW1lbnQgdG8gc3RhcnQgZmFuY3lCb3gsIGlmIG5lZWRlZFxyXG5cdFx0XHR0cmlnZ2VyRnJvbVVybCggcGFyc2VVcmwoKSApO1xyXG5cclxuXHRcdH0sIDUwKTtcclxuXHJcbiAgICB9KTtcclxuXHJcbn0oZG9jdW1lbnQsIHdpbmRvdywgd2luZG93LmpRdWVyeSkpO1xyXG4iLCIvKiEgcmVzcG9uc2l2ZS1uYXYuanMgMS4wLjM5XG4gKiBodHRwczovL2dpdGh1Yi5jb20vdmlsamFtaXMvcmVzcG9uc2l2ZS1uYXYuanNcbiAqIGh0dHA6Ly9yZXNwb25zaXZlLW5hdi5jb21cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUgQHZpbGphbWlzXG4gKiBBdmFpbGFibGUgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKi9cblxuLyogZ2xvYmFsIEV2ZW50ICovXG4oZnVuY3Rpb24gKGRvY3VtZW50LCB3aW5kb3csIGluZGV4KSB7XG4gIC8vIEluZGV4IGlzIHVzZWQgdG8ga2VlcCBtdWx0aXBsZSBuYXZzIG9uIHRoZSBzYW1lIHBhZ2UgbmFtZXNwYWNlZFxuXG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIHZhciByZXNwb25zaXZlTmF2ID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG5cbiAgICB2YXIgY29tcHV0ZWQgPSAhIXdpbmRvdy5nZXRDb21wdXRlZFN0eWxlO1xuXG4gICAgLyoqXG4gICAgICogZ2V0Q29tcHV0ZWRTdHlsZSBwb2x5ZmlsbCBmb3Igb2xkIGJyb3dzZXJzXG4gICAgICovXG4gICAgaWYgKCFjb21wdXRlZCkge1xuICAgICAgd2luZG93LmdldENvbXB1dGVkU3R5bGUgPSBmdW5jdGlvbihlbCkge1xuICAgICAgICB0aGlzLmVsID0gZWw7XG4gICAgICAgIHRoaXMuZ2V0UHJvcGVydHlWYWx1ZSA9IGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgICAgICB2YXIgcmUgPSAvKFxcLShbYS16XSl7MX0pL2c7XG4gICAgICAgICAgaWYgKHByb3AgPT09IFwiZmxvYXRcIikge1xuICAgICAgICAgICAgcHJvcCA9IFwic3R5bGVGbG9hdFwiO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmUudGVzdChwcm9wKSkge1xuICAgICAgICAgICAgcHJvcCA9IHByb3AucmVwbGFjZShyZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICByZXR1cm4gYXJndW1lbnRzWzJdLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGVsLmN1cnJlbnRTdHlsZVtwcm9wXSA/IGVsLmN1cnJlbnRTdHlsZVtwcm9wXSA6IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfTtcbiAgICB9XG4gICAgLyogZXhwb3J0ZWQgYWRkRXZlbnQsIHJlbW92ZUV2ZW50LCBnZXRDaGlsZHJlbiwgc2V0QXR0cmlidXRlcywgYWRkQ2xhc3MsIHJlbW92ZUNsYXNzLCBmb3JFYWNoICovXG5cbiAgICAvKipcbiAgICAgKiBBZGQgRXZlbnRcbiAgICAgKiBmbiBhcmcgY2FuIGJlIGFuIG9iamVjdCBvciBhIGZ1bmN0aW9uLCB0aGFua3MgdG8gaGFuZGxlRXZlbnRcbiAgICAgKiByZWFkIG1vcmUgYXQ6IGh0dHA6Ly93d3cudGhlY3NzbmluamEuY29tL2phdmFzY3JpcHQvaGFuZGxlZXZlbnRcbiAgICAgKlxuICAgICAqIEBwYXJhbSAge2VsZW1lbnR9ICBlbGVtZW50XG4gICAgICogQHBhcmFtICB7ZXZlbnR9ICAgIGV2ZW50XG4gICAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuXG4gICAgICogQHBhcmFtICB7Ym9vbGVhbn0gIGJ1YmJsaW5nXG4gICAgICovXG4gICAgdmFyIGFkZEV2ZW50ID0gZnVuY3Rpb24gKGVsLCBldnQsIGZuLCBidWJibGUpIHtcbiAgICAgICAgaWYgKFwiYWRkRXZlbnRMaXN0ZW5lclwiIGluIGVsKSB7XG4gICAgICAgICAgLy8gQkJPUzYgZG9lc24ndCBzdXBwb3J0IGhhbmRsZUV2ZW50LCBjYXRjaCBhbmQgcG9seWZpbGxcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldnQsIGZuLCBidWJibGUpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09IFwib2JqZWN0XCIgJiYgZm4uaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgICAgZWwuYWRkRXZlbnRMaXN0ZW5lcihldnQsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gQmluZCBmbiBhcyB0aGlzIGFuZCBzZXQgZmlyc3QgYXJnIGFzIGV2ZW50IG9iamVjdFxuICAgICAgICAgICAgICAgIGZuLmhhbmRsZUV2ZW50LmNhbGwoZm4sIGUpO1xuICAgICAgICAgICAgICB9LCBidWJibGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXCJhdHRhY2hFdmVudFwiIGluIGVsKSB7XG4gICAgICAgICAgLy8gY2hlY2sgaWYgdGhlIGNhbGxiYWNrIGlzIGFuIG9iamVjdCBhbmQgY29udGFpbnMgaGFuZGxlRXZlbnRcbiAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSBcIm9iamVjdFwiICYmIGZuLmhhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICBlbC5hdHRhY2hFdmVudChcIm9uXCIgKyBldnQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgLy8gQmluZCBmbiBhcyB0aGlzXG4gICAgICAgICAgICAgIGZuLmhhbmRsZUV2ZW50LmNhbGwoZm4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLmF0dGFjaEV2ZW50KFwib25cIiArIGV2dCwgZm4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBSZW1vdmUgRXZlbnRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtlbGVtZW50fSAgZWxlbWVudFxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9ICAgIGV2ZW50XG4gICAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAgICAgICAqIEBwYXJhbSAge2Jvb2xlYW59ICBidWJibGluZ1xuICAgICAgICovXG4gICAgICByZW1vdmVFdmVudCA9IGZ1bmN0aW9uIChlbCwgZXZ0LCBmbiwgYnViYmxlKSB7XG4gICAgICAgIGlmIChcInJlbW92ZUV2ZW50TGlzdGVuZXJcIiBpbiBlbCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgZm4sIGJ1YmJsZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gXCJvYmplY3RcIiAmJiBmbi5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICBlbC5yZW1vdmVFdmVudExpc3RlbmVyKGV2dCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKGZuLCBlKTtcbiAgICAgICAgICAgICAgfSwgYnViYmxlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKFwiZGV0YWNoRXZlbnRcIiBpbiBlbCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09IFwib2JqZWN0XCIgJiYgZm4uaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgIGVsLmRldGFjaEV2ZW50KFwib25cIiArIGV2dCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBmbi5oYW5kbGVFdmVudC5jYWxsKGZuKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbC5kZXRhY2hFdmVudChcIm9uXCIgKyBldnQsIGZuKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogR2V0IHRoZSBjaGlsZHJlbiBvZiBhbnkgZWxlbWVudFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2VsZW1lbnR9XG4gICAgICAgKiBAcmV0dXJuIHthcnJheX0gUmV0dXJucyBtYXRjaGluZyBlbGVtZW50cyBpbiBhbiBhcnJheVxuICAgICAgICovXG4gICAgICBnZXRDaGlsZHJlbiA9IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChlLmNoaWxkcmVuLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgTmF2IGNvbnRhaW5lciBoYXMgbm8gY29udGFpbmluZyBlbGVtZW50c1wiKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTdG9yZSBhbGwgY2hpbGRyZW4gaW4gYXJyYXlcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgICAgIC8vIExvb3AgdGhyb3VnaCBjaGlsZHJlbiBhbmQgc3RvcmUgaW4gYXJyYXkgaWYgY2hpbGQgIT0gVGV4dE5vZGVcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGUuY2hpbGRyZW5baV0ubm9kZVR5cGUgPT09IDEpIHtcbiAgICAgICAgICAgIGNoaWxkcmVuLnB1c2goZS5jaGlsZHJlbltpXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjaGlsZHJlbjtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogU2V0cyBtdWx0aXBsZSBhdHRyaWJ1dGVzIGF0IG9uY2VcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSB7YXR0cnN9ICAgYXR0cnNcbiAgICAgICAqL1xuICAgICAgc2V0QXR0cmlidXRlcyA9IGZ1bmN0aW9uIChlbCwgYXR0cnMpIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIGF0dHJzKSB7XG4gICAgICAgICAgZWwuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkcyBhIGNsYXNzIHRvIGFueSBlbGVtZW50XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtlbGVtZW50fSBlbGVtZW50XG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gIGNsYXNzXG4gICAgICAgKi9cbiAgICAgIGFkZENsYXNzID0gZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgICAgICAgaWYgKGVsLmNsYXNzTmFtZS5pbmRleE9mKGNscykgIT09IDApIHtcbiAgICAgICAgICBlbC5jbGFzc05hbWUgKz0gXCIgXCIgKyBjbHM7XG4gICAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UoLyheXFxzKil8KFxccyokKS9nLFwiXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBhIGNsYXNzIGZyb20gYW55IGVsZW1lbnRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtlbGVtZW50fSBlbGVtZW50XG4gICAgICAgKiBAcGFyYW0gIHtzdHJpbmd9ICBjbGFzc1xuICAgICAgICovXG4gICAgICByZW1vdmVDbGFzcyA9IGZ1bmN0aW9uIChlbCwgY2xzKSB7XG4gICAgICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKFwiKFxcXFxzfF4pXCIgKyBjbHMgKyBcIihcXFxcc3wkKVwiKTtcbiAgICAgICAgZWwuY2xhc3NOYW1lID0gZWwuY2xhc3NOYW1lLnJlcGxhY2UocmVnLCBcIiBcIikucmVwbGFjZSgvKF5cXHMqKXwoXFxzKiQpL2csXCJcIik7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIGZvckVhY2ggbWV0aG9kIHRoYXQgcGFzc2VzIGJhY2sgdGhlIHN0dWZmIHdlIG5lZWRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHthcnJheX0gICAgYXJyYXlcbiAgICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAgICogQHBhcmFtICB7c2NvcGV9ICAgIHNjb3BlXG4gICAgICAgKi9cbiAgICAgIGZvckVhY2ggPSBmdW5jdGlvbiAoYXJyYXksIGNhbGxiYWNrLCBzY29wZSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY2FsbGJhY2suY2FsbChzY29wZSwgaSwgYXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgdmFyIG5hdixcbiAgICAgIG9wdHMsXG4gICAgICBuYXZUb2dnbGUsXG4gICAgICBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIiksXG4gICAgICBodG1sRWwgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICBoYXNBbmltRmluaXNoZWQsXG4gICAgICBpc01vYmlsZSxcbiAgICAgIG5hdk9wZW47XG5cbiAgICB2YXIgUmVzcG9uc2l2ZU5hdiA9IGZ1bmN0aW9uIChlbCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogRGVmYXVsdCBvcHRpb25zXG4gICAgICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgICAgICAgYW5pbWF0ZTogdHJ1ZSwgICAgICAgICAgICAgICAgICAgIC8vIEJvb2xlYW46IFVzZSBDU1MzIHRyYW5zaXRpb25zLCB0cnVlIG9yIGZhbHNlXG4gICAgICAgICAgdHJhbnNpdGlvbjogMjg0LCAgICAgICAgICAgICAgICAgIC8vIEludGVnZXI6IFNwZWVkIG9mIHRoZSB0cmFuc2l0aW9uLCBpbiBtaWxsaXNlY29uZHNcbiAgICAgICAgICBsYWJlbDogXCJNZW51XCIsICAgICAgICAgICAgICAgICAgICAvLyBTdHJpbmc6IExhYmVsIGZvciB0aGUgbmF2aWdhdGlvbiB0b2dnbGVcbiAgICAgICAgICBpbnNlcnQ6IFwiYmVmb3JlXCIsICAgICAgICAgICAgICAgICAvLyBTdHJpbmc6IEluc2VydCB0aGUgdG9nZ2xlIGJlZm9yZSBvciBhZnRlciB0aGUgbmF2aWdhdGlvblxuICAgICAgICAgIGN1c3RvbVRvZ2dsZTogXCJcIiwgICAgICAgICAgICAgICAgIC8vIFNlbGVjdG9yOiBTcGVjaWZ5IHRoZSBJRCBvZiBhIGN1c3RvbSB0b2dnbGVcbiAgICAgICAgICBjbG9zZU9uTmF2Q2xpY2s6IGZhbHNlLCAgICAgICAgICAgLy8gQm9vbGVhbjogQ2xvc2UgdGhlIG5hdmlnYXRpb24gd2hlbiBvbmUgb2YgdGhlIGxpbmtzIGFyZSBjbGlja2VkXG4gICAgICAgICAgb3BlblBvczogXCJyZWxhdGl2ZVwiLCAgICAgICAgICAgICAgLy8gU3RyaW5nOiBQb3NpdGlvbiBvZiB0aGUgb3BlbmVkIG5hdiwgcmVsYXRpdmUgb3Igc3RhdGljXG4gICAgICAgICAgbmF2Q2xhc3M6IFwibmF2LWNvbGxhcHNlXCIsICAgICAgICAgLy8gU3RyaW5nOiBEZWZhdWx0IENTUyBjbGFzcy4gSWYgY2hhbmdlZCwgeW91IG5lZWQgdG8gZWRpdCB0aGUgQ1NTIHRvbyFcbiAgICAgICAgICBuYXZBY3RpdmVDbGFzczogXCJqcy1uYXYtYWN0aXZlXCIsICAvLyBTdHJpbmc6IENsYXNzIHRoYXQgaXMgYWRkZWQgdG8gPGh0bWw+IGVsZW1lbnQgd2hlbiBuYXYgaXMgYWN0aXZlXG4gICAgICAgICAganNDbGFzczogXCJqc1wiLCAgICAgICAgICAgICAgICAgICAgLy8gU3RyaW5nOiAnSlMgZW5hYmxlZCcgY2xhc3Mgd2hpY2ggaXMgYWRkZWQgdG8gPGh0bWw+IGVsZW1lbnRcbiAgICAgICAgICBpbml0OiBmdW5jdGlvbigpe30sICAgICAgICAgICAgICAgLy8gRnVuY3Rpb246IEluaXQgY2FsbGJhY2tcbiAgICAgICAgICBvcGVuOiBmdW5jdGlvbigpe30sICAgICAgICAgICAgICAgLy8gRnVuY3Rpb246IE9wZW4gY2FsbGJhY2tcbiAgICAgICAgICBjbG9zZTogZnVuY3Rpb24oKXt9ICAgICAgICAgICAgICAgLy8gRnVuY3Rpb246IENsb3NlIGNhbGxiYWNrXG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gVXNlciBkZWZpbmVkIG9wdGlvbnNcbiAgICAgICAgZm9yIChpIGluIG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLm9wdGlvbnNbaV0gPSBvcHRpb25zW2ldO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkcyBcImpzXCIgY2xhc3MgZm9yIDxodG1sPlxuICAgICAgICBhZGRDbGFzcyhodG1sRWwsIHRoaXMub3B0aW9ucy5qc0NsYXNzKTtcblxuICAgICAgICAvLyBXcmFwcGVyXG4gICAgICAgIHRoaXMud3JhcHBlckVsID0gZWwucmVwbGFjZShcIiNcIiwgXCJcIik7XG5cbiAgICAgICAgLy8gVHJ5IHNlbGVjdGluZyBJRCBmaXJzdFxuICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy53cmFwcGVyRWwpKSB7XG4gICAgICAgICAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy53cmFwcGVyRWwpO1xuXG4gICAgICAgIC8vIElmIGVsZW1lbnQgd2l0aCBhbiBJRCBkb2Vzbid0IGV4aXN0LCB1c2UgcXVlcnlTZWxlY3RvclxuICAgICAgICB9IGVsc2UgaWYgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGhpcy53cmFwcGVyRWwpKSB7XG4gICAgICAgICAgdGhpcy53cmFwcGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLndyYXBwZXJFbCk7XG5cbiAgICAgICAgLy8gSWYgZWxlbWVudCBkb2Vzbid0IGV4aXN0cywgc3RvcCBoZXJlLlxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBuYXYgZWxlbWVudCB5b3UgYXJlIHRyeWluZyB0byBzZWxlY3QgZG9lc24ndCBleGlzdFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElubmVyIHdyYXBwZXJcbiAgICAgICAgdGhpcy53cmFwcGVyLmlubmVyID0gZ2V0Q2hpbGRyZW4odGhpcy53cmFwcGVyKTtcblxuICAgICAgICAvLyBGb3IgbWluaWZpY2F0aW9uXG4gICAgICAgIG9wdHMgPSB0aGlzLm9wdGlvbnM7XG4gICAgICAgIG5hdiA9IHRoaXMud3JhcHBlcjtcblxuICAgICAgICAvLyBJbml0XG4gICAgICAgIHRoaXMuX2luaXQodGhpcyk7XG4gICAgICB9O1xuXG4gICAgUmVzcG9uc2l2ZU5hdi5wcm90b3R5cGUgPSB7XG5cbiAgICAgIC8qKlxuICAgICAgICogVW5hdHRhY2hlcyBldmVudHMgYW5kIHJlbW92ZXMgYW55IGNsYXNzZXMgdGhhdCB3ZXJlIGFkZGVkXG4gICAgICAgKi9cbiAgICAgIGRlc3Ryb3k6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5fcmVtb3ZlU3R5bGVzKCk7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgXCJjbG9zZWRcIik7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgXCJvcGVuZWRcIik7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgb3B0cy5uYXZDbGFzcyk7XG4gICAgICAgIHJlbW92ZUNsYXNzKG5hdiwgb3B0cy5uYXZDbGFzcyArIFwiLVwiICsgdGhpcy5pbmRleCk7XG4gICAgICAgIHJlbW92ZUNsYXNzKGh0bWxFbCwgb3B0cy5uYXZBY3RpdmVDbGFzcyk7XG4gICAgICAgIG5hdi5yZW1vdmVBdHRyaWJ1dGUoXCJzdHlsZVwiKTtcbiAgICAgICAgbmF2LnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpO1xuXG4gICAgICAgIHJlbW92ZUV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudCh3aW5kb3csIFwiZm9jdXNcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChkb2N1bWVudC5ib2R5LCBcInRvdWNobW92ZVwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KG5hdlRvZ2dsZSwgXCJ0b3VjaHN0YXJ0XCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcInRvdWNoZW5kXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcIm1vdXNldXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwia2V5dXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwiY2xpY2tcIiwgdGhpcywgZmFsc2UpO1xuXG4gICAgICAgIGlmICghb3B0cy5jdXN0b21Ub2dnbGUpIHtcbiAgICAgICAgICBuYXZUb2dnbGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChuYXZUb2dnbGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5hdlRvZ2dsZS5yZW1vdmVBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBUb2dnbGVzIHRoZSBuYXZpZ2F0aW9uIG9wZW4vY2xvc2VcbiAgICAgICAqL1xuICAgICAgdG9nZ2xlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChoYXNBbmltRmluaXNoZWQgPT09IHRydWUpIHtcbiAgICAgICAgICBpZiAoIW5hdk9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIE9wZW5zIHRoZSBuYXZpZ2F0aW9uXG4gICAgICAgKi9cbiAgICAgIG9wZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFuYXZPcGVuKSB7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBcImNsb3NlZFwiKTtcbiAgICAgICAgICBhZGRDbGFzcyhuYXYsIFwib3BlbmVkXCIpO1xuICAgICAgICAgIGFkZENsYXNzKGh0bWxFbCwgb3B0cy5uYXZBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgYWRkQ2xhc3MobmF2VG9nZ2xlLCBcImFjdGl2ZVwiKTtcbiAgICAgICAgICBuYXYuc3R5bGUucG9zaXRpb24gPSBvcHRzLm9wZW5Qb3M7XG4gICAgICAgICAgc2V0QXR0cmlidXRlcyhuYXYsIHtcImFyaWEtaGlkZGVuXCI6IFwiZmFsc2VcIn0pO1xuICAgICAgICAgIG5hdk9wZW4gPSB0cnVlO1xuICAgICAgICAgIG9wdHMub3BlbigpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENsb3NlcyB0aGUgbmF2aWdhdGlvblxuICAgICAgICovXG4gICAgICBjbG9zZTogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAobmF2T3Blbikge1xuICAgICAgICAgIGFkZENsYXNzKG5hdiwgXCJjbG9zZWRcIik7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBcIm9wZW5lZFwiKTtcbiAgICAgICAgICByZW1vdmVDbGFzcyhodG1sRWwsIG9wdHMubmF2QWN0aXZlQ2xhc3MpO1xuICAgICAgICAgIHJlbW92ZUNsYXNzKG5hdlRvZ2dsZSwgXCJhY3RpdmVcIik7XG4gICAgICAgICAgc2V0QXR0cmlidXRlcyhuYXYsIHtcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwifSk7XG5cbiAgICAgICAgICAvLyBJZiBhbmltYXRpb25zIGFyZSBlbmFibGVkLCB3YWl0IHVudGlsIHRoZXkgZmluaXNoXG4gICAgICAgICAgaWYgKG9wdHMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgaGFzQW5pbUZpbmlzaGVkID0gZmFsc2U7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgbmF2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgICAgICBoYXNBbmltRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICAgICAgfSwgb3B0cy50cmFuc2l0aW9uICsgMTApO1xuXG4gICAgICAgICAgLy8gQW5pbWF0aW9ucyBhcmVuJ3QgZW5hYmxlZCwgd2UgY2FuIGRvIHRoZXNlIGltbWVkaWF0ZWx5XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuYXZPcGVuID0gZmFsc2U7XG4gICAgICAgICAgb3B0cy5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlc2l6ZSBpcyBjYWxsZWQgb24gd2luZG93IHJlc2l6ZSBhbmQgb3JpZW50YXRpb24gY2hhbmdlLlxuICAgICAgICogSXQgaW5pdGlhbGl6ZXMgdGhlIENTUyBzdHlsZXMgYW5kIGhlaWdodCBjYWxjdWxhdGlvbnMuXG4gICAgICAgKi9cbiAgICAgIHJlc2l6ZTogZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIC8vIFJlc2l6ZSB3YXRjaGVzIG5hdmlnYXRpb24gdG9nZ2xlJ3MgZGlzcGxheSBzdGF0ZVxuICAgICAgICBpZiAod2luZG93LmdldENvbXB1dGVkU3R5bGUobmF2VG9nZ2xlLCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKFwiZGlzcGxheVwiKSAhPT0gXCJub25lXCIpIHtcblxuICAgICAgICAgIGlzTW9iaWxlID0gdHJ1ZTtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdlRvZ2dsZSwge1wiYXJpYS1oaWRkZW5cIjogXCJmYWxzZVwifSk7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgbmF2aWdhdGlvbiBpcyBoaWRkZW5cbiAgICAgICAgICBpZiAobmF2LmNsYXNzTmFtZS5tYXRjaCgvKF58XFxzKWNsb3NlZChcXHN8JCkvKSkge1xuICAgICAgICAgICAgc2V0QXR0cmlidXRlcyhuYXYsIHtcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwifSk7XG4gICAgICAgICAgICBuYXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fY3JlYXRlU3R5bGVzKCk7XG4gICAgICAgICAgdGhpcy5fY2FsY0hlaWdodCgpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgaXNNb2JpbGUgPSBmYWxzZTtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdlRvZ2dsZSwge1wiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCJ9KTtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdiwge1wiYXJpYS1oaWRkZW5cIjogXCJmYWxzZVwifSk7XG4gICAgICAgICAgbmF2LnN0eWxlLnBvc2l0aW9uID0gb3B0cy5vcGVuUG9zO1xuICAgICAgICAgIHRoaXMuX3JlbW92ZVN0eWxlcygpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRha2VzIGNhcmUgb2YgYWxsIGV2ZW4gaGFuZGxpbmdcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqIEByZXR1cm4ge3R5cGV9IHJldHVybnMgdGhlIHR5cGUgb2YgZXZlbnQgdGhhdCBzaG91bGQgYmUgdXNlZFxuICAgICAgICovXG4gICAgICBoYW5kbGVFdmVudDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgdmFyIGV2dCA9IGUgfHwgd2luZG93LmV2ZW50O1xuXG4gICAgICAgIHN3aXRjaCAoZXZ0LnR5cGUpIHtcbiAgICAgICAgY2FzZSBcInRvdWNoc3RhcnRcIjpcbiAgICAgICAgICB0aGlzLl9vblRvdWNoU3RhcnQoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInRvdWNobW92ZVwiOlxuICAgICAgICAgIHRoaXMuX29uVG91Y2hNb3ZlKGV2dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ0b3VjaGVuZFwiOlxuICAgICAgICBjYXNlIFwibW91c2V1cFwiOlxuICAgICAgICAgIHRoaXMuX29uVG91Y2hFbmQoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNsaWNrXCI6XG4gICAgICAgICAgdGhpcy5fcHJldmVudERlZmF1bHQoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImtleXVwXCI6XG4gICAgICAgICAgdGhpcy5fb25LZXlVcChldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZm9jdXNcIjpcbiAgICAgICAgY2FzZSBcInJlc2l6ZVwiOlxuICAgICAgICAgIHRoaXMucmVzaXplKGV2dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogSW5pdGlhbGl6ZXMgdGhlIHdpZGdldFxuICAgICAgICovXG4gICAgICBfaW5pdDogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXgrKztcblxuICAgICAgICBhZGRDbGFzcyhuYXYsIG9wdHMubmF2Q2xhc3MpO1xuICAgICAgICBhZGRDbGFzcyhuYXYsIG9wdHMubmF2Q2xhc3MgKyBcIi1cIiArIHRoaXMuaW5kZXgpO1xuICAgICAgICBhZGRDbGFzcyhuYXYsIFwiY2xvc2VkXCIpO1xuICAgICAgICBoYXNBbmltRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBuYXZPcGVuID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fY2xvc2VPbk5hdkNsaWNrKCk7XG4gICAgICAgIHRoaXMuX2NyZWF0ZVRvZ2dsZSgpO1xuICAgICAgICB0aGlzLl90cmFuc2l0aW9ucygpO1xuICAgICAgICB0aGlzLnJlc2l6ZSgpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBPbiBJRTggdGhlIHJlc2l6ZSBldmVudCB0cmlnZ2VycyB0b28gZWFybHkgZm9yIHNvbWUgcmVhc29uXG4gICAgICAgICAqIHNvIGl0J3MgY2FsbGVkIGhlcmUgYWdhaW4gb24gaW5pdCB0byBtYWtlIHN1cmUgYWxsIHRoZVxuICAgICAgICAgKiBjYWxjdWxhdGVkIHN0eWxlcyBhcmUgY29ycmVjdC5cbiAgICAgICAgICovXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgc2VsZi5yZXNpemUoKTtcbiAgICAgICAgfSwgMjApO1xuXG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJyZXNpemVcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudCh3aW5kb3csIFwiZm9jdXNcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChkb2N1bWVudC5ib2R5LCBcInRvdWNobW92ZVwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KG5hdlRvZ2dsZSwgXCJ0b3VjaHN0YXJ0XCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQobmF2VG9nZ2xlLCBcInRvdWNoZW5kXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQobmF2VG9nZ2xlLCBcIm1vdXNldXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChuYXZUb2dnbGUsIFwia2V5dXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChuYXZUb2dnbGUsIFwiY2xpY2tcIiwgdGhpcywgZmFsc2UpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBJbml0IGNhbGxiYWNrIGhlcmVcbiAgICAgICAgICovXG4gICAgICAgIG9wdHMuaW5pdCgpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIFN0eWxlcyB0byB0aGUgPGhlYWQ+XG4gICAgICAgKi9cbiAgICAgIF9jcmVhdGVTdHlsZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIHN0eWxlRWxlbWVudC50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXS5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZXMgc3R5bGVzIGZyb20gdGhlIDxoZWFkPlxuICAgICAgICovXG4gICAgICBfcmVtb3ZlU3R5bGVzOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSkge1xuICAgICAgICAgIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ3JlYXRlcyBOYXZpZ2F0aW9uIFRvZ2dsZVxuICAgICAgICovXG4gICAgICBfY3JlYXRlVG9nZ2xlOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gSWYgdGhlcmUncyBubyB0b2dnbGUsIGxldCdzIGNyZWF0ZSBvbmVcbiAgICAgICAgaWYgKCFvcHRzLmN1c3RvbVRvZ2dsZSkge1xuICAgICAgICAgIHZhciB0b2dnbGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICAgICAgICB0b2dnbGUuaW5uZXJIVE1MID0gb3B0cy5sYWJlbDtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKHRvZ2dsZSwge1xuICAgICAgICAgICAgXCJocmVmXCI6IFwiI1wiLFxuICAgICAgICAgICAgXCJjbGFzc1wiOiBcIm5hdi10b2dnbGVcIlxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgLy8gRGV0ZXJtaW5lIHdoZXJlIHRvIGluc2VydCB0aGUgdG9nZ2xlXG4gICAgICAgICAgaWYgKG9wdHMuaW5zZXJ0ID09PSBcImFmdGVyXCIpIHtcbiAgICAgICAgICAgIG5hdi5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0b2dnbGUsIG5hdi5uZXh0U2libGluZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG5hdi5wYXJlbnROb2RlLmluc2VydEJlZm9yZSh0b2dnbGUsIG5hdik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmF2VG9nZ2xlID0gdG9nZ2xlO1xuXG4gICAgICAgIC8vIFRoZXJlIGlzIGEgdG9nZ2xlIGFscmVhZHksIGxldCdzIHVzZSB0aGF0IG9uZVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB0b2dnbGVFbCA9IG9wdHMuY3VzdG9tVG9nZ2xlLnJlcGxhY2UoXCIjXCIsIFwiXCIpO1xuXG4gICAgICAgICAgaWYgKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRvZ2dsZUVsKSkge1xuICAgICAgICAgICAgbmF2VG9nZ2xlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9nZ2xlRWwpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0b2dnbGVFbCkpIHtcbiAgICAgICAgICAgIG5hdlRvZ2dsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodG9nZ2xlRWwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgY3VzdG9tIG5hdiB0b2dnbGUgeW91IGFyZSB0cnlpbmcgdG8gc2VsZWN0IGRvZXNuJ3QgZXhpc3RcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENsb3NlcyB0aGUgbmF2aWdhdGlvbiB3aGVuIGEgbGluayBpbnNpZGUgaXMgY2xpY2tlZC5cbiAgICAgICAqL1xuICAgICAgX2Nsb3NlT25OYXZDbGljazogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAob3B0cy5jbG9zZU9uTmF2Q2xpY2spIHtcbiAgICAgICAgICB2YXIgbGlua3MgPSBuYXYuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJhXCIpLFxuICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgZm9yRWFjaChsaW5rcywgZnVuY3Rpb24gKGksIGVsKSB7XG4gICAgICAgICAgICBhZGRFdmVudChsaW5rc1tpXSwgXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgICAgICAgICAgIHNlbGYudG9nZ2xlKCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBQcmV2ZW50cyB0aGUgZGVmYXVsdCBmdW5jdGlvbmFsaXR5LlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSBldmVudFxuICAgICAgICovXG4gICAgICBfcHJldmVudERlZmF1bHQ6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKGUucHJldmVudERlZmF1bHQpIHtcbiAgICAgICAgICBpZiAoZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgIGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcblxuICAgICAgICAvLyBUaGlzIGlzIHN0cmljdGx5IGZvciBvbGQgSUVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogT24gdG91Y2ggc3RhcnQgd2UgZ2V0IHRoZSBsb2NhdGlvbiBvZiB0aGUgdG91Y2guXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9vblRvdWNoU3RhcnQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICghRXZlbnQucHJvdG90eXBlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuICAgICAgICAgIHRoaXMuX3ByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRYID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICAgIHRoaXMuc3RhcnRZID0gZS50b3VjaGVzWzBdLmNsaWVudFk7XG4gICAgICAgIHRoaXMudG91Y2hIYXNNb3ZlZCA9IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBSZW1vdmUgbW91c2V1cCBldmVudCBjb21wbGV0ZWx5IGhlcmUgdG8gYXZvaWRcbiAgICAgICAgICogZG91YmxlIHRyaWdnZXJpbmcgdGhlIGV2ZW50LlxuICAgICAgICAgKi9cbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcIm1vdXNldXBcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDaGVjayBpZiB0aGUgdXNlciBpcyBzY3JvbGxpbmcgaW5zdGVhZCBvZiB0YXBwaW5nLlxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSBldmVudFxuICAgICAgICovXG4gICAgICBfb25Ub3VjaE1vdmU6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmIChNYXRoLmFicyhlLnRvdWNoZXNbMF0uY2xpZW50WCAtIHRoaXMuc3RhcnRYKSA+IDEwIHx8XG4gICAgICAgIE1hdGguYWJzKGUudG91Y2hlc1swXS5jbGllbnRZIC0gdGhpcy5zdGFydFkpID4gMTApIHtcbiAgICAgICAgICB0aGlzLnRvdWNoSGFzTW92ZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIE9uIHRvdWNoIGVuZCB0b2dnbGUgdGhlIG5hdmlnYXRpb24uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9vblRvdWNoRW5kOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB0aGlzLl9wcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgaWYgKCFpc01vYmlsZSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZSB1c2VyIGlzbid0IHNjcm9sbGluZ1xuICAgICAgICBpZiAoIXRoaXMudG91Y2hIYXNNb3ZlZCkge1xuXG4gICAgICAgICAgLy8gSWYgdGhlIGV2ZW50IHR5cGUgaXMgdG91Y2hcbiAgICAgICAgICBpZiAoZS50eXBlID09PSBcInRvdWNoZW5kXCIpIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgICByZXR1cm47XG5cbiAgICAgICAgICAvLyBFdmVudCB0eXBlIHdhcyBjbGljaywgbm90IHRvdWNoXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBldnQgPSBlIHx8IHdpbmRvdy5ldmVudDtcblxuICAgICAgICAgICAgLy8gSWYgaXQgaXNuJ3QgYSByaWdodCBjbGljaywgZG8gdG9nZ2xpbmdcbiAgICAgICAgICAgIGlmICghKGV2dC53aGljaCA9PT0gMyB8fCBldnQuYnV0dG9uID09PSAyKSkge1xuICAgICAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBGb3Iga2V5Ym9hcmQgYWNjZXNzaWJpbGl0eSwgdG9nZ2xlIHRoZSBuYXZpZ2F0aW9uIG9uIEVudGVyXG4gICAgICAgKiBrZXlwcmVzcyB0b28uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9vbktleVVwOiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgZXZ0ID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgIGlmIChldnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICB0aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEFkZHMgdGhlIG5lZWRlZCBDU1MgdHJhbnNpdGlvbnMgaWYgYW5pbWF0aW9ucyBhcmUgZW5hYmxlZFxuICAgICAgICovXG4gICAgICBfdHJhbnNpdGlvbnM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKG9wdHMuYW5pbWF0ZSkge1xuICAgICAgICAgIHZhciBvYmpTdHlsZSA9IG5hdi5zdHlsZSxcbiAgICAgICAgICAgIHRyYW5zaXRpb24gPSBcIm1heC1oZWlnaHQgXCIgKyBvcHRzLnRyYW5zaXRpb24gKyBcIm1zXCI7XG5cbiAgICAgICAgICBvYmpTdHlsZS5XZWJraXRUcmFuc2l0aW9uID1cbiAgICAgICAgICBvYmpTdHlsZS5Nb3pUcmFuc2l0aW9uID1cbiAgICAgICAgICBvYmpTdHlsZS5PVHJhbnNpdGlvbiA9XG4gICAgICAgICAgb2JqU3R5bGUudHJhbnNpdGlvbiA9IHRyYW5zaXRpb247XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2FsY3VsYXRlcyB0aGUgaGVpZ2h0IG9mIHRoZSBuYXZpZ2F0aW9uIGFuZCB0aGVuIGNyZWF0ZXNcbiAgICAgICAqIHN0eWxlcyB3aGljaCBhcmUgbGF0ZXIgYWRkZWQgdG8gdGhlIHBhZ2UgPGhlYWQ+XG4gICAgICAgKi9cbiAgICAgIF9jYWxjSGVpZ2h0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzYXZlZEhlaWdodCA9IDA7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmF2LmlubmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgc2F2ZWRIZWlnaHQgKz0gbmF2LmlubmVyW2ldLm9mZnNldEhlaWdodDtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBpbm5lclN0eWxlcyA9IFwiLlwiICsgb3B0cy5qc0NsYXNzICsgXCIgLlwiICsgb3B0cy5uYXZDbGFzcyArIFwiLVwiICsgdGhpcy5pbmRleCArIFwiLm9wZW5lZHttYXgtaGVpZ2h0OlwiICsgc2F2ZWRIZWlnaHQgKyBcInB4ICFpbXBvcnRhbnR9IC5cIiArIG9wdHMuanNDbGFzcyArIFwiIC5cIiArIG9wdHMubmF2Q2xhc3MgKyBcIi1cIiArIHRoaXMuaW5kZXggKyBcIi5vcGVuZWQuZHJvcGRvd24tYWN0aXZlIHttYXgtaGVpZ2h0Ojk5OTlweCAhaW1wb3J0YW50fVwiO1xuXG4gICAgICAgIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgICAgICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBpbm5lclN0eWxlcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzdHlsZUVsZW1lbnQuaW5uZXJIVE1MID0gaW5uZXJTdHlsZXM7XG4gICAgICAgIH1cblxuICAgICAgICBpbm5lclN0eWxlcyA9IFwiXCI7XG4gICAgICB9XG5cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIG5ldyBSZXNwb25zaXZlIE5hdlxuICAgICAqL1xuICAgIHJldHVybiBuZXcgUmVzcG9uc2l2ZU5hdihlbCwgb3B0aW9ucyk7XG5cbiAgfTtcblxuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gcmVzcG9uc2l2ZU5hdjtcbiAgfSBlbHNlIHtcbiAgICB3aW5kb3cucmVzcG9uc2l2ZU5hdiA9IHJlc3BvbnNpdmVOYXY7XG4gIH1cblxufShkb2N1bWVudCwgd2luZG93LCAwKSk7XG4iLCJ2YXIgbmF2ID0gcmVzcG9uc2l2ZU5hdihcIi5uYXYtY29sbGFwc2VcIik7XG5cbmpRdWVyeShkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oICQgKSB7XG5cbiAgJChcIltkYXRhLWZhbmN5Ym94XVwiKS5mYW5jeWJveCh7XG5cdFx0bG9vcCAgICAgOiB0cnVlXG5cdH0pO1xuXG59KTtcbiJdfQ==
