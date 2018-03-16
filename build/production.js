'use strict';

// ==================================================
// fancyBox v3.2.5
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

        if ('console' in window) {
            console.log('fancyBox already initialized');
        }

        return;
    }

    // Private default settings
    // ========================

    var defaults = {

        // Enable infinite gallery navigation
        loop: false,

        // Space around image, ignored if zoomed-in or viewport width is smaller than 800px
        margin: [44, 0],

        // Horizontal space between slides
        gutter: 50,

        // Enable keyboard navigation
        keyboard: true,

        // Should display navigation arrows at the screen edges
        arrows: true,

        // Should display infobar (counter and arrows at the top)
        infobar: true,

        // Should display toolbar (buttons at the top)
        toolbar: true,

        // What buttons should appear in the top right corner.
        // Buttons will be created using templates from `btnTpl` option
        // and they will be placed into toolbar (class="fancybox-toolbar"` element)
        buttons: ['slideShow', 'fullScreen', 'thumbs', 'share',
        //'download',
        //'zoom',
        'close'],

        // Detect "idle" time in seconds
        idleTime: 3,

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

        // Default content type if cannot be detected automatically
        defaultType: 'image',

        // Open/close animation type
        // Possible values:
        //   false            - disable
        //   "zoom"           - zoom images from/to thumbnail
        //   "fade"
        //   "zoom-in-out"
        //
        animationEffect: "zoom",

        // Duration in ms for open/close animation
        animationDuration: 500,

        // Should image change opacity while zooming
        // If opacity is "auto", then opacity will be changed if image and thumbnail have different aspect ratios
        zoomOpacity: "auto",

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
        baseTpl: '<div class="fancybox-container" role="dialog" tabindex="-1">' + '<div class="fancybox-bg"></div>' + '<div class="fancybox-inner">' + '<div class="fancybox-infobar">' + '<span data-fancybox-index></span>&nbsp;/&nbsp;<span data-fancybox-count></span>' + '</div>' + '<div class="fancybox-toolbar">{{buttons}}</div>' + '<div class="fancybox-navigation">{{arrows}}</div>' + '<div class="fancybox-stage"></div>' + '<div class="fancybox-caption-wrap"><div class="fancybox-caption"></div></div>' + '</div>' + '</div>',

        // Loading indicator template
        spinnerTpl: '<div class="fancybox-loading"></div>',

        // Error message template
        errorTpl: '<div class="fancybox-error"><p>{{ERROR}}<p></div>',

        btnTpl: {

            download: '<a download data-fancybox-download class="fancybox-button fancybox-button--download" title="{{DOWNLOAD}}">' + '<svg viewBox="0 0 40 40">' + '<path d="M20,23 L20,8 L20,23 L13,16 L20,23 L27,16 L20,23 M26,28 L13,28 L27,28 L14,28" />' + '</svg>' + '</a>',

            zoom: '<button data-fancybox-zoom class="fancybox-button fancybox-button--zoom" title="{{ZOOM}}">' + '<svg viewBox="0 0 40 40">' + '<path d="M 18,17 m-8,0 a 8,8 0 1,0 16,0 a 8,8 0 1,0 -16,0 M25,23 L31,29 L25,23" />' + '</svg>' + '</button>',

            close: '<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' + '<svg viewBox="0 0 40 40">' + '<path d="M10,10 L30,30 M30,10 L10,30" />' + '</svg>' + '</button>',

            // This small close button will be appended to your html/inline/ajax content by default,
            // if "smallBtn" option is not set to false
            smallBtn: '<button data-fancybox-close class="fancybox-close-small" title="{{CLOSE}}"></button>',

            // Arrows
            arrowLeft: '<button data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}">' + '<svg viewBox="0 0 40 40">' + '<path d="M10,20 L30,20 L10,20 L18,28 L10,20 L18,12 L10,20"></path>' + '</svg>' + '</button>',

            arrowRight: '<button data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}">' + '<svg viewBox="0 0 40 40">' + '<path d="M30,20 L10,20 L30,20 L22,28 L30,20 L22,12 L30,20"></path>' + '</svg>' + '</button>'
        },

        // Container is injected into this element
        parentEl: 'body',

        // Focus handling
        // ==============

        // Try to focus on the first focusable element after opening
        autoFocus: false,

        // Put focus back to active element after closing
        backFocus: true,

        // Do not let user to focus on element outside modal content
        trapFocus: true,

        // Module specific options
        // =======================

        fullScreen: {
            autoStart: false
        },

        // Set `touch: false` to disable dragging/swiping
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
            hideOnClose: true, // Hide thumbnail grid when closing animation starts
            parentEl: '.fancybox-container', // Container is injected into this element
            axis: 'y' // Vertical (y) or horizontal (x) scrolling
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
            margin: 0,

            clickContent: function clickContent(current, event) {
                return current.type === 'image' ? 'toggleControls' : false;
            },
            clickSlide: function clickSlide(current, event) {
                return current.type === 'image' ? 'toggleControls' : 'close';
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
                THUMBS: 'Thumbnails',
                DOWNLOAD: 'Download',
                SHARE: 'Share',
                ZOOM: 'Zoom'
            },
            'de': {
                CLOSE: 'Schliessen',
                NEXT: 'Weiter',
                PREV: 'Zurück',
                ERROR: 'Die angeforderten Daten konnten nicht geladen werden. <br/> Bitte versuchen Sie es später nochmal.',
                PLAY_START: 'Diaschau starten',
                PLAY_STOP: 'Diaschau beenden',
                FULL_SCREEN: 'Vollbild',
                THUMBS: 'Vorschaubilder',
                DOWNLOAD: 'Herunterladen',
                SHARE: 'Teilen',
                ZOOM: 'Maßstab'
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

        return 'transitionend';
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

        self.opts = $.extend(true, { index: index }, $.fancybox.defaults, opts || {});

        if ($.fancybox.isMobile) {
            self.opts = $.extend(true, {}, self.opts, self.opts.mobile);
        }

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

        self.init();
    };

    $.extend(FancyBox.prototype, {

        // Create DOM structure
        // ====================

        init: function init() {
            var self = this,
                firstItem = self.group[self.currIndex],
                firstItemOpts = firstItem.opts,
                scrollbarWidth = $.fancybox.scrollbarWidth,
                $scrollDiv,
                $container,
                buttonStr;

            self.scrollTop = $D.scrollTop();
            self.scrollLeft = $D.scrollLeft();

            // Hide scrollbars
            // ===============

            if (!$.fancybox.getInstance()) {

                $('body').addClass('fancybox-active');

                // iOS hack
                if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {

                    // iOS has problems for input elements inside fixed containers,
                    // the workaround is to apply `position: fixed` to `<body>` element,
                    // unfortunately, this makes it lose the scrollbars and forces address bar to appear.

                    if (firstItem.type !== 'image') {
                        $('body').css('top', $('body').scrollTop() * -1).addClass('fancybox-iosfix');
                    }
                } else if (!$.fancybox.isMobile && document.body.scrollHeight > window.innerHeight) {

                    if (scrollbarWidth === undefined) {
                        $scrollDiv = $('<div style="width:50px;height:50px;overflow:scroll;" />').appendTo('body');

                        scrollbarWidth = $.fancybox.scrollbarWidth = $scrollDiv[0].offsetWidth - $scrollDiv[0].clientWidth;

                        $scrollDiv.remove();
                    }

                    $('head').append('<style id="fancybox-style-noscroll" type="text/css">.compensate-for-scrollbar { margin-right: ' + scrollbarWidth + 'px; }</style>');
                    $('body').addClass('compensate-for-scrollbar');
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
            $container = $(self.translate(self, firstItemOpts.baseTpl.replace('\{\{buttons\}\}', buttonStr).replace('\{\{arrows\}\}', firstItemOpts.btnTpl.arrowLeft + firstItemOpts.btnTpl.arrowRight))).attr('id', 'fancybox-container-' + self.id).addClass('fancybox-is-hidden').addClass(firstItemOpts.baseClass).data('FancyBox', self).appendTo(firstItemOpts.parentEl);

            // Create object holding references to jQuery wrapped nodes
            self.$refs = {
                container: $container
            };

            ['bg', 'inner', 'infobar', 'toolbar', 'stage', 'caption', 'navigation'].forEach(function (item) {
                self.$refs[item] = $container.find('.fancybox-' + item);
            });

            self.trigger('onInit');

            // Enable events, deactive previous instances
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

                    // Here we probably have jQuery collection returned by some selector
                    $item = $(item);

                    opts = $item.data();
                    opts = $.extend({}, opts, opts.options || {});

                    // Here we store clicked element
                    opts.$orig = $item;

                    obj.src = opts.src || $item.attr('href');

                    // Assume that simple syntax is used, for example:
                    //   `$.fancybox.open( $("#test"), {} );`
                    if (!obj.type && !obj.src) {
                        obj.type = 'inline';
                        obj.src = item;
                    }
                } else {

                    // Assume we have a simple html code, for example:
                    //   $.fancybox.open( '<div><h1>Hi!</h1></div>' );

                    obj = {
                        type: 'html',
                        src: item + ''
                    };
                }

                // Each gallery object has full collection of options
                obj.opts = $.extend(true, {}, self.opts, opts);

                // Do not merge buttons array
                if ($.isArray(opts.buttons)) {
                    obj.opts.buttons = opts.buttons;
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

                if (type) {
                    obj.type = type;
                } else {
                    self.trigger('objectNeedsType', obj);
                }

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

                // "caption" is a "special" option, it can be used to customize caption per gallery item ..
                if ($.type(obj.opts.caption) === 'function') {
                    obj.opts.caption = obj.opts.caption.apply(item, [self, obj]);
                }

                if ($.type(self.opts.caption) === 'function') {
                    obj.opts.caption = self.opts.caption.apply(item, [self, obj]);
                }

                // Make sure we have caption as a string or jQuery object
                if (!(obj.opts.caption instanceof $)) {
                    obj.opts.caption = obj.opts.caption === undefined ? '' : obj.opts.caption + '';
                }

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
            }).on('click.fb', '[data-fancybox-zoom]', function (e) {
                // Click handler for zoom button
                self[self.isScaledDown() ? 'scaleToActual' : 'scaleToFit']();
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
                    }, 600);
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

                $D.on('mousemove.fb-idle mouseleave.fb-idle mousedown.fb-idle touchstart.fb-idle touchmove.fb-idle scroll.fb-idle keydown.fb-idle', function (e) {
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
                self.isAnimating = false;

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
            var srcset = slide.opts.srcset || slide.opts.image.srcset;

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

            if (($img[0].complete || $img[0].readyState == "complete") && $img[0].naturalWidth && $img[0].naturalHeight) {
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
                        frameWidth = opts.css.width,
                        frameHeight = opts.css.height,
                        scrollWidth,
                        $contents,
                        $body;

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
                    if ($body && $body.length) {

                        if (frameWidth === undefined) {
                            scrollWidth = $iframe[0].contentWindow.document.documentElement.scrollWidth;

                            frameWidth = Math.ceil($body.outerWidth(true) + ($wrap.width() - scrollWidth));
                            frameWidth += $wrap.outerWidth() - $wrap.innerWidth();
                        }

                        if (frameHeight === undefined) {
                            frameHeight = Math.ceil($body.outerHeight(true));
                            frameHeight += $wrap.outerHeight() - $wrap.innerHeight();
                        }

                        // Resize wrapper to fit iframe content
                        if (frameWidth) {
                            $wrap.width(frameWidth);
                        }

                        if (frameHeight) {
                            $wrap.height(frameHeight);
                        }
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

            if (slide.opts.smallBtn && !slide.$smallBtn) {
                slide.$smallBtn = $(self.translate(slide, slide.opts.btnTpl.smallBtn)).appendTo(slide.$content.filter('div,form').first());
            }

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

            effectClassName = 'fancybox-animated fancybox-slide--' + (slide.pos >= self.prevPos ? 'next' : 'previous') + ' fancybox-fx-' + effect;

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

                    slide.$slide.off().remove();
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

            if (current && current.isComplete) {

                // Look for first input with autofocus attribute
                $el = current.$slide.find('input[autofocus]:enabled:visible:first');

                if (!$el.length) {
                    $el = current.$slide.find('button,:input,[tabindex],a').filter(':enabled:visible:first');
                }
            }

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
                if (instance && instance.id !== self.id && !instance.isClosing) {
                    instance.trigger('onDeactivate');

                    instance.removeEvents();

                    instance.isVisible = false;
                }
            });

            self.isVisible = true;

            if (self.current || self.isIdle) {
                self.update();

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

                forceRedraw(current.$content);

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
                $body = $('body'),
                instance,
                offset;

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

                $body.removeClass('fancybox-active compensate-for-scrollbar');

                if ($body.hasClass('fancybox-iosfix')) {
                    offset = parseInt(document.body.style.top, 10);

                    $body.removeClass('fancybox-iosfix').css('top', '').scrollTop(offset * -1);
                }

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

            if (name === 'afterClose' || !self.$refs) {
                $D.trigger(name + '.fb', args);
            } else {
                self.$refs.container.trigger(name + '.fb', args);
            }
        },

        // Update infobar values, navigation button states and reveal caption
        // ==================================================================

        updateControls: function updateControls(force) {

            var self = this;

            var current = self.current,
                index = current.index,
                caption = current.opts.caption,
                $container = self.$refs.container,
                $caption = self.$refs.caption;

            // Recalculate content dimensions
            current.$slide.trigger('refresh');

            self.$caption = caption && caption.length ? $caption.html(caption) : null;

            if (!self.isHiddenControls && !self.isIdle) {
                self.showControls();
            }

            // Update info and navigation elements
            $container.find('[data-fancybox-count]').html(self.group.length);
            $container.find('[data-fancybox-index]').html(index + 1);

            $container.find('[data-fancybox-prev]').prop('disabled', !current.opts.loop && index <= 0);
            $container.find('[data-fancybox-next]').prop('disabled', !current.opts.loop && index >= self.group.length - 1);

            if (current.type === 'image') {

                // Update download button source
                $container.find('[data-fancybox-download]').attr('href', current.opts.image.src || current.src).show();
            } else {
                $container.find('[data-fancybox-download],[data-fancybox-zoom]').hide();
            }
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

        version: "3.2.5",
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
            var instance = $('.fancybox-container:not(".fancybox-is-closing"):last').data('FancyBox');
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

        isMobile: document.createTouch !== undefined && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),

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
            if ($.isFunction(duration)) {
                callback = duration;
                duration = null;
            }

            if (!$.isPlainObject(to)) {
                $el.removeAttr('style');
            }

            $el.on(transitionEnd, function (e) {

                // Skip events from child elements and z-index change
                if (e && e.originalEvent && (!$el.is(e.originalEvent.target) || e.originalEvent.propertyName == 'z-index')) {
                    return;
                }

                $.fancybox.stop($el);

                if ($.isPlainObject(to)) {

                    if (to.scaleX !== undefined && to.scaleY !== undefined) {
                        $el.css('transition-duration', '');

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

            if (to.scaleX && $el.hasClass('fancybox-image-wrap')) {
                $el.parent().addClass('fancybox-is-scaling');
            }

            // Make sure that `transitionend` callback gets fired
            $el.data("timer", setTimeout(function () {
                $el.trigger('transitionend');
            }, duration + 16));
        },

        stop: function stop($el) {
            clearTimeout($el.data("timer"));

            $el.off('transitionend').css('transition-duration', '');

            if ($el.hasClass('fancybox-image-wrap')) {
                $el.parent().removeClass('fancybox-is-scaling');
            }
        }

    };

    // Default click handler for "fancyboxed" links
    // ============================================

    function _run(e) {
        var $target = $(e.currentTarget),
            opts = e.data ? e.data.options : {},
            value = $target.attr('data-fancybox') || '',
            index = 0,
            items = [];

        // Avoid opening multiple times
        if (e.isDefaultPrevented()) {
            return;
        }

        e.preventDefault();

        // Get all related items and find index for clicked one
        if (value) {
            items = opts.selector ? $(opts.selector) : e.data ? e.data.items : [];
            items = items.length ? items.filter('[data-fancybox="' + value + '"]') : $('[data-fancybox="' + value + '"]');

            index = items.index($target);

            // Sometimes current item can not be found
            // (for example, when slider clones items)
            if (index < 0) {
                index = 0;
            }
        } else {
            items = [$target];
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

    $(document).on('objectNeedsType.fb', function (e, instance, item) {

        var url = item.src || '',
            type = false,
            media,
            thumb,
            rez,
            params,
            urlParams,
            paramObj,
            provider;

        media = $.extend(true, {}, defaults, item.opts.media);

        // Look for any matching media type
        $.each(media, function (providerName, providerOpts) {
            rez = url.match(providerOpts.matcher);

            if (!rez) {
                return;
            }

            type = providerOpts.type;
            paramObj = {};

            if (providerOpts.paramPlace && rez[providerOpts.paramPlace]) {
                urlParams = rez[providerOpts.paramPlace];

                if (urlParams[0] == '?') {
                    urlParams = urlParams.substring(1);
                }

                urlParams = urlParams.split('&');

                for (var m = 0; m < urlParams.length; ++m) {
                    var p = urlParams[m].split('=', 2);

                    if (p.length == 2) {
                        paramObj[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
                    }
                }
            }

            params = $.extend(true, {}, providerOpts.params, item.opts[providerName], paramObj);

            url = $.type(providerOpts.url) === "function" ? providerOpts.url.call(this, rez, params, item) : format(providerOpts.url, rez, params);
            thumb = $.type(providerOpts.thumb) === "function" ? providerOpts.thumb.call(this, rez, params, item) : format(providerOpts.thumb, rez);

            if (providerName === 'vimeo') {
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
        } else if (url) {
            item.type = item.opts.defaultType;
        }
    });
})(window.jQuery || jQuery);

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

        if ($el.is('a,area,button,[role="button"],input,label,select,summary,textarea') || $.isFunction($el.get(0).onclick) || $el.data('selectable')) {
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
        self.opts = current.opts.touch;

        $(document).off('.fb.touch');

        $(document).on(isTouchDevice ? 'touchend.fb.touch touchcancel.fb.touch' : 'mouseup.fb.touch mouseleave.fb.touch', $.proxy(self, "ontouchend"));
        $(document).on(isTouchDevice ? 'touchmove.fb.touch' : 'mousemove.fb.touch', $.proxy(self, "ontouchmove"));

        if (!(self.opts || instance.canPan()) || !($target.is(self.$stage) || self.$stage.find($target).length)) {

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

        if (!(self.opts || self.instance.canPan()) || !self.newPoints || !self.newPoints.length) {
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

                if (self.instance.group.length < 2 && self.opts.vertical) {
                    self.isSwiping = 'y';
                } else if (self.instance.isSliding || self.opts.vertical === false || self.opts.vertical === 'auto' && $(window).width() > 800) {
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

        if (self.opts.momentum === false) {
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
})(window, document, window.jQuery || jQuery);

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

    $.extend(true, $.fancybox.defaults, {
        btnTpl: {
            slideShow: '<button data-fancybox-play class="fancybox-button fancybox-button--play" title="{{PLAY_START}}">' + '<svg viewBox="0 0 40 40">' + '<path d="M13,12 L27,20 L13,27 Z" />' + '<path d="M15,10 v19 M23,10 v19" />' + '</svg>' + '</button>'
        },
        slideShow: {
            autoStart: false,
            speed: 3000
        }
    });

    var SlideShow = function SlideShow(instance) {
        this.instance = instance;
        this.init();
    };

    $.extend(SlideShow.prototype, {
        timer: null,
        isActive: false,
        $button: null,

        init: function init() {
            var self = this;

            self.$button = self.instance.$refs.toolbar.find('[data-fancybox-play]').on('click', function () {
                self.toggle();
            });

            if (self.instance.group.length < 2 || !self.instance.group[self.instance.currIndex].opts.slideShow) {
                self.$button.hide();
            }
        },

        set: function set(force) {
            var self = this;

            // Check if reached last element
            if (self.instance && self.instance.current && (force === true || self.instance.current.opts.loop || self.instance.currIndex < self.instance.group.length - 1)) {
                self.timer = setTimeout(function () {
                    if (self.isActive) {
                        self.instance.jumpTo((self.instance.currIndex + 1) % self.instance.group.length);
                    }
                }, self.instance.current.opts.slideShow.speed);
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

            if (current) {
                self.isActive = true;

                self.$button.attr('title', current.opts.i18n[current.opts.lang].PLAY_STOP).removeClass('fancybox-button--play').addClass('fancybox-button--pause');

                self.set(true);
            }
        },

        stop: function stop() {
            var self = this;
            var current = self.instance.current;

            self.clear();

            self.$button.attr('title', current.opts.i18n[current.opts.lang].PLAY_START).removeClass('fancybox-button--pause').addClass('fancybox-button--play');

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
})(document, window.jQuery || jQuery);

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

    $.extend(true, $.fancybox.defaults, {
        btnTpl: {
            fullScreen: '<button data-fancybox-fullscreen class="fancybox-button fancybox-button--fullscreen" title="{{FULL_SCREEN}}">' + '<svg viewBox="0 0 40 40">' + '<path d="M9,12 h22 v16 h-22 v-16 v16 h22 v-16 Z" />' + '</svg>' + '</button>'
        },
        fullScreen: {
            autoStart: false
        }
    });

    $(document).on({
        'onInit.fb': function onInitFb(e, instance) {
            var $container;

            if (instance && instance.group[instance.currIndex].opts.fullScreen) {
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
            } else if (instance) {
                instance.$refs.toolbar.find('[data-fancybox-fullscreen]').hide();
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
        var isFullscreen = FullScreen.isFullscreen(),
            instance = $.fancybox.getInstance();

        if (instance) {

            // If image is zooming, then force to stop and reposition properly
            if (instance.current && instance.current.type === 'image' && instance.isAnimating) {
                instance.current.$content.css('transition', 'none');

                instance.isAnimating = false;

                instance.update(true, true, 0);
            }

            instance.trigger('onFullscreenChange', isFullscreen);

            instance.$refs.container.toggleClass('fancybox-is-fullscreen', isFullscreen);
        }
    });
})(document, window.jQuery || jQuery);

// ==========================================================================
//
// Thumbs
// Displays thumbnails in a grid
//
// ==========================================================================
;(function (document, $) {
    'use strict';

    // Make sure there are default values

    $.fancybox.defaults = $.extend(true, {
        btnTpl: {
            thumbs: '<button data-fancybox-thumbs class="fancybox-button fancybox-button--thumbs" title="{{THUMBS}}">' + '<svg viewBox="0 0 120 120">' + '<path d="M30,30 h14 v14 h-14 Z M50,30 h14 v14 h-14 Z M70,30 h14 v14 h-14 Z M30,50 h14 v14 h-14 Z M50,50 h14 v14 h-14 Z M70,50 h14 v14 h-14 Z M30,70 h14 v14 h-14 Z M50,70 h14 v14 h-14 Z M70,70 h14 v14 h-14 Z" />' + '</svg>' + '</button>'
        },
        thumbs: {
            autoStart: false, // Display thumbnails on opening
            hideOnClose: true, // Hide thumbnail grid when closing animation starts
            parentEl: '.fancybox-container', // Container is injected into this element
            axis: 'y' // Vertical (y) or horizontal (x) scrolling
        }
    }, $.fancybox.defaults);

    var FancyThumbs = function FancyThumbs(instance) {
        this.init(instance);
    };

    $.extend(FancyThumbs.prototype, {

        $button: null,
        $grid: null,
        $list: null,
        isVisible: false,
        isActive: false,

        init: function init(instance) {
            var self = this;

            self.instance = instance;

            instance.Thumbs = self;

            // Enable thumbs if at least two group items have thumbnails
            var first = instance.group[0],
                second = instance.group[1];

            self.opts = instance.group[instance.currIndex].opts.thumbs;

            self.$button = instance.$refs.toolbar.find('[data-fancybox-thumbs]');

            if (self.opts && first && second && (first.type == 'image' || first.opts.thumb || first.opts.$thumb) && (second.type == 'image' || second.opts.thumb || second.opts.$thumb)) {

                self.$button.show().on('click', function () {
                    self.toggle();
                });

                self.isActive = true;
            } else {
                self.$button.hide();
            }
        },

        create: function create() {
            var self = this,
                instance = self.instance,
                parentEl = self.opts.parentEl,
                list,
                src;

            self.$grid = $('<div class="fancybox-thumbs fancybox-thumbs-' + self.opts.axis + '"></div>').appendTo(instance.$refs.container.find(parentEl).addBack().filter(parentEl));

            // Build list HTML
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

            self.$list = $(list).appendTo(self.$grid).on('click', 'li', function () {
                instance.jumpTo($(this).data('index'));
            });

            self.$list.find('img').hide().one('load', function () {
                var $parent = $(this).parent().removeClass('fancybox-thumbs-loading'),
                    thumbWidth = $parent.outerWidth(),
                    thumbHeight = $parent.outerHeight(),
                    width,
                    height,
                    widthRatio,
                    heightRatio;

                width = this.naturalWidth || this.width;
                height = this.naturalHeight || this.height;

                // Calculate thumbnail dimensions; center vertically and horizontally
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
                    'margin-top': height > thumbHeight ? Math.floor(thumbHeight * 0.3 - height * 0.3) : Math.floor(thumbHeight * 0.5 - height * 0.5),
                    'margin-left': Math.floor(thumbWidth * 0.5 - width * 0.5)
                }).show();
            }).each(function () {
                this.src = $(this).data('src');
            });

            if (self.opts.axis === 'x') {
                self.$list.width(parseInt(self.$grid.css("padding-right")) + instance.group.length * self.$list.children().eq(0).outerWidth(true) + 'px');
            }
        },

        focus: function focus(duration) {
            var self = this,
                $list = self.$list,
                thumb,
                thumbPos;

            if (self.instance.current) {
                thumb = $list.children().removeClass('fancybox-thumbs-active').filter('[data-index="' + self.instance.current.index + '"]').addClass('fancybox-thumbs-active');

                thumbPos = thumb.position();

                // Check if need to scroll to make current thumb visible
                if (self.opts.axis === 'y' && (thumbPos.top < 0 || thumbPos.top > $list.height() - thumb.outerHeight())) {
                    $list.stop().animate({ 'scrollTop': $list.scrollTop() + thumbPos.top }, duration);
                } else if (self.opts.axis === 'x' && (thumbPos.left < $list.parent().scrollLeft() || thumbPos.left > $list.parent().scrollLeft() + ($list.parent().width() - thumb.outerWidth()))) {
                    $list.parent().stop().animate({ 'scrollLeft': thumbPos.left }, duration);
                }
            }
        },

        update: function update() {
            this.instance.$refs.container.toggleClass('fancybox-show-thumbs', this.isVisible);

            if (this.isVisible) {
                if (!this.$grid) {
                    this.create();
                }

                this.instance.trigger('onThumbsShow');

                this.focus(0);
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
            var Thumbs;

            if (instance && !instance.Thumbs) {
                Thumbs = new FancyThumbs(instance);

                if (Thumbs.isActive && Thumbs.opts.autoStart === true) {
                    Thumbs.show();
                }
            }
        },

        'beforeShow.fb': function beforeShowFb(e, instance, item, firstRun) {
            var Thumbs = instance && instance.Thumbs;

            if (Thumbs && Thumbs.isVisible) {
                Thumbs.focus(firstRun ? 0 : 250);
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

            if (Thumbs && Thumbs.isVisible && Thumbs.opts.hideOnClose !== false) {
                Thumbs.$grid.hide();
            }
        }

    });
})(document, window.jQuery);

//// ==========================================================================
//
// Share
// Displays simple form for sharing current url
//
// ==========================================================================
;(function (document, $) {
    'use strict';

    $.extend(true, $.fancybox.defaults, {
        btnTpl: {
            share: '<button data-fancybox-share class="fancybox-button fancybox-button--share" title="{{SHARE}}">' + '<svg viewBox="0 0 40 40">' + '<path d="M6,30 C8,18 19,16 23,16 L23,16 L23,10 L33,20 L23,29 L23,24 C19,24 8,27 6,30 Z">' + '</svg>' + '</button>'
        },
        share: {
            tpl: '<div class="fancybox-share">' + '<h1>{{SHARE}}</h1>' + '<p>' + '<a href="https://www.facebook.com/sharer/sharer.php?u={{src}}" target="_blank" class="fancybox-share_button">' + '<svg version="1.1" viewBox="0 0 32 32" fill="#3b5998"><path d="M27.6 3h-23.2c-.8 0-1.4.6-1.4 1.4v23.1c0 .9.6 1.5 1.4 1.5h12.5v-10.1h-3.4v-3.9h3.4v-2.9c0-3.4 2.1-5.2 5-5.2 1.4 0 2.7.1 3 .2v3.5h-2.1c-1.6 0-1.9.8-1.9 1.9v2.5h3.9l-.5 3.9h-3.4v10.1h6.6c.8 0 1.4-.6 1.4-1.4v-23.2c.1-.8-.5-1.4-1.3-1.4z"></path></svg>' + '<span>Facebook</span>' + '</a>' + '<a href="https://www.pinterest.com/pin/create/button/?url={{src}}&amp;description={{descr}}" target="_blank" class="fancybox-share_button">' + '<svg version="1.1" viewBox="0 0 32 32" fill="#c92228"><path d="M16 3c-7.2 0-13 5.8-13 13 0 5.5 3.4 10.2 8.3 12.1-.1-1-.2-2.6 0-3.7.2-1 1.5-6.5 1.5-6.5s-.4-.8-.4-1.9c0-1.8 1-3.2 2.4-3.2 1.1 0 1.6.8 1.6 1.8 0 1.1-.7 2.8-1.1 4.3-.3 1.3.6 2.3 1.9 2.3 2.3 0 4.1-2.4 4.1-6 0-3.1-2.2-5.3-5.4-5.3-3.7 0-5.9 2.8-5.9 5.6 0 1.1.4 2.3 1 3 .1.1.1.2.1.4-.1.4-.3 1.3-.4 1.5-.1.2-.2.3-.4.2-1.6-.8-2.6-3.1-2.6-5 0-4.1 3-7.9 8.6-7.9 4.5 0 8 3.2 8 7.5 0 4.5-2.8 8.1-6.7 8.1-1.3 0-2.6-.7-3-1.5 0 0-.7 2.5-.8 3.1-.3 1.1-1.1 2.5-1.6 3.4 1.2.4 2.5.6 3.8.6 7.2 0 13-5.8 13-13 0-7.1-5.8-12.9-13-12.9z"></path></svg>' + '<span>Pinterest</span>' + '</a>' + '<a href="https://twitter.com/intent/tweet?url={{src}}&amp;text={{descr}}" target="_blank" class="fancybox-share_button">' + '<svg version="1.1" viewBox="0 0 32 32" fill="#1da1f2"><path d="M30 7.3c-1 .5-2.1.8-3.3.9 1.2-.7 2.1-1.8 2.5-3.2-1.1.7-2.3 1.1-3.6 1.4-1-1.1-2.5-1.8-4.2-1.8-3.2 0-5.7 2.6-5.7 5.7 0 .5.1.9.1 1.3-4.8-.2-9-2.5-11.8-6-.5.9-.8 1.9-.8 3 0 2 1 3.8 2.6 4.8-.9 0-1.8-.3-2.6-.7v.1c0 2.8 2 5.1 4.6 5.6-.5.1-1 .2-1.5.2-.4 0-.7 0-1.1-.1.7 2.3 2.9 3.9 5.4 4-2 1.5-4.4 2.5-7.1 2.5-.5 0-.9 0-1.4-.1 2.5 1.6 5.6 2.6 8.8 2.6 10.6 0 16.3-8.8 16.3-16.3v-.7c1.1-1 2-2 2.8-3.2z"></path></svg>' + '<span>Twitter</span>' + '</a>' + '</p>' + '<p><input type="text" value="{{src_raw}}" onfocus="this.select()" /></p>' + '</div>'
        }
    });

    function escapeHtml(string) {
        var entityMap = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '/': '&#x2F;',
            '`': '&#x60;',
            '=': '&#x3D;'
        };

        return String(string).replace(/[&<>"'`=\/]/g, function (s) {
            return entityMap[s];
        });
    }

    $(document).on('click', '[data-fancybox-share]', function () {
        var f = $.fancybox.getInstance(),
            url,
            tpl;

        if (f) {
            url = f.current.opts.hash === false ? f.current.src : window.location;
            tpl = f.current.opts.share.tpl.replace(/\{\{src\}\}/g, encodeURIComponent(url)).replace(/\{\{src_raw\}\}/g, escapeHtml(url)).replace(/\{\{descr\}\}/g, f.$caption ? encodeURIComponent(f.$caption.text()) : '');

            $.fancybox.open({
                src: f.translate(f, tpl),
                type: 'html',
                opts: {
                    animationEffect: "fade",
                    animationDuration: 250
                }
            });
        }
    });
})(document, window.jQuery || jQuery);

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

    // Start when DOM becomes ready
    $(function () {

        // Check if user has disabled this module
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
        setTimeout(function () {
            triggerFromUrl(parseUrl());
        }, 50);
    });
})(document, window, window.jQuery || jQuery);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5mYW5jeWJveC5qcyIsInJlc3BvbnNpdmUtbmF2LmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbIndpbmRvdyIsImRvY3VtZW50IiwiJCIsInVuZGVmaW5lZCIsImZuIiwiZmFuY3lib3giLCJjb25zb2xlIiwibG9nIiwiZGVmYXVsdHMiLCJsb29wIiwibWFyZ2luIiwiZ3V0dGVyIiwia2V5Ym9hcmQiLCJhcnJvd3MiLCJpbmZvYmFyIiwidG9vbGJhciIsImJ1dHRvbnMiLCJpZGxlVGltZSIsInNtYWxsQnRuIiwicHJvdGVjdCIsIm1vZGFsIiwiaW1hZ2UiLCJwcmVsb2FkIiwiYWpheCIsInNldHRpbmdzIiwiZGF0YSIsImlmcmFtZSIsInRwbCIsImNzcyIsImF0dHIiLCJzY3JvbGxpbmciLCJkZWZhdWx0VHlwZSIsImFuaW1hdGlvbkVmZmVjdCIsImFuaW1hdGlvbkR1cmF0aW9uIiwiem9vbU9wYWNpdHkiLCJ0cmFuc2l0aW9uRWZmZWN0IiwidHJhbnNpdGlvbkR1cmF0aW9uIiwic2xpZGVDbGFzcyIsImJhc2VDbGFzcyIsImJhc2VUcGwiLCJzcGlubmVyVHBsIiwiZXJyb3JUcGwiLCJidG5UcGwiLCJkb3dubG9hZCIsInpvb20iLCJjbG9zZSIsImFycm93TGVmdCIsImFycm93UmlnaHQiLCJwYXJlbnRFbCIsImF1dG9Gb2N1cyIsImJhY2tGb2N1cyIsInRyYXBGb2N1cyIsImZ1bGxTY3JlZW4iLCJhdXRvU3RhcnQiLCJ0b3VjaCIsInZlcnRpY2FsIiwibW9tZW50dW0iLCJoYXNoIiwibWVkaWEiLCJzbGlkZVNob3ciLCJzcGVlZCIsInRodW1icyIsImhpZGVPbkNsb3NlIiwiYXhpcyIsIm9uSW5pdCIsIm5vb3AiLCJiZWZvcmVMb2FkIiwiYWZ0ZXJMb2FkIiwiYmVmb3JlU2hvdyIsImFmdGVyU2hvdyIsImJlZm9yZUNsb3NlIiwiYWZ0ZXJDbG9zZSIsIm9uQWN0aXZhdGUiLCJvbkRlYWN0aXZhdGUiLCJjbGlja0NvbnRlbnQiLCJjdXJyZW50IiwiZXZlbnQiLCJ0eXBlIiwiY2xpY2tTbGlkZSIsImNsaWNrT3V0c2lkZSIsImRibGNsaWNrQ29udGVudCIsImRibGNsaWNrU2xpZGUiLCJkYmxjbGlja091dHNpZGUiLCJtb2JpbGUiLCJsYW5nIiwiaTE4biIsIkNMT1NFIiwiTkVYVCIsIlBSRVYiLCJFUlJPUiIsIlBMQVlfU1RBUlQiLCJQTEFZX1NUT1AiLCJGVUxMX1NDUkVFTiIsIlRIVU1CUyIsIkRPV05MT0FEIiwiU0hBUkUiLCJaT09NIiwiJFciLCIkRCIsImNhbGxlZCIsImlzUXVlcnkiLCJvYmoiLCJoYXNPd25Qcm9wZXJ0eSIsInJlcXVlc3RBRnJhbWUiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJ3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJtb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJvUmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiY2FsbGJhY2siLCJzZXRUaW1lb3V0IiwidHJhbnNpdGlvbkVuZCIsInQiLCJlbCIsImNyZWF0ZUVsZW1lbnQiLCJ0cmFuc2l0aW9ucyIsInN0eWxlIiwiZm9yY2VSZWRyYXciLCIkZWwiLCJsZW5ndGgiLCJvZmZzZXRIZWlnaHQiLCJGYW5jeUJveCIsImNvbnRlbnQiLCJvcHRzIiwiaW5kZXgiLCJzZWxmIiwiZXh0ZW5kIiwiaXNNb2JpbGUiLCJpc0FycmF5IiwiaWQiLCJncm91cCIsImN1cnJJbmRleCIsInBhcnNlSW50IiwicHJldkluZGV4IiwicHJldlBvcyIsImN1cnJQb3MiLCJmaXJzdFJ1biIsImNyZWF0ZUdyb3VwIiwiJGxhc3RGb2N1cyIsImFjdGl2ZUVsZW1lbnQiLCJibHVyIiwic2xpZGVzIiwiaW5pdCIsInByb3RvdHlwZSIsImZpcnN0SXRlbSIsImZpcnN0SXRlbU9wdHMiLCJzY3JvbGxiYXJXaWR0aCIsIiRzY3JvbGxEaXYiLCIkY29udGFpbmVyIiwiYnV0dG9uU3RyIiwic2Nyb2xsVG9wIiwic2Nyb2xsTGVmdCIsImdldEluc3RhbmNlIiwiYWRkQ2xhc3MiLCJ0ZXN0IiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwiTVNTdHJlYW0iLCJib2R5Iiwic2Nyb2xsSGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJhcHBlbmRUbyIsIm9mZnNldFdpZHRoIiwiY2xpZW50V2lkdGgiLCJyZW1vdmUiLCJhcHBlbmQiLCJlYWNoIiwidmFsdWUiLCJ0cmFuc2xhdGUiLCJyZXBsYWNlIiwiJHJlZnMiLCJjb250YWluZXIiLCJmb3JFYWNoIiwiaXRlbSIsImZpbmQiLCJ0cmlnZ2VyIiwiYWN0aXZhdGUiLCJqdW1wVG8iLCJzdHIiLCJhcnIiLCJtYXRjaCIsIm4iLCJpdGVtcyIsIm1ha2VBcnJheSIsImkiLCIkaXRlbSIsInNyYyIsInNyY1BhcnRzIiwiaXNQbGFpbk9iamVjdCIsIm9wdGlvbnMiLCIkb3JpZyIsImNoYXJBdCIsIiR0aHVtYiIsImNhcHRpb24iLCJhcHBseSIsInNwbGl0Iiwic2hpZnQiLCJmaWx0ZXIiLCJpbkFycmF5IiwicHVzaCIsImFkZEV2ZW50cyIsInJlbW92ZUV2ZW50cyIsIm9uIiwiZSIsInN0b3BQcm9wYWdhdGlvbiIsInByZXZlbnREZWZhdWx0IiwicHJldmlvdXMiLCJuZXh0IiwiaXNTY2FsZWREb3duIiwib3JpZ2luYWxFdmVudCIsInVwZGF0ZSIsInN0YWdlIiwiaGlkZSIsInNob3ciLCJpbnN0YW5jZSIsImlzQ2xvc2luZyIsInRhcmdldCIsImhhc0NsYXNzIiwiaXMiLCJoYXMiLCJmb2N1cyIsImtleWNvZGUiLCJrZXlDb2RlIiwid2hpY2giLCJpZGxlU2Vjb25kc0NvdW50ZXIiLCJpc0lkbGUiLCJzaG93Q29udHJvbHMiLCJpZGxlSW50ZXJ2YWwiLCJzZXRJbnRlcnZhbCIsImhpZGVDb250cm9scyIsIm9mZiIsImNsZWFySW50ZXJ2YWwiLCJkdXJhdGlvbiIsInBvcyIsInNsaWRlIiwiY2FudmFzV2lkdGgiLCJjdXJyZW50UG9zIiwidHJhbnNpdGlvblByb3BzIiwiZ3JvdXBMZW4iLCJpc1NsaWRpbmciLCJpc0FuaW1hdGluZyIsImNyZWF0ZVNsaWRlIiwidXBkYXRlQ29udHJvbHMiLCJnZXRUcmFuc2xhdGUiLCIkc2xpZGUiLCJpc01vdmVkIiwibGVmdCIsInRvcCIsImZvcmNlZER1cmF0aW9uIiwiaXNOdW1lcmljIiwicmVtb3ZlQ2xhc3MiLCJsb2FkU2xpZGUiLCJzdG9wIiwiTWF0aCIsInJvdW5kIiwid2lkdGgiLCJhbmltYXRlIiwicmVtb3ZlQXR0ciIsImNvbXBsZXRlIiwiY2hpbGRyZW4iLCJpc0xvYWRlZCIsInJldmVhbENvbnRlbnQiLCJpc0NvbXBsZXRlIiwidXBkYXRlU2xpZGUiLCJzY2FsZVRvQWN0dWFsIiwieCIsInkiLCIkd2hhdCIsIiRjb250ZW50IiwiaW1nUG9zIiwicG9zWCIsInBvc1kiLCJzY2FsZVgiLCJzY2FsZVkiLCJjYW52YXNIZWlnaHQiLCJoZWlnaHQiLCJuZXdJbWdXaWR0aCIsIm5ld0ltZ0hlaWdodCIsImhhc0Vycm9yIiwidXBkYXRlQ3Vyc29yIiwiU2xpZGVTaG93IiwiaXNBY3RpdmUiLCJzY2FsZVRvRml0IiwiZW5kIiwiZ2V0Rml0UG9zIiwiaW1nV2lkdGgiLCJpbWdIZWlnaHQiLCJtaW5SYXRpbyIsIm1pbiIsImZsb29yIiwia2V5Iiwic2V0VHJhbnNsYXRlIiwibmV4dFdpZHRoIiwibmV4dEhlaWdodCIsImlzWm9vbWFibGUiLCJmaXRQb3MiLCJpc0Z1bmN0aW9uIiwicmV6IiwiY2FuUGFuIiwiYWJzIiwiYWpheExvYWQiLCJpc0xvYWRpbmciLCJzZXRJbWFnZSIsInNldElmcmFtZSIsInNldENvbnRlbnQiLCJzZXRFcnJvciIsInNob3dMb2FkaW5nIiwidXJsIiwic3VjY2VzcyIsInRleHRTdGF0dXMiLCJlcnJvciIsImpxWEhSIiwib25lIiwiYWJvcnQiLCJzcmNzZXQiLCJmb3VuZCIsInRlbXAiLCJweFJhdGlvIiwid2luZG93V2lkdGgiLCJkZXZpY2VQaXhlbFJhdGlvIiwiaW5uZXJXaWR0aCIsIm1hcCIsInJldCIsInRyaW0iLCJzdWJzdHJpbmciLCJwb3N0Zml4Iiwic29ydCIsImEiLCJiIiwiaiIsInRodW1iIiwiJGdob3N0Iiwic2V0QmlnSW1hZ2UiLCIkaW1nIiwiJGltYWdlIiwiY2xlYXJUaW1lb3V0IiwidGltb3V0cyIsIm5hdHVyYWxXaWR0aCIsIm5hdHVyYWxIZWlnaHQiLCJoaWRlTG9hZGluZyIsIm1heCIsInJlYWR5U3RhdGUiLCIkaWZyYW1lIiwiRGF0ZSIsImdldFRpbWUiLCJpc1JlYWR5IiwiJHdyYXAiLCJmcmFtZVdpZHRoIiwiZnJhbWVIZWlnaHQiLCJzY3JvbGxXaWR0aCIsIiRjb250ZW50cyIsIiRib2R5IiwiY29udGVudHMiLCJpZ25vcmUiLCJjb250ZW50V2luZG93IiwiZG9jdW1lbnRFbGVtZW50IiwiY2VpbCIsIm91dGVyV2lkdGgiLCJvdXRlckhlaWdodCIsInByZXBlbmQiLCJlbXB0eSIsInBhcmVudCIsIiRwbGFjZWhvbGRlciIsImluc2VydEFmdGVyIiwibm9kZVR5cGUiLCJodG1sIiwiYWZ0ZXIiLCIkc21hbGxCdG4iLCIkc3Bpbm5lciIsImZpcnN0IiwiYnV0dG9uIiwiZWZmZWN0IiwiZWZmZWN0Q2xhc3NOYW1lIiwib3BhY2l0eSIsInN0YXJ0IiwiZ2V0VGh1bWJQb3MiLCJpc0VsZW1lbnRWaXNpYmxlIiwiZWxlbWVudCIsImVsZW1lbnRSZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwicGFyZW50UmVjdHMiLCJ2aXNpYmxlSW5BbGxQYXJlbnRzIiwicGFyZW50RWxlbWVudCIsImV2ZXJ5IiwicGFyZW50UmVjdCIsInZpc2libGVQaXhlbFgiLCJyaWdodCIsInZpc2libGVQaXhlbFkiLCJib3R0b20iLCJ0aHVtYlBvcyIsIm9mZnNldCIsInNsaWRlUG9zIiwib3duZXJEb2N1bWVudCIsInBhcnNlRmxvYXQiLCJzaWJsaW5ncyIsInByZXYiLCJpc1Zpc2libGUiLCJkIiwiZG9uZSIsImNsZWFuVXAiLCJuYW1lIiwiYXJncyIsIkFycmF5Iiwic2xpY2UiLCJjYWxsIiwiYXJndW1lbnRzIiwidW5zaGlmdCIsImZvcmNlIiwiJGNhcHRpb24iLCJpc0hpZGRlbkNvbnRyb2xzIiwicHJvcCIsInRvZ2dsZUNsYXNzIiwidG9nZ2xlQ29udHJvbHMiLCJ2ZXJzaW9uIiwiY29tbWFuZCIsIm9wZW4iLCJhbGwiLCJkZXN0cm95IiwiY3JlYXRlVG91Y2giLCJ1c2UzZCIsImRpdiIsImdldENvbXB1dGVkU3R5bGUiLCJnZXRQcm9wZXJ0eVZhbHVlIiwiZG9jdW1lbnRNb2RlIiwibWF0cml4IiwiZXEiLCJpbmRleE9mIiwidHJhbnNSZWdleCIsInRyYW5zUmV6IiwiZXhlYyIsInByb3BzIiwicG9zaXRpb24iLCJ0cmFuc2Zvcm0iLCJ0byIsImxlYXZlQW5pbWF0aW9uTmFtZSIsInByb3BlcnR5TmFtZSIsIl9ydW4iLCIkdGFyZ2V0IiwiY3VycmVudFRhcmdldCIsImlzRGVmYXVsdFByZXZlbnRlZCIsInNlbGVjdG9yIiwialF1ZXJ5IiwiZm9ybWF0IiwicGFyYW1zIiwicGFyYW0iLCJ5b3V0dWJlIiwibWF0Y2hlciIsImF1dG9wbGF5IiwiYXV0b2hpZGUiLCJmcyIsInJlbCIsImhkIiwid21vZGUiLCJlbmFibGVqc2FwaSIsImh0bWw1IiwicGFyYW1QbGFjZSIsInZpbWVvIiwic2hvd190aXRsZSIsInNob3dfYnlsaW5lIiwic2hvd19wb3J0cmFpdCIsImZ1bGxzY3JlZW4iLCJhcGkiLCJtZXRhY2FmZSIsImRhaWx5bW90aW9uIiwiYWRkaXRpb25hbEluZm9zIiwidmluZSIsImluc3RhZ3JhbSIsImdtYXBfcGxhY2UiLCJnbWFwX3NlYXJjaCIsInVybFBhcmFtcyIsInBhcmFtT2JqIiwicHJvdmlkZXIiLCJwcm92aWRlck5hbWUiLCJwcm92aWRlck9wdHMiLCJtIiwicCIsImRlY29kZVVSSUNvbXBvbmVudCIsImNvbnRlbnRQcm92aWRlciIsImNhbmNlbEFGcmFtZSIsImNhbmNlbEFuaW1hdGlvbkZyYW1lIiwid2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJtb3pDYW5jZWxBbmltYXRpb25GcmFtZSIsIm9DYW5jZWxBbmltYXRpb25GcmFtZSIsInBvaW50ZXJzIiwicmVzdWx0IiwidG91Y2hlcyIsImNoYW5nZWRUb3VjaGVzIiwicGFnZVgiLCJwYWdlWSIsImNsaWVudFgiLCJjbGllbnRZIiwiZGlzdGFuY2UiLCJwb2ludDIiLCJwb2ludDEiLCJ3aGF0Iiwic3FydCIsInBvdyIsImlzQ2xpY2thYmxlIiwiZ2V0Iiwib25jbGljayIsImF0dHMiLCJhdHRyaWJ1dGVzIiwibm9kZU5hbWUiLCJzdWJzdHIiLCJoYXNTY3JvbGxiYXJzIiwib3ZlcmZsb3dZIiwib3ZlcmZsb3dYIiwiY2xpZW50SGVpZ2h0IiwiaG9yaXpvbnRhbCIsImlzU2Nyb2xsYWJsZSIsIkd1ZXN0dXJlcyIsIiRiZyIsImJnIiwiJHN0YWdlIiwicHJveHkiLCJvbnRvdWNoc3RhcnQiLCJpc1RvdWNoRGV2aWNlIiwic3RhcnRQb2ludHMiLCJjYW5UYXAiLCJzdGFydFRpbWUiLCJkaXN0YW5jZVgiLCJkaXN0YW5jZVkiLCJpc1Bhbm5pbmciLCJpc1N3aXBpbmciLCJpc1pvb21pbmciLCJzbGlkZXJTdGFydFBvcyIsInNsaWRlckxhc3RQb3MiLCJjb250ZW50U3RhcnRQb3MiLCJjb250ZW50TGFzdFBvcyIsImNlbnRlclBvaW50U3RhcnRYIiwiY2VudGVyUG9pbnRTdGFydFkiLCJwZXJjZW50YWdlT2ZJbWFnZUF0UGluY2hQb2ludFgiLCJwZXJjZW50YWdlT2ZJbWFnZUF0UGluY2hQb2ludFkiLCJzdGFydERpc3RhbmNlQmV0d2VlbkZpbmdlcnMiLCJvbnRvdWNobW92ZSIsIm5ld1BvaW50cyIsIm9uU3dpcGUiLCJvblBhbiIsIm9uWm9vbSIsInN3aXBpbmciLCJhbmdsZSIsImF0YW4yIiwiUEkiLCJpblRyYW5zaXRpb24iLCJyZXF1ZXN0SWQiLCJuZXdPZmZzZXRYIiwibmV3T2Zmc2V0WSIsIm5ld1BvcyIsImxpbWl0TW92ZW1lbnQiLCJuZXdXaWR0aCIsIm5ld0hlaWdodCIsIm1pblRyYW5zbGF0ZVgiLCJtaW5UcmFuc2xhdGVZIiwibWF4VHJhbnNsYXRlWCIsIm1heFRyYW5zbGF0ZVkiLCJjdXJyZW50T2Zmc2V0WCIsImN1cnJlbnRPZmZzZXRZIiwibGltaXRQb3NpdGlvbiIsImN1cnJlbnRXaWR0aCIsImN1cnJlbnRIZWlnaHQiLCJlbmREaXN0YW5jZUJldHdlZW5GaW5nZXJzIiwicGluY2hSYXRpbyIsInRyYW5zbGF0ZUZyb21ab29taW5nWCIsInRyYW5zbGF0ZUZyb21ab29taW5nWSIsImNlbnRlclBvaW50RW5kWCIsImNlbnRlclBvaW50RW5kWSIsInRyYW5zbGF0ZUZyb21UcmFuc2xhdGluZ1giLCJ0cmFuc2xhdGVGcm9tVHJhbnNsYXRpbmdZIiwib250b3VjaGVuZCIsImRNcyIsInBhbm5pbmciLCJ6b29taW5nIiwiZW5kUG9pbnRzIiwib25UYXAiLCJ2ZWxvY2l0eVgiLCJ2ZWxvY2l0eVkiLCJzcGVlZFgiLCJlbmRQYW5uaW5nIiwiZW5kWm9vbWluZyIsImVuZFN3aXBpbmciLCJyZXNldCIsInRhcFgiLCJ0YXBZIiwid2hlcmUiLCJwcm9jZXNzIiwicHJlZml4IiwiYWN0aW9uIiwic3RhcnRFdmVudCIsInRhcHBlZCIsInRpbWVyIiwiJGJ1dHRvbiIsInRvZ2dsZSIsInNldCIsImNsZWFyIiwia2V5cHJlc3MiLCJoaWRkZW4iLCJmbk1hcCIsInZhbCIsIkZ1bGxTY3JlZW4iLCJyZXF1ZXN0IiwiZWxlbSIsInJlcXVlc3RGdWxsc2NyZWVuIiwiQUxMT1dfS0VZQk9BUkRfSU5QVVQiLCJleGl0IiwiZXhpdEZ1bGxzY3JlZW4iLCJpc0Z1bGxzY3JlZW4iLCJCb29sZWFuIiwiZnVsbHNjcmVlbkVsZW1lbnQiLCJlbmFibGVkIiwiZnVsbHNjcmVlbkVuYWJsZWQiLCJmdWxsc2NyZWVuY2hhbmdlIiwiRmFuY3lUaHVtYnMiLCIkZ3JpZCIsIiRsaXN0IiwiVGh1bWJzIiwic2Vjb25kIiwiY3JlYXRlIiwibGlzdCIsImFkZEJhY2siLCIkcGFyZW50IiwidGh1bWJXaWR0aCIsInRodW1iSGVpZ2h0Iiwid2lkdGhSYXRpbyIsImhlaWdodFJhdGlvIiwic2hhcmUiLCJlc2NhcGVIdG1sIiwic3RyaW5nIiwiZW50aXR5TWFwIiwiU3RyaW5nIiwicyIsImYiLCJsb2NhdGlvbiIsImVuY29kZVVSSUNvbXBvbmVudCIsInRleHQiLCJlc2NhcGVTZWxlY3RvciIsInNlbCIsInJjc3Nlc2NhcGUiLCJmY3NzZXNjYXBlIiwiY2giLCJhc0NvZGVQb2ludCIsImNoYXJDb2RlQXQiLCJ0b1N0cmluZyIsInNob3VsZENyZWF0ZUhpc3RvcnkiLCJjdXJyZW50SGFzaCIsInRpbWVySUQiLCJwYXJzZVVybCIsInBvcCIsImdhbGxlcnkiLCJqb2luIiwidHJpZ2dlckZyb21VcmwiLCJnZXRHYWxsZXJ5SUQiLCJvcmlnSGFzaCIsImhpc3RvcnkiLCJ0aXRsZSIsInBhdGhuYW1lIiwic2VhcmNoIiwicmVwbGFjZVN0YXRlIiwicmVzcG9uc2l2ZU5hdiIsImNvbXB1dGVkIiwicmUiLCJ0b1VwcGVyQ2FzZSIsImN1cnJlbnRTdHlsZSIsImFkZEV2ZW50IiwiZXZ0IiwiYnViYmxlIiwiYWRkRXZlbnRMaXN0ZW5lciIsImhhbmRsZUV2ZW50IiwiYXR0YWNoRXZlbnQiLCJyZW1vdmVFdmVudCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJkZXRhY2hFdmVudCIsImdldENoaWxkcmVuIiwiRXJyb3IiLCJzZXRBdHRyaWJ1dGVzIiwiYXR0cnMiLCJzZXRBdHRyaWJ1dGUiLCJjbHMiLCJjbGFzc05hbWUiLCJyZWciLCJSZWdFeHAiLCJhcnJheSIsInNjb3BlIiwibmF2IiwibmF2VG9nZ2xlIiwic3R5bGVFbGVtZW50IiwiaHRtbEVsIiwiaGFzQW5pbUZpbmlzaGVkIiwibmF2T3BlbiIsIlJlc3BvbnNpdmVOYXYiLCJ0cmFuc2l0aW9uIiwibGFiZWwiLCJpbnNlcnQiLCJjdXN0b21Ub2dnbGUiLCJjbG9zZU9uTmF2Q2xpY2siLCJvcGVuUG9zIiwibmF2Q2xhc3MiLCJuYXZBY3RpdmVDbGFzcyIsImpzQ2xhc3MiLCJ3cmFwcGVyRWwiLCJnZXRFbGVtZW50QnlJZCIsIndyYXBwZXIiLCJxdWVyeVNlbGVjdG9yIiwiaW5uZXIiLCJfaW5pdCIsIl9yZW1vdmVTdHlsZXMiLCJyZW1vdmVBdHRyaWJ1dGUiLCJwYXJlbnROb2RlIiwicmVtb3ZlQ2hpbGQiLCJyZXNpemUiLCJfY3JlYXRlU3R5bGVzIiwiX2NhbGNIZWlnaHQiLCJfb25Ub3VjaFN0YXJ0IiwiX29uVG91Y2hNb3ZlIiwiX29uVG91Y2hFbmQiLCJfcHJldmVudERlZmF1bHQiLCJfb25LZXlVcCIsIl9jbG9zZU9uTmF2Q2xpY2siLCJfY3JlYXRlVG9nZ2xlIiwiX3RyYW5zaXRpb25zIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJhcHBlbmRDaGlsZCIsImlubmVySFRNTCIsImluc2VydEJlZm9yZSIsIm5leHRTaWJsaW5nIiwidG9nZ2xlRWwiLCJsaW5rcyIsInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbiIsInJldHVyblZhbHVlIiwiRXZlbnQiLCJzdGFydFgiLCJzdGFydFkiLCJ0b3VjaEhhc01vdmVkIiwib2JqU3R5bGUiLCJXZWJraXRUcmFuc2l0aW9uIiwiTW96VHJhbnNpdGlvbiIsIk9UcmFuc2l0aW9uIiwic2F2ZWRIZWlnaHQiLCJpbm5lclN0eWxlcyIsInN0eWxlU2hlZXQiLCJjc3NUZXh0IiwibW9kdWxlIiwiZXhwb3J0cyIsInJlYWR5Il0sIm1hcHBpbmdzIjoiOztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBRSxXQUFVQSxNQUFWLEVBQWtCQyxRQUFsQixFQUE0QkMsQ0FBNUIsRUFBK0JDLFNBQS9CLEVBQTBDO0FBQ3hDOztBQUVBO0FBQ0E7O0FBRUEsUUFBSyxDQUFDRCxDQUFOLEVBQVU7QUFDTjtBQUNIOztBQUVEO0FBQ0E7O0FBRUEsUUFBS0EsRUFBRUUsRUFBRixDQUFLQyxRQUFWLEVBQXFCOztBQUVqQixZQUFLLGFBQWFMLE1BQWxCLEVBQTJCO0FBQ3ZCTSxvQkFBUUMsR0FBUixDQUFhLDhCQUFiO0FBQ0g7O0FBRUQ7QUFDSDs7QUFFRDtBQUNBOztBQUVBLFFBQUlDLFdBQVc7O0FBRVg7QUFDQUMsY0FBTyxLQUhJOztBQUtYO0FBQ0FDLGdCQUFTLENBQUMsRUFBRCxFQUFLLENBQUwsQ0FORTs7QUFRWDtBQUNBQyxnQkFBUyxFQVRFOztBQVdYO0FBQ0FDLGtCQUFXLElBWkE7O0FBY1g7QUFDQUMsZ0JBQVMsSUFmRTs7QUFpQlg7QUFDQUMsaUJBQVUsSUFsQkM7O0FBb0JYO0FBQ0FDLGlCQUFVLElBckJDOztBQXVCWDtBQUNBO0FBQ0E7QUFDQUMsaUJBQVUsQ0FDTixXQURNLEVBRU4sWUFGTSxFQUdOLFFBSE0sRUFJTixPQUpNO0FBS047QUFDQTtBQUNBLGVBUE0sQ0ExQkM7O0FBb0NYO0FBQ0FDLGtCQUFXLENBckNBOztBQXVDWDtBQUNBO0FBQ0E7QUFDQUMsa0JBQVcsTUExQ0E7O0FBNENYO0FBQ0FDLGlCQUFVLEtBN0NDOztBQStDWDtBQUNBQyxlQUFRLEtBaERHOztBQWtEWEMsZUFBUTs7QUFFSjtBQUNBO0FBQ0E7QUFDQUMscUJBQVU7O0FBTE4sU0FsREc7O0FBMkRYQyxjQUFPOztBQUVIO0FBQ0FDLHNCQUFXOztBQUVQO0FBQ0E7QUFDQUMsc0JBQU87QUFDSHBCLDhCQUFXO0FBRFI7QUFKQTs7QUFIUixTQTNESTs7QUF5RVhxQixnQkFBUzs7QUFFTDtBQUNBQyxpQkFBTSw4TkFIRDs7QUFLTDtBQUNBO0FBQ0E7QUFDQUwscUJBQVUsSUFSTDs7QUFVTDtBQUNBO0FBQ0FNLGlCQUFNLEVBWkQ7O0FBY0w7QUFDQUMsa0JBQU87QUFDSEMsMkJBQVk7QUFEVDs7QUFmRixTQXpFRTs7QUE4Rlg7QUFDQUMscUJBQWMsT0EvRkg7O0FBaUdYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLHlCQUFrQixNQXhHUDs7QUEwR1g7QUFDQUMsMkJBQW9CLEdBM0dUOztBQTZHWDtBQUNBO0FBQ0FDLHFCQUFjLE1BL0dIOztBQWlIWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0FDLDBCQUFtQixNQTVIUjs7QUE4SFg7QUFDQUMsNEJBQXFCLEdBL0hWOztBQWlJWDtBQUNBQyxvQkFBYSxFQWxJRjs7QUFvSVg7QUFDQUMsbUJBQVksRUFySUQ7O0FBdUlYO0FBQ0FDLGlCQUNJLGlFQUNJLGlDQURKLEdBRUksOEJBRkosR0FHUSxnQ0FIUixHQUlZLGlGQUpaLEdBS1EsUUFMUixHQU1RLGlEQU5SLEdBT1EsbURBUFIsR0FRUSxvQ0FSUixHQVNRLCtFQVRSLEdBVUksUUFWSixHQVdBLFFBcEpPOztBQXNKWDtBQUNBQyxvQkFBYSxzQ0F2SkY7O0FBeUpYO0FBQ0FDLGtCQUFXLG1EQTFKQTs7QUE0SlhDLGdCQUFTOztBQUVMQyxzQkFBVywrR0FDQywyQkFERCxHQUVLLDBGQUZMLEdBR0MsUUFIRCxHQUlILE1BTkg7O0FBUUxDLGtCQUFPLCtGQUNLLDJCQURMLEdBRVMsb0ZBRlQsR0FHSyxRQUhMLEdBSUMsV0FaSDs7QUFjTEMsbUJBQVEsa0dBQ0ksMkJBREosR0FFUSwwQ0FGUixHQUdJLFFBSEosR0FJQSxXQWxCSDs7QUFvQkw7QUFDQTtBQUNBM0Isc0JBQWEsc0ZBdEJSOztBQXdCTDtBQUNBNEIsdUJBQVkscUdBQ0ksMkJBREosR0FFTSxvRUFGTixHQUdJLFFBSEosR0FJRSxXQTdCVDs7QUErQkxDLHdCQUFhLHNHQUNDLDJCQURELEdBRUcsb0VBRkgsR0FHQyxRQUhELEdBSUQ7QUFuQ1AsU0E1SkU7O0FBa01YO0FBQ0FDLGtCQUFXLE1Bbk1BOztBQXNNWDtBQUNBOztBQUVBO0FBQ0FDLG1CQUFZLEtBMU1EOztBQTRNWDtBQUNBQyxtQkFBWSxJQTdNRDs7QUErTVg7QUFDQUMsbUJBQVksSUFoTkQ7O0FBbU5YO0FBQ0E7O0FBRUFDLG9CQUFhO0FBQ1RDLHVCQUFZO0FBREgsU0F0TkY7O0FBME5YO0FBQ0FDLGVBQVE7QUFDSkMsc0JBQVcsSUFEUCxFQUNjO0FBQ2xCQyxzQkFBVyxJQUZQLENBRWM7QUFGZCxTQTNORzs7QUFnT1g7QUFDQTtBQUNBQyxjQUFPLElBbE9JOztBQW9PWDtBQUNBO0FBQ0E7Ozs7Ozs7OztBQVNBQyxlQUFRLEVBL09HOztBQWlQWEMsbUJBQVk7QUFDUk4sdUJBQVksS0FESjtBQUVSTyxtQkFBWTtBQUZKLFNBalBEOztBQXNQWEMsZ0JBQVM7QUFDZFIsdUJBQWMsS0FEQSxFQUN3QjtBQUN0Q1MseUJBQWMsSUFGQSxFQUV3QjtBQUN0Q2Qsc0JBQWMscUJBSEEsRUFHd0I7QUFDdENlLGtCQUFjLEdBSkEsQ0FJd0I7QUFKeEIsU0F0UEU7O0FBNlBYO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7O0FBT0FDLGdCQUFlOUQsRUFBRStELElBelFOLEVBeVFhOztBQUV4QkMsb0JBQWVoRSxFQUFFK0QsSUEzUU4sRUEyUWE7QUFDeEJFLG1CQUFlakUsRUFBRStELElBNVFOLEVBNFFhOztBQUV4Qkcsb0JBQWVsRSxFQUFFK0QsSUE5UU4sRUE4UWE7QUFDeEJJLG1CQUFlbkUsRUFBRStELElBL1FOLEVBK1FhOztBQUV4QksscUJBQWVwRSxFQUFFK0QsSUFqUk4sRUFpUmE7QUFDeEJNLG9CQUFlckUsRUFBRStELElBbFJOLEVBa1JhOztBQUV4Qk8sb0JBQWV0RSxFQUFFK0QsSUFwUk4sRUFvUmE7QUFDeEJRLHNCQUFldkUsRUFBRStELElBclJOLEVBcVJhOzs7QUFHeEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBUyxzQkFBZSxzQkFBVUMsT0FBVixFQUFtQkMsS0FBbkIsRUFBMkI7QUFDdEMsbUJBQU9ELFFBQVFFLElBQVIsS0FBaUIsT0FBakIsR0FBMkIsTUFBM0IsR0FBb0MsS0FBM0M7QUFDSCxTQXpTVTs7QUEyU1g7QUFDQUMsb0JBQWEsT0E1U0Y7O0FBOFNYO0FBQ0FDLHNCQUFlLE9BL1NKOztBQWlUWDtBQUNBQyx5QkFBa0IsS0FsVFA7QUFtVFhDLHVCQUFrQixLQW5UUDtBQW9UWEMseUJBQWtCLEtBcFRQOztBQXVUWDtBQUNBOztBQUVBQyxnQkFBUztBQUNMekUsb0JBQVMsQ0FESjs7QUFHTGdFLDBCQUFlLHNCQUFVQyxPQUFWLEVBQW1CQyxLQUFuQixFQUEyQjtBQUN0Qyx1QkFBT0QsUUFBUUUsSUFBUixLQUFpQixPQUFqQixHQUEyQixnQkFBM0IsR0FBOEMsS0FBckQ7QUFDSCxhQUxJO0FBTUxDLHdCQUFhLG9CQUFVSCxPQUFWLEVBQW1CQyxLQUFuQixFQUEyQjtBQUNwQyx1QkFBT0QsUUFBUUUsSUFBUixLQUFpQixPQUFqQixHQUEyQixnQkFBM0IsR0FBOEMsT0FBckQ7QUFDSCxhQVJJO0FBU0xHLDZCQUFrQix5QkFBVUwsT0FBVixFQUFtQkMsS0FBbkIsRUFBMkI7QUFDekMsdUJBQU9ELFFBQVFFLElBQVIsS0FBaUIsT0FBakIsR0FBMkIsTUFBM0IsR0FBb0MsS0FBM0M7QUFDSCxhQVhJO0FBWUxJLDJCQUFnQix1QkFBVU4sT0FBVixFQUFtQkMsS0FBbkIsRUFBMkI7QUFDdkMsdUJBQU9ELFFBQVFFLElBQVIsS0FBaUIsT0FBakIsR0FBMkIsTUFBM0IsR0FBb0MsS0FBM0M7QUFDSDtBQWRJLFNBMVRFOztBQTRVWDtBQUNBOztBQUVBTyxjQUFPLElBL1VJO0FBZ1ZYQyxjQUFPO0FBQ0gsa0JBQU87QUFDSEMsdUJBQWMsT0FEWDtBQUVIQyxzQkFBYyxNQUZYO0FBR0hDLHNCQUFjLFVBSFg7QUFJSEMsdUJBQWMsdUVBSlg7QUFLSEMsNEJBQWMsaUJBTFg7QUFNSEMsMkJBQWMsaUJBTlg7QUFPSEMsNkJBQWMsYUFQWDtBQVFIQyx3QkFBYyxZQVJYO0FBU0hDLDBCQUFjLFVBVFg7QUFVSEMsdUJBQWMsT0FWWDtBQVdIQyxzQkFBYztBQVhYLGFBREo7QUFjSCxrQkFBTztBQUNIVix1QkFBYyxZQURYO0FBRUhDLHNCQUFjLFFBRlg7QUFHSEMsc0JBQWMsUUFIWDtBQUlIQyx1QkFBYyxvR0FKWDtBQUtIQyw0QkFBYyxrQkFMWDtBQU1IQywyQkFBYyxrQkFOWDtBQU9IQyw2QkFBYyxVQVBYO0FBUUhDLHdCQUFjLGdCQVJYO0FBU0hDLDBCQUFjLGVBVFg7QUFVSEMsdUJBQWMsUUFWWDtBQVdIQyxzQkFBYztBQVhYO0FBZEo7O0FBaFZJLEtBQWY7O0FBK1dBO0FBQ0E7O0FBRUEsUUFBSUMsS0FBSy9GLEVBQUVGLE1BQUYsQ0FBVDtBQUNBLFFBQUlrRyxLQUFLaEcsRUFBRUQsUUFBRixDQUFUOztBQUVBLFFBQUlrRyxTQUFTLENBQWI7O0FBR0E7QUFDQTs7QUFFQSxRQUFJQyxVQUFVLFNBQVZBLE9BQVUsQ0FBV0MsR0FBWCxFQUFpQjtBQUMzQixlQUFPQSxPQUFPQSxJQUFJQyxjQUFYLElBQTZCRCxlQUFlbkcsQ0FBbkQ7QUFDSCxLQUZEOztBQUtBO0FBQ0E7O0FBRUEsUUFBSXFHLGdCQUFpQixZQUFZO0FBQzdCLGVBQU92RyxPQUFPd0cscUJBQVAsSUFDQ3hHLE9BQU95RywyQkFEUixJQUVDekcsT0FBTzBHLHdCQUZSLElBR0MxRyxPQUFPMkcsc0JBSFI7QUFJQztBQUNBLGtCQUFVQyxRQUFWLEVBQW9CO0FBQ2hCLG1CQUFPNUcsT0FBTzZHLFVBQVAsQ0FBa0JELFFBQWxCLEVBQTRCLE9BQU8sRUFBbkMsQ0FBUDtBQUNILFNBUFQ7QUFRSCxLQVRtQixFQUFwQjs7QUFZQTtBQUNBOztBQUVBLFFBQUlFLGdCQUFpQixZQUFZO0FBQzdCLFlBQUlDLENBQUo7QUFBQSxZQUFPQyxLQUFLL0csU0FBU2dILGFBQVQsQ0FBdUIsYUFBdkIsQ0FBWjs7QUFFQSxZQUFJQyxjQUFjO0FBQ2QsMEJBQW9CLGVBRE47QUFFZCwyQkFBb0IsZ0JBRk47QUFHZCw2QkFBb0IsZUFITjtBQUlkLGdDQUFvQjtBQUpOLFNBQWxCOztBQU9BLGFBQUtILENBQUwsSUFBVUcsV0FBVixFQUF1QjtBQUNuQixnQkFBSUYsR0FBR0csS0FBSCxDQUFTSixDQUFULE1BQWdCNUcsU0FBcEIsRUFBOEI7QUFDMUIsdUJBQU8rRyxZQUFZSCxDQUFaLENBQVA7QUFDSDtBQUNKOztBQUVELGVBQU8sZUFBUDtBQUNILEtBakJtQixFQUFwQjs7QUFvQkE7QUFDQTtBQUNBOztBQUVBLFFBQUlLLGNBQWMsU0FBZEEsV0FBYyxDQUFVQyxHQUFWLEVBQWdCO0FBQzlCLGVBQVNBLE9BQU9BLElBQUlDLE1BQVgsSUFBcUJELElBQUksQ0FBSixFQUFPRSxZQUFyQztBQUNILEtBRkQ7O0FBS0E7QUFDQTs7QUFFQSxRQUFJQyxXQUFXLFNBQVhBLFFBQVcsQ0FBVUMsT0FBVixFQUFtQkMsSUFBbkIsRUFBeUJDLEtBQXpCLEVBQWlDO0FBQzVDLFlBQUlDLE9BQU8sSUFBWDs7QUFFQUEsYUFBS0YsSUFBTCxHQUFZeEgsRUFBRTJILE1BQUYsQ0FBVSxJQUFWLEVBQWdCLEVBQUVGLE9BQVFBLEtBQVYsRUFBaEIsRUFBbUN6SCxFQUFFRyxRQUFGLENBQVdHLFFBQTlDLEVBQXdEa0gsUUFBUSxFQUFoRSxDQUFaOztBQUVBLFlBQUt4SCxFQUFFRyxRQUFGLENBQVd5SCxRQUFoQixFQUEyQjtBQUN2QkYsaUJBQUtGLElBQUwsR0FBWXhILEVBQUUySCxNQUFGLENBQVUsSUFBVixFQUFnQixFQUFoQixFQUFvQkQsS0FBS0YsSUFBekIsRUFBK0JFLEtBQUtGLElBQUwsQ0FBVXZDLE1BQXpDLENBQVo7QUFDSDs7QUFFRDtBQUNBLFlBQUt1QyxRQUFReEgsRUFBRTZILE9BQUYsQ0FBV0wsS0FBSzFHLE9BQWhCLENBQWIsRUFBeUM7QUFDckM0RyxpQkFBS0YsSUFBTCxDQUFVMUcsT0FBVixHQUFvQjBHLEtBQUsxRyxPQUF6QjtBQUNIOztBQUVENEcsYUFBS0ksRUFBTCxHQUFhSixLQUFLRixJQUFMLENBQVVNLEVBQVYsSUFBZ0IsRUFBRTdCLE1BQS9CO0FBQ0F5QixhQUFLSyxLQUFMLEdBQWEsRUFBYjs7QUFFQUwsYUFBS00sU0FBTCxHQUFpQkMsU0FBVVAsS0FBS0YsSUFBTCxDQUFVQyxLQUFwQixFQUEyQixFQUEzQixLQUFtQyxDQUFwRDtBQUNBQyxhQUFLUSxTQUFMLEdBQWlCLElBQWpCOztBQUVBUixhQUFLUyxPQUFMLEdBQWUsSUFBZjtBQUNBVCxhQUFLVSxPQUFMLEdBQWUsQ0FBZjs7QUFFQVYsYUFBS1csUUFBTCxHQUFnQixJQUFoQjs7QUFFQTtBQUNBWCxhQUFLWSxXQUFMLENBQWtCZixPQUFsQjs7QUFFQSxZQUFLLENBQUNHLEtBQUtLLEtBQUwsQ0FBV1gsTUFBakIsRUFBMEI7QUFDdEI7QUFDSDs7QUFFRDtBQUNBTSxhQUFLYSxVQUFMLEdBQWtCdkksRUFBRUQsU0FBU3lJLGFBQVgsRUFBMEJDLElBQTFCLEVBQWxCOztBQUVBO0FBQ0FmLGFBQUtnQixNQUFMLEdBQWMsRUFBZDs7QUFFQWhCLGFBQUtpQixJQUFMO0FBQ0gsS0F2Q0Q7O0FBeUNBM0ksTUFBRTJILE1BQUYsQ0FBU0wsU0FBU3NCLFNBQWxCLEVBQTZCOztBQUV6QjtBQUNBOztBQUVBRCxjQUFPLGdCQUFXO0FBQ2QsZ0JBQUlqQixPQUFPLElBQVg7QUFBQSxnQkFDSW1CLFlBQWlCbkIsS0FBS0ssS0FBTCxDQUFZTCxLQUFLTSxTQUFqQixDQURyQjtBQUFBLGdCQUVJYyxnQkFBaUJELFVBQVVyQixJQUYvQjtBQUFBLGdCQUdJdUIsaUJBQWlCL0ksRUFBRUcsUUFBRixDQUFXNEksY0FIaEM7QUFBQSxnQkFJSUMsVUFKSjtBQUFBLGdCQUtJQyxVQUxKO0FBQUEsZ0JBTUlDLFNBTko7O0FBUUF4QixpQkFBS3lCLFNBQUwsR0FBa0JuRCxHQUFHbUQsU0FBSCxFQUFsQjtBQUNBekIsaUJBQUswQixVQUFMLEdBQWtCcEQsR0FBR29ELFVBQUgsRUFBbEI7O0FBR0E7QUFDQTs7QUFFQSxnQkFBSyxDQUFDcEosRUFBRUcsUUFBRixDQUFXa0osV0FBWCxFQUFOLEVBQWlDOztBQUU3QnJKLGtCQUFHLE1BQUgsRUFBWXNKLFFBQVosQ0FBc0IsaUJBQXRCOztBQUVBO0FBQ0Esb0JBQUssbUJBQW1CQyxJQUFuQixDQUF3QkMsVUFBVUMsU0FBbEMsS0FBZ0QsQ0FBQzNKLE9BQU80SixRQUE3RCxFQUF3RTs7QUFFcEU7QUFDQTtBQUNBOztBQUVBLHdCQUFLYixVQUFVbEUsSUFBVixLQUFtQixPQUF4QixFQUFrQztBQUM5QjNFLDBCQUFHLE1BQUgsRUFBWTBCLEdBQVosQ0FBaUIsS0FBakIsRUFBd0IxQixFQUFHLE1BQUgsRUFBWW1KLFNBQVosS0FBMEIsQ0FBQyxDQUFuRCxFQUF1REcsUUFBdkQsQ0FBaUUsaUJBQWpFO0FBQ0g7QUFFSixpQkFWRCxNQVVPLElBQUssQ0FBQ3RKLEVBQUVHLFFBQUYsQ0FBV3lILFFBQVosSUFBd0I3SCxTQUFTNEosSUFBVCxDQUFjQyxZQUFkLEdBQTZCOUosT0FBTytKLFdBQWpFLEVBQStFOztBQUVsRix3QkFBS2QsbUJBQW1COUksU0FBeEIsRUFBb0M7QUFDaEMrSSxxQ0FBYWhKLEVBQUUseURBQUYsRUFBNkQ4SixRQUE3RCxDQUF1RSxNQUF2RSxDQUFiOztBQUVBZix5Q0FBaUIvSSxFQUFFRyxRQUFGLENBQVc0SSxjQUFYLEdBQTRCQyxXQUFXLENBQVgsRUFBY2UsV0FBZCxHQUE0QmYsV0FBVyxDQUFYLEVBQWNnQixXQUF2Rjs7QUFFQWhCLG1DQUFXaUIsTUFBWDtBQUNIOztBQUVEakssc0JBQUcsTUFBSCxFQUFZa0ssTUFBWixDQUFvQixtR0FBbUduQixjQUFuRyxHQUFvSCxlQUF4STtBQUNBL0ksc0JBQUcsTUFBSCxFQUFZc0osUUFBWixDQUFzQiwwQkFBdEI7QUFDSDtBQUNKOztBQUdEO0FBQ0E7O0FBRUE7QUFDQUosd0JBQVksRUFBWjs7QUFFQWxKLGNBQUVtSyxJQUFGLENBQVFyQixjQUFjaEksT0FBdEIsRUFBK0IsVUFBVTJHLEtBQVYsRUFBaUIyQyxLQUFqQixFQUF5QjtBQUNwRGxCLDZCQUFlSixjQUFjdEcsTUFBZCxDQUFzQjRILEtBQXRCLEtBQWlDLEVBQWhEO0FBQ0gsYUFGRDs7QUFJQTtBQUNBO0FBQ0FuQix5QkFBYWpKLEVBQ1QwSCxLQUFLMkMsU0FBTCxDQUFnQjNDLElBQWhCLEVBQ0lvQixjQUFjekcsT0FBZCxDQUNLaUksT0FETCxDQUNjLGlCQURkLEVBQ2lDcEIsU0FEakMsRUFFS29CLE9BRkwsQ0FFYyxnQkFGZCxFQUVnQ3hCLGNBQWN0RyxNQUFkLENBQXFCSSxTQUFyQixHQUFpQ2tHLGNBQWN0RyxNQUFkLENBQXFCSyxVQUZ0RixDQURKLENBRFMsRUFPUmxCLElBUFEsQ0FPRixJQVBFLEVBT0ksd0JBQXdCK0YsS0FBS0ksRUFQakMsRUFRUndCLFFBUlEsQ0FRRSxvQkFSRixFQVNSQSxRQVRRLENBU0VSLGNBQWMxRyxTQVRoQixFQVVSYixJQVZRLENBVUYsVUFWRSxFQVVVbUcsSUFWVixFQVdSb0MsUUFYUSxDQVdFaEIsY0FBY2hHLFFBWGhCLENBQWI7O0FBYUE7QUFDQTRFLGlCQUFLNkMsS0FBTCxHQUFhO0FBQ1RDLDJCQUFZdkI7QUFESCxhQUFiOztBQUlBLGFBQUUsSUFBRixFQUFRLE9BQVIsRUFBaUIsU0FBakIsRUFBNEIsU0FBNUIsRUFBdUMsT0FBdkMsRUFBZ0QsU0FBaEQsRUFBMkQsWUFBM0QsRUFBMEV3QixPQUExRSxDQUFrRixVQUFTQyxJQUFULEVBQWU7QUFDN0ZoRCxxQkFBSzZDLEtBQUwsQ0FBWUcsSUFBWixJQUFxQnpCLFdBQVcwQixJQUFYLENBQWlCLGVBQWVELElBQWhDLENBQXJCO0FBQ0gsYUFGRDs7QUFJQWhELGlCQUFLa0QsT0FBTCxDQUFjLFFBQWQ7O0FBRUE7QUFDQWxELGlCQUFLbUQsUUFBTDs7QUFFQTtBQUNBbkQsaUJBQUtvRCxNQUFMLENBQWFwRCxLQUFLTSxTQUFsQjtBQUNILFNBN0Z3Qjs7QUFnR3pCO0FBQ0E7QUFDQTs7QUFFQXFDLG1CQUFZLG1CQUFVbEUsR0FBVixFQUFlNEUsR0FBZixFQUFxQjtBQUM3QixnQkFBSUMsTUFBTTdFLElBQUlxQixJQUFKLENBQVNyQyxJQUFULENBQWVnQixJQUFJcUIsSUFBSixDQUFTdEMsSUFBeEIsQ0FBVjs7QUFFQSxtQkFBTzZGLElBQUlULE9BQUosQ0FBWSxnQkFBWixFQUE4QixVQUFTVyxLQUFULEVBQWdCQyxDQUFoQixFQUFtQjtBQUNwRCxvQkFBSWQsUUFBUVksSUFBSUUsQ0FBSixDQUFaOztBQUVBLG9CQUFLZCxVQUFVbkssU0FBZixFQUEyQjtBQUN2QiwyQkFBT2dMLEtBQVA7QUFDSDs7QUFFRCx1QkFBT2IsS0FBUDtBQUNILGFBUk0sQ0FBUDtBQVNILFNBaEh3Qjs7QUFrSHpCO0FBQ0E7QUFDQTs7QUFFQTlCLHFCQUFjLHFCQUFXZixPQUFYLEVBQXFCO0FBQy9CLGdCQUFJRyxPQUFRLElBQVo7QUFDQSxnQkFBSXlELFFBQVFuTCxFQUFFb0wsU0FBRixDQUFhN0QsT0FBYixDQUFaOztBQUVBdkgsY0FBRW1LLElBQUYsQ0FBT2dCLEtBQVAsRUFBYyxVQUFVRSxDQUFWLEVBQWFYLElBQWIsRUFBb0I7QUFDOUIsb0JBQUl2RSxNQUFPLEVBQVg7QUFBQSxvQkFDSXFCLE9BQU8sRUFEWDtBQUFBLG9CQUVJOEQsS0FGSjtBQUFBLG9CQUdJM0csSUFISjtBQUFBLG9CQUlJNEcsR0FKSjtBQUFBLG9CQUtJQyxRQUxKOztBQU9BO0FBQ0E7O0FBRUEsb0JBQUt4TCxFQUFFeUwsYUFBRixDQUFpQmYsSUFBakIsQ0FBTCxFQUErQjs7QUFFM0I7QUFDQTs7QUFFQXZFLDBCQUFPdUUsSUFBUDtBQUNBbEQsMkJBQU9rRCxLQUFLbEQsSUFBTCxJQUFha0QsSUFBcEI7QUFFSCxpQkFSRCxNQVFPLElBQUsxSyxFQUFFMkUsSUFBRixDQUFRK0YsSUFBUixNQUFtQixRQUFuQixJQUErQjFLLEVBQUcwSyxJQUFILEVBQVV0RCxNQUE5QyxFQUF1RDs7QUFFMUQ7QUFDQWtFLDRCQUFRdEwsRUFBRzBLLElBQUgsQ0FBUjs7QUFFQWxELDJCQUFPOEQsTUFBTS9KLElBQU4sRUFBUDtBQUNBaUcsMkJBQU94SCxFQUFFMkgsTUFBRixDQUFVLEVBQVYsRUFBY0gsSUFBZCxFQUFvQkEsS0FBS2tFLE9BQUwsSUFBZ0IsRUFBcEMsQ0FBUDs7QUFFQTtBQUNBbEUseUJBQUttRSxLQUFMLEdBQWFMLEtBQWI7O0FBRUFuRix3QkFBSW9GLEdBQUosR0FBVS9ELEtBQUsrRCxHQUFMLElBQVlELE1BQU0zSixJQUFOLENBQVksTUFBWixDQUF0Qjs7QUFFQTtBQUNBO0FBQ0Esd0JBQUssQ0FBQ3dFLElBQUl4QixJQUFMLElBQWEsQ0FBQ3dCLElBQUlvRixHQUF2QixFQUE2QjtBQUN6QnBGLDRCQUFJeEIsSUFBSixHQUFXLFFBQVg7QUFDQXdCLDRCQUFJb0YsR0FBSixHQUFXYixJQUFYO0FBQ0g7QUFFSixpQkFwQk0sTUFvQkE7O0FBRUg7QUFDQTs7QUFFQXZFLDBCQUFNO0FBQ0Z4Qiw4QkFBTyxNQURMO0FBRUY0Ryw2QkFBT2IsT0FBTztBQUZaLHFCQUFOO0FBS0g7O0FBRUQ7QUFDQXZFLG9CQUFJcUIsSUFBSixHQUFXeEgsRUFBRTJILE1BQUYsQ0FBVSxJQUFWLEVBQWdCLEVBQWhCLEVBQW9CRCxLQUFLRixJQUF6QixFQUErQkEsSUFBL0IsQ0FBWDs7QUFFQTtBQUNBLG9CQUFLeEgsRUFBRTZILE9BQUYsQ0FBV0wsS0FBSzFHLE9BQWhCLENBQUwsRUFBaUM7QUFDN0JxRix3QkFBSXFCLElBQUosQ0FBUzFHLE9BQVQsR0FBbUIwRyxLQUFLMUcsT0FBeEI7QUFDSDs7QUFHRDtBQUNBOztBQUVBNkQsdUJBQU93QixJQUFJeEIsSUFBSixJQUFZd0IsSUFBSXFCLElBQUosQ0FBUzdDLElBQTVCO0FBQ0E0RyxzQkFBT3BGLElBQUlvRixHQUFKLElBQVcsRUFBbEI7O0FBRUEsb0JBQUssQ0FBQzVHLElBQUQsSUFBUzRHLEdBQWQsRUFBb0I7QUFDaEIsd0JBQUtBLElBQUlOLEtBQUosQ0FBVSxzRkFBVixDQUFMLEVBQXlHO0FBQ3JHdEcsK0JBQU8sT0FBUDtBQUVILHFCQUhELE1BR08sSUFBSzRHLElBQUlOLEtBQUosQ0FBVSxzQkFBVixDQUFMLEVBQXlDO0FBQzVDdEcsK0JBQU8sS0FBUDtBQUVILHFCQUhNLE1BR0EsSUFBSzRHLElBQUlLLE1BQUosQ0FBVyxDQUFYLE1BQWtCLEdBQXZCLEVBQTZCO0FBQ2hDakgsK0JBQU8sUUFBUDtBQUNIO0FBQ0o7O0FBRUQsb0JBQUtBLElBQUwsRUFBWTtBQUNSd0Isd0JBQUl4QixJQUFKLEdBQVdBLElBQVg7QUFFSCxpQkFIRCxNQUdPO0FBQ0grQyx5QkFBS2tELE9BQUwsQ0FBYyxpQkFBZCxFQUFpQ3pFLEdBQWpDO0FBQ0g7O0FBR0Q7QUFDQTs7QUFFQUEsb0JBQUlzQixLQUFKLEdBQVlDLEtBQUtLLEtBQUwsQ0FBV1gsTUFBdkI7O0FBRUE7QUFDQSxvQkFBS2pCLElBQUlxQixJQUFKLENBQVNtRSxLQUFULElBQWtCLENBQUN4RixJQUFJcUIsSUFBSixDQUFTbUUsS0FBVCxDQUFldkUsTUFBdkMsRUFBZ0Q7QUFDNUMsMkJBQU9qQixJQUFJcUIsSUFBSixDQUFTbUUsS0FBaEI7QUFDSDs7QUFFRCxvQkFBSyxDQUFDeEYsSUFBSXFCLElBQUosQ0FBU3FFLE1BQVYsSUFBb0IxRixJQUFJcUIsSUFBSixDQUFTbUUsS0FBbEMsRUFBMEM7QUFDdEN4Rix3QkFBSXFCLElBQUosQ0FBU3FFLE1BQVQsR0FBa0IxRixJQUFJcUIsSUFBSixDQUFTbUUsS0FBVCxDQUFlaEIsSUFBZixDQUFxQixXQUFyQixDQUFsQjtBQUNIOztBQUVELG9CQUFLeEUsSUFBSXFCLElBQUosQ0FBU3FFLE1BQVQsSUFBbUIsQ0FBQzFGLElBQUlxQixJQUFKLENBQVNxRSxNQUFULENBQWdCekUsTUFBekMsRUFBa0Q7QUFDOUMsMkJBQU9qQixJQUFJcUIsSUFBSixDQUFTcUUsTUFBaEI7QUFDSDs7QUFFRDtBQUNBLG9CQUFLN0wsRUFBRTJFLElBQUYsQ0FBUXdCLElBQUlxQixJQUFKLENBQVNzRSxPQUFqQixNQUErQixVQUFwQyxFQUFpRDtBQUM3QzNGLHdCQUFJcUIsSUFBSixDQUFTc0UsT0FBVCxHQUFtQjNGLElBQUlxQixJQUFKLENBQVNzRSxPQUFULENBQWlCQyxLQUFqQixDQUF3QnJCLElBQXhCLEVBQThCLENBQUVoRCxJQUFGLEVBQVF2QixHQUFSLENBQTlCLENBQW5CO0FBQ0g7O0FBRUQsb0JBQUtuRyxFQUFFMkUsSUFBRixDQUFRK0MsS0FBS0YsSUFBTCxDQUFVc0UsT0FBbEIsTUFBZ0MsVUFBckMsRUFBa0Q7QUFDOUMzRix3QkFBSXFCLElBQUosQ0FBU3NFLE9BQVQsR0FBbUJwRSxLQUFLRixJQUFMLENBQVVzRSxPQUFWLENBQWtCQyxLQUFsQixDQUF5QnJCLElBQXpCLEVBQStCLENBQUVoRCxJQUFGLEVBQVF2QixHQUFSLENBQS9CLENBQW5CO0FBQ0g7O0FBRUQ7QUFDQSxvQkFBSyxFQUFHQSxJQUFJcUIsSUFBSixDQUFTc0UsT0FBVCxZQUE0QjlMLENBQS9CLENBQUwsRUFBMEM7QUFDdENtRyx3QkFBSXFCLElBQUosQ0FBU3NFLE9BQVQsR0FBbUIzRixJQUFJcUIsSUFBSixDQUFTc0UsT0FBVCxLQUFxQjdMLFNBQXJCLEdBQWlDLEVBQWpDLEdBQXNDa0csSUFBSXFCLElBQUosQ0FBU3NFLE9BQVQsR0FBbUIsRUFBNUU7QUFDSDs7QUFFRDtBQUNBO0FBQ0Esb0JBQUtuSCxTQUFTLE1BQWQsRUFBdUI7QUFDbkI2RywrQkFBV0QsSUFBSVMsS0FBSixDQUFVLEtBQVYsRUFBaUIsQ0FBakIsQ0FBWDs7QUFFQSx3QkFBS1IsU0FBU3BFLE1BQVQsR0FBa0IsQ0FBdkIsRUFBMkI7QUFDdkJqQiw0QkFBSW9GLEdBQUosR0FBVUMsU0FBU1MsS0FBVCxFQUFWOztBQUVBOUYsNEJBQUlxQixJQUFKLENBQVMwRSxNQUFULEdBQWtCVixTQUFTUyxLQUFULEVBQWxCO0FBQ0g7QUFDSjs7QUFFRCxvQkFBSzlGLElBQUlxQixJQUFKLENBQVN4RyxRQUFULElBQXFCLE1BQTFCLEVBQW1DOztBQUUvQix3QkFBS2hCLEVBQUVtTSxPQUFGLENBQVd4SCxJQUFYLEVBQWlCLENBQUMsTUFBRCxFQUFTLFFBQVQsRUFBbUIsTUFBbkIsQ0FBakIsSUFBZ0QsQ0FBQyxDQUF0RCxFQUEwRDtBQUN0RHdCLDRCQUFJcUIsSUFBSixDQUFTM0csT0FBVCxHQUFvQixLQUFwQjtBQUNBc0YsNEJBQUlxQixJQUFKLENBQVN4RyxRQUFULEdBQW9CLElBQXBCO0FBRUgscUJBSkQsTUFJTztBQUNIbUYsNEJBQUlxQixJQUFKLENBQVN4RyxRQUFULEdBQW9CLEtBQXBCO0FBQ0g7QUFFSjs7QUFFRDtBQUNBLG9CQUFLMkQsU0FBUyxLQUFkLEVBQXNCO0FBQ2xCd0Isd0JBQUl4QixJQUFKLEdBQVcsUUFBWDs7QUFFQXdCLHdCQUFJcUIsSUFBSixDQUFTaEcsTUFBVCxDQUFnQkosT0FBaEIsR0FBMEIsS0FBMUI7QUFDSDs7QUFFRDtBQUNBLG9CQUFLK0UsSUFBSXFCLElBQUosQ0FBU3RHLEtBQWQsRUFBc0I7O0FBRWxCaUYsd0JBQUlxQixJQUFKLEdBQVd4SCxFQUFFMkgsTUFBRixDQUFTLElBQVQsRUFBZXhCLElBQUlxQixJQUFuQixFQUF5QjtBQUNoQztBQUNBNUcsaUNBQVUsQ0FGc0I7QUFHaENDLGlDQUFVLENBSHNCOztBQUtoQ0csa0NBQVcsQ0FMcUI7O0FBT2hDO0FBQ0FOLGtDQUFXLENBUnFCOztBQVVoQztBQUNBK0MsbUNBQWEsQ0FYbUI7QUFZaENQLG9DQUFhLENBWm1CO0FBYWhDUyxnQ0FBYSxDQWJtQjtBQWNoQ1AsK0JBQWEsQ0FkbUI7O0FBZ0JoQztBQUNBb0Isc0NBQWtCLEtBakJjO0FBa0JoQ0ksb0NBQWtCLEtBbEJjO0FBbUJoQ0Msc0NBQWtCLEtBbkJjO0FBb0JoQ0MseUNBQWtCLEtBcEJjO0FBcUJoQ0MsdUNBQWtCLEtBckJjO0FBc0JoQ0MseUNBQWtCO0FBdEJjLHFCQUF6QixDQUFYO0FBeUJIOztBQUVEO0FBQ0E7O0FBRUEwQyxxQkFBS0ssS0FBTCxDQUFXcUUsSUFBWCxDQUFpQmpHLEdBQWpCO0FBRUgsYUF4TEQ7QUEwTEgsU0FwVHdCOztBQXVUekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUFrRyxtQkFBWSxxQkFBVztBQUNuQixnQkFBSTNFLE9BQU8sSUFBWDs7QUFFQUEsaUJBQUs0RSxZQUFMOztBQUVBO0FBQ0E1RSxpQkFBSzZDLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQitCLEVBQXJCLENBQXdCLGdCQUF4QixFQUEwQyx1QkFBMUMsRUFBbUUsVUFBU0MsQ0FBVCxFQUFZO0FBQzNFQSxrQkFBRUMsZUFBRjtBQUNBRCxrQkFBRUUsY0FBRjs7QUFFQWhGLHFCQUFLL0UsS0FBTCxDQUFZNkosQ0FBWjtBQUVILGFBTkQsRUFNR0QsRUFOSCxDQU1PLGdDQU5QLEVBTXlDLHNCQU56QyxFQU1pRSxVQUFTQyxDQUFULEVBQVk7QUFDekVBLGtCQUFFQyxlQUFGO0FBQ0FELGtCQUFFRSxjQUFGOztBQUVBaEYscUJBQUtpRixRQUFMO0FBRUgsYUFaRCxFQVlHSixFQVpILENBWU8sZ0NBWlAsRUFZeUMsc0JBWnpDLEVBWWlFLFVBQVNDLENBQVQsRUFBWTtBQUN6RUEsa0JBQUVDLGVBQUY7QUFDQUQsa0JBQUVFLGNBQUY7O0FBRUFoRixxQkFBS2tGLElBQUw7QUFFSCxhQWxCRCxFQWtCR0wsRUFsQkgsQ0FrQk8sVUFsQlAsRUFrQm1CLHNCQWxCbkIsRUFrQjJDLFVBQVNDLENBQVQsRUFBWTtBQUNuRDtBQUNBOUUscUJBQU1BLEtBQUttRixZQUFMLEtBQXNCLGVBQXRCLEdBQXdDLFlBQTlDO0FBQ0gsYUFyQkQ7O0FBd0JBO0FBQ0E5RyxlQUFHd0csRUFBSCxDQUFNLGdDQUFOLEVBQXdDLFVBQVNDLENBQVQsRUFBWTs7QUFFaEQsb0JBQUtBLEtBQUtBLEVBQUVNLGFBQVAsSUFBd0JOLEVBQUVNLGFBQUYsQ0FBZ0JuSSxJQUFoQixLQUF5QixRQUF0RCxFQUFpRTs7QUFFN0QwQixrQ0FBYyxZQUFXO0FBQ3JCcUIsNkJBQUtxRixNQUFMO0FBQ0gscUJBRkQ7QUFJSCxpQkFORCxNQU1POztBQUVIckYseUJBQUs2QyxLQUFMLENBQVd5QyxLQUFYLENBQWlCQyxJQUFqQjs7QUFFQXRHLCtCQUFXLFlBQVc7QUFDbEJlLDZCQUFLNkMsS0FBTCxDQUFXeUMsS0FBWCxDQUFpQkUsSUFBakI7O0FBRUF4Riw2QkFBS3FGLE1BQUw7QUFDSCxxQkFKRCxFQUlHLEdBSkg7QUFNSDtBQUVKLGFBcEJEOztBQXNCQTtBQUNBO0FBQ0EvRyxlQUFHdUcsRUFBSCxDQUFNLFlBQU4sRUFBb0IsVUFBU0MsQ0FBVCxFQUFZO0FBQzVCLG9CQUFJVyxXQUFXbk4sRUFBRUcsUUFBRixHQUFhSCxFQUFFRyxRQUFGLENBQVdrSixXQUFYLEVBQWIsR0FBd0MsSUFBdkQ7O0FBRUEsb0JBQUs4RCxTQUFTQyxTQUFULElBQXNCLENBQUNELFNBQVMxSSxPQUFoQyxJQUEyQyxDQUFDMEksU0FBUzFJLE9BQVQsQ0FBaUIrQyxJQUFqQixDQUFzQnZFLFNBQWxFLElBQStFakQsRUFBR3dNLEVBQUVhLE1BQUwsRUFBY0MsUUFBZCxDQUF3QixvQkFBeEIsQ0FBL0UsSUFBaUl0TixFQUFHd00sRUFBRWEsTUFBTCxFQUFjRSxFQUFkLENBQWtCeE4sUUFBbEIsQ0FBdEksRUFBcUs7QUFDaks7QUFDSDs7QUFFRCxvQkFBS29OLFlBQVluTixFQUFHd00sRUFBRWEsTUFBTCxFQUFjM0wsR0FBZCxDQUFtQixVQUFuQixNQUFvQyxPQUFoRCxJQUEyRCxDQUFDeUwsU0FBUzVDLEtBQVQsQ0FBZUMsU0FBZixDQUF5QmdELEdBQXpCLENBQThCaEIsRUFBRWEsTUFBaEMsRUFBeUNqRyxNQUExRyxFQUFtSDtBQUMvR29GLHNCQUFFQyxlQUFGOztBQUVBVSw2QkFBU00sS0FBVDs7QUFFQTtBQUNBMUgsdUJBQUdvRCxTQUFILENBQWN6QixLQUFLeUIsU0FBbkIsRUFBK0JDLFVBQS9CLENBQTJDMUIsS0FBSzBCLFVBQWhEO0FBQ0g7QUFDSixhQWZEOztBQWtCQTtBQUNBcEQsZUFBR3VHLEVBQUgsQ0FBTSxZQUFOLEVBQW9CLFVBQVVDLENBQVYsRUFBYTtBQUM3QixvQkFBSS9ILFVBQVVpRCxLQUFLakQsT0FBbkI7QUFBQSxvQkFDSWlKLFVBQVVsQixFQUFFbUIsT0FBRixJQUFhbkIsRUFBRW9CLEtBRDdCOztBQUdBLG9CQUFLLENBQUNuSixPQUFELElBQVksQ0FBQ0EsUUFBUStDLElBQVIsQ0FBYTlHLFFBQS9CLEVBQTBDO0FBQ3RDO0FBQ0g7O0FBRUQsb0JBQUtWLEVBQUV3TSxFQUFFYSxNQUFKLEVBQVlFLEVBQVosQ0FBZSxPQUFmLEtBQTJCdk4sRUFBRXdNLEVBQUVhLE1BQUosRUFBWUUsRUFBWixDQUFlLFVBQWYsQ0FBaEMsRUFBNkQ7QUFDekQ7QUFDSDs7QUFFRDtBQUNBLG9CQUFLRyxZQUFZLENBQVosSUFBaUJBLFlBQVksRUFBbEMsRUFBdUM7QUFDbkNsQixzQkFBRUUsY0FBRjs7QUFFQWhGLHlCQUFLL0UsS0FBTCxDQUFZNkosQ0FBWjs7QUFFQTtBQUNIOztBQUVEO0FBQ0Esb0JBQUtrQixZQUFZLEVBQVosSUFBa0JBLFlBQVksRUFBbkMsRUFBd0M7QUFDcENsQixzQkFBRUUsY0FBRjs7QUFFQWhGLHlCQUFLaUYsUUFBTDs7QUFFQTtBQUNIOztBQUVEO0FBQ0Esb0JBQUtlLFlBQVksRUFBWixJQUFrQkEsWUFBWSxFQUFuQyxFQUF3QztBQUNwQ2xCLHNCQUFFRSxjQUFGOztBQUVBaEYseUJBQUtrRixJQUFMOztBQUVBO0FBQ0g7O0FBRURsRixxQkFBS2tELE9BQUwsQ0FBYSxjQUFiLEVBQTZCNEIsQ0FBN0IsRUFBZ0NrQixPQUFoQztBQUNILGFBeENEOztBQTJDQTtBQUNBLGdCQUFLaEcsS0FBS0ssS0FBTCxDQUFZTCxLQUFLTSxTQUFqQixFQUE2QlIsSUFBN0IsQ0FBa0N6RyxRQUF2QyxFQUFrRDtBQUM5QzJHLHFCQUFLbUcsa0JBQUwsR0FBMEIsQ0FBMUI7O0FBRUE3SCxtQkFBR3VHLEVBQUgsQ0FBTSw0SEFBTixFQUFvSSxVQUFTQyxDQUFULEVBQVk7QUFDNUk5RSx5QkFBS21HLGtCQUFMLEdBQTBCLENBQTFCOztBQUVBLHdCQUFLbkcsS0FBS29HLE1BQVYsRUFBbUI7QUFDZnBHLDZCQUFLcUcsWUFBTDtBQUNIOztBQUVEckcseUJBQUtvRyxNQUFMLEdBQWMsS0FBZDtBQUNILGlCQVJEOztBQVVBcEcscUJBQUtzRyxZQUFMLEdBQW9CbE8sT0FBT21PLFdBQVAsQ0FBbUIsWUFBVztBQUM5Q3ZHLHlCQUFLbUcsa0JBQUw7O0FBRUEsd0JBQUtuRyxLQUFLbUcsa0JBQUwsSUFBMkJuRyxLQUFLSyxLQUFMLENBQVlMLEtBQUtNLFNBQWpCLEVBQTZCUixJQUE3QixDQUFrQ3pHLFFBQWxFLEVBQTZFO0FBQ3pFMkcsNkJBQUtvRyxNQUFMLEdBQWMsSUFBZDtBQUNBcEcsNkJBQUttRyxrQkFBTCxHQUEwQixDQUExQjs7QUFFQW5HLDZCQUFLd0csWUFBTDtBQUNIO0FBRUosaUJBVm1CLEVBVWpCLElBVmlCLENBQXBCO0FBV0g7QUFFSixTQS9jd0I7O0FBa2R6QjtBQUNBOztBQUVBNUIsc0JBQWUsd0JBQVc7QUFDdEIsZ0JBQUk1RSxPQUFPLElBQVg7O0FBRUEzQixlQUFHb0ksR0FBSCxDQUFRLGdDQUFSO0FBQ0FuSSxlQUFHbUksR0FBSCxDQUFRLGdDQUFSOztBQUVBLGlCQUFLNUQsS0FBTCxDQUFXQyxTQUFYLENBQXFCMkQsR0FBckIsQ0FBMEIsNkJBQTFCOztBQUVBLGdCQUFLekcsS0FBS3NHLFlBQVYsRUFBeUI7QUFDckJsTyx1QkFBT3NPLGFBQVAsQ0FBc0IxRyxLQUFLc0csWUFBM0I7O0FBRUF0RyxxQkFBS3NHLFlBQUwsR0FBb0IsSUFBcEI7QUFDSDtBQUNKLFNBbGV3Qjs7QUFxZXpCO0FBQ0E7O0FBRUFyQixrQkFBVyxrQkFBVTBCLFFBQVYsRUFBcUI7QUFDNUIsbUJBQU8sS0FBS3ZELE1BQUwsQ0FBYSxLQUFLMUMsT0FBTCxHQUFlLENBQTVCLEVBQStCaUcsUUFBL0IsQ0FBUDtBQUNILFNBMWV3Qjs7QUE2ZXpCO0FBQ0E7O0FBRUF6QixjQUFPLGNBQVV5QixRQUFWLEVBQXFCO0FBQ3hCLG1CQUFPLEtBQUt2RCxNQUFMLENBQWEsS0FBSzFDLE9BQUwsR0FBZSxDQUE1QixFQUErQmlHLFFBQS9CLENBQVA7QUFDSCxTQWxmd0I7O0FBcWZ6QjtBQUNBOztBQUVBdkQsZ0JBQVMsZ0JBQVd3RCxHQUFYLEVBQWdCRCxRQUFoQixFQUEwQkUsS0FBMUIsRUFBa0M7QUFDdkMsZ0JBQUk3RyxPQUFPLElBQVg7QUFBQSxnQkFDSVcsUUFESjtBQUFBLGdCQUVJOUgsSUFGSjtBQUFBLGdCQUdJa0UsT0FISjtBQUFBLGdCQUlJa0ksUUFKSjtBQUFBLGdCQUtJNkIsV0FMSjtBQUFBLGdCQU1JQyxVQU5KO0FBQUEsZ0JBT0lDLGVBUEo7O0FBU0EsZ0JBQUlDLFdBQVdqSCxLQUFLSyxLQUFMLENBQVdYLE1BQTFCOztBQUVBLGdCQUFLTSxLQUFLa0gsU0FBTCxJQUFrQmxILEtBQUswRixTQUF2QixJQUFzQzFGLEtBQUttSCxXQUFMLElBQW9CbkgsS0FBS1csUUFBcEUsRUFBaUY7QUFDN0U7QUFDSDs7QUFFRGlHLGtCQUFPckcsU0FBVXFHLEdBQVYsRUFBZSxFQUFmLENBQVA7QUFDQS9OLG1CQUFPbUgsS0FBS2pELE9BQUwsR0FBZWlELEtBQUtqRCxPQUFMLENBQWErQyxJQUFiLENBQWtCakgsSUFBakMsR0FBd0NtSCxLQUFLRixJQUFMLENBQVVqSCxJQUF6RDs7QUFFQSxnQkFBSyxDQUFDQSxJQUFELEtBQVcrTixNQUFNLENBQU4sSUFBV0EsT0FBT0ssUUFBN0IsQ0FBTCxFQUErQztBQUMzQyx1QkFBTyxLQUFQO0FBQ0g7O0FBRUR0Ryx1QkFBV1gsS0FBS1csUUFBTCxHQUFrQlgsS0FBS1csUUFBTCxLQUFrQixJQUEvQzs7QUFFQSxnQkFBS3NHLFdBQVcsQ0FBWCxJQUFnQixDQUFDdEcsUUFBakIsSUFBNkIsQ0FBQyxDQUFDWCxLQUFLa0gsU0FBekMsRUFBcUQ7QUFDakQ7QUFDSDs7QUFFRGpDLHVCQUFXakYsS0FBS2pELE9BQWhCOztBQUVBaUQsaUJBQUtRLFNBQUwsR0FBaUJSLEtBQUtNLFNBQXRCO0FBQ0FOLGlCQUFLUyxPQUFMLEdBQWlCVCxLQUFLVSxPQUF0Qjs7QUFFQTtBQUNBM0Qsc0JBQVVpRCxLQUFLb0gsV0FBTCxDQUFrQlIsR0FBbEIsQ0FBVjs7QUFFQSxnQkFBS0ssV0FBVyxDQUFoQixFQUFvQjtBQUNoQixvQkFBS3BPLFFBQVFrRSxRQUFRZ0QsS0FBUixHQUFnQixDQUE3QixFQUFpQztBQUM3QkMseUJBQUtvSCxXQUFMLENBQWtCUixNQUFNLENBQXhCO0FBQ0g7O0FBRUQsb0JBQUsvTixRQUFRa0UsUUFBUWdELEtBQVIsR0FBZ0JrSCxXQUFXLENBQXhDLEVBQTRDO0FBQ3hDakgseUJBQUtvSCxXQUFMLENBQWtCUixNQUFNLENBQXhCO0FBQ0g7QUFDSjs7QUFFRDVHLGlCQUFLakQsT0FBTCxHQUFpQkEsT0FBakI7QUFDQWlELGlCQUFLTSxTQUFMLEdBQWlCdkQsUUFBUWdELEtBQXpCO0FBQ0FDLGlCQUFLVSxPQUFMLEdBQWlCM0QsUUFBUTZKLEdBQXpCOztBQUVBNUcsaUJBQUtrRCxPQUFMLENBQWMsWUFBZCxFQUE0QnZDLFFBQTVCOztBQUVBWCxpQkFBS3FILGNBQUw7O0FBRUFOLHlCQUFhek8sRUFBRUcsUUFBRixDQUFXNk8sWUFBWCxDQUF5QnZLLFFBQVF3SyxNQUFqQyxDQUFiOztBQUVBeEssb0JBQVF5SyxPQUFSLEdBQXlCLENBQUVULFdBQVdVLElBQVgsS0FBb0IsQ0FBcEIsSUFBeUJWLFdBQVdXLEdBQVgsS0FBbUIsQ0FBOUMsS0FBcUQsQ0FBQzNLLFFBQVF3SyxNQUFSLENBQWUzQixRQUFmLENBQXlCLG1CQUF6QixDQUEvRTtBQUNBN0ksb0JBQVE0SyxjQUFSLEdBQXlCcFAsU0FBekI7O0FBRUEsZ0JBQUtELEVBQUVzUCxTQUFGLENBQWFqQixRQUFiLENBQUwsRUFBK0I7QUFDM0I1Six3QkFBUTRLLGNBQVIsR0FBeUJoQixRQUF6QjtBQUNILGFBRkQsTUFFTztBQUNIQSwyQkFBVzVKLFFBQVErQyxJQUFSLENBQWNhLFdBQVcsbUJBQVgsR0FBaUMsb0JBQS9DLENBQVg7QUFDSDs7QUFFRGdHLHVCQUFXcEcsU0FBVW9HLFFBQVYsRUFBb0IsRUFBcEIsQ0FBWDs7QUFFQTtBQUNBLGdCQUFLaEcsUUFBTCxFQUFnQjs7QUFFWixvQkFBSzVELFFBQVErQyxJQUFSLENBQWExRixlQUFiLElBQWdDdU0sUUFBckMsRUFBZ0Q7QUFDNUMzRyx5QkFBSzZDLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQjlJLEdBQXJCLENBQTBCLHFCQUExQixFQUFpRDJNLFdBQVcsSUFBNUQ7QUFDSDs7QUFFRDNHLHFCQUFLNkMsS0FBTCxDQUFXQyxTQUFYLENBQXFCK0UsV0FBckIsQ0FBa0Msb0JBQWxDOztBQUVBckksNEJBQWFRLEtBQUs2QyxLQUFMLENBQVdDLFNBQXhCOztBQUVBOUMscUJBQUs2QyxLQUFMLENBQVdDLFNBQVgsQ0FBcUJsQixRQUFyQixDQUErQixrQkFBL0I7O0FBRUE7QUFDQTdFLHdCQUFRd0ssTUFBUixDQUFlM0YsUUFBZixDQUF5Qix5QkFBekI7O0FBRUE1QixxQkFBSzhILFNBQUwsQ0FBZ0IvSyxPQUFoQjs7QUFFQWlELHFCQUFLdEcsT0FBTDs7QUFFQTtBQUNIOztBQUVEO0FBQ0FwQixjQUFFbUssSUFBRixDQUFPekMsS0FBS2dCLE1BQVosRUFBb0IsVUFBVWpCLEtBQVYsRUFBaUI4RyxLQUFqQixFQUF5QjtBQUN6Q3ZPLGtCQUFFRyxRQUFGLENBQVdzUCxJQUFYLENBQWlCbEIsTUFBTVUsTUFBdkI7QUFDSCxhQUZEOztBQUlBO0FBQ0F4SyxvQkFBUXdLLE1BQVIsQ0FBZU0sV0FBZixDQUE0QiwrQ0FBNUIsRUFBOEVqRyxRQUE5RSxDQUF3Rix5QkFBeEY7O0FBRUE7QUFDQSxnQkFBSzdFLFFBQVF5SyxPQUFiLEVBQXVCO0FBQ25CViw4QkFBY2tCLEtBQUtDLEtBQUwsQ0FBWWxMLFFBQVF3SyxNQUFSLENBQWVXLEtBQWYsRUFBWixDQUFkOztBQUVBNVAsa0JBQUVtSyxJQUFGLENBQU96QyxLQUFLZ0IsTUFBWixFQUFvQixVQUFVakIsS0FBVixFQUFpQjhHLEtBQWpCLEVBQXlCO0FBQ3pDLHdCQUFJRCxNQUFNQyxNQUFNRCxHQUFOLEdBQVk3SixRQUFRNkosR0FBOUI7O0FBRUF0TyxzQkFBRUcsUUFBRixDQUFXMFAsT0FBWCxDQUFvQnRCLE1BQU1VLE1BQTFCLEVBQWtDO0FBQzlCRyw2QkFBTyxDQUR1QjtBQUU5QkQsOEJBQVNiLE1BQU1FLFdBQVIsR0FBMEJGLE1BQU1DLE1BQU0vRyxJQUFOLENBQVcvRztBQUZwQixxQkFBbEMsRUFHRzROLFFBSEgsRUFHYSxZQUFXOztBQUVwQkUsOEJBQU1VLE1BQU4sQ0FBYWEsVUFBYixDQUF3QixPQUF4QixFQUFpQ1AsV0FBakMsQ0FBOEMsK0NBQTlDOztBQUVBLDRCQUFLaEIsTUFBTUQsR0FBTixLQUFjNUcsS0FBS1UsT0FBeEIsRUFBa0M7QUFDOUIzRCxvQ0FBUXlLLE9BQVIsR0FBa0IsS0FBbEI7O0FBRUF4SCxpQ0FBS3FJLFFBQUw7QUFDSDtBQUNKLHFCQVpEO0FBYUgsaUJBaEJEO0FBa0JILGFBckJELE1BcUJPO0FBQ0hySSxxQkFBSzZDLEtBQUwsQ0FBV3lDLEtBQVgsQ0FBaUJnRCxRQUFqQixHQUE0QkYsVUFBNUIsQ0FBd0MsT0FBeEM7QUFDSDs7QUFFRDtBQUNBOztBQUVBLGdCQUFLckwsUUFBUXdMLFFBQWIsRUFBd0I7QUFDcEJ2SSxxQkFBS3dJLGFBQUwsQ0FBb0J6TCxPQUFwQjtBQUVILGFBSEQsTUFHTztBQUNIaUQscUJBQUs4SCxTQUFMLENBQWdCL0ssT0FBaEI7QUFDSDs7QUFFRGlELGlCQUFLdEcsT0FBTDs7QUFFQSxnQkFBS3VMLFNBQVMyQixHQUFULEtBQWlCN0osUUFBUTZKLEdBQTlCLEVBQW9DO0FBQ2hDO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQUksOEJBQWtCLHNCQUF1Qi9CLFNBQVMyQixHQUFULEdBQWU3SixRQUFRNkosR0FBdkIsR0FBNkIsTUFBN0IsR0FBc0MsVUFBN0QsQ0FBbEI7O0FBRUEzQixxQkFBU3NDLE1BQVQsQ0FBZ0JNLFdBQWhCLENBQTZCLGdHQUE3Qjs7QUFFQTVDLHFCQUFTd0QsVUFBVCxHQUFzQixLQUF0Qjs7QUFFQSxnQkFBSyxDQUFDOUIsUUFBRCxJQUFlLENBQUM1SixRQUFReUssT0FBVCxJQUFvQixDQUFDekssUUFBUStDLElBQVIsQ0FBYXZGLGdCQUF0RCxFQUEyRTtBQUN2RTtBQUNIOztBQUVELGdCQUFLd0MsUUFBUXlLLE9BQWIsRUFBdUI7QUFDbkJ2Qyx5QkFBU3NDLE1BQVQsQ0FBZ0IzRixRQUFoQixDQUEwQm9GLGVBQTFCO0FBRUgsYUFIRCxNQUdPOztBQUVIQSxrQ0FBa0IsdUJBQXVCQSxlQUF2QixHQUF5QyxlQUF6QyxHQUEyRGpLLFFBQVErQyxJQUFSLENBQWF2RixnQkFBMUY7O0FBRUFqQyxrQkFBRUcsUUFBRixDQUFXMFAsT0FBWCxDQUFvQmxELFNBQVNzQyxNQUE3QixFQUFxQ1AsZUFBckMsRUFBc0RMLFFBQXRELEVBQWdFLFlBQVc7QUFDdkUxQiw2QkFBU3NDLE1BQVQsQ0FBZ0JNLFdBQWhCLENBQTZCYixlQUE3QixFQUErQ29CLFVBQS9DLENBQTJELE9BQTNEO0FBQ0gsaUJBRkQ7QUFJSDtBQUVKLFNBL3BCd0I7O0FBa3FCekI7QUFDQTtBQUNBOztBQUVBaEIscUJBQWMscUJBQVVSLEdBQVYsRUFBZ0I7O0FBRTFCLGdCQUFJNUcsT0FBTyxJQUFYO0FBQ0EsZ0JBQUl1SCxNQUFKO0FBQ0EsZ0JBQUl4SCxLQUFKOztBQUVBQSxvQkFBUTZHLE1BQU01RyxLQUFLSyxLQUFMLENBQVdYLE1BQXpCO0FBQ0FLLG9CQUFRQSxRQUFRLENBQVIsR0FBWUMsS0FBS0ssS0FBTCxDQUFXWCxNQUFYLEdBQW9CSyxLQUFoQyxHQUF3Q0EsS0FBaEQ7O0FBRUEsZ0JBQUssQ0FBQ0MsS0FBS2dCLE1BQUwsQ0FBYTRGLEdBQWIsQ0FBRCxJQUF1QjVHLEtBQUtLLEtBQUwsQ0FBWU4sS0FBWixDQUE1QixFQUFrRDtBQUM5Q3dILHlCQUFTalAsRUFBRSxvQ0FBRixFQUF3QzhKLFFBQXhDLENBQWtEcEMsS0FBSzZDLEtBQUwsQ0FBV3lDLEtBQTdELENBQVQ7O0FBRUF0RixxQkFBS2dCLE1BQUwsQ0FBYTRGLEdBQWIsSUFBcUJ0TyxFQUFFMkgsTUFBRixDQUFVLElBQVYsRUFBZ0IsRUFBaEIsRUFBb0JELEtBQUtLLEtBQUwsQ0FBWU4sS0FBWixDQUFwQixFQUF5QztBQUMxRDZHLHlCQUFXQSxHQUQrQztBQUUxRFcsNEJBQVdBLE1BRitDO0FBRzFEZ0IsOEJBQVc7QUFIK0MsaUJBQXpDLENBQXJCOztBQU1BdkkscUJBQUswSSxXQUFMLENBQWtCMUksS0FBS2dCLE1BQUwsQ0FBYTRGLEdBQWIsQ0FBbEI7QUFDSDs7QUFFRCxtQkFBTzVHLEtBQUtnQixNQUFMLENBQWE0RixHQUFiLENBQVA7QUFDSCxTQTVyQndCOztBQStyQnpCO0FBQ0E7O0FBRUErQix1QkFBZ0IsdUJBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQmxDLFFBQWhCLEVBQTJCOztBQUV2QyxnQkFBSTNHLE9BQU8sSUFBWDs7QUFFQSxnQkFBSWpELFVBQVVpRCxLQUFLakQsT0FBbkI7QUFDQSxnQkFBSStMLFFBQVUvTCxRQUFRZ00sUUFBdEI7O0FBRUEsZ0JBQUlDLE1BQUosRUFBWUMsSUFBWixFQUFrQkMsSUFBbEIsRUFBd0JDLE1BQXhCLEVBQWdDQyxNQUFoQzs7QUFFQSxnQkFBSXRDLGNBQWV2RyxTQUFVeEQsUUFBUXdLLE1BQVIsQ0FBZVcsS0FBZixFQUFWLEVBQWtDLEVBQWxDLENBQW5CO0FBQ0EsZ0JBQUltQixlQUFlOUksU0FBVXhELFFBQVF3SyxNQUFSLENBQWUrQixNQUFmLEVBQVYsRUFBbUMsRUFBbkMsQ0FBbkI7O0FBRUEsZ0JBQUlDLGNBQWV4TSxRQUFRbUwsS0FBM0I7QUFDQSxnQkFBSXNCLGVBQWV6TSxRQUFRdU0sTUFBM0I7O0FBRUEsZ0JBQUssRUFBR3ZNLFFBQVFFLElBQVIsSUFBZ0IsT0FBaEIsSUFBMkIsQ0FBQ0YsUUFBUTBNLFFBQXZDLEtBQW9ELENBQUNYLEtBQXJELElBQThEOUksS0FBS21ILFdBQXhFLEVBQXNGO0FBQ2xGO0FBQ0g7O0FBRUQ3TyxjQUFFRyxRQUFGLENBQVdzUCxJQUFYLENBQWlCZSxLQUFqQjs7QUFFQTlJLGlCQUFLbUgsV0FBTCxHQUFtQixJQUFuQjs7QUFFQXlCLGdCQUFJQSxNQUFNclEsU0FBTixHQUFrQnVPLGNBQWUsR0FBakMsR0FBd0M4QixDQUE1QztBQUNBQyxnQkFBSUEsTUFBTXRRLFNBQU4sR0FBa0I4USxlQUFlLEdBQWpDLEdBQXdDUixDQUE1Qzs7QUFFQUcscUJBQVMxUSxFQUFFRyxRQUFGLENBQVc2TyxZQUFYLENBQXlCd0IsS0FBekIsQ0FBVDs7QUFFQUsscUJBQVVJLGNBQWVQLE9BQU9kLEtBQWhDO0FBQ0FrQixxQkFBVUksZUFBZVIsT0FBT00sTUFBaEM7O0FBRUE7QUFDQUwsbUJBQVNuQyxjQUFjLEdBQWQsR0FBcUJ5QyxjQUFjLEdBQTVDO0FBQ0FMLG1CQUFTRyxlQUFlLEdBQWYsR0FBcUJHLGVBQWUsR0FBN0M7O0FBRUE7QUFDQSxnQkFBS0QsY0FBY3pDLFdBQW5CLEVBQWlDO0FBQzdCbUMsdUJBQU9ELE9BQU92QixJQUFQLEdBQWMwQixNQUFkLElBQTJCUCxJQUFJTyxNQUFOLEdBQWlCUCxDQUExQyxDQUFQOztBQUVBLG9CQUFLSyxPQUFPLENBQVosRUFBZ0I7QUFDWkEsMkJBQU8sQ0FBUDtBQUNIOztBQUVELG9CQUFLQSxPQUFRbkMsY0FBY3lDLFdBQTNCLEVBQXlDO0FBQ3JDTiwyQkFBT25DLGNBQWN5QyxXQUFyQjtBQUNIO0FBQ0o7O0FBRUQsZ0JBQUtDLGVBQWVILFlBQXBCLEVBQWtDO0FBQzlCSCx1QkFBT0YsT0FBT3RCLEdBQVAsR0FBYzBCLE1BQWQsSUFBMkJQLElBQUlPLE1BQU4sR0FBaUJQLENBQTFDLENBQVA7O0FBRUEsb0JBQUtLLE9BQU8sQ0FBWixFQUFnQjtBQUNaQSwyQkFBTyxDQUFQO0FBQ0g7O0FBRUQsb0JBQUtBLE9BQVFHLGVBQWVHLFlBQTVCLEVBQTJDO0FBQ3ZDTiwyQkFBT0csZUFBZUcsWUFBdEI7QUFDSDtBQUNKOztBQUVEeEosaUJBQUswSixZQUFMLENBQW1CSCxXQUFuQixFQUFnQ0MsWUFBaEM7O0FBRUFsUixjQUFFRyxRQUFGLENBQVcwUCxPQUFYLENBQW9CVyxLQUFwQixFQUEyQjtBQUN2QnBCLHFCQUFTd0IsSUFEYztBQUV2QnpCLHNCQUFTd0IsSUFGYztBQUd2QkUsd0JBQVNBLE1BSGM7QUFJdkJDLHdCQUFTQTtBQUpjLGFBQTNCLEVBS0d6QyxZQUFZLEdBTGYsRUFLb0IsWUFBVztBQUMzQjNHLHFCQUFLbUgsV0FBTCxHQUFtQixLQUFuQjtBQUNILGFBUEQ7O0FBU0E7QUFDQSxnQkFBS25ILEtBQUsySixTQUFMLElBQWtCM0osS0FBSzJKLFNBQUwsQ0FBZUMsUUFBdEMsRUFBaUQ7QUFDN0M1SixxQkFBSzJKLFNBQUwsQ0FBZTVCLElBQWY7QUFDSDtBQUNKLFNBN3dCd0I7O0FBZ3hCekI7QUFDQTs7QUFFQThCLG9CQUFhLG9CQUFVbEQsUUFBVixFQUFxQjs7QUFFOUIsZ0JBQUkzRyxPQUFPLElBQVg7O0FBRUEsZ0JBQUlqRCxVQUFVaUQsS0FBS2pELE9BQW5CO0FBQ0EsZ0JBQUkrTCxRQUFVL0wsUUFBUWdNLFFBQXRCO0FBQ0EsZ0JBQUllLEdBQUo7O0FBRUEsZ0JBQUssRUFBRy9NLFFBQVFFLElBQVIsSUFBZ0IsT0FBaEIsSUFBMkIsQ0FBQ0YsUUFBUTBNLFFBQXZDLEtBQW9ELENBQUNYLEtBQXJELElBQThEOUksS0FBS21ILFdBQXhFLEVBQXNGO0FBQ2xGO0FBQ0g7O0FBRUQ3TyxjQUFFRyxRQUFGLENBQVdzUCxJQUFYLENBQWlCZSxLQUFqQjs7QUFFQTlJLGlCQUFLbUgsV0FBTCxHQUFtQixJQUFuQjs7QUFFQTJDLGtCQUFNOUosS0FBSytKLFNBQUwsQ0FBZ0JoTixPQUFoQixDQUFOOztBQUVBaUQsaUJBQUswSixZQUFMLENBQW1CSSxJQUFJNUIsS0FBdkIsRUFBOEI0QixJQUFJUixNQUFsQzs7QUFFQWhSLGNBQUVHLFFBQUYsQ0FBVzBQLE9BQVgsQ0FBb0JXLEtBQXBCLEVBQTJCO0FBQ3ZCcEIscUJBQVNvQyxJQUFJcEMsR0FEVTtBQUV2QkQsc0JBQVNxQyxJQUFJckMsSUFGVTtBQUd2QjBCLHdCQUFTVyxJQUFJNUIsS0FBSixHQUFhWSxNQUFNWixLQUFOLEVBSEM7QUFJdkJrQix3QkFBU1UsSUFBSVIsTUFBSixHQUFhUixNQUFNUSxNQUFOO0FBSkMsYUFBM0IsRUFLRzNDLFlBQVksR0FMZixFQUtvQixZQUFXO0FBQzNCM0cscUJBQUttSCxXQUFMLEdBQW1CLEtBQW5CO0FBQ0gsYUFQRDtBQVNILFNBaHpCd0I7O0FBa3pCekI7QUFDQTs7QUFFQTRDLG1CQUFZLG1CQUFVbEQsS0FBVixFQUFrQjtBQUMxQixnQkFBSTdHLE9BQVEsSUFBWjtBQUNBLGdCQUFJOEksUUFBUWpDLE1BQU1rQyxRQUFsQjs7QUFFQSxnQkFBSWlCLFdBQVluRCxNQUFNcUIsS0FBdEI7QUFDQSxnQkFBSStCLFlBQVlwRCxNQUFNeUMsTUFBdEI7O0FBRUEsZ0JBQUl4USxTQUFTK04sTUFBTS9HLElBQU4sQ0FBV2hILE1BQXhCOztBQUVBLGdCQUFJZ08sV0FBSixFQUFpQnVDLFlBQWpCLEVBQStCYSxRQUEvQixFQUF5Q2hDLEtBQXpDLEVBQWdEb0IsTUFBaEQ7O0FBRUEsZ0JBQUssQ0FBQ1IsS0FBRCxJQUFVLENBQUNBLE1BQU1wSixNQUFqQixJQUE2QixDQUFDc0ssUUFBRCxJQUFhLENBQUNDLFNBQWhELEVBQTZEO0FBQ3pELHVCQUFPLEtBQVA7QUFDSDs7QUFFRDtBQUNBLGdCQUFLM1IsRUFBRTJFLElBQUYsQ0FBUW5FLE1BQVIsTUFBcUIsUUFBMUIsRUFBcUM7QUFDakNBLHlCQUFTLENBQUVBLE1BQUYsRUFBVUEsTUFBVixDQUFUO0FBQ0g7O0FBRUQsZ0JBQUtBLE9BQU80RyxNQUFQLElBQWlCLENBQXRCLEVBQTBCO0FBQ3RCNUcseUJBQVMsQ0FBRUEsT0FBTyxDQUFQLENBQUYsRUFBYUEsT0FBTyxDQUFQLENBQWIsRUFBd0JBLE9BQU8sQ0FBUCxDQUF4QixFQUFtQ0EsT0FBTyxDQUFQLENBQW5DLENBQVQ7QUFDSDs7QUFFRDtBQUNBZ08sMEJBQWV2RyxTQUFVUCxLQUFLNkMsS0FBTCxDQUFXeUMsS0FBWCxDQUFpQjRDLEtBQWpCLEVBQVYsRUFBb0MsRUFBcEMsS0FBOENwUCxPQUFRLENBQVIsSUFBY0EsT0FBUSxDQUFSLENBQTVELENBQWY7QUFDQXVRLDJCQUFlOUksU0FBVVAsS0FBSzZDLEtBQUwsQ0FBV3lDLEtBQVgsQ0FBaUJnRSxNQUFqQixFQUFWLEVBQXFDLEVBQXJDLEtBQThDeFEsT0FBUSxDQUFSLElBQWNBLE9BQVEsQ0FBUixDQUE1RCxDQUFmOztBQUVBb1IsdUJBQVdsQyxLQUFLbUMsR0FBTCxDQUFTLENBQVQsRUFBWXJELGNBQWNrRCxRQUExQixFQUFvQ1gsZUFBZVksU0FBbkQsQ0FBWDs7QUFFQS9CLG9CQUFTRixLQUFLb0MsS0FBTCxDQUFZRixXQUFXRixRQUF2QixDQUFUO0FBQ0FWLHFCQUFTdEIsS0FBS29DLEtBQUwsQ0FBWUYsV0FBV0QsU0FBdkIsQ0FBVDs7QUFFQTtBQUNBLG1CQUFPO0FBQ0h2QyxxQkFBU00sS0FBS29DLEtBQUwsQ0FBWSxDQUFFZixlQUFlQyxNQUFqQixJQUE0QixHQUF4QyxJQUFnRHhRLE9BQVEsQ0FBUixDQUR0RDtBQUVIMk8sc0JBQVNPLEtBQUtvQyxLQUFMLENBQVksQ0FBRXRELGNBQWVvQixLQUFqQixJQUE0QixHQUF4QyxJQUFnRHBQLE9BQVEsQ0FBUixDQUZ0RDtBQUdIb1AsdUJBQVNBLEtBSE47QUFJSG9CLHdCQUFTQTtBQUpOLGFBQVA7QUFPSCxTQTkxQndCOztBQWkyQnpCO0FBQ0E7O0FBRUFqRSxnQkFBUyxrQkFBVzs7QUFFaEIsZ0JBQUlyRixPQUFPLElBQVg7O0FBRUExSCxjQUFFbUssSUFBRixDQUFRekMsS0FBS2dCLE1BQWIsRUFBcUIsVUFBVXFKLEdBQVYsRUFBZXhELEtBQWYsRUFBdUI7QUFDeEM3RyxxQkFBSzBJLFdBQUwsQ0FBa0I3QixLQUFsQjtBQUNILGFBRkQ7QUFJSCxTQTUyQndCOztBQSsyQnpCO0FBQ0E7O0FBRUE2QixxQkFBYyxxQkFBVTdCLEtBQVYsRUFBa0I7O0FBRTVCLGdCQUFJN0csT0FBUSxJQUFaO0FBQ0EsZ0JBQUk4SSxRQUFRakMsTUFBTWtDLFFBQWxCOztBQUVBLGdCQUFLRCxVQUFXakMsTUFBTXFCLEtBQU4sSUFBZXJCLE1BQU15QyxNQUFoQyxDQUFMLEVBQWdEO0FBQzVDdEoscUJBQUttSCxXQUFMLEdBQW1CLEtBQW5COztBQUVBN08sa0JBQUVHLFFBQUYsQ0FBV3NQLElBQVgsQ0FBaUJlLEtBQWpCOztBQUVBeFEsa0JBQUVHLFFBQUYsQ0FBVzZSLFlBQVgsQ0FBeUJ4QixLQUF6QixFQUFnQzlJLEtBQUsrSixTQUFMLENBQWdCbEQsS0FBaEIsQ0FBaEM7O0FBRUEsb0JBQUtBLE1BQU1ELEdBQU4sS0FBYzVHLEtBQUtVLE9BQXhCLEVBQWtDO0FBQzlCVix5QkFBSzBKLFlBQUw7QUFDSDtBQUNKOztBQUVEN0Msa0JBQU1VLE1BQU4sQ0FBYXJFLE9BQWIsQ0FBc0IsU0FBdEI7O0FBRUFsRCxpQkFBS2tELE9BQUwsQ0FBYyxVQUFkLEVBQTBCMkQsS0FBMUI7QUFFSCxTQXY0QndCOztBQXk0QnpCO0FBQ0E7O0FBRUE2QyxzQkFBZSxzQkFBVWEsU0FBVixFQUFxQkMsVUFBckIsRUFBa0M7O0FBRTdDLGdCQUFJeEssT0FBTyxJQUFYO0FBQ0EsZ0JBQUltRixZQUFKOztBQUVBLGdCQUFJNUQsYUFBYXZCLEtBQUs2QyxLQUFMLENBQVdDLFNBQVgsQ0FBcUIrRSxXQUFyQixDQUFrQyxpRkFBbEMsQ0FBakI7O0FBRUEsZ0JBQUssQ0FBQzdILEtBQUtqRCxPQUFOLElBQWlCaUQsS0FBSzBGLFNBQTNCLEVBQXVDO0FBQ25DO0FBQ0g7O0FBRUQsZ0JBQUsxRixLQUFLeUssVUFBTCxFQUFMLEVBQXlCOztBQUVyQmxKLDJCQUFXSyxRQUFYLENBQXFCLHNCQUFyQjs7QUFFQSxvQkFBSzJJLGNBQWNoUyxTQUFkLElBQTJCaVMsZUFBZWpTLFNBQS9DLEVBQTJEO0FBQ3ZENE0sbUNBQWVvRixZQUFZdkssS0FBS2pELE9BQUwsQ0FBYW1MLEtBQXpCLElBQWtDc0MsYUFBYXhLLEtBQUtqRCxPQUFMLENBQWF1TSxNQUEzRTtBQUVILGlCQUhELE1BR087QUFDSG5FLG1DQUFlbkYsS0FBS21GLFlBQUwsRUFBZjtBQUNIOztBQUVELG9CQUFLQSxZQUFMLEVBQW9COztBQUVoQjtBQUNBNUQsK0JBQVdLLFFBQVgsQ0FBcUIscUJBQXJCO0FBRUgsaUJBTEQsTUFLTzs7QUFFSCx3QkFBSzVCLEtBQUtqRCxPQUFMLENBQWErQyxJQUFiLENBQWtCcEUsS0FBdkIsRUFBK0I7O0FBRTNCO0FBQ0E7QUFDQTZGLG1DQUFXSyxRQUFYLENBQXFCLG1CQUFyQjtBQUVILHFCQU5ELE1BTU87QUFDSEwsbUNBQVdLLFFBQVgsQ0FBcUIsc0JBQXJCO0FBQ0g7QUFFSjtBQUVKLGFBOUJELE1BOEJPLElBQUs1QixLQUFLakQsT0FBTCxDQUFhK0MsSUFBYixDQUFrQnBFLEtBQXZCLEVBQStCO0FBQ2xDNkYsMkJBQVdLLFFBQVgsQ0FBcUIsbUJBQXJCO0FBQ0g7QUFFSixTQXo3QndCOztBQTQ3QnpCO0FBQ0E7O0FBRUE2SSxvQkFBYSxzQkFBVzs7QUFFcEIsZ0JBQUl6SyxPQUFPLElBQVg7O0FBRUEsZ0JBQUlqRCxVQUFVaUQsS0FBS2pELE9BQW5CO0FBQ0EsZ0JBQUkyTixNQUFKOztBQUVBLGdCQUFLLENBQUMzTixPQUFELElBQVlpRCxLQUFLMEYsU0FBdEIsRUFBa0M7QUFDOUI7QUFDSDs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFLM0ksUUFBUUUsSUFBUixLQUFpQixPQUFqQixJQUE0QkYsUUFBUXdMLFFBQXBDLElBQWdELENBQUN4TCxRQUFRME0sUUFBekQsS0FDQzFNLFFBQVErQyxJQUFSLENBQWFoRCxZQUFiLEtBQThCLE1BQTlCLElBQTBDeEUsRUFBRXFTLFVBQUYsQ0FBYzVOLFFBQVErQyxJQUFSLENBQWFoRCxZQUEzQixLQUE2Q0MsUUFBUStDLElBQVIsQ0FBYWhELFlBQWIsQ0FBMkJDLE9BQTNCLE1BQTBDLE1BRGxJLENBQUwsRUFFRTs7QUFFRTJOLHlCQUFTMUssS0FBSytKLFNBQUwsQ0FBZ0JoTixPQUFoQixDQUFUOztBQUVBLG9CQUFLQSxRQUFRbUwsS0FBUixHQUFnQndDLE9BQU94QyxLQUF2QixJQUFnQ25MLFFBQVF1TSxNQUFSLEdBQWlCb0IsT0FBT3BCLE1BQTdELEVBQXNFO0FBQ2xFLDJCQUFPLElBQVA7QUFDSDtBQUVKOztBQUVELG1CQUFPLEtBQVA7QUFFSCxTQTU5QndCOztBQSs5QnpCO0FBQ0E7O0FBRUFuRSxzQkFBZSx3QkFBVzs7QUFFdEIsZ0JBQUluRixPQUFPLElBQVg7O0FBRUEsZ0JBQUlqRCxVQUFVaUQsS0FBS2pELE9BQW5CO0FBQ0EsZ0JBQUkrTCxRQUFVL0wsUUFBUWdNLFFBQXRCOztBQUVBLGdCQUFJNkIsTUFBTSxLQUFWOztBQUVBLGdCQUFLOUIsS0FBTCxFQUFhO0FBQ1Q4QixzQkFBTXRTLEVBQUVHLFFBQUYsQ0FBVzZPLFlBQVgsQ0FBeUJ3QixLQUF6QixDQUFOO0FBQ0E4QixzQkFBTUEsSUFBSTFDLEtBQUosR0FBWW5MLFFBQVFtTCxLQUFwQixJQUE2QjBDLElBQUl0QixNQUFKLEdBQWF2TSxRQUFRdU0sTUFBeEQ7QUFDSDs7QUFFRCxtQkFBT3NCLEdBQVA7QUFFSCxTQWwvQndCOztBQXEvQnpCO0FBQ0E7O0FBRUFDLGdCQUFTLGtCQUFXOztBQUVoQixnQkFBSTdLLE9BQU8sSUFBWDs7QUFFQSxnQkFBSWpELFVBQVVpRCxLQUFLakQsT0FBbkI7QUFDQSxnQkFBSStMLFFBQVUvTCxRQUFRZ00sUUFBdEI7O0FBRUEsZ0JBQUk2QixNQUFNLEtBQVY7O0FBRUEsZ0JBQUs5QixLQUFMLEVBQWE7QUFDVDhCLHNCQUFNNUssS0FBSytKLFNBQUwsQ0FBZ0JoTixPQUFoQixDQUFOO0FBQ0E2TixzQkFBTTVDLEtBQUs4QyxHQUFMLENBQVVoQyxNQUFNWixLQUFOLEtBQWdCMEMsSUFBSTFDLEtBQTlCLElBQXdDLENBQXhDLElBQThDRixLQUFLOEMsR0FBTCxDQUFVaEMsTUFBTVEsTUFBTixLQUFpQnNCLElBQUl0QixNQUEvQixJQUEwQyxDQUE5RjtBQUVIOztBQUVELG1CQUFPc0IsR0FBUDtBQUVILFNBemdDd0I7O0FBNGdDekI7QUFDQTs7QUFFQTlDLG1CQUFZLG1CQUFVakIsS0FBVixFQUFrQjs7QUFFMUIsZ0JBQUk3RyxPQUFPLElBQVg7QUFBQSxnQkFBaUIvQyxJQUFqQjtBQUFBLGdCQUF1QnNLLE1BQXZCO0FBQ0EsZ0JBQUl3RCxRQUFKOztBQUVBLGdCQUFLbEUsTUFBTW1FLFNBQVgsRUFBdUI7QUFDbkI7QUFDSDs7QUFFRCxnQkFBS25FLE1BQU0wQixRQUFYLEVBQXNCO0FBQ2xCO0FBQ0g7O0FBRUQxQixrQkFBTW1FLFNBQU4sR0FBa0IsSUFBbEI7O0FBRUFoTCxpQkFBS2tELE9BQUwsQ0FBYyxZQUFkLEVBQTRCMkQsS0FBNUI7O0FBRUE1SixtQkFBUzRKLE1BQU01SixJQUFmO0FBQ0FzSyxxQkFBU1YsTUFBTVUsTUFBZjs7QUFFQUEsbUJBQ0tkLEdBREwsQ0FDVSxTQURWLEVBRUt2RCxPQUZMLENBRWMsU0FGZCxFQUdLdEIsUUFITCxDQUdlLHNCQUF1QjNFLFFBQVEsU0FBL0IsQ0FIZixFQUlLMkUsUUFKTCxDQUllaUYsTUFBTS9HLElBQU4sQ0FBV3JGLFVBSjFCOztBQU1BOztBQUVBLG9CQUFTd0MsSUFBVDs7QUFFSSxxQkFBSyxPQUFMOztBQUVJK0MseUJBQUtpTCxRQUFMLENBQWVwRSxLQUFmOztBQUVKOztBQUVBLHFCQUFLLFFBQUw7O0FBRUk3Ryx5QkFBS2tMLFNBQUwsQ0FBZ0JyRSxLQUFoQjs7QUFFSjs7QUFFQSxxQkFBSyxNQUFMOztBQUVJN0cseUJBQUttTCxVQUFMLENBQWlCdEUsS0FBakIsRUFBd0JBLE1BQU1oRCxHQUFOLElBQWFnRCxNQUFNaEgsT0FBM0M7O0FBRUo7O0FBRUEscUJBQUssUUFBTDs7QUFFSSx3QkFBS3ZILEVBQUd1TyxNQUFNaEQsR0FBVCxFQUFlbkUsTUFBcEIsRUFBNkI7QUFDekJNLDZCQUFLbUwsVUFBTCxDQUFpQnRFLEtBQWpCLEVBQXdCdk8sRUFBR3VPLE1BQU1oRCxHQUFULENBQXhCO0FBRUgscUJBSEQsTUFHTztBQUNIN0QsNkJBQUtvTCxRQUFMLENBQWV2RSxLQUFmO0FBQ0g7O0FBRUw7O0FBRUEscUJBQUssTUFBTDs7QUFFSTdHLHlCQUFLcUwsV0FBTCxDQUFrQnhFLEtBQWxCOztBQUVBa0UsK0JBQVd6UyxFQUFFcUIsSUFBRixDQUFRckIsRUFBRTJILE1BQUYsQ0FBVSxFQUFWLEVBQWM0RyxNQUFNL0csSUFBTixDQUFXbkcsSUFBWCxDQUFnQkMsUUFBOUIsRUFBd0M7QUFDdkQwUiw2QkFBTXpFLE1BQU1oRCxHQUQyQztBQUV2RDBILGlDQUFVLGlCQUFXMVIsSUFBWCxFQUFpQjJSLFVBQWpCLEVBQThCOztBQUVwQyxnQ0FBS0EsZUFBZSxTQUFwQixFQUFnQztBQUM1QnhMLHFDQUFLbUwsVUFBTCxDQUFpQnRFLEtBQWpCLEVBQXdCaE4sSUFBeEI7QUFDSDtBQUVKLHlCQVJzRDtBQVN2RDRSLCtCQUFRLGVBQVdDLEtBQVgsRUFBa0JGLFVBQWxCLEVBQStCOztBQUVuQyxnQ0FBS0UsU0FBU0YsZUFBZSxPQUE3QixFQUF1QztBQUNuQ3hMLHFDQUFLb0wsUUFBTCxDQUFldkUsS0FBZjtBQUNIO0FBRUo7QUFmc0QscUJBQXhDLENBQVIsQ0FBWDs7QUFrQkFVLDJCQUFPb0UsR0FBUCxDQUFZLFNBQVosRUFBdUIsWUFBWTtBQUMvQlosaUNBQVNhLEtBQVQ7QUFDSCxxQkFGRDs7QUFJSjs7QUFFQTs7QUFFSTVMLHlCQUFLb0wsUUFBTCxDQUFldkUsS0FBZjs7QUFFSjs7QUEvREo7O0FBbUVBLG1CQUFPLElBQVA7QUFFSCxTQWhuQ3dCOztBQW1uQ3pCO0FBQ0E7O0FBRUFvRSxrQkFBVyxrQkFBVXBFLEtBQVYsRUFBa0I7O0FBRXpCLGdCQUFJN0csT0FBUyxJQUFiO0FBQ0EsZ0JBQUk2TCxTQUFTaEYsTUFBTS9HLElBQU4sQ0FBVytMLE1BQVgsSUFBcUJoRixNQUFNL0csSUFBTixDQUFXckcsS0FBWCxDQUFpQm9TLE1BQW5EOztBQUVBLGdCQUFJQyxLQUFKLEVBQVdDLElBQVgsRUFBaUJDLE9BQWpCLEVBQTBCQyxXQUExQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBS0osTUFBTCxFQUFjO0FBQ1ZHLDBCQUFjNVQsT0FBTzhULGdCQUFQLElBQTJCLENBQXpDO0FBQ0FELDhCQUFjN1QsT0FBTytULFVBQVAsR0FBcUJILE9BQW5DOztBQUVBRCx1QkFBT0YsT0FBT3ZILEtBQVAsQ0FBYSxHQUFiLEVBQWtCOEgsR0FBbEIsQ0FBc0IsVUFBV2hOLEVBQVgsRUFBZ0I7QUFDL0Msd0JBQUlpTixNQUFNLEVBQVY7O0FBRUFqTix1QkFBR2tOLElBQUgsR0FBVWhJLEtBQVYsQ0FBZ0IsS0FBaEIsRUFBdUJ2QixPQUF2QixDQUErQixVQUFXM0QsRUFBWCxFQUFldUUsQ0FBZixFQUFtQjtBQUN4Qyw0QkFBSWpCLFFBQVFuQyxTQUFVbkIsR0FBR21OLFNBQUgsQ0FBYSxDQUFiLEVBQWdCbk4sR0FBR00sTUFBSCxHQUFZLENBQTVCLENBQVYsRUFBMEMsRUFBMUMsQ0FBWjs7QUFFVCw0QkFBS2lFLE1BQU0sQ0FBWCxFQUFlO0FBQ2QsbUNBQVMwSSxJQUFJZixHQUFKLEdBQVVsTSxFQUFuQjtBQUNBOztBQUVRLDRCQUFLc0QsS0FBTCxFQUFhO0FBQ1QySixnQ0FBSTNKLEtBQUosR0FBY0EsS0FBZDtBQUNBMkosZ0NBQUlHLE9BQUosR0FBY3BOLEdBQUlBLEdBQUdNLE1BQUgsR0FBWSxDQUFoQixDQUFkO0FBQ0g7QUFFVixxQkFaRDs7QUFjQSwyQkFBTzJNLEdBQVA7QUFDQSxpQkFsQlMsQ0FBUDs7QUFvQkE7QUFDQU4scUJBQUtVLElBQUwsQ0FBVSxVQUFVQyxDQUFWLEVBQWFDLENBQWIsRUFBZ0I7QUFDeEIsMkJBQU9ELEVBQUVoSyxLQUFGLEdBQVVpSyxFQUFFakssS0FBbkI7QUFDRCxpQkFGRDs7QUFJQTtBQUNBLHFCQUFNLElBQUlrSyxJQUFJLENBQWQsRUFBaUJBLElBQUliLEtBQUtyTSxNQUExQixFQUFrQ2tOLEdBQWxDLEVBQXdDO0FBQ3BDLHdCQUFJeE4sS0FBSzJNLEtBQU1hLENBQU4sQ0FBVDs7QUFFQSx3QkFBT3hOLEdBQUdvTixPQUFILEtBQWUsR0FBZixJQUFzQnBOLEdBQUdzRCxLQUFILElBQVl1SixXQUFwQyxJQUF1RDdNLEdBQUdvTixPQUFILEtBQWUsR0FBZixJQUFzQnBOLEdBQUdzRCxLQUFILElBQVlzSixPQUE5RixFQUEwRztBQUN0R0YsZ0NBQVExTSxFQUFSO0FBQ0E7QUFDSDtBQUNKOztBQUVEO0FBQ0Esb0JBQUssQ0FBQzBNLEtBQUQsSUFBVUMsS0FBS3JNLE1BQXBCLEVBQTZCO0FBQ3pCb00sNEJBQVFDLEtBQU1BLEtBQUtyTSxNQUFMLEdBQWMsQ0FBcEIsQ0FBUjtBQUNIOztBQUVELG9CQUFLb00sS0FBTCxFQUFhO0FBQ1RqRiwwQkFBTWhELEdBQU4sR0FBWWlJLE1BQU1SLEdBQWxCOztBQUVBO0FBQ0Esd0JBQUt6RSxNQUFNcUIsS0FBTixJQUFlckIsTUFBTXlDLE1BQXJCLElBQStCd0MsTUFBTVUsT0FBTixJQUFpQixHQUFyRCxFQUEyRDtBQUN2RDNGLDhCQUFNeUMsTUFBTixHQUFpQnpDLE1BQU1xQixLQUFOLEdBQWNyQixNQUFNeUMsTUFBdEIsR0FBaUN3QyxNQUFNcEosS0FBdEQ7QUFDQW1FLDhCQUFNcUIsS0FBTixHQUFlNEQsTUFBTXBKLEtBQXJCO0FBQ0g7QUFDSjtBQUNKOztBQUVEO0FBQ0FtRSxrQkFBTWtDLFFBQU4sR0FBaUJ6USxFQUFFLHlDQUFGLEVBQ1pzSixRQURZLENBQ0Ysb0JBREUsRUFFWlEsUUFGWSxDQUVGeUUsTUFBTVUsTUFGSixDQUFqQjs7QUFLQTtBQUNBO0FBQ0EsZ0JBQUtWLE1BQU0vRyxJQUFOLENBQVdwRyxPQUFYLEtBQXVCLEtBQXZCLElBQWdDbU4sTUFBTS9HLElBQU4sQ0FBV29JLEtBQTNDLElBQW9EckIsTUFBTS9HLElBQU4sQ0FBV3dKLE1BQS9ELEtBQTJFekMsTUFBTS9HLElBQU4sQ0FBVytNLEtBQVgsSUFBb0JoRyxNQUFNL0csSUFBTixDQUFXcUUsTUFBMUcsQ0FBTCxFQUEwSDs7QUFFdEgwQyxzQkFBTXFCLEtBQU4sR0FBZXJCLE1BQU0vRyxJQUFOLENBQVdvSSxLQUExQjtBQUNBckIsc0JBQU15QyxNQUFOLEdBQWV6QyxNQUFNL0csSUFBTixDQUFXd0osTUFBMUI7O0FBRUF6QyxzQkFBTWlHLE1BQU4sR0FBZXhVLEVBQUUsU0FBRixFQUNWcVQsR0FEVSxDQUNOLE9BRE0sRUFDRyxZQUFXOztBQUVyQnJULHNCQUFFLElBQUYsRUFBUWlLLE1BQVI7O0FBRUFzRSwwQkFBTWlHLE1BQU4sR0FBZSxJQUFmOztBQUVBOU0seUJBQUsrTSxXQUFMLENBQWtCbEcsS0FBbEI7QUFFSCxpQkFUVSxFQVVWOEUsR0FWVSxDQVVOLE1BVk0sRUFVRSxZQUFXOztBQUVwQjNMLHlCQUFLekQsU0FBTCxDQUFnQnNLLEtBQWhCOztBQUVBN0cseUJBQUsrTSxXQUFMLENBQWtCbEcsS0FBbEI7QUFFSCxpQkFoQlUsRUFpQlZqRixRQWpCVSxDQWlCQSxnQkFqQkEsRUFrQlZRLFFBbEJVLENBa0JBeUUsTUFBTWtDLFFBbEJOLEVBbUJWOU8sSUFuQlUsQ0FtQkosS0FuQkksRUFtQkc0TSxNQUFNL0csSUFBTixDQUFXK00sS0FBWCxJQUFvQmhHLE1BQU0vRyxJQUFOLENBQVdxRSxNQUFYLENBQWtCbEssSUFBbEIsQ0FBd0IsS0FBeEIsQ0FuQnZCLENBQWY7QUFxQkgsYUExQkQsTUEwQk87O0FBRUgrRixxQkFBSytNLFdBQUwsQ0FBa0JsRyxLQUFsQjtBQUVIO0FBRUosU0EvdEN3Qjs7QUFrdUN6QjtBQUNBOztBQUVBa0cscUJBQWMscUJBQVdsRyxLQUFYLEVBQW1CO0FBQzdCLGdCQUFJN0csT0FBTyxJQUFYO0FBQ0EsZ0JBQUlnTixPQUFPMVUsRUFBRSxTQUFGLENBQVg7O0FBRUF1TyxrQkFBTW9HLE1BQU4sR0FBZUQsS0FDVnJCLEdBRFUsQ0FDTixPQURNLEVBQ0csWUFBVzs7QUFFckIzTCxxQkFBS29MLFFBQUwsQ0FBZXZFLEtBQWY7QUFFSCxhQUxVLEVBTVY4RSxHQU5VLENBTU4sTUFOTSxFQU1FLFlBQVc7O0FBRXBCO0FBQ0F1Qiw2QkFBY3JHLE1BQU1zRyxPQUFwQjs7QUFFQXRHLHNCQUFNc0csT0FBTixHQUFnQixJQUFoQjs7QUFFQSxvQkFBS25OLEtBQUswRixTQUFWLEVBQXNCO0FBQ2xCO0FBQ0g7O0FBRURtQixzQkFBTXFCLEtBQU4sR0FBZSxLQUFLa0YsWUFBcEI7QUFDQXZHLHNCQUFNeUMsTUFBTixHQUFlLEtBQUsrRCxhQUFwQjs7QUFFQSxvQkFBS3hHLE1BQU0vRyxJQUFOLENBQVdyRyxLQUFYLENBQWlCb1MsTUFBdEIsRUFBK0I7QUFDM0JtQix5QkFBSy9TLElBQUwsQ0FBVyxPQUFYLEVBQW9CLE9BQXBCLEVBQThCQSxJQUE5QixDQUFvQyxRQUFwQyxFQUE4QzRNLE1BQU0vRyxJQUFOLENBQVdyRyxLQUFYLENBQWlCb1MsTUFBL0Q7QUFDSDs7QUFFRDdMLHFCQUFLc04sV0FBTCxDQUFrQnpHLEtBQWxCOztBQUVBLG9CQUFLQSxNQUFNaUcsTUFBWCxFQUFvQjs7QUFFaEJqRywwQkFBTXNHLE9BQU4sR0FBZ0JsTyxXQUFXLFlBQVc7QUFDbEM0SCw4QkFBTXNHLE9BQU4sR0FBZ0IsSUFBaEI7O0FBRUF0Ryw4QkFBTWlHLE1BQU4sQ0FBYXZILElBQWI7QUFFSCxxQkFMZSxFQUtieUMsS0FBS21DLEdBQUwsQ0FBVSxHQUFWLEVBQWVuQyxLQUFLdUYsR0FBTCxDQUFVLElBQVYsRUFBZ0IxRyxNQUFNeUMsTUFBTixHQUFlLElBQS9CLENBQWYsQ0FMYSxDQUFoQjtBQU9ILGlCQVRELE1BU087QUFDSHRKLHlCQUFLekQsU0FBTCxDQUFnQnNLLEtBQWhCO0FBQ0g7QUFFSixhQXZDVSxFQXdDVmpGLFFBeENVLENBd0NBLGdCQXhDQSxFQXlDVjNILElBekNVLENBeUNMLEtBekNLLEVBeUNFNE0sTUFBTWhELEdBekNSLEVBMENWekIsUUExQ1UsQ0EwQ0F5RSxNQUFNa0MsUUExQ04sQ0FBZjs7QUE0Q0EsZ0JBQUssQ0FBRWlFLEtBQUssQ0FBTCxFQUFRM0UsUUFBUixJQUFvQjJFLEtBQUssQ0FBTCxFQUFRUSxVQUFSLElBQXNCLFVBQTVDLEtBQTREUixLQUFLLENBQUwsRUFBUUksWUFBcEUsSUFBb0ZKLEtBQUssQ0FBTCxFQUFRSyxhQUFqRyxFQUFpSDtBQUMzR0wscUJBQUs5SixPQUFMLENBQWMsTUFBZDtBQUVMLGFBSEQsTUFHTyxJQUFJOEosS0FBSyxDQUFMLEVBQVF2QixLQUFaLEVBQW9CO0FBQ3RCdUIscUJBQUs5SixPQUFMLENBQWMsT0FBZDtBQUVKLGFBSE0sTUFHQTs7QUFFSDJELHNCQUFNc0csT0FBTixHQUFnQmxPLFdBQVcsWUFBVztBQUNsQyx3QkFBSyxDQUFDK04sS0FBSyxDQUFMLEVBQVEzRSxRQUFULElBQXFCLENBQUN4QixNQUFNNEMsUUFBakMsRUFBNEM7QUFDeEN6Siw2QkFBS3FMLFdBQUwsQ0FBa0J4RSxLQUFsQjtBQUNIO0FBRUosaUJBTGUsRUFLYixHQUxhLENBQWhCO0FBT0g7QUFFSixTQXR5Q3dCOztBQXl5Q3pCO0FBQ0E7O0FBRUFxRSxtQkFBWSxtQkFBVXJFLEtBQVYsRUFBa0I7QUFDMUIsZ0JBQUk3RyxPQUFPLElBQVg7QUFBQSxnQkFDSUYsT0FBVStHLE1BQU0vRyxJQUFOLENBQVdoRyxNQUR6QjtBQUFBLGdCQUVJeU4sU0FBU1YsTUFBTVUsTUFGbkI7QUFBQSxnQkFHSWtHLE9BSEo7O0FBS0E1RyxrQkFBTWtDLFFBQU4sR0FBaUJ6USxFQUFFLGtDQUFtQ3dILEtBQUtwRyxPQUFMLEdBQWUscUJBQWYsR0FBdUMsRUFBMUUsSUFBaUYsVUFBbkYsRUFDWk0sR0FEWSxDQUNQOEYsS0FBSzlGLEdBREUsRUFFWm9JLFFBRlksQ0FFRm1GLE1BRkUsQ0FBakI7O0FBSUFrRyxzQkFBVW5WLEVBQUd3SCxLQUFLL0YsR0FBTCxDQUFTNkksT0FBVCxDQUFpQixVQUFqQixFQUE2QixJQUFJOEssSUFBSixHQUFXQyxPQUFYLEVBQTdCLENBQUgsRUFDTDFULElBREssQ0FDQzZGLEtBQUs3RixJQUROLEVBRUxtSSxRQUZLLENBRUt5RSxNQUFNa0MsUUFGWCxDQUFWOztBQUlBLGdCQUFLakosS0FBS3BHLE9BQVYsRUFBb0I7O0FBRWhCc0cscUJBQUtxTCxXQUFMLENBQWtCeEUsS0FBbEI7O0FBRUE7QUFDQTs7QUFFQTRHLHdCQUFRNUksRUFBUixDQUFXLGtCQUFYLEVBQStCLFVBQVNDLENBQVQsRUFBWTtBQUN2Qyx5QkFBSzhJLE9BQUwsR0FBZSxDQUFmOztBQUVBL0csMEJBQU1VLE1BQU4sQ0FBYXJFLE9BQWIsQ0FBc0IsU0FBdEI7O0FBRUFsRCx5QkFBS3pELFNBQUwsQ0FBZ0JzSyxLQUFoQjtBQUNILGlCQU5EOztBQVFBO0FBQ0E7O0FBRUFVLHVCQUFPMUMsRUFBUCxDQUFVLFlBQVYsRUFBd0IsWUFBVztBQUMvQix3QkFBSWdKLFFBQVFoSCxNQUFNa0MsUUFBbEI7QUFBQSx3QkFDSStFLGFBQWNoTyxLQUFLOUYsR0FBTCxDQUFTa08sS0FEM0I7QUFBQSx3QkFFSTZGLGNBQWNqTyxLQUFLOUYsR0FBTCxDQUFTc1AsTUFGM0I7QUFBQSx3QkFHSTBFLFdBSEo7QUFBQSx3QkFJSUMsU0FKSjtBQUFBLHdCQUtJQyxLQUxKOztBQU9BLHdCQUFLVCxRQUFRLENBQVIsRUFBV0csT0FBWCxLQUF1QixDQUE1QixFQUFnQztBQUM1QjtBQUNIOztBQUVEO0FBQ0E7O0FBRUEsd0JBQUk7QUFDQUssb0NBQVlSLFFBQVFVLFFBQVIsRUFBWjtBQUNBRCxnQ0FBWUQsVUFBVWhMLElBQVYsQ0FBZSxNQUFmLENBQVo7QUFFSCxxQkFKRCxDQUlFLE9BQU9tTCxNQUFQLEVBQWUsQ0FBRTs7QUFFbkI7QUFDQSx3QkFBS0YsU0FBU0EsTUFBTXhPLE1BQXBCLEVBQTZCOztBQUV6Qiw0QkFBS29PLGVBQWV2VixTQUFwQixFQUFnQztBQUM1QnlWLDBDQUFjUCxRQUFRLENBQVIsRUFBV1ksYUFBWCxDQUF5QmhXLFFBQXpCLENBQWtDaVcsZUFBbEMsQ0FBa0ROLFdBQWhFOztBQUVBRix5Q0FBYTlGLEtBQUt1RyxJQUFMLENBQVdMLE1BQU1NLFVBQU4sQ0FBaUIsSUFBakIsS0FBMkJYLE1BQU0zRixLQUFOLEtBQWdCOEYsV0FBM0MsQ0FBWCxDQUFiO0FBQ0FGLDBDQUFjRCxNQUFNVyxVQUFOLEtBQXFCWCxNQUFNMUIsVUFBTixFQUFuQztBQUNIOztBQUVELDRCQUFLNEIsZ0JBQWdCeFYsU0FBckIsRUFBaUM7QUFDN0J3ViwwQ0FBYy9GLEtBQUt1RyxJQUFMLENBQVdMLE1BQU1PLFdBQU4sQ0FBa0IsSUFBbEIsQ0FBWCxDQUFkO0FBQ0FWLDJDQUFlRixNQUFNWSxXQUFOLEtBQXNCWixNQUFNMUwsV0FBTixFQUFyQztBQUNIOztBQUVEO0FBQ0EsNEJBQUsyTCxVQUFMLEVBQWtCO0FBQ2RELGtDQUFNM0YsS0FBTixDQUFhNEYsVUFBYjtBQUNIOztBQUVELDRCQUFLQyxXQUFMLEVBQW1CO0FBQ2ZGLGtDQUFNdkUsTUFBTixDQUFjeUUsV0FBZDtBQUNIO0FBQ0o7O0FBRURGLDBCQUFNaEcsV0FBTixDQUFtQixvQkFBbkI7QUFFSCxpQkFoREQ7QUFrREgsYUFwRUQsTUFvRU87O0FBRUgscUJBQUt0TCxTQUFMLENBQWdCc0ssS0FBaEI7QUFFSDs7QUFFRDRHLG9CQUFReFQsSUFBUixDQUFjLEtBQWQsRUFBcUI0TSxNQUFNaEQsR0FBM0I7O0FBRUEsZ0JBQUtnRCxNQUFNL0csSUFBTixDQUFXeEcsUUFBWCxLQUF3QixJQUE3QixFQUFvQztBQUNoQ3VOLHNCQUFNa0MsUUFBTixDQUFlMkYsT0FBZixDQUF3QjFPLEtBQUsyQyxTQUFMLENBQWdCa0UsS0FBaEIsRUFBdUJBLE1BQU0vRyxJQUFOLENBQVdoRixNQUFYLENBQWtCeEIsUUFBekMsQ0FBeEI7QUFDSDs7QUFFRDtBQUNBaU8sbUJBQU9vRSxHQUFQLENBQVksU0FBWixFQUF1QixZQUFZOztBQUUvQjtBQUNBLG9CQUFJOztBQUVBclQsc0JBQUcsSUFBSCxFQUFVMkssSUFBVixDQUFnQixRQUFoQixFQUEyQnNDLElBQTNCLEdBQWtDdEwsSUFBbEMsQ0FBd0MsS0FBeEMsRUFBK0MsZUFBL0M7QUFFSCxpQkFKRCxDQUlFLE9BQVFtVSxNQUFSLEVBQWlCLENBQUU7O0FBRXJCOVYsa0JBQUcsSUFBSCxFQUFVcVcsS0FBVjs7QUFFQTlILHNCQUFNMEIsUUFBTixHQUFpQixLQUFqQjtBQUVILGFBYkQ7QUFlSCxTQTE1Q3dCOztBQTY1Q3pCO0FBQ0E7O0FBRUE0QyxvQkFBYSxvQkFBV3RFLEtBQVgsRUFBa0JoSCxPQUFsQixFQUE0Qjs7QUFFckMsZ0JBQUlHLE9BQU8sSUFBWDs7QUFFQSxnQkFBS0EsS0FBSzBGLFNBQVYsRUFBc0I7QUFDbEI7QUFDSDs7QUFFRDFGLGlCQUFLc04sV0FBTCxDQUFrQnpHLEtBQWxCOztBQUVBQSxrQkFBTVUsTUFBTixDQUFhb0gsS0FBYjs7QUFFQSxnQkFBS25RLFFBQVNxQixPQUFULEtBQXNCQSxRQUFRK08sTUFBUixHQUFpQmxQLE1BQTVDLEVBQXFEOztBQUVqRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBRyx3QkFBUStPLE1BQVIsQ0FBZ0IseUJBQWhCLEVBQTRDMUwsT0FBNUMsQ0FBcUQsU0FBckQ7O0FBRUE7QUFDQTJELHNCQUFNZ0ksWUFBTixHQUFxQnZXLEVBQUcsYUFBSCxFQUFtQmlOLElBQW5CLEdBQTBCdUosV0FBMUIsQ0FBdUNqUCxPQUF2QyxDQUFyQjs7QUFFQTtBQUNBQSx3QkFBUTdGLEdBQVIsQ0FBWSxTQUFaLEVBQXVCLGNBQXZCO0FBRUgsYUFoQkQsTUFnQk8sSUFBSyxDQUFDNk0sTUFBTTRDLFFBQVosRUFBdUI7O0FBRTFCO0FBQ0Esb0JBQUtuUixFQUFFMkUsSUFBRixDQUFRNEMsT0FBUixNQUFzQixRQUEzQixFQUFzQztBQUNsQ0EsOEJBQVV2SCxFQUFFLE9BQUYsRUFBV2tLLE1BQVgsQ0FBbUJsSyxFQUFFZ1UsSUFBRixDQUFRek0sT0FBUixDQUFuQixFQUF1Q3NPLFFBQXZDLEVBQVY7O0FBRUE7QUFDQSx3QkFBS3RPLFFBQVEsQ0FBUixFQUFXa1AsUUFBWCxLQUF3QixDQUE3QixFQUFpQztBQUM3QmxQLGtDQUFVdkgsRUFBRSxPQUFGLEVBQVcwVyxJQUFYLENBQWlCblAsT0FBakIsQ0FBVjtBQUNIO0FBQ0o7O0FBRUQ7QUFDQSxvQkFBS2dILE1BQU0vRyxJQUFOLENBQVcwRSxNQUFoQixFQUF5QjtBQUNyQjNFLDhCQUFVdkgsRUFBRSxPQUFGLEVBQVcwVyxJQUFYLENBQWlCblAsT0FBakIsRUFBMkJvRCxJQUEzQixDQUFpQzRELE1BQU0vRyxJQUFOLENBQVcwRSxNQUE1QyxDQUFWO0FBQ0g7QUFFSjs7QUFFRHFDLGtCQUFNVSxNQUFOLENBQWFvRSxHQUFiLENBQWlCLFNBQWpCLEVBQTRCLFlBQVk7O0FBRXBDO0FBQ0Esb0JBQUs5RSxNQUFNZ0ksWUFBWCxFQUEwQjtBQUN0QmhJLDBCQUFNZ0ksWUFBTixDQUFtQkksS0FBbkIsQ0FBMEJwUCxRQUFRMEYsSUFBUixFQUExQixFQUEyQ2hELE1BQTNDOztBQUVBc0UsMEJBQU1nSSxZQUFOLEdBQXFCLElBQXJCO0FBQ0g7O0FBRUQ7QUFDQSxvQkFBS2hJLE1BQU1xSSxTQUFYLEVBQXVCO0FBQ25CckksMEJBQU1xSSxTQUFOLENBQWdCM00sTUFBaEI7O0FBRUFzRSwwQkFBTXFJLFNBQU4sR0FBa0IsSUFBbEI7QUFDSDs7QUFFRDtBQUNBLG9CQUFLLENBQUNySSxNQUFNNEMsUUFBWixFQUF1QjtBQUNuQm5SLHNCQUFFLElBQUYsRUFBUXFXLEtBQVI7O0FBRUE5SCwwQkFBTTBCLFFBQU4sR0FBaUIsS0FBakI7QUFDSDtBQUVKLGFBdkJEOztBQXlCQTFCLGtCQUFNa0MsUUFBTixHQUFpQnpRLEVBQUd1SCxPQUFILEVBQWF1QyxRQUFiLENBQXVCeUUsTUFBTVUsTUFBN0IsQ0FBakI7O0FBRUEsaUJBQUtoTCxTQUFMLENBQWdCc0ssS0FBaEI7QUFDSCxTQTMrQ3dCOztBQTYrQ3pCO0FBQ0E7O0FBRUF1RSxrQkFBVyxrQkFBV3ZFLEtBQVgsRUFBbUI7O0FBRTFCQSxrQkFBTTRDLFFBQU4sR0FBaUIsSUFBakI7O0FBRUE1QyxrQkFBTVUsTUFBTixDQUFhTSxXQUFiLENBQTBCLHFCQUFxQmhCLE1BQU01SixJQUFyRDs7QUFFQSxpQkFBS2tPLFVBQUwsQ0FBaUJ0RSxLQUFqQixFQUF3QixLQUFLbEUsU0FBTCxDQUFnQmtFLEtBQWhCLEVBQXVCQSxNQUFNL0csSUFBTixDQUFXakYsUUFBbEMsQ0FBeEI7QUFFSCxTQXgvQ3dCOztBQTIvQ3pCO0FBQ0E7O0FBRUF3USxxQkFBYyxxQkFBVXhFLEtBQVYsRUFBa0I7O0FBRTVCLGdCQUFJN0csT0FBTyxJQUFYOztBQUVBNkcsb0JBQVFBLFNBQVM3RyxLQUFLakQsT0FBdEI7O0FBRUEsZ0JBQUs4SixTQUFTLENBQUNBLE1BQU1zSSxRQUFyQixFQUFnQztBQUM1QnRJLHNCQUFNc0ksUUFBTixHQUFpQjdXLEVBQUcwSCxLQUFLRixJQUFMLENBQVVsRixVQUFiLEVBQTBCd0gsUUFBMUIsQ0FBb0N5RSxNQUFNVSxNQUExQyxDQUFqQjtBQUNIO0FBRUosU0F4Z0R3Qjs7QUEwZ0R6QjtBQUNBOztBQUVBK0YscUJBQWMscUJBQVV6RyxLQUFWLEVBQWtCOztBQUU1QixnQkFBSTdHLE9BQU8sSUFBWDs7QUFFQTZHLG9CQUFRQSxTQUFTN0csS0FBS2pELE9BQXRCOztBQUVBLGdCQUFLOEosU0FBU0EsTUFBTXNJLFFBQXBCLEVBQStCO0FBQzNCdEksc0JBQU1zSSxRQUFOLENBQWU1TSxNQUFmOztBQUVBLHVCQUFPc0UsTUFBTXNJLFFBQWI7QUFDSDtBQUVKLFNBemhEd0I7O0FBNGhEekI7QUFDQTs7QUFFQTVTLG1CQUFZLG1CQUFVc0ssS0FBVixFQUFrQjs7QUFFMUIsZ0JBQUk3RyxPQUFPLElBQVg7O0FBRUEsZ0JBQUtBLEtBQUswRixTQUFWLEVBQXNCO0FBQ2xCO0FBQ0g7O0FBRURtQixrQkFBTW1FLFNBQU4sR0FBa0IsS0FBbEI7QUFDQW5FLGtCQUFNMEIsUUFBTixHQUFrQixJQUFsQjs7QUFFQXZJLGlCQUFLa0QsT0FBTCxDQUFjLFdBQWQsRUFBMkIyRCxLQUEzQjs7QUFFQTdHLGlCQUFLc04sV0FBTCxDQUFrQnpHLEtBQWxCOztBQUVBLGdCQUFLQSxNQUFNL0csSUFBTixDQUFXeEcsUUFBWCxJQUF1QixDQUFDdU4sTUFBTXFJLFNBQW5DLEVBQStDO0FBQzNDckksc0JBQU1xSSxTQUFOLEdBQWtCNVcsRUFBRzBILEtBQUsyQyxTQUFMLENBQWdCa0UsS0FBaEIsRUFBdUJBLE1BQU0vRyxJQUFOLENBQVdoRixNQUFYLENBQWtCeEIsUUFBekMsQ0FBSCxFQUF5RDhJLFFBQXpELENBQW1FeUUsTUFBTWtDLFFBQU4sQ0FBZXZFLE1BQWYsQ0FBc0IsVUFBdEIsRUFBa0M0SyxLQUFsQyxFQUFuRSxDQUFsQjtBQUNIOztBQUVELGdCQUFLdkksTUFBTS9HLElBQU4sQ0FBV3ZHLE9BQVgsSUFBc0JzTixNQUFNa0MsUUFBNUIsSUFBd0MsQ0FBQ2xDLE1BQU00QyxRQUFwRCxFQUErRDs7QUFFM0Q7QUFDQTVDLHNCQUFNa0MsUUFBTixDQUFlbEUsRUFBZixDQUFtQixnQkFBbkIsRUFBcUMsVUFBVUMsQ0FBVixFQUFjO0FBQzlDLHdCQUFLQSxFQUFFdUssTUFBRixJQUFZLENBQWpCLEVBQXFCO0FBQ2pCdkssMEJBQUVFLGNBQUY7QUFDSDs7QUFFRiwyQkFBTyxJQUFQO0FBQ0gsaUJBTkQ7O0FBUUE7QUFDQTtBQUNBLG9CQUFLNkIsTUFBTTVKLElBQU4sS0FBZSxPQUFwQixFQUE4QjtBQUMxQjNFLHNCQUFHLHdDQUFILEVBQThDOEosUUFBOUMsQ0FBd0R5RSxNQUFNa0MsUUFBOUQ7QUFDSDtBQUVKOztBQUVEL0ksaUJBQUt3SSxhQUFMLENBQW9CM0IsS0FBcEI7QUFFSCxTQXZrRHdCOztBQTBrRHpCO0FBQ0E7QUFDQTtBQUNBOztBQUVBMkIsdUJBQWdCLHVCQUFVM0IsS0FBVixFQUFrQjs7QUFFOUIsZ0JBQUk3RyxPQUFTLElBQWI7QUFDQSxnQkFBSXVILFNBQVNWLE1BQU1VLE1BQW5COztBQUVBLGdCQUFJK0gsTUFBSjtBQUFBLGdCQUFZQyxlQUFaO0FBQUEsZ0JBQTZCNUksUUFBN0I7QUFBQSxnQkFBdUM2SSxPQUF2QztBQUFBLGdCQUFnRDFGLEdBQWhEO0FBQUEsZ0JBQXFEMkYsUUFBUSxLQUE3RDs7QUFFQUgscUJBQVd6SSxNQUFNL0csSUFBTixDQUFZRSxLQUFLVyxRQUFMLEdBQWdCLGlCQUFoQixHQUFzQyxrQkFBbEQsQ0FBWDtBQUNBZ0csdUJBQVdFLE1BQU0vRyxJQUFOLENBQVlFLEtBQUtXLFFBQUwsR0FBZ0IsbUJBQWhCLEdBQXNDLG9CQUFsRCxDQUFYOztBQUVBZ0csdUJBQVdwRyxTQUFVc0csTUFBTWMsY0FBTixLQUF5QnBQLFNBQXpCLEdBQXFDb08sUUFBckMsR0FBZ0RFLE1BQU1jLGNBQWhFLEVBQWdGLEVBQWhGLENBQVg7O0FBRUEsZ0JBQUtkLE1BQU1XLE9BQU4sSUFBaUJYLE1BQU1ELEdBQU4sS0FBYzVHLEtBQUtVLE9BQXBDLElBQStDLENBQUNpRyxRQUFyRCxFQUFnRTtBQUM1RDJJLHlCQUFTLEtBQVQ7QUFDSDs7QUFFRDtBQUNBLGdCQUFLQSxXQUFXLE1BQVgsSUFBcUIsRUFBR3pJLE1BQU1ELEdBQU4sS0FBYzVHLEtBQUtVLE9BQW5CLElBQThCaUcsUUFBOUIsSUFBMENFLE1BQU01SixJQUFOLEtBQWUsT0FBekQsSUFBb0UsQ0FBQzRKLE1BQU00QyxRQUEzRSxLQUF5RmdHLFFBQVF6UCxLQUFLMFAsV0FBTCxDQUFrQjdJLEtBQWxCLENBQWpHLENBQUgsQ0FBMUIsRUFBOEo7QUFDMUp5SSx5QkFBUyxNQUFUO0FBQ0g7O0FBRUQ7QUFDQTs7QUFFQSxnQkFBS0EsV0FBVyxNQUFoQixFQUF5QjtBQUNyQnhGLHNCQUFNOUosS0FBSytKLFNBQUwsQ0FBZ0JsRCxLQUFoQixDQUFOOztBQUVBaUQsb0JBQUlYLE1BQUosR0FBYVcsSUFBSTVCLEtBQUosR0FBYXVILE1BQU12SCxLQUFoQztBQUNBNEIsb0JBQUlWLE1BQUosR0FBYVUsSUFBSVIsTUFBSixHQUFhbUcsTUFBTW5HLE1BQWhDOztBQUVBLHVCQUFPUSxJQUFJNUIsS0FBWDtBQUNBLHVCQUFPNEIsSUFBSVIsTUFBWDs7QUFFQTtBQUNBa0csMEJBQVUzSSxNQUFNL0csSUFBTixDQUFXeEYsV0FBckI7O0FBRUEsb0JBQUtrVixXQUFXLE1BQWhCLEVBQXlCO0FBQ3JCQSw4QkFBVXhILEtBQUs4QyxHQUFMLENBQVVqRSxNQUFNcUIsS0FBTixHQUFjckIsTUFBTXlDLE1BQXBCLEdBQTZCbUcsTUFBTXZILEtBQU4sR0FBY3VILE1BQU1uRyxNQUEzRCxJQUFzRSxHQUFoRjtBQUNIOztBQUVELG9CQUFLa0csT0FBTCxFQUFlO0FBQ1hDLDBCQUFNRCxPQUFOLEdBQWdCLEdBQWhCO0FBQ0ExRix3QkFBSTBGLE9BQUosR0FBZ0IsQ0FBaEI7QUFDSDs7QUFFRDtBQUNBbFgsa0JBQUVHLFFBQUYsQ0FBVzZSLFlBQVgsQ0FBeUJ6RCxNQUFNa0MsUUFBTixDQUFlbEIsV0FBZixDQUE0QixvQkFBNUIsQ0FBekIsRUFBNkU0SCxLQUE3RTs7QUFFQWpRLDRCQUFhcUgsTUFBTWtDLFFBQW5COztBQUVBO0FBQ0F6USxrQkFBRUcsUUFBRixDQUFXMFAsT0FBWCxDQUFvQnRCLE1BQU1rQyxRQUExQixFQUFvQ2UsR0FBcEMsRUFBeUNuRCxRQUF6QyxFQUFtRCxZQUFXO0FBQzFEM0cseUJBQUtxSSxRQUFMO0FBQ0gsaUJBRkQ7O0FBSUE7QUFDSDs7QUFFRHJJLGlCQUFLMEksV0FBTCxDQUFrQjdCLEtBQWxCOztBQUdBO0FBQ0E7O0FBRUEsZ0JBQUssQ0FBQ3lJLE1BQU4sRUFBZTtBQUNYOVAsNEJBQWErSCxNQUFiOztBQUVBVixzQkFBTWtDLFFBQU4sQ0FBZWxCLFdBQWYsQ0FBNEIsb0JBQTVCOztBQUVBLG9CQUFLaEIsTUFBTUQsR0FBTixLQUFjNUcsS0FBS1UsT0FBeEIsRUFBa0M7QUFDOUJWLHlCQUFLcUksUUFBTDtBQUNIOztBQUVEO0FBQ0g7O0FBRUQvUCxjQUFFRyxRQUFGLENBQVdzUCxJQUFYLENBQWlCUixNQUFqQjs7QUFFQWdJLDhCQUFrQix3Q0FBeUMxSSxNQUFNRCxHQUFOLElBQWE1RyxLQUFLUyxPQUFsQixHQUE0QixNQUE1QixHQUFxQyxVQUE5RSxJQUE2RixlQUE3RixHQUErRzZPLE1BQWpJOztBQUVBL0gsbUJBQU9hLFVBQVAsQ0FBbUIsT0FBbkIsRUFBNkJQLFdBQTdCLENBQTBDLHVFQUExQyxFQUFvSGpHLFFBQXBILENBQThIMk4sZUFBOUg7O0FBRUExSSxrQkFBTWtDLFFBQU4sQ0FBZWxCLFdBQWYsQ0FBNEIsb0JBQTVCOztBQUVBO0FBQ0FySSx3QkFBYStILE1BQWI7O0FBRUFqUCxjQUFFRyxRQUFGLENBQVcwUCxPQUFYLENBQW9CWixNQUFwQixFQUE0Qix5QkFBNUIsRUFBdURaLFFBQXZELEVBQWlFLFVBQVM3QixDQUFULEVBQVk7QUFDekV5Qyx1QkFBT00sV0FBUCxDQUFvQjBILGVBQXBCLEVBQXNDbkgsVUFBdEMsQ0FBa0QsT0FBbEQ7O0FBRUEsb0JBQUt2QixNQUFNRCxHQUFOLEtBQWM1RyxLQUFLVSxPQUF4QixFQUFrQztBQUM5QlYseUJBQUtxSSxRQUFMO0FBQ0g7QUFFSixhQVBELEVBT0csSUFQSDtBQVNILFNBL3FEd0I7O0FBa3JEekI7QUFDQTs7QUFFQXFILHFCQUFjLHFCQUFVN0ksS0FBVixFQUFrQjs7QUFFNUIsZ0JBQUk3RyxPQUFPLElBQVg7QUFDQSxnQkFBSTRLLE1BQU8sS0FBWDs7QUFFQTtBQUNBLGdCQUFJK0UsbUJBQW1CLFNBQW5CQSxnQkFBbUIsQ0FBVWxRLEdBQVYsRUFBZ0I7QUFDbkMsb0JBQUltUSxVQUFVblEsSUFBSSxDQUFKLENBQWQ7O0FBRUEsb0JBQUlvUSxjQUFjRCxRQUFRRSxxQkFBUixFQUFsQjtBQUNBLG9CQUFJQyxjQUFjLEVBQWxCOztBQUVBLG9CQUFJQyxtQkFBSjs7QUFFQSx1QkFBUUosUUFBUUssYUFBUixLQUEwQixJQUFsQyxFQUF5QztBQUNyQyx3QkFBSzNYLEVBQUVzWCxRQUFRSyxhQUFWLEVBQXlCalcsR0FBekIsQ0FBNkIsVUFBN0IsTUFBNkMsUUFBN0MsSUFBMEQxQixFQUFFc1gsUUFBUUssYUFBVixFQUF5QmpXLEdBQXpCLENBQTZCLFVBQTdCLE1BQTZDLE1BQTVHLEVBQXFIO0FBQ2pIK1Ysb0NBQVlyTCxJQUFaLENBQWlCa0wsUUFBUUssYUFBUixDQUFzQkgscUJBQXRCLEVBQWpCO0FBQ0g7O0FBRURGLDhCQUFVQSxRQUFRSyxhQUFsQjtBQUNIOztBQUVERCxzQ0FBc0JELFlBQVlHLEtBQVosQ0FBa0IsVUFBU0MsVUFBVCxFQUFvQjtBQUN4RCx3QkFBSUMsZ0JBQWdCcEksS0FBS21DLEdBQUwsQ0FBUzBGLFlBQVlRLEtBQXJCLEVBQTRCRixXQUFXRSxLQUF2QyxJQUFnRHJJLEtBQUt1RixHQUFMLENBQVNzQyxZQUFZcEksSUFBckIsRUFBMkIwSSxXQUFXMUksSUFBdEMsQ0FBcEU7QUFDQSx3QkFBSTZJLGdCQUFnQnRJLEtBQUttQyxHQUFMLENBQVMwRixZQUFZVSxNQUFyQixFQUE2QkosV0FBV0ksTUFBeEMsSUFBa0R2SSxLQUFLdUYsR0FBTCxDQUFTc0MsWUFBWW5JLEdBQXJCLEVBQTBCeUksV0FBV3pJLEdBQXJDLENBQXRFOztBQUVBLDJCQUFPMEksZ0JBQWdCLENBQWhCLElBQXFCRSxnQkFBZ0IsQ0FBNUM7QUFDSCxpQkFMcUIsQ0FBdEI7O0FBT0EsdUJBQU9OLHVCQUNISCxZQUFZVSxNQUFaLEdBQXFCLENBRGxCLElBQ3VCVixZQUFZUSxLQUFaLEdBQW9CLENBRDNDLElBRUhSLFlBQVlwSSxJQUFaLEdBQW1CblAsRUFBRUYsTUFBRixFQUFVOFAsS0FBVixFQUZoQixJQUVxQzJILFlBQVluSSxHQUFaLEdBQWtCcFAsRUFBRUYsTUFBRixFQUFVa1IsTUFBVixFQUY5RDtBQUdILGFBMUJEOztBQTRCQSxnQkFBSW5GLFNBQVcwQyxNQUFNL0csSUFBTixDQUFXcUUsTUFBMUI7QUFDQSxnQkFBSXFNLFdBQVdyTSxTQUFTQSxPQUFPc00sTUFBUCxFQUFULEdBQTJCLENBQTFDO0FBQ0EsZ0JBQUlDLFFBQUo7O0FBRUEsZ0JBQUtGLFlBQVlyTSxPQUFPLENBQVAsRUFBVXdNLGFBQVYsS0FBNEJ0WSxRQUF4QyxJQUFvRHNYLGlCQUFrQnhMLE1BQWxCLENBQXpELEVBQXNGO0FBQ2xGdU0sMkJBQVcxUSxLQUFLNkMsS0FBTCxDQUFXeUMsS0FBWCxDQUFpQm1MLE1BQWpCLEVBQVg7O0FBRUE3RixzQkFBTTtBQUNGbEQseUJBQVM4SSxTQUFTOUksR0FBVCxHQUFnQmdKLFNBQVNoSixHQUF6QixHQUFnQ2tKLFdBQVl6TSxPQUFPbkssR0FBUCxDQUFZLGtCQUFaLEtBQW9DLENBQWhELENBRHZDO0FBRUZ5TiwwQkFBUytJLFNBQVMvSSxJQUFULEdBQWdCaUosU0FBU2pKLElBQXpCLEdBQWdDbUosV0FBWXpNLE9BQU9uSyxHQUFQLENBQVksbUJBQVosS0FBcUMsQ0FBakQsQ0FGdkM7QUFHRmtPLDJCQUFTL0QsT0FBTytELEtBQVAsRUFIUDtBQUlGb0IsNEJBQVNuRixPQUFPbUYsTUFBUCxFQUpQO0FBS0ZILDRCQUFTLENBTFA7QUFNRkMsNEJBQVM7QUFOUCxpQkFBTjtBQVFIOztBQUVELG1CQUFPd0IsR0FBUDtBQUNILFNBenVEd0I7O0FBNHVEekI7QUFDQTtBQUNBOztBQUVBdkMsa0JBQVcsb0JBQVc7O0FBRWxCLGdCQUFJckksT0FBTyxJQUFYOztBQUVBLGdCQUFJakQsVUFBVWlELEtBQUtqRCxPQUFuQjtBQUNBLGdCQUFJaUUsU0FBVSxFQUFkOztBQUVBLGdCQUFLakUsUUFBUXlLLE9BQVIsSUFBbUIsQ0FBQ3pLLFFBQVF3TCxRQUE1QixJQUF3Q3hMLFFBQVEwTCxVQUFyRCxFQUFrRTtBQUM5RDtBQUNIOztBQUVEMUwsb0JBQVEwTCxVQUFSLEdBQXFCLElBQXJCOztBQUVBMUwsb0JBQVF3SyxNQUFSLENBQWVzSixRQUFmLEdBQTBCM04sT0FBMUIsQ0FBbUMsU0FBbkM7O0FBRUE7QUFDQTFELHdCQUFhekMsUUFBUXdLLE1BQXJCOztBQUVBeEssb0JBQVF3SyxNQUFSLENBQWUzRixRQUFmLENBQXlCLDBCQUF6Qjs7QUFFQTtBQUNBdEosY0FBRW1LLElBQUYsQ0FBUXpDLEtBQUtnQixNQUFiLEVBQXFCLFVBQVVxSixHQUFWLEVBQWV4RCxLQUFmLEVBQXVCO0FBQ3hDLG9CQUFLQSxNQUFNRCxHQUFOLElBQWE1RyxLQUFLVSxPQUFMLEdBQWUsQ0FBNUIsSUFBaUNtRyxNQUFNRCxHQUFOLElBQWE1RyxLQUFLVSxPQUFMLEdBQWUsQ0FBbEUsRUFBc0U7QUFDbEVNLDJCQUFRNkYsTUFBTUQsR0FBZCxJQUFzQkMsS0FBdEI7QUFFSCxpQkFIRCxNQUdPLElBQUtBLEtBQUwsRUFBYTs7QUFFaEJ2TyxzQkFBRUcsUUFBRixDQUFXc1AsSUFBWCxDQUFpQmxCLE1BQU1VLE1BQXZCOztBQUVBViwwQkFBTVUsTUFBTixDQUFhZCxHQUFiLEdBQW1CbEUsTUFBbkI7QUFDSDtBQUNKLGFBVkQ7O0FBWUF2QyxpQkFBS2dCLE1BQUwsR0FBY0EsTUFBZDs7QUFFQWhCLGlCQUFLMEosWUFBTDs7QUFFQTFKLGlCQUFLa0QsT0FBTCxDQUFjLFdBQWQ7O0FBRUE7QUFDQSxnQkFBSzVLLEVBQUdELFNBQVN5SSxhQUFaLEVBQTRCK0UsRUFBNUIsQ0FBZ0MsWUFBaEMsS0FBb0Q5SSxRQUFRK0MsSUFBUixDQUFhekUsU0FBYixJQUEwQixFQUFHMEIsUUFBUUUsSUFBUixJQUFnQixPQUFoQixJQUEyQkYsUUFBUUUsSUFBUixLQUFpQixRQUEvQyxDQUFuRixFQUFpSjtBQUM3SStDLHFCQUFLK0YsS0FBTDtBQUNIO0FBRUosU0E1eER3Qjs7QUEreER6QjtBQUNBOztBQUVBck0saUJBQVUsbUJBQVc7QUFDakIsZ0JBQUlzRyxPQUFPLElBQVg7QUFDQSxnQkFBSWtGLElBQUosRUFBVTRMLElBQVY7O0FBRUEsZ0JBQUs5USxLQUFLSyxLQUFMLENBQVdYLE1BQVgsR0FBb0IsQ0FBekIsRUFBNkI7QUFDekI7QUFDSDs7QUFFRHdGLG1CQUFRbEYsS0FBS2dCLE1BQUwsQ0FBYWhCLEtBQUtVLE9BQUwsR0FBZSxDQUE1QixDQUFSO0FBQ0FvUSxtQkFBUTlRLEtBQUtnQixNQUFMLENBQWFoQixLQUFLVSxPQUFMLEdBQWUsQ0FBNUIsQ0FBUjs7QUFFQSxnQkFBS3dFLFFBQVFBLEtBQUtqSSxJQUFMLEtBQWMsT0FBM0IsRUFBcUM7QUFDakMrQyxxQkFBSzhILFNBQUwsQ0FBZ0I1QyxJQUFoQjtBQUNIOztBQUVELGdCQUFLNEwsUUFBUUEsS0FBSzdULElBQUwsS0FBYyxPQUEzQixFQUFxQztBQUNqQytDLHFCQUFLOEgsU0FBTCxDQUFnQmdKLElBQWhCO0FBQ0g7QUFFSixTQXJ6RHdCOztBQXd6RHpCO0FBQ0E7O0FBRUEvSyxlQUFRLGlCQUFXO0FBQ2YsZ0JBQUloSixVQUFVLEtBQUtBLE9BQW5CO0FBQ0EsZ0JBQUkwQyxHQUFKOztBQUVBLGdCQUFLLEtBQUtpRyxTQUFWLEVBQXNCO0FBQ2xCO0FBQ0g7O0FBRUQsZ0JBQUszSSxXQUFXQSxRQUFRMEwsVUFBeEIsRUFBcUM7O0FBRWpDO0FBQ0FoSixzQkFBTTFDLFFBQVF3SyxNQUFSLENBQWV0RSxJQUFmLENBQW9CLHdDQUFwQixDQUFOOztBQUVBLG9CQUFLLENBQUN4RCxJQUFJQyxNQUFWLEVBQW1CO0FBQ2ZELDBCQUFNMUMsUUFBUXdLLE1BQVIsQ0FBZXRFLElBQWYsQ0FBb0IsNEJBQXBCLEVBQWtEdUIsTUFBbEQsQ0FBeUQsd0JBQXpELENBQU47QUFDSDtBQUNKOztBQUVEL0Usa0JBQU1BLE9BQU9BLElBQUlDLE1BQVgsR0FBb0JELEdBQXBCLEdBQTBCLEtBQUtvRCxLQUFMLENBQVdDLFNBQTNDOztBQUVBckQsZ0JBQUlzRyxLQUFKO0FBQ0gsU0FoMUR3Qjs7QUFtMUR6QjtBQUNBO0FBQ0E7O0FBRUE1QyxrQkFBVyxvQkFBWTtBQUNuQixnQkFBSW5ELE9BQU8sSUFBWDs7QUFFQTtBQUNBMUgsY0FBRyxxQkFBSCxFQUEyQm1LLElBQTNCLENBQWdDLFlBQVk7QUFDeEMsb0JBQUlnRCxXQUFXbk4sRUFBRSxJQUFGLEVBQVF1QixJQUFSLENBQWMsVUFBZCxDQUFmOztBQUVBO0FBQ0Esb0JBQUk0TCxZQUFZQSxTQUFTckYsRUFBVCxLQUFnQkosS0FBS0ksRUFBakMsSUFBdUMsQ0FBQ3FGLFNBQVNDLFNBQXJELEVBQWdFO0FBQzVERCw2QkFBU3ZDLE9BQVQsQ0FBa0IsY0FBbEI7O0FBRUF1Qyw2QkFBU2IsWUFBVDs7QUFFQWEsNkJBQVNzTCxTQUFULEdBQXFCLEtBQXJCO0FBQ0g7QUFFSixhQVpEOztBQWNBL1EsaUJBQUsrUSxTQUFMLEdBQWlCLElBQWpCOztBQUVBLGdCQUFLL1EsS0FBS2pELE9BQUwsSUFBZ0JpRCxLQUFLb0csTUFBMUIsRUFBbUM7QUFDL0JwRyxxQkFBS3FGLE1BQUw7O0FBRUFyRixxQkFBS3FILGNBQUw7QUFDSDs7QUFFRHJILGlCQUFLa0QsT0FBTCxDQUFjLFlBQWQ7O0FBRUFsRCxpQkFBSzJFLFNBQUw7QUFDSCxTQXAzRHdCOztBQXUzRHpCO0FBQ0E7QUFDQTs7QUFFQTFKLGVBQVEsZUFBVTZKLENBQVYsRUFBYWtNLENBQWIsRUFBaUI7O0FBRXJCLGdCQUFJaFIsT0FBVSxJQUFkO0FBQ0EsZ0JBQUlqRCxVQUFVaUQsS0FBS2pELE9BQW5COztBQUVBLGdCQUFJdVMsTUFBSixFQUFZM0ksUUFBWjtBQUNBLGdCQUFJbUMsS0FBSixFQUFXMEcsT0FBWCxFQUFvQkMsS0FBcEIsRUFBMkIzRixHQUEzQjs7QUFFQSxnQkFBSW1ILE9BQU8sU0FBUEEsSUFBTyxHQUFXO0FBQ2xCalIscUJBQUtrUixPQUFMLENBQWNwTSxDQUFkO0FBQ0gsYUFGRDs7QUFJQSxnQkFBSzlFLEtBQUswRixTQUFWLEVBQXNCO0FBQ2xCLHVCQUFPLEtBQVA7QUFDSDs7QUFFRDFGLGlCQUFLMEYsU0FBTCxHQUFpQixJQUFqQjs7QUFFQTtBQUNBLGdCQUFLMUYsS0FBS2tELE9BQUwsQ0FBYyxhQUFkLEVBQTZCNEIsQ0FBN0IsTUFBcUMsS0FBMUMsRUFBa0Q7QUFDOUM5RSxxQkFBSzBGLFNBQUwsR0FBaUIsS0FBakI7O0FBRUEvRyw4QkFBYyxZQUFXO0FBQ3JCcUIseUJBQUtxRixNQUFMO0FBQ0gsaUJBRkQ7O0FBSUEsdUJBQU8sS0FBUDtBQUNIOztBQUVEO0FBQ0E7QUFDQXJGLGlCQUFLNEUsWUFBTDs7QUFFQSxnQkFBSzdILFFBQVFvUSxPQUFiLEVBQXVCO0FBQ25CRCw2QkFBY25RLFFBQVFvUSxPQUF0QjtBQUNIOztBQUVEckUsb0JBQVcvTCxRQUFRZ00sUUFBbkI7QUFDQXVHLHFCQUFXdlMsUUFBUStDLElBQVIsQ0FBYTFGLGVBQXhCO0FBQ0F1TSx1QkFBV3JPLEVBQUVzUCxTQUFGLENBQWFvSixDQUFiLElBQW1CQSxDQUFuQixHQUF5QjFCLFNBQVN2UyxRQUFRK0MsSUFBUixDQUFhekYsaUJBQXRCLEdBQTBDLENBQTlFOztBQUVBO0FBQ0EwQyxvQkFBUXdLLE1BQVIsQ0FBZWQsR0FBZixDQUFvQnZILGFBQXBCLEVBQW9DMkksV0FBcEMsQ0FBaUQsMEZBQWpEOztBQUVBOUssb0JBQVF3SyxNQUFSLENBQWVzSixRQUFmLEdBQTBCM04sT0FBMUIsQ0FBbUMsU0FBbkMsRUFBK0NYLE1BQS9DOztBQUVBO0FBQ0EsZ0JBQUtvRSxRQUFMLEVBQWdCO0FBQ1ozRyxxQkFBSzZDLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQitFLFdBQXJCLENBQWtDLGtCQUFsQyxFQUF1RGpHLFFBQXZELENBQWlFLHFCQUFqRTtBQUNIOztBQUVEO0FBQ0E1QixpQkFBS3NOLFdBQUwsQ0FBa0J2USxPQUFsQjs7QUFFQWlELGlCQUFLd0csWUFBTDs7QUFFQXhHLGlCQUFLMEosWUFBTDs7QUFFQTtBQUNBLGdCQUFLNEYsV0FBVyxNQUFYLElBQXFCLEVBQUd4SyxNQUFNLElBQU4sSUFBY2dFLEtBQWQsSUFBdUJuQyxRQUF2QixJQUFtQzVKLFFBQVFFLElBQVIsS0FBaUIsT0FBcEQsSUFBK0QsQ0FBQ0YsUUFBUTBNLFFBQXhFLEtBQXNGSyxNQUFNOUosS0FBSzBQLFdBQUwsQ0FBa0IzUyxPQUFsQixDQUE1RixDQUFILENBQTFCLEVBQTJKO0FBQ3ZKdVMseUJBQVMsTUFBVDtBQUNIOztBQUVELGdCQUFLQSxXQUFXLE1BQWhCLEVBQXlCO0FBQ3JCaFgsa0JBQUVHLFFBQUYsQ0FBV3NQLElBQVgsQ0FBaUJlLEtBQWpCOztBQUVBMkcsd0JBQVFuWCxFQUFFRyxRQUFGLENBQVc2TyxZQUFYLENBQXlCd0IsS0FBekIsQ0FBUjs7QUFFQTJHLHNCQUFNdkgsS0FBTixHQUFldUgsTUFBTXZILEtBQU4sR0FBZXVILE1BQU10RyxNQUFwQztBQUNBc0csc0JBQU1uRyxNQUFOLEdBQWVtRyxNQUFNbkcsTUFBTixHQUFlbUcsTUFBTXJHLE1BQXBDOztBQUVBO0FBQ0FvRywwQkFBVXpTLFFBQVErQyxJQUFSLENBQWF4RixXQUF2Qjs7QUFFQSxvQkFBS2tWLFdBQVcsTUFBaEIsRUFBeUI7QUFDckJBLDhCQUFVeEgsS0FBSzhDLEdBQUwsQ0FBVS9OLFFBQVFtTCxLQUFSLEdBQWdCbkwsUUFBUXVNLE1BQXhCLEdBQWlDUSxJQUFJNUIsS0FBSixHQUFZNEIsSUFBSVIsTUFBM0QsSUFBc0UsR0FBaEY7QUFDSDs7QUFFRCxvQkFBS2tHLE9BQUwsRUFBZTtBQUNYMUYsd0JBQUkwRixPQUFKLEdBQWMsQ0FBZDtBQUNIOztBQUVEQyxzQkFBTXRHLE1BQU4sR0FBZXNHLE1BQU12SCxLQUFOLEdBQWU0QixJQUFJNUIsS0FBbEM7QUFDQXVILHNCQUFNckcsTUFBTixHQUFlcUcsTUFBTW5HLE1BQU4sR0FBZVEsSUFBSVIsTUFBbEM7O0FBRUFtRyxzQkFBTXZILEtBQU4sR0FBZTRCLElBQUk1QixLQUFuQjtBQUNBdUgsc0JBQU1uRyxNQUFOLEdBQWVRLElBQUlSLE1BQW5COztBQUVBaFIsa0JBQUVHLFFBQUYsQ0FBVzZSLFlBQVgsQ0FBeUJ2TixRQUFRZ00sUUFBakMsRUFBMkMwRyxLQUEzQzs7QUFFQWpRLDRCQUFhekMsUUFBUWdNLFFBQXJCOztBQUVBelEsa0JBQUVHLFFBQUYsQ0FBVzBQLE9BQVgsQ0FBb0JwTCxRQUFRZ00sUUFBNUIsRUFBc0NlLEdBQXRDLEVBQTJDbkQsUUFBM0MsRUFBcURzSyxJQUFyRDs7QUFFQSx1QkFBTyxJQUFQO0FBQ0g7O0FBRUQsZ0JBQUszQixVQUFVM0ksUUFBZixFQUEwQjs7QUFFdEI7QUFDQSxvQkFBSzdCLE1BQU0sSUFBWCxFQUFrQjtBQUNkN0YsK0JBQVlnUyxJQUFaLEVBQWtCdEssUUFBbEI7QUFFSCxpQkFIRCxNQUdPO0FBQ0hyTyxzQkFBRUcsUUFBRixDQUFXMFAsT0FBWCxDQUFvQnBMLFFBQVF3SyxNQUFSLENBQWVNLFdBQWYsQ0FBNEIseUJBQTVCLENBQXBCLEVBQTZFLDREQUE0RHlILE1BQXpJLEVBQWlKM0ksUUFBakosRUFBMkpzSyxJQUEzSjtBQUNIO0FBRUosYUFWRCxNQVVPO0FBQ0hBO0FBQ0g7O0FBRUQsbUJBQU8sSUFBUDtBQUNILFNBMytEd0I7O0FBOCtEekI7QUFDQTs7QUFFQUMsaUJBQVUsaUJBQVVwTSxDQUFWLEVBQWM7QUFDcEIsZ0JBQUk5RSxPQUFRLElBQVo7QUFBQSxnQkFDSWtPLFFBQVE1VixFQUFHLE1BQUgsQ0FEWjtBQUFBLGdCQUVJbU4sUUFGSjtBQUFBLGdCQUdJZ0wsTUFISjs7QUFLQXpRLGlCQUFLakQsT0FBTCxDQUFhd0ssTUFBYixDQUFvQnJFLE9BQXBCLENBQTZCLFNBQTdCOztBQUVBbEQsaUJBQUs2QyxLQUFMLENBQVdDLFNBQVgsQ0FBcUI2TCxLQUFyQixHQUE2QnBNLE1BQTdCOztBQUVBdkMsaUJBQUtrRCxPQUFMLENBQWMsWUFBZCxFQUE0QjRCLENBQTVCOztBQUVBO0FBQ0EsZ0JBQUs5RSxLQUFLYSxVQUFMLElBQW1CLENBQUMsQ0FBQ2IsS0FBS2pELE9BQUwsQ0FBYStDLElBQWIsQ0FBa0J4RSxTQUE1QyxFQUF3RDtBQUNwRDBFLHFCQUFLYSxVQUFMLENBQWdCa0YsS0FBaEI7QUFDSDs7QUFFRC9GLGlCQUFLakQsT0FBTCxHQUFlLElBQWY7O0FBRUE7QUFDQTBJLHVCQUFXbk4sRUFBRUcsUUFBRixDQUFXa0osV0FBWCxFQUFYOztBQUVBLGdCQUFLOEQsUUFBTCxFQUFnQjtBQUNaQSx5QkFBU3RDLFFBQVQ7QUFFSCxhQUhELE1BR087O0FBRUg5RSxtQkFBR29ELFNBQUgsQ0FBY3pCLEtBQUt5QixTQUFuQixFQUErQkMsVUFBL0IsQ0FBMkMxQixLQUFLMEIsVUFBaEQ7O0FBRUF3TSxzQkFBTXJHLFdBQU4sQ0FBbUIsMENBQW5COztBQUVBLG9CQUFLcUcsTUFBTXRJLFFBQU4sQ0FBZ0IsaUJBQWhCLENBQUwsRUFBMkM7QUFDdkM2Syw2QkFBU2xRLFNBQVNsSSxTQUFTNEosSUFBVCxDQUFjMUMsS0FBZCxDQUFvQm1JLEdBQTdCLEVBQWtDLEVBQWxDLENBQVQ7O0FBRUF3RywwQkFBTXJHLFdBQU4sQ0FBbUIsaUJBQW5CLEVBQXVDN04sR0FBdkMsQ0FBNEMsS0FBNUMsRUFBbUQsRUFBbkQsRUFBd0R5SCxTQUF4RCxDQUFtRWdQLFNBQVMsQ0FBQyxDQUE3RTtBQUNIOztBQUVEblksa0JBQUcsMEJBQUgsRUFBZ0NpSyxNQUFoQztBQUVIO0FBRUosU0ExaEV3Qjs7QUE2aEV6QjtBQUNBOztBQUVBVyxpQkFBVSxpQkFBVWlPLElBQVYsRUFBZ0J0SyxLQUFoQixFQUF3QjtBQUM5QixnQkFBSXVLLE9BQVFDLE1BQU1uUSxTQUFOLENBQWdCb1EsS0FBaEIsQ0FBc0JDLElBQXRCLENBQTJCQyxTQUEzQixFQUFzQyxDQUF0QyxDQUFaO0FBQUEsZ0JBQ0l4UixPQUFRLElBRFo7QUFBQSxnQkFFSXZCLE1BQVFvSSxTQUFTQSxNQUFNL0csSUFBZixHQUFzQitHLEtBQXRCLEdBQThCN0csS0FBS2pELE9BRi9DO0FBQUEsZ0JBR0k2TixHQUhKOztBQUtBLGdCQUFLbk0sR0FBTCxFQUFXO0FBQ1AyUyxxQkFBS0ssT0FBTCxDQUFjaFQsR0FBZDtBQUVILGFBSEQsTUFHTztBQUNIQSxzQkFBTXVCLElBQU47QUFDSDs7QUFFRG9SLGlCQUFLSyxPQUFMLENBQWN6UixJQUFkOztBQUVBLGdCQUFLMUgsRUFBRXFTLFVBQUYsQ0FBY2xNLElBQUlxQixJQUFKLENBQVVxUixJQUFWLENBQWQsQ0FBTCxFQUF3QztBQUNwQ3ZHLHNCQUFNbk0sSUFBSXFCLElBQUosQ0FBVXFSLElBQVYsRUFBaUI5TSxLQUFqQixDQUF3QjVGLEdBQXhCLEVBQTZCMlMsSUFBN0IsQ0FBTjtBQUNIOztBQUVELGdCQUFLeEcsUUFBUSxLQUFiLEVBQXFCO0FBQ2pCLHVCQUFPQSxHQUFQO0FBQ0g7O0FBRUQsZ0JBQUt1RyxTQUFTLFlBQVQsSUFBeUIsQ0FBQ25SLEtBQUs2QyxLQUFwQyxFQUE0QztBQUN4Q3ZFLG1CQUFHNEUsT0FBSCxDQUFZaU8sT0FBTyxLQUFuQixFQUEwQkMsSUFBMUI7QUFFSCxhQUhELE1BR087QUFDSHBSLHFCQUFLNkMsS0FBTCxDQUFXQyxTQUFYLENBQXFCSSxPQUFyQixDQUE4QmlPLE9BQU8sS0FBckMsRUFBNENDLElBQTVDO0FBQ0g7QUFFSixTQTlqRXdCOztBQWlrRXpCO0FBQ0E7O0FBRUEvSix3QkFBaUIsd0JBQVdxSyxLQUFYLEVBQW1COztBQUVoQyxnQkFBSTFSLE9BQU8sSUFBWDs7QUFFQSxnQkFBSWpELFVBQVdpRCxLQUFLakQsT0FBcEI7QUFBQSxnQkFDSWdELFFBQVdoRCxRQUFRZ0QsS0FEdkI7QUFBQSxnQkFFSXFFLFVBQVdySCxRQUFRK0MsSUFBUixDQUFhc0UsT0FGNUI7QUFBQSxnQkFHSTdDLGFBQWF2QixLQUFLNkMsS0FBTCxDQUFXQyxTQUg1QjtBQUFBLGdCQUlJNk8sV0FBYTNSLEtBQUs2QyxLQUFMLENBQVd1QixPQUo1Qjs7QUFNQTtBQUNBckgsb0JBQVF3SyxNQUFSLENBQWVyRSxPQUFmLENBQXdCLFNBQXhCOztBQUVBbEQsaUJBQUsyUixRQUFMLEdBQWdCdk4sV0FBV0EsUUFBUTFFLE1BQW5CLEdBQTRCaVMsU0FBUzNDLElBQVQsQ0FBZTVLLE9BQWYsQ0FBNUIsR0FBdUQsSUFBdkU7O0FBRUEsZ0JBQUssQ0FBQ3BFLEtBQUs0UixnQkFBTixJQUEwQixDQUFDNVIsS0FBS29HLE1BQXJDLEVBQThDO0FBQzFDcEcscUJBQUtxRyxZQUFMO0FBQ0g7O0FBRUQ7QUFDQTlFLHVCQUFXMEIsSUFBWCxDQUFnQix1QkFBaEIsRUFBeUMrTCxJQUF6QyxDQUErQ2hQLEtBQUtLLEtBQUwsQ0FBV1gsTUFBMUQ7QUFDQTZCLHVCQUFXMEIsSUFBWCxDQUFnQix1QkFBaEIsRUFBeUMrTCxJQUF6QyxDQUErQ2pQLFFBQVEsQ0FBdkQ7O0FBRUF3Qix1QkFBVzBCLElBQVgsQ0FBZ0Isc0JBQWhCLEVBQXdDNE8sSUFBeEMsQ0FBOEMsVUFBOUMsRUFBNEQsQ0FBQzlVLFFBQVErQyxJQUFSLENBQWFqSCxJQUFkLElBQXNCa0gsU0FBUyxDQUEzRjtBQUNBd0IsdUJBQVcwQixJQUFYLENBQWdCLHNCQUFoQixFQUF3QzRPLElBQXhDLENBQThDLFVBQTlDLEVBQTRELENBQUM5VSxRQUFRK0MsSUFBUixDQUFhakgsSUFBZCxJQUFzQmtILFNBQVNDLEtBQUtLLEtBQUwsQ0FBV1gsTUFBWCxHQUFvQixDQUEvRzs7QUFFQSxnQkFBSzNDLFFBQVFFLElBQVIsS0FBaUIsT0FBdEIsRUFBZ0M7O0FBRTVCO0FBQ0FzRSwyQkFBVzBCLElBQVgsQ0FBZ0IsMEJBQWhCLEVBQTRDaEosSUFBNUMsQ0FBa0QsTUFBbEQsRUFBMEQ4QyxRQUFRK0MsSUFBUixDQUFhckcsS0FBYixDQUFtQm9LLEdBQW5CLElBQTBCOUcsUUFBUThHLEdBQTVGLEVBQWtHMkIsSUFBbEc7QUFFSCxhQUxELE1BS087QUFDSGpFLDJCQUFXMEIsSUFBWCxDQUFnQiwrQ0FBaEIsRUFBaUVzQyxJQUFqRTtBQUNIO0FBQ0osU0F0bUV3Qjs7QUF3bUV6QjtBQUNBOztBQUVBaUIsc0JBQWUsd0JBQVk7O0FBRXZCLGlCQUFLb0wsZ0JBQUwsR0FBd0IsSUFBeEI7O0FBRUEsaUJBQUsvTyxLQUFMLENBQVdDLFNBQVgsQ0FBcUIrRSxXQUFyQixDQUFrQyxxRkFBbEM7QUFFSCxTQWpuRXdCOztBQW1uRXpCeEIsc0JBQWUsd0JBQVc7QUFDdEIsZ0JBQUlyRyxPQUFPLElBQVg7QUFDQSxnQkFBSUYsT0FBT0UsS0FBS2pELE9BQUwsR0FBZWlELEtBQUtqRCxPQUFMLENBQWErQyxJQUE1QixHQUFtQ0UsS0FBS0YsSUFBbkQ7QUFDQSxnQkFBSXlCLGFBQWF2QixLQUFLNkMsS0FBTCxDQUFXQyxTQUE1Qjs7QUFFQTlDLGlCQUFLNFIsZ0JBQUwsR0FBMEIsS0FBMUI7QUFDQTVSLGlCQUFLbUcsa0JBQUwsR0FBMEIsQ0FBMUI7O0FBRUE1RSx1QkFDS3VRLFdBREwsQ0FDa0IsdUJBRGxCLEVBQzJDLENBQUMsRUFBR2hTLEtBQUszRyxPQUFMLElBQWdCMkcsS0FBSzFHLE9BQXhCLENBRDVDLEVBRUswWSxXQUZMLENBRWtCLHVCQUZsQixFQUUyQyxDQUFDLEVBQUdoUyxLQUFLNUcsT0FBTCxJQUFnQjhHLEtBQUtLLEtBQUwsQ0FBV1gsTUFBWCxHQUFvQixDQUF2QyxDQUY1QyxFQUdLb1MsV0FITCxDQUdrQixtQkFIbEIsRUFHMkMsQ0FBQyxFQUFHaFMsS0FBSzdHLE1BQUwsSUFBZStHLEtBQUtLLEtBQUwsQ0FBV1gsTUFBWCxHQUFvQixDQUF0QyxDQUg1QyxFQUlLb1MsV0FKTCxDQUlrQixtQkFKbEIsRUFJMkMsQ0FBQyxDQUFDaFMsS0FBS3RHLEtBSmxEOztBQU1BLGdCQUFLd0csS0FBSzJSLFFBQVYsRUFBcUI7QUFDakJwUSwyQkFBV0ssUUFBWCxDQUFxQix3QkFBckI7QUFFSCxhQUhELE1BR087QUFDSkwsMkJBQVdzRyxXQUFYLENBQXdCLHVCQUF4QjtBQUNIO0FBRUosU0F4b0V5Qjs7QUEyb0UxQjtBQUNBOztBQUVBa0ssd0JBQWlCLDBCQUFXO0FBQ3hCLGdCQUFLLEtBQUtILGdCQUFWLEVBQTZCO0FBQ3pCLHFCQUFLdkwsWUFBTDtBQUVILGFBSEQsTUFHTztBQUNILHFCQUFLRyxZQUFMO0FBQ0g7QUFFSjs7QUF0cEV5QixLQUE3Qjs7QUE0cEVBbE8sTUFBRUcsUUFBRixHQUFhOztBQUVUdVosaUJBQVcsT0FGRjtBQUdUcFosa0JBQVdBLFFBSEY7O0FBTVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQStJLHFCQUFjLHFCQUFXc1EsT0FBWCxFQUFxQjtBQUMvQixnQkFBSXhNLFdBQVduTixFQUFFLHNEQUFGLEVBQTBEdUIsSUFBMUQsQ0FBZ0UsVUFBaEUsQ0FBZjtBQUNBLGdCQUFJdVgsT0FBV0MsTUFBTW5RLFNBQU4sQ0FBZ0JvUSxLQUFoQixDQUFzQkMsSUFBdEIsQ0FBMkJDLFNBQTNCLEVBQXNDLENBQXRDLENBQWY7O0FBRUEsZ0JBQUsvTCxvQkFBb0I3RixRQUF6QixFQUFvQzs7QUFFaEMsb0JBQUt0SCxFQUFFMkUsSUFBRixDQUFRZ1YsT0FBUixNQUFzQixRQUEzQixFQUFzQztBQUNsQ3hNLDZCQUFVd00sT0FBVixFQUFvQjVOLEtBQXBCLENBQTJCb0IsUUFBM0IsRUFBcUMyTCxJQUFyQztBQUVILGlCQUhELE1BR08sSUFBSzlZLEVBQUUyRSxJQUFGLENBQVFnVixPQUFSLE1BQXNCLFVBQTNCLEVBQXdDO0FBQzNDQSw0QkFBUTVOLEtBQVIsQ0FBZW9CLFFBQWYsRUFBeUIyTCxJQUF6QjtBQUNIOztBQUVELHVCQUFPM0wsUUFBUDtBQUNIOztBQUVELG1CQUFPLEtBQVA7QUFFSCxTQXBDUTs7QUF1Q1Q7QUFDQTs7QUFFQXlNLGNBQU8sY0FBV3pPLEtBQVgsRUFBa0IzRCxJQUFsQixFQUF3QkMsS0FBeEIsRUFBZ0M7QUFDbkMsbUJBQU8sSUFBSUgsUUFBSixDQUFjNkQsS0FBZCxFQUFxQjNELElBQXJCLEVBQTJCQyxLQUEzQixDQUFQO0FBQ0gsU0E1Q1E7O0FBK0NUO0FBQ0E7O0FBRUE5RSxlQUFRLGVBQVdrWCxHQUFYLEVBQWlCO0FBQ3JCLGdCQUFJMU0sV0FBVyxLQUFLOUQsV0FBTCxFQUFmOztBQUVBLGdCQUFLOEQsUUFBTCxFQUFnQjtBQUNaQSx5QkFBU3hLLEtBQVQ7O0FBRUE7O0FBRUEsb0JBQUtrWCxRQUFRLElBQWIsRUFBb0I7QUFDaEIseUJBQUtsWCxLQUFMO0FBQ0g7QUFDSjtBQUVKLFNBL0RROztBQWlFVDtBQUNBOztBQUVBbVgsaUJBQVUsbUJBQVc7O0FBRWpCLGlCQUFLblgsS0FBTCxDQUFZLElBQVo7O0FBRUFxRCxlQUFHbUksR0FBSCxDQUFRLGdCQUFSO0FBRUgsU0ExRVE7O0FBNkVUO0FBQ0E7O0FBRUF2RyxrQkFBVzdILFNBQVNnYSxXQUFULEtBQXlCOVosU0FBekIsSUFBc0MsaUVBQWlFc0osSUFBakUsQ0FBc0VDLFVBQVVDLFNBQWhGLENBaEZ4Qzs7QUFtRlQ7QUFDQTs7QUFFQXVRLGVBQVMsWUFBVztBQUNoQixnQkFBSUMsTUFBTWxhLFNBQVNnSCxhQUFULENBQXVCLEtBQXZCLENBQVY7O0FBRUEsbUJBQU9qSCxPQUFPb2EsZ0JBQVAsSUFBMkJwYSxPQUFPb2EsZ0JBQVAsQ0FBeUJELEdBQXpCLEVBQStCRSxnQkFBL0IsQ0FBZ0QsV0FBaEQsQ0FBM0IsSUFBMkYsRUFBRXBhLFNBQVNxYSxZQUFULElBQXlCcmEsU0FBU3FhLFlBQVQsR0FBd0IsRUFBbkQsQ0FBbEc7QUFDSCxTQUpRLEVBdEZBOztBQTRGVDtBQUNBO0FBQ0E7O0FBRUFwTCxzQkFBZSxzQkFBVTdILEdBQVYsRUFBZ0I7QUFDM0IsZ0JBQUlrVCxNQUFKOztBQUVBLGdCQUFLLENBQUNsVCxHQUFELElBQVEsQ0FBQ0EsSUFBSUMsTUFBbEIsRUFBMkI7QUFDdkIsdUJBQU8sS0FBUDtBQUNIOztBQUVEaVQscUJBQVVsVCxJQUFJbVQsRUFBSixDQUFRLENBQVIsRUFBWTVZLEdBQVosQ0FBZ0IsV0FBaEIsQ0FBVjs7QUFFQSxnQkFBSzJZLFVBQVVBLE9BQU9FLE9BQVAsQ0FBZ0IsUUFBaEIsTUFBK0IsQ0FBQyxDQUEvQyxFQUFtRDtBQUMvQ0YseUJBQVNBLE9BQU9yTyxLQUFQLENBQWEsR0FBYixFQUFrQixDQUFsQixDQUFUO0FBQ0FxTyx5QkFBU0EsT0FBT3JPLEtBQVAsQ0FBYSxHQUFiLEVBQWtCLENBQWxCLENBQVQ7QUFDQXFPLHlCQUFTQSxPQUFPck8sS0FBUCxDQUFhLEdBQWIsQ0FBVDtBQUNILGFBSkQsTUFJTztBQUNIcU8seUJBQVMsRUFBVDtBQUNIOztBQUVELGdCQUFLQSxPQUFPalQsTUFBWixFQUFxQjs7QUFFakI7QUFDQSxvQkFBS2lULE9BQU9qVCxNQUFQLEdBQWdCLEVBQXJCLEVBQTBCO0FBQ3RCaVQsNkJBQVMsQ0FBRUEsT0FBTyxFQUFQLENBQUYsRUFBY0EsT0FBTyxFQUFQLENBQWQsRUFBMEJBLE9BQU8sQ0FBUCxDQUExQixFQUFxQ0EsT0FBTyxDQUFQLENBQXJDLENBQVQ7QUFFSCxpQkFIRCxNQUdPO0FBQ0hBLDZCQUFTLENBQUVBLE9BQU8sQ0FBUCxDQUFGLEVBQWFBLE9BQU8sQ0FBUCxDQUFiLEVBQXdCQSxPQUFPLENBQVAsQ0FBeEIsRUFBbUNBLE9BQU8sQ0FBUCxDQUFuQyxDQUFUO0FBQ0g7O0FBRURBLHlCQUFTQSxPQUFPdkcsR0FBUCxDQUFXd0UsVUFBWCxDQUFUO0FBRUgsYUFaRCxNQVlPO0FBQ0grQix5QkFBUyxDQUFFLENBQUYsRUFBSyxDQUFMLEVBQVEsQ0FBUixFQUFXLENBQVgsQ0FBVDs7QUFFQSxvQkFBSUcsYUFBYSxnQ0FBakI7QUFDQSxvQkFBSUMsV0FBV0QsV0FBV0UsSUFBWCxDQUFpQnZULElBQUltVCxFQUFKLENBQVEsQ0FBUixFQUFZM1ksSUFBWixDQUFpQixPQUFqQixDQUFqQixDQUFmOztBQUVBLG9CQUFLOFksUUFBTCxFQUFnQjtBQUNaSiwyQkFBUSxDQUFSLElBQWMvQixXQUFZbUMsU0FBUyxDQUFULENBQVosQ0FBZDtBQUNBSiwyQkFBUSxDQUFSLElBQWMvQixXQUFZbUMsU0FBUyxDQUFULENBQVosQ0FBZDtBQUNIO0FBQ0o7O0FBRUQsbUJBQU87QUFDSHJMLHFCQUFVaUwsT0FBUSxDQUFSLENBRFA7QUFFSGxMLHNCQUFVa0wsT0FBUSxDQUFSLENBRlA7QUFHSHhKLHdCQUFVd0osT0FBUSxDQUFSLENBSFA7QUFJSHZKLHdCQUFVdUosT0FBUSxDQUFSLENBSlA7QUFLSG5ELHlCQUFVb0IsV0FBWW5SLElBQUl6RixHQUFKLENBQVEsU0FBUixDQUFaLENBTFA7QUFNSGtPLHVCQUFVekksSUFBSXlJLEtBQUosRUFOUDtBQU9Ib0Isd0JBQVU3SixJQUFJNkosTUFBSjtBQVBQLGFBQVA7QUFVSCxTQW5KUTs7QUFzSlQ7QUFDQTtBQUNBOztBQUVBZ0Isc0JBQWUsc0JBQVU3SyxHQUFWLEVBQWV3VCxLQUFmLEVBQXVCO0FBQ2xDLGdCQUFJNVAsTUFBTyxFQUFYO0FBQ0EsZ0JBQUlySixNQUFPLEVBQVg7O0FBRUEsZ0JBQUssQ0FBQ3lGLEdBQUQsSUFBUSxDQUFDd1QsS0FBZCxFQUFzQjtBQUNsQjtBQUNIOztBQUVELGdCQUFLQSxNQUFNeEwsSUFBTixLQUFlbFAsU0FBZixJQUE0QjBhLE1BQU12TCxHQUFOLEtBQWNuUCxTQUEvQyxFQUEyRDtBQUN2RDhLLHNCQUFNLENBQUU0UCxNQUFNeEwsSUFBTixLQUFlbFAsU0FBZixHQUEyQmtILElBQUl5VCxRQUFKLEdBQWV6TCxJQUExQyxHQUFpRHdMLE1BQU14TCxJQUF6RCxJQUFtRSxNQUFuRSxJQUE4RXdMLE1BQU12TCxHQUFOLEtBQWNuUCxTQUFkLEdBQTBCa0gsSUFBSXlULFFBQUosR0FBZXhMLEdBQXpDLEdBQStDdUwsTUFBTXZMLEdBQW5JLElBQTJJLElBQWpKOztBQUVBLG9CQUFLLEtBQUs0SyxLQUFWLEVBQWtCO0FBQ2RqUCwwQkFBTSxpQkFBaUJBLEdBQWpCLEdBQXVCLFFBQTdCO0FBRUgsaUJBSEQsTUFHTztBQUNIQSwwQkFBTSxlQUFlQSxHQUFmLEdBQXFCLEdBQTNCO0FBQ0g7QUFDSjs7QUFFRCxnQkFBSzRQLE1BQU05SixNQUFOLEtBQWlCNVEsU0FBakIsSUFBOEIwYSxNQUFNN0osTUFBTixLQUFpQjdRLFNBQXBELEVBQWdFO0FBQzVEOEssc0JBQU0sQ0FBQ0EsSUFBSTNELE1BQUosR0FBYTJELE1BQU0sR0FBbkIsR0FBeUIsRUFBMUIsSUFBZ0MsUUFBaEMsR0FBMkM0UCxNQUFNOUosTUFBakQsR0FBMEQsSUFBMUQsR0FBaUU4SixNQUFNN0osTUFBdkUsR0FBZ0YsR0FBdEY7QUFDSDs7QUFFRCxnQkFBSy9GLElBQUkzRCxNQUFULEVBQWtCO0FBQ2QxRixvQkFBSW1aLFNBQUosR0FBZ0I5UCxHQUFoQjtBQUNIOztBQUVELGdCQUFLNFAsTUFBTXpELE9BQU4sS0FBa0JqWCxTQUF2QixFQUFtQztBQUMvQnlCLG9CQUFJd1YsT0FBSixHQUFjeUQsTUFBTXpELE9BQXBCO0FBQ0g7O0FBRUQsZ0JBQUt5RCxNQUFNL0ssS0FBTixLQUFnQjNQLFNBQXJCLEVBQWlDO0FBQzdCeUIsb0JBQUlrTyxLQUFKLEdBQVkrSyxNQUFNL0ssS0FBbEI7QUFDSDs7QUFFRCxnQkFBSytLLE1BQU0zSixNQUFOLEtBQWlCL1EsU0FBdEIsRUFBa0M7QUFDOUJ5QixvQkFBSXNQLE1BQUosR0FBYTJKLE1BQU0zSixNQUFuQjtBQUNIOztBQUVELG1CQUFPN0osSUFBSXpGLEdBQUosQ0FBU0EsR0FBVCxDQUFQO0FBQ0gsU0FsTVE7O0FBcU1UO0FBQ0E7O0FBRUFtTyxpQkFBVSxpQkFBVzFJLEdBQVgsRUFBZ0IyVCxFQUFoQixFQUFvQnpNLFFBQXBCLEVBQThCM0gsUUFBOUIsRUFBd0NxVSxrQkFBeEMsRUFBNkQ7QUFDbkUsZ0JBQUsvYSxFQUFFcVMsVUFBRixDQUFjaEUsUUFBZCxDQUFMLEVBQWdDO0FBQzVCM0gsMkJBQVcySCxRQUFYO0FBQ0FBLDJCQUFXLElBQVg7QUFDSDs7QUFFRCxnQkFBSyxDQUFDck8sRUFBRXlMLGFBQUYsQ0FBaUJxUCxFQUFqQixDQUFOLEVBQThCO0FBQzFCM1Qsb0JBQUkySSxVQUFKLENBQWUsT0FBZjtBQUNIOztBQUVEM0ksZ0JBQUlvRixFQUFKLENBQVEzRixhQUFSLEVBQXVCLFVBQVM0RixDQUFULEVBQVk7O0FBRS9CO0FBQ0Esb0JBQUtBLEtBQUtBLEVBQUVNLGFBQVAsS0FBMEIsQ0FBQzNGLElBQUlvRyxFQUFKLENBQVFmLEVBQUVNLGFBQUYsQ0FBZ0JPLE1BQXhCLENBQUQsSUFBcUNiLEVBQUVNLGFBQUYsQ0FBZ0JrTyxZQUFoQixJQUFnQyxTQUEvRixDQUFMLEVBQWtIO0FBQzlHO0FBQ0g7O0FBRURoYixrQkFBRUcsUUFBRixDQUFXc1AsSUFBWCxDQUFpQnRJLEdBQWpCOztBQUVBLG9CQUFLbkgsRUFBRXlMLGFBQUYsQ0FBaUJxUCxFQUFqQixDQUFMLEVBQTZCOztBQUV6Qix3QkFBS0EsR0FBR2pLLE1BQUgsS0FBYzVRLFNBQWQsSUFBMkI2YSxHQUFHaEssTUFBSCxLQUFjN1EsU0FBOUMsRUFBMEQ7QUFDdERrSCw0QkFBSXpGLEdBQUosQ0FBUyxxQkFBVCxFQUFnQyxFQUFoQzs7QUFFQW9aLDJCQUFHbEwsS0FBSCxHQUFZRixLQUFLQyxLQUFMLENBQVl4SSxJQUFJeUksS0FBSixLQUFla0wsR0FBR2pLLE1BQTlCLENBQVo7QUFDQWlLLDJCQUFHOUosTUFBSCxHQUFZdEIsS0FBS0MsS0FBTCxDQUFZeEksSUFBSTZKLE1BQUosS0FBZThKLEdBQUdoSyxNQUE5QixDQUFaOztBQUVBZ0ssMkJBQUdqSyxNQUFILEdBQVksQ0FBWjtBQUNBaUssMkJBQUdoSyxNQUFILEdBQVksQ0FBWjs7QUFFQTlRLDBCQUFFRyxRQUFGLENBQVc2UixZQUFYLENBQXlCN0ssR0FBekIsRUFBOEIyVCxFQUE5QjtBQUNIO0FBRUosaUJBZEQsTUFjTyxJQUFLQyx1QkFBdUIsSUFBNUIsRUFBbUM7QUFDdEM1VCx3QkFBSW9JLFdBQUosQ0FBaUJ1TCxFQUFqQjtBQUNIOztBQUVELG9CQUFLOWEsRUFBRXFTLFVBQUYsQ0FBYzNMLFFBQWQsQ0FBTCxFQUFnQztBQUM1QkEsNkJBQVU4RixDQUFWO0FBQ0g7QUFFSixhQS9CRDs7QUFpQ0EsZ0JBQUt4TSxFQUFFc1AsU0FBRixDQUFhakIsUUFBYixDQUFMLEVBQStCO0FBQzNCbEgsb0JBQUl6RixHQUFKLENBQVMscUJBQVQsRUFBZ0MyTSxXQUFXLElBQTNDO0FBQ0g7O0FBRUQsZ0JBQUtyTyxFQUFFeUwsYUFBRixDQUFpQnFQLEVBQWpCLENBQUwsRUFBNkI7QUFDekI5YSxrQkFBRUcsUUFBRixDQUFXNlIsWUFBWCxDQUF5QjdLLEdBQXpCLEVBQThCMlQsRUFBOUI7QUFFSCxhQUhELE1BR087QUFDSDNULG9CQUFJbUMsUUFBSixDQUFjd1IsRUFBZDtBQUNIOztBQUVELGdCQUFLQSxHQUFHakssTUFBSCxJQUFhMUosSUFBSW1HLFFBQUosQ0FBYyxxQkFBZCxDQUFsQixFQUEwRDtBQUN0RG5HLG9CQUFJbVAsTUFBSixHQUFhaE4sUUFBYixDQUF1QixxQkFBdkI7QUFDSDs7QUFFRDtBQUNBbkMsZ0JBQUk1RixJQUFKLENBQVMsT0FBVCxFQUFrQm9GLFdBQVcsWUFBVztBQUNwQ1Esb0JBQUl5RCxPQUFKLENBQWEsZUFBYjtBQUNILGFBRmlCLEVBRWZ5RCxXQUFXLEVBRkksQ0FBbEI7QUFJSCxTQXZRUTs7QUF5UVRvQixjQUFPLGNBQVV0SSxHQUFWLEVBQWdCO0FBQ25CeU4seUJBQWN6TixJQUFJNUYsSUFBSixDQUFTLE9BQVQsQ0FBZDs7QUFFQTRGLGdCQUFJZ0gsR0FBSixDQUFTLGVBQVQsRUFBMkJ6TSxHQUEzQixDQUFnQyxxQkFBaEMsRUFBdUQsRUFBdkQ7O0FBRUEsZ0JBQUt5RixJQUFJbUcsUUFBSixDQUFjLHFCQUFkLENBQUwsRUFBNkM7QUFDekNuRyxvQkFBSW1QLE1BQUosR0FBYS9HLFdBQWIsQ0FBMEIscUJBQTFCO0FBQ0g7QUFDSjs7QUFqUlEsS0FBYjs7QUFzUkE7QUFDQTs7QUFFQSxhQUFTMEwsSUFBVCxDQUFlek8sQ0FBZixFQUFtQjtBQUNmLFlBQUkwTyxVQUFVbGIsRUFBR3dNLEVBQUUyTyxhQUFMLENBQWQ7QUFBQSxZQUNJM1QsT0FBT2dGLEVBQUVqTCxJQUFGLEdBQVNpTCxFQUFFakwsSUFBRixDQUFPbUssT0FBaEIsR0FBMEIsRUFEckM7QUFBQSxZQUVJdEIsUUFBUThRLFFBQVF2WixJQUFSLENBQWMsZUFBZCxLQUFtQyxFQUYvQztBQUFBLFlBR0k4RixRQUFRLENBSFo7QUFBQSxZQUlJMEQsUUFBVSxFQUpkOztBQU1BO0FBQ0EsWUFBS3FCLEVBQUU0TyxrQkFBRixFQUFMLEVBQThCO0FBQzFCO0FBQ0g7O0FBRUQ1TyxVQUFFRSxjQUFGOztBQUVBO0FBQ0EsWUFBS3RDLEtBQUwsRUFBYTtBQUNUZSxvQkFBUTNELEtBQUs2VCxRQUFMLEdBQWdCcmIsRUFBR3dILEtBQUs2VCxRQUFSLENBQWhCLEdBQXVDN08sRUFBRWpMLElBQUYsR0FBU2lMLEVBQUVqTCxJQUFGLENBQU80SixLQUFoQixHQUF3QixFQUF2RTtBQUNBQSxvQkFBUUEsTUFBTS9ELE1BQU4sR0FBZStELE1BQU1lLE1BQU4sQ0FBYyxxQkFBcUI5QixLQUFyQixHQUE2QixJQUEzQyxDQUFmLEdBQW1FcEssRUFBRyxxQkFBcUJvSyxLQUFyQixHQUE2QixJQUFoQyxDQUEzRTs7QUFFQTNDLG9CQUFRMEQsTUFBTTFELEtBQU4sQ0FBYXlULE9BQWIsQ0FBUjs7QUFFQTtBQUNBO0FBQ0EsZ0JBQUt6VCxRQUFRLENBQWIsRUFBaUI7QUFDYkEsd0JBQVEsQ0FBUjtBQUNIO0FBRUosU0FaRCxNQVlPO0FBQ0gwRCxvQkFBUSxDQUFFK1AsT0FBRixDQUFSO0FBQ0g7O0FBRURsYixVQUFFRyxRQUFGLENBQVd5WixJQUFYLENBQWlCek8sS0FBakIsRUFBd0IzRCxJQUF4QixFQUE4QkMsS0FBOUI7QUFDSDs7QUFHRDtBQUNBOztBQUVBekgsTUFBRUUsRUFBRixDQUFLQyxRQUFMLEdBQWdCLFVBQVV1TCxPQUFWLEVBQW1CO0FBQy9CLFlBQUkyUCxRQUFKOztBQUVBM1Asa0JBQVdBLFdBQVcsRUFBdEI7QUFDQTJQLG1CQUFXM1AsUUFBUTJQLFFBQVIsSUFBb0IsS0FBL0I7O0FBRUEsWUFBS0EsUUFBTCxFQUFnQjs7QUFFWnJiLGNBQUcsTUFBSCxFQUFZbU8sR0FBWixDQUFpQixnQkFBakIsRUFBbUNrTixRQUFuQyxFQUE4QzlPLEVBQTlDLENBQWtELGdCQUFsRCxFQUFvRThPLFFBQXBFLEVBQThFO0FBQzFFM1AseUJBQVVBO0FBRGdFLGFBQTlFLEVBRUd1UCxJQUZIO0FBSUgsU0FORCxNQU1POztBQUVILGlCQUFLOU0sR0FBTCxDQUFVLGdCQUFWLEVBQTZCNUIsRUFBN0IsQ0FBaUMsZ0JBQWpDLEVBQW1EO0FBQy9DcEIsdUJBQVUsSUFEcUM7QUFFL0NPLHlCQUFVQTtBQUZxQyxhQUFuRCxFQUdHdVAsSUFISDtBQUtIOztBQUVELGVBQU8sSUFBUDtBQUNILEtBdEJEOztBQXlCQTtBQUNBOztBQUVBalYsT0FBR3VHLEVBQUgsQ0FBTyxnQkFBUCxFQUF5QixpQkFBekIsRUFBNEMwTyxJQUE1QztBQUVILENBNytGQyxFQTYrRkNuYixNQTcrRkQsRUE2K0ZTQyxRQTcrRlQsRUE2K0ZtQkQsT0FBT3diLE1BQVAsSUFBaUJBLE1BNytGcEMsQ0FBRDs7QUErK0ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUUsV0FBVXRiLENBQVYsRUFBYTs7QUFFZDs7QUFFQTs7QUFFQSxRQUFJdWIsU0FBUyxTQUFUQSxNQUFTLENBQVV2SSxHQUFWLEVBQWVWLEdBQWYsRUFBb0JrSixNQUFwQixFQUE0QjtBQUN4QyxZQUFLLENBQUN4SSxHQUFOLEVBQVk7QUFDWDtBQUNBOztBQUVEd0ksaUJBQVNBLFVBQVUsRUFBbkI7O0FBRUEsWUFBS3hiLEVBQUUyRSxJQUFGLENBQU82VyxNQUFQLE1BQW1CLFFBQXhCLEVBQW1DO0FBQ2xDQSxxQkFBU3hiLEVBQUV5YixLQUFGLENBQVFELE1BQVIsRUFBZ0IsSUFBaEIsQ0FBVDtBQUNBOztBQUVEeGIsVUFBRW1LLElBQUYsQ0FBT21JLEdBQVAsRUFBWSxVQUFVUCxHQUFWLEVBQWUzSCxLQUFmLEVBQXNCO0FBQ2pDNEksa0JBQU1BLElBQUkxSSxPQUFKLENBQVksTUFBTXlILEdBQWxCLEVBQXVCM0gsU0FBUyxFQUFoQyxDQUFOO0FBQ0EsU0FGRDs7QUFJQSxZQUFJb1IsT0FBT3BVLE1BQVgsRUFBbUI7QUFDbEI0TCxtQkFBTyxDQUFDQSxJQUFJdUgsT0FBSixDQUFZLEdBQVosSUFBbUIsQ0FBbkIsR0FBdUIsR0FBdkIsR0FBNkIsR0FBOUIsSUFBcUNpQixNQUE1QztBQUNBOztBQUVELGVBQU94SSxHQUFQO0FBQ0EsS0FwQkQ7O0FBc0JBOztBQUVBLFFBQUkxUyxXQUFXO0FBQ2RvYixpQkFBVTtBQUNUQyxxQkFBVSx1SkFERDtBQUVUSCxvQkFBVTtBQUNUSSwwQkFBVyxDQURGO0FBRVRDLDBCQUFXLENBRkY7QUFHVEMsb0JBQU0sQ0FIRztBQUlUQyxxQkFBTSxDQUpHO0FBS1RDLG9CQUFNLENBTEc7QUFNVEMsdUJBQVEsYUFOQztBQU9UQyw2QkFBYyxDQVBMO0FBUVRDLHVCQUFRO0FBUkMsYUFGRDtBQVlUQyx3QkFBYSxDQVpKO0FBYVR6WCxrQkFBUSxRQWJDO0FBY1RxTyxpQkFBUSw0QkFkQztBQWVUdUIsbUJBQVE7QUFmQyxTQURJOztBQW1CZDhILGVBQVE7QUFDUFYscUJBQVUsbUNBREg7QUFFUEgsb0JBQVU7QUFDVEksMEJBQVcsQ0FERjtBQUVUSSxvQkFBSyxDQUZJO0FBR1RNLDRCQUFnQixDQUhQO0FBSVRDLDZCQUFnQixDQUpQO0FBS1RDLCtCQUFnQixDQUxQO0FBTVRDLDRCQUFnQixDQU5QO0FBT1RDLHFCQUFNO0FBUEcsYUFGSDtBQVdQTix3QkFBYSxDQVhOO0FBWVB6WCxrQkFBTyxRQVpBO0FBYVBxTyxpQkFBTTtBQWJDLFNBbkJNOztBQW1DZDJKLGtCQUFXO0FBQ1ZoQixxQkFBVSxtQ0FEQTtBQUVWaFgsa0JBQVUsUUFGQTtBQUdWcU8saUJBQVU7QUFIQSxTQW5DRzs7QUF5Q2Q0SixxQkFBYztBQUNiakIscUJBQVUscUNBREc7QUFFYkgsb0JBQVM7QUFDUnFCLGlDQUFrQixDQURWO0FBRVIxWiwyQkFBWTtBQUZKLGFBRkk7QUFNYndCLGtCQUFPLFFBTk07QUFPYnFPLGlCQUFPO0FBUE0sU0F6Q0E7O0FBbURkOEosY0FBTztBQUNObkIscUJBQVUsa0NBREo7QUFFTmhYLGtCQUFVLFFBRko7QUFHTnFPLGlCQUFVO0FBSEosU0FuRE87O0FBeURkK0osbUJBQVk7QUFDWHBCLHFCQUFVLHdEQURDO0FBRVhoWCxrQkFBVSxPQUZDO0FBR1hxTyxpQkFBVTtBQUhDLFNBekRFOztBQStEZDtBQUNBO0FBQ0E7QUFDQTtBQUNBZ0ssb0JBQWE7QUFDWnJCLHFCQUFVLDJHQURFO0FBRVpoWCxrQkFBVSxRQUZFO0FBR1pxTyxpQkFBVSxhQUFVVixHQUFWLEVBQWU7QUFDeEIsdUJBQU8sbUJBQW1CQSxJQUFJLENBQUosQ0FBbkIsR0FBNEIsT0FBNUIsSUFBd0NBLElBQUksQ0FBSixJQUFTQSxJQUFJLENBQUosSUFBUyxLQUFULEdBQWlCNUMsS0FBS29DLEtBQUwsQ0FBYVEsSUFBSSxFQUFKLENBQWIsQ0FBakIsSUFBNkNBLElBQUksRUFBSixJQUFVQSxJQUFJLEVBQUosRUFBUWhJLE9BQVIsQ0FBZ0IsS0FBaEIsRUFBdUIsR0FBdkIsQ0FBVixHQUF3QyxFQUFyRixDQUFULEdBQXNHZ0ksSUFBSSxFQUFKLENBQTlJLElBQTBKLFVBQTFKLElBQXlLQSxJQUFJLEVBQUosS0FBV0EsSUFBSSxFQUFKLEVBQVFpSSxPQUFSLENBQWdCLFNBQWhCLElBQTZCLENBQXhDLEdBQTRDLFNBQTVDLEdBQXdELE9BQWpPLENBQVA7QUFDQTtBQUxXLFNBbkVDOztBQTJFZDtBQUNBO0FBQ0E7QUFDQTtBQUNBMEMscUJBQWM7QUFDYnRCLHFCQUFVLG1FQURHO0FBRWJoWCxrQkFBVSxRQUZHO0FBR2JxTyxpQkFBVSxhQUFVVixHQUFWLEVBQWU7QUFDeEIsdUJBQU8sbUJBQW1CQSxJQUFJLENBQUosQ0FBbkIsR0FBNEIsVUFBNUIsR0FBeUNBLElBQUksQ0FBSixFQUFPaEksT0FBUCxDQUFlLFFBQWYsRUFBeUIsSUFBekIsRUFBK0JBLE9BQS9CLENBQXVDLE9BQXZDLEVBQWdELEVBQWhELENBQXpDLEdBQStGLGVBQXRHO0FBQ0E7QUFMWTtBQS9FQSxLQUFmOztBQXdGQXRLLE1BQUVELFFBQUYsRUFBWXdNLEVBQVosQ0FBZSxvQkFBZixFQUFxQyxVQUFVQyxDQUFWLEVBQWFXLFFBQWIsRUFBdUJ6QyxJQUF2QixFQUE2Qjs7QUFFakUsWUFBSXNJLE1BQU90SSxLQUFLYSxHQUFMLElBQVksRUFBdkI7QUFBQSxZQUNDNUcsT0FBTyxLQURSO0FBQUEsWUFFQ25CLEtBRkQ7QUFBQSxZQUdDK1EsS0FIRDtBQUFBLFlBSUNqQyxHQUpEO0FBQUEsWUFLQ2tKLE1BTEQ7QUFBQSxZQU1DMEIsU0FORDtBQUFBLFlBT0NDLFFBUEQ7QUFBQSxZQVFDQyxRQVJEOztBQVVBNVosZ0JBQVF4RCxFQUFFMkgsTUFBRixDQUFVLElBQVYsRUFBZ0IsRUFBaEIsRUFBb0JySCxRQUFwQixFQUE4Qm9LLEtBQUtsRCxJQUFMLENBQVVoRSxLQUF4QyxDQUFSOztBQUVBO0FBQ0F4RCxVQUFFbUssSUFBRixDQUFPM0csS0FBUCxFQUFjLFVBQVc2WixZQUFYLEVBQXlCQyxZQUF6QixFQUF3QztBQUNyRGhMLGtCQUFNVSxJQUFJL0gsS0FBSixDQUFXcVMsYUFBYTNCLE9BQXhCLENBQU47O0FBRUEsZ0JBQUssQ0FBQ3JKLEdBQU4sRUFBWTtBQUNYO0FBQ0E7O0FBRUQzTixtQkFBVzJZLGFBQWEzWSxJQUF4QjtBQUNBd1ksdUJBQVcsRUFBWDs7QUFFQSxnQkFBS0csYUFBYWxCLFVBQWIsSUFBMkI5SixJQUFLZ0wsYUFBYWxCLFVBQWxCLENBQWhDLEVBQWlFO0FBQ2hFYyw0QkFBWTVLLElBQUtnTCxhQUFhbEIsVUFBbEIsQ0FBWjs7QUFFQSxvQkFBS2MsVUFBVyxDQUFYLEtBQWtCLEdBQXZCLEVBQTZCO0FBQzVCQSxnQ0FBWUEsVUFBVWpKLFNBQVYsQ0FBb0IsQ0FBcEIsQ0FBWjtBQUNBOztBQUVEaUosNEJBQVlBLFVBQVVsUixLQUFWLENBQWdCLEdBQWhCLENBQVo7O0FBRUEscUJBQU0sSUFBSXVSLElBQUksQ0FBZCxFQUFpQkEsSUFBSUwsVUFBVTlWLE1BQS9CLEVBQXVDLEVBQUVtVyxDQUF6QyxFQUE2QztBQUM1Qyx3QkFBSUMsSUFBSU4sVUFBV0ssQ0FBWCxFQUFldlIsS0FBZixDQUFxQixHQUFyQixFQUEwQixDQUExQixDQUFSOztBQUVBLHdCQUFLd1IsRUFBRXBXLE1BQUYsSUFBWSxDQUFqQixFQUFxQjtBQUNwQitWLGlDQUFVSyxFQUFFLENBQUYsQ0FBVixJQUFtQkMsbUJBQW9CRCxFQUFFLENBQUYsRUFBS2xULE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEdBQXBCLENBQXBCLENBQW5CO0FBQ0E7QUFDRDtBQUNEOztBQUVEa1IscUJBQVN4YixFQUFFMkgsTUFBRixDQUFVLElBQVYsRUFBZ0IsRUFBaEIsRUFBb0IyVixhQUFhOUIsTUFBakMsRUFBeUM5USxLQUFLbEQsSUFBTCxDQUFXNlYsWUFBWCxDQUF6QyxFQUFvRUYsUUFBcEUsQ0FBVDs7QUFFQW5LLGtCQUFRaFQsRUFBRTJFLElBQUYsQ0FBUTJZLGFBQWF0SyxHQUFyQixNQUErQixVQUEvQixHQUE0Q3NLLGFBQWF0SyxHQUFiLENBQWlCaUcsSUFBakIsQ0FBdUIsSUFBdkIsRUFBNkIzRyxHQUE3QixFQUFrQ2tKLE1BQWxDLEVBQTBDOVEsSUFBMUMsQ0FBNUMsR0FBK0Y2USxPQUFRK0IsYUFBYXRLLEdBQXJCLEVBQTBCVixHQUExQixFQUErQmtKLE1BQS9CLENBQXZHO0FBQ0FqSCxvQkFBUXZVLEVBQUUyRSxJQUFGLENBQVEyWSxhQUFhL0ksS0FBckIsTUFBaUMsVUFBakMsR0FBOEMrSSxhQUFhL0ksS0FBYixDQUFtQjBFLElBQW5CLENBQXlCLElBQXpCLEVBQStCM0csR0FBL0IsRUFBb0NrSixNQUFwQyxFQUE0QzlRLElBQTVDLENBQTlDLEdBQW1HNlEsT0FBUStCLGFBQWEvSSxLQUFyQixFQUE0QmpDLEdBQTVCLENBQTNHOztBQUVBLGdCQUFLK0ssaUJBQWlCLE9BQXRCLEVBQWdDO0FBQy9Cckssc0JBQU1BLElBQUkxSSxPQUFKLENBQVksTUFBWixFQUFvQixHQUFwQixDQUFOO0FBQ0E7O0FBRUQsbUJBQU8sS0FBUDtBQUNBLFNBdENEOztBQXdDQTs7QUFFQSxZQUFLM0YsSUFBTCxFQUFZO0FBQ1grRixpQkFBS2EsR0FBTCxHQUFZeUgsR0FBWjtBQUNBdEksaUJBQUsvRixJQUFMLEdBQVlBLElBQVo7O0FBRUEsZ0JBQUssQ0FBQytGLEtBQUtsRCxJQUFMLENBQVUrTSxLQUFYLElBQW9CLEVBQUc3SixLQUFLbEQsSUFBTCxDQUFVcUUsTUFBVixJQUFvQm5CLEtBQUtsRCxJQUFMLENBQVVxRSxNQUFWLENBQWlCekUsTUFBeEMsQ0FBekIsRUFBNEU7QUFDM0VzRCxxQkFBS2xELElBQUwsQ0FBVStNLEtBQVYsR0FBa0JBLEtBQWxCO0FBQ0E7O0FBRUQsZ0JBQUs1UCxTQUFTLFFBQWQsRUFBeUI7QUFDeEIzRSxrQkFBRTJILE1BQUYsQ0FBUyxJQUFULEVBQWUrQyxLQUFLbEQsSUFBcEIsRUFBMEI7QUFDekJoRyw0QkFBUztBQUNSSixpQ0FBVSxLQURGO0FBRVJPLDhCQUFPO0FBQ05DLHVDQUFZO0FBRE47QUFGQztBQURnQixpQkFBMUI7O0FBU0E4SSxxQkFBS2dULGVBQUwsR0FBdUJOLFFBQXZCOztBQUVBMVMscUJBQUtsRCxJQUFMLENBQVVyRixVQUFWLElBQXdCLHVCQUF3QmliLFlBQVksWUFBWixJQUE0QkEsWUFBWSxhQUF4QyxHQUF3RCxLQUF4RCxHQUFnRSxPQUF4RixDQUF4QjtBQUNBO0FBRUQsU0F2QkQsTUF1Qk8sSUFBS3BLLEdBQUwsRUFBVztBQUNqQnRJLGlCQUFLL0YsSUFBTCxHQUFZK0YsS0FBS2xELElBQUwsQ0FBVTNGLFdBQXRCO0FBQ0E7QUFFRCxLQXBGRDtBQXNGQSxDQTVNQyxFQTRNQy9CLE9BQU93YixNQUFQLElBQWlCQSxNQTVNbEIsQ0FBRDs7QUE4TUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBRSxXQUFVeGIsTUFBVixFQUFrQkMsUUFBbEIsRUFBNEJDLENBQTVCLEVBQStCO0FBQ2hDOztBQUVBLFFBQUlxRyxnQkFBaUIsWUFBWTtBQUMxQixlQUFPdkcsT0FBT3dHLHFCQUFQLElBQ0N4RyxPQUFPeUcsMkJBRFIsSUFFQ3pHLE9BQU8wRyx3QkFGUixJQUdDMUcsT0FBTzJHLHNCQUhSO0FBSUM7QUFDQSxrQkFBVUMsUUFBVixFQUFvQjtBQUNoQixtQkFBTzVHLE9BQU82RyxVQUFQLENBQWtCRCxRQUFsQixFQUE0QixPQUFPLEVBQW5DLENBQVA7QUFDSCxTQVBUO0FBUUgsS0FUZ0IsRUFBcEI7O0FBWUcsUUFBSWlYLGVBQWdCLFlBQVk7QUFDNUIsZUFBTzdkLE9BQU84ZCxvQkFBUCxJQUNDOWQsT0FBTytkLDBCQURSLElBRUMvZCxPQUFPZ2UsdUJBRlIsSUFHQ2hlLE9BQU9pZSxxQkFIUixJQUlDLFVBQVVqVyxFQUFWLEVBQWM7QUFDVmhJLG1CQUFPOFUsWUFBUCxDQUFvQjlNLEVBQXBCO0FBQ0gsU0FOVDtBQU9ILEtBUmtCLEVBQW5COztBQVdILFFBQUlrVyxXQUFXLFNBQVhBLFFBQVcsQ0FBVXhSLENBQVYsRUFBYztBQUM1QixZQUFJeVIsU0FBUyxFQUFiOztBQUVBelIsWUFBSUEsRUFBRU0sYUFBRixJQUFtQk4sQ0FBbkIsSUFBd0IxTSxPQUFPME0sQ0FBbkM7QUFDQUEsWUFBSUEsRUFBRTBSLE9BQUYsSUFBYTFSLEVBQUUwUixPQUFGLENBQVU5VyxNQUF2QixHQUFnQ29GLEVBQUUwUixPQUFsQyxHQUE4QzFSLEVBQUUyUixjQUFGLElBQW9CM1IsRUFBRTJSLGNBQUYsQ0FBaUIvVyxNQUFyQyxHQUE4Q29GLEVBQUUyUixjQUFoRCxHQUFpRSxDQUFFM1IsQ0FBRixDQUFuSDs7QUFFQSxhQUFNLElBQUl1RixHQUFWLElBQWlCdkYsQ0FBakIsRUFBcUI7O0FBRXBCLGdCQUFLQSxFQUFHdUYsR0FBSCxFQUFTcU0sS0FBZCxFQUFzQjtBQUNyQkgsdUJBQU83UixJQUFQLENBQWEsRUFBRWtFLEdBQUk5RCxFQUFHdUYsR0FBSCxFQUFTcU0sS0FBZixFQUFzQjdOLEdBQUkvRCxFQUFHdUYsR0FBSCxFQUFTc00sS0FBbkMsRUFBYjtBQUVBLGFBSEQsTUFHTyxJQUFLN1IsRUFBR3VGLEdBQUgsRUFBU3VNLE9BQWQsRUFBd0I7QUFDOUJMLHVCQUFPN1IsSUFBUCxDQUFhLEVBQUVrRSxHQUFJOUQsRUFBR3VGLEdBQUgsRUFBU3VNLE9BQWYsRUFBd0IvTixHQUFJL0QsRUFBR3VGLEdBQUgsRUFBU3dNLE9BQXJDLEVBQWI7QUFDQTtBQUNEOztBQUVELGVBQU9OLE1BQVA7QUFDQSxLQWpCRDs7QUFtQkEsUUFBSU8sV0FBVyxTQUFYQSxRQUFXLENBQVVDLE1BQVYsRUFBa0JDLE1BQWxCLEVBQTBCQyxJQUExQixFQUFpQztBQUMvQyxZQUFLLENBQUNELE1BQUQsSUFBVyxDQUFDRCxNQUFqQixFQUEwQjtBQUN6QixtQkFBTyxDQUFQO0FBQ0E7O0FBRUQsWUFBS0UsU0FBUyxHQUFkLEVBQW9CO0FBQ25CLG1CQUFPRixPQUFPbk8sQ0FBUCxHQUFXb08sT0FBT3BPLENBQXpCO0FBRUEsU0FIRCxNQUdPLElBQUtxTyxTQUFTLEdBQWQsRUFBb0I7QUFDMUIsbUJBQU9GLE9BQU9sTyxDQUFQLEdBQVdtTyxPQUFPbk8sQ0FBekI7QUFDQTs7QUFFRCxlQUFPYixLQUFLa1AsSUFBTCxDQUFXbFAsS0FBS21QLEdBQUwsQ0FBVUosT0FBT25PLENBQVAsR0FBV29PLE9BQU9wTyxDQUE1QixFQUErQixDQUEvQixJQUFxQ1osS0FBS21QLEdBQUwsQ0FBVUosT0FBT2xPLENBQVAsR0FBV21PLE9BQU9uTyxDQUE1QixFQUErQixDQUEvQixDQUFoRCxDQUFQO0FBQ0EsS0FiRDs7QUFlQSxRQUFJdU8sY0FBYyxTQUFkQSxXQUFjLENBQVUzWCxHQUFWLEVBQWdCOztBQUVqQyxZQUFLQSxJQUFJb0csRUFBSixDQUFPLG1FQUFQLEtBQStFdk4sRUFBRXFTLFVBQUYsQ0FBY2xMLElBQUk0WCxHQUFKLENBQVEsQ0FBUixFQUFXQyxPQUF6QixDQUEvRSxJQUFxSDdYLElBQUk1RixJQUFKLENBQVMsWUFBVCxDQUExSCxFQUFtSjtBQUNsSixtQkFBTyxJQUFQO0FBQ0E7O0FBRUQ7QUFDQSxhQUFNLElBQUk4SixJQUFJLENBQVIsRUFBVzRULE9BQU85WCxJQUFJLENBQUosRUFBTytYLFVBQXpCLEVBQXFDaFUsSUFBSStULEtBQUs3WCxNQUFwRCxFQUE0RGlFLElBQUlILENBQWhFLEVBQW1FRyxHQUFuRSxFQUF5RTtBQUMvRCxnQkFBSzRULEtBQUs1VCxDQUFMLEVBQVE4VCxRQUFSLENBQWlCQyxNQUFqQixDQUF3QixDQUF4QixFQUEyQixFQUEzQixNQUFtQyxnQkFBeEMsRUFBMkQ7QUFDdkQsdUJBQU8sSUFBUDtBQUNIO0FBQ0o7O0FBRU4sZUFBTyxLQUFQO0FBQ0QsS0FkRDs7QUFnQkEsUUFBSUMsZ0JBQWdCLFNBQWhCQSxhQUFnQixDQUFVdlksRUFBVixFQUFlO0FBQ2xDLFlBQUl3WSxZQUFZeGYsT0FBT29hLGdCQUFQLENBQXlCcFQsRUFBekIsRUFBOEIsWUFBOUIsQ0FBaEI7QUFDQSxZQUFJeVksWUFBWXpmLE9BQU9vYSxnQkFBUCxDQUF5QnBULEVBQXpCLEVBQThCLFlBQTlCLENBQWhCOztBQUVBLFlBQUl6RCxXQUFhLENBQUNpYyxjQUFjLFFBQWQsSUFBMEJBLGNBQWMsTUFBekMsS0FBb0R4WSxHQUFHOEMsWUFBSCxHQUFrQjlDLEdBQUcwWSxZQUExRjtBQUNBLFlBQUlDLGFBQWEsQ0FBQ0YsY0FBYyxRQUFkLElBQTBCQSxjQUFjLE1BQXpDLEtBQW9EelksR0FBRzRPLFdBQUgsR0FBaUI1TyxHQUFHa0QsV0FBekY7O0FBRUEsZUFBTzNHLFlBQVlvYyxVQUFuQjtBQUNBLEtBUkQ7O0FBVUEsUUFBSUMsZUFBZSxTQUFmQSxZQUFlLENBQVd2WSxHQUFYLEVBQWlCO0FBQ25DLFlBQUltTCxNQUFNLEtBQVY7O0FBRUEsZUFBUSxJQUFSLEVBQWU7QUFDZEEsa0JBQU0rTSxjQUFlbFksSUFBSTRYLEdBQUosQ0FBUSxDQUFSLENBQWYsQ0FBTjs7QUFFQSxnQkFBS3pNLEdBQUwsRUFBVztBQUNWO0FBQ0E7O0FBRURuTCxrQkFBTUEsSUFBSW1QLE1BQUosRUFBTjs7QUFFQSxnQkFBSyxDQUFDblAsSUFBSUMsTUFBTCxJQUFlRCxJQUFJbUcsUUFBSixDQUFjLGdCQUFkLENBQWYsSUFBbURuRyxJQUFJb0csRUFBSixDQUFRLE1BQVIsQ0FBeEQsRUFBMkU7QUFDMUU7QUFDQTtBQUNEOztBQUVELGVBQU8rRSxHQUFQO0FBQ0EsS0FsQkQ7O0FBcUJBLFFBQUlxTixZQUFZLFNBQVpBLFNBQVksQ0FBV3hTLFFBQVgsRUFBc0I7QUFDckMsWUFBSXpGLE9BQU8sSUFBWDs7QUFFQUEsYUFBS3lGLFFBQUwsR0FBZ0JBLFFBQWhCOztBQUVBekYsYUFBS2tZLEdBQUwsR0FBa0J6UyxTQUFTNUMsS0FBVCxDQUFlc1YsRUFBakM7QUFDQW5ZLGFBQUtvWSxNQUFMLEdBQWtCM1MsU0FBUzVDLEtBQVQsQ0FBZXlDLEtBQWpDO0FBQ0F0RixhQUFLdUIsVUFBTCxHQUFrQmtFLFNBQVM1QyxLQUFULENBQWVDLFNBQWpDOztBQUVBOUMsYUFBS29TLE9BQUw7O0FBRUFwUyxhQUFLdUIsVUFBTCxDQUFnQnNELEVBQWhCLENBQW9CLHdDQUFwQixFQUE4RHZNLEVBQUUrZixLQUFGLENBQVFyWSxJQUFSLEVBQWMsY0FBZCxDQUE5RDtBQUNBLEtBWkQ7O0FBY0FpWSxjQUFVL1csU0FBVixDQUFvQmtSLE9BQXBCLEdBQThCLFlBQVc7QUFDeEMsYUFBSzdRLFVBQUwsQ0FBZ0JrRixHQUFoQixDQUFxQixXQUFyQjtBQUNBLEtBRkQ7O0FBSUF3UixjQUFVL1csU0FBVixDQUFvQm9YLFlBQXBCLEdBQW1DLFVBQVV4VCxDQUFWLEVBQWM7QUFDaEQsWUFBSTlFLE9BQU8sSUFBWDs7QUFFQSxZQUFJd1QsVUFBV2xiLEVBQUd3TSxFQUFFYSxNQUFMLENBQWY7QUFDQSxZQUFJRixXQUFXekYsS0FBS3lGLFFBQXBCO0FBQ0EsWUFBSTFJLFVBQVcwSSxTQUFTMUksT0FBeEI7QUFDQSxZQUFJZ00sV0FBV2hNLFFBQVFnTSxRQUF2Qjs7QUFFQSxZQUFJd1AsZ0JBQWtCelQsRUFBRTdILElBQUYsSUFBVSxZQUFoQzs7QUFFQTtBQUNBLFlBQUtzYixhQUFMLEVBQXFCO0FBQ2R2WSxpQkFBS3VCLFVBQUwsQ0FBZ0JrRixHQUFoQixDQUFxQixvQkFBckI7QUFDSDs7QUFFSjtBQUNBLFlBQUssQ0FBQzFKLE9BQUQsSUFBWWlELEtBQUt5RixRQUFMLENBQWMwQixXQUExQixJQUF5Q25ILEtBQUt5RixRQUFMLENBQWNDLFNBQTVELEVBQXdFO0FBQ3ZFWixjQUFFQyxlQUFGO0FBQ0FELGNBQUVFLGNBQUY7O0FBRUE7QUFDQTs7QUFFRDtBQUNBLFlBQUtGLEVBQUVNLGFBQUYsSUFBbUJOLEVBQUVNLGFBQUYsQ0FBZ0JpSyxNQUFoQixJQUEwQixDQUFsRCxFQUFzRDtBQUNyRDtBQUNBOztBQUVEO0FBQ0EsWUFBSyxDQUFDbUUsUUFBUTlULE1BQVQsSUFBbUIwWCxZQUFhNUQsT0FBYixDQUFuQixJQUE2QzRELFlBQWE1RCxRQUFRNUUsTUFBUixFQUFiLENBQWxELEVBQW9GO0FBQ25GO0FBQ0E7O0FBRUQ7QUFDQSxZQUFLOUosRUFBRU0sYUFBRixDQUFnQndSLE9BQWhCLEdBQTBCcEQsUUFBUSxDQUFSLEVBQVdsUixXQUFYLEdBQXlCa1IsUUFBUS9DLE1BQVIsR0FBaUJoSixJQUF6RSxFQUFnRjtBQUMvRTtBQUNBOztBQUVEekgsYUFBS3dZLFdBQUwsR0FBbUJsQyxTQUFVeFIsQ0FBVixDQUFuQjs7QUFFQTtBQUNBLFlBQUssQ0FBQzlFLEtBQUt3WSxXQUFOLElBQXVCeFksS0FBS3dZLFdBQUwsQ0FBaUI5WSxNQUFqQixHQUEwQixDQUExQixJQUErQitGLFNBQVN5QixTQUFwRSxFQUFrRjtBQUNqRjtBQUNBOztBQUVEbEgsYUFBS3dULE9BQUwsR0FBZ0JBLE9BQWhCO0FBQ0F4VCxhQUFLK0ksUUFBTCxHQUFnQkEsUUFBaEI7QUFDQS9JLGFBQUt5WSxNQUFMLEdBQWdCLElBQWhCO0FBQ0F6WSxhQUFLRixJQUFMLEdBQWdCL0MsUUFBUStDLElBQVIsQ0FBYXBFLEtBQTdCOztBQUVBcEQsVUFBRUQsUUFBRixFQUFZb08sR0FBWixDQUFpQixXQUFqQjs7QUFFQW5PLFVBQUVELFFBQUYsRUFBWXdNLEVBQVosQ0FBZ0IwVCxnQkFBZ0Isd0NBQWhCLEdBQTJELHNDQUEzRSxFQUFvSGpnQixFQUFFK2YsS0FBRixDQUFRclksSUFBUixFQUFjLFlBQWQsQ0FBcEg7QUFDQTFILFVBQUVELFFBQUYsRUFBWXdNLEVBQVosQ0FBZ0IwVCxnQkFBZ0Isb0JBQWhCLEdBQXVDLG9CQUF2RCxFQUE4RWpnQixFQUFFK2YsS0FBRixDQUFRclksSUFBUixFQUFjLGFBQWQsQ0FBOUU7O0FBRUEsWUFBSyxFQUFFQSxLQUFLRixJQUFMLElBQWEyRixTQUFTb0YsTUFBVCxFQUFmLEtBQXNDLEVBQUcySSxRQUFRM04sRUFBUixDQUFZN0YsS0FBS29ZLE1BQWpCLEtBQTZCcFksS0FBS29ZLE1BQUwsQ0FBWW5WLElBQVosQ0FBa0J1USxPQUFsQixFQUE0QjlULE1BQTVELENBQTNDLEVBQWtIOztBQUVqSDtBQUNBLGdCQUFLOFQsUUFBUTNOLEVBQVIsQ0FBVyxLQUFYLENBQUwsRUFBeUI7QUFDeEJmLGtCQUFFRSxjQUFGO0FBQ0E7O0FBRUQ7QUFDQTs7QUFFREYsVUFBRUMsZUFBRjs7QUFFQSxZQUFLLEVBQUd6TSxFQUFFRyxRQUFGLENBQVd5SCxRQUFYLEtBQXlCOFgsYUFBY2hZLEtBQUt3VCxPQUFuQixLQUFnQ3dFLGFBQWNoWSxLQUFLd1QsT0FBTCxDQUFhNUUsTUFBYixFQUFkLENBQXpELENBQUgsQ0FBTCxFQUE2RztBQUM1RzlKLGNBQUVFLGNBQUY7QUFDQTs7QUFFRGhGLGFBQUs4RyxXQUFMLEdBQW9Ca0IsS0FBS0MsS0FBTCxDQUFZbEwsUUFBUXdLLE1BQVIsQ0FBZSxDQUFmLEVBQWtCakYsV0FBOUIsQ0FBcEI7QUFDQXRDLGFBQUtxSixZQUFMLEdBQW9CckIsS0FBS0MsS0FBTCxDQUFZbEwsUUFBUXdLLE1BQVIsQ0FBZSxDQUFmLEVBQWtCdVEsWUFBOUIsQ0FBcEI7O0FBRUE5WCxhQUFLMFksU0FBTCxHQUFpQixJQUFJaEwsSUFBSixHQUFXQyxPQUFYLEVBQWpCO0FBQ0EzTixhQUFLMlksU0FBTCxHQUFpQjNZLEtBQUs0WSxTQUFMLEdBQWlCNVksS0FBSzhXLFFBQUwsR0FBZ0IsQ0FBbEQ7O0FBRUE5VyxhQUFLNlksU0FBTCxHQUFpQixLQUFqQjtBQUNBN1ksYUFBSzhZLFNBQUwsR0FBaUIsS0FBakI7QUFDQTlZLGFBQUsrWSxTQUFMLEdBQWlCLEtBQWpCOztBQUVBL1ksYUFBS2daLGNBQUwsR0FBdUJoWixLQUFLaVosYUFBTCxJQUFzQixFQUFFdlIsS0FBSyxDQUFQLEVBQVVELE1BQU0sQ0FBaEIsRUFBN0M7QUFDQXpILGFBQUtrWixlQUFMLEdBQXVCNWdCLEVBQUVHLFFBQUYsQ0FBVzZPLFlBQVgsQ0FBeUJ0SCxLQUFLK0ksUUFBOUIsQ0FBdkI7QUFDQS9JLGFBQUttWixjQUFMLEdBQXVCLElBQXZCOztBQUVBLFlBQUtuWixLQUFLd1ksV0FBTCxDQUFpQjlZLE1BQWpCLEtBQTRCLENBQTVCLElBQWlDLENBQUNNLEtBQUsrWSxTQUE1QyxFQUF3RDtBQUN2RC9ZLGlCQUFLeVksTUFBTCxHQUFjLENBQUNoVCxTQUFTeUIsU0FBeEI7O0FBRUEsZ0JBQUtuSyxRQUFRRSxJQUFSLEtBQWlCLE9BQWpCLEtBQThCK0MsS0FBS2taLGVBQUwsQ0FBcUJoUixLQUFyQixHQUE2QmxJLEtBQUs4RyxXQUFMLEdBQW1CLENBQWhELElBQXFEOUcsS0FBS2taLGVBQUwsQ0FBcUI1UCxNQUFyQixHQUE4QnRKLEtBQUtxSixZQUFMLEdBQW9CLENBQXJJLENBQUwsRUFBZ0o7O0FBRS9JL1Esa0JBQUVHLFFBQUYsQ0FBV3NQLElBQVgsQ0FBaUIvSCxLQUFLK0ksUUFBdEI7O0FBRUEvSSxxQkFBSytJLFFBQUwsQ0FBYy9PLEdBQWQsQ0FBbUIscUJBQW5CLEVBQTBDLEtBQTFDOztBQUVBZ0cscUJBQUs2WSxTQUFMLEdBQWlCLElBQWpCO0FBRUEsYUFSRCxNQVFPOztBQUVON1kscUJBQUs4WSxTQUFMLEdBQWlCLElBQWpCO0FBQ0E7O0FBRUQ5WSxpQkFBS3VCLFVBQUwsQ0FBZ0JLLFFBQWhCLENBQXlCLCtCQUF6QjtBQUNBOztBQUVELFlBQUs1QixLQUFLd1ksV0FBTCxDQUFpQjlZLE1BQWpCLEtBQTRCLENBQTVCLElBQWlDLENBQUMrRixTQUFTMEIsV0FBM0MsSUFBMEQsQ0FBQ3BLLFFBQVEwTSxRQUFuRSxJQUErRTFNLFFBQVFFLElBQVIsS0FBaUIsT0FBaEcsS0FBNkdGLFFBQVF3TCxRQUFSLElBQW9CeEwsUUFBUStQLE1BQXpJLENBQUwsRUFBeUo7QUFDeEo5TSxpQkFBSytZLFNBQUwsR0FBaUIsSUFBakI7O0FBRUEvWSxpQkFBSzhZLFNBQUwsR0FBaUIsS0FBakI7QUFDQTlZLGlCQUFLNlksU0FBTCxHQUFpQixLQUFqQjs7QUFFQXZnQixjQUFFRyxRQUFGLENBQVdzUCxJQUFYLENBQWlCL0gsS0FBSytJLFFBQXRCOztBQUVBL0ksaUJBQUsrSSxRQUFMLENBQWMvTyxHQUFkLENBQW1CLHFCQUFuQixFQUEwQyxLQUExQzs7QUFFQWdHLGlCQUFLb1osaUJBQUwsR0FBMkIsQ0FBRXBaLEtBQUt3WSxXQUFMLENBQWlCLENBQWpCLEVBQW9CNVAsQ0FBcEIsR0FBd0I1SSxLQUFLd1ksV0FBTCxDQUFpQixDQUFqQixFQUFvQjVQLENBQTlDLElBQW9ELEdBQXRELEdBQThEdFEsRUFBRUYsTUFBRixFQUFVc0osVUFBVixFQUF2RjtBQUNBMUIsaUJBQUtxWixpQkFBTCxHQUEyQixDQUFFclosS0FBS3dZLFdBQUwsQ0FBaUIsQ0FBakIsRUFBb0IzUCxDQUFwQixHQUF3QjdJLEtBQUt3WSxXQUFMLENBQWlCLENBQWpCLEVBQW9CM1AsQ0FBOUMsSUFBb0QsR0FBdEQsR0FBOER2USxFQUFFRixNQUFGLEVBQVVxSixTQUFWLEVBQXZGOztBQUVBekIsaUJBQUtzWiw4QkFBTCxHQUFzQyxDQUFFdFosS0FBS29aLGlCQUFMLEdBQXlCcFosS0FBS2taLGVBQUwsQ0FBcUJ6UixJQUFoRCxJQUF5RHpILEtBQUtrWixlQUFMLENBQXFCaFIsS0FBcEg7QUFDQWxJLGlCQUFLdVosOEJBQUwsR0FBc0MsQ0FBRXZaLEtBQUtxWixpQkFBTCxHQUF5QnJaLEtBQUtrWixlQUFMLENBQXFCeFIsR0FBaEQsSUFBeUQxSCxLQUFLa1osZUFBTCxDQUFxQjVQLE1BQXBIOztBQUVBdEosaUJBQUt3WiwyQkFBTCxHQUFtQzFDLFNBQVU5VyxLQUFLd1ksV0FBTCxDQUFpQixDQUFqQixDQUFWLEVBQStCeFksS0FBS3dZLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBL0IsQ0FBbkM7QUFDQTtBQUVELEtBM0hEOztBQTZIQVAsY0FBVS9XLFNBQVYsQ0FBb0J1WSxXQUFwQixHQUFrQyxVQUFVM1UsQ0FBVixFQUFjOztBQUUvQyxZQUFJOUUsT0FBTyxJQUFYOztBQUVBQSxhQUFLMFosU0FBTCxHQUFpQnBELFNBQVV4UixDQUFWLENBQWpCOztBQUVBLFlBQUt4TSxFQUFFRyxRQUFGLENBQVd5SCxRQUFYLEtBQXlCOFgsYUFBY2hZLEtBQUt3VCxPQUFuQixLQUFnQ3dFLGFBQWNoWSxLQUFLd1QsT0FBTCxDQUFhNUUsTUFBYixFQUFkLENBQXpELENBQUwsRUFBd0c7QUFDdkc5SixjQUFFQyxlQUFGOztBQUVBL0UsaUJBQUt5WSxNQUFMLEdBQWMsS0FBZDs7QUFFQTtBQUNBOztBQUVELFlBQUssRUFBR3pZLEtBQUtGLElBQUwsSUFBYUUsS0FBS3lGLFFBQUwsQ0FBY29GLE1BQWQsRUFBaEIsS0FBNEMsQ0FBQzdLLEtBQUswWixTQUFsRCxJQUErRCxDQUFDMVosS0FBSzBaLFNBQUwsQ0FBZWhhLE1BQXBGLEVBQTZGO0FBQzVGO0FBQ0E7O0FBRURNLGFBQUsyWSxTQUFMLEdBQWlCN0IsU0FBVTlXLEtBQUswWixTQUFMLENBQWUsQ0FBZixDQUFWLEVBQTZCMVosS0FBS3dZLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBN0IsRUFBa0QsR0FBbEQsQ0FBakI7QUFDQXhZLGFBQUs0WSxTQUFMLEdBQWlCOUIsU0FBVTlXLEtBQUswWixTQUFMLENBQWUsQ0FBZixDQUFWLEVBQTZCMVosS0FBS3dZLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBN0IsRUFBa0QsR0FBbEQsQ0FBakI7O0FBRUF4WSxhQUFLOFcsUUFBTCxHQUFnQkEsU0FBVTlXLEtBQUswWixTQUFMLENBQWUsQ0FBZixDQUFWLEVBQTZCMVosS0FBS3dZLFdBQUwsQ0FBaUIsQ0FBakIsQ0FBN0IsQ0FBaEI7O0FBRUE7QUFDQSxZQUFLeFksS0FBSzhXLFFBQUwsR0FBZ0IsQ0FBckIsRUFBeUI7O0FBRXhCLGdCQUFLLEVBQUc5VyxLQUFLd1QsT0FBTCxDQUFhM04sRUFBYixDQUFpQjdGLEtBQUtvWSxNQUF0QixLQUFrQ3BZLEtBQUtvWSxNQUFMLENBQVluVixJQUFaLENBQWtCakQsS0FBS3dULE9BQXZCLEVBQWlDOVQsTUFBdEUsQ0FBTCxFQUFzRjtBQUNyRjtBQUNBOztBQUVEb0YsY0FBRUMsZUFBRjtBQUNBRCxjQUFFRSxjQUFGOztBQUVBLGdCQUFLaEYsS0FBSzhZLFNBQVYsRUFBc0I7QUFDckI5WSxxQkFBSzJaLE9BQUw7QUFFQSxhQUhELE1BR08sSUFBSzNaLEtBQUs2WSxTQUFWLEVBQXNCO0FBQzVCN1kscUJBQUs0WixLQUFMO0FBRUEsYUFITSxNQUdBLElBQUs1WixLQUFLK1ksU0FBVixFQUFzQjtBQUM1Qi9ZLHFCQUFLNlosTUFBTDtBQUNBO0FBRUQ7QUFFRCxLQTdDRDs7QUErQ0E1QixjQUFVL1csU0FBVixDQUFvQnlZLE9BQXBCLEdBQThCLFlBQVc7O0FBRXhDLFlBQUkzWixPQUFPLElBQVg7O0FBRUEsWUFBSThaLFVBQVU5WixLQUFLOFksU0FBbkI7QUFDQSxZQUFJclIsT0FBVXpILEtBQUtnWixjQUFMLENBQW9CdlIsSUFBcEIsSUFBNEIsQ0FBMUM7QUFDQSxZQUFJc1MsS0FBSjs7QUFFQSxZQUFLRCxZQUFZLElBQWpCLEVBQXdCOztBQUV2QixnQkFBSzlSLEtBQUs4QyxHQUFMLENBQVU5SyxLQUFLOFcsUUFBZixJQUE0QixFQUFqQyxFQUF1Qzs7QUFFdEM5VyxxQkFBS3lZLE1BQUwsR0FBYyxLQUFkOztBQUVBLG9CQUFLelksS0FBS3lGLFFBQUwsQ0FBY3BGLEtBQWQsQ0FBb0JYLE1BQXBCLEdBQTZCLENBQTdCLElBQWtDTSxLQUFLRixJQUFMLENBQVVuRSxRQUFqRCxFQUE0RDtBQUMzRHFFLHlCQUFLOFksU0FBTCxHQUFrQixHQUFsQjtBQUVBLGlCQUhELE1BR08sSUFBSzlZLEtBQUt5RixRQUFMLENBQWN5QixTQUFkLElBQTJCbEgsS0FBS0YsSUFBTCxDQUFVbkUsUUFBVixLQUF1QixLQUFsRCxJQUE2RHFFLEtBQUtGLElBQUwsQ0FBVW5FLFFBQVYsS0FBdUIsTUFBdkIsSUFBaUNyRCxFQUFHRixNQUFILEVBQVk4UCxLQUFaLEtBQXNCLEdBQXpILEVBQWlJO0FBQ3ZJbEkseUJBQUs4WSxTQUFMLEdBQWtCLEdBQWxCO0FBRUEsaUJBSE0sTUFHQTtBQUNOaUIsNEJBQVEvUixLQUFLOEMsR0FBTCxDQUFVOUMsS0FBS2dTLEtBQUwsQ0FBWWhhLEtBQUs0WSxTQUFqQixFQUE0QjVZLEtBQUsyWSxTQUFqQyxJQUErQyxHQUEvQyxHQUFxRDNRLEtBQUtpUyxFQUFwRSxDQUFSOztBQUVBamEseUJBQUs4WSxTQUFMLEdBQW1CaUIsUUFBUSxFQUFSLElBQWNBLFFBQVEsR0FBeEIsR0FBZ0MsR0FBaEMsR0FBc0MsR0FBdkQ7QUFDQTs7QUFFRC9aLHFCQUFLeUYsUUFBTCxDQUFjeUIsU0FBZCxHQUEwQmxILEtBQUs4WSxTQUEvQjs7QUFFQTtBQUNBOVkscUJBQUt3WSxXQUFMLEdBQW1CeFksS0FBSzBaLFNBQXhCOztBQUVBcGhCLGtCQUFFbUssSUFBRixDQUFPekMsS0FBS3lGLFFBQUwsQ0FBY3pFLE1BQXJCLEVBQTZCLFVBQVVqQixLQUFWLEVBQWlCOEcsS0FBakIsRUFBeUI7QUFDckR2TyxzQkFBRUcsUUFBRixDQUFXc1AsSUFBWCxDQUFpQmxCLE1BQU1VLE1BQXZCOztBQUVBViwwQkFBTVUsTUFBTixDQUFhdk4sR0FBYixDQUFrQixxQkFBbEIsRUFBeUMsS0FBekM7O0FBRUE2TSwwQkFBTXFULFlBQU4sR0FBcUIsS0FBckI7O0FBRUEsd0JBQUtyVCxNQUFNRCxHQUFOLEtBQWM1RyxLQUFLeUYsUUFBTCxDQUFjMUksT0FBZCxDQUFzQjZKLEdBQXpDLEVBQStDO0FBQzlDNUcsNkJBQUtnWixjQUFMLENBQW9CdlIsSUFBcEIsR0FBMkJuUCxFQUFFRyxRQUFGLENBQVc2TyxZQUFYLENBQXlCVCxNQUFNVSxNQUEvQixFQUF3Q0UsSUFBbkU7QUFDQTtBQUNELGlCQVZEOztBQVlBOztBQUVBO0FBQ0Esb0JBQUt6SCxLQUFLeUYsUUFBTCxDQUFja0UsU0FBZCxJQUEyQjNKLEtBQUt5RixRQUFMLENBQWNrRSxTQUFkLENBQXdCQyxRQUF4RCxFQUFtRTtBQUNsRTVKLHlCQUFLeUYsUUFBTCxDQUFja0UsU0FBZCxDQUF3QjVCLElBQXhCO0FBQ0E7QUFDRDtBQUVELFNBM0NELE1BMkNPOztBQUVOLGdCQUFLK1IsV0FBVyxHQUFoQixFQUFzQjs7QUFFckI7QUFDQSxvQkFBSzlaLEtBQUsyWSxTQUFMLEdBQWlCLENBQWpCLEtBQXdCM1ksS0FBS3lGLFFBQUwsQ0FBY3BGLEtBQWQsQ0FBb0JYLE1BQXBCLEdBQTZCLENBQTdCLElBQW9DTSxLQUFLeUYsUUFBTCxDQUFjMUksT0FBZCxDQUFzQmdELEtBQXRCLEtBQWdDLENBQWhDLElBQXFDLENBQUNDLEtBQUt5RixRQUFMLENBQWMxSSxPQUFkLENBQXNCK0MsSUFBdEIsQ0FBMkJqSCxJQUE3SCxDQUFMLEVBQTZJO0FBQzVJNE8sMkJBQU9BLE9BQU9PLEtBQUttUCxHQUFMLENBQVVuWCxLQUFLMlksU0FBZixFQUEwQixHQUExQixDQUFkO0FBRUEsaUJBSEQsTUFHTyxJQUFLM1ksS0FBSzJZLFNBQUwsR0FBaUIsQ0FBakIsS0FBd0IzWSxLQUFLeUYsUUFBTCxDQUFjcEYsS0FBZCxDQUFvQlgsTUFBcEIsR0FBNkIsQ0FBN0IsSUFBb0NNLEtBQUt5RixRQUFMLENBQWMxSSxPQUFkLENBQXNCZ0QsS0FBdEIsS0FBZ0NDLEtBQUt5RixRQUFMLENBQWNwRixLQUFkLENBQW9CWCxNQUFwQixHQUE2QixDQUE3RCxJQUFrRSxDQUFDTSxLQUFLeUYsUUFBTCxDQUFjMUksT0FBZCxDQUFzQitDLElBQXRCLENBQTJCakgsSUFBMUosQ0FBTCxFQUEwSztBQUNoTDRPLDJCQUFPQSxPQUFPTyxLQUFLbVAsR0FBTCxDQUFVLENBQUNuWCxLQUFLMlksU0FBaEIsRUFBMkIsR0FBM0IsQ0FBZDtBQUVBLGlCQUhNLE1BR0E7QUFDTmxSLDJCQUFPQSxPQUFPekgsS0FBSzJZLFNBQW5CO0FBQ0E7QUFFRDs7QUFFRDNZLGlCQUFLaVosYUFBTCxHQUFxQjtBQUNwQnZSLHFCQUFPb1MsV0FBVyxHQUFYLEdBQWlCLENBQWpCLEdBQXFCOVosS0FBS2daLGNBQUwsQ0FBb0J0UixHQUFwQixHQUEwQjFILEtBQUs0WSxTQUR2QztBQUVwQm5SLHNCQUFPQTtBQUZhLGFBQXJCOztBQUtBLGdCQUFLekgsS0FBS21hLFNBQVYsRUFBc0I7QUFDckJsRSw2QkFBY2pXLEtBQUttYSxTQUFuQjs7QUFFQW5hLHFCQUFLbWEsU0FBTCxHQUFpQixJQUFqQjtBQUNBOztBQUVEbmEsaUJBQUttYSxTQUFMLEdBQWlCeGIsY0FBYyxZQUFXOztBQUV6QyxvQkFBS3FCLEtBQUtpWixhQUFWLEVBQTBCO0FBQ3pCM2dCLHNCQUFFbUssSUFBRixDQUFPekMsS0FBS3lGLFFBQUwsQ0FBY3pFLE1BQXJCLEVBQTZCLFVBQVVqQixLQUFWLEVBQWlCOEcsS0FBakIsRUFBeUI7QUFDckQsNEJBQUlELE1BQU1DLE1BQU1ELEdBQU4sR0FBWTVHLEtBQUt5RixRQUFMLENBQWMvRSxPQUFwQzs7QUFFQXBJLDBCQUFFRyxRQUFGLENBQVc2UixZQUFYLENBQXlCekQsTUFBTVUsTUFBL0IsRUFBdUM7QUFDdENHLGlDQUFPMUgsS0FBS2laLGFBQUwsQ0FBbUJ2UixHQURZO0FBRXRDRCxrQ0FBT3pILEtBQUtpWixhQUFMLENBQW1CeFIsSUFBbkIsR0FBNEJiLE1BQU01RyxLQUFLOEcsV0FBdkMsR0FBeURGLE1BQU1DLE1BQU0vRyxJQUFOLENBQVcvRztBQUYzQyx5QkFBdkM7QUFJQSxxQkFQRDs7QUFTQWlILHlCQUFLdUIsVUFBTCxDQUFnQkssUUFBaEIsQ0FBMEIscUJBQTFCO0FBQ0E7QUFFRCxhQWZnQixDQUFqQjtBQWlCQTtBQUVELEtBbEdEOztBQW9HQXFXLGNBQVUvVyxTQUFWLENBQW9CMFksS0FBcEIsR0FBNEIsWUFBVzs7QUFFdEMsWUFBSTVaLE9BQU8sSUFBWDs7QUFFQSxZQUFJb2EsVUFBSixFQUFnQkMsVUFBaEIsRUFBNEJDLE1BQTVCOztBQUVBdGEsYUFBS3lZLE1BQUwsR0FBYyxLQUFkOztBQUVBLFlBQUt6WSxLQUFLa1osZUFBTCxDQUFxQmhSLEtBQXJCLEdBQTZCbEksS0FBSzhHLFdBQXZDLEVBQXFEO0FBQ3BEc1QseUJBQWFwYSxLQUFLa1osZUFBTCxDQUFxQnpSLElBQXJCLEdBQTRCekgsS0FBSzJZLFNBQTlDO0FBRUEsU0FIRCxNQUdPO0FBQ055Qix5QkFBYXBhLEtBQUtrWixlQUFMLENBQXFCelIsSUFBbEM7QUFDQTs7QUFFRDRTLHFCQUFhcmEsS0FBS2taLGVBQUwsQ0FBcUJ4UixHQUFyQixHQUEyQjFILEtBQUs0WSxTQUE3Qzs7QUFFQTBCLGlCQUFTdGEsS0FBS3VhLGFBQUwsQ0FBb0JILFVBQXBCLEVBQWdDQyxVQUFoQyxFQUE0Q3JhLEtBQUtrWixlQUFMLENBQXFCaFIsS0FBakUsRUFBd0VsSSxLQUFLa1osZUFBTCxDQUFxQjVQLE1BQTdGLENBQVQ7O0FBRUFnUixlQUFPblIsTUFBUCxHQUFnQm5KLEtBQUtrWixlQUFMLENBQXFCL1AsTUFBckM7QUFDQW1SLGVBQU9sUixNQUFQLEdBQWdCcEosS0FBS2taLGVBQUwsQ0FBcUI5UCxNQUFyQzs7QUFFQXBKLGFBQUttWixjQUFMLEdBQXNCbUIsTUFBdEI7O0FBRUEsWUFBS3RhLEtBQUttYSxTQUFWLEVBQXNCO0FBQ3JCbEUseUJBQWNqVyxLQUFLbWEsU0FBbkI7O0FBRUFuYSxpQkFBS21hLFNBQUwsR0FBaUIsSUFBakI7QUFDQTs7QUFFRG5hLGFBQUttYSxTQUFMLEdBQWlCeGIsY0FBYyxZQUFXO0FBQ3pDckcsY0FBRUcsUUFBRixDQUFXNlIsWUFBWCxDQUF5QnRLLEtBQUsrSSxRQUE5QixFQUF3Qy9JLEtBQUttWixjQUE3QztBQUNBLFNBRmdCLENBQWpCO0FBR0EsS0FqQ0Q7O0FBbUNBO0FBQ0FsQixjQUFVL1csU0FBVixDQUFvQnFaLGFBQXBCLEdBQW9DLFVBQVVILFVBQVYsRUFBc0JDLFVBQXRCLEVBQWtDRyxRQUFsQyxFQUE0Q0MsU0FBNUMsRUFBd0Q7O0FBRTNGLFlBQUl6YSxPQUFPLElBQVg7O0FBRUEsWUFBSTBhLGFBQUosRUFBbUJDLGFBQW5CLEVBQWtDQyxhQUFsQyxFQUFpREMsYUFBakQ7O0FBRUEsWUFBSS9ULGNBQWU5RyxLQUFLOEcsV0FBeEI7QUFDQSxZQUFJdUMsZUFBZXJKLEtBQUtxSixZQUF4Qjs7QUFFQSxZQUFJeVIsaUJBQWlCOWEsS0FBS2taLGVBQUwsQ0FBcUJ6UixJQUExQztBQUNBLFlBQUlzVCxpQkFBaUIvYSxLQUFLa1osZUFBTCxDQUFxQnhSLEdBQTFDOztBQUVBLFlBQUlpUixZQUFZM1ksS0FBSzJZLFNBQXJCO0FBQ0EsWUFBSUMsWUFBWTVZLEtBQUs0WSxTQUFyQjs7QUFFQTs7QUFFQThCLHdCQUFnQjFTLEtBQUt1RixHQUFMLENBQVMsQ0FBVCxFQUFZekcsY0FBZSxHQUFmLEdBQXFCMFQsV0FBWSxHQUE3QyxDQUFoQjtBQUNBRyx3QkFBZ0IzUyxLQUFLdUYsR0FBTCxDQUFTLENBQVQsRUFBWWxFLGVBQWUsR0FBZixHQUFxQm9SLFlBQVksR0FBN0MsQ0FBaEI7O0FBRUFHLHdCQUFnQjVTLEtBQUttQyxHQUFMLENBQVVyRCxjQUFlMFQsUUFBekIsRUFBb0MxVCxjQUFlLEdBQWYsR0FBcUIwVCxXQUFZLEdBQXJFLENBQWhCO0FBQ0FLLHdCQUFnQjdTLEtBQUttQyxHQUFMLENBQVVkLGVBQWVvUixTQUF6QixFQUFvQ3BSLGVBQWUsR0FBZixHQUFxQm9SLFlBQVksR0FBckUsQ0FBaEI7O0FBRUEsWUFBS0QsV0FBVzFULFdBQWhCLEVBQThCOztBQUU3QjtBQUNBLGdCQUFLNlIsWUFBWSxDQUFaLElBQWlCeUIsYUFBYU0sYUFBbkMsRUFBbUQ7QUFDbEROLDZCQUFhTSxnQkFBZ0IsQ0FBaEIsR0FBb0IxUyxLQUFLbVAsR0FBTCxDQUFVLENBQUN1RCxhQUFELEdBQWlCSSxjQUFqQixHQUFrQ25DLFNBQTVDLEVBQXVELEdBQXZELENBQXBCLElBQW9GLENBQWpHO0FBQ0E7O0FBRUQ7QUFDQSxnQkFBS0EsWUFBYSxDQUFiLElBQWtCeUIsYUFBYVEsYUFBcEMsRUFBb0Q7QUFDbkRSLDZCQUFhUSxnQkFBZ0IsQ0FBaEIsR0FBb0I1UyxLQUFLbVAsR0FBTCxDQUFVeUQsZ0JBQWdCRSxjQUFoQixHQUFpQ25DLFNBQTNDLEVBQXNELEdBQXRELENBQXBCLElBQW1GLENBQWhHO0FBQ0E7QUFFRDs7QUFFRCxZQUFLOEIsWUFBWXBSLFlBQWpCLEVBQWdDOztBQUUvQjtBQUNBLGdCQUFLdVAsWUFBWSxDQUFaLElBQWlCeUIsYUFBYU0sYUFBbkMsRUFBbUQ7QUFDbEROLDZCQUFhTSxnQkFBZ0IsQ0FBaEIsR0FBb0IzUyxLQUFLbVAsR0FBTCxDQUFTLENBQUN3RCxhQUFELEdBQWlCSSxjQUFqQixHQUFrQ25DLFNBQTNDLEVBQXNELEdBQXRELENBQXBCLElBQW1GLENBQWhHO0FBQ0E7O0FBRUQ7QUFDQSxnQkFBS0EsWUFBWSxDQUFaLElBQWlCeUIsYUFBYVEsYUFBbkMsRUFBbUQ7QUFDbERSLDZCQUFhUSxnQkFBZ0IsQ0FBaEIsR0FBb0I3UyxLQUFLbVAsR0FBTCxDQUFXMEQsZ0JBQWdCRSxjQUFoQixHQUFpQ25DLFNBQTVDLEVBQXVELEdBQXZELENBQXBCLElBQW9GLENBQWpHO0FBQ0E7QUFFRDs7QUFFRCxlQUFPO0FBQ05sUixpQkFBTzJTLFVBREQ7QUFFTjVTLGtCQUFPMlM7QUFGRCxTQUFQO0FBS0EsS0F4REQ7O0FBMkRBbkMsY0FBVS9XLFNBQVYsQ0FBb0I4WixhQUFwQixHQUFvQyxVQUFVWixVQUFWLEVBQXNCQyxVQUF0QixFQUFrQ0csUUFBbEMsRUFBNENDLFNBQTVDLEVBQXdEOztBQUUzRixZQUFJemEsT0FBTyxJQUFYOztBQUVBLFlBQUk4RyxjQUFlOUcsS0FBSzhHLFdBQXhCO0FBQ0EsWUFBSXVDLGVBQWVySixLQUFLcUosWUFBeEI7O0FBRUEsWUFBS21SLFdBQVcxVCxXQUFoQixFQUE4QjtBQUM3QnNULHlCQUFhQSxhQUFhLENBQWIsR0FBaUIsQ0FBakIsR0FBcUJBLFVBQWxDO0FBQ0FBLHlCQUFhQSxhQUFhdFQsY0FBYzBULFFBQTNCLEdBQXNDMVQsY0FBYzBULFFBQXBELEdBQStESixVQUE1RTtBQUVBLFNBSkQsTUFJTzs7QUFFTjtBQUNBQSx5QkFBYXBTLEtBQUt1RixHQUFMLENBQVUsQ0FBVixFQUFhekcsY0FBYyxDQUFkLEdBQWtCMFQsV0FBVyxDQUExQyxDQUFiO0FBRUE7O0FBRUQsWUFBS0MsWUFBWXBSLFlBQWpCLEVBQWdDO0FBQy9CZ1IseUJBQWFBLGFBQWEsQ0FBYixHQUFpQixDQUFqQixHQUFxQkEsVUFBbEM7QUFDQUEseUJBQWFBLGFBQWFoUixlQUFlb1IsU0FBNUIsR0FBd0NwUixlQUFlb1IsU0FBdkQsR0FBbUVKLFVBQWhGO0FBRUEsU0FKRCxNQUlPOztBQUVOO0FBQ0FBLHlCQUFhclMsS0FBS3VGLEdBQUwsQ0FBVSxDQUFWLEVBQWFsRSxlQUFlLENBQWYsR0FBbUJvUixZQUFZLENBQTVDLENBQWI7QUFFQTs7QUFFRCxlQUFPO0FBQ04vUyxpQkFBTzJTLFVBREQ7QUFFTjVTLGtCQUFPMlM7QUFGRCxTQUFQO0FBS0EsS0FsQ0Q7O0FBb0NBbkMsY0FBVS9XLFNBQVYsQ0FBb0IyWSxNQUFwQixHQUE2QixZQUFXOztBQUV2QyxZQUFJN1osT0FBTyxJQUFYOztBQUVBOztBQUVBLFlBQUlpYixlQUFnQmpiLEtBQUtrWixlQUFMLENBQXFCaFIsS0FBekM7QUFDQSxZQUFJZ1QsZ0JBQWdCbGIsS0FBS2taLGVBQUwsQ0FBcUI1UCxNQUF6Qzs7QUFFQSxZQUFJd1IsaUJBQWlCOWEsS0FBS2taLGVBQUwsQ0FBcUJ6UixJQUExQztBQUNBLFlBQUlzVCxpQkFBaUIvYSxLQUFLa1osZUFBTCxDQUFxQnhSLEdBQTFDOztBQUVBLFlBQUl5VCw0QkFBNEJyRSxTQUFVOVcsS0FBSzBaLFNBQUwsQ0FBZSxDQUFmLENBQVYsRUFBNkIxWixLQUFLMFosU0FBTCxDQUFlLENBQWYsQ0FBN0IsQ0FBaEM7O0FBRUEsWUFBSTBCLGFBQWFELDRCQUE0Qm5iLEtBQUt3WiwyQkFBbEQ7O0FBRUEsWUFBSWdCLFdBQVl4UyxLQUFLb0MsS0FBTCxDQUFZNlEsZUFBZ0JHLFVBQTVCLENBQWhCO0FBQ0EsWUFBSVgsWUFBWXpTLEtBQUtvQyxLQUFMLENBQVk4USxnQkFBZ0JFLFVBQTVCLENBQWhCOztBQUVBO0FBQ0EsWUFBSUMsd0JBQXdCLENBQUNKLGVBQWdCVCxRQUFqQixJQUE4QnhhLEtBQUtzWiw4QkFBL0Q7QUFDQSxZQUFJZ0Msd0JBQXdCLENBQUNKLGdCQUFnQlQsU0FBakIsSUFBOEJ6YSxLQUFLdVosOEJBQS9EOztBQUVBOztBQUVBLFlBQUlnQyxrQkFBbUIsQ0FBQ3ZiLEtBQUswWixTQUFMLENBQWUsQ0FBZixFQUFrQjlRLENBQWxCLEdBQXNCNUksS0FBSzBaLFNBQUwsQ0FBZSxDQUFmLEVBQWtCOVEsQ0FBekMsSUFBOEMsQ0FBL0MsR0FBb0R0USxFQUFFRixNQUFGLEVBQVVzSixVQUFWLEVBQTFFO0FBQ0EsWUFBSThaLGtCQUFtQixDQUFDeGIsS0FBSzBaLFNBQUwsQ0FBZSxDQUFmLEVBQWtCN1EsQ0FBbEIsR0FBc0I3SSxLQUFLMFosU0FBTCxDQUFlLENBQWYsRUFBa0I3USxDQUF6QyxJQUE4QyxDQUEvQyxHQUFvRHZRLEVBQUVGLE1BQUYsRUFBVXFKLFNBQVYsRUFBMUU7O0FBRUE7QUFDQTs7QUFFQSxZQUFJZ2EsNEJBQTRCRixrQkFBa0J2YixLQUFLb1osaUJBQXZEO0FBQ0EsWUFBSXNDLDRCQUE0QkYsa0JBQWtCeGIsS0FBS3FaLGlCQUF2RDs7QUFFQTs7QUFFQSxZQUFJZSxhQUFhVSxrQkFBbUJPLHdCQUF3QkkseUJBQTNDLENBQWpCO0FBQ0EsWUFBSXBCLGFBQWFVLGtCQUFtQk8sd0JBQXdCSSx5QkFBM0MsQ0FBakI7O0FBRUEsWUFBSXBCLFNBQVM7QUFDWjVTLGlCQUFTMlMsVUFERztBQUVaNVMsa0JBQVMyUyxVQUZHO0FBR1pqUixvQkFBU25KLEtBQUtrWixlQUFMLENBQXFCL1AsTUFBckIsR0FBOEJpUyxVQUgzQjtBQUlaaFMsb0JBQVNwSixLQUFLa1osZUFBTCxDQUFxQjlQLE1BQXJCLEdBQThCZ1M7QUFKM0IsU0FBYjs7QUFPQXBiLGFBQUt5WSxNQUFMLEdBQWMsS0FBZDs7QUFFQXpZLGFBQUt3YSxRQUFMLEdBQWlCQSxRQUFqQjtBQUNBeGEsYUFBS3lhLFNBQUwsR0FBaUJBLFNBQWpCOztBQUVBemEsYUFBS21aLGNBQUwsR0FBc0JtQixNQUF0Qjs7QUFFQSxZQUFLdGEsS0FBS21hLFNBQVYsRUFBc0I7QUFDckJsRSx5QkFBY2pXLEtBQUttYSxTQUFuQjs7QUFFQW5hLGlCQUFLbWEsU0FBTCxHQUFpQixJQUFqQjtBQUNBOztBQUVEbmEsYUFBS21hLFNBQUwsR0FBaUJ4YixjQUFjLFlBQVc7QUFDekNyRyxjQUFFRyxRQUFGLENBQVc2UixZQUFYLENBQXlCdEssS0FBSytJLFFBQTlCLEVBQXdDL0ksS0FBS21aLGNBQTdDO0FBQ0EsU0FGZ0IsQ0FBakI7QUFJQSxLQS9ERDs7QUFpRUFsQixjQUFVL1csU0FBVixDQUFvQnlhLFVBQXBCLEdBQWlDLFVBQVU3VyxDQUFWLEVBQWM7O0FBRTlDLFlBQUk5RSxPQUFPLElBQVg7QUFDQSxZQUFJNGIsTUFBTzVULEtBQUt1RixHQUFMLENBQVcsSUFBSUcsSUFBSixHQUFXQyxPQUFYLEVBQUQsR0FBMEIzTixLQUFLMFksU0FBekMsRUFBb0QsQ0FBcEQsQ0FBWDs7QUFFQSxZQUFJb0IsVUFBVTlaLEtBQUs4WSxTQUFuQjtBQUNBLFlBQUkrQyxVQUFVN2IsS0FBSzZZLFNBQW5CO0FBQ0EsWUFBSWlELFVBQVU5YixLQUFLK1ksU0FBbkI7O0FBRUEvWSxhQUFLK2IsU0FBTCxHQUFpQnpGLFNBQVV4UixDQUFWLENBQWpCOztBQUVBOUUsYUFBS3VCLFVBQUwsQ0FBZ0JzRyxXQUFoQixDQUE2QiwrQkFBN0I7O0FBRUF2UCxVQUFFRCxRQUFGLEVBQVlvTyxHQUFaLENBQWlCLFdBQWpCOztBQUVBLFlBQUt6RyxLQUFLbWEsU0FBVixFQUFzQjtBQUNyQmxFLHlCQUFjalcsS0FBS21hLFNBQW5COztBQUVBbmEsaUJBQUttYSxTQUFMLEdBQWlCLElBQWpCO0FBQ0E7O0FBRURuYSxhQUFLOFksU0FBTCxHQUFpQixLQUFqQjtBQUNBOVksYUFBSzZZLFNBQUwsR0FBaUIsS0FBakI7QUFDQTdZLGFBQUsrWSxTQUFMLEdBQWlCLEtBQWpCOztBQUVBLFlBQUsvWSxLQUFLeVksTUFBVixFQUFvQjtBQUNuQixtQkFBT3pZLEtBQUtnYyxLQUFMLENBQVlsWCxDQUFaLENBQVA7QUFDQTs7QUFFRDlFLGFBQUtoRSxLQUFMLEdBQWEsR0FBYjs7QUFFQTtBQUNBZ0UsYUFBS2ljLFNBQUwsR0FBaUJqYyxLQUFLMlksU0FBTCxHQUFpQmlELEdBQWpCLEdBQXVCLEdBQXhDO0FBQ0E1YixhQUFLa2MsU0FBTCxHQUFpQmxjLEtBQUs0WSxTQUFMLEdBQWlCZ0QsR0FBakIsR0FBdUIsR0FBeEM7O0FBRUE1YixhQUFLbWMsTUFBTCxHQUFjblUsS0FBS3VGLEdBQUwsQ0FBVXZOLEtBQUtoRSxLQUFMLEdBQWEsR0FBdkIsRUFBNEJnTSxLQUFLbUMsR0FBTCxDQUFVbkssS0FBS2hFLEtBQUwsR0FBYSxHQUF2QixFQUE4QixJQUFJZ00sS0FBSzhDLEdBQUwsQ0FBVTlLLEtBQUtpYyxTQUFmLENBQU4sR0FBcUNqYyxLQUFLaEUsS0FBdEUsQ0FBNUIsQ0FBZDs7QUFFQSxZQUFLNmYsT0FBTCxFQUFlO0FBQ2Q3YixpQkFBS29jLFVBQUw7QUFFQSxTQUhELE1BR08sSUFBS04sT0FBTCxFQUFlO0FBQ3JCOWIsaUJBQUtxYyxVQUFMO0FBRUEsU0FITSxNQUdBO0FBQ05yYyxpQkFBS3NjLFVBQUwsQ0FBaUJ4QyxPQUFqQjtBQUNBOztBQUVEO0FBQ0EsS0FoREQ7O0FBa0RBN0IsY0FBVS9XLFNBQVYsQ0FBb0JvYixVQUFwQixHQUFpQyxVQUFVeEMsT0FBVixFQUFvQjs7QUFFcEQsWUFBSTlaLE9BQU8sSUFBWDtBQUNBLFlBQUlxTSxNQUFNLEtBQVY7O0FBRUFyTSxhQUFLeUYsUUFBTCxDQUFjeUIsU0FBZCxHQUEwQixLQUExQjtBQUNBbEgsYUFBS2laLGFBQUwsR0FBMEIsSUFBMUI7O0FBRUE7QUFDQSxZQUFLYSxXQUFXLEdBQVgsSUFBa0I5UixLQUFLOEMsR0FBTCxDQUFVOUssS0FBSzRZLFNBQWYsSUFBNkIsRUFBcEQsRUFBeUQ7O0FBRXhEO0FBQ0F0Z0IsY0FBRUcsUUFBRixDQUFXMFAsT0FBWCxDQUFvQm5JLEtBQUt5RixRQUFMLENBQWMxSSxPQUFkLENBQXNCd0ssTUFBMUMsRUFBa0Q7QUFDakRHLHFCQUFVMUgsS0FBS2daLGNBQUwsQ0FBb0J0UixHQUFwQixHQUEwQjFILEtBQUs0WSxTQUEvQixHQUE2QzVZLEtBQUtrYyxTQUFMLEdBQWlCLEdBRHZCO0FBRWpEMU0seUJBQVU7QUFGdUMsYUFBbEQsRUFHRyxHQUhIOztBQUtBbkQsa0JBQU1yTSxLQUFLeUYsUUFBTCxDQUFjeEssS0FBZCxDQUFxQixJQUFyQixFQUEyQixHQUEzQixDQUFOO0FBRUEsU0FWRCxNQVVPLElBQUs2ZSxXQUFXLEdBQVgsSUFBa0I5WixLQUFLMlksU0FBTCxHQUFpQixFQUFuQyxJQUF5QzNZLEtBQUt5RixRQUFMLENBQWNwRixLQUFkLENBQW9CWCxNQUFwQixHQUE2QixDQUEzRSxFQUErRTtBQUNyRjJNLGtCQUFNck0sS0FBS3lGLFFBQUwsQ0FBY1IsUUFBZCxDQUF3QmpGLEtBQUttYyxNQUE3QixDQUFOO0FBRUEsU0FITSxNQUdBLElBQUtyQyxXQUFXLEdBQVgsSUFBa0I5WixLQUFLMlksU0FBTCxHQUFpQixDQUFDLEVBQXBDLElBQTJDM1ksS0FBS3lGLFFBQUwsQ0FBY3BGLEtBQWQsQ0FBb0JYLE1BQXBCLEdBQTZCLENBQTdFLEVBQWlGO0FBQ3ZGMk0sa0JBQU1yTSxLQUFLeUYsUUFBTCxDQUFjUCxJQUFkLENBQW9CbEYsS0FBS21jLE1BQXpCLENBQU47QUFDQTs7QUFFRCxZQUFLOVAsUUFBUSxLQUFSLEtBQW1CeU4sV0FBVyxHQUFYLElBQWtCQSxXQUFXLEdBQWhELENBQUwsRUFBNkQ7QUFDNUQ5WixpQkFBS3lGLFFBQUwsQ0FBY3JDLE1BQWQsQ0FBc0JwRCxLQUFLeUYsUUFBTCxDQUFjMUksT0FBZCxDQUFzQmdELEtBQTVDLEVBQW1ELEdBQW5EO0FBQ0E7O0FBRURDLGFBQUt1QixVQUFMLENBQWdCc0csV0FBaEIsQ0FBNkIscUJBQTdCO0FBRUEsS0FoQ0Q7O0FBa0NBO0FBQ0E7O0FBRUFvUSxjQUFVL1csU0FBVixDQUFvQmtiLFVBQXBCLEdBQWlDLFlBQVc7O0FBRTNDLFlBQUlwYyxPQUFPLElBQVg7QUFDQSxZQUFJb2EsVUFBSixFQUFnQkMsVUFBaEIsRUFBNEJDLE1BQTVCOztBQUVBLFlBQUssQ0FBQ3RhLEtBQUttWixjQUFYLEVBQTRCO0FBQzNCO0FBQ0E7O0FBRUQsWUFBS25aLEtBQUtGLElBQUwsQ0FBVWxFLFFBQVYsS0FBdUIsS0FBNUIsRUFBb0M7QUFDbkN3ZSx5QkFBYXBhLEtBQUttWixjQUFMLENBQW9CMVIsSUFBakM7QUFDQTRTLHlCQUFhcmEsS0FBS21aLGNBQUwsQ0FBb0J6UixHQUFqQztBQUVBLFNBSkQsTUFJTzs7QUFFTjtBQUNBMFMseUJBQWFwYSxLQUFLbVosY0FBTCxDQUFvQjFSLElBQXBCLEdBQTZCekgsS0FBS2ljLFNBQUwsR0FBaUJqYyxLQUFLaEUsS0FBaEU7QUFDQXFlLHlCQUFhcmEsS0FBS21aLGNBQUwsQ0FBb0J6UixHQUFwQixHQUE2QjFILEtBQUtrYyxTQUFMLEdBQWlCbGMsS0FBS2hFLEtBQWhFO0FBQ0E7O0FBRURzZSxpQkFBU3RhLEtBQUtnYixhQUFMLENBQW9CWixVQUFwQixFQUFnQ0MsVUFBaEMsRUFBNENyYSxLQUFLa1osZUFBTCxDQUFxQmhSLEtBQWpFLEVBQXdFbEksS0FBS2taLGVBQUwsQ0FBcUI1UCxNQUE3RixDQUFUOztBQUVDZ1IsZUFBT3BTLEtBQVAsR0FBZ0JsSSxLQUFLa1osZUFBTCxDQUFxQmhSLEtBQXJDO0FBQ0FvUyxlQUFPaFIsTUFBUCxHQUFnQnRKLEtBQUtrWixlQUFMLENBQXFCNVAsTUFBckM7O0FBRURoUixVQUFFRyxRQUFGLENBQVcwUCxPQUFYLENBQW9CbkksS0FBSytJLFFBQXpCLEVBQW1DdVIsTUFBbkMsRUFBMkMsR0FBM0M7QUFDQSxLQTFCRDs7QUE2QkFyQyxjQUFVL1csU0FBVixDQUFvQm1iLFVBQXBCLEdBQWlDLFlBQVc7O0FBRTNDLFlBQUlyYyxPQUFPLElBQVg7O0FBRUEsWUFBSWpELFVBQVVpRCxLQUFLeUYsUUFBTCxDQUFjMUksT0FBNUI7O0FBRUEsWUFBSXFkLFVBQUosRUFBZ0JDLFVBQWhCLEVBQTRCQyxNQUE1QixFQUFvQ2lDLEtBQXBDOztBQUVBLFlBQUkvQixXQUFZeGEsS0FBS3dhLFFBQXJCO0FBQ0EsWUFBSUMsWUFBWXphLEtBQUt5YSxTQUFyQjs7QUFFQSxZQUFLLENBQUN6YSxLQUFLbVosY0FBWCxFQUE0QjtBQUMzQjtBQUNBOztBQUVEaUIscUJBQWFwYSxLQUFLbVosY0FBTCxDQUFvQjFSLElBQWpDO0FBQ0E0UyxxQkFBYXJhLEtBQUttWixjQUFMLENBQW9CelIsR0FBakM7O0FBRUE2VSxnQkFBUTtBQUNKN1UsaUJBQVMyUyxVQURMO0FBRUo1UyxrQkFBUzJTLFVBRkw7QUFHSmxTLG1CQUFTc1MsUUFITDtBQUlKbFIsb0JBQVNtUixTQUpMO0FBS1B0UixvQkFBUyxDQUxGO0FBTVBDLG9CQUFTO0FBTkYsU0FBUjs7QUFTRTtBQUNBOVEsVUFBRUcsUUFBRixDQUFXNlIsWUFBWCxDQUF5QnRLLEtBQUsrSSxRQUE5QixFQUF3Q3dULEtBQXhDOztBQUVGLFlBQUsvQixXQUFXeGEsS0FBSzhHLFdBQWhCLElBQStCMlQsWUFBWXphLEtBQUtxSixZQUFyRCxFQUFvRTtBQUNuRXJKLGlCQUFLeUYsUUFBTCxDQUFjb0UsVUFBZCxDQUEwQixHQUExQjtBQUVBLFNBSEQsTUFHTyxJQUFLMlEsV0FBV3pkLFFBQVFtTCxLQUFuQixJQUE0QnVTLFlBQVkxZCxRQUFRdU0sTUFBckQsRUFBOEQ7QUFDcEV0SixpQkFBS3lGLFFBQUwsQ0FBY2tELGFBQWQsQ0FBNkIzSSxLQUFLb1osaUJBQWxDLEVBQXFEcFosS0FBS3FaLGlCQUExRCxFQUE2RSxHQUE3RTtBQUVBLFNBSE0sTUFHQTs7QUFFTmlCLHFCQUFTdGEsS0FBS2diLGFBQUwsQ0FBb0JaLFVBQXBCLEVBQWdDQyxVQUFoQyxFQUE0Q0csUUFBNUMsRUFBc0RDLFNBQXRELENBQVQ7O0FBRUE7QUFDQW5pQixjQUFFRyxRQUFGLENBQVc2UixZQUFYLENBQXlCdEssS0FBS0gsT0FBOUIsRUFBdUN2SCxFQUFFRyxRQUFGLENBQVc2TyxZQUFYLENBQXlCdEgsS0FBSytJLFFBQTlCLENBQXZDOztBQUVBelEsY0FBRUcsUUFBRixDQUFXMFAsT0FBWCxDQUFvQm5JLEtBQUsrSSxRQUF6QixFQUFtQ3VSLE1BQW5DLEVBQTJDLEdBQTNDO0FBQ0E7QUFFRCxLQTlDRDs7QUFnREFyQyxjQUFVL1csU0FBVixDQUFvQjhhLEtBQXBCLEdBQTRCLFVBQVNsWCxDQUFULEVBQVk7QUFDdkMsWUFBSTlFLE9BQVUsSUFBZDtBQUNBLFlBQUl3VCxVQUFVbGIsRUFBR3dNLEVBQUVhLE1BQUwsQ0FBZDs7QUFFQSxZQUFJRixXQUFXekYsS0FBS3lGLFFBQXBCO0FBQ0EsWUFBSTFJLFVBQVcwSSxTQUFTMUksT0FBeEI7O0FBRUEsWUFBSWdmLFlBQWNqWCxLQUFLd1IsU0FBVXhSLENBQVYsQ0FBUCxJQUEwQjlFLEtBQUt3WSxXQUEvQzs7QUFFQSxZQUFJZ0UsT0FBT1QsVUFBVSxDQUFWLElBQWVBLFVBQVUsQ0FBVixFQUFhblQsQ0FBYixHQUFpQjVJLEtBQUtvWSxNQUFMLENBQVkzSCxNQUFaLEdBQXFCaEosSUFBckQsR0FBNEQsQ0FBdkU7QUFDQSxZQUFJZ1YsT0FBT1YsVUFBVSxDQUFWLElBQWVBLFVBQVUsQ0FBVixFQUFhbFQsQ0FBYixHQUFpQjdJLEtBQUtvWSxNQUFMLENBQVkzSCxNQUFaLEdBQXFCL0ksR0FBckQsR0FBNEQsQ0FBdkU7O0FBRUEsWUFBSWdWLEtBQUo7O0FBRUEsWUFBSUMsVUFBVSxTQUFWQSxPQUFVLENBQVdDLE1BQVgsRUFBb0I7O0FBRWpDLGdCQUFJQyxTQUFTOWYsUUFBUStDLElBQVIsQ0FBYzhjLE1BQWQsQ0FBYjs7QUFFQSxnQkFBS3RrQixFQUFFcVMsVUFBRixDQUFja1MsTUFBZCxDQUFMLEVBQThCO0FBQzdCQSx5QkFBU0EsT0FBT3hZLEtBQVAsQ0FBY29CLFFBQWQsRUFBd0IsQ0FBRTFJLE9BQUYsRUFBVytILENBQVgsQ0FBeEIsQ0FBVDtBQUNBOztBQUVELGdCQUFLLENBQUMrWCxNQUFOLEVBQWM7QUFDYjtBQUNBOztBQUVELG9CQUFTQSxNQUFUOztBQUVDLHFCQUFLLE9BQUw7O0FBRUNwWCw2QkFBU3hLLEtBQVQsQ0FBZ0IrRSxLQUFLOGMsVUFBckI7O0FBRUQ7O0FBRUEscUJBQUssZ0JBQUw7O0FBRUNyWCw2QkFBU3NNLGNBQVQsQ0FBeUIsSUFBekI7O0FBRUQ7O0FBRUEscUJBQUssTUFBTDs7QUFFQ3RNLDZCQUFTUCxJQUFUOztBQUVEOztBQUVBLHFCQUFLLGFBQUw7O0FBRUMsd0JBQUtPLFNBQVNwRixLQUFULENBQWVYLE1BQWYsR0FBd0IsQ0FBN0IsRUFBaUM7QUFDaEMrRixpQ0FBU1AsSUFBVDtBQUVBLHFCQUhELE1BR087QUFDTk8saUNBQVN4SyxLQUFULENBQWdCK0UsS0FBSzhjLFVBQXJCO0FBQ0E7O0FBRUY7O0FBRUEscUJBQUssTUFBTDs7QUFFQyx3QkFBSy9mLFFBQVFFLElBQVIsSUFBZ0IsT0FBaEIsS0FBNkJGLFFBQVF3TCxRQUFSLElBQW9CeEwsUUFBUStQLE1BQXpELENBQUwsRUFBeUU7O0FBRXhFLDRCQUFLckgsU0FBU29GLE1BQVQsRUFBTCxFQUF5QjtBQUN4QnBGLHFDQUFTb0UsVUFBVDtBQUVBLHlCQUhELE1BR08sSUFBS3BFLFNBQVNOLFlBQVQsRUFBTCxFQUErQjtBQUNyQ00scUNBQVNrRCxhQUFULENBQXdCNlQsSUFBeEIsRUFBOEJDLElBQTlCO0FBRUEseUJBSE0sTUFHQSxJQUFLaFgsU0FBU3BGLEtBQVQsQ0FBZVgsTUFBZixHQUF3QixDQUE3QixFQUFpQztBQUN2QytGLHFDQUFTeEssS0FBVCxDQUFnQitFLEtBQUs4YyxVQUFyQjtBQUNBO0FBQ0Q7O0FBRUY7QUE5Q0Q7QUFpREEsU0E3REQ7O0FBK0RBO0FBQ0EsWUFBS2hZLEVBQUVNLGFBQUYsSUFBbUJOLEVBQUVNLGFBQUYsQ0FBZ0JpSyxNQUFoQixJQUEwQixDQUFsRCxFQUFzRDtBQUNyRDtBQUNBOztBQUVEO0FBQ0EsWUFBSzVKLFNBQVN5QixTQUFkLEVBQTBCO0FBQ3pCO0FBQ0E7O0FBRUQ7QUFDQSxZQUFLc1YsT0FBT2hKLFFBQVEsQ0FBUixFQUFXbFIsV0FBWCxHQUF5QmtSLFFBQVEvQyxNQUFSLEdBQWlCaEosSUFBdEQsRUFBNkQ7QUFDNUQ7QUFDQTs7QUFFRDtBQUNBLFlBQUsrTCxRQUFRM04sRUFBUixDQUFZLGtFQUFaLENBQUwsRUFBd0Y7QUFDdkY2VyxvQkFBUSxTQUFSO0FBRUEsU0FIRCxNQUdPLElBQUtsSixRQUFRM04sRUFBUixDQUFZLGlCQUFaLENBQUwsRUFBdUM7QUFDN0M2VyxvQkFBUSxPQUFSO0FBRUEsU0FITSxNQUdBLElBQU1qWCxTQUFTMUksT0FBVCxDQUFpQmdNLFFBQWpCLElBQTZCdEQsU0FBUzFJLE9BQVQsQ0FBaUJnTSxRQUFqQixDQUEwQmpELEdBQTFCLENBQStCaEIsRUFBRWEsTUFBakMsRUFBMENqRyxNQUE3RSxFQUFzRjtBQUMzRmdkLG9CQUFRLFNBQVI7QUFFRCxTQUhNLE1BR0E7QUFDTjtBQUNBOztBQUVEO0FBQ0EsWUFBSzFjLEtBQUsrYyxNQUFWLEVBQW1COztBQUVsQjtBQUNBN1AseUJBQWNsTixLQUFLK2MsTUFBbkI7QUFDQS9jLGlCQUFLK2MsTUFBTCxHQUFjLElBQWQ7O0FBRUE7QUFDQSxnQkFBSy9VLEtBQUs4QyxHQUFMLENBQVUwUixPQUFPeGMsS0FBS3djLElBQXRCLElBQStCLEVBQS9CLElBQXFDeFUsS0FBSzhDLEdBQUwsQ0FBVTJSLE9BQU96YyxLQUFLeWMsSUFBdEIsSUFBK0IsRUFBcEUsSUFBMEVoWCxTQUFTeUIsU0FBeEYsRUFBb0c7QUFDbkcsdUJBQU8sSUFBUDtBQUNBOztBQUVEO0FBQ0F5VixvQkFBUyxhQUFhRCxLQUF0QjtBQUVBLFNBZEQsTUFjTzs7QUFFTjtBQUNBO0FBQ0ExYyxpQkFBS3djLElBQUwsR0FBWUEsSUFBWjtBQUNBeGMsaUJBQUt5YyxJQUFMLEdBQVlBLElBQVo7O0FBRUEsZ0JBQUsxZixRQUFRK0MsSUFBUixDQUFjLGFBQWE0YyxLQUEzQixLQUFzQzNmLFFBQVErQyxJQUFSLENBQWMsYUFBYTRjLEtBQTNCLE1BQXVDM2YsUUFBUStDLElBQVIsQ0FBYyxVQUFVNGMsS0FBeEIsQ0FBbEYsRUFBb0g7QUFDbkgxYyxxQkFBSytjLE1BQUwsR0FBYzlkLFdBQVcsWUFBVztBQUNuQ2UseUJBQUsrYyxNQUFMLEdBQWMsSUFBZDs7QUFFQUosNEJBQVMsVUFBVUQsS0FBbkI7QUFFQSxpQkFMYSxFQUtYLEdBTFcsQ0FBZDtBQU9BLGFBUkQsTUFRTztBQUNOQyx3QkFBUyxVQUFVRCxLQUFuQjtBQUNBO0FBRUQ7O0FBRUQsZUFBTyxJQUFQO0FBQ0EsS0EvSUQ7O0FBaUpBcGtCLE1BQUVELFFBQUYsRUFBWXdNLEVBQVosQ0FBZSxlQUFmLEVBQWdDLFVBQVVDLENBQVYsRUFBYVcsUUFBYixFQUF1QjtBQUN0RCxZQUFLQSxZQUFZLENBQUNBLFNBQVN3UyxTQUEzQixFQUF1QztBQUN0Q3hTLHFCQUFTd1MsU0FBVCxHQUFxQixJQUFJQSxTQUFKLENBQWV4UyxRQUFmLENBQXJCO0FBQ0E7QUFDRCxLQUpEOztBQU1Bbk4sTUFBRUQsUUFBRixFQUFZd00sRUFBWixDQUFlLGdCQUFmLEVBQWlDLFVBQVVDLENBQVYsRUFBYVcsUUFBYixFQUF1QjtBQUN2RCxZQUFLQSxZQUFZQSxTQUFTd1MsU0FBMUIsRUFBc0M7QUFDckN4UyxxQkFBU3dTLFNBQVQsQ0FBbUI3RixPQUFuQjtBQUNBO0FBQ0QsS0FKRDtBQU9BLENBbjVCQyxFQW01QkNoYSxNQW41QkQsRUFtNUJTQyxRQW41QlQsRUFtNUJtQkQsT0FBT3diLE1BQVAsSUFBaUJBLE1BbjVCcEMsQ0FBRDs7QUFxNUJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUUsV0FBVXZiLFFBQVYsRUFBb0JDLENBQXBCLEVBQXVCO0FBQ3hCOztBQUVBQSxNQUFFMkgsTUFBRixDQUFTLElBQVQsRUFBZTNILEVBQUVHLFFBQUYsQ0FBV0csUUFBMUIsRUFBb0M7QUFDbkNrQyxnQkFBUztBQUNSaUIsdUJBQ0MscUdBQ0MsMkJBREQsR0FFRSxxQ0FGRixHQUdFLG9DQUhGLEdBSUMsUUFKRCxHQUtBO0FBUE8sU0FEMEI7QUFVbkNBLG1CQUFZO0FBQ1hOLHVCQUFZLEtBREQ7QUFFRk8sbUJBQVk7QUFGVjtBQVZ1QixLQUFwQzs7QUFnQkEsUUFBSTJOLFlBQVksU0FBWkEsU0FBWSxDQUFVbEUsUUFBVixFQUFxQjtBQUNwQyxhQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGFBQUt4RSxJQUFMO0FBQ0EsS0FIRDs7QUFLQTNJLE1BQUUySCxNQUFGLENBQVUwSixVQUFVekksU0FBcEIsRUFBK0I7QUFDOUI4YixlQUFXLElBRG1CO0FBRTlCcFQsa0JBQVcsS0FGbUI7QUFHOUJxVCxpQkFBVyxJQUhtQjs7QUFLOUJoYyxjQUFPLGdCQUFXO0FBQ2pCLGdCQUFJakIsT0FBTyxJQUFYOztBQUVBQSxpQkFBS2lkLE9BQUwsR0FBZWpkLEtBQUt5RixRQUFMLENBQWM1QyxLQUFkLENBQW9CMUosT0FBcEIsQ0FBNEI4SixJQUE1QixDQUFpQyxzQkFBakMsRUFBeUQ0QixFQUF6RCxDQUE0RCxPQUE1RCxFQUFxRSxZQUFXO0FBQzlGN0UscUJBQUtrZCxNQUFMO0FBQ0EsYUFGYyxDQUFmOztBQUlBLGdCQUFLbGQsS0FBS3lGLFFBQUwsQ0FBY3BGLEtBQWQsQ0FBb0JYLE1BQXBCLEdBQTZCLENBQTdCLElBQWtDLENBQUNNLEtBQUt5RixRQUFMLENBQWNwRixLQUFkLENBQXFCTCxLQUFLeUYsUUFBTCxDQUFjbkYsU0FBbkMsRUFBK0NSLElBQS9DLENBQW9EL0QsU0FBNUYsRUFBd0c7QUFDdkdpRSxxQkFBS2lkLE9BQUwsQ0FBYTFYLElBQWI7QUFDQTtBQUNELFNBZjZCOztBQWlCOUI0WCxhQUFNLGFBQVV6TCxLQUFWLEVBQWtCO0FBQ3ZCLGdCQUFJMVIsT0FBTyxJQUFYOztBQUVBO0FBQ0EsZ0JBQUtBLEtBQUt5RixRQUFMLElBQWlCekYsS0FBS3lGLFFBQUwsQ0FBYzFJLE9BQS9CLEtBQTJDMlUsVUFBVSxJQUFWLElBQWtCMVIsS0FBS3lGLFFBQUwsQ0FBYzFJLE9BQWQsQ0FBc0IrQyxJQUF0QixDQUEyQmpILElBQTdDLElBQXFEbUgsS0FBS3lGLFFBQUwsQ0FBY25GLFNBQWQsR0FBMEJOLEtBQUt5RixRQUFMLENBQWNwRixLQUFkLENBQW9CWCxNQUFwQixHQUE2QixDQUF2SixDQUFMLEVBQWlLO0FBQ2hLTSxxQkFBS2dkLEtBQUwsR0FBYS9kLFdBQVcsWUFBVztBQUNsQyx3QkFBS2UsS0FBSzRKLFFBQVYsRUFBcUI7QUFDcEI1Siw2QkFBS3lGLFFBQUwsQ0FBY3JDLE1BQWQsQ0FBc0IsQ0FBQ3BELEtBQUt5RixRQUFMLENBQWNuRixTQUFkLEdBQTBCLENBQTNCLElBQWdDTixLQUFLeUYsUUFBTCxDQUFjcEYsS0FBZCxDQUFvQlgsTUFBMUU7QUFDQTtBQUVELGlCQUxZLEVBS1ZNLEtBQUt5RixRQUFMLENBQWMxSSxPQUFkLENBQXNCK0MsSUFBdEIsQ0FBMkIvRCxTQUEzQixDQUFxQ0MsS0FMM0IsQ0FBYjtBQU9BLGFBUkQsTUFRTztBQUNOZ0UscUJBQUsrSCxJQUFMO0FBQ0EvSCxxQkFBS3lGLFFBQUwsQ0FBY1Usa0JBQWQsR0FBbUMsQ0FBbkM7QUFDQW5HLHFCQUFLeUYsUUFBTCxDQUFjWSxZQUFkO0FBQ0E7QUFDRCxTQWxDNkI7O0FBb0M5QitXLGVBQVEsaUJBQVc7QUFDbEIsZ0JBQUlwZCxPQUFPLElBQVg7O0FBRUFrTix5QkFBY2xOLEtBQUtnZCxLQUFuQjs7QUFFQWhkLGlCQUFLZ2QsS0FBTCxHQUFhLElBQWI7QUFDQSxTQTFDNkI7O0FBNEM5QnZOLGVBQVEsaUJBQVc7QUFDbEIsZ0JBQUl6UCxPQUFPLElBQVg7QUFDQSxnQkFBSWpELFVBQVVpRCxLQUFLeUYsUUFBTCxDQUFjMUksT0FBNUI7O0FBRUEsZ0JBQUtBLE9BQUwsRUFBZTtBQUNkaUQscUJBQUs0SixRQUFMLEdBQWdCLElBQWhCOztBQUVBNUoscUJBQUtpZCxPQUFMLENBQ0VoakIsSUFERixDQUNRLE9BRFIsRUFDaUI4QyxRQUFRK0MsSUFBUixDQUFhckMsSUFBYixDQUFtQlYsUUFBUStDLElBQVIsQ0FBYXRDLElBQWhDLEVBQXVDTyxTQUR4RCxFQUVFOEosV0FGRixDQUVlLHVCQUZmLEVBR0VqRyxRQUhGLENBR1ksd0JBSFo7O0FBS0M1QixxQkFBS21kLEdBQUwsQ0FBVSxJQUFWO0FBQ0Q7QUFDRCxTQTFENkI7O0FBNEQ5QnBWLGNBQU8sZ0JBQVc7QUFDakIsZ0JBQUkvSCxPQUFPLElBQVg7QUFDQSxnQkFBSWpELFVBQVVpRCxLQUFLeUYsUUFBTCxDQUFjMUksT0FBNUI7O0FBRUFpRCxpQkFBS29kLEtBQUw7O0FBRUFwZCxpQkFBS2lkLE9BQUwsQ0FDRWhqQixJQURGLENBQ1EsT0FEUixFQUNpQjhDLFFBQVErQyxJQUFSLENBQWFyQyxJQUFiLENBQW1CVixRQUFRK0MsSUFBUixDQUFhdEMsSUFBaEMsRUFBdUNNLFVBRHhELEVBRUUrSixXQUZGLENBRWUsd0JBRmYsRUFHRWpHLFFBSEYsQ0FHWSx1QkFIWjs7QUFLQTVCLGlCQUFLNEosUUFBTCxHQUFnQixLQUFoQjtBQUNBLFNBeEU2Qjs7QUEwRTlCc1QsZ0JBQVMsa0JBQVc7QUFDbkIsZ0JBQUlsZCxPQUFPLElBQVg7O0FBRUEsZ0JBQUtBLEtBQUs0SixRQUFWLEVBQXFCO0FBQ3BCNUoscUJBQUsrSCxJQUFMO0FBRUEsYUFIRCxNQUdPO0FBQ04vSCxxQkFBS3lQLEtBQUw7QUFDQTtBQUNEOztBQW5GNkIsS0FBL0I7O0FBdUZBblgsTUFBRUQsUUFBRixFQUFZd00sRUFBWixDQUFlO0FBQ2QscUJBQWMsa0JBQVNDLENBQVQsRUFBWVcsUUFBWixFQUFzQjtBQUNuQyxnQkFBS0EsWUFBWSxDQUFDQSxTQUFTa0UsU0FBM0IsRUFBdUM7QUFDdENsRSx5QkFBU2tFLFNBQVQsR0FBcUIsSUFBSUEsU0FBSixDQUFlbEUsUUFBZixDQUFyQjtBQUNBO0FBQ0QsU0FMYTs7QUFPZCx5QkFBa0Isc0JBQVNYLENBQVQsRUFBWVcsUUFBWixFQUFzQjFJLE9BQXRCLEVBQStCNEQsUUFBL0IsRUFBeUM7QUFDMUQsZ0JBQUlnSixZQUFZbEUsWUFBWUEsU0FBU2tFLFNBQXJDOztBQUVBLGdCQUFLaEosUUFBTCxFQUFnQjs7QUFFZixvQkFBS2dKLGFBQWE1TSxRQUFRK0MsSUFBUixDQUFhL0QsU0FBYixDQUF1Qk4sU0FBekMsRUFBcUQ7QUFDcERrTyw4QkFBVThGLEtBQVY7QUFDQTtBQUVELGFBTkQsTUFNTyxJQUFLOUYsYUFBYUEsVUFBVUMsUUFBNUIsRUFBd0M7QUFDOUNELDBCQUFVeVQsS0FBVjtBQUNBO0FBQ0QsU0FuQmE7O0FBcUJkLHdCQUFpQixxQkFBU3RZLENBQVQsRUFBWVcsUUFBWixFQUFzQjFJLE9BQXRCLEVBQStCO0FBQy9DLGdCQUFJNE0sWUFBWWxFLFlBQVlBLFNBQVNrRSxTQUFyQzs7QUFFQSxnQkFBS0EsYUFBYUEsVUFBVUMsUUFBNUIsRUFBdUM7QUFDdENELDBCQUFVd1QsR0FBVjtBQUNBO0FBQ0QsU0EzQmE7O0FBNkJkLDJCQUFvQix3QkFBU3JZLENBQVQsRUFBWVcsUUFBWixFQUFzQjFJLE9BQXRCLEVBQStCc2dCLFFBQS9CLEVBQXlDclgsT0FBekMsRUFBa0Q7QUFDckUsZ0JBQUkyRCxZQUFZbEUsWUFBWUEsU0FBU2tFLFNBQXJDOztBQUVBO0FBQ0EsZ0JBQUtBLGFBQWE1TSxRQUFRK0MsSUFBUixDQUFhL0QsU0FBMUIsS0FBeUNpSyxZQUFZLEVBQVosSUFBa0JBLFlBQVksRUFBdkUsS0FBK0UsQ0FBQzFOLEVBQUVELFNBQVN5SSxhQUFYLEVBQTBCK0UsRUFBMUIsQ0FBOEIsZ0JBQTlCLENBQXJGLEVBQXdJO0FBQ3ZJd1gseUJBQVNyWSxjQUFUOztBQUVBMkUsMEJBQVV1VCxNQUFWO0FBQ0E7QUFDRCxTQXRDYTs7QUF3Q2QsMENBQW1DLHFDQUFTcFksQ0FBVCxFQUFZVyxRQUFaLEVBQXNCO0FBQ3hELGdCQUFJa0UsWUFBWWxFLFlBQVlBLFNBQVNrRSxTQUFyQzs7QUFFQSxnQkFBS0EsU0FBTCxFQUFpQjtBQUNoQkEsMEJBQVU1QixJQUFWO0FBQ0E7QUFDRDtBQTlDYSxLQUFmOztBQWlEQTtBQUNBelAsTUFBRUQsUUFBRixFQUFZd00sRUFBWixDQUFlLGtCQUFmLEVBQW1DLFlBQVc7QUFDN0MsWUFBSVksV0FBWW5OLEVBQUVHLFFBQUYsQ0FBV2tKLFdBQVgsRUFBaEI7QUFDQSxZQUFJZ0ksWUFBWWxFLFlBQVlBLFNBQVNrRSxTQUFyQzs7QUFFQSxZQUFLQSxhQUFhQSxVQUFVQyxRQUE1QixFQUF1QztBQUN0QyxnQkFBS3ZSLFNBQVNpbEIsTUFBZCxFQUF1QjtBQUN0QjNULDBCQUFVeVQsS0FBVjtBQUVBLGFBSEQsTUFHTztBQUNOelQsMEJBQVV3VCxHQUFWO0FBQ0E7QUFDRDtBQUNELEtBWkQ7QUFjQSxDQS9LQyxFQStLQzlrQixRQS9LRCxFQStLV0QsT0FBT3diLE1BQVAsSUFBaUJBLE1BL0s1QixDQUFEOztBQWlMRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFFLFdBQVV2YixRQUFWLEVBQW9CQyxDQUFwQixFQUF1QjtBQUN4Qjs7QUFFQTs7QUFDQSxRQUFJRSxLQUFNLFlBQVk7O0FBRXJCLFlBQUkra0IsUUFBUSxDQUNYLENBQ0MsbUJBREQsRUFFQyxnQkFGRCxFQUdDLG1CQUhELEVBSUMsbUJBSkQsRUFLQyxrQkFMRCxFQU1DLGlCQU5ELENBRFc7QUFTWDtBQUNBLFNBQ0MseUJBREQsRUFFQyxzQkFGRCxFQUdDLHlCQUhELEVBSUMseUJBSkQsRUFLQyx3QkFMRCxFQU1DLHVCQU5ELENBVlc7QUFtQlg7QUFDQSxTQUNDLHlCQURELEVBRUMsd0JBRkQsRUFHQyxnQ0FIRCxFQUlDLHdCQUpELEVBS0Msd0JBTEQsRUFNQyx1QkFORCxDQXBCVyxFQTZCWCxDQUNDLHNCQURELEVBRUMscUJBRkQsRUFHQyxzQkFIRCxFQUlDLHNCQUpELEVBS0MscUJBTEQsRUFNQyxvQkFORCxDQTdCVyxFQXFDWCxDQUNDLHFCQURELEVBRUMsa0JBRkQsRUFHQyxxQkFIRCxFQUlDLHFCQUpELEVBS0Msb0JBTEQsRUFNQyxtQkFORCxDQXJDVyxDQUFaOztBQStDQSxZQUFJQyxHQUFKO0FBQ0EsWUFBSW5SLE1BQU0sRUFBVjtBQUNBLFlBQUkxSSxDQUFKLEVBQU9pSixDQUFQOztBQUVBLGFBQU1qSixJQUFJLENBQVYsRUFBYUEsSUFBSTRaLE1BQU03ZCxNQUF2QixFQUErQmlFLEdBQS9CLEVBQXFDO0FBQ3BDNlosa0JBQU1ELE1BQU81WixDQUFQLENBQU47O0FBRUEsZ0JBQUs2WixPQUFPQSxJQUFLLENBQUwsS0FBWW5sQixRQUF4QixFQUFtQztBQUNsQyxxQkFBTXVVLElBQUksQ0FBVixFQUFhQSxJQUFJNFEsSUFBSTlkLE1BQXJCLEVBQTZCa04sR0FBN0IsRUFBbUM7QUFDbENQLHdCQUFLa1IsTUFBTyxDQUFQLEVBQVkzUSxDQUFaLENBQUwsSUFBeUI0USxJQUFLNVEsQ0FBTCxDQUF6QjtBQUNBOztBQUVELHVCQUFPUCxHQUFQO0FBQ0E7QUFDRDs7QUFFRCxlQUFPLEtBQVA7QUFDQSxLQWxFUSxFQUFUOztBQW9FQTtBQUNBLFFBQUssQ0FBQzdULEVBQU4sRUFBVzs7QUFFVixZQUFLRixLQUFLQSxFQUFFRyxRQUFaLEVBQXVCO0FBQ3RCSCxjQUFFRyxRQUFGLENBQVdHLFFBQVgsQ0FBb0JrQyxNQUFwQixDQUEyQlUsVUFBM0IsR0FBd0MsS0FBeEM7QUFDQTs7QUFFRDtBQUNBOztBQUVELFFBQUlpaUIsYUFBYTs7QUFFaEJDLGlCQUFVLGlCQUFXQyxJQUFYLEVBQWtCOztBQUUzQkEsbUJBQU9BLFFBQVF0bEIsU0FBU2lXLGVBQXhCOztBQUVBcVAsaUJBQU1ubEIsR0FBR29sQixpQkFBVCxFQUE4QkQsS0FBS0Usb0JBQW5DO0FBRUEsU0FSZTtBQVNoQkMsY0FBTyxnQkFBWTs7QUFFbEJ6bEIscUJBQVVHLEdBQUd1bEIsY0FBYjtBQUVBLFNBYmU7QUFjaEJiLGdCQUFTLGdCQUFXUyxJQUFYLEVBQWtCOztBQUUxQkEsbUJBQU9BLFFBQVF0bEIsU0FBU2lXLGVBQXhCOztBQUVBLGdCQUFLLEtBQUswUCxZQUFMLEVBQUwsRUFBMkI7QUFDMUIscUJBQUtGLElBQUw7QUFFQSxhQUhELE1BR087QUFDTixxQkFBS0osT0FBTCxDQUFjQyxJQUFkO0FBQ0E7QUFFRCxTQXpCZTtBQTBCaEJLLHNCQUFlLHdCQUFZOztBQUUxQixtQkFBT0MsUUFBUzVsQixTQUFVRyxHQUFHMGxCLGlCQUFiLENBQVQsQ0FBUDtBQUVBLFNBOUJlO0FBK0JoQkMsaUJBQVUsbUJBQVk7O0FBRXJCLG1CQUFPRixRQUFTNWxCLFNBQVVHLEdBQUc0bEIsaUJBQWIsQ0FBVCxDQUFQO0FBRUE7QUFuQ2UsS0FBakI7O0FBc0NBOWxCLE1BQUUySCxNQUFGLENBQVMsSUFBVCxFQUFlM0gsRUFBRUcsUUFBRixDQUFXRyxRQUExQixFQUFvQztBQUNuQ2tDLGdCQUFTO0FBQ1JVLHdCQUNDLGtIQUNDLDJCQURELEdBRUUscURBRkYsR0FHQyxRQUhELEdBSUE7QUFOTyxTQUQwQjtBQVNuQ0Esb0JBQWE7QUFDWkMsdUJBQVk7QUFEQTtBQVRzQixLQUFwQzs7QUFjQW5ELE1BQUVELFFBQUYsRUFBWXdNLEVBQVosQ0FBZTtBQUNkLHFCQUFjLGtCQUFTQyxDQUFULEVBQVlXLFFBQVosRUFBc0I7QUFDbkMsZ0JBQUlsRSxVQUFKOztBQUVBLGdCQUFLa0UsWUFBWUEsU0FBU3BGLEtBQVQsQ0FBZ0JvRixTQUFTbkYsU0FBekIsRUFBcUNSLElBQXJDLENBQTBDdEUsVUFBM0QsRUFBd0U7QUFDdkUrRiw2QkFBYWtFLFNBQVM1QyxLQUFULENBQWVDLFNBQTVCOztBQUVBdkIsMkJBQVdzRCxFQUFYLENBQWMscUJBQWQsRUFBcUMsNEJBQXJDLEVBQW1FLFVBQVNDLENBQVQsRUFBWTs7QUFFOUVBLHNCQUFFQyxlQUFGO0FBQ0FELHNCQUFFRSxjQUFGOztBQUVBeVksK0JBQVdQLE1BQVgsQ0FBbUIzYixXQUFZLENBQVosQ0FBbkI7QUFFQSxpQkFQRDs7QUFTQSxvQkFBS2tFLFNBQVMzRixJQUFULENBQWN0RSxVQUFkLElBQTRCaUssU0FBUzNGLElBQVQsQ0FBY3RFLFVBQWQsQ0FBeUJDLFNBQXpCLEtBQXVDLElBQXhFLEVBQStFO0FBQzlFZ2lCLCtCQUFXQyxPQUFYLENBQW9CbmMsV0FBWSxDQUFaLENBQXBCO0FBQ0E7O0FBRUQ7QUFDQWtFLHlCQUFTZ1ksVUFBVCxHQUFzQkEsVUFBdEI7QUFFQSxhQW5CRCxNQW1CTyxJQUFLaFksUUFBTCxFQUFnQjtBQUN0QkEseUJBQVM1QyxLQUFULENBQWUxSixPQUFmLENBQXVCOEosSUFBdkIsQ0FBNEIsNEJBQTVCLEVBQTBEc0MsSUFBMUQ7QUFDQTtBQUVELFNBM0JhOztBQTZCZCwyQkFBb0Isd0JBQVNULENBQVQsRUFBWVcsUUFBWixFQUFzQjFJLE9BQXRCLEVBQStCc2dCLFFBQS9CLEVBQXlDclgsT0FBekMsRUFBa0Q7O0FBRXJFO0FBQ0EsZ0JBQUtQLFlBQVlBLFNBQVNnWSxVQUFyQixJQUFtQ3pYLFlBQVksRUFBcEQsRUFBeUQ7QUFDeERxWCx5QkFBU3JZLGNBQVQ7O0FBRUFTLHlCQUFTZ1ksVUFBVCxDQUFvQlAsTUFBcEIsQ0FBNEJ6WCxTQUFTNUMsS0FBVCxDQUFlQyxTQUFmLENBQTBCLENBQTFCLENBQTVCO0FBQ0E7QUFFRCxTQXRDYTs7QUF3Q2QsMEJBQW1CLHVCQUFVMkMsUUFBVixFQUFxQjtBQUN2QyxnQkFBS0EsWUFBWUEsU0FBU2dZLFVBQTFCLEVBQXVDO0FBQ3RDQSwyQkFBV0ssSUFBWDtBQUNBO0FBQ0Q7QUE1Q2EsS0FBZjs7QUErQ0F4bEIsTUFBRUQsUUFBRixFQUFZd00sRUFBWixDQUFlck0sR0FBRzZsQixnQkFBbEIsRUFBb0MsWUFBVztBQUM5QyxZQUFJTCxlQUFlUCxXQUFXTyxZQUFYLEVBQW5CO0FBQUEsWUFDQ3ZZLFdBQVduTixFQUFFRyxRQUFGLENBQVdrSixXQUFYLEVBRFo7O0FBR0EsWUFBSzhELFFBQUwsRUFBZ0I7O0FBRWY7QUFDQSxnQkFBS0EsU0FBUzFJLE9BQVQsSUFBb0IwSSxTQUFTMUksT0FBVCxDQUFpQkUsSUFBakIsS0FBMEIsT0FBOUMsSUFBeUR3SSxTQUFTMEIsV0FBdkUsRUFBcUY7QUFDcEYxQix5QkFBUzFJLE9BQVQsQ0FBaUJnTSxRQUFqQixDQUEwQi9PLEdBQTFCLENBQStCLFlBQS9CLEVBQTZDLE1BQTdDOztBQUVBeUwseUJBQVMwQixXQUFULEdBQXVCLEtBQXZCOztBQUVBMUIseUJBQVNKLE1BQVQsQ0FBaUIsSUFBakIsRUFBdUIsSUFBdkIsRUFBNkIsQ0FBN0I7QUFDQTs7QUFFREkscUJBQVN2QyxPQUFULENBQWtCLG9CQUFsQixFQUF3QzhhLFlBQXhDOztBQUVBdlkscUJBQVM1QyxLQUFULENBQWVDLFNBQWYsQ0FBeUJnUCxXQUF6QixDQUFzQyx3QkFBdEMsRUFBZ0VrTSxZQUFoRTtBQUNBO0FBRUQsS0FwQkQ7QUFzQkEsQ0EzTUMsRUEyTUMzbEIsUUEzTUQsRUEyTVdELE9BQU93YixNQUFQLElBQWlCQSxNQTNNNUIsQ0FBRDs7QUE2TUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBRSxXQUFVdmIsUUFBVixFQUFvQkMsQ0FBcEIsRUFBdUI7QUFDeEI7O0FBRUE7O0FBQ0FBLE1BQUVHLFFBQUYsQ0FBV0csUUFBWCxHQUFzQk4sRUFBRTJILE1BQUYsQ0FBUyxJQUFULEVBQWU7QUFDcENuRixnQkFBUztBQUNSbUIsb0JBQ0EscUdBQ0MsNkJBREQsR0FFRSxvTkFGRixHQUdDLFFBSEQsR0FJQTtBQU5RLFNBRDJCO0FBU3BDQSxnQkFBUztBQUNSUix1QkFBYyxLQUROLEVBQzhCO0FBQ3RDUyx5QkFBYyxJQUZOLEVBRThCO0FBQ3RDZCxzQkFBYyxxQkFITixFQUc4QjtBQUN0Q2Usa0JBQWMsR0FKTixDQUk4QjtBQUo5QjtBQVQyQixLQUFmLEVBZW5CN0QsRUFBRUcsUUFBRixDQUFXRyxRQWZRLENBQXRCOztBQWlCQSxRQUFJMGxCLGNBQWMsU0FBZEEsV0FBYyxDQUFVN1ksUUFBVixFQUFxQjtBQUN0QyxhQUFLeEUsSUFBTCxDQUFXd0UsUUFBWDtBQUNBLEtBRkQ7O0FBSUFuTixNQUFFMkgsTUFBRixDQUFVcWUsWUFBWXBkLFNBQXRCLEVBQWlDOztBQUVoQytiLGlCQUFXLElBRnFCO0FBR2hDc0IsZUFBUyxJQUh1QjtBQUloQ0MsZUFBUyxJQUp1QjtBQUtoQ3pOLG1CQUFZLEtBTG9CO0FBTWhDbkgsa0JBQVcsS0FOcUI7O0FBUWhDM0ksY0FBTyxjQUFVd0UsUUFBVixFQUFxQjtBQUMzQixnQkFBSXpGLE9BQU8sSUFBWDs7QUFFQUEsaUJBQUt5RixRQUFMLEdBQWdCQSxRQUFoQjs7QUFFQUEscUJBQVNnWixNQUFULEdBQWtCemUsSUFBbEI7O0FBRUE7QUFDQSxnQkFBSW9QLFFBQVMzSixTQUFTcEYsS0FBVCxDQUFlLENBQWYsQ0FBYjtBQUFBLGdCQUNDcWUsU0FBU2paLFNBQVNwRixLQUFULENBQWUsQ0FBZixDQURWOztBQUdBTCxpQkFBS0YsSUFBTCxHQUFZMkYsU0FBU3BGLEtBQVQsQ0FBZ0JvRixTQUFTbkYsU0FBekIsRUFBcUNSLElBQXJDLENBQTBDN0QsTUFBdEQ7O0FBRUErRCxpQkFBS2lkLE9BQUwsR0FBZXhYLFNBQVM1QyxLQUFULENBQWUxSixPQUFmLENBQXVCOEosSUFBdkIsQ0FBNkIsd0JBQTdCLENBQWY7O0FBRUEsZ0JBQUtqRCxLQUFLRixJQUFMLElBQWFzUCxLQUFiLElBQXNCc1AsTUFBdEIsSUFDQSxDQUFFdFAsTUFBTW5TLElBQU4sSUFBYyxPQUFkLElBQTBCbVMsTUFBTXRQLElBQU4sQ0FBVytNLEtBQXJDLElBQStDdUMsTUFBTXRQLElBQU4sQ0FBV3FFLE1BQTVELE1BQ0V1YSxPQUFPemhCLElBQVAsSUFBZSxPQUFmLElBQTBCeWhCLE9BQU81ZSxJQUFQLENBQVkrTSxLQUF0QyxJQUErQzZSLE9BQU81ZSxJQUFQLENBQVlxRSxNQUQ3RCxDQURMLEVBR0c7O0FBRUZuRSxxQkFBS2lkLE9BQUwsQ0FBYXpYLElBQWIsR0FBb0JYLEVBQXBCLENBQXVCLE9BQXZCLEVBQWdDLFlBQVc7QUFDMUM3RSx5QkFBS2tkLE1BQUw7QUFDQSxpQkFGRDs7QUFJQWxkLHFCQUFLNEosUUFBTCxHQUFnQixJQUFoQjtBQUVBLGFBWEQsTUFXTztBQUNONUoscUJBQUtpZCxPQUFMLENBQWExWCxJQUFiO0FBQ0E7QUFDRCxTQXJDK0I7O0FBdUNoQ29aLGdCQUFTLGtCQUFXO0FBQ25CLGdCQUFJM2UsT0FBTyxJQUFYO0FBQUEsZ0JBQ0N5RixXQUFXekYsS0FBS3lGLFFBRGpCO0FBQUEsZ0JBRUNySyxXQUFXNEUsS0FBS0YsSUFBTCxDQUFVMUUsUUFGdEI7QUFBQSxnQkFHQ3dqQixJQUhEO0FBQUEsZ0JBSUMvYSxHQUpEOztBQU1BN0QsaUJBQUt1ZSxLQUFMLEdBQWFqbUIsRUFBRSxpREFBaUQwSCxLQUFLRixJQUFMLENBQVUzRCxJQUEzRCxHQUFrRSxVQUFwRSxFQUFnRmlHLFFBQWhGLENBQTBGcUQsU0FBUzVDLEtBQVQsQ0FBZUMsU0FBZixDQUF5QkcsSUFBekIsQ0FBK0I3SCxRQUEvQixFQUEwQ3lqQixPQUExQyxHQUFvRHJhLE1BQXBELENBQTREcEosUUFBNUQsQ0FBMUYsQ0FBYjs7QUFFQTtBQUNBd2pCLG1CQUFPLE1BQVA7O0FBRUF0bUIsY0FBRW1LLElBQUYsQ0FBT2dELFNBQVNwRixLQUFoQixFQUF1QixVQUFVc0QsQ0FBVixFQUFhWCxJQUFiLEVBQW9CO0FBQzFDYSxzQkFBTWIsS0FBS2xELElBQUwsQ0FBVStNLEtBQVYsS0FBcUI3SixLQUFLbEQsSUFBTCxDQUFVcUUsTUFBVixHQUFtQm5CLEtBQUtsRCxJQUFMLENBQVVxRSxNQUFWLENBQWlCbEssSUFBakIsQ0FBdUIsS0FBdkIsQ0FBbkIsR0FBb0QsSUFBekUsQ0FBTjs7QUFFQSxvQkFBSyxDQUFDNEosR0FBRCxJQUFRYixLQUFLL0YsSUFBTCxLQUFjLE9BQTNCLEVBQXFDO0FBQ3BDNEcsMEJBQU1iLEtBQUthLEdBQVg7QUFDQTs7QUFFRCxvQkFBS0EsT0FBT0EsSUFBSW5FLE1BQWhCLEVBQXlCO0FBQ3hCa2YsNEJBQVEscUJBQXFCamIsQ0FBckIsR0FBeUIsaUVBQXpCLEdBQTZGRSxHQUE3RixHQUFtRyxXQUEzRztBQUNBO0FBQ0QsYUFWRDs7QUFZQSthLG9CQUFRLE9BQVI7O0FBRUE1ZSxpQkFBS3dlLEtBQUwsR0FBYWxtQixFQUFHc21CLElBQUgsRUFBVXhjLFFBQVYsQ0FBb0JwQyxLQUFLdWUsS0FBekIsRUFBaUMxWixFQUFqQyxDQUFvQyxPQUFwQyxFQUE2QyxJQUE3QyxFQUFtRCxZQUFXO0FBQzFFWSx5QkFBU3JDLE1BQVQsQ0FBaUI5SyxFQUFFLElBQUYsRUFBUXVCLElBQVIsQ0FBYSxPQUFiLENBQWpCO0FBQ0EsYUFGWSxDQUFiOztBQUlBbUcsaUJBQUt3ZSxLQUFMLENBQVd2YixJQUFYLENBQWlCLEtBQWpCLEVBQXlCc0MsSUFBekIsR0FBZ0NvRyxHQUFoQyxDQUFvQyxNQUFwQyxFQUE0QyxZQUFXO0FBQ3RELG9CQUFJbVQsVUFBV3htQixFQUFFLElBQUYsRUFBUXNXLE1BQVIsR0FBaUIvRyxXQUFqQixDQUE4Qix5QkFBOUIsQ0FBZjtBQUFBLG9CQUNDa1gsYUFBYUQsUUFBUXRRLFVBQVIsRUFEZDtBQUFBLG9CQUVDd1EsY0FBY0YsUUFBUXJRLFdBQVIsRUFGZjtBQUFBLG9CQUdDdkcsS0FIRDtBQUFBLG9CQUlDb0IsTUFKRDtBQUFBLG9CQUtDMlYsVUFMRDtBQUFBLG9CQU1DQyxXQU5EOztBQVFBaFgsd0JBQVMsS0FBS2tGLFlBQUwsSUFBcUIsS0FBS2xGLEtBQW5DO0FBQ0FvQix5QkFBUyxLQUFLK0QsYUFBTCxJQUFzQixLQUFLL0QsTUFBcEM7O0FBRUE7QUFDQTJWLDZCQUFjL1csUUFBUzZXLFVBQXZCO0FBQ0FHLDhCQUFjNVYsU0FBUzBWLFdBQXZCOztBQUVBLG9CQUFJQyxjQUFjLENBQWQsSUFBbUJDLGVBQWUsQ0FBdEMsRUFBeUM7QUFDeEMsd0JBQUlELGFBQWFDLFdBQWpCLEVBQThCO0FBQzdCaFgsZ0NBQVNBLFFBQVFnWCxXQUFqQjtBQUNBNVYsaUNBQVMwVixXQUFUO0FBRUEscUJBSkQsTUFJTztBQUNOOVcsZ0NBQVM2VyxVQUFUO0FBQ0F6VixpQ0FBU0EsU0FBUzJWLFVBQWxCO0FBQ0E7QUFDRDs7QUFFRDNtQixrQkFBRSxJQUFGLEVBQVEwQixHQUFSLENBQVk7QUFDWGtPLDJCQUFnQkYsS0FBS29DLEtBQUwsQ0FBV2xDLEtBQVgsQ0FETDtBQUVYb0IsNEJBQWdCdEIsS0FBS29DLEtBQUwsQ0FBV2QsTUFBWCxDQUZMO0FBR1gsa0NBQWdCQSxTQUFTMFYsV0FBVCxHQUF5QmhYLEtBQUtvQyxLQUFMLENBQVc0VSxjQUFjLEdBQWQsR0FBb0IxVixTQUFTLEdBQXhDLENBQXpCLEdBQTJFdEIsS0FBS29DLEtBQUwsQ0FBVzRVLGNBQWMsR0FBZCxHQUFvQjFWLFNBQVMsR0FBeEMsQ0FIaEY7QUFJWCxtQ0FBZ0J0QixLQUFLb0MsS0FBTCxDQUFXMlUsYUFBYSxHQUFiLEdBQW1CN1csUUFBUSxHQUF0QztBQUpMLGlCQUFaLEVBS0cxQyxJQUxIO0FBT0EsYUFsQ0QsRUFtQ0MvQyxJQW5DRCxDQW1DTSxZQUFXO0FBQ2hCLHFCQUFLb0IsR0FBTCxHQUFXdkwsRUFBRyxJQUFILEVBQVV1QixJQUFWLENBQWdCLEtBQWhCLENBQVg7QUFDQSxhQXJDRDs7QUF1Q0EsZ0JBQUttRyxLQUFLRixJQUFMLENBQVUzRCxJQUFWLEtBQW1CLEdBQXhCLEVBQThCO0FBQzdCNkQscUJBQUt3ZSxLQUFMLENBQVd0VyxLQUFYLENBQWtCM0gsU0FBVVAsS0FBS3VlLEtBQUwsQ0FBV3ZrQixHQUFYLENBQWUsZUFBZixDQUFWLElBQWdEeUwsU0FBU3BGLEtBQVQsQ0FBZVgsTUFBZixHQUF3Qk0sS0FBS3dlLEtBQUwsQ0FBV2xXLFFBQVgsR0FBc0JzSyxFQUF0QixDQUF5QixDQUF6QixFQUE0QnBFLFVBQTVCLENBQXVDLElBQXZDLENBQXhFLEdBQXlILElBQTNJO0FBQ0E7QUFDRCxTQS9HK0I7O0FBaUhoQ3pJLGVBQVEsZUFBVVksUUFBVixFQUFxQjtBQUM1QixnQkFBSTNHLE9BQU8sSUFBWDtBQUFBLGdCQUNDd2UsUUFBUXhlLEtBQUt3ZSxLQURkO0FBQUEsZ0JBRUMzUixLQUZEO0FBQUEsZ0JBR0MyRCxRQUhEOztBQUtBLGdCQUFLeFEsS0FBS3lGLFFBQUwsQ0FBYzFJLE9BQW5CLEVBQTZCO0FBQzVCOFAsd0JBQVEyUixNQUFNbFcsUUFBTixHQUNOVCxXQURNLENBQ08sd0JBRFAsRUFFTnJELE1BRk0sQ0FFQyxrQkFBa0J4RSxLQUFLeUYsUUFBTCxDQUFjMUksT0FBZCxDQUFzQmdELEtBQXhDLEdBQWlELElBRmxELEVBR042QixRQUhNLENBR0csd0JBSEgsQ0FBUjs7QUFLQTRPLDJCQUFXM0QsTUFBTXFHLFFBQU4sRUFBWDs7QUFFQTtBQUNBLG9CQUFLbFQsS0FBS0YsSUFBTCxDQUFVM0QsSUFBVixLQUFtQixHQUFuQixLQUE0QnFVLFNBQVM5SSxHQUFULEdBQWUsQ0FBZixJQUFvQjhJLFNBQVM5SSxHQUFULEdBQWlCOFcsTUFBTWxWLE1BQU4sS0FBaUJ1RCxNQUFNNEIsV0FBTixFQUFsRixDQUFMLEVBQWlIO0FBQ2hIK1AsMEJBQU16VyxJQUFOLEdBQWFJLE9BQWIsQ0FBcUIsRUFBRSxhQUFjcVcsTUFBTS9jLFNBQU4sS0FBb0IrTyxTQUFTOUksR0FBN0MsRUFBckIsRUFBeUVmLFFBQXpFO0FBRUEsaUJBSEQsTUFHTyxJQUFLM0csS0FBS0YsSUFBTCxDQUFVM0QsSUFBVixLQUFtQixHQUFuQixLQUNWcVUsU0FBUy9JLElBQVQsR0FBZ0IrVyxNQUFNNVAsTUFBTixHQUFlbE4sVUFBZixFQUFoQixJQUNBOE8sU0FBUy9JLElBQVQsR0FBa0IrVyxNQUFNNVAsTUFBTixHQUFlbE4sVUFBZixNQUFnQzhjLE1BQU01UCxNQUFOLEdBQWUxRyxLQUFmLEtBQXlCMkUsTUFBTTJCLFVBQU4sRUFBekQsQ0FGUixDQUFMLEVBSUw7QUFDRGdRLDBCQUFNNVAsTUFBTixHQUFlN0csSUFBZixHQUFzQkksT0FBdEIsQ0FBOEIsRUFBRSxjQUFlcUksU0FBUy9JLElBQTFCLEVBQTlCLEVBQWdFZCxRQUFoRTtBQUNBO0FBQ0Q7QUFDRCxTQTNJK0I7O0FBNkloQ3RCLGdCQUFTLGtCQUFXO0FBQ25CLGlCQUFLSSxRQUFMLENBQWM1QyxLQUFkLENBQW9CQyxTQUFwQixDQUE4QmdQLFdBQTlCLENBQTJDLHNCQUEzQyxFQUFtRSxLQUFLZixTQUF4RTs7QUFFQSxnQkFBSyxLQUFLQSxTQUFWLEVBQXNCO0FBQ3JCLG9CQUFLLENBQUMsS0FBS3dOLEtBQVgsRUFBbUI7QUFDbEIseUJBQUtJLE1BQUw7QUFDQTs7QUFFRCxxQkFBS2xaLFFBQUwsQ0FBY3ZDLE9BQWQsQ0FBdUIsY0FBdkI7O0FBRUEscUJBQUs2QyxLQUFMLENBQVksQ0FBWjtBQUVBLGFBVEQsTUFTTyxJQUFLLEtBQUt3WSxLQUFWLEVBQWtCO0FBQ3hCLHFCQUFLOVksUUFBTCxDQUFjdkMsT0FBZCxDQUF1QixjQUF2QjtBQUNBOztBQUVEO0FBQ0EsaUJBQUt1QyxRQUFMLENBQWNKLE1BQWQ7QUFDQSxTQS9KK0I7O0FBaUtoQ0UsY0FBTyxnQkFBVztBQUNqQixpQkFBS3dMLFNBQUwsR0FBaUIsS0FBakI7QUFDQSxpQkFBSzFMLE1BQUw7QUFDQSxTQXBLK0I7O0FBc0toQ0csY0FBTyxnQkFBVztBQUNqQixpQkFBS3VMLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxpQkFBSzFMLE1BQUw7QUFDQSxTQXpLK0I7O0FBMktoQzZYLGdCQUFTLGtCQUFXO0FBQ25CLGlCQUFLbk0sU0FBTCxHQUFpQixDQUFDLEtBQUtBLFNBQXZCO0FBQ0EsaUJBQUsxTCxNQUFMO0FBQ0E7QUE5SytCLEtBQWpDOztBQWlMQS9NLE1BQUVELFFBQUYsRUFBWXdNLEVBQVosQ0FBZTs7QUFFZCxxQkFBYyxrQkFBU0MsQ0FBVCxFQUFZVyxRQUFaLEVBQXNCO0FBQ25DLGdCQUFJZ1osTUFBSjs7QUFFQSxnQkFBS2haLFlBQVksQ0FBQ0EsU0FBU2daLE1BQTNCLEVBQW9DO0FBQ25DQSx5QkFBUyxJQUFJSCxXQUFKLENBQWlCN1ksUUFBakIsQ0FBVDs7QUFFQSxvQkFBS2daLE9BQU83VSxRQUFQLElBQW1CNlUsT0FBTzNlLElBQVAsQ0FBWXJFLFNBQVosS0FBMEIsSUFBbEQsRUFBeUQ7QUFDeERnakIsMkJBQU9qWixJQUFQO0FBQ0E7QUFDRDtBQUNELFNBWmE7O0FBY2QseUJBQWtCLHNCQUFTVixDQUFULEVBQVlXLFFBQVosRUFBc0J6QyxJQUF0QixFQUE0QnJDLFFBQTVCLEVBQXNDO0FBQ3ZELGdCQUFJOGQsU0FBU2haLFlBQVlBLFNBQVNnWixNQUFsQzs7QUFFQSxnQkFBS0EsVUFBVUEsT0FBTzFOLFNBQXRCLEVBQWtDO0FBQ2pDME4sdUJBQU8xWSxLQUFQLENBQWNwRixXQUFXLENBQVgsR0FBZSxHQUE3QjtBQUNBO0FBQ0QsU0FwQmE7O0FBc0JkLDJCQUFvQix3QkFBU21FLENBQVQsRUFBWVcsUUFBWixFQUFzQjFJLE9BQXRCLEVBQStCc2dCLFFBQS9CLEVBQXlDclgsT0FBekMsRUFBa0Q7QUFDckUsZ0JBQUl5WSxTQUFTaFosWUFBWUEsU0FBU2daLE1BQWxDOztBQUVBO0FBQ0EsZ0JBQUtBLFVBQVVBLE9BQU83VSxRQUFqQixJQUE2QjVELFlBQVksRUFBOUMsRUFBbUQ7QUFDbERxWCx5QkFBU3JZLGNBQVQ7O0FBRUF5Wix1QkFBT3ZCLE1BQVA7QUFDQTtBQUNELFNBL0JhOztBQWlDZCwwQkFBbUIsdUJBQVVwWSxDQUFWLEVBQWFXLFFBQWIsRUFBd0I7QUFDMUMsZ0JBQUlnWixTQUFTaFosWUFBWUEsU0FBU2daLE1BQWxDOztBQUVBLGdCQUFLQSxVQUFVQSxPQUFPMU4sU0FBakIsSUFBOEIwTixPQUFPM2UsSUFBUCxDQUFZNUQsV0FBWixLQUE0QixLQUEvRCxFQUF1RTtBQUN0RXVpQix1QkFBT0YsS0FBUCxDQUFhaFosSUFBYjtBQUNBO0FBQ0Q7O0FBdkNhLEtBQWY7QUEyQ0EsQ0FyUEMsRUFxUEFsTixRQXJQQSxFQXFQVUQsT0FBT3diLE1BclBqQixDQUFEOztBQXVQRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFFLFdBQVV2YixRQUFWLEVBQW9CQyxDQUFwQixFQUF1QjtBQUN4Qjs7QUFFQUEsTUFBRTJILE1BQUYsQ0FBUyxJQUFULEVBQWUzSCxFQUFFRyxRQUFGLENBQVdHLFFBQTFCLEVBQW9DO0FBQ25Da0MsZ0JBQVM7QUFDUnFrQixtQkFDQyxrR0FDQywyQkFERCxHQUVFLDBGQUZGLEdBR0MsUUFIRCxHQUlBO0FBTk8sU0FEMEI7QUFTbkNBLGVBQVE7QUFDUHBsQixpQkFDQyxpQ0FDQyxvQkFERCxHQUVDLEtBRkQsR0FHRSwrR0FIRixHQUlHLHdUQUpILEdBS0csdUJBTEgsR0FNRSxNQU5GLEdBT0UsNklBUEYsR0FRRyxnbEJBUkgsR0FTRyx3QkFUSCxHQVVFLE1BVkYsR0FXRSwwSEFYRixHQVlHLHVkQVpILEdBYUcsc0JBYkgsR0FjRSxNQWRGLEdBZUMsTUFmRCxHQWdCQywwRUFoQkQsR0FpQkE7QUFuQk07QUFUMkIsS0FBcEM7O0FBZ0NBLGFBQVNxbEIsVUFBVCxDQUFvQkMsTUFBcEIsRUFBNEI7QUFDM0IsWUFBSUMsWUFBWTtBQUNkLGlCQUFLLE9BRFM7QUFFZCxpQkFBSyxNQUZTO0FBR2QsaUJBQUssTUFIUztBQUlkLGlCQUFLLFFBSlM7QUFLZCxpQkFBSyxPQUxTO0FBTWQsaUJBQUssUUFOUztBQU9kLGlCQUFLLFFBUFM7QUFRZCxpQkFBSztBQVJTLFNBQWhCOztBQVdBLGVBQU9DLE9BQU9GLE1BQVAsRUFBZXpjLE9BQWYsQ0FBdUIsY0FBdkIsRUFBdUMsVUFBVTRjLENBQVYsRUFBYTtBQUMxRCxtQkFBT0YsVUFBVUUsQ0FBVixDQUFQO0FBQ0EsU0FGTSxDQUFQO0FBR0E7O0FBRURsbkIsTUFBRUQsUUFBRixFQUFZd00sRUFBWixDQUFlLE9BQWYsRUFBd0IsdUJBQXhCLEVBQWlELFlBQVc7QUFDM0QsWUFBSTRhLElBQUlubkIsRUFBRUcsUUFBRixDQUFXa0osV0FBWCxFQUFSO0FBQUEsWUFDQzJKLEdBREQ7QUFBQSxZQUVDdlIsR0FGRDs7QUFJQSxZQUFLMGxCLENBQUwsRUFBUztBQUNSblUsa0JBQU1tVSxFQUFFMWlCLE9BQUYsQ0FBVStDLElBQVYsQ0FBZWpFLElBQWYsS0FBd0IsS0FBeEIsR0FBZ0M0akIsRUFBRTFpQixPQUFGLENBQVU4RyxHQUExQyxHQUFnRHpMLE9BQU9zbkIsUUFBN0Q7QUFDQTNsQixrQkFBTTBsQixFQUFFMWlCLE9BQUYsQ0FBVStDLElBQVYsQ0FBZXFmLEtBQWYsQ0FBcUJwbEIsR0FBckIsQ0FDSDZJLE9BREcsQ0FDTSxjQUROLEVBQ3NCK2MsbUJBQW9CclUsR0FBcEIsQ0FEdEIsRUFFSDFJLE9BRkcsQ0FFTSxrQkFGTixFQUUwQndjLFdBQVk5VCxHQUFaLENBRjFCLEVBR0gxSSxPQUhHLENBR00sZ0JBSE4sRUFHd0I2YyxFQUFFOU4sUUFBRixHQUFhZ08sbUJBQW9CRixFQUFFOU4sUUFBRixDQUFXaU8sSUFBWCxFQUFwQixDQUFiLEdBQXVELEVBSC9FLENBQU47O0FBS0F0bkIsY0FBRUcsUUFBRixDQUFXeVosSUFBWCxDQUFnQjtBQUNmck8scUJBQU80YixFQUFFOWMsU0FBRixDQUFhOGMsQ0FBYixFQUFnQjFsQixHQUFoQixDQURRO0FBRWZrRCxzQkFBTyxNQUZRO0FBR2Y2QyxzQkFBTztBQUNOMUYscUNBQW9CLE1BRGQ7QUFFTkMsdUNBQW9CO0FBRmQ7QUFIUSxhQUFoQjtBQVFBO0FBRUQsS0F0QkQ7QUF3QkEsQ0E1RUMsRUE0RUNoQyxRQTVFRCxFQTRFV0QsT0FBT3diLE1BQVAsSUFBaUJBLE1BNUU1QixDQUFEOztBQThFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFFLFdBQVV2YixRQUFWLEVBQW9CRCxNQUFwQixFQUE0QkUsQ0FBNUIsRUFBK0I7QUFDaEM7O0FBRUE7O0FBQ0EsUUFBSyxDQUFDQSxFQUFFdW5CLGNBQVIsRUFBeUI7QUFDeEJ2bkIsVUFBRXVuQixjQUFGLEdBQW1CLFVBQVVDLEdBQVYsRUFBZ0I7QUFDbEMsZ0JBQUlDLGFBQWEsOENBQWpCO0FBQ0EsZ0JBQUlDLGFBQWEsU0FBYkEsVUFBYSxDQUFVQyxFQUFWLEVBQWNDLFdBQWQsRUFBNEI7QUFDNUMsb0JBQUtBLFdBQUwsRUFBbUI7QUFDbEI7QUFDQSx3QkFBS0QsT0FBTyxJQUFaLEVBQW1CO0FBQ2xCLCtCQUFPLFFBQVA7QUFDQTs7QUFFRDtBQUNBLDJCQUFPQSxHQUFHM08sS0FBSCxDQUFVLENBQVYsRUFBYSxDQUFDLENBQWQsSUFBb0IsSUFBcEIsR0FBMkIyTyxHQUFHRSxVQUFILENBQWVGLEdBQUd2Z0IsTUFBSCxHQUFZLENBQTNCLEVBQStCMGdCLFFBQS9CLENBQXlDLEVBQXpDLENBQTNCLEdBQTJFLEdBQWxGO0FBQ0E7O0FBRUQ7QUFDQSx1QkFBTyxPQUFPSCxFQUFkO0FBQ0EsYUFiRDs7QUFlQSxtQkFBTyxDQUFFSCxNQUFNLEVBQVIsRUFBYWxkLE9BQWIsQ0FBc0JtZCxVQUF0QixFQUFrQ0MsVUFBbEMsQ0FBUDtBQUNBLFNBbEJEO0FBbUJBOztBQUVEO0FBQ0EsUUFBSUssc0JBQXNCLElBQTFCOztBQUVBO0FBQ0E7QUFDRyxRQUFJQyxjQUFjLElBQWxCOztBQUVIO0FBQ0EsUUFBSUMsVUFBVSxJQUFkOztBQUVBO0FBQ0csYUFBU0MsUUFBVCxHQUFvQjtBQUNoQixZQUFJM2tCLE9BQVV6RCxPQUFPc25CLFFBQVAsQ0FBZ0I3akIsSUFBaEIsQ0FBcUI2YixNQUFyQixDQUE2QixDQUE3QixDQUFkO0FBQ0EsWUFBSTlNLE1BQVUvTyxLQUFLeUksS0FBTCxDQUFZLEdBQVosQ0FBZDtBQUNBLFlBQUl2RSxRQUFVNkssSUFBSWxMLE1BQUosR0FBYSxDQUFiLElBQWtCLFdBQVdtQyxJQUFYLENBQWlCK0ksSUFBS0EsSUFBSWxMLE1BQUosR0FBYSxDQUFsQixDQUFqQixDQUFsQixHQUE2RGEsU0FBVXFLLElBQUk2VixHQUFKLENBQVMsQ0FBQyxDQUFWLENBQVYsRUFBeUIsRUFBekIsS0FBaUMsQ0FBOUYsR0FBa0csQ0FBaEg7QUFDQSxZQUFJQyxVQUFVOVYsSUFBSStWLElBQUosQ0FBVSxHQUFWLENBQWQ7O0FBRU47QUFDQSxZQUFLNWdCLFFBQVEsQ0FBYixFQUFpQjtBQUNoQkEsb0JBQVEsQ0FBUjtBQUNBOztBQUVLLGVBQU87QUFDSGxFLGtCQUFVQSxJQURQO0FBRUhrRSxtQkFBVUEsS0FGUDtBQUdIMmdCLHFCQUFVQTtBQUhQLFNBQVA7QUFLSDs7QUFFSjtBQUNBLGFBQVNFLGNBQVQsQ0FBeUJ0VixHQUF6QixFQUErQjtBQUM5QixZQUFJN0wsR0FBSjs7QUFFTSxZQUFLNkwsSUFBSW9WLE9BQUosS0FBZ0IsRUFBckIsRUFBMEI7O0FBRS9CO0FBQ0FqaEIsa0JBQU1uSCxFQUFHLHFCQUFxQkEsRUFBRXVuQixjQUFGLENBQWtCdlUsSUFBSW9WLE9BQXRCLENBQXJCLEdBQXVELElBQTFELEVBQWlFOU4sRUFBakUsQ0FBcUV0SCxJQUFJdkwsS0FBSixHQUFZLENBQWpGLENBQU47O0FBRVMsZ0JBQUssQ0FBQ04sSUFBSUMsTUFBVixFQUFtQjtBQUMzQjtBQUNBRCxzQkFBTW5ILEVBQUcsTUFBTUEsRUFBRXVuQixjQUFGLENBQWtCdlUsSUFBSW9WLE9BQXRCLENBQU4sR0FBd0MsRUFBM0MsQ0FBTjtBQUNBOztBQUVELGdCQUFLamhCLElBQUlDLE1BQVQsRUFBa0I7QUFDakIyZ0Isc0NBQXNCLEtBQXRCOztBQUVBNWdCLG9CQUFJeUQsT0FBSixDQUFhLE9BQWI7QUFDQTtBQUVLO0FBQ1A7O0FBRUQ7QUFDQSxhQUFTMmQsWUFBVCxDQUF1QnBiLFFBQXZCLEVBQWtDO0FBQ2pDLFlBQUkzRixJQUFKOztBQUVBLFlBQUssQ0FBQzJGLFFBQU4sRUFBaUI7QUFDaEIsbUJBQU8sS0FBUDtBQUNBOztBQUVEM0YsZUFBTzJGLFNBQVMxSSxPQUFULEdBQW1CMEksU0FBUzFJLE9BQVQsQ0FBaUIrQyxJQUFwQyxHQUEyQzJGLFNBQVMzRixJQUEzRDs7QUFFQSxlQUFPQSxLQUFLakUsSUFBTCxLQUFlaUUsS0FBS21FLEtBQUwsR0FBYW5FLEtBQUttRSxLQUFMLENBQVdwSyxJQUFYLENBQWlCLFVBQWpCLENBQWIsR0FBNkMsRUFBNUQsQ0FBUDtBQUNBOztBQUVEO0FBQ0d2QixNQUFFLFlBQVc7O0FBRWY7QUFDQSxZQUFLQSxFQUFFRyxRQUFGLENBQVdHLFFBQVgsQ0FBb0JpRCxJQUFwQixLQUE2QixLQUFsQyxFQUEwQztBQUN6QztBQUNBOztBQUVEO0FBQ0d2RCxVQUFFRCxRQUFGLEVBQVl3TSxFQUFaLENBQWU7QUFDakIseUJBQWMsa0JBQVVDLENBQVYsRUFBYVcsUUFBYixFQUF3QjtBQUNyQyxvQkFBSTZGLEdBQUosRUFBU29WLE9BQVQ7O0FBRUEsb0JBQUtqYixTQUFTcEYsS0FBVCxDQUFnQm9GLFNBQVNuRixTQUF6QixFQUFxQ1IsSUFBckMsQ0FBMENqRSxJQUExQyxLQUFtRCxLQUF4RCxFQUFnRTtBQUMvRDtBQUNBOztBQUVEeVAsc0JBQVVrVixVQUFWO0FBQ0FFLDBCQUFVRyxhQUFjcGIsUUFBZCxDQUFWOztBQUVBO0FBQ0Esb0JBQUtpYixXQUFXcFYsSUFBSW9WLE9BQWYsSUFBMEJBLFdBQVdwVixJQUFJb1YsT0FBOUMsRUFBd0Q7QUFDdkRqYiw2QkFBU25GLFNBQVQsR0FBcUJnTCxJQUFJdkwsS0FBSixHQUFZLENBQWpDO0FBQ0E7QUFDRCxhQWZnQjs7QUFpQmpCLDZCQUFrQixzQkFBVStFLENBQVYsRUFBYVcsUUFBYixFQUF1QjFJLE9BQXZCLEVBQWlDO0FBQ2xELG9CQUFJMmpCLE9BQUo7O0FBRUEsb0JBQUssQ0FBQzNqQixPQUFELElBQVlBLFFBQVErQyxJQUFSLENBQWFqRSxJQUFiLEtBQXNCLEtBQXZDLEVBQStDO0FBQzlDO0FBQ0E7O0FBRVE2a0IsMEJBQVVHLGFBQWNwYixRQUFkLENBQVY7O0FBRUE7QUFDQSxvQkFBS2liLFdBQVdBLFlBQVksRUFBNUIsRUFBaUM7O0FBRXpDLHdCQUFLdG9CLE9BQU9zbkIsUUFBUCxDQUFnQjdqQixJQUFoQixDQUFxQmdYLE9BQXJCLENBQThCNk4sT0FBOUIsSUFBMEMsQ0FBL0MsRUFBbUQ7QUFDdENqYixpQ0FBUzNGLElBQVQsQ0FBY2doQixRQUFkLEdBQXlCMW9CLE9BQU9zbkIsUUFBUCxDQUFnQjdqQixJQUF6QztBQUNIOztBQUVWeWtCLGtDQUFjSSxXQUFZamIsU0FBU3BGLEtBQVQsQ0FBZVgsTUFBZixHQUF3QixDQUF4QixHQUE0QixPQUFRM0MsUUFBUWdELEtBQVIsR0FBZ0IsQ0FBeEIsQ0FBNUIsR0FBMEQsRUFBdEUsQ0FBZDs7QUFFQSx3QkFBSyxrQkFBa0IzSCxPQUFPMm9CLE9BQTlCLEVBQXdDO0FBQ3ZDLDRCQUFLUixPQUFMLEVBQWU7QUFDZHJULHlDQUFjcVQsT0FBZDtBQUNBOztBQUVEQSxrQ0FBVXRoQixXQUFXLFlBQVc7QUFDL0I3RyxtQ0FBTzJvQixPQUFQLENBQWdCVixzQkFBc0IsV0FBdEIsR0FBb0MsY0FBcEQsRUFBc0UsRUFBdEUsRUFBMkVob0IsU0FBUzJvQixLQUFwRixFQUEyRjVvQixPQUFPc25CLFFBQVAsQ0FBZ0J1QixRQUFoQixHQUEyQjdvQixPQUFPc25CLFFBQVAsQ0FBZ0J3QixNQUEzQyxHQUFvRCxHQUFwRCxHQUEyRFosV0FBdEo7O0FBRUFDLHNDQUFVLElBQVY7O0FBRUFGLGtEQUFzQixLQUF0QjtBQUVBLHlCQVBTLEVBT1AsR0FQTyxDQUFWO0FBU0EscUJBZEQsTUFjTztBQUNOam9CLCtCQUFPc25CLFFBQVAsQ0FBZ0I3akIsSUFBaEIsR0FBdUJ5a0IsV0FBdkI7QUFDQTtBQUVRO0FBRUosYUF2RFU7O0FBeURqQiw4QkFBbUIsdUJBQVV4YixDQUFWLEVBQWFXLFFBQWIsRUFBdUIxSSxPQUF2QixFQUFpQztBQUNuRCxvQkFBSTJqQixPQUFKLEVBQWFJLFFBQWI7O0FBRUEsb0JBQUtQLE9BQUwsRUFBZTtBQUNkclQsaUNBQWNxVCxPQUFkO0FBQ0E7O0FBRUQsb0JBQUt4akIsUUFBUStDLElBQVIsQ0FBYWpFLElBQWIsS0FBc0IsS0FBM0IsRUFBbUM7QUFDbEM7QUFDQTs7QUFFRDZrQiwwQkFBV0csYUFBY3BiLFFBQWQsQ0FBWDtBQUNBcWIsMkJBQVdyYixZQUFZQSxTQUFTM0YsSUFBVCxDQUFjZ2hCLFFBQTFCLEdBQXFDcmIsU0FBUzNGLElBQVQsQ0FBY2doQixRQUFuRCxHQUE4RCxFQUF6RTs7QUFFUztBQUNBLG9CQUFLSixXQUFXQSxZQUFZLEVBQTVCLEVBQWlDOztBQUU3Qix3QkFBSyxrQkFBa0JLLE9BQXZCLEVBQWlDO0FBQzVDM29CLCtCQUFPMm9CLE9BQVAsQ0FBZUksWUFBZixDQUE2QixFQUE3QixFQUFrQzlvQixTQUFTMm9CLEtBQTNDLEVBQWtENW9CLE9BQU9zbkIsUUFBUCxDQUFnQnVCLFFBQWhCLEdBQTJCN29CLE9BQU9zbkIsUUFBUCxDQUFnQndCLE1BQTNDLEdBQW9ESixRQUF0RztBQUVZLHFCQUhELE1BR087QUFDbEIxb0IsK0JBQU9zbkIsUUFBUCxDQUFnQjdqQixJQUFoQixHQUF1QmlsQixRQUF2Qjs7QUFFQTtBQUNBeG9CLDBCQUFHRixNQUFILEVBQVlxSixTQUFaLENBQXVCZ0UsU0FBU2hFLFNBQWhDLEVBQTRDQyxVQUE1QyxDQUF3RCtELFNBQVMvRCxVQUFqRTtBQUNZO0FBQ0o7O0FBRVY0ZSw4QkFBYyxJQUFkO0FBQ007QUF0RlUsU0FBZjs7QUF5Rkg7QUFDQWhvQixVQUFFRixNQUFGLEVBQVV5TSxFQUFWLENBQWEsZUFBYixFQUE4QixZQUFXO0FBQ3hDLGdCQUFJeUcsTUFBTWtWLFVBQVY7O0FBRUEsZ0JBQUtsb0IsRUFBRUcsUUFBRixDQUFXa0osV0FBWCxFQUFMLEVBQWdDO0FBQy9CLG9CQUFLMmUsZUFBZUEsZ0JBQWdCaFYsSUFBSW9WLE9BQUosR0FBYyxHQUFkLEdBQW9CcFYsSUFBSXZMLEtBQXZELElBQWdFLEVBQUd1TCxJQUFJdkwsS0FBSixLQUFjLENBQWQsSUFBbUJ1Z0IsZUFBZWhWLElBQUlvVixPQUF6QyxDQUFyRSxFQUEwSDtBQUN6SEosa0NBQWMsSUFBZDs7QUFFQWhvQixzQkFBRUcsUUFBRixDQUFXd0MsS0FBWDtBQUNBO0FBRUQsYUFQRCxNQU9PLElBQUtxUSxJQUFJb1YsT0FBSixLQUFnQixFQUFyQixFQUEwQjtBQUNoQ0UsK0JBQWdCdFYsR0FBaEI7QUFDQTtBQUNELFNBYkQ7O0FBZUE7QUFDQXJNLG1CQUFXLFlBQVc7QUFDckIyaEIsMkJBQWdCSixVQUFoQjtBQUNBLFNBRkQsRUFFRyxFQUZIO0FBR0csS0FySEQ7QUF1SEgsQ0FuTkMsRUFtTkNub0IsUUFuTkQsRUFtTldELE1Bbk5YLEVBbU5tQkEsT0FBT3diLE1BQVAsSUFBaUJBLE1Bbk5wQyxDQUFEOzs7OztBQzUwSkQ7Ozs7Ozs7O0FBUUE7QUFDQyxXQUFVdmIsUUFBVixFQUFvQkQsTUFBcEIsRUFBNEIySCxLQUE1QixFQUFtQztBQUNsQzs7QUFFQTs7QUFFQSxNQUFJcWhCLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVWhpQixFQUFWLEVBQWM0RSxPQUFkLEVBQXVCOztBQUV6QyxRQUFJcWQsV0FBVyxDQUFDLENBQUNqcEIsT0FBT29hLGdCQUF4Qjs7QUFFQTs7O0FBR0EsUUFBSSxDQUFDNk8sUUFBTCxFQUFlO0FBQ2JqcEIsYUFBT29hLGdCQUFQLEdBQTBCLFVBQVNwVCxFQUFULEVBQWE7QUFDckMsYUFBS0EsRUFBTCxHQUFVQSxFQUFWO0FBQ0EsYUFBS3FULGdCQUFMLEdBQXdCLFVBQVNaLElBQVQsRUFBZTtBQUNyQyxjQUFJeVAsS0FBSyxpQkFBVDtBQUNBLGNBQUl6UCxTQUFTLE9BQWIsRUFBc0I7QUFDcEJBLG1CQUFPLFlBQVA7QUFDRDtBQUNELGNBQUl5UCxHQUFHemYsSUFBSCxDQUFRZ1EsSUFBUixDQUFKLEVBQW1CO0FBQ2pCQSxtQkFBT0EsS0FBS2pQLE9BQUwsQ0FBYTBlLEVBQWIsRUFBaUIsWUFBWTtBQUNsQyxxQkFBTzlQLFVBQVUsQ0FBVixFQUFhK1AsV0FBYixFQUFQO0FBQ0QsYUFGTSxDQUFQO0FBR0Q7QUFDRCxpQkFBT25pQixHQUFHb2lCLFlBQUgsQ0FBZ0IzUCxJQUFoQixJQUF3QnpTLEdBQUdvaUIsWUFBSCxDQUFnQjNQLElBQWhCLENBQXhCLEdBQWdELElBQXZEO0FBQ0QsU0FYRDtBQVlBLGVBQU8sSUFBUDtBQUNELE9BZkQ7QUFnQkQ7QUFDRDs7QUFFQTs7Ozs7Ozs7OztBQVVBLFFBQUk0UCxXQUFXLFNBQVhBLFFBQVcsQ0FBVXJpQixFQUFWLEVBQWNzaUIsR0FBZCxFQUFtQmxwQixFQUFuQixFQUF1Qm1wQixNQUF2QixFQUErQjtBQUMxQyxVQUFJLHNCQUFzQnZpQixFQUExQixFQUE4QjtBQUM1QjtBQUNBLFlBQUk7QUFDRkEsYUFBR3dpQixnQkFBSCxDQUFvQkYsR0FBcEIsRUFBeUJscEIsRUFBekIsRUFBNkJtcEIsTUFBN0I7QUFDRCxTQUZELENBRUUsT0FBTzdjLENBQVAsRUFBVTtBQUNWLGNBQUksUUFBT3RNLEVBQVAseUNBQU9BLEVBQVAsT0FBYyxRQUFkLElBQTBCQSxHQUFHcXBCLFdBQWpDLEVBQThDO0FBQzVDemlCLGVBQUd3aUIsZ0JBQUgsQ0FBb0JGLEdBQXBCLEVBQXlCLFVBQVU1YyxDQUFWLEVBQWE7QUFDcEM7QUFDQXRNLGlCQUFHcXBCLFdBQUgsQ0FBZXRRLElBQWYsQ0FBb0IvWSxFQUFwQixFQUF3QnNNLENBQXhCO0FBQ0QsYUFIRCxFQUdHNmMsTUFISDtBQUlELFdBTEQsTUFLTztBQUNMLGtCQUFNN2MsQ0FBTjtBQUNEO0FBQ0Y7QUFDRixPQWRELE1BY08sSUFBSSxpQkFBaUIxRixFQUFyQixFQUF5QjtBQUM5QjtBQUNBLFlBQUksUUFBTzVHLEVBQVAseUNBQU9BLEVBQVAsT0FBYyxRQUFkLElBQTBCQSxHQUFHcXBCLFdBQWpDLEVBQThDO0FBQzVDemlCLGFBQUcwaUIsV0FBSCxDQUFlLE9BQU9KLEdBQXRCLEVBQTJCLFlBQVk7QUFDckM7QUFDQWxwQixlQUFHcXBCLFdBQUgsQ0FBZXRRLElBQWYsQ0FBb0IvWSxFQUFwQjtBQUNELFdBSEQ7QUFJRCxTQUxELE1BS087QUFDTDRHLGFBQUcwaUIsV0FBSCxDQUFlLE9BQU9KLEdBQXRCLEVBQTJCbHBCLEVBQTNCO0FBQ0Q7QUFDRjtBQUNGLEtBMUJIOzs7QUE0QkU7Ozs7Ozs7O0FBUUF1cEIsa0JBQWMsU0FBZEEsV0FBYyxDQUFVM2lCLEVBQVYsRUFBY3NpQixHQUFkLEVBQW1CbHBCLEVBQW5CLEVBQXVCbXBCLE1BQXZCLEVBQStCO0FBQzNDLFVBQUkseUJBQXlCdmlCLEVBQTdCLEVBQWlDO0FBQy9CLFlBQUk7QUFDRkEsYUFBRzRpQixtQkFBSCxDQUF1Qk4sR0FBdkIsRUFBNEJscEIsRUFBNUIsRUFBZ0NtcEIsTUFBaEM7QUFDRCxTQUZELENBRUUsT0FBTzdjLENBQVAsRUFBVTtBQUNWLGNBQUksUUFBT3RNLEVBQVAseUNBQU9BLEVBQVAsT0FBYyxRQUFkLElBQTBCQSxHQUFHcXBCLFdBQWpDLEVBQThDO0FBQzVDemlCLGVBQUc0aUIsbUJBQUgsQ0FBdUJOLEdBQXZCLEVBQTRCLFVBQVU1YyxDQUFWLEVBQWE7QUFDdkN0TSxpQkFBR3FwQixXQUFILENBQWV0USxJQUFmLENBQW9CL1ksRUFBcEIsRUFBd0JzTSxDQUF4QjtBQUNELGFBRkQsRUFFRzZjLE1BRkg7QUFHRCxXQUpELE1BSU87QUFDTCxrQkFBTTdjLENBQU47QUFDRDtBQUNGO0FBQ0YsT0FaRCxNQVlPLElBQUksaUJBQWlCMUYsRUFBckIsRUFBeUI7QUFDOUIsWUFBSSxRQUFPNUcsRUFBUCx5Q0FBT0EsRUFBUCxPQUFjLFFBQWQsSUFBMEJBLEdBQUdxcEIsV0FBakMsRUFBOEM7QUFDNUN6aUIsYUFBRzZpQixXQUFILENBQWUsT0FBT1AsR0FBdEIsRUFBMkIsWUFBWTtBQUNyQ2xwQixlQUFHcXBCLFdBQUgsQ0FBZXRRLElBQWYsQ0FBb0IvWSxFQUFwQjtBQUNELFdBRkQ7QUFHRCxTQUpELE1BSU87QUFDTDRHLGFBQUc2aUIsV0FBSCxDQUFlLE9BQU9QLEdBQXRCLEVBQTJCbHBCLEVBQTNCO0FBQ0Q7QUFDRjtBQUNGLEtBMURIOzs7QUE0REU7Ozs7OztBQU1BMHBCLGtCQUFjLFNBQWRBLFdBQWMsQ0FBVXBkLENBQVYsRUFBYTtBQUN6QixVQUFJQSxFQUFFd0QsUUFBRixDQUFXNUksTUFBWCxHQUFvQixDQUF4QixFQUEyQjtBQUN6QixjQUFNLElBQUl5aUIsS0FBSixDQUFVLDhDQUFWLENBQU47QUFDRDtBQUNEO0FBQ0EsVUFBSTdaLFdBQVcsRUFBZjtBQUNBO0FBQ0EsV0FBSyxJQUFJM0UsSUFBSSxDQUFiLEVBQWdCQSxJQUFJbUIsRUFBRXdELFFBQUYsQ0FBVzVJLE1BQS9CLEVBQXVDaUUsR0FBdkMsRUFBNEM7QUFDMUMsWUFBSW1CLEVBQUV3RCxRQUFGLENBQVczRSxDQUFYLEVBQWNvTCxRQUFkLEtBQTJCLENBQS9CLEVBQWtDO0FBQ2hDekcsbUJBQVM1RCxJQUFULENBQWNJLEVBQUV3RCxRQUFGLENBQVczRSxDQUFYLENBQWQ7QUFDRDtBQUNGO0FBQ0QsYUFBTzJFLFFBQVA7QUFDRCxLQS9FSDs7O0FBaUZFOzs7Ozs7QUFNQThaLG9CQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVWhqQixFQUFWLEVBQWNpakIsS0FBZCxFQUFxQjtBQUNuQyxXQUFLLElBQUloWSxHQUFULElBQWdCZ1ksS0FBaEIsRUFBdUI7QUFDckJqakIsV0FBR2tqQixZQUFILENBQWdCalksR0FBaEIsRUFBcUJnWSxNQUFNaFksR0FBTixDQUFyQjtBQUNEO0FBQ0YsS0EzRkg7OztBQTZGRTs7Ozs7O0FBTUF6SSxlQUFXLFNBQVhBLFFBQVcsQ0FBVXhDLEVBQVYsRUFBY21qQixHQUFkLEVBQW1CO0FBQzVCLFVBQUluakIsR0FBR29qQixTQUFILENBQWEzUCxPQUFiLENBQXFCMFAsR0FBckIsTUFBOEIsQ0FBbEMsRUFBcUM7QUFDbkNuakIsV0FBR29qQixTQUFILElBQWdCLE1BQU1ELEdBQXRCO0FBQ0FuakIsV0FBR29qQixTQUFILEdBQWVwakIsR0FBR29qQixTQUFILENBQWE1ZixPQUFiLENBQXFCLGdCQUFyQixFQUFzQyxFQUF0QyxDQUFmO0FBQ0Q7QUFDRixLQXhHSDs7O0FBMEdFOzs7Ozs7QUFNQWlGLGtCQUFjLFNBQWRBLFdBQWMsQ0FBVXpJLEVBQVYsRUFBY21qQixHQUFkLEVBQW1CO0FBQy9CLFVBQUlFLE1BQU0sSUFBSUMsTUFBSixDQUFXLFlBQVlILEdBQVosR0FBa0IsU0FBN0IsQ0FBVjtBQUNBbmpCLFNBQUdvakIsU0FBSCxHQUFlcGpCLEdBQUdvakIsU0FBSCxDQUFhNWYsT0FBYixDQUFxQjZmLEdBQXJCLEVBQTBCLEdBQTFCLEVBQStCN2YsT0FBL0IsQ0FBdUMsZ0JBQXZDLEVBQXdELEVBQXhELENBQWY7QUFDRCxLQW5ISDs7O0FBcUhFOzs7Ozs7O0FBT0FHLGNBQVUsU0FBVkEsT0FBVSxDQUFVNGYsS0FBVixFQUFpQjNqQixRQUFqQixFQUEyQjRqQixLQUEzQixFQUFrQztBQUMxQyxXQUFLLElBQUlqZixJQUFJLENBQWIsRUFBZ0JBLElBQUlnZixNQUFNampCLE1BQTFCLEVBQWtDaUUsR0FBbEMsRUFBdUM7QUFDckMzRSxpQkFBU3VTLElBQVQsQ0FBY3FSLEtBQWQsRUFBcUJqZixDQUFyQixFQUF3QmdmLE1BQU1oZixDQUFOLENBQXhCO0FBQ0Q7QUFDRixLQWhJSDs7QUFrSUEsUUFBSWtmLEdBQUo7QUFBQSxRQUNFL2lCLElBREY7QUFBQSxRQUVFZ2pCLFNBRkY7QUFBQSxRQUdFQyxlQUFlMXFCLFNBQVNnSCxhQUFULENBQXVCLE9BQXZCLENBSGpCO0FBQUEsUUFJRTJqQixTQUFTM3FCLFNBQVNpVyxlQUpwQjtBQUFBLFFBS0UyVSxlQUxGO0FBQUEsUUFNRS9pQixRQU5GO0FBQUEsUUFPRWdqQixPQVBGOztBQVNBLFFBQUlDLGdCQUFnQixTQUFoQkEsYUFBZ0IsQ0FBVS9qQixFQUFWLEVBQWM0RSxPQUFkLEVBQXVCO0FBQ3ZDLFVBQUlMLENBQUo7O0FBRUE7Ozs7QUFJQSxXQUFLSyxPQUFMLEdBQWU7QUFDYm1FLGlCQUFTLElBREksRUFDcUI7QUFDbENpYixvQkFBWSxHQUZDLEVBRXFCO0FBQ2xDQyxlQUFPLE1BSE0sRUFHcUI7QUFDbENDLGdCQUFRLFFBSkssRUFJcUI7QUFDbENDLHNCQUFjLEVBTEQsRUFLcUI7QUFDbENDLHlCQUFpQixLQU5KLEVBTXFCO0FBQ2xDQyxpQkFBUyxVQVBJLEVBT3FCO0FBQ2xDQyxrQkFBVSxjQVJHLEVBUXFCO0FBQ2xDQyx3QkFBZ0IsZUFUSCxFQVNxQjtBQUNsQ0MsaUJBQVMsSUFWSSxFQVVxQjtBQUNsQzNpQixjQUFNLGdCQUFVLENBQUUsQ0FYTCxFQVdxQjtBQUNsQ2lSLGNBQU0sZ0JBQVUsQ0FBRSxDQVpMLEVBWXFCO0FBQ2xDalgsZUFBTyxpQkFBVSxDQUFFLENBYk4sQ0FhcUI7QUFickIsT0FBZjs7QUFnQkE7QUFDQSxXQUFLMEksQ0FBTCxJQUFVSyxPQUFWLEVBQW1CO0FBQ2pCLGFBQUtBLE9BQUwsQ0FBYUwsQ0FBYixJQUFrQkssUUFBUUwsQ0FBUixDQUFsQjtBQUNEOztBQUVEO0FBQ0EvQixlQUFTb2hCLE1BQVQsRUFBaUIsS0FBS2hmLE9BQUwsQ0FBYTRmLE9BQTlCOztBQUVBO0FBQ0EsV0FBS0MsU0FBTCxHQUFpQnprQixHQUFHd0QsT0FBSCxDQUFXLEdBQVgsRUFBZ0IsRUFBaEIsQ0FBakI7O0FBRUE7QUFDQSxVQUFJdkssU0FBU3lyQixjQUFULENBQXdCLEtBQUtELFNBQTdCLENBQUosRUFBNkM7QUFDM0MsYUFBS0UsT0FBTCxHQUFlMXJCLFNBQVN5ckIsY0FBVCxDQUF3QixLQUFLRCxTQUE3QixDQUFmOztBQUVGO0FBQ0MsT0FKRCxNQUlPLElBQUl4ckIsU0FBUzJyQixhQUFULENBQXVCLEtBQUtILFNBQTVCLENBQUosRUFBNEM7QUFDakQsYUFBS0UsT0FBTCxHQUFlMXJCLFNBQVMyckIsYUFBVCxDQUF1QixLQUFLSCxTQUE1QixDQUFmOztBQUVGO0FBQ0MsT0FKTSxNQUlBO0FBQ0wsY0FBTSxJQUFJMUIsS0FBSixDQUFVLHdEQUFWLENBQU47QUFDRDs7QUFFRDtBQUNBLFdBQUs0QixPQUFMLENBQWFFLEtBQWIsR0FBcUIvQixZQUFZLEtBQUs2QixPQUFqQixDQUFyQjs7QUFFQTtBQUNBamtCLGFBQU8sS0FBS2tFLE9BQVo7QUFDQTZlLFlBQU0sS0FBS2tCLE9BQVg7O0FBRUE7QUFDQSxXQUFLRyxLQUFMLENBQVcsSUFBWDtBQUNELEtBeERIOztBQTBEQWYsa0JBQWNqaUIsU0FBZCxHQUEwQjs7QUFFeEI7OztBQUdBa1IsZUFBUyxtQkFBWTtBQUNuQixhQUFLK1IsYUFBTDtBQUNBdGMsb0JBQVlnYixHQUFaLEVBQWlCLFFBQWpCO0FBQ0FoYixvQkFBWWdiLEdBQVosRUFBaUIsUUFBakI7QUFDQWhiLG9CQUFZZ2IsR0FBWixFQUFpQi9pQixLQUFLNGpCLFFBQXRCO0FBQ0E3YixvQkFBWWdiLEdBQVosRUFBaUIvaUIsS0FBSzRqQixRQUFMLEdBQWdCLEdBQWhCLEdBQXNCLEtBQUszakIsS0FBNUM7QUFDQThILG9CQUFZbWIsTUFBWixFQUFvQmxqQixLQUFLNmpCLGNBQXpCO0FBQ0FkLFlBQUl1QixlQUFKLENBQW9CLE9BQXBCO0FBQ0F2QixZQUFJdUIsZUFBSixDQUFvQixhQUFwQjs7QUFFQXJDLG9CQUFZM3BCLE1BQVosRUFBb0IsUUFBcEIsRUFBOEIsSUFBOUIsRUFBb0MsS0FBcEM7QUFDQTJwQixvQkFBWTNwQixNQUFaLEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLEVBQW1DLEtBQW5DO0FBQ0EycEIsb0JBQVkxcEIsU0FBUzRKLElBQXJCLEVBQTJCLFdBQTNCLEVBQXdDLElBQXhDLEVBQThDLEtBQTlDO0FBQ0E4ZixvQkFBWWUsU0FBWixFQUF1QixZQUF2QixFQUFxQyxJQUFyQyxFQUEyQyxLQUEzQztBQUNBZixvQkFBWWUsU0FBWixFQUF1QixVQUF2QixFQUFtQyxJQUFuQyxFQUF5QyxLQUF6QztBQUNBZixvQkFBWWUsU0FBWixFQUF1QixTQUF2QixFQUFrQyxJQUFsQyxFQUF3QyxLQUF4QztBQUNBZixvQkFBWWUsU0FBWixFQUF1QixPQUF2QixFQUFnQyxJQUFoQyxFQUFzQyxLQUF0QztBQUNBZixvQkFBWWUsU0FBWixFQUF1QixPQUF2QixFQUFnQyxJQUFoQyxFQUFzQyxLQUF0Qzs7QUFFQSxZQUFJLENBQUNoakIsS0FBS3lqQixZQUFWLEVBQXdCO0FBQ3RCVCxvQkFBVXVCLFVBQVYsQ0FBcUJDLFdBQXJCLENBQWlDeEIsU0FBakM7QUFDRCxTQUZELE1BRU87QUFDTEEsb0JBQVVzQixlQUFWLENBQTBCLGFBQTFCO0FBQ0Q7QUFDRixPQTdCdUI7O0FBK0J4Qjs7O0FBR0FsSCxjQUFRLGtCQUFZO0FBQ2xCLFlBQUkrRixvQkFBb0IsSUFBeEIsRUFBOEI7QUFDNUIsY0FBSSxDQUFDQyxPQUFMLEVBQWM7QUFDWixpQkFBS2hSLElBQUw7QUFDRCxXQUZELE1BRU87QUFDTCxpQkFBS2pYLEtBQUw7QUFDRDtBQUNGO0FBQ0YsT0ExQ3VCOztBQTRDeEI7OztBQUdBaVgsWUFBTSxnQkFBWTtBQUNoQixZQUFJLENBQUNnUixPQUFMLEVBQWM7QUFDWnJiLHNCQUFZZ2IsR0FBWixFQUFpQixRQUFqQjtBQUNBamhCLG1CQUFTaWhCLEdBQVQsRUFBYyxRQUFkO0FBQ0FqaEIsbUJBQVNvaEIsTUFBVCxFQUFpQmxqQixLQUFLNmpCLGNBQXRCO0FBQ0EvaEIsbUJBQVNraEIsU0FBVCxFQUFvQixRQUFwQjtBQUNBRCxjQUFJdGpCLEtBQUosQ0FBVTJULFFBQVYsR0FBcUJwVCxLQUFLMmpCLE9BQTFCO0FBQ0FyQix3QkFBY1MsR0FBZCxFQUFtQixFQUFDLGVBQWUsT0FBaEIsRUFBbkI7QUFDQUssb0JBQVUsSUFBVjtBQUNBcGpCLGVBQUtvUyxJQUFMO0FBQ0Q7QUFDRixPQTFEdUI7O0FBNER4Qjs7O0FBR0FqWCxhQUFPLGlCQUFZO0FBQ2pCLFlBQUlpb0IsT0FBSixFQUFhO0FBQ1h0aEIsbUJBQVNpaEIsR0FBVCxFQUFjLFFBQWQ7QUFDQWhiLHNCQUFZZ2IsR0FBWixFQUFpQixRQUFqQjtBQUNBaGIsc0JBQVltYixNQUFaLEVBQW9CbGpCLEtBQUs2akIsY0FBekI7QUFDQTliLHNCQUFZaWIsU0FBWixFQUF1QixRQUF2QjtBQUNBVix3QkFBY1MsR0FBZCxFQUFtQixFQUFDLGVBQWUsTUFBaEIsRUFBbkI7O0FBRUE7QUFDQSxjQUFJL2lCLEtBQUtxSSxPQUFULEVBQWtCO0FBQ2hCOGEsOEJBQWtCLEtBQWxCO0FBQ0Foa0IsdUJBQVcsWUFBWTtBQUNyQjRqQixrQkFBSXRqQixLQUFKLENBQVUyVCxRQUFWLEdBQXFCLFVBQXJCO0FBQ0ErUCxnQ0FBa0IsSUFBbEI7QUFDRCxhQUhELEVBR0duakIsS0FBS3NqQixVQUFMLEdBQWtCLEVBSHJCOztBQUtGO0FBQ0MsV0FSRCxNQVFPO0FBQ0xQLGdCQUFJdGpCLEtBQUosQ0FBVTJULFFBQVYsR0FBcUIsVUFBckI7QUFDRDs7QUFFRGdRLG9CQUFVLEtBQVY7QUFDQXBqQixlQUFLN0UsS0FBTDtBQUNEO0FBQ0YsT0F2RnVCOztBQXlGeEI7Ozs7QUFJQXNwQixjQUFRLGtCQUFZOztBQUVsQjtBQUNBLFlBQUluc0IsT0FBT29hLGdCQUFQLENBQXdCc1EsU0FBeEIsRUFBbUMsSUFBbkMsRUFBeUNyUSxnQkFBekMsQ0FBMEQsU0FBMUQsTUFBeUUsTUFBN0UsRUFBcUY7O0FBRW5GdlMscUJBQVcsSUFBWDtBQUNBa2lCLHdCQUFjVSxTQUFkLEVBQXlCLEVBQUMsZUFBZSxPQUFoQixFQUF6Qjs7QUFFQTtBQUNBLGNBQUlELElBQUlMLFNBQUosQ0FBY2pmLEtBQWQsQ0FBb0Isb0JBQXBCLENBQUosRUFBK0M7QUFDN0M2ZSwwQkFBY1MsR0FBZCxFQUFtQixFQUFDLGVBQWUsTUFBaEIsRUFBbkI7QUFDQUEsZ0JBQUl0akIsS0FBSixDQUFVMlQsUUFBVixHQUFxQixVQUFyQjtBQUNEOztBQUVELGVBQUtzUixhQUFMO0FBQ0EsZUFBS0MsV0FBTDtBQUNELFNBYkQsTUFhTzs7QUFFTHZrQixxQkFBVyxLQUFYO0FBQ0FraUIsd0JBQWNVLFNBQWQsRUFBeUIsRUFBQyxlQUFlLE1BQWhCLEVBQXpCO0FBQ0FWLHdCQUFjUyxHQUFkLEVBQW1CLEVBQUMsZUFBZSxPQUFoQixFQUFuQjtBQUNBQSxjQUFJdGpCLEtBQUosQ0FBVTJULFFBQVYsR0FBcUJwVCxLQUFLMmpCLE9BQTFCO0FBQ0EsZUFBS1UsYUFBTDtBQUNEO0FBQ0YsT0FySHVCOztBQXVIeEI7Ozs7OztBQU1BdEMsbUJBQWEscUJBQVUvYyxDQUFWLEVBQWE7QUFDeEIsWUFBSTRjLE1BQU01YyxLQUFLMU0sT0FBTzRFLEtBQXRCOztBQUVBLGdCQUFRMGtCLElBQUl6a0IsSUFBWjtBQUNBLGVBQUssWUFBTDtBQUNFLGlCQUFLeW5CLGFBQUwsQ0FBbUJoRCxHQUFuQjtBQUNBO0FBQ0YsZUFBSyxXQUFMO0FBQ0UsaUJBQUtpRCxZQUFMLENBQWtCakQsR0FBbEI7QUFDQTtBQUNGLGVBQUssVUFBTDtBQUNBLGVBQUssU0FBTDtBQUNFLGlCQUFLa0QsV0FBTCxDQUFpQmxELEdBQWpCO0FBQ0E7QUFDRixlQUFLLE9BQUw7QUFDRSxpQkFBS21ELGVBQUwsQ0FBcUJuRCxHQUFyQjtBQUNBO0FBQ0YsZUFBSyxPQUFMO0FBQ0UsaUJBQUtvRCxRQUFMLENBQWNwRCxHQUFkO0FBQ0E7QUFDRixlQUFLLE9BQUw7QUFDQSxlQUFLLFFBQUw7QUFDRSxpQkFBSzZDLE1BQUwsQ0FBWTdDLEdBQVo7QUFDQTtBQXBCRjtBQXNCRCxPQXRKdUI7O0FBd0p4Qjs7O0FBR0F3QyxhQUFPLGlCQUFZO0FBQ2pCLGFBQUtua0IsS0FBTCxHQUFhQSxPQUFiOztBQUVBNkIsaUJBQVNpaEIsR0FBVCxFQUFjL2lCLEtBQUs0akIsUUFBbkI7QUFDQTloQixpQkFBU2loQixHQUFULEVBQWMvaUIsS0FBSzRqQixRQUFMLEdBQWdCLEdBQWhCLEdBQXNCLEtBQUszakIsS0FBekM7QUFDQTZCLGlCQUFTaWhCLEdBQVQsRUFBYyxRQUFkO0FBQ0FJLDBCQUFrQixJQUFsQjtBQUNBQyxrQkFBVSxLQUFWOztBQUVBLGFBQUs2QixnQkFBTDtBQUNBLGFBQUtDLGFBQUw7QUFDQSxhQUFLQyxZQUFMO0FBQ0EsYUFBS1YsTUFBTDs7QUFFQTs7Ozs7QUFLQSxZQUFJdmtCLE9BQU8sSUFBWDtBQUNBZixtQkFBVyxZQUFZO0FBQ3JCZSxlQUFLdWtCLE1BQUw7QUFDRCxTQUZELEVBRUcsRUFGSDs7QUFJQTlDLGlCQUFTcnBCLE1BQVQsRUFBaUIsUUFBakIsRUFBMkIsSUFBM0IsRUFBaUMsS0FBakM7QUFDQXFwQixpQkFBU3JwQixNQUFULEVBQWlCLE9BQWpCLEVBQTBCLElBQTFCLEVBQWdDLEtBQWhDO0FBQ0FxcEIsaUJBQVNwcEIsU0FBUzRKLElBQWxCLEVBQXdCLFdBQXhCLEVBQXFDLElBQXJDLEVBQTJDLEtBQTNDO0FBQ0F3ZixpQkFBU3FCLFNBQVQsRUFBb0IsWUFBcEIsRUFBa0MsSUFBbEMsRUFBd0MsS0FBeEM7QUFDQXJCLGlCQUFTcUIsU0FBVCxFQUFvQixVQUFwQixFQUFnQyxJQUFoQyxFQUFzQyxLQUF0QztBQUNBckIsaUJBQVNxQixTQUFULEVBQW9CLFNBQXBCLEVBQStCLElBQS9CLEVBQXFDLEtBQXJDO0FBQ0FyQixpQkFBU3FCLFNBQVQsRUFBb0IsT0FBcEIsRUFBNkIsSUFBN0IsRUFBbUMsS0FBbkM7QUFDQXJCLGlCQUFTcUIsU0FBVCxFQUFvQixPQUFwQixFQUE2QixJQUE3QixFQUFtQyxLQUFuQzs7QUFFQTs7O0FBR0FoakIsYUFBS21CLElBQUw7QUFDRCxPQWhNdUI7O0FBa014Qjs7O0FBR0F1akIscUJBQWUseUJBQVk7QUFDekIsWUFBSSxDQUFDekIsYUFBYXNCLFVBQWxCLEVBQThCO0FBQzVCdEIsdUJBQWE5bEIsSUFBYixHQUFvQixVQUFwQjtBQUNBNUUsbUJBQVM2c0Isb0JBQVQsQ0FBOEIsTUFBOUIsRUFBc0MsQ0FBdEMsRUFBeUNDLFdBQXpDLENBQXFEcEMsWUFBckQ7QUFDRDtBQUNGLE9BMU11Qjs7QUE0TXhCOzs7QUFHQW9CLHFCQUFlLHlCQUFZO0FBQ3pCLFlBQUlwQixhQUFhc0IsVUFBakIsRUFBNkI7QUFDM0J0Qix1QkFBYXNCLFVBQWIsQ0FBd0JDLFdBQXhCLENBQW9DdkIsWUFBcEM7QUFDRDtBQUNGLE9Bbk51Qjs7QUFxTnhCOzs7QUFHQWlDLHFCQUFlLHlCQUFZOztBQUV6QjtBQUNBLFlBQUksQ0FBQ2xsQixLQUFLeWpCLFlBQVYsRUFBd0I7QUFDdEIsY0FBSXJHLFNBQVM3a0IsU0FBU2dILGFBQVQsQ0FBdUIsR0FBdkIsQ0FBYjtBQUNBNmQsaUJBQU9rSSxTQUFQLEdBQW1CdGxCLEtBQUt1akIsS0FBeEI7QUFDQWpCLHdCQUFjbEYsTUFBZCxFQUFzQjtBQUNwQixvQkFBUSxHQURZO0FBRXBCLHFCQUFTO0FBRlcsV0FBdEI7O0FBS0E7QUFDQSxjQUFJcGQsS0FBS3dqQixNQUFMLEtBQWdCLE9BQXBCLEVBQTZCO0FBQzNCVCxnQkFBSXdCLFVBQUosQ0FBZWdCLFlBQWYsQ0FBNEJuSSxNQUE1QixFQUFvQzJGLElBQUl5QyxXQUF4QztBQUNELFdBRkQsTUFFTztBQUNMekMsZ0JBQUl3QixVQUFKLENBQWVnQixZQUFmLENBQTRCbkksTUFBNUIsRUFBb0MyRixHQUFwQztBQUNEOztBQUVEQyxzQkFBWTVGLE1BQVo7O0FBRUY7QUFDQyxTQWxCRCxNQWtCTztBQUNMLGNBQUlxSSxXQUFXemxCLEtBQUt5akIsWUFBTCxDQUFrQjNnQixPQUFsQixDQUEwQixHQUExQixFQUErQixFQUEvQixDQUFmOztBQUVBLGNBQUl2SyxTQUFTeXJCLGNBQVQsQ0FBd0J5QixRQUF4QixDQUFKLEVBQXVDO0FBQ3JDekMsd0JBQVl6cUIsU0FBU3lyQixjQUFULENBQXdCeUIsUUFBeEIsQ0FBWjtBQUNELFdBRkQsTUFFTyxJQUFJbHRCLFNBQVMyckIsYUFBVCxDQUF1QnVCLFFBQXZCLENBQUosRUFBc0M7QUFDM0N6Qyx3QkFBWXpxQixTQUFTMnJCLGFBQVQsQ0FBdUJ1QixRQUF2QixDQUFaO0FBQ0QsV0FGTSxNQUVBO0FBQ0wsa0JBQU0sSUFBSXBELEtBQUosQ0FBVSw4REFBVixDQUFOO0FBQ0Q7QUFDRjtBQUNGLE9BeFB1Qjs7QUEwUHhCOzs7QUFHQTRDLHdCQUFrQiw0QkFBWTtBQUM1QixZQUFJamxCLEtBQUswakIsZUFBVCxFQUEwQjtBQUN4QixjQUFJZ0MsUUFBUTNDLElBQUlxQyxvQkFBSixDQUF5QixHQUF6QixDQUFaO0FBQUEsY0FDRWxsQixPQUFPLElBRFQ7QUFFQStDLGtCQUFReWlCLEtBQVIsRUFBZSxVQUFVN2hCLENBQVYsRUFBYXZFLEVBQWIsRUFBaUI7QUFDOUJxaUIscUJBQVMrRCxNQUFNN2hCLENBQU4sQ0FBVCxFQUFtQixPQUFuQixFQUE0QixZQUFZO0FBQ3RDLGtCQUFJekQsUUFBSixFQUFjO0FBQ1pGLHFCQUFLa2QsTUFBTDtBQUNEO0FBQ0YsYUFKRCxFQUlHLEtBSkg7QUFLRCxXQU5EO0FBT0Q7QUFDRixPQXpRdUI7O0FBMlF4Qjs7Ozs7QUFLQTJILHVCQUFpQix5QkFBUy9mLENBQVQsRUFBWTtBQUMzQixZQUFJQSxFQUFFRSxjQUFOLEVBQXNCO0FBQ3BCLGNBQUlGLEVBQUUyZ0Isd0JBQU4sRUFBZ0M7QUFDOUIzZ0IsY0FBRTJnQix3QkFBRjtBQUNEO0FBQ0QzZ0IsWUFBRUUsY0FBRjtBQUNBRixZQUFFQyxlQUFGO0FBQ0EsaUJBQU8sS0FBUDs7QUFFRjtBQUNDLFNBVEQsTUFTTztBQUNMRCxZQUFFNGdCLFdBQUYsR0FBZ0IsS0FBaEI7QUFDRDtBQUNGLE9BN1J1Qjs7QUErUnhCOzs7OztBQUtBaEIscUJBQWUsdUJBQVU1ZixDQUFWLEVBQWE7QUFDMUIsWUFBSSxDQUFDNmdCLE1BQU16a0IsU0FBTixDQUFnQnVrQix3QkFBckIsRUFBK0M7QUFDN0MsZUFBS1osZUFBTCxDQUFxQi9mLENBQXJCO0FBQ0Q7QUFDRCxhQUFLOGdCLE1BQUwsR0FBYzlnQixFQUFFMFIsT0FBRixDQUFVLENBQVYsRUFBYUksT0FBM0I7QUFDQSxhQUFLaVAsTUFBTCxHQUFjL2dCLEVBQUUwUixPQUFGLENBQVUsQ0FBVixFQUFhSyxPQUEzQjtBQUNBLGFBQUtpUCxhQUFMLEdBQXFCLEtBQXJCOztBQUVBOzs7O0FBSUEvRCxvQkFBWWUsU0FBWixFQUF1QixTQUF2QixFQUFrQyxJQUFsQyxFQUF3QyxLQUF4QztBQUNELE9BalR1Qjs7QUFtVHhCOzs7OztBQUtBNkIsb0JBQWMsc0JBQVU3ZixDQUFWLEVBQWE7QUFDekIsWUFBSWtELEtBQUs4QyxHQUFMLENBQVNoRyxFQUFFMFIsT0FBRixDQUFVLENBQVYsRUFBYUksT0FBYixHQUF1QixLQUFLZ1AsTUFBckMsSUFBK0MsRUFBL0MsSUFDSjVkLEtBQUs4QyxHQUFMLENBQVNoRyxFQUFFMFIsT0FBRixDQUFVLENBQVYsRUFBYUssT0FBYixHQUF1QixLQUFLZ1AsTUFBckMsSUFBK0MsRUFEL0MsRUFDbUQ7QUFDakQsZUFBS0MsYUFBTCxHQUFxQixJQUFyQjtBQUNEO0FBQ0YsT0E3VHVCOztBQStUeEI7Ozs7O0FBS0FsQixtQkFBYSxxQkFBVTlmLENBQVYsRUFBYTtBQUN4QixhQUFLK2YsZUFBTCxDQUFxQi9mLENBQXJCO0FBQ0EsWUFBSSxDQUFDNUUsUUFBTCxFQUFlO0FBQ2I7QUFDRDs7QUFFRDtBQUNBLFlBQUksQ0FBQyxLQUFLNGxCLGFBQVYsRUFBeUI7O0FBRXZCO0FBQ0EsY0FBSWhoQixFQUFFN0gsSUFBRixLQUFXLFVBQWYsRUFBMkI7QUFDekIsaUJBQUtpZ0IsTUFBTDtBQUNBOztBQUVGO0FBQ0MsV0FMRCxNQUtPO0FBQ0wsZ0JBQUl3RSxNQUFNNWMsS0FBSzFNLE9BQU80RSxLQUF0Qjs7QUFFQTtBQUNBLGdCQUFJLEVBQUUwa0IsSUFBSXhiLEtBQUosS0FBYyxDQUFkLElBQW1Cd2IsSUFBSXJTLE1BQUosS0FBZSxDQUFwQyxDQUFKLEVBQTRDO0FBQzFDLG1CQUFLNk4sTUFBTDtBQUNEO0FBQ0Y7QUFDRjtBQUNGLE9BNVZ1Qjs7QUE4VnhCOzs7Ozs7QUFNQTRILGdCQUFVLGtCQUFVaGdCLENBQVYsRUFBYTtBQUNyQixZQUFJNGMsTUFBTTVjLEtBQUsxTSxPQUFPNEUsS0FBdEI7QUFDQSxZQUFJMGtCLElBQUl6YixPQUFKLEtBQWdCLEVBQXBCLEVBQXdCO0FBQ3RCLGVBQUtpWCxNQUFMO0FBQ0Q7QUFDRixPQXpXdUI7O0FBMld4Qjs7O0FBR0ErSCxvQkFBYyx3QkFBWTtBQUN4QixZQUFJbmxCLEtBQUtxSSxPQUFULEVBQWtCO0FBQ2hCLGNBQUk0ZCxXQUFXbEQsSUFBSXRqQixLQUFuQjtBQUFBLGNBQ0U2akIsYUFBYSxnQkFBZ0J0akIsS0FBS3NqQixVQUFyQixHQUFrQyxJQURqRDs7QUFHQTJDLG1CQUFTQyxnQkFBVCxHQUNBRCxTQUFTRSxhQUFULEdBQ0FGLFNBQVNHLFdBQVQsR0FDQUgsU0FBUzNDLFVBQVQsR0FBc0JBLFVBSHRCO0FBSUQ7QUFDRixPQXhYdUI7O0FBMFh4Qjs7OztBQUlBcUIsbUJBQWEsdUJBQVk7QUFDdkIsWUFBSTBCLGNBQWMsQ0FBbEI7QUFDQSxhQUFLLElBQUl4aUIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJa2YsSUFBSW9CLEtBQUosQ0FBVXZrQixNQUE5QixFQUFzQ2lFLEdBQXRDLEVBQTJDO0FBQ3pDd2lCLHlCQUFldEQsSUFBSW9CLEtBQUosQ0FBVXRnQixDQUFWLEVBQWFoRSxZQUE1QjtBQUNEOztBQUVELFlBQUl5bUIsY0FBYyxNQUFNdG1CLEtBQUs4akIsT0FBWCxHQUFxQixJQUFyQixHQUE0QjlqQixLQUFLNGpCLFFBQWpDLEdBQTRDLEdBQTVDLEdBQWtELEtBQUszakIsS0FBdkQsR0FBK0QscUJBQS9ELEdBQXVGb21CLFdBQXZGLEdBQXFHLGtCQUFyRyxHQUEwSHJtQixLQUFLOGpCLE9BQS9ILEdBQXlJLElBQXpJLEdBQWdKOWpCLEtBQUs0akIsUUFBckosR0FBZ0ssR0FBaEssR0FBc0ssS0FBSzNqQixLQUEzSyxHQUFtTCx3REFBck07O0FBRUEsWUFBSWdqQixhQUFhc0QsVUFBakIsRUFBNkI7QUFDM0J0RCx1QkFBYXNELFVBQWIsQ0FBd0JDLE9BQXhCLEdBQWtDRixXQUFsQztBQUNELFNBRkQsTUFFTztBQUNMckQsdUJBQWFxQyxTQUFiLEdBQXlCZ0IsV0FBekI7QUFDRDs7QUFFREEsc0JBQWMsRUFBZDtBQUNEOztBQTdZdUIsS0FBMUI7O0FBaVpBOzs7QUFHQSxXQUFPLElBQUlqRCxhQUFKLENBQWtCL2pCLEVBQWxCLEVBQXNCNEUsT0FBdEIsQ0FBUDtBQUVELEdBaG9CRDs7QUFrb0JBLE1BQUksT0FBT3VpQixNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxPQUFPQyxPQUE1QyxFQUFxRDtBQUNuREQsV0FBT0MsT0FBUCxHQUFpQnBGLGFBQWpCO0FBQ0QsR0FGRCxNQUVPO0FBQ0xocEIsV0FBT2dwQixhQUFQLEdBQXVCQSxhQUF2QjtBQUNEO0FBRUYsQ0E3b0JBLEVBNm9CQy9vQixRQTdvQkQsRUE2b0JXRCxNQTdvQlgsRUE2b0JtQixDQTdvQm5CLENBQUQ7OztBQ1RBLElBQUl5cUIsTUFBTXpCLGNBQWMsZUFBZCxDQUFWOztBQUVBeE4sT0FBT3ZiLFFBQVAsRUFBaUJvdUIsS0FBakIsQ0FBdUIsVUFBVW51QixDQUFWLEVBQWM7O0FBRW5DQSxJQUFFLGlCQUFGLEVBQXFCRyxRQUFyQixDQUE4QjtBQUM5QkksVUFBVztBQURtQixHQUE5QjtBQUlELENBTkQiLCJmaWxlIjoicHJvZHVjdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4vLyBmYW5jeUJveCB2My4yLjVcbi8vXG4vLyBMaWNlbnNlZCBHUEx2MyBmb3Igb3BlbiBzb3VyY2UgdXNlXG4vLyBvciBmYW5jeUJveCBDb21tZXJjaWFsIExpY2Vuc2UgZm9yIGNvbW1lcmNpYWwgdXNlXG4vL1xuLy8gaHR0cDovL2ZhbmN5YXBwcy5jb20vZmFuY3lib3gvXG4vLyBDb3B5cmlnaHQgMjAxNyBmYW5jeUFwcHNcbi8vXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuOyhmdW5jdGlvbiAod2luZG93LCBkb2N1bWVudCwgJCwgdW5kZWZpbmVkKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgLy8gSWYgdGhlcmUncyBubyBqUXVlcnksIGZhbmN5Qm94IGNhbid0IHdvcmtcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgaWYgKCAhJCApIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgZmFuY3lCb3ggaXMgYWxyZWFkeSBpbml0aWFsaXplZFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIGlmICggJC5mbi5mYW5jeWJveCApIHtcclxuXHJcbiAgICAgICAgaWYgKCAnY29uc29sZScgaW4gd2luZG93ICkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ2ZhbmN5Qm94IGFscmVhZHkgaW5pdGlhbGl6ZWQnICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUHJpdmF0ZSBkZWZhdWx0IHNldHRpbmdzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB2YXIgZGVmYXVsdHMgPSB7XHJcblxyXG4gICAgICAgIC8vIEVuYWJsZSBpbmZpbml0ZSBnYWxsZXJ5IG5hdmlnYXRpb25cclxuICAgICAgICBsb29wIDogZmFsc2UsXHJcblxyXG4gICAgICAgIC8vIFNwYWNlIGFyb3VuZCBpbWFnZSwgaWdub3JlZCBpZiB6b29tZWQtaW4gb3Igdmlld3BvcnQgd2lkdGggaXMgc21hbGxlciB0aGFuIDgwMHB4XHJcbiAgICAgICAgbWFyZ2luIDogWzQ0LCAwXSxcclxuXHJcbiAgICAgICAgLy8gSG9yaXpvbnRhbCBzcGFjZSBiZXR3ZWVuIHNsaWRlc1xyXG4gICAgICAgIGd1dHRlciA6IDUwLFxyXG5cclxuICAgICAgICAvLyBFbmFibGUga2V5Ym9hcmQgbmF2aWdhdGlvblxyXG4gICAgICAgIGtleWJvYXJkIDogdHJ1ZSxcclxuXHJcbiAgICAgICAgLy8gU2hvdWxkIGRpc3BsYXkgbmF2aWdhdGlvbiBhcnJvd3MgYXQgdGhlIHNjcmVlbiBlZGdlc1xyXG4gICAgICAgIGFycm93cyA6IHRydWUsXHJcblxyXG4gICAgICAgIC8vIFNob3VsZCBkaXNwbGF5IGluZm9iYXIgKGNvdW50ZXIgYW5kIGFycm93cyBhdCB0aGUgdG9wKVxyXG4gICAgICAgIGluZm9iYXIgOiB0cnVlLFxyXG5cclxuICAgICAgICAvLyBTaG91bGQgZGlzcGxheSB0b29sYmFyIChidXR0b25zIGF0IHRoZSB0b3ApXHJcbiAgICAgICAgdG9vbGJhciA6IHRydWUsXHJcblxyXG4gICAgICAgIC8vIFdoYXQgYnV0dG9ucyBzaG91bGQgYXBwZWFyIGluIHRoZSB0b3AgcmlnaHQgY29ybmVyLlxyXG4gICAgICAgIC8vIEJ1dHRvbnMgd2lsbCBiZSBjcmVhdGVkIHVzaW5nIHRlbXBsYXRlcyBmcm9tIGBidG5UcGxgIG9wdGlvblxyXG4gICAgICAgIC8vIGFuZCB0aGV5IHdpbGwgYmUgcGxhY2VkIGludG8gdG9vbGJhciAoY2xhc3M9XCJmYW5jeWJveC10b29sYmFyXCJgIGVsZW1lbnQpXHJcbiAgICAgICAgYnV0dG9ucyA6IFtcclxuICAgICAgICAgICAgJ3NsaWRlU2hvdycsXHJcbiAgICAgICAgICAgICdmdWxsU2NyZWVuJyxcclxuICAgICAgICAgICAgJ3RodW1icycsXHJcbiAgICAgICAgICAgICdzaGFyZScsXHJcbiAgICAgICAgICAgIC8vJ2Rvd25sb2FkJyxcclxuICAgICAgICAgICAgLy8nem9vbScsXHJcbiAgICAgICAgICAgICdjbG9zZSdcclxuICAgICAgICBdLFxyXG5cclxuICAgICAgICAvLyBEZXRlY3QgXCJpZGxlXCIgdGltZSBpbiBzZWNvbmRzXHJcbiAgICAgICAgaWRsZVRpbWUgOiAzLFxyXG5cclxuICAgICAgICAvLyBTaG91bGQgZGlzcGxheSBidXR0b25zIGF0IHRvcCByaWdodCBjb3JuZXIgb2YgdGhlIGNvbnRlbnRcclxuICAgICAgICAvLyBJZiAnYXV0bycgLSB0aGV5IHdpbGwgYmUgY3JlYXRlZCBmb3IgY29udGVudCBoYXZpbmcgdHlwZSAnaHRtbCcsICdpbmxpbmUnIG9yICdhamF4J1xyXG4gICAgICAgIC8vIFVzZSB0ZW1wbGF0ZSBmcm9tIGBidG5UcGwuc21hbGxCdG5gIGZvciBjdXN0b21pemF0aW9uXHJcbiAgICAgICAgc21hbGxCdG4gOiAnYXV0bycsXHJcblxyXG4gICAgICAgIC8vIERpc2FibGUgcmlnaHQtY2xpY2sgYW5kIHVzZSBzaW1wbGUgaW1hZ2UgcHJvdGVjdGlvbiBmb3IgaW1hZ2VzXHJcbiAgICAgICAgcHJvdGVjdCA6IGZhbHNlLFxyXG5cclxuICAgICAgICAvLyBTaG9ydGN1dCB0byBtYWtlIGNvbnRlbnQgXCJtb2RhbFwiIC0gZGlzYWJsZSBrZXlib2FyZCBuYXZpZ3Rpb24sIGhpZGUgYnV0dG9ucywgZXRjXHJcbiAgICAgICAgbW9kYWwgOiBmYWxzZSxcclxuXHJcbiAgICAgICAgaW1hZ2UgOiB7XHJcblxyXG4gICAgICAgICAgICAvLyBXYWl0IGZvciBpbWFnZXMgdG8gbG9hZCBiZWZvcmUgZGlzcGxheWluZ1xyXG4gICAgICAgICAgICAvLyBSZXF1aXJlcyBwcmVkZWZpbmVkIGltYWdlIGRpbWVuc2lvbnNcclxuICAgICAgICAgICAgLy8gSWYgJ2F1dG8nIC0gd2lsbCB6b29tIGluIHRodW1ibmFpbCBpZiAnd2lkdGgnIGFuZCAnaGVpZ2h0JyBhdHRyaWJ1dGVzIGFyZSBmb3VuZFxyXG4gICAgICAgICAgICBwcmVsb2FkIDogXCJhdXRvXCJcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgYWpheCA6IHtcclxuXHJcbiAgICAgICAgICAgIC8vIE9iamVjdCBjb250YWluaW5nIHNldHRpbmdzIGZvciBhamF4IHJlcXVlc3RcclxuICAgICAgICAgICAgc2V0dGluZ3MgOiB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBoZWxwcyB0byBpbmRpY2F0ZSB0aGF0IHJlcXVlc3QgY29tZXMgZnJvbSB0aGUgbW9kYWxcclxuICAgICAgICAgICAgICAgIC8vIEZlZWwgZnJlZSB0byBjaGFuZ2UgbmFtaW5nXHJcbiAgICAgICAgICAgICAgICBkYXRhIDoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZhbmN5Ym94IDogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIGlmcmFtZSA6IHtcclxuXHJcbiAgICAgICAgICAgIC8vIElmcmFtZSB0ZW1wbGF0ZVxyXG4gICAgICAgICAgICB0cGwgOiAnPGlmcmFtZSBpZD1cImZhbmN5Ym94LWZyYW1le3JuZH1cIiBuYW1lPVwiZmFuY3lib3gtZnJhbWV7cm5kfVwiIGNsYXNzPVwiZmFuY3lib3gtaWZyYW1lXCIgZnJhbWVib3JkZXI9XCIwXCIgdnNwYWNlPVwiMFwiIGhzcGFjZT1cIjBcIiB3ZWJraXRBbGxvd0Z1bGxTY3JlZW4gbW96YWxsb3dmdWxsc2NyZWVuIGFsbG93RnVsbFNjcmVlbiBhbGxvd3RyYW5zcGFyZW5jeT1cInRydWVcIiBzcmM9XCJcIj48L2lmcmFtZT4nLFxyXG5cclxuICAgICAgICAgICAgLy8gUHJlbG9hZCBpZnJhbWUgYmVmb3JlIGRpc3BsYXlpbmcgaXRcclxuICAgICAgICAgICAgLy8gVGhpcyBhbGxvd3MgdG8gY2FsY3VsYXRlIGlmcmFtZSBjb250ZW50IHdpZHRoIGFuZCBoZWlnaHRcclxuICAgICAgICAgICAgLy8gKG5vdGU6IER1ZSB0byBcIlNhbWUgT3JpZ2luIFBvbGljeVwiLCB5b3UgY2FuJ3QgZ2V0IGNyb3NzIGRvbWFpbiBkYXRhKS5cclxuICAgICAgICAgICAgcHJlbG9hZCA6IHRydWUsXHJcblxyXG4gICAgICAgICAgICAvLyBDdXN0b20gQ1NTIHN0eWxpbmcgZm9yIGlmcmFtZSB3cmFwcGluZyBlbGVtZW50XHJcbiAgICAgICAgICAgIC8vIFlvdSBjYW4gdXNlIHRoaXMgdG8gc2V0IGN1c3RvbSBpZnJhbWUgZGltZW5zaW9uc1xyXG4gICAgICAgICAgICBjc3MgOiB7fSxcclxuXHJcbiAgICAgICAgICAgIC8vIElmcmFtZSB0YWcgYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBhdHRyIDoge1xyXG4gICAgICAgICAgICAgICAgc2Nyb2xsaW5nIDogJ2F1dG8nXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gRGVmYXVsdCBjb250ZW50IHR5cGUgaWYgY2Fubm90IGJlIGRldGVjdGVkIGF1dG9tYXRpY2FsbHlcclxuICAgICAgICBkZWZhdWx0VHlwZSA6ICdpbWFnZScsXHJcblxyXG4gICAgICAgIC8vIE9wZW4vY2xvc2UgYW5pbWF0aW9uIHR5cGVcclxuICAgICAgICAvLyBQb3NzaWJsZSB2YWx1ZXM6XHJcbiAgICAgICAgLy8gICBmYWxzZSAgICAgICAgICAgIC0gZGlzYWJsZVxyXG4gICAgICAgIC8vICAgXCJ6b29tXCIgICAgICAgICAgIC0gem9vbSBpbWFnZXMgZnJvbS90byB0aHVtYm5haWxcclxuICAgICAgICAvLyAgIFwiZmFkZVwiXHJcbiAgICAgICAgLy8gICBcInpvb20taW4tb3V0XCJcclxuICAgICAgICAvL1xyXG4gICAgICAgIGFuaW1hdGlvbkVmZmVjdCA6IFwiem9vbVwiLFxyXG5cclxuICAgICAgICAvLyBEdXJhdGlvbiBpbiBtcyBmb3Igb3Blbi9jbG9zZSBhbmltYXRpb25cclxuICAgICAgICBhbmltYXRpb25EdXJhdGlvbiA6IDUwMCxcclxuXHJcbiAgICAgICAgLy8gU2hvdWxkIGltYWdlIGNoYW5nZSBvcGFjaXR5IHdoaWxlIHpvb21pbmdcclxuICAgICAgICAvLyBJZiBvcGFjaXR5IGlzIFwiYXV0b1wiLCB0aGVuIG9wYWNpdHkgd2lsbCBiZSBjaGFuZ2VkIGlmIGltYWdlIGFuZCB0aHVtYm5haWwgaGF2ZSBkaWZmZXJlbnQgYXNwZWN0IHJhdGlvc1xyXG4gICAgICAgIHpvb21PcGFjaXR5IDogXCJhdXRvXCIsXHJcblxyXG4gICAgICAgIC8vIFRyYW5zaXRpb24gZWZmZWN0IGJldHdlZW4gc2xpZGVzXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBQb3NzaWJsZSB2YWx1ZXM6XHJcbiAgICAgICAgLy8gICBmYWxzZSAgICAgICAgICAgIC0gZGlzYWJsZVxyXG4gICAgICAgIC8vICAgXCJmYWRlJ1xyXG4gICAgICAgIC8vICAgXCJzbGlkZSdcclxuICAgICAgICAvLyAgIFwiY2lyY3VsYXInXHJcbiAgICAgICAgLy8gICBcInR1YmUnXHJcbiAgICAgICAgLy8gICBcInpvb20taW4tb3V0J1xyXG4gICAgICAgIC8vICAgXCJyb3RhdGUnXHJcbiAgICAgICAgLy9cclxuICAgICAgICB0cmFuc2l0aW9uRWZmZWN0IDogXCJmYWRlXCIsXHJcblxyXG4gICAgICAgIC8vIER1cmF0aW9uIGluIG1zIGZvciB0cmFuc2l0aW9uIGFuaW1hdGlvblxyXG4gICAgICAgIHRyYW5zaXRpb25EdXJhdGlvbiA6IDM2NixcclxuXHJcbiAgICAgICAgLy8gQ3VzdG9tIENTUyBjbGFzcyBmb3Igc2xpZGUgZWxlbWVudFxyXG4gICAgICAgIHNsaWRlQ2xhc3MgOiAnJyxcclxuXHJcbiAgICAgICAgLy8gQ3VzdG9tIENTUyBjbGFzcyBmb3IgbGF5b3V0XHJcbiAgICAgICAgYmFzZUNsYXNzIDogJycsXHJcblxyXG4gICAgICAgIC8vIEJhc2UgdGVtcGxhdGUgZm9yIGxheW91dFxyXG4gICAgICAgIGJhc2VUcGxcdDpcclxuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1jb250YWluZXJcIiByb2xlPVwiZGlhbG9nXCIgdGFiaW5kZXg9XCItMVwiPicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1iZ1wiPjwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1pbm5lclwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtaW5mb2JhclwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gZGF0YS1mYW5jeWJveC1pbmRleD48L3NwYW4+Jm5ic3A7LyZuYnNwOzxzcGFuIGRhdGEtZmFuY3lib3gtY291bnQ+PC9zcGFuPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXRvb2xiYXJcIj57e2J1dHRvbnN9fTwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtbmF2aWdhdGlvblwiPnt7YXJyb3dzfX08L2Rpdj4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZhbmN5Ym94LXN0YWdlXCI+PC9kaXY+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1jYXB0aW9uLXdyYXBcIj48ZGl2IGNsYXNzPVwiZmFuY3lib3gtY2FwdGlvblwiPjwvZGl2PjwvZGl2PicgK1xyXG4gICAgICAgICAgICAgICAgJzwvZGl2PicgK1xyXG4gICAgICAgICAgICAnPC9kaXY+JyxcclxuXHJcbiAgICAgICAgLy8gTG9hZGluZyBpbmRpY2F0b3IgdGVtcGxhdGVcclxuICAgICAgICBzcGlubmVyVHBsIDogJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1sb2FkaW5nXCI+PC9kaXY+JyxcclxuXHJcbiAgICAgICAgLy8gRXJyb3IgbWVzc2FnZSB0ZW1wbGF0ZVxyXG4gICAgICAgIGVycm9yVHBsIDogJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1lcnJvclwiPjxwPnt7RVJST1J9fTxwPjwvZGl2PicsXHJcblxyXG4gICAgICAgIGJ0blRwbCA6IHtcclxuXHJcbiAgICAgICAgICAgIGRvd25sb2FkIDogJzxhIGRvd25sb2FkIGRhdGEtZmFuY3lib3gtZG93bmxvYWQgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1kb3dubG9hZFwiIHRpdGxlPVwie3tET1dOTE9BRH19XCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgNDAgNDBcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cGF0aCBkPVwiTTIwLDIzIEwyMCw4IEwyMCwyMyBMMTMsMTYgTDIwLDIzIEwyNywxNiBMMjAsMjMgTTI2LDI4IEwxMywyOCBMMjcsMjggTDE0LDI4XCIgLz4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvc3ZnPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8L2E+JyxcclxuXHJcbiAgICAgICAgICAgIHpvb20gOiAnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LXpvb20gY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS16b29tXCIgdGl0bGU9XCJ7e1pPT019fVwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDQwIDQwXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHBhdGggZD1cIk0gMTgsMTcgbS04LDAgYSA4LDggMCAxLDAgMTYsMCBhIDgsOCAwIDEsMCAtMTYsMCBNMjUsMjMgTDMxLDI5IEwyNSwyM1wiIC8+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3N2Zz4nICtcclxuICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+JyxcclxuXHJcbiAgICAgICAgICAgIGNsb3NlIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWNsb3NlXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzxzdmcgdmlld0JveD1cIjAgMCA0MCA0MFwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwYXRoIGQ9XCJNMTAsMTAgTDMwLDMwIE0zMCwxMCBMMTAsMzBcIiAvPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAnPC9zdmc+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgJzwvYnV0dG9uPicsXHJcblxyXG4gICAgICAgICAgICAvLyBUaGlzIHNtYWxsIGNsb3NlIGJ1dHRvbiB3aWxsIGJlIGFwcGVuZGVkIHRvIHlvdXIgaHRtbC9pbmxpbmUvYWpheCBjb250ZW50IGJ5IGRlZmF1bHQsXHJcbiAgICAgICAgICAgIC8vIGlmIFwic21hbGxCdG5cIiBvcHRpb24gaXMgbm90IHNldCB0byBmYWxzZVxyXG4gICAgICAgICAgICBzbWFsbEJ0biAgIDogJzxidXR0b24gZGF0YS1mYW5jeWJveC1jbG9zZSBjbGFzcz1cImZhbmN5Ym94LWNsb3NlLXNtYWxsXCIgdGl0bGU9XCJ7e0NMT1NFfX1cIj48L2J1dHRvbj4nLFxyXG5cclxuICAgICAgICAgICAgLy8gQXJyb3dzXHJcbiAgICAgICAgICAgIGFycm93TGVmdCA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtcHJldiBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWFycm93X2xlZnRcIiB0aXRsZT1cInt7UFJFVn19XCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHN2ZyB2aWV3Qm94PVwiMCAwIDQwIDQwXCI+JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cGF0aCBkPVwiTTEwLDIwIEwzMCwyMCBMMTAsMjAgTDE4LDI4IEwxMCwyMCBMMTgsMTIgTDEwLDIwXCI+PC9wYXRoPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvc3ZnPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nLFxyXG5cclxuICAgICAgICAgICAgYXJyb3dSaWdodCA6ICc8YnV0dG9uIGRhdGEtZmFuY3lib3gtbmV4dCBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLWFycm93X3JpZ2h0XCIgdGl0bGU9XCJ7e05FWFR9fVwiPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8c3ZnIHZpZXdCb3g9XCIwIDAgNDAgNDBcIj4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cGF0aCBkPVwiTTMwLDIwIEwxMCwyMCBMMzAsMjAgTDIyLDI4IEwzMCwyMCBMMjIsMTIgTDMwLDIwXCI+PC9wYXRoPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L3N2Zz4nICtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvYnV0dG9uPidcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBDb250YWluZXIgaXMgaW5qZWN0ZWQgaW50byB0aGlzIGVsZW1lbnRcclxuICAgICAgICBwYXJlbnRFbCA6ICdib2R5JyxcclxuXHJcblxyXG4gICAgICAgIC8vIEZvY3VzIGhhbmRsaW5nXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgLy8gVHJ5IHRvIGZvY3VzIG9uIHRoZSBmaXJzdCBmb2N1c2FibGUgZWxlbWVudCBhZnRlciBvcGVuaW5nXHJcbiAgICAgICAgYXV0b0ZvY3VzIDogZmFsc2UsXHJcblxyXG4gICAgICAgIC8vIFB1dCBmb2N1cyBiYWNrIHRvIGFjdGl2ZSBlbGVtZW50IGFmdGVyIGNsb3NpbmdcclxuICAgICAgICBiYWNrRm9jdXMgOiB0cnVlLFxyXG5cclxuICAgICAgICAvLyBEbyBub3QgbGV0IHVzZXIgdG8gZm9jdXMgb24gZWxlbWVudCBvdXRzaWRlIG1vZGFsIGNvbnRlbnRcclxuICAgICAgICB0cmFwRm9jdXMgOiB0cnVlLFxyXG5cclxuXHJcbiAgICAgICAgLy8gTW9kdWxlIHNwZWNpZmljIG9wdGlvbnNcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBmdWxsU2NyZWVuIDoge1xyXG4gICAgICAgICAgICBhdXRvU3RhcnQgOiBmYWxzZSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBTZXQgYHRvdWNoOiBmYWxzZWAgdG8gZGlzYWJsZSBkcmFnZ2luZy9zd2lwaW5nXHJcbiAgICAgICAgdG91Y2ggOiB7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsIDogdHJ1ZSwgIC8vIEFsbG93IHRvIGRyYWcgY29udGVudCB2ZXJ0aWNhbGx5XHJcbiAgICAgICAgICAgIG1vbWVudHVtIDogdHJ1ZSAgIC8vIENvbnRpbnVlIG1vdmVtZW50IGFmdGVyIHJlbGVhc2luZyBtb3VzZS90b3VjaCB3aGVuIHBhbm5pbmdcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBIYXNoIHZhbHVlIHdoZW4gaW5pdGlhbGl6aW5nIG1hbnVhbGx5LFxyXG4gICAgICAgIC8vIHNldCBgZmFsc2VgIHRvIGRpc2FibGUgaGFzaCBjaGFuZ2VcclxuICAgICAgICBoYXNoIDogbnVsbCxcclxuXHJcbiAgICAgICAgLy8gQ3VzdG9taXplIG9yIGFkZCBuZXcgbWVkaWEgdHlwZXNcclxuICAgICAgICAvLyBFeGFtcGxlOlxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgbWVkaWEgOiB7XHJcbiAgICAgICAgICAgIHlvdXR1YmUgOiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXMgOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0b3BsYXkgOiAwXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuICAgICAgICBtZWRpYSA6IHt9LFxyXG5cclxuICAgICAgICBzbGlkZVNob3cgOiB7XHJcbiAgICAgICAgICAgIGF1dG9TdGFydCA6IGZhbHNlLFxyXG4gICAgICAgICAgICBzcGVlZCAgICAgOiA0MDAwXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgdGh1bWJzIDoge1xyXG5cdFx0XHRhdXRvU3RhcnQgICA6IGZhbHNlLCAgICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgdGh1bWJuYWlscyBvbiBvcGVuaW5nXHJcblx0XHRcdGhpZGVPbkNsb3NlIDogdHJ1ZSwgICAgICAgICAgICAgICAgICAgLy8gSGlkZSB0aHVtYm5haWwgZ3JpZCB3aGVuIGNsb3NpbmcgYW5pbWF0aW9uIHN0YXJ0c1xyXG5cdFx0XHRwYXJlbnRFbCAgICA6ICcuZmFuY3lib3gtY29udGFpbmVyJywgIC8vIENvbnRhaW5lciBpcyBpbmplY3RlZCBpbnRvIHRoaXMgZWxlbWVudFxyXG5cdFx0XHRheGlzICAgICAgICA6ICd5JyAgICAgICAgICAgICAgICAgICAgIC8vIFZlcnRpY2FsICh5KSBvciBob3Jpem9udGFsICh4KSBzY3JvbGxpbmdcclxuXHRcdH0sXHJcblxyXG4gICAgICAgIC8vIENhbGxiYWNrc1xyXG4gICAgICAgIC8vPT09PT09PT09PVxyXG5cclxuICAgICAgICAvLyBTZWUgRG9jdW1lbnRhdGlvbi9BUEkvRXZlbnRzIGZvciBtb3JlIGluZm9ybWF0aW9uXHJcbiAgICAgICAgLy8gRXhhbXBsZTpcclxuICAgICAgICAvKlxyXG4gICAgICAgICAgICBhZnRlclNob3c6IGZ1bmN0aW9uKCBpbnN0YW5jZSwgY3VycmVudCApIHtcclxuICAgICAgICAgICAgICAgICBjb25zb2xlLmluZm8oICdDbGlja2VkIGVsZW1lbnQ6JyApO1xyXG4gICAgICAgICAgICAgICAgIGNvbnNvbGUuaW5mbyggY3VycmVudC5vcHRzLiRvcmlnICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAqL1xyXG5cclxuICAgICAgICBvbkluaXQgICAgICAgOiAkLm5vb3AsICAvLyBXaGVuIGluc3RhbmNlIGhhcyBiZWVuIGluaXRpYWxpemVkXHJcblxyXG4gICAgICAgIGJlZm9yZUxvYWQgICA6ICQubm9vcCwgIC8vIEJlZm9yZSB0aGUgY29udGVudCBvZiBhIHNsaWRlIGlzIGJlaW5nIGxvYWRlZFxyXG4gICAgICAgIGFmdGVyTG9hZCAgICA6ICQubm9vcCwgIC8vIFdoZW4gdGhlIGNvbnRlbnQgb2YgYSBzbGlkZSBpcyBkb25lIGxvYWRpbmdcclxuXHJcbiAgICAgICAgYmVmb3JlU2hvdyAgIDogJC5ub29wLCAgLy8gQmVmb3JlIG9wZW4gYW5pbWF0aW9uIHN0YXJ0c1xyXG4gICAgICAgIGFmdGVyU2hvdyAgICA6ICQubm9vcCwgIC8vIFdoZW4gY29udGVudCBpcyBkb25lIGxvYWRpbmcgYW5kIGFuaW1hdGluZ1xyXG5cclxuICAgICAgICBiZWZvcmVDbG9zZSAgOiAkLm5vb3AsICAvLyBCZWZvcmUgdGhlIGluc3RhbmNlIGF0dGVtcHRzIHRvIGNsb3NlLiBSZXR1cm4gZmFsc2UgdG8gY2FuY2VsIHRoZSBjbG9zZS5cclxuICAgICAgICBhZnRlckNsb3NlICAgOiAkLm5vb3AsICAvLyBBZnRlciBpbnN0YW5jZSBoYXMgYmVlbiBjbG9zZWRcclxuXHJcbiAgICAgICAgb25BY3RpdmF0ZSAgIDogJC5ub29wLCAgLy8gV2hlbiBpbnN0YW5jZSBpcyBicm91Z2h0IHRvIGZyb250XHJcbiAgICAgICAgb25EZWFjdGl2YXRlIDogJC5ub29wLCAgLy8gV2hlbiBvdGhlciBpbnN0YW5jZSBoYXMgYmVlbiBhY3RpdmF0ZWRcclxuXHJcblxyXG4gICAgICAgIC8vIEludGVyYWN0aW9uXHJcbiAgICAgICAgLy8gPT09PT09PT09PT1cclxuXHJcbiAgICAgICAgLy8gVXNlIG9wdGlvbnMgYmVsb3cgdG8gY3VzdG9taXplIHRha2VuIGFjdGlvbiB3aGVuIHVzZXIgY2xpY2tzIG9yIGRvdWJsZSBjbGlja3Mgb24gdGhlIGZhbmN5Qm94IGFyZWEsXHJcbiAgICAgICAgLy8gZWFjaCBvcHRpb24gY2FuIGJlIHN0cmluZyBvciBtZXRob2QgdGhhdCByZXR1cm5zIHZhbHVlLlxyXG4gICAgICAgIC8vXHJcbiAgICAgICAgLy8gUG9zc2libGUgdmFsdWVzOlxyXG4gICAgICAgIC8vICAgXCJjbG9zZVwiICAgICAgICAgICAtIGNsb3NlIGluc3RhbmNlXHJcbiAgICAgICAgLy8gICBcIm5leHRcIiAgICAgICAgICAgIC0gbW92ZSB0byBuZXh0IGdhbGxlcnkgaXRlbVxyXG4gICAgICAgIC8vICAgXCJuZXh0T3JDbG9zZVwiICAgICAtIG1vdmUgdG8gbmV4dCBnYWxsZXJ5IGl0ZW0gb3IgY2xvc2UgaWYgZ2FsbGVyeSBoYXMgb25seSBvbmUgaXRlbVxyXG4gICAgICAgIC8vICAgXCJ0b2dnbGVDb250cm9sc1wiICAtIHNob3cvaGlkZSBjb250cm9sc1xyXG4gICAgICAgIC8vICAgXCJ6b29tXCIgICAgICAgICAgICAtIHpvb20gaW1hZ2UgKGlmIGxvYWRlZClcclxuICAgICAgICAvLyAgIGZhbHNlICAgICAgICAgICAgIC0gZG8gbm90aGluZ1xyXG5cclxuICAgICAgICAvLyBDbGlja2VkIG9uIHRoZSBjb250ZW50XHJcbiAgICAgICAgY2xpY2tDb250ZW50IDogZnVuY3Rpb24oIGN1cnJlbnQsIGV2ZW50ICkge1xyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSAnaW1hZ2UnID8gJ3pvb20nIDogZmFsc2U7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ2xpY2tlZCBvbiB0aGUgc2xpZGVcclxuICAgICAgICBjbGlja1NsaWRlIDogJ2Nsb3NlJyxcclxuXHJcbiAgICAgICAgLy8gQ2xpY2tlZCBvbiB0aGUgYmFja2dyb3VuZCAoYmFja2Ryb3ApIGVsZW1lbnRcclxuICAgICAgICBjbGlja091dHNpZGUgOiAnY2xvc2UnLFxyXG5cclxuICAgICAgICAvLyBTYW1lIGFzIHByZXZpb3VzIHR3bywgYnV0IGZvciBkb3VibGUgY2xpY2tcclxuICAgICAgICBkYmxjbGlja0NvbnRlbnQgOiBmYWxzZSxcclxuICAgICAgICBkYmxjbGlja1NsaWRlICAgOiBmYWxzZSxcclxuICAgICAgICBkYmxjbGlja091dHNpZGUgOiBmYWxzZSxcclxuXHJcblxyXG4gICAgICAgIC8vIEN1c3RvbSBvcHRpb25zIHdoZW4gbW9iaWxlIGRldmljZSBpcyBkZXRlY3RlZFxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBtb2JpbGUgOiB7XHJcbiAgICAgICAgICAgIG1hcmdpbiA6IDAsXHJcblxyXG4gICAgICAgICAgICBjbGlja0NvbnRlbnQgOiBmdW5jdGlvbiggY3VycmVudCwgZXZlbnQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSAnaW1hZ2UnID8gJ3RvZ2dsZUNvbnRyb2xzJyA6IGZhbHNlO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjbGlja1NsaWRlIDogZnVuY3Rpb24oIGN1cnJlbnQsIGV2ZW50ICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGN1cnJlbnQudHlwZSA9PT0gJ2ltYWdlJyA/ICd0b2dnbGVDb250cm9scycgOiAnY2xvc2UnO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBkYmxjbGlja0NvbnRlbnQgOiBmdW5jdGlvbiggY3VycmVudCwgZXZlbnQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSAnaW1hZ2UnID8gJ3pvb20nIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGRibGNsaWNrU2xpZGUgOiBmdW5jdGlvbiggY3VycmVudCwgZXZlbnQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gY3VycmVudC50eXBlID09PSAnaW1hZ2UnID8gJ3pvb20nIDogZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gSW50ZXJuYXRpb25hbGl6YXRpb25cclxuICAgICAgICAvLyA9PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgbGFuZyA6ICdlbicsXHJcbiAgICAgICAgaTE4biA6IHtcclxuICAgICAgICAgICAgJ2VuJyA6IHtcclxuICAgICAgICAgICAgICAgIENMT1NFICAgICAgIDogJ0Nsb3NlJyxcclxuICAgICAgICAgICAgICAgIE5FWFQgICAgICAgIDogJ05leHQnLFxyXG4gICAgICAgICAgICAgICAgUFJFViAgICAgICAgOiAnUHJldmlvdXMnLFxyXG4gICAgICAgICAgICAgICAgRVJST1IgICAgICAgOiAnVGhlIHJlcXVlc3RlZCBjb250ZW50IGNhbm5vdCBiZSBsb2FkZWQuIDxici8+IFBsZWFzZSB0cnkgYWdhaW4gbGF0ZXIuJyxcclxuICAgICAgICAgICAgICAgIFBMQVlfU1RBUlQgIDogJ1N0YXJ0IHNsaWRlc2hvdycsXHJcbiAgICAgICAgICAgICAgICBQTEFZX1NUT1AgICA6ICdQYXVzZSBzbGlkZXNob3cnLFxyXG4gICAgICAgICAgICAgICAgRlVMTF9TQ1JFRU4gOiAnRnVsbCBzY3JlZW4nLFxyXG4gICAgICAgICAgICAgICAgVEhVTUJTICAgICAgOiAnVGh1bWJuYWlscycsXHJcbiAgICAgICAgICAgICAgICBET1dOTE9BRCAgICA6ICdEb3dubG9hZCcsXHJcbiAgICAgICAgICAgICAgICBTSEFSRSAgICAgICA6ICdTaGFyZScsXHJcbiAgICAgICAgICAgICAgICBaT09NICAgICAgICA6ICdab29tJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAnZGUnIDoge1xyXG4gICAgICAgICAgICAgICAgQ0xPU0UgICAgICAgOiAnU2NobGllc3NlbicsXHJcbiAgICAgICAgICAgICAgICBORVhUICAgICAgICA6ICdXZWl0ZXInLFxyXG4gICAgICAgICAgICAgICAgUFJFViAgICAgICAgOiAnWnVyw7xjaycsXHJcbiAgICAgICAgICAgICAgICBFUlJPUiAgICAgICA6ICdEaWUgYW5nZWZvcmRlcnRlbiBEYXRlbiBrb25udGVuIG5pY2h0IGdlbGFkZW4gd2VyZGVuLiA8YnIvPiBCaXR0ZSB2ZXJzdWNoZW4gU2llIGVzIHNww6R0ZXIgbm9jaG1hbC4nLFxyXG4gICAgICAgICAgICAgICAgUExBWV9TVEFSVCAgOiAnRGlhc2NoYXUgc3RhcnRlbicsXHJcbiAgICAgICAgICAgICAgICBQTEFZX1NUT1AgICA6ICdEaWFzY2hhdSBiZWVuZGVuJyxcclxuICAgICAgICAgICAgICAgIEZVTExfU0NSRUVOIDogJ1ZvbGxiaWxkJyxcclxuICAgICAgICAgICAgICAgIFRIVU1CUyAgICAgIDogJ1ZvcnNjaGF1YmlsZGVyJyxcclxuICAgICAgICAgICAgICAgIERPV05MT0FEICAgIDogJ0hlcnVudGVybGFkZW4nLFxyXG4gICAgICAgICAgICAgICAgU0hBUkUgICAgICAgOiAnVGVpbGVuJyxcclxuICAgICAgICAgICAgICAgIFpPT00gICAgICAgIDogJ01hw59zdGFiJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG4gICAgLy8gRmV3IHVzZWZ1bCB2YXJpYWJsZXMgYW5kIG1ldGhvZHNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdmFyICRXID0gJCh3aW5kb3cpO1xyXG4gICAgdmFyICREID0gJChkb2N1bWVudCk7XHJcblxyXG4gICAgdmFyIGNhbGxlZCA9IDA7XHJcblxyXG5cclxuICAgIC8vIENoZWNrIGlmIGFuIG9iamVjdCBpcyBhIGpRdWVyeSBvYmplY3QgYW5kIG5vdCBhIG5hdGl2ZSBKYXZhU2NyaXB0IG9iamVjdFxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdmFyIGlzUXVlcnkgPSBmdW5jdGlvbiAoIG9iaiApIHtcclxuICAgICAgICByZXR1cm4gb2JqICYmIG9iai5oYXNPd25Qcm9wZXJ0eSAmJiBvYmogaW5zdGFuY2VvZiAkO1xyXG4gICAgfTtcclxuXHJcblxyXG4gICAgLy8gSGFuZGxlIG11bHRpcGxlIGJyb3dzZXJzIGZvciBcInJlcXVlc3RBbmltYXRpb25GcmFtZVwiIGFuZCBcImNhbmNlbEFuaW1hdGlvbkZyYW1lXCJcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB2YXIgcmVxdWVzdEFGcmFtZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBhbGwgZWxzZSBmYWlscywgdXNlIHNldFRpbWVvdXRcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG5cclxuXHJcbiAgICAvLyBEZXRlY3QgdGhlIHN1cHBvcnRlZCB0cmFuc2l0aW9uLWVuZCBldmVudCBwcm9wZXJ0eSBuYW1lXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgdmFyIHRyYW5zaXRpb25FbmQgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciB0LCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmYWtlZWxlbWVudFwiKTtcclxuXHJcbiAgICAgICAgdmFyIHRyYW5zaXRpb25zID0ge1xyXG4gICAgICAgICAgICBcInRyYW5zaXRpb25cIiAgICAgIDogXCJ0cmFuc2l0aW9uZW5kXCIsXHJcbiAgICAgICAgICAgIFwiT1RyYW5zaXRpb25cIiAgICAgOiBcIm9UcmFuc2l0aW9uRW5kXCIsXHJcbiAgICAgICAgICAgIFwiTW96VHJhbnNpdGlvblwiICAgOiBcInRyYW5zaXRpb25lbmRcIixcclxuICAgICAgICAgICAgXCJXZWJraXRUcmFuc2l0aW9uXCI6IFwid2Via2l0VHJhbnNpdGlvbkVuZFwiXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZm9yICh0IGluIHRyYW5zaXRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cmFuc2l0aW9uc1t0XTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICd0cmFuc2l0aW9uZW5kJztcclxuICAgIH0pKCk7XHJcblxyXG5cclxuICAgIC8vIEZvcmNlIHJlZHJhdyBvbiBhbiBlbGVtZW50LlxyXG4gICAgLy8gVGhpcyBoZWxwcyBpbiBjYXNlcyB3aGVyZSB0aGUgYnJvd3NlciBkb2Vzbid0IHJlZHJhdyBhbiB1cGRhdGVkIGVsZW1lbnQgcHJvcGVybHkuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB2YXIgZm9yY2VSZWRyYXcgPSBmdW5jdGlvbiggJGVsICkge1xyXG4gICAgICAgIHJldHVybiAoICRlbCAmJiAkZWwubGVuZ3RoICYmICRlbFswXS5vZmZzZXRIZWlnaHQgKTtcclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIENsYXNzIGRlZmluaXRpb25cclxuICAgIC8vID09PT09PT09PT09PT09PT1cclxuXHJcbiAgICB2YXIgRmFuY3lCb3ggPSBmdW5jdGlvbiggY29udGVudCwgb3B0cywgaW5kZXggKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZWxmLm9wdHMgPSAkLmV4dGVuZCggdHJ1ZSwgeyBpbmRleCA6IGluZGV4IH0sICQuZmFuY3lib3guZGVmYXVsdHMsIG9wdHMgfHwge30gKTtcclxuXHJcbiAgICAgICAgaWYgKCAkLmZhbmN5Ym94LmlzTW9iaWxlICkge1xyXG4gICAgICAgICAgICBzZWxmLm9wdHMgPSAkLmV4dGVuZCggdHJ1ZSwge30sIHNlbGYub3B0cywgc2VsZi5vcHRzLm1vYmlsZSApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gRXhjbHVkZSBidXR0b25zIG9wdGlvbiBmcm9tIGRlZXAgbWVyZ2luZ1xyXG4gICAgICAgIGlmICggb3B0cyAmJiAkLmlzQXJyYXkoIG9wdHMuYnV0dG9ucyApICkge1xyXG4gICAgICAgICAgICBzZWxmLm9wdHMuYnV0dG9ucyA9IG9wdHMuYnV0dG9ucztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHNlbGYuaWQgICAgPSBzZWxmLm9wdHMuaWQgfHwgKytjYWxsZWQ7XHJcbiAgICAgICAgc2VsZi5ncm91cCA9IFtdO1xyXG5cclxuICAgICAgICBzZWxmLmN1cnJJbmRleCA9IHBhcnNlSW50KCBzZWxmLm9wdHMuaW5kZXgsIDEwICkgfHwgMDtcclxuICAgICAgICBzZWxmLnByZXZJbmRleCA9IG51bGw7XHJcblxyXG4gICAgICAgIHNlbGYucHJldlBvcyA9IG51bGw7XHJcbiAgICAgICAgc2VsZi5jdXJyUG9zID0gMDtcclxuXHJcbiAgICAgICAgc2VsZi5maXJzdFJ1biA9IG51bGw7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBncm91cCBlbGVtZW50cyBmcm9tIG9yaWdpbmFsIGl0ZW0gY29sbGVjdGlvblxyXG4gICAgICAgIHNlbGYuY3JlYXRlR3JvdXAoIGNvbnRlbnQgKTtcclxuXHJcbiAgICAgICAgaWYgKCAhc2VsZi5ncm91cC5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFNhdmUgbGFzdCBhY3RpdmUgZWxlbWVudCBhbmQgY3VycmVudCBzY3JvbGwgcG9zaXRpb25cclxuICAgICAgICBzZWxmLiRsYXN0Rm9jdXMgPSAkKGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQpLmJsdXIoKTtcclxuXHJcbiAgICAgICAgLy8gQ29sbGVjdGlvbiBvZiBnYWxsZXJ5IG9iamVjdHNcclxuICAgICAgICBzZWxmLnNsaWRlcyA9IHt9O1xyXG5cclxuICAgICAgICBzZWxmLmluaXQoKTtcclxuICAgIH07XHJcblxyXG4gICAgJC5leHRlbmQoRmFuY3lCb3gucHJvdG90eXBlLCB7XHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBET00gc3RydWN0dXJlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgaW5pdCA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBmaXJzdEl0ZW0gICAgICA9IHNlbGYuZ3JvdXBbIHNlbGYuY3VyckluZGV4IF0sXHJcbiAgICAgICAgICAgICAgICBmaXJzdEl0ZW1PcHRzICA9IGZpcnN0SXRlbS5vcHRzLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyV2lkdGggPSAkLmZhbmN5Ym94LnNjcm9sbGJhcldpZHRoLFxyXG4gICAgICAgICAgICAgICAgJHNjcm9sbERpdixcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIsXHJcbiAgICAgICAgICAgICAgICBidXR0b25TdHI7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNjcm9sbFRvcCAgPSAkRC5zY3JvbGxUb3AoKTtcclxuICAgICAgICAgICAgc2VsZi5zY3JvbGxMZWZ0ID0gJEQuc2Nyb2xsTGVmdCgpO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIEhpZGUgc2Nyb2xsYmFyc1xyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgICAgIGlmICggISQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkKCAnYm9keScgKS5hZGRDbGFzcyggJ2ZhbmN5Ym94LWFjdGl2ZScgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBpT1MgaGFja1xyXG4gICAgICAgICAgICAgICAgaWYgKCAvaVBhZHxpUGhvbmV8aVBvZC8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAhd2luZG93Lk1TU3RyZWFtICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBpT1MgaGFzIHByb2JsZW1zIGZvciBpbnB1dCBlbGVtZW50cyBpbnNpZGUgZml4ZWQgY29udGFpbmVycyxcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgd29ya2Fyb3VuZCBpcyB0byBhcHBseSBgcG9zaXRpb246IGZpeGVkYCB0byBgPGJvZHk+YCBlbGVtZW50LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHVuZm9ydHVuYXRlbHksIHRoaXMgbWFrZXMgaXQgbG9zZSB0aGUgc2Nyb2xsYmFycyBhbmQgZm9yY2VzIGFkZHJlc3MgYmFyIHRvIGFwcGVhci5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBmaXJzdEl0ZW0udHlwZSAhPT0gJ2ltYWdlJyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJCggJ2JvZHknICkuY3NzKCAndG9wJywgJCggJ2JvZHknICkuc2Nyb2xsVG9wKCkgKiAtMSApLmFkZENsYXNzKCAnZmFuY3lib3gtaW9zZml4JyApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCAhJC5mYW5jeWJveC5pc01vYmlsZSAmJiBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCA+IHdpbmRvdy5pbm5lckhlaWdodCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzY3JvbGxiYXJXaWR0aCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2Nyb2xsRGl2ID0gJCgnPGRpdiBzdHlsZT1cIndpZHRoOjUwcHg7aGVpZ2h0OjUwcHg7b3ZlcmZsb3c6c2Nyb2xsO1wiIC8+JykuYXBwZW5kVG8oICdib2R5JyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsYmFyV2lkdGggPSAkLmZhbmN5Ym94LnNjcm9sbGJhcldpZHRoID0gJHNjcm9sbERpdlswXS5vZmZzZXRXaWR0aCAtICRzY3JvbGxEaXZbMF0uY2xpZW50V2lkdGg7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2Nyb2xsRGl2LnJlbW92ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCggJ2hlYWQnICkuYXBwZW5kKCAnPHN0eWxlIGlkPVwiZmFuY3lib3gtc3R5bGUtbm9zY3JvbGxcIiB0eXBlPVwidGV4dC9jc3NcIj4uY29tcGVuc2F0ZS1mb3Itc2Nyb2xsYmFyIHsgbWFyZ2luLXJpZ2h0OiAnICsgc2Nyb2xsYmFyV2lkdGggKyAncHg7IH08L3N0eWxlPicgKTtcclxuICAgICAgICAgICAgICAgICAgICAkKCAnYm9keScgKS5hZGRDbGFzcyggJ2NvbXBlbnNhdGUtZm9yLXNjcm9sbGJhcicgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIEJ1aWxkIGh0bWwgbWFya3VwIGFuZCBzZXQgcmVmZXJlbmNlc1xyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgICAgIC8vIEJ1aWxkIGh0bWwgY29kZSBmb3IgYnV0dG9ucyBhbmQgaW5zZXJ0IGludG8gbWFpbiB0ZW1wbGF0ZVxyXG4gICAgICAgICAgICBidXR0b25TdHIgPSAnJztcclxuXHJcbiAgICAgICAgICAgICQuZWFjaCggZmlyc3RJdGVtT3B0cy5idXR0b25zLCBmdW5jdGlvbiggaW5kZXgsIHZhbHVlICkge1xyXG4gICAgICAgICAgICAgICAgYnV0dG9uU3RyICs9ICggZmlyc3RJdGVtT3B0cy5idG5UcGxbIHZhbHVlIF0gfHwgJycgKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBDcmVhdGUgbWFya3VwIGZyb20gYmFzZSB0ZW1wbGF0ZSwgaXQgd2lsbCBiZSBpbml0aWFsbHkgaGlkZGVuIHRvXHJcbiAgICAgICAgICAgIC8vIGF2b2lkIHVubmVjZXNzYXJ5IHdvcmsgbGlrZSBwYWludGluZyB3aGlsZSBpbml0aWFsaXppbmcgaXMgbm90IGNvbXBsZXRlXHJcbiAgICAgICAgICAgICRjb250YWluZXIgPSAkKFxyXG4gICAgICAgICAgICAgICAgc2VsZi50cmFuc2xhdGUoIHNlbGYsXHJcbiAgICAgICAgICAgICAgICAgICAgZmlyc3RJdGVtT3B0cy5iYXNlVHBsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCAnXFx7XFx7YnV0dG9uc1xcfVxcfScsIGJ1dHRvblN0ciApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKCAnXFx7XFx7YXJyb3dzXFx9XFx9JywgZmlyc3RJdGVtT3B0cy5idG5UcGwuYXJyb3dMZWZ0ICsgZmlyc3RJdGVtT3B0cy5idG5UcGwuYXJyb3dSaWdodCApXHJcbiAgICAgICAgICAgICAgICApXHJcbiAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCAnaWQnLCAnZmFuY3lib3gtY29udGFpbmVyLScgKyBzZWxmLmlkIClcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ2ZhbmN5Ym94LWlzLWhpZGRlbicgKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCBmaXJzdEl0ZW1PcHRzLmJhc2VDbGFzcyApXHJcbiAgICAgICAgICAgICAgICAuZGF0YSggJ0ZhbmN5Qm94Jywgc2VsZiApXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oIGZpcnN0SXRlbU9wdHMucGFyZW50RWwgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBvYmplY3QgaG9sZGluZyByZWZlcmVuY2VzIHRvIGpRdWVyeSB3cmFwcGVkIG5vZGVzXHJcbiAgICAgICAgICAgIHNlbGYuJHJlZnMgPSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIgOiAkY29udGFpbmVyXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBbICdiZycsICdpbm5lcicsICdpbmZvYmFyJywgJ3Rvb2xiYXInLCAnc3RhZ2UnLCAnY2FwdGlvbicsICduYXZpZ2F0aW9uJyBdLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi4kcmVmc1sgaXRlbSBdID0gJGNvbnRhaW5lci5maW5kKCAnLmZhbmN5Ym94LScgKyBpdGVtICk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCAnb25Jbml0JyApO1xyXG5cclxuICAgICAgICAgICAgLy8gRW5hYmxlIGV2ZW50cywgZGVhY3RpdmUgcHJldmlvdXMgaW5zdGFuY2VzXHJcbiAgICAgICAgICAgIHNlbGYuYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEJ1aWxkIHNsaWRlcywgbG9hZCBhbmQgcmV2ZWFsIGNvbnRlbnRcclxuICAgICAgICAgICAgc2VsZi5qdW1wVG8oIHNlbGYuY3VyckluZGV4ICk7XHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIFNpbXBsZSBpMThuIHN1cHBvcnQgLSByZXBsYWNlcyBvYmplY3Qga2V5cyBmb3VuZCBpbiB0ZW1wbGF0ZVxyXG4gICAgICAgIC8vIHdpdGggY29ycmVzcG9uZGluZyB2YWx1ZXNcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgdHJhbnNsYXRlIDogZnVuY3Rpb24oIG9iaiwgc3RyICkge1xyXG4gICAgICAgICAgICB2YXIgYXJyID0gb2JqLm9wdHMuaTE4blsgb2JqLm9wdHMubGFuZyBdO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHtcXHsoXFx3KylcXH1cXH0vZywgZnVuY3Rpb24obWF0Y2gsIG4pIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGFycltuXTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHZhbHVlID09PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGFycmF5IG9mIGdhbGx5IGl0ZW0gb2JqZWN0c1xyXG4gICAgICAgIC8vIENoZWNrIGlmIGVhY2ggb2JqZWN0IGhhcyB2YWxpZCB0eXBlIGFuZCBjb250ZW50XHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgY3JlYXRlR3JvdXAgOiBmdW5jdGlvbiAoIGNvbnRlbnQgKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmICA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9ICQubWFrZUFycmF5KCBjb250ZW50ICk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goaXRlbXMsIGZ1bmN0aW9uKCBpLCBpdGVtICkge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiAgPSB7fSxcclxuICAgICAgICAgICAgICAgICAgICBvcHRzID0ge30sXHJcbiAgICAgICAgICAgICAgICAgICAgJGl0ZW0sXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZSxcclxuICAgICAgICAgICAgICAgICAgICBzcmMsXHJcbiAgICAgICAgICAgICAgICAgICAgc3JjUGFydHM7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3RlcCAxIC0gTWFrZSBzdXJlIHdlIGhhdmUgYW4gb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICQuaXNQbGFpbk9iamVjdCggaXRlbSApICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBXZSBwcm9iYWJseSBoYXZlIG1hbnVhbCB1c2FnZSBoZXJlLCBzb21ldGhpbmcgbGlrZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vICQuZmFuY3lib3gub3BlbiggWyB7IHNyYyA6IFwiaW1hZ2UuanBnXCIsIHR5cGUgOiBcImltYWdlXCIgfSBdIClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqICA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICAgICAgb3B0cyA9IGl0ZW0ub3B0cyB8fCBpdGVtO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoICQudHlwZSggaXRlbSApID09PSAnb2JqZWN0JyAmJiAkKCBpdGVtICkubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIZXJlIHdlIHByb2JhYmx5IGhhdmUgalF1ZXJ5IGNvbGxlY3Rpb24gcmV0dXJuZWQgYnkgc29tZSBzZWxlY3RvclxyXG4gICAgICAgICAgICAgICAgICAgICRpdGVtID0gJCggaXRlbSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBvcHRzID0gJGl0ZW0uZGF0YSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9wdHMgPSAkLmV4dGVuZCgge30sIG9wdHMsIG9wdHMub3B0aW9ucyB8fCB7fSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBIZXJlIHdlIHN0b3JlIGNsaWNrZWQgZWxlbWVudFxyXG4gICAgICAgICAgICAgICAgICAgIG9wdHMuJG9yaWcgPSAkaXRlbTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnNyYyA9IG9wdHMuc3JjIHx8ICRpdGVtLmF0dHIoICdocmVmJyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBBc3N1bWUgdGhhdCBzaW1wbGUgc3ludGF4IGlzIHVzZWQsIGZvciBleGFtcGxlOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgYCQuZmFuY3lib3gub3BlbiggJChcIiN0ZXN0XCIpLCB7fSApO2BcclxuICAgICAgICAgICAgICAgICAgICBpZiAoICFvYmoudHlwZSAmJiAhb2JqLnNyYyApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnR5cGUgPSAnaW5saW5lJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnNyYyAgPSBpdGVtO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBBc3N1bWUgd2UgaGF2ZSBhIHNpbXBsZSBodG1sIGNvZGUsIGZvciBleGFtcGxlOlxyXG4gICAgICAgICAgICAgICAgICAgIC8vICAgJC5mYW5jeWJveC5vcGVuKCAnPGRpdj48aDE+SGkhPC9oMT48L2Rpdj4nICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG9iaiA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA6ICdodG1sJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3JjICA6IGl0ZW0gKyAnJ1xyXG4gICAgICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIEVhY2ggZ2FsbGVyeSBvYmplY3QgaGFzIGZ1bGwgY29sbGVjdGlvbiBvZiBvcHRpb25zXHJcbiAgICAgICAgICAgICAgICBvYmoub3B0cyA9ICQuZXh0ZW5kKCB0cnVlLCB7fSwgc2VsZi5vcHRzLCBvcHRzICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gRG8gbm90IG1lcmdlIGJ1dHRvbnMgYXJyYXlcclxuICAgICAgICAgICAgICAgIGlmICggJC5pc0FycmF5KCBvcHRzLmJ1dHRvbnMgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy5idXR0b25zID0gb3B0cy5idXR0b25zO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDIgLSBNYWtlIHN1cmUgd2UgaGF2ZSBjb250ZW50IHR5cGUsIGlmIG5vdCAtIHRyeSB0byBndWVzc1xyXG4gICAgICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgICAgICAgICB0eXBlID0gb2JqLnR5cGUgfHwgb2JqLm9wdHMudHlwZTtcclxuICAgICAgICAgICAgICAgIHNyYyAgPSBvYmouc3JjIHx8ICcnO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggIXR5cGUgJiYgc3JjICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc3JjLm1hdGNoKC8oXmRhdGE6aW1hZ2VcXC9bYS16MC05K1xcLz1dKiwpfChcXC4oanAoZXxnfGVnKXxnaWZ8cG5nfGJtcHx3ZWJwfHN2Z3xpY28pKChcXD98IykuKik/JCkvaSkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnaW1hZ2UnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzcmMubWF0Y2goL1xcLihwZGYpKChcXD98IykuKik/JC9pKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA9ICdwZGYnO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCBzcmMuY2hhckF0KDApID09PSAnIycgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgPSAnaW5saW5lJztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai50eXBlID0gdHlwZTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudHJpZ2dlciggJ29iamVjdE5lZWRzVHlwZScsIG9iaiApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDMgLSBTb21lIGFkanVzdG1lbnRzXHJcbiAgICAgICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICAgICAgb2JqLmluZGV4ID0gc2VsZi5ncm91cC5sZW5ndGg7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgJG9yaWcgYW5kICR0aHVtYiBvYmplY3RzIGV4aXN0XHJcbiAgICAgICAgICAgICAgICBpZiAoIG9iai5vcHRzLiRvcmlnICYmICFvYmoub3B0cy4kb3JpZy5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG9iai5vcHRzLiRvcmlnO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggIW9iai5vcHRzLiR0aHVtYiAmJiBvYmoub3B0cy4kb3JpZyApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy4kdGh1bWIgPSBvYmoub3B0cy4kb3JpZy5maW5kKCAnaW1nOmZpcnN0JyApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggb2JqLm9wdHMuJHRodW1iICYmICFvYmoub3B0cy4kdGh1bWIubGVuZ3RoICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmoub3B0cy4kdGh1bWI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gXCJjYXB0aW9uXCIgaXMgYSBcInNwZWNpYWxcIiBvcHRpb24sIGl0IGNhbiBiZSB1c2VkIHRvIGN1c3RvbWl6ZSBjYXB0aW9uIHBlciBnYWxsZXJ5IGl0ZW0gLi5cclxuICAgICAgICAgICAgICAgIGlmICggJC50eXBlKCBvYmoub3B0cy5jYXB0aW9uICkgPT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLm9wdHMuY2FwdGlvbiA9IG9iai5vcHRzLmNhcHRpb24uYXBwbHkoIGl0ZW0sIFsgc2VsZiwgb2JqIF0gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICQudHlwZSggc2VsZi5vcHRzLmNhcHRpb24gKSA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy5jYXB0aW9uID0gc2VsZi5vcHRzLmNhcHRpb24uYXBwbHkoIGl0ZW0sIFsgc2VsZiwgb2JqIF0gKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgaGF2ZSBjYXB0aW9uIGFzIGEgc3RyaW5nIG9yIGpRdWVyeSBvYmplY3RcclxuICAgICAgICAgICAgICAgIGlmICggISggb2JqLm9wdHMuY2FwdGlvbiBpbnN0YW5jZW9mICQgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy5jYXB0aW9uID0gb2JqLm9wdHMuY2FwdGlvbiA9PT0gdW5kZWZpbmVkID8gJycgOiBvYmoub3B0cy5jYXB0aW9uICsgJyc7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdXJsIGNvbnRhaW5zIFwiZmlsdGVyXCIgdXNlZCB0byBmaWx0ZXIgdGhlIGNvbnRlbnRcclxuICAgICAgICAgICAgICAgIC8vIEV4YW1wbGU6IFwiYWpheC5odG1sICNzb21ldGhpbmdcIlxyXG4gICAgICAgICAgICAgICAgaWYgKCB0eXBlID09PSAnYWpheCcgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3JjUGFydHMgPSBzcmMuc3BsaXQoL1xccysvLCAyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzcmNQYXJ0cy5sZW5ndGggPiAxICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmouc3JjID0gc3JjUGFydHMuc2hpZnQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5vcHRzLmZpbHRlciA9IHNyY1BhcnRzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggb2JqLm9wdHMuc21hbGxCdG4gPT0gJ2F1dG8nICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoICQuaW5BcnJheSggdHlwZSwgWydodG1sJywgJ2lubGluZScsICdhamF4J10gKSA+IC0xICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy50b29sYmFyICA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoub3B0cy5zbWFsbEJ0biA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5vcHRzLnNtYWxsQnRuID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBJZiB0aGUgdHlwZSBpcyBcInBkZlwiLCB0aGVuIHNpbXBseSBsb2FkIGZpbGUgaW50byBpZnJhbWVcclxuICAgICAgICAgICAgICAgIGlmICggdHlwZSA9PT0gJ3BkZicgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnR5cGUgPSAnaWZyYW1lJztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLm9wdHMuaWZyYW1lLnByZWxvYWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBIaWRlIGFsbCBidXR0b25zIGFuZCBkaXNhYmxlIGludGVyYWN0aXZpdHkgZm9yIG1vZGFsIGl0ZW1zXHJcbiAgICAgICAgICAgICAgICBpZiAoIG9iai5vcHRzLm1vZGFsICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBvYmoub3B0cyA9ICQuZXh0ZW5kKHRydWUsIG9iai5vcHRzLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBidXR0b25zXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGluZm9iYXIgOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sYmFyIDogMCxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNtYWxsQnRuIDogMCxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERpc2FibGUga2V5Ym9hcmQgbmF2aWdhdGlvblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXlib2FyZCA6IDAsXHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBEaXNhYmxlIHNvbWUgbW9kdWxlc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZVNob3cgIDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZnVsbFNjcmVlbiA6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRodW1icyAgICAgOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0b3VjaCAgICAgIDogMCxcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERpc2FibGUgY2xpY2sgZXZlbnQgaGFuZGxlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpY2tDb250ZW50ICAgIDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaWNrU2xpZGUgICAgICA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlja091dHNpZGUgICAgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGJsY2xpY2tDb250ZW50IDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRibGNsaWNrU2xpZGUgICA6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBkYmxjbGlja091dHNpZGUgOiBmYWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTdGVwIDQgLSBBZGQgcHJvY2Vzc2VkIG9iamVjdCB0byBncm91cFxyXG4gICAgICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmdyb3VwLnB1c2goIG9iaiApO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBBdHRhY2ggYW4gZXZlbnQgaGFuZGxlciBmdW5jdGlvbnMgZm9yOlxyXG4gICAgICAgIC8vICAgLSBuYXZpZ2F0aW9uIGJ1dHRvbnNcclxuICAgICAgICAvLyAgIC0gYnJvd3NlciBzY3JvbGxpbmcsIHJlc2l6aW5nO1xyXG4gICAgICAgIC8vICAgLSBmb2N1c2luZ1xyXG4gICAgICAgIC8vICAgLSBrZXlib2FyZFxyXG4gICAgICAgIC8vICAgLSBkZXRlY3QgaWRsZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGFkZEV2ZW50cyA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnJlbW92ZUV2ZW50cygpO1xyXG5cclxuICAgICAgICAgICAgLy8gTWFrZSBuYXZpZ2F0aW9uIGVsZW1lbnRzIGNsaWNrYWJsZVxyXG4gICAgICAgICAgICBzZWxmLiRyZWZzLmNvbnRhaW5lci5vbignY2xpY2suZmItY2xvc2UnLCAnW2RhdGEtZmFuY3lib3gtY2xvc2VdJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmNsb3NlKCBlICk7XHJcblxyXG4gICAgICAgICAgICB9KS5vbiggJ2NsaWNrLmZiLXByZXYgdG91Y2hlbmQuZmItcHJldicsICdbZGF0YS1mYW5jeWJveC1wcmV2XScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5wcmV2aW91cygpO1xyXG5cclxuICAgICAgICAgICAgfSkub24oICdjbGljay5mYi1uZXh0IHRvdWNoZW5kLmZiLW5leHQnLCAnW2RhdGEtZmFuY3lib3gtbmV4dF0nLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYubmV4dCgpO1xyXG5cclxuICAgICAgICAgICAgfSkub24oICdjbGljay5mYicsICdbZGF0YS1mYW5jeWJveC16b29tXScsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIC8vIENsaWNrIGhhbmRsZXIgZm9yIHpvb20gYnV0dG9uXHJcbiAgICAgICAgICAgICAgICBzZWxmWyBzZWxmLmlzU2NhbGVkRG93bigpID8gJ3NjYWxlVG9BY3R1YWwnIDogJ3NjYWxlVG9GaXQnIF0oKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gSGFuZGxlIHBhZ2Ugc2Nyb2xsaW5nIGFuZCBicm93c2VyIHJlc2l6aW5nXHJcbiAgICAgICAgICAgICRXLm9uKCdvcmllbnRhdGlvbmNoYW5nZS5mYiByZXNpemUuZmInLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBlICYmIGUub3JpZ2luYWxFdmVudCAmJiBlLm9yaWdpbmFsRXZlbnQudHlwZSA9PT0gXCJyZXNpemVcIiApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVxdWVzdEFGcmFtZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLiRyZWZzLnN0YWdlLmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi4kcmVmcy5zdGFnZS5zaG93KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0sIDYwMCk7XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBUcmFwIGtleWJvYXJkIGZvY3VzIGluc2lkZSBvZiB0aGUgbW9kYWwsIHNvIHRoZSB1c2VyIGRvZXMgbm90IGFjY2lkZW50YWxseSB0YWIgb3V0c2lkZSBvZiB0aGUgbW9kYWxcclxuICAgICAgICAgICAgLy8gKGEuay5hLiBcImVzY2FwaW5nIHRoZSBtb2RhbFwiKVxyXG4gICAgICAgICAgICAkRC5vbignZm9jdXNpbi5mYicsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9ICQuZmFuY3lib3ggPyAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCkgOiBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggaW5zdGFuY2UuaXNDbG9zaW5nIHx8ICFpbnN0YW5jZS5jdXJyZW50IHx8ICFpbnN0YW5jZS5jdXJyZW50Lm9wdHMudHJhcEZvY3VzIHx8ICQoIGUudGFyZ2V0ICkuaGFzQ2xhc3MoICdmYW5jeWJveC1jb250YWluZXInICkgfHwgJCggZS50YXJnZXQgKS5pcyggZG9jdW1lbnQgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBpbnN0YW5jZSAmJiAkKCBlLnRhcmdldCApLmNzcyggJ3Bvc2l0aW9uJyApICE9PSAnZml4ZWQnICYmICFpbnN0YW5jZS4kcmVmcy5jb250YWluZXIuaGFzKCBlLnRhcmdldCApLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpbnN0YW5jZS5mb2N1cygpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBTb21ldGltZXMgcGFnZSBnZXRzIHNjcm9sbGVkLCBzZXQgaXQgYmFja1xyXG4gICAgICAgICAgICAgICAgICAgICRXLnNjcm9sbFRvcCggc2VsZi5zY3JvbGxUb3AgKS5zY3JvbGxMZWZ0KCBzZWxmLnNjcm9sbExlZnQgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gRW5hYmxlIGtleWJvYXJkIG5hdmlnYXRpb25cclxuICAgICAgICAgICAgJEQub24oJ2tleWRvd24uZmInLCBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAga2V5Y29kZSA9IGUua2V5Q29kZSB8fCBlLndoaWNoO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggIWN1cnJlbnQgfHwgIWN1cnJlbnQub3B0cy5rZXlib2FyZCApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCAkKGUudGFyZ2V0KS5pcygnaW5wdXQnKSB8fCAkKGUudGFyZ2V0KS5pcygndGV4dGFyZWEnKSApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gQmFja3NwYWNlIGFuZCBFc2Mga2V5c1xyXG4gICAgICAgICAgICAgICAgaWYgKCBrZXljb2RlID09PSA4IHx8IGtleWNvZGUgPT09IDI3ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jbG9zZSggZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTGVmdCBhcnJvdyBhbmQgVXAgYXJyb3dcclxuICAgICAgICAgICAgICAgIGlmICgga2V5Y29kZSA9PT0gMzcgfHwga2V5Y29kZSA9PT0gMzggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnByZXZpb3VzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSaWdoIGFycm93IGFuZCBEb3duIGFycm93XHJcbiAgICAgICAgICAgICAgICBpZiAoIGtleWNvZGUgPT09IDM5IHx8IGtleWNvZGUgPT09IDQwICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5uZXh0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnRyaWdnZXIoJ2FmdGVyS2V5ZG93bicsIGUsIGtleWNvZGUpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgICAgICAgICAvLyBIaWRlIGNvbnRyb2xzIGFmdGVyIHNvbWUgaW5hY3Rpdml0eSBwZXJpb2RcclxuICAgICAgICAgICAgaWYgKCBzZWxmLmdyb3VwWyBzZWxmLmN1cnJJbmRleCBdLm9wdHMuaWRsZVRpbWUgKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmlkbGVTZWNvbmRzQ291bnRlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgJEQub24oJ21vdXNlbW92ZS5mYi1pZGxlIG1vdXNlbGVhdmUuZmItaWRsZSBtb3VzZWRvd24uZmItaWRsZSB0b3VjaHN0YXJ0LmZiLWlkbGUgdG91Y2htb3ZlLmZiLWlkbGUgc2Nyb2xsLmZiLWlkbGUga2V5ZG93bi5mYi1pZGxlJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzZWxmLmlzSWRsZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93Q29udHJvbHMoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXNJZGxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmlkbGVJbnRlcnZhbCA9IHdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmlkbGVTZWNvbmRzQ291bnRlcisrO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyID49IHNlbGYuZ3JvdXBbIHNlbGYuY3VyckluZGV4IF0ub3B0cy5pZGxlVGltZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pc0lkbGUgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlkbGVTZWNvbmRzQ291bnRlciA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVDb250cm9scygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGV2ZW50cyBhZGRlZCBieSB0aGUgY29yZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgcmVtb3ZlRXZlbnRzIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICRXLm9mZiggJ29yaWVudGF0aW9uY2hhbmdlLmZiIHJlc2l6ZS5mYicgKTtcclxuICAgICAgICAgICAgJEQub2ZmKCAnZm9jdXNpbi5mYiBrZXlkb3duLmZiIC5mYi1pZGxlJyApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kcmVmcy5jb250YWluZXIub2ZmKCAnLmZiLWNsb3NlIC5mYi1wcmV2IC5mYi1uZXh0JyApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzZWxmLmlkbGVJbnRlcnZhbCApIHtcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5jbGVhckludGVydmFsKCBzZWxmLmlkbGVJbnRlcnZhbCApO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYuaWRsZUludGVydmFsID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBDaGFuZ2UgdG8gcHJldmlvdXMgZ2FsbGVyeSBpdGVtXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBwcmV2aW91cyA6IGZ1bmN0aW9uKCBkdXJhdGlvbiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuanVtcFRvKCB0aGlzLmN1cnJQb3MgLSAxLCBkdXJhdGlvbiApO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBDaGFuZ2UgdG8gbmV4dCBnYWxsZXJ5IGl0ZW1cclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgbmV4dCA6IGZ1bmN0aW9uKCBkdXJhdGlvbiApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuanVtcFRvKCB0aGlzLmN1cnJQb3MgKyAxLCBkdXJhdGlvbiApO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBTd2l0Y2ggdG8gc2VsZWN0ZWQgZ2FsbGVyeSBpdGVtXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBqdW1wVG8gOiBmdW5jdGlvbiAoIHBvcywgZHVyYXRpb24sIHNsaWRlICkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICBmaXJzdFJ1bixcclxuICAgICAgICAgICAgICAgIGxvb3AsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgcHJldmlvdXMsXHJcbiAgICAgICAgICAgICAgICBjYW52YXNXaWR0aCxcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRQb3MsXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uUHJvcHM7XHJcblxyXG4gICAgICAgICAgICB2YXIgZ3JvdXBMZW4gPSBzZWxmLmdyb3VwLmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIGlmICggc2VsZi5pc1NsaWRpbmcgfHwgc2VsZi5pc0Nsb3NpbmcgfHwgKCBzZWxmLmlzQW5pbWF0aW5nICYmIHNlbGYuZmlyc3RSdW4gKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcG9zICA9IHBhcnNlSW50KCBwb3MsIDEwICk7XHJcbiAgICAgICAgICAgIGxvb3AgPSBzZWxmLmN1cnJlbnQgPyBzZWxmLmN1cnJlbnQub3B0cy5sb29wIDogc2VsZi5vcHRzLmxvb3A7XHJcblxyXG4gICAgICAgICAgICBpZiAoICFsb29wICYmICggcG9zIDwgMCB8fCBwb3MgPj0gZ3JvdXBMZW4gKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZmlyc3RSdW4gPSBzZWxmLmZpcnN0UnVuID0gKCBzZWxmLmZpcnN0UnVuID09PSBudWxsICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGdyb3VwTGVuIDwgMiAmJiAhZmlyc3RSdW4gJiYgISFzZWxmLmlzU2xpZGluZyApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcHJldmlvdXMgPSBzZWxmLmN1cnJlbnQ7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnByZXZJbmRleCA9IHNlbGYuY3VyckluZGV4O1xyXG4gICAgICAgICAgICBzZWxmLnByZXZQb3MgICA9IHNlbGYuY3VyclBvcztcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBzbGlkZXNcclxuICAgICAgICAgICAgY3VycmVudCA9IHNlbGYuY3JlYXRlU2xpZGUoIHBvcyApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBncm91cExlbiA+IDEgKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIGxvb3AgfHwgY3VycmVudC5pbmRleCA+IDAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jcmVhdGVTbGlkZSggcG9zIC0gMSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggbG9vcCB8fCBjdXJyZW50LmluZGV4IDwgZ3JvdXBMZW4gLSAxICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuY3JlYXRlU2xpZGUoIHBvcyArIDEgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2VsZi5jdXJyZW50ICAgPSBjdXJyZW50O1xyXG4gICAgICAgICAgICBzZWxmLmN1cnJJbmRleCA9IGN1cnJlbnQuaW5kZXg7XHJcbiAgICAgICAgICAgIHNlbGYuY3VyclBvcyAgID0gY3VycmVudC5wb3M7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoICdiZWZvcmVTaG93JywgZmlyc3RSdW4gKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlQ29udHJvbHMoKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnRQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZSggY3VycmVudC4kc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnQuaXNNb3ZlZCAgICAgICAgPSAoIGN1cnJlbnRQb3MubGVmdCAhPT0gMCB8fCBjdXJyZW50UG9zLnRvcCAhPT0gMCApICYmICFjdXJyZW50LiRzbGlkZS5oYXNDbGFzcyggJ2ZhbmN5Ym94LWFuaW1hdGVkJyApO1xyXG4gICAgICAgICAgICBjdXJyZW50LmZvcmNlZER1cmF0aW9uID0gdW5kZWZpbmVkO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkLmlzTnVtZXJpYyggZHVyYXRpb24gKSApIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnQuZm9yY2VkRHVyYXRpb24gPSBkdXJhdGlvbjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uID0gY3VycmVudC5vcHRzWyBmaXJzdFJ1biA/ICdhbmltYXRpb25EdXJhdGlvbicgOiAndHJhbnNpdGlvbkR1cmF0aW9uJyBdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHBhcnNlSW50KCBkdXJhdGlvbiwgMTAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEZyZXNoIHN0YXJ0IC0gcmV2ZWFsIGNvbnRhaW5lciwgY3VycmVudCBzbGlkZSBhbmQgc3RhcnQgbG9hZGluZyBjb250ZW50XHJcbiAgICAgICAgICAgIGlmICggZmlyc3RSdW4gKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBjdXJyZW50Lm9wdHMuYW5pbWF0aW9uRWZmZWN0ICYmIGR1cmF0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyLmNzcyggJ3RyYW5zaXRpb24tZHVyYXRpb24nLCBkdXJhdGlvbiArICdtcycgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLiRyZWZzLmNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWlzLWhpZGRlbicgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBmb3JjZVJlZHJhdyggc2VsZi4kcmVmcy5jb250YWluZXIgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLiRyZWZzLmNvbnRhaW5lci5hZGRDbGFzcyggJ2ZhbmN5Ym94LWlzLW9wZW4nICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBmaXJzdCBzbGlkZSB2aXNpYmxlICh0byBkaXNwbGF5IGxvYWRpbmcgaWNvbiwgaWYgbmVlZGVkKVxyXG4gICAgICAgICAgICAgICAgY3VycmVudC4kc2xpZGUuYWRkQ2xhc3MoICdmYW5jeWJveC1zbGlkZS0tY3VycmVudCcgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLmxvYWRTbGlkZSggY3VycmVudCApO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYucHJlbG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2xlYW4gdXBcclxuICAgICAgICAgICAgJC5lYWNoKHNlbGYuc2xpZGVzLCBmdW5jdGlvbiggaW5kZXgsIHNsaWRlICkge1xyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5zdG9wKCBzbGlkZS4kc2xpZGUgKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIGN1cnJlbnQgdGhhdCBzbGlkZSBpcyB2aXNpYmxlIGV2ZW4gaWYgY29udGVudCBpcyBzdGlsbCBsb2FkaW5nXHJcbiAgICAgICAgICAgIGN1cnJlbnQuJHNsaWRlLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtc2xpZGUtLW5leHQgZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzJyApLmFkZENsYXNzKCAnZmFuY3lib3gtc2xpZGUtLWN1cnJlbnQnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBzbGlkZXMgaGF2ZSBiZWVuIGRyYWdnZWQsIGFuaW1hdGUgdGhlbSB0byBjb3JyZWN0IHBvc2l0aW9uXHJcbiAgICAgICAgICAgIGlmICggY3VycmVudC5pc01vdmVkICkge1xyXG4gICAgICAgICAgICAgICAgY2FudmFzV2lkdGggPSBNYXRoLnJvdW5kKCBjdXJyZW50LiRzbGlkZS53aWR0aCgpICk7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKHNlbGYuc2xpZGVzLCBmdW5jdGlvbiggaW5kZXgsIHNsaWRlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBwb3MgPSBzbGlkZS5wb3MgLSBjdXJyZW50LnBvcztcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKCBzbGlkZS4kc2xpZGUsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG9wICA6IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQgOiAoIHBvcyAqIGNhbnZhc1dpZHRoICkgKyAoIHBvcyAqIHNsaWRlLm9wdHMuZ3V0dGVyIClcclxuICAgICAgICAgICAgICAgICAgICB9LCBkdXJhdGlvbiwgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS4kc2xpZGUucmVtb3ZlQXR0cignc3R5bGUnKS5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LXNsaWRlLS1uZXh0IGZhbmN5Ym94LXNsaWRlLS1wcmV2aW91cycgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggc2xpZGUucG9zID09PSBzZWxmLmN1cnJQb3MgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50LmlzTW92ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuJHJlZnMuc3RhZ2UuY2hpbGRyZW4oKS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFN0YXJ0IHRyYW5zaXRpb24gdGhhdCByZXZlYWxzIGN1cnJlbnQgY29udGVudFxyXG4gICAgICAgICAgICAvLyBvciB3YWl0IHdoZW4gaXQgd2lsbCBiZSBsb2FkZWRcclxuXHJcbiAgICAgICAgICAgIGlmICggY3VycmVudC5pc0xvYWRlZCApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYucmV2ZWFsQ29udGVudCggY3VycmVudCApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubG9hZFNsaWRlKCBjdXJyZW50ICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYucHJlbG9hZCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBwcmV2aW91cy5wb3MgPT09IGN1cnJlbnQucG9zICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBIYW5kbGUgcHJldmlvdXMgc2xpZGVcclxuICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICB0cmFuc2l0aW9uUHJvcHMgPSAnZmFuY3lib3gtc2xpZGUtLScgKyAoIHByZXZpb3VzLnBvcyA+IGN1cnJlbnQucG9zID8gJ25leHQnIDogJ3ByZXZpb3VzJyApO1xyXG5cclxuICAgICAgICAgICAgcHJldmlvdXMuJHNsaWRlLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtc2xpZGUtLWNvbXBsZXRlIGZhbmN5Ym94LXNsaWRlLS1jdXJyZW50IGZhbmN5Ym94LXNsaWRlLS1uZXh0IGZhbmN5Ym94LXNsaWRlLS1wcmV2aW91cycgKTtcclxuXHJcbiAgICAgICAgICAgIHByZXZpb3VzLmlzQ29tcGxldGUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggIWR1cmF0aW9uIHx8ICggIWN1cnJlbnQuaXNNb3ZlZCAmJiAhY3VycmVudC5vcHRzLnRyYW5zaXRpb25FZmZlY3QgKSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBjdXJyZW50LmlzTW92ZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2aW91cy4kc2xpZGUuYWRkQ2xhc3MoIHRyYW5zaXRpb25Qcm9wcyApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uUHJvcHMgPSAnZmFuY3lib3gtYW5pbWF0ZWQgJyArIHRyYW5zaXRpb25Qcm9wcyArICcgZmFuY3lib3gtZngtJyArIGN1cnJlbnQub3B0cy50cmFuc2l0aW9uRWZmZWN0O1xyXG5cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guYW5pbWF0ZSggcHJldmlvdXMuJHNsaWRlLCB0cmFuc2l0aW9uUHJvcHMsIGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcmV2aW91cy4kc2xpZGUucmVtb3ZlQ2xhc3MoIHRyYW5zaXRpb25Qcm9wcyApLnJlbW92ZUF0dHIoICdzdHlsZScgKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIG5ldyBcInNsaWRlXCIgZWxlbWVudFxyXG4gICAgICAgIC8vIFRoZXNlIGFyZSBnYWxsZXJ5IGl0ZW1zICB0aGF0IGFyZSBhY3R1YWxseSBhZGRlZCB0byBET01cclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGNyZWF0ZVNsaWRlIDogZnVuY3Rpb24oIHBvcyApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyICRzbGlkZTtcclxuICAgICAgICAgICAgdmFyIGluZGV4O1xyXG5cclxuICAgICAgICAgICAgaW5kZXggPSBwb3MgJSBzZWxmLmdyb3VwLmxlbmd0aDtcclxuICAgICAgICAgICAgaW5kZXggPSBpbmRleCA8IDAgPyBzZWxmLmdyb3VwLmxlbmd0aCArIGluZGV4IDogaW5kZXg7XHJcblxyXG4gICAgICAgICAgICBpZiAoICFzZWxmLnNsaWRlc1sgcG9zIF0gJiYgc2VsZi5ncm91cFsgaW5kZXggXSApIHtcclxuICAgICAgICAgICAgICAgICRzbGlkZSA9ICQoJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1zbGlkZVwiPjwvZGl2PicpLmFwcGVuZFRvKCBzZWxmLiRyZWZzLnN0YWdlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5zbGlkZXNbIHBvcyBdID0gJC5leHRlbmQoIHRydWUsIHt9LCBzZWxmLmdyb3VwWyBpbmRleCBdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zICAgICAgOiBwb3MsXHJcbiAgICAgICAgICAgICAgICAgICAgJHNsaWRlICAgOiAkc2xpZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgaXNMb2FkZWQgOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlU2xpZGUoIHNlbGYuc2xpZGVzWyBwb3MgXSApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gc2VsZi5zbGlkZXNbIHBvcyBdO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBTY2FsZSBpbWFnZSB0byB0aGUgYWN0dWFsIHNpemUgb2YgdGhlIGltYWdlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBzY2FsZVRvQWN0dWFsIDogZnVuY3Rpb24oIHgsIHksIGR1cmF0aW9uICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIHZhciAkd2hhdCAgID0gY3VycmVudC4kY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIHZhciBpbWdQb3MsIHBvc1gsIHBvc1ksIHNjYWxlWCwgc2NhbGVZO1xyXG5cclxuICAgICAgICAgICAgdmFyIGNhbnZhc1dpZHRoICA9IHBhcnNlSW50KCBjdXJyZW50LiRzbGlkZS53aWR0aCgpLCAxMCApO1xyXG4gICAgICAgICAgICB2YXIgY2FudmFzSGVpZ2h0ID0gcGFyc2VJbnQoIGN1cnJlbnQuJHNsaWRlLmhlaWdodCgpLCAxMCApO1xyXG5cclxuICAgICAgICAgICAgdmFyIG5ld0ltZ1dpZHRoICA9IGN1cnJlbnQud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBuZXdJbWdIZWlnaHQgPSBjdXJyZW50LmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIGlmICggISggY3VycmVudC50eXBlID09ICdpbWFnZScgJiYgIWN1cnJlbnQuaGFzRXJyb3IpIHx8ICEkd2hhdCB8fCBzZWxmLmlzQW5pbWF0aW5nICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LnN0b3AoICR3aGF0ICk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmlzQW5pbWF0aW5nID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHggPSB4ID09PSB1bmRlZmluZWQgPyBjYW52YXNXaWR0aCAgKiAwLjUgIDogeDtcclxuICAgICAgICAgICAgeSA9IHkgPT09IHVuZGVmaW5lZCA/IGNhbnZhc0hlaWdodCAqIDAuNSAgOiB5O1xyXG5cclxuICAgICAgICAgICAgaW1nUG9zID0gJC5mYW5jeWJveC5nZXRUcmFuc2xhdGUoICR3aGF0ICk7XHJcblxyXG4gICAgICAgICAgICBzY2FsZVggID0gbmV3SW1nV2lkdGggIC8gaW1nUG9zLndpZHRoO1xyXG4gICAgICAgICAgICBzY2FsZVkgID0gbmV3SW1nSGVpZ2h0IC8gaW1nUG9zLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgIC8vIEdldCBjZW50ZXIgcG9zaXRpb24gZm9yIG9yaWdpbmFsIGltYWdlXHJcbiAgICAgICAgICAgIHBvc1ggPSAoIGNhbnZhc1dpZHRoICogMC41ICAtIG5ld0ltZ1dpZHRoICogMC41ICk7XHJcbiAgICAgICAgICAgIHBvc1kgPSAoIGNhbnZhc0hlaWdodCAqIDAuNSAtIG5ld0ltZ0hlaWdodCAqIDAuNSApO1xyXG5cclxuICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGltYWdlIGRvZXMgbm90IG1vdmUgYXdheSBmcm9tIGVkZ2VzXHJcbiAgICAgICAgICAgIGlmICggbmV3SW1nV2lkdGggPiBjYW52YXNXaWR0aCApIHtcclxuICAgICAgICAgICAgICAgIHBvc1ggPSBpbWdQb3MubGVmdCAqIHNjYWxlWCAtICggKCB4ICogc2NhbGVYICkgLSB4ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBwb3NYID4gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHBvc1ggPCAgY2FudmFzV2lkdGggLSBuZXdJbWdXaWR0aCApIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NYID0gY2FudmFzV2lkdGggLSBuZXdJbWdXaWR0aDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBuZXdJbWdIZWlnaHQgPiBjYW52YXNIZWlnaHQpIHtcclxuICAgICAgICAgICAgICAgIHBvc1kgPSBpbWdQb3MudG9wICAqIHNjYWxlWSAtICggKCB5ICogc2NhbGVZICkgLSB5ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBwb3NZID4gMCApIHtcclxuICAgICAgICAgICAgICAgICAgICBwb3NZID0gMDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHBvc1kgPCAgY2FudmFzSGVpZ2h0IC0gbmV3SW1nSGVpZ2h0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc1kgPSBjYW52YXNIZWlnaHQgLSBuZXdJbWdIZWlnaHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlQ3Vyc29yKCBuZXdJbWdXaWR0aCwgbmV3SW1nSGVpZ2h0ICk7XHJcblxyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoICR3aGF0LCB7XHJcbiAgICAgICAgICAgICAgICB0b3AgICAgOiBwb3NZLFxyXG4gICAgICAgICAgICAgICAgbGVmdCAgIDogcG9zWCxcclxuICAgICAgICAgICAgICAgIHNjYWxlWCA6IHNjYWxlWCxcclxuICAgICAgICAgICAgICAgIHNjYWxlWSA6IHNjYWxlWVxyXG4gICAgICAgICAgICB9LCBkdXJhdGlvbiB8fCAzMzAsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIFN0b3Agc2xpZGVzaG93XHJcbiAgICAgICAgICAgIGlmICggc2VsZi5TbGlkZVNob3cgJiYgc2VsZi5TbGlkZVNob3cuaXNBY3RpdmUgKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLlNsaWRlU2hvdy5zdG9wKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gU2NhbGUgaW1hZ2UgdG8gZml0IGluc2lkZSBwYXJlbnQgZWxlbWVudFxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgc2NhbGVUb0ZpdCA6IGZ1bmN0aW9uKCBkdXJhdGlvbiApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gc2VsZi5jdXJyZW50O1xyXG4gICAgICAgICAgICB2YXIgJHdoYXQgICA9IGN1cnJlbnQuJGNvbnRlbnQ7XHJcbiAgICAgICAgICAgIHZhciBlbmQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoICEoIGN1cnJlbnQudHlwZSA9PSAnaW1hZ2UnICYmICFjdXJyZW50Lmhhc0Vycm9yKSB8fCAhJHdoYXQgfHwgc2VsZi5pc0FuaW1hdGluZyApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5mYW5jeWJveC5zdG9wKCAkd2hhdCApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBlbmQgPSBzZWxmLmdldEZpdFBvcyggY3VycmVudCApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi51cGRhdGVDdXJzb3IoIGVuZC53aWR0aCwgZW5kLmhlaWdodCApO1xyXG5cclxuICAgICAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKCAkd2hhdCwge1xyXG4gICAgICAgICAgICAgICAgdG9wICAgIDogZW5kLnRvcCxcclxuICAgICAgICAgICAgICAgIGxlZnQgICA6IGVuZC5sZWZ0LFxyXG4gICAgICAgICAgICAgICAgc2NhbGVYIDogZW5kLndpZHRoICAvICR3aGF0LndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICBzY2FsZVkgOiBlbmQuaGVpZ2h0IC8gJHdoYXQuaGVpZ2h0KClcclxuICAgICAgICAgICAgfSwgZHVyYXRpb24gfHwgMzMwLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaXNBbmltYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIENhbGN1bGF0ZSBpbWFnZSBzaXplIHRvIGZpdCBpbnNpZGUgdmlld3BvcnRcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGdldEZpdFBvcyA6IGZ1bmN0aW9uKCBzbGlkZSApIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgID0gdGhpcztcclxuICAgICAgICAgICAgdmFyICR3aGF0ID0gc2xpZGUuJGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgaW1nV2lkdGggID0gc2xpZGUud2lkdGg7XHJcbiAgICAgICAgICAgIHZhciBpbWdIZWlnaHQgPSBzbGlkZS5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgbWFyZ2luID0gc2xpZGUub3B0cy5tYXJnaW47XHJcblxyXG4gICAgICAgICAgICB2YXIgY2FudmFzV2lkdGgsIGNhbnZhc0hlaWdodCwgbWluUmF0aW8sIHdpZHRoLCBoZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoICEkd2hhdCB8fCAhJHdoYXQubGVuZ3RoIHx8ICggIWltZ1dpZHRoICYmICFpbWdIZWlnaHQpICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBDb252ZXJ0IFwibWFyZ2luIHRvIENTUyBzdHlsZTogWyB0b3AsIHJpZ2h0LCBib3R0b20sIGxlZnQgXVxyXG4gICAgICAgICAgICBpZiAoICQudHlwZSggbWFyZ2luICkgPT09IFwibnVtYmVyXCIgKSB7XHJcbiAgICAgICAgICAgICAgICBtYXJnaW4gPSBbIG1hcmdpbiwgbWFyZ2luIF07XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggbWFyZ2luLmxlbmd0aCA9PSAyICkge1xyXG4gICAgICAgICAgICAgICAgbWFyZ2luID0gWyBtYXJnaW5bMF0sIG1hcmdpblsxXSwgbWFyZ2luWzBdLCBtYXJnaW5bMV0gXTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gV2UgY2FuIG5vdCB1c2UgJHNsaWRlIHdpZHRoIGhlcmUsIGJlY2F1c2UgaXQgY2FuIGhhdmUgZGlmZmVyZW50IGRpZW1lbnNpb25zIHdoaWxlIGluIHRyYW5zaXRvblxyXG4gICAgICAgICAgICBjYW52YXNXaWR0aCAgPSBwYXJzZUludCggc2VsZi4kcmVmcy5zdGFnZS53aWR0aCgpLCAxMCApICAtICggbWFyZ2luWyAxIF0gKyBtYXJnaW5bIDMgXSApO1xyXG4gICAgICAgICAgICBjYW52YXNIZWlnaHQgPSBwYXJzZUludCggc2VsZi4kcmVmcy5zdGFnZS5oZWlnaHQoKSwgMTAgKSAtICggbWFyZ2luWyAwIF0gKyBtYXJnaW5bIDIgXSApO1xyXG5cclxuICAgICAgICAgICAgbWluUmF0aW8gPSBNYXRoLm1pbigxLCBjYW52YXNXaWR0aCAvIGltZ1dpZHRoLCBjYW52YXNIZWlnaHQgLyBpbWdIZWlnaHQgKTtcclxuXHJcbiAgICAgICAgICAgIHdpZHRoICA9IE1hdGguZmxvb3IoIG1pblJhdGlvICogaW1nV2lkdGggKTtcclxuICAgICAgICAgICAgaGVpZ2h0ID0gTWF0aC5mbG9vciggbWluUmF0aW8gKiBpbWdIZWlnaHQgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFVzZSBmbG9vciByb3VuZGluZyB0byBtYWtlIHN1cmUgaXQgcmVhbGx5IGZpdHNcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHRvcCAgICA6IE1hdGguZmxvb3IoICggY2FudmFzSGVpZ2h0IC0gaGVpZ2h0ICkgKiAwLjUgKSArIG1hcmdpblsgMCBdLFxyXG4gICAgICAgICAgICAgICAgbGVmdCAgIDogTWF0aC5mbG9vciggKCBjYW52YXNXaWR0aCAgLSB3aWR0aCApICAqIDAuNSApICsgbWFyZ2luWyAzIF0sXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAgOiB3aWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodCA6IGhlaWdodFxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gVXBkYXRlIHBvc2l0aW9uIGFuZCBjb250ZW50IG9mIGFsbCBzbGlkZXNcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICB1cGRhdGUgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgICQuZWFjaCggc2VsZi5zbGlkZXMsIGZ1bmN0aW9uKCBrZXksIHNsaWRlICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVTbGlkZSggc2xpZGUgKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBVcGRhdGUgc2xpZGUgcG9zaXRpb24gYW5kIHNjYWxlIGNvbnRlbnQgdG8gZml0XHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICB1cGRhdGVTbGlkZSA6IGZ1bmN0aW9uKCBzbGlkZSApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmICA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciAkd2hhdCA9IHNsaWRlLiRjb250ZW50O1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkd2hhdCAmJiAoIHNsaWRlLndpZHRoIHx8IHNsaWRlLmhlaWdodCApICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5pc0FuaW1hdGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LnN0b3AoICR3aGF0ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoICR3aGF0LCBzZWxmLmdldEZpdFBvcyggc2xpZGUgKSApO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggc2xpZGUucG9zID09PSBzZWxmLmN1cnJQb3MgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDdXJzb3IoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2xpZGUuJHNsaWRlLnRyaWdnZXIoICdyZWZyZXNoJyApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi50cmlnZ2VyKCAnb25VcGRhdGUnLCBzbGlkZSApO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBVcGRhdGUgY3Vyc29yIHN0eWxlIGRlcGVuZGluZyBpZiBjb250ZW50IGNhbiBiZSB6b29tZWRcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgdXBkYXRlQ3Vyc29yIDogZnVuY3Rpb24oIG5leHRXaWR0aCwgbmV4dEhlaWdodCApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIGlzU2NhbGVkRG93bjtcclxuXHJcbiAgICAgICAgICAgIHZhciAkY29udGFpbmVyID0gc2VsZi4kcmVmcy5jb250YWluZXIucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1pcy16b29tYWJsZSBmYW5jeWJveC1jYW4tem9vbUluIGZhbmN5Ym94LWNhbi1kcmFnIGZhbmN5Ym94LWNhbi16b29tT3V0JyApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAhc2VsZi5jdXJyZW50IHx8IHNlbGYuaXNDbG9zaW5nICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNlbGYuaXNab29tYWJsZSgpICkge1xyXG5cclxuICAgICAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoICdmYW5jeWJveC1pcy16b29tYWJsZScgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIG5leHRXaWR0aCAhPT0gdW5kZWZpbmVkICYmIG5leHRIZWlnaHQgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICBpc1NjYWxlZERvd24gPSBuZXh0V2lkdGggPCBzZWxmLmN1cnJlbnQud2lkdGggJiYgbmV4dEhlaWdodCA8IHNlbGYuY3VycmVudC5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpc1NjYWxlZERvd24gPSBzZWxmLmlzU2NhbGVkRG93bigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggaXNTY2FsZWREb3duICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbWFnZSBpcyBzY2FsZWQgZG93biwgdGhlbiwgb2J2aW91c2x5LCBpdCBjYW4gYmUgem9vbWVkIHRvIGZ1bGwgc2l6ZVxyXG4gICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoICdmYW5jeWJveC1jYW4tem9vbUluJyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc2VsZi5jdXJyZW50Lm9wdHMudG91Y2ggKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJZiBpbWFnZSBzaXplIGlyIGxhcmdlbiB0aGFuIGF2YWlsYWJsZSBhdmFpbGFibGUgYW5kIHRvdWNoIG1vZHVsZSBpcyBub3QgZGlzYWJsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdGhlbiB1c2VyIGNhbiBkbyBwYW5uaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoICdmYW5jeWJveC1jYW4tZHJhZycgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcyggJ2ZhbmN5Ym94LWNhbi16b29tT3V0JyApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCBzZWxmLmN1cnJlbnQub3B0cy50b3VjaCApIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoICdmYW5jeWJveC1jYW4tZHJhZycgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgY3VycmVudCBzbGlkZSBpcyB6b29tYWJsZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgaXNab29tYWJsZSA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIHZhciBmaXRQb3M7XHJcblxyXG4gICAgICAgICAgICBpZiAoICFjdXJyZW50IHx8IHNlbGYuaXNDbG9zaW5nICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBBc3N1bWUgdGhhdCBzbGlkZSBpcyB6b29tYWJsZSBpZlxyXG4gICAgICAgICAgICAvLyAgIC0gaW1hZ2UgaXMgbG9hZGVkIHN1Y2Nlc3NmdWx5XHJcbiAgICAgICAgICAgIC8vICAgLSBjbGljayBhY3Rpb24gaXMgXCJ6b29tXCJcclxuICAgICAgICAgICAgLy8gICAtIGFjdHVhbCBzaXplIG9mIHRoZSBpbWFnZSBpcyBzbWFsbGVyIHRoYW4gYXZhaWxhYmxlIGFyZWFcclxuICAgICAgICAgICAgaWYgKCBjdXJyZW50LnR5cGUgPT09ICdpbWFnZScgJiYgY3VycmVudC5pc0xvYWRlZCAmJiAhY3VycmVudC5oYXNFcnJvciAmJlxyXG4gICAgICAgICAgICAgICAgKCBjdXJyZW50Lm9wdHMuY2xpY2tDb250ZW50ID09PSAnem9vbScgfHwgKCAkLmlzRnVuY3Rpb24oIGN1cnJlbnQub3B0cy5jbGlja0NvbnRlbnQgKSAmJiBjdXJyZW50Lm9wdHMuY2xpY2tDb250ZW50KCBjdXJyZW50ICkgPT09ICBcInpvb21cIiApIClcclxuICAgICAgICAgICAgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgZml0UG9zID0gc2VsZi5nZXRGaXRQb3MoIGN1cnJlbnQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIGN1cnJlbnQud2lkdGggPiBmaXRQb3Mud2lkdGggfHwgY3VycmVudC5oZWlnaHQgPiBmaXRQb3MuaGVpZ2h0ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgY3VycmVudCBpbWFnZSBkaW1lbnNpb25zIGFyZSBzbWFsbGVyIHRoYW4gYWN0dWFsXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGlzU2NhbGVkRG93biA6IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgPSBzZWxmLmN1cnJlbnQ7XHJcbiAgICAgICAgICAgIHZhciAkd2hhdCAgID0gY3VycmVudC4kY29udGVudDtcclxuXHJcbiAgICAgICAgICAgIHZhciByZXogPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICggJHdoYXQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXogPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZSggJHdoYXQgKTtcclxuICAgICAgICAgICAgICAgIHJleiA9IHJlei53aWR0aCA8IGN1cnJlbnQud2lkdGggfHwgcmV6LmhlaWdodCA8IGN1cnJlbnQuaGVpZ2h0O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV6O1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgaW1hZ2UgZGltZW5zaW9ucyBleGNlZWQgcGFyZW50IGVsZW1lbnRcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBjYW5QYW4gOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHZhciBjdXJyZW50ID0gc2VsZi5jdXJyZW50O1xyXG4gICAgICAgICAgICB2YXIgJHdoYXQgICA9IGN1cnJlbnQuJGNvbnRlbnQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgcmV6ID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoICR3aGF0ICkge1xyXG4gICAgICAgICAgICAgICAgcmV6ID0gc2VsZi5nZXRGaXRQb3MoIGN1cnJlbnQgKTtcclxuICAgICAgICAgICAgICAgIHJleiA9IE1hdGguYWJzKCAkd2hhdC53aWR0aCgpIC0gcmV6LndpZHRoICkgPiAxICB8fCBNYXRoLmFicyggJHdoYXQuaGVpZ2h0KCkgLSByZXouaGVpZ2h0ICkgPiAxO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlejtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIExvYWQgY29udGVudCBpbnRvIHRoZSBzbGlkZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBsb2FkU2xpZGUgOiBmdW5jdGlvbiggc2xpZGUgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXMsIHR5cGUsICRzbGlkZTtcclxuICAgICAgICAgICAgdmFyIGFqYXhMb2FkO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzbGlkZS5pc0xvYWRpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggc2xpZGUuaXNMb2FkZWQgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNsaWRlLmlzTG9hZGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoICdiZWZvcmVMb2FkJywgc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgIHR5cGUgICA9IHNsaWRlLnR5cGU7XHJcbiAgICAgICAgICAgICRzbGlkZSA9IHNsaWRlLiRzbGlkZTtcclxuXHJcbiAgICAgICAgICAgICRzbGlkZVxyXG4gICAgICAgICAgICAgICAgLm9mZiggJ3JlZnJlc2gnIClcclxuICAgICAgICAgICAgICAgIC50cmlnZ2VyKCAnb25SZXNldCcgKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnZmFuY3lib3gtc2xpZGUtLScgKyAoIHR5cGUgfHwgJ3Vua25vd24nICkgKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCBzbGlkZS5vcHRzLnNsaWRlQ2xhc3MgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENyZWF0ZSBjb250ZW50IGRlcGVuZGluZyBvbiB0aGUgdHlwZVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoICggdHlwZSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlICdpbWFnZSc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0SW1hZ2UoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnaWZyYW1lJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRJZnJhbWUoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnaHRtbCc6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0Q29udGVudCggc2xpZGUsIHNsaWRlLnNyYyB8fCBzbGlkZS5jb250ZW50ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAnaW5saW5lJzpcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAkKCBzbGlkZS5zcmMgKS5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0Q29udGVudCggc2xpZGUsICQoIHNsaWRlLnNyYyApICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0RXJyb3IoIHNsaWRlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgJ2FqYXgnOlxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNob3dMb2FkaW5nKCBzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBhamF4TG9hZCA9ICQuYWpheCggJC5leHRlbmQoIHt9LCBzbGlkZS5vcHRzLmFqYXguc2V0dGluZ3MsIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsIDogc2xpZGUuc3JjLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzIDogZnVuY3Rpb24gKCBkYXRhLCB0ZXh0U3RhdHVzICkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdGV4dFN0YXR1cyA9PT0gJ3N1Y2Nlc3MnICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0Q29udGVudCggc2xpZGUsIGRhdGEgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yIDogZnVuY3Rpb24gKCBqcVhIUiwgdGV4dFN0YXR1cyApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGpxWEhSICYmIHRleHRTdGF0dXMgIT09ICdhYm9ydCcgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRFcnJvciggc2xpZGUgKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzbGlkZS5vbmUoICdvblJlc2V0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhamF4TG9hZC5hYm9ydCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0RXJyb3IoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIFVzZSB0aHVtYm5haWwgaW1hZ2UsIGlmIHBvc3NpYmxlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgc2V0SW1hZ2UgOiBmdW5jdGlvbiggc2xpZGUgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsZiAgID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHNyY3NldCA9IHNsaWRlLm9wdHMuc3Jjc2V0IHx8IHNsaWRlLm9wdHMuaW1hZ2Uuc3Jjc2V0O1xyXG5cclxuICAgICAgICAgICAgdmFyIGZvdW5kLCB0ZW1wLCBweFJhdGlvLCB3aW5kb3dXaWR0aDtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgXCJzcmNzZXRcIiwgdGhlbiB3ZSBuZWVkIHRvIGZpbmQgbWF0Y2hpbmcgXCJzcmNcIiB2YWx1ZS5cclxuICAgICAgICAgICAgLy8gVGhpcyBpcyBuZWNlc3NhcnksIGJlY2F1c2Ugd2hlbiB5b3Ugc2V0IGFuIHNyYyBhdHRyaWJ1dGUsIHRoZSBicm93c2VyIHdpbGwgcHJlbG9hZCB0aGUgaW1hZ2VcclxuICAgICAgICAgICAgLy8gYmVmb3JlIGFueSBqYXZhc2NyaXB0IG9yIGV2ZW4gQ1NTIGlzIGFwcGxpZWQuXHJcbiAgICAgICAgICAgIGlmICggc3Jjc2V0ICkge1xyXG4gICAgICAgICAgICAgICAgcHhSYXRpbyAgICAgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyB8fCAxO1xyXG4gICAgICAgICAgICAgICAgd2luZG93V2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aCAgKiBweFJhdGlvO1xyXG5cclxuICAgICAgICAgICAgICAgIHRlbXAgPSBzcmNzZXQuc3BsaXQoJywnKS5tYXAoZnVuY3Rpb24gKCBlbCApIHtcclxuICAgICAgICAgICAgXHRcdHZhciByZXQgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIFx0XHRlbC50cmltKCkuc3BsaXQoL1xccysvKS5mb3JFYWNoKGZ1bmN0aW9uICggZWwsIGkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlSW50KCBlbC5zdWJzdHJpbmcoMCwgZWwubGVuZ3RoIC0gMSksIDEwICk7XHJcblxyXG4gICAgICAgICAgICBcdFx0XHRpZiAoIGkgPT09IDAgKSB7XHJcbiAgICAgICAgICAgIFx0XHRcdFx0cmV0dXJuICggcmV0LnVybCA9IGVsICk7XHJcbiAgICAgICAgICAgIFx0XHRcdH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggdmFsdWUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXQudmFsdWUgICA9IHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0LnBvc3RmaXggPSBlbFsgZWwubGVuZ3RoIC0gMSBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBcdFx0fSk7XHJcblxyXG4gICAgICAgICAgICBcdFx0cmV0dXJuIHJldDtcclxuICAgICAgICAgICAgXHR9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTb3J0IGJ5IHZhbHVlXHJcbiAgICAgICAgICAgICAgICB0ZW1wLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgLSBiLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gT2ssIG5vdyB3ZSBoYXZlIGFuIGFycmF5IG9mIGFsbCBzcmNzZXQgdmFsdWVzXHJcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCB0ZW1wLmxlbmd0aDsgaisrICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHRlbXBbIGogXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAoIGVsLnBvc3RmaXggPT09ICd3JyAmJiBlbC52YWx1ZSA+PSB3aW5kb3dXaWR0aCApIHx8ICggZWwucG9zdGZpeCA9PT0gJ3gnICYmIGVsLnZhbHVlID49IHB4UmF0aW8gKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm91bmQgPSBlbDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIG5vdCBmb3VuZCwgdGFrZSB0aGUgbGFzdCBvbmVcclxuICAgICAgICAgICAgICAgIGlmICggIWZvdW5kICYmIHRlbXAubGVuZ3RoICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvdW5kID0gdGVtcFsgdGVtcC5sZW5ndGggLSAxIF07XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBmb3VuZCApIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZS5zcmMgPSBmb3VuZC51cmw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgZGVmYXVsdCB3aWR0aC9oZWlnaHQgdmFsdWVzLCB3ZSBjYW4gY2FsY3VsYXRlIGhlaWdodCBmb3IgbWF0Y2hpbmcgc291cmNlXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzbGlkZS53aWR0aCAmJiBzbGlkZS5oZWlnaHQgJiYgZm91bmQucG9zdGZpeCA9PSAndycgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLmhlaWdodCA9ICggc2xpZGUud2lkdGggLyBzbGlkZS5oZWlnaHQgKSAqIGZvdW5kLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS53aWR0aCAgPSBmb3VuZC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgd2lsbCBiZSB3cmFwcGVyIGNvbnRhaW5pbmcgYm90aCBnaG9zdCBhbmQgYWN0dWFsIGltYWdlXHJcbiAgICAgICAgICAgIHNsaWRlLiRjb250ZW50ID0gJCgnPGRpdiBjbGFzcz1cImZhbmN5Ym94LWltYWdlLXdyYXBcIj48L2Rpdj4nKVxyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnZmFuY3lib3gtaXMtaGlkZGVuJyApXHJcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8oIHNsaWRlLiRzbGlkZSApO1xyXG5cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgYSB0aHVtYm5haWwsIHdlIGNhbiBkaXNwbGF5IGl0IHdoaWxlIGFjdHVhbCBpbWFnZSBpcyBsb2FkaW5nXHJcbiAgICAgICAgICAgIC8vIFVzZXJzIHdpbGwgbm90IHN0YXJlIGF0IGJsYWNrIHNjcmVlbiBhbmQgYWN0dWFsIGltYWdlIHdpbGwgYXBwZWFyIGdyYWR1YWxseVxyXG4gICAgICAgICAgICBpZiAoIHNsaWRlLm9wdHMucHJlbG9hZCAhPT0gZmFsc2UgJiYgc2xpZGUub3B0cy53aWR0aCAmJiBzbGlkZS5vcHRzLmhlaWdodCAmJiAoIHNsaWRlLm9wdHMudGh1bWIgfHwgc2xpZGUub3B0cy4kdGh1bWIgKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzbGlkZS53aWR0aCAgPSBzbGlkZS5vcHRzLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgc2xpZGUuaGVpZ2h0ID0gc2xpZGUub3B0cy5oZWlnaHQ7XHJcblxyXG4gICAgICAgICAgICAgICAgc2xpZGUuJGdob3N0ID0gJCgnPGltZyAvPicpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9uZSgnZXJyb3InLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzbGlkZS4kZ2hvc3QgPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRCaWdJbWFnZSggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAub25lKCdsb2FkJywgZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFmdGVyTG9hZCggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0QmlnSW1hZ2UoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgLmFkZENsYXNzKCAnZmFuY3lib3gtaW1hZ2UnIClcclxuICAgICAgICAgICAgICAgICAgICAuYXBwZW5kVG8oIHNsaWRlLiRjb250ZW50IClcclxuICAgICAgICAgICAgICAgICAgICAuYXR0ciggJ3NyYycsIHNsaWRlLm9wdHMudGh1bWIgfHwgc2xpZGUub3B0cy4kdGh1bWIuYXR0ciggJ3NyYycgKSApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBzZWxmLnNldEJpZ0ltYWdlKCBzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ3JlYXRlIGZ1bGwtc2l6ZSBpbWFnZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgc2V0QmlnSW1hZ2UgOiBmdW5jdGlvbiAoIHNsaWRlICkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciAkaW1nID0gJCgnPGltZyAvPicpO1xyXG5cclxuICAgICAgICAgICAgc2xpZGUuJGltYWdlID0gJGltZ1xyXG4gICAgICAgICAgICAgICAgLm9uZSgnZXJyb3InLCBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRFcnJvciggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLm9uZSgnbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDbGVhciB0aW1lb3V0IHRoYXQgY2hlY2tzIGlmIGxvYWRpbmcgaWNvbiBuZWVkcyB0byBiZSBkaXNwbGF5ZWRcclxuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQoIHNsaWRlLnRpbW91dHMgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUudGltb3V0cyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmICggc2VsZi5pc0Nsb3NpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLndpZHRoICA9IHRoaXMubmF0dXJhbFdpZHRoO1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLmhlaWdodCA9IHRoaXMubmF0dXJhbEhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzbGlkZS5vcHRzLmltYWdlLnNyY3NldCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGltZy5hdHRyKCAnc2l6ZXMnLCAnMTAwdncnICkuYXR0ciggJ3NyY3NldCcsIHNsaWRlLm9wdHMuaW1hZ2Uuc3Jjc2V0ICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmhpZGVMb2FkaW5nKCBzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIHNsaWRlLiRnaG9zdCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNsaWRlLnRpbW91dHMgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUudGltb3V0cyA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xpZGUuJGdob3N0LmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIE1hdGgubWluKCAzMDAsIE1hdGgubWF4KCAxMDAwLCBzbGlkZS5oZWlnaHQgLyAxNjAwICkgKSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFmdGVyTG9hZCggc2xpZGUgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcyggJ2ZhbmN5Ym94LWltYWdlJyApXHJcbiAgICAgICAgICAgICAgICAuYXR0cignc3JjJywgc2xpZGUuc3JjKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCBzbGlkZS4kY29udGVudCApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAoICRpbWdbMF0uY29tcGxldGUgfHwgJGltZ1swXS5yZWFkeVN0YXRlID09IFwiY29tcGxldGVcIiApICYmICRpbWdbMF0ubmF0dXJhbFdpZHRoICYmICRpbWdbMF0ubmF0dXJhbEhlaWdodCApIHtcclxuICAgICAgICAgICAgICAgICAgJGltZy50cmlnZ2VyKCAnbG9hZCcgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiggJGltZ1swXS5lcnJvciApIHtcclxuICAgICAgICAgICAgICAgICAkaW1nLnRyaWdnZXIoICdlcnJvcicgKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2xpZGUudGltb3V0cyA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhJGltZ1swXS5jb21wbGV0ZSAmJiAhc2xpZGUuaGFzRXJyb3IgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvd0xvYWRpbmcoIHNsaWRlICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0sIDEwMCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBDcmVhdGUgaWZyYW1lIHdyYXBwZXIsIGlmcmFtZSBhbmQgYmluZGluZ3NcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgc2V0SWZyYW1lIDogZnVuY3Rpb24oIHNsaWRlICkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZlx0PSB0aGlzLFxyXG4gICAgICAgICAgICAgICAgb3B0cyAgICA9IHNsaWRlLm9wdHMuaWZyYW1lLFxyXG4gICAgICAgICAgICAgICAgJHNsaWRlXHQ9IHNsaWRlLiRzbGlkZSxcclxuICAgICAgICAgICAgICAgICRpZnJhbWU7XHJcblxyXG4gICAgICAgICAgICBzbGlkZS4kY29udGVudCA9ICQoJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1jb250ZW50JyArICggb3B0cy5wcmVsb2FkID8gJyBmYW5jeWJveC1pcy1oaWRkZW4nIDogJycgKSArICdcIj48L2Rpdj4nKVxyXG4gICAgICAgICAgICAgICAgLmNzcyggb3B0cy5jc3MgKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCAkc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICRpZnJhbWUgPSAkKCBvcHRzLnRwbC5yZXBsYWNlKC9cXHtybmRcXH0vZywgbmV3IERhdGUoKS5nZXRUaW1lKCkpIClcclxuICAgICAgICAgICAgICAgIC5hdHRyKCBvcHRzLmF0dHIgKVxyXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKCBzbGlkZS4kY29udGVudCApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBvcHRzLnByZWxvYWQgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93TG9hZGluZyggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBVbmZvcnR1bmF0ZWx5LCBpdCBpcyBub3QgYWx3YXlzIHBvc3NpYmxlIHRvIGRldGVybWluZSBpZiBpZnJhbWUgaXMgc3VjY2Vzc2Z1bGx5IGxvYWRlZFxyXG4gICAgICAgICAgICAgICAgLy8gKGR1ZSB0byBicm93c2VyIHNlY3VyaXR5IHBvbGljeSlcclxuXHJcbiAgICAgICAgICAgICAgICAkaWZyYW1lLm9uKCdsb2FkLmZiIGVycm9yLmZiJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNSZWFkeSA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLiRzbGlkZS50cmlnZ2VyKCAncmVmcmVzaCcgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5hZnRlckxvYWQoIHNsaWRlICk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSBpZnJhbWUgY29udGVudCBzaXplXHJcbiAgICAgICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICAgICAgJHNsaWRlLm9uKCdyZWZyZXNoLmZiJywgZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICR3cmFwID0gc2xpZGUuJGNvbnRlbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lV2lkdGggID0gb3B0cy5jc3Mud2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lSGVpZ2h0ID0gb3B0cy5jc3MuaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGNvbnRlbnRzLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkYm9keTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAkaWZyYW1lWzBdLmlzUmVhZHkgIT09IDEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIGNvbnRlbnQgaXMgYWNjZXNzaWJsZSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBpdCB3aWxsIGZhaWwgaWYgZnJhbWUgaXMgbm90IHdpdGggdGhlIHNhbWUgb3JpZ2luXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRjb250ZW50cyA9ICRpZnJhbWUuY29udGVudHMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGJvZHkgICAgID0gJGNvbnRlbnRzLmZpbmQoJ2JvZHknKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgZGltZW5zaW9ucyBmb3IgdGhlIHdyYXBwZXJcclxuICAgICAgICAgICAgICAgICAgICBpZiAoICRib2R5ICYmICRib2R5Lmxlbmd0aCApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZnJhbWVXaWR0aCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsV2lkdGggPSAkaWZyYW1lWzBdLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFdpZHRoO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZyYW1lV2lkdGggPSBNYXRoLmNlaWwoICRib2R5Lm91dGVyV2lkdGgodHJ1ZSkgKyAoICR3cmFwLndpZHRoKCkgLSBzY3JvbGxXaWR0aCApICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFtZVdpZHRoICs9ICR3cmFwLm91dGVyV2lkdGgoKSAtICR3cmFwLmlubmVyV2lkdGgoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCBmcmFtZUhlaWdodCA9PT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJhbWVIZWlnaHQgPSBNYXRoLmNlaWwoICRib2R5Lm91dGVySGVpZ2h0KHRydWUpICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcmFtZUhlaWdodCArPSAkd3JhcC5vdXRlckhlaWdodCgpIC0gJHdyYXAuaW5uZXJIZWlnaHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUmVzaXplIHdyYXBwZXIgdG8gZml0IGlmcmFtZSBjb250ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZnJhbWVXaWR0aCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICR3cmFwLndpZHRoKCBmcmFtZVdpZHRoICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICggZnJhbWVIZWlnaHQgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkd3JhcC5oZWlnaHQoIGZyYW1lSGVpZ2h0ICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICR3cmFwLnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtaXMtaGlkZGVuJyApO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICB0aGlzLmFmdGVyTG9hZCggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICRpZnJhbWUuYXR0ciggJ3NyYycsIHNsaWRlLnNyYyApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzbGlkZS5vcHRzLnNtYWxsQnRuID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICAgICAgc2xpZGUuJGNvbnRlbnQucHJlcGVuZCggc2VsZi50cmFuc2xhdGUoIHNsaWRlLCBzbGlkZS5vcHRzLmJ0blRwbC5zbWFsbEJ0biApICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBpZnJhbWUgaWYgY2xvc2luZyBvciBjaGFuZ2luZyBnYWxsZXJ5IGl0ZW1cclxuICAgICAgICAgICAgJHNsaWRlLm9uZSggJ29uUmVzZXQnLCBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBoZWxwcyBJRSBub3QgdG8gdGhyb3cgZXJyb3JzIHdoZW4gY2xvc2luZ1xyXG4gICAgICAgICAgICAgICAgdHJ5IHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJCggdGhpcyApLmZpbmQoICdpZnJhbWUnICkuaGlkZSgpLmF0dHIoICdzcmMnLCAnLy9hYm91dDpibGFuaycgKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoICggaWdub3JlICkge31cclxuXHJcbiAgICAgICAgICAgICAgICAkKCB0aGlzICkuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzbGlkZS5pc0xvYWRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBXcmFwIGFuZCBhcHBlbmQgY29udGVudCB0byB0aGUgc2xpZGVcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBzZXRDb250ZW50IDogZnVuY3Rpb24gKCBzbGlkZSwgY29udGVudCApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIGlmICggc2VsZi5pc0Nsb3NpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuaGlkZUxvYWRpbmcoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICBzbGlkZS4kc2xpZGUuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggaXNRdWVyeSggY29udGVudCApICYmIGNvbnRlbnQucGFyZW50KCkubGVuZ3RoICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIGNvbnRlbnQgaXMgYSBqUXVlcnkgb2JqZWN0LCB0aGVuIGl0IHdpbGwgYmUgbW92ZWQgdG8gdGhlIHNsaWRlLlxyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHBsYWNlaG9sZGVyIGlzIGNyZWF0ZWQgc28gd2Ugd2lsbCBrbm93IHdoZXJlIHRvIHB1dCBpdCBiYWNrLlxyXG4gICAgICAgICAgICAgICAgLy8gSWYgdXNlciBpcyBuYXZpZ2F0aW5nIGdhbGxlcnkgZmFzdCwgdGhlbiB0aGUgY29udGVudCBtaWdodCBiZSBhbHJlYWR5IGluc2lkZSBmYW5jeUJveFxyXG4gICAgICAgICAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSBjb250ZW50IGlzIG5vdCBhbHJlYWR5IG1vdmVkIHRvIGZhbmN5Qm94XHJcbiAgICAgICAgICAgICAgICBjb250ZW50LnBhcmVudCggJy5mYW5jeWJveC1zbGlkZS0taW5saW5lJyApLnRyaWdnZXIoICdvblJlc2V0JyApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENyZWF0ZSB0ZW1wb3JhcnkgZWxlbWVudCBtYXJraW5nIG9yaWdpbmFsIHBsYWNlIG9mIHRoZSBjb250ZW50XHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kcGxhY2Vob2xkZXIgPSAkKCAnPGRpdj48L2Rpdj4nICkuaGlkZSgpLmluc2VydEFmdGVyKCBjb250ZW50ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTWFrZSBzdXJlIGNvbnRlbnQgaXMgdmlzaWJsZVxyXG4gICAgICAgICAgICAgICAgY29udGVudC5jc3MoJ2Rpc3BsYXknLCAnaW5saW5lLWJsb2NrJyk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAhc2xpZGUuaGFzRXJyb3IgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgY29udGVudCBpcyBqdXN0IGEgcGxhaW4gdGV4dCwgdHJ5IHRvIGNvbnZlcnQgaXQgdG8gaHRtbFxyXG4gICAgICAgICAgICAgICAgaWYgKCAkLnR5cGUoIGNvbnRlbnQgKSA9PT0gJ3N0cmluZycgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICQoJzxkaXY+JykuYXBwZW5kKCAkLnRyaW0oIGNvbnRlbnQgKSApLmNvbnRlbnRzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHdlIGhhdmUgdGV4dCBub2RlLCB0aGVuIGFkZCB3cmFwcGluZyBlbGVtZW50IHRvIG1ha2UgdmVydGljYWwgYWxpZ25tZW50IHdvcmtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIGNvbnRlbnRbMF0ubm9kZVR5cGUgPT09IDMgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnQgPSAkKCc8ZGl2PicpLmh0bWwoIGNvbnRlbnQgKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgXCJmaWx0ZXJcIiBvcHRpb24gaXMgcHJvdmlkZWQsIHRoZW4gZmlsdGVyIGNvbnRlbnRcclxuICAgICAgICAgICAgICAgIGlmICggc2xpZGUub3B0cy5maWx0ZXIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudCA9ICQoJzxkaXY+JykuaHRtbCggY29udGVudCApLmZpbmQoIHNsaWRlLm9wdHMuZmlsdGVyICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzbGlkZS4kc2xpZGUub25lKCdvblJlc2V0JywgZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFB1dCBjb250ZW50IGJhY2tcclxuICAgICAgICAgICAgICAgIGlmICggc2xpZGUuJHBsYWNlaG9sZGVyICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLiRwbGFjZWhvbGRlci5hZnRlciggY29udGVudC5oaWRlKCkgKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuJHBsYWNlaG9sZGVyID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZW1vdmUgY3VzdG9tIGNsb3NlIGJ1dHRvblxyXG4gICAgICAgICAgICAgICAgaWYgKCBzbGlkZS4kc21hbGxCdG4gKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuJHNtYWxsQnRuLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBzbGlkZS4kc21hbGxCdG4gPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFJlbW92ZSBjb250ZW50IGFuZCBtYXJrIHNsaWRlIGFzIG5vdCBsb2FkZWRcclxuICAgICAgICAgICAgICAgIGlmICggIXNsaWRlLmhhc0Vycm9yICkge1xyXG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuZW1wdHkoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2xpZGUuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgc2xpZGUuJGNvbnRlbnQgPSAkKCBjb250ZW50ICkuYXBwZW5kVG8oIHNsaWRlLiRzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hZnRlckxvYWQoIHNsaWRlICk7XHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gRGlzcGxheSBlcnJvciBtZXNzYWdlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIHNldEVycm9yIDogZnVuY3Rpb24gKCBzbGlkZSApIHtcclxuXHJcbiAgICAgICAgICAgIHNsaWRlLmhhc0Vycm9yID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIHNsaWRlLiRzbGlkZS5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LXNsaWRlLS0nICsgc2xpZGUudHlwZSApO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50KCBzbGlkZSwgdGhpcy50cmFuc2xhdGUoIHNsaWRlLCBzbGlkZS5vcHRzLmVycm9yVHBsICkgKTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIFNob3cgbG9hZGluZyBpY29uIGluc2lkZSB0aGUgc2xpZGVcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIHNob3dMb2FkaW5nIDogZnVuY3Rpb24oIHNsaWRlICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgc2xpZGUgPSBzbGlkZSB8fCBzZWxmLmN1cnJlbnQ7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNsaWRlICYmICFzbGlkZS4kc3Bpbm5lciApIHtcclxuICAgICAgICAgICAgICAgIHNsaWRlLiRzcGlubmVyID0gJCggc2VsZi5vcHRzLnNwaW5uZXJUcGwgKS5hcHBlbmRUbyggc2xpZGUuJHNsaWRlICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gUmVtb3ZlIGxvYWRpbmcgaWNvbiBmcm9tIHRoZSBzbGlkZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgaGlkZUxvYWRpbmcgOiBmdW5jdGlvbiggc2xpZGUgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICBzbGlkZSA9IHNsaWRlIHx8IHNlbGYuY3VycmVudDtcclxuXHJcbiAgICAgICAgICAgIGlmICggc2xpZGUgJiYgc2xpZGUuJHNwaW5uZXIgKSB7XHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kc3Bpbm5lci5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBkZWxldGUgc2xpZGUuJHNwaW5uZXI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIEFkanVzdG1lbnRzIGFmdGVyIHNsaWRlIGNvbnRlbnQgaGFzIGJlZW4gbG9hZGVkXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgYWZ0ZXJMb2FkIDogZnVuY3Rpb24oIHNsaWRlICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzZWxmLmlzQ2xvc2luZyApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc2xpZGUuaXNMb2FkaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNsaWRlLmlzTG9hZGVkICA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoICdhZnRlckxvYWQnLCBzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5oaWRlTG9hZGluZyggc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggc2xpZGUub3B0cy5zbWFsbEJ0biAmJiAhc2xpZGUuJHNtYWxsQnRuICkge1xyXG4gICAgICAgICAgICAgICAgc2xpZGUuJHNtYWxsQnRuID0gJCggc2VsZi50cmFuc2xhdGUoIHNsaWRlLCBzbGlkZS5vcHRzLmJ0blRwbC5zbWFsbEJ0biApICkuYXBwZW5kVG8oIHNsaWRlLiRjb250ZW50LmZpbHRlcignZGl2LGZvcm0nKS5maXJzdCgpICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggc2xpZGUub3B0cy5wcm90ZWN0ICYmIHNsaWRlLiRjb250ZW50ICYmICFzbGlkZS5oYXNFcnJvciApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEaXNhYmxlIHJpZ2h0IGNsaWNrXHJcbiAgICAgICAgICAgICAgICBzbGlkZS4kY29udGVudC5vbiggJ2NvbnRleHRtZW51LmZiJywgZnVuY3Rpb24oIGUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgIGlmICggZS5idXR0b24gPT0gMiApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIEFkZCBmYWtlIGVsZW1lbnQgb24gdG9wIG9mIHRoZSBpbWFnZVxyXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBtYWtlcyBhIGJpdCBoYXJkZXIgZm9yIHVzZXIgdG8gc2VsZWN0IGltYWdlXHJcbiAgICAgICAgICAgICAgICBpZiAoIHNsaWRlLnR5cGUgPT09ICdpbWFnZScgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJCggJzxkaXYgY2xhc3M9XCJmYW5jeWJveC1zcGFjZWJhbGxcIj48L2Rpdj4nICkuYXBwZW5kVG8oIHNsaWRlLiRjb250ZW50ICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnJldmVhbENvbnRlbnQoIHNsaWRlICk7XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBNYWtlIGNvbnRlbnQgdmlzaWJsZVxyXG4gICAgICAgIC8vIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCByaWdodCBhZnRlciBjb250ZW50IGhhcyBiZWVuIGxvYWRlZCBvclxyXG4gICAgICAgIC8vIHVzZXIgbmF2aWdhdGVzIGdhbGxlcnkgYW5kIHRyYW5zaXRpb24gc2hvdWxkIHN0YXJ0XHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIHJldmVhbENvbnRlbnQgOiBmdW5jdGlvbiggc2xpZGUgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsZiAgID0gdGhpcztcclxuICAgICAgICAgICAgdmFyICRzbGlkZSA9IHNsaWRlLiRzbGlkZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBlZmZlY3QsIGVmZmVjdENsYXNzTmFtZSwgZHVyYXRpb24sIG9wYWNpdHksIGVuZCwgc3RhcnQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGVmZmVjdCAgID0gc2xpZGUub3B0c1sgc2VsZi5maXJzdFJ1biA/ICdhbmltYXRpb25FZmZlY3QnICAgOiAndHJhbnNpdGlvbkVmZmVjdCcgXTtcclxuICAgICAgICAgICAgZHVyYXRpb24gPSBzbGlkZS5vcHRzWyBzZWxmLmZpcnN0UnVuID8gJ2FuaW1hdGlvbkR1cmF0aW9uJyA6ICd0cmFuc2l0aW9uRHVyYXRpb24nIF07XHJcblxyXG4gICAgICAgICAgICBkdXJhdGlvbiA9IHBhcnNlSW50KCBzbGlkZS5mb3JjZWREdXJhdGlvbiA9PT0gdW5kZWZpbmVkID8gZHVyYXRpb24gOiBzbGlkZS5mb3JjZWREdXJhdGlvbiwgMTAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggc2xpZGUuaXNNb3ZlZCB8fCBzbGlkZS5wb3MgIT09IHNlbGYuY3VyclBvcyB8fCAhZHVyYXRpb24gKSB7XHJcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY2FuIHpvb21cclxuICAgICAgICAgICAgaWYgKCBlZmZlY3QgPT09ICd6b29tJyAmJiAhKCBzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcyAmJiBkdXJhdGlvbiAmJiBzbGlkZS50eXBlID09PSAnaW1hZ2UnICYmICFzbGlkZS5oYXNFcnJvciAmJiAoIHN0YXJ0ID0gc2VsZi5nZXRUaHVtYlBvcyggc2xpZGUgKSApICkgKSB7XHJcbiAgICAgICAgICAgICAgICBlZmZlY3QgPSAnZmFkZSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFpvb20gYW5pbWF0aW9uXHJcbiAgICAgICAgICAgIC8vID09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICBpZiAoIGVmZmVjdCA9PT0gJ3pvb20nICkge1xyXG4gICAgICAgICAgICAgICAgZW5kID0gc2VsZi5nZXRGaXRQb3MoIHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgZW5kLnNjYWxlWCA9IGVuZC53aWR0aCAgLyBzdGFydC53aWR0aDtcclxuICAgICAgICAgICAgICAgIGVuZC5zY2FsZVkgPSBlbmQuaGVpZ2h0IC8gc3RhcnQuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBlbmQud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgZW5kLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgb3BhY2l0eVxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eSA9IHNsaWRlLm9wdHMuem9vbU9wYWNpdHk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBvcGFjaXR5ID09ICdhdXRvJyApIHtcclxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5ID0gTWF0aC5hYnMoIHNsaWRlLndpZHRoIC8gc2xpZGUuaGVpZ2h0IC0gc3RhcnQud2lkdGggLyBzdGFydC5oZWlnaHQgKSA+IDAuMTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIG9wYWNpdHkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhcnQub3BhY2l0eSA9IDAuMTtcclxuICAgICAgICAgICAgICAgICAgICBlbmQub3BhY2l0eSAgID0gMTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEcmF3IGltYWdlIGF0IHN0YXJ0IHBvc2l0aW9uXHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZSggc2xpZGUuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1pcy1oaWRkZW4nICksIHN0YXJ0ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgZm9yY2VSZWRyYXcoIHNsaWRlLiRjb250ZW50ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU3RhcnQgYW5pbWF0aW9uXHJcbiAgICAgICAgICAgICAgICAkLmZhbmN5Ym94LmFuaW1hdGUoIHNsaWRlLiRjb250ZW50LCBlbmQsIGR1cmF0aW9uLCBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlU2xpZGUoIHNsaWRlICk7XHJcblxyXG5cclxuICAgICAgICAgICAgLy8gU2ltcGx5IHNob3cgY29udGVudFxyXG4gICAgICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgICAgICBpZiAoICFlZmZlY3QgKSB7XHJcbiAgICAgICAgICAgICAgICBmb3JjZVJlZHJhdyggJHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2xpZGUuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1pcy1oaWRkZW4nICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcyApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkLmZhbmN5Ym94LnN0b3AoICRzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgZWZmZWN0Q2xhc3NOYW1lID0gJ2ZhbmN5Ym94LWFuaW1hdGVkIGZhbmN5Ym94LXNsaWRlLS0nICsgKCBzbGlkZS5wb3MgPj0gc2VsZi5wcmV2UG9zID8gJ25leHQnIDogJ3ByZXZpb3VzJyApICsgJyBmYW5jeWJveC1meC0nICsgZWZmZWN0O1xyXG5cclxuICAgICAgICAgICAgJHNsaWRlLnJlbW92ZUF0dHIoICdzdHlsZScgKS5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LXNsaWRlLS1jdXJyZW50IGZhbmN5Ym94LXNsaWRlLS1uZXh0IGZhbmN5Ym94LXNsaWRlLS1wcmV2aW91cycgKS5hZGRDbGFzcyggZWZmZWN0Q2xhc3NOYW1lICk7XHJcblxyXG4gICAgICAgICAgICBzbGlkZS4kY29udGVudC5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWlzLWhpZGRlbicgKTtcclxuXHJcbiAgICAgICAgICAgIC8vRm9yY2UgcmVmbG93IGZvciBDU1MzIHRyYW5zaXRpb25zXHJcbiAgICAgICAgICAgIGZvcmNlUmVkcmF3KCAkc2xpZGUgKTtcclxuXHJcbiAgICAgICAgICAgICQuZmFuY3lib3guYW5pbWF0ZSggJHNsaWRlLCAnZmFuY3lib3gtc2xpZGUtLWN1cnJlbnQnLCBkdXJhdGlvbiwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgJHNsaWRlLnJlbW92ZUNsYXNzKCBlZmZlY3RDbGFzc05hbWUgKS5yZW1vdmVBdHRyKCAnc3R5bGUnICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCBzbGlkZS5wb3MgPT09IHNlbGYuY3VyclBvcyApIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmNvbXBsZXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9LCB0cnVlKTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHdlIGNhbiBhbmQgaGF2ZSB0byB6b29tIGZyb20gdGh1bWJuYWlsXHJcbiAgICAgICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgZ2V0VGh1bWJQb3MgOiBmdW5jdGlvbiggc2xpZGUgKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciByZXogID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBlbGVtZW50IGlzIGluc2lkZSB0aGUgdmlld3BvcnQgYnkgYXQgbGVhc3QgMSBwaXhlbFxyXG4gICAgICAgICAgICB2YXIgaXNFbGVtZW50VmlzaWJsZSA9IGZ1bmN0aW9uKCAkZWwgKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudCA9ICRlbFswXTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZWxlbWVudFJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhcmVudFJlY3RzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZpc2libGVJbkFsbFBhcmVudHM7XHJcblxyXG4gICAgICAgICAgICAgICAgd2hpbGUgKCBlbGVtZW50LnBhcmVudEVsZW1lbnQgIT09IG51bGwgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAkKGVsZW1lbnQucGFyZW50RWxlbWVudCkuY3NzKCdvdmVyZmxvdycpID09PSAnaGlkZGVuJyAgfHwgJChlbGVtZW50LnBhcmVudEVsZW1lbnQpLmNzcygnb3ZlcmZsb3cnKSA9PT0gJ2F1dG8nICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJlbnRSZWN0cy5wdXNoKGVsZW1lbnQucGFyZW50RWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZpc2libGVJbkFsbFBhcmVudHMgPSBwYXJlbnRSZWN0cy5ldmVyeShmdW5jdGlvbihwYXJlbnRSZWN0KXtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmlzaWJsZVBpeGVsWCA9IE1hdGgubWluKGVsZW1lbnRSZWN0LnJpZ2h0LCBwYXJlbnRSZWN0LnJpZ2h0KSAtIE1hdGgubWF4KGVsZW1lbnRSZWN0LmxlZnQsIHBhcmVudFJlY3QubGVmdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZpc2libGVQaXhlbFkgPSBNYXRoLm1pbihlbGVtZW50UmVjdC5ib3R0b20sIHBhcmVudFJlY3QuYm90dG9tKSAtIE1hdGgubWF4KGVsZW1lbnRSZWN0LnRvcCwgcGFyZW50UmVjdC50b3ApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmlzaWJsZVBpeGVsWCA+IDAgJiYgdmlzaWJsZVBpeGVsWSA+IDA7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmlzaWJsZUluQWxsUGFyZW50cyAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnRSZWN0LmJvdHRvbSA+IDAgJiYgZWxlbWVudFJlY3QucmlnaHQgPiAwICYmXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudFJlY3QubGVmdCA8ICQod2luZG93KS53aWR0aCgpICYmIGVsZW1lbnRSZWN0LnRvcCA8ICQod2luZG93KS5oZWlnaHQoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIHZhciAkdGh1bWIgICA9IHNsaWRlLm9wdHMuJHRodW1iO1xyXG4gICAgICAgICAgICB2YXIgdGh1bWJQb3MgPSAkdGh1bWIgPyAkdGh1bWIub2Zmc2V0KCkgOiAwO1xyXG4gICAgICAgICAgICB2YXIgc2xpZGVQb3M7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHRodW1iUG9zICYmICR0aHVtYlswXS5vd25lckRvY3VtZW50ID09PSBkb2N1bWVudCAmJiBpc0VsZW1lbnRWaXNpYmxlKCAkdGh1bWIgKSApIHtcclxuICAgICAgICAgICAgICAgIHNsaWRlUG9zID0gc2VsZi4kcmVmcy5zdGFnZS5vZmZzZXQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXogPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdG9wICAgIDogdGh1bWJQb3MudG9wICAtIHNsaWRlUG9zLnRvcCAgKyBwYXJzZUZsb2F0KCAkdGh1bWIuY3NzKCBcImJvcmRlci10b3Atd2lkdGhcIiApIHx8IDAgKSxcclxuICAgICAgICAgICAgICAgICAgICBsZWZ0ICAgOiB0aHVtYlBvcy5sZWZ0IC0gc2xpZGVQb3MubGVmdCArIHBhcnNlRmxvYXQoICR0aHVtYi5jc3MoIFwiYm9yZGVyLWxlZnQtd2lkdGhcIiApIHx8IDAgKSxcclxuICAgICAgICAgICAgICAgICAgICB3aWR0aCAgOiAkdGh1bWIud2lkdGgoKSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQgOiAkdGh1bWIuaGVpZ2h0KCksXHJcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVYIDogMSxcclxuICAgICAgICAgICAgICAgICAgICBzY2FsZVkgOiAxXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmV6O1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBGaW5hbCBhZGp1c3RtZW50cyBhZnRlciBjdXJyZW50IGdhbGxlcnkgaXRlbSBpcyBtb3ZlZCB0byBwb3NpdGlvblxyXG4gICAgICAgIC8vIGFuZCBpdGBzIGNvbnRlbnQgaXMgbG9hZGVkXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGNvbXBsZXRlIDogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHNlbGYuY3VycmVudDtcclxuICAgICAgICAgICAgdmFyIHNsaWRlcyAgPSB7fTtcclxuXHJcbiAgICAgICAgICAgIGlmICggY3VycmVudC5pc01vdmVkIHx8ICFjdXJyZW50LmlzTG9hZGVkIHx8IGN1cnJlbnQuaXNDb21wbGV0ZSApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY3VycmVudC5pc0NvbXBsZXRlID0gdHJ1ZTtcclxuXHJcbiAgICAgICAgICAgIGN1cnJlbnQuJHNsaWRlLnNpYmxpbmdzKCkudHJpZ2dlciggJ29uUmVzZXQnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBUcmlnZ2VyIGFueSBDU1MzIHRyYW5zaXRvbiBpbnNpZGUgdGhlIHNsaWRlXHJcbiAgICAgICAgICAgIGZvcmNlUmVkcmF3KCBjdXJyZW50LiRzbGlkZSApO1xyXG5cclxuICAgICAgICAgICAgY3VycmVudC4kc2xpZGUuYWRkQ2xhc3MoICdmYW5jeWJveC1zbGlkZS0tY29tcGxldGUnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgdW5uZWNlc3Nhcnkgc2xpZGVzXHJcbiAgICAgICAgICAgICQuZWFjaCggc2VsZi5zbGlkZXMsIGZ1bmN0aW9uKCBrZXksIHNsaWRlICkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCBzbGlkZS5wb3MgPj0gc2VsZi5jdXJyUG9zIC0gMSAmJiBzbGlkZS5wb3MgPD0gc2VsZi5jdXJyUG9zICsgMSApIHtcclxuICAgICAgICAgICAgICAgICAgICBzbGlkZXNbIHNsaWRlLnBvcyBdID0gc2xpZGU7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggc2xpZGUgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICQuZmFuY3lib3guc3RvcCggc2xpZGUuJHNsaWRlICk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlLiRzbGlkZS5vZmYoKS5yZW1vdmUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnNsaWRlcyA9IHNsaWRlcztcclxuXHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlQ3Vyc29yKCk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoICdhZnRlclNob3cnICk7XHJcblxyXG4gICAgICAgICAgICAvLyBUcnkgdG8gZm9jdXMgb24gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50XHJcbiAgICAgICAgICAgIGlmICggJCggZG9jdW1lbnQuYWN0aXZlRWxlbWVudCApLmlzKCAnW2Rpc2FibGVkXScgKSB8fCAoIGN1cnJlbnQub3B0cy5hdXRvRm9jdXMgJiYgISggY3VycmVudC50eXBlID09ICdpbWFnZScgfHwgY3VycmVudC50eXBlID09PSAnaWZyYW1lJyApICkgKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIFByZWxvYWQgbmV4dCBhbmQgcHJldmlvdXMgc2xpZGVzXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgcHJlbG9hZCA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBuZXh0LCBwcmV2O1xyXG5cclxuICAgICAgICAgICAgaWYgKCBzZWxmLmdyb3VwLmxlbmd0aCA8IDIgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIG5leHQgID0gc2VsZi5zbGlkZXNbIHNlbGYuY3VyclBvcyArIDEgXTtcclxuICAgICAgICAgICAgcHJldiAgPSBzZWxmLnNsaWRlc1sgc2VsZi5jdXJyUG9zIC0gMSBdO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBuZXh0ICYmIG5leHQudHlwZSA9PT0gJ2ltYWdlJyApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYubG9hZFNsaWRlKCBuZXh0ICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggcHJldiAmJiBwcmV2LnR5cGUgPT09ICdpbWFnZScgKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLmxvYWRTbGlkZSggcHJldiApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBUcnkgdG8gZmluZCBhbmQgZm9jdXMgb24gdGhlIGZpcnN0IGZvY3VzYWJsZSBlbGVtZW50XHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBmb2N1cyA6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudDtcclxuICAgICAgICAgICAgdmFyICRlbDtcclxuXHJcbiAgICAgICAgICAgIGlmICggdGhpcy5pc0Nsb3NpbmcgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggY3VycmVudCAmJiBjdXJyZW50LmlzQ29tcGxldGUgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gTG9vayBmb3IgZmlyc3QgaW5wdXQgd2l0aCBhdXRvZm9jdXMgYXR0cmlidXRlXHJcbiAgICAgICAgICAgICAgICAkZWwgPSBjdXJyZW50LiRzbGlkZS5maW5kKCdpbnB1dFthdXRvZm9jdXNdOmVuYWJsZWQ6dmlzaWJsZTpmaXJzdCcpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggISRlbC5sZW5ndGggKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGVsID0gY3VycmVudC4kc2xpZGUuZmluZCgnYnV0dG9uLDppbnB1dCxbdGFiaW5kZXhdLGEnKS5maWx0ZXIoJzplbmFibGVkOnZpc2libGU6Zmlyc3QnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGVsID0gJGVsICYmICRlbC5sZW5ndGggPyAkZWwgOiB0aGlzLiRyZWZzLmNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgICRlbC5mb2N1cygpO1xyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBBY3RpdmF0ZXMgY3VycmVudCBpbnN0YW5jZSAtIGJyaW5ncyBjb250YWluZXIgdG8gdGhlIGZyb250IGFuZCBlbmFibGVzIGtleWJvYXJkLFxyXG4gICAgICAgIC8vIG5vdGlmaWVzIG90aGVyIGluc3RhbmNlcyBhYm91dCBkZWFjdGl2YXRpbmdcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgYWN0aXZhdGUgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIC8vIERlYWN0aXZhdGUgYWxsIGluc3RhbmNlc1xyXG4gICAgICAgICAgICAkKCAnLmZhbmN5Ym94LWNvbnRhaW5lcicgKS5lYWNoKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9ICQodGhpcykuZGF0YSggJ0ZhbmN5Qm94JyApO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNraXAgc2VsZiBhbmQgY2xvc2luZyBpbnN0YW5jZXNcclxuICAgICAgICAgICAgICAgIGlmIChpbnN0YW5jZSAmJiBpbnN0YW5jZS5pZCAhPT0gc2VsZi5pZCAmJiAhaW5zdGFuY2UuaXNDbG9zaW5nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UudHJpZ2dlciggJ29uRGVhY3RpdmF0ZScgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaW5zdGFuY2UucmVtb3ZlRXZlbnRzKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlLmlzVmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmlzVmlzaWJsZSA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNlbGYuY3VycmVudCB8fCBzZWxmLmlzSWRsZSApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYudXBkYXRlKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVDb250cm9scygpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLnRyaWdnZXIoICdvbkFjdGl2YXRlJyApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5hZGRFdmVudHMoKTtcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gU3RhcnQgY2xvc2luZyBwcm9jZWR1cmVcclxuICAgICAgICAvLyBUaGlzIHdpbGwgc3RhcnQgXCJ6b29tLW91dFwiIGFuaW1hdGlvbiBpZiBuZWVkZWQgYW5kIGNsZWFuIGV2ZXJ5dGhpbmcgdXAgYWZ0ZXJ3YXJkc1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBjbG9zZSA6IGZ1bmN0aW9uKCBlLCBkICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgICAgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgY3VycmVudCA9IHNlbGYuY3VycmVudDtcclxuXHJcbiAgICAgICAgICAgIHZhciBlZmZlY3QsIGR1cmF0aW9uO1xyXG4gICAgICAgICAgICB2YXIgJHdoYXQsIG9wYWNpdHksIHN0YXJ0LCBlbmQ7XHJcblxyXG4gICAgICAgICAgICB2YXIgZG9uZSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5jbGVhblVwKCBlICk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNlbGYuaXNDbG9zaW5nICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzZWxmLmlzQ2xvc2luZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBiZWZvcmVDbG9zZSBjYWxsYmFjayBwcmV2ZW50cyBjbG9zaW5nLCBtYWtlIHN1cmUgY29udGVudCBpcyBjZW50ZXJlZFxyXG4gICAgICAgICAgICBpZiAoIHNlbGYudHJpZ2dlciggJ2JlZm9yZUNsb3NlJywgZSApID09PSBmYWxzZSApIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuaXNDbG9zaW5nID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgcmVxdWVzdEFGcmFtZShmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGV2ZW50c1xyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBhcmUgbXVsdGlwbGUgaW5zdGFuY2VzLCB0aGV5IHdpbGwgYmUgc2V0IGFnYWluIGJ5IFwiYWN0aXZhdGVcIiBtZXRob2RcclxuICAgICAgICAgICAgc2VsZi5yZW1vdmVFdmVudHMoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggY3VycmVudC50aW1vdXRzICkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KCBjdXJyZW50LnRpbW91dHMgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJHdoYXQgICAgPSBjdXJyZW50LiRjb250ZW50O1xyXG4gICAgICAgICAgICBlZmZlY3QgICA9IGN1cnJlbnQub3B0cy5hbmltYXRpb25FZmZlY3Q7XHJcbiAgICAgICAgICAgIGR1cmF0aW9uID0gJC5pc051bWVyaWMoIGQgKSA/IGQgOiAoIGVmZmVjdCA/IGN1cnJlbnQub3B0cy5hbmltYXRpb25EdXJhdGlvbiA6IDAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlbW92ZSBvdGhlciBzbGlkZXNcclxuICAgICAgICAgICAgY3VycmVudC4kc2xpZGUub2ZmKCB0cmFuc2l0aW9uRW5kICkucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1zbGlkZS0tY29tcGxldGUgZmFuY3lib3gtc2xpZGUtLW5leHQgZmFuY3lib3gtc2xpZGUtLXByZXZpb3VzIGZhbmN5Ym94LWFuaW1hdGVkJyApO1xyXG5cclxuICAgICAgICAgICAgY3VycmVudC4kc2xpZGUuc2libGluZ3MoKS50cmlnZ2VyKCAnb25SZXNldCcgKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRyaWdnZXIgYW5pbWF0aW9uc1xyXG4gICAgICAgICAgICBpZiAoIGR1cmF0aW9uICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1pcy1vcGVuJyApLmFkZENsYXNzKCAnZmFuY3lib3gtaXMtY2xvc2luZycgKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQ2xlYW4gdXBcclxuICAgICAgICAgICAgc2VsZi5oaWRlTG9hZGluZyggY3VycmVudCApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi5oaWRlQ29udHJvbHMoKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudXBkYXRlQ3Vyc29yKCk7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiBwb3NzaWJsZSB0byB6b29tLW91dFxyXG4gICAgICAgICAgICBpZiAoIGVmZmVjdCA9PT0gJ3pvb20nICYmICEoIGUgIT09IHRydWUgJiYgJHdoYXQgJiYgZHVyYXRpb24gJiYgY3VycmVudC50eXBlID09PSAnaW1hZ2UnICYmICFjdXJyZW50Lmhhc0Vycm9yICYmICggZW5kID0gc2VsZi5nZXRUaHVtYlBvcyggY3VycmVudCApICkgKSApIHtcclxuICAgICAgICAgICAgICAgIGVmZmVjdCA9ICdmYWRlJztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBlZmZlY3QgPT09ICd6b29tJyApIHtcclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guc3RvcCggJHdoYXQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGFydCA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKCAkd2hhdCApO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXJ0LndpZHRoICA9IHN0YXJ0LndpZHRoICAqIHN0YXJ0LnNjYWxlWDtcclxuICAgICAgICAgICAgICAgIHN0YXJ0LmhlaWdodCA9IHN0YXJ0LmhlaWdodCAqIHN0YXJ0LnNjYWxlWTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB3ZSBuZWVkIHRvIGFuaW1hdGUgb3BhY2l0eVxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eSA9IGN1cnJlbnQub3B0cy56b29tT3BhY2l0eTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIG9wYWNpdHkgPT0gJ2F1dG8nICkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHkgPSBNYXRoLmFicyggY3VycmVudC53aWR0aCAvIGN1cnJlbnQuaGVpZ2h0IC0gZW5kLndpZHRoIC8gZW5kLmhlaWdodCApID4gMC4xO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggb3BhY2l0eSApIHtcclxuICAgICAgICAgICAgICAgICAgICBlbmQub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhcnQuc2NhbGVYID0gc3RhcnQud2lkdGggIC8gZW5kLndpZHRoO1xyXG4gICAgICAgICAgICAgICAgc3RhcnQuc2NhbGVZID0gc3RhcnQuaGVpZ2h0IC8gZW5kLmhlaWdodDtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGFydC53aWR0aCAgPSBlbmQud2lkdGg7XHJcbiAgICAgICAgICAgICAgICBzdGFydC5oZWlnaHQgPSBlbmQuaGVpZ2h0O1xyXG5cclxuICAgICAgICAgICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCBjdXJyZW50LiRjb250ZW50LCBzdGFydCApO1xyXG5cclxuICAgICAgICAgICAgICAgIGZvcmNlUmVkcmF3KCBjdXJyZW50LiRjb250ZW50ICk7XHJcblxyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5hbmltYXRlKCBjdXJyZW50LiRjb250ZW50LCBlbmQsIGR1cmF0aW9uLCBkb25lICk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggZWZmZWN0ICYmIGR1cmF0aW9uICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIElmIHNraXAgYW5pbWF0aW9uXHJcbiAgICAgICAgICAgICAgICBpZiAoIGUgPT09IHRydWUgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCggZG9uZSwgZHVyYXRpb24gKTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICQuZmFuY3lib3guYW5pbWF0ZSggY3VycmVudC4kc2xpZGUucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1zbGlkZS0tY3VycmVudCcgKSwgJ2ZhbmN5Ym94LWFuaW1hdGVkIGZhbmN5Ym94LXNsaWRlLS1wcmV2aW91cyBmYW5jeWJveC1meC0nICsgZWZmZWN0LCBkdXJhdGlvbiwgZG9uZSApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRvbmUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIEZpbmFsIGFkanVzdG1lbnRzIGFmdGVyIHJlbW92aW5nIHRoZSBpbnN0YW5jZVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBjbGVhblVwIDogZnVuY3Rpb24oIGUgKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmICA9IHRoaXMsXHJcbiAgICAgICAgICAgICAgICAkYm9keSA9ICQoICdib2R5JyApLFxyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UsXHJcbiAgICAgICAgICAgICAgICBvZmZzZXQ7XHJcblxyXG4gICAgICAgICAgICBzZWxmLmN1cnJlbnQuJHNsaWRlLnRyaWdnZXIoICdvblJlc2V0JyApO1xyXG5cclxuICAgICAgICAgICAgc2VsZi4kcmVmcy5jb250YWluZXIuZW1wdHkoKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgICAgICAgIHNlbGYudHJpZ2dlciggJ2FmdGVyQ2xvc2UnLCBlICk7XHJcblxyXG4gICAgICAgICAgICAvLyBQbGFjZSBiYWNrIGZvY3VzXHJcbiAgICAgICAgICAgIGlmICggc2VsZi4kbGFzdEZvY3VzICYmICEhc2VsZi5jdXJyZW50Lm9wdHMuYmFja0ZvY3VzICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi4kbGFzdEZvY3VzLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHNlbGYuY3VycmVudCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGVyZSBhcmUgb3RoZXIgaW5zdGFuY2VzXHJcbiAgICAgICAgICAgIGluc3RhbmNlID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBpbnN0YW5jZSApIHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlLmFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICRXLnNjcm9sbFRvcCggc2VsZi5zY3JvbGxUb3AgKS5zY3JvbGxMZWZ0KCBzZWxmLnNjcm9sbExlZnQgKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkYm9keS5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWFjdGl2ZSBjb21wZW5zYXRlLWZvci1zY3JvbGxiYXInICk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCAkYm9keS5oYXNDbGFzcyggJ2ZhbmN5Ym94LWlvc2ZpeCcgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBvZmZzZXQgPSBwYXJzZUludChkb2N1bWVudC5ib2R5LnN0eWxlLnRvcCwgMTApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkYm9keS5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWlvc2ZpeCcgKS5jc3MoICd0b3AnLCAnJyApLnNjcm9sbFRvcCggb2Zmc2V0ICogLTEgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkKCAnI2ZhbmN5Ym94LXN0eWxlLW5vc2Nyb2xsJyApLnJlbW92ZSgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gQ2FsbCBjYWxsYmFjayBhbmQgdHJpZ2dlciBhbiBldmVudFxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgdHJpZ2dlciA6IGZ1bmN0aW9uKCBuYW1lLCBzbGlkZSApIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcclxuICAgICAgICAgICAgICAgIHNlbGYgID0gdGhpcyxcclxuICAgICAgICAgICAgICAgIG9iaiAgID0gc2xpZGUgJiYgc2xpZGUub3B0cyA/IHNsaWRlIDogc2VsZi5jdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgcmV6O1xyXG5cclxuICAgICAgICAgICAgaWYgKCBvYmogKSB7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnVuc2hpZnQoIG9iaiApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG9iaiA9IHNlbGY7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGFyZ3MudW5zaGlmdCggc2VsZiApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkLmlzRnVuY3Rpb24oIG9iai5vcHRzWyBuYW1lIF0gKSApIHtcclxuICAgICAgICAgICAgICAgIHJleiA9IG9iai5vcHRzWyBuYW1lIF0uYXBwbHkoIG9iaiwgYXJncyApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHJleiA9PT0gZmFsc2UgKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV6O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIG5hbWUgPT09ICdhZnRlckNsb3NlJyB8fCAhc2VsZi4kcmVmcyApIHtcclxuICAgICAgICAgICAgICAgICRELnRyaWdnZXIoIG5hbWUgKyAnLmZiJywgYXJncyApO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHNlbGYuJHJlZnMuY29udGFpbmVyLnRyaWdnZXIoIG5hbWUgKyAnLmZiJywgYXJncyApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBVcGRhdGUgaW5mb2JhciB2YWx1ZXMsIG5hdmlnYXRpb24gYnV0dG9uIHN0YXRlcyBhbmQgcmV2ZWFsIGNhcHRpb25cclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgdXBkYXRlQ29udHJvbHMgOiBmdW5jdGlvbiAoIGZvcmNlICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdmFyIGN1cnJlbnQgID0gc2VsZi5jdXJyZW50LFxyXG4gICAgICAgICAgICAgICAgaW5kZXggICAgPSBjdXJyZW50LmluZGV4LFxyXG4gICAgICAgICAgICAgICAgY2FwdGlvbiAgPSBjdXJyZW50Lm9wdHMuY2FwdGlvbixcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSBzZWxmLiRyZWZzLmNvbnRhaW5lcixcclxuICAgICAgICAgICAgICAgICRjYXB0aW9uICAgPSBzZWxmLiRyZWZzLmNhcHRpb247XHJcblxyXG4gICAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSBjb250ZW50IGRpbWVuc2lvbnNcclxuICAgICAgICAgICAgY3VycmVudC4kc2xpZGUudHJpZ2dlciggJ3JlZnJlc2gnICk7XHJcblxyXG4gICAgICAgICAgICBzZWxmLiRjYXB0aW9uID0gY2FwdGlvbiAmJiBjYXB0aW9uLmxlbmd0aCA/ICRjYXB0aW9uLmh0bWwoIGNhcHRpb24gKSA6IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoICFzZWxmLmlzSGlkZGVuQ29udHJvbHMgJiYgIXNlbGYuaXNJZGxlICkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5zaG93Q29udHJvbHMoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gVXBkYXRlIGluZm8gYW5kIG5hdmlnYXRpb24gZWxlbWVudHNcclxuICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCdbZGF0YS1mYW5jeWJveC1jb3VudF0nKS5odG1sKCBzZWxmLmdyb3VwLmxlbmd0aCApO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWZhbmN5Ym94LWluZGV4XScpLmh0bWwoIGluZGV4ICsgMSApO1xyXG5cclxuICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCdbZGF0YS1mYW5jeWJveC1wcmV2XScpLnByb3AoICdkaXNhYmxlZCcsICggIWN1cnJlbnQub3B0cy5sb29wICYmIGluZGV4IDw9IDAgKSApO1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWZhbmN5Ym94LW5leHRdJykucHJvcCggJ2Rpc2FibGVkJywgKCAhY3VycmVudC5vcHRzLmxvb3AgJiYgaW5kZXggPj0gc2VsZi5ncm91cC5sZW5ndGggLSAxICkgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggY3VycmVudC50eXBlID09PSAnaW1hZ2UnICkge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFVwZGF0ZSBkb3dubG9hZCBidXR0b24gc291cmNlXHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWZhbmN5Ym94LWRvd25sb2FkXScpLmF0dHIoICdocmVmJywgY3VycmVudC5vcHRzLmltYWdlLnNyYyB8fCBjdXJyZW50LnNyYyApLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJ1tkYXRhLWZhbmN5Ym94LWRvd25sb2FkXSxbZGF0YS1mYW5jeWJveC16b29tXScpLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcblxyXG4gICAgICAgIC8vIEhpZGUgdG9vbGJhciBhbmQgY2FwdGlvblxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBoaWRlQ29udHJvbHMgOiBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmlzSGlkZGVuQ29udHJvbHMgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy4kcmVmcy5jb250YWluZXIucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1zaG93LWluZm9iYXIgZmFuY3lib3gtc2hvdy10b29sYmFyIGZhbmN5Ym94LXNob3ctY2FwdGlvbiBmYW5jeWJveC1zaG93LW5hdicgKTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2hvd0NvbnRyb2xzIDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIG9wdHMgPSBzZWxmLmN1cnJlbnQgPyBzZWxmLmN1cnJlbnQub3B0cyA6IHNlbGYub3B0cztcclxuICAgICAgICAgICAgdmFyICRjb250YWluZXIgPSBzZWxmLiRyZWZzLmNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgIHNlbGYuaXNIaWRkZW5Db250cm9scyAgID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHNlbGYuaWRsZVNlY29uZHNDb3VudGVyID0gMDtcclxuXHJcbiAgICAgICAgICAgICRjb250YWluZXJcclxuICAgICAgICAgICAgICAgIC50b2dnbGVDbGFzcyggJ2ZhbmN5Ym94LXNob3ctdG9vbGJhcicsICEhKCBvcHRzLnRvb2xiYXIgJiYgb3B0cy5idXR0b25zICkgKVxyXG4gICAgICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCAnZmFuY3lib3gtc2hvdy1pbmZvYmFyJywgISEoIG9wdHMuaW5mb2JhciAmJiBzZWxmLmdyb3VwLmxlbmd0aCA+IDEgKSApXHJcbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoICdmYW5jeWJveC1zaG93LW5hdicsICAgICAhISggb3B0cy5hcnJvd3MgJiYgc2VsZi5ncm91cC5sZW5ndGggPiAxICkgKVxyXG4gICAgICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCAnZmFuY3lib3gtaXMtbW9kYWwnLCAgICAgISFvcHRzLm1vZGFsICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIHNlbGYuJGNhcHRpb24gKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCAnZmFuY3lib3gtc2hvdy1jYXB0aW9uICcpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgJGNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LXNob3ctY2FwdGlvbicgKTtcclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgLy8gVG9nZ2xlIHRvb2xiYXIgYW5kIGNhcHRpb25cclxuICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgdG9nZ2xlQ29udHJvbHMgOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICBpZiAoIHRoaXMuaXNIaWRkZW5Db250cm9scyApIHtcclxuICAgICAgICAgICAgICAgdGhpcy5zaG93Q29udHJvbHMoKTtcclxuXHJcbiAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgdGhpcy5oaWRlQ29udHJvbHMoKTtcclxuICAgICAgICAgICB9XHJcblxyXG4gICAgICAgfSxcclxuXHJcblxyXG4gICAgfSk7XHJcblxyXG5cclxuICAgICQuZmFuY3lib3ggPSB7XHJcblxyXG4gICAgICAgIHZlcnNpb24gIDogXCIzLjIuNVwiLFxyXG4gICAgICAgIGRlZmF1bHRzIDogZGVmYXVsdHMsXHJcblxyXG5cclxuICAgICAgICAvLyBHZXQgY3VycmVudCBpbnN0YW5jZSBhbmQgZXhlY3V0ZSBhIGNvbW1hbmQuXHJcbiAgICAgICAgLy9cclxuICAgICAgICAvLyBFeGFtcGxlcyBvZiB1c2FnZTpcclxuICAgICAgICAvL1xyXG4gICAgICAgIC8vICAgJGluc3RhbmNlID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG4gICAgICAgIC8vICAgJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpLmp1bXBUbyggMSApO1xyXG4gICAgICAgIC8vICAgJC5mYW5jeWJveC5nZXRJbnN0YW5jZSggJ2p1bXBUbycsIDEgKTtcclxuICAgICAgICAvLyAgICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vICAgICAgIGNvbnNvbGUuaW5mbyggdGhpcy5jdXJySW5kZXggKTtcclxuICAgICAgICAvLyAgIH0pO1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBnZXRJbnN0YW5jZSA6IGZ1bmN0aW9uICggY29tbWFuZCApIHtcclxuICAgICAgICAgICAgdmFyIGluc3RhbmNlID0gJCgnLmZhbmN5Ym94LWNvbnRhaW5lcjpub3QoXCIuZmFuY3lib3gtaXMtY2xvc2luZ1wiKTpsYXN0JykuZGF0YSggJ0ZhbmN5Qm94JyApO1xyXG4gICAgICAgICAgICB2YXIgYXJncyAgICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCBpbnN0YW5jZSBpbnN0YW5jZW9mIEZhbmN5Qm94ICkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggJC50eXBlKCBjb21tYW5kICkgPT09ICdzdHJpbmcnICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluc3RhbmNlWyBjb21tYW5kIF0uYXBwbHkoIGluc3RhbmNlLCBhcmdzICk7XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICggJC50eXBlKCBjb21tYW5kICkgPT09ICdmdW5jdGlvbicgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29tbWFuZC5hcHBseSggaW5zdGFuY2UsIGFyZ3MgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgaW5zdGFuY2VcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIG9wZW4gOiBmdW5jdGlvbiAoIGl0ZW1zLCBvcHRzLCBpbmRleCApIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGYW5jeUJveCggaXRlbXMsIG9wdHMsIGluZGV4ICk7XHJcbiAgICAgICAgfSxcclxuXHJcblxyXG4gICAgICAgIC8vIENsb3NlIGN1cnJlbnQgb3IgYWxsIGluc3RhbmNlc1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBjbG9zZSA6IGZ1bmN0aW9uICggYWxsICkge1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmdldEluc3RhbmNlKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIGluc3RhbmNlICkge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2UuY2xvc2UoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUcnkgdG8gZmluZCBhbmQgY2xvc2UgbmV4dCBpbnN0YW5jZVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICggYWxsID09PSB0cnVlICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBDbG9zZSBpbnN0YW5jZXMgYW5kIHVuYmluZCBhbGwgZXZlbnRzXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgICAgIGRlc3Ryb3kgOiBmdW5jdGlvbigpIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoIHRydWUgKTtcclxuXHJcbiAgICAgICAgICAgICRELm9mZiggJ2NsaWNrLmZiLXN0YXJ0JyApO1xyXG5cclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gVHJ5IHRvIGRldGVjdCBtb2JpbGUgZGV2aWNlc1xyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgaXNNb2JpbGUgOiBkb2N1bWVudC5jcmVhdGVUb3VjaCAhPT0gdW5kZWZpbmVkICYmIC9BbmRyb2lkfHdlYk9TfGlQaG9uZXxpUGFkfGlQb2R8QmxhY2tCZXJyeXxJRU1vYmlsZXxPcGVyYSBNaW5pL2kudGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSxcclxuXHJcblxyXG4gICAgICAgIC8vIERldGVjdCBpZiAndHJhbnNsYXRlM2QnIHN1cHBvcnQgaXMgYXZhaWxhYmxlXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgdXNlM2QgOiAoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSAmJiB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZGl2ICkuZ2V0UHJvcGVydHlWYWx1ZSgndHJhbnNmb3JtJykgJiYgIShkb2N1bWVudC5kb2N1bWVudE1vZGUgJiYgZG9jdW1lbnQuZG9jdW1lbnRNb2RlIDwgMTEpO1xyXG4gICAgICAgIH0oKSksXHJcblxyXG4gICAgICAgIC8vIEhlbHBlciBmdW5jdGlvbiB0byBnZXQgY3VycmVudCB2aXN1YWwgc3RhdGUgb2YgYW4gZWxlbWVudFxyXG4gICAgICAgIC8vIHJldHVybnMgYXJyYXlbIHRvcCwgbGVmdCwgaG9yaXpvbnRhbC1zY2FsZSwgdmVydGljYWwtc2NhbGUsIG9wYWNpdHkgXVxyXG4gICAgICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBnZXRUcmFuc2xhdGUgOiBmdW5jdGlvbiggJGVsICkge1xyXG4gICAgICAgICAgICB2YXIgbWF0cml4O1xyXG5cclxuICAgICAgICAgICAgaWYgKCAhJGVsIHx8ICEkZWwubGVuZ3RoICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBtYXRyaXggID0gJGVsLmVxKCAwICkuY3NzKCd0cmFuc2Zvcm0nKTtcclxuXHJcbiAgICAgICAgICAgIGlmICggbWF0cml4ICYmIG1hdHJpeC5pbmRleE9mKCAnbWF0cml4JyApICE9PSAtMSApIHtcclxuICAgICAgICAgICAgICAgIG1hdHJpeCA9IG1hdHJpeC5zcGxpdCgnKCcpWzFdO1xyXG4gICAgICAgICAgICAgICAgbWF0cml4ID0gbWF0cml4LnNwbGl0KCcpJylbMF07XHJcbiAgICAgICAgICAgICAgICBtYXRyaXggPSBtYXRyaXguc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hdHJpeCA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIG1hdHJpeC5sZW5ndGggKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSWYgSUVcclxuICAgICAgICAgICAgICAgIGlmICggbWF0cml4Lmxlbmd0aCA+IDEwICkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeCA9IFsgbWF0cml4WzEzXSwgbWF0cml4WzEyXSwgbWF0cml4WzBdLCBtYXRyaXhbNV0gXTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeCA9IFsgbWF0cml4WzVdLCBtYXRyaXhbNF0sIG1hdHJpeFswXSwgbWF0cml4WzNdXTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBtYXRyaXggPSBtYXRyaXgubWFwKHBhcnNlRmxvYXQpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG1hdHJpeCA9IFsgMCwgMCwgMSwgMSBdO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciB0cmFuc1JlZ2V4ID0gL1xcLip0cmFuc2xhdGVcXCgoLiopcHgsKC4qKXB4XFwpL2k7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHJhbnNSZXogPSB0cmFuc1JlZ2V4LmV4ZWMoICRlbC5lcSggMCApLmF0dHIoJ3N0eWxlJykgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoIHRyYW5zUmV6ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIG1hdHJpeFsgMCBdID0gcGFyc2VGbG9hdCggdHJhbnNSZXpbMl0gKTtcclxuICAgICAgICAgICAgICAgICAgICBtYXRyaXhbIDEgXSA9IHBhcnNlRmxvYXQoIHRyYW5zUmV6WzFdICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0b3AgICAgIDogbWF0cml4WyAwIF0sXHJcbiAgICAgICAgICAgICAgICBsZWZ0ICAgIDogbWF0cml4WyAxIF0sXHJcbiAgICAgICAgICAgICAgICBzY2FsZVggIDogbWF0cml4WyAyIF0sXHJcbiAgICAgICAgICAgICAgICBzY2FsZVkgIDogbWF0cml4WyAzIF0sXHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5IDogcGFyc2VGbG9hdCggJGVsLmNzcygnb3BhY2l0eScpICksXHJcbiAgICAgICAgICAgICAgICB3aWR0aCAgIDogJGVsLndpZHRoKCksXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQgIDogJGVsLmhlaWdodCgpXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgIH0sXHJcblxyXG5cclxuICAgICAgICAvLyBTaG9ydGN1dCBmb3Igc2V0dGluZyBcInRyYW5zbGF0ZTNkXCIgcHJvcGVydGllcyBmb3IgZWxlbWVudFxyXG4gICAgICAgIC8vIENhbiBzZXQgYmUgdXNlZCB0byBzZXQgb3BhY2l0eSwgdG9vXHJcbiAgICAgICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAgICAgc2V0VHJhbnNsYXRlIDogZnVuY3Rpb24oICRlbCwgcHJvcHMgKSB7XHJcbiAgICAgICAgICAgIHZhciBzdHIgID0gJyc7XHJcbiAgICAgICAgICAgIHZhciBjc3MgID0ge307XHJcblxyXG4gICAgICAgICAgICBpZiAoICEkZWwgfHwgIXByb3BzICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHByb3BzLmxlZnQgIT09IHVuZGVmaW5lZCB8fCBwcm9wcy50b3AgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIHN0ciA9ICggcHJvcHMubGVmdCA9PT0gdW5kZWZpbmVkID8gJGVsLnBvc2l0aW9uKCkubGVmdCA6IHByb3BzLmxlZnQgKSAgKyAncHgsICcgKyAoIHByb3BzLnRvcCA9PT0gdW5kZWZpbmVkID8gJGVsLnBvc2l0aW9uKCkudG9wIDogcHJvcHMudG9wICkgKyAncHgnO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmICggdGhpcy51c2UzZCApIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHIgPSAndHJhbnNsYXRlM2QoJyArIHN0ciArICcsIDBweCknO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyID0gJ3RyYW5zbGF0ZSgnICsgc3RyICsgJyknO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHByb3BzLnNjYWxlWCAhPT0gdW5kZWZpbmVkICYmIHByb3BzLnNjYWxlWSAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gKHN0ci5sZW5ndGggPyBzdHIgKyAnICcgOiAnJykgKyAnc2NhbGUoJyArIHByb3BzLnNjYWxlWCArICcsICcgKyBwcm9wcy5zY2FsZVkgKyAnKSc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggc3RyLmxlbmd0aCApIHtcclxuICAgICAgICAgICAgICAgIGNzcy50cmFuc2Zvcm0gPSBzdHI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggcHJvcHMub3BhY2l0eSAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgY3NzLm9wYWNpdHkgPSBwcm9wcy5vcGFjaXR5O1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIHByb3BzLndpZHRoICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBjc3Mud2lkdGggPSBwcm9wcy53aWR0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCBwcm9wcy5oZWlnaHQgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIGNzcy5oZWlnaHQgPSBwcm9wcy5oZWlnaHQ7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiAkZWwuY3NzKCBjc3MgKTtcclxuICAgICAgICB9LFxyXG5cclxuXHJcbiAgICAgICAgLy8gU2ltcGxlIENTUyB0cmFuc2l0aW9uIGhhbmRsZXJcclxuICAgICAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICAgICBhbmltYXRlIDogZnVuY3Rpb24gKCAkZWwsIHRvLCBkdXJhdGlvbiwgY2FsbGJhY2ssIGxlYXZlQW5pbWF0aW9uTmFtZSApIHtcclxuICAgICAgICAgICAgaWYgKCAkLmlzRnVuY3Rpb24oIGR1cmF0aW9uICkgKSB7XHJcbiAgICAgICAgICAgICAgICBjYWxsYmFjayA9IGR1cmF0aW9uO1xyXG4gICAgICAgICAgICAgICAgZHVyYXRpb24gPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoICEkLmlzUGxhaW5PYmplY3QoIHRvICkgKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQXR0cignc3R5bGUnKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGVsLm9uKCB0cmFuc2l0aW9uRW5kLCBmdW5jdGlvbihlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2tpcCBldmVudHMgZnJvbSBjaGlsZCBlbGVtZW50cyBhbmQgei1pbmRleCBjaGFuZ2VcclxuICAgICAgICAgICAgICAgIGlmICggZSAmJiBlLm9yaWdpbmFsRXZlbnQgJiYgKCAhJGVsLmlzKCBlLm9yaWdpbmFsRXZlbnQudGFyZ2V0ICkgfHwgZS5vcmlnaW5hbEV2ZW50LnByb3BlcnR5TmFtZSA9PSAnei1pbmRleCcgKSApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5zdG9wKCAkZWwgKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoICQuaXNQbGFpbk9iamVjdCggdG8gKSApIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCB0by5zY2FsZVggIT09IHVuZGVmaW5lZCAmJiB0by5zY2FsZVkgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJGVsLmNzcyggJ3RyYW5zaXRpb24tZHVyYXRpb24nLCAnJyApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdG8ud2lkdGggID0gTWF0aC5yb3VuZCggJGVsLndpZHRoKCkgICogdG8uc2NhbGVYICk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRvLmhlaWdodCA9IE1hdGgucm91bmQoICRlbC5oZWlnaHQoKSAqIHRvLnNjYWxlWSApO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgdG8uc2NhbGVYID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdG8uc2NhbGVZID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCAkZWwsIHRvICk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoIGxlYXZlQW5pbWF0aW9uTmFtZSAhPT0gdHJ1ZSApIHtcclxuICAgICAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoIHRvICk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKCAkLmlzRnVuY3Rpb24oIGNhbGxiYWNrICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soIGUgKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgaWYgKCAkLmlzTnVtZXJpYyggZHVyYXRpb24gKSApIHtcclxuICAgICAgICAgICAgICAgICRlbC5jc3MoICd0cmFuc2l0aW9uLWR1cmF0aW9uJywgZHVyYXRpb24gKyAnbXMnICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggJC5pc1BsYWluT2JqZWN0KCB0byApICkge1xyXG4gICAgICAgICAgICAgICAgJC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoICRlbCwgdG8gKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIHRvICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICggdG8uc2NhbGVYICYmICRlbC5oYXNDbGFzcyggJ2ZhbmN5Ym94LWltYWdlLXdyYXAnICkgKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwucGFyZW50KCkuYWRkQ2xhc3MoICdmYW5jeWJveC1pcy1zY2FsaW5nJyApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgdGhhdCBgdHJhbnNpdGlvbmVuZGAgY2FsbGJhY2sgZ2V0cyBmaXJlZFxyXG4gICAgICAgICAgICAkZWwuZGF0YShcInRpbWVyXCIsIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwudHJpZ2dlciggJ3RyYW5zaXRpb25lbmQnICk7XHJcbiAgICAgICAgICAgIH0sIGR1cmF0aW9uICsgMTYpKTtcclxuXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc3RvcCA6IGZ1bmN0aW9uKCAkZWwgKSB7XHJcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCggJGVsLmRhdGEoXCJ0aW1lclwiKSApO1xyXG5cclxuICAgICAgICAgICAgJGVsLm9mZiggJ3RyYW5zaXRpb25lbmQnICkuY3NzKCAndHJhbnNpdGlvbi1kdXJhdGlvbicsICcnICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoICRlbC5oYXNDbGFzcyggJ2ZhbmN5Ym94LWltYWdlLXdyYXAnICkgKSB7XHJcbiAgICAgICAgICAgICAgICAkZWwucGFyZW50KCkucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1pcy1zY2FsaW5nJyApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG5cclxuICAgIC8vIERlZmF1bHQgY2xpY2sgaGFuZGxlciBmb3IgXCJmYW5jeWJveGVkXCIgbGlua3NcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgZnVuY3Rpb24gX3J1biggZSApIHtcclxuICAgICAgICB2YXIgJHRhcmdldFx0PSAkKCBlLmN1cnJlbnRUYXJnZXQgKSxcclxuICAgICAgICAgICAgb3B0c1x0PSBlLmRhdGEgPyBlLmRhdGEub3B0aW9ucyA6IHt9LFxyXG4gICAgICAgICAgICB2YWx1ZVx0PSAkdGFyZ2V0LmF0dHIoICdkYXRhLWZhbmN5Ym94JyApIHx8ICcnLFxyXG4gICAgICAgICAgICBpbmRleFx0PSAwLFxyXG4gICAgICAgICAgICBpdGVtcyAgID0gW107XHJcblxyXG4gICAgICAgIC8vIEF2b2lkIG9wZW5pbmcgbXVsdGlwbGUgdGltZXNcclxuICAgICAgICBpZiAoIGUuaXNEZWZhdWx0UHJldmVudGVkKCkgKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgLy8gR2V0IGFsbCByZWxhdGVkIGl0ZW1zIGFuZCBmaW5kIGluZGV4IGZvciBjbGlja2VkIG9uZVxyXG4gICAgICAgIGlmICggdmFsdWUgKSB7XHJcbiAgICAgICAgICAgIGl0ZW1zID0gb3B0cy5zZWxlY3RvciA/ICQoIG9wdHMuc2VsZWN0b3IgKSA6ICggZS5kYXRhID8gZS5kYXRhLml0ZW1zIDogW10gKTtcclxuICAgICAgICAgICAgaXRlbXMgPSBpdGVtcy5sZW5ndGggPyBpdGVtcy5maWx0ZXIoICdbZGF0YS1mYW5jeWJveD1cIicgKyB2YWx1ZSArICdcIl0nICkgOiAkKCAnW2RhdGEtZmFuY3lib3g9XCInICsgdmFsdWUgKyAnXCJdJyApO1xyXG5cclxuICAgICAgICAgICAgaW5kZXggPSBpdGVtcy5pbmRleCggJHRhcmdldCApO1xyXG5cclxuICAgICAgICAgICAgLy8gU29tZXRpbWVzIGN1cnJlbnQgaXRlbSBjYW4gbm90IGJlIGZvdW5kXHJcbiAgICAgICAgICAgIC8vIChmb3IgZXhhbXBsZSwgd2hlbiBzbGlkZXIgY2xvbmVzIGl0ZW1zKVxyXG4gICAgICAgICAgICBpZiAoIGluZGV4IDwgMCApIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBpdGVtcyA9IFsgJHRhcmdldCBdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgJC5mYW5jeWJveC5vcGVuKCBpdGVtcywgb3B0cywgaW5kZXggKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gQ3JlYXRlIGEgalF1ZXJ5IHBsdWdpblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICQuZm4uZmFuY3lib3ggPSBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgICAgIHZhciBzZWxlY3RvcjtcclxuXHJcbiAgICAgICAgb3B0aW9ucyAgPSBvcHRpb25zIHx8IHt9O1xyXG4gICAgICAgIHNlbGVjdG9yID0gb3B0aW9ucy5zZWxlY3RvciB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKCBzZWxlY3RvciApIHtcclxuXHJcbiAgICAgICAgICAgICQoICdib2R5JyApLm9mZiggJ2NsaWNrLmZiLXN0YXJ0Jywgc2VsZWN0b3IgKS5vbiggJ2NsaWNrLmZiLXN0YXJ0Jywgc2VsZWN0b3IsIHtcclxuICAgICAgICAgICAgICAgIG9wdGlvbnMgOiBvcHRpb25zXHJcbiAgICAgICAgICAgIH0sIF9ydW4gKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHRoaXMub2ZmKCAnY2xpY2suZmItc3RhcnQnICkub24oICdjbGljay5mYi1zdGFydCcsIHtcclxuICAgICAgICAgICAgICAgIGl0ZW1zICAgOiB0aGlzLFxyXG4gICAgICAgICAgICAgICAgb3B0aW9ucyA6IG9wdGlvbnNcclxuICAgICAgICAgICAgfSwgX3J1bik7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgICB9O1xyXG5cclxuXHJcbiAgICAvLyBTZWxmIGluaXRpYWxpemluZyBwbHVnaW5cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgICRELm9uKCAnY2xpY2suZmItc3RhcnQnLCAnW2RhdGEtZmFuY3lib3hdJywgX3J1biApO1xyXG5cclxufSggd2luZG93LCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSB8fCBqUXVlcnkgKSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gTWVkaWFcclxuLy8gQWRkcyBhZGRpdGlvbmFsIG1lZGlhIHR5cGUgc3VwcG9ydFxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG47KGZ1bmN0aW9uICgkKSB7XHJcblxyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gRm9ybWF0cyBtYXRjaGluZyB1cmwgdG8gZmluYWwgZm9ybVxyXG5cclxuXHR2YXIgZm9ybWF0ID0gZnVuY3Rpb24gKHVybCwgcmV6LCBwYXJhbXMpIHtcclxuXHRcdGlmICggIXVybCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHBhcmFtcyA9IHBhcmFtcyB8fCAnJztcclxuXHJcblx0XHRpZiAoICQudHlwZShwYXJhbXMpID09PSBcIm9iamVjdFwiICkge1xyXG5cdFx0XHRwYXJhbXMgPSAkLnBhcmFtKHBhcmFtcywgdHJ1ZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0JC5lYWNoKHJleiwgZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcclxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoJyQnICsga2V5LCB2YWx1ZSB8fCAnJyk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAocGFyYW1zLmxlbmd0aCkge1xyXG5cdFx0XHR1cmwgKz0gKHVybC5pbmRleE9mKCc/JykgPiAwID8gJyYnIDogJz8nKSArIHBhcmFtcztcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdXJsO1xyXG5cdH07XHJcblxyXG5cdC8vIE9iamVjdCBjb250YWluaW5nIHByb3BlcnRpZXMgZm9yIGVhY2ggbWVkaWEgdHlwZVxyXG5cclxuXHR2YXIgZGVmYXVsdHMgPSB7XHJcblx0XHR5b3V0dWJlIDoge1xyXG5cdFx0XHRtYXRjaGVyIDogLyh5b3V0dWJlXFwuY29tfHlvdXR1XFwuYmV8eW91dHViZVxcLW5vY29va2llXFwuY29tKVxcLyh3YXRjaFxcPyguKiYpP3Y9fHZcXC98dVxcL3xlbWJlZFxcLz8pPyh2aWRlb3Nlcmllc1xcP2xpc3Q9KC4qKXxbXFx3LV17MTF9fFxcP2xpc3RUeXBlPSguKikmbGlzdD0oLiopKSguKikvaSxcclxuXHRcdFx0cGFyYW1zICA6IHtcclxuXHRcdFx0XHRhdXRvcGxheSA6IDEsXHJcblx0XHRcdFx0YXV0b2hpZGUgOiAxLFxyXG5cdFx0XHRcdGZzICA6IDEsXHJcblx0XHRcdFx0cmVsIDogMCxcclxuXHRcdFx0XHRoZCAgOiAxLFxyXG5cdFx0XHRcdHdtb2RlIDogJ3RyYW5zcGFyZW50JyxcclxuXHRcdFx0XHRlbmFibGVqc2FwaSA6IDEsXHJcblx0XHRcdFx0aHRtbDUgOiAxXHJcblx0XHRcdH0sXHJcblx0XHRcdHBhcmFtUGxhY2UgOiA4LFxyXG5cdFx0XHR0eXBlICA6ICdpZnJhbWUnLFxyXG5cdFx0XHR1cmwgICA6ICcvL3d3dy55b3V0dWJlLmNvbS9lbWJlZC8kNCcsXHJcblx0XHRcdHRodW1iIDogJy8vaW1nLnlvdXR1YmUuY29tL3ZpLyQ0L2hxZGVmYXVsdC5qcGcnXHJcblx0XHR9LFxyXG5cclxuXHRcdHZpbWVvIDoge1xyXG5cdFx0XHRtYXRjaGVyIDogL14uK3ZpbWVvLmNvbVxcLyguKlxcLyk/KFtcXGRdKykoLiopPy8sXHJcblx0XHRcdHBhcmFtcyAgOiB7XHJcblx0XHRcdFx0YXV0b3BsYXkgOiAxLFxyXG5cdFx0XHRcdGhkIDogMSxcclxuXHRcdFx0XHRzaG93X3RpdGxlICAgIDogMSxcclxuXHRcdFx0XHRzaG93X2J5bGluZSAgIDogMSxcclxuXHRcdFx0XHRzaG93X3BvcnRyYWl0IDogMCxcclxuXHRcdFx0XHRmdWxsc2NyZWVuICAgIDogMSxcclxuXHRcdFx0XHRhcGkgOiAxXHJcblx0XHRcdH0sXHJcblx0XHRcdHBhcmFtUGxhY2UgOiAzLFxyXG5cdFx0XHR0eXBlIDogJ2lmcmFtZScsXHJcblx0XHRcdHVybCA6ICcvL3BsYXllci52aW1lby5jb20vdmlkZW8vJDInXHJcblx0XHR9LFxyXG5cclxuXHRcdG1ldGFjYWZlIDoge1xyXG5cdFx0XHRtYXRjaGVyIDogL21ldGFjYWZlLmNvbVxcL3dhdGNoXFwvKFxcZCspXFwvKC4qKT8vLFxyXG5cdFx0XHR0eXBlICAgIDogJ2lmcmFtZScsXHJcblx0XHRcdHVybCAgICAgOiAnLy93d3cubWV0YWNhZmUuY29tL2VtYmVkLyQxLz9hcD0xJ1xyXG5cdFx0fSxcclxuXHJcblx0XHRkYWlseW1vdGlvbiA6IHtcclxuXHRcdFx0bWF0Y2hlciA6IC9kYWlseW1vdGlvbi5jb21cXC92aWRlb1xcLyguKilcXC8/KC4qKS8sXHJcblx0XHRcdHBhcmFtcyA6IHtcclxuXHRcdFx0XHRhZGRpdGlvbmFsSW5mb3MgOiAwLFxyXG5cdFx0XHRcdGF1dG9TdGFydCA6IDFcclxuXHRcdFx0fSxcclxuXHRcdFx0dHlwZSA6ICdpZnJhbWUnLFxyXG5cdFx0XHR1cmwgIDogJy8vd3d3LmRhaWx5bW90aW9uLmNvbS9lbWJlZC92aWRlby8kMSdcclxuXHRcdH0sXHJcblxyXG5cdFx0dmluZSA6IHtcclxuXHRcdFx0bWF0Y2hlciA6IC92aW5lLmNvXFwvdlxcLyhbYS16QS1aMC05XFw/XFw9XFwtXSspLyxcclxuXHRcdFx0dHlwZSAgICA6ICdpZnJhbWUnLFxyXG5cdFx0XHR1cmwgICAgIDogJy8vdmluZS5jby92LyQxL2VtYmVkL3NpbXBsZSdcclxuXHRcdH0sXHJcblxyXG5cdFx0aW5zdGFncmFtIDoge1xyXG5cdFx0XHRtYXRjaGVyIDogLyhpbnN0YWdyXFwuYW18aW5zdGFncmFtXFwuY29tKVxcL3BcXC8oW2EtekEtWjAtOV9cXC1dKylcXC8/L2ksXHJcblx0XHRcdHR5cGUgICAgOiAnaW1hZ2UnLFxyXG5cdFx0XHR1cmwgICAgIDogJy8vJDEvcC8kMi9tZWRpYS8/c2l6ZT1sJ1xyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBFeGFtcGxlczpcclxuXHRcdC8vIGh0dHA6Ly9tYXBzLmdvb2dsZS5jb20vP2xsPTQ4Ljg1Nzk5NSwyLjI5NDI5NyZzcG49MC4wMDc2NjYsMC4wMjExMzYmdD1tJno9MTZcclxuXHRcdC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9AMzcuNzg1MjAwNiwtMTIyLjQxNDYzNTUsMTQuNjV6XHJcblx0XHQvLyBodHRwczovL3d3dy5nb29nbGUuY29tL21hcHMvcGxhY2UvR29vZ2xlcGxleC9AMzcuNDIyMDA0MSwtMTIyLjA4MzM0OTQsMTd6L2RhdGE9ITRtNSEzbTQhMXMweDA6MHg2YzI5NmM2NjYxOTM2N2UwIThtMiEzZDM3LjQyMTk5OTghNGQtMTIyLjA4NDA1NzJcclxuXHRcdGdtYXBfcGxhY2UgOiB7XHJcblx0XHRcdG1hdGNoZXIgOiAvKG1hcHNcXC4pP2dvb2dsZVxcLihbYS16XXsyLDN9KFxcLlthLXpdezJ9KT8pXFwvKCgobWFwc1xcLyhwbGFjZVxcLyguKilcXC8pP1xcQCguKiksKFxcZCsuP1xcZCs/KXopKXwoXFw/bGw9KSkoLiopPy9pLFxyXG5cdFx0XHR0eXBlICAgIDogJ2lmcmFtZScsXHJcblx0XHRcdHVybCAgICAgOiBmdW5jdGlvbiAocmV6KSB7XHJcblx0XHRcdFx0cmV0dXJuICcvL21hcHMuZ29vZ2xlLicgKyByZXpbMl0gKyAnLz9sbD0nICsgKCByZXpbOV0gPyByZXpbOV0gKyAnJno9JyArIE1hdGguZmxvb3IoICByZXpbMTBdICApICsgKCByZXpbMTJdID8gcmV6WzEyXS5yZXBsYWNlKC9eXFwvLywgXCImXCIpIDogJycgKSAgOiByZXpbMTJdICkgKyAnJm91dHB1dD0nICsgKCByZXpbMTJdICYmIHJlelsxMl0uaW5kZXhPZignbGF5ZXI9YycpID4gMCA/ICdzdmVtYmVkJyA6ICdlbWJlZCcgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQvLyBFeGFtcGxlczpcclxuXHRcdC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvRW1waXJlK1N0YXRlK0J1aWxkaW5nL1xyXG5cdFx0Ly8gaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tYXBzL3NlYXJjaC8/YXBpPTEmcXVlcnk9Y2VudHVyeWxpbmsrZmllbGRcclxuXHRcdC8vIGh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vbWFwcy9zZWFyY2gvP2FwaT0xJnF1ZXJ5PTQ3LjU5NTE1MTgsLTEyMi4zMzE2MzkzXHJcblx0XHRnbWFwX3NlYXJjaCA6IHtcclxuXHRcdFx0bWF0Y2hlciA6IC8obWFwc1xcLik/Z29vZ2xlXFwuKFthLXpdezIsM30oXFwuW2Etel17Mn0pPylcXC8obWFwc1xcL3NlYXJjaFxcLykoLiopL2ksXHJcblx0XHRcdHR5cGUgICAgOiAnaWZyYW1lJyxcclxuXHRcdFx0dXJsICAgICA6IGZ1bmN0aW9uIChyZXopIHtcclxuXHRcdFx0XHRyZXR1cm4gJy8vbWFwcy5nb29nbGUuJyArIHJlelsyXSArICcvbWFwcz9xPScgKyByZXpbNV0ucmVwbGFjZSgncXVlcnk9JywgJ3E9JykucmVwbGFjZSgnYXBpPTEnLCAnJykgKyAnJm91dHB1dD1lbWJlZCc7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9O1xyXG5cclxuXHQkKGRvY3VtZW50KS5vbignb2JqZWN0TmVlZHNUeXBlLmZiJywgZnVuY3Rpb24gKGUsIGluc3RhbmNlLCBpdGVtKSB7XHJcblxyXG5cdFx0dmFyIHVybFx0ID0gaXRlbS5zcmMgfHwgJycsXHJcblx0XHRcdHR5cGUgPSBmYWxzZSxcclxuXHRcdFx0bWVkaWEsXHJcblx0XHRcdHRodW1iLFxyXG5cdFx0XHRyZXosXHJcblx0XHRcdHBhcmFtcyxcclxuXHRcdFx0dXJsUGFyYW1zLFxyXG5cdFx0XHRwYXJhbU9iaixcclxuXHRcdFx0cHJvdmlkZXI7XHJcblxyXG5cdFx0bWVkaWEgPSAkLmV4dGVuZCggdHJ1ZSwge30sIGRlZmF1bHRzLCBpdGVtLm9wdHMubWVkaWEgKTtcclxuXHJcblx0XHQvLyBMb29rIGZvciBhbnkgbWF0Y2hpbmcgbWVkaWEgdHlwZVxyXG5cdFx0JC5lYWNoKG1lZGlhLCBmdW5jdGlvbiAoIHByb3ZpZGVyTmFtZSwgcHJvdmlkZXJPcHRzICkge1xyXG5cdFx0XHRyZXogPSB1cmwubWF0Y2goIHByb3ZpZGVyT3B0cy5tYXRjaGVyICk7XHJcblxyXG5cdFx0XHRpZiAoICFyZXogKSB7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR0eXBlICAgICA9IHByb3ZpZGVyT3B0cy50eXBlO1xyXG5cdFx0XHRwYXJhbU9iaiA9IHt9O1xyXG5cclxuXHRcdFx0aWYgKCBwcm92aWRlck9wdHMucGFyYW1QbGFjZSAmJiByZXpbIHByb3ZpZGVyT3B0cy5wYXJhbVBsYWNlIF0gKSB7XHJcblx0XHRcdFx0dXJsUGFyYW1zID0gcmV6WyBwcm92aWRlck9wdHMucGFyYW1QbGFjZSBdO1xyXG5cclxuXHRcdFx0XHRpZiAoIHVybFBhcmFtc1sgMCBdID09ICc/JyApIHtcclxuXHRcdFx0XHRcdHVybFBhcmFtcyA9IHVybFBhcmFtcy5zdWJzdHJpbmcoMSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR1cmxQYXJhbXMgPSB1cmxQYXJhbXMuc3BsaXQoJyYnKTtcclxuXHJcblx0XHRcdFx0Zm9yICggdmFyIG0gPSAwOyBtIDwgdXJsUGFyYW1zLmxlbmd0aDsgKyttICkge1xyXG5cdFx0XHRcdFx0dmFyIHAgPSB1cmxQYXJhbXNbIG0gXS5zcGxpdCgnPScsIDIpO1xyXG5cclxuXHRcdFx0XHRcdGlmICggcC5sZW5ndGggPT0gMiApIHtcclxuXHRcdFx0XHRcdFx0cGFyYW1PYmpbIHBbMF0gXSA9IGRlY29kZVVSSUNvbXBvbmVudCggcFsxXS5yZXBsYWNlKC9cXCsvZywgXCIgXCIpICk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRwYXJhbXMgPSAkLmV4dGVuZCggdHJ1ZSwge30sIHByb3ZpZGVyT3B0cy5wYXJhbXMsIGl0ZW0ub3B0c1sgcHJvdmlkZXJOYW1lIF0sIHBhcmFtT2JqICk7XHJcblxyXG5cdFx0XHR1cmwgICA9ICQudHlwZSggcHJvdmlkZXJPcHRzLnVybCApID09PSBcImZ1bmN0aW9uXCIgPyBwcm92aWRlck9wdHMudXJsLmNhbGwoIHRoaXMsIHJleiwgcGFyYW1zLCBpdGVtICkgOiBmb3JtYXQoIHByb3ZpZGVyT3B0cy51cmwsIHJleiwgcGFyYW1zICk7XHJcblx0XHRcdHRodW1iID0gJC50eXBlKCBwcm92aWRlck9wdHMudGh1bWIgKSA9PT0gXCJmdW5jdGlvblwiID8gcHJvdmlkZXJPcHRzLnRodW1iLmNhbGwoIHRoaXMsIHJleiwgcGFyYW1zLCBpdGVtICkgOiBmb3JtYXQoIHByb3ZpZGVyT3B0cy50aHVtYiwgcmV6ICk7XHJcblxyXG5cdFx0XHRpZiAoIHByb3ZpZGVyTmFtZSA9PT0gJ3ZpbWVvJyApIHtcclxuXHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZSgnJiUyMycsICcjJyk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdC8vIElmIGl0IGlzIGZvdW5kLCB0aGVuIGNoYW5nZSBjb250ZW50IHR5cGUgYW5kIHVwZGF0ZSB0aGUgdXJsXHJcblxyXG5cdFx0aWYgKCB0eXBlICkge1xyXG5cdFx0XHRpdGVtLnNyYyAgPSB1cmw7XHJcblx0XHRcdGl0ZW0udHlwZSA9IHR5cGU7XHJcblxyXG5cdFx0XHRpZiAoICFpdGVtLm9wdHMudGh1bWIgJiYgISggaXRlbS5vcHRzLiR0aHVtYiAmJiBpdGVtLm9wdHMuJHRodW1iLmxlbmd0aCApICkge1xyXG5cdFx0XHRcdGl0ZW0ub3B0cy50aHVtYiA9IHRodW1iO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIHR5cGUgPT09ICdpZnJhbWUnICkge1xyXG5cdFx0XHRcdCQuZXh0ZW5kKHRydWUsIGl0ZW0ub3B0cywge1xyXG5cdFx0XHRcdFx0aWZyYW1lIDoge1xyXG5cdFx0XHRcdFx0XHRwcmVsb2FkIDogZmFsc2UsXHJcblx0XHRcdFx0XHRcdGF0dHIgOiB7XHJcblx0XHRcdFx0XHRcdFx0c2Nyb2xsaW5nIDogXCJub1wiXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0aXRlbS5jb250ZW50UHJvdmlkZXIgPSBwcm92aWRlcjtcclxuXHJcblx0XHRcdFx0aXRlbS5vcHRzLnNsaWRlQ2xhc3MgKz0gJyBmYW5jeWJveC1zbGlkZS0tJyArICggcHJvdmlkZXIgPT0gJ2dtYXBfcGxhY2UnIHx8IHByb3ZpZGVyID09ICdnbWFwX3NlYXJjaCcgPyAnbWFwJyA6ICd2aWRlbycgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSBpZiAoIHVybCApIHtcclxuXHRcdFx0aXRlbS50eXBlID0gaXRlbS5vcHRzLmRlZmF1bHRUeXBlO1xyXG5cdFx0fVxyXG5cclxuXHR9KTtcclxuXHJcbn0oIHdpbmRvdy5qUXVlcnkgfHwgalF1ZXJ5ICkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIEd1ZXN0dXJlc1xyXG4vLyBBZGRzIHRvdWNoIGd1ZXN0dXJlcywgaGFuZGxlcyBjbGljayBhbmQgdGFwIGV2ZW50c1xyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG47KGZ1bmN0aW9uICh3aW5kb3csIGRvY3VtZW50LCAkKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHR2YXIgcmVxdWVzdEFGcmFtZSA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICAvLyBpZiBhbGwgZWxzZSBmYWlscywgdXNlIHNldFRpbWVvdXRcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICB9KSgpO1xyXG5cclxuXHJcbiAgICB2YXIgY2FuY2VsQUZyYW1lID0gKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcclxuICAgICAgICAgICAgICAgIHdpbmRvdy5tb3pDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICAgICAgd2luZG93Lm9DYW5jZWxBbmltYXRpb25GcmFtZSB8fFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChpZCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgfSkoKTtcclxuXHJcblxyXG5cdHZhciBwb2ludGVycyA9IGZ1bmN0aW9uKCBlICkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuXHRcdGUgPSBlLm9yaWdpbmFsRXZlbnQgfHwgZSB8fCB3aW5kb3cuZTtcclxuXHRcdGUgPSBlLnRvdWNoZXMgJiYgZS50b3VjaGVzLmxlbmd0aCA/IGUudG91Y2hlcyA6ICggZS5jaGFuZ2VkVG91Y2hlcyAmJiBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aCA/IGUuY2hhbmdlZFRvdWNoZXMgOiBbIGUgXSApO1xyXG5cclxuXHRcdGZvciAoIHZhciBrZXkgaW4gZSApIHtcclxuXHJcblx0XHRcdGlmICggZVsga2V5IF0ucGFnZVggKSB7XHJcblx0XHRcdFx0cmVzdWx0LnB1c2goIHsgeCA6IGVbIGtleSBdLnBhZ2VYLCB5IDogZVsga2V5IF0ucGFnZVkgfSApO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggZVsga2V5IF0uY2xpZW50WCApIHtcclxuXHRcdFx0XHRyZXN1bHQucHVzaCggeyB4IDogZVsga2V5IF0uY2xpZW50WCwgeSA6IGVbIGtleSBdLmNsaWVudFkgfSApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9O1xyXG5cclxuXHR2YXIgZGlzdGFuY2UgPSBmdW5jdGlvbiggcG9pbnQyLCBwb2ludDEsIHdoYXQgKSB7XHJcblx0XHRpZiAoICFwb2ludDEgfHwgIXBvaW50MiApIHtcclxuXHRcdFx0cmV0dXJuIDA7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCB3aGF0ID09PSAneCcgKSB7XHJcblx0XHRcdHJldHVybiBwb2ludDIueCAtIHBvaW50MS54O1xyXG5cclxuXHRcdH0gZWxzZSBpZiAoIHdoYXQgPT09ICd5JyApIHtcclxuXHRcdFx0cmV0dXJuIHBvaW50Mi55IC0gcG9pbnQxLnk7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIE1hdGguc3FydCggTWF0aC5wb3coIHBvaW50Mi54IC0gcG9pbnQxLngsIDIgKSArIE1hdGgucG93KCBwb2ludDIueSAtIHBvaW50MS55LCAyICkgKTtcclxuXHR9O1xyXG5cclxuXHR2YXIgaXNDbGlja2FibGUgPSBmdW5jdGlvbiggJGVsICkge1xyXG5cclxuXHRcdGlmICggJGVsLmlzKCdhLGFyZWEsYnV0dG9uLFtyb2xlPVwiYnV0dG9uXCJdLGlucHV0LGxhYmVsLHNlbGVjdCxzdW1tYXJ5LHRleHRhcmVhJykgfHwgJC5pc0Z1bmN0aW9uKCAkZWwuZ2V0KDApLm9uY2xpY2sgKSB8fCAkZWwuZGF0YSgnc2VsZWN0YWJsZScpICkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDaGVjayBmb3IgYXR0cmlidXRlcyBsaWtlIGRhdGEtZmFuY3lib3gtbmV4dCBvciBkYXRhLWZhbmN5Ym94LWNsb3NlXHJcblx0XHRmb3IgKCB2YXIgaSA9IDAsIGF0dHMgPSAkZWxbMF0uYXR0cmlidXRlcywgbiA9IGF0dHMubGVuZ3RoOyBpIDwgbjsgaSsrICkge1xyXG4gICAgICAgICAgICBpZiAoIGF0dHNbaV0ubm9kZU5hbWUuc3Vic3RyKDAsIDE0KSA9PT0gJ2RhdGEtZmFuY3lib3gtJyApIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuXHQgXHRyZXR1cm4gZmFsc2U7XHJcblx0fTtcclxuXHJcblx0dmFyIGhhc1Njcm9sbGJhcnMgPSBmdW5jdGlvbiggZWwgKSB7XHJcblx0XHR2YXIgb3ZlcmZsb3dZID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoIGVsIClbJ292ZXJmbG93LXknXTtcclxuXHRcdHZhciBvdmVyZmxvd1ggPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSggZWwgKVsnb3ZlcmZsb3cteCddO1xyXG5cclxuXHRcdHZhciB2ZXJ0aWNhbCAgID0gKG92ZXJmbG93WSA9PT0gJ3Njcm9sbCcgfHwgb3ZlcmZsb3dZID09PSAnYXV0bycpICYmIGVsLnNjcm9sbEhlaWdodCA+IGVsLmNsaWVudEhlaWdodDtcclxuXHRcdHZhciBob3Jpem9udGFsID0gKG92ZXJmbG93WCA9PT0gJ3Njcm9sbCcgfHwgb3ZlcmZsb3dYID09PSAnYXV0bycpICYmIGVsLnNjcm9sbFdpZHRoID4gZWwuY2xpZW50V2lkdGg7XHJcblxyXG5cdFx0cmV0dXJuIHZlcnRpY2FsIHx8IGhvcml6b250YWw7XHJcblx0fTtcclxuXHJcblx0dmFyIGlzU2Nyb2xsYWJsZSA9IGZ1bmN0aW9uICggJGVsICkge1xyXG5cdFx0dmFyIHJleiA9IGZhbHNlO1xyXG5cclxuXHRcdHdoaWxlICggdHJ1ZSApIHtcclxuXHRcdFx0cmV6XHQ9IGhhc1Njcm9sbGJhcnMoICRlbC5nZXQoMCkgKTtcclxuXHJcblx0XHRcdGlmICggcmV6ICkge1xyXG5cdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQkZWwgPSAkZWwucGFyZW50KCk7XHJcblxyXG5cdFx0XHRpZiAoICEkZWwubGVuZ3RoIHx8ICRlbC5oYXNDbGFzcyggJ2ZhbmN5Ym94LXN0YWdlJyApIHx8ICRlbC5pcyggJ2JvZHknICkgKSB7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gcmV6O1xyXG5cdH07XHJcblxyXG5cclxuXHR2YXIgR3Vlc3R1cmVzID0gZnVuY3Rpb24gKCBpbnN0YW5jZSApIHtcclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRzZWxmLmluc3RhbmNlID0gaW5zdGFuY2U7XHJcblxyXG5cdFx0c2VsZi4kYmcgICAgICAgID0gaW5zdGFuY2UuJHJlZnMuYmc7XHJcblx0XHRzZWxmLiRzdGFnZSAgICAgPSBpbnN0YW5jZS4kcmVmcy5zdGFnZTtcclxuXHRcdHNlbGYuJGNvbnRhaW5lciA9IGluc3RhbmNlLiRyZWZzLmNvbnRhaW5lcjtcclxuXHJcblx0XHRzZWxmLmRlc3Ryb3koKTtcclxuXHJcblx0XHRzZWxmLiRjb250YWluZXIub24oICd0b3VjaHN0YXJ0LmZiLnRvdWNoIG1vdXNlZG93bi5mYi50b3VjaCcsICQucHJveHkoc2VsZiwgJ29udG91Y2hzdGFydCcpICk7XHJcblx0fTtcclxuXHJcblx0R3Vlc3R1cmVzLnByb3RvdHlwZS5kZXN0cm95ID0gZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLiRjb250YWluZXIub2ZmKCAnLmZiLnRvdWNoJyApO1xyXG5cdH07XHJcblxyXG5cdEd1ZXN0dXJlcy5wcm90b3R5cGUub250b3VjaHN0YXJ0ID0gZnVuY3Rpb24oIGUgKSB7XHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0dmFyICR0YXJnZXQgID0gJCggZS50YXJnZXQgKTtcclxuXHRcdHZhciBpbnN0YW5jZSA9IHNlbGYuaW5zdGFuY2U7XHJcblx0XHR2YXIgY3VycmVudCAgPSBpbnN0YW5jZS5jdXJyZW50O1xyXG5cdFx0dmFyICRjb250ZW50ID0gY3VycmVudC4kY29udGVudDtcclxuXHJcblx0XHR2YXIgaXNUb3VjaERldmljZSA9ICggZS50eXBlID09ICd0b3VjaHN0YXJ0JyApO1xyXG5cclxuXHRcdC8vIERvIG5vdCByZXNwb25kIHRvIGJvdGggZXZlbnRzXHJcblx0XHRpZiAoIGlzVG91Y2hEZXZpY2UgKSB7XHJcblx0ICAgICAgICBzZWxmLiRjb250YWluZXIub2ZmKCAnbW91c2Vkb3duLmZiLnRvdWNoJyApO1xyXG5cdCAgICB9XHJcblxyXG5cdFx0Ly8gSWdub3JlIGNsaWNrcyB3aGlsZSB6b29taW5nIG9yIGNsb3NpbmdcclxuXHRcdGlmICggIWN1cnJlbnQgfHwgc2VsZi5pbnN0YW5jZS5pc0FuaW1hdGluZyB8fCBzZWxmLmluc3RhbmNlLmlzQ2xvc2luZyApIHtcclxuXHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElnbm9yZSByaWdodCBjbGlja1xyXG5cdFx0aWYgKCBlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LmJ1dHRvbiA9PSAyICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gSWdub3JlIHRhcGluZyBvbiBsaW5rcywgYnV0dG9ucywgaW5wdXQgZWxlbWVudHNcclxuXHRcdGlmICggISR0YXJnZXQubGVuZ3RoIHx8IGlzQ2xpY2thYmxlKCAkdGFyZ2V0ICkgfHwgaXNDbGlja2FibGUoICR0YXJnZXQucGFyZW50KCkgKSApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIElnbm9yZSBjbGlja3Mgb24gdGhlIHNjcm9sbGJhclxyXG5cdFx0aWYgKCBlLm9yaWdpbmFsRXZlbnQuY2xpZW50WCA+ICR0YXJnZXRbMF0uY2xpZW50V2lkdGggKyAkdGFyZ2V0Lm9mZnNldCgpLmxlZnQgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRzZWxmLnN0YXJ0UG9pbnRzID0gcG9pbnRlcnMoIGUgKTtcclxuXHJcblx0XHQvLyBQcmV2ZW50IHpvb21pbmcgaWYgYWxyZWFkeSBzd2lwaW5nXHJcblx0XHRpZiAoICFzZWxmLnN0YXJ0UG9pbnRzIHx8ICggc2VsZi5zdGFydFBvaW50cy5sZW5ndGggPiAxICYmIGluc3RhbmNlLmlzU2xpZGluZyApICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi4kdGFyZ2V0ICA9ICR0YXJnZXQ7XHJcblx0XHRzZWxmLiRjb250ZW50ID0gJGNvbnRlbnQ7XHJcblx0XHRzZWxmLmNhblRhcCAgID0gdHJ1ZTtcclxuXHRcdHNlbGYub3B0cyAgICAgPSBjdXJyZW50Lm9wdHMudG91Y2g7XHJcblxyXG5cdFx0JChkb2N1bWVudCkub2ZmKCAnLmZiLnRvdWNoJyApO1xyXG5cclxuXHRcdCQoZG9jdW1lbnQpLm9uKCBpc1RvdWNoRGV2aWNlID8gJ3RvdWNoZW5kLmZiLnRvdWNoIHRvdWNoY2FuY2VsLmZiLnRvdWNoJyA6ICdtb3VzZXVwLmZiLnRvdWNoIG1vdXNlbGVhdmUuZmIudG91Y2gnLCAgJC5wcm94eShzZWxmLCBcIm9udG91Y2hlbmRcIikpO1xyXG5cdFx0JChkb2N1bWVudCkub24oIGlzVG91Y2hEZXZpY2UgPyAndG91Y2htb3ZlLmZiLnRvdWNoJyA6ICdtb3VzZW1vdmUuZmIudG91Y2gnLCAgJC5wcm94eShzZWxmLCBcIm9udG91Y2htb3ZlXCIpKTtcclxuXHJcblx0XHRpZiAoICEoc2VsZi5vcHRzIHx8IGluc3RhbmNlLmNhblBhbigpICkgfHwgISggJHRhcmdldC5pcyggc2VsZi4kc3RhZ2UgKSB8fCBzZWxmLiRzdGFnZS5maW5kKCAkdGFyZ2V0ICkubGVuZ3RoICkgKSB7XHJcblxyXG5cdFx0XHQvLyBQcmV2ZW50IGdob3N0aW5nXHJcblx0XHRcdGlmICggJHRhcmdldC5pcygnaW1nJykgKSB7XHJcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcblx0XHRpZiAoICEoICQuZmFuY3lib3guaXNNb2JpbGUgJiYgKCBpc1Njcm9sbGFibGUoIHNlbGYuJHRhcmdldCApIHx8IGlzU2Nyb2xsYWJsZSggc2VsZi4kdGFyZ2V0LnBhcmVudCgpICkgKSApICkge1xyXG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5jYW52YXNXaWR0aCAgPSBNYXRoLnJvdW5kKCBjdXJyZW50LiRzbGlkZVswXS5jbGllbnRXaWR0aCApO1xyXG5cdFx0c2VsZi5jYW52YXNIZWlnaHQgPSBNYXRoLnJvdW5kKCBjdXJyZW50LiRzbGlkZVswXS5jbGllbnRIZWlnaHQgKTtcclxuXHJcblx0XHRzZWxmLnN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cdFx0c2VsZi5kaXN0YW5jZVggPSBzZWxmLmRpc3RhbmNlWSA9IHNlbGYuZGlzdGFuY2UgPSAwO1xyXG5cclxuXHRcdHNlbGYuaXNQYW5uaW5nID0gZmFsc2U7XHJcblx0XHRzZWxmLmlzU3dpcGluZyA9IGZhbHNlO1xyXG5cdFx0c2VsZi5pc1pvb21pbmcgPSBmYWxzZTtcclxuXHJcblx0XHRzZWxmLnNsaWRlclN0YXJ0UG9zICA9IHNlbGYuc2xpZGVyTGFzdFBvcyB8fCB7IHRvcDogMCwgbGVmdDogMCB9O1xyXG5cdFx0c2VsZi5jb250ZW50U3RhcnRQb3MgPSAkLmZhbmN5Ym94LmdldFRyYW5zbGF0ZSggc2VsZi4kY29udGVudCApO1xyXG5cdFx0c2VsZi5jb250ZW50TGFzdFBvcyAgPSBudWxsO1xyXG5cclxuXHRcdGlmICggc2VsZi5zdGFydFBvaW50cy5sZW5ndGggPT09IDEgJiYgIXNlbGYuaXNab29taW5nICkge1xyXG5cdFx0XHRzZWxmLmNhblRhcCA9ICFpbnN0YW5jZS5pc1NsaWRpbmc7XHJcblxyXG5cdFx0XHRpZiAoIGN1cnJlbnQudHlwZSA9PT0gJ2ltYWdlJyAmJiAoIHNlbGYuY29udGVudFN0YXJ0UG9zLndpZHRoID4gc2VsZi5jYW52YXNXaWR0aCArIDEgfHwgc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0ID4gc2VsZi5jYW52YXNIZWlnaHQgKyAxICkgKSB7XHJcblxyXG5cdFx0XHRcdCQuZmFuY3lib3guc3RvcCggc2VsZi4kY29udGVudCApO1xyXG5cclxuXHRcdFx0XHRzZWxmLiRjb250ZW50LmNzcyggJ3RyYW5zaXRpb24tZHVyYXRpb24nLCAnMG1zJyApO1xyXG5cclxuXHRcdFx0XHRzZWxmLmlzUGFubmluZyA9IHRydWU7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRzZWxmLmlzU3dpcGluZyA9IHRydWU7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcygnZmFuY3lib3gtY29udHJvbHMtLWlzR3JhYmJpbmcnKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHNlbGYuc3RhcnRQb2ludHMubGVuZ3RoID09PSAyICYmICFpbnN0YW5jZS5pc0FuaW1hdGluZyAmJiAhY3VycmVudC5oYXNFcnJvciAmJiBjdXJyZW50LnR5cGUgPT09ICdpbWFnZScgJiYgKCBjdXJyZW50LmlzTG9hZGVkIHx8IGN1cnJlbnQuJGdob3N0ICkgKSB7XHJcblx0XHRcdHNlbGYuaXNab29taW5nID0gdHJ1ZTtcclxuXHJcblx0XHRcdHNlbGYuaXNTd2lwaW5nID0gZmFsc2U7XHJcblx0XHRcdHNlbGYuaXNQYW5uaW5nID0gZmFsc2U7XHJcblxyXG5cdFx0XHQkLmZhbmN5Ym94LnN0b3AoIHNlbGYuJGNvbnRlbnQgKTtcclxuXHJcblx0XHRcdHNlbGYuJGNvbnRlbnQuY3NzKCAndHJhbnNpdGlvbi1kdXJhdGlvbicsICcwbXMnICk7XHJcblxyXG5cdFx0XHRzZWxmLmNlbnRlclBvaW50U3RhcnRYID0gKCAoIHNlbGYuc3RhcnRQb2ludHNbMF0ueCArIHNlbGYuc3RhcnRQb2ludHNbMV0ueCApICogMC41ICkgLSAkKHdpbmRvdykuc2Nyb2xsTGVmdCgpO1xyXG5cdFx0XHRzZWxmLmNlbnRlclBvaW50U3RhcnRZID0gKCAoIHNlbGYuc3RhcnRQb2ludHNbMF0ueSArIHNlbGYuc3RhcnRQb2ludHNbMV0ueSApICogMC41ICkgLSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XHJcblxyXG5cdFx0XHRzZWxmLnBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WCA9ICggc2VsZi5jZW50ZXJQb2ludFN0YXJ0WCAtIHNlbGYuY29udGVudFN0YXJ0UG9zLmxlZnQgKSAvIHNlbGYuY29udGVudFN0YXJ0UG9zLndpZHRoO1xyXG5cdFx0XHRzZWxmLnBlcmNlbnRhZ2VPZkltYWdlQXRQaW5jaFBvaW50WSA9ICggc2VsZi5jZW50ZXJQb2ludFN0YXJ0WSAtIHNlbGYuY29udGVudFN0YXJ0UG9zLnRvcCAgKSAvIHNlbGYuY29udGVudFN0YXJ0UG9zLmhlaWdodDtcclxuXHJcblx0XHRcdHNlbGYuc3RhcnREaXN0YW5jZUJldHdlZW5GaW5nZXJzID0gZGlzdGFuY2UoIHNlbGYuc3RhcnRQb2ludHNbMF0sIHNlbGYuc3RhcnRQb2ludHNbMV0gKTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0R3Vlc3R1cmVzLnByb3RvdHlwZS5vbnRvdWNobW92ZSA9IGZ1bmN0aW9uKCBlICkge1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRzZWxmLm5ld1BvaW50cyA9IHBvaW50ZXJzKCBlICk7XHJcblxyXG5cdFx0aWYgKCAkLmZhbmN5Ym94LmlzTW9iaWxlICYmICggaXNTY3JvbGxhYmxlKCBzZWxmLiR0YXJnZXQgKSB8fCBpc1Njcm9sbGFibGUoIHNlbGYuJHRhcmdldC5wYXJlbnQoKSApICkgKSB7XHJcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblxyXG5cdFx0XHRzZWxmLmNhblRhcCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggISggc2VsZi5vcHRzIHx8IHNlbGYuaW5zdGFuY2UuY2FuUGFuKCkgKSB8fCAhc2VsZi5uZXdQb2ludHMgfHwgIXNlbGYubmV3UG9pbnRzLmxlbmd0aCApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuZGlzdGFuY2VYID0gZGlzdGFuY2UoIHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzBdLCAneCcgKTtcclxuXHRcdHNlbGYuZGlzdGFuY2VZID0gZGlzdGFuY2UoIHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzBdLCAneScgKTtcclxuXHJcblx0XHRzZWxmLmRpc3RhbmNlID0gZGlzdGFuY2UoIHNlbGYubmV3UG9pbnRzWzBdLCBzZWxmLnN0YXJ0UG9pbnRzWzBdICk7XHJcblxyXG5cdFx0Ly8gU2tpcCBmYWxzZSBvbnRvdWNobW92ZSBldmVudHMgKENocm9tZSlcclxuXHRcdGlmICggc2VsZi5kaXN0YW5jZSA+IDAgKSB7XHJcblxyXG5cdFx0XHRpZiAoICEoIHNlbGYuJHRhcmdldC5pcyggc2VsZi4kc3RhZ2UgKSB8fCBzZWxmLiRzdGFnZS5maW5kKCBzZWxmLiR0YXJnZXQgKS5sZW5ndGggKSApIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdGlmICggc2VsZi5pc1N3aXBpbmcgKSB7XHJcblx0XHRcdFx0c2VsZi5vblN3aXBlKCk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCBzZWxmLmlzUGFubmluZyApIHtcclxuXHRcdFx0XHRzZWxmLm9uUGFuKCk7XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCBzZWxmLmlzWm9vbWluZyApIHtcclxuXHRcdFx0XHRzZWxmLm9uWm9vbSgpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLm9uU3dpcGUgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIHN3aXBpbmcgPSBzZWxmLmlzU3dpcGluZztcclxuXHRcdHZhciBsZWZ0ICAgID0gc2VsZi5zbGlkZXJTdGFydFBvcy5sZWZ0IHx8IDA7XHJcblx0XHR2YXIgYW5nbGU7XHJcblxyXG5cdFx0aWYgKCBzd2lwaW5nID09PSB0cnVlICkge1xyXG5cclxuXHRcdFx0aWYgKCBNYXRoLmFicyggc2VsZi5kaXN0YW5jZSApID4gMTAgKSAge1xyXG5cclxuXHRcdFx0XHRzZWxmLmNhblRhcCA9IGZhbHNlO1xyXG5cclxuXHRcdFx0XHRpZiAoIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiAmJiBzZWxmLm9wdHMudmVydGljYWwgKSB7XHJcblx0XHRcdFx0XHRzZWxmLmlzU3dpcGluZyAgPSAneSc7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIHNlbGYuaW5zdGFuY2UuaXNTbGlkaW5nIHx8IHNlbGYub3B0cy52ZXJ0aWNhbCA9PT0gZmFsc2UgfHwgKCBzZWxmLm9wdHMudmVydGljYWwgPT09ICdhdXRvJyAmJiAkKCB3aW5kb3cgKS53aWR0aCgpID4gODAwICkgKSB7XHJcblx0XHRcdFx0XHRzZWxmLmlzU3dpcGluZyAgPSAneCc7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRhbmdsZSA9IE1hdGguYWJzKCBNYXRoLmF0YW4yKCBzZWxmLmRpc3RhbmNlWSwgc2VsZi5kaXN0YW5jZVggKSAqIDE4MCAvIE1hdGguUEkgKTtcclxuXHJcblx0XHRcdFx0XHRzZWxmLmlzU3dpcGluZyA9ICggYW5nbGUgPiA0NSAmJiBhbmdsZSA8IDEzNSApID8gJ3knIDogJ3gnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0c2VsZi5pbnN0YW5jZS5pc1NsaWRpbmcgPSBzZWxmLmlzU3dpcGluZztcclxuXHJcblx0XHRcdFx0Ly8gUmVzZXQgcG9pbnRzIHRvIGF2b2lkIGp1bXBpbmcsIGJlY2F1c2Ugd2UgZHJvcHBlZCBmaXJzdCBzd2lwZXMgdG8gY2FsY3VsYXRlIHRoZSBhbmdsZVxyXG5cdFx0XHRcdHNlbGYuc3RhcnRQb2ludHMgPSBzZWxmLm5ld1BvaW50cztcclxuXHJcblx0XHRcdFx0JC5lYWNoKHNlbGYuaW5zdGFuY2Uuc2xpZGVzLCBmdW5jdGlvbiggaW5kZXgsIHNsaWRlICkge1xyXG5cdFx0XHRcdFx0JC5mYW5jeWJveC5zdG9wKCBzbGlkZS4kc2xpZGUgKTtcclxuXHJcblx0XHRcdFx0XHRzbGlkZS4kc2xpZGUuY3NzKCAndHJhbnNpdGlvbi1kdXJhdGlvbicsICcwbXMnICk7XHJcblxyXG5cdFx0XHRcdFx0c2xpZGUuaW5UcmFuc2l0aW9uID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBzbGlkZS5wb3MgPT09IHNlbGYuaW5zdGFuY2UuY3VycmVudC5wb3MgKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuc2xpZGVyU3RhcnRQb3MubGVmdCA9ICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKCBzbGlkZS4kc2xpZGUgKS5sZWZ0O1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHQvL3NlbGYuaW5zdGFuY2UuY3VycmVudC5pc01vdmVkID0gdHJ1ZTtcclxuXHJcblx0XHRcdFx0Ly8gU3RvcCBzbGlkZXNob3dcclxuXHRcdFx0XHRpZiAoIHNlbGYuaW5zdGFuY2UuU2xpZGVTaG93ICYmIHNlbGYuaW5zdGFuY2UuU2xpZGVTaG93LmlzQWN0aXZlICkge1xyXG5cdFx0XHRcdFx0c2VsZi5pbnN0YW5jZS5TbGlkZVNob3cuc3RvcCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRpZiAoIHN3aXBpbmcgPT0gJ3gnICkge1xyXG5cclxuXHRcdFx0XHQvLyBTdGlja3kgZWRnZXNcclxuXHRcdFx0XHRpZiAoIHNlbGYuZGlzdGFuY2VYID4gMCAmJiAoIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiB8fCAoIHNlbGYuaW5zdGFuY2UuY3VycmVudC5pbmRleCA9PT0gMCAmJiAhc2VsZi5pbnN0YW5jZS5jdXJyZW50Lm9wdHMubG9vcCApICkgKSB7XHJcblx0XHRcdFx0XHRsZWZ0ID0gbGVmdCArIE1hdGgucG93KCBzZWxmLmRpc3RhbmNlWCwgMC44ICk7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSBpZiAoIHNlbGYuZGlzdGFuY2VYIDwgMCAmJiAoIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiB8fCAoIHNlbGYuaW5zdGFuY2UuY3VycmVudC5pbmRleCA9PT0gc2VsZi5pbnN0YW5jZS5ncm91cC5sZW5ndGggLSAxICYmICFzZWxmLmluc3RhbmNlLmN1cnJlbnQub3B0cy5sb29wICkgKSApIHtcclxuXHRcdFx0XHRcdGxlZnQgPSBsZWZ0IC0gTWF0aC5wb3coIC1zZWxmLmRpc3RhbmNlWCwgMC44ICk7XHJcblxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRsZWZ0ID0gbGVmdCArIHNlbGYuZGlzdGFuY2VYO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdH1cclxuXHJcblx0XHRcdHNlbGYuc2xpZGVyTGFzdFBvcyA9IHtcclxuXHRcdFx0XHR0b3AgIDogc3dpcGluZyA9PSAneCcgPyAwIDogc2VsZi5zbGlkZXJTdGFydFBvcy50b3AgKyBzZWxmLmRpc3RhbmNlWSxcclxuXHRcdFx0XHRsZWZ0IDogbGVmdFxyXG5cdFx0XHR9O1xyXG5cclxuXHRcdFx0aWYgKCBzZWxmLnJlcXVlc3RJZCApIHtcclxuXHRcdFx0XHRjYW5jZWxBRnJhbWUoIHNlbGYucmVxdWVzdElkICk7XHJcblxyXG5cdFx0XHRcdHNlbGYucmVxdWVzdElkID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c2VsZi5yZXF1ZXN0SWQgPSByZXF1ZXN0QUZyYW1lKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdFx0XHRpZiAoIHNlbGYuc2xpZGVyTGFzdFBvcyApIHtcclxuXHRcdFx0XHRcdCQuZWFjaChzZWxmLmluc3RhbmNlLnNsaWRlcywgZnVuY3Rpb24oIGluZGV4LCBzbGlkZSApIHtcclxuXHRcdFx0XHRcdFx0dmFyIHBvcyA9IHNsaWRlLnBvcyAtIHNlbGYuaW5zdGFuY2UuY3VyclBvcztcclxuXHJcblx0XHRcdFx0XHRcdCQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCBzbGlkZS4kc2xpZGUsIHtcclxuXHRcdFx0XHRcdFx0XHR0b3AgIDogc2VsZi5zbGlkZXJMYXN0UG9zLnRvcCxcclxuXHRcdFx0XHRcdFx0XHRsZWZ0IDogc2VsZi5zbGlkZXJMYXN0UG9zLmxlZnQgKyAoIHBvcyAqIHNlbGYuY2FudmFzV2lkdGggKSArICggcG9zICogc2xpZGUub3B0cy5ndXR0ZXIgKVxyXG5cdFx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRcdHNlbGYuJGNvbnRhaW5lci5hZGRDbGFzcyggJ2ZhbmN5Ym94LWlzLXNsaWRpbmcnICk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fVxyXG5cclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLm9uUGFuID0gZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdHZhciBuZXdPZmZzZXRYLCBuZXdPZmZzZXRZLCBuZXdQb3M7XHJcblxyXG5cdFx0c2VsZi5jYW5UYXAgPSBmYWxzZTtcclxuXHJcblx0XHRpZiAoIHNlbGYuY29udGVudFN0YXJ0UG9zLndpZHRoID4gc2VsZi5jYW52YXNXaWR0aCApIHtcclxuXHRcdFx0bmV3T2Zmc2V0WCA9IHNlbGYuY29udGVudFN0YXJ0UG9zLmxlZnQgKyBzZWxmLmRpc3RhbmNlWDtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRuZXdPZmZzZXRYID0gc2VsZi5jb250ZW50U3RhcnRQb3MubGVmdDtcclxuXHRcdH1cclxuXHJcblx0XHRuZXdPZmZzZXRZID0gc2VsZi5jb250ZW50U3RhcnRQb3MudG9wICsgc2VsZi5kaXN0YW5jZVk7XHJcblxyXG5cdFx0bmV3UG9zID0gc2VsZi5saW1pdE1vdmVtZW50KCBuZXdPZmZzZXRYLCBuZXdPZmZzZXRZLCBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aCwgc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0ICk7XHJcblxyXG5cdFx0bmV3UG9zLnNjYWxlWCA9IHNlbGYuY29udGVudFN0YXJ0UG9zLnNjYWxlWDtcclxuXHRcdG5ld1Bvcy5zY2FsZVkgPSBzZWxmLmNvbnRlbnRTdGFydFBvcy5zY2FsZVk7XHJcblxyXG5cdFx0c2VsZi5jb250ZW50TGFzdFBvcyA9IG5ld1BvcztcclxuXHJcblx0XHRpZiAoIHNlbGYucmVxdWVzdElkICkge1xyXG5cdFx0XHRjYW5jZWxBRnJhbWUoIHNlbGYucmVxdWVzdElkICk7XHJcblxyXG5cdFx0XHRzZWxmLnJlcXVlc3RJZCA9IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5yZXF1ZXN0SWQgPSByZXF1ZXN0QUZyYW1lKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHQkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZSggc2VsZi4kY29udGVudCwgc2VsZi5jb250ZW50TGFzdFBvcyApO1xyXG5cdFx0fSk7XHJcblx0fTtcclxuXHJcblx0Ly8gTWFrZSBwYW5uaW5nIHN0aWNreSB0byB0aGUgZWRnZXNcclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLmxpbWl0TW92ZW1lbnQgPSBmdW5jdGlvbiggbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3V2lkdGgsIG5ld0hlaWdodCApIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIG1pblRyYW5zbGF0ZVgsIG1pblRyYW5zbGF0ZVksIG1heFRyYW5zbGF0ZVgsIG1heFRyYW5zbGF0ZVk7XHJcblxyXG5cdFx0dmFyIGNhbnZhc1dpZHRoICA9IHNlbGYuY2FudmFzV2lkdGg7XHJcblx0XHR2YXIgY2FudmFzSGVpZ2h0ID0gc2VsZi5jYW52YXNIZWlnaHQ7XHJcblxyXG5cdFx0dmFyIGN1cnJlbnRPZmZzZXRYID0gc2VsZi5jb250ZW50U3RhcnRQb3MubGVmdDtcclxuXHRcdHZhciBjdXJyZW50T2Zmc2V0WSA9IHNlbGYuY29udGVudFN0YXJ0UG9zLnRvcDtcclxuXHJcblx0XHR2YXIgZGlzdGFuY2VYID0gc2VsZi5kaXN0YW5jZVg7XHJcblx0XHR2YXIgZGlzdGFuY2VZID0gc2VsZi5kaXN0YW5jZVk7XHJcblxyXG5cdFx0Ly8gU2xvdyBkb3duIHByb3BvcnRpb25hbGx5IHRvIHRyYXZlbGVkIGRpc3RhbmNlXHJcblxyXG5cdFx0bWluVHJhbnNsYXRlWCA9IE1hdGgubWF4KDAsIGNhbnZhc1dpZHRoICAqIDAuNSAtIG5ld1dpZHRoICAqIDAuNSApO1xyXG5cdFx0bWluVHJhbnNsYXRlWSA9IE1hdGgubWF4KDAsIGNhbnZhc0hlaWdodCAqIDAuNSAtIG5ld0hlaWdodCAqIDAuNSApO1xyXG5cclxuXHRcdG1heFRyYW5zbGF0ZVggPSBNYXRoLm1pbiggY2FudmFzV2lkdGggIC0gbmV3V2lkdGgsICBjYW52YXNXaWR0aCAgKiAwLjUgLSBuZXdXaWR0aCAgKiAwLjUgKTtcclxuXHRcdG1heFRyYW5zbGF0ZVkgPSBNYXRoLm1pbiggY2FudmFzSGVpZ2h0IC0gbmV3SGVpZ2h0LCBjYW52YXNIZWlnaHQgKiAwLjUgLSBuZXdIZWlnaHQgKiAwLjUgKTtcclxuXHJcblx0XHRpZiAoIG5ld1dpZHRoID4gY2FudmFzV2lkdGggKSB7XHJcblxyXG5cdFx0XHQvLyAgIC0+XHJcblx0XHRcdGlmICggZGlzdGFuY2VYID4gMCAmJiBuZXdPZmZzZXRYID4gbWluVHJhbnNsYXRlWCApIHtcclxuXHRcdFx0XHRuZXdPZmZzZXRYID0gbWluVHJhbnNsYXRlWCAtIDEgKyBNYXRoLnBvdyggLW1pblRyYW5zbGF0ZVggKyBjdXJyZW50T2Zmc2V0WCArIGRpc3RhbmNlWCwgMC44ICkgfHwgMDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly8gICAgPC1cclxuXHRcdFx0aWYgKCBkaXN0YW5jZVggIDwgMCAmJiBuZXdPZmZzZXRYIDwgbWF4VHJhbnNsYXRlWCApIHtcclxuXHRcdFx0XHRuZXdPZmZzZXRYID0gbWF4VHJhbnNsYXRlWCArIDEgLSBNYXRoLnBvdyggbWF4VHJhbnNsYXRlWCAtIGN1cnJlbnRPZmZzZXRYIC0gZGlzdGFuY2VYLCAwLjggKSB8fCAwO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggbmV3SGVpZ2h0ID4gY2FudmFzSGVpZ2h0ICkge1xyXG5cclxuXHRcdFx0Ly8gICBcXC9cclxuXHRcdFx0aWYgKCBkaXN0YW5jZVkgPiAwICYmIG5ld09mZnNldFkgPiBtaW5UcmFuc2xhdGVZICkge1xyXG5cdFx0XHRcdG5ld09mZnNldFkgPSBtaW5UcmFuc2xhdGVZIC0gMSArIE1hdGgucG93KC1taW5UcmFuc2xhdGVZICsgY3VycmVudE9mZnNldFkgKyBkaXN0YW5jZVksIDAuOCApIHx8IDA7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vICAgL1xcXHJcblx0XHRcdGlmICggZGlzdGFuY2VZIDwgMCAmJiBuZXdPZmZzZXRZIDwgbWF4VHJhbnNsYXRlWSApIHtcclxuXHRcdFx0XHRuZXdPZmZzZXRZID0gbWF4VHJhbnNsYXRlWSArIDEgLSBNYXRoLnBvdyAoIG1heFRyYW5zbGF0ZVkgLSBjdXJyZW50T2Zmc2V0WSAtIGRpc3RhbmNlWSwgMC44ICkgfHwgMDtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHR0b3AgIDogbmV3T2Zmc2V0WSxcclxuXHRcdFx0bGVmdCA6IG5ld09mZnNldFhcclxuXHRcdH07XHJcblxyXG5cdH07XHJcblxyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLmxpbWl0UG9zaXRpb24gPSBmdW5jdGlvbiggbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3V2lkdGgsIG5ld0hlaWdodCApIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblxyXG5cdFx0dmFyIGNhbnZhc1dpZHRoICA9IHNlbGYuY2FudmFzV2lkdGg7XHJcblx0XHR2YXIgY2FudmFzSGVpZ2h0ID0gc2VsZi5jYW52YXNIZWlnaHQ7XHJcblxyXG5cdFx0aWYgKCBuZXdXaWR0aCA+IGNhbnZhc1dpZHRoICkge1xyXG5cdFx0XHRuZXdPZmZzZXRYID0gbmV3T2Zmc2V0WCA+IDAgPyAwIDogbmV3T2Zmc2V0WDtcclxuXHRcdFx0bmV3T2Zmc2V0WCA9IG5ld09mZnNldFggPCBjYW52YXNXaWR0aCAtIG5ld1dpZHRoID8gY2FudmFzV2lkdGggLSBuZXdXaWR0aCA6IG5ld09mZnNldFg7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdC8vIENlbnRlciBob3Jpem9udGFsbHlcclxuXHRcdFx0bmV3T2Zmc2V0WCA9IE1hdGgubWF4KCAwLCBjYW52YXNXaWR0aCAvIDIgLSBuZXdXaWR0aCAvIDIgKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCBuZXdIZWlnaHQgPiBjYW52YXNIZWlnaHQgKSB7XHJcblx0XHRcdG5ld09mZnNldFkgPSBuZXdPZmZzZXRZID4gMCA/IDAgOiBuZXdPZmZzZXRZO1xyXG5cdFx0XHRuZXdPZmZzZXRZID0gbmV3T2Zmc2V0WSA8IGNhbnZhc0hlaWdodCAtIG5ld0hlaWdodCA/IGNhbnZhc0hlaWdodCAtIG5ld0hlaWdodCA6IG5ld09mZnNldFk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdC8vIENlbnRlciB2ZXJ0aWNhbGx5XHJcblx0XHRcdG5ld09mZnNldFkgPSBNYXRoLm1heCggMCwgY2FudmFzSGVpZ2h0IC8gMiAtIG5ld0hlaWdodCAvIDIgKTtcclxuXHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0dG9wICA6IG5ld09mZnNldFksXHJcblx0XHRcdGxlZnQgOiBuZXdPZmZzZXRYXHJcblx0XHR9O1xyXG5cclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLm9uWm9vbSA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHQvLyBDYWxjdWxhdGUgY3VycmVudCBkaXN0YW5jZSBiZXR3ZWVuIHBvaW50cyB0byBnZXQgcGluY2ggcmF0aW8gYW5kIG5ldyB3aWR0aCBhbmQgaGVpZ2h0XHJcblxyXG5cdFx0dmFyIGN1cnJlbnRXaWR0aCAgPSBzZWxmLmNvbnRlbnRTdGFydFBvcy53aWR0aDtcclxuXHRcdHZhciBjdXJyZW50SGVpZ2h0ID0gc2VsZi5jb250ZW50U3RhcnRQb3MuaGVpZ2h0O1xyXG5cclxuXHRcdHZhciBjdXJyZW50T2Zmc2V0WCA9IHNlbGYuY29udGVudFN0YXJ0UG9zLmxlZnQ7XHJcblx0XHR2YXIgY3VycmVudE9mZnNldFkgPSBzZWxmLmNvbnRlbnRTdGFydFBvcy50b3A7XHJcblxyXG5cdFx0dmFyIGVuZERpc3RhbmNlQmV0d2VlbkZpbmdlcnMgPSBkaXN0YW5jZSggc2VsZi5uZXdQb2ludHNbMF0sIHNlbGYubmV3UG9pbnRzWzFdICk7XHJcblxyXG5cdFx0dmFyIHBpbmNoUmF0aW8gPSBlbmREaXN0YW5jZUJldHdlZW5GaW5nZXJzIC8gc2VsZi5zdGFydERpc3RhbmNlQmV0d2VlbkZpbmdlcnM7XHJcblxyXG5cdFx0dmFyIG5ld1dpZHRoICA9IE1hdGguZmxvb3IoIGN1cnJlbnRXaWR0aCAgKiBwaW5jaFJhdGlvICk7XHJcblx0XHR2YXIgbmV3SGVpZ2h0ID0gTWF0aC5mbG9vciggY3VycmVudEhlaWdodCAqIHBpbmNoUmF0aW8gKTtcclxuXHJcblx0XHQvLyBUaGlzIGlzIHRoZSB0cmFuc2xhdGlvbiBkdWUgdG8gcGluY2gtem9vbWluZ1xyXG5cdFx0dmFyIHRyYW5zbGF0ZUZyb21ab29taW5nWCA9IChjdXJyZW50V2lkdGggIC0gbmV3V2lkdGgpICAqIHNlbGYucGVyY2VudGFnZU9mSW1hZ2VBdFBpbmNoUG9pbnRYO1xyXG5cdFx0dmFyIHRyYW5zbGF0ZUZyb21ab29taW5nWSA9IChjdXJyZW50SGVpZ2h0IC0gbmV3SGVpZ2h0KSAqIHNlbGYucGVyY2VudGFnZU9mSW1hZ2VBdFBpbmNoUG9pbnRZO1xyXG5cclxuXHRcdC8vUG9pbnQgYmV0d2VlbiB0aGUgdHdvIHRvdWNoZXNcclxuXHJcblx0XHR2YXIgY2VudGVyUG9pbnRFbmRYID0gKChzZWxmLm5ld1BvaW50c1swXS54ICsgc2VsZi5uZXdQb2ludHNbMV0ueCkgLyAyKSAtICQod2luZG93KS5zY3JvbGxMZWZ0KCk7XHJcblx0XHR2YXIgY2VudGVyUG9pbnRFbmRZID0gKChzZWxmLm5ld1BvaW50c1swXS55ICsgc2VsZi5uZXdQb2ludHNbMV0ueSkgLyAyKSAtICQod2luZG93KS5zY3JvbGxUb3AoKTtcclxuXHJcblx0XHQvLyBBbmQgdGhpcyBpcyB0aGUgdHJhbnNsYXRpb24gZHVlIHRvIHRyYW5zbGF0aW9uIG9mIHRoZSBjZW50ZXJwb2ludFxyXG5cdFx0Ly8gYmV0d2VlbiB0aGUgdHdvIGZpbmdlcnNcclxuXHJcblx0XHR2YXIgdHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWCA9IGNlbnRlclBvaW50RW5kWCAtIHNlbGYuY2VudGVyUG9pbnRTdGFydFg7XHJcblx0XHR2YXIgdHJhbnNsYXRlRnJvbVRyYW5zbGF0aW5nWSA9IGNlbnRlclBvaW50RW5kWSAtIHNlbGYuY2VudGVyUG9pbnRTdGFydFk7XHJcblxyXG5cdFx0Ly8gVGhlIG5ldyBvZmZzZXQgaXMgdGhlIG9sZC9jdXJyZW50IG9uZSBwbHVzIHRoZSB0b3RhbCB0cmFuc2xhdGlvblxyXG5cclxuXHRcdHZhciBuZXdPZmZzZXRYID0gY3VycmVudE9mZnNldFggKyAoIHRyYW5zbGF0ZUZyb21ab29taW5nWCArIHRyYW5zbGF0ZUZyb21UcmFuc2xhdGluZ1ggKTtcclxuXHRcdHZhciBuZXdPZmZzZXRZID0gY3VycmVudE9mZnNldFkgKyAoIHRyYW5zbGF0ZUZyb21ab29taW5nWSArIHRyYW5zbGF0ZUZyb21UcmFuc2xhdGluZ1kgKTtcclxuXHJcblx0XHR2YXIgbmV3UG9zID0ge1xyXG5cdFx0XHR0b3AgICAgOiBuZXdPZmZzZXRZLFxyXG5cdFx0XHRsZWZ0ICAgOiBuZXdPZmZzZXRYLFxyXG5cdFx0XHRzY2FsZVggOiBzZWxmLmNvbnRlbnRTdGFydFBvcy5zY2FsZVggKiBwaW5jaFJhdGlvLFxyXG5cdFx0XHRzY2FsZVkgOiBzZWxmLmNvbnRlbnRTdGFydFBvcy5zY2FsZVkgKiBwaW5jaFJhdGlvXHJcblx0XHR9O1xyXG5cclxuXHRcdHNlbGYuY2FuVGFwID0gZmFsc2U7XHJcblxyXG5cdFx0c2VsZi5uZXdXaWR0aCAgPSBuZXdXaWR0aDtcclxuXHRcdHNlbGYubmV3SGVpZ2h0ID0gbmV3SGVpZ2h0O1xyXG5cclxuXHRcdHNlbGYuY29udGVudExhc3RQb3MgPSBuZXdQb3M7XHJcblxyXG5cdFx0aWYgKCBzZWxmLnJlcXVlc3RJZCApIHtcclxuXHRcdFx0Y2FuY2VsQUZyYW1lKCBzZWxmLnJlcXVlc3RJZCApO1xyXG5cclxuXHRcdFx0c2VsZi5yZXF1ZXN0SWQgPSBudWxsO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYucmVxdWVzdElkID0gcmVxdWVzdEFGcmFtZShmdW5jdGlvbigpIHtcclxuXHRcdFx0JC5mYW5jeWJveC5zZXRUcmFuc2xhdGUoIHNlbGYuJGNvbnRlbnQsIHNlbGYuY29udGVudExhc3RQb3MgKTtcclxuXHRcdH0pO1xyXG5cclxuXHR9O1xyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLm9udG91Y2hlbmQgPSBmdW5jdGlvbiggZSApIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgZE1zICA9IE1hdGgubWF4KCAobmV3IERhdGUoKS5nZXRUaW1lKCkgKSAtIHNlbGYuc3RhcnRUaW1lLCAxKTtcclxuXHJcblx0XHR2YXIgc3dpcGluZyA9IHNlbGYuaXNTd2lwaW5nO1xyXG5cdFx0dmFyIHBhbm5pbmcgPSBzZWxmLmlzUGFubmluZztcclxuXHRcdHZhciB6b29taW5nID0gc2VsZi5pc1pvb21pbmc7XHJcblxyXG5cdFx0c2VsZi5lbmRQb2ludHMgPSBwb2ludGVycyggZSApO1xyXG5cclxuXHRcdHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWNvbnRyb2xzLS1pc0dyYWJiaW5nJyApO1xyXG5cclxuXHRcdCQoZG9jdW1lbnQpLm9mZiggJy5mYi50b3VjaCcgKTtcclxuXHJcblx0XHRpZiAoIHNlbGYucmVxdWVzdElkICkge1xyXG5cdFx0XHRjYW5jZWxBRnJhbWUoIHNlbGYucmVxdWVzdElkICk7XHJcblxyXG5cdFx0XHRzZWxmLnJlcXVlc3RJZCA9IG51bGw7XHJcblx0XHR9XHJcblxyXG5cdFx0c2VsZi5pc1N3aXBpbmcgPSBmYWxzZTtcclxuXHRcdHNlbGYuaXNQYW5uaW5nID0gZmFsc2U7XHJcblx0XHRzZWxmLmlzWm9vbWluZyA9IGZhbHNlO1xyXG5cclxuXHRcdGlmICggc2VsZi5jYW5UYXAgKSAge1xyXG5cdFx0XHRyZXR1cm4gc2VsZi5vblRhcCggZSApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuc3BlZWQgPSAzNjY7XHJcblxyXG5cdFx0Ly8gU3BlZWQgaW4gcHgvbXNcclxuXHRcdHNlbGYudmVsb2NpdHlYID0gc2VsZi5kaXN0YW5jZVggLyBkTXMgKiAwLjU7XHJcblx0XHRzZWxmLnZlbG9jaXR5WSA9IHNlbGYuZGlzdGFuY2VZIC8gZE1zICogMC41O1xyXG5cclxuXHRcdHNlbGYuc3BlZWRYID0gTWF0aC5tYXgoIHNlbGYuc3BlZWQgKiAwLjUsIE1hdGgubWluKCBzZWxmLnNwZWVkICogMS41LCAoIDEgLyBNYXRoLmFicyggc2VsZi52ZWxvY2l0eVggKSApICogc2VsZi5zcGVlZCApICk7XHJcblxyXG5cdFx0aWYgKCBwYW5uaW5nICkge1xyXG5cdFx0XHRzZWxmLmVuZFBhbm5pbmcoKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKCB6b29taW5nICkge1xyXG5cdFx0XHRzZWxmLmVuZFpvb21pbmcoKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRzZWxmLmVuZFN3aXBpbmcoIHN3aXBpbmcgKTtcclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm47XHJcblx0fTtcclxuXHJcblx0R3Vlc3R1cmVzLnByb3RvdHlwZS5lbmRTd2lwaW5nID0gZnVuY3Rpb24oIHN3aXBpbmcgKSB7XHJcblxyXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cdFx0dmFyIHJldCA9IGZhbHNlO1xyXG5cclxuXHRcdHNlbGYuaW5zdGFuY2UuaXNTbGlkaW5nID0gZmFsc2U7XHJcblx0XHRzZWxmLnNsaWRlckxhc3RQb3MgICAgICA9IG51bGw7XHJcblxyXG5cdFx0Ly8gQ2xvc2UgaWYgc3dpcGVkIHZlcnRpY2FsbHkgLyBuYXZpZ2F0ZSBpZiBob3Jpem9udGFsbHlcclxuXHRcdGlmICggc3dpcGluZyA9PSAneScgJiYgTWF0aC5hYnMoIHNlbGYuZGlzdGFuY2VZICkgPiA1MCApIHtcclxuXHJcblx0XHRcdC8vIENvbnRpbnVlIHZlcnRpY2FsIG1vdmVtZW50XHJcblx0XHRcdCQuZmFuY3lib3guYW5pbWF0ZSggc2VsZi5pbnN0YW5jZS5jdXJyZW50LiRzbGlkZSwge1xyXG5cdFx0XHRcdHRvcCAgICAgOiBzZWxmLnNsaWRlclN0YXJ0UG9zLnRvcCArIHNlbGYuZGlzdGFuY2VZICsgKCBzZWxmLnZlbG9jaXR5WSAqIDE1MCApLFxyXG5cdFx0XHRcdG9wYWNpdHkgOiAwXHJcblx0XHRcdH0sIDE1MCApO1xyXG5cclxuXHRcdFx0cmV0ID0gc2VsZi5pbnN0YW5jZS5jbG9zZSggdHJ1ZSwgMzAwICk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICggc3dpcGluZyA9PSAneCcgJiYgc2VsZi5kaXN0YW5jZVggPiA1MCAmJiBzZWxmLmluc3RhbmNlLmdyb3VwLmxlbmd0aCA+IDEgKSB7XHJcblx0XHRcdHJldCA9IHNlbGYuaW5zdGFuY2UucHJldmlvdXMoIHNlbGYuc3BlZWRYICk7XHJcblxyXG5cdFx0fSBlbHNlIGlmICggc3dpcGluZyA9PSAneCcgJiYgc2VsZi5kaXN0YW5jZVggPCAtNTAgICYmIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoID4gMSApIHtcclxuXHRcdFx0cmV0ID0gc2VsZi5pbnN0YW5jZS5uZXh0KCBzZWxmLnNwZWVkWCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICggcmV0ID09PSBmYWxzZSAmJiAoIHN3aXBpbmcgPT0gJ3gnIHx8IHN3aXBpbmcgPT0gJ3knICkgKSB7XHJcblx0XHRcdHNlbGYuaW5zdGFuY2UuanVtcFRvKCBzZWxmLmluc3RhbmNlLmN1cnJlbnQuaW5kZXgsIDE1MCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdHNlbGYuJGNvbnRhaW5lci5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LWlzLXNsaWRpbmcnICk7XHJcblxyXG5cdH07XHJcblxyXG5cdC8vIExpbWl0IHBhbm5pbmcgZnJvbSBlZGdlc1xyXG5cdC8vID09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuXHRHdWVzdHVyZXMucHJvdG90eXBlLmVuZFBhbm5pbmcgPSBmdW5jdGlvbigpIHtcclxuXHJcblx0XHR2YXIgc2VsZiA9IHRoaXM7XHJcblx0XHR2YXIgbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3UG9zO1xyXG5cclxuXHRcdGlmICggIXNlbGYuY29udGVudExhc3RQb3MgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIHNlbGYub3B0cy5tb21lbnR1bSA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdG5ld09mZnNldFggPSBzZWxmLmNvbnRlbnRMYXN0UG9zLmxlZnQ7XHJcblx0XHRcdG5ld09mZnNldFkgPSBzZWxmLmNvbnRlbnRMYXN0UG9zLnRvcDtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0Ly8gQ29udGludWUgbW92ZW1lbnRcclxuXHRcdFx0bmV3T2Zmc2V0WCA9IHNlbGYuY29udGVudExhc3RQb3MubGVmdCArICggc2VsZi52ZWxvY2l0eVggKiBzZWxmLnNwZWVkICk7XHJcblx0XHRcdG5ld09mZnNldFkgPSBzZWxmLmNvbnRlbnRMYXN0UG9zLnRvcCAgKyAoIHNlbGYudmVsb2NpdHlZICogc2VsZi5zcGVlZCApO1xyXG5cdFx0fVxyXG5cclxuXHRcdG5ld1BvcyA9IHNlbGYubGltaXRQb3NpdGlvbiggbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgc2VsZi5jb250ZW50U3RhcnRQb3Mud2lkdGgsIHNlbGYuY29udGVudFN0YXJ0UG9zLmhlaWdodCApO1xyXG5cclxuXHRcdCBuZXdQb3Mud2lkdGggID0gc2VsZi5jb250ZW50U3RhcnRQb3Mud2lkdGg7XHJcblx0XHQgbmV3UG9zLmhlaWdodCA9IHNlbGYuY29udGVudFN0YXJ0UG9zLmhlaWdodDtcclxuXHJcblx0XHQkLmZhbmN5Ym94LmFuaW1hdGUoIHNlbGYuJGNvbnRlbnQsIG5ld1BvcywgMzMwICk7XHJcblx0fTtcclxuXHJcblxyXG5cdEd1ZXN0dXJlcy5wcm90b3R5cGUuZW5kWm9vbWluZyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHR2YXIgY3VycmVudCA9IHNlbGYuaW5zdGFuY2UuY3VycmVudDtcclxuXHJcblx0XHR2YXIgbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3UG9zLCByZXNldDtcclxuXHJcblx0XHR2YXIgbmV3V2lkdGggID0gc2VsZi5uZXdXaWR0aDtcclxuXHRcdHZhciBuZXdIZWlnaHQgPSBzZWxmLm5ld0hlaWdodDtcclxuXHJcblx0XHRpZiAoICFzZWxmLmNvbnRlbnRMYXN0UG9zICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0bmV3T2Zmc2V0WCA9IHNlbGYuY29udGVudExhc3RQb3MubGVmdDtcclxuXHRcdG5ld09mZnNldFkgPSBzZWxmLmNvbnRlbnRMYXN0UG9zLnRvcDtcclxuXHJcblx0XHRyZXNldCA9IHtcclxuXHRcdCAgIFx0dG9wICAgIDogbmV3T2Zmc2V0WSxcclxuXHRcdCAgIFx0bGVmdCAgIDogbmV3T2Zmc2V0WCxcclxuXHRcdCAgIFx0d2lkdGggIDogbmV3V2lkdGgsXHJcblx0XHQgICBcdGhlaWdodCA6IG5ld0hlaWdodCxcclxuXHRcdFx0c2NhbGVYIDogMSxcclxuXHRcdFx0c2NhbGVZIDogMVxyXG5cdCAgIH07XHJcblxyXG5cdCAgIC8vIFJlc2V0IHNjYWxleC9zY2FsZVkgdmFsdWVzOyB0aGlzIGhlbHBzIGZvciBwZXJmb21hbmNlIGFuZCBkb2VzIG5vdCBicmVhayBhbmltYXRpb25cclxuXHQgICAkLmZhbmN5Ym94LnNldFRyYW5zbGF0ZSggc2VsZi4kY29udGVudCwgcmVzZXQgKTtcclxuXHJcblx0XHRpZiAoIG5ld1dpZHRoIDwgc2VsZi5jYW52YXNXaWR0aCAmJiBuZXdIZWlnaHQgPCBzZWxmLmNhbnZhc0hlaWdodCApIHtcclxuXHRcdFx0c2VsZi5pbnN0YW5jZS5zY2FsZVRvRml0KCAxNTAgKTtcclxuXHJcblx0XHR9IGVsc2UgaWYgKCBuZXdXaWR0aCA+IGN1cnJlbnQud2lkdGggfHwgbmV3SGVpZ2h0ID4gY3VycmVudC5oZWlnaHQgKSB7XHJcblx0XHRcdHNlbGYuaW5zdGFuY2Uuc2NhbGVUb0FjdHVhbCggc2VsZi5jZW50ZXJQb2ludFN0YXJ0WCwgc2VsZi5jZW50ZXJQb2ludFN0YXJ0WSwgMTUwICk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdG5ld1BvcyA9IHNlbGYubGltaXRQb3NpdGlvbiggbmV3T2Zmc2V0WCwgbmV3T2Zmc2V0WSwgbmV3V2lkdGgsIG5ld0hlaWdodCApO1xyXG5cclxuXHRcdFx0Ly8gU3dpdGNoIGZyb20gc2NhbGUoKSB0byB3aWR0aC9oZWlnaHQgb3IgYW5pbWF0aW9uIHdpbGwgbm90IHdvcmsgY29ycmVjdGx5XHJcblx0XHRcdCQuZmFuY3lib3guc2V0VHJhbnNsYXRlKCBzZWxmLmNvbnRlbnQsICQuZmFuY3lib3guZ2V0VHJhbnNsYXRlKCBzZWxmLiRjb250ZW50ICkgKTtcclxuXHJcblx0XHRcdCQuZmFuY3lib3guYW5pbWF0ZSggc2VsZi4kY29udGVudCwgbmV3UG9zLCAxNTAgKTtcclxuXHRcdH1cclxuXHJcblx0fTtcclxuXHJcblx0R3Vlc3R1cmVzLnByb3RvdHlwZS5vblRhcCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdHZhciBzZWxmICAgID0gdGhpcztcclxuXHRcdHZhciAkdGFyZ2V0ID0gJCggZS50YXJnZXQgKTtcclxuXHJcblx0XHR2YXIgaW5zdGFuY2UgPSBzZWxmLmluc3RhbmNlO1xyXG5cdFx0dmFyIGN1cnJlbnQgID0gaW5zdGFuY2UuY3VycmVudDtcclxuXHJcblx0XHR2YXIgZW5kUG9pbnRzID0gKCBlICYmIHBvaW50ZXJzKCBlICkgKSB8fCBzZWxmLnN0YXJ0UG9pbnRzO1xyXG5cclxuXHRcdHZhciB0YXBYID0gZW5kUG9pbnRzWzBdID8gZW5kUG9pbnRzWzBdLnggLSBzZWxmLiRzdGFnZS5vZmZzZXQoKS5sZWZ0IDogMDtcclxuXHRcdHZhciB0YXBZID0gZW5kUG9pbnRzWzBdID8gZW5kUG9pbnRzWzBdLnkgLSBzZWxmLiRzdGFnZS5vZmZzZXQoKS50b3AgIDogMDtcclxuXHJcblx0XHR2YXIgd2hlcmU7XHJcblxyXG5cdFx0dmFyIHByb2Nlc3MgPSBmdW5jdGlvbiAoIHByZWZpeCApIHtcclxuXHJcblx0XHRcdHZhciBhY3Rpb24gPSBjdXJyZW50Lm9wdHNbIHByZWZpeCBdO1xyXG5cclxuXHRcdFx0aWYgKCAkLmlzRnVuY3Rpb24oIGFjdGlvbiApICkge1xyXG5cdFx0XHRcdGFjdGlvbiA9IGFjdGlvbi5hcHBseSggaW5zdGFuY2UsIFsgY3VycmVudCwgZSBdICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICggIWFjdGlvbikge1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0c3dpdGNoICggYWN0aW9uICkge1xyXG5cclxuXHRcdFx0XHRjYXNlIFwiY2xvc2VcIiA6XHJcblxyXG5cdFx0XHRcdFx0aW5zdGFuY2UuY2xvc2UoIHNlbGYuc3RhcnRFdmVudCApO1xyXG5cclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSBcInRvZ2dsZUNvbnRyb2xzXCIgOlxyXG5cclxuXHRcdFx0XHRcdGluc3RhbmNlLnRvZ2dsZUNvbnRyb2xzKCB0cnVlICk7XHJcblxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlIFwibmV4dFwiIDpcclxuXHJcblx0XHRcdFx0XHRpbnN0YW5jZS5uZXh0KCk7XHJcblxyXG5cdFx0XHRcdGJyZWFrO1xyXG5cclxuXHRcdFx0XHRjYXNlIFwibmV4dE9yQ2xvc2VcIiA6XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBpbnN0YW5jZS5ncm91cC5sZW5ndGggPiAxICkge1xyXG5cdFx0XHRcdFx0XHRpbnN0YW5jZS5uZXh0KCk7XHJcblxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0aW5zdGFuY2UuY2xvc2UoIHNlbGYuc3RhcnRFdmVudCApO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRicmVhaztcclxuXHJcblx0XHRcdFx0Y2FzZSBcInpvb21cIiA6XHJcblxyXG5cdFx0XHRcdFx0aWYgKCBjdXJyZW50LnR5cGUgPT0gJ2ltYWdlJyAmJiAoIGN1cnJlbnQuaXNMb2FkZWQgfHwgY3VycmVudC4kZ2hvc3QgKSApIHtcclxuXHJcblx0XHRcdFx0XHRcdGlmICggaW5zdGFuY2UuY2FuUGFuKCkgKSB7XHJcblx0XHRcdFx0XHRcdFx0aW5zdGFuY2Uuc2NhbGVUb0ZpdCgpO1xyXG5cclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggaW5zdGFuY2UuaXNTY2FsZWREb3duKCkgKSB7XHJcblx0XHRcdFx0XHRcdFx0aW5zdGFuY2Uuc2NhbGVUb0FjdHVhbCggdGFwWCwgdGFwWSApO1xyXG5cclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICggaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiApIHtcclxuXHRcdFx0XHRcdFx0XHRpbnN0YW5jZS5jbG9zZSggc2VsZi5zdGFydEV2ZW50ICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIElnbm9yZSByaWdodCBjbGlja1xyXG5cdFx0aWYgKCBlLm9yaWdpbmFsRXZlbnQgJiYgZS5vcmlnaW5hbEV2ZW50LmJ1dHRvbiA9PSAyICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gU2tpcCBpZiBjdXJyZW50IHNsaWRlIGlzIG5vdCBpbiB0aGUgY2VudGVyXHJcblx0XHRpZiAoIGluc3RhbmNlLmlzU2xpZGluZyApIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIFNraXAgaWYgY2xpY2tlZCBvbiB0aGUgc2Nyb2xsYmFyXHJcblx0XHRpZiAoIHRhcFggPiAkdGFyZ2V0WzBdLmNsaWVudFdpZHRoICsgJHRhcmdldC5vZmZzZXQoKS5sZWZ0ICkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gQ2hlY2sgd2hlcmUgaXMgY2xpY2tlZFxyXG5cdFx0aWYgKCAkdGFyZ2V0LmlzKCAnLmZhbmN5Ym94LWJnLC5mYW5jeWJveC1pbm5lciwuZmFuY3lib3gtb3V0ZXIsLmZhbmN5Ym94LWNvbnRhaW5lcicgKSApIHtcclxuXHRcdFx0d2hlcmUgPSAnT3V0c2lkZSc7XHJcblxyXG5cdFx0fSBlbHNlIGlmICggJHRhcmdldC5pcyggJy5mYW5jeWJveC1zbGlkZScgKSApIHtcclxuXHRcdFx0d2hlcmUgPSAnU2xpZGUnO1xyXG5cclxuXHRcdH0gZWxzZSBpZiAgKCBpbnN0YW5jZS5jdXJyZW50LiRjb250ZW50ICYmIGluc3RhbmNlLmN1cnJlbnQuJGNvbnRlbnQuaGFzKCBlLnRhcmdldCApLmxlbmd0aCApIHtcclxuXHRcdCBcdHdoZXJlID0gJ0NvbnRlbnQnO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDaGVjayBpZiB0aGlzIGlzIGEgZG91YmxlIHRhcFxyXG5cdFx0aWYgKCBzZWxmLnRhcHBlZCApIHtcclxuXHJcblx0XHRcdC8vIFN0b3AgcHJldmlvdXNseSBjcmVhdGVkIHNpbmdsZSB0YXBcclxuXHRcdFx0Y2xlYXJUaW1lb3V0KCBzZWxmLnRhcHBlZCApO1xyXG5cdFx0XHRzZWxmLnRhcHBlZCA9IG51bGw7XHJcblxyXG5cdFx0XHQvLyBTa2lwIGlmIGRpc3RhbmNlIGJldHdlZW4gdGFwcyBpcyB0b28gYmlnXHJcblx0XHRcdGlmICggTWF0aC5hYnMoIHRhcFggLSBzZWxmLnRhcFggKSA+IDUwIHx8IE1hdGguYWJzKCB0YXBZIC0gc2VsZi50YXBZICkgPiA1MCB8fCBpbnN0YW5jZS5pc1NsaWRpbmcgKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIE9LLCBub3cgd2UgYXNzdW1lIHRoYXQgdGhpcyBpcyBhIGRvdWJsZS10YXBcclxuXHRcdFx0cHJvY2VzcyggJ2RibGNsaWNrJyArIHdoZXJlICk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHJcblx0XHRcdC8vIFNpbmdsZSB0YXAgd2lsbCBiZSBwcm9jZXNzZWQgaWYgdXNlciBoYXMgbm90IGNsaWNrZWQgc2Vjb25kIHRpbWUgd2l0aGluIDMwMG1zXHJcblx0XHRcdC8vIG9yIHRoZXJlIGlzIG5vIG5lZWQgdG8gd2FpdCBmb3IgZG91YmxlLXRhcFxyXG5cdFx0XHRzZWxmLnRhcFggPSB0YXBYO1xyXG5cdFx0XHRzZWxmLnRhcFkgPSB0YXBZO1xyXG5cclxuXHRcdFx0aWYgKCBjdXJyZW50Lm9wdHNbICdkYmxjbGljaycgKyB3aGVyZSBdICYmIGN1cnJlbnQub3B0c1sgJ2RibGNsaWNrJyArIHdoZXJlIF0gIT09IGN1cnJlbnQub3B0c1sgJ2NsaWNrJyArIHdoZXJlIF0gKSB7XHJcblx0XHRcdFx0c2VsZi50YXBwZWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0c2VsZi50YXBwZWQgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRcdHByb2Nlc3MoICdjbGljaycgKyB3aGVyZSApO1xyXG5cclxuXHRcdFx0XHR9LCAzMDApO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwcm9jZXNzKCAnY2xpY2snICsgd2hlcmUgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9O1xyXG5cclxuXHQkKGRvY3VtZW50KS5vbignb25BY3RpdmF0ZS5mYicsIGZ1bmN0aW9uIChlLCBpbnN0YW5jZSkge1xyXG5cdFx0aWYgKCBpbnN0YW5jZSAmJiAhaW5zdGFuY2UuR3Vlc3R1cmVzICkge1xyXG5cdFx0XHRpbnN0YW5jZS5HdWVzdHVyZXMgPSBuZXcgR3Vlc3R1cmVzKCBpbnN0YW5jZSApO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKGRvY3VtZW50KS5vbignYmVmb3JlQ2xvc2UuZmInLCBmdW5jdGlvbiAoZSwgaW5zdGFuY2UpIHtcclxuXHRcdGlmICggaW5zdGFuY2UgJiYgaW5zdGFuY2UuR3Vlc3R1cmVzICkge1xyXG5cdFx0XHRpbnN0YW5jZS5HdWVzdHVyZXMuZGVzdHJveSgpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHJcbn0oIHdpbmRvdywgZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkgfHwgalF1ZXJ5ICkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIFNsaWRlU2hvd1xyXG4vLyBFbmFibGVzIHNsaWRlc2hvdyBmdW5jdGlvbmFsaXR5XHJcbi8vXHJcbi8vIEV4YW1wbGUgb2YgdXNhZ2U6XHJcbi8vICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKS5TbGlkZVNob3cuc3RhcnQoKVxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG47KGZ1bmN0aW9uIChkb2N1bWVudCwgJCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0JC5leHRlbmQodHJ1ZSwgJC5mYW5jeWJveC5kZWZhdWx0cywge1xyXG5cdFx0YnRuVHBsIDoge1xyXG5cdFx0XHRzbGlkZVNob3cgOlxyXG5cdFx0XHRcdCc8YnV0dG9uIGRhdGEtZmFuY3lib3gtcGxheSBjbGFzcz1cImZhbmN5Ym94LWJ1dHRvbiBmYW5jeWJveC1idXR0b24tLXBsYXlcIiB0aXRsZT1cInt7UExBWV9TVEFSVH19XCI+JyArXHJcblx0XHRcdFx0XHQnPHN2ZyB2aWV3Qm94PVwiMCAwIDQwIDQwXCI+JyArXHJcblx0XHRcdFx0XHRcdCc8cGF0aCBkPVwiTTEzLDEyIEwyNywyMCBMMTMsMjcgWlwiIC8+JyArXHJcblx0XHRcdFx0XHRcdCc8cGF0aCBkPVwiTTE1LDEwIHYxOSBNMjMsMTAgdjE5XCIgLz4nICtcclxuXHRcdFx0XHRcdCc8L3N2Zz4nICtcclxuXHRcdFx0XHQnPC9idXR0b24+J1xyXG5cdFx0fSxcclxuXHRcdHNsaWRlU2hvdyA6IHtcclxuXHRcdFx0YXV0b1N0YXJ0IDogZmFsc2UsXHJcbiAgICAgICAgICAgIHNwZWVkICAgICA6IDMwMDBcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0dmFyIFNsaWRlU2hvdyA9IGZ1bmN0aW9uKCBpbnN0YW5jZSApIHtcclxuXHRcdHRoaXMuaW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuXHRcdHRoaXMuaW5pdCgpO1xyXG5cdH07XHJcblxyXG5cdCQuZXh0ZW5kKCBTbGlkZVNob3cucHJvdG90eXBlLCB7XHJcblx0XHR0aW1lciAgICA6IG51bGwsXHJcblx0XHRpc0FjdGl2ZSA6IGZhbHNlLFxyXG5cdFx0JGJ1dHRvbiAgOiBudWxsLFxyXG5cclxuXHRcdGluaXQgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0c2VsZi4kYnV0dG9uID0gc2VsZi5pbnN0YW5jZS4kcmVmcy50b29sYmFyLmZpbmQoJ1tkYXRhLWZhbmN5Ym94LXBsYXldJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0c2VsZi50b2dnbGUoKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIDwgMiB8fCAhc2VsZi5pbnN0YW5jZS5ncm91cFsgc2VsZi5pbnN0YW5jZS5jdXJySW5kZXggXS5vcHRzLnNsaWRlU2hvdyApIHtcclxuXHRcdFx0XHRzZWxmLiRidXR0b24uaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdHNldCA6IGZ1bmN0aW9uKCBmb3JjZSApIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuXHRcdFx0Ly8gQ2hlY2sgaWYgcmVhY2hlZCBsYXN0IGVsZW1lbnRcclxuXHRcdFx0aWYgKCBzZWxmLmluc3RhbmNlICYmIHNlbGYuaW5zdGFuY2UuY3VycmVudCAmJiAoZm9yY2UgPT09IHRydWUgfHwgc2VsZi5pbnN0YW5jZS5jdXJyZW50Lm9wdHMubG9vcCB8fCBzZWxmLmluc3RhbmNlLmN1cnJJbmRleCA8IHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoIC0gMSApKSB7XHJcblx0XHRcdFx0c2VsZi50aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRpZiAoIHNlbGYuaXNBY3RpdmUgKSB7XHJcblx0XHRcdFx0XHRcdHNlbGYuaW5zdGFuY2UuanVtcFRvKCAoc2VsZi5pbnN0YW5jZS5jdXJySW5kZXggKyAxKSAlIHNlbGYuaW5zdGFuY2UuZ3JvdXAubGVuZ3RoICk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdH0sIHNlbGYuaW5zdGFuY2UuY3VycmVudC5vcHRzLnNsaWRlU2hvdy5zcGVlZCk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHNlbGYuc3RvcCgpO1xyXG5cdFx0XHRcdHNlbGYuaW5zdGFuY2UuaWRsZVNlY29uZHNDb3VudGVyID0gMDtcclxuXHRcdFx0XHRzZWxmLmluc3RhbmNlLnNob3dDb250cm9scygpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGNsZWFyIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGNsZWFyVGltZW91dCggc2VsZi50aW1lciApO1xyXG5cclxuXHRcdFx0c2VsZi50aW1lciA9IG51bGw7XHJcblx0XHR9LFxyXG5cclxuXHRcdHN0YXJ0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0dmFyIGN1cnJlbnQgPSBzZWxmLmluc3RhbmNlLmN1cnJlbnQ7XHJcblxyXG5cdFx0XHRpZiAoIGN1cnJlbnQgKSB7XHJcblx0XHRcdFx0c2VsZi5pc0FjdGl2ZSA9IHRydWU7XHJcblxyXG5cdFx0XHRcdHNlbGYuJGJ1dHRvblxyXG5cdFx0XHRcdFx0LmF0dHIoICd0aXRsZScsIGN1cnJlbnQub3B0cy5pMThuWyBjdXJyZW50Lm9wdHMubGFuZyBdLlBMQVlfU1RPUCApXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC1idXR0b24tLXBsYXknIClcclxuXHRcdFx0XHRcdC5hZGRDbGFzcyggJ2ZhbmN5Ym94LWJ1dHRvbi0tcGF1c2UnICk7XHJcblxyXG5cdFx0XHRcdFx0c2VsZi5zZXQoIHRydWUgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRzdG9wIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHRcdFx0dmFyIGN1cnJlbnQgPSBzZWxmLmluc3RhbmNlLmN1cnJlbnQ7XHJcblxyXG5cdFx0XHRzZWxmLmNsZWFyKCk7XHJcblxyXG5cdFx0XHRzZWxmLiRidXR0b25cclxuXHRcdFx0XHQuYXR0ciggJ3RpdGxlJywgY3VycmVudC5vcHRzLmkxOG5bIGN1cnJlbnQub3B0cy5sYW5nIF0uUExBWV9TVEFSVCApXHJcblx0XHRcdFx0LnJlbW92ZUNsYXNzKCAnZmFuY3lib3gtYnV0dG9uLS1wYXVzZScgKVxyXG5cdFx0XHRcdC5hZGRDbGFzcyggJ2ZhbmN5Ym94LWJ1dHRvbi0tcGxheScgKTtcclxuXHJcblx0XHRcdHNlbGYuaXNBY3RpdmUgPSBmYWxzZTtcclxuXHRcdH0sXHJcblxyXG5cdFx0dG9nZ2xlIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdGlmICggc2VsZi5pc0FjdGl2ZSApIHtcclxuXHRcdFx0XHRzZWxmLnN0b3AoKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZi5zdGFydCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH0pO1xyXG5cclxuXHQkKGRvY3VtZW50KS5vbih7XHJcblx0XHQnb25Jbml0LmZiJyA6IGZ1bmN0aW9uKGUsIGluc3RhbmNlKSB7XHJcblx0XHRcdGlmICggaW5zdGFuY2UgJiYgIWluc3RhbmNlLlNsaWRlU2hvdyApIHtcclxuXHRcdFx0XHRpbnN0YW5jZS5TbGlkZVNob3cgPSBuZXcgU2xpZGVTaG93KCBpbnN0YW5jZSApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdCdiZWZvcmVTaG93LmZiJyA6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50LCBmaXJzdFJ1bikge1xyXG5cdFx0XHR2YXIgU2xpZGVTaG93ID0gaW5zdGFuY2UgJiYgaW5zdGFuY2UuU2xpZGVTaG93O1xyXG5cclxuXHRcdFx0aWYgKCBmaXJzdFJ1biApIHtcclxuXHJcblx0XHRcdFx0aWYgKCBTbGlkZVNob3cgJiYgY3VycmVudC5vcHRzLnNsaWRlU2hvdy5hdXRvU3RhcnQgKSB7XHJcblx0XHRcdFx0XHRTbGlkZVNob3cuc3RhcnQoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2UgaWYgKCBTbGlkZVNob3cgJiYgU2xpZGVTaG93LmlzQWN0aXZlICkgIHtcclxuXHRcdFx0XHRTbGlkZVNob3cuY2xlYXIoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQnYWZ0ZXJTaG93LmZiJyA6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBjdXJyZW50KSB7XHJcblx0XHRcdHZhciBTbGlkZVNob3cgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5TbGlkZVNob3c7XHJcblxyXG5cdFx0XHRpZiAoIFNsaWRlU2hvdyAmJiBTbGlkZVNob3cuaXNBY3RpdmUgKSB7XHJcblx0XHRcdFx0U2xpZGVTaG93LnNldCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdCdhZnRlcktleWRvd24uZmInIDogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGN1cnJlbnQsIGtleXByZXNzLCBrZXljb2RlKSB7XHJcblx0XHRcdHZhciBTbGlkZVNob3cgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5TbGlkZVNob3c7XHJcblxyXG5cdFx0XHQvLyBcIlBcIiBvciBTcGFjZWJhclxyXG5cdFx0XHRpZiAoIFNsaWRlU2hvdyAmJiBjdXJyZW50Lm9wdHMuc2xpZGVTaG93ICYmICgga2V5Y29kZSA9PT0gODAgfHwga2V5Y29kZSA9PT0gMzIgKSAmJiAhJChkb2N1bWVudC5hY3RpdmVFbGVtZW50KS5pcyggJ2J1dHRvbixhLGlucHV0JyApICkge1xyXG5cdFx0XHRcdGtleXByZXNzLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0XHRcdFNsaWRlU2hvdy50b2dnbGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHQnYmVmb3JlQ2xvc2UuZmIgb25EZWFjdGl2YXRlLmZiJyA6IGZ1bmN0aW9uKGUsIGluc3RhbmNlKSB7XHJcblx0XHRcdHZhciBTbGlkZVNob3cgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5TbGlkZVNob3c7XHJcblxyXG5cdFx0XHRpZiAoIFNsaWRlU2hvdyApIHtcclxuXHRcdFx0XHRTbGlkZVNob3cuc3RvcCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSk7XHJcblxyXG5cdC8vIFBhZ2UgVmlzaWJpbGl0eSBBUEkgdG8gcGF1c2Ugc2xpZGVzaG93IHdoZW4gd2luZG93IGlzIG5vdCBhY3RpdmVcclxuXHQkKGRvY3VtZW50KS5vbihcInZpc2liaWxpdHljaGFuZ2VcIiwgZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgaW5zdGFuY2UgID0gJC5mYW5jeWJveC5nZXRJbnN0YW5jZSgpO1xyXG5cdFx0dmFyIFNsaWRlU2hvdyA9IGluc3RhbmNlICYmIGluc3RhbmNlLlNsaWRlU2hvdztcclxuXHJcblx0XHRpZiAoIFNsaWRlU2hvdyAmJiBTbGlkZVNob3cuaXNBY3RpdmUgKSB7XHJcblx0XHRcdGlmICggZG9jdW1lbnQuaGlkZGVuICkge1xyXG5cdFx0XHRcdFNsaWRlU2hvdy5jbGVhcigpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRTbGlkZVNob3cuc2V0KCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHJcbn0oIGRvY3VtZW50LCB3aW5kb3cualF1ZXJ5IHx8IGpRdWVyeSApKTtcclxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vL1xyXG4vLyBGdWxsU2NyZWVuXHJcbi8vIEFkZHMgZnVsbHNjcmVlbiBmdW5jdGlvbmFsaXR5XHJcbi8vXHJcbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbjsoZnVuY3Rpb24gKGRvY3VtZW50LCAkKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvLyBDb2xsZWN0aW9uIG9mIG1ldGhvZHMgc3VwcG9ydGVkIGJ5IHVzZXIgYnJvd3NlclxyXG5cdHZhciBmbiA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0dmFyIGZuTWFwID0gW1xyXG5cdFx0XHRbXHJcblx0XHRcdFx0J3JlcXVlc3RGdWxsc2NyZWVuJyxcclxuXHRcdFx0XHQnZXhpdEZ1bGxzY3JlZW4nLFxyXG5cdFx0XHRcdCdmdWxsc2NyZWVuRWxlbWVudCcsXHJcblx0XHRcdFx0J2Z1bGxzY3JlZW5FbmFibGVkJyxcclxuXHRcdFx0XHQnZnVsbHNjcmVlbmNoYW5nZScsXHJcblx0XHRcdFx0J2Z1bGxzY3JlZW5lcnJvcidcclxuXHRcdFx0XSxcclxuXHRcdFx0Ly8gbmV3IFdlYktpdFxyXG5cdFx0XHRbXHJcblx0XHRcdFx0J3dlYmtpdFJlcXVlc3RGdWxsc2NyZWVuJyxcclxuXHRcdFx0XHQnd2Via2l0RXhpdEZ1bGxzY3JlZW4nLFxyXG5cdFx0XHRcdCd3ZWJraXRGdWxsc2NyZWVuRWxlbWVudCcsXHJcblx0XHRcdFx0J3dlYmtpdEZ1bGxzY3JlZW5FbmFibGVkJyxcclxuXHRcdFx0XHQnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsXHJcblx0XHRcdFx0J3dlYmtpdGZ1bGxzY3JlZW5lcnJvcidcclxuXHJcblx0XHRcdF0sXHJcblx0XHRcdC8vIG9sZCBXZWJLaXQgKFNhZmFyaSA1LjEpXHJcblx0XHRcdFtcclxuXHRcdFx0XHQnd2Via2l0UmVxdWVzdEZ1bGxTY3JlZW4nLFxyXG5cdFx0XHRcdCd3ZWJraXRDYW5jZWxGdWxsU2NyZWVuJyxcclxuXHRcdFx0XHQnd2Via2l0Q3VycmVudEZ1bGxTY3JlZW5FbGVtZW50JyxcclxuXHRcdFx0XHQnd2Via2l0Q2FuY2VsRnVsbFNjcmVlbicsXHJcblx0XHRcdFx0J3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLFxyXG5cdFx0XHRcdCd3ZWJraXRmdWxsc2NyZWVuZXJyb3InXHJcblxyXG5cdFx0XHRdLFxyXG5cdFx0XHRbXHJcblx0XHRcdFx0J21velJlcXVlc3RGdWxsU2NyZWVuJyxcclxuXHRcdFx0XHQnbW96Q2FuY2VsRnVsbFNjcmVlbicsXHJcblx0XHRcdFx0J21vekZ1bGxTY3JlZW5FbGVtZW50JyxcclxuXHRcdFx0XHQnbW96RnVsbFNjcmVlbkVuYWJsZWQnLFxyXG5cdFx0XHRcdCdtb3pmdWxsc2NyZWVuY2hhbmdlJyxcclxuXHRcdFx0XHQnbW96ZnVsbHNjcmVlbmVycm9yJ1xyXG5cdFx0XHRdLFxyXG5cdFx0XHRbXHJcblx0XHRcdFx0J21zUmVxdWVzdEZ1bGxzY3JlZW4nLFxyXG5cdFx0XHRcdCdtc0V4aXRGdWxsc2NyZWVuJyxcclxuXHRcdFx0XHQnbXNGdWxsc2NyZWVuRWxlbWVudCcsXHJcblx0XHRcdFx0J21zRnVsbHNjcmVlbkVuYWJsZWQnLFxyXG5cdFx0XHRcdCdNU0Z1bGxzY3JlZW5DaGFuZ2UnLFxyXG5cdFx0XHRcdCdNU0Z1bGxzY3JlZW5FcnJvcidcclxuXHRcdFx0XVxyXG5cdFx0XTtcclxuXHJcblx0XHR2YXIgdmFsO1xyXG5cdFx0dmFyIHJldCA9IHt9O1xyXG5cdFx0dmFyIGksIGo7XHJcblxyXG5cdFx0Zm9yICggaSA9IDA7IGkgPCBmbk1hcC5sZW5ndGg7IGkrKyApIHtcclxuXHRcdFx0dmFsID0gZm5NYXBbIGkgXTtcclxuXHJcblx0XHRcdGlmICggdmFsICYmIHZhbFsgMSBdIGluIGRvY3VtZW50ICkge1xyXG5cdFx0XHRcdGZvciAoIGogPSAwOyBqIDwgdmFsLmxlbmd0aDsgaisrICkge1xyXG5cdFx0XHRcdFx0cmV0WyBmbk1hcFsgMCBdWyBqIF0gXSA9IHZhbFsgaiBdO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0cmV0dXJuIHJldDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9KSgpO1xyXG5cclxuXHQvLyBJZiBicm93c2VyIGRvZXMgbm90IGhhdmUgRnVsbCBTY3JlZW4gQVBJLCB0aGVuIHNpbXBseSB1bnNldCBkZWZhdWx0IGJ1dHRvbiB0ZW1wbGF0ZSBhbmQgc3RvcFxyXG5cdGlmICggIWZuICkge1xyXG5cclxuXHRcdGlmICggJCAmJiAkLmZhbmN5Ym94ICkge1xyXG5cdFx0XHQkLmZhbmN5Ym94LmRlZmF1bHRzLmJ0blRwbC5mdWxsU2NyZWVuID0gZmFsc2U7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0dmFyIEZ1bGxTY3JlZW4gPSB7XHJcblxyXG5cdFx0cmVxdWVzdCA6IGZ1bmN0aW9uICggZWxlbSApIHtcclxuXHJcblx0XHRcdGVsZW0gPSBlbGVtIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHJcblx0XHRcdGVsZW1bIGZuLnJlcXVlc3RGdWxsc2NyZWVuIF0oIGVsZW0uQUxMT1dfS0VZQk9BUkRfSU5QVVQgKTtcclxuXHJcblx0XHR9LFxyXG5cdFx0ZXhpdCA6IGZ1bmN0aW9uICgpIHtcclxuXHJcblx0XHRcdGRvY3VtZW50WyBmbi5leGl0RnVsbHNjcmVlbiBdKCk7XHJcblxyXG5cdFx0fSxcclxuXHRcdHRvZ2dsZSA6IGZ1bmN0aW9uICggZWxlbSApIHtcclxuXHJcblx0XHRcdGVsZW0gPSBlbGVtIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcclxuXHJcblx0XHRcdGlmICggdGhpcy5pc0Z1bGxzY3JlZW4oKSApIHtcclxuXHRcdFx0XHR0aGlzLmV4aXQoKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5yZXF1ZXN0KCBlbGVtICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9LFxyXG5cdFx0aXNGdWxsc2NyZWVuIDogZnVuY3Rpb24oKSAge1xyXG5cclxuXHRcdFx0cmV0dXJuIEJvb2xlYW4oIGRvY3VtZW50WyBmbi5mdWxsc2NyZWVuRWxlbWVudCBdICk7XHJcblxyXG5cdFx0fSxcclxuXHRcdGVuYWJsZWQgOiBmdW5jdGlvbigpICB7XHJcblxyXG5cdFx0XHRyZXR1cm4gQm9vbGVhbiggZG9jdW1lbnRbIGZuLmZ1bGxzY3JlZW5FbmFibGVkIF0gKTtcclxuXHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0JC5leHRlbmQodHJ1ZSwgJC5mYW5jeWJveC5kZWZhdWx0cywge1xyXG5cdFx0YnRuVHBsIDoge1xyXG5cdFx0XHRmdWxsU2NyZWVuIDpcclxuXHRcdFx0XHQnPGJ1dHRvbiBkYXRhLWZhbmN5Ym94LWZ1bGxzY3JlZW4gY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1mdWxsc2NyZWVuXCIgdGl0bGU9XCJ7e0ZVTExfU0NSRUVOfX1cIj4nICtcclxuXHRcdFx0XHRcdCc8c3ZnIHZpZXdCb3g9XCIwIDAgNDAgNDBcIj4nICtcclxuXHRcdFx0XHRcdFx0JzxwYXRoIGQ9XCJNOSwxMiBoMjIgdjE2IGgtMjIgdi0xNiB2MTYgaDIyIHYtMTYgWlwiIC8+JyArXHJcblx0XHRcdFx0XHQnPC9zdmc+JyArXHJcblx0XHRcdFx0JzwvYnV0dG9uPidcclxuXHRcdH0sXHJcblx0XHRmdWxsU2NyZWVuIDoge1xyXG5cdFx0XHRhdXRvU3RhcnQgOiBmYWxzZVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKGRvY3VtZW50KS5vbih7XHJcblx0XHQnb25Jbml0LmZiJyA6IGZ1bmN0aW9uKGUsIGluc3RhbmNlKSB7XHJcblx0XHRcdHZhciAkY29udGFpbmVyO1xyXG5cclxuXHRcdFx0aWYgKCBpbnN0YW5jZSAmJiBpbnN0YW5jZS5ncm91cFsgaW5zdGFuY2UuY3VyckluZGV4IF0ub3B0cy5mdWxsU2NyZWVuICkge1xyXG5cdFx0XHRcdCRjb250YWluZXIgPSBpbnN0YW5jZS4kcmVmcy5jb250YWluZXI7XHJcblxyXG5cdFx0XHRcdCRjb250YWluZXIub24oJ2NsaWNrLmZiLWZ1bGxzY3JlZW4nLCAnW2RhdGEtZmFuY3lib3gtZnVsbHNjcmVlbl0nLCBmdW5jdGlvbihlKSB7XHJcblxyXG5cdFx0XHRcdFx0ZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHRcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0XHRGdWxsU2NyZWVuLnRvZ2dsZSggJGNvbnRhaW5lclsgMCBdICk7XHJcblxyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRpZiAoIGluc3RhbmNlLm9wdHMuZnVsbFNjcmVlbiAmJiBpbnN0YW5jZS5vcHRzLmZ1bGxTY3JlZW4uYXV0b1N0YXJ0ID09PSB0cnVlICkge1xyXG5cdFx0XHRcdFx0RnVsbFNjcmVlbi5yZXF1ZXN0KCAkY29udGFpbmVyWyAwIF0gKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdC8vIEV4cG9zZSBBUElcclxuXHRcdFx0XHRpbnN0YW5jZS5GdWxsU2NyZWVuID0gRnVsbFNjcmVlbjtcclxuXHJcblx0XHRcdH0gZWxzZSBpZiAoIGluc3RhbmNlICkge1xyXG5cdFx0XHRcdGluc3RhbmNlLiRyZWZzLnRvb2xiYXIuZmluZCgnW2RhdGEtZmFuY3lib3gtZnVsbHNjcmVlbl0nKS5oaWRlKCk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdCdhZnRlcktleWRvd24uZmInIDogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGN1cnJlbnQsIGtleXByZXNzLCBrZXljb2RlKSB7XHJcblxyXG5cdFx0XHQvLyBcIlBcIiBvciBTcGFjZWJhclxyXG5cdFx0XHRpZiAoIGluc3RhbmNlICYmIGluc3RhbmNlLkZ1bGxTY3JlZW4gJiYga2V5Y29kZSA9PT0gNzAgKSB7XHJcblx0XHRcdFx0a2V5cHJlc3MucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0aW5zdGFuY2UuRnVsbFNjcmVlbi50b2dnbGUoIGluc3RhbmNlLiRyZWZzLmNvbnRhaW5lclsgMCBdICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHR9LFxyXG5cclxuXHRcdCdiZWZvcmVDbG9zZS5mYicgOiBmdW5jdGlvbiggaW5zdGFuY2UgKSB7XHJcblx0XHRcdGlmICggaW5zdGFuY2UgJiYgaW5zdGFuY2UuRnVsbFNjcmVlbiApIHtcclxuXHRcdFx0XHRGdWxsU2NyZWVuLmV4aXQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0pO1xyXG5cclxuXHQkKGRvY3VtZW50KS5vbihmbi5mdWxsc2NyZWVuY2hhbmdlLCBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBpc0Z1bGxzY3JlZW4gPSBGdWxsU2NyZWVuLmlzRnVsbHNjcmVlbigpLFxyXG5cdFx0XHRpbnN0YW5jZSA9ICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKTtcclxuXHJcblx0XHRpZiAoIGluc3RhbmNlICkge1xyXG5cclxuXHRcdFx0Ly8gSWYgaW1hZ2UgaXMgem9vbWluZywgdGhlbiBmb3JjZSB0byBzdG9wIGFuZCByZXBvc2l0aW9uIHByb3Blcmx5XHJcblx0XHRcdGlmICggaW5zdGFuY2UuY3VycmVudCAmJiBpbnN0YW5jZS5jdXJyZW50LnR5cGUgPT09ICdpbWFnZScgJiYgaW5zdGFuY2UuaXNBbmltYXRpbmcgKSB7XHJcblx0XHRcdFx0aW5zdGFuY2UuY3VycmVudC4kY29udGVudC5jc3MoICd0cmFuc2l0aW9uJywgJ25vbmUnICk7XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLmlzQW5pbWF0aW5nID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdGluc3RhbmNlLnVwZGF0ZSggdHJ1ZSwgdHJ1ZSwgMCApO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpbnN0YW5jZS50cmlnZ2VyKCAnb25GdWxsc2NyZWVuQ2hhbmdlJywgaXNGdWxsc2NyZWVuICk7XHJcblxyXG5cdFx0XHRpbnN0YW5jZS4kcmVmcy5jb250YWluZXIudG9nZ2xlQ2xhc3MoICdmYW5jeWJveC1pcy1mdWxsc2NyZWVuJywgaXNGdWxsc2NyZWVuICk7XHJcblx0XHR9XHJcblxyXG5cdH0pO1xyXG5cclxufSggZG9jdW1lbnQsIHdpbmRvdy5qUXVlcnkgfHwgalF1ZXJ5ICkpO1xyXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbi8vXHJcbi8vIFRodW1ic1xyXG4vLyBEaXNwbGF5cyB0aHVtYm5haWxzIGluIGEgZ3JpZFxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG47KGZ1bmN0aW9uIChkb2N1bWVudCwgJCkge1xyXG5cdCd1c2Ugc3RyaWN0JztcclxuXHJcblx0Ly8gTWFrZSBzdXJlIHRoZXJlIGFyZSBkZWZhdWx0IHZhbHVlc1xyXG5cdCQuZmFuY3lib3guZGVmYXVsdHMgPSAkLmV4dGVuZCh0cnVlLCB7XHJcblx0XHRidG5UcGwgOiB7XHJcblx0XHRcdHRodW1icyA6XHJcblx0XHRcdCc8YnV0dG9uIGRhdGEtZmFuY3lib3gtdGh1bWJzIGNsYXNzPVwiZmFuY3lib3gtYnV0dG9uIGZhbmN5Ym94LWJ1dHRvbi0tdGh1bWJzXCIgdGl0bGU9XCJ7e1RIVU1CU319XCI+JyArXHJcblx0XHRcdFx0Jzxzdmcgdmlld0JveD1cIjAgMCAxMjAgMTIwXCI+JyArXHJcblx0XHRcdFx0XHQnPHBhdGggZD1cIk0zMCwzMCBoMTQgdjE0IGgtMTQgWiBNNTAsMzAgaDE0IHYxNCBoLTE0IFogTTcwLDMwIGgxNCB2MTQgaC0xNCBaIE0zMCw1MCBoMTQgdjE0IGgtMTQgWiBNNTAsNTAgaDE0IHYxNCBoLTE0IFogTTcwLDUwIGgxNCB2MTQgaC0xNCBaIE0zMCw3MCBoMTQgdjE0IGgtMTQgWiBNNTAsNzAgaDE0IHYxNCBoLTE0IFogTTcwLDcwIGgxNCB2MTQgaC0xNCBaXCIgLz4nICtcclxuXHRcdFx0XHQnPC9zdmc+JyArXHJcblx0XHRcdCc8L2J1dHRvbj4nXHJcblx0XHR9LFxyXG5cdFx0dGh1bWJzIDoge1xyXG5cdFx0XHRhdXRvU3RhcnQgICA6IGZhbHNlLCAgICAgICAgICAgICAgICAgIC8vIERpc3BsYXkgdGh1bWJuYWlscyBvbiBvcGVuaW5nXHJcblx0XHRcdGhpZGVPbkNsb3NlIDogdHJ1ZSwgICAgICAgICAgICAgICAgICAgLy8gSGlkZSB0aHVtYm5haWwgZ3JpZCB3aGVuIGNsb3NpbmcgYW5pbWF0aW9uIHN0YXJ0c1xyXG5cdFx0XHRwYXJlbnRFbCAgICA6ICcuZmFuY3lib3gtY29udGFpbmVyJywgIC8vIENvbnRhaW5lciBpcyBpbmplY3RlZCBpbnRvIHRoaXMgZWxlbWVudFxyXG5cdFx0XHRheGlzICAgICAgICA6ICd5JyAgICAgICAgICAgICAgICAgICAgIC8vIFZlcnRpY2FsICh5KSBvciBob3Jpem9udGFsICh4KSBzY3JvbGxpbmdcclxuXHRcdH1cclxuXHR9LCAkLmZhbmN5Ym94LmRlZmF1bHRzKTtcclxuXHJcblx0dmFyIEZhbmN5VGh1bWJzID0gZnVuY3Rpb24oIGluc3RhbmNlICkge1xyXG5cdFx0dGhpcy5pbml0KCBpbnN0YW5jZSApO1xyXG5cdH07XHJcblxyXG5cdCQuZXh0ZW5kKCBGYW5jeVRodW1icy5wcm90b3R5cGUsIHtcclxuXHJcblx0XHQkYnV0dG9uXHRcdDogbnVsbCxcclxuXHRcdCRncmlkXHRcdDogbnVsbCxcclxuXHRcdCRsaXN0XHRcdDogbnVsbCxcclxuXHRcdGlzVmlzaWJsZVx0OiBmYWxzZSxcclxuXHRcdGlzQWN0aXZlXHQ6IGZhbHNlLFxyXG5cclxuXHRcdGluaXQgOiBmdW5jdGlvbiggaW5zdGFuY2UgKSB7XHJcblx0XHRcdHZhciBzZWxmID0gdGhpcztcclxuXHJcblx0XHRcdHNlbGYuaW5zdGFuY2UgPSBpbnN0YW5jZTtcclxuXHJcblx0XHRcdGluc3RhbmNlLlRodW1icyA9IHNlbGY7XHJcblxyXG5cdFx0XHQvLyBFbmFibGUgdGh1bWJzIGlmIGF0IGxlYXN0IHR3byBncm91cCBpdGVtcyBoYXZlIHRodW1ibmFpbHNcclxuXHRcdFx0dmFyIGZpcnN0ICA9IGluc3RhbmNlLmdyb3VwWzBdLFxyXG5cdFx0XHRcdHNlY29uZCA9IGluc3RhbmNlLmdyb3VwWzFdO1xyXG5cclxuXHRcdFx0c2VsZi5vcHRzID0gaW5zdGFuY2UuZ3JvdXBbIGluc3RhbmNlLmN1cnJJbmRleCBdLm9wdHMudGh1bWJzO1xyXG5cclxuXHRcdFx0c2VsZi4kYnV0dG9uID0gaW5zdGFuY2UuJHJlZnMudG9vbGJhci5maW5kKCAnW2RhdGEtZmFuY3lib3gtdGh1bWJzXScgKTtcclxuXHJcblx0XHRcdGlmICggc2VsZi5vcHRzICYmIGZpcnN0ICYmIHNlY29uZCAmJiAoXHJcblx0XHQgICAgXHRcdCggZmlyc3QudHlwZSA9PSAnaW1hZ2UnICB8fCBmaXJzdC5vcHRzLnRodW1iICB8fCBmaXJzdC5vcHRzLiR0aHVtYiApICYmXHJcblx0XHQgICAgXHRcdCggc2Vjb25kLnR5cGUgPT0gJ2ltYWdlJyB8fCBzZWNvbmQub3B0cy50aHVtYiB8fCBzZWNvbmQub3B0cy4kdGh1bWIgKVxyXG5cdFx0XHQpKSB7XHJcblxyXG5cdFx0XHRcdHNlbGYuJGJ1dHRvbi5zaG93KCkub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRzZWxmLnRvZ2dsZSgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRzZWxmLmlzQWN0aXZlID0gdHJ1ZTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2VsZi4kYnV0dG9uLmhpZGUoKTtcclxuXHRcdFx0fVxyXG5cdFx0fSxcclxuXHJcblx0XHRjcmVhdGUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHNlbGYgPSB0aGlzLFxyXG5cdFx0XHRcdGluc3RhbmNlID0gc2VsZi5pbnN0YW5jZSxcclxuXHRcdFx0XHRwYXJlbnRFbCA9IHNlbGYub3B0cy5wYXJlbnRFbCxcclxuXHRcdFx0XHRsaXN0LFxyXG5cdFx0XHRcdHNyYztcclxuXHJcblx0XHRcdHNlbGYuJGdyaWQgPSAkKCc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtdGh1bWJzIGZhbmN5Ym94LXRodW1icy0nICsgc2VsZi5vcHRzLmF4aXMgKyAnXCI+PC9kaXY+JykuYXBwZW5kVG8oIGluc3RhbmNlLiRyZWZzLmNvbnRhaW5lci5maW5kKCBwYXJlbnRFbCApLmFkZEJhY2soKS5maWx0ZXIoIHBhcmVudEVsICkgKTtcclxuXHJcblx0XHRcdC8vIEJ1aWxkIGxpc3QgSFRNTFxyXG5cdFx0XHRsaXN0ID0gJzx1bD4nO1xyXG5cclxuXHRcdFx0JC5lYWNoKGluc3RhbmNlLmdyb3VwLCBmdW5jdGlvbiggaSwgaXRlbSApIHtcclxuXHRcdFx0XHRzcmMgPSBpdGVtLm9wdHMudGh1bWIgfHwgKCBpdGVtLm9wdHMuJHRodW1iID8gaXRlbS5vcHRzLiR0aHVtYi5hdHRyKCAnc3JjJyApIDogbnVsbCApO1xyXG5cclxuXHRcdFx0XHRpZiAoICFzcmMgJiYgaXRlbS50eXBlID09PSAnaW1hZ2UnICkge1xyXG5cdFx0XHRcdFx0c3JjID0gaXRlbS5zcmM7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoIHNyYyAmJiBzcmMubGVuZ3RoICkge1xyXG5cdFx0XHRcdFx0bGlzdCArPSAnPGxpIGRhdGEtaW5kZXg9XCInICsgaSArICdcIiAgdGFiaW5kZXg9XCIwXCIgY2xhc3M9XCJmYW5jeWJveC10aHVtYnMtbG9hZGluZ1wiPjxpbWcgZGF0YS1zcmM9XCInICsgc3JjICsgJ1wiIC8+PC9saT4nO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRsaXN0ICs9ICc8L3VsPic7XHJcblxyXG5cdFx0XHRzZWxmLiRsaXN0ID0gJCggbGlzdCApLmFwcGVuZFRvKCBzZWxmLiRncmlkICkub24oJ2NsaWNrJywgJ2xpJywgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0aW5zdGFuY2UuanVtcFRvKCAkKHRoaXMpLmRhdGEoJ2luZGV4JykgKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRzZWxmLiRsaXN0LmZpbmQoICdpbWcnICkuaGlkZSgpLm9uZSgnbG9hZCcsIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciAkcGFyZW50XHRcdD0gJCh0aGlzKS5wYXJlbnQoKS5yZW1vdmVDbGFzcyggJ2ZhbmN5Ym94LXRodW1icy1sb2FkaW5nJyApLFxyXG5cdFx0XHRcdFx0dGh1bWJXaWR0aFx0PSAkcGFyZW50Lm91dGVyV2lkdGgoKSxcclxuXHRcdFx0XHRcdHRodW1iSGVpZ2h0XHQ9ICRwYXJlbnQub3V0ZXJIZWlnaHQoKSxcclxuXHRcdFx0XHRcdHdpZHRoLFxyXG5cdFx0XHRcdFx0aGVpZ2h0LFxyXG5cdFx0XHRcdFx0d2lkdGhSYXRpbyxcclxuXHRcdFx0XHRcdGhlaWdodFJhdGlvO1xyXG5cclxuXHRcdFx0XHR3aWR0aCAgPSB0aGlzLm5hdHVyYWxXaWR0aFx0fHwgdGhpcy53aWR0aDtcclxuXHRcdFx0XHRoZWlnaHQgPSB0aGlzLm5hdHVyYWxIZWlnaHRcdHx8IHRoaXMuaGVpZ2h0O1xyXG5cclxuXHRcdFx0XHQvLyBDYWxjdWxhdGUgdGh1bWJuYWlsIGRpbWVuc2lvbnM7IGNlbnRlciB2ZXJ0aWNhbGx5IGFuZCBob3Jpem9udGFsbHlcclxuXHRcdFx0XHR3aWR0aFJhdGlvICA9IHdpZHRoICAvIHRodW1iV2lkdGg7XHJcblx0XHRcdFx0aGVpZ2h0UmF0aW8gPSBoZWlnaHQgLyB0aHVtYkhlaWdodDtcclxuXHJcblx0XHRcdFx0aWYgKHdpZHRoUmF0aW8gPj0gMSAmJiBoZWlnaHRSYXRpbyA+PSAxKSB7XHJcblx0XHRcdFx0XHRpZiAod2lkdGhSYXRpbyA+IGhlaWdodFJhdGlvKSB7XHJcblx0XHRcdFx0XHRcdHdpZHRoICA9IHdpZHRoIC8gaGVpZ2h0UmF0aW87XHJcblx0XHRcdFx0XHRcdGhlaWdodCA9IHRodW1iSGVpZ2h0O1xyXG5cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHdpZHRoICA9IHRodW1iV2lkdGg7XHJcblx0XHRcdFx0XHRcdGhlaWdodCA9IGhlaWdodCAvIHdpZHRoUmF0aW87XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQkKHRoaXMpLmNzcyh7XHJcblx0XHRcdFx0XHR3aWR0aCAgICAgICAgIDogTWF0aC5mbG9vcih3aWR0aCksXHJcblx0XHRcdFx0XHRoZWlnaHQgICAgICAgIDogTWF0aC5mbG9vcihoZWlnaHQpLFxyXG5cdFx0XHRcdFx0J21hcmdpbi10b3AnICA6IGhlaWdodCA+IHRodW1iSGVpZ2h0ID8gKCBNYXRoLmZsb29yKHRodW1iSGVpZ2h0ICogMC4zIC0gaGVpZ2h0ICogMC4zICkgKSA6IE1hdGguZmxvb3IodGh1bWJIZWlnaHQgKiAwLjUgLSBoZWlnaHQgKiAwLjUgKSxcclxuXHRcdFx0XHRcdCdtYXJnaW4tbGVmdCcgOiBNYXRoLmZsb29yKHRodW1iV2lkdGggKiAwLjUgLSB3aWR0aCAqIDAuNSApXHJcblx0XHRcdFx0fSkuc2hvdygpO1xyXG5cclxuXHRcdFx0fSlcclxuXHRcdFx0LmVhY2goZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dGhpcy5zcmMgPSAkKCB0aGlzICkuZGF0YSggJ3NyYycgKTtcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0XHRpZiAoIHNlbGYub3B0cy5heGlzID09PSAneCcgKSB7XHJcblx0XHRcdFx0c2VsZi4kbGlzdC53aWR0aCggcGFyc2VJbnQoIHNlbGYuJGdyaWQuY3NzKFwicGFkZGluZy1yaWdodFwiKSApICsgKCBpbnN0YW5jZS5ncm91cC5sZW5ndGggKiBzZWxmLiRsaXN0LmNoaWxkcmVuKCkuZXEoMCkub3V0ZXJXaWR0aCh0cnVlKSApICsgJ3B4JyApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdGZvY3VzIDogZnVuY3Rpb24oIGR1cmF0aW9uICkge1xyXG5cdFx0XHR2YXIgc2VsZiA9IHRoaXMsXHJcblx0XHRcdFx0JGxpc3QgPSBzZWxmLiRsaXN0LFxyXG5cdFx0XHRcdHRodW1iLFxyXG5cdFx0XHRcdHRodW1iUG9zO1xyXG5cclxuXHRcdFx0aWYgKCBzZWxmLmluc3RhbmNlLmN1cnJlbnQgKSB7XHJcblx0XHRcdFx0dGh1bWIgPSAkbGlzdC5jaGlsZHJlbigpXHJcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoICdmYW5jeWJveC10aHVtYnMtYWN0aXZlJyApXHJcblx0XHRcdFx0XHQuZmlsdGVyKCdbZGF0YS1pbmRleD1cIicgKyBzZWxmLmluc3RhbmNlLmN1cnJlbnQuaW5kZXggICsgJ1wiXScpXHJcblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2ZhbmN5Ym94LXRodW1icy1hY3RpdmUnKTtcclxuXHJcblx0XHRcdFx0dGh1bWJQb3MgPSB0aHVtYi5wb3NpdGlvbigpO1xyXG5cclxuXHRcdFx0XHQvLyBDaGVjayBpZiBuZWVkIHRvIHNjcm9sbCB0byBtYWtlIGN1cnJlbnQgdGh1bWIgdmlzaWJsZVxyXG5cdFx0XHRcdGlmICggc2VsZi5vcHRzLmF4aXMgPT09ICd5JyAmJiAoIHRodW1iUG9zLnRvcCA8IDAgfHwgdGh1bWJQb3MudG9wID4gKCAkbGlzdC5oZWlnaHQoKSAtIHRodW1iLm91dGVySGVpZ2h0KCkgKSApICkge1xyXG5cdFx0XHRcdFx0JGxpc3Quc3RvcCgpLmFuaW1hdGUoeyAnc2Nyb2xsVG9wJyA6ICRsaXN0LnNjcm9sbFRvcCgpICsgdGh1bWJQb3MudG9wIH0sIGR1cmF0aW9uKTtcclxuXHJcblx0XHRcdFx0fSBlbHNlIGlmICggc2VsZi5vcHRzLmF4aXMgPT09ICd4JyAmJiAoXHJcblx0XHRcdFx0XHRcdHRodW1iUG9zLmxlZnQgPCAkbGlzdC5wYXJlbnQoKS5zY3JvbGxMZWZ0KCkgfHxcclxuXHRcdFx0XHRcdFx0dGh1bWJQb3MubGVmdCA+ICggJGxpc3QucGFyZW50KCkuc2Nyb2xsTGVmdCgpICsgKCAkbGlzdC5wYXJlbnQoKS53aWR0aCgpIC0gdGh1bWIub3V0ZXJXaWR0aCgpICkgKVxyXG5cdFx0XHRcdFx0KVxyXG5cdFx0XHRcdCkge1xyXG5cdFx0XHRcdFx0JGxpc3QucGFyZW50KCkuc3RvcCgpLmFuaW1hdGUoeyAnc2Nyb2xsTGVmdCcgOiB0aHVtYlBvcy5sZWZ0IH0sIGR1cmF0aW9uKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH0sXHJcblxyXG5cdFx0dXBkYXRlIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdHRoaXMuaW5zdGFuY2UuJHJlZnMuY29udGFpbmVyLnRvZ2dsZUNsYXNzKCAnZmFuY3lib3gtc2hvdy10aHVtYnMnLCB0aGlzLmlzVmlzaWJsZSApO1xyXG5cclxuXHRcdFx0aWYgKCB0aGlzLmlzVmlzaWJsZSApIHtcclxuXHRcdFx0XHRpZiAoICF0aGlzLiRncmlkICkge1xyXG5cdFx0XHRcdFx0dGhpcy5jcmVhdGUoKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHRoaXMuaW5zdGFuY2UudHJpZ2dlciggJ29uVGh1bWJzU2hvdycgKTtcclxuXHJcblx0XHRcdFx0dGhpcy5mb2N1cyggMCApO1xyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggdGhpcy4kZ3JpZCApIHtcclxuXHRcdFx0XHR0aGlzLmluc3RhbmNlLnRyaWdnZXIoICdvblRodW1ic0hpZGUnICk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdC8vIFVwZGF0ZSBjb250ZW50IHBvc2l0aW9uXHJcblx0XHRcdHRoaXMuaW5zdGFuY2UudXBkYXRlKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdGhpZGUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0dGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcclxuXHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdH0sXHJcblxyXG5cdFx0c2hvdyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcblx0XHRcdHRoaXMudXBkYXRlKCk7XHJcblx0XHR9LFxyXG5cclxuXHRcdHRvZ2dsZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR0aGlzLmlzVmlzaWJsZSA9ICF0aGlzLmlzVmlzaWJsZTtcclxuXHRcdFx0dGhpcy51cGRhdGUoKTtcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0JChkb2N1bWVudCkub24oe1xyXG5cclxuXHRcdCdvbkluaXQuZmInIDogZnVuY3Rpb24oZSwgaW5zdGFuY2UpIHtcclxuXHRcdFx0dmFyIFRodW1icztcclxuXHJcblx0XHRcdGlmICggaW5zdGFuY2UgJiYgIWluc3RhbmNlLlRodW1icyApIHtcclxuXHRcdFx0XHRUaHVtYnMgPSBuZXcgRmFuY3lUaHVtYnMoIGluc3RhbmNlICk7XHJcblxyXG5cdFx0XHRcdGlmICggVGh1bWJzLmlzQWN0aXZlICYmIFRodW1icy5vcHRzLmF1dG9TdGFydCA9PT0gdHJ1ZSApIHtcclxuXHRcdFx0XHRcdFRodW1icy5zaG93KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdCdiZWZvcmVTaG93LmZiJyA6IGZ1bmN0aW9uKGUsIGluc3RhbmNlLCBpdGVtLCBmaXJzdFJ1bikge1xyXG5cdFx0XHR2YXIgVGh1bWJzID0gaW5zdGFuY2UgJiYgaW5zdGFuY2UuVGh1bWJzO1xyXG5cclxuXHRcdFx0aWYgKCBUaHVtYnMgJiYgVGh1bWJzLmlzVmlzaWJsZSApIHtcclxuXHRcdFx0XHRUaHVtYnMuZm9jdXMoIGZpcnN0UnVuID8gMCA6IDI1MCApO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdCdhZnRlcktleWRvd24uZmInIDogZnVuY3Rpb24oZSwgaW5zdGFuY2UsIGN1cnJlbnQsIGtleXByZXNzLCBrZXljb2RlKSB7XHJcblx0XHRcdHZhciBUaHVtYnMgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5UaHVtYnM7XHJcblxyXG5cdFx0XHQvLyBcIkdcIlxyXG5cdFx0XHRpZiAoIFRodW1icyAmJiBUaHVtYnMuaXNBY3RpdmUgJiYga2V5Y29kZSA9PT0gNzEgKSB7XHJcblx0XHRcdFx0a2V5cHJlc3MucHJldmVudERlZmF1bHQoKTtcclxuXHJcblx0XHRcdFx0VGh1bWJzLnRvZ2dsZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9LFxyXG5cclxuXHRcdCdiZWZvcmVDbG9zZS5mYicgOiBmdW5jdGlvbiggZSwgaW5zdGFuY2UgKSB7XHJcblx0XHRcdHZhciBUaHVtYnMgPSBpbnN0YW5jZSAmJiBpbnN0YW5jZS5UaHVtYnM7XHJcblxyXG5cdFx0XHRpZiAoIFRodW1icyAmJiBUaHVtYnMuaXNWaXNpYmxlICYmIFRodW1icy5vcHRzLmhpZGVPbkNsb3NlICE9PSBmYWxzZSApIHtcclxuXHRcdFx0XHRUaHVtYnMuJGdyaWQuaGlkZSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH0pO1xyXG5cclxufShkb2N1bWVudCwgd2luZG93LmpRdWVyeSkpO1xyXG5cbi8vLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gU2hhcmVcclxuLy8gRGlzcGxheXMgc2ltcGxlIGZvcm0gZm9yIHNoYXJpbmcgY3VycmVudCB1cmxcclxuLy9cclxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuOyhmdW5jdGlvbiAoZG9jdW1lbnQsICQpIHtcclxuXHQndXNlIHN0cmljdCc7XHJcblxyXG5cdCQuZXh0ZW5kKHRydWUsICQuZmFuY3lib3guZGVmYXVsdHMsIHtcclxuXHRcdGJ0blRwbCA6IHtcclxuXHRcdFx0c2hhcmUgOlxyXG5cdFx0XHRcdCc8YnV0dG9uIGRhdGEtZmFuY3lib3gtc2hhcmUgY2xhc3M9XCJmYW5jeWJveC1idXR0b24gZmFuY3lib3gtYnV0dG9uLS1zaGFyZVwiIHRpdGxlPVwie3tTSEFSRX19XCI+JyArXHJcblx0XHRcdFx0XHQnPHN2ZyB2aWV3Qm94PVwiMCAwIDQwIDQwXCI+JyArXHJcblx0XHRcdFx0XHRcdCc8cGF0aCBkPVwiTTYsMzAgQzgsMTggMTksMTYgMjMsMTYgTDIzLDE2IEwyMywxMCBMMzMsMjAgTDIzLDI5IEwyMywyNCBDMTksMjQgOCwyNyA2LDMwIFpcIj4nICtcclxuXHRcdFx0XHRcdCc8L3N2Zz4nICtcclxuXHRcdFx0XHQnPC9idXR0b24+J1xyXG5cdFx0fSxcclxuXHRcdHNoYXJlIDoge1xyXG5cdFx0XHR0cGwgOlxyXG5cdFx0XHRcdCc8ZGl2IGNsYXNzPVwiZmFuY3lib3gtc2hhcmVcIj4nICtcclxuXHRcdFx0XHRcdCc8aDE+e3tTSEFSRX19PC9oMT4nICtcclxuXHRcdFx0XHRcdCc8cD4nICtcclxuXHRcdFx0XHRcdFx0JzxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vc2hhcmVyL3NoYXJlci5waHA/dT17e3NyY319XCIgdGFyZ2V0PVwiX2JsYW5rXCIgY2xhc3M9XCJmYW5jeWJveC1zaGFyZV9idXR0b25cIj4nICtcclxuXHRcdFx0XHRcdFx0XHQnPHN2ZyB2ZXJzaW9uPVwiMS4xXCIgdmlld0JveD1cIjAgMCAzMiAzMlwiIGZpbGw9XCIjM2I1OTk4XCI+PHBhdGggZD1cIk0yNy42IDNoLTIzLjJjLS44IDAtMS40LjYtMS40IDEuNHYyMy4xYzAgLjkuNiAxLjUgMS40IDEuNWgxMi41di0xMC4xaC0zLjR2LTMuOWgzLjR2LTIuOWMwLTMuNCAyLjEtNS4yIDUtNS4yIDEuNCAwIDIuNy4xIDMgLjJ2My41aC0yLjFjLTEuNiAwLTEuOS44LTEuOSAxLjl2Mi41aDMuOWwtLjUgMy45aC0zLjR2MTAuMWg2LjZjLjggMCAxLjQtLjYgMS40LTEuNHYtMjMuMmMuMS0uOC0uNS0xLjQtMS4zLTEuNHpcIj48L3BhdGg+PC9zdmc+JyArXHJcblx0XHRcdFx0XHRcdFx0JzxzcGFuPkZhY2Vib29rPC9zcGFuPicgK1xyXG5cdFx0XHRcdFx0XHQnPC9hPicgK1xyXG5cdFx0XHRcdFx0XHQnPGEgaHJlZj1cImh0dHBzOi8vd3d3LnBpbnRlcmVzdC5jb20vcGluL2NyZWF0ZS9idXR0b24vP3VybD17e3NyY319JmFtcDtkZXNjcmlwdGlvbj17e2Rlc2NyfX1cIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImZhbmN5Ym94LXNoYXJlX2J1dHRvblwiPicgK1xyXG5cdFx0XHRcdFx0XHRcdCc8c3ZnIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgZmlsbD1cIiNjOTIyMjhcIj48cGF0aCBkPVwiTTE2IDNjLTcuMiAwLTEzIDUuOC0xMyAxMyAwIDUuNSAzLjQgMTAuMiA4LjMgMTIuMS0uMS0xLS4yLTIuNiAwLTMuNy4yLTEgMS41LTYuNSAxLjUtNi41cy0uNC0uOC0uNC0xLjljMC0xLjggMS0zLjIgMi40LTMuMiAxLjEgMCAxLjYuOCAxLjYgMS44IDAgMS4xLS43IDIuOC0xLjEgNC4zLS4zIDEuMy42IDIuMyAxLjkgMi4zIDIuMyAwIDQuMS0yLjQgNC4xLTYgMC0zLjEtMi4yLTUuMy01LjQtNS4zLTMuNyAwLTUuOSAyLjgtNS45IDUuNiAwIDEuMS40IDIuMyAxIDMgLjEuMS4xLjIuMS40LS4xLjQtLjMgMS4zLS40IDEuNS0uMS4yLS4yLjMtLjQuMi0xLjYtLjgtMi42LTMuMS0yLjYtNSAwLTQuMSAzLTcuOSA4LjYtNy45IDQuNSAwIDggMy4yIDggNy41IDAgNC41LTIuOCA4LjEtNi43IDguMS0xLjMgMC0yLjYtLjctMy0xLjUgMCAwLS43IDIuNS0uOCAzLjEtLjMgMS4xLTEuMSAyLjUtMS42IDMuNCAxLjIuNCAyLjUuNiAzLjguNiA3LjIgMCAxMy01LjggMTMtMTMgMC03LjEtNS44LTEyLjktMTMtMTIuOXpcIj48L3BhdGg+PC9zdmc+JyArXHJcblx0XHRcdFx0XHRcdFx0JzxzcGFuPlBpbnRlcmVzdDwvc3Bhbj4nICtcclxuXHRcdFx0XHRcdFx0JzwvYT4nICtcclxuXHRcdFx0XHRcdFx0JzxhIGhyZWY9XCJodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD91cmw9e3tzcmN9fSZhbXA7dGV4dD17e2Rlc2NyfX1cIiB0YXJnZXQ9XCJfYmxhbmtcIiBjbGFzcz1cImZhbmN5Ym94LXNoYXJlX2J1dHRvblwiPicgK1xyXG5cdFx0XHRcdFx0XHRcdCc8c3ZnIHZlcnNpb249XCIxLjFcIiB2aWV3Qm94PVwiMCAwIDMyIDMyXCIgZmlsbD1cIiMxZGExZjJcIj48cGF0aCBkPVwiTTMwIDcuM2MtMSAuNS0yLjEuOC0zLjMuOSAxLjItLjcgMi4xLTEuOCAyLjUtMy4yLTEuMS43LTIuMyAxLjEtMy42IDEuNC0xLTEuMS0yLjUtMS44LTQuMi0xLjgtMy4yIDAtNS43IDIuNi01LjcgNS43IDAgLjUuMS45LjEgMS4zLTQuOC0uMi05LTIuNS0xMS44LTYtLjUuOS0uOCAxLjktLjggMyAwIDIgMSAzLjggMi42IDQuOC0uOSAwLTEuOC0uMy0yLjYtLjd2LjFjMCAyLjggMiA1LjEgNC42IDUuNi0uNS4xLTEgLjItMS41LjItLjQgMC0uNyAwLTEuMS0uMS43IDIuMyAyLjkgMy45IDUuNCA0LTIgMS41LTQuNCAyLjUtNy4xIDIuNS0uNSAwLS45IDAtMS40LS4xIDIuNSAxLjYgNS42IDIuNiA4LjggMi42IDEwLjYgMCAxNi4zLTguOCAxNi4zLTE2LjN2LS43YzEuMS0xIDItMiAyLjgtMy4yelwiPjwvcGF0aD48L3N2Zz4nICtcclxuXHRcdFx0XHRcdFx0XHQnPHNwYW4+VHdpdHRlcjwvc3Bhbj4nICtcclxuXHRcdFx0XHRcdFx0JzwvYT4nICtcclxuXHRcdFx0XHRcdCc8L3A+JyArXHJcblx0XHRcdFx0XHQnPHA+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgdmFsdWU9XCJ7e3NyY19yYXd9fVwiIG9uZm9jdXM9XCJ0aGlzLnNlbGVjdCgpXCIgLz48L3A+JyArXHJcblx0XHRcdFx0JzwvZGl2PidcclxuXHRcdH1cclxuXHR9KTtcclxuXHJcblx0ZnVuY3Rpb24gZXNjYXBlSHRtbChzdHJpbmcpIHtcclxuXHRcdHZhciBlbnRpdHlNYXAgPSB7XHJcblx0XHQgICcmJzogJyZhbXA7JyxcclxuXHRcdCAgJzwnOiAnJmx0OycsXHJcblx0XHQgICc+JzogJyZndDsnLFxyXG5cdFx0ICAnXCInOiAnJnF1b3Q7JyxcclxuXHRcdCAgXCInXCI6ICcmIzM5OycsXHJcblx0XHQgICcvJzogJyYjeDJGOycsXHJcblx0XHQgICdgJzogJyYjeDYwOycsXHJcblx0XHQgICc9JzogJyYjeDNEOydcclxuXHRcdH07XHJcblxyXG5cdFx0cmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UoL1smPD5cIidgPVxcL10vZywgZnVuY3Rpb24gKHMpIHtcclxuXHRcdFx0cmV0dXJuIGVudGl0eU1hcFtzXTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgJ1tkYXRhLWZhbmN5Ym94LXNoYXJlXScsIGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGYgPSAkLmZhbmN5Ym94LmdldEluc3RhbmNlKCksXHJcblx0XHRcdHVybCxcclxuXHRcdFx0dHBsO1xyXG5cclxuXHRcdGlmICggZiApIHtcclxuXHRcdFx0dXJsID0gZi5jdXJyZW50Lm9wdHMuaGFzaCA9PT0gZmFsc2UgPyBmLmN1cnJlbnQuc3JjIDogd2luZG93LmxvY2F0aW9uO1xyXG5cdFx0XHR0cGwgPSBmLmN1cnJlbnQub3B0cy5zaGFyZS50cGxcclxuXHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7XFx7c3JjXFx9XFx9L2csIGVuY29kZVVSSUNvbXBvbmVudCggdXJsICkgKVxyXG5cdFx0XHRcdFx0LnJlcGxhY2UoIC9cXHtcXHtzcmNfcmF3XFx9XFx9L2csIGVzY2FwZUh0bWwoIHVybCApIClcclxuXHRcdFx0XHRcdC5yZXBsYWNlKCAvXFx7XFx7ZGVzY3JcXH1cXH0vZywgZi4kY2FwdGlvbiA/IGVuY29kZVVSSUNvbXBvbmVudCggZi4kY2FwdGlvbi50ZXh0KCkgKSA6ICcnICk7XHJcblxyXG5cdFx0XHQkLmZhbmN5Ym94Lm9wZW4oe1xyXG5cdFx0XHRcdHNyYyAgOiBmLnRyYW5zbGF0ZSggZiwgdHBsICksXHJcblx0XHRcdFx0dHlwZSA6ICdodG1sJyxcclxuXHRcdFx0XHRvcHRzIDoge1xyXG5cdFx0XHRcdFx0YW5pbWF0aW9uRWZmZWN0ICAgOiBcImZhZGVcIixcclxuXHRcdFx0XHRcdGFuaW1hdGlvbkR1cmF0aW9uIDogMjUwXHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHJcblx0fSk7XHJcblxyXG59KCBkb2N1bWVudCwgd2luZG93LmpRdWVyeSB8fCBqUXVlcnkgKSk7XHJcblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy9cclxuLy8gSGFzaFxyXG4vLyBFbmFibGVzIGxpbmtpbmcgdG8gZWFjaCBtb2RhbFxyXG4vL1xyXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG47KGZ1bmN0aW9uIChkb2N1bWVudCwgd2luZG93LCAkKSB7XHJcblx0J3VzZSBzdHJpY3QnO1xyXG5cclxuXHQvLyBTaW1wbGUgJC5lc2NhcGVTZWxlY3RvciBwb2x5ZmlsbCAoZm9yIGpRdWVyeSBwcmlvciB2MylcclxuXHRpZiAoICEkLmVzY2FwZVNlbGVjdG9yICkge1xyXG5cdFx0JC5lc2NhcGVTZWxlY3RvciA9IGZ1bmN0aW9uKCBzZWwgKSB7XHJcblx0XHRcdHZhciByY3NzZXNjYXBlID0gLyhbXFwwLVxceDFmXFx4N2ZdfF4tP1xcZCl8Xi0kfFteXFx4ODAtXFx1RkZGRlxcdy1dL2c7XHJcblx0XHRcdHZhciBmY3NzZXNjYXBlID0gZnVuY3Rpb24oIGNoLCBhc0NvZGVQb2ludCApIHtcclxuXHRcdFx0XHRpZiAoIGFzQ29kZVBvaW50ICkge1xyXG5cdFx0XHRcdFx0Ly8gVSswMDAwIE5VTEwgYmVjb21lcyBVK0ZGRkQgUkVQTEFDRU1FTlQgQ0hBUkFDVEVSXHJcblx0XHRcdFx0XHRpZiAoIGNoID09PSBcIlxcMFwiICkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gXCJcXHVGRkZEXCI7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gQ29udHJvbCBjaGFyYWN0ZXJzIGFuZCAoZGVwZW5kZW50IHVwb24gcG9zaXRpb24pIG51bWJlcnMgZ2V0IGVzY2FwZWQgYXMgY29kZSBwb2ludHNcclxuXHRcdFx0XHRcdHJldHVybiBjaC5zbGljZSggMCwgLTEgKSArIFwiXFxcXFwiICsgY2guY2hhckNvZGVBdCggY2gubGVuZ3RoIC0gMSApLnRvU3RyaW5nKCAxNiApICsgXCIgXCI7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBPdGhlciBwb3RlbnRpYWxseS1zcGVjaWFsIEFTQ0lJIGNoYXJhY3RlcnMgZ2V0IGJhY2tzbGFzaC1lc2NhcGVkXHJcblx0XHRcdFx0cmV0dXJuIFwiXFxcXFwiICsgY2g7XHJcblx0XHRcdH07XHJcblxyXG5cdFx0XHRyZXR1cm4gKCBzZWwgKyBcIlwiICkucmVwbGFjZSggcmNzc2VzY2FwZSwgZmNzc2VzY2FwZSApO1xyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdC8vIENyZWF0ZSBuZXcgaGlzdG9yeSBlbnRyeSBvbmx5IG9uY2VcclxuXHR2YXIgc2hvdWxkQ3JlYXRlSGlzdG9yeSA9IHRydWU7XHJcblxyXG5cdC8vIFZhcmlhYmxlIGNvbnRhaW5pbmcgbGFzdCBoYXNoIHZhbHVlIHNldCBieSBmYW5jeUJveFxyXG5cdC8vIEl0IHdpbGwgYmUgdXNlZCB0byBkZXRlcm1pbmUgaWYgZmFuY3lCb3ggbmVlZHMgdG8gY2xvc2UgYWZ0ZXIgaGFzaCBjaGFuZ2UgaXMgZGV0ZWN0ZWRcclxuICAgIHZhciBjdXJyZW50SGFzaCA9IG51bGw7XHJcblxyXG5cdC8vIFRocm90dGxpbmcgdGhlIGhpc3RvcnkgY2hhbmdlXHJcblx0dmFyIHRpbWVySUQgPSBudWxsO1xyXG5cclxuXHQvLyBHZXQgaW5mbyBhYm91dCBnYWxsZXJ5IG5hbWUgYW5kIGN1cnJlbnQgaW5kZXggZnJvbSB1cmxcclxuICAgIGZ1bmN0aW9uIHBhcnNlVXJsKCkge1xyXG4gICAgICAgIHZhciBoYXNoICAgID0gd2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKCAxICk7XHJcbiAgICAgICAgdmFyIHJleiAgICAgPSBoYXNoLnNwbGl0KCAnLScgKTtcclxuICAgICAgICB2YXIgaW5kZXggICA9IHJlei5sZW5ndGggPiAxICYmIC9eXFwrP1xcZCskLy50ZXN0KCByZXpbIHJlei5sZW5ndGggLSAxIF0gKSA/IHBhcnNlSW50KCByZXoucG9wKCAtMSApLCAxMCApIHx8IDEgOiAxO1xyXG4gICAgICAgIHZhciBnYWxsZXJ5ID0gcmV6LmpvaW4oICctJyApO1xyXG5cclxuXHRcdC8vIEluZGV4IGlzIHN0YXJ0aW5nIGZyb20gMVxyXG5cdFx0aWYgKCBpbmRleCA8IDEgKSB7XHJcblx0XHRcdGluZGV4ID0gMTtcclxuXHRcdH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgaGFzaCAgICA6IGhhc2gsXHJcbiAgICAgICAgICAgIGluZGV4ICAgOiBpbmRleCxcclxuICAgICAgICAgICAgZ2FsbGVyeSA6IGdhbGxlcnlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuXHQvLyBUcmlnZ2VyIGNsaWNrIGV2bnQgb24gbGlua3MgdG8gb3BlbiBuZXcgZmFuY3lCb3ggaW5zdGFuY2VcclxuXHRmdW5jdGlvbiB0cmlnZ2VyRnJvbVVybCggdXJsICkge1xyXG5cdFx0dmFyICRlbDtcclxuXHJcbiAgICAgICAgaWYgKCB1cmwuZ2FsbGVyeSAhPT0gJycgKSB7XHJcblxyXG5cdFx0XHQvLyBJZiB3ZSBjYW4gZmluZCBlbGVtZW50IG1hdGNoaW5nICdkYXRhLWZhbmN5Ym94JyBhdHJpYnV0ZSwgdGhlbiB0cmlnZ2VyIGNsaWNrIGV2ZW50IGZvciB0aGF0IC4uXHJcblx0XHRcdCRlbCA9ICQoIFwiW2RhdGEtZmFuY3lib3g9J1wiICsgJC5lc2NhcGVTZWxlY3RvciggdXJsLmdhbGxlcnkgKSArIFwiJ11cIiApLmVxKCB1cmwuaW5kZXggLSAxICk7XHJcblxyXG4gICAgICAgICAgICBpZiAoICEkZWwubGVuZ3RoICkge1xyXG5cdFx0XHRcdC8vIC4uIGlmIG5vdCwgdHJ5IGZpbmRpbmcgZWxlbWVudCBieSBJRFxyXG5cdFx0XHRcdCRlbCA9ICQoIFwiI1wiICsgJC5lc2NhcGVTZWxlY3RvciggdXJsLmdhbGxlcnkgKSArIFwiXCIgKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKCAkZWwubGVuZ3RoICkge1xyXG5cdFx0XHRcdHNob3VsZENyZWF0ZUhpc3RvcnkgPSBmYWxzZTtcclxuXHJcblx0XHRcdFx0JGVsLnRyaWdnZXIoICdjbGljaycgKTtcclxuXHRcdFx0fVxyXG5cclxuICAgICAgICB9XHJcblx0fVxyXG5cclxuXHQvLyBHZXQgZ2FsbGVyeSBuYW1lIGZyb20gY3VycmVudCBpbnN0YW5jZVxyXG5cdGZ1bmN0aW9uIGdldEdhbGxlcnlJRCggaW5zdGFuY2UgKSB7XHJcblx0XHR2YXIgb3B0cztcclxuXHJcblx0XHRpZiAoICFpbnN0YW5jZSApIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cclxuXHRcdG9wdHMgPSBpbnN0YW5jZS5jdXJyZW50ID8gaW5zdGFuY2UuY3VycmVudC5vcHRzIDogaW5zdGFuY2Uub3B0cztcclxuXHJcblx0XHRyZXR1cm4gb3B0cy5oYXNoIHx8ICggb3B0cy4kb3JpZyA/IG9wdHMuJG9yaWcuZGF0YSggJ2ZhbmN5Ym94JyApIDogJycgICk7XHJcblx0fVxyXG5cclxuXHQvLyBTdGFydCB3aGVuIERPTSBiZWNvbWVzIHJlYWR5XHJcbiAgICAkKGZ1bmN0aW9uKCkge1xyXG5cclxuXHRcdC8vIENoZWNrIGlmIHVzZXIgaGFzIGRpc2FibGVkIHRoaXMgbW9kdWxlXHJcblx0XHRpZiAoICQuZmFuY3lib3guZGVmYXVsdHMuaGFzaCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBVcGRhdGUgaGFzaCB3aGVuIG9wZW5pbmcvY2xvc2luZyBmYW5jeUJveFxyXG5cdCAgICAkKGRvY3VtZW50KS5vbih7XHJcblx0XHRcdCdvbkluaXQuZmInIDogZnVuY3Rpb24oIGUsIGluc3RhbmNlICkge1xyXG5cdFx0XHRcdHZhciB1cmwsIGdhbGxlcnk7XHJcblxyXG5cdFx0XHRcdGlmICggaW5zdGFuY2UuZ3JvdXBbIGluc3RhbmNlLmN1cnJJbmRleCBdLm9wdHMuaGFzaCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR1cmwgICAgID0gcGFyc2VVcmwoKTtcclxuXHRcdFx0XHRnYWxsZXJ5ID0gZ2V0R2FsbGVyeUlEKCBpbnN0YW5jZSApO1xyXG5cclxuXHRcdFx0XHQvLyBNYWtlIHN1cmUgZ2FsbGVyeSBzdGFydCBpbmRleCBtYXRjaGVzIGluZGV4IGZyb20gaGFzaFxyXG5cdFx0XHRcdGlmICggZ2FsbGVyeSAmJiB1cmwuZ2FsbGVyeSAmJiBnYWxsZXJ5ID09IHVybC5nYWxsZXJ5ICkge1xyXG5cdFx0XHRcdFx0aW5zdGFuY2UuY3VyckluZGV4ID0gdXJsLmluZGV4IC0gMTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQnYmVmb3JlU2hvdy5mYicgOiBmdW5jdGlvbiggZSwgaW5zdGFuY2UsIGN1cnJlbnQgKSB7XHJcblx0XHRcdFx0dmFyIGdhbGxlcnk7XHJcblxyXG5cdFx0XHRcdGlmICggIWN1cnJlbnQgfHwgY3VycmVudC5vcHRzLmhhc2ggPT09IGZhbHNlICkge1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0ICAgICAgICAgICAgZ2FsbGVyeSA9IGdldEdhbGxlcnlJRCggaW5zdGFuY2UgKTtcclxuXHJcblx0ICAgICAgICAgICAgLy8gVXBkYXRlIHdpbmRvdyBoYXNoXHJcblx0ICAgICAgICAgICAgaWYgKCBnYWxsZXJ5ICYmIGdhbGxlcnkgIT09ICcnICkge1xyXG5cclxuXHRcdFx0XHRcdGlmICggd2luZG93LmxvY2F0aW9uLmhhc2guaW5kZXhPZiggZ2FsbGVyeSApIDwgMCApIHtcclxuXHRcdCAgICAgICAgICAgICAgICBpbnN0YW5jZS5vcHRzLm9yaWdIYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2g7XHJcblx0XHQgICAgICAgICAgICB9XHJcblxyXG5cdFx0XHRcdFx0Y3VycmVudEhhc2ggPSBnYWxsZXJ5ICsgKCBpbnN0YW5jZS5ncm91cC5sZW5ndGggPiAxID8gJy0nICsgKCBjdXJyZW50LmluZGV4ICsgMSApIDogJycgKTtcclxuXHJcblx0XHRcdFx0XHRpZiAoICdyZXBsYWNlU3RhdGUnIGluIHdpbmRvdy5oaXN0b3J5ICkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIHRpbWVySUQgKSB7XHJcblx0XHRcdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KCB0aW1lcklEICk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHRpbWVySUQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHdpbmRvdy5oaXN0b3J5WyBzaG91bGRDcmVhdGVIaXN0b3J5ID8gJ3B1c2hTdGF0ZScgOiAncmVwbGFjZVN0YXRlJyBdKCB7fSAsIGRvY3VtZW50LnRpdGxlLCB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgKyB3aW5kb3cubG9jYXRpb24uc2VhcmNoICsgJyMnICsgIGN1cnJlbnRIYXNoICk7XHJcblxyXG5cdFx0XHRcdFx0XHRcdHRpbWVySUQgPSBudWxsO1xyXG5cclxuXHRcdFx0XHRcdFx0XHRzaG91bGRDcmVhdGVIaXN0b3J5ID0gZmFsc2U7XHJcblxyXG5cdFx0XHRcdFx0XHR9LCAzMDApO1xyXG5cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gY3VycmVudEhhc2g7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdCAgICAgICAgICAgIH1cclxuXHJcblx0ICAgICAgICB9LFxyXG5cclxuXHRcdFx0J2JlZm9yZUNsb3NlLmZiJyA6IGZ1bmN0aW9uKCBlLCBpbnN0YW5jZSwgY3VycmVudCApIHtcclxuXHRcdFx0XHR2YXIgZ2FsbGVyeSwgb3JpZ0hhc2g7XHJcblxyXG5cdFx0XHRcdGlmICggdGltZXJJRCApIHtcclxuXHRcdFx0XHRcdGNsZWFyVGltZW91dCggdGltZXJJRCApO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0aWYgKCBjdXJyZW50Lm9wdHMuaGFzaCA9PT0gZmFsc2UgKSB7XHJcblx0XHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRnYWxsZXJ5ICA9IGdldEdhbGxlcnlJRCggaW5zdGFuY2UgKTtcclxuXHRcdFx0XHRvcmlnSGFzaCA9IGluc3RhbmNlICYmIGluc3RhbmNlLm9wdHMub3JpZ0hhc2ggPyBpbnN0YW5jZS5vcHRzLm9yaWdIYXNoIDogJyc7XHJcblxyXG5cdCAgICAgICAgICAgIC8vIFJlbW92ZSBoYXNoIGZyb20gbG9jYXRpb24gYmFyXHJcblx0ICAgICAgICAgICAgaWYgKCBnYWxsZXJ5ICYmIGdhbGxlcnkgIT09ICcnICkge1xyXG5cclxuXHQgICAgICAgICAgICAgICAgaWYgKCAncmVwbGFjZVN0YXRlJyBpbiBoaXN0b3J5ICkge1xyXG5cdFx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUoIHt9ICwgZG9jdW1lbnQudGl0bGUsIHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZSArIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggKyBvcmlnSGFzaCApO1xyXG5cclxuXHQgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhhc2ggPSBvcmlnSGFzaDtcclxuXHJcblx0XHRcdFx0XHRcdC8vIEtlZXAgb3JpZ2luYWwgc2Nyb2xsIHBvc2l0aW9uXHJcblx0XHRcdFx0XHRcdCQoIHdpbmRvdyApLnNjcm9sbFRvcCggaW5zdGFuY2Uuc2Nyb2xsVG9wICkuc2Nyb2xsTGVmdCggaW5zdGFuY2Uuc2Nyb2xsTGVmdCApO1xyXG5cdCAgICAgICAgICAgICAgICB9XHJcblx0ICAgICAgICAgICAgfVxyXG5cclxuXHRcdFx0XHRjdXJyZW50SGFzaCA9IG51bGw7XHJcblx0ICAgICAgICB9XHJcblx0ICAgIH0pO1xyXG5cclxuXHRcdC8vIENoZWNrIGlmIG5lZWQgdG8gY2xvc2UgYWZ0ZXIgdXJsIGhhcyBjaGFuZ2VkXHJcblx0XHQkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UuZmInLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIHVybCA9IHBhcnNlVXJsKCk7XHJcblxyXG5cdFx0XHRpZiAoICQuZmFuY3lib3guZ2V0SW5zdGFuY2UoKSApIHtcclxuXHRcdFx0XHRpZiAoIGN1cnJlbnRIYXNoICYmIGN1cnJlbnRIYXNoICE9PSB1cmwuZ2FsbGVyeSArICctJyArIHVybC5pbmRleCAmJiAhKCB1cmwuaW5kZXggPT09IDEgJiYgY3VycmVudEhhc2ggPT0gdXJsLmdhbGxlcnkgKSApIHtcclxuXHRcdFx0XHRcdGN1cnJlbnRIYXNoID0gbnVsbDtcclxuXHJcblx0XHRcdFx0XHQkLmZhbmN5Ym94LmNsb3NlKCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIGlmICggdXJsLmdhbGxlcnkgIT09ICcnICkge1xyXG5cdFx0XHRcdHRyaWdnZXJGcm9tVXJsKCB1cmwgKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0Ly8gQ2hlY2sgY3VycmVudCBoYXNoIGFuZCB0cmlnZ2VyIGNsaWNrIGV2ZW50IG9uIG1hdGNoaW5nIGVsZW1lbnQgdG8gc3RhcnQgZmFuY3lCb3gsIGlmIG5lZWRlZFxyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0dHJpZ2dlckZyb21VcmwoIHBhcnNlVXJsKCkgKTtcclxuXHRcdH0sIDUwKTtcclxuICAgIH0pO1xyXG5cclxufSggZG9jdW1lbnQsIHdpbmRvdywgd2luZG93LmpRdWVyeSB8fCBqUXVlcnkgKSk7XHJcbiIsIi8qISByZXNwb25zaXZlLW5hdi5qcyAxLjAuMzlcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS92aWxqYW1pcy9yZXNwb25zaXZlLW5hdi5qc1xuICogaHR0cDovL3Jlc3BvbnNpdmUtbmF2LmNvbVxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNSBAdmlsamFtaXNcbiAqIEF2YWlsYWJsZSB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqL1xuXG4vKiBnbG9iYWwgRXZlbnQgKi9cbihmdW5jdGlvbiAoZG9jdW1lbnQsIHdpbmRvdywgaW5kZXgpIHtcbiAgLy8gSW5kZXggaXMgdXNlZCB0byBrZWVwIG11bHRpcGxlIG5hdnMgb24gdGhlIHNhbWUgcGFnZSBuYW1lc3BhY2VkXG5cbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIHJlc3BvbnNpdmVOYXYgPSBmdW5jdGlvbiAoZWwsIG9wdGlvbnMpIHtcblxuICAgIHZhciBjb21wdXRlZCA9ICEhd2luZG93LmdldENvbXB1dGVkU3R5bGU7XG5cbiAgICAvKipcbiAgICAgKiBnZXRDb21wdXRlZFN0eWxlIHBvbHlmaWxsIGZvciBvbGQgYnJvd3NlcnNcbiAgICAgKi9cbiAgICBpZiAoIWNvbXB1dGVkKSB7XG4gICAgICB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSA9IGZ1bmN0aW9uKGVsKSB7XG4gICAgICAgIHRoaXMuZWwgPSBlbDtcbiAgICAgICAgdGhpcy5nZXRQcm9wZXJ0eVZhbHVlID0gZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICAgIHZhciByZSA9IC8oXFwtKFthLXpdKXsxfSkvZztcbiAgICAgICAgICBpZiAocHJvcCA9PT0gXCJmbG9hdFwiKSB7XG4gICAgICAgICAgICBwcm9wID0gXCJzdHlsZUZsb2F0XCI7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZS50ZXN0KHByb3ApKSB7XG4gICAgICAgICAgICBwcm9wID0gcHJvcC5yZXBsYWNlKHJlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHJldHVybiBhcmd1bWVudHNbMl0udG9VcHBlckNhc2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZWwuY3VycmVudFN0eWxlW3Byb3BdID8gZWwuY3VycmVudFN0eWxlW3Byb3BdIDogbnVsbDtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9O1xuICAgIH1cbiAgICAvKiBleHBvcnRlZCBhZGRFdmVudCwgcmVtb3ZlRXZlbnQsIGdldENoaWxkcmVuLCBzZXRBdHRyaWJ1dGVzLCBhZGRDbGFzcywgcmVtb3ZlQ2xhc3MsIGZvckVhY2ggKi9cblxuICAgIC8qKlxuICAgICAqIEFkZCBFdmVudFxuICAgICAqIGZuIGFyZyBjYW4gYmUgYW4gb2JqZWN0IG9yIGEgZnVuY3Rpb24sIHRoYW5rcyB0byBoYW5kbGVFdmVudFxuICAgICAqIHJlYWQgbW9yZSBhdDogaHR0cDovL3d3dy50aGVjc3NuaW5qYS5jb20vamF2YXNjcmlwdC9oYW5kbGVldmVudFxuICAgICAqXG4gICAgICogQHBhcmFtICB7ZWxlbWVudH0gIGVsZW1lbnRcbiAgICAgKiBAcGFyYW0gIHtldmVudH0gICAgZXZlbnRcbiAgICAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gZm5cbiAgICAgKiBAcGFyYW0gIHtib29sZWFufSAgYnViYmxpbmdcbiAgICAgKi9cbiAgICB2YXIgYWRkRXZlbnQgPSBmdW5jdGlvbiAoZWwsIGV2dCwgZm4sIGJ1YmJsZSkge1xuICAgICAgICBpZiAoXCJhZGRFdmVudExpc3RlbmVyXCIgaW4gZWwpIHtcbiAgICAgICAgICAvLyBCQk9TNiBkb2Vzbid0IHN1cHBvcnQgaGFuZGxlRXZlbnQsIGNhdGNoIGFuZCBwb2x5ZmlsbFxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2dCwgZm4sIGJ1YmJsZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gXCJvYmplY3RcIiAmJiBmbi5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKGV2dCwgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBCaW5kIGZuIGFzIHRoaXMgYW5kIHNldCBmaXJzdCBhcmcgYXMgZXZlbnQgb2JqZWN0XG4gICAgICAgICAgICAgICAgZm4uaGFuZGxlRXZlbnQuY2FsbChmbiwgZSk7XG4gICAgICAgICAgICAgIH0sIGJ1YmJsZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChcImF0dGFjaEV2ZW50XCIgaW4gZWwpIHtcbiAgICAgICAgICAvLyBjaGVjayBpZiB0aGUgY2FsbGJhY2sgaXMgYW4gb2JqZWN0IGFuZCBjb250YWlucyBoYW5kbGVFdmVudFxuICAgICAgICAgIGlmICh0eXBlb2YgZm4gPT09IFwib2JqZWN0XCIgJiYgZm4uaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgIGVsLmF0dGFjaEV2ZW50KFwib25cIiArIGV2dCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAvLyBCaW5kIGZuIGFzIHRoaXNcbiAgICAgICAgICAgICAgZm4uaGFuZGxlRXZlbnQuY2FsbChmbik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuYXR0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFJlbW92ZSBFdmVudFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2VsZW1lbnR9ICBlbGVtZW50XG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gICAgZXZlbnRcbiAgICAgICAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmblxuICAgICAgICogQHBhcmFtICB7Ym9vbGVhbn0gIGJ1YmJsaW5nXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUV2ZW50ID0gZnVuY3Rpb24gKGVsLCBldnQsIGZuLCBidWJibGUpIHtcbiAgICAgICAgaWYgKFwicmVtb3ZlRXZlbnRMaXN0ZW5lclwiIGluIGVsKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCBmbiwgYnViYmxlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSBcIm9iamVjdFwiICYmIGZuLmhhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZ0LCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgICAgICAgIGZuLmhhbmRsZUV2ZW50LmNhbGwoZm4sIGUpO1xuICAgICAgICAgICAgICB9LCBidWJibGUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoXCJkZXRhY2hFdmVudFwiIGluIGVsKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gXCJvYmplY3RcIiAmJiBmbi5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgZWwuZGV0YWNoRXZlbnQoXCJvblwiICsgZXZ0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIGZuLmhhbmRsZUV2ZW50LmNhbGwoZm4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGVsLmRldGFjaEV2ZW50KFwib25cIiArIGV2dCwgZm4pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBHZXQgdGhlIGNoaWxkcmVuIG9mIGFueSBlbGVtZW50XG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZWxlbWVudH1cbiAgICAgICAqIEByZXR1cm4ge2FycmF5fSBSZXR1cm5zIG1hdGNoaW5nIGVsZW1lbnRzIGluIGFuIGFycmF5XG4gICAgICAgKi9cbiAgICAgIGdldENoaWxkcmVuID0gZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKGUuY2hpbGRyZW4ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBOYXYgY29udGFpbmVyIGhhcyBubyBjb250YWluaW5nIGVsZW1lbnRzXCIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFN0b3JlIGFsbCBjaGlsZHJlbiBpbiBhcnJheVxuICAgICAgICB2YXIgY2hpbGRyZW4gPSBbXTtcbiAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGNoaWxkcmVuIGFuZCBzdG9yZSBpbiBhcnJheSBpZiBjaGlsZCAhPSBUZXh0Tm9kZVxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGUuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoZS5jaGlsZHJlbltpXS5ub2RlVHlwZSA9PT0gMSkge1xuICAgICAgICAgICAgY2hpbGRyZW4ucHVzaChlLmNoaWxkcmVuW2ldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuO1xuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBTZXRzIG11bHRpcGxlIGF0dHJpYnV0ZXMgYXQgb25jZVxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7ZWxlbWVudH0gZWxlbWVudFxuICAgICAgICogQHBhcmFtIHthdHRyc30gICBhdHRyc1xuICAgICAgICovXG4gICAgICBzZXRBdHRyaWJ1dGVzID0gZnVuY3Rpb24gKGVsLCBhdHRycykge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gYXR0cnMpIHtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBBZGRzIGEgY2xhc3MgdG8gYW55IGVsZW1lbnRcbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge2VsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSAgY2xhc3NcbiAgICAgICAqL1xuICAgICAgYWRkQ2xhc3MgPSBmdW5jdGlvbiAoZWwsIGNscykge1xuICAgICAgICBpZiAoZWwuY2xhc3NOYW1lLmluZGV4T2YoY2xzKSAhPT0gMCkge1xuICAgICAgICAgIGVsLmNsYXNzTmFtZSArPSBcIiBcIiArIGNscztcbiAgICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZSgvKF5cXHMqKXwoXFxzKiQpL2csXCJcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlIGEgY2xhc3MgZnJvbSBhbnkgZWxlbWVudFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2VsZW1lbnR9IGVsZW1lbnRcbiAgICAgICAqIEBwYXJhbSAge3N0cmluZ30gIGNsYXNzXG4gICAgICAgKi9cbiAgICAgIHJlbW92ZUNsYXNzID0gZnVuY3Rpb24gKGVsLCBjbHMpIHtcbiAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXFxcXHN8XilcIiArIGNscyArIFwiKFxcXFxzfCQpXCIpO1xuICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUucmVwbGFjZShyZWcsIFwiIFwiKS5yZXBsYWNlKC8oXlxccyopfChcXHMqJCkvZyxcIlwiKTtcbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogZm9yRWFjaCBtZXRob2QgdGhhdCBwYXNzZXMgYmFjayB0aGUgc3R1ZmYgd2UgbmVlZFxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2FycmF5fSAgICBhcnJheVxuICAgICAgICogQHBhcmFtICB7RnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICAgKiBAcGFyYW0gIHtzY29wZX0gICAgc2NvcGVcbiAgICAgICAqL1xuICAgICAgZm9yRWFjaCA9IGZ1bmN0aW9uIChhcnJheSwgY2FsbGJhY2ssIHNjb3BlKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjYWxsYmFjay5jYWxsKHNjb3BlLCBpLCBhcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICB2YXIgbmF2LFxuICAgICAgb3B0cyxcbiAgICAgIG5hdlRvZ2dsZSxcbiAgICAgIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKSxcbiAgICAgIGh0bWxFbCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcbiAgICAgIGhhc0FuaW1GaW5pc2hlZCxcbiAgICAgIGlzTW9iaWxlLFxuICAgICAgbmF2T3BlbjtcblxuICAgIHZhciBSZXNwb25zaXZlTmF2ID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBEZWZhdWx0IG9wdGlvbnNcbiAgICAgICAgICogQHR5cGUge09iamVjdH1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IHtcbiAgICAgICAgICBhbmltYXRlOiB0cnVlLCAgICAgICAgICAgICAgICAgICAgLy8gQm9vbGVhbjogVXNlIENTUzMgdHJhbnNpdGlvbnMsIHRydWUgb3IgZmFsc2VcbiAgICAgICAgICB0cmFuc2l0aW9uOiAyODQsICAgICAgICAgICAgICAgICAgLy8gSW50ZWdlcjogU3BlZWQgb2YgdGhlIHRyYW5zaXRpb24sIGluIG1pbGxpc2Vjb25kc1xuICAgICAgICAgIGxhYmVsOiBcIk1lbnVcIiwgICAgICAgICAgICAgICAgICAgIC8vIFN0cmluZzogTGFiZWwgZm9yIHRoZSBuYXZpZ2F0aW9uIHRvZ2dsZVxuICAgICAgICAgIGluc2VydDogXCJiZWZvcmVcIiwgICAgICAgICAgICAgICAgIC8vIFN0cmluZzogSW5zZXJ0IHRoZSB0b2dnbGUgYmVmb3JlIG9yIGFmdGVyIHRoZSBuYXZpZ2F0aW9uXG4gICAgICAgICAgY3VzdG9tVG9nZ2xlOiBcIlwiLCAgICAgICAgICAgICAgICAgLy8gU2VsZWN0b3I6IFNwZWNpZnkgdGhlIElEIG9mIGEgY3VzdG9tIHRvZ2dsZVxuICAgICAgICAgIGNsb3NlT25OYXZDbGljazogZmFsc2UsICAgICAgICAgICAvLyBCb29sZWFuOiBDbG9zZSB0aGUgbmF2aWdhdGlvbiB3aGVuIG9uZSBvZiB0aGUgbGlua3MgYXJlIGNsaWNrZWRcbiAgICAgICAgICBvcGVuUG9zOiBcInJlbGF0aXZlXCIsICAgICAgICAgICAgICAvLyBTdHJpbmc6IFBvc2l0aW9uIG9mIHRoZSBvcGVuZWQgbmF2LCByZWxhdGl2ZSBvciBzdGF0aWNcbiAgICAgICAgICBuYXZDbGFzczogXCJuYXYtY29sbGFwc2VcIiwgICAgICAgICAvLyBTdHJpbmc6IERlZmF1bHQgQ1NTIGNsYXNzLiBJZiBjaGFuZ2VkLCB5b3UgbmVlZCB0byBlZGl0IHRoZSBDU1MgdG9vIVxuICAgICAgICAgIG5hdkFjdGl2ZUNsYXNzOiBcImpzLW5hdi1hY3RpdmVcIiwgIC8vIFN0cmluZzogQ2xhc3MgdGhhdCBpcyBhZGRlZCB0byA8aHRtbD4gZWxlbWVudCB3aGVuIG5hdiBpcyBhY3RpdmVcbiAgICAgICAgICBqc0NsYXNzOiBcImpzXCIsICAgICAgICAgICAgICAgICAgICAvLyBTdHJpbmc6ICdKUyBlbmFibGVkJyBjbGFzcyB3aGljaCBpcyBhZGRlZCB0byA8aHRtbD4gZWxlbWVudFxuICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCl7fSwgICAgICAgICAgICAgICAvLyBGdW5jdGlvbjogSW5pdCBjYWxsYmFja1xuICAgICAgICAgIG9wZW46IGZ1bmN0aW9uKCl7fSwgICAgICAgICAgICAgICAvLyBGdW5jdGlvbjogT3BlbiBjYWxsYmFja1xuICAgICAgICAgIGNsb3NlOiBmdW5jdGlvbigpe30gICAgICAgICAgICAgICAvLyBGdW5jdGlvbjogQ2xvc2UgY2FsbGJhY2tcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBVc2VyIGRlZmluZWQgb3B0aW9uc1xuICAgICAgICBmb3IgKGkgaW4gb3B0aW9ucykge1xuICAgICAgICAgIHRoaXMub3B0aW9uc1tpXSA9IG9wdGlvbnNbaV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGRzIFwianNcIiBjbGFzcyBmb3IgPGh0bWw+XG4gICAgICAgIGFkZENsYXNzKGh0bWxFbCwgdGhpcy5vcHRpb25zLmpzQ2xhc3MpO1xuXG4gICAgICAgIC8vIFdyYXBwZXJcbiAgICAgICAgdGhpcy53cmFwcGVyRWwgPSBlbC5yZXBsYWNlKFwiI1wiLCBcIlwiKTtcblxuICAgICAgICAvLyBUcnkgc2VsZWN0aW5nIElEIGZpcnN0XG4gICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLndyYXBwZXJFbCkpIHtcbiAgICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLndyYXBwZXJFbCk7XG5cbiAgICAgICAgLy8gSWYgZWxlbWVudCB3aXRoIGFuIElEIGRvZXNuJ3QgZXhpc3QsIHVzZSBxdWVyeVNlbGVjdG9yXG4gICAgICAgIH0gZWxzZSBpZiAoZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0aGlzLndyYXBwZXJFbCkpIHtcbiAgICAgICAgICB0aGlzLndyYXBwZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRoaXMud3JhcHBlckVsKTtcblxuICAgICAgICAvLyBJZiBlbGVtZW50IGRvZXNuJ3QgZXhpc3RzLCBzdG9wIGhlcmUuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiVGhlIG5hdiBlbGVtZW50IHlvdSBhcmUgdHJ5aW5nIHRvIHNlbGVjdCBkb2Vzbid0IGV4aXN0XCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSW5uZXIgd3JhcHBlclxuICAgICAgICB0aGlzLndyYXBwZXIuaW5uZXIgPSBnZXRDaGlsZHJlbih0aGlzLndyYXBwZXIpO1xuXG4gICAgICAgIC8vIEZvciBtaW5pZmljYXRpb25cbiAgICAgICAgb3B0cyA9IHRoaXMub3B0aW9ucztcbiAgICAgICAgbmF2ID0gdGhpcy53cmFwcGVyO1xuXG4gICAgICAgIC8vIEluaXRcbiAgICAgICAgdGhpcy5faW5pdCh0aGlzKTtcbiAgICAgIH07XG5cbiAgICBSZXNwb25zaXZlTmF2LnByb3RvdHlwZSA9IHtcblxuICAgICAgLyoqXG4gICAgICAgKiBVbmF0dGFjaGVzIGV2ZW50cyBhbmQgcmVtb3ZlcyBhbnkgY2xhc3NlcyB0aGF0IHdlcmUgYWRkZWRcbiAgICAgICAqL1xuICAgICAgZGVzdHJveTogZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9yZW1vdmVTdHlsZXMoKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBcImNsb3NlZFwiKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBcIm9wZW5lZFwiKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBvcHRzLm5hdkNsYXNzKTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MobmF2LCBvcHRzLm5hdkNsYXNzICsgXCItXCIgKyB0aGlzLmluZGV4KTtcbiAgICAgICAgcmVtb3ZlQ2xhc3MoaHRtbEVsLCBvcHRzLm5hdkFjdGl2ZUNsYXNzKTtcbiAgICAgICAgbmF2LnJlbW92ZUF0dHJpYnV0ZShcInN0eWxlXCIpO1xuICAgICAgICBuYXYucmVtb3ZlQXR0cmlidXRlKFwiYXJpYS1oaWRkZW5cIik7XG5cbiAgICAgICAgcmVtb3ZlRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KHdpbmRvdywgXCJmb2N1c1wiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KGRvY3VtZW50LmJvZHksIFwidG91Y2htb3ZlXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgcmVtb3ZlRXZlbnQobmF2VG9nZ2xlLCBcInRvdWNoc3RhcnRcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwidG91Y2hlbmRcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwibW91c2V1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KG5hdlRvZ2dsZSwgXCJrZXl1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIHJlbW92ZUV2ZW50KG5hdlRvZ2dsZSwgXCJjbGlja1wiLCB0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgaWYgKCFvcHRzLmN1c3RvbVRvZ2dsZSkge1xuICAgICAgICAgIG5hdlRvZ2dsZS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5hdlRvZ2dsZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmF2VG9nZ2xlLnJlbW92ZUF0dHJpYnV0ZShcImFyaWEtaGlkZGVuXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFRvZ2dsZXMgdGhlIG5hdmlnYXRpb24gb3Blbi9jbG9zZVxuICAgICAgICovXG4gICAgICB0b2dnbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGhhc0FuaW1GaW5pc2hlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGlmICghbmF2T3Blbikge1xuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogT3BlbnMgdGhlIG5hdmlnYXRpb25cbiAgICAgICAqL1xuICAgICAgb3BlbjogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIW5hdk9wZW4pIHtcbiAgICAgICAgICByZW1vdmVDbGFzcyhuYXYsIFwiY2xvc2VkXCIpO1xuICAgICAgICAgIGFkZENsYXNzKG5hdiwgXCJvcGVuZWRcIik7XG4gICAgICAgICAgYWRkQ2xhc3MoaHRtbEVsLCBvcHRzLm5hdkFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICBhZGRDbGFzcyhuYXZUb2dnbGUsIFwiYWN0aXZlXCIpO1xuICAgICAgICAgIG5hdi5zdHlsZS5wb3NpdGlvbiA9IG9wdHMub3BlblBvcztcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdiwge1wiYXJpYS1oaWRkZW5cIjogXCJmYWxzZVwifSk7XG4gICAgICAgICAgbmF2T3BlbiA9IHRydWU7XG4gICAgICAgICAgb3B0cy5vcGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2xvc2VzIHRoZSBuYXZpZ2F0aW9uXG4gICAgICAgKi9cbiAgICAgIGNsb3NlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChuYXZPcGVuKSB7XG4gICAgICAgICAgYWRkQ2xhc3MobmF2LCBcImNsb3NlZFwiKTtcbiAgICAgICAgICByZW1vdmVDbGFzcyhuYXYsIFwib3BlbmVkXCIpO1xuICAgICAgICAgIHJlbW92ZUNsYXNzKGh0bWxFbCwgb3B0cy5uYXZBY3RpdmVDbGFzcyk7XG4gICAgICAgICAgcmVtb3ZlQ2xhc3MobmF2VG9nZ2xlLCBcImFjdGl2ZVwiKTtcbiAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdiwge1wiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCJ9KTtcblxuICAgICAgICAgIC8vIElmIGFuaW1hdGlvbnMgYXJlIGVuYWJsZWQsIHdhaXQgdW50aWwgdGhleSBmaW5pc2hcbiAgICAgICAgICBpZiAob3B0cy5hbmltYXRlKSB7XG4gICAgICAgICAgICBoYXNBbmltRmluaXNoZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICBuYXYuc3R5bGUucG9zaXRpb24gPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICAgIGhhc0FuaW1GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgICAgICB9LCBvcHRzLnRyYW5zaXRpb24gKyAxMCk7XG5cbiAgICAgICAgICAvLyBBbmltYXRpb25zIGFyZW4ndCBlbmFibGVkLCB3ZSBjYW4gZG8gdGhlc2UgaW1tZWRpYXRlbHlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmF2LnN0eWxlLnBvc2l0aW9uID0gXCJhYnNvbHV0ZVwiO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG5hdk9wZW4gPSBmYWxzZTtcbiAgICAgICAgICBvcHRzLmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVzaXplIGlzIGNhbGxlZCBvbiB3aW5kb3cgcmVzaXplIGFuZCBvcmllbnRhdGlvbiBjaGFuZ2UuXG4gICAgICAgKiBJdCBpbml0aWFsaXplcyB0aGUgQ1NTIHN0eWxlcyBhbmQgaGVpZ2h0IGNhbGN1bGF0aW9ucy5cbiAgICAgICAqL1xuICAgICAgcmVzaXplOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgLy8gUmVzaXplIHdhdGNoZXMgbmF2aWdhdGlvbiB0b2dnbGUncyBkaXNwbGF5IHN0YXRlXG4gICAgICAgIGlmICh3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShuYXZUb2dnbGUsIG51bGwpLmdldFByb3BlcnR5VmFsdWUoXCJkaXNwbGF5XCIpICE9PSBcIm5vbmVcIikge1xuXG4gICAgICAgICAgaXNNb2JpbGUgPSB0cnVlO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXMobmF2VG9nZ2xlLCB7XCJhcmlhLWhpZGRlblwiOiBcImZhbHNlXCJ9KTtcblxuICAgICAgICAgIC8vIElmIHRoZSBuYXZpZ2F0aW9uIGlzIGhpZGRlblxuICAgICAgICAgIGlmIChuYXYuY2xhc3NOYW1lLm1hdGNoKC8oXnxcXHMpY2xvc2VkKFxcc3wkKS8pKSB7XG4gICAgICAgICAgICBzZXRBdHRyaWJ1dGVzKG5hdiwge1wiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCJ9KTtcbiAgICAgICAgICAgIG5hdi5zdHlsZS5wb3NpdGlvbiA9IFwiYWJzb2x1dGVcIjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0aGlzLl9jcmVhdGVTdHlsZXMoKTtcbiAgICAgICAgICB0aGlzLl9jYWxjSGVpZ2h0KCk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBpc01vYmlsZSA9IGZhbHNlO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXMobmF2VG9nZ2xlLCB7XCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0pO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXMobmF2LCB7XCJhcmlhLWhpZGRlblwiOiBcImZhbHNlXCJ9KTtcbiAgICAgICAgICBuYXYuc3R5bGUucG9zaXRpb24gPSBvcHRzLm9wZW5Qb3M7XG4gICAgICAgICAgdGhpcy5fcmVtb3ZlU3R5bGVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogVGFrZXMgY2FyZSBvZiBhbGwgZXZlbiBoYW5kbGluZ1xuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSAge2V2ZW50fSBldmVudFxuICAgICAgICogQHJldHVybiB7dHlwZX0gcmV0dXJucyB0aGUgdHlwZSBvZiBldmVudCB0aGF0IHNob3VsZCBiZSB1c2VkXG4gICAgICAgKi9cbiAgICAgIGhhbmRsZUV2ZW50OiBmdW5jdGlvbiAoZSkge1xuICAgICAgICB2YXIgZXZ0ID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG5cbiAgICAgICAgc3dpdGNoIChldnQudHlwZSkge1xuICAgICAgICBjYXNlIFwidG91Y2hzdGFydFwiOlxuICAgICAgICAgIHRoaXMuX29uVG91Y2hTdGFydChldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidG91Y2htb3ZlXCI6XG4gICAgICAgICAgdGhpcy5fb25Ub3VjaE1vdmUoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInRvdWNoZW5kXCI6XG4gICAgICAgIGNhc2UgXCJtb3VzZXVwXCI6XG4gICAgICAgICAgdGhpcy5fb25Ub3VjaEVuZChldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2xpY2tcIjpcbiAgICAgICAgICB0aGlzLl9wcmV2ZW50RGVmYXVsdChldnQpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwia2V5dXBcIjpcbiAgICAgICAgICB0aGlzLl9vbktleVVwKGV2dCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmb2N1c1wiOlxuICAgICAgICBjYXNlIFwicmVzaXplXCI6XG4gICAgICAgICAgdGhpcy5yZXNpemUoZXZ0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBJbml0aWFsaXplcyB0aGUgd2lkZ2V0XG4gICAgICAgKi9cbiAgICAgIF9pbml0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5kZXggPSBpbmRleCsrO1xuXG4gICAgICAgIGFkZENsYXNzKG5hdiwgb3B0cy5uYXZDbGFzcyk7XG4gICAgICAgIGFkZENsYXNzKG5hdiwgb3B0cy5uYXZDbGFzcyArIFwiLVwiICsgdGhpcy5pbmRleCk7XG4gICAgICAgIGFkZENsYXNzKG5hdiwgXCJjbG9zZWRcIik7XG4gICAgICAgIGhhc0FuaW1GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIG5hdk9wZW4gPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9jbG9zZU9uTmF2Q2xpY2soKTtcbiAgICAgICAgdGhpcy5fY3JlYXRlVG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuX3RyYW5zaXRpb25zKCk7XG4gICAgICAgIHRoaXMucmVzaXplKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE9uIElFOCB0aGUgcmVzaXplIGV2ZW50IHRyaWdnZXJzIHRvbyBlYXJseSBmb3Igc29tZSByZWFzb25cbiAgICAgICAgICogc28gaXQncyBjYWxsZWQgaGVyZSBhZ2FpbiBvbiBpbml0IHRvIG1ha2Ugc3VyZSBhbGwgdGhlXG4gICAgICAgICAqIGNhbGN1bGF0ZWQgc3R5bGVzIGFyZSBjb3JyZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBzZWxmLnJlc2l6ZSgpO1xuICAgICAgICB9LCAyMCk7XG5cbiAgICAgICAgYWRkRXZlbnQod2luZG93LCBcInJlc2l6ZVwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KHdpbmRvdywgXCJmb2N1c1wiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KGRvY3VtZW50LmJvZHksIFwidG91Y2htb3ZlXCIsIHRoaXMsIGZhbHNlKTtcbiAgICAgICAgYWRkRXZlbnQobmF2VG9nZ2xlLCBcInRvdWNoc3RhcnRcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChuYXZUb2dnbGUsIFwidG91Y2hlbmRcIiwgdGhpcywgZmFsc2UpO1xuICAgICAgICBhZGRFdmVudChuYXZUb2dnbGUsIFwibW91c2V1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KG5hdlRvZ2dsZSwgXCJrZXl1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICAgIGFkZEV2ZW50KG5hdlRvZ2dsZSwgXCJjbGlja1wiLCB0aGlzLCBmYWxzZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEluaXQgY2FsbGJhY2sgaGVyZVxuICAgICAgICAgKi9cbiAgICAgICAgb3B0cy5pbml0KCk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENyZWF0ZXMgU3R5bGVzIHRvIHRoZSA8aGVhZD5cbiAgICAgICAqL1xuICAgICAgX2NyZWF0ZVN0eWxlczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXN0eWxlRWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgc3R5bGVFbGVtZW50LnR5cGUgPSBcInRleHQvY3NzXCI7XG4gICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogUmVtb3ZlcyBzdHlsZXMgZnJvbSB0aGUgPGhlYWQ+XG4gICAgICAgKi9cbiAgICAgIF9yZW1vdmVTdHlsZXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDcmVhdGVzIE5hdmlnYXRpb24gVG9nZ2xlXG4gICAgICAgKi9cbiAgICAgIF9jcmVhdGVUb2dnbGU6IGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIHRvZ2dsZSwgbGV0J3MgY3JlYXRlIG9uZVxuICAgICAgICBpZiAoIW9wdHMuY3VzdG9tVG9nZ2xlKSB7XG4gICAgICAgICAgdmFyIHRvZ2dsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICAgICAgICAgIHRvZ2dsZS5pbm5lckhUTUwgPSBvcHRzLmxhYmVsO1xuICAgICAgICAgIHNldEF0dHJpYnV0ZXModG9nZ2xlLCB7XG4gICAgICAgICAgICBcImhyZWZcIjogXCIjXCIsXG4gICAgICAgICAgICBcImNsYXNzXCI6IFwibmF2LXRvZ2dsZVwiXG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvLyBEZXRlcm1pbmUgd2hlcmUgdG8gaW5zZXJ0IHRoZSB0b2dnbGVcbiAgICAgICAgICBpZiAob3B0cy5pbnNlcnQgPT09IFwiYWZ0ZXJcIikge1xuICAgICAgICAgICAgbmF2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRvZ2dsZSwgbmF2Lm5leHRTaWJsaW5nKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmF2LnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHRvZ2dsZSwgbmF2KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBuYXZUb2dnbGUgPSB0b2dnbGU7XG5cbiAgICAgICAgLy8gVGhlcmUgaXMgYSB0b2dnbGUgYWxyZWFkeSwgbGV0J3MgdXNlIHRoYXQgb25lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHRvZ2dsZUVsID0gb3B0cy5jdXN0b21Ub2dnbGUucmVwbGFjZShcIiNcIiwgXCJcIik7XG5cbiAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodG9nZ2xlRWwpKSB7XG4gICAgICAgICAgICBuYXZUb2dnbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0b2dnbGVFbCk7XG4gICAgICAgICAgfSBlbHNlIGlmIChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRvZ2dsZUVsKSkge1xuICAgICAgICAgICAgbmF2VG9nZ2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0b2dnbGVFbCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRoZSBjdXN0b20gbmF2IHRvZ2dsZSB5b3UgYXJlIHRyeWluZyB0byBzZWxlY3QgZG9lc24ndCBleGlzdFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQ2xvc2VzIHRoZSBuYXZpZ2F0aW9uIHdoZW4gYSBsaW5rIGluc2lkZSBpcyBjbGlja2VkLlxuICAgICAgICovXG4gICAgICBfY2xvc2VPbk5hdkNsaWNrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChvcHRzLmNsb3NlT25OYXZDbGljaykge1xuICAgICAgICAgIHZhciBsaW5rcyA9IG5hdi5nZXRFbGVtZW50c0J5VGFnTmFtZShcImFcIiksXG4gICAgICAgICAgICBzZWxmID0gdGhpcztcbiAgICAgICAgICBmb3JFYWNoKGxpbmtzLCBmdW5jdGlvbiAoaSwgZWwpIHtcbiAgICAgICAgICAgIGFkZEV2ZW50KGxpbmtzW2ldLCBcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgaWYgKGlzTW9iaWxlKSB7XG4gICAgICAgICAgICAgICAgc2VsZi50b2dnbGUoKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIFByZXZlbnRzIHRoZSBkZWZhdWx0IGZ1bmN0aW9uYWxpdHkuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9wcmV2ZW50RGVmYXVsdDogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZiAoZS5wcmV2ZW50RGVmYXVsdCkge1xuICAgICAgICAgIGlmIChlLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgICAgIC8vIFRoaXMgaXMgc3RyaWN0bHkgZm9yIG9sZCBJRVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBPbiB0b3VjaCBzdGFydCB3ZSBnZXQgdGhlIGxvY2F0aW9uIG9mIHRoZSB0b3VjaC5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqL1xuICAgICAgX29uVG91Y2hTdGFydDogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKCFFdmVudC5wcm90b3R5cGUuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKSB7XG4gICAgICAgICAgdGhpcy5fcHJldmVudERlZmF1bHQoZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGFydFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgdGhpcy5zdGFydFkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICAgICAgdGhpcy50b3VjaEhhc01vdmVkID0gZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFJlbW92ZSBtb3VzZXVwIGV2ZW50IGNvbXBsZXRlbHkgaGVyZSB0byBhdm9pZFxuICAgICAgICAgKiBkb3VibGUgdHJpZ2dlcmluZyB0aGUgZXZlbnQuXG4gICAgICAgICAqL1xuICAgICAgICByZW1vdmVFdmVudChuYXZUb2dnbGUsIFwibW91c2V1cFwiLCB0aGlzLCBmYWxzZSk7XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIENoZWNrIGlmIHRoZSB1c2VyIGlzIHNjcm9sbGluZyBpbnN0ZWFkIG9mIHRhcHBpbmcuXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtICB7ZXZlbnR9IGV2ZW50XG4gICAgICAgKi9cbiAgICAgIF9vblRvdWNoTW92ZTogZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKE1hdGguYWJzKGUudG91Y2hlc1swXS5jbGllbnRYIC0gdGhpcy5zdGFydFgpID4gMTAgfHxcbiAgICAgICAgTWF0aC5hYnMoZS50b3VjaGVzWzBdLmNsaWVudFkgLSB0aGlzLnN0YXJ0WSkgPiAxMCkge1xuICAgICAgICAgIHRoaXMudG91Y2hIYXNNb3ZlZCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogT24gdG91Y2ggZW5kIHRvZ2dsZSB0aGUgbmF2aWdhdGlvbi5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqL1xuICAgICAgX29uVG91Y2hFbmQ6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHRoaXMuX3ByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICBpZiAoIWlzTW9iaWxlKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgdGhlIHVzZXIgaXNuJ3Qgc2Nyb2xsaW5nXG4gICAgICAgIGlmICghdGhpcy50b3VjaEhhc01vdmVkKSB7XG5cbiAgICAgICAgICAvLyBJZiB0aGUgZXZlbnQgdHlwZSBpcyB0b3VjaFxuICAgICAgICAgIGlmIChlLnR5cGUgPT09IFwidG91Y2hlbmRcIikge1xuICAgICAgICAgICAgdGhpcy50b2dnbGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcblxuICAgICAgICAgIC8vIEV2ZW50IHR5cGUgd2FzIGNsaWNrLCBub3QgdG91Y2hcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGV2dCA9IGUgfHwgd2luZG93LmV2ZW50O1xuXG4gICAgICAgICAgICAvLyBJZiBpdCBpc24ndCBhIHJpZ2h0IGNsaWNrLCBkbyB0b2dnbGluZ1xuICAgICAgICAgICAgaWYgKCEoZXZ0LndoaWNoID09PSAzIHx8IGV2dC5idXR0b24gPT09IDIpKSB7XG4gICAgICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAvKipcbiAgICAgICAqIEZvciBrZXlib2FyZCBhY2Nlc3NpYmlsaXR5LCB0b2dnbGUgdGhlIG5hdmlnYXRpb24gb24gRW50ZXJcbiAgICAgICAqIGtleXByZXNzIHRvby5cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0gIHtldmVudH0gZXZlbnRcbiAgICAgICAqL1xuICAgICAgX29uS2V5VXA6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIHZhciBldnQgPSBlIHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgaWYgKGV2dC5rZXlDb2RlID09PSAxMykge1xuICAgICAgICAgIHRoaXMudG9nZ2xlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgIC8qKlxuICAgICAgICogQWRkcyB0aGUgbmVlZGVkIENTUyB0cmFuc2l0aW9ucyBpZiBhbmltYXRpb25zIGFyZSBlbmFibGVkXG4gICAgICAgKi9cbiAgICAgIF90cmFuc2l0aW9uczogZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAob3B0cy5hbmltYXRlKSB7XG4gICAgICAgICAgdmFyIG9ialN0eWxlID0gbmF2LnN0eWxlLFxuICAgICAgICAgICAgdHJhbnNpdGlvbiA9IFwibWF4LWhlaWdodCBcIiArIG9wdHMudHJhbnNpdGlvbiArIFwibXNcIjtcblxuICAgICAgICAgIG9ialN0eWxlLldlYmtpdFRyYW5zaXRpb24gPVxuICAgICAgICAgIG9ialN0eWxlLk1velRyYW5zaXRpb24gPVxuICAgICAgICAgIG9ialN0eWxlLk9UcmFuc2l0aW9uID1cbiAgICAgICAgICBvYmpTdHlsZS50cmFuc2l0aW9uID0gdHJhbnNpdGlvbjtcbiAgICAgICAgfVxuICAgICAgfSxcblxuICAgICAgLyoqXG4gICAgICAgKiBDYWxjdWxhdGVzIHRoZSBoZWlnaHQgb2YgdGhlIG5hdmlnYXRpb24gYW5kIHRoZW4gY3JlYXRlc1xuICAgICAgICogc3R5bGVzIHdoaWNoIGFyZSBsYXRlciBhZGRlZCB0byB0aGUgcGFnZSA8aGVhZD5cbiAgICAgICAqL1xuICAgICAgX2NhbGNIZWlnaHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNhdmVkSGVpZ2h0ID0gMDtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBuYXYuaW5uZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBzYXZlZEhlaWdodCArPSBuYXYuaW5uZXJbaV0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGlubmVyU3R5bGVzID0gXCIuXCIgKyBvcHRzLmpzQ2xhc3MgKyBcIiAuXCIgKyBvcHRzLm5hdkNsYXNzICsgXCItXCIgKyB0aGlzLmluZGV4ICsgXCIub3BlbmVke21heC1oZWlnaHQ6XCIgKyBzYXZlZEhlaWdodCArIFwicHggIWltcG9ydGFudH0gLlwiICsgb3B0cy5qc0NsYXNzICsgXCIgLlwiICsgb3B0cy5uYXZDbGFzcyArIFwiLVwiICsgdGhpcy5pbmRleCArIFwiLm9wZW5lZC5kcm9wZG93bi1hY3RpdmUge21heC1oZWlnaHQ6OTk5OXB4ICFpbXBvcnRhbnR9XCI7XG5cbiAgICAgICAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgICAgICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGlubmVyU3R5bGVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN0eWxlRWxlbWVudC5pbm5lckhUTUwgPSBpbm5lclN0eWxlcztcbiAgICAgICAgfVxuXG4gICAgICAgIGlubmVyU3R5bGVzID0gXCJcIjtcbiAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gbmV3IFJlc3BvbnNpdmUgTmF2XG4gICAgICovXG4gICAgcmV0dXJuIG5ldyBSZXNwb25zaXZlTmF2KGVsLCBvcHRpb25zKTtcblxuICB9O1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSByZXNwb25zaXZlTmF2O1xuICB9IGVsc2Uge1xuICAgIHdpbmRvdy5yZXNwb25zaXZlTmF2ID0gcmVzcG9uc2l2ZU5hdjtcbiAgfVxuXG59KGRvY3VtZW50LCB3aW5kb3csIDApKTtcbiIsInZhciBuYXYgPSByZXNwb25zaXZlTmF2KFwiLm5hdi1jb2xsYXBzZVwiKTtcblxualF1ZXJ5KGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiggJCApIHtcblxuICAkKFwiW2RhdGEtZmFuY3lib3hdXCIpLmZhbmN5Ym94KHtcblx0XHRsb29wICAgICA6IHRydWVcblx0fSk7XG5cbn0pO1xuIl19
