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
  onNext: () => void;
};

const contentKeys: CardContentKey[] = [
  "sponsorImage",
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
  onNext,
}: ContentSelectorProps) => (
  <div className="flex min-h-0 flex-1 flex-col rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm">
    <h2 className="text-lg text-main text-center">로고 이미지</h2>
    {visibility.logo ? (
      <div className="mt-4 grid gap-2 border-slate-200">
        <div className="grid grid-cols-4 gap-3">
          {logoPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectLogoPreset(preset.id)}
              className={`h-14 rounded-md border px-3 text-sm transition ${
                selectedLogoPreset === preset.id
                  ? "border-main text-main font-bold"
                  : "border-[#F1F5F9] bg-white text-sub hover:border-slate-400"
              }`}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    ) : null}
    <div className="mt-5 grid min-h-0 flex-1 grid-cols-2 auto-rows-fr gap-3">
      {contentKeys.map((key) => {
        const isVisible = visibility[key];

        return (
          <button
            key={key}
            type="button"
            aria-pressed={isVisible}
            onClick={() => onToggleContent(key, !isVisible)}
            className={`min-h-16 rounded-md border px-3 py-3 text-sm transition text-sub ${
              isVisible
                ? "border-main text-main font-bold"
                : "border-[#F1F5F9] bg-white text-sub hover:border-slate-400"
            }`}
          >
            {contentLabels[key]}
          </button>
        );
      })}
    </div>
    <button
      type="button"
      onClick={onNext}
      className="mt-5 h-14 w-full rounded-[50px] bg-main px-5 font-bold text-white transition hover:bg-[#4D9ECC]"
    >
      다음
    </button>
  </div>
);
