'use client';

import React from 'react';
import { TextareaAutosize } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const SuggestionInput = () => {
  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md">
      <label htmlFor="suggestion" className="block text-gray-700 font-medium mb-2">
      <ReceiptIcon className="my-2 text-gray-500" />
        Suggestion 
      </label>
      <div className="flex items-start gap-2">
        <TextareaAutosize
          id="suggestion"
          minRows={1}
          placeholder="Write suggestion to restaurant..."
          className="w-full p-2 border border-gray-300  resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </div>
  );
};

export default SuggestionInput;
