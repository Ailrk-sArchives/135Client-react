/*
 * Exports json to different types.
 */
import * as XmlJs from 'xml-js';
import * as CsvJs from 'json2csv';
import * as XlsxJs from 'xlsx';

export type ContentType =
  | "text/plain"
  | "application/vnd.ms-excel"
  | "text/xml"
  | "text/csv"
  | "text/json";

export function download(content: string, fileName: string, contentType: ContentType) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  a.remove();
}


export class Export {
  static downloadJson(data: any | undefined, fileName: string) {
    // rudimentary version.
    let content: string = "";
    if (data == undefined)
      content = JSON.stringify([]);
    else
      content = JSON.stringify(data);

    download(content, fileName, "text/json");
  }

  static downloadXml(data: any | undefined, fileName: string) {
    // rudimentary version.
    let content: string = "";
    if (data == undefined)
      content = XmlJs.js2xml([], {compact: true, spaces: 4});
    else
      content = XmlJs.js2xml(data, {compact: true, spaces: 4});

    download(content, fileName, "text/xml");
  }

  static downloadCsv(data: any | undefined, fileName: string) {
    // rudimentary version.
    let content: string = "";
    if (data == undefined)
      content = CsvJs.parse([]);
    else
      content = CsvJs.parse(data);

    download(content, fileName, "text/csv");
  }

  static downloadXlsx(data: any | undefined, fileName: string) {
    let wb: XlsxJs.WorkBook = XlsxJs.utils.book_new();
    if (data == undefined)
      XlsxJs.utils.book_append_sheet(
        wb,
        XlsxJs.utils.json_to_sheet([]),
        "data");
    else
      XlsxJs.utils.book_append_sheet(
        wb,
        XlsxJs.utils.json_to_sheet(data),
        "data");
    console.log(wb);

    XlsxJs.writeFile(wb, fileName, {bookType: "xlsx"});
  }
}

