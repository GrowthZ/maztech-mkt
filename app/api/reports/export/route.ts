import { PDFDocument, StandardFonts } from 'pdf-lib';
import * as XLSX from 'xlsx';
import { getCurrentUser } from '@/lib/auth';
import { isAdmin } from '@/lib/permissions';
import { fail, handleApiError } from '@/lib/api-response';
import { allReports } from '@/server/reports';

function asBuffer(workbook: XLSX.WorkBook) {
  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('UNAUTHORIZED');
    if (!isAdmin(user)) throw new Error('FORBIDDEN');

    const url = new URL(request.url);
    const format = url.searchParams.get('format');
    const reports = await allReports(Object.fromEntries(url.searchParams.entries()), user);

    if (format === 'xlsx') {
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(reports.content), 'Tong hop content');
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(reports.fanpage), 'Fanpage');
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(reports.seo), 'SEO');
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(reports.adsByBrand), 'Ads');
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(reports.source), 'Nguon data');
      XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(reports.dailyRows), 'Data theo ngay');
      const buffer = asBuffer(workbook);

      return new Response(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="maztech-mkt-hub-report.xlsx"'
        }
      });
    }

    if (format === 'pdf') {
      const pdf = await PDFDocument.create();
      const page = pdf.addPage([842, 595]);
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      let y = 560;

      const lines = [
        'Maztech MKT Hub - Bao cao tong hop',
        `Nam: tong bai ${reports.dashboard.nam.total}, SEO ${reports.dashboard.nam.seo}`,
        `Duc: tong bai ${reports.dashboard.duc.total}, SEO ${reports.dashboard.duc.seo}`,
        `Ads: chi tieu ${reports.ads.spend}, mess ${reports.ads.messages}, data ${reports.ads.data}`,
        `Data dau vao: tong ${reports.data.total}, Winhome ${reports.data.winhome}, Sieu Thi Ke Gia ${reports.data.sieuThiKeGia}`,
        'Top fanpage:'
      ];

      for (const line of lines) {
        page.drawText(line, { x: 40, y, size: 12, font });
        y -= 20;
      }

      for (const item of reports.fanpage.slice(0, 10)) {
        page.drawText(`- ${item.fanpage}: ${item.total}`, { x: 60, y, size: 11, font });
        y -= 18;
      }

      const bytes = await pdf.save();
      const body = new Blob([bytes], { type: 'application/pdf' });

      return new Response(body, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="maztech-mkt-hub-report.pdf"'
        }
      });
    }

    return fail('Định dạng export không hợp lệ', 400);
  } catch (error) {
    return handleApiError(error);
  }
}
