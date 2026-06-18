import { prisma } from "@/lib/prisma";
import { Breadcrumb } from "@/components/breadcrumb";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dewan Guru",
  description: "Daftar tenaga pengajar SMA Annajah",
};

export default async function DewanGuruPage() {
  const teachers = await prisma.teacher.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: "Dewan Guru" }]} />

      {/* Hero */}
      <section className="bg-gradient-primary py-16 lg:py-24">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Dewan Guru
          </h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Tenaga pengajar profesional SMA Annajah
          </p>
        </div>
      </section>

      {/* Teacher Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8">
          {teachers.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              Belum ada data tenaga pengajar
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
                >
                  {/* Photo */}
                  <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
                    {teacher.photo ? (
                      <img
                        src={teacher.photo}
                        alt={teacher.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 bg-primary-200 rounded-full flex items-center justify-center">
                          <span className="text-3xl font-bold text-primary-600">
                            {teacher.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5 text-center">
                    <h3 className="font-semibold text-gray-900 text-lg group-hover:text-primary-600 transition-colors">
                      {teacher.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {teacher.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
