// ColorBox v1.3.19.3 - jQuery lightbox plugin
// (c) 2011 Jack Moore - jacklmoore.com
// License: http://www.opensource.org/licenses/mit-license.php
(function(a,b,c){function Z(c,d,e){var g=b.createElement(c);return d&&(g.id=f+d),e&&(g.style.cssText=e),a(g)}function $(a){var b=y.length,c=(Q+a)%b;return c<0?b+c:c}function _(a,b){return Math.round((/%/.test(a)?(b==="x"?z.width():z.height())/100:1)*parseInt(a,10))}function ab(a){return K.photo||/\.(gif|png|jpe?g|bmp|ico)((#|\?).*)?$/i.test(a)}function bb(){var b,c=a.data(P,e);c==null?(K=a.extend({},d),console&&console.log&&console.log("Error: cboxElement missing settings object")):K=a.extend({},c);for(b in K)a.isFunction(K[b])&&b.slice(0,2)!=="on"&&(K[b]=K[b].call(P));K.rel=K.rel||P.rel||"nofollow",K.href=K.href||a(P).attr("href"),K.title=K.title||P.title,typeof K.href=="string"&&(K.href=a.trim(K.href))}function cb(b,c){a.event.trigger(b),c&&c.call(P)}function db(){var a,b=f+"Slideshow_",c="click."+f,d,e,g;K.slideshow&&y[1]?(d=function(){F.text(K.slideshowStop).unbind(c).bind(j,function(){if(K.loop||y[Q+1])a=setTimeout(W.next,K.slideshowSpeed)}).bind(i,function(){clearTimeout(a)}).one(c+" "+k,e),r.removeClass(b+"off").addClass(b+"on"),a=setTimeout(W.next,K.slideshowSpeed)},e=function(){clearTimeout(a),F.text(K.slideshowStart).unbind([j,i,k,c].join(" ")).one(c,function(){W.next(),d()}),r.removeClass(b+"on").addClass(b+"off")},K.slideshowAuto?d():e()):r.removeClass(b+"off "+b+"on")}function eb(b){U||(P=b,bb(),y=a(P),Q=0,K.rel!=="nofollow"&&(y=a("."+g).filter(function(){var b=a.data(this,e),c;return b&&(c=b.rel||this.rel),c===K.rel}),Q=y.index(P),Q===-1&&(y=y.add(P),Q=y.length-1)),S||(S=T=!0,r.show(),K.returnFocus&&a(P).blur().one(l,function(){a(this).focus()}),q.css({opacity:+K.opacity,cursor:K.overlayClose?"pointer":"auto"}).show(),K.w=_(K.initialWidth,"x"),K.h=_(K.initialHeight,"y"),W.position(),o&&z.bind("resize."+p+" scroll."+p,function(){q.css({width:z.width(),height:z.height(),top:z.scrollTop(),left:z.scrollLeft()})}).trigger("resize."+p),cb(h,K.onOpen),J.add(D).hide(),I.html(K.close).show()),W.load(!0))}function fb(){!r&&b.body&&(Y=!1,z=a(c),r=Z(X).attr({id:e,"class":n?f+(o?"IE6":"IE"):""}).hide(),q=Z(X,"Overlay",o?"position:absolute":"").hide(),s=Z(X,"Wrapper"),t=Z(X,"Content").append(A=Z(X,"LoadedContent","width:0; height:0; overflow:hidden"),C=Z(X,"LoadingOverlay").add(Z(X,"LoadingGraphic")),D=Z(X,"Title"),E=Z(X,"Current"),G=Z(X,"Next"),H=Z(X,"Previous"),F=Z(X,"Slideshow").bind(h,db),I=Z(X,"Close")),s.append(Z(X).append(Z(X,"TopLeft"),u=Z(X,"TopCenter"),Z(X,"TopRight")),Z(X,!1,"clear:left").append(v=Z(X,"MiddleLeft"),t,w=Z(X,"MiddleRight")),Z(X,!1,"clear:left").append(Z(X,"BottomLeft"),x=Z(X,"BottomCenter"),Z(X,"BottomRight"))).find("div div").css({"float":"left"}),B=Z(X,!1,"position:absolute; width:9999px; visibility:hidden; display:none"),J=G.add(H).add(E).add(F),a(b.body).append(q,r.append(s,B)))}function gb(){return r?(Y||(Y=!0,L=u.height()+x.height()+t.outerHeight(!0)-t.height(),M=v.width()+w.width()+t.outerWidth(!0)-t.width(),N=A.outerHeight(!0),O=A.outerWidth(!0),r.css({"padding-bottom":L,"padding-right":M}),G.click(function(){W.next()}),H.click(function(){W.prev()}),I.click(function(){W.close()}),q.click(function(){K.overlayClose&&W.close()}),a(b).bind("keydown."+f,function(a){var b=a.keyCode;S&&K.escKey&&b===27&&(a.preventDefault(),W.close()),S&&K.arrowKey&&y[1]&&(b===37?(a.preventDefault(),H.click()):b===39&&(a.preventDefault(),G.click()))}),a("."+g,b).live("click",function(a){a.which>1||a.shiftKey||a.altKey||a.metaKey||(a.preventDefault(),eb(this))})),!0):!1}var d={transition:"elastic",speed:300,width:!1,initialWidth:"600",innerWidth:!1,maxWidth:!1,height:!1,initialHeight:"450",innerHeight:!1,maxHeight:!1,scalePhotos:!0,scrolling:!0,inline:!1,html:!1,iframe:!1,fastIframe:!0,photo:!1,href:!1,title:!1,rel:!1,opacity:.9,preloading:!0,current:"image {current} of {total}",previous:"previous",next:"next",close:"close",xhrError:"This content failed to load.",imgError:"This image failed to load.",open:!1,returnFocus:!0,reposition:!0,loop:!0,slideshow:!1,slideshowAuto:!0,slideshowSpeed:2500,slideshowStart:"start slideshow",slideshowStop:"stop slideshow",onOpen:!1,onLoad:!1,onComplete:!1,onCleanup:!1,onClosed:!1,overlayClose:!0,escKey:!0,arrowKey:!0,top:!1,bottom:!1,left:!1,right:!1,fixed:!1,data:undefined},e="colorbox",f="cbox",g=f+"Element",h=f+"_open",i=f+"_load",j=f+"_complete",k=f+"_cleanup",l=f+"_closed",m=f+"_purge",n=!a.support.opacity&&!a.support.style,o=n&&!c.XMLHttpRequest,p=f+"_IE6",q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X="div",Y;if(a.colorbox)return;a(fb),W=a.fn[e]=a[e]=function(b,c){var f=this;b=b||{},fb();if(gb()){if(!f[0]){if(f.selector)return f;f=a("<a/>"),b.open=!0}c&&(b.onComplete=c),f.each(function(){a.data(this,e,a.extend({},a.data(this,e)||d,b))}).addClass(g),(a.isFunction(b.open)&&b.open.call(f)||b.open)&&eb(f[0])}return f},W.position=function(a,b){function i(a){u[0].style.width=x[0].style.width=t[0].style.width=a.style.width,t[0].style.height=v[0].style.height=w[0].style.height=a.style.height}var c=0,d=0,e=r.offset(),g,h;z.unbind("resize."+f),r.css({top:-9e4,left:-9e4}),g=z.scrollTop(),h=z.scrollLeft(),K.fixed&&!o?(e.top-=g,e.left-=h,r.css({position:"fixed"})):(c=g,d=h,r.css({position:"absolute"})),K.right!==!1?d+=Math.max(z.width()-K.w-O-M-_(K.right,"x"),0):K.left!==!1?d+=_(K.left,"x"):d+=Math.round(Math.max(z.width()-K.w-O-M,0)/2),K.bottom!==!1?c+=Math.max(z.height()-K.h-N-L-_(K.bottom,"y"),0):K.top!==!1?c+=_(K.top,"y"):c+=Math.round(Math.max(z.height()-K.h-N-L,0)/2),r.css({top:e.top,left:e.left}),a=r.width()===K.w+O&&r.height()===K.h+N?0:a||0,s[0].style.width=s[0].style.height="9999px",r.dequeue().animate({width:K.w+O,height:K.h+N,top:c,left:d},{duration:a,complete:function(){i(this),T=!1,s[0].style.width=K.w+O+M+"px",s[0].style.height=K.h+N+L+"px",K.reposition&&setTimeout(function(){z.bind("resize."+f,W.position)},1),b&&b()},step:function(){i(this)}})},W.resize=function(a){S&&(a=a||{},a.width&&(K.w=_(a.width,"x")-O-M),a.innerWidth&&(K.w=_(a.innerWidth,"x")),A.css({width:K.w}),a.height&&(K.h=_(a.height,"y")-N-L),a.innerHeight&&(K.h=_(a.innerHeight,"y")),!a.innerHeight&&!a.height&&(A.css({height:"auto"}),K.h=A.height()),A.css({height:K.h}),W.position(K.transition==="none"?0:K.speed))},W.prep=function(b){function g(){return K.w=K.w||A.width(),K.w=K.mw&&K.mw<K.w?K.mw:K.w,K.w}function h(){return K.h=K.h||A.height(),K.h=K.mh&&K.mh<K.h?K.mh:K.h,K.h}if(!S)return;var c,d=K.transition==="none"?0:K.speed;A.remove(),A=Z(X,"LoadedContent").append(b),A.hide().appendTo(B.show()).css({width:g(),overflow:K.scrolling?"auto":"hidden"}).css({height:h()}).prependTo(t),B.hide(),a(R).css({"float":"none"}),o&&a("select").not(r.find("select")).filter(function(){return this.style.visibility!=="hidden"}).css({visibility:"hidden"}).one(k,function(){this.style.visibility="inherit"}),c=function(){function s(){n&&r[0].style.removeAttribute("filter")}var b,c,g=y.length,h,i="frameBorder",k="allowTransparency",l,o,p,q;if(!S)return;l=function(){clearTimeout(V),C.hide(),cb(j,K.onComplete)},n&&R&&A.fadeIn(100),D.html(K.title).add(A).show();if(g>1){typeof K.current=="string"&&E.html(K.current.replace("{current}",Q+1).replace("{total}",g)).show(),G[K.loop||Q<g-1?"show":"hide"]().html(K.next),H[K.loop||Q?"show":"hide"]().html(K.previous),K.slideshow&&F.show();if(K.preloading){b=[$(-1),$(1)];while(c=y[b.pop()])q=a.data(c,e),q&&q.href?(o=q.href,a.isFunction(o)&&(o=o.call(c))):o=c.href,ab(o)&&(p=new Image,p.src=o)}}else J.hide();K.iframe?(h=Z("iframe")[0],i in h&&(h[i]=0),k in h&&(h[k]="true"),h.name=f+ +(new Date),K.fastIframe?l():a(h).one("load",l),h.src=K.href,K.scrolling||(h.scrolling="no"),a(h).addClass(f+"Iframe").appendTo(A).one(m,function(){h.src="//about:blank"})):l(),K.transition==="fade"?r.fadeTo(d,1,s):s()},K.transition==="fade"?r.fadeTo(d,0,function(){W.position(0,c)}):W.position(d,c)},W.load=function(b){var c,d,e=W.prep;T=!0,R=!1,P=y[Q],b||bb(),cb(m),cb(i,K.onLoad),K.h=K.height?_(K.height,"y")-N-L:K.innerHeight&&_(K.innerHeight,"y"),K.w=K.width?_(K.width,"x")-O-M:K.innerWidth&&_(K.innerWidth,"x"),K.mw=K.w,K.mh=K.h,K.maxWidth&&(K.mw=_(K.maxWidth,"x")-O-M,K.mw=K.w&&K.w<K.mw?K.w:K.mw),K.maxHeight&&(K.mh=_(K.maxHeight,"y")-N-L,K.mh=K.h&&K.h<K.mh?K.h:K.mh),c=K.href,V=setTimeout(function(){C.show()},100),K.inline?(Z(X).hide().insertBefore(a(c)[0]).one(m,function(){a(this).replaceWith(A.children())}),e(a(c))):K.iframe?e(" "):K.html?e(K.html):ab(c)?(a(R=new Image).addClass(f+"Photo").error(function(){K.title=!1,e(Z(X,"Error").html(K.imgError))}).load(function(){var a;R.onload=null,K.scalePhotos&&(d=function(){R.height-=R.height*a,R.width-=R.width*a},K.mw&&R.width>K.mw&&(a=(R.width-K.mw)/R.width,d()),K.mh&&R.height>K.mh&&(a=(R.height-K.mh)/R.height,d())),K.h&&(R.style.marginTop=Math.max(K.h-R.height,0)/2+"px"),y[1]&&(K.loop||y[Q+1])&&(R.style.cursor="pointer",R.onclick=function(){W.next()}),n&&(R.style.msInterpolationMode="bicubic"),setTimeout(function(){e(R)},1)}),setTimeout(function(){R.src=c},1)):c&&B.load(c,K.data,function(b,c,d){e(c==="error"?Z(X,"Error").html(K.xhrError):a(this).contents())})},W.next=function(){!T&&y[1]&&(K.loop||y[Q+1])&&(Q=$(1),W.load())},W.prev=function(){!T&&y[1]&&(K.loop||Q)&&(Q=$(-1),W.load())},W.close=function(){S&&!U&&(U=!0,S=!1,cb(k,K.onCleanup),z.unbind("."+f+" ."+p),q.fadeTo(200,0),r.stop().fadeTo(300,0,function(){r.add(q).css({opacity:1,cursor:"auto"}).hide(),cb(m),A.remove(),setTimeout(function(){U=!1,cb(l,K.onClosed)},1)}))},W.remove=function(){a([]).add(r).add(q).remove(),r=null,a("."+g).removeData(e).removeClass(g).die()},W.element=function(){return a(P)},W.settings=d})(jQuery,document,this);;
(function ($) {

Drupal.behaviors.initColorbox = {
  attach: function (context, settings) {
    if (!$.isFunction($.colorbox)) {
      return;
    }
    $('a, area, input', context)
      .filter('.colorbox')
      .once('init-colorbox-processed')
      .colorbox(settings.colorbox);
  }
};

{
  $(document).bind('cbox_complete', function () {
    Drupal.attachBehaviors('#cboxLoadedContent');
  });
}

})(jQuery);
;
(function ($) {

Drupal.behaviors.initColorboxDefaultStyle = {
  attach: function (context, settings) {
    $(document).bind('cbox_complete', function () {
      // Only run if there is a title.
      if ($('#cboxTitle:empty', context).length == false) {
        setTimeout(function () { $('#cboxTitle', context).slideUp() }, 1500);
        $('#cboxLoadedContent img', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideDown();
        });
        $('#cboxOverlay', context).bind('mouseover', function () {
          $('#cboxTitle', context).slideUp();
        });
      }
      else {
        $('#cboxTitle', context).hide();
      }
    });
  }
};

})(jQuery);
;
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
(function(a){Drupal.behaviors.autocomplete={attach:function(b,c){var d=[];a("input.autocomplete",b).once("autocomplete",function(){var b=this.value;d[b]||(d[b]=new Drupal.ACDB(b));var c=a("#"+this.id.substr(0,this.id.length-13)).attr("autocomplete","OFF").attr("aria-autocomplete","list");a(c[0].form).submit(Drupal.autocompleteSubmit),c.parent().attr("role","application").append(a('<span class="element-invisible" aria-live="assertive"></span>').attr("id",c.attr("id")+"-autocomplete-aria-live")),new Drupal.jsAC(c,d[b])})}},Drupal.autocompleteSubmit=function(){return a("#autocomplete").each(function(){this.owner.hidePopup()}).length==0},Drupal.jsAC=function(b,c){var d=this;this.input=b[0],this.ariaLive=a("#"+this.input.id+"-autocomplete-aria-live"),this.db=c,b.keydown(function(a){return d.onkeydown(this,a)}).keyup(function(a){d.onkeyup(this,a)}).blur(function(){d.hidePopup(),d.db.cancel()})},Drupal.jsAC.prototype.onkeydown=function(a,b){b||(b=window.event);switch(b.keyCode){case 40:return this.selectDown(),!1;case 38:return this.selectUp(),!1;default:return!0}},Drupal.jsAC.prototype.onkeyup=function(a,b){b||(b=window.event);switch(b.keyCode){case 16:case 17:case 18:case 20:case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:return!0;case 9:case 13:case 27:return this.hidePopup(b.keyCode),!0;default:return a.value.length>0?this.populatePopup():this.hidePopup(b.keyCode),!0}},Drupal.jsAC.prototype.select=function(b){this.input.value=a(b).data("autocompleteValue")},Drupal.jsAC.prototype.selectDown=function(){if(this.selected&&this.selected.nextSibling)this.highlight(this.selected.nextSibling);else if(this.popup){var b=a("li",this.popup);b.length>0&&this.highlight(b.get(0))}},Drupal.jsAC.prototype.selectUp=function(){this.selected&&this.selected.previousSibling&&this.highlight(this.selected.previousSibling)},Drupal.jsAC.prototype.highlight=function(b){this.selected&&a(this.selected).removeClass("selected"),a(b).addClass("selected"),this.selected=b,a(this.ariaLive).html(a(this.selected).html())},Drupal.jsAC.prototype.unhighlight=function(b){a(b).removeClass("selected"),this.selected=!1,a(this.ariaLive).empty()},Drupal.jsAC.prototype.hidePopup=function(b){this.selected&&(b&&b!=46&&b!=8&&b!=27||!b)&&(this.input.value=a(this.selected).data("autocompleteValue"));var c=this.popup;c&&(this.popup=null,a(c).fadeOut("fast",function(){a(c).remove()})),this.selected=!1,a(this.ariaLive).empty()},Drupal.jsAC.prototype.populatePopup=function(){var b=a(this.input),c=b.position();this.popup&&a(this.popup).remove(),this.selected=!1,this.popup=a('<div id="autocomplete"></div>')[0],this.popup.owner=this,a(this.popup).css({top:parseInt(c.top+this.input.offsetHeight,10)+"px",left:parseInt(c.left,10)+"px",width:b.innerWidth()+"px",display:"none"}),b.before(this.popup),this.db.owner=this,this.db.search(this.input.value)},Drupal.jsAC.prototype.found=function(b){if(!this.input.value.length)return!1;var c=a("<ul></ul>"),d=this;for(key in b)a("<li></li>").html(a("<div></div>").html(b[key])).mousedown(function(){d.select(this)}).mouseover(function(){d.highlight(this)}).mouseout(function(){d.unhighlight(this)}).data("autocompleteValue",key).appendTo(c);this.popup&&(c.children().length?(a(this.popup).empty().append(c).show(),a(this.ariaLive).html(Drupal.t("Autocomplete popup"))):(a(this.popup).css({visibility:"hidden"}),this.hidePopup()))},Drupal.jsAC.prototype.setStatus=function(b){switch(b){case"begin":a(this.input).addClass("throbbing"),a(this.ariaLive).html(Drupal.t("Searching for matches..."));break;case"cancel":case"error":case"found":a(this.input).removeClass("throbbing")}},Drupal.ACDB=function(a){this.uri=a,this.delay=300,this.cache={}},Drupal.ACDB.prototype.search=function(b){var c=this;this.searchString=b,b=b.replace(/^\s+|\s+$/,"");if(b.length<=0||b.charAt(b.length-1)==",")return;if(this.cache[b])return this.owner.found(this.cache[b]);this.timer&&clearTimeout(this.timer),this.timer=setTimeout(function(){c.owner.setStatus("begin"),a.ajax({type:"GET",url:c.uri+"/"+Drupal.encodePath(b),dataType:"json",success:function(a){if(typeof a.status=="undefined"||a.status!=0)c.cache[b]=a,c.searchString==b&&c.owner.found(a),c.owner.setStatus("found")},error:function(a){alert(Drupal.ajaxError(a,c.uri))}})},this.delay)},Drupal.ACDB.prototype.cancel=function(){this.owner&&this.owner.setStatus("cancel"),this.timer&&clearTimeout(this.timer),this.searchString=""}})(jQuery);;
(function(a){Drupal.behaviors.textarea={attach:function(b,c){a(".form-textarea-wrapper.resizable",b).once("textarea",function(){function e(d){return b=c.height()-d.pageY,c.css("opacity",.25),a(document).mousemove(f).mouseup(g),!1}function f(a){return c.height(Math.max(32,b+a.pageY)+"px"),!1}function g(b){a(document).unbind("mousemove",f).unbind("mouseup",g),c.css("opacity",1)}var b=null,c=a(this).addClass("resizable-textarea").find("textarea"),d=a('<div class="grippie"></div>').mousedown(e);d.insertAfter(c)})}}})(jQuery);;
(function(a){Drupal.toggleFieldset=function(b){var c=a(b);if(c.is(".collapsed")){var d=a("> .fieldset-wrapper",b).hide();c.removeClass("collapsed").trigger({type:"collapsed",value:!1}).find("> legend span.fieldset-legend-prefix").html(Drupal.t("Hide")),d.slideDown({duration:"fast",easing:"linear",complete:function(){Drupal.collapseScrollIntoView(b),b.animating=!1},step:function(){Drupal.collapseScrollIntoView(b)}})}else c.trigger({type:"collapsed",value:!0}),a("> .fieldset-wrapper",b).slideUp("fast",function(){c.addClass("collapsed").find("> legend span.fieldset-legend-prefix").html(Drupal.t("Show")),b.animating=!1})},Drupal.collapseScrollIntoView=function(b){var c=document.documentElement.clientHeight||document.body.clientHeight||0,d=document.documentElement.scrollTop||document.body.scrollTop||0,e=a(b).offset().top,f=55;e+b.offsetHeight+f>c+d&&(b.offsetHeight>c?window.scrollTo(0,e):window.scrollTo(0,e+b.offsetHeight-c+f))},Drupal.behaviors.collapse={attach:function(b,c){a("fieldset.collapsible",b).once("collapse",function(){var b=a(this),c=location.hash&&location.hash!="#"?", "+location.hash:"";a(".error"+c,b).length&&b.removeClass("collapsed");var d=a('<span class="summary"></span>');b.bind("summaryUpdated",function(){var c=a.trim(b.drupalGetSummary());d.html(c?" ("+c+")":"")}).trigger("summaryUpdated");var e=a("> legend .fieldset-legend",this);a('<span class="fieldset-legend-prefix element-invisible"></span>').append(b.hasClass("collapsed")?Drupal.t("Show"):Drupal.t("Hide")).prependTo(e).after(" ");var f=a('<a class="fieldset-title" href="#"></a>').prepend(e.contents()).appendTo(e).click(function(){var a=b.get(0);return a.animating||(a.animating=!0,Drupal.toggleFieldset(a)),!1});e.append(d)})}}})(jQuery);;

(function ($) {

Drupal.behaviors.tokenTree = {
  attach: function (context, settings) {
    $('table.token-tree', context).once('token-tree', function () {
      $(this).treeTable();
    });
  }
};

Drupal.behaviors.tokenInsert = {
  attach: function (context, settings) {
    // Keep track of which textfield was last selected/focused.
    $('textarea, input[type="text"]', context).focus(function() {
      Drupal.settings.tokenFocusedField = this;
    });

    $('.token-click-insert .token-key', context).once('token-click-insert', function() {
      var newThis = $('<a href="javascript:void(0);" title="' + Drupal.t('Insert this token into your form') + '">' + $(this).html() + '</a>').click(function(){
        if (typeof Drupal.settings.tokenFocusedField == 'undefined') {
          alert(Drupal.t('First click a text field to insert your tokens into.'));
        }
        else {
          var myField = Drupal.settings.tokenFocusedField;
          var myValue = $(this).text();

          //IE support
          if (document.selection) {
            myField.focus();
            sel = document.selection.createRange();
            sel.text = myValue;
          }

          //MOZILLA/NETSCAPE support
          else if (myField.selectionStart || myField.selectionStart == '0') {
            var startPos = myField.selectionStart;
            var endPos = myField.selectionEnd;
            myField.value = myField.value.substring(0, startPos)
                          + myValue
                          + myField.value.substring(endPos, myField.value.length);
          } else {
            myField.value += myValue;
          }

          $('html,body').animate({scrollTop: $(myField).offset().top}, 500);
        }
        return false;
      });
      $(this).html(newThis);
    });
  }
};

})(jQuery);
;
(function(a){Drupal.progressBar=function(b,c,d,e){var f=this;this.id=b,this.method=d||"GET",this.updateCallback=c,this.errorCallback=e,this.element=a('<div class="progress" aria-live="polite"></div>').attr("id",b),this.element.html('<div class="bar"><div class="filled"></div></div><div class="percentage"></div><div class="message">&nbsp;</div>')},Drupal.progressBar.prototype.setProgress=function(b,c){b>=0&&b<=100&&(a("div.filled",this.element).css("width",b+"%"),a("div.percentage",this.element).html(b+"%")),a("div.message",this.element).html(c),this.updateCallback&&this.updateCallback(b,c,this)},Drupal.progressBar.prototype.startMonitoring=function(a,b){this.delay=b,this.uri=a,this.sendPing()},Drupal.progressBar.prototype.stopMonitoring=function(){clearTimeout(this.timer),this.uri=null},Drupal.progressBar.prototype.sendPing=function(){this.timer&&clearTimeout(this.timer);if(this.uri){var b=this;a.ajax({type:this.method,url:this.uri,data:"",dataType:"json",success:function(a){if(a.status==0){b.displayError(a.data);return}b.setProgress(a.percentage,a.message),b.timer=setTimeout(function(){b.sendPing()},b.delay)},error:function(a){b.displayError(Drupal.ajaxError(a,b.uri))}})}},Drupal.progressBar.prototype.displayError=function(b){var c=a('<div class="messages error"></div>').html(b);a(this.element).before(c).hide(),this.errorCallback&&this.errorCallback(this)}})(jQuery);;
