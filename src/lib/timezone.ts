/**
 * Configuración de timezone para el proyecto
 * Maneja la conversión de fechas entre timezone local y UTC
 * Utiliza @formkit/tempo para manejo avanzado de fechas y timezones
 */

import { tzDate, format, parse } from '@formkit/tempo'

/**
 * Obtiene el timezone del navegador
 */
export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Obtiene el offset de timezone en minutos
 */
export function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset()
}

/**
 * Crea una fecha en el timezone local usando @formkit/tempo
 * @param date - Fecha a convertir (opcional, usa fecha actual si no se proporciona)
 * @param timezone - Timezone específico (opcional, usa timezone del navegador por defecto)
 * @returns Fecha en timezone local
 */
export function createLocalDate(date?: Date | string, timezone?: string): Date {
  const targetDate = date ? new Date(date) : new Date()
  const targetTimezone = timezone || getBrowserTimezone()
  return tzDate(targetDate, targetTimezone)
}

/**
 * Convierte una fecha local a UTC usando @formkit/tempo
 * @param localDate - Fecha en formato local
 * @param timezone - Timezone de origen (opcional, usa timezone del navegador por defecto)
 * @returns Fecha en formato UTC
 */
export function localToUTC(localDate: Date | string, timezone?: string): Date {
  const sourceTimezone = timezone || getBrowserTimezone()
  const localTzDate = tzDate(localDate, sourceTimezone)
  return tzDate(localTzDate, 'UTC')
}

/**
 * Convierte una fecha UTC a local usando @formkit/tempo
 * @param utcDate - Fecha en formato UTC
 * @param timezone - Timezone de destino (opcional, usa timezone del navegador por defecto)
 * @returns Fecha en formato local
 */
export function utcToLocal(utcDate: Date | string, timezone?: string): Date {
  const targetTimezone = timezone || getBrowserTimezone()
  return tzDate(utcDate, targetTimezone)
}

/**
 * Formatea una fecha para inputs datetime-local usando @formkit/tempo
 * @param date - Fecha a formatear
 * @param timezone - Timezone específico (opcional, usa timezone del navegador por defecto)
 * @returns String en formato YYYY-MM-DDTHH:mm
 */
export function formatForDateTimeLocal(date: Date | string, timezone?: string): string {
  const targetTimezone = timezone || getBrowserTimezone()
  const localDate = tzDate(date, targetTimezone)
  return format(localDate, 'YYYY-MM-DDTHH:mm')
}

/**
 * Obtiene la fecha actual formateada para inputs datetime-local usando @formkit/tempo
 * @param timezone - Timezone específico (opcional, usa timezone del navegador por defecto)
 * @returns String en formato YYYY-MM-DDTHH:mm (timezone local)
 */
export function getCurrentDateTimeLocal(timezone?: string): string {
  const targetTimezone = timezone || getBrowserTimezone()
  return formatForDateTimeLocal(new Date(), targetTimezone)
}

/**
 * Convierte un string de datetime-local a Date object usando @formkit/tempo
 * @param dateTimeString - String en formato YYYY-MM-DDTHH:mm
 * @param timezone - Timezone específico (opcional, usa timezone del navegador por defecto)
 * @returns Date object
 */
export function parseDateTimeLocal(dateTimeString: string, timezone?: string): Date {
  const targetTimezone = timezone || getBrowserTimezone()
  return parse(dateTimeString, 'YYYY-MM-DDTHH:mm', targetTimezone)
}

/**
 * Valida si una fecha está en el futuro usando @formkit/tempo
 * @param date - Fecha a validar
 * @param timezone - Timezone específico (opcional, usa timezone del navegador por defecto)
 * @returns true si la fecha es futura
 */
export function isFutureDate(date: Date | string, timezone?: string): boolean {
  const targetTimezone = timezone || getBrowserTimezone()
  const checkDate = tzDate(date, targetTimezone)
  const now = tzDate(new Date(), targetTimezone)
  return checkDate > now
}

/**
 * Valida si una fecha está en el pasado usando @formkit/tempo
 * @param date - Fecha a validar
 * @param timezone - Timezone específico (opcional, usa timezone del navegador por defecto)
 * @returns true si la fecha es pasada
 */
export function isPastDate(date: Date | string, timezone?: string): boolean {
  const targetTimezone = timezone || getBrowserTimezone()
  const checkDate = tzDate(date, targetTimezone)
  const now = tzDate(new Date(), targetTimezone)
  return checkDate < now
}

/**
 * Valida si una fecha está entre dos fechas usando @formkit/tempo
 * @param date - Fecha a validar
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin
 * @param timezone - Timezone específico (opcional, usa timezone del navegador por defecto)
 * @returns true si la fecha está en el rango
 */
export function isDateBetween(date: Date | string, startDate: Date | string, endDate: Date | string, timezone?: string): boolean {
  const targetTimezone = timezone || getBrowserTimezone()
  const checkDate = tzDate(date, targetTimezone)
  const start = tzDate(startDate, targetTimezone)
  const end = tzDate(endDate, targetTimezone)
  return checkDate >= start && checkDate <= end
}

/**
 * Agrega tiempo a una fecha usando @formkit/tempo
 * @param date - Fecha base
 * @param amount - Cantidad a agregar
 * @param unit - Unidad de tiempo ('minutes', 'hours', 'days', 'weeks', 'months', 'years')
 * @param timezone - Timezone específico (opcional, usa timezone del navegador por defecto)
 * @returns Nueva fecha con tiempo agregado
 */
export function addTime(date: Date | string, amount: number, unit: string, timezone?: string): Date {
  const targetTimezone = timezone || getBrowserTimezone()
  const baseDate = tzDate(date, targetTimezone)
  
  // Convertir a milisegundos según la unidad
  let milliseconds = 0
  switch (unit) {
    case 'minutes':
      milliseconds = amount * 60 * 1000
      break
    case 'hours':
      milliseconds = amount * 60 * 60 * 1000
      break
    case 'days':
      milliseconds = amount * 24 * 60 * 60 * 1000
      break
    case 'weeks':
      milliseconds = amount * 7 * 24 * 60 * 60 * 1000
      break
    case 'months':
      // Aproximación: 30 días por mes
      milliseconds = amount * 30 * 24 * 60 * 60 * 1000
      break
    case 'years':
      // Aproximación: 365 días por año
      milliseconds = amount * 365 * 24 * 60 * 60 * 1000
      break
    default:
      milliseconds = amount * 60 * 1000 // Default to minutes
  }
  
  const newDate = new Date(baseDate.getTime() + milliseconds)
  return tzDate(newDate, targetTimezone)
}

/**
 * Resta tiempo de una fecha usando @formkit/tempo
 * @param date - Fecha base
 * @param amount - Cantidad a restar
 * @param unit - Unidad de tiempo ('minutes', 'hours', 'days', 'weeks', 'months', 'years')
 * @param timezone - Timezone específico (opcional, usa timezone del navegador por defecto)
 * @returns Nueva fecha con tiempo restado
 */
export function subtractTime(date: Date | string, amount: number, unit: string, timezone?: string): Date {
  return addTime(date, -amount, unit, timezone)
}

/**
 * Obtiene información del timezone actual
 */
export function getTimezoneInfo() {
  return {
    timezone: getBrowserTimezone(),
    offset: getTimezoneOffset(),
    offsetHours: getTimezoneOffset() / 60,
    isDST: isDaylightSavingTime()
  }
}

/**
 * Verifica si está en horario de verano
 */
function isDaylightSavingTime(): boolean {
  const jan = new Date(new Date().getFullYear(), 0, 1)
  const jul = new Date(new Date().getFullYear(), 6, 1)
  return jan.getTimezoneOffset() !== jul.getTimezoneOffset()
}
