Components.utils.import("chrome://gfm-markdown-viewer/content/generate_stream_converter.js");

var this_stream_converter = (function(){
	var class_description, class_id, from_mime_type;

	class_description	= "GitHub Flavored Markdown (GFM) to HTML stream converter";
	class_id			= "{37edc36a-d524-4186-a0b4-b2297775bfcd}";
	from_mime_type		= "text/x-markdown";

	generate_stream_converter(class_description, class_id, from_mime_type);

	return GFM_MarkdownViewer.StreamConverters[class_id];
})();

if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([ this_stream_converter ]);
else
    var NSGetModule  = XPCOMUtils.generateNSGetModule( [ this_stream_converter ]);
