import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash, CalendarIcon } from "lucide-react";
import { generateUUID } from "@/utils/uuid";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { da } from "date-fns/locale";

type GenericEntry = {
  id: string;
  bulletPoints: string[];
  [key: string]: any;
};

type StructuredRowEditorProps<T extends GenericEntry> = {
  title: string;
  entries: T[];
  columns: {
    key: string;
    label: string;
    type: "text" | "date";
  }[];
  onUpdate: (entries: T[]) => void;
  createEntry: () => T;
};

export default function StructuredRowEditor<T extends GenericEntry>({
  title,
  entries,
  columns,
  onUpdate,
  createEntry,
}: StructuredRowEditorProps<T>) {
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);

  const addEntry = () => {
    onUpdate([...entries, createEntry()]);
  };

  const removeEntry = (id: string) => {
    onUpdate(entries.filter((entry) => entry.id !== id));
  };

  const updateEntry = (id: string, field: string, value: any) => {
    onUpdate(
      entries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
  };

  const addBulletPoint = (id: string) => {
    onUpdate(
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              bulletPoints: [...entry.bulletPoints, ""],
            }
          : entry
      )
    );
  };

  const updateBulletPoint = (id: string, index: number, value: string) => {
    onUpdate(
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              bulletPoints: entry.bulletPoints.map((point, i) =>
                i === index ? value : point
              ),
            }
          : entry
      )
    );
  };

  const removeBulletPoint = (id: string, index: number) => {
    onUpdate(
      entries.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              bulletPoints: entry.bulletPoints.filter((_, i) => i !== index),
            }
          : entry
      )
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold">{title}</h3>
        <Button
          onClick={addEntry}
          variant="outline"
          size="sm"
          className="h-8 gap-1"
        >
          <Plus className="h-4 w-4" />
          <span>Tilføj række</span>
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-4 text-muted-foreground border rounded-md">
          Intet tilføjet endnu
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="border rounded-md p-4 space-y-4 bg-white"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {columns.map((column) => (
                  <div key={column.key} className="space-y-2">
                    <label className="text-sm font-medium">
                      {column.label}
                    </label>
                    {column.type === "date" ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !entry[column.key] && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {entry[column.key] ? (
                              entry[column.key]
                            ) : (
                              <span>Vælg dato</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            locale={da}
                            selected={
                              entry[column.key]
                                ? new Date(entry[column.key])
                                : undefined
                            }
                            onSelect={(date) =>
                              updateEntry(
                                entry.id,
                                column.key,
                                date ? format(date, "MM/yyyy") : ""
                              )
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    ) : (
                      <Input
                        value={entry[column.key] || ""}
                        onChange={(e) =>
                          updateEntry(entry.id, column.key, e.target.value)
                        }
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <Button
                  onClick={() =>
                    setExpandedRowId(
                      expandedRowId === entry.id ? null : entry.id
                    )
                  }
                  variant="ghost"
                  size="sm"
                >
                  {expandedRowId === entry.id
                    ? "Skjul punkter"
                    : "Tilføj punkter"}
                </Button>
                <Button
                  onClick={() => removeEntry(entry.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>

              {expandedRowId === entry.id && (
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <div className="font-medium text-sm">
                      Key Points (max 3)
                    </div>
                    <span className="text-xs text-gray-500">
                      Use action verbs, numbers & achievements
                    </span>
                  </div>
                  
                  {entry.bulletPoints.map((point, index) => (
                    <div
                      key={`${entry.id}-bullet-${index}`}
                      className="space-y-1"
                    >
                      <div className="flex gap-2">
                        <Textarea
                          value={point}
                          onChange={(e) =>
                            updateBulletPoint(entry.id, index, e.target.value)
                          }
                          placeholder={[
                            "Used [tool/skill] to [action] resulting in [quantifiable result]",
                            "Achieved [result] by implementing [action/strategy]",
                            "Led [project/team] that delivered [outcome] under [conditions]"
                          ][index % 3]}
                          rows={2}
                          className="flex-1"
                        />
                        <Button
                          onClick={() => removeBulletPoint(entry.id, index)}
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 flex-shrink-0"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {index === 0 && (
                        <div className="text-xs text-gray-500 px-2">
                          <span className="font-medium">ATS Tip:</span> Use specific action verbs, include measurable achievements, and mention relevant technologies or skills.
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {entry.bulletPoints.length < 3 && (
                    <Button
                      onClick={() => addBulletPoint(entry.id)}
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Point
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 