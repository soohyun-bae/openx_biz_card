"use client";

import { useEffect, useRef, useState } from "react";
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

type OpenxFontStyleKey = "name" | "role" | "company" | "contact" | "website";
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
      "openx",
      previewData,
      (previewWidth / cardSize.width) * ratio,
      {
        openx: openxStyle,
        content: visibility,
        logoPreset: selectedLogoPreset,
      },
    );
  }, [openxStyle, previewData, selectedLogoPreset, visibility]);

  const updateField = (field: FieldKey, value: string) => {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleContent = (key: CardContentKey, enabled: boolean) => {
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
    await drawCard(context, "openx", data, exportScale, {
      openx: openxStyle,
      content: visibility,
      logoPreset: selectedLogoPreset,
    });

    const link = document.createElement("a");
    link.download = `${data.name || "business-card"}-openx.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-5 py-6 text-slate-950 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
            Business Card Maker
          </p>
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            내용을 고르고, 다음 단계에서 세부 정보를 수정해요.
          </h1>
        </header>

        <section className="grid gap-6 lg:grid-cols-[390px_1fr]">
          <div className="flex flex-col gap-5">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className={`h-11 rounded-md text-sm font-bold transition ${
                    isSelectStep
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  1. 내용 선택
                </button>
                <button
                  type="button"
                  onClick={() => setStep("edit")}
                  className={`h-11 rounded-md text-sm font-bold transition ${
                    !isSelectStep
                      ? "bg-slate-950 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  2. 내용 수정
                </button>
              </div>
            </div>

            {isSelectStep ? (
              <>
                <ContentSelector
                  visibility={visibility}
                  selectedLogoPreset={selectedLogoPreset}
                  onToggleContent={toggleContent}
                  onSelectLogoPreset={setSelectedLogoPreset}
                />
                <button
                  type="button"
                  onClick={() => setStep("edit")}
                  className="h-12 rounded-md bg-teal-600 px-5 font-bold text-white transition hover:bg-teal-700"
                >
                  다음
                </button>
              </>
            ) : (
              <>
                <CardFieldsForm
                  data={data}
                  visibility={visibility}
                  selectedLogoPreset={selectedLogoPreset}
                  onUpdateField={updateField}
                />
                <OpenxStyleForm
                  style={openxStyle}
                  selectedPart={selectedOpenxPart}
                  onUpdateStyle={updateOpenxStyle}
                  onUpdateFont={updateOpenxFont}
                />
                <button
                  type="button"
                  onClick={() => setStep("select")}
                  className="h-11 rounded-md border border-slate-300 px-5 font-bold text-slate-700 transition hover:border-teal-500 hover:text-teal-700"
                >
                  내용 선택으로 돌아가기
                </button>
              </>
            )}
          </div>

          <CardPreviewPanel
            canvasRef={canvasRef}
            onSavePng={savePng}
            selectedOpenxPart={selectedOpenxPart}
            onSelectOpenxPart={setSelectedOpenxPart}
            canEditStyle={!isSelectStep}
            canSave={!isSelectStep}
          />
        </section>
      </div>
    </main>
  );
}
