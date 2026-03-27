import type {
  Announcement,
  DashboardStat,
  HelpFaq,
  InfoNote,
  QuickMenuItem,
  ScheduleItem,
  SidebarMenu,
} from "@/types";

/* ================= SIDEBAR ================= */
export const sidebarMenus: SidebarMenu[] = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Akademik", href: "/akademik" },
  { name: "Pembayaran", href: "/pembayaran" },
  { name: "KKN", href: "/kkn" },
  { name: "PLP", href: "/plp" },
  { name: "Pengumuman", href: "/pengumuman" },
  { name: "Profil", href: "/profil" },
  { name: "Bantuan", href: "/bantuan" },
];

/* ================= DASHBOARD ================= */
export const dashboardStats: DashboardStat[] = [
  { label: "Jadwal Hari Ini", value: "3 Kelas" },
  { label: "Status UKT", value: "Lunas", valueColor: "text-green-600" },
  { label: "IPK Sementara", value: "3.82" },
  { label: "Notifikasi Baru", value: "5", valueColor: "text-yellow-500" },
];

export const dashboardQuickMenus: QuickMenuItem[] = [
  { title: "Akademik", href: "/akademik" },
  { title: "Pembayaran", href: "/pembayaran" },
  { title: "KKN", href: "/kkn" },
  { title: "PLP", href: "/plp" },
  { title: "Pengumuman", href: "/pengumuman" },
];

export const dashboardSchedules: ScheduleItem[] = [
  {
    course: "Pemrograman Web",
    time: "08:00 - 10:00",
    room: "Ruang C203",
  },
  {
    course: "Basis Data",
    time: "10:30 - 12:00",
    room: "Ruang B105",
  },
  {
    course: "IMK",
    time: "13:00 - 15:00",
    room: "Lab Komputer",
  },
];

export const dashboardImportantNotes: InfoNote[] = [
  {
    title: "KRS Dibuka",
    description: "Mulai 10 Agustus 2026",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-50",
  },
];

/* ================= AKADEMIK ================= */
export const akademikStats = [
  { label: "Status KRS", value: "Sudah Diisi", valueColor: "text-green-600" },
  { label: "SKS", value: "22 SKS" },
  { label: "IP Semester", value: "3.75" },
  { label: "IPK", value: "3.82" },
];

export const akademikSchedules = [
  {
    course: "Pemrograman Web",
    detail: "Senin • 08:00 - 10:00",
  },
];

export const akademikMenus = ["KRS", "KHS", "Jadwal"];

export const akademikNotes: InfoNote[] = [
  {
    title: "KRS Dibuka",
    description: "Segera isi KRS",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-50",
  },
];

/* ================= PEMBAYARAN ================= */
export const pembayaranStats = [
  { label: "Status UKT", value: "Lunas", valueColor: "text-green-600" },
  { label: "Tagihan", value: "Rp 0" },
];

export const pembayaranHistory = [
  {
    title: "UKT",
    detail: "12 Agustus 2026",
    amount: "Rp 2.500.000",
  },
];

export const pembayaranNotes: InfoNote[] = [
  {
    title: "Bayar Tepat Waktu",
    description: "Hindari denda",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-50",
  },
];

/* ================= KKN ================= */
export const kknStats = [
  { label: "Status", value: "Terdaftar", valueColor: "text-green-600" },
];

export const kknSchedules = [
  {
    title: "Pelaksanaan",
    detail: "Agustus 2026",
  },
];

export const kknNotes: InfoNote[] = [
  {
    title: "Wajib Ikut",
    description: "Pembekalan wajib",
    borderColor: "border-yellow-400",
    bgColor: "bg-yellow-50",
  },
];

/* ================= PLP ================= */
export const plpStats = [
  { label: "Status", value: "Terdaftar", valueColor: "text-green-600" },
];

export const plpSchedules = [
  {
    title: "Pelaksanaan",
    detail: "September 2026",
  },
];

export const plpNotes: InfoNote[] = [
  {
    title: "Laporan",
    description: "Kumpul tepat waktu",
    borderColor: "border-blue-400",
    bgColor: "bg-blue-50",
  },
];

/* ================= PENGUMUMAN ================= */
export const announcements: Announcement[] = [
  {
    category: "Akademik",
    title: "KRS Dibuka",
    description: "Mulai Agustus",
    date: "2026",
  },
];

/* ================= FAQ ================= */
export const helpFaqs: HelpFaq[] = [
  {
    question: "Cara login?",
    answer: "Gunakan NIM",
  },
];