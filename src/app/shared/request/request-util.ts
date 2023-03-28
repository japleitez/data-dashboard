import { HttpParams, HttpResponse } from '@angular/common/http';

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();

  if (req) {
    Object.keys(req).forEach(key => {
      if (key !== 'sort') {
        options = options.set(key, req[key]);
      }
    });

    if (req.sort) {
      req.sort.forEach((val: string) => {
        options = options.append('sort', val);
      });
    }
  }

  return options;
};

export const sortById = (): string[] => {
    return ['id,asc'];
};

export class RequestUtil {

    public static getTotalLengthHeader(response: HttpResponse<any>): number {
        return Number(response.headers.get(HeaderNames.XTotalCount));
    }
}

/**
 * Header Names.
 */
export const HeaderNames = {

    Authorization: 'Authorization',

    ETag: 'ETag',

    IfNoneMatch: 'If-None-Match',

    IfMatch: 'If-Match',

    IfModifiedSince: 'If-Modified-Since',

    LastModified: 'last-modified',

    ContentType: 'Content-Type',

    ContentDisposition: 'Content-Disposition',

    Accept: 'Accept',

    AcceptEncoding: 'Accept-Encoding',

    CacheControl: 'Cache-Control',

    XRequestedWith: 'X-Requested-With',

    XTotalCount: 'X-Total-Count'

};

/**
 * Http constants.
 */
export const HttpConstants = {

    BearerPrefix: 'Bearer',

    MediaApplicationJson: 'application/json',

    MediaApplicationXml: 'application/xml',

    MediaTextPlain: 'text/plain',

    MediaApplicationZip: 'application/zip',

    MediaApplicationOctetStream: 'application/octet-stream',

    MediaApplicationPdf: 'application/pdf',

    MediaMultipartFormData: 'multipart/form-data',

    EncodingGZip: 'gzip',

    XMLHttpRequest: 'XMLHttpRequest',
};
