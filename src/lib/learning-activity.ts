export const PUBLIC_ACTIVITY_THRESHOLD = 5;
export function activitySubject(subject: string) {
  if (/math/i.test(subject)) return "Mathematics" as const;
  if (/science|biology|chemistry|physics/i.test(subject)) return "Science" as const;
  if (/english/i.test(subject)) return "English" as const;
  if (/kiswahili/i.test(subject)) return "Kiswahili" as const;
  return "Other learning" as const;
}
export function canShareActivity(enabled: boolean, guardianConfirmed: boolean) {
  return enabled && guardianConfirmed;
}
export function publicCount(count: number, participants: number) {
  return participants >= PUBLIC_ACTIVITY_THRESHOLD ? count : 0;
}
