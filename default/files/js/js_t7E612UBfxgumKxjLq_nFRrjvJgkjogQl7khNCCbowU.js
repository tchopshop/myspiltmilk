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
(function(a){Drupal.behaviors.textarea={attach:function(b,c){a(".form-textarea-wrapper.resizable",b).once("textarea",function(){function e(d){return b=c.height()-d.pageY,c.css("opacity",.25),a(document).mousemove(f).mouseup(g),!1}function f(a){return c.height(Math.max(32,b+a.pageY)+"px"),!1}function g(b){a(document).unbind("mousemove",f).unbind("mouseup",g),c.css("opacity",1)}var b=null,c=a(this).addClass("resizable-textarea").find("textarea"),d=a('<div class="grippie"></div>').mousedown(e);d.insertAfter(c)})}}})(jQuery);;
