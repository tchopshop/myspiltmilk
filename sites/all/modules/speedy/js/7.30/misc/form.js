(function(e){e.fn.drupalGetSummary=function(){var t=this.data("summaryCallback");return this[0]&&t?e.trim(t(this[0])):""},e.fn.drupalSetSummary=function(e){var t=this;if(typeof e!="function"){var n=e;e=function(){return n}}return this.data("summaryCallback",e).unbind("formUpdated.summary").bind("formUpdated.summary",function(){t.trigger("summaryUpdated")}).trigger("summaryUpdated")},Drupal.behaviors.formUpdated={attach:function(t){var n="change.formUpdated click.formUpdated blur.formUpdated keyup.formUpdated";e(t).find(":input").andSelf().filter(":input").unbind(n).bind(n,function(){e(this).trigger("formUpdated")})}},Drupal.behaviors.fillUserInfoFromCookie={attach:function(t,n){e("form.user-info-from-cookie").once("user-info-from-cookie",function(){var t=this;e.each(["name","mail","homepage"],function(){var n=e("[name="+this+"]",t),r=e.cookie("Drupal.visitor."+this);n.length&&r&&n.val(r)})})}}})(jQuery);