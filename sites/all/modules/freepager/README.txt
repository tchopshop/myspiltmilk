This module allows you to use Views to create simple forward/next pagers. It
provides a new display, Pager block, which will create a block with pager for
items listed in the view.

The display a few settings:
* Field containing path: For the pager to work, one of the view's fields must
  contain the paths associated with the items you're listing. This could for
  example be a node ID field rewritten to the form 'node/[nid]'. The content of
  this field will be matched against the current path, and used to determine
  current, previous and next item.
* Field for 'previous': The field set here will be used as the link to the
  previous item. This could for example be a node title, a thumbnail image,
  the view counter field or a custom fixed text. You can of course also use the
  field rewrite functionality to combine the content of several fields. Please
  note that the field will become linked when rendered – avoid adding links
  in the field itself.
* Field for 'next': Works just like the 'previous', but for linking to the next
  item in the list.
* Field for 'current': The pager also shows the current item, just like the
  previous and next. This output is not linked.


Using Free pager you could for example do the following:

* Create a view of all users, sorted alphabetically, and display it as a block
  to allow browsing of users. Or restrict it to users of a particular role,and
  you can browse editors on the site. Or whatever.
* Create a view of all comments on the site, and you can browse forward/backward
  between comments. Or restrict the list to comments on the active node, and you
  can browse forward/backward between only these comments.
* If you have seven administration pages that editors should visit often, you
  could even have Views listing these seven URLs and then have pagers on
  administration pages!

And more. As long as you can get a list of URLs into views, you can display it
as a pager. Easy as that!
