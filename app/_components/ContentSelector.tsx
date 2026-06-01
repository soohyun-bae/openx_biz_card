import { contentLabels, logoPresets } from "./businessCardData";
import type {
  CardContentKey,
  CardContentVisibility,
  LogoPresetId,
} from "./businessCardTypes";

type ContentSelectorProps = {
  visibility: CardContentVisibility;
  selectedLogoPreset: LogoPresetId;
  onToggleContent: (key: CardContentKey, enabled: boolean) => void;
  onSelectLogoPreset: (presetId: LogoPresetId) => void;
};

const contentKeys: CardContentKey[] = [
  "sponsorImage",
  "name",
  "role",
  "logo",
  "phone",
  "fax",
  "email",
  "website",
  "address",
];

export const ContentSelector = ({
  visibility,
  selectedLogoPreset,
  onToggleContent,
  onSelectLogoPreset,
}: ContentSelectorProps) => (
  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
    <h2 className="text-lg font-bold">내용 선택</h2>
    <div className="mt-4 grid gap-2">
      {contentKeys.map((key) => (
        <label
          key={key}
          className="flex min-h-10 items-center gap-3 rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-teal-400"
        >
          <input
            type="checkbox"
            checked={visibility[key]}
            onChange={(event) => onToggleContent(key, event.target.checked)}
            className="h-4 w-4 accent-teal-600"
          />
          <span>{contentLabels[key]}</span>
        </label>
      ))}
    </div>

    {visibility.logo ? (
      <div className="mt-4 grid gap-2 border-t border-slate-200 pt-4">
        <h3 className="text-sm font-bold text-slate-800">로고 이미지 선택</h3>
        <div className="grid grid-cols-2 gap-2">
          {logoPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectLogoPreset(preset.id)}
              className={`h-10 rounded-md border px-3 text-sm font-bold transition ${
                selectedLogoPreset === preset.id
                  ? "border-teal-500 bg-teal-50 text-teal-700"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    ) : null}
  </div>
);
