// $Id$
(function(a){Drupal.behaviors.profileDrag={attach:function(b,c){var d=a("#profile-fields"),e=Drupal.tableDrag["profile-fields"];e.row.prototype.onSwap=function(b){var c=this;a("tr.category-message",d).each(function(){a(this).prev("tr").get(0)==c.element&&(c.method!="keyboard"||c.direction=="down")&&c.swap("after",this),a(this).next("tr").is(":not(.draggable)")||a(this).next("tr").size()==0?a(this).removeClass("category-populated").addClass("category-empty"):a(this).is(".category-empty")&&a(this).removeClass("category-empty").addClass("category-populated")})},e.onDrop=function(){dragObject=this;if(a(dragObject.rowObject.element).prev("tr").is(".category-message")){var b=a(dragObject.rowObject.element).prev("tr").get(0),c=b.className.replace(/([^ ]+[ ]+)*category-([^ ]+)-message([ ]+[^ ]+)*/,"$2"),d=a("select.profile-category",dragObject.rowObject.element),e=a("select.profile-weight",dragObject.rowObject.element),f=e[0].className.replace(/([^ ]+[ ]+)*profile-weight-([^ ]+)([ ]+[^ ]+)*/,"$2");d.is(".profile-category-"+c)||(d.removeClass("profile-category-"+f).addClass("profile-category-"+c),e.removeClass("profile-weight-"+f).addClass("profile-weight-"+c),d.val(d[0].options[c].value))}}}}})(jQuery);