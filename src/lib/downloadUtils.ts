import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export interface SummarySection {
  heading: string;
  content: string;
}

export interface SummaryData {
  title: string;
  sections: SummarySection[];
}

export type DownloadFormat = "txt" | "pdf" | "docx" | "csv";

export const downloadSummary = async (
  summaryData: SummaryData,
  format: DownloadFormat
): Promise<void> => {
  try {
    switch (format) {
      case "txt": {
        const content =
          `${summaryData.title}\n${"=".repeat(summaryData.title.length)}\n\n` +
          summaryData.sections
            .map(
              (section) =>
                `${section.heading}\n${"-".repeat(section.heading.length)}\n${
                  section.content
                }\n\n`
            )
            .join("");
        const blob = new Blob([content], { type: "text/plain" });
        saveAs(blob, "summary.txt");
        break;
      }

      case "pdf": {
        const doc = new jsPDF();
        let yPosition = 20;

        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text(summaryData.title, 20, yPosition);
        yPosition += 15;

        summaryData.sections.forEach((section) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }

          doc.setFontSize(14);
          doc.setFont("helvetica", "bold");
          doc.text(section.heading, 20, yPosition);
          yPosition += 8;

          doc.setFontSize(11);
          doc.setFont("helvetica", "normal");
          const lines = doc.splitTextToSize(section.content, 170);
          doc.text(lines, 20, yPosition);
          yPosition += lines.length * 6 + 10;
        });

        doc.save("summary.pdf");
        break;
      }

      case "docx": {
        const docSections = summaryData.sections
          .map((section) => [
            new Paragraph({
              text: section.heading,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 240, after: 120 },
            }),
            new Paragraph({
              children: [new TextRun({ text: section.content, size: 24 })],
              spacing: { after: 240 },
            }),
          ])
          .flat();

        const doc = new Document({
          sections: [
            {
              properties: {},
              children: [
                new Paragraph({
                  text: summaryData.title,
                  heading: HeadingLevel.HEADING_1,
                  spacing: { after: 240 },
                }),
                ...docSections,
              ],
            },
          ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, "summary.docx");
        break;
      }

      case "csv": {
        const csvContent =
          "Section,Content\n" +
          summaryData.sections
            .map((s) => `"${s.heading}","${s.content.replace(/"/g, '""')}"`)
            .join("\n");
        const blob = new Blob([csvContent], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(blob, "summary.csv");
        break;
      }
    }
  } catch (error) {
    console.error("Download error:", error);
    alert("Error downloading file. Please try again.");
  }
};
