export const XPathFilterDefault: string = '{\n' +
    '  "canonical": "//*[@rel=\\"canonical\\"]/@href",\n' +
    '  "parse.description": [\n' +
    '      "//*[@name=\\"description\\"]/@content",\n' +
    '      "//*[@name=\\"Description\\"]/@content"\n' +
    '   ],\n' +
    '  "parse.title": [\n' +
    '      "//TITLE",\n' +
    '      "//META[@name=\\"title\\"]/@content"\n' +
    '   ],\n' +
    '   "parse.keywords": "//META[@name=\\"keywords\\"]/@content"\n' +
    '}';

export const RegexURLFilterDefault: string = '# skip URLs with slash-delimited segment that repeats 3+ times, to break loops\n' +
    '# very time-consuming : use BasicURLFilter instead\n' +
    '# -.*(/[^/]+)/[^/]+\\1/[^/]+\\1/\n' +
    '# accept anything else\n' +
    '# +.';

export const FastURLFilterDefault: string = '[{\n' +
    '         "scope": "GLOBAL",\n' +
    '         "patterns": [\n' +
    '             "DenyPathQuery \\\\.jpg"\n' +
    '         ]\n' +
    '     },\n' +
    '     {\n' +
    '         "scope": "domain:stormcrawler.net",\n' +
    '         "patterns": [\n' +
    '             "AllowPath /digitalpebble/",\n' +
    '             "DenyPath .+"\n' +
    '         ]\n' +
    '     },\n' +
    '     {\n' +
    '         "scope": "metadata:key=value",\n' +
    '         "patterns": [\n' +
    '             "DenyPath .+"\n' +
    '         ]\n' +
    '     }\n' +
    ' ]';
