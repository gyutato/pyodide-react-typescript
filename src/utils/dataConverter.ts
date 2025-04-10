type SurvivalData = {
  group: string;
  data: Array<{
    time: number;
    event: boolean;
  }>;
}[];

export const convertSurvivalDataForLogRank = (data: SurvivalData) => {
  // 모든 데이터를 단일 배열로 변환
  const flatData = data.flatMap((group, groupIndex) =>
    group.data.map((item) => ({
      time: item.time,
      event: item.event ? 1 : 0,
      group: groupIndex,
    }))
  );

  // 각 데이터 타입별로 문자열 생성
  const timeData = flatData.map((item) => item.time.toString()).join(",");

  const eventData = flatData.map((item) => item.event.toString()).join(",");

  const groupData = flatData.map((item) => item.group.toString()).join(",");

  return {
    timeData,
    eventData,
    groupData,
  };
};
