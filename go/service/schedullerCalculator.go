package service

import (
	"plannertime/repository"
	"slices"
	"sort"
	"strings"
	"time"
)

const restrictionStr = "restriction"
const taskStr = "task"

type Activite struct {
	Type string `json:"activiteType"`
	Name string `json:"activiteName"`
}

type Daymap = map[int]Activite
type WeekMap = map[string]Daymap

func CreateDayMap(r []repository.Restriction) Daymap {
	dm := make(Daymap)

	for _, v := range r {
		s := v.Start
		for s != v.End {
			dm[s] = Activite{
				Name: v.Name,
				Type: restrictionStr,
			}
			s++
		}
	}

	return dm
}

func convetDaysToInt(ds []string) []int {
	var resp []int

	for _, d := range ds {
		switch d {
		case "segunda":
			resp = append(resp, 1)
		case "terça":
			resp = append(resp, 2)
		case "quarta":
			resp = append(resp, 3)
		case "quinta":
			resp = append(resp, 4)
		case "sexta":
			resp = append(resp, 5)
		case "sabado":
			resp = append(resp, 6)
		case "domingo":
			resp = append(resp, 0)
		}
	}

	return resp
}

func initWeekMap(r []repository.Restriction) WeekMap {
	wm := make(WeekMap)

	for i := range 7 {
		tm := time.Duration(24 * (i + 1))
		mk := time.Now().Truncate(24 * time.Hour).Add(time.Hour * tm)
		wd := mk.Day()

		var ar []repository.Restriction

		for _, v := range r {
			if slices.Contains(convetDaysToInt(v.Days), wd) {
				ar = append(ar, v)
			}
		}

		wm[strings.Split(mk.String(), " ")[0]] = CreateDayMap(ar)
	}

	return wm
}

func FillTasks(wm WeekMap, t []repository.Task) {

	tomorrow := time.Now().Truncate(24 * time.Hour).Add(time.Hour * 48)

	sort.Slice(t, func(i, j int) bool {
		iDueTomorrow := t[i].EndTime.Truncate(24 * time.Hour).Equal(tomorrow)
		jDueTomorrow := t[j].EndTime.Truncate(24 * time.Hour).Equal(tomorrow)

		if iDueTomorrow && !jDueTomorrow {
			return true
		}
		if !iDueTomorrow && jDueTomorrow {
			return false
		}
		// Otherwise, compare by priority
		return t[i].Priority < t[j].Priority
	})

	dates := make([]string, 0, len(wm))
	for date := range wm {
		dates = append(dates, date)
	}
	sort.Strings(dates)

	for len(t) > 0 {
		for _, date := range dates {
			dm := wm[date]

			keys := make([]int, 0, len(dm))
			for k := range dm {
				keys = append(keys, k)
			}

			for i := range 24 {
				if !slices.Contains(keys, i) && i > 6 && len(t) > 0 {
					if t[0].Duration > 0 {
						dm[i] = Activite{
							Name: t[0].Name,
							Type: taskStr,
						}
						t[0].Duration--

						if t[0].Duration == 0 {
							t = t[1:]
							continue
						}

						fa := t[0]
						t = append(t[1:], fa)
					}
				}
			}
		}
	}

}

func CalculateSchduller(r []repository.Restriction, t []repository.Task) WeekMap {

	wm := initWeekMap(r)

	FillTasks(wm, t)

	return wm
}
