(function($) {
/**
 * Attach this editor to a target element.
 *
 * See Drupal.wysiwyg.editor.attach.none() for a full desciption of this hook.
 */
Drupal.wysiwyg.editor.attach.redactor = function(context, params, settings) {
	var id = Drupal.wysiwyg.activeId;
	$('#' + id).redactor(settings);
}

})(jQuery);