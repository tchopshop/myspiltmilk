(function ($) {

/**
 * Attach auto-submit to admin view form.
 */
Drupal.behaviors.feedbackAdminForm = {
  attach: function (context) {
    $('#feedback-admin-view-form', context).once('feedback', function () {
      $(this).find('fieldset.feedback-messages :input[type="checkbox"]').click(function () {
        this.form.submit();
      });
    });
  }
};

/**
 * Attach collapse behavior to the feedback form block.
 */
Drupal.behaviors.feedbackForm = {
  attach: function (context) {
    $('#block-feedback-form', context).once('feedback', function () {
      var $block = $(this);
      $block.find('span.feedback-link')
        .prepend('<span id="feedback-form-toggle">[ + ]</span> ')
        .css('cursor', 'pointer')
        .toggle(function () {
            Drupal.feedbackFormToggle($block, false);
          },
          function() {
            Drupal.feedbackFormToggle($block, true);
          }
        );
      $block.find('form').hide();
      $block.show();
    });
  }
};

/**
 * Re-collapse the feedback form after every successful form submission.
 */
Drupal.behaviors.feedbackFormSubmit = {
  attach: function (context) {
    var $context = $(context);
    if (!$context.is('#feedback-status-message')) {
      return;
    }
    // Collapse the form.
    $('#block-feedback-form .feedback-link').click();
    // Blend out and remove status message.
    window.setTimeout(function () {
      $context.fadeOut('slow', function () {
        $context.remove();
      });
    }, 3000);
  }
};

/**
 * Collapse or uncollapse the feedback form block.
 */
Drupal.feedbackFormToggle = function ($block, enable) {
  $block.find('form').slideToggle('medium');
  if (enable) {
    $('#feedback-form-toggle', $block).html('[ + ]');
  }
  else {
    $('#feedback-form-toggle', $block).html('[ &minus; ]');
  }
};

})(jQuery);
;
(function ($) {
  Drupal.quickbar = Drupal.quickbar || {};
  
  Drupal.quickbar.setActive = function(toolbar_id) {
    // Show the right toolbar
    $('#quickbar .depth-1 ul.links').addClass('collapsed');
    $(toolbar_id).removeClass('collapsed');
    $('div#quickbar, div#quickbar .depth-1').removeClass('collapsed');
  
    // Switch link active class to corresponding menu item
    var link_id = toolbar_id.replace('quickbar', 'quickbar-link');
    $('#quickbar .depth-0 ul.links a').removeClass('active');
    $(link_id).addClass('active');
  }
  
  Drupal.behaviors.quickbar = {
    attach: function (context, settings) {
      // Move the toolbar to underneath body.
      var toolbarHtml = $('#quickbar').remove();
      $('body').prepend(toolbarHtml);
      
      // Primary menus
      $('#quickbar .depth-0 ul.links a:not(.processed)').each(function() {
        var target = $(this).attr('id');
        if (target) {
          target = '#'+ target.replace('quickbar-link', 'quickbar');
          if ($(target, '#quickbar').size() > 0) {
            // If this link is active show this toolbar on setup
            if ($(this).parent().is('.active-trail')) {
              Drupal.quickbar.setActive(target);
            }
            // Add click handler
            $(this).click(function() {
              if ($(this).is('.active')) {
                // Follow the link
                if (!$('#quickbar').hasClass('primary-nofollow')) {
                  window.location = $(this).attr('href');
                  return true;
                }
                return false;
              }
              // Open submenu
              Drupal.quickbar.setActive(target);
              return false;
            });
          }
        }
        $(this).addClass('processed');
      });
      
      // Close button
      $('#quickbar .depth-1 span.close:not(.processed)').each(function() {
        $(this).click(function() {
          $('#quickbar .depth-1').addClass('collapsed');
          $('#quickbar-admin a.active').removeClass('active');
          return false;
        });
        $(this).addClass('processed');
      });
      
      // Open active secondary menu
      $('#quickbar .depth-1 ul.links a.active:first').each(function() {
        // IE might not prepend '/' to pathhname
        var path = window.location.pathname;
        if (path.indexOf('/') !== 0) {
          path = '/' + path;
        }
        if (window.location.pathname == $(this).attr('href')) {
          var target = $(this).parents('ul:first').attr('id');
          target = '#' + target.replace('quickbar', 'quickbar-link');
          $('#quickbar .depth-0 ul.links a:not(.active)' + target).click();
        }
      });
    }
  };
})(jQuery);;
(function(a){Drupal.behaviors.autocomplete={attach:function(b,c){var d=[];a("input.autocomplete",b).once("autocomplete",function(){var b=this.value;d[b]||(d[b]=new Drupal.ACDB(b));var c=a("#"+this.id.substr(0,this.id.length-13)).attr("autocomplete","OFF").attr("aria-autocomplete","list");a(c[0].form).submit(Drupal.autocompleteSubmit),c.parent().attr("role","application").append(a('<span class="element-invisible" aria-live="assertive"></span>').attr("id",c.attr("id")+"-autocomplete-aria-live")),new Drupal.jsAC(c,d[b])})}},Drupal.autocompleteSubmit=function(){return a("#autocomplete").each(function(){this.owner.hidePopup()}).length==0},Drupal.jsAC=function(b,c){var d=this;this.input=b[0],this.ariaLive=a("#"+this.input.id+"-autocomplete-aria-live"),this.db=c,b.keydown(function(a){return d.onkeydown(this,a)}).keyup(function(a){d.onkeyup(this,a)}).blur(function(){d.hidePopup(),d.db.cancel()})},Drupal.jsAC.prototype.onkeydown=function(a,b){b||(b=window.event);switch(b.keyCode){case 40:return this.selectDown(),!1;case 38:return this.selectUp(),!1;default:return!0}},Drupal.jsAC.prototype.onkeyup=function(a,b){b||(b=window.event);switch(b.keyCode){case 16:case 17:case 18:case 20:case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:return!0;case 9:case 13:case 27:return this.hidePopup(b.keyCode),!0;default:return a.value.length>0?this.populatePopup():this.hidePopup(b.keyCode),!0}},Drupal.jsAC.prototype.select=function(b){this.input.value=a(b).data("autocompleteValue")},Drupal.jsAC.prototype.selectDown=function(){if(this.selected&&this.selected.nextSibling)this.highlight(this.selected.nextSibling);else if(this.popup){var b=a("li",this.popup);b.length>0&&this.highlight(b.get(0))}},Drupal.jsAC.prototype.selectUp=function(){this.selected&&this.selected.previousSibling&&this.highlight(this.selected.previousSibling)},Drupal.jsAC.prototype.highlight=function(b){this.selected&&a(this.selected).removeClass("selected"),a(b).addClass("selected"),this.selected=b,a(this.ariaLive).html(a(this.selected).html())},Drupal.jsAC.prototype.unhighlight=function(b){a(b).removeClass("selected"),this.selected=!1,a(this.ariaLive).empty()},Drupal.jsAC.prototype.hidePopup=function(b){this.selected&&(b&&b!=46&&b!=8&&b!=27||!b)&&(this.input.value=a(this.selected).data("autocompleteValue"));var c=this.popup;c&&(this.popup=null,a(c).fadeOut("fast",function(){a(c).remove()})),this.selected=!1,a(this.ariaLive).empty()},Drupal.jsAC.prototype.populatePopup=function(){var b=a(this.input),c=b.position();this.popup&&a(this.popup).remove(),this.selected=!1,this.popup=a('<div id="autocomplete"></div>')[0],this.popup.owner=this,a(this.popup).css({top:parseInt(c.top+this.input.offsetHeight,10)+"px",left:parseInt(c.left,10)+"px",width:b.innerWidth()+"px",display:"none"}),b.before(this.popup),this.db.owner=this,this.db.search(this.input.value)},Drupal.jsAC.prototype.found=function(b){if(!this.input.value.length)return!1;var c=a("<ul></ul>"),d=this;for(key in b)a("<li></li>").html(a("<div></div>").html(b[key])).mousedown(function(){d.select(this)}).mouseover(function(){d.highlight(this)}).mouseout(function(){d.unhighlight(this)}).data("autocompleteValue",key).appendTo(c);this.popup&&(c.children().length?(a(this.popup).empty().append(c).show(),a(this.ariaLive).html(Drupal.t("Autocomplete popup"))):(a(this.popup).css({visibility:"hidden"}),this.hidePopup()))},Drupal.jsAC.prototype.setStatus=function(b){switch(b){case"begin":a(this.input).addClass("throbbing"),a(this.ariaLive).html(Drupal.t("Searching for matches..."));break;case"cancel":case"error":case"found":a(this.input).removeClass("throbbing")}},Drupal.ACDB=function(a){this.uri=a,this.delay=300,this.cache={}},Drupal.ACDB.prototype.search=function(b){var c=this;this.searchString=b,b=b.replace(/^\s+|\s+$/,"");if(b.length<=0||b.charAt(b.length-1)==",")return;if(this.cache[b])return this.owner.found(this.cache[b]);this.timer&&clearTimeout(this.timer),this.timer=setTimeout(function(){c.owner.setStatus("begin"),a.ajax({type:"GET",url:c.uri+"/"+Drupal.encodePath(b),dataType:"json",success:function(a){if(typeof a.status=="undefined"||a.status!=0)c.cache[b]=a,c.searchString==b&&c.owner.found(a),c.owner.setStatus("found")},error:function(a){alert(Drupal.ajaxError(a,c.uri))}})},this.delay)},Drupal.ACDB.prototype.cancel=function(){this.owner&&this.owner.setStatus("cancel"),this.timer&&clearTimeout(this.timer),this.searchString=""}})(jQuery);;
(function($){Drupal.behaviors.tableHeader={attach:function(a,b){if(!$.support.positionFixed)return;$("table.sticky-enabled",a).once("tableheader",function(){$(this).data("drupal-tableheader",new Drupal.tableHeader(this))})}},Drupal.tableHeader=function(a){var b=this;this.originalTable=$(a),this.originalHeader=$(a).children("thead"),this.originalHeaderCells=this.originalHeader.find("> tr > th"),this.displayWeight=null,this.originalTable.bind("columnschange",function(a,c){b.widthCalculated=b.displayWeight!==null&&b.displayWeight===c,b.displayWeight=c}),this.stickyTable=$('<table class="sticky-header"/>').insertBefore(this.originalTable).css({position:"fixed",top:"0px"}),this.stickyHeader=this.originalHeader.clone(!0).hide().appendTo(this.stickyTable),this.stickyHeaderCells=this.stickyHeader.find("> tr > th"),this.originalTable.addClass("sticky-table"),$(window).bind("scroll.drupal-tableheader",$.proxy(this,"eventhandlerRecalculateStickyHeader")).bind("resize.drupal-tableheader",{calculateWidth:!0},$.proxy(this,"eventhandlerRecalculateStickyHeader")).bind("drupalDisplaceAnchor.drupal-tableheader",function(){window.scrollBy(0,-b.stickyTable.outerHeight())}).bind("drupalDisplaceFocus.drupal-tableheader",function(a){b.stickyVisible&&a.clientY<b.stickyOffsetTop+b.stickyTable.outerHeight()&&a.$target.closest("sticky-header").length===0&&window.scrollBy(0,-b.stickyTable.outerHeight())}).triggerHandler("resize.drupal-tableheader"),this.stickyHeader.show()},Drupal.tableHeader.prototype.eventhandlerRecalculateStickyHeader=function(event){var self=this,calculateWidth=event.data&&event.data.calculateWidth;this.stickyOffsetTop=Drupal.settings.tableHeaderOffset?eval(Drupal.settings.tableHeaderOffset+"()"):0,this.stickyTable.css("top",this.stickyOffsetTop+"px");var viewHeight=document.documentElement.scrollHeight||document.body.scrollHeight;if(calculateWidth||this.viewHeight!==viewHeight)this.viewHeight=viewHeight,this.vPosition=this.originalTable.offset().top-4-this.stickyOffsetTop,this.hPosition=this.originalTable.offset().left,this.vLength=this.originalTable[0].clientHeight-100,calculateWidth=!0;var hScroll=document.documentElement.scrollLeft||document.body.scrollLeft,vOffset=(document.documentElement.scrollTop||document.body.scrollTop)-this.vPosition;this.stickyVisible=vOffset>0&&vOffset<this.vLength,this.stickyTable.css({left:-hScroll+this.hPosition+"px",visibility:this.stickyVisible?"visible":"hidden"});if(this.stickyVisible&&(calculateWidth||!this.widthCalculated)){this.widthCalculated=!0;var $that=null,$stickyCell=null,display=null,cellWidth=null;for(var i=0,il=this.originalHeaderCells.length;i<il;i+=1)$that=$(this.originalHeaderCells[i]),$stickyCell=this.stickyHeaderCells.eq($that.index()),display=$that.css("display"),display!=="none"?(cellWidth=$that.css("width"),cellWidth==="auto"&&(cellWidth=$that[0].clientWidth+"px"),$stickyCell.css({width:cellWidth,display:display})):$stickyCell.css("display","none");this.stickyTable.css("width",this.originalTable.css("width"))}}})(jQuery);;
/**
 * @file base.js
 *
 * Some basic behaviors and utility functions for Views.
 */
(function ($) {

Drupal.Views = {};

/**
 * jQuery UI tabs, Views integration component
 */
Drupal.behaviors.viewsTabs = {
  attach: function (context) {
    if ($.viewsUi && $.viewsUi.tabs) {
      $('#views-tabset').once('views-processed').viewsTabs({
        selectedClass: 'active'
      });
    }

    $('a.views-remove-link').once('views-processed').click(function(event) {
      var id = $(this).attr('id').replace('views-remove-link-', '');
      $('#views-row-' + id).hide();
      $('#views-removed-' + id).attr('checked', true);
      event.preventDefault();
   });
  /**
    * Here is to handle display deletion
    * (checking in the hidden checkbox and hiding out the row)
    */
  $('a.display-remove-link')
    .addClass('display-processed')
    .click(function() {
      var id = $(this).attr('id').replace('display-remove-link-', '');
      $('#display-row-' + id).hide();
      $('#display-removed-' + id).attr('checked', true);
      return false;
  });
  }
};

/**
 * Helper function to parse a querystring.
 */
Drupal.Views.parseQueryString = function (query) {
  var args = {};
  var pos = query.indexOf('?');
  if (pos != -1) {
    query = query.substring(pos + 1);
  }
  var pairs = query.split('&');
  for(var i in pairs) {
    if (typeof(pairs[i]) == 'string') {
      var pair = pairs[i].split('=');
      // Ignore the 'q' path argument, if present.
      if (pair[0] != 'q' && pair[1]) {
        args[decodeURIComponent(pair[0].replace(/\+/g, ' '))] = decodeURIComponent(pair[1].replace(/\+/g, ' '));
      }
    }
  }
  return args;
};

/**
 * Helper function to return a view's arguments based on a path.
 */
Drupal.Views.parseViewArgs = function (href, viewPath) {
  var returnObj = {};
  var path = Drupal.Views.getPath(href);
  // Ensure we have a correct path.
  if (viewPath && path.substring(0, viewPath.length + 1) == viewPath + '/') {
    var args = decodeURIComponent(path.substring(viewPath.length + 1, path.length));
    returnObj.view_args = args;
    returnObj.view_path = path;
  }
  return returnObj;
};

/**
 * Strip off the protocol plus domain from an href.
 */
Drupal.Views.pathPortion = function (href) {
  // Remove e.g. http://example.com if present.
  var protocol = window.location.protocol;
  if (href.substring(0, protocol.length) == protocol) {
    // 2 is the length of the '//' that normally follows the protocol
    href = href.substring(href.indexOf('/', protocol.length + 2));
  }
  return href;
};

/**
 * Return the Drupal path portion of an href.
 */
Drupal.Views.getPath = function (href) {
  href = Drupal.Views.pathPortion(href);
  href = href.substring(Drupal.settings.basePath.length, href.length);
  // 3 is the length of the '?q=' added to the url without clean urls.
  if (href.substring(0, 3) == '?q=') {
    href = href.substring(3, href.length);
  }
  var chars = ['#', '?', '&'];
  for (i in chars) {
    if (href.indexOf(chars[i]) > -1) {
      href = href.substr(0, href.indexOf(chars[i]));
    }
  }
  return href;
};

})(jQuery);
;
(function(a){Drupal.progressBar=function(b,c,d,e){var f=this;this.id=b,this.method=d||"GET",this.updateCallback=c,this.errorCallback=e,this.element=a('<div class="progress" aria-live="polite"></div>').attr("id",b),this.element.html('<div class="bar"><div class="filled"></div></div><div class="percentage"></div><div class="message">&nbsp;</div>')},Drupal.progressBar.prototype.setProgress=function(b,c){b>=0&&b<=100&&(a("div.filled",this.element).css("width",b+"%"),a("div.percentage",this.element).html(b+"%")),a("div.message",this.element).html(c),this.updateCallback&&this.updateCallback(b,c,this)},Drupal.progressBar.prototype.startMonitoring=function(a,b){this.delay=b,this.uri=a,this.sendPing()},Drupal.progressBar.prototype.stopMonitoring=function(){clearTimeout(this.timer),this.uri=null},Drupal.progressBar.prototype.sendPing=function(){this.timer&&clearTimeout(this.timer);if(this.uri){var b=this;a.ajax({type:this.method,url:this.uri,data:"",dataType:"json",success:function(a){if(a.status==0){b.displayError(a.data);return}b.setProgress(a.percentage,a.message),b.timer=setTimeout(function(){b.sendPing()},b.delay)},error:function(a){b.displayError(Drupal.ajaxError(a,b.uri))}})}},Drupal.progressBar.prototype.displayError=function(b){var c=a('<div class="messages error"></div>').html(b);a(this.element).before(c).hide(),this.errorCallback&&this.errorCallback(this)}})(jQuery);;
/**
 * @file ajaxView.js
 *
 * Handles AJAX fetching of views, including filter submission and response.
 */
(function ($) {

/**
 * Attaches the AJAX behavior to Views exposed filter forms and key View links.
 */
Drupal.behaviors.ViewsAjaxView = {};
Drupal.behaviors.ViewsAjaxView.attach = function() {
  if (Drupal.settings && Drupal.settings.views && Drupal.settings.views.ajaxViews) {
    $.each(Drupal.settings.views.ajaxViews, function(i, settings) {
      // @todo: Figure out where to store the object.
      new Drupal.views.ajaxView(settings);
    });
  }
};

Drupal.views = {};

/**
 * Javascript object for a certain view.
 */
Drupal.views.ajaxView = function(settings) {
  var selector = '.view-dom-id-' + settings.view_dom_id;
  this.$view = $(selector);

  // Retrieve the path to use for views' ajax.
  var ajax_path = Drupal.settings.views.ajax_path;

  // If there are multiple views this might've ended up showing up multiple times.
  if (ajax_path.constructor.toString().indexOf("Array") != -1) {
    ajax_path = ajax_path[0];
  }

  // Check if there are any GET parameters to send to views.
  var queryString = window.location.search || '';
  if (queryString !== '') {
    // Remove the question mark and Drupal path component if any.
    var queryString = queryString.slice(1).replace(/q=[^&]+&?|&?render=[^&]+/, '');
    if (queryString !== '') {
      // If there is a '?' in ajax_path, clean url are on and & should be used to add parameters.
      queryString = ((/\?/.test(ajax_path)) ? '&' : '?') + queryString;
    }
  }

  this.element_settings = {
    url: ajax_path + queryString,
    submit: settings,
    setClick: true,
    event: 'click',
    selector: selector,
    progress: { type: 'throbber' }
  };

  this.settings = settings;

  // Add the ajax to exposed forms.
  this.$exposed_form = $('form#views-exposed-form-'+ settings.view_name.replace(/_/g, '-') + '-' + settings.view_display_id.replace(/_/g, '-'));
  this.$exposed_form.once(jQuery.proxy(this.attachExposedFormAjax, this));

  // Add the ajax to pagers.
  this.$view
    // Don't attach to nested views. Doing so would attach multiple behaviors
    // to a given element.
    .filter(jQuery.proxy(this.filterNestedViews, this))
    .once(jQuery.proxy(this.attachPagerAjax, this));
};

Drupal.views.ajaxView.prototype.attachExposedFormAjax = function() {
  var button = $('input[type=submit], input[type=image]', this.$exposed_form);
  button = button[0];

  this.exposedFormAjax = new Drupal.ajax($(button).attr('id'), button, this.element_settings);
};

Drupal.views.ajaxView.prototype.filterNestedViews= function() {
  // If there is at least one parent with a view class, this view
  // is nested (e.g., an attachment). Bail.
  return !this.$view.parents('.view').size();
};

/**
 * Attach the ajax behavior to each link.
 */
Drupal.views.ajaxView.prototype.attachPagerAjax = function() {
  this.$view.find('ul.pager > li > a, th.views-field a, .attachment .views-summary a')
  .each(jQuery.proxy(this.attachPagerLinkAjax, this));
};

/**
 * Attach the ajax behavior to a singe link.
 */
Drupal.views.ajaxView.prototype.attachPagerLinkAjax = function(id, link) {
  var $link = $(link);
  var viewData = {};
  var href = $link.attr('href');
  // Construct an object using the settings defaults and then overriding
  // with data specific to the link.
  $.extend(
    viewData,
    this.settings,
    Drupal.Views.parseQueryString(href),
    // Extract argument data from the URL.
    Drupal.Views.parseViewArgs(href, this.settings.view_base_path)
  );

  // For anchor tags, these will go to the target of the anchor rather
  // than the usual location.
  $.extend(viewData, Drupal.Views.parseViewArgs(href, this.settings.view_base_path));

  this.element_settings.submit = viewData;
  this.pagerAjax = new Drupal.ajax(false, $link, this.element_settings);
};

Drupal.ajax.prototype.commands.viewsScrollTop = function (ajax, response, status) {
  // Scroll to the top of the view. This will allow users
  // to browse newly loaded content after e.g. clicking a pager
  // link.
  var offset = $(response.selector).offset();
  // We can't guarantee that the scrollable object should be
  // the body, as the view could be embedded in something
  // more complex such as a modal popup. Recurse up the DOM
  // and scroll the first element that has a non-zero top.
  var scrollTarget = response.selector;
  while ($(scrollTarget).scrollTop() == 0 && $(scrollTarget).parent()) {
    scrollTarget = $(scrollTarget).parent();
  }
  // Only scroll upward
  if (offset.top - 10 < $(scrollTarget).scrollTop()) {
    $(scrollTarget).animate({scrollTop: (offset.top - 10)}, 500);
  }
};

})(jQuery);
;
(function(a){Drupal.toggleFieldset=function(b){var c=a(b);if(c.is(".collapsed")){var d=a("> .fieldset-wrapper",b).hide();c.removeClass("collapsed").trigger({type:"collapsed",value:!1}).find("> legend span.fieldset-legend-prefix").html(Drupal.t("Hide")),d.slideDown({duration:"fast",easing:"linear",complete:function(){Drupal.collapseScrollIntoView(b),b.animating=!1},step:function(){Drupal.collapseScrollIntoView(b)}})}else c.trigger({type:"collapsed",value:!0}),a("> .fieldset-wrapper",b).slideUp("fast",function(){c.addClass("collapsed").find("> legend span.fieldset-legend-prefix").html(Drupal.t("Show")),b.animating=!1})},Drupal.collapseScrollIntoView=function(b){var c=document.documentElement.clientHeight||document.body.clientHeight||0,d=document.documentElement.scrollTop||document.body.scrollTop||0,e=a(b).offset().top,f=55;e+b.offsetHeight+f>c+d&&(b.offsetHeight>c?window.scrollTo(0,e):window.scrollTo(0,e+b.offsetHeight-c+f))},Drupal.behaviors.collapse={attach:function(b,c){a("fieldset.collapsible",b).once("collapse",function(){var b=a(this),c=location.hash&&location.hash!="#"?", "+location.hash:"";a(".error"+c,b).length&&b.removeClass("collapsed");var d=a('<span class="summary"></span>');b.bind("summaryUpdated",function(){var c=a.trim(b.drupalGetSummary());d.html(c?" ("+c+")":"")}).trigger("summaryUpdated");var e=a("> legend .fieldset-legend",this);a('<span class="fieldset-legend-prefix element-invisible"></span>').append(b.hasClass("collapsed")?Drupal.t("Show"):Drupal.t("Hide")).prependTo(e).after(" ");var f=a('<a class="fieldset-title" href="#"></a>').prepend(e.contents()).appendTo(e).click(function(){var a=b.get(0);return a.animating||(a.animating=!0,Drupal.toggleFieldset(a)),!1});e.append(d)})}}})(jQuery);;
(function ($) {
  Drupal.behaviors.vbo = {
    attach: function(context) {
      $('.vbo-views-form', context).each(function() {
        Drupal.vbo.initTableBehaviors(this);
        Drupal.vbo.initGenericBehaviors(this);
      });
    }
  }

  Drupal.vbo = Drupal.vbo || {};
  Drupal.vbo.initTableBehaviors = function(form) {
    // If the table is not grouped, "Select all on this page / all pages"
    // markup gets inserted below the table header.
    var selectAllMarkup = $('.vbo-table-select-all-markup', form);
    if (selectAllMarkup.length) {
      $('tbody', form).prepend('<tr class="views-table-row-select-all even">></tr>');
      var colspan = $('table th', form).length;
      $('.views-table-row-select-all', form).html('<td colspan="' + colspan + '">' + selectAllMarkup.html() + '</td>');

      $('.vbo-table-select-all-pages', form).click(function() {
        Drupal.vbo.tableSelectAllPages(form);
        return false;
      });
      $('.vbo-table-select-this-page', form).click(function() {
        Drupal.vbo.tableSelectThisPage(form);
        return false;
      });
    }

    $('.vbo-table-select-all', form).show();
    // This is the "select all" checkbox in (each) table header.
    $('.vbo-table-select-all', form).click(function() {
      var table = $(this).closest('table')[0];
      $('input[id^="edit-views-bulk-operations"]:not(:disabled)', table).attr('checked', this.checked);

      // Toggle the visibility of the "select all" row (if any).
      if (this.checked) {
        $('.views-table-row-select-all', table).show();
      }
      else {
        $('.views-table-row-select-all', table).hide();
        // Disable "select all across pages".
        Drupal.vbo.tableSelectThisPage(form);
      }
    });

    // Set up the ability to click anywhere on the row to select it.
    $('.views-table tbody tr', form).click(function(event) {
      if (event.target.tagName.toLowerCase() != 'input' && event.target.tagName.toLowerCase() != 'a') {
        $('input[id^="edit-views-bulk-operations"]:not(:disabled)', this).each(function() {
          var checked = this.checked;
          // trigger() toggles the checkmark *after* the event is set,
          // whereas manually clicking the checkbox toggles it *beforehand*.
          // that's why we manually set the checkmark first, then trigger the
          // event (so that listeners get notified), then re-set the checkmark
          // which the trigger will have toggled. yuck!
          this.checked = !checked;
          $(this).trigger('click');
          this.checked = !checked;
        });
      }
    });
  }

  Drupal.vbo.tableSelectAllPages = function(form) {
    $('.vbo-table-this-page', form).hide();
    $('.vbo-table-all-pages', form).show();
    // Modify the value of the hidden form field.
    $('.select-all-rows', form).val('1');
  }
  Drupal.vbo.tableSelectThisPage = function(form) {
    $('.vbo-table-all-pages', form).hide();
    $('.vbo-table-this-page', form).show();
    // Modify the value of the hidden form field.
    $('.select-all-rows', form).val('0');
  }

  Drupal.vbo.initGenericBehaviors = function(form) {
    // Show the "select all" fieldset.
    $('.vbo-select-all-markup', form).show();

    $('.vbo-select-this-page', form).click(function() {
      $('input[id^="edit-views-bulk-operations"]', form).attr('checked', this.checked);
      $('.vbo-select-all-pages', form).attr('checked', false);

      // Toggle the "select all" checkbox in grouped tables (if any).
      $('.vbo-table-select-all', form).attr('checked', this.checked);
    });
    $('.vbo-select-all-pages', form).click(function() {
      $('input[id^="edit-views-bulk-operations"]', form).attr('checked', this.checked);
      $('.vbo-select-this-page', form).attr('checked', false);

      // Toggle the "select all" checkbox in grouped tables (if any).
      $('.vbo-table-select-all', form).attr('checked', this.checked);

      // Modify the value of the hidden form field.
      $('.select-all-rows', form).val(this.checked);
    });

    $('.vbo-select', form).click(function() {
      // If a checkbox was deselected, uncheck any "select all" checkboxes.
      if (!this.checked) {
        $('.vbo-select-this-page', form).attr('checked', false);
        $('.vbo-select-all-pages', form).attr('checked', false);
        // Modify the value of the hidden form field.
        $('.select-all-rows', form).val('0')

        var table = $(this).closest('table')[0];
        if (table) {
          // Uncheck the "select all" checkbox in the table header.
          $('.vbo-table-select-all', table).attr('checked', false);

          // If there's a "select all" row, hide it.
          if ($('.vbo-table-select-this-page', table).length) {
            $('.views-table-row-select-all', table).hide();
            // Disable "select all across pages".
            Drupal.vbo.tableSelectThisPage(form);
          }
        }
      }
    });
  }

})(jQuery);
;
(function($){
Drupal.behaviors.contextReactionBlock = {attach: function(context) {
  $('form.context-editor:not(.context-block-processed)')
    .addClass('context-block-processed')
    .each(function() {
      var id = $(this).attr('id');
      Drupal.contextBlockEditor = Drupal.contextBlockEditor || {};
      $(this).bind('init.pageEditor', function(event) {
        Drupal.contextBlockEditor[id] = new DrupalContextBlockEditor($(this));
      });
      $(this).bind('start.pageEditor', function(event, context) {
        // Fallback to first context if param is empty.
        if (!context) {
          context = $(this).data('defaultContext');
        }
        Drupal.contextBlockEditor[id].editStart($(this), context);
      });
      $(this).bind('end.pageEditor', function(event) {
        Drupal.contextBlockEditor[id].editFinish();
      });
    });

  //
  // Admin Form =======================================================
  //
  // ContextBlockForm: Init.
  $('#context-blockform:not(.processed)').each(function() {
    $(this).addClass('processed');
    Drupal.contextBlockForm = new DrupalContextBlockForm($(this));
    Drupal.contextBlockForm.setState();
  });

  // ContextBlockForm: Attach block removal handlers.
  // Lives in behaviors as it may be required for attachment to new DOM elements.
  $('#context-blockform a.remove:not(.processed)').each(function() {
    $(this).addClass('processed');
    $(this).click(function() {
      $(this).parents('tr').eq(0).remove();
      Drupal.contextBlockForm.setState();
      return false;
    });
  });
}};

/**
 * Context block form. Default form for editing context block reactions.
 */
DrupalContextBlockForm = function(blockForm) {
  this.state = {};

  this.setState = function() {
    $('table.context-blockform-region', blockForm).each(function() {
      var region = $(this).attr('id').split('context-blockform-region-')[1];
      var blocks = [];
      $('tr', $(this)).each(function() {
        var bid = $(this).attr('id');
        var weight = $(this).find('select').val();
        blocks.push({'bid' : bid, 'weight' : weight});
      });
      Drupal.contextBlockForm.state[region] = blocks;
    });

    // Serialize here and set form element value.
    $('form input.context-blockform-state').val(JSON.stringify(this.state));

    // Hide enabled blocks from selector that are used
    $('table.context-blockform-region tr').each(function() {
      var bid = $(this).attr('id');
      $('div.context-blockform-selector input[value='+bid+']').parents('div.form-item').eq(0).hide();
    });
    // Show blocks in selector that are unused
    $('div.context-blockform-selector input').each(function() {
      var bid = $(this).val();
      if ($('table.context-blockform-region tr#'+bid).size() === 0) {
        $(this).parents('div.form-item').eq(0).show();
      }
    });
  };

  // make sure we update the state right before submits, this takes care of an
  // apparent race condition between saving the state and the weights getting set
  // by tabledrag
  $('#ctools-export-ui-edit-item-form').submit(function() { Drupal.contextBlockForm.setState(); });

  // Tabledrag
  // Add additional handlers to update our blocks.
  $.each(Drupal.settings.tableDrag, function(base) {
    var table = $('#' + base + ':not(.processed)', blockForm);
    if (table && table.is('.context-blockform-region')) {
      table.addClass('processed');
      table.bind('mouseup', function(event) {
        Drupal.contextBlockForm.setState();
        return;
      });
    }
  });

  // Add blocks to a region
  $('td.blocks a', blockForm).each(function() {
    $(this).click(function() {
      var region = $(this).attr('href').split('#')[1];
      var selected = $("div.context-blockform-selector input:checked");
      if (selected.size() > 0) {
        selected.each(function() {
          // create new block markup
          var block = document.createElement('tr');
          var text = $(this).parents('div.form-item').eq(0).hide().children('label').text();
          var select = '<div class="form-item form-type-select"><select class="tabledrag-hide form-select">';
          var i;
          for (i = -10; i < 10; ++i) {
            select += '<option>' + i + '</option>';
          }
          select += '</select></div>';
          $(block).attr('id', $(this).attr('value')).addClass('draggable');
          $(block).html("<td>"+ text + "</td><td>" + select + "</td><td><a href='' class='remove'>X</a></td>");

          // add block item to region
          var base = "context-blockform-region-"+ region;
          Drupal.tableDrag[base].makeDraggable(block);
          $('table#'+base).append(block);
          if ($.cookie('Drupal.tableDrag.showWeight') == 1) {
            $('table#'+base).find('.tabledrag-hide').css('display', '');
            $('table#'+base).find('.tabledrag-handle').css('display', 'none');
          }
          else {
            $('table#'+base).find('.tabledrag-hide').css('display', 'none');
            $('table#'+base).find('.tabledrag-handle').css('display', '');
          }
          Drupal.attachBehaviors($('table#'+base));

          Drupal.contextBlockForm.setState();
          $(this).removeAttr('checked');
        });
      }
      return false;
    });
  });
};

/**
 * Context block editor. AHAH editor for live block reaction editing.
 */
DrupalContextBlockEditor = function(editor) {
  this.editor = editor;
  this.state = {};
  this.blocks = {};
  this.regions = {};

  // Category selector handler.
  // Also set to "Choose a category" option as browsers can retain
  // form values from previous page load.
  $('select.context-block-browser-categories', editor).change(function() {
    var category = $(this).val();
    var params = {
      containment: 'document',
      revert: true,
      dropOnEmpty: true,
      placeholder: 'draggable-placeholder',
      forcePlaceholderSize: true,
      helper: 'clone',
      appendTo: 'body',
      connectWith: ($.ui.version === '1.6') ? ['.ui-sortable'] : '.ui-sortable'
    };
    $('div.category', editor).hide().sortable('destroy');
    $('div.category-'+category, editor).show().sortable(params);
  });
  $('select.context-block-browser-categories', editor).val(0).change();

  return this;
};

DrupalContextBlockEditor.prototype.initBlocks = function(blocks) {
  var self = this;
  this.blocks = blocks;
  blocks.each(function() {
    if($(this).hasClass('context-block-empty')) {
      $(this).removeClass('context-block-hidden');
    }
    $(this).addClass('draggable');
    $(this).prepend($('<a class="context-block-handle"></a>'));
    $(this).prepend($('<a class="context-block-remove"></a>').click(function() {
      $(this).parent ('.block').eq(0).fadeOut('medium', function() {
        $(this).remove();
        self.updateBlocks();
      });
      return false;
    }));
  });
};

DrupalContextBlockEditor.prototype.initRegions = function(regions) {
  this.regions = regions;
};

/**
  * Update UI to match the current block states.
  */
DrupalContextBlockEditor.prototype.updateBlocks = function() {
  var browser = $('div.context-block-browser');

  // For all enabled blocks, mark corresponding addables as having been added.
  $('.block, .admin-block').each(function() {
    var bid = $(this).attr('id').split('block-')[1]; // Ugh.
    $('#context-block-addable-'+bid, browser).draggable('disable').addClass('context-block-added').removeClass('context-block-addable');
  });
  // For all hidden addables with no corresponding blocks, mark as addable.
  $('.context-block-item', browser).each(function() {
    var bid = $(this).attr('id').split('context-block-addable-')[1];
    if ($('#block-'+bid).size() === 0) {
      $(this).draggable('enable').removeClass('context-block-added').addClass('context-block-addable');
    }
  });

  // Mark empty regions.
  $(this.regions).each(function() {
    if ($('.block:has(a.context-block)', this).size() > 0) {
      $(this).removeClass('context-block-region-empty');
    }
    else {
      $(this).addClass('context-block-region-empty');
    }
  });
};

/**
  * Live update a region.
  */
DrupalContextBlockEditor.prototype.updateRegion = function(event, ui, region, op) {
  switch (op) {
    case 'over':
      $(region).removeClass('context-block-region-empty');
      break;
    case 'out':
      if (
        // jQuery UI 1.8
        $('.draggable-placeholder', region).size() === 1 &&
        $('.block:has(a.context-block)', region).size() == 0
        // jQuery UI 1.6
        // $('div.draggable-placeholder', region).size() === 0 &&
        // $('div.block:has(a.context-block)', region).size() == 1 &&
        // $('div.block:has(a.context-block)', region).attr('id') == ui.item.attr('id')
      ) {
        $(region).addClass('context-block-region-empty');
      }
      break;
  }
};

/**
  * Remove script elements while dragging & dropping.
  */
DrupalContextBlockEditor.prototype.scriptFix = function(event, ui, editor, context) {
  if ($('script', ui.item)) {
    var placeholder = $(Drupal.settings.contextBlockEditor.scriptPlaceholder);
    var label = $('div.handle label', ui.item).text();
    placeholder.children('strong').html(label);
    $('script', ui.item).parent().empty().append(placeholder);
  }
};

/**
  * Add a block to a region through an AHAH load of the block contents.
  */
DrupalContextBlockEditor.prototype.addBlock = function(event, ui, editor, context) {
  var self = this;
  if (ui.item.is('.context-block-addable')) {
    var bid = ui.item.attr('id').split('context-block-addable-')[1];

    // Construct query params for our AJAX block request.
    var params = Drupal.settings.contextBlockEditor.params;
    params.context_block = bid + ',' + context;

    // Replace item with loading block.
    var blockLoading = $('<div class="context-block-item context-block-loading"><span class="icon"></span></div>');
    ui.item.addClass('context-block-added');
    ui.item.after(blockLoading);
    ui.sender.append(ui.item);

    $.getJSON(Drupal.settings.contextBlockEditor.path, params, function(data) {
      if (data.status) {
        var newBlock = $(data.block);
        if ($('script', newBlock)) {
          $('script', newBlock).remove();
        }
        blockLoading.fadeOut(function() {
          $(this).replaceWith(newBlock);
          self.initBlocks(newBlock);
          self.updateBlocks();
          Drupal.attachBehaviors();
        });
      }
      else {
        blockLoading.fadeOut(function() { $(this).remove(); });
      }
    });
  }
  else if (ui.item.is(':has(a.context-block)')) {
    self.updateBlocks();
  }
};

/**
  * Update form hidden field with JSON representation of current block visibility states.
  */
DrupalContextBlockEditor.prototype.setState = function() {
  var self = this;

  $(this.regions).each(function() {
    var region = $('a.context-block-region', this).attr('id').split('context-block-region-')[1];
    var blocks = [];
    $('a.context-block', $(this)).each(function() {
      if ($(this).attr('class').indexOf('edit-') != -1) {
        var bid = $(this).attr('id').split('context-block-')[1];
        var context = $(this).attr('class').split('edit-')[1].split(' ')[0];
        context = context ? context : 0;
        var block = {'bid': bid, 'context': context};
        blocks.push(block);
      }
    });
    self.state[region] = blocks;
  });

  // Serialize here and set form element value.
  $('input.context-block-editor-state', this.editor).val(JSON.stringify(this.state));
};

/**
  * Disable text selection.
  */
DrupalContextBlockEditor.prototype.disableTextSelect = function() {
  if ($.browser.safari) {
    $('.block:has(a.context-block):not(:has(input,textarea))').css('WebkitUserSelect','none');
  }
  else if ($.browser.mozilla) {
    $('.block:has(a.context-block):not(:has(input,textarea))').css('MozUserSelect','none');
  }
  else if ($.browser.msie) {
    $('.block:has(a.context-block):not(:has(input,textarea))').bind('selectstart.contextBlockEditor', function() { return false; });
  }
  else {
    $(this).bind('mousedown.contextBlockEditor', function() { return false; });
  }
};

/**
  * Enable text selection.
  */
DrupalContextBlockEditor.prototype.enableTextSelect = function() {
  if ($.browser.safari) {
    $('*').css('WebkitUserSelect','');
  }
  else if ($.browser.mozilla) {
    $('*').css('MozUserSelect','');
  }
  else if ($.browser.msie) {
    $('*').unbind('selectstart.contextBlockEditor');
  }
  else {
    $(this).unbind('mousedown.contextBlockEditor');
  }
};

/**
  * Start editing. Attach handlers, begin draggable/sortables.
  */
DrupalContextBlockEditor.prototype.editStart = function(editor, context) {
  var self = this;

  // This is redundant to the start handler found in context_ui.js.
  // However it's necessary that we trigger this class addition before
  // we call .sortable() as the empty regions need to be visible.
  $(document.body).addClass('context-editing');
  this.editor.addClass('context-editing');

  this.disableTextSelect();
  this.initBlocks($('.block:has(a.context-block.edit-'+context+')'));
  this.initRegions($('a.context-block-region').parent());
  this.updateBlocks();

  // First pass, enable sortables on all regions.
  $(this.regions).each(function() {
    var region = $(this);
    var params = {
      containment: 'document',
      revert: true,
      dropOnEmpty: true,
      placeholder: 'draggable-placeholder',
      forcePlaceholderSize: true,
      items: '> .block:has(a.context-block.editable)',
      handle: 'a.context-block-handle',
      start: function(event, ui) { self.scriptFix(event, ui, editor, context); },
      stop: function(event, ui) { self.addBlock(event, ui, editor, context); },
      receive: function(event, ui) { self.addBlock(event, ui, editor, context); },
      over: function(event, ui) { self.updateRegion(event, ui, region, 'over'); },
      out: function(event, ui) { self.updateRegion(event, ui, region, 'out'); }
    };
    region.sortable(params);
  });

  // Second pass, hook up all regions via connectWith to each other.
  $(this.regions).each(function() {
    $(this).sortable('option', 'connectWith', ['.ui-sortable']);
  });

  // Terrible, terrible workaround for parentoffset issue in Safari.
  // The proper fix for this issue has been committed to jQuery UI, but was
  // not included in the 1.6 release. Therefore, we do a browser agent hack
  // to ensure that Safari users are covered by the offset fix found here:
  // http://dev.jqueryui.com/changeset/2073.
  if ($.ui.version === '1.6' && $.browser.safari) {
    $.browser.mozilla = true;
  }
};

/**
  * Finish editing. Remove handlers.
  */
DrupalContextBlockEditor.prototype.editFinish = function() {
  this.editor.removeClass('context-editing');
  this.enableTextSelect();

  // Remove UI elements.
  $(this.blocks).each(function() {
    $('a.context-block-handle, a.context-block-remove', this).remove();
    if($(this).hasClass('context-block-empty')) {
      $(this).addClass('context-block-hidden');
    }
    $(this).removeClass('draggable');
  });
  this.regions.sortable('destroy');

  this.setState();

  // Unhack the user agent.
  if ($.ui.version === '1.6' && $.browser.safari) {
    $.browser.mozilla = false;
  }
};

})(jQuery);
;
