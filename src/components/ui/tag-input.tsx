import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { MEDICAL_TAGS } from '@/constants/tags';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  maxTags = Infinity,
  placeholder = "Add tag",
  className = ""
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = MEDICAL_TAGS.filter(tag =>
        tag.toLowerCase().includes(inputValue.toLowerCase()) &&
        !tags.includes(tag)
      ).slice(0, 10); // Limit to 10 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      // Don't show suggestions when input is empty
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [inputValue, tags]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
      onChange([...tags, trimmedTag]);
      setInputValue('');
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSuggestions.length > 0) {
        addTag(filteredSuggestions[0]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
  };

  return (
    <div className={`space-y-2 ${className}`}>
       <div className="text-sm font-medium text-gray-700">
         Skills ({tags.length})
       </div>
      <div className="relative">
        <div className="min-h-[40px] border border-green-200 rounded-lg p-2 bg-white focus-within:border-green-300 focus-within:ring-1 focus-within:ring-green-300 focus-within:ring-opacity-20">
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-grey-800 text-sm rounded-full"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="text-grey-600 hover:text-grey-800 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
             <div className="relative flex-1 min-w-[120px]">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    // Only show suggestions if there's text in the input
                    if (inputValue.trim()) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder={placeholder}
                  className="border border-gray-200 shadow-none focus:ring-0 focus:border-gray-300 focus:outline-none p-2 h-auto bg-white rounded"
                />
                {showSuggestions && (
                  <div
                    ref={suggestionsRef}
                    className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {filteredSuggestions.map((tag, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(tag)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TagInput;
