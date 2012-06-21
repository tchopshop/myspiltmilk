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
 * @file ajax_admin.js
 *
 * Handles AJAX submission and response in Views UI.
 */
(function ($) {

  Drupal.ajax.prototype.commands.viewsSetForm = function (ajax, response, status) {
    var ajax_title = Drupal.settings.views.ajax.title;
    var ajax_body = Drupal.settings.views.ajax.id;
    var ajax_popup = Drupal.settings.views.ajax.popup;
    $(ajax_title).html(response.title);
    $(ajax_body).html(response.output);
    $(ajax_popup).dialog('open');
    Drupal.attachBehaviors($(ajax_popup), ajax.settings);
    if (response.url) {
      // Identify the button that was clicked so that .ajaxSubmit() can use it.
      // We need to do this for both .click() and .mousedown() since JavaScript
      // code might trigger either behavior.
      var $submit_buttons = $('input[type=submit], button', ajax_body);
      $submit_buttons.click(function(event) {
        this.form.clk = this;
      });
      $submit_buttons.mousedown(function(event) {
        this.form.clk = this;
      });

      $('form', ajax_body).once('views-ajax-submit-processed').each(function() {
        var element_settings = { 'url': response.url, 'event': 'submit', 'progress': { 'type': 'throbber' } };
        var $form = $(this);
        var id = $form.attr('id');
        Drupal.ajax[id] = new Drupal.ajax(id, this, element_settings);
        Drupal.ajax[id].form = $form;
      });
    }
    Drupal.viewsUi.resizeModal();
  };

  Drupal.ajax.prototype.commands.viewsDismissForm = function (ajax, response, status) {
    Drupal.ajax.prototype.commands.viewsSetForm({}, {'title': '', 'output': Drupal.settings.views.ajax.defaultForm});
    $(Drupal.settings.views.ajax.popup).dialog('close');
  }

  Drupal.ajax.prototype.commands.viewsHilite = function (ajax, response, status) {
    $('.hilited').removeClass('hilited');
    $(response.selector).addClass('hilited');
  };

  Drupal.ajax.prototype.commands.viewsAddTab = function (ajax, response, status) {
    var id = '#views-tab-' + response.id;
    $('#views-tabset').viewsAddTab(id, response.title, 0);
    $(id).html(response.body).addClass('views-tab');

    // Update the preview widget to preview the new tab.
    var display_id = id.replace('#views-tab-', '');
    $("#preview-display-id").append('<option selected="selected" value="' + display_id + '">' + response.title + '</option>');

    Drupal.attachBehaviors(id);
    var instance = $.viewsUi.tabs.instances[$('#views-tabset').get(0).UI_TABS_UUID];
    $('#views-tabset').viewsClickTab(instance.$tabs.length);
  };

  Drupal.ajax.prototype.commands.viewsShowButtons = function (ajax, response, status) {
    $('div.views-edit-view div.form-actions').removeClass('js-hide');
    $('div.views-edit-view div.view-changed.messages').removeClass('js-hide');
  };

  Drupal.ajax.prototype.commands.viewsTriggerPreview = function (ajax, response, status) {
    if ($('input#edit-displays-live-preview').is(':checked')) {
      $('#preview-submit').trigger('click');
    }
  };

  Drupal.ajax.prototype.commands.viewsReplaceTitle = function (ajax, response, status) {
    // In case we're in the overlay, get a reference to the underlying window.
    var doc = parent.document;
    // For the <title> element, make a best-effort attempt to replace the page
    // title and leave the site name alone. If the theme doesn't use the site
    // name in the <title> element, this will fail.
    var oldTitle = doc.title;
    // Escape the site name, in case it has special characters in it, so we can
    // use it in our regex.
    var escapedSiteName = response.siteName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    var re = new RegExp('.+ (.) ' + escapedSiteName);
    doc.title = oldTitle.replace(re, response.title + ' $1 ' + response.siteName);

    $('h1.page-title').text(response.title);
    $('h1#overlay-title').text(response.title);
  };

  /**
   * Get rid of irritating tabledrag messages
   */
  Drupal.theme.tableDragChangedWarning = function () {
    return [];
  }

  /**
   * Trigger preview when the "live preview" checkbox is checked.
   */
  Drupal.behaviors.livePreview = {
    attach: function (context) {
      $('input#edit-displays-live-preview', context).once('views-ajax-processed').click(function() {
        if ($(this).is(':checked')) {
          $('#preview-submit').click();
        }
      });
    }
  }

  /**
   * Sync preview display.
   */
  Drupal.behaviors.syncPreviewDisplay = {
    attach: function (context) {
      $("#views-tabset a").once('views-ajax-processed').click(function() {
        var href = $(this).attr('href');
        // Cut of #views-tabset.
        var display_id = href.substr(11);
        // Set the form element.
        $("#views-live-preview #preview-display-id").val(display_id);
      }).addClass('views-ajax-processed');
    }
  }

  Drupal.behaviors.viewsAjax = {
    collapseReplaced: false,
    attach: function (context, settings) {
      if (!settings.views) {
        return;
      }
      // Create a jQuery UI dialog, but leave it closed.
      var dialog_area = $(settings.views.ajax.popup, context);
      dialog_area.dialog({
        'autoOpen': false,
        'dialogClass': 'views-ui-dialog',
        'modal': true,
        'position': 'center',
        'resizable': false,
        'width': 750
      });

      var base_element_settings = {
        'event': 'click',
        'progress': { 'type': 'throbber' }
      };
      // Bind AJAX behaviors to all items showing the class.
      $('a.views-ajax-link', context).once('views-ajax-processed').each(function () {
        var element_settings = base_element_settings;
        // Set the URL to go to the anchor.
        if ($(this).attr('href')) {
          element_settings.url = $(this).attr('href');
        }
        var base = $(this).attr('id');
        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
      });

      $('div#views-live-preview a')
        .once('views-ajax-processed').each(function () {
        // We don't bind to links without a URL.
        if (!$(this).attr('href')) {
          return true;
        }

        var element_settings = base_element_settings;
        // Set the URL to go to the anchor.
        element_settings.url = $(this).attr('href');
        if (Drupal.Views.getPath(element_settings.url).substring(0, 21) != 'admin/structure/views') {
          return true;
        }

        element_settings.wrapper = 'views-live-preview';
        element_settings.method = 'html';
        var base = $(this).attr('id');
        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
      });

      // Within a live preview, make exposed widget form buttons re-trigger the
      // Preview button.
      // @todo Revisit this after fixing Views UI to display a Preview outside
      //   of the main Edit form.
      $('div#views-live-preview input[type=submit]')
        .once('views-ajax-processed').each(function(event) {
        $(this).click(function () {
          this.form.clk = this;
          return true;
        });
        var element_settings = base_element_settings;
        // Set the URL to go to the anchor.
        element_settings.url = $(this.form).attr('action');
        if (Drupal.Views.getPath(element_settings.url).substring(0, 21) != 'admin/structure/views') {
          return true;
        }

        element_settings.wrapper = 'views-live-preview';
        element_settings.method = 'html';
        element_settings.event = 'click';

        var base = $(this).attr('id');
        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
      });

      if (!this.collapseReplaced && Drupal.collapseScrollIntoView) {
        this.collapseReplaced = true;
        Drupal.collapseScrollIntoView = function (node) {
          for (var $parent = $(node); $parent.get(0) != document && $parent.size() != 0; $parent = $parent.parent()) {
            if ($parent.css('overflow') == 'scroll' || $parent.css('overflow') == 'auto') {
              if (Drupal.viewsUi.resizeModal) {
                // If the modal is already at the max height, don't bother with
                // this since the only reason to do it is to grow the modal.
                if ($('.views-ui-dialog').height() < parseInt($(window).height() * .8)) {
                  Drupal.viewsUi.resizeModal('', true);
                }
              }
              return;
            }
          }

          var h = document.documentElement.clientHeight || document.body.clientHeight || 0;
          var offset = document.documentElement.scrollTop || document.body.scrollTop || 0;
          var posY = $(node).offset().top;
          var fudge = 55;
          if (posY + node.offsetHeight + fudge > h + offset) {
            if (node.offsetHeight > h) {
              window.scrollTo(0, posY);
            }
            else {
              window.scrollTo(0, posY + node.offsetHeight - h + fudge);
            }
          }
        };
      }
    }
  };

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
// $Id$
/**
 * @file
 * Implement a simple, clickable dropbutton menu.
 *
 * See dropbutton.theme.inc for primary documentation.
 *
 * The javascript relies on four classes:
 * - The dropbutton must be fully contained in a div with the class
 *   ctools-dropbutton. It must also contain the class ctools-no-js
 *   which will be immediately removed by the javascript; this allows for
 *   graceful degradation.
 * - The trigger that opens the dropbutton must be an a tag wit hthe class
 *   ctools-dropbutton-link. The href should just be '#' as this will never
 *   be allowed to complete.
 * - The part of the dropbutton that will appear when the link is clicked must
 *   be a div with class ctools-dropbutton-container.
 * - Finally, ctools-dropbutton-hover will be placed on any link that is being
 *   hovered over, so that the browser can restyle the links.
 *
 * This tool isn't meant to replace click-tips or anything, it is specifically
 * meant to work well presenting menus.
 */

(function ($) {
  Drupal.behaviors.CToolsDropbutton = {
    attach: function() {
      // Process buttons. All dropbuttons are buttons.
      $('.ctools-button')
        .once('ctools-button')
        .removeClass('ctools-no-js');

      // Process dropbuttons. Not all buttons are dropbuttons.
      $('.ctools-dropbutton').once('ctools-dropbutton', function() {
        var $dropbutton = $(this);
        var $button = $('.ctools-content', $dropbutton);
        var $secondaryActions = $('li', $button).not(':first');
        var $twisty = $(".ctools-link", $dropbutton);
        var open = false;
        var hovering = false;
        var timerID = 0;

        var toggle = function(close) {
          // if it's open or we're told to close it, close it.
          if (open || close) {
            // If we're just toggling it, close it immediately.
            if (!close) {
              open = false;
              $secondaryActions.slideUp(100);
              $dropbutton.removeClass('open');
            }
            else {
              // If we were told to close it, wait half a second to make
              // sure that's what the user wanted.
              // Clear any previous timer we were using.
              if (timerID) {
                clearTimeout(timerID);
              }
              timerID = setTimeout(function() {
                if (!hovering) {
                  open = false;
                  $secondaryActions.slideUp(100);
                  $dropbutton.removeClass('open');
                }}, 500);
            }
          }
          else {
            // open it.
            open = true;
            $secondaryActions.animate({height: "show", opacity: "show"}, 100);
            $dropbutton.addClass('open');
          }
        }
        // Hide the secondary actions initially.
        $secondaryActions.hide();

        $twisty.click(function() {
            toggle();
            return false;
          });

        $dropbutton.hover(
          function() {
            hovering = true;
          }, // hover in
          function() { // hover out
            hovering = false;
            toggle(true);
            return false;
          }
        );
      });
    }
  }
})(jQuery);
;
/**
 * @file
 * Provides dependent visibility for form items in CTools' ajax forms.
 *
 * To your $form item definition add:
 * - '#process' => array('ctools_process_dependency'),
 * - '#dependency' => array('id-of-form-item' => array(list, of, values, that,
 *   make, this, item, show),
 *
 * Special considerations:
 * - Radios are harder. Because Drupal doesn't give radio groups individual IDs,
 *   use 'radio:name-of-radio'.
 *
 * - Checkboxes don't have their own id, so you need to add one in a div
 *   around the checkboxes via #prefix and #suffix. You actually need to add TWO
 *   divs because it's the parent that gets hidden. Also be sure to retain the
 *   'expand_checkboxes' in the #process array, because the CTools process will
 *   override it.
 */

(function ($) {
  Drupal.CTools = Drupal.CTools || {};
  Drupal.CTools.dependent = {};

  Drupal.CTools.dependent.bindings = {};
  Drupal.CTools.dependent.activeBindings = {};
  Drupal.CTools.dependent.activeTriggers = [];

  Drupal.CTools.dependent.inArray = function(array, search_term) {
    var i = array.length;
    while (i--) {
      if (array[i] == search_term) {
         return true;
      }
    }
    return false;
  }


  Drupal.CTools.dependent.autoAttach = function() {
    // Clear active bindings and triggers.
    for (i in Drupal.CTools.dependent.activeTriggers) {
      $(Drupal.CTools.dependent.activeTriggers[i]).unbind('change');
    }
    Drupal.CTools.dependent.activeTriggers = [];
    Drupal.CTools.dependent.activeBindings = {};
    Drupal.CTools.dependent.bindings = {};

    if (!Drupal.settings.CTools) {
      return;
    }

    // Iterate through all relationships
    for (id in Drupal.settings.CTools.dependent) {
      // Test to make sure the id even exists; this helps clean up multiple
      // AJAX calls with multiple forms.

      // Drupal.CTools.dependent.activeBindings[id] is a boolean,
      // whether the binding is active or not.  Defaults to no.
      Drupal.CTools.dependent.activeBindings[id] = 0;
      // Iterate through all possible values
      for(bind_id in Drupal.settings.CTools.dependent[id].values) {
        // This creates a backward relationship.  The bind_id is the ID
        // of the element which needs to change in order for the id to hide or become shown.
        // The id is the ID of the item which will be conditionally hidden or shown.
        // Here we're setting the bindings for the bind
        // id to be an empty array if it doesn't already have bindings to it
        if (!Drupal.CTools.dependent.bindings[bind_id]) {
          Drupal.CTools.dependent.bindings[bind_id] = [];
        }
        // Add this ID
        Drupal.CTools.dependent.bindings[bind_id].push(id);
        // Big long if statement.
        // Drupal.settings.CTools.dependent[id].values[bind_id] holds the possible values

        if (bind_id.substring(0, 6) == 'radio:') {
          var trigger_id = "input[name='" + bind_id.substring(6) + "']";
        }
        else {
          var trigger_id = '#' + bind_id;
        }

        Drupal.CTools.dependent.activeTriggers.push(trigger_id);

        if ($(trigger_id).attr('type') == 'checkbox') {
          $(trigger_id).siblings('label').addClass('hidden-options');
        }

        var getValue = function(item, trigger) {
          if ($(trigger).size() == 0) {
            return null;
          }

          if (item.substring(0, 6) == 'radio:') {
            var val = $(trigger + ':checked').val();
          }
          else {
            switch ($(trigger).attr('type')) {
              case 'checkbox':
                var val = $(trigger).attr('checked') || 0;

                if (val) {
                  $(trigger).siblings('label').removeClass('hidden-options').addClass('expanded-options');
                }
                else {
                  $(trigger).siblings('label').removeClass('expanded-options').addClass('hidden-options');
                }

                break;
              default:
                var val = $(trigger).val();
            }
          }
          return val;
        }

        var setChangeTrigger = function(trigger_id, bind_id) {
          // Triggered when change() is clicked.
          var changeTrigger = function() {
            var val = getValue(bind_id, trigger_id);

            if (val == null) {
              return;
            }

            for (i in Drupal.CTools.dependent.bindings[bind_id]) {
              var id = Drupal.CTools.dependent.bindings[bind_id][i];
              // Fix numerous errors
              if (typeof id != 'string') {
                continue;
              }

              // This bit had to be rewritten a bit because two properties on the
              // same set caused the counter to go up and up and up.
              if (!Drupal.CTools.dependent.activeBindings[id]) {
                Drupal.CTools.dependent.activeBindings[id] = {};
              }

              if (val != null && Drupal.CTools.dependent.inArray(Drupal.settings.CTools.dependent[id].values[bind_id], val)) {
                Drupal.CTools.dependent.activeBindings[id][bind_id] = 'bind';
              }
              else {
                delete Drupal.CTools.dependent.activeBindings[id][bind_id];
              }

              var len = 0;
              for (i in Drupal.CTools.dependent.activeBindings[id]) {
                len++;
              }

              var object = $('#' + id + '-wrapper');
              if (!object.size()) {
                // Some elements can't use the parent() method or they can
                // damage things. They are guaranteed to have wrappers but
                // only if dependent.inc provided them. This check prevents
                // problems when multiple AJAX calls cause settings to build
                // up.
                var $original = $('#' + id);
                if ($original.is('fieldset') || $original.is('textarea')) {
                  continue;
                }

                object = $('#' + id).parent();
              }

              if (Drupal.settings.CTools.dependent[id].type == 'disable') {
                if (Drupal.settings.CTools.dependent[id].num <= len) {
                  // Show if the element if criteria is matched
                  object.attr('disabled', false);
                  object.addClass('dependent-options');
                  object.children().attr('disabled', false);
                }
                else {
                  // Otherwise hide. Use css rather than hide() because hide()
                  // does not work if the item is already hidden, for example,
                  // in a collapsed fieldset.
                  object.attr('disabled', true);
                  object.children().attr('disabled', true);
                }
              }
              else {
                if (Drupal.settings.CTools.dependent[id].num <= len) {
                  // Show if the element if criteria is matched
                  object.show(0);
                  object.addClass('dependent-options');
                }
                else {
                  // Otherwise hide. Use css rather than hide() because hide()
                  // does not work if the item is already hidden, for example,
                  // in a collapsed fieldset.
                  object.css('display', 'none');
                }
              }
            }
          }

          $(trigger_id).change(function() {
            // Trigger the internal change function
            // the attr('id') is used because closures are more confusing
            changeTrigger(trigger_id, bind_id);
          });
          // Trigger initial reaction
          changeTrigger(trigger_id, bind_id);
        }
        setChangeTrigger(trigger_id, bind_id);
      }
    }
  }

  Drupal.behaviors.CToolsDependent = {
    attach: function (context) {
      Drupal.CTools.dependent.autoAttach();

      // Really large sets of fields are too slow with the above method, so this
      // is a sort of hacked one that's faster but much less flexible.
      $("select.ctools-master-dependent")
        .once('ctools-dependent')
        .change(function() {
          var val = $(this).val();
          if (val == 'all') {
            $('.ctools-dependent-all').show(0);
          }
          else {
            $('.ctools-dependent-all').hide(0);
            $('.ctools-dependent-' + val).show(0);
          }
        })
        .trigger('change');
    }
  }
})(jQuery);
;
/**
 * @file
 * Javascript required for a simple collapsible div.
 *
 * Creating a collapsible div with this doesn't take too much. There are
 * three classes necessary:
 *
 * - ctools-collapsible-container: This is the overall container that will be
 *   collapsible. This must be a div.
 * - ctools-collapsible-handle: This is the title area, and is what will be
 *   visible when it is collapsed. This can be any block element, such as div
 *   or h2.
 * - ctools-collapsible-content: This is the ocntent area and will only be
 *   visible when expanded. This must be a div.
 *
 * Adding 'ctools-collapsible-remember' to the container class will cause the
 * state of the container to be stored in a cookie, and remembered from page
 * load to page load. This will only work if the container has a unique ID, so
 * very carefully add IDs to your containers.
 *
 * If the class 'ctools-no-container' is placed on the container, the container
 * will be the handle. The content will be found by appending '-content' to the
 * id of the handle. The ctools-collapsible-handle and
 * ctools-collapsible-content classes will not be required in that case, and no
 * restrictions on what of data the container is are placed. Like
 * ctools-collapsible-remember this requires an id to eist.
 *
 * The content will be 'open' unless the container class has 'ctools-collapsed'
 * as a class, which will cause the container to draw collapsed.
 */

(function ($) {
  // All CTools tools begin with this if they need to use the CTools namespace.
  if (!Drupal.CTools) {
    Drupal.CTools = {};
  }

  /**
   * Object to store state.
   *
   * This object will remember the state of collapsible containers. The first
   * time a state is requested, it will check the cookie and set up the variable.
   * If a state has been changed, when the window is unloaded the state will be
   * saved.
   */
  Drupal.CTools.Collapsible = {
    state: {},
    stateLoaded: false,
    stateChanged: false,
    cookieString: 'ctools-collapsible-state=',

    /**
     * Get the current collapsed state of a container.
     *
     * If set to 1, the container is open. If set to -1, the container is
     * collapsed. If unset the state is unknown, and the default state should
     * be used.
     */
    getState: function (id) {
      if (!this.stateLoaded) {
        this.loadCookie();
      }

      return this.state[id];
    },

    /**
     * Set the collapsed state of a container for subsequent page loads.
     *
     * Set the state to 1 for open, -1 for collapsed.
     */
    setState: function (id, state) {
      if (!this.stateLoaded) {
        this.loadCookie();
      }

      this.state[id] = state;

      if (!this.stateChanged) {
        this.stateChanged = true;
        $(window).unload(this.unload);
      }
    },

    /**
     * Check the cookie and load the state variable.
     */
    loadCookie: function () {
      // If there is a previous instance of this cookie
      if (document.cookie.length > 0) {
        // Get the number of characters that have the list of values
        // from our string index.
        offset = document.cookie.indexOf(this.cookieString);

        // If its positive, there is a list!
        if (offset != -1) {
          offset += this.cookieString.length;
          var end = document.cookie.indexOf(';', offset);
          if (end == -1) {
            end = document.cookie.length;
          }

          // Get a list of all values that are saved on our string
          var cookie = unescape(document.cookie.substring(offset, end));

          if (cookie != '') {
            var cookieList = cookie.split(',');
            for (var i = 0; i < cookieList.length; i++) {
              var info = cookieList[i].split(':');
              this.state[info[0]] = info[1];
            }
          }
        }
      }

      this.stateLoaded = true;
    },

    /**
     * Turn the state variable into a string and store it in the cookie.
     */
    storeCookie: function () {
      var cookie = '';

      // Get a list of IDs, saparated by comma
      for (i in this.state) {
        if (cookie != '') {
          cookie += ',';
        }
        cookie += i + ':' + this.state[i];
      }

      // Save this values on the cookie
      document.cookie = this.cookieString + escape(cookie) + ';path=/';
    },

    /**
     * Respond to the unload event by storing the current state.
     */
    unload: function() {
      Drupal.CTools.Collapsible.storeCookie();
    }
  };

  // Set up an array for callbacks.
  Drupal.CTools.CollapsibleCallbacks = [];
  Drupal.CTools.CollapsibleCallbacksAfterToggle = [];

  /**
   * Bind collapsible behavior to a given container.
   */
  Drupal.CTools.bindCollapsible = function () {
    var $container = $(this);

    // Allow the specification of the 'no container' class, which means the
    // handle and the container can be completely independent.
    if ($container.hasClass('ctools-no-container') && $container.attr('id')) {
      // In this case, the container *is* the handle and the content is found
      // by adding '-content' to the id. Obviously, an id is required.
      var handle = $container;
      var content = $('#' + $container.attr('id') + '-content');
    }
    else {
      var handle = $container.children('.ctools-collapsible-handle');
      var content = $container.children('div.ctools-collapsible-content');
    }

    if (content.length) {
      // Create the toggle item and place it in front of the toggle.
      var toggle = $('<span class="ctools-toggle"></span>');
      handle.before(toggle);

      // If the remember class is set, check to see if we have a remembered
      // state stored.
      if ($container.hasClass('ctools-collapsible-remember') && $container.attr('id')) {
        var state = Drupal.CTools.Collapsible.getState($container.attr('id'));
        if (state == 1) {
          $container.removeClass('ctools-collapsed');
        }
        else if (state == -1) {
          $container.addClass('ctools-collapsed');
        }
      }

      // If we should start collapsed, do so:
      if ($container.hasClass('ctools-collapsed')) {
        toggle.toggleClass('ctools-toggle-collapsed');
        content.hide();
      }

      var afterToggle = function () {
        if (Drupal.CTools.CollapsibleCallbacksAfterToggle) {
          for (i in Drupal.CTools.CollapsibleCallbacksAfterToggle) {
            Drupal.CTools.CollapsibleCallbacksAfterToggle[i]($container, handle, content, toggle);
          }
        }
      }

      var clickMe = function () {
        if (Drupal.CTools.CollapsibleCallbacks) {
          for (i in Drupal.CTools.CollapsibleCallbacks) {
            Drupal.CTools.CollapsibleCallbacks[i]($container, handle, content, toggle);
          }
        }

        // If the container is a table element slideToggle does not do what
        // we want, so use toggle() instead.
        if ($container.is('table')) {
          content.toggle(0, afterToggle);
        }
        else {
          content.slideToggle(100, afterToggle);
        }

        toggle.toggleClass('ctools-toggle-collapsed');

        // If we're supposed to remember the state of this class, do so.
        if ($container.hasClass('ctools-collapsible-remember') && $container.attr('id')) {
          var state = toggle.hasClass('ctools-toggle-collapsed') ? -1 : 1;
          Drupal.CTools.Collapsible.setState($container.attr('id'), state);
        }

        return false;
      }

      // Let both the toggle and the handle be clickable.
      toggle.click(clickMe);
      handle.click(clickMe);
    }
  };

  /**
   * Support Drupal's 'behaviors' system for binding.
   */
  Drupal.behaviors.CToolsCollapsible = {
    attach: function(context) {
      $('.ctools-collapsible-container', context).once('ctools-collapsible', Drupal.CTools.bindCollapsible);
    }
  }
})(jQuery);
;
(function(a){Drupal.behaviors.tableDrag={attach:function(b,c){for(var d in c.tableDrag)a("#"+d,b).once("tabledrag",function(){Drupal.tableDrag[d]=new Drupal.tableDrag(this,c.tableDrag[d])})}},Drupal.tableDrag=function(b,c){var d=this;this.table=b,this.tableSettings=c,this.dragObject=null,this.rowObject=null,this.oldRowElement=null,this.oldY=0,this.changed=!1,this.maxDepth=0,this.rtl=a(this.table).css("direction")=="rtl"?-1:1,this.scrollSettings={amount:4,interval:50,trigger:70},this.scrollInterval=null,this.scrollY=0,this.windowHeight=0,this.indentEnabled=!1;for(var e in c)for(var f in c[e])c[e][f].relationship=="parent"&&(this.indentEnabled=!0),c[e][f].limit>0&&(this.maxDepth=c[e][f].limit);if(this.indentEnabled){this.indentCount=1;var g=Drupal.theme("tableDragIndentation"),h=a("<tr/>").addClass("draggable").appendTo(b),i=a("<td/>").appendTo(h).prepend(g).prepend(g);this.indentAmount=a(".indentation",i).get(1).offsetLeft-a(".indentation",i).get(0).offsetLeft,h.remove()}a("> tr.draggable, > tbody > tr.draggable",b).each(function(){d.makeDraggable(this)}),a(b).before(a('<a href="#" class="tabledrag-toggle-weight"></a>').attr("title",Drupal.t("Re-order rows by numerical weight instead of dragging.")).click(function(){return a.cookie("Drupal.tableDrag.showWeight")==1?d.hideColumns():d.showColumns(),!1}).wrap('<div class="tabledrag-toggle-weight-wrapper"></div>').parent()),d.initColumns(),a(document).bind("mousemove",function(a){return d.dragRow(a,d)}),a(document).bind("mouseup",function(a){return d.dropRow(a,d)})},Drupal.tableDrag.prototype.initColumns=function(){for(var b in this.tableSettings){for(var c in this.tableSettings[b]){var d=a("."+this.tableSettings[b][c].target+":first",this.table);if(d.length&&this.tableSettings[b][c].hidden){var e=this.tableSettings[b][c].hidden,f=d.closest("td");break}}if(e&&f[0]){var g=a("> td",f.parent()).index(f.get(0))+1;a("> thead > tr, > tbody > tr, > tr",this.table).each(function(){var b=g,c=a(this).children();c.each(function(a){a<b&&this.colSpan&&this.colSpan>1&&(b-=this.colSpan-1)}),b>0&&(f=c.filter(":nth-child("+b+")"),f[0].colSpan&&f[0].colSpan>1?f.addClass("tabledrag-has-colspan"):f.addClass("tabledrag-hide"))})}}a.cookie("Drupal.tableDrag.showWeight")===null?(a.cookie("Drupal.tableDrag.showWeight",0,{path:Drupal.settings.basePath,expires:365}),this.hideColumns()):a.cookie("Drupal.tableDrag.showWeight")==1?this.showColumns():this.hideColumns()},Drupal.tableDrag.prototype.hideColumns=function(){a(".tabledrag-hide","table.tabledrag-processed").css("display","none"),a(".tabledrag-handle","table.tabledrag-processed").css("display",""),a(".tabledrag-has-colspan","table.tabledrag-processed").each(function(){this.colSpan=this.colSpan-1}),a(".tabledrag-toggle-weight").text(Drupal.t("Show row weights")),a.cookie("Drupal.tableDrag.showWeight",0,{path:Drupal.settings.basePath,expires:365}),a("table.tabledrag-processed").trigger("columnschange","hide")},Drupal.tableDrag.prototype.showColumns=function(){a(".tabledrag-hide","table.tabledrag-processed").css("display",""),a(".tabledrag-handle","table.tabledrag-processed").css("display","none"),a(".tabledrag-has-colspan","table.tabledrag-processed").each(function(){this.colSpan=this.colSpan+1}),a(".tabledrag-toggle-weight").text(Drupal.t("Hide row weights")),a.cookie("Drupal.tableDrag.showWeight",1,{path:Drupal.settings.basePath,expires:365}),a("table.tabledrag-processed").trigger("columnschange","show")},Drupal.tableDrag.prototype.rowSettings=function(b,c){var d=a("."+b,c);for(var e in this.tableSettings[b]){var f=this.tableSettings[b][e].target;if(d.is("."+f)){var g={};for(var h in this.tableSettings[b][e])g[h]=this.tableSettings[b][e][h];return g}}},Drupal.tableDrag.prototype.makeDraggable=function(b){var c=this,d=a('<a href="#" class="tabledrag-handle"><div class="handle">&nbsp;</div></a>').attr("title",Drupal.t("Drag to re-order"));a("td:first .indentation:last",b).length?(a("td:first .indentation:last",b).after(d),c.indentCount=Math.max(a(".indentation",b).length,c.indentCount)):a("td:first",b).prepend(d),d.hover(function(){c.dragObject==null?a(this).addClass("tabledrag-handle-hover"):null},function(){c.dragObject==null?a(this).removeClass("tabledrag-handle-hover"):null}),d.mousedown(function(d){return c.dragObject={},c.dragObject.initMouseOffset=c.getMouseOffset(b,d),c.dragObject.initMouseCoords=c.mouseCoords(d),c.indentEnabled&&(c.dragObject.indentMousePos=c.dragObject.initMouseCoords),c.rowObject&&a("a.tabledrag-handle",c.rowObject.element).blur(),c.rowObject=new c.row(b,"mouse",c.indentEnabled,c.maxDepth,!0),c.table.topY=a(c.table).offset().top,c.table.bottomY=c.table.topY+c.table.offsetHeight,a(this).addClass("tabledrag-handle-hover"),a(b).addClass("drag"),a("body").addClass("drag"),c.oldRowElement&&a(c.oldRowElement).removeClass("drag-previous"),navigator.userAgent.indexOf("MSIE 6.")!=-1&&a("select",this.table).css("display","none"),c.safeBlur=!1,c.onDrag(),!1}),d.click(function(){return!1}),d.focus(function(){a(this).addClass("tabledrag-handle-hover"),c.safeBlur=!0}),d.blur(function(b){a(this).removeClass("tabledrag-handle-hover"),c.rowObject&&c.safeBlur&&c.dropRow(b,c)}),d.keydown(function(e){e.keyCode!=9&&!c.rowObject&&(c.rowObject=new c.row(b,"keyboard",c.indentEnabled,c.maxDepth,!0));var f=!1;switch(e.keyCode){case 37:case 63234:f=!0,c.rowObject.indent(-1*c.rtl);break;case 38:case 63232:var g=a(c.rowObject.element).prev("tr").get(0);while(g&&a(g).is(":hidden"))g=a(g).prev("tr").get(0);if(g){c.safeBlur=!1,c.rowObject.direction="up",f=!0;if(a(b).is(".tabledrag-root")){var h=0;while(g&&a(".indentation",g).length)g=a(g).prev("tr").get(0),h+=a(g).is(":hidden")?0:g.offsetHeight;g&&(c.rowObject.swap("before",g),window.scrollBy(0,-h))}else if(c.table.tBodies[0].rows[0]!=g||a(g).is(".draggable"))c.rowObject.swap("before",g),c.rowObject.interval=null,c.rowObject.indent(0),window.scrollBy(0,-parseInt(b.offsetHeight,10));d.get(0).focus()}break;case 39:case 63235:f=!0,c.rowObject.indent(1*c.rtl);break;case 40:case 63233:var i=a(c.rowObject.group).filter(":last").next("tr").get(0);while(i&&a(i).is(":hidden"))i=a(i).next("tr").get(0);if(i){c.safeBlur=!1,c.rowObject.direction="down",f=!0;if(a(b).is(".tabledrag-root")){var h=0,j=new c.row(i,"keyboard",c.indentEnabled,c.maxDepth,!1);if(j){a(j.group).each(function(){h+=a(this).is(":hidden")?0:this.offsetHeight});var k=a(j.group).filter(":last").get(0);c.rowObject.swap("after",k),window.scrollBy(0,parseInt(h,10))}}else c.rowObject.swap("after",i),c.rowObject.interval=null,c.rowObject.indent(0),window.scrollBy(0,parseInt(b.offsetHeight,10));d.get(0).focus()}}c.rowObject&&c.rowObject.changed==1&&(a(b).addClass("drag"),c.oldRowElement&&a(c.oldRowElement).removeClass("drag-previous"),c.oldRowElement=b,c.restripeTable(),c.onDrag());if(f)return!1}),d.keypress(function(a){switch(a.keyCode){case 37:case 38:case 39:case 40:return!1}})},Drupal.tableDrag.prototype.dragRow=function(a,b){if(b.dragObject){b.currentMouseCoords=b.mouseCoords(a);var c=b.currentMouseCoords.y-b.dragObject.initMouseOffset.y,d=b.currentMouseCoords.x-b.dragObject.initMouseOffset.x;if(c!=b.oldY){b.rowObject.direction=c>b.oldY?"down":"up",b.oldY=c;var e=b.checkScroll(b.currentMouseCoords.y);clearInterval(b.scrollInterval),(e>0&&b.rowObject.direction=="down"||e<0&&b.rowObject.direction=="up")&&b.setScroll(e);var f=b.findDropTargetRow(d,c);f&&(b.rowObject.direction=="down"?b.rowObject.swap("after",f,b):b.rowObject.swap("before",f,b),b.restripeTable())}if(b.indentEnabled){var g=b.currentMouseCoords.x-b.dragObject.indentMousePos.x,h=Math.round(g/b.indentAmount*b.rtl),i=b.rowObject.indent(h);b.dragObject.indentMousePos.x+=b.indentAmount*i*b.rtl,b.indentCount=Math.max(b.indentCount,b.rowObject.indents)}return!1}},Drupal.tableDrag.prototype.dropRow=function(b,c){if(c.rowObject!=null){var d=c.rowObject.element;if(c.rowObject.changed==1){c.updateFields(d);for(var e in c.tableSettings){var f=c.rowSettings(e,d);if(f.relationship=="group")for(var g in c.rowObject.children)c.updateField(c.rowObject.children[g],e)}c.rowObject.markChanged(),c.changed==0&&(a(Drupal.theme("tableDragChangedWarning")).insertBefore(c.table).hide().fadeIn("slow"),c.changed=!0)}c.indentEnabled&&c.rowObject.removeIndentClasses(),c.oldRowElement&&a(c.oldRowElement).removeClass("drag-previous"),a(d).removeClass("drag").addClass("drag-previous"),c.oldRowElement=d,c.onDrop(),c.rowObject=null}c.dragObject!=null&&(a(".tabledrag-handle",d).removeClass("tabledrag-handle-hover"),c.dragObject=null,a("body").removeClass("drag"),clearInterval(c.scrollInterval),navigator.userAgent.indexOf("MSIE 6.")!=-1&&a("select",this.table).css("display","block"))},Drupal.tableDrag.prototype.mouseCoords=function(a){return a.pageX||a.pageY?{x:a.pageX,y:a.pageY}:{x:a.clientX+document.body.scrollLeft-document.body.clientLeft,y:a.clientY+document.body.scrollTop-document.body.clientTop}},Drupal.tableDrag.prototype.getMouseOffset=function(b,c){var d=a(b).offset(),e=this.mouseCoords(c);return{x:e.x-d.left,y:e.y-d.top}},Drupal.tableDrag.prototype.findDropTargetRow=function(b,c){var d=a(this.table.tBodies[0].rows).not(":hidden");for(var e=0;e<d.length;e++){var f=d[e],g=0,h=a(f).offset().top;if(f.offsetHeight==0)var i=parseInt(f.firstChild.offsetHeight,10)/2;else var i=parseInt(f.offsetHeight,10)/2;if(c>h-i&&c<h+i){if(this.indentEnabled){for(var e in this.rowObject.group)if(this.rowObject.group[e]==f)return null}else if(f==this.rowObject.element)return null;if(!this.rowObject.isValidSwap(f))return null;while(a(f).is(":hidden")&&a(f).prev("tr").is(":hidden"))f=a(f).prev("tr").get(0);return f}}return null},Drupal.tableDrag.prototype.updateFields=function(a){for(var b in this.tableSettings)this.updateField(a,b)},Drupal.tableDrag.prototype.updateField=function(b,c){var d=this.rowSettings(c,b);if(d.relationship=="self"||d.relationship=="group")var e=b;else if(d.relationship=="sibling"){var f=a(b).prev("tr").get(0),g=a(b).next("tr").get(0),e=b;a(f).is(".draggable")&&a("."+c,f).length?this.indentEnabled?a(".indentations",f).length==a(".indentations",b)&&(e=f):e=f:a(g).is(".draggable")&&a("."+c,g).length&&(this.indentEnabled?a(".indentations",g).length==a(".indentations",b)&&(e=g):e=g)}else if(d.relationship=="parent"){var f=a(b).prev("tr");while(f.length&&a(".indentation",f).length>=this.rowObject.indents)f=f.prev("tr");if(f.length)e=f[0];else{e=a(this.table).find("tr.draggable:first").get(0),e==this.rowObject.element&&(e=a(this.rowObject.group[this.rowObject.group.length-1]).next("tr.draggable").get(0));var h=!0}}this.copyDragClasses(e,b,c),d=this.rowSettings(c,b),h&&(d.relationship="sibling",d.source=d.target);var i="."+d.target,j=a(i,b).get(0);if(j){var k="."+d.source,l=a(k,e).get(0);switch(d.action){case"depth":j.value=a(".indentation",a(l).closest("tr")).length;break;case"match":j.value=l.value;break;case"order":var m=this.rowObject.findSiblings(d);if(a(j).is("select")){var n=[];a("option",j).each(function(){n.push(this.value)});var o=n[n.length-1];a(i,m).each(function(){n.length>0?this.value=n.shift():this.value=o})}else{var p=parseInt(a(i,m[0]).val(),10)||0;a(i,m).each(function(){this.value=p,p++})}}}},Drupal.tableDrag.prototype.copyDragClasses=function(b,c,d){var e=a("."+d,b),f=a("."+d,c);e.length&&f.length&&(f[0].className=e[0].className)},Drupal.tableDrag.prototype.checkScroll=function(a){var b=document.documentElement,c=document.body,d=this.windowHeight=window.innerHeight||(b.clientHeight&&b.clientWidth!=0?b.clientHeight:c.offsetHeight),e=this.scrollY=document.all?b.scrollTop?b.scrollTop:c.scrollTop:window.pageYOffset?window.pageYOffset:window.scrollY,f=this.scrollSettings.trigger,g=0;if(a-e>d-f)return g=f/(d+e-a),g=g>0&&g<f?g:f,g*this.scrollSettings.amount;if(a-e<f)return g=f/(a-e),g=g>0&&g<f?g:f,-g*this.scrollSettings.amount},Drupal.tableDrag.prototype.setScroll=function(a){var b=this;this.scrollInterval=setInterval(function(){b.checkScroll(b.currentMouseCoords.y);var c=b.scrollY>b.table.topY,d=b.scrollY+b.windowHeight<b.table.bottomY;(a>0&&d||a<0&&c)&&window.scrollBy(0,a)},this.scrollSettings.interval)},Drupal.tableDrag.prototype.restripeTable=function(){a("> tbody > tr.draggable:visible, > tr.draggable:visible",this.table).removeClass("odd even").filter(":odd").addClass("even").end().filter(":even").addClass("odd")},Drupal.tableDrag.prototype.onDrag=function(){return null},Drupal.tableDrag.prototype.onDrop=function(){return null},Drupal.tableDrag.prototype.row=function(b,c,d,e,f){this.element=b,this.method=c,this.group=[b],this.groupDepth=a(".indentation",b).length,this.changed=!1,this.table=a(b).closest("table").get(0),this.indentEnabled=d,this.maxDepth=e,this.direction="";if(this.indentEnabled){this.indents=a(".indentation",b).length,this.children=this.findChildren(f),this.group=a.merge(this.group,this.children);for(var g=0;g<this.group.length;g++)this.groupDepth=Math.max(a(".indentation",this.group[g]).length,this.groupDepth)}},Drupal.tableDrag.prototype.row.prototype.findChildren=function(b){var c=this.indents,d=a(this.element,this.table).next("tr.draggable"),e=[],f=0;while(d.length){var g=a(".indentation",d).length;if(g>c)f++,e.push(d[0]),b&&a(".indentation",d).each(function(b){f==1&&b==c&&a(this).addClass("tree-child-first"),b==c?a(this).addClass("tree-child"):b>c&&a(this).addClass("tree-child-horizontal")});else break;d=d.next("tr.draggable")}return b&&e.length&&a(".indentation:nth-child("+(c+1)+")",e[e.length-1]).addClass("tree-child-last"),e},Drupal.tableDrag.prototype.row.prototype.isValidSwap=function(b){if(this.indentEnabled){var c,d;this.direction=="down"?(c=b,d=a(b).next("tr").get(0)):(c=a(b).prev("tr").get(0),d=b),this.interval=this.validIndentInterval(c,d);if(this.interval.min>this.interval.max)return!1}return this.table.tBodies[0].rows[0]==b&&a(b).is(":not(.draggable)")?!1:!0},Drupal.tableDrag.prototype.row.prototype.swap=function(b,c){Drupal.detachBehaviors(this.group,Drupal.settings,"move"),a(c)[b](this.group),Drupal.attachBehaviors(this.group,Drupal.settings),this.changed=!0,this.onSwap(c)},Drupal.tableDrag.prototype.row.prototype.validIndentInterval=function(b,c){var d,e;return d=c?a(".indentation",c).length:0,!b||a(b).is(":not(.draggable)")||a(this.element).is(".tabledrag-root")?e=0:(e=a(".indentation",b).length+(a(b).is(".tabledrag-leaf")?0:1),this.maxDepth&&(e=Math.min(e,this.maxDepth-(this.groupDepth-this.indents)))),{min:d,max:e}},Drupal.tableDrag.prototype.row.prototype.indent=function(b){if(!this.interval){var c=a(this.element).prev("tr").get(0),d=a(this.group).filter(":last").next("tr").get(0);this.interval=this.validIndentInterval(c,d)}var e=this.indents+b;e=Math.max(e,this.interval.min),e=Math.min(e,this.interval.max),b=e-this.indents;for(var f=1;f<=Math.abs(b);f++)b<0?(a(".indentation:first",this.group).remove(),this.indents--):(a("td:first",this.group).prepend(Drupal.theme("tableDragIndentation")),this.indents++);return b&&(this.changed=!0,this.groupDepth+=b,this.onIndent()),b},Drupal.tableDrag.prototype.row.prototype.findSiblings=function(b){var c=[],d=["prev","next"],e=this.indents;for(var f=0;f<d.length;f++){var g=a(this.element)[d[f]]();while(g.length){if(!a("."+b.target,g))break;if(this.indentEnabled)var h=a(".indentation",g).length;if(!this.indentEnabled||h==e)c.push(g[0]);else if(h<e)break;g=a(g)[d[f]]()}d[f]=="prev"&&(c.reverse(),c.push(this.element))}return c},Drupal.tableDrag.prototype.row.prototype.removeIndentClasses=function(){for(var b in this.children)a(".indentation",this.children[b]).removeClass("tree-child").removeClass("tree-child-first").removeClass("tree-child-last").removeClass("tree-child-horizontal")},Drupal.tableDrag.prototype.row.prototype.markChanged=function(){var b=Drupal.theme("tableDragChangedMarker"),c=a("td:first",this.element);a("span.tabledrag-changed",c).length==0&&c.append(b)},Drupal.tableDrag.prototype.row.prototype.onIndent=function(){return null},Drupal.tableDrag.prototype.row.prototype.onSwap=function(a){return null},Drupal.theme.prototype.tableDragChangedMarker=function(){return'<span class="warning tabledrag-changed">*</span>'},Drupal.theme.prototype.tableDragIndentation=function(){return'<div class="indentation">&nbsp;</div>'},Drupal.theme.prototype.tableDragChangedWarning=function(){return'<div class="tabledrag-changed-warning messages warning">'+Drupal.theme("tableDragChangedMarker")+" "+Drupal.t("Changes made in this table will not be saved until the form is submitted.")+"</div>"}})(jQuery);;
Drupal.viewsUi = {};

Drupal.behaviors.viewsUiEditView = {};

/**
 * Improve the user experience of the views edit interface.
 */
Drupal.behaviors.viewsUiEditView.attach = function (context, settings) {
  // Only show the SQL rewrite warning when the user has chosen the
  // corresponding checkbox.
  jQuery('#edit-query-options-disable-sql-rewrite').click(function () {
    jQuery('.sql-rewrite-warning').toggleClass('js-hide');
  });
};

Drupal.behaviors.viewsUiAddView = {};

/**
 * In the add view wizard, use the view name to prepopulate form fields such as
 * page title and menu link.
 */
Drupal.behaviors.viewsUiAddView.attach = function (context, settings) {
  var $ = jQuery;
  var exclude, replace, suffix;
  // Set up regular expressions to allow only numbers, letters, and dashes.
  exclude = new RegExp('[^a-z0-9\\-]+', 'g');
  replace = '-';

  // The page title, block title, and menu link fields can all be prepopulated
  // with the view name - no regular expression needed.
  var $fields = $(context).find('[id^="edit-page-title"], [id^="edit-block-title"], [id^="edit-page-link-properties-title"]');
  if ($fields.length) {
    if (!this.fieldsFiller) {
      this.fieldsFiller = new Drupal.viewsUi.FormFieldFiller($fields);
    }
    else {
      // After an AJAX response, this.fieldsFiller will still have event
      // handlers bound to the old version of the form fields (which don't exist
      // anymore). The event handlers need to be unbound and then rebound to the
      // new markup. Note that jQuery.live is difficult to make work in this
      // case because the IDs of the form fields change on every AJAX response.
      this.fieldsFiller.rebind($fields);
    }
  }

  // Prepopulate the path field with a URLified version of the view name.
  var $pathField = $(context).find('[id^="edit-page-path"]');
  if ($pathField.length) {
    if (!this.pathFiller) {
      this.pathFiller = new Drupal.viewsUi.FormFieldFiller($pathField, exclude, replace);
    }
    else {
      this.pathFiller.rebind($pathField);
    }
  }

  // Populate the RSS feed field with a URLified version of the view name, and
  // an .xml suffix (to make it unique).
  var $feedField = $(context).find('[id^="edit-page-feed-properties-path"]');
  if ($feedField.length) {
    if (!this.feedFiller) {
      suffix = '.xml';
      this.feedFiller = new Drupal.viewsUi.FormFieldFiller($feedField, exclude, replace, suffix);
    }
    else {
      this.feedFiller.rebind($feedField);
    }
  }
};

/**
 * Constructor for the Drupal.viewsUi.FormFieldFiller object.
 *
 * Prepopulates a form field based on the view name.
 *
 * @param $target
 *   A jQuery object representing the form field to prepopulate.
 * @param exclude
 *   Optional. A regular expression representing characters to exclude from the
 *   target field.
 * @param replace
 *   Optional. A string to use as the replacement value for disallowed
 *   characters.
 * @param suffix
 *   Optional. A suffix to append at the end of the target field content.
 */
Drupal.viewsUi.FormFieldFiller = function ($target, exclude, replace, suffix) {
  var $ = jQuery;
  this.source = $('#edit-human-name');
  this.target = $target;
  this.exclude = exclude || false;
  this.replace = replace || '';
  this.suffix = suffix || '';

  // Create bound versions of this instance's object methods to use as event
  // handlers. This will let us easily unbind those specific handlers later on.
  // NOTE: jQuery.proxy will not work for this because it assumes we want only
  // one bound version of an object method, whereas we need one version per
  // object instance.
  var self = this;
  this.populate = function () {return self._populate.call(self);};
  this.unbind = function () {return self._unbind.call(self);};

  this.bind();
  // Object constructor; no return value.
};

/**
 * Bind the form-filling behavior.
 */
Drupal.viewsUi.FormFieldFiller.prototype.bind = function () {
  this.unbind();
  // Populate the form field when the source changes.
  this.source.bind('keyup.viewsUi change.viewsUi', this.populate);
  // Quit populating the field as soon as it gets focus.
  this.target.bind('focus.viewsUi', this.unbind);
};

/**
 * Get the source form field value as altered by the passed-in parameters.
 */
Drupal.viewsUi.FormFieldFiller.prototype.getTransliterated = function () {
  var from = this.source.val();
  if (this.exclude) {
    from = from.toLowerCase().replace(this.exclude, this.replace);
  }
  return from + this.suffix;
};

/**
 * Populate the target form field with the altered source field value.
 */
Drupal.viewsUi.FormFieldFiller.prototype._populate = function () {
  var transliterated = this.getTransliterated();
  this.target.val(transliterated);
};

/**
 * Stop prepopulating the form fields.
 */
Drupal.viewsUi.FormFieldFiller.prototype._unbind = function () {
  this.source.unbind('keyup.viewsUi change.viewsUi', this.populate);
  this.target.unbind('focus.viewsUi', this.unbind);
};

/**
 * Bind event handlers to the new form fields, after they're replaced via AJAX.
 */
Drupal.viewsUi.FormFieldFiller.prototype.rebind = function ($fields) {
  this.target = $fields;
  this.bind();
}

Drupal.behaviors.addItemForm = {};
Drupal.behaviors.addItemForm.attach = function (context) {
  var $ = jQuery;
  // The add item form may have an id of views-ui-add-item-form--n.
  var $form = $(context).find('form[id^="views-ui-add-item-form"]').first();
  // Make sure we don't add more than one event handler to the same form.
  $form = $form.once('views-ui-add-item-form');
  if ($form.length) {
    new Drupal.viewsUi.addItemForm($form);
  }
}

Drupal.viewsUi.addItemForm = function($form) {
  this.$form = $form;
  this.$form.find('.views-filterable-options :checkbox').click(jQuery.proxy(this.handleCheck, this));
  // Find the wrapper of the displayed text.
  this.$selected_div = this.$form.find('.views-selected-options').parent();
  this.$selected_div.hide();
  this.checkedItems = [];
}

Drupal.viewsUi.addItemForm.prototype.handleCheck = function (event) {
  var $target = jQuery(event.target);
  var label = jQuery.trim($target.next().text());
  // Add/remove the checked item to the list.
  if ($target.is(':checked')) {
    this.$selected_div.show();
    this.checkedItems.push(label);
  }
  else {
    var length = this.checkedItems.length;
    var position = jQuery.inArray(label, this.checkedItems);
    // Delete the item from the list and take sure that the list doesn't have undefined items left.
    for (var i = 0; i < this.checkedItems.length; i++) {
      if (i == position) {
        this.checkedItems.splice(i, 1);
        i--;
        break;
      }
    }
    // Hide it again if none item is selected.
    if (this.checkedItems.length == 0) {
      this.$selected_div.hide();
    }
  }
  this.refreshCheckedItems();
}


/**
 * Refresh the display of the checked items.
 */
Drupal.viewsUi.addItemForm.prototype.refreshCheckedItems = function() {
  // Perhaps we should precache the text div, too.
  this.$selected_div.find('.views-selected-options').html(this.checkedItems.join(', '));
  Drupal.viewsUi.resizeModal('', true);
}


/**
 * The input field items that add displays must be rendered as <input> elements.
 * The following behavior detaches the <input> elements from the DOM, wraps them
 * in an unordered list, then appends them to the list of tabs.
 */
Drupal.behaviors.viewsUiRenderAddViewButton = {};

Drupal.behaviors.viewsUiRenderAddViewButton.attach = function (context, settings) {
  var $ = jQuery;
  // Build the add display menu and pull the display input buttons into it.
  var $menu = $('#views-display-menu-tabs', context).once('views-ui-render-add-view-button-processed');

  if (!$menu.length) {
    return;
  }
  var $addDisplayDropdown = $('<li class="add"><a href="#"><span class="icon add"></span>Add</a><ul class="action-list" style="display:none;"></ul></li>');
  var $displayButtons = $menu.nextAll('input.add-display').detach();
  $displayButtons.appendTo($addDisplayDropdown.find('.action-list')).wrap('<li>')
    .parent().first().addClass('first').end().last().addClass('last');
  // Remove the 'Add ' prefix from the button labels since they're being palced
  // in an 'Add' dropdown.
  // @todo This assumes English, but so does $addDisplayDropdown above. Add
  //   support for translation.
  $displayButtons.each(function () {
    var label = $(this).val();
    if (label.substr(0, 4) == 'Add ') {
      $(this).val(label.substr(4));
    }
  });
  $addDisplayDropdown.appendTo($menu);

  // Add the click handler for the add display button
  $('li.add > a', $menu).bind('click', function (event) {
    event.preventDefault();
    var $trigger = $(this);
    Drupal.behaviors.viewsUiRenderAddViewButton.toggleMenu($trigger);
  });
  // Add a mouseleave handler to close the dropdown when the user mouses
  // away from the item. We use mouseleave instead of mouseout because
  // the user is going to trigger mouseout when she moves from the trigger
  // link to the sub menu items.
  // We use the live binder because the open class on this item will be
  // toggled on and off and we want the handler to take effect in the cases
  // that the class is present, but not when it isn't.
  $('li.add', $menu).live('mouseleave', function (event) {
    var $this = $(this);
    var $trigger = $this.children('a[href="#"]');
    if ($this.children('.action-list').is(':visible')) {
      Drupal.behaviors.viewsUiRenderAddViewButton.toggleMenu($trigger);
    }
  });
};

/**
 * @note [@jessebeach] I feel like the following should be a more generic function and
 * not written specifically for this UI, but I'm not sure where to put it.
 */
Drupal.behaviors.viewsUiRenderAddViewButton.toggleMenu = function ($trigger) {
  $trigger.parent().toggleClass('open');
  $trigger.next().slideToggle('fast');
}


Drupal.behaviors.viewsUiSearchOptions = {};

Drupal.behaviors.viewsUiSearchOptions.attach = function (context) {
  var $ = jQuery;
  // The add item form may have an id of views-ui-add-item-form--n.
  var $form = $(context).find('form[id^="views-ui-add-item-form"]').first();
  // Make sure we don't add more than one event handler to the same form.
  $form = $form.once('views-ui-filter-options');
  if ($form.length) {
    new Drupal.viewsUi.OptionsSearch($form);
  }
};

/**
 * Constructor for the viewsUi.OptionsSearch object.
 *
 * The OptionsSearch object filters the available options on a form according
 * to the user's search term. Typing in "taxonomy" will show only those options
 * containing "taxonomy" in their label.
 */
Drupal.viewsUi.OptionsSearch = function ($form) {
  this.$form = $form;
  // Add a keyup handler to the search box.
  this.$searchBox = this.$form.find('#edit-options-search');
  this.$searchBox.keyup(jQuery.proxy(this.handleKeyup, this));
  // Get a list of option labels and their corresponding divs and maintain it
  // in memory, so we have as little overhead as possible at keyup time.
  this.options = this.getOptions(this.$form.find('.filterable-option'));
  // Restripe on initial loading.
  this.handleKeyup();
  // Trap the ENTER key in the search box so that it doesn't submit the form.
  this.$searchBox.keypress(function(event) {
    if (event.which == 13) {
      event.preventDefault();
    }
  });
};

/**
 * Assemble a list of all the filterable options on the form.
 *
 * @param $allOptions
 *   A jQuery object representing the rows of filterable options to be
 *   shown and hidden depending on the user's search terms.
 */
Drupal.viewsUi.OptionsSearch.prototype.getOptions = function ($allOptions) {
  var $ = jQuery;
  var i, $label, $description, $option;
  var options = [];
  var length = $allOptions.length;
  for (i = 0; i < length; i++) {
    $option = $($allOptions[i]);
    $label = $option.find('label');
    $description = $option.find('div.description');
    options[i] = {
      // Search on the lowercase version of the label text + description.
      'searchText': $label.text().toLowerCase() + " " + $description.text().toLowerCase(),
      // Maintain a reference to the jQuery object for each row, so we don't
      // have to create a new object inside the performance-sensitive keyup
      // handler.
      '$div': $option
    }
  }
  return options;
};

/**
 * Keyup handler for the search box that hides or shows the relevant options.
 */
Drupal.viewsUi.OptionsSearch.prototype.handleKeyup = function (event) {
  var found, i, j, option, search, words, wordsLength, zebraClass, zebraCounter;

  // Determine the user's search query. The search text has been converted to
  // lowercase.
  search = this.$searchBox.val().toLowerCase();
  words = search.split(' ');
  wordsLength = words.length;

  // Start the counter for restriping rows.
  zebraCounter = 0;

  // Search through the search texts in the form for matching text.
  var length = this.options.length;
  for (i = 0; i < length; i++) {
    // Use a local variable for the option being searched, for performance.
    option = this.options[i];
    found = true;
    // Each word in the search string has to match the item in order for the
    // item to be shown.
    for (j = 0; j < wordsLength; j++) {
      if (option.searchText.indexOf(words[j]) === -1) {
        found = false;
      }
    }
    if (found) {
      // Show the checkbox row, and restripe it.
      zebraClass = (zebraCounter % 2) ? 'odd' : 'even';
      option.$div.show();
      option.$div.removeClass('even odd');
      option.$div.addClass(zebraClass);
      zebraCounter++;
    }
    else {
      // The search string wasn't found; hide this item.
      option.$div.hide();
    }
  }
};


Drupal.behaviors.viewsUiPreview = {};
Drupal.behaviors.viewsUiPreview.attach = function (context, settings) {
  var $ = jQuery;

  // Only act on the edit view form.
  var contextualFiltersBucket = $('.views-display-column .views-ui-display-tab-bucket.contextual-filters', context);
  if (contextualFiltersBucket.length == 0) {
    return;
  }

  // If the display has no contextual filters, hide the form where you enter
  // the contextual filters for the live preview. If it has contextual filters,
  // show the form.
  var contextualFilters = $('.views-display-setting a', contextualFiltersBucket);
  if (contextualFilters.length) {
    $('#preview-args').parent().show();
  }
  else {
    $('#preview-args').parent().hide();
  }

  // Executes an initial preview.
  if ($('#edit-displays-live-preview').once('edit-displays-live-preview').is(':checked')) {
    $('#preview-submit').once('edit-displays-live-preview').click();
  }
};


Drupal.behaviors.viewsUiRearrangeFilter = {};
Drupal.behaviors.viewsUiRearrangeFilter.attach = function (context, settings) {
  var $ = jQuery;
  // Only act on the rearrange filter form.
  if (typeof Drupal.tableDrag == 'undefined' || typeof Drupal.tableDrag['views-rearrange-filters'] == 'undefined') {
    return;
  }

  var table = $('#views-rearrange-filters', context).once('views-rearrange-filters');
  var operator = $('.form-item-filter-groups-operator', context).once('views-rearrange-filters');
  if (table.length) {
    new Drupal.viewsUi.rearrangeFilterHandler(table, operator);
  }
};

/**
 * Improve the UI of the rearrange filters dialog box.
 */
Drupal.viewsUi.rearrangeFilterHandler = function (table, operator) {
  var $ = jQuery;
  // Keep a reference to the <table> being altered and to the div containing
  // the filter groups operator dropdown (if it exists).
  this.table = table;
  this.operator = operator;
  this.hasGroupOperator = this.operator.length > 0;

  // Keep a reference to all draggable rows within the table.
  this.draggableRows = $('.draggable', table);

  // Keep a reference to the buttons for adding and removing filter groups.
  this.addGroupButton = $('input#views-add-group');
  this.removeGroupButtons = $('input.views-remove-group', table);

  // Add links that duplicate the functionality of the (hidden) add and remove
  // buttons.
  this.insertAddRemoveFilterGroupLinks();

  // When there is a filter groups operator dropdown on the page, create
  // duplicates of the dropdown between each pair of filter groups.
  if (this.hasGroupOperator) {
    this.dropdowns = this.duplicateGroupsOperator();
    this.syncGroupsOperators();
  }

  // Add methods to the tableDrag instance to account for operator cells (which
  // span multiple rows), the operator labels next to each filter (e.g., "And"
  // or "Or"), the filter groups, and other special aspects of this tableDrag
  // instance.
  this.modifyTableDrag();

  // Initialize the operator labels (e.g., "And" or "Or") that are displayed
  // next to the filters in each group, and bind a handler so that they change
  // based on the values of the operator dropdown within that group.
  this.redrawOperatorLabels();
  $('.views-group-title select', table)
    .once('views-rearrange-filter-handler')
    .bind('change.views-rearrange-filter-handler', $.proxy(this, 'redrawOperatorLabels'));

  // Bind handlers so that when a "Remove" link is clicked, we:
  // - Update the rowspans of cells containing an operator dropdown (since they
  //   need to change to reflect the number of rows in each group).
  // - Redraw the operator labels next to the filters in the group (since the
  //   filter that is currently displayed last in each group is not supposed to
  //   have a label display next to it).
  $('a.views-groups-remove-link', this.table)
    .once('views-rearrange-filter-handler')
    .bind('click.views-rearrange-filter-handler', $.proxy(this, 'updateRowspans'))
    .bind('click.views-rearrange-filter-handler', $.proxy(this, 'redrawOperatorLabels'));
};

/**
 * Insert links that allow filter groups to be added and removed.
 */
Drupal.viewsUi.rearrangeFilterHandler.prototype.insertAddRemoveFilterGroupLinks = function () {
  var $ = jQuery;

  // Insert a link for adding a new group at the top of the page, and make it
  // match the action links styling used in a typical page.tpl.php. Note that
  // Drupal does not provide a theme function for this markup, so this is the
  // best we can do.
  $('<ul class="action-links"><li><a id="views-add-group-link" href="#">' + this.addGroupButton.val() + '</a></li></ul>')
    .prependTo(this.table.parent())
    // When the link is clicked, dynamically click the hidden form button for
    // adding a new filter group.
    .once('views-rearrange-filter-handler')
    .bind('click.views-rearrange-filter-handler', $.proxy(this, 'clickAddGroupButton'));

  // Find each (visually hidden) button for removing a filter group and insert
  // a link next to it.
  var length = this.removeGroupButtons.length;
  for (i = 0; i < length; i++) {
    var $removeGroupButton = $(this.removeGroupButtons[i]);
    var buttonId = $removeGroupButton.attr('id');
    $('<a href="#" class="views-remove-group-link">' + Drupal.t('Remove group') + '</a>')
      .insertBefore($removeGroupButton)
      // When the link is clicked, dynamically click the corresponding form
      // button.
      .once('views-rearrange-filter-handler')
      .bind('click.views-rearrange-filter-handler', {buttonId: buttonId}, $.proxy(this, 'clickRemoveGroupButton'));
  }
};

/**
 * Dynamically click the button that adds a new filter group.
 */
Drupal.viewsUi.rearrangeFilterHandler.prototype.clickAddGroupButton = function () {
  // Due to conflicts between Drupal core's AJAX system and the Views AJAX
  // system, the only way to get this to work seems to be to trigger both the
  // .mousedown() and .submit() events.
  this.addGroupButton.mousedown();
  this.addGroupButton.submit();
  return false;
};

/**
 * Dynamically click a button for removing a filter group.
 *
 * @param event
 *   Event being triggered, with event.data.buttonId set to the ID of the
 *   form button that should be clicked.
 */
Drupal.viewsUi.rearrangeFilterHandler.prototype.clickRemoveGroupButton = function (event) {
  // For some reason, here we only need to trigger .submit(), unlike for
  // Drupal.viewsUi.rearrangeFilterHandler.prototype.clickAddGroupButton()
  // where we had to trigger .mousedown() also.
  jQuery('input#' + event.data.buttonId, this.table).submit();
  return false;
};

/**
 * Move the groups operator so that it's between the first two groups, and
 * duplicate it between any subsequent groups.
 */
Drupal.viewsUi.rearrangeFilterHandler.prototype.duplicateGroupsOperator = function () {
  var $ = jQuery;
  var dropdowns, newRow;

  var titleRows = $('tr.views-group-title'), titleRow;

  // Get rid of the explanatory text around the operator; its placement is
  // explanatory enough.
  this.operator.find('label').add('div.description').addClass('element-invisible');
  this.operator.find('select').addClass('form-select');

  // Keep a list of the operator dropdowns, so we can sync their behavior later.
  dropdowns = this.operator;

  // Move the operator to a new row just above the second group.
  titleRow = $('tr#views-group-title-2');
  newRow = $('<tr class="filter-group-operator-row"><td colspan="5"></td></tr>');
  newRow.find('td').append(this.operator);
  newRow.insertBefore(titleRow);
  var i, length = titleRows.length;
  // Starting with the third group, copy the operator to a new row above the
  // group title.
  for (i = 2; i < length; i++) {
    titleRow = $(titleRows[i]);
    // Make a copy of the operator dropdown and put it in a new table row.
    var fakeOperator = this.operator.clone();
    fakeOperator.attr('id', '');
    newRow = $('<tr class="filter-group-operator-row"><td colspan="5"></td></tr>');
    newRow.find('td').append(fakeOperator);
    newRow.insertBefore(titleRow);
    dropdowns = dropdowns.add(fakeOperator);
  }

  return dropdowns;
};

/**
 * Make the duplicated groups operators change in sync with each other.
 */
Drupal.viewsUi.rearrangeFilterHandler.prototype.syncGroupsOperators = function () {
  if (this.dropdowns.length < 2) {
    // We only have one dropdown (or none at all), so there's nothing to sync.
    return;
  }

  this.dropdowns.change(jQuery.proxy(this, 'operatorChangeHandler'));
};

/**
 * Click handler for the operators that appear between filter groups.
 *
 * Forces all operator dropdowns to have the same value.
 */
Drupal.viewsUi.rearrangeFilterHandler.prototype.operatorChangeHandler = function (event) {
  var $ = jQuery;
  var $target = $(event.target);
  var operators = this.dropdowns.find('select').not($target);

  // Change the other operators to match this new value.
  operators.val($target.val());
};

Drupal.viewsUi.rearrangeFilterHandler.prototype.modifyTableDrag = function () {
  var tableDrag = Drupal.tableDrag['views-rearrange-filters'];
  var filterHandler = this;

  /**
   * Override the row.onSwap method from tabledrag.js.
   *
   * When a row is dragged to another place in the table, several things need
   * to occur.
   * - The row needs to be moved so that it's within one of the filter groups.
   * - The operator cells that span multiple rows need their rowspan attributes
   *   updated to reflect the number of rows in each group.
   * - The operator labels that are displayed next to each filter need to be
   *   redrawn, to account for the row's new location.
   */
  tableDrag.row.prototype.onSwap = function () {
    if (filterHandler.hasGroupOperator) {
      // Make sure the row that just got moved (this.group) is inside one of
      // the filter groups (i.e. below an empty marker row or a draggable). If
      // it isn't, move it down one.
      var thisRow = jQuery(this.group);
      var previousRow = thisRow.prev('tr');
      if (previousRow.length && !previousRow.hasClass('group-message') && !previousRow.hasClass('draggable')) {
        // Move the dragged row down one.
        var next = thisRow.next();
        if (next.is('tr')) {
          this.swap('after', next);
        }
      }
      filterHandler.updateRowspans();
    }
    // Redraw the operator labels that are displayed next to each filter, to
    // account for the row's new location.
    filterHandler.redrawOperatorLabels();
  };

  /**
   * Override the onDrop method from tabledrag.js.
   */
  tableDrag.onDrop = function () {
    var $ = jQuery;

    // If the tabledrag change marker (i.e., the "*") has been inserted inside
    // a row after the operator label (i.e., "And" or "Or") rearrange the items
    // so the operator label continues to appear last.
    var changeMarker = $(this.oldRowElement).find('.tabledrag-changed');
    if (changeMarker.length) {
      // Search for occurrences of the operator label before the change marker,
      // and reverse them.
      var operatorLabel = changeMarker.prevAll('.views-operator-label');
      if (operatorLabel.length) {
        operatorLabel.insertAfter(changeMarker);
      }
    }

    // Make sure the "group" dropdown is properly updated when rows are dragged
    // into an empty filter group. This is borrowed heavily from the block.js
    // implementation of tableDrag.onDrop().
    var groupRow = $(this.rowObject.element).prevAll('tr.group-message').get(0);
    var groupName = groupRow.className.replace(/([^ ]+[ ]+)*group-([^ ]+)-message([ ]+[^ ]+)*/, '$2');
    var groupField = $('select.views-group-select', this.rowObject.element);
    if ($(this.rowObject.element).prev('tr').is('.group-message') && !groupField.is('.views-group-select-' + groupName)) {
      var oldGroupName = groupField.attr('class').replace(/([^ ]+[ ]+)*views-group-select-([^ ]+)([ ]+[^ ]+)*/, '$2');
      groupField.removeClass('views-group-select-' + oldGroupName).addClass('views-group-select-' + groupName);
      groupField.val(groupName);
    }
  };
};


/**
 * Redraw the operator labels that are displayed next to each filter.
 */
Drupal.viewsUi.rearrangeFilterHandler.prototype.redrawOperatorLabels = function () {
  var $ = jQuery;
  for (i = 0; i < this.draggableRows.length; i++) {
    // Within the row, the operator labels are displayed inside the first table
    // cell (next to the filter name).
    var $draggableRow = $(this.draggableRows[i]);
    var $firstCell = $('td:first', $draggableRow);
    if ($firstCell.length) {
      // The value of the operator label ("And" or "Or") is taken from the
      // first operator dropdown we encounter, going backwards from the current
      // row. This dropdown is the one associated with the current row's filter
      // group.
      var operatorValue = $draggableRow.prevAll('.views-group-title').find('option:selected').html();
      var operatorLabel = '<span class="views-operator-label">' + operatorValue + '</span>';
      // If the next visible row after this one is a draggable filter row,
      // display the operator label next to the current row. (Checking for
      // visibility is necessary here since the "Remove" links hide the removed
      // row but don't actually remove it from the document).
      var $nextRow = $draggableRow.nextAll(':visible').eq(0);
      var $existingOperatorLabel = $firstCell.find('.views-operator-label');
      if ($nextRow.hasClass('draggable')) {
        // If an operator label was already there, replace it with the new one.
        if ($existingOperatorLabel.length) {
          $existingOperatorLabel.replaceWith(operatorLabel);
        }
        // Otherwise, append the operator label to the end of the table cell.
        else {
          $firstCell.append(operatorLabel);
        }
      }
      // If the next row doesn't contain a filter, then this is the last row
      // in the group. We don't want to display the operator there (since
      // operators should only display between two related filters, e.g.
      // "filter1 AND filter2 AND filter3"). So we remove any existing label
      // that this row has.
      else {
        $existingOperatorLabel.remove();
      }
    }
  }
};

/**
 * Update the rowspan attribute of each cell containing an operator dropdown.
 */
Drupal.viewsUi.rearrangeFilterHandler.prototype.updateRowspans = function () {
  var $ = jQuery;
  var i, $row, $currentEmptyRow, draggableCount, $operatorCell;
  var rows = $(this.table).find('tr');
  var length = rows.length;
  for (i = 0; i < length; i++) {
    $row = $(rows[i]);
    if ($row.hasClass('views-group-title')) {
      // This row is a title row.
      // Keep a reference to the cell containing the dropdown operator.
      $operatorCell = $($row.find('td.group-operator'));
      // Assume this filter group is empty, until we find otherwise.
      draggableCount = 0;
      $currentEmptyRow = $row.next('tr');
      $currentEmptyRow.removeClass('group-populated').addClass('group-empty');
      // The cell with the dropdown operator should span the title row and
      // the "this group is empty" row.
      $operatorCell.attr('rowspan', 2);
    }
    else if (($row).hasClass('draggable') && $row.is(':visible')) {
      // We've found a visible filter row, so we now know the group isn't empty.
      draggableCount++;
      $currentEmptyRow.removeClass('group-empty').addClass('group-populated');
      // The operator cell should span all draggable rows, plus the title.
      $operatorCell.attr('rowspan', draggableCount + 1);
    }
  }
};

Drupal.behaviors.viewsFilterConfigSelectAll = {};

/**
 * Add a select all checkbox, which checks each checkbox at once.
 */
Drupal.behaviors.viewsFilterConfigSelectAll.attach = function(context) {
  var $ = jQuery;
  // Show the select all checkbox.
  $('#views-ui-config-item-form div.form-item-options-value-all', context).once(function() {
    $(this).show();
  })
  .find('input[type=checkbox]')
  .click(function() {
    var checked = $(this).is(':checked');
    // Update all checkbox beside the select all checkbox.
    $(this).parents('.form-checkboxes').find('input[type=checkbox]').each(function() {
      $(this).attr('checked', checked);
    });
  });
};

/**
 * Ensure the desired default button is used when a form is implicitly submitted via an ENTER press on textfields, radios, and checkboxes.
 *
 * @see http://www.w3.org/TR/html5/association-of-controls-and-forms.html#implicit-submission
 */
Drupal.behaviors.viewsImplicitFormSubmission = {};
Drupal.behaviors.viewsImplicitFormSubmission.attach = function (context, settings) {
  var $ = jQuery;
  $(':text, :password, :radio, :checkbox', context).once('viewsImplicitFormSubmission', function() {
    $(this).keypress(function(event) {
      if (event.which == 13) {
        var formId = this.form.id;
        if (formId && settings.viewsImplicitFormSubmission && settings.viewsImplicitFormSubmission[formId] && settings.viewsImplicitFormSubmission[formId].defaultButton) {
          event.preventDefault();
          var buttonId = settings.viewsImplicitFormSubmission[formId].defaultButton;
          var $button = $('#' + buttonId, this.form);
          if ($button.length == 1 && $button.is(':enabled')) {
            if (Drupal.ajax && Drupal.ajax[buttonId]) {
              $button.trigger(Drupal.ajax[buttonId].element_settings.event);
            }
            else {
              $button.click();
            }
          }
        }
      }
    });
  });
};

/**
 * Remove icon class from elements that are themed as buttons or dropbuttons.
 */
Drupal.behaviors.viewsRemoveIconClass = {};
Drupal.behaviors.viewsRemoveIconClass.attach = function (context, settings) {
  jQuery('.ctools-button', context).once('RemoveIconClass', function () {
    var $ = jQuery;
    var $this = $(this);
    $('.icon', $this).removeClass('icon');
    $('.horizontal', $this).removeClass('horizontal');
  });
}

/**
 * Change "Expose filter" buttons into checkboxes.
 */
Drupal.behaviors.viewsUiCheckboxify = {};
Drupal.behaviors.viewsUiCheckboxify.attach = function (context, settings) {
  var $ = jQuery;
  var $buttons = $('#edit-options-expose-button-button').once('views-ui-checkboxify');
  var length = $buttons.length;
  var i;
  for (i = 0; i < length; i++) {
    new Drupal.viewsUi.Checkboxifier($buttons[i]);
  }
};

/**
 * Attaches an expose filter button to a checkbox that triggers its click event.
 *
 * @param button
 *   The DOM object representing the button to be checkboxified.
 */
Drupal.viewsUi.Checkboxifier = function (button) {
  var $ = jQuery;
  this.$button = $(button);
  this.$parent = this.$button.parent('div.views-expose');
  this.$checkbox = this.$parent.find('input:checkbox');
  // Hide the button and its description.
  this.$button.hide();
  this.$parent.find('.exposed-description').hide();

  this.$checkbox.click($.proxy(this, 'clickHandler'));
};

/**
 * When the checkbox is checked or unchecked, simulate a button press.
 */
Drupal.viewsUi.Checkboxifier.prototype.clickHandler = function (e) {
  this.$button.mousedown();
  this.$button.submit();
};

/**
 * Change the Apply button text based upon the override select state.
 */
Drupal.behaviors.viewsUiOverrideSelect = {};
Drupal.behaviors.viewsUiOverrideSelect.attach = function (context, settings) {
  var $ = jQuery;
  $('#edit-override-dropdown', context).once('views-ui-override-button-text', function() {
    // Closures! :(
    var $submit = $('#edit-submit', context);
    var old_value = $submit.val();

    $submit.once('views-ui-override-button-text')
      .bind('mouseup', function() {
        $(this).val(old_value);
        return true;
      });

    $(this).bind('change', function() {
      if ($(this).val() == 'default') {
        $submit.val(Drupal.t('Apply (all displays)'));
      }
      else if ($(this).val() == 'default_revert') {
        $submit.val(Drupal.t('Revert to default'));
      }
      else {
        $submit.val(Drupal.t('Apply (this display)'));
      }
    })
    .trigger('change');
  });

};

Drupal.viewsUi.resizeModal = function (e, no_shrink) {
  var $ = jQuery;
  var $modal = $('.views-ui-dialog');
  var $scroll = $('.scroll', $modal);
  if ($modal.size() == 0 || $modal.css('display') == 'none') {
    return;
  }

  var maxWidth = parseInt($(window).width() * .85); // 70% of window
  var minWidth = parseInt($(window).width() * .6); // 70% of window

  // Set the modal to the minwidth so that our width calculation of
  // children works.
  $modal.css('width', minWidth);
  var width = minWidth;

  // Don't let the window get more than 80% of the display high.
  var maxHeight = parseInt($(window).height() * .8);
  var minHeight = 200;
  if (no_shrink) {
    minHeight = $modal.height();
  }

  if (minHeight > maxHeight) {
    minHeight = maxHeight;
  }

  var height = 0;

  // Calculate the height of the 'scroll' region.
  var scrollHeight = 0;

  scrollHeight += parseInt($scroll.css('padding-top'));
  scrollHeight += parseInt($scroll.css('padding-bottom'));

  $scroll.children().each(function() {
    var w = $(this).innerWidth();
    if (w > width) {
      width = w;
    }
    scrollHeight += $(this).outerHeight(true);
  });

  // Now, calculate what the difference between the scroll and the modal
  // will be.

  var difference = 0;
  difference += parseInt($scroll.css('padding-top'));
  difference += parseInt($scroll.css('padding-bottom'));
  difference += $('.views-override').outerHeight(true);
  difference += $('.views-messages').outerHeight(true);
  difference += $('#views-ajax-title').outerHeight(true);
  difference += $('.views-add-form-selected').outerHeight(true);
  difference += $('.form-buttons', $modal).outerHeight(true);

  height = scrollHeight + difference;

  if (height > maxHeight) {
    height = maxHeight;
    scrollHeight = maxHeight - difference;
  }
  else if (height < minHeight) {
    height = minHeight;
    scrollHeight = minHeight - difference;
  }

  if (width > maxWidth) {
    width = maxWidth;
  }

  // Get where we should move content to
  var top = ($(window).height() / 2) - (height / 2);
  var left = ($(window).width() / 2) - (width / 2);

  $modal.css({
    'top': top + 'px',
    'left': left + 'px',
    'width': width + 'px',
    'height': height + 'px'
  });

  // Ensure inner popup height matches.
  $(Drupal.settings.views.ajax.popup).css('height', height + 'px');

  $scroll.css({
    'height': scrollHeight + 'px',
    'max-height': scrollHeight + 'px'
  });

};

jQuery(function() {
  jQuery(window).bind('resize', Drupal.viewsUi.resizeModal);
  jQuery(window).bind('scroll', Drupal.viewsUi.resizeModal);
});
;
