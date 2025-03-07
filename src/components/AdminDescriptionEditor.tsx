import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { createMarkup, parseMarkdown } from '../utils/formatDescription';

interface AdminDescriptionEditorProps {
  playgroundId: number;
  initialDescription: string;
  onSave: (newDescription: string) => void;
}

const AdminDescriptionEditor: React.FC<AdminDescriptionEditorProps> = ({ 
  playgroundId, 
  initialDescription,
  onSave
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      const { error } = await supabase
        .from('playgrounds')
        .update({ description })
        .eq('id', playgroundId);
        
      if (error) throw error;
      
      onSave(description);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving description:', err);
      setError('Failed to save description. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatHelpText = `
# Formatting Help

You can use HTML tags or Markdown-style formatting:

## HTML Formatting
- Headings: <h2>Heading</h2>, <h3>Subheading</h3>
- Paragraphs: <p>Your text here</p>
- Lists: 
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
  </ul>
  
  <ol>
    <li>First item</li>
    <li>Second item</li>
  </ol>
- Emphasis: <strong>Bold</strong>, <em>Italic</em>

## Markdown-style Formatting
- Headings: ## Heading, ### Subheading
- Lists: 
  * Bullet point
  * Another bullet
  
  1. Numbered item
  2. Another numbered item
- Emphasis: **Bold**, *Italic*

Paragraphs are created by leaving a blank line between text.
  `;

  if (!isEditing) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Edit Description
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold">Edit Description</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
          >
            {previewMode ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white border rounded p-4 prose max-w-none min-h-[300px]">
          <div dangerouslySetInnerHTML={createMarkup(parseMarkdown(description))} />
        </div>
      ) : (
        <>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-[300px] p-3 border rounded font-mono text-sm"
            placeholder="Enter description with HTML formatting or Markdown-style formatting"
          />
          
          <details className="mt-2 text-sm text-gray-600">
            <summary className="cursor-pointer">Formatting Help</summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded overflow-auto text-xs">
              {formatHelpText}
            </pre>
          </details>
        </>
      )}

      {error && (
        <div className="mt-2 text-red-500">
          {error}
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default AdminDescriptionEditor;