import { useRef } from "react";
import type {
  CustomImageLayer,
  CustomLayer,
  CustomTextAlign,
  CustomTextLayer,
} from "./businessCardTypes";

type CustomLayerPatch = Partial<CustomTextLayer> | Partial<CustomImageLayer>;

type CustomTemplateFormProps = {
  layers: CustomLayer[];
  selectedLayerId: string | null;
  backgroundColor: string;
  onSelectLayer: (id: string) => void;
  onAddTextLayer: () => void;
  onAddImageLayer: (file: File | undefined) => void;
  onUpdateLayer: (id: string, patch: CustomLayerPatch) => void;
  onDeleteLayer: (id: string) => void;
  onMoveLayer: (id: string, direction: -1 | 1) => void;
  onUpdateBackgroundColor: (color: string) => void;
  onBackToContentSelect: () => void;
  onSavePng: () => Promise<void>;
};

type NumberInputProps = {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
};

const toNumber = (value: string, fallback: number) => {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : fallback;
};

const NumberInput = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}: NumberInputProps) => (
  <label className="grid gap-1.5">
    <span className="text-sm font-semibold text-main">{label}</span>
    <input
      type="number"
      value={value}
      min={min}
      max={max}
      step={step}
      onChange={(event) => onChange(toNumber(event.target.value, value))}
      className="h-11 rounded-md border border-slate-300 px-3 text-base outline-none transition focus:border-main focus:ring-2 focus:ring-teal-100"
    />
  </label>
);

export const CustomTemplateForm = ({
  layers,
  selectedLayerId,
  backgroundColor,
  onSelectLayer,
  onAddTextLayer,
  onAddImageLayer,
  onUpdateLayer,
  onDeleteLayer,
  onMoveLayer,
  onUpdateBackgroundColor,
  onBackToContentSelect,
  onSavePng,
}: CustomTemplateFormProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);
  const selectedLayer =
    layers.find((layer) => layer.id === selectedLayerId) ?? layers.at(-1);
  const selectedIndex = selectedLayer
    ? layers.findIndex((layer) => layer.id === selectedLayer.id)
    : -1;

  const addImageLayer = (file: File | undefined) => {
    onAddImageLayer(file);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  return (
    <div className="flex min-h-0 flex-col rounded-[30px] border border-slate-200 bg-white p-5 shadow-sm lg:flex-1 lg:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={onAddTextLayer}
            className="h-12 rounded-md bg-slate-950 px-4 text-sm font-bold text-white transition hover:bg-main"
          >
            텍스트 추가
          </button>
          <button
            type="button"
            onClick={() => imageInputRef.current?.click()}
            className="h-12 rounded-md border border-slate-300 px-4 text-sm font-bold text-slate-700 transition hover:border-main hover:text-main"
          >
            이미지 추가
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={(event) => addImageLayer(event.target.files?.[0])}
            className="hidden"
          />
        </div>

        <label className="grid gap-1.5">
          <span className="text-sm font-semibold text-main">배경색</span>
          <input
            type="color"
            value={backgroundColor}
            onChange={(event) => onUpdateBackgroundColor(event.target.value)}
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-2"
          />
        </label>

        <div className="grid gap-2">
          <span className="text-sm font-semibold text-main">레이어</span>
          <div className="grid max-h-40 gap-2 overflow-y-auto rounded-md border border-slate-200 p-2">
            {layers.length ? (
              layers.map((layer, index) => (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => onSelectLayer(layer.id)}
                  className={`h-10 rounded-md border px-3 text-left text-sm transition ${
                    selectedLayer?.id === layer.id
                      ? "border-main font-bold text-main"
                      : "border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {index + 1}. {layer.type === "text" ? layer.text : "이미지"}
                </button>
              ))
            ) : (
              <p className="py-3 text-center text-sm text-slate-500">
                아직 레이어가 없습니다.
              </p>
            )}
          </div>
        </div>

        {selectedLayer ? (
          <div className="grid gap-4 rounded-md border border-slate-200 p-4">
            <div className="flex items-center justify-between gap-2">
              <strong className="text-sm text-sub">
                {selectedLayer.type === "text" ? "텍스트 레이어" : "이미지 레이어"}
              </strong>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onMoveLayer(selectedLayer.id, -1)}
                  disabled={selectedIndex <= 0}
                  className="h-9 rounded-md border border-slate-300 px-3 text-sm font-bold text-slate-700 disabled:opacity-40"
                >
                  뒤로
                </button>
                <button
                  type="button"
                  onClick={() => onMoveLayer(selectedLayer.id, 1)}
                  disabled={selectedIndex === layers.length - 1}
                  className="h-9 rounded-md border border-slate-300 px-3 text-sm font-bold text-slate-700 disabled:opacity-40"
                >
                  앞으로
                </button>
              </div>
            </div>

            <p className="rounded-md bg-slate-50 px-3 py-2 text-sm text-slate-500">
              위치는 왼쪽 미리보기에서 레이어를 끌어서 조정하세요.
            </p>

            {selectedLayer.type === "text" ? (
              <>
                <label className="grid gap-1.5">
                  <span className="text-sm font-semibold text-main">내용</span>
                  <textarea
                    value={selectedLayer.text}
                    onChange={(event) =>
                      onUpdateLayer(selectedLayer.id, {
                        text: event.target.value,
                      })
                    }
                    className="min-h-24 rounded-md border border-slate-300 px-3 py-2 text-base outline-none transition focus:border-main focus:ring-2 focus:ring-teal-100"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <NumberInput
                    label="크기"
                    value={selectedLayer.size}
                    min={8}
                    max={140}
                    onChange={(value) =>
                      onUpdateLayer(selectedLayer.id, { size: value })
                    }
                  />
                  <NumberInput
                    label="굵기"
                    value={selectedLayer.weight}
                    min={100}
                    max={900}
                    step={100}
                    onChange={(value) =>
                      onUpdateLayer(selectedLayer.id, { weight: value })
                    }
                  />
                  <NumberInput
                    label="자간"
                    value={selectedLayer.letterSpacing}
                    min={0}
                    max={60}
                    onChange={(value) =>
                      onUpdateLayer(selectedLayer.id, {
                        letterSpacing: value,
                      })
                    }
                  />
                  <label className="grid gap-1.5">
                    <span className="text-sm font-semibold text-main">색상</span>
                    <input
                      type="color"
                      value={selectedLayer.color}
                      onChange={(event) =>
                        onUpdateLayer(selectedLayer.id, {
                          color: event.target.value,
                        })
                      }
                      className="h-11 rounded-md border border-slate-300 bg-white px-2"
                    />
                  </label>
                </div>
                <select
                  value={selectedLayer.align}
                  onChange={(event) =>
                    onUpdateLayer(selectedLayer.id, {
                      align: event.target.value as CustomTextAlign,
                    })
                  }
                  className="h-11 rounded-md border border-slate-300 px-3 text-base outline-none transition focus:border-main focus:ring-2 focus:ring-teal-100"
                >
                  <option value="left">왼쪽 정렬</option>
                  <option value="center">가운데 정렬</option>
                  <option value="right">오른쪽 정렬</option>
                </select>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <NumberInput
                  label="폭"
                  value={selectedLayer.width}
                  min={1}
                  max={850}
                  onChange={(value) =>
                    onUpdateLayer(selectedLayer.id, { width: value })
                  }
                />
                <NumberInput
                  label="높이"
                  value={selectedLayer.height}
                  min={1}
                  max={550}
                  onChange={(value) =>
                    onUpdateLayer(selectedLayer.id, { height: value })
                  }
                />
                <NumberInput
                  label="투명도"
                  value={selectedLayer.opacity}
                  min={0}
                  max={1}
                  step={0.05}
                  onChange={(value) =>
                    onUpdateLayer(selectedLayer.id, { opacity: value })
                  }
                />
              </div>
            )}

            <button
              type="button"
              onClick={() => onDeleteLayer(selectedLayer.id)}
              className="h-11 rounded-md border border-red-200 px-4 text-sm font-bold text-red-600 transition hover:bg-red-50"
            >
              레이어 삭제
            </button>
          </div>
        ) : null}

        <div className="grid gap-3">
          <button
            type="button"
            onClick={onBackToContentSelect}
            className="h-14 w-full rounded-[50px] border border-slate-300 px-5 font-bold text-slate-700 transition hover:border-main hover:text-main"
          >
            내용 선택으로 돌아가기
          </button>
          <button
            type="button"
            onClick={onSavePng}
            className="h-14 w-full rounded-[50px] bg-main px-5 font-bold text-white transition hover:bg-[#4D9ECC]"
          >
            PNG 저장
          </button>
        </div>
      </div>
    </div>
  );
};
