Components.utils.import("chrome://gfm-markdown-viewer/content/generate_stream_converter.js");

var this_stream_converter = (function(){
	var class_description, class_id, from_mime_type;

	class_description	= "GitHub Flavored Markdown (GFM) to HTML stream converter";
	class_id			= "{bb2d3abf-80a3-4355-832c-fa9249a2db24}";
	from_mime_type		= "text/plain";

	generate_stream_converter(class_description, class_id, from_mime_type);

	return GFM_MarkdownViewer.StreamConverters[class_id];
})();

if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([ this_stream_converter ]);
else
    var NSGetModule  = XPCOMUtils.generateNSGetModule( [ this_stream_converter ]);
