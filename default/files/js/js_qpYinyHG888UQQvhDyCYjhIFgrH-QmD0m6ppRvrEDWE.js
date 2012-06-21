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
// $Id: contentanalysis.js,v 1.1.2.7 2010/11/09 21:50:14 tomdude48 Exp $
var contentanalysis = contentanalysis || {};

(function ($, $$) {
	$.extend($$, {
		contentanalysisPrevAnalyzerTab: '',
		contentanalysisPrevReportTab: '',
		contentanalysisCurrentAnalyzerTab: '',
		contentanalysisCurrentReportTab: '',
		contentanalysisReportActiveTab: {},
		
		init: function() {
			$$.contentanalysis_contentanalysisui();
		},
		
		contentanalysis_contentanalysisui: function() {
		    if($('#modalContent div.analyzers h3.analyzer').size() > 0) {
		        $$.contentanalysis_show_analyzer_tab($('div.analyzers h3.analyzer').get(0));
		        $('div.analyzers h3.analyzer').mousedown(function () {
		        	$$.contentanalysis_show_analyzer_tab(this);
		        }) 
		        $('h3.contentanalysis-report-tab').mousedown(function () { 
		        	$$.contentanalysis_show_report_tab(this);
		        })
		    }	
		},

		contentanalysis_back: function() {
			$$.contentanalysis_show_analyzer_tab(contentanalysisPrevAnalyzerTab);
		  //contentanalysis_show_report_tab(contentanalysisPrevReportTab);
		},

		contentanalysis_show_analyzer_tab: function (theTab){
		  $('div.analysis-results div.analyzer-analysis:eq(' + $('.analyzers h3.analyzer').index(theTab) + ')').children('.content-analysis-tab:first').addClass('active');
		  $('div.analysis-results div.analyzer-analysis').hide();
		  $('.analyzers h3.analyzer').removeClass('active');
		  $(theTab).addClass('active');
		  $('div.analysis-results div.analyzer-analysis:eq(' + $('.analyzers h3.analyzer').index(theTab) + ')').show();
		  $('.content-analysis-results').hide();
		
		  var id = $(theTab).attr('id');
		  var e = id.split('-');
		  var analyzer = e[3];
		  
		  if($$.contentanalysisReportActiveTab[analyzer]) {
		    $$.contentanalysis_show_report_tab($('#contentanalysis-report-tab-' + analyzer + '-' + $$.contentanalysisReportActiveTab[analyzer]));
		  }
		  else {
		    $$.contentanalysis_show_report_tab($('#contentanalysis-report-tab-' + analyzer + '-0'));
		  }
		  $$.contentanalysisPrevAnalyzerTab = $$.contentanalysisCurrentAnalyzerTab;
		  $$.contentanalysisCurrentAnalyzerTab = theTab;  
		},

		contentanalysis_show_report_tab: function (theTab){
		  var id = $(theTab).attr('id');
		  var e = id.split('-');
		  $$.contentanalysisReportActiveTab[e[3]] = e[4];
		  $('h3.contentanalysis-report-tab').removeClass('active');  
		  $(theTab).addClass('active');
		  $('.contentanalysis-results-section').hide();
		
		  var tabs = $("#contentanalysis-report-tabs-" + e[3]);
		  //tabs.css('border','2px solid red');
		  var pos = $("#contentanalysis-report-tabs-" + e[3]).position(); 
		  var offset = $("#contentanalysis-report-tabs-" + e[3]).offset(); 
		  var height = tabs.height();
		  var top = (pos.top+height)+"px";
		  var left = (pos.left)+"px";
		  
		  var sec_id = id.replace('tab', 'results');
		  var result_id = sec_id.replace('-'+e[4],'')
		  //$('#' + result_id).css({'top': top, 'left': left}); 
		  $('#' + result_id).css('top', top); 
		  //$('#' + result_id).css('border', '2px solid green'); 
		  $('#' + sec_id).show();
		//alert("pos.left="+pos.left+",pos.top="+pos.top+",offset.left="+offset.left+",offset.top="+offset.top);
		  $$.contentanalysisPrevReportTab = $$.contentanalysisCurrentReportTab;
		  $$.contentanalysisCurrentReportTab = theTab; 
		},

		// called from inline Analyze content button
		contentanalysis_inline_analysis: function() {
		  Drupal.settings.contentanalysis.display_dialog = 0;
		  Drupal.settings.contentanalysis.display_inline = 1;
		  //$('#contentanalysis-ininline-analysis-button').after('<span class="throbber">Loading...</span>');
		  //$('#contentanalysis-ininline-analysis-button').after(Drupal.settings.contentanalysis.throbber);
		  $('#contentanalysis-buttons').after('<div class="ahah-progress ahah-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">' + Drupal.t('Analyzing...') + '</div></div>');
		  $$.contentanalysis_analyze();
		},

		// called from inline Analyze content button
		contentanalysis_dialog_analysis: function() {
		  Drupal.settings.contentanalysis.display_dialog = 1;
		  Drupal.settings.contentanalysis.display_inline = 0;
		  $$.contentanalysis_analyze();
		},

		// called from inline Analyze content button
		contentanalysis_full_analysis: function() {
		  Drupal.settings.contentanalysis.display_dialog = 1;
		  Drupal.settings.contentanalysis.display_inline = 1;
		  
		  $$.contentanalysis_analyze();
		},

		// called from inline Analyze content button
		contentanalysis_refresh_analysis: function(analyzer) {
		  Drupal.settings.contentanalysis.display_dialog = 0;
		  Drupal.settings.contentanalysis.display_inline = 1;
		  //$('.contentanalysis-refresh-link-' + analyzer).replaceWith('<span class="throbber">Loading...</span>');
		  $('.contentanalysis-refresh-link-' + analyzer).replaceWith('<div class="ahah-progress ahah-progress-throbber"><div class="throbber">&nbsp;</div></div>');
		  $$.contentanalysis_analyze(analyzer);
		},

		contentanalysis_analyze: function(analyzer_override) {
		  // if TinyMCE is used, turn off and on to save body text to textarea
		  var data = { 
		    'nid': -1,
		    'node_type': -1,
		    'source': -1,
		    'analyzers':-1,
		    'title': -1, 
		    'body': -1,
		    'body_summary': -1,
		    'page_title':-1, 
		    'meta_title':-1,
		    'meta_keywords':-1, 
		    'meta_description':-1,
		    'path_alias': -1,
		    'path_pathauto': -1,
		    'url': -1,
		    'page': -1,
		    'body_input_filter': -1,
		    'hidden': -1,    
		    'code': Drupal.settings.contentanalysis.code,
		    'action': -1
		  };
		  if(analyzer_override) {
		    data.action = 'refresh';
		  }
		  if ($('#contentanalysis-page-analyzer-form').html()) {
		    data.source = 'admin-form';
		    data.body = $('[name=input]').val()
		    data.nid = $('[name=input_nid]').val()
		    data.url = $('[name=input_url]').val()
		    if(data.body == '') {
		      data.body = -1;
		    }
		    if(data.nid == '') {
		      data.nid = -1;
		    }
		    if(data.url == '') {
		      data.url = -1;
		    }    
		  } else if ($('.node-form').html()) {
		    data.source = 'node-edit-form';
		    // Turn off TinyMCE if enabled
		    if(typeof tinyMCE == 'object') {
		    	tinyMCE.get('edit-body-und-0-value').hide();
		    }
		    // Turn off CKEditor if any.
		    var ckeditor = false;
		    if ($('#cke_edit-body-und-0-value').html()) {
		      $('#wysiwyg-toggle-edit-body-und-0-value').click();
		      ckeditor = true;
		    }
		
		    data.title = $('#edit-title').val();
		    data.body = $('#edit-body-und-0-value').val();
		    if ($('#edit-body-und-0-summary').val() != null) {
		      data.body_summary = $('#edit-body-und-0-summary').val();
		    } 
		    data.nid = Drupal.settings.contentanalysis.nid
		    data.node_type = Drupal.settings.contentanalysis.node_type
		    data.body_input_filter = $("select[name='body[und][0][format]'] option:selected").val();
		    
		    if ($('#edit-page-title').val() != null) {
		      data.page_title = $('#edit-page-title').val();
		    }    
		    // check if metatag module fields exist
		    if ($('#edit-metatags-title-value').val() != null) {
		      data.meta_title = $('#edit-metatags-title-value').val();
		    }
		    if ($('#edit-metatags-keywords-value').val() != null) {
		      data.meta_keywords = $('#edit-metatags-keywords-value').val();
		    }
		    if ($('#edit-metatags-description-value').val() != null) {
		      data.meta_description = $('#edit-metatags-description-value').val();
		    }
		    if ($('#edit-path-alias').val() != null) {
		      data.url = window.location.host + Drupal.settings.contentanalysis.base_path + $('#edit-path-alias').val();
		      data.path_alias = $('#edit-path-alias').val();
		    }
		    if ($("input[name='path[pathauto]']:checked").val() != null) {
		    	data.path_pathauto = 1;
		    }
		    // Turn back on tinyMCE
		    if(typeof tinyMCE == 'object') {
		    	tinyMCE.get('edit-body-und-0-value').show();
		    }	
		    // Turn back on CKEditor if needed.
		    if (ckeditor) {
		      $('#wysiwyg-toggle-edit-body-und-0-value').click();
		    }
		
		  } else {
		    data.source = 'page-link';
		    data.page = $('html').html()  
		    data.url = window.location.href
		  }
		  if(Drupal.settings.contentanalysis.hidden != null) {
		    data.hidden = Drupal.settings.contentanalysis.hidden;
		  }
		  
		  //alert('data.nid ' + data.nid)
		  var analyzers_arr = new Array();
		  if(analyzer_override) {
		    data.analyzers = analyzer_override;
		    analyzers_arr[0] = data.analyzers; 
		  }
		  else if($('#contentanalysis_analyzers_override input').val() != null) {    
		    data.analyzers = $('#contentanalysis_analyzers_override input').val();
		    analyzers_arr[0] = data.analyzers;
		  } 
		  else {
		    var i = 0;
		    $('#contentanalysis_analyzers .form-checkbox:checked').each ( function () {  
		      var expr = new RegExp(/\[[^\]]+\]/);
		      analyzers_arr[i] = expr.exec($(this).attr('name'))[0].replace(']', '').replace('[','');    
		      i++;
		    })
		    data.analyzers = analyzers_arr.join(',');
		  }
		  // call contentanalysis_data for enabed analyzers
		  for(var i in analyzers_arr) {
		    var aid = analyzers_arr[i];
		    var module = Drupal.settings.contentanalysis.analyzer_modules[aid].module;
		    if (eval('typeof ' + module + '_contentanalysis_data == "function"')) {
		      d = eval(module + '_contentanalysis_data')(aid, data);
		      for(var k in d) {
		        eval('data.ao_'+aid+'_'+k+' = "'+d[k]+'";');
		      }
		    }
		  }  
		  $('#contentanalysis-buttons').hide(); 
		  $.ajax({
		    type: 'POST',
		    url: Drupal.settings.contentanalysis.analyze_callback,
		    data: data,
		    dataType: 'json',
		    success: function(data, textStatus) {
		      analyzers_arr = data.inputs['analyzers'].split(",");
		      if(Drupal.settings.contentanalysis.display_dialog == 1) {
		        $('#analysis-modal').append(data.main['output']);
		        $('#analysis-modal .progress').remove();
		        //Drupal.behaviors.contentanalysisui();
		        $$.contentanalysis_contentanalysisui()
		      }
		      // display inline if enabled
		      if(Drupal.settings.contentanalysis.display_inline == 1) {
		        if(data.inputs['action'] == 'refresh') {
		          //if($('.contentanalysis_section_analysis').length > 0)
		          for(i in analyzers_arr) {
		            aid = analyzers_arr[i];
		            $('.contentanalysis-report-'+aid+'-page_title').replaceWith(data.page_title['output']);
		            $('.contentanalysis-report-'+aid+'-body').replaceWith(data.body['output']);
		            $('.contentanalysis-report-'+aid+'-meta_description').replaceWith(data.meta_description['output']);
		            $('.contentanalysis-report-'+aid+'-meta_keywords').replaceWith(data.meta_keywords['output']);
		          }
		        }
		        else {
		          var show_title = true;
		          if($('.form-item-metatags-title-value').length > 0) {
		            $('.form-item-metatags-title-value > .contentanalysis_section_analysis').remove();
		            $('.form-item-metatags-title-value').append(data.page_title['output']);
		            // check if metatag-title contains [node:title] token
		            if ($('#edit-metatags-title-value').val() != null) {
		              var meta_title = $('#edit-metatags-title-value').val();
		              if(meta_title.indexOf("[node:title]") == -1) {
		            	//show_title = false;
		              }
		            }
		          } 
		          if (show_title) {
		            $('.form-item-title > .contentanalysis_section_analysis').remove();
		            $('.form-item-title').append(data.page_title['output']);				
		          }
		    
		          $('#edit-body > .contentanalysis_section_analysis').remove();
		          $('#edit-body').append(data.body['output']);
		          // check newer nodewords format
		          if(($('.form-item-metatags-description-value').length > 0) && data.meta_description != null) {
		            $('.form-item-metatags-description-value > .contentanalysis_section_analysis').remove();
		            $('.form-item-metatags-description-value').append(data.meta_description['output']);
		          }
		          
		          if(($('.form-item-metatags-keywords-value').length > 0) && data.meta_keywords != null) {
		            $('.form-item-metatags-keywords-value > .contentanalysis_section_analysis').remove();
		            $('.form-item-metatags-keywords-value').append(data.meta_keywords['output']);
		          }
		        }
		        for(var i in analyzers_arr) {
		          var aid = analyzers_arr[i];
		          h = '<a href="#" class="contentanalysis-refresh-link-' + aid + '" onclick="contentanalysis.contentanalysis_refresh_analysis(\'' + aid + '\'); return false;">';
		          h += '<img src="' + Drupal.settings.contentanalysis.path_to_module + '/icons/refresh.png" alt="refresh" />';
		          h += '</a>';
		          $('.contentanalysis-report-' + aid + ' label').append(h);
		        } 
					}      
		      // call any modules post analysis hooks      
		      for(var i in analyzers_arr) {
		        var aid = analyzers_arr[i];        
		        var module = Drupal.settings.contentanalysis.analyzer_modules[aid].module;     
		        if (eval('typeof ' + module + '_contentanalysis_analysis_success == "function"')) {
		          eval(module + '_contentanalysis_analysis_success')(aid, data);
		        }
		      } 
		      if(typeof Drupal.behaviors.collapse == 'function') {
		    	  Drupal.behaviors.collapse();  
		      }
		      $('.ahah-progress-throbber').remove();
		      $('#contentanalysis-buttons').show();
		    },
		    error: function(xhr, status) {
		      alert(xhr.responseText.toString());
		      $('.ahah-progress-throbber').remove();
		      $('#contentanalysis-buttons').show();
		    }
		  });
		  return false;	
		}
	});	

	Drupal.behaviors.contentanalysisui = {
	  attach: function (context, settings) {
		$$.init();
	  }
	};
	
	Sliders = {};
	
	Sliders.changeHandle = function(e,ui) {
	  var id = jQuery(ui.handle).parents('div.slider-widget-container').attr('id');
	  if (typeof(ui.values) != 'undefined') {
	    jQuery.each(ui.values, function(i,val) {
	      jQuery("#"+id+"_value_"+i).val(val);
	      jQuery("#"+id+"_nr_"+i).text(val);
	    });
	  } else {
	    jQuery("#"+id+"_value_0").val(ui.value);
	    jQuery("#"+id+"_nr_0").text(ui.value);
	  }
	};

})(jQuery, contentanalysis);
;
(function(a){Drupal.progressBar=function(b,c,d,e){var f=this;this.id=b,this.method=d||"GET",this.updateCallback=c,this.errorCallback=e,this.element=a('<div class="progress" aria-live="polite"></div>').attr("id",b),this.element.html('<div class="bar"><div class="filled"></div></div><div class="percentage"></div><div class="message">&nbsp;</div>')},Drupal.progressBar.prototype.setProgress=function(b,c){b>=0&&b<=100&&(a("div.filled",this.element).css("width",b+"%"),a("div.percentage",this.element).html(b+"%")),a("div.message",this.element).html(c),this.updateCallback&&this.updateCallback(b,c,this)},Drupal.progressBar.prototype.startMonitoring=function(a,b){this.delay=b,this.uri=a,this.sendPing()},Drupal.progressBar.prototype.stopMonitoring=function(){clearTimeout(this.timer),this.uri=null},Drupal.progressBar.prototype.sendPing=function(){this.timer&&clearTimeout(this.timer);if(this.uri){var b=this;a.ajax({type:this.method,url:this.uri,data:"",dataType:"json",success:function(a){if(a.status==0){b.displayError(a.data);return}b.setProgress(a.percentage,a.message),b.timer=setTimeout(function(){b.sendPing()},b.delay)},error:function(a){b.displayError(Drupal.ajaxError(a,b.uri))}})}},Drupal.progressBar.prototype.displayError=function(b){var c=a('<div class="messages error"></div>').html(b);a(this.element).before(c).hide(),this.errorCallback&&this.errorCallback(this)}})(jQuery);;
/**
 * @file
 *
 * Implement a modal form.
 *
 * @see modal.inc for documentation.
 *
 * This javascript relies on the CTools ajax responder.
 */

(function ($) {
  // Make sure our objects are defined.
  Drupal.CTools = Drupal.CTools || {};
  Drupal.CTools.Modal = Drupal.CTools.Modal || {};

  /**
   * Display the modal
   *
   * @todo -- document the settings.
   */
  Drupal.CTools.Modal.show = function(choice) {
    var opts = {};

    if (choice && typeof choice == 'string' && Drupal.settings[choice]) {
      // This notation guarantees we are actually copying it.
      $.extend(true, opts, Drupal.settings[choice]);
    }
    else if (choice) {
      $.extend(true, opts, choice);
    }

    var defaults = {
      modalTheme: 'CToolsModalDialog',
      throbberTheme: 'CToolsModalThrobber',
      animation: 'show',
      animationSpeed: 'fast',
      modalSize: {
        type: 'scale',
        width: .8,
        height: .8,
        addWidth: 0,
        addHeight: 0,
        // How much to remove from the inner content to make space for the
        // theming.
        contentRight: 25,
        contentBottom: 45
      },
      modalOptions: {
        opacity: .55,
        background: '#fff'
      }
    };

    var settings = {};
    $.extend(true, settings, defaults, Drupal.settings.CToolsModal, opts);

    if (Drupal.CTools.Modal.currentSettings && Drupal.CTools.Modal.currentSettings != settings) {
      Drupal.CTools.Modal.modal.remove();
      Drupal.CTools.Modal.modal = null;
    }

    Drupal.CTools.Modal.currentSettings = settings;

    var resize = function(e) {
      // When creating the modal, it actually exists only in a theoretical
      // place that is not in the DOM. But once the modal exists, it is in the
      // DOM so the context must be set appropriately.
      var context = e ? document : Drupal.CTools.Modal.modal;

      if (Drupal.CTools.Modal.currentSettings.modalSize.type == 'scale') {
        var width = $(window).width() * Drupal.CTools.Modal.currentSettings.modalSize.width;
        var height = $(window).height() * Drupal.CTools.Modal.currentSettings.modalSize.height;
      }
      else {
        var width = Drupal.CTools.Modal.currentSettings.modalSize.width;
        var height = Drupal.CTools.Modal.currentSettings.modalSize.height;
      }

      // Use the additionol pixels for creating the width and height.
      $('div.ctools-modal-content', context).css({
        'width': width + Drupal.CTools.Modal.currentSettings.modalSize.addWidth + 'px',
        'height': height + Drupal.CTools.Modal.currentSettings.modalSize.addHeight + 'px'
      });
      $('div.ctools-modal-content .modal-content', context).css({
        'width': (width - Drupal.CTools.Modal.currentSettings.modalSize.contentRight) + 'px',
        'height': (height - Drupal.CTools.Modal.currentSettings.modalSize.contentBottom) + 'px'
      });
    }

    if (!Drupal.CTools.Modal.modal) {
      Drupal.CTools.Modal.modal = $(Drupal.theme(settings.modalTheme));
      if (settings.modalSize.type == 'scale') {
        $(window).bind('resize', resize);
      }
    }

    resize();

    $('span.modal-title', Drupal.CTools.Modal.modal).html(Drupal.CTools.Modal.currentSettings.loadingText);
    Drupal.CTools.Modal.modalContent(Drupal.CTools.Modal.modal, settings.modalOptions, settings.animation, settings.animationSpeed);
    $('#modalContent .modal-content').html(Drupal.theme(settings.throbberTheme));
  };

  /**
   * Hide the modal
   */
  Drupal.CTools.Modal.dismiss = function() {
    if (Drupal.CTools.Modal.modal) {
      Drupal.CTools.Modal.unmodalContent(Drupal.CTools.Modal.modal);
    }
  };

  /**
   * Provide the HTML to create the modal dialog.
   */
  Drupal.theme.prototype.CToolsModalDialog = function () {
    var html = ''
    html += '  <div id="ctools-modal">'
    html += '    <div class="ctools-modal-content">' // panels-modal-content
    html += '      <div class="modal-header">';
    html += '        <a class="close" href="#">';
    html +=            Drupal.CTools.Modal.currentSettings.closeText + Drupal.CTools.Modal.currentSettings.closeImage;
    html += '        </a>';
    html += '        <span id="modal-title" class="modal-title">&nbsp;</span>';
    html += '      </div>';
    html += '      <div id="modal-content" class="modal-content">';
    html += '      </div>';
    html += '    </div>';
    html += '  </div>';

    return html;
  }

  /**
   * Provide the HTML to create the throbber.
   */
  Drupal.theme.prototype.CToolsModalThrobber = function () {
    var html = '';
    html += '  <div id="modal-throbber">';
    html += '    <div class="modal-throbber-wrapper">';
    html +=        Drupal.CTools.Modal.currentSettings.throbber;
    html += '    </div>';
    html += '  </div>';

    return html;
  };

  /**
   * Figure out what settings string to use to display a modal.
   */
  Drupal.CTools.Modal.getSettings = function (object) {
    var match = $(object).attr('class').match(/ctools-modal-(\S+)/);
    if (match) {
      return match[1];
    }
  }

  /**
   * Click function for modals that can be cached.
   */
  Drupal.CTools.Modal.clickAjaxCacheLink = function () {
    Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(this));
    return Drupal.CTools.AJAX.clickAJAXCacheLink.apply(this);
  };

  /**
   * Handler to prepare the modal for the response
   */
  Drupal.CTools.Modal.clickAjaxLink = function () {
    Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(this));
    return false;
  };

  /**
   * Submit responder to do an AJAX submit on all modal forms.
   */
  Drupal.CTools.Modal.submitAjaxForm = function(e) {
    var $form = $(this);
    var url = $form.attr('action');

    setTimeout(function() { Drupal.CTools.AJAX.ajaxSubmit($form, url); }, 1);
    return false;
  }

  /**
   * Bind links that will open modals to the appropriate function.
   */
  Drupal.behaviors.ZZCToolsModal = {
    attach: function(context) {
      // Bind links
      // Note that doing so in this order means that the two classes can be
      // used together safely.
      /*
       * @todo remimplement the warm caching feature
       $('a.ctools-use-modal-cache', context).once('ctools-use-modal', function() {
         $(this).click(Drupal.CTools.Modal.clickAjaxCacheLink);
         Drupal.CTools.AJAX.warmCache.apply(this);
       });
        */

      $('area.ctools-use-modal, a.ctools-use-modal', context).once('ctools-use-modal', function() {
        var $this = $(this);
        $this.click(Drupal.CTools.Modal.clickAjaxLink);
        // Create a drupal ajax object
        var element_settings = {};
        if ($this.attr('href')) {
          element_settings.url = $this.attr('href');
          element_settings.event = 'click';
          element_settings.progress = { type: 'throbber' };
        }
        var base = $this.attr('href');
        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
      });

      // Bind buttons
      $('input.ctools-use-modal, button.ctools-use-modal', context).once('ctools-use-modal', function() {
        var $this = $(this);
        $this.click(Drupal.CTools.Modal.clickAjaxLink);
        var button = this;
        var element_settings = {};

        // AJAX submits specified in this manner automatically submit to the
        // normal form action.
        element_settings.url = Drupal.CTools.Modal.findURL(this);
        element_settings.event = 'click';

        var base = $this.attr('id');
        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);

        // Make sure changes to settings are reflected in the URL.
        $('.' + $(button).attr('id') + '-url').change(function() {
          Drupal.ajax[base].options.url = Drupal.CTools.Modal.findURL(button);
        });
      });

      // Bind our custom event to the form submit
      $('#modal-content form', context).once('ctools-use-modal', function() {
        var $this = $(this);
        var element_settings = {};

        element_settings.url = $this.attr('action');
        element_settings.event = 'submit';
        element_settings.progress = { 'type': 'throbber' }
        var base = $this.attr('id');

        Drupal.ajax[base] = new Drupal.ajax(base, this, element_settings);
        Drupal.ajax[base].form = $this;

        $('input[type=submit], button', this).click(function() {
          Drupal.ajax[base].element = this;
          this.form.clk = this;
        });
      });

      // Bind a click handler to allow elements with the 'ctools-close-modal'
      // class to close the modal.
      $('.ctools-close-modal', context).once('ctools-close-modal')
        .click(function() {
          Drupal.CTools.Modal.dismiss();
          return false;
        });
    }
  };

  // The following are implementations of AJAX responder commands.

  /**
   * AJAX responder command to place HTML within the modal.
   */
  Drupal.CTools.Modal.modal_display = function(ajax, response, status) {
    if ($('#modalContent').length == 0) {
      Drupal.CTools.Modal.show(Drupal.CTools.Modal.getSettings(ajax.element));
    }
    $('#modal-title').html(response.title);
    $('#modal-content').html(response.output);
    Drupal.attachBehaviors();
  }

  /**
   * AJAX responder command to dismiss the modal.
   */
  Drupal.CTools.Modal.modal_dismiss = function(command) {
    Drupal.CTools.Modal.dismiss();
    $('link.ctools-temporary-css').remove();
  }

  /**
   * Display loading
   */
  //Drupal.CTools.AJAX.commands.modal_loading = function(command) {
  Drupal.CTools.Modal.modal_loading = function(command) {
    Drupal.CTools.Modal.modal_display({
      output: Drupal.theme(Drupal.CTools.Modal.currentSettings.throbberTheme),
      title: Drupal.CTools.Modal.currentSettings.loadingText
    });
  }

  /**
   * Find a URL for an AJAX button.
   *
   * The URL for this gadget will be composed of the values of items by
   * taking the ID of this item and adding -url and looking for that
   * class. They need to be in the form in order since we will
   * concat them all together using '/'.
   */
  Drupal.CTools.Modal.findURL = function(item) {
    var url = '';
    var url_class = '.' + $(item).attr('id') + '-url';
    $(url_class).each(
      function() {
        var $this = $(this);
        if (url && $this.val()) {
          url += '/';
        }
        url += $this.val();
      });
    return url;
  };


  /**
   * modalContent
   * @param content string to display in the content box
   * @param css obj of css attributes
   * @param animation (fadeIn, slideDown, show)
   * @param speed (valid animation speeds slow, medium, fast or # in ms)
   */
  Drupal.CTools.Modal.modalContent = function(content, css, animation, speed) {
    // If our animation isn't set, make it just show/pop
    if (!animation) {
      animation = 'show';
    }
    else {
      // If our animation isn't "fadeIn" or "slideDown" then it always is show
      if (animation != 'fadeIn' && animation != 'slideDown') {
        animation = 'show';
      }
    }

    if (!speed) {
      speed = 'fast';
    }

    // Build our base attributes and allow them to be overriden
    css = jQuery.extend({
      position: 'absolute',
      left: '0px',
      margin: '0px',
      background: '#000',
      opacity: '.55'
    }, css);

    // Add opacity handling for IE.
    css.filter = 'alpha(opacity=' + (100 * css.opacity) + ')';
    content.hide();

    // if we already ahve a modalContent, remove it
    if ( $('#modalBackdrop')) $('#modalBackdrop').remove();
    if ( $('#modalContent')) $('#modalContent').remove();

    // position code lifted from http://www.quirksmode.org/viewport/compatibility.html
    if (self.pageYOffset) { // all except Explorer
    var wt = self.pageYOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) { // Explorer 6 Strict
      var wt = document.documentElement.scrollTop;
    } else if (document.body) { // all other Explorers
      var wt = document.body.scrollTop;
    }

    // Get our dimensions

    // Get the docHeight and (ugly hack) add 50 pixels to make sure we dont have a *visible* border below our div
    var docHeight = $(document).height() + 50;
    var docWidth = $(document).width();
    var winHeight = $(window).height();
    var winWidth = $(window).width();
    if( docHeight < winHeight ) docHeight = winHeight;

    // Create our divs
    $('body').append('<div id="modalBackdrop" style="z-index: 1000; display: none;"></div><div id="modalContent" style="z-index: 1001; position: absolute;">' + $(content).html() + '</div>');

    // Keyboard and focus event handler ensures focus stays on modal elements only
    modalEventHandler = function( event ) {
      target = null;
      if ( event ) { //Mozilla
        target = event.target;
      } else { //IE
        event = window.event;
        target = event.srcElement;
      }

      var parents = $(target).parents().get();
      for (var i in $(target).parents().get()) {
        var position = $(parents[i]).css('position');
        if (position == 'absolute' || position == 'fixed') {
          return true;
        }
      }
      if( $(target).filter('*:visible').parents('#modalContent').size()) {
        // allow the event only if target is a visible child node of #modalContent
        return true;
      }
      if ( $('#modalContent')) $('#modalContent').get(0).focus();
      return false;
    };
    $('body').bind( 'focus', modalEventHandler );
    $('body').bind( 'keypress', modalEventHandler );

    // Create our content div, get the dimensions, and hide it
    var modalContent = $('#modalContent').css('top','-1000px');
    var mdcTop = wt + ( winHeight / 2 ) - (  modalContent.outerHeight() / 2);
    var mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);
    $('#modalBackdrop').css(css).css('top', 0).css('height', docHeight + 'px').css('width', docWidth + 'px').show();
    modalContent.css({top: mdcTop + 'px', left: mdcLeft + 'px'}).hide()[animation](speed);

    // Bind a click for closing the modalContent
    modalContentClose = function(){close(); return false;};
    $('.close').bind('click', modalContentClose);

    // Bind a keypress on escape for closing the modalContent
    modalEventEscapeCloseHandler = function(event) {
      if (event.keyCode == 27) {
        close();
        return false;
      }
    };

    $(document).bind('keypress', modalEventEscapeCloseHandler);

    // Close the open modal content and backdrop
    function close() {
      // Unbind the events
      $(window).unbind('resize',  modalContentResize);
      $('body').unbind( 'focus', modalEventHandler);
      $('body').unbind( 'keypress', modalEventHandler );
      $('.close').unbind('click', modalContentClose);
      $('body').unbind('keypress', modalEventEscapeCloseHandler);
      $(document).trigger('CToolsDetachBehaviors', $('#modalContent'));

      // Set our animation parameters and use them
      if ( animation == 'fadeIn' ) animation = 'fadeOut';
      if ( animation == 'slideDown' ) animation = 'slideUp';
      if ( animation == 'show' ) animation = 'hide';

      // Close the content
      modalContent.hide()[animation](speed);

      // Remove the content
      $('#modalContent').remove();
      $('#modalBackdrop').remove();
    };

    // Move and resize the modalBackdrop and modalContent on resize of the window
     modalContentResize = function(){
      // Get our heights
      var docHeight = $(document).height();
      var docWidth = $(document).width();
      var winHeight = $(window).height();
      var winWidth = $(window).width();
      if( docHeight < winHeight ) docHeight = winHeight;

      // Get where we should move content to
      var modalContent = $('#modalContent');
      var mdcTop = ( winHeight / 2 ) - (  modalContent.outerHeight() / 2);
      var mdcLeft = ( winWidth / 2 ) - ( modalContent.outerWidth() / 2);

      // Apply the changes
      $('#modalBackdrop').css('height', docHeight + 'px').css('width', docWidth + 'px').show();
      modalContent.css('top', mdcTop + 'px').css('left', mdcLeft + 'px').show();
    };
    $(window).bind('resize', modalContentResize);

    $('#modalContent').focus();
  };

  /**
   * unmodalContent
   * @param content (The jQuery object to remove)
   * @param animation (fadeOut, slideUp, show)
   * @param speed (valid animation speeds slow, medium, fast or # in ms)
   */
  Drupal.CTools.Modal.unmodalContent = function(content, animation, speed)
  {
    // If our animation isn't set, make it just show/pop
    if (!animation) { var animation = 'show'; } else {
      // If our animation isn't "fade" then it always is show
      if (( animation != 'fadeOut' ) && ( animation != 'slideUp')) animation = 'show';
    }
    // Set a speed if we dont have one
    if ( !speed ) var speed = 'fast';

    // Unbind the events we bound
    $(window).unbind('resize', modalContentResize);
    $('body').unbind('focus', modalEventHandler);
    $('body').unbind('keypress', modalEventHandler);
    $('.close').unbind('click', modalContentClose);
    $(document).trigger('CToolsDetachBehaviors', $('#modalContent'));

    // jQuery magic loop through the instances and run the animations or removal.
    content.each(function(){
      if ( animation == 'fade' ) {
        $('#modalContent').fadeOut(speed, function() {
          $('#modalBackdrop').fadeOut(speed, function() {
            $(this).remove();
          });
          $(this).remove();
        });
      } else {
        if ( animation == 'slide' ) {
          $('#modalContent').slideUp(speed,function() {
            $('#modalBackdrop').slideUp(speed, function() {
              $(this).remove();
            });
            $(this).remove();
          });
        } else {
          $('#modalContent').remove();
          $('#modalBackdrop').remove();
        }
      }
    });
  };

$(function() {
  Drupal.ajax.prototype.commands.modal_display = Drupal.CTools.Modal.modal_display;
  Drupal.ajax.prototype.commands.modal_dismiss = Drupal.CTools.Modal.modal_dismiss;
});

})(jQuery);
;
/**
 * @file
 *
 * CTools flexible AJAX responder object.
 */

(function ($) {
  Drupal.CTools = Drupal.CTools || {};
  Drupal.CTools.AJAX = Drupal.CTools.AJAX || {};
  /**
   * Grab the response from the server and store it.
   *
   * @todo restore the warm cache functionality
   */
  Drupal.CTools.AJAX.warmCache = function () {
    // Store this expression for a minor speed improvement.
    $this = $(this);
    var old_url = $this.attr('href');
    // If we are currently fetching, or if we have fetched this already which is
    // ideal for things like pagers, where the previous page might already have
    // been seen in the cache.
    if ($this.hasClass('ctools-fetching') || Drupal.CTools.AJAX.commandCache[old_url]) {
      return false;
    }

    // Grab all the links that match this url and add the fetching class.
    // This allows the caching system to grab each url once and only once
    // instead of grabbing the url once per <a>.
    var $objects = $('a[href="' + old_url + '"]')
    $objects.addClass('ctools-fetching');
    try {
      url = old_url.replace(/\/nojs(\/|$)/g, '/ajax$1');
      $.ajax({
        type: "POST",
        url: url,
        data: { 'js': 1, 'ctools_ajax': 1},
        global: true,
        success: function (data) {
          Drupal.CTools.AJAX.commandCache[old_url] = data;
          $objects.addClass('ctools-cache-warmed').trigger('ctools-cache-warm', [data]);
        },
        complete: function() {
          $objects.removeClass('ctools-fetching');
        },
        dataType: 'json'
      });
    }
    catch (err) {
      $objects.removeClass('ctools-fetching');
      return false;
    }

    return false;
  };

  /**
   * Cachable click handler to fetch the commands out of the cache or from url.
   */
  Drupal.CTools.AJAX.clickAJAXCacheLink = function () {
    $this = $(this);
    if ($this.hasClass('ctools-fetching')) {
      $this.bind('ctools-cache-warm', function (event, data) {
        Drupal.CTools.AJAX.respond(data);
      });
      return false;
    }
    else {
      if ($this.hasClass('ctools-cache-warmed') && Drupal.CTools.AJAX.commandCache[$this.attr('href')]) {
        Drupal.CTools.AJAX.respond(Drupal.CTools.AJAX.commandCache[$this.attr('href')]);
        return false;
      }
      else {
        return Drupal.CTools.AJAX.clickAJAXLink.apply(this);
      }
    }
  };

  /**
   * Find a URL for an AJAX button.
   *
   * The URL for this gadget will be composed of the values of items by
   * taking the ID of this item and adding -url and looking for that
   * class. They need to be in the form in order since we will
   * concat them all together using '/'.
   */
  Drupal.CTools.AJAX.findURL = function(item) {
    var url = '';
    var url_class = '.' + $(item).attr('id') + '-url';
    $(url_class).each(
      function() {
        var $this = $(this);
        if (url && $this.val()) {
          url += '/';
        }
        url += $this.val();
      });
    return url;
  };

  // Hide these in a ready to ensure that Drupal.ajax is set up first.
  $(function() {
    Drupal.ajax.prototype.commands.attr = function(ajax, data, status) {
      $(data.selector).attr(data.name, data.value);
    };


    Drupal.ajax.prototype.commands.redirect = function(ajax, data, status) {
      if (data.delay > 0) {
        setTimeout(function () {
          location.href = data.url;
        }, data.delay);
      }
      else {
        location.href = data.url;
      }
    };

    Drupal.ajax.prototype.commands.reload = function(ajax, data, status) {
      location.reload();
    };

    Drupal.ajax.prototype.commands.submit = function(ajax, data, status) {
      $(data.selector).submit();
    }
  });
})(jQuery);
;
/*
 * Implementation of hook_contentanalysis_data()
 * Gets the data from the custom fields to attach to the AJAX post data.
 */ 
  var alchemy_contentanalysis_contentanalysis_data = function() {		
    var data = new Array();
    var types = new Array();
    var i = 0;
    jQuery('#alchemy_contentanalysis_types .form-checkbox:checked').each ( function () {  
      types[i] = jQuery(this).attr('value');    
      i++;
    });
    data['types'] = types.join(',');
    data['usecache'] = (jQuery('#edit-alchemy-alchemy-usecache').is(':checked')) ? data['usecache'] = 1 : data['usecache'] = 0;
    return data;
  }
;
var contentoptimizer_contentanalysis_data = function(aid) {		
  data = new Array();	
  data['keyword'] = document.getElementById('edit-seo-keyword').value;	
  return data;
};

var kwresearch = kwresearch || {};

(function ($, $$) {
	$.extend($$, {
		kwresearch_keyword_data: {},
		
		init: function() {
			$$.kwresearch_init();
		},
		
		kwresearch_init: function () {
		  var report_vocabs = Drupal.settings.kwresearch.tax_report_vocabs;
		  for(var vid in report_vocabs) {
			if (report_vocabs[vid] > 0 && ($('.kwresearch-refresh-link-' + vid).length == 0)) {
		      h = '<a href="#" class="kwresearch.kwresearch-refresh-link-' + vid + '" onclick="kwresearch.kwresearch_refresh_tax_report(\'' + vid + '\'); return false;" title="refresh report">';
		      h += '<img src="' + Drupal.settings.kwresearch.path_to_module + '/icons/refresh.png" alt="refresh report" />';
		      h += '</a>';
		      $('.kwresearch-tax-report-' + vid + ' label').append(h);
			}
		  } 
		  $$.kwresearch_process_keywords();
		},
		
		kwresearch_get_keyword_list: function(type) {
		  var value = '';
		  var keywords = new Array();
		  
		  if (type == 'vocab') {
		    if (Drupal.settings.kwresearch.keyword_tag_vocabulary) {    
		      if ($('#edit-taxonomy-tags-' + Drupal.settings.kwresearch.keyword_tag_vocabulary).val() != null) {
		        value = $('#edit-taxonomy-tags-' + Drupal.settings.kwresearch.keyword_tag_vocabulary).val();
		      } 
		    }    
		  }
		  else if (type == 'mlt') {
		    if ($('#edit-morelikethis-terms').val() != null) {
		      value = $('#edit-morelikethis-terms').val();  
		    }
		  }
		  else if (type == 'meta_keywords') {
		    if ($('#edit-nodewords-keywords-value').val() != null) {
		      value = $('#edit-nodewords-keywords-value').val();
		    }
		  }
		  
		  keywords = value.split(',');  
		  for(var i in keywords) {
		    keywords[i] = jQuery.trim(keywords[i].toLowerCase());
		  }
		  return keywords;
		},
		
		// Implementation of hook_contentanalysis_analysis_success
		kwresearch_contentanalysis_analysis_success: function(aid, data) {	
			$$.kwresearch_init();	
		},

		kwresearch_in_array: function(needle, haystack) {
			for(var i = 0; i < haystack.length; i++) {
				if (haystack[i] == needle) {
					return true;
				}
			}
			return false;
		},

		kwresearch_process_keywords: function() {
		//alert('hi');
		  $('.kwresearch_keyword:not(.processed)').each( function(index) {
		    keyword = $(this).text().toLowerCase();
		    str = $$.kwresearch_get_buttons(keyword);
		    
		    $(this).addClass('processed');
		    $(this).append(str);
		    $('.kwresearch_actions').hide();
		    $(this).mouseover( function() {
		      $(this).addClass('active');
		      var tools = $(this).find('.kwresearch_actions');
		      var pos = $(this).position(); 
		      var left = pos.left; 
		      var top = pos.top;
		      var topOffset = $(this).height();
		      var xTip = (left-0)+"px";  
		      //var yTip = (0-topOffset+top)+"px";  
		      var yTip = (0+top)+"px";  
		      tools.css({'top' : yTip, 'left' : xTip});  
		      tools.show();
		      
		    });
		    $(this).mouseout( function() {
		      var tools = $(this).find('.kwresearch_actions');
		      $(this).removeClass('active');
		      tools.hide();
		    });
		  });
		},

		kwresearch_get_buttons: function(keyword) {
		    str = '<div class="kwresearch_actions">';
		    title = Drupal.t('Keyword report');
		    str += '<a href="#" onclick="kwresearch.kwresearch_launch_report(\'' + keyword + '\'); return false;" title="' + title + '" class="kwresearch-tool-button">';
		    str += '<img src="' + Drupal.settings.kwresearch.module_path + '/icons/report.png" title="' + title + '" />';
		    str += '</a>';

		    str += $$.kwresearch_get_toggle_button(keyword, 'sitekw');
		    str += $$.kwresearch_get_toggle_button(keyword, 'siteops');
		    str += $$.kwresearch_get_toggle_button(keyword, 'pagekw');
		    str += $$.kwresearch_get_toggle_button(keyword, 'vocab');
		    str += $$.kwresearch_get_toggle_button(keyword, 'mlt');
		    str += $$.kwresearch_get_toggle_button(keyword, 'meta_keywords');

		    str += '</div>';
		    return str;
		},

		kwresearch_get_toggle_button: function(keyword, type) {
		  var str = '';
		  var keyword_list = $$.kwresearch_get_keyword_list(type);
		  if (type == 'sitekw') {  
		    if (Drupal.settings.kwresearch.enable_site_keyword_tool) { // TODO add admin permission logic
		      keywordns = keyword.replace(/ /g,'-');
		      add = 1;
		      img = 'add';
		      title = Drupal.t('Add keyword to targeted site keyword list');
		      var d = Drupal.settings.kwresearch.site_keywords_data;
		      var activei = -1;
		      if ((d[keyword] != null) && (d[keyword]['priority'] >= 0)) {
		        add = 0;
		        img = 'delete'
		        title = Drupal.t('Remove keyword from targeted site keyword list');
		        activei = d[keyword]['priority'];
		      }
		      str += '<div onmouseover="kwresearch.kwresearch_display_tool_site_keyword_menu(this, 1);" onmouseout="kwresearch.kwresearch_display_tool_site_keyword_menu(this, 0);" class="kwresearch-tool-group kwresearch-tool-button kwresearch-tool-button-site-keyword-' + keywordns + '">'
		      str += '<a href="#" onclick="kwresearch.kwresearch_toggle_sitekw_keyword(\'' + keyword + '\', ' + add + ', \'' + keywordns + '\'); return false;" title="' + title + '" >';
		      str += '<img src="' + Drupal.settings.kwresearch.module_path + '/icons/site_keyword_' + img + '.png" title="' + title + '" />';
		      str += '</a>';      

		      str += '<ul class="kwresearch-tool-menu kwresearch-tool-menu-site-priority-' + keyword + '" style="display: none; left: 0px; top: 18px;">';
		      op = Drupal.settings.kwresearch.site_priority_options;
		      for ( var i in op ) {
		        active = '';
		        if (activei == i) {
		          active = 'active';
		        }
		        str += '<li class="' + active + '"><a href="#" onclick="kwresearch.kwresearch_toggle_sitekw_keyword(\'' + keyword + '\', ' + add + ', \'' + keywordns + '\', ' + i + '); return false;">' + op[i] + '</a></li>';
		      }
		      str += '</ul>';  
		      str += '</div>';      
		    }
		  }
		  if (type == 'siteops') {
			var d = Drupal.settings.kwresearch.site_keywords_data;
			if ((Drupal.settings.kwresearch.form != null) && (Drupal.settings.kwresearch.form.substr(0, 5) == 'admin')) {
				var link = Drupal.settings.kwresearch.keyword_edit_path + d[keyword]['kid'];
				if (Drupal.settings.kwresearch.return_destination) {
			  		link += '?destination=' + Drupal.settings.kwresearch.return_destination;
			  	}
			  	var title = Drupal.t('Edit keyword');
			    str += '<a href="' + link + '" onclick="kwresearch.kwresearch_edit_keyword(' + d[keyword]['kid'] + '); return false;" title="' + title + '" class="kwresearch-tool-button">';
			    str += '<img src="' + Drupal.settings.kwresearch.module_path + '/icons/keyword_edit.png" title="' + title + '" />';
			    str += '</a>';   	  
			}
		    if ((Drupal.settings.kwresearch.form != null) && (Drupal.settings.kwresearch.form == 'admin_keyword_list') && !(d[keyword]['page_count'] > 0)) {
		    	var title = Drupal.t('Delete keyword');
			    str += '<a href="#" onclick="kwresearch.kwresearch_delete_keyword(\'' + escape(keyword) + '\', ' + d[keyword]['kid'] + '); return false;" title="' + title + '" class="kwresearch-tool-button">';
			    str += '<img src="' + Drupal.settings.kwresearch.module_path + '/icons/keyword_delete.png" title="' + title + '" />';
			    str += '</a>';   	  
		    }	  
		  }
		  if (type == 'pagekw') {  
		    if (Drupal.settings.kwresearch.enable_page_keyword_tool) { // TODO add admin permission logic
		      add = 1;
		      img = 'add';
		      title = Drupal.t('Add keyword to page keyword list');
		      var d = Drupal.settings.kwresearch.page_keywords_data;
		      var activei = 0;
		      if ((d[keyword] != null) && (d[keyword]['priority'] > 0)) {
		        add = 0;
		        img = 'delete'
		        title = Drupal.t('Remove keyword from page keyword list');
		        activei = d[keyword]['priority'];
		      }
		      /*
		      str += '<a href="#" onclick="kwresearch_toggle_pagekw_keyword(\'' + keyword + '\', ' + add + ', this); return false;" title="' + title + '" class="kwresearch-tool-button">';
		      str += '<img src="' + Drupal.settings.kwresearch.module_path + '/icons/page_keyword_' + img + '.png" title="' + title + '" />';
		      str += '</a>';
		      */      
		      str += '<div onmouseover="kwresearch.kwresearch_display_tool_page_keyword_menu(this, 1);" onmouseout="kwresearch.kwresearch_display_tool_page_keyword_menu(this, 0);" class="kwresearch-tool-group kwresearch-tool-button kwresearch-tool-button-page-keyword-' + keywordns + '">'
		      str += '<a href="#" onclick="kwresearch.kwresearch_toggle_pagekw_keyword(\'' + keyword + '\', ' + add + ', \'' + keywordns + '\'); return false;" title="' + title + '" >';
		      str += '<img src="' + Drupal.settings.kwresearch.module_path + '/icons/page_keyword_' + img + '.png" title="' + title + '" />';
		      str += '</a>';      

		      str += '<ul class="kwresearch-tool-menu kwresearch-tool-menu-site-priority-' + keyword + '" style="display: none; left: 18px; top: 18px;">';
		      op = Drupal.settings.kwresearch.page_priority_options;
		      for ( var i in op ) {
		        active = '';
		        if (activei == i) {
		          active = 'active';
		        }
		        str += '<li class="' + active + '"><a href="#" onclick="kwresearch.kwresearch_toggle_pagekw_keyword(\'' + keyword + '\', ' + add + ', \'' + keywordns + '\', ' + i + '); return false;">' + op[i] + '</a></li>';
		      }
		      str += '</ul>';    
		      str += '</div>';      
		      
		    }
		  }
		  else if (type == 'vocab') {
		    if (Drupal.settings.kwresearch.keyword_tag_vocabulary 
		      && ($('#edit-taxonomy-tags-' + Drupal.settings.kwresearch.keyword_tag_vocabulary).size() > 0)) {
		      add = 1;
		      img = 'add';
		      title = Drupal.t('Add keyword to keyword vocabulary');
		      
		      if ($$.kwresearch_in_array(keyword, keyword_list)) {
		        add = 0;
		        img = 'delete'
		        title = Drupal.t('Remove keyword from keyword vocabulary');
		      }
		      keyword
		      str += '<a href="#" onclick="kwresearch.kwresearch_toggle_vocab_keyword(\'' + keyword + '\', ' + add + ', this); return false;" title="' + title + '" class="kwresearch-tool-button">';
		      str += '<img src="' + Drupal.settings.kwresearch.module_path + '/icons/vocab_' + img + '.png" title="' + title + '" />';
		      str += '</a>';       
		    }
		  }
		  else if (type == 'mlt') {  
		    if ($('#edit-morelikethis-terms').size() > 0) {
		      add = 1;
		      img = 'add';
		      title = Drupal.t('Add keyword to More Like This');
		      if ($$.kwresearch_in_array(keyword, keyword_list)) {
		        add = 0;
		        img = 'delete'
		        title = Drupal.t('Remove keyword from More Like This');
		      }
		      str += '<a href="#" onclick="kwresearch.kwresearch_toggle_mlt_keyword(\'' + keyword + '\', ' + add + ', this); return false;" title="' + title + '" class="kwresearch-tool-button">';
		      str += '<img src="' + Drupal.settings.kwresearch.module_path + '/icons/mlt_' + img + '.png" title="' + title + '" />';
		      str += '</a>';
		    }
		  }
		  else if (type == 'meta_keywords') {  
		    if ($('#edit-nodewords-keywords-value').size() > 0) {
		      add = 1;
		      img = 'add';
		      title = Drupal.t('Add keyword to meta keywords');
		      if ($$.kwresearch_in_array(keyword, keyword_list)) {
		        add = 0;
		        img = 'delete'
		        title = Drupal.t('Remove keyword to meta keywords');
		      }
		      str += '<a href="#" onclick="kwresearch.kwresearch_toggle_meta_keyword(\'' + keyword + '\', ' + add + ', this); return false;" title="' + title + '" class="kwresearch-tool-button">';
		      str += '<img src="' + Drupal.settings.kwresearch.module_path + '/icons/metakeywords_' + img + '.png" title="' + title + '" />';
		      str += '</a>';
		    }
		  }
		  return str
		},

		kwresearch_display_tool_site_keyword_menu: function(theDiv, state) {
		  if (state == 1) {
		    $(theDiv).children('ul').show();
		  }
		  else {
		    $(theDiv).children('ul').hide();
		  }
		},

		kwresearch_display_tool_page_keyword_menu: function(theDiv, state) {
		  if (state == 1) {
		    $(theDiv).children('ul').show();
		  }
		  else {
		    $(theDiv).children('ul').hide();
		  }
		},

		kwresearch_launch_report: function(keyword) {
		  if (Drupal.settings.kwresearch.form.substr(0,5) == 'admin') {
		    window.location = Drupal.settings.kwresearch.analyze_path + keyword;
		    return false;
		  }
		  //alert(keyword);
		  $('#edit-kwresearch-keyword').val(keyword);
		  contentanalysis.contentanalysis_show_analyzer_tab(document.getElementById('contentanalysis-analyzer-tab-kwresearch'));
		  $$.kwresearch_analyze();
		  return false;
		},

		kwresearch_toggle_sitekw_keyword: function(keyword, add, keywordns, priority) {
		  var data = { 
		    'kwresearch_keyword': keyword,
		    'priority': -1,
		    'form': Drupal.settings.kwresearch.form
		  };
		  if (priority != null) {
		    data.priority = priority;
		    $('.kwresearch_actions').hide();
		  }
		  else if (add == 1) {
		    data.priority = 0;  
		  }  

		  $.ajax({
		    type: 'POST',
		    url: Drupal.settings.kwresearch.toggle_site_keyword_callback,
		    data: data,
		    dataType: 'json',
		    success: function(data, textStatus) {
			  var keyword = String(data.data['keyword']).toString();
		      if (Drupal.settings.kwresearch.site_keywords_data[keyword] == null) {
		        Drupal.settings.kwresearch.site_keywords_data[keyword] = {
		          'priority': data.data['priority']
		        }
		      }
		      else {
		        Drupal.settings.kwresearch.site_keywords_data[keyword]['priority'] = data.data['priority'];
		      }
		//alert(Drupal.settings.kwresearch.site_keywords_data[data.data['keyword']]['priority']);
		      $('.kwresearch-tool-button-site-keyword-' + keywordns).replaceWith($$.kwresearch_get_toggle_button(keyword, 'sitekw'));
		      //$(theLink).replaceWith(kwresearch_get_toggle_button(keyword, 'sitekw'));
		      if (Drupal.settings.kwresearch.form == 'admin_keyword_list') {
		    	$('#kid-' + data.data['kid']).hide();
		    	$('#kid-' + data.data['kid'] + ' .site_priority').replaceWith('<td class="site_priority">' + data.data['priority_out'] + "</td>");
		        $('#kid-' + data.data['kid'] + ' .value').replaceWith('<td class="value">' + data.data['value_out'] + "</td>");
		        $('#kid-' + data.data['kid'] + ' .user').replaceWith('<td class="user">' + data.data['user_out'] + "</td>");        
		        $('#kid-' + data.data['kid']).fadeIn(100);
		      }
		      if (Drupal.settings.kwresearch.form == 'admin_keyword_stats') {
		      	$('#kid-' + data.data['kid']).hide();
		      	$('#kid-' + data.data['kid'] + ' .site_priority').replaceWith('<td class="site_priority">' + data.data['priority_out'] + "</td>");
		        $('#kid-' + data.data['kid'] + ' .value').replaceWith('<td class="value">' + data.data['value_out'] + "</td>");
		        $('#kid-' + data.data['kid'] + ' .user').replaceWith('<td class="user">' + data.data['user_out'] + "</td>");
		        $('#kid-' + data.data['kid']).fadeIn(100);
		      }
		      if (Drupal.settings.kwresearch.form == 'node_edit') {
			    	$('#kid-' + data.data['kid']).hide();
			    	$('#kid-' + data.data['kid'] + ' .site_priority').replaceWith('<td class="site_priority">' + data.data['priority_out'] + "</td>");
			        $('#kid-' + data.data['kid'] + ' .value').replaceWith('<td class="value">' + data.data['value_out'] + "</td>");
			        $('#kid-' + data.data['kid'] + ' .user').replaceWith('<td class="user">' + data.data['user_out'] + "</td>");        
			        $('#kid-' + data.data['kid']).fadeIn(100);
			      }
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) {

		    }
		  });

		  return false;  
		},

		kwresearch_edit_keyword: function(kid) {
			var loc = Drupal.settings.kwresearch.keyword_edit_path + kid;
			if (Drupal.settings.kwresearch.return_destination) {
			  loc += '?destination=' + Drupal.settings.kwresearch.return_destination;
			}
			window.location	= loc;
			return false;
		},

		kwresearch_delete_keyword: function(keyword, kid) {
		  keyword = unescape(keyword);
		  if (Drupal.settings.kwresearch.site_keywords_data[keyword]['priority'] > 0) {
			if (!confirm(Drupal.t('This keyword has a site priority. Are you sure you want to delete it?'))) {
				return false;
			}
		  }
		  var data = { 
		    'kwresearch_keyword': keyword,
		    'kid': kid,
		    'form': Drupal.settings.kwresearch.form
		  };

		  $.ajax({
		    type: 'POST',
		    url: Drupal.settings.kwresearch.delete_site_keyword_callback,
		    data: data,
		    dataType: 'json',
		    success: function(data, textStatus) {
			  	if (data.data['deleted']) {
		// TODO this does not work with multiple deletes
		    	  $('#kid-' + data.data['kid']).fadeOut(100);
		    	  $('#kid-' + data.data['kid']).remove();
			  	}
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) {

		    }
		  });

		  return false;  
		},

		kwresearch_toggle_pagekw_keyword: function(keyword, add, keywordns, priority) {
		  
		  // update sync vocabulary
		  v = $('#edit-fields-' + Drupal.settings.kwresearch.keyword_sync_vocabulary + '-und').val();
		  if (add) {    
		    nv = v + (v ? ', ' : '') + keyword;    
		  }
		  else {
		    nv = $$.kwresearch_remove_phrase_from_list(keyword, v);
		  }
		  $('#edit-fields-' + Drupal.settings.kwresearch.keyword_sync_vocabulary + '-und').val(nv);
		  
		  // do ajax call to store in database
		  var data = { 
		    'kwresearch_keyword': keyword,
		    'priority': 0,
		    'nid': Drupal.settings.contentanalysis.nid
		  };
		  if (priority != null) {
		    data.priority = priority;
		    $('.kwresearch_actions').hide();
		  }
		  else if (add) {    
		    data.priority = 50;  
		  } 

		  $.ajax({
		    type: 'POST',
		    url: Drupal.settings.kwresearch.toggle_page_keyword_callback,
		    data: data,
		    dataType: 'json',
		    success: function(data, textStatus) {
		      if (Drupal.settings.kwresearch.page_keywords_data[data.data['keyword']] == null) {
		        Drupal.settings.kwresearch.page_keywords_data[data.data['keyword']] = {
		          'priority': data.data['priority']
		        }
		      }
		      else {
		        Drupal.settings.kwresearch.page_keywords_data[data.data['keyword']]['priority'] = data.data['priority'];
		      }
		      //$(theLink).replaceWith(kwresearch_get_toggle_button(keyword, 'pagekw'));
		      $('.kwresearch-tool-button-page-keyword-' + keywordns).replaceWith($$.kwresearch_get_toggle_button(data.data['keyword'], 'pagekw'));

		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) {

		    }
		  });

		  return false;  
		},

		kwresearch_toggle_vocab_keyword: function(keyword, add, theLink) {
		  v = $('#edit-fields-' + Drupal.settings.kwresearch.keyword_sync_vocabulary + '-und').val();
		  if (add) {    
		    nv = v + (v ? ', ' : '') + keyword;    
		  }
		  else {
		    nv = $$.kwresearch_remove_phrase_from_list(keyword, v);
		  }
		  $('#edit-fields-' + Drupal.settings.kwresearch.keyword_sync_vocabulary + '-und').val(nv);
		  $(theLink).replaceWith($$.kwresearch_get_toggle_button(keyword, 'vocab'));
		  return false;
		},

		kwresearch_toggle_mlt_keyword: function(keyword, add, theLink) {
		  v = $('#edit-morelikethis-terms').val();
		  if (add) {    
		    nv = v + (v ? ', ' : '') + keyword;    
		  }
		  else {
		    nv = $$.kwresearch_remove_phrase_from_list(keyword, v);
		  }
		  $('#edit-morelikethis-terms').val(nv);
		  $(theLink).replaceWith($$.kwresearch_get_toggle_button(keyword, 'mlt'));
		  return false;
		},

		kwresearch_toggle_meta_keyword: function(keyword, add, theLink) {
		  v = $('#edit-metatags-keywords-value').val();
		  if (add) {    
		    nv = v + (v ? ', ' : '') + keyword;    
		  }
		  else {
		    nv = $$.kwresearch_remove_phrase_from_list(keyword, v);
		  }
		  $('#edit-metatags-keywords-value').val(nv);
		  $(theLink).replaceWith($$.kwresearch_get_toggle_button(keyword, 'meta_keywords'));
		  return false;
		},

		kwresearch_remove_phrase_from_list: function(keyword, list) {
		  kws0 = list.split(',');  
		  kws1 = new Array();
		  j = 0;
		  for(var i in kws0) {    
		    k = jQuery.trim(kws0[i].toLowerCase());
		    if (k != keyword) {
		      kws1[j] = k;
		      j++;
		    }    
		  }  
		  return kws1.join(', ');
		},

		kwresearch_analyze: function() {
		  // if TinyMCE is used, turn off and on to save body text to textarea

		  var data = { 
		    'kwresearch_keyword': '',
		    'kwresearch_include_misspellings': 0,
		    'kwresearch_include_plurals': 0,
		    'kwresearch_adult_filter':$('#edit-kwresearch-adult-filter:selected').val(),
		    'kwresearch_nid': -1
		  };
		  data.kwresearch_keyword = $('#edit-kwresearch-keyword').val();
		  if ($('#edit-kwresearch-include-misspellings:checked').val() != null) {
		    data.kwresearch_include_misspellings = 1;
		  }
		  if ($('#edit-kwresearch-include-plurals:checked').val() != null) {
		    data.kwresearch_include_plurals = 1;
		  }
		  if (Drupal.settings.contentanalysis.nid > 0) {
		    data.kwresearch_nid = Drupal.settings.contentanalysis.nid;
		  }
		  
		  $('.kwresearch-result-block').hide();
		  var id = 'kwresearch-result-block-' + data.kwresearch_keyword.replace(/ /g, '-').toLowerCase();
		  var existing = $('#' + id);
		  if (existing.size() > 0) {
		    $(existing).show();
		  } else {
		    $('#kwresearch-submit-button').after('<div class="ahah-progress ahah-progress-throbber"><div class="throbber">&nbsp;</div><div class="message">' + Drupal.t('Analyzing...') + '</div></div>');
		    $('#kwresearch-submit-button').hide();  
		    $.ajax({
		      type: 'POST',
		      url: Drupal.settings.kwresearch.analyze_callback,
		      data: data,
		      dataType: 'json',
		      success: function(data, textStatus) {
		        $('#kwresearch-report').append(data.report['output']);
		        $$.kwresearch_init();
		        $('.ahah-progress-throbber').remove();
		        $('#kwresearch-submit-button').show();
		        //$$.kwresearch_keyword_data = $$.kwresearch_keyword_data.concat(data.report['data']);
		        //alert(pop(data.report['data']));
		      },
		      error: function(XMLHttpRequest, textStatus, errorThrown) {
		        //alert("error " + XMLHttpRequest.toString());
		        $('.ahah-progress-throbber').remove();
		        $('#kwresearch-submit-button').show();
		      }
		    });
		  }
		  return false;	
		},
		
		kwresearch_refresh_tax_report: function(vid) {
		  $('.kwresearch-refresh-link-' + vid).replaceWith('<div class="ahah-progress ahah-progress-throbber"><div class="throbber">&nbsp;</div></div>');
		  var data = { 
		    'keywords': $('#edit-taxonomy-tags-' + vid + '-wrapper input').val(),
		    'vid': vid,
		  };
		 
		  $.ajax({
		    type: 'POST',
		    url: Drupal.settings.kwresearch.tax_report_callback,
		    data: data,
		    dataType: 'json',
		    success: function(data, textStatus) {
			  vid = data.inputs['vid'];
			  $('#kwresearch-tax-report-'+vid).replaceWith(data.report['output']);
			  $('.ahah-progress-throbber').remove();
		      h = '<a href="#" class="kwresearch-refresh-link-' + vid + '" onclick="kwresearch.kwresearch_refresh_tax_report(\'' + vid + '\'); return false;" title="refresh report">';
		      h += '<img src="' + Drupal.settings.kwresearch.path_to_module + '/icons/refresh.png" alt="refresh report" />';
		      h += '</a>';
		      $('.kwresearch-tax-report-' + vid + ' label').append(h);      
		    },
		    error: function(XMLHttpRequest, textStatus, errorThrown) {
		      alert("error " + errorThrown.toString());
		      $('.ahah-progress-throbber').remove();
		      
		    }
		  });
		  return false;	
		}
	});	

	Drupal.behaviors.kwresearch_init = {
	  attach: function (context, settings) {
		$$.init();
	  }
	}

})(jQuery, kwresearch);

//Implementation of hook_contentanalysis_analysis_success
var kwresearch_contentanalysis_analysis_success = function(aid) {
  kwresearch.kwresearch_process_keywords();
};
(function($) {
  $.fn.limitMaxlength = function(options){
    this.after($('<div class="charsRemaining">'));
    var settings = jQuery.extend({
        attribute: "maxlength",
        onLimit: function(){},
        onEdit: function(){}
    }, options);
    if($.isFunction( metatag_improvements_get_defaults )) {
      var defaults = metatag_improvements_get_defaults(settings.type);
      var maxlength = defaults['maxlength'];
      this.attr('maxlength', defaults['maxlength']);
      this.attr('default', defaults['value']);
      if(this.val()==defaults['value']) {
        this.siblings('.charsRemaining').css('visibility', 'hidden');
      }
    }
    // Event handler to limit the textarea
    var onEdit = function(){
        var textarea = jQuery(this);
        //var maxlength = parseInt(textarea.attr(settings.attribute));

        if(textarea.val().length > maxlength){
            textarea.val(textarea.val().substr(0, maxlength));

            // Call the onlimit handler within the scope of the textarea
            jQuery.proxy(settings.onLimit, this)();
        }

        // Call the onEdit handler within the scope of the textarea
        jQuery.proxy(settings.onEdit, this)(maxlength - textarea.val().length);
    }

    this.each(onEdit);

    return this.keyup(onEdit)
                .keydown(onEdit)
                .focus(onEdit)
                .live('input paste', onEdit);
  }
	$(document).ready(function(){
    var onEditCallback = function(remaining){
        $(this).siblings('.charsRemaining').text("Tecken kvar: " + remaining);
        if(remaining > 0){
            //$(this).removeClass('border-red');
        }
    }
    var onLimitCallback = function(){
        //$(this).addClass('border-red');
    }
    $('.metatags-form #edit-metatags-description-value').limitMaxlength({
        onEdit: onEditCallback,
        onLimit: onLimitCallback,
        type: "description"
    });
    $('.metatags-form #edit-metatags-title-value').limitMaxlength({
        onEdit: onEditCallback,
        onLimit: onLimitCallback,
        type: "title"
    });
    $('.metatags-form #edit-metatags-description-value').click(function() {
      if($(this).val()==$(this).attr('default')) {
        $(this).val('');
        $(this).siblings('.charsRemaining').text("Tecken kvar: " + $(this).attr('maxlength'));
        $(this).siblings('.charsRemaining').css('visibility', 'visible');
      }
    });
    $('.metatags-form #edit-metatags-description-value').blur(function() {
			if($(this).val()=='') {
				$(this).val($(this).attr('default'));
				$(this).siblings('.charsRemaining').css('visibility', 'hidden');
			}
		});
		$('.metatags-form #edit-metatags-title-value').click(function() {
      if($(this).val()==$(this).attr('default')) {
        $(this).val('');
        $(this).siblings('.charsRemaining').text("Tecken kvar: " + $(this).attr('maxlength'));
        $(this).siblings('.charsRemaining').css('visibility', 'visible');
      }
    });
    $('.metatags-form #edit-metatags-title-value').blur(function() {
			if($(this).val()=='') {
				$(this).val($(this).attr('default'));
				$(this).siblings('.charsRemaining').css('visibility', 'hidden');
			}
		});
  });
})(jQuery);;
