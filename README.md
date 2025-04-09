# Pyodide React TypeScript

브라우저에서 Python 코드를 실행하기 위한 React + TypeScript + Pyodide 프로젝트입니다.

## 프로젝트 구조

```
src/
├── api/
│   └── pyodide.ts          # Pyodide 인스턴스 관리 싱글톤 클래스
├── python-scripts/
│   ├── setup.py            # Python 초기 설정 스크립트
│   ├── logrank_test.py     # 로그랭크 테스트 Python 코드
│   └── index.ts            # 스크립트 로더 유틸리티
├── App.tsx                 # 메인 React 컴포넌트
└── vite-env.d.ts           # 타입 선언
```

## 특징

- 브라우저에서 Python 코드 실행 (WebAssembly 기반)
- Python 코드를 별도 파일로 분리하여 관리
- lifelines 패키지를 활용한 통계 분석

## 실행 방법

1. 의존성 설치

   ```
   npm install
   ```

2. 개발 서버 실행
   ```
   npm run dev
   ```

## 코드 관리 방식

- Python 코드는 `src/python-scripts/` 디렉토리에서 별도 `.py` 파일로 관리
- Vite의 `?raw` 접미사를 사용해 Python 코드를 문자열로 가져옴
- JavaScript/TypeScript에서 필요한 데이터로 템플릿 변수를 대체

## 활용 예시

현재 구현된 로그랭크 테스트는 생존 분석에 사용되는 통계적 방법으로, 두 그룹 간의 생존 곡선 차이가 통계적으로 유의한지 검정합니다.
