"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { TemplateThumb } from "./TemplateThumb";

type FieldKey =
  | "name"
  | "role"
  | "company"
  | "phone"
  | "email"
  | "website"
  | "address"
  | "slogan";

type CardData = Record<FieldKey, string>;

type Template = {
  id: string;
  name: string;
  description: string;
  fields: FieldKey[];
};

const cardSize = {
  width: 1050,
  height: 600,
};

const fieldLabels: Record<FieldKey, string> = {
  name: "이름",
  role: "직책",
  company: "회사명",
  phone: "전화번호",
  email: "이메일",
  website: "웹사이트",
  address: "주소",
  slogan: "슬로건",
};

const initialData: CardData = {
  name: "홍길동",
  role: "Brand Designer",
  company: "OPENX Studio",
  phone: "010-1234-5678",
  email: "hello@openx.kr",
  website: "openx.kr",
  address: "Seoul, Korea",
  slogan: "Design that opens new value",
};

const templates: Template[] = [
  {
    id: "minimal",
    name: "Minimal Line",
    description: "얇은 라인과 넓은 여백",
    fields: ["name", "role", "company", "phone", "email", "website"],
  },
  {
    id: "bold",
    name: "Bold Signal",
    description: "강한 로고 블록과 선명한 대비",
    fields: ["name", "role", "company", "phone", "email", "address"],
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "세로 타이포그래피와 잡지형 구성",
    fields: ["name", "company", "phone", "email", "website", "slogan"],
  },
  {
    id: "tech",
    name: "Tech Grid",
    description: "그리드와 포인트 컬러",
    fields: ["name", "role", "company", "phone", "email", "website"],
  },
  {
    id: "premium",
    name: "Premium Mark",
    description: "고급스러운 중앙 심볼",
    fields: ["name", "role", "company", "phone", "email", "address"],
  },
];

const fitText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) => {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  words.forEach((word) => {
    const nextLine = line ? `${line} ${word}` : word;

    if (context.measureText(nextLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
      return;
    }

    line = nextLine;
  });

  if (line) {
    lines.push(line);
  }

  lines.slice(0, 2).forEach((textLine, index) => {
    context.fillText(textLine, x, y + index * lineHeight);
  });
};

const setFont = (
  context: CanvasRenderingContext2D,
  size: number,
  weight: number | string = 400,
) => {
  context.font = `${weight} ${size}px Arial, Helvetica, sans-serif`;
};

const drawContact = (
  context: CanvasRenderingContext2D,
  data: CardData,
  x: number,
  y: number,
  color: string,
  align: CanvasTextAlign = "left",
) => {
  context.textAlign = align;
  context.fillStyle = color;
  setFont(context, 28, 500);
  context.fillText(data.phone, x, y);
  context.fillText(data.email, x, y + 44);
};

const drawCard = (
  context: CanvasRenderingContext2D,
  templateId: string,
  data: CardData,
  scale = 1,
) => {
  context.save();
  context.scale(scale, scale);
  context.clearRect(0, 0, cardSize.width, cardSize.height);
  context.textBaseline = "alphabetic";

  if (templateId === "minimal") {
    context.fillStyle = "#fafafa";
    context.fillRect(0, 0, cardSize.width, cardSize.height);
    context.strokeStyle = "#111827";
    context.lineWidth = 3;
    context.strokeRect(56, 56, 938, 488);
    context.fillStyle = "#111827";
    setFont(context, 70, 700);
    context.fillText(data.name, 96, 220);
    setFont(context, 30, 500);
    context.fillText(data.role, 100, 276);
    setFont(context, 34, 700);
    context.fillText(data.company, 100, 430);
    drawContact(context, data, 640, 418, "#334155");
    setFont(context, 26, 600);
    context.fillText(data.website, 640, 506);
  }

  if (templateId === "bold") {
    context.fillStyle = "#111827";
    context.fillRect(0, 0, cardSize.width, cardSize.height);
    context.fillStyle = "#f97316";
    context.fillRect(0, 0, 350, 600);
    context.fillStyle = "#111827";
    context.beginPath();
    context.arc(175, 235, 86, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffffff";
    setFont(context, 54, 800);
    context.textAlign = "center";
    context.fillText(data.company.slice(0, 2).toUpperCase(), 175, 254);
    context.textAlign = "left";
    setFont(context, 74, 800);
    fitText(context, data.name, 430, 196, 520, 72);
    setFont(context, 31, 600);
    context.fillText(data.role, 434, 300);
    drawContact(context, data, 434, 426, "#e5e7eb");
    setFont(context, 24, 500);
    context.fillText(data.address, 434, 516);
  }

  if (templateId === "editorial") {
    context.fillStyle = "#f8f5ef";
    context.fillRect(0, 0, cardSize.width, cardSize.height);
    context.fillStyle = "#262626";
    context.fillRect(72, 72, 162, 456);
    context.save();
    context.translate(155, 495);
    context.rotate(-Math.PI / 2);
    context.fillStyle = "#f8f5ef";
    setFont(context, 46, 800);
    context.fillText(data.company, 0, 0);
    context.restore();
    context.fillStyle = "#262626";
    setFont(context, 78, 800);
    fitText(context, data.name, 300, 190, 600, 80);
    setFont(context, 30, 500);
    fitText(context, data.slogan, 304, 296, 560, 40);
    drawContact(context, data, 304, 432, "#44403c");
    setFont(context, 26, 700);
    context.fillText(data.website, 304, 524);
  }

  if (templateId === "tech") {
    context.fillStyle = "#f8fafc";
    context.fillRect(0, 0, cardSize.width, cardSize.height);
    context.strokeStyle = "#d1d5db";
    context.lineWidth = 2;
    for (let x = 0; x <= cardSize.width; x += 75) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, cardSize.height);
      context.stroke();
    }
    for (let y = 0; y <= cardSize.height; y += 75) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(cardSize.width, y);
      context.stroke();
    }
    context.fillStyle = "#14b8a6";
    context.fillRect(72, 80, 122, 122);
    context.fillStyle = "#0f172a";
    setFont(context, 76, 800);
    fitText(context, data.name, 72, 342, 610, 78);
    setFont(context, 31, 600);
    context.fillText(`${data.role} / ${data.company}`, 76, 410);
    drawContact(context, data, 730, 386, "#0f172a");
    setFont(context, 26, 700);
    context.fillText(data.website, 730, 474);
  }

  if (templateId === "premium") {
    context.fillStyle = "#f7f2e8";
    context.fillRect(0, 0, cardSize.width, cardSize.height);
    context.fillStyle = "#1f2937";
    context.beginPath();
    context.moveTo(525, 74);
    context.lineTo(610, 160);
    context.lineTo(525, 246);
    context.lineTo(440, 160);
    context.closePath();
    context.fill();
    context.strokeStyle = "#a16207";
    context.lineWidth = 4;
    context.strokeRect(44, 44, 962, 512);
    context.textAlign = "center";
    context.fillStyle = "#1f2937";
    setFont(context, 68, 800);
    context.fillText(data.name, 525, 350);
    setFont(context, 30, 500);
    context.fillText(`${data.role} at ${data.company}`, 525, 404);
    drawContact(context, data, 525, 490, "#374151", "center");
    setFont(context, 22, 500);
    context.fillText(data.address, 525, 552);
  }

  context.restore();
};

export default function Preview() {
  const [selectedTemplateId, setSelectedTemplateId] = useState(templates[0].id);
  const [data, setData] = useState<CardData>(initialData);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedTemplate = useMemo(
    () =>
      templates.find((template) => template.id === selectedTemplateId) ??
      templates[0],
    [selectedTemplateId],
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
    drawCard(
      context,
      selectedTemplate.id,
      data,
      (previewWidth / cardSize.width) * ratio,
    );
  }, [data, selectedTemplate.id]);

  const updateField = (field: FieldKey, value: string) => {
    setData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const savePng = () => {
    const exportScale = 4;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    canvas.width = cardSize.width * exportScale;
    canvas.height = cardSize.height * exportScale;
    drawCard(context, selectedTemplate.id, data, exportScale);

    const link = document.createElement("a");
    link.download = `${data.name || "business-card"}-${selectedTemplate.id}.png`;
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
            템플릿을 고르고 정보를 입력하면 명함이 바로 완성돼요.
          </h1>
        </header>

        <section className="grid gap-6 lg:grid-cols-[390px_1fr]">
          <div className="flex flex-col gap-5">
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold">템플릿 선택</h2>
              <div className="mt-4 grid gap-3">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    type="button"
                    onClick={() => setSelectedTemplateId(template.id)}
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

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-bold">정보 입력</h2>
              <div className="mt-4 grid gap-3">
                {selectedTemplate.fields.map((field) => (
                  <label key={field} className="grid gap-1.5">
                    <span className="text-sm font-semibold text-slate-700">
                      {fieldLabels[field]}
                    </span>
                    <input
                      value={data[field]}
                      onChange={(event) =>
                        updateField(field, event.target.value)
                      }
                      className="h-11 rounded-md border border-slate-300 px-3 text-base outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <section className="flex min-w-0 flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold">실시간 미리보기</h2>
                <p className="mt-1 text-sm text-slate-600">
                  저장 시 4200 x 2400 PNG로 생성됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={savePng}
                className="h-11 rounded-md bg-slate-950 px-5 font-bold text-white transition hover:bg-teal-700"
              >
                PNG 저장
              </button>
            </div>

            <div className="flex flex-1 items-center justify-center overflow-auto rounded-md bg-slate-100 p-4 sm:p-8">
              <canvas
                ref={canvasRef}
                aria-label="명함 미리보기"
                className="h-auto max-w-full rounded-md shadow-2xl"
              />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
