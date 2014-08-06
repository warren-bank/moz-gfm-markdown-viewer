Components.utils.import("chrome://gfm-markdown-viewer/content/generate_stream_converter.js");

var this_stream_converter = (function(){
	var class_description, class_id, from_mime_type;

	class_description	= "GitHub Flavored Markdown (GFM) to HTML stream converter";
	class_id			= "{d50fda51-8a73-4c75-b265-97e02ceef352}";
	from_mime_type		= "text/vnd.daringfireball.markdown";

	generate_stream_converter(class_description, class_id, from_mime_type);

	return GFM_MarkdownViewer.StreamConverters[class_id];
})();

if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([ this_stream_converter ]);
else
    var NSGetModule  = XPCOMUtils.generateNSGetModule( [ this_stream_converter ]);
