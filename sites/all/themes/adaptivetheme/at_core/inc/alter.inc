<?php

/**
 * @file
 * General alters.
 */

global $theme_key, $theme_name;
$theme_name = $theme_key;
$path_to_at_core = drupal_get_path('theme', 'adaptivetheme');

/**
 * hook_html_head_alter()
 */
function adaptivetheme_html_head_alter(&$head_elements) {
  global $theme_name, $path_to_at_core;

  // charset utf-8
  $head_elements['system_meta_content_type']['#attributes'] = array('charset' => 'utf-8');

  // Metatags for mobile
  // X-UA-Compatible
  if (at_get_setting('chrome_edge', $theme_name) === 1) {
    $head_elements['adaptivetheme_meta_x_ua_compatible'] = array(
      '#type' => 'html_tag',
      '#tag' => 'meta',
      '#attributes' => array(
        'http-equiv' => "X-UA-Compatible",
        'content' => "IE=edge, chrome=1",
      ),
      '#weight' => 1,
    );
  }

  // cleartype
  if (at_get_setting('clear_type', $theme_name) === 1) {
    $head_elements['adaptivetheme_meta_cleartype'] = array(
      '#type' => 'html_tag',
      '#tag' => 'meta',
      '#attributes' => array(
        'http-equiv' => "cleartype",
        'content' => "on",
      ),
      '#weight' => 2,
    );
  }

  // Don't add these if responsive styles are disabled
  if (at_get_setting('disable_responsive_styles', $theme_name) === 0) {

    // Viewport
    if ($adaptivetheme_meta_viewport = at_get_setting('adaptivetheme_meta_viewport', $theme_name)) {
      $head_elements['adaptivetheme_meta_viewport'] = array(
        '#type' => 'html_tag',
        '#tag' => 'meta',
        '#attributes' => array(
          'name' => 'viewport',
          'content' => check_plain($adaptivetheme_meta_viewport),
        ),
        '#weight' => 3,
      );
    }

    // MobileOptimized
    if ($adaptivetheme_meta_mobileoptimized = at_get_setting('adaptivetheme_meta_mobileoptimized', $theme_name)) {
      $head_elements['adaptivetheme_meta_mobileoptimized'] = array(
        '#type' => 'html_tag',
        '#tag' => 'meta',
        '#attributes' => array(
          'name' => "MobileOptimized",
          'content' => check_plain($adaptivetheme_meta_mobileoptimized),
        ),
        '#weight' => 4,
      );
    }

    // HandheldFriendly
    if ($adaptivetheme_meta_handheldfriendly = at_get_setting('adaptivetheme_meta_handheldfriendly', $theme_name)) {
      $head_elements['adaptivetheme_meta_handheldfriendly'] = array(
        '#type' => 'html_tag',
        '#tag' => 'meta',
        '#attributes' => array(
          'name' => "HandheldFriendly",
          'content' => check_plain($adaptivetheme_meta_handheldfriendly),
        ),
        '#weight' => 5,
      );
    }

    // apple-mobile-web-app-capable
    if ($adaptivetheme_meta_apple_mobile_web_app_capable = at_get_setting('adaptivetheme_meta_apple_mobile_web_app_capable', $theme_name)) {
    $head_elements['adaptivetheme_meta_apple_mobile_web_app_capable'] = array(
      '#type' => 'html_tag',
      '#tag' => 'meta',
      '#attributes' => array(
        'name' => "apple-mobile-web-app-capable",
        'content' => check_plain($adaptivetheme_meta_apple_mobile_web_app_capable),
      ),
      '#weight' => 6,
      );
    }
  }

  // Apple touch icons - low, medium and high (see the Apple docs on touch icons)
  if (at_get_setting('enable_apple_touch_icons') === 1) {

    // low
    $apple_touch_icon_path_l = check_plain(at_get_setting('apple_touch_icon_path_l', $theme_name));
    if (!empty($apple_touch_icon_path_l)) {
      $l = drupal_get_path('theme', $theme_name) . '/' . $apple_touch_icon_path_l;
      $touch_icon_l = file_create_url($l);
      $head_elements['adaptivetheme_touch_icon_nokia'] = array(
        '#type' => 'html_tag',
        '#tag' => 'link',
        '#weight' => -97,
        '#attributes' => array(
          'href' => $touch_icon_l,
          'rel' => "shortcut icon",
        ),
      );
      $head_elements['adaptivetheme_touch_icon_low'] = array(
        '#type' => 'html_tag',
        '#tag' => 'link',
        '#weight' => -98,
        '#attributes' => array(
          'href' => $touch_icon_l,
          'rel' => "apple-touch-icon-processed",
        ),
      );
    }

    // medium
    $apple_touch_icon_path_m = check_plain(at_get_setting('apple_touch_icon_path_m', $theme_name));
    if (!empty($apple_touch_icon_path_m)) {
      $m = drupal_get_path('theme', $theme_name) . '/' . $apple_touch_icon_path_m;
      $touch_icon_m = file_create_url($m);
      $head_elements['adaptivetheme_touch_icon_medium'] = array(
        '#type' => 'html_tag',
        '#tag' => 'link',
        '#weight' => -99,
        '#attributes' => array(
          'href' => $touch_icon_m,
          'rel' => "apple-touch-icon-processed",
          'sizes' => "72x72",
        ),
      );
    }

    // high
    $apple_touch_icon_path_h = check_plain(at_get_setting('apple_touch_icon_path_h', $theme_name));
    if (!empty($apple_touch_icon_path_h)) {
      $h = drupal_get_path('theme', $theme_name) . '/' . $apple_touch_icon_path_h;
      $touch_icon_h = file_create_url($h);
      $head_elements['adaptivetheme_touch_icon_high'] = array(
        '#type' => 'html_tag',
        '#tag' => 'link',
        '#weight' => -100,
        '#attributes' => array(
          'href' => $touch_icon_h,
          'rel' => "apple-touch-icon-processed",
          'sizes' => "114x114",
        ),
      );
    }

  }
}

/**
 * hook_js_alter()
 */
function adaptivetheme_js_alter(&$javascript) {
  // Use our own vesion of vertical-tabs.js for better error handling
  // @see http://drupal.org/node/607752
  if (isset($javascript['misc/vertical-tabs.js'])) {
    $file = drupal_get_path('theme', 'adaptivetheme') . '/scripts/vertical-tabs.js';
    $javascript['misc/vertical-tabs.js'] = drupal_js_defaults($file);
  }
}

/**
 * hook_css_alter()
 */
function adaptivetheme_css_alter(&$css) {
  global $theme_key, $language;

  // Never allow this to run in our admin theme and only if the extension is enabled.
  if (at_get_setting('enable_exclude_css') === 1 && $theme_key !== 'adaptivetheme_admin') {

    // Get $css_data from the cache
    if ($cache = cache_get('at_get_css_files')) {
      $css_data = $cache->data;
    }
    else {
      $css_data = at_get_css_files($theme_key);
    }

    // We need the right theme name to get the theme settings
    $_get_active_theme_data = array_pop($css_data);
    if ($_get_active_theme_data['type'] == 'theme') {
      $theme_name = $_get_active_theme_data['source'];
    }
    else {
      $theme_name = $theme_key;
    }

    // Get the theme setting and unset files
    foreach ($css_data as $key => $value) {
      $setting = 'unset_css_' . drupal_html_class($key);
      if (at_get_setting($setting, $theme_name) === 1) {
        if (isset($css[$key])) {
          unset($css[$key]);
        }
      }
    }

    // Unset -rtl.css files if language dir is RTL, in some contexts dir is
    // unset, but I don't know if this is a core bug or not.
    if (isset($language->dir) && $language->dir === 'rtl') {
      foreach ($css_data as $key => $value) {
        $setting = 'unset_css_' . drupal_html_class($key);
        if (at_get_setting($setting, $theme_name) === 1) {
          $key = str_replace('.css', '-rtl.css', $key);
          if (isset($css[$key])) {
            unset($css[$key]);
          }
        }
      }
    }
  }
}

/**
 * hook_page_alter()
 */
function adaptivetheme_page_alter(&$page) {

  // Look in each visible region for blocks.
  foreach (system_region_list($GLOBALS['theme'], REGIONS_VISIBLE) as $region => $name) {
    if (!empty($page[$region])) {

      // Find the last block in the region.
      $blocks = array_reverse(element_children($page[$region]));
      while ($blocks && !isset($page[$region][$blocks[0]]['#block'])) {
        array_shift($blocks);
      }
      if ($blocks) {
        $page[$region][$blocks[0]]['#block']->last_in_region = TRUE;
      }
    }
  }
}

/**
 * hook_form_FORM_alter()
 */
function adaptivetheme_form_alter(&$form, &$form_state, $form_id) {

  // Collapse Noggin fieldset by default
  if ($form_id == 'system_theme_settings') {
    if (module_exists('noggin')) {
      $form['noggin']['#collapsible'] = TRUE;
      $form['noggin']['#collapsed'] = TRUE;
    }
  }
}

/**
 * hook_form_FORM_ID_alter()
 */
function adaptivetheme_form_search_form_alter(&$form, $form_state) {

  // The problem with Drupals standard Advanced search form is that each
  // criterion group is wrapped in a DIV, whereas it should be a fieldset with
  // a legend, this is better semantics and improves accessibility by
  // logically grouping field items.
  if (at_get_setting('adv_search_extra_fieldsets') === 1) {
    if (isset($form['module']) && $form['module']['#value'] == 'node' && user_access('use advanced search')) {
      // Keyword boxes:
      $form['advanced'] = array(
        '#type' => 'fieldset',
        '#title' => t('Advanced search'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#attributes' => array('class' => array('search-advanced')),
      );
      $form['advanced']['keywords-fieldset'] = array(
        '#type' => 'fieldset',
        '#title' => t('Keywords'),
        '#collapsible' => FALSE,
      );
      $form['advanced']['keywords-fieldset']['keywords'] = array(
        '#prefix' => '<div class="criterion">',
        '#suffix' => '</div>',
      );
      $form['advanced']['keywords-fieldset']['keywords']['or'] = array(
        '#type' => 'textfield',
        '#title' => t('Containing any of the words'),
        '#size' => 30,
        '#maxlength' => 255,
      );
      $form['advanced']['keywords-fieldset']['keywords']['phrase'] = array(
        '#type' => 'textfield',
        '#title' => t('Containing the phrase'),
        '#size' => 30,
        '#maxlength' => 255,
      );
      $form['advanced']['keywords-fieldset']['keywords']['negative'] = array(
        '#type' => 'textfield',
        '#title' => t('Containing none of the words'),
        '#size' => 30,
        '#maxlength' => 255,
      );
      // Node types:
      $types = array_map('check_plain', node_type_get_names());
      $form['advanced']['types-fieldset'] = array(
        '#type' => 'fieldset',
        '#title' => t('Types'),
        '#collapsible' => FALSE,
      );
      $form['advanced']['types-fieldset']['type'] = array(
        '#type' => 'checkboxes',
        '#prefix' => '<div class="criterion">',
        '#suffix' => '</div>',
        '#options' => $types,
      );
      $form['advanced']['submit'] = array(
        '#type' => 'submit',
        '#value' => t('Advanced search'),
        '#prefix' => '<div class="action advanced-search-submit">',
        '#suffix' => '</div>',
        '#weight' => 99,
      );
      // Languages:
      $language_options = array();
      foreach (language_list('language') as $key => $entity) {
        $language_options[$key] = $entity->name;
      }
      if (count($language_options) > 1) {
        $form['advanced']['lang-fieldset'] = array(
          '#type' => 'fieldset',
          '#title' => t('Languages'),
          '#collapsible' => FALSE,
          '#collapsed' => FALSE,
        );
        $form['advanced']['lang-fieldset']['language'] = array(
          '#type' => 'checkboxes',
          '#prefix' => '<div class="criterion">',
          '#suffix' => '</div>',
          '#options' => $language_options,
        );
      }
      $form['#validate'][] = 'node_search_validate';
    }
  }
}

/**
 * hook_form_BASE_FORM_ID_alter()
 */
function adaptivetheme_form_node_form_alter(&$form, &$form_state, $form_id) {
  // Remove if #1245218 is backported to D7 core.
  foreach (array_keys($form) as $item) {
    if (strpos($item, 'field_') === 0) {
      if (!empty($form[$item]['#attributes']['class'])) {
        foreach ($form[$item]['#attributes']['class'] as &$class) {
          if (strpos($class, 'field-type-') === 0 || strpos($class, 'field-name-') === 0) {
            // Make the class different from that used in theme_field().
            $class = $class . '-form';
          }
        }
      }
    }
  }
}

/**
 * Set a class on the iframe body element for WYSIWYG editors. This allows you
 * to easily override the background for the iframe body element.
 * This only works for the WYSIWYG module: http://drupal.org/project/wysiwyg
 */
function adaptivetheme_wysiwyg_editor_settings_alter(&$settings, &$context) {
  $settings['bodyClass'] = 'wysiwygeditor';
}

/**
 * Adaptivetheme implimentation of hook_menu_alter()
 */
function adaptivetheme_menu_alter(&$items) {
  // Add a menu item to display all panels layouts on one page
  $items['atcore-debug-panels']['title'] = t('AT Core Debug Panels');
  $items['atcore-debug-panels']['type'] = MENU_CALLBACK;
  $items['atcore-debug-panels']['page callback'] = 'at_debug_panels';
  $items['atcore-debug-panels']['weight'] = 100;
  $items['atcore-debug-panels']['access arguments'] = array('administer themes');
}

/**
 * Callback function for at-core-debug-panels menu item.
 */
function at_debug_panels() {

  $file = drupal_get_path('theme', 'adaptivetheme') . '/css/debug-panels.css';
  drupal_add_css($file, array(
    'preprocess' => FALSE,
    'group' => CSS_THEME,
    'media' => 'screen',
    'every_page' => FALSE,
    'weight' => 2000,
    )
  );

  $output = <<<EOF
<div class="all-panel-layouts debug-panels" style="font-size: 81.3%">

    <div class="at-panel panel-display one-column clearfix">
      <div class="region region-one-main">
        <div class="region-inner clearfix">
        </div>
      </div>
    </div>

    <div class="at-panel panel-display two-50 clearfix">
      <div class="region region-two-50-top region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-two-50-first">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-two-50-second">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-two-50-bottom region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
    </div>

    <div class="at-panel panel-display two-33-66 clearfix">
      <div class="region region-two-33-66-top region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-two-33-66-first">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-two-33-66-second">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-two-33-66-bottom region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
    </div>

    <div class="at-panel panel-display two-66-33 clearfix">
      <div class="region region-two-66-33-top region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-two-66-33-first">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-two-66-33-second">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-two-66-33-bottom region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
    </div>

    <div class="at-panel panel-display two-brick clearfix">
      <div class="region region-two-brick-top region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="panel-row row-1 clearfix">
        <div class="region region-two-brick-left-above">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-two-brick-right-above">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
      <div class="region region-two-brick-middle region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="panel-row row-2 clearfix">
        <div class="region region-two-brick-left-below">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-two-brick-right-below">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
      <div class="region region-two-brick-bottom region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
    </div>

    <div class="at-panel panel-display three-3x33 clearfix">
      <div class="region region-three-33-top region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-33-first">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-33-second">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-33-third">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-33-bottom region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
    </div>

    <div class="at-panel panel-display three-25-50-25 clearfix">
      <div class="region region-three-25-50-25-top region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-25-50-25-first">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-25-50-25-second">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-25-50-25-third">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-25-50-25-bottom region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
    </div>

    <div class="at-panel panel-display three-25-25-50 clearfix">
      <div class="region region-three-25-25-50-top region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-25-25-50-first">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-25-25-50-second">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-25-25-50-third">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-25-25-50-bottom region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
    </div>

    <div class="at-panel panel-display three-50-25-25 clearfix">
      <div class="region region-three-50-25-25-top region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-50-25-25-first">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-50-25-25-second">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-50-25-25-third">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="region region-three-50-25-25-bottom region-conditional-stack">
        <div class="region-inner clearfix">
        </div>
      </div>
    </div>

    <div class="at-panel panel-display four-4x25 clearfix">
      <div class="panel-row row-1 clearfix">
        <div class="region region-four-first">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-four-second">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
      <div class="panel-row row-2 clearfix">
        <div class="region region-four-third">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-four-fourth">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
    </div>

    <div class="at-panel panel-display five-5x20 clearfix">
      <div class="panel-row row-1 clearfix">
        <div class="region region-five-first">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-five-second">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
      <div class="panel-row row-2 clearfix">
        <div class="region region-five-third">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-five-fourth">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-five-fifth">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
    </div>

    <div class="at-panel panel-display six-6x16 multicolumn clearfix">
      <div class="panel-row row-1 clearfix">
        <div class="region region-six-first">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-six-second">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
      <div class="panel-row row-2 clearfix">
        <div class="region region-six-third">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-six-fourth">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
      <div class="panel-row row-3 clearfix">
        <div class="region region-six-fifth">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-six-sixth">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
    </div>

    <div class="at-panel panel-panel three-inset-left clearfix">
      <div class="region region-three-inset-left-sidebar">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="inset-wrapper clearfix">
        <div class="region region-three-inset-left-top region-conditional-stack">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-three-inset-left-middle">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-three-inset-left-inset">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-three-inset-left-bottom region-conditional-stack">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
    </div>

    <div class="at-panel panel-panel three-inset-right clearfix">
      <div class="region region-three-inset-right-sidebar">
        <div class="region-inner clearfix">
        </div>
      </div>
      <div class="inset-wrapper clearfix">
        <div class="region region-three-inset-right-top region-conditional-stack">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-three-inset-right-middle">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-three-inset-right-inset">
          <div class="region-inner clearfix">
          </div>
        </div>
        <div class="region region-three-inset-right-bottom region-conditional-stack">
          <div class="region-inner clearfix">
          </div>
        </div>
      </div>
    </div>

</div>
EOF;

  return $output;
}
