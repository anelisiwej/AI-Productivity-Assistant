// Client-side export helpers for the generated cover letter / email.

import { Document, Packer, Paragraph, TextRun } from "docx";
import jsPDF from "jspdf";

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function toParagraphs(text: string): string[] {
  // Preserve blank lines as paragraph breaks; collapse trailing whitespace.
  return text.replace(/\r\n/g, "\n").split(/\n/);
}

export async function downloadCoverLetterDocx(
  text: string,
  filename = "CareerMate_Cover_Letter.docx",
): Promise<void> {
  const lines = toParagraphs(text);
  const paragraphs = lines.map(
    (line) =>
      new Paragraph({
        spacing: { after: 160 },
        children: [new TextRun({ text: line, font: "Calibri", size: 22 })],
      }),
  );

  const doc = new Document({
    creator: "CareerMate AI",
    title: "CareerMate Cover Letter",
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 22 } },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
          },
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  triggerDownload(blob, filename);
}

export function downloadCoverLetterPdf(
  text: string,
  filename = "CareerMate_Cover_Letter.pdf",
): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 56; // ~0.78"
  const marginY = 64;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = pageWidth - marginX * 2;
  const lineHeight = 16;

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(11);

  const paragraphs = toParagraphs(text);
  let y = marginY;

  for (const para of paragraphs) {
    if (para.trim() === "") {
      y += lineHeight * 0.6;
      continue;
    }
    const wrapped = doc.splitTextToSize(para, usableWidth) as string[];
    for (const line of wrapped) {
      if (y + lineHeight > pageHeight - marginY) {
        doc.addPage();
        y = marginY;
      }
      doc.text(line, marginX, y);
      y += lineHeight;
    }
    y += lineHeight * 0.3; // paragraph gap
  }

  doc.save(filename);
}
