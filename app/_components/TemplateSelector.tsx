import type { Template } from "./businessCardTypes";
import { TemplateThumb } from "./TemplateThumb";

type TemplateSelectorProps = {
  templates: Template[];
  selectedTemplateId: string;
  onSelectTemplate: (templateId: string) => void;
};

export const TemplateSelector = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateSelectorProps) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="text-lg font-bold">템플릿 선택</h2>
    <div className="mt-4 grid gap-3">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          onClick={() => onSelectTemplate(template.id)}
          className={`grid grid-cols-[92px_1fr] items-center gap-3 rounded-md border p-3 text-left transition ${
            selectedTemplateId === template.id
              ? "border-teal-500 bg-teal-50"
              : "border-slate-200 bg-white hover:border-slate-400"
          }`}
        >
          <TemplateThumb templateId={template.id} />
          <span>
            <span className="block font-bold">{template.name}</span>
            <span className="mt-1 block text-sm text-slate-600">
              {template.description}
            </span>
          </span>
        </button>
      ))}
    </div>
  </div>
);
