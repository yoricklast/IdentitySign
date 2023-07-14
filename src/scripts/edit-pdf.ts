import { StandardFonts, type PDFDocument, rgb } from "pdf-lib";

/**
 * Adds a signature and banner to a PDF.
 * @param input PDF document to sign.
 * @param signature The signature to add.
 * @returns PDF document containing the signature and banner.
 */
export async function editPdf(
  input: PDFDocument,
  signature: string
): Promise<PDFDocument> {
  const courierFont = await input.embedFont(StandardFonts.Courier);
  const helvetFont = await input.embedFont(StandardFonts.Helvetica);
  const helvetBoldFont = await input.embedFont(StandardFonts.HelveticaBold);
  const DEFAULT_FONT_SIZE = 10;

  const firstPage = input.getPage(0);
  const { width, height } = input.getPage(0).getSize();

  input.addPage([width, height]);
  const pages = input.getPages();
  const lastPage = pages[input.getPageCount() - 1];

  const BADGE_URL = "/badge.png";
  const badgeBytes = await fetch(BADGE_URL).then((res) => res.arrayBuffer());
  const badge = await input.embedPng(badgeBytes);
  const badgeDims = badge.scale(0.05);

  firstPage.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: badgeDims.height + 10,
    color: rgb(0.1, 0.1, 0.1),
    opacity: 0.75,
  });
  firstPage.drawImage(badge, {
    x: 5,
    y: 5,
    width: badgeDims.width,
    height: badgeDims.height,
  });

  lastPage.drawText(
    "Signed using IdentitySign, verify this document at https://identitysign-prototype.cs.ru.nl/.",
    {
      x: 50,
      y: height - 5 * DEFAULT_FONT_SIZE,
      size: 12,
      font: helvetBoldFont,
      color: rgb(0, 0, 0),
    }
  );
  lastPage.drawText(
    "This page contains information needed by IdentitySign to verify the document.",
    {
      x: 50,
      y: height - 7 * DEFAULT_FONT_SIZE,
      size: DEFAULT_FONT_SIZE,
      font: helvetFont,
      color: rgb(0, 0, 0),
    }
  );
  lastPage.drawText(signature, {
    x: 50,
    y: height - 9 * DEFAULT_FONT_SIZE,
    size: 3,
    font: courierFont,
    color: rgb(0, 0, 0),
    maxWidth: 10,
  });

  return input;
}
