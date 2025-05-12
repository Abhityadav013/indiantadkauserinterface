'use client';

import React from 'react';
import { Box, IconButton, TextareaAutosize, Typography } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';

const SuggestionInput = () => {
  return (
    <Box className=" max-w-md mx-auto p-4 bg-white shadow-md">
      <Typography variant="h6" sx={{ fonWeight: 300 }}>
        <IconButton>
          <ReceiptIcon fontSize="medium" className="text-gray-700" />
        </IconButton>
        Suggestion
      </Typography>

      <div className="flex items-start gap-2">
        <TextareaAutosize
          id="suggestion"
          minRows={1}
          placeholder="Write suggestion to restaurant..."
          className="w-full p-2 border border-gray-300  resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </Box>

  );
};

export default SuggestionInput;
