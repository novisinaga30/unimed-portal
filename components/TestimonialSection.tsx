export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Mahasiswa Informatika",
      text: "Kalau portal seperti ini benar-benar dipakai, mahasiswa jauh lebih mudah karena semua layanan ada di satu tempat.",
    },
    {
      name: "Mahasiswa FKIP",
      text: "Yang paling membantu adalah notifikasi, status pembayaran, dan validasi KRS yang langsung terlihat dari dashboard.",
    },
    {
      name: "Admin Akademik",
      text: "Dashboard admin sangat membantu untuk memantau mahasiswa, pembayaran, pengumuman, dan KRS secara lebih rapi.",
    },
  ];

  return (
    <section id="testimoni" className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mb-12">
          <p className="text-sm font-semibold text-blue-700 mb-3">
            Nilai utama portal
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-950 mb-4">
            Dibuat berdasarkan masalah nyata mahasiswa
          </h2>
          <p className="text-gray-600 leading-8">
            Tujuan utama website ini adalah membuat pengalaman mahasiswa menjadi lebih jelas,
            cepat, dan tidak ribet.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl bg-white border border-gray-200 p-6 shadow-sm"
            >
              <p className="text-gray-600 leading-8 mb-5">“{item.text}”</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-blue-950">{item.name}</p>
                  <p className="text-sm text-gray-500">Pengguna Portal</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}