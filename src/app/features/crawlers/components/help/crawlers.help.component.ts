/* tslint:disable:max-line-length */
import { Component, Inject, OnInit, ViewChild } from '@angular/core';

@Component({
    templateUrl: './crawlers.help.component.html',
})
export class CrawlersHelpComponent implements OnInit {

    public crawlerFields: any[] = [
        {
            key: 'Name',
            validation: 'Required</br>Unique</br>Max length 100 chars</br>Alphanumeric</br>Special characters allowed are _.',
            description: 'Name without spaces'
        },
        {
            key: 'Fetch interval',
            validation: 'Integer</br>Required</br>Min value -1</br>Max value 1 year',
            description: 'Revisit a page daily, set it to -1 to never re-fetch a page.' +
                ' In minutes - how to schedule re-visits of pages. 1 Day by default. This is used by the <a href="https://github.com/DigitalPebble/storm-crawler/blob/master/core/src/main/java/com/digitalpebble/stormcrawler/persistence/DefaultScheduler.java">DefaultScheduler</a>. If you need customized scheduling logic, just implement your own <a href="https://github.com/DigitalPebble/storm-crawler/blob/master/core/src/main/java/com/digitalpebble/storm/crawler/persistence/Scheduler.java">Scheduler</a>. <strong>Note:</strong> the Scheduler class is not yet configurable. See or update (this issue)[https://github.com/DigitalPebble/storm-crawler/issues/104] if you need this behavior. Should be quite easy to make the implemetation class configurable.'
        },
        {
            key: 'Fetch interval when errors',
            validation: 'Integer</br>Required</br>Min value -1</br>Max value 1 year',
            description: 'In minutes - how often to re-visit pages with an error (HTTP 4XX or 5XX). Every month by default. Set it to -1 to never refetch a page.' +
                ' Identified by tuples in the (StatusStream)[https://github.com/DigitalPebble/storm-crawler/wiki/StatusStream] with the state of <code>ERROR</code>.'
        },
        {
            key: 'Fetch interval when fetch errors',
            validation: 'Integer</br>Required</br>Min value -1</br>Max value 1 year',
            description: 'In minutes, how often to re-visit pages with a fetch error. Every two hours by default.' +
                ' Identified by tuples in the (StatusStream)[https://github.com/DigitalPebble/storm-crawler/wiki/StatusStream] with the state of <code>FETCH_ERROR'
        },
        {
            key: 'Disable text extraction',
            validation: 'Boolean</br>Required',
            description: 'Enable to stop extracting any text at all.'
        },
        {
            key: 'Text extractor include patterns',
            validation: 'Text</br>Empty allowed',
            description: 'Extract text only from specified elements/patterns. If empty then extract all text from html body.' +
                '</br>A list of regex patterns for <code>TextExtractor</code> to match text against. Only text matching the patterns will be returned.'
        },
        {
            key: 'Text extractor exclude tags',
            validation: 'Text</br>Empty allowed',
            description: 'Exclude text contained in the specified html tags/element.' +
                '</br>A list of HTML tags that should be ignored when the <code>TextExtractor</code> is searching for text.'
        },
        {
            key: 'Http content limit',
            validation: 'Integer</br>Required</br>Min value -1</br>Max value 2147483647',
            description: 'The maximum number of bytes for returned HTTP response bodies. By default no limit is applied.' +
                '</br>In the generated archetype a limit of <code>65536</code> is present.'
        },
        {
            key: 'Emit Outlinks',
            validation: 'Boolean</br>Required',
            description: 'Whether or not to emit outgoing links found in the parsed HTML document. URL Filters are applied to outgoing links before they are emitted. This option being true is crucial if you are building a recursive crawler.'
        },
        {
            key: 'Maximum emit outlinks per page',
            validation: 'Integer</br>Required</br>Min value -1</br>Max value 2147483647',
            description: 'Limits the number of links sent from a page.'
        },
        {
            key: 'XPathFilter',
            validation: 'JSON</br>Empty allowed',
            description: ''
        },
        {
            key: '<strong>BasicURLFilter</strong></br>Maximum path repetition',
            validation: 'Integer</br>Required</br>Min value 1</br>Max value 10',
            description: 'The maximum repetitions of a path element in order for a URL to be ignored. -1 disables the filter. Example:http://www.mysite.com/random/test/words/test/agian/test then "test" appears 3 times and url will be excluded.'
        },
        {
            key: '<strong>BasicURLFilter</strong></br>Maximum length',
            validation: 'Integer</br>Required</br>Min value 0</br>Max value 1024',
            description: 'The maximum length of a URL.</br>0 disables the filter.'
        },
        {
            key: '<strong>MaxDepthFilter</strong></br>Maximum depth',
            validation: 'Integer</br>Required</br>Min value -1</br>Max value 2147483647',
            description: 'Discover and crawl new links from a url. -1 disables the filter. 0 any url found will not be crawled.'
        },
        {
            key: '<strong>BasicURLNormalizer</strong></br>Remove anchor part',
            validation: 'Boolean</br>Required',
            description: 'Remove anchor from URL. Example: http://foo.com#abc -> http://foo.com.'
        },
        {
            key: '<strong>BasicURLNormalizer</strong></br>Unmangle query string',
            validation: 'Boolean</br>Required',
            description: 'A common error to find is a query string that starts with an & instead of a ?. This will fix that error. So http://foo.com&a=b will be changed to http://foo.com?a=b.'
        },
        {
            key: '<strong>BasicURLNormalizer</strong></br>Check valid URI',
            validation: 'Boolean</br>Required',
            description: 'Checks the validity of a URI.'
        },
        {
            key: '<strong>HostURLFilter</strong></br>Ignore outside host',
            validation: 'Boolean</br>Required',
            description: ''
        },
        {
            key: '<strong>HostURLFilter</strong></br>Ignore outside domain',
            validation: 'Boolean</br>Required',
            description: ''
        },
        {
            key: 'RegexURLFilter',
            validation: 'Text</br>Empty Allowed',
            description: ''
        },
        {
            key: 'FastURLFilter',
            validation: 'JSON</br>Empty Allowed',
            description: 'URL filter based on regex patterns and organised by [host | domain | metadata | global]. For a given URL, the scopes are tried in the order given above and the URL is kept or removed based on the first matching rule. The default policy is to accept a URL if no matches are found.'
        }
    ];

    constructor() {
    }

    ngOnInit() {
    }

}
