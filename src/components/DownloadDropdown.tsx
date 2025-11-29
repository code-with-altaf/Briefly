"use client";

import React from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import {
  IconDownload,
  IconFileTypeTxt,
  IconFileTypePdf,
  IconFileTypeDocx,
  IconFileTypeCsv,
} from "@tabler/icons-react";
import { downloadSummary } from "@/lib/downloadUtils"; // We'll create this next
import { SummaryData } from "@/types/summary";

interface DownloadDropdownProps {
  summaryData: SummaryData;
}

const DownloadDropdown: React.FC<DownloadDropdownProps> = ({ summaryData }) => (
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
            onClick={() => downloadSummary(summaryData, "txt")}
            className={`${
              focus ? "bg-neutral-100 dark:bg-neutral-800" : ""
            } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100`}
          >
            <IconFileTypeTxt size={18} />
            Download as TXT
          </button>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <button
            onClick={() => downloadSummary(summaryData, "pdf")}
            className={`${
              focus ? "bg-neutral-100 dark:bg-neutral-800" : ""
            } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100`}
          >
            <IconFileTypePdf size={18} />
            Download as PDF
          </button>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <button
            onClick={() => downloadSummary(summaryData, "docx")}
            className={`${
              focus ? "bg-neutral-100 dark:bg-neutral-800" : ""
            } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100`}
          >
            <IconFileTypeDocx size={18} />
            Download as DOCX
          </button>
        )}
      </MenuItem>
      <MenuItem>
        {({ focus }) => (
          <button
            onClick={() => downloadSummary(summaryData, "csv")}
            className={`${
              focus ? "bg-neutral-100 dark:bg-neutral-800" : ""
            } group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-neutral-900 dark:text-neutral-100`}
          >
            <IconFileTypeCsv size={18} />
            Download as CSV
          </button>
        )}
      </MenuItem>
    </MenuItems>
  </Menu>
);

export default DownloadDropdown;
