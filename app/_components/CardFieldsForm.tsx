import { fieldLabels } from "./businessCardData";
import { OpenxStyleForm } from "./OpenxStyleForm";
import type {
  CardContentVisibility,
  CardData,
  FieldKey,
  FontStyle,
  LogoPresetId,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

type OpenxFontStyleKey = "name" | "role" | "contact" | "website";

type CardFieldsFormProps = {
  data: CardData;
  visibility: CardContentVisibility;
  selectedLogoPreset: LogoPresetId;
  style: OpenxCardStyle;
  selectedOpenxPart: OpenxEditablePart;
  onUpdateField: (field: FieldKey, value: string) => void;
  onUpdateFont: (
    key: OpenxFontStyleKey,
    fontKey: keyof FontStyle,
    value: number,
  ) => void;
  onBackToContentSelect: () => void;
};

type EditableField = Extract<FieldKey, keyof CardContentVisibility>;

const editableFields: EditableField[] = [
  "name",
  "role",
  "phone",
  "fax",
  "email",
  "website",
  "address",
];

export const CardFieldsForm = ({
  data,
  visibility,
  selectedLogoPreset,
  style,
  selectedOpenxPart,
  onUpdateField,
  onUpdateFont,
  onBackToContentSelect,
}: CardFieldsFormProps) => {
  const updateLogo = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onUpdateField("logo", String(reader.result ?? ""));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mt-4 grid grid-cols-2 gap-3">
        {editableFields.map((field) =>
          visibility[field] ? (
            <label key={field} className="grid gap-1.5">
              <span className="text-sm font-semibold text-main">
                {fieldLabels[field]}
              </span>
              <input
                value={data[field]}
                onChange={(event) => onUpdateField(field, event.target.value)}
                className="h-11 rounded-md border border-slate-300 px-3 text-base outline-none transition focus:border-main focus:ring-2 focus:ring-teal-100"
              />
            </label>
          ) : null,
        )}

        {visibility.logo && selectedLogoPreset === "custom" ? (
          <label className="grid gap-1.5">
            <span className="text-sm font-semibold text-slate-700">
              {fieldLabels.logo}
            </span>
            <span className="grid gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => updateLogo(event.target.files?.[0])}
                className="block w-full rounded-md border border-slate-300 text-sm text-slate-700 file:mr-3 file:h-11 file:border-0 file:bg-slate-950 file:px-4 file:font-bold file:text-white hover:file:bg-teal-700"
              />
            </span>
          </label>
        ) : null}
      </div>
      <div className="mt-4">
        <OpenxStyleForm
          style={style}
          selectedPart={selectedOpenxPart}
          onUpdateFont={onUpdateFont}
        />
      </div>
      <button
        type="button"
        onClick={onBackToContentSelect}
        className="mt-4 h-14 w-full rounded-[50px] border border-slate-300 px-5 font-bold text-slate-700 transition hover:border-main hover:text-main"
      >
        내용 선택으로 돌아가기
      </button>
    </div>
  );
};
