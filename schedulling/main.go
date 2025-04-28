package main

import (
	"fmt"
	"slices"
	"sort"
	"time"
)

const restrictionStr = "restriction"
const taskStr = "task"

type Task struct {
	Name     string
	Duration int
	DueDate  time.Time
	Priority int
}

type Restriction struct {
	Name       string
	Days       []int
	Start, End int
}

type Activite struct {
	Type string
	Name string
}

type Daymap = map[int]Activite
type WeekMap = map[int]Daymap

func CreateDayMap(r []Restriction) Daymap {
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

func initWeekMap(r []Restriction) WeekMap {
	wm := make(WeekMap)

	for i := range 7 {
		var ar []Restriction

		for _, v := range r {
			if slices.Contains(v.Days, i) {
				ar = append(ar, v)
			}
		}

		wm[i] = CreateDayMap(ar)
	}

	return wm
}

var (
	Tasks = []Task{
		{
			Name:     "t1",
			Duration: 6,
			DueDate:  time.Date(time.Now().Year(), time.Now().Month(), 30, 0, 0, 0, 0, time.Local),
			Priority: 1,
		},
		{
			Name:     "t2",
			Duration: 2,
			DueDate:  time.Date(time.Now().Year(), time.Now().Month(), 29, 0, 0, 0, 0, time.Local),
			Priority: 5,
		},
	}

	Restrictions = []Restriction{
		{
			Name:  "r1",
			Days:  []int{1, 3},
			Start: 9,
			End:   12,
		},
		{
			Name:  "r2",
			Days:  []int{0, 1, 2, 3, 4, 5, 6},
			Start: 14,
			End:   19,
		},
	}
)

func FillTasks(wm WeekMap, t []Task) {

	tomorrow := time.Now().Truncate(24 * time.Hour).Add(time.Hour * 24)

	sort.Slice(t, func(i, j int) bool {
		iDueTomorrow := t[i].DueDate.Truncate(24 * time.Hour).Equal(tomorrow)
		jDueTomorrow := t[j].DueDate.Truncate(24 * time.Hour).Equal(tomorrow)

		if iDueTomorrow && !jDueTomorrow {
			return true
		}
		if !iDueTomorrow && jDueTomorrow {
			return false
		}
		// Otherwise, compare by priority
		return t[i].Priority < t[j].Priority
	})

	for len(t) > 0 {
		for _, dm := range wm {
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

func main() {

	wm := initWeekMap(Restrictions)

	FillTasks(wm, Tasks)

	for k, v := range wm {
		fmt.Printf("%d: %v \n", k, v)
	}
}
