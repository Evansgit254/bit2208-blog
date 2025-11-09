import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import ImageUploader from './ImageUploader';
import MarkdownPreview from './MarkdownPreview';

interface MarkdownEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
  readOnly?: boolean;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialValue = '',
  onChange,
  onImageUpload,
  readOnly = false
}) => {
  const [content, setContent] = useState(initialValue);
  const [showPreview, setShowPreview] = useState(false);
  const [showImageUploader, setShowImageUploader] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setContent(newValue);
      onChange?.(newValue);
    },
    [onChange]
  );

  const handleImageUploaded = useCallback(
    async (imageUrl: string) => {
      const imageMarkdown = `![](${imageUrl})`;
      const newContent = content + '\n' + imageMarkdown;
      setContent(newContent);
      onChange?.(newContent);
      setShowImageUploader(false);
    },
    [content, onChange]
  );

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          {!readOnly && onImageUpload && (
            <button
              type="button"
              onClick={() => setShowImageUploader(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <UploadCloud className="h-4 w-4 mr-2" />
              Add Image
            </button>
          )}
        </div>
      </div>

      {showPreview ? (
        <div className="prose max-w-none p-4 border rounded-md bg-white">
          <MarkdownPreview content={content} />
        </div>
      ) : (
        <textarea
          value={content}
          onChange={handleChange}
          readOnly={readOnly}
          className="w-full h-64 p-4 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Write your post in Markdown..."
        />
      )}

      {showImageUploader && onImageUpload && (
        <ImageUploader
          onUpload={onImageUpload}
          onUploaded={handleImageUploaded}
          onCancel={() => setShowImageUploader(false)}
        />
      )}
    </div>
  );
};

export default MarkdownEditor;
