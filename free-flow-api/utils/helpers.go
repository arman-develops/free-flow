package utils

import "time"

func StringOrDefault(ptr *string, fallback string) string {
	if ptr != nil {
		return *ptr
	}
	return fallback
}

func TimeOrNow(t time.Time) time.Time {
	if t.IsZero() {
		return time.Now()
	}
	return t
}

func PercentChange(current, previous int64) float64 {
	if previous == 0 {
		if current > 0 {
			return 100.0 // 100% growth if new
		}
		return 0.0 // no change
	}
	return (float64(current-previous) / float64(previous)) * 100
}

type DateRanges struct {
	Now              time.Time
	StartOfThisMonth time.Time
	StartOfLastMonth time.Time
	EndOfLastMonth   time.Time
	StartOfYear      time.Time
}

func GetDateRanges() DateRanges {
	now := time.Now()
	startOfThisMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())
	startOfLastMonth := startOfThisMonth.AddDate(0, -1, 0)
	endOfLastMonth := startOfThisMonth.Add(-time.Nanosecond)
	startOfYear := time.Date(now.Year(), 1, 1, 0, 0, 0, 0, now.Location())

	return DateRanges{
		Now:              now,
		StartOfThisMonth: startOfThisMonth,
		StartOfLastMonth: startOfLastMonth,
		EndOfLastMonth:   endOfLastMonth,
		StartOfYear:      startOfYear,
	}
}
