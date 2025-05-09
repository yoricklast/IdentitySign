import { StandardFonts, type PDFDocument, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
//If needed succes code

/**
 * Adds a signature and banner to a PDF.
 * @param input PDF document to sign.
 * @param signature The signature to add.
 * @returns PDF document containing the signature and banner.
 */
export async function editPdf(
  input: PDFDocument,
  signature: string,
  successCode: string,
): Promise<PDFDocument> {
  const regularFontUrl = "/opensans/OpenSans-Regular.ttf";
  const boldFontUrl = "/opensans/OpenSans-Bold.ttf";

  const boldFontBytes = await fetch(boldFontUrl).then((res) =>
    res.arrayBuffer(),
  );
  const regularFontBytes = await fetch(regularFontUrl).then((res) =>
    res.arrayBuffer(),
  );

  input.registerFontkit(fontkit);
  const openSansFont = await input.embedFont(regularFontBytes);
  const openSansBoldFont = await input.embedFont(boldFontBytes);

  // TODO: Replace with open font
  const courierFont = await input.embedFont(StandardFonts.Courier);

  const DEFAULT_FONT_SIZE = 10;

  const firstPage = input.getPage(0);
  const { width, height } = input.getPage(0).getSize();

  input.addPage([width, height]);
  const pages = input.getPages();
  const lastPage = pages[input.getPageCount() - 1];

  const BADGE_URL = "/img/logo_white.png";
  const badgeBytes = await fetch(BADGE_URL).then((res) => res.arrayBuffer());
  const badge = await input.embedPng(badgeBytes);
  const badgeDims = badge.scaleToFit(40, 40);

  firstPage.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: badgeDims.height + 10,
    color: rgb(0.1, 0.1, 0.1),
    opacity: 0.75,
  });
  firstPage.drawImage(badge, {
    x: 10,
    y: 5,
    width: badgeDims.width,
    height: badgeDims.height,
  });
  firstPage.drawText("This document is digitally signed using IdentitySign!", {
    x: 60,
    y: 28,
    size: 14,
    font: openSansBoldFont,
    color: rgb(1, 1, 1),
  });
  firstPage.drawText(
    "Before trusting this document, verify it at: https://identitysign-prototype.cs.upb.de/",
    {
      x: 60,
      y: 12,
      size: 11,
      font: openSansFont,
      color: rgb(1, 1, 1),
    },
  );

  lastPage.drawText("Signed using IdentitySign", {
    x: 30,
    y: height - 5 * DEFAULT_FONT_SIZE,
    size: 12,
    font: openSansBoldFont,
    color: rgb(0, 0, 0),
  });
  lastPage.drawText(
    "This page contains information needed by IdentitySign to verify the document.",
    {
      x: 30,
      y: height - 6.5 * DEFAULT_FONT_SIZE,
      size: DEFAULT_FONT_SIZE,
      font: openSansFont,
      color: rgb(0, 0, 0),
    },
  );
  lastPage.drawText(signature, {
    x: 30,
    y: height - 9 * DEFAULT_FONT_SIZE,
    size: 3,
    font: courierFont,
    color: rgb(0, 0, 0),
    maxWidth: 10,
  });
  lastPage.drawText(`Your success-code is: ${successCode}`, {
    x: 30,
    y: height - 12 * DEFAULT_FONT_SIZE,
    size: 18,
    font: openSansBoldFont,
    color: rgb(0, 0, 0),
  });

  return input;
}
