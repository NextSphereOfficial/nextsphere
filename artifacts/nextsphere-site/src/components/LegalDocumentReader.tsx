import React from 'react';

type LegalDocumentReaderProps = {
  title: string;
  pageCount: number;
  pageImageBasePath: string;
  pageLabel: string;
};

export function LegalDocumentReader({
  title,
  pageCount,
  pageImageBasePath,
  pageLabel,
}: LegalDocumentReaderProps) {
  return (
    <div className="h-[52vh] min-h-[360px] max-h-[560px] overflow-y-auto bg-gray-100 p-3 sm:p-5">
      <div className="flex flex-col gap-5">
        {Array.from({ length: pageCount }, (_, index) => {
          const pageNumber = index + 1;

          return (
            <figure key={pageNumber} className="flex flex-col items-center gap-2">
              <img
                src={`${pageImageBasePath}/page-${pageNumber}.jpg`}
                alt={`${title} — ${pageLabel} ${pageNumber}`}
                width={1071}
                height={1386}
                loading={pageNumber === 1 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={pageNumber === 1 ? 'high' : 'auto'}
                className="block h-auto w-full bg-white shadow-sm"
              />
              <figcaption className="text-xs font-medium text-gray-500">
                {pageLabel} {pageNumber} / {pageCount}
              </figcaption>
            </figure>
          );
        })}
      </div>
    </div>
  );
}