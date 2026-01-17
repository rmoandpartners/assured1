import React, { useCallback, useState, useRef, useEffect } from 'react';
import type { Question, CareerEntry, SelectOption } from '../../../types/questionnaire';

interface CareerHistoryQuestionProps {
  question: Question;
  value: CareerEntry[] | undefined;
  onChange: (value: CareerEntry[]) => void;
}

const MONTHS = [
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

// Comprehensive industry list - alphabetically sorted
const DEFAULT_INDUSTRY_OPTIONS: SelectOption[] = [
  { value: 'aerospace_defence', label: 'Aerospace & Defence' },
  { value: 'agriculture', label: 'Agriculture & Farming' },
  { value: 'asset_management', label: 'Asset Management' },
  { value: 'automotive', label: 'Automotive' },
  { value: 'banking', label: 'Banking' },
  { value: 'big4', label: 'Big 4 Accounting Firm' },
  { value: 'biotechnology', label: 'Biotechnology' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'construction', label: 'Construction & Engineering' },
  { value: 'consulting', label: 'Consulting' },
  { value: 'consumer_goods', label: 'Consumer Goods & FMCG' },
  { value: 'corporate', label: 'Corporate (Non-Financial)' },
  { value: 'education', label: 'Education' },
  { value: 'energy_utilities', label: 'Energy & Utilities' },
  { value: 'entertainment_media', label: 'Entertainment & Media' },
  { value: 'fintech', label: 'FinTech' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'hospitality_leisure', label: 'Hospitality & Leisure' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'logistics_transport', label: 'Logistics & Transportation' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'mining_metals', label: 'Mining & Metals' },
  { value: 'ngo', label: 'NGO / Non-Profit' },
  { value: 'oil_gas', label: 'Oil & Gas' },
  { value: 'pharmaceuticals', label: 'Pharmaceuticals' },
  { value: 'private_equity', label: 'Private Equity / Venture Capital' },
  { value: 'property_real_estate', label: 'Property & Real Estate' },
  { value: 'public_sector', label: 'Public Sector / Government' },
  { value: 'retail', label: 'Retail' },
  { value: 'technology', label: 'Technology' },
  { value: 'telecommunications', label: 'Telecommunications' },
  { value: 'other', label: 'Other' },
];

const DEFAULT_FUNCTION_OPTIONS: SelectOption[] = [
  { value: 'erm', label: 'Enterprise Risk Management' },
  { value: 'ia', label: 'Internal Audit' },
  { value: 'ic', label: 'Internal Controls' },
  { value: 'bcm', label: 'Business Continuity' },
  { value: 'esg', label: 'Sustainability & ESG' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'other', label: 'Other' },
];

const generateId = () => `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

const generateYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let y = currentYear; y >= currentYear - 50; y--) {
    years.push(y.toString());
  }
  return years;
};

const YEARS = generateYears();

const createEmptyEntry = (): CareerEntry => ({
  id: generateId(),
  companyName: '',
  industry: '',
  industryOther: '',
  jobTitle: '',
  function: '',
  functionOther: '',
  startMonth: '',
  startYear: '',
  endMonth: null,
  endYear: null,
  isCurrent: false,
});

// Custom dropdown component matching SelectQuestion styling
interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  id: string;
}

function CustomSelect({ value, onChange, options, placeholder, id }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const hasMany = options.length > 7;

  const filteredOptions = hasMany && search
    ? options.filter((opt) => opt.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && hasMany && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, hasMany]);

  const handleSelect = (optValue: string) => {
    onChange(optValue);
    setIsOpen(false);
    setSearch('');
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-4 py-3 border font-body text-[#0f241d] flex items-center justify-between transition-all focus:outline-none ${
          isOpen
            ? 'border-[#c25e00] border-2'
            : 'border-[#0f241d]/20 hover:border-[#0f241d]/40'
        }`}
        style={{ backgroundColor: '#e8e6df' }}
      >
        <span className={value ? '' : 'text-[#0f241d]/40'}>
          {selectedOption?.label || placeholder}
        </span>
        <svg
          className={`w-4 h-4 text-[#0f241d]/40 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute w-full mt-1 border border-[#0f241d]/20 shadow-xl overflow-hidden"
          style={{ backgroundColor: '#e8e6df', zIndex: 9999 }}
        >
          {hasMany && (
            <div className="p-2 border-b border-[#0f241d]/10" style={{ backgroundColor: '#e8e6df' }}>
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full px-3 py-2 border border-[#0f241d]/10 font-technical text-sm focus:outline-none focus:border-[#c25e00]"
                style={{ backgroundColor: '#ffffff' }}
              />
            </div>
          )}

          <div className="max-h-48 overflow-y-auto" style={{ backgroundColor: '#e8e6df' }}>
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 font-technical text-sm text-[#0f241d]/40">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className="w-full px-4 py-2.5 text-left font-body text-sm transition-colors hover:bg-[#d9d7d0]"
                    style={{
                      backgroundColor: isSelected ? '#0f241d' : '#e8e6df',
                      color: isSelected ? '#f2f0e9' : '#0f241d',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface CareerEntryCardProps {
  entry: CareerEntry;
  index: number;
  industryOptions: SelectOption[];
  functionOptions: SelectOption[];
  onUpdate: (id: string, updates: Partial<CareerEntry>) => void;
  onRemove: (id: string) => void;
  canRemove: boolean;
}

function CareerEntryCard({
  entry,
  index,
  industryOptions,
  functionOptions,
  onUpdate,
  onRemove,
  canRemove,
}: CareerEntryCardProps) {
  const handleFieldChange = (field: keyof CareerEntry, value: string | boolean | null) => {
    const updates: Partial<CareerEntry> = { [field]: value };

    if (field === 'isCurrent' && value === true) {
      updates.endMonth = null;
      updates.endYear = null;
    }

    if (field === 'function' && value !== 'other') {
      updates.functionOther = '';
    }

    if (field === 'industry' && value !== 'other') {
      updates.industryOther = '';
    }

    onUpdate(entry.id, updates);
  };

  return (
    <div className="border border-[#0f241d]/10 p-6 mb-4" style={{ backgroundColor: 'rgba(232, 230, 223, 0.3)' }}>
      <div className="flex justify-between items-start mb-6">
        <span className="font-technical text-xs text-[#0f241d]/40 uppercase tracking-wider">
          Position {index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(entry.id)}
            className="text-[#0f241d]/40 hover:text-[#0f241d] transition-colors font-technical text-sm"
            aria-label="Remove position"
          >
            Remove
          </button>
        )}
      </div>

      {/* Company Name */}
      <div className="mb-5">
        <label className="block font-technical text-xs text-[#0f241d]/60 uppercase tracking-wider mb-2">
          Company Name
        </label>
        <input
          type="text"
          value={entry.companyName}
          onChange={(e) => handleFieldChange('companyName', e.target.value)}
          placeholder="Enter company name"
          className="w-full px-4 py-3 border border-[#0f241d]/20 font-body text-[#0f241d] placeholder:text-[#0f241d]/30 focus:border-[#0f241d] focus:outline-none transition-colors"
          style={{ backgroundColor: '#e8e6df' }}
        />
      </div>

      {/* Job Title and Industry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div>
          <label className="block font-technical text-xs text-[#0f241d]/60 uppercase tracking-wider mb-2">
            Job Title
          </label>
          <input
            type="text"
            value={entry.jobTitle}
            onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
            placeholder="Enter job title"
            className="w-full px-4 py-3 border border-[#0f241d]/20 font-body text-[#0f241d] placeholder:text-[#0f241d]/30 focus:border-[#0f241d] focus:outline-none transition-colors"
            style={{ backgroundColor: '#e8e6df' }}
          />
        </div>
        <div>
          <label className="block font-technical text-xs text-[#0f241d]/60 uppercase tracking-wider mb-2">
            Industry
          </label>
          <CustomSelect
            id={`industry-${entry.id}`}
            value={entry.industry}
            onChange={(val) => handleFieldChange('industry', val)}
            options={industryOptions}
            placeholder="Select industry"
          />
        </div>
      </div>

      {/* Industry Other (conditional) */}
      {entry.industry === 'other' && (
        <div className="mb-5">
          <label className="block font-technical text-xs text-[#0f241d]/60 uppercase tracking-wider mb-2">
            Please specify industry
          </label>
          <input
            type="text"
            value={entry.industryOther || ''}
            onChange={(e) => handleFieldChange('industryOther', e.target.value)}
            placeholder="Enter industry"
            className="w-full px-4 py-3 border border-[#0f241d]/20 font-body text-[#0f241d] placeholder:text-[#0f241d]/30 focus:border-[#0f241d] focus:outline-none transition-colors"
            style={{ backgroundColor: '#e8e6df' }}
          />
        </div>
      )}

      {/* Function */}
      <div className="mb-5">
        <label className="block font-technical text-xs text-[#0f241d]/60 uppercase tracking-wider mb-2">
          Function
        </label>
        <div className="flex flex-wrap gap-2">
          {functionOptions.map((opt) => {
            const isSelected = entry.function === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleFieldChange('function', opt.value)}
                className={`px-4 py-2 rounded-full border font-technical text-sm transition-all ${
                  isSelected
                    ? 'bg-[#0f241d] text-[#f2f0e9] border-[#0f241d]'
                    : 'bg-transparent text-[#0f241d] border-[#0f241d]/20 hover:border-[#0f241d]'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Function Other (conditional) */}
      {entry.function === 'other' && (
        <div className="mb-5">
          <label className="block font-technical text-xs text-[#0f241d]/60 uppercase tracking-wider mb-2">
            Please specify function
          </label>
          <input
            type="text"
            value={entry.functionOther || ''}
            onChange={(e) => handleFieldChange('functionOther', e.target.value)}
            placeholder="Enter function"
            className="w-full px-4 py-3 border border-[#0f241d]/20 font-body text-[#0f241d] placeholder:text-[#0f241d]/30 focus:border-[#0f241d] focus:outline-none transition-colors"
            style={{ backgroundColor: '#e8e6df' }}
          />
        </div>
      )}

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Start Date */}
        <div>
          <label className="block font-technical text-xs text-[#0f241d]/60 uppercase tracking-wider mb-2">
            Start Date
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <CustomSelect
                id={`start-month-${entry.id}`}
                value={entry.startMonth}
                onChange={(val) => handleFieldChange('startMonth', val)}
                options={MONTHS}
                placeholder="Month"
              />
            </div>
            <div className="flex-1">
              <CustomSelect
                id={`start-year-${entry.id}`}
                value={entry.startYear}
                onChange={(val) => handleFieldChange('startYear', val)}
                options={YEARS.map((y) => ({ value: y, label: y }))}
                placeholder="Year"
              />
            </div>
          </div>
        </div>

        {/* End Date */}
        <div>
          <label className="block font-technical text-xs text-[#0f241d]/60 uppercase tracking-wider mb-2">
            End Date
          </label>
          <div className="flex gap-3 items-center">
            {entry.isCurrent ? (
              <div
                className="flex-1 px-4 py-3 border border-[#0f241d]/10 font-body text-[#0f241d]/40"
                style={{ backgroundColor: 'rgba(15, 36, 29, 0.05)' }}
              >
                Present
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <CustomSelect
                    id={`end-month-${entry.id}`}
                    value={entry.endMonth || ''}
                    onChange={(val) => handleFieldChange('endMonth', val || null)}
                    options={MONTHS}
                    placeholder="Month"
                  />
                </div>
                <div className="flex-1">
                  <CustomSelect
                    id={`end-year-${entry.id}`}
                    value={entry.endYear || ''}
                    onChange={(val) => handleFieldChange('endYear', val || null)}
                    options={YEARS.map((y) => ({ value: y, label: y }))}
                    placeholder="Year"
                  />
                </div>
              </>
            )}
          </div>
          <label className="flex items-center gap-2 mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={entry.isCurrent}
              onChange={(e) => handleFieldChange('isCurrent', e.target.checked)}
              className="w-4 h-4 border-2 border-[#0f241d]/20 rounded-sm bg-transparent checked:bg-[#0f241d] checked:border-[#0f241d] focus:outline-none cursor-pointer"
            />
            <span className="font-technical text-sm text-[#0f241d]/60">
              I currently work here
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}

export function CareerHistoryQuestion({ question, value, onChange }: CareerHistoryQuestionProps) {
  const entries = value || [];
  const minEntries = question.minEntries || 1;
  const maxEntries = question.maxEntries || 10;

  const industryOptions: SelectOption[] = question.industryOptions || DEFAULT_INDUSTRY_OPTIONS;
  const functionOptions: SelectOption[] = question.functionOptions || DEFAULT_FUNCTION_OPTIONS;

  const handleUpdate = useCallback((id: string, updates: Partial<CareerEntry>) => {
    const newEntries = entries.map((entry) =>
      entry.id === id ? { ...entry, ...updates } : entry
    );
    onChange(newEntries);
  }, [entries, onChange]);

  const handleRemove = useCallback((id: string) => {
    if (entries.length > minEntries) {
      const newEntries = entries.filter((entry) => entry.id !== id);
      onChange(newEntries);
    }
  }, [entries, minEntries, onChange]);

  const handleAdd = useCallback(() => {
    if (entries.length < maxEntries) {
      onChange([...entries, createEmptyEntry()]);
    }
  }, [entries, maxEntries, onChange]);

  // Initialize with one empty entry if none exist
  React.useEffect(() => {
    if (entries.length === 0) {
      onChange([createEmptyEntry()]);
    }
  }, []);

  return (
    <div>
      {entries.map((entry, index) => (
        <CareerEntryCard
          key={entry.id}
          entry={entry}
          index={index}
          industryOptions={industryOptions}
          functionOptions={functionOptions}
          onUpdate={handleUpdate}
          onRemove={handleRemove}
          canRemove={entries.length > minEntries}
        />
      ))}

      {entries.length < maxEntries && (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full py-4 border border-dashed border-[#0f241d]/20 text-[#0f241d]/60 hover:border-[#0f241d]/40 hover:text-[#0f241d] transition-all font-technical text-sm"
        >
          + Add Another Position
        </button>
      )}

      {entries.length >= maxEntries && (
        <p className="font-technical text-xs text-[#0f241d]/40 text-center mt-4">
          Maximum of {maxEntries} positions reached
        </p>
      )}
    </div>
  );
}

export default CareerHistoryQuestion;
