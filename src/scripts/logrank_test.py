import numpy as np
from lifelines.statistics import logrank_test

# Parse input data
# timeData, eventData, groupData는 템플릿 변수로 JavaScript에서 대체됩니다
# time_data_str = "${timeData}"
# event_data_str = "${eventData}"
# group_data_str = "${groupData}"

# JavaScript에서 다음 코드를 실제 데이터로 대체합니다:
# times = np.array([${timeData}])
# events = np.array([${eventData}])
# groups = np.array([${groupData}])

# Flatten arrays
times_flat = times.flatten()
events_flat = events.flatten()
groups_flat = groups.flatten()

# Run logrank test
results = logrank_test(times_flat, groups_flat, events_flat)
print(results.summary)

# Return p-value as result
p_value = results.p_value
f"Log-rank test p-value: {p_value:.4f}" 