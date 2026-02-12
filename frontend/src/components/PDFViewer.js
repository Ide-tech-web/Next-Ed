import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import GlassCard from './GlassCard';
import Button from './Button';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  return (
    <GlassCard className="flex flex-col items-center">
      <div className="mb-4">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          className="border rounded-lg overflow-hidden"
        >
          <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} width={600} />
        </Document>
      </div>

      <div className="flex items-center gap-4">
        <Button 
          variant="secondary"
          disabled={pageNumber <= 1} 
          onClick={previousPage}
        >
          Previous
        </Button>
        <span className="text-white">
          Page {pageNumber} of {numPages}
        </span>
        <Button 
          variant="secondary"
          disabled={pageNumber >= numPages} 
          onClick={nextPage}
        >
          Next
        </Button>
      </div>
    </GlassCard>
  );
};

export default PDFViewer;
