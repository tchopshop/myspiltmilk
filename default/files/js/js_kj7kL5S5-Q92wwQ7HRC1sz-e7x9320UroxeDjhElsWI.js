(function(a){a.fn.drupalGetSummary=function(){var b=this.data("summaryCallback");return this[0]&&b?a.trim(b(this[0])):""},a.fn.drupalSetSummary=function(a){var b=this;if(typeof a!="function"){var c=a;a=function(){return c}}return this.data("summaryCallback",a).unbind("formUpdated.summary").bind("formUpdated.summary",function(){b.trigger("summaryUpdated")}).trigger("summaryUpdated")},Drupal.behaviors.formUpdated={attach:function(b){var c="change.formUpdated click.formUpdated blur.formUpdated keyup.formUpdated";a(b).find(":input").andSelf().filter(":input").unbind(c).bind(c,function(){a(this).trigger("formUpdated")})}},Drupal.behaviors.fillUserInfoFromCookie={attach:function(b,c){a("form.user-info-from-cookie").once("user-info-from-cookie",function(){var b=this;a.each(["name","mail","homepage"],function(){var c=a("[name="+this+"]",b),d=a.cookie("Drupal.visitor."+this);c.length&&d&&c.val(d)})})}}})(jQuery);;
