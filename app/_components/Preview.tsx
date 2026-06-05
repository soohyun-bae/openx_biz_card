"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CardFieldsForm } from "./CardFieldsForm";
import { CardPreviewPanel } from "./CardPreviewPanel";
import { drawCard } from "./cardCanvas";
import {
  cardSize,
  hellobellWebsite,
  initialContentVisibility,
  initialData,
  kcstEmail,
  kcstWebsite,
  openxDefaultStyle,
} from "./businessCardData";
import { ContentSelector } from "./ContentSelector";
import type {
  CardContentKey,
  CardContentVisibility,
  CardData,
  CustomImageLayer,
  CustomLayer,
  CustomTextLayer,
  FieldKey,
  FontStyle,
  LogoPresetId,
  OpenxCardStyle,
  OpenxEditablePart,
} from "./businessCardTypes";

type OpenxFontStyleKey = Exclude<OpenxEditablePart, "logo">;
type CustomLayerPatch = Partial<CustomTextLayer> | Partial<CustomImageLayer>;
type EditorStep = "select" | "edit";

const defaultEmails = [initialData.email, kcstEmail];
const defaultWebsites = [initialData.website, kcstWebsite, hellobellWebsite];

const createLayerId = () =>
  crypto.randomUUID?.() ?? `layer-${Date.now()}-${Math.random()}`;

const getDefaultStyle = (presetId: LogoPresetId): OpenxCardStyle => {
  if (presetId === "hellobell") {
    return {
      ...openxDefaultStyle,
      englishName: {
        ...openxDefaultStyle.englishName,
        weight: 200,
      },
      role: {
        ...openxDefaultStyle.role,
        weight: 400,
      },
    };
  }

  return openxDefaultStyle;
};

const getTemplateContactData = (presetId: LogoPresetId) => {
  if (presetId === "kcst") {
    return {
      email: kcstEmail,
      website: kcstWebsite,
    };
  }

  if (presetId === "hellobell") {
    return {
      email: initialData.email,
      website: hellobellWebsite,
    };
  }

  return {
    email: initialData.email,
    website: initialData.website,
  };
};

const isDefaultEmail = (email: string) => defaultEmails.includes(email);
const isDefaultWebsite = (website: string) => defaultWebsites.includes(website);

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
  const [customLayers, setCustomLayers] = useState<CustomLayer[]>([]);
  const [selectedCustomLayerId, setSelectedCustomLayerId] = useState<
    string | null
  >(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isSelectStep = step === "select";
  const isCustomTemplate = selectedLogoPreset === "customTemplate";
  const previewData = useMemo<CardData>(
    () =>
      isSelectStep
        ? {
            ...initialData,
            ...getTemplateContactData(selectedLogoPreset),
          }
        : data,
    [data, isSelectStep, selectedLogoPreset],
  );
  const requiredVisibility = useMemo<CardContentVisibility>(
    () => ({
      ...visibility,
      logo: true,
      name: true,
      englishName: selectedLogoPreset === "hellobell",
      role: true,
    }),
    [selectedLogoPreset, visibility],
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
        customLayers,
      },
    );
  }, [
    customLayers,
    openxStyle,
    previewData,
    requiredVisibility,
    selectedLogoPreset,
  ]);

  const updateField = (field: FieldKey, value: string) => {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const toggleContent = (key: CardContentKey, enabled: boolean) => {
    if (
      key === "logo" ||
      key === "name" ||
      key === "englishName" ||
      key === "role"
    ) {
      return;
    }

    setVisibility((current) => ({
      ...current,
      [key]: enabled,
    }));
  };

  const selectLogoPreset = (presetId: LogoPresetId) => {
    setSelectedLogoPreset(presetId);
    if (presetId !== "hellobell" && selectedOpenxPart === "englishName") {
      setSelectedOpenxPart("name");
    }

    if (presetId === "hellobell") {
      setVisibility((current) => ({
        ...current,
        sponsorImage: false,
      }));

      setOpenxStyle((current) => ({
        ...current,
        englishName: {
          ...current.englishName,
          weight: 200,
        },
        role: {
          ...current.role,
          weight: 400,
        },
      }));
    }

    if (presetId === "customTemplate" && customLayers.length === 0) {
      const firstLayer: CustomTextLayer = {
        id: createLayerId(),
        type: "text",
        text: "텍스트를 입력하세요",
        x: cardSize.width / 2,
        y: cardSize.height / 2,
        size: 42,
        weight: 500,
        letterSpacing: 0,
        color: openxStyle.primaryColor,
        align: "center",
      };

      setCustomLayers([firstLayer]);
      setSelectedCustomLayerId(firstLayer.id);
    }

    setData((current) => {
      const templateContactData = getTemplateContactData(presetId);

      return {
        ...current,
        email: isDefaultEmail(current.email)
          ? templateContactData.email
          : current.email,
        website: isDefaultWebsite(current.website)
          ? templateContactData.website
          : current.website,
      };
    });
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

  const resetOpenxFont = (key: OpenxFontStyleKey) => {
    const defaultStyle = getDefaultStyle(selectedLogoPreset);

    setOpenxStyle((current) => ({
      ...current,
      [key]: {
        ...defaultStyle[key],
      },
    }));
  };

  const updateLogoSize = (value: number) => {
    setOpenxStyle((current) => ({
      ...current,
      logoSize: value,
    }));
  };

  const resetLogoSize = () => {
    setOpenxStyle((current) => ({
      ...current,
      logoSize: openxDefaultStyle.logoSize,
      logoOffsetY: openxDefaultStyle.logoOffsetY,
    }));
  };

  const updateLogoOffsetY = (value: number) => {
    setOpenxStyle((current) => ({
      ...current,
      logoOffsetY: value,
    }));
  };

  const updateBackgroundColor = (color: string) => {
    setOpenxStyle((current) => ({
      ...current,
      backgroundColor: color,
    }));
  };

  const addCustomTextLayer = () => {
    const layer: CustomTextLayer = {
      id: createLayerId(),
      type: "text",
      text: "새 텍스트",
      x: cardSize.width / 2,
      y: cardSize.height / 2,
      size: 36,
      weight: 400,
      letterSpacing: 0,
      color: openxStyle.primaryColor,
      align: "center",
    };

    setCustomLayers((current) => [...current, layer]);
    setSelectedCustomLayerId(layer.id);
  };

  const addCustomImageLayer = (file: File | undefined) => {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const layer: CustomImageLayer = {
        id: createLayerId(),
        type: "image",
        src: String(reader.result ?? ""),
        x: 120,
        y: 120,
        width: 240,
        height: 160,
        opacity: 1,
      };

      setCustomLayers((current) => [...current, layer]);
      setSelectedCustomLayerId(layer.id);
    };
    reader.readAsDataURL(file);
  };

  const updateCustomLayer = (id: string, patch: CustomLayerPatch) => {
    setCustomLayers((current) =>
      current.map((layer) =>
        layer.id === id ? ({ ...layer, ...patch } as CustomLayer) : layer,
      ),
    );
  };

  const deleteCustomLayer = (id: string) => {
    setCustomLayers((current) => {
      const next = current.filter((layer) => layer.id !== id);

      setSelectedCustomLayerId((selectedId) =>
        selectedId === id ? (next.at(-1)?.id ?? null) : selectedId,
      );

      return next;
    });
  };

  const moveCustomLayer = (id: string, direction: -1 | 1) => {
    setCustomLayers((current) => {
      const index = current.findIndex((layer) => layer.id === id);
      const nextIndex = index + direction;

      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) {
        return current;
      }

      const next = [...current];
      const [layer] = next.splice(index, 1);
      next.splice(nextIndex, 0, layer);

      return next;
    });
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
      customLayers,
    });

    const link = document.createElement("a");
    link.download = isCustomTemplate
      ? "custom-template-openx.png"
      : `${data.name || "business-card"}-openx.png`;
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
                온라인 명함 커스텀 제작
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
            selectedLogoPreset={selectedLogoPreset}
            selectedOpenxPart={selectedOpenxPart}
            onSelectOpenxPart={setSelectedOpenxPart}
            canEditStyle={!isSelectStep && !isCustomTemplate}
            canEditCustomTemplate={!isSelectStep && isCustomTemplate}
            customLayers={customLayers}
            selectedCustomLayerId={selectedCustomLayerId}
            onSelectCustomLayer={setSelectedCustomLayerId}
            onUpdateCustomLayer={updateCustomLayer}
            canSave={false}
          />

          <div className="flex w-full max-w-[703px] flex-col gap-[20px] lg:h-[var(--editor-panel-height)] lg:overflow-hidden">
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
                  onSelectLogoPreset={selectLogoPreset}
                  onNext={() => setStep("edit")}
                />
              </>
            ) : (
              <>
                <CardFieldsForm
                  data={data}
                  visibility={requiredVisibility}
                  selectedLogoPreset={selectedLogoPreset}
                  style={openxStyle}
                  selectedOpenxPart={selectedOpenxPart}
                  customLayers={customLayers}
                  selectedCustomLayerId={selectedCustomLayerId}
                  onUpdateField={updateField}
                  onUpdateFont={updateOpenxFont}
                  onResetFont={resetOpenxFont}
                  onUpdateLogoSize={updateLogoSize}
                  onUpdateLogoOffsetY={updateLogoOffsetY}
                  onResetLogoSize={resetLogoSize}
                  onSelectCustomLayer={setSelectedCustomLayerId}
                  onAddCustomTextLayer={addCustomTextLayer}
                  onAddCustomImageLayer={addCustomImageLayer}
                  onUpdateCustomLayer={updateCustomLayer}
                  onDeleteCustomLayer={deleteCustomLayer}
                  onMoveCustomLayer={moveCustomLayer}
                  onUpdateBackgroundColor={updateBackgroundColor}
                  onBackToContentSelect={() => setStep("select")}
                  onSavePng={savePng}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
