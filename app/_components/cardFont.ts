const cardFontFamily = '"Pretendard", "Malgun Gothic", sans-serif';

export const getCardFontFamily = () => cardFontFamily;

export const getCanvasFont = (weight: number | string, size: number) =>
  `${weight} ${size}px ${getCardFontFamily()}`;

export const ensureCardFontLoaded = async () => {
  if (typeof document === "undefined" || !document.fonts) {
    return;
  }

  await document.fonts.load(`400 16px ${cardFontFamily}`);
  await document.fonts.ready;
};
