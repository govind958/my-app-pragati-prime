import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, GripVertical, Info } from 'lucide-react';

const DynamicContentManager = ({
  title,
  description,
  items = [],
  onChange,
  itemTemplate = { title: '', content: '' },
  placeholder = { title: 'Title', content: 'Content' }
}) => {
  const addItem = () => {
    const newItems = [...items, { ...itemTemplate }];
    onChange(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onChange(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange(newItems);
  };


  return (
    <Card>
      <CardHeader className="px-3 sm:px-6">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
        {description && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent className="px-3 sm:px-6 pt-4 sm:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
          {items.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3 bg-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Item {index + 1}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {placeholder.title && (
                <div>
                  <Label htmlFor={`title-${index}`} className="text-sm">
                    {placeholder.title}
                  </Label>
                  <Input
                    id={`title-${index}`}
                    value={item.title || ''}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    placeholder={`Enter ${placeholder.title.toLowerCase()}`}
                    className="mt-1 w-full text-xs sm:text-sm"
                  />
                </div>
              )}

              <div>
                <Label htmlFor={`content-${index}`} className="text-sm">
                  {placeholder.content}
                </Label>
                <textarea
                  id={`content-${index}`}
                  value={item.content || ''}
                  onChange={(e) => updateItem(index, 'content', e.target.value)}
                  rows={4}
                  placeholder={`Enter ${placeholder.content.toLowerCase()}`}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-xs sm:text-sm"
                />
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          className="w-full flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New Item
        </Button>
      </CardContent>
    </Card>
  );
};

export default DynamicContentManager;
