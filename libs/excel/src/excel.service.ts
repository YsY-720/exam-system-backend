import { Injectable, StreamableFile } from "@nestjs/common";
import { Workbook, type Column } from "exceljs";
import { PassThrough } from "node:stream";

@Injectable()
export class ExcelService {
  async export(
    columns: Partial<Column>[],
    data: Array<Record<string, any>>,
    fileName: string,
  ) {
    const workbook = new Workbook();

    const worksheet = workbook.addWorksheet("test");

    worksheet.columns = columns;

    worksheet.addRows(data);

    const stream = new PassThrough();
    await workbook.xlsx.write(stream);

    return new StreamableFile(stream, {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      disposition: `attachment; filename=${ fileName }`
    });
  }
}
