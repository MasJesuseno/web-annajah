import fs from "fs";
import path from "path";
import { MarkdownRenderer } from "./markdown-renderer";

export default async function PanduanPage() {
  const filePath = path.join(process.cwd(), "PANDUAN_ADMIN.md");
  const content = fs.readFileSync(filePath, "utf-8");

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📘 Panduan Admin</h1>
        <p className="text-gray-500 mt-1">
          Panduan lengkap penggunaan panel admin SMA Annajah
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}
