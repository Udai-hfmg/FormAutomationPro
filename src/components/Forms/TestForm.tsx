import React, { useState } from "react";
import FormContainer from "../UI/FormContainer";
import HeaderImage from "../UI/HeaderImage";

type TestFormProps = {
  template: string;
};

const TestForm = ({ template }: TestFormProps) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Detect alignment
  const getAlignment = (line: string) => {
    if (line.startsWith("{center}")) return "text-center";
    if (line.startsWith("{right}")) return "text-right";
    if (line.startsWith("{left}")) return "text-left";
    return "";
  };

  const cleanAlignmentTags = (line: string) => {
    return line
      .replace("{center}", "")
      .replace("{/center}", "")
      .replace("{left}", "")
      .replace("{/left}", "")
      .replace("{right}", "")
      .replace("{/right}", "");
  };

  const renderLine = (line: string, index: number) => {
    const alignmentClass = getAlignment(line);
    const cleanLine = cleanAlignmentTags(line);

    // Split fields and bold
    const parts = cleanLine.split(/(\{\{.*?\}\}|\*\*.*?\*\*)/g);

    return (
      <div
        key={index}
        className={`flex flex-wrap items-end gap-2 mb-4 ${alignmentClass}`}
      >
        {parts.map((part, i) => {
          // FIELD {{name:type:req}}
          if (part.startsWith("{{") && part.endsWith("}}")) {
            const content = part.slice(2, -2);
            const [name, type, required] = content.split(":");

            return (
              <input
                key={i}
                type={type || "text"}
                required={required === "req"}
                value={formData[name] || ""}
                onChange={(e) => handleChange(name, e.target.value)}
                className="border-b border-black outline-none px-1 min-w-[120px]"
              />
            );
          }

          // BOLD **text**
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="font-bold">
                {part.slice(2, -2)}
              </strong>
            );
          }

          // Normal text
          return (
            <span key={i} className="whitespace-pre-wrap">
              {part}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <FormContainer>
      <HeaderImage />

      {template
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line, index) => renderLine(line, index))}

      {/* Submit Button */}
      <div className="mt-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => console.log(formData)}
        >
          Submit
        </button>
      </div>

      {/* Preview */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Form Data Preview</h3>
        <pre className="text-xs overflow-x-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </FormContainer>
  );
};

export default TestForm;