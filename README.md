# openx_biz_card

OPENX 명함을 브라우저에서 미리 보고 편집한 뒤 PNG로 저장하는 Next.js 프로젝트입니다. 명함에 들어갈 로고, 이름/영어이름/직급, 전화번호/이메일/팩스/사이트주소/주소 텍스트의 글자/로고 크기와 굵기, 자간, 로고 위치를 화면에서 조정할 수 있습니다.

<figure class="half"> <img src="[이미지경로](https://github.com/user-attachments/assets/2692d695-fe73-4d28-a834-77d01a0e2564)"> <img src="[이미지경로](https://github.com/user-attachments/assets/5478825b-6a05-4307-a1a3-f70e192fb88a)"> <figcaption>2개이미지.</figcaption></figure>


## 주요 기능

- OPENX, KCST, HelloBell, 직접 업로드 로고 프리셋 선택
- 전화번호, FAX, 이메일, 웹사이트, 주소, 주관사 이미지, 수상 문구 노출 여부 선택
- 이름, 영문 이름, 직책, 연락처 텍스트 직접 수정
- 캔버스 미리보기 또는 입력 인풋에서 편집할 부분을 클릭해 해당 스타일만 수정
- 명함 결과물을 고해상도 PNG 파일로 저장

## 기술 스택

- Next.js 16.2.6 App Router
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- HTML Canvas 기반 명함 렌더링

## 실행 방법

```bash
npm install
npm run dev
```

## 프로젝트 구조

```text
app/
  layout.tsx
  page.tsx
  globals.css
  _components/
    Preview.tsx
    CardPreviewPanel.tsx
    ContentSelector.tsx
    CardFieldsForm.tsx
    OpenxStyleForm.tsx
    cardCanvas.ts
    cardFont.ts
    businessCardData.ts
    businessCardTypes.ts
public/
  logos/
```

Next.js App Router에서는 `app/page.tsx`가 `/` 경로의 화면을 만듭니다. `app/_components`는 언더스코어로 시작하는 private folder라 라우트로 공개되지 않고, 명함 편집 UI와 렌더링 로직을 모아두는 내부 구현 폴더로 사용합니다.

## 주요 코드 설명

- `app/page.tsx`: 홈 라우트입니다. 실제 화면은 `Preview` 컴포넌트에 위임합니다.
- `app/_components/Preview.tsx`: 명함 편집기의 상태를 관리하는 중심 컴포넌트입니다. 단계 전환, 입력값, 표시 항목, 로고 프리셋, 스타일 상태를 관리하고 캔버스에 명함을 다시 그립니다.
- `app/_components/CardPreviewPanel.tsx`: 캔버스 미리보기와 클릭 가능한 편집 영역을 담당합니다. 사용자가 명함 요소를 클릭하면 해당 요소의 스타일 편집 상태로 전환합니다.
- `app/_components/ContentSelector.tsx`: 명함 템플릿과 표시할 콘텐츠 항목을 선택하는 화면입니다.
- `app/_components/CardFieldsForm.tsx`: 이름, 직급, 연락처 같은 텍스트 입력 필드를 편집하는 화면입니다.
- `app/_components/OpenxStyleForm.tsx`: 선택된 명함 요소의 글자 크기, 굵기, 자간 또는 로고 크기와 위치를 조정합니다.
- `app/_components/cardCanvas.ts`: Canvas API로 명함 배경, 로고, 프로필, 연락처, 하단 문구를 실제 이미지처럼 그리는 렌더링 로직입니다.
- `app/_components/cardFont.ts`: 캔버스에서 사용할 폰트를 준비하고 CSS font 문자열을 만듭니다.
- `app/_components/businessCardData.ts`: 기본 명함 데이터, 콘텐츠 표시 기본값, 로고 프리셋, 카드 크기, 기본 스타일을 정의합니다.
- `app/_components/businessCardTypes.ts`: 명함 데이터와 스타일에 필요한 TypeScript 타입을 정의합니다.

## 명함 제작 흐름

1. `1. 내용 선택` 단계에서 로고 프리셋과 표시할 콘텐츠를 고릅니다.
2. `2. 내용 수정` 단계에서 이름, 직책, 연락처 값을 입력합니다.
3. 미리보기 명함에서 수정할 요소를 클릭합니다.
4. 스타일 패널에서 선택한 요소의 크기, 굵기, 자간, 로고 크기 등을 조정합니다.
5. PNG 저장 버튼으로 결과물을 다운로드합니다.

## 정적 리소스

명함에 쓰이는 로고 이미지는 `public/logos` 아래에 둡니다. `public` 폴더의 파일은 `/logos/파일명.png`처럼 루트 경로 기준으로 참조할 수 있습니다.
