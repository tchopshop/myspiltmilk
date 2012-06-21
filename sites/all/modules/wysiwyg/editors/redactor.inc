<?php

/**
 * @file
 * Editor integration functions for Redactor.
 */

/**
 * Plugin implementation of hook_editor().
 */
function wysiwyg_redactor_editor() {
  $editor['redactor'] = array(
    'title' => 'Redactor',
    'vendor url' => 'http://redactorjs.com/',
    'download url' => 'http://redactorjs.com/download/',
    'library path' => wysiwyg_get_path('redactor'),
    'libraries' => array(
      '' => array(
        'title' => 'Minified',
        'files' => array('redactor.min.js'),
      ),
      'src' => array(
        'title' => 'Normal',
        'files' => array('redactor.js'),
      ),
    ),
    'version callback' => 'wysiwyg_redactor_version',
    'settings callback' => 'wysiwyg_redactor_settings',
    'versions' => array(
      '7.6' => array(
        'js files' => array('redactor.js'),
        'css files' => array('redactor.css'),
        'download url' => 'http://redactorjs.com/download/',
      ),
    ),
  );
  return $editor;
}

/**
 * Detect editor version.
 */
function wysiwyg_redactor_version($editor) {
  $script = $editor['library path'] . '/redactor.js';
  $lines = file($script);

  $line = $lines[1];
  $line = explode('v', $line);
  
  return $line[1];
}

/**
 * Return runtime editor settings for a given wysiwyg profile.
 */
function wysiwyg_redactor_settings($editor, $config, $theme) {
  $settings = array();
  
  $settings['path'] = base_path() . $editor['library path'];
  
  if (isset($config['apply_source_formatting'])) {
    $settings['autoformat'] = TRUE;
  }

  if (isset($config['language'])) {
    $settings['lang'] = $config['language'];
  }

  if (isset($config['paste_auto_cleanup_on_paste'])) {
    $settings['cleanUp'] = TRUE;
  }
  
  if ($config['resizing'] == 1) {
  	$settings['resize'] = TRUE;
  } else {
  	$settings['resize'] = FALSE;
  }

  if (isset($config['css_setting'])) {
    if ($config['css_setting'] == 'theme') {
    	//Redactor does not support multiple CSS files, so we are going to take the first one of the list we get from WYIWYG (for now, hopefully this gets fixed in Redactor itself
    	$css = wysiwyg_get_css();
      $settings['css'] = $css[0];
    }
    else if ($config['css_setting'] == 'self' && isset($config['css_path'])) {
      $settings['css'] = strtr($config['css_path'], array('%b' => base_path(), '%t' => path_to_theme()));
      if (substr($settings['css'], 0, 1) != '/') {
      	$settings['css'] = '/' . $settings['css'];
      }
    }
  }
  
  //Upload settings
  if (!empty($config['buttons'])) {
  	$plugins = wysiwyg_get_plugins($editor['name']);

    //Image upload
    if (isset($config['buttons']['upload']['imageupload']) && user_access('redactor upload images')) {
    	$settings['imageUpload'] = $plugins['options']['imageUpload'];
    }
    
    //File upload
    if (isset($config['buttons']['upload']['fileupload']) && user_access('redactor upload files')) {
    	$settings['fileUpload'] = $plugins['options']['fileUpload'];
    }
    
    //Link file upload
    if (isset($config['buttons']['upload']['linkfileupload']) && user_access('upload files')) {
    	$settings['linkFileUpload'] = $plugins['options']['linkFileUpload'];
    }
  }
  
  return $settings;
}