"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StoryCard from "@/components/StoryCard";
import { 
  IconLayoutGrid, 
  IconDeviceMobile, 
  IconDownload,
  IconRefresh,
  IconFileTypePdf,
  IconFileTypeDocx,
  IconFileTypeTxt,
  IconFileTypeCsv,
  IconVideo
} from "@tabler/icons-react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { jsPDF } from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

// ... (sare interfaces aur downloadSummary function same rahenge)

interface SummarySection {
  heading: string;
  content: string;
}

interface SummaryData {
  title: string;
  sections: SummarySection[];
}

interface ApiResponse {
  success: boolean;
  fileName: string;
  summary: SummaryData;
  story: string[];
}

type ViewMode = "summary" | "story";
type DownloadFormat = "txt" | "pdf" | "docx" | "csv";

const downloadSummary = async (summaryData: SummaryData, format: DownloadFormat): Promise<void> => {
  try {
    switch(format) {
      case 'txt': {
        const content = summaryData.sections
          .map(section => `${section.heading}\n${'='.repeat(section.heading.length)}\n${section.content}\n\n`)
          .join('');
        const blob = new Blob([content], { type: 'text/plain' });
        saveAs(blob, 'summary.txt');
        break;
      }

      case 'pdf': {
        const doc = new jsPDF();
        let yPosition = 20;
        
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(summaryData.title, 20, yPosition);
        yPosition += 15;
        
        summaryData.sections.forEach((section) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text(section.heading, 20, yPosition);
          yPosition += 8;
          
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          const lines = doc.splitTextToSize(section.content, 170);
          doc.text(lines, 20, yPosition);
          yPosition += (lines.length * 6) + 10;
        });
        
        doc.save('summary.pdf');
        break;
      }

      case 'docx': {
        const docSections = summaryData.sections.map(section => [
          new Paragraph({
            text: section.heading,
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 }
          }),
          new Paragraph({
            children: [new TextRun({ text: section.content, size: 24 })],
            spacing: { after: 240 }
          })
        ]).flat();

        const doc = new Document({
          sections: [{
            properties: {},
            children: [
              new Paragraph({
                text: summaryData.title,
                heading: HeadingLevel.HEADING_1,
                spacing: { after: 240 }
              }),
              ...docSections
            ]
          }]
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, 'summary.docx');
        break;
      }

      case 'csv': {
        const csvContent = 'Heading,Content\n' + 
          summaryData.sections
            .map(s => `"${s.heading}","${s.content.replace(/"/g, '""')}"`)
            .join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'summary.csv');
        break;
      }
    }
  } catch (error) {
    console.error('Download error:', error);
    alert('Error downloading file. Please try again.');
  }
};

const DownloadDropdown = ({ summaryData }: { summaryData: SummaryData }) => (
  <Menu as="div" className="relative">
    <MenuButton className="p-2 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors">
      <IconDownload size={20} className="text-black dark:text-white" />
    </MenuButton>
    
    <MenuItems
      anchor="bottom end"
      className="mt-2 w-52 origin-top-right rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-1 text-sm shadow-lg focus:outline-none z-50"
    >
      <MenuItem>
        {({ focus }) => (
          <button
            onClick={() => downloadSummary(summaryData, 'txt')}
            className={`${focus ? 'bg-neutral-100 dark:bg-neutral-800' : ''} group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100`}
          >
            <IconFileTypeTxt size={18} />
            Download as TXT
          </button>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <button
            onClick={() => downloadSummary(summaryData, 'pdf')}
            className={`${focus ? 'bg-neutral-100 dark:bg-neutral-800' : ''} group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100`}
          >
            <IconFileTypePdf size={18} />
            Download as PDF
          </button>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <button
            onClick={() => downloadSummary(summaryData, 'docx')}
            className={`${focus ? 'bg-neutral-100 dark:bg-neutral-800' : ''} group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100`}
          >
            <IconFileTypeDocx size={18} />
            Download as DOCX
          </button>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <button
            onClick={() => downloadSummary(summaryData, 'csv')}
            className={`${focus ? 'bg-neutral-100 dark:bg-neutral-800' : ''} group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100`}
          >
            <IconFileTypeCsv size={18} />
            Download as CSV
          </button>
        )}
      </MenuItem>
    </MenuItems>
  </Menu>
);

// ✅ Separate component for useSearchParams
function SummarizedContent() {
  const searchParams = useSearchParams();
  const fileName = searchParams.get("file");
  
  const [viewMode, setViewMode] = useState<ViewMode>("summary");
  const [summaryData, setSummaryData] = useState<SummaryData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const storedData = localStorage.getItem('summaryData');
      if (storedData) {
        const data: ApiResponse = JSON.parse(storedData);
        setSummaryData(data.summary);
      }
    };
    
    loadData();
  }, []);

  if (!summaryData) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-black flex items-center justify-center">
        <p className="text-black dark:text-white">Loading summary...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black py-10 px-2 md:px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-5xl hidden lg:block mb-6 font-bold text-center text-black dark:text-white">
          Your Summary is Ready! ⚡
        </h1>
        {fileName && (
          <p className="text-neutral-600 dark:text-neutral-400 text-center mt-2">
            File: {fileName}
          </p>
        )}

        <div className="flex justify-center mt-6 lg:hidden">
          <div className="inline-flex rounded-lg border border-neutral-300 dark:border-neutral-700 p-1 bg-neutral-100 dark:bg-neutral-900">
            <button
              onClick={() => setViewMode("summary")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
                viewMode === "summary"
                  ? "bg-white dark:bg-black text-black dark:text-white shadow-md"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <IconLayoutGrid size={18} />
              Summary
            </button>
            <button
              onClick={() => setViewMode("story")}
              className={`px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
                viewMode === "story"
                  ? "bg-white dark:bg-black text-black dark:text-white shadow-md"
                  : "text-neutral-600 dark:text-neutral-400"
              }`}
            >
              <IconDeviceMobile size={18} />
              Story Mode
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:grid lg:grid-cols-2 gap-6 max-w-6xl mx-auto mt-10 px-6">
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-black dark:text-white">
              📄 Summary View
            </h2>
            <DownloadDropdown summaryData={summaryData} />
          </div>

          <div className="space-y-6">
            {summaryData.sections.map((section, idx) => (
              <div key={idx}>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  {section.heading}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="sticky top-6 flex flex-col gap-4">
            <StoryCard />
          </div>
        </div>
      </div>

      <div className="lg:hidden max-w-lg mx-auto mt-10">
        {viewMode === "summary" ? (
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-black dark:text-white">
                📄 Summary
              </h2>
              <DownloadDropdown summaryData={summaryData} />
            </div>

            <div className="space-y-4">
              {summaryData.sections.map((section, idx) => (
                <div key={idx}>
                  <h3 className="text-base font-semibold text-black dark:text-white mb-1">
                    {section.heading}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <StoryCard />
          </div>
        )}
      </div>
    </div>
  );
}

// ✅ Main export with Suspense wrapper
export default function SummarizedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-white dark:bg-black flex items-center justify-center">
        <p className="text-black dark:text-white">Loading...</p>
      </div>
    }>
      <SummarizedContent />
    </Suspense>
  );
}
