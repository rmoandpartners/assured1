import React, { useRef } from 'react';
import type { Question } from '../../../types/questionnaire';

interface FileQuestionProps {
  question: Question;
  value: File | string | undefined;
  onChange: (value: File | undefined) => void;
}

export function FileQuestion({ question, value, onChange }: FileQuestionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const accept = question.accept || '.pdf,.doc,.docx';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onChange(file);
  };

  const handleClear = () => {
    onChange(undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const fileName = value instanceof File ? value.name : value;

  return (
    <div className="space-y-3">
      {/* File input area */}
      <div
        className={`relative border-2 border-dashed p-8 text-center transition-all ${
          fileName
            ? 'border-[#c25e00] bg-[#c25e00]/5'
            : 'border-[#0f241d]/20 hover:border-[#0f241d] bg-transparent'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          id={`input-${question.id}`}
          accept={accept}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        {fileName ? (
          <div className="flex items-center justify-center gap-3">
            <svg className="w-8 h-8 text-[#c25e00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div className="text-left">
              <p className="font-editorial text-lg text-[#0f241d] truncate max-w-xs">
                {fileName}
              </p>
              <p className="font-technical text-xs text-[#c25e00]">
                Click to replace
              </p>
            </div>
          </div>
        ) : (
          <>
            <svg className="w-10 h-10 text-[#0f241d]/30 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="font-technical text-[#0f241d]/60 mb-1">
              Click to upload or drag and drop
            </p>
            <p className="font-technical text-xs text-[#0f241d]/40">
              {accept.split(',').join(', ')}
            </p>
          </>
        )}
      </div>

      {/* Clear button */}
      {fileName && (
        <button
          type="button"
          onClick={handleClear}
          className="font-technical text-sm text-[#c25e00] hover:text-[#c25e00]/80 transition-colors"
        >
          Remove file
        </button>
      )}
    </div>
  );
}

export default FileQuestion;
