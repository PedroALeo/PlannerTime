"use client"

import { useState } from "react"

function Calendar({ events = [], onSelectDay }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()

  // Converter as datas dos eventos para o formato de comparação
  const eventDates = events.reduce((acc, event) => {
    const [day, month] = event.date.split("/")
    // Assumindo que estamos no mês 4 (abril) para o exemplo
    const currentMonthNumber = 4

    // Só marcar eventos do mês atual
    if (Number.parseInt(month) === currentMonthNumber) {
      const dateKey = Number.parseInt(day)

      if (!acc[dateKey]) {
        acc[dateKey] = []
      }

      acc[dateKey].push(event)
    }

    return acc
  }, {})

  const handleDayClick = (day) => {
    // Se o dia já está selecionado, desseleciona
    if (selectedDay === day) {
      setSelectedDay(null)
      onSelectDay(null)
    } else {
      setSelectedDay(day)
      onSelectDay(day)
    }
  }

  const days = []
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    // Verificar se o dia atual tem um evento
    const dayEvents = eventDates[i] || []
    const hasEvent = dayEvents.length > 0
    const isSelected = selectedDay === i

    // Determinar a cor do indicador com base no primeiro evento (se houver vários)
    const indicatorColor = "bg-blue-600"
    let bgColor = ""

    if (hasEvent) {
      if (dayEvents[0].color.includes("blue")) {
        bgColor = "bg-blue-50"
      } else if (dayEvents[0].color.includes("green")) {
        bgColor = "bg-green-50"
      }
    }

    days.push(
      <div
        key={i}
        className={`h-10 w-10 flex items-center justify-center rounded-full cursor-pointer relative
          ${isSelected ? "bg-blue-600 text-white" : hasEvent ? `font-bold ${bgColor}` : "hover:bg-gray-100"}`}
        title={hasEvent ? dayEvents.map((e) => e.title).join(", ") : ""}
        onClick={() => handleDayClick(i)}
      >
        {i}
        {hasEvent && !isSelected && (
          <div
            className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${indicatorColor}`}
          ></div>
        )}
      </div>,
    )
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    setSelectedDay(null)
    onSelectDay(null)
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    setSelectedDay(null)
    onSelectDay(null)
  }

  return (
    <div className="p-4 rounded-md border">
      <div className="flex justify-between items-center mb-4">
        <button onClick={prevMonth} className="p-1 rounded-full hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div className="font-medium">
          {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
        </div>
        <button onClick={nextMonth} className="p-1 rounded-full hover:bg-gray-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        <div>Dom</div>
        <div>Seg</div>
        <div>Ter</div>
        <div>Qua</div>
        <div>Qui</div>
        <div>Sex</div>
        <div>Sáb</div>
      </div>
      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  )
}

export default Calendar