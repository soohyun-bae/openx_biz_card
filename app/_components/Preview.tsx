"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CardFieldsForm } from "./CardFieldsForm";
import { CardPreviewPanel } from "./CardPreviewPanel";
import { drawCard } from "./cardCanvas";
import {
  cardSize,
  initialContentVisibility,
  initialData,
  openxDefaultStyle,
} from "./businessCardData";
import { ContentSelector } from "./ContentSelector";
import { OpenxStyleForm } from "./OpenxStyleForm";
import type {
  CardContentKey,
  CardContentVisibility,
  CardData,
  FieldKey,
  FontStyle,
  LogoPresetId,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

type OpenxFontStyleKey = "name" | "role" | "contact" | "website";
type EditorStep = "select" | "edit";

export default function Preview() {
  const [step, setStep] = useState<EditorStep>("select");
  const [data, setData] = useState<CardData>(initialData);
  const [visibility, setVisibility] = useState<CardContentVisibility>(
    initialContentVisibility,
  );
  const [selectedLogoPreset, setSelectedLogoPreset] =
    useState<LogoPresetId>("openx");
  const [openxStyle, setOpenxStyle] =
    useState<OpenxCardStyle>(openxDefaultStyle);
  const [selectedOpenxPart, setSelectedOpenxPart] =
    useState<OpenxEditablePart>("name");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSelectStep = step === "select";
  const previewData = isSelectStep ? initialData : data;
  const requiredVisibility = useMemo<CardContentVisibility>(
    () => ({
      ...visibility,
      logo: true,
      name: true,
      role: true,
    }),
    [visibility],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const ratio = window.devicePixelRatio || 1;
    const previewWidth = 700;
    const previewHeight = Math.round(
      (previewWidth * cardSize.height) / cardSize.width,
    );

    canvas.width = previewWidth * ratio;
    canvas.height = previewHeight * ratio;
    canvas.style.width = `${previewWidth}px`;
    canvas.style.height = `${previewHeight}px`;
    void drawCard(
      context,
      previewData,
      (previewWidth / cardSize.width) * ratio,
      {
        openx: openxStyle,
        content: requiredVisibility,
        logoPreset: selectedLogoPreset,
      },
    );
  }, [openxStyle, previewData, requiredVisibility, selectedLogoPreset]);

  const updateField = (field: FieldKey, value: string) => {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleContent = (key: CardContentKey, enabled: boolean) => {
    if (key === "logo" || key === "name" || key === "role") {
      return;
    }

    setVisibility((current) => ({
      ...current,
      [key]: enabled,
    }));
  };

  const updateOpenxStyle = <Key extends keyof OpenxCardStyle>(
    key: Key,
    value: OpenxCardStyle[Key],
  ) => {
    setOpenxStyle((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const updateOpenxFont = (
    key: OpenxFontStyleKey,
    fontKey: keyof FontStyle,
    value: number,
  ) => {
    setOpenxStyle((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [fontKey]: value,
      },
    }));
  };

  const savePng = async () => {
    const exportScale = 4;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = cardSize.width * exportScale;
    canvas.height = cardSize.height * exportScale;
    await drawCard(context, data, exportScale, {
      openx: openxStyle,
      content: requiredVisibility,
      logoPreset: selectedLogoPreset,
    });

    const link = document.createElement("a");
    link.download = `${data.name || "business-card"}-openx.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-slate-950">
      <header className="w-full rounded-b-[30px] border-b border-slate-200 bg-white py-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
        <div className="mx-auto w-full max-w-[1621px] px-5 sm:px-8 lg:px-10">
          <div className="grid justify-center gap-6 lg:grid-cols-[minmax(0,866px)_minmax(0,703px)]">
            <div className="flex w-full max-w-[866px] flex-col gap-2">
              <p className="text-sm uppercase tracking-[0.16em] text-main">
                Business Card Maker
              </p>
              <h1 className="text-3xl font-bold text-sub leading-tight sm:text-4xl">
                명함 커스텀 제작
              </h1>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-[1621px] flex-col gap-6 px-5 py-6 sm:px-8 lg:px-10">
        <section className="grid justify-center gap-6 lg:grid-cols-[minmax(0,866px)_minmax(0,703px)]">
          <CardPreviewPanel
            canvasRef={canvasRef}
            onSavePng={savePng}
            data={previewData}
            style={openxStyle}
            visibility={requiredVisibility}
            selectedOpenxPart={selectedOpenxPart}
            onSelectOpenxPart={setSelectedOpenxPart}
            canEditStyle={!isSelectStep}
            canSave={!isSelectStep}
          />

          <div className="flex w-full max-w-[703px] flex-col gap-[20px] lg:h-[var(--editor-panel-height)] lg:overflow-y-auto">
            <div className="rounded-[50px] border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center rounded-[50px]">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className={`relative h-14 flex-1 rounded-[50px] text-sm font-bold transition ${
                    isSelectStep
                      ? "z-20 bg-main text-white"
                      : "z-10 -mr-10 bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  1. 내용 선택
                </button>
                <button
                  type="button"
                  onClick={() => setStep("edit")}
                  className={`relative h-14 flex-1 rounded-[50px] text-sm font-bold transition ${
                    !isSelectStep
                      ? "z-20 bg-main text-white"
                      : "z-10 -ml-10 bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  2. 내용 수정
                </button>
              </div>
            </div>
            {isSelectStep ? (
              <>
                <ContentSelector
                  visibility={requiredVisibility}
                  selectedLogoPreset={selectedLogoPreset}
                  onToggleContent={toggleContent}
                  onSelectLogoPreset={setSelectedLogoPreset}
                  onNext={() => setStep("edit")}
                />
              </>
            ) : (
              <>
                <CardFieldsForm
                  data={data}
                  visibility={requiredVisibility}
                  selectedLogoPreset={selectedLogoPreset}
                  onUpdateField={updateField}
                  onBackToContentSelect={() => setStep("select")}
                />
                <div className="mt-[20px]">
                  <OpenxStyleForm
                    style={openxStyle}
                    selectedPart={selectedOpenxPart}
                    onUpdateStyle={updateOpenxStyle}
                    onUpdateFont={updateOpenxFont}
                  />
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
