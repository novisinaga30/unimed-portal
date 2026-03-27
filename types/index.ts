export type SidebarMenu = {
  name: string;
  href: string;
};

export type Announcement = {
  category: string;
  title: string;
  description: string;
  date: string;
};

export type HelpFaq = {
  question: string;
  answer: string;
};

export type DashboardStat = {
  label: string;
  value: string;
  valueColor?: string;
};

export type QuickMenuItem = {
  title: string;
  href: string;
};

export type ScheduleItem = {
  course: string;
  time: string;
  room: string;
};

export type InfoNote = {
  title: string;
  description: string;
  borderColor: string;
  bgColor: string;
};