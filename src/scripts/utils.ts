import setupScript from "./setup.py?raw";
import logRankTestScript from "./logrank_test.py?raw";

/**
 * 2D 배열 데이터를 Python numpy 배열 형식으로 변환
 */
const formatNumpyArray = (data: string): string => {
  return data
    .split("\n")
    .map((row) => `[${row}]`)
    .join(",");
};

/**
 * 초기 설정 스크립트 반환
 */
export const getSetupScript = (): string => setupScript;

/**
 * 로그랭크 테스트 스크립트 생성 및 반환
 */
export const getLogRankTestScript = (
  timeData: string,
  eventData: string,
  groupData: string
): string => {
  // 원시 스크립트 가져오기
  let script = logRankTestScript;

  // 주석 처리된 템플릿 코드를 실제 코드로 변환
  script = script.replace(
    /# times = np\.array\(\[\$\{timeData\}\]\)/,
    `times = np.array([${formatNumpyArray(timeData)}])`
  );

  script = script.replace(
    /# events = np\.array\(\[\$\{eventData\}\]\)/,
    `events = np.array([${formatNumpyArray(eventData)}])`
  );

  script = script.replace(
    /# groups = np\.array\(\[\$\{groupData\}\]\)/,
    `groups = np.array([${formatNumpyArray(groupData)}])`
  );

  return script;
};
