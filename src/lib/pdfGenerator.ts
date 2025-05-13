import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export async function generateInvoicePDF(invoiceData: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;

  page.drawText(`Rechnung für ${invoiceData.kunde.name}`, {
    x: 50,
    y: height - 50,
    size: fontSize,
    font,
    color: rgb(0, 0, 0),
  });

  // Weitere Inhalte hinzufügen...

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
