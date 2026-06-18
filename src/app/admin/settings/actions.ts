"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { exec, execSync } from "child_process";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

// ============================================================
// 🏪 PROFILE SETTINGS
// ============================================================

export async function updateProfile(formData: FormData) {
  const data: any = {};
  const fields = [
    "schoolName", "shortName", "slogan", "description",
    "address", "phone", "email", "website", "logo", "favicon",
    "vision", "mission", "about", "history",
    "primaryColor", "homeBanner", "homeBannerBrightness",
    "feature1Title", "feature1Description",
    "feature2Title", "feature2Description",
    "feature3Title", "feature3Description",
    "headingFont", "bodyFont", "baseFontSize", "headingWeight",
    "teacherCount", "studentCount", "establishedYears", "achievementCount",
    "youtubeUrl", "instagramUrl", "facebookUrl", "twitterUrl",
    "operationalHours",
    "whatsapp",
    "ppdbUrl",
  ];

  for (const field of fields) {
    const value = formData.get(field);
    if (value !== null) {
      // Convert integer fields to number
      if (field === "homeBannerBrightness") {
        data[field] = parseInt(value as string, 10);
      } else {
        data[field] = value;
      }
    }
  }

  await prisma.siteProfile.upsert({
    where: { id: 1 },
    update: data,
    create: { ...data },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/");
  revalidatePath("/profil");
}

// ============================================================
// 💾 BACKUP DATABASE
// ============================================================

/** Parse DATABASE_URL mysql://user:pass@host:port/db */
function parseDbUrl(url: string) {
  const clean = url.replace(/^mysql:\/\//, "");
  const dbName = clean.split("/").pop()?.split("?")[0] || "webannajah";
  const authPart = clean.split("/")[0];

  let user = "root";
  let pass = "";
  let host = "localhost";
  let port = "3306";

  if (authPart.includes("@")) {
    const [userpass, hostport] = authPart.split("@");
    if (userpass.includes(":")) {
      [user, pass] = userpass.split(":");
    } else {
      user = userpass;
    }
    if (hostport.includes(":")) {
      [host, port] = hostport.split(":");
    } else {
      host = hostport;
    }
  } else {
    // No @ sign means user@host without password
    user = "root";
    host = authPart;
  }

  return { user, pass, host, port, dbName };
}

/** Find mysqldump executable */
function findMysqldump(): string {
  const isWin = process.platform === "win32";

  // Try dynamic discovery first (most reliable)
  try {
    const whichCmd = isWin ? "where mysqldump.exe 2>nul" : "which mysqldump 2>/dev/null";
    const result = execSync(whichCmd, { encoding: "utf-8", timeout: 3000 });
    const firstMatch = result.trim().split("\n")[0]?.trim();
    if (firstMatch && fs.existsSync(firstMatch)) {
      return firstMatch;
    }
  } catch {
    // not found via which/where, continue to hardcoded paths
  }

  // Hardcoded paths as fallback
  const candidates = isWin
    ? [
        "C:\\Program Files\\MySQL\\MySQL Server 8.4\\bin\\mysqldump.exe",
        "C:\\Program Files\\MySQL\\MySQL Server 8.0\\bin\\mysqldump.exe",
        "C:\\Program Files\\MySQL\\MySQL Server 9.0\\bin\\mysqldump.exe",
        "C:\\xampp\\mysql\\bin\\mysqldump.exe",
        "mysqldump.exe",
        "mysqldump",
      ]
    : [
        "/usr/bin/mysqldump",
        "/usr/local/bin/mysqldump",
        "/opt/homebrew/bin/mysqldump",
        "mysqldump",
      ];

  for (const cmd of candidates) {
    try {
      if (fs.existsSync(cmd)) {
        return cmd;
      }
    } catch {
      // try next
    }
  }
  return "mysqldump"; // ultimate fallback — rely on PATH
}

export type BackupResult = {
  success: boolean;
  filename?: string;
  filepath?: string;
  size?: number;
  error?: string;
};

export type BackupInfo = {
  filename: string;
  filepath: string;
  size: number;
  sizeFormatted: string;
  createdAt: string;
  url: string;
};

export async function backupDatabase(): Promise<BackupResult> {
  try {
    const dbUrl = process.env.DATABASE_URL || "mysql://root@localhost:3306/webannajah";
    const db = parseDbUrl(dbUrl);

    const backupsDir = path.join(process.cwd(), "public", "backups");
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const sqlFile = path.join(backupsDir, `annajah-${timestamp}.sql`);
    const gzFile = sqlFile + ".gz";

    const mysqldump = findMysqldump();

    // Build mysqldump command
    let cmd = `"${mysqldump}" -h ${db.host} -P ${db.port} -u ${db.user}`;
    if (db.pass) {
      cmd += ` -p"${db.pass}"`;
    }
    cmd += ` --single-transaction --routines --events --triggers --skip-lock-tables --add-drop-table --complete-insert --quote-names "${db.dbName}"`;

    // Run mysqldump
    const { stdout, stderr } = await execAsync(cmd, { maxBuffer: 100 * 1024 * 1024 });

    if (stderr && !stderr.includes("Warning")) {
      // mysqldump may output warnings to stderr but still succeed
      console.warn("mysqldump stderr:", stderr);
    }

    // Write SQL file
    fs.writeFileSync(sqlFile, stdout, "utf-8");

    // Compress with gzip if available
    let finalFile = sqlFile;
    try {
      await execAsync(`gzip -f "${sqlFile}"`);
      finalFile = gzFile;
    } catch {
      // gzip not available, keep .sql
    }

    const stats = fs.statSync(finalFile);

    // Auto-cleanup: hapus backup > 7 hari
    try {
      const files = fs.readdirSync(backupsDir);
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      let cleaned = 0;
      for (const file of files) {
        if (file === ".gitkeep" || file === path.basename(finalFile)) continue;
        const filePath = path.join(backupsDir, file);
        try {
          const st = fs.statSync(filePath);
          if (st.isFile() && st.mtimeMs < sevenDaysAgo) {
            fs.unlinkSync(filePath);
            cleaned++;
          }
        } catch {
          // skip if can't stat/unlink
        }
      }
      if (cleaned > 0) {
        console.log(`Cleaned up ${cleaned} old backup(s) (> 7 days)`);
      }
    } catch {
      // skip cleanup errors
    }

    return {
      success: true,
      filename: path.basename(finalFile),
      filepath: finalFile,
      size: stats.size,
    };
  } catch (err: any) {
    console.error("Backup failed:", err);
    return {
      success: false,
      error: err.message || "Gagal melakukan backup database",
    };
  }
}

export async function getBackups(): Promise<BackupInfo[]> {
  const backupsDir = path.join(process.cwd(), "public", "backups");
  if (!fs.existsSync(backupsDir)) {
    return [];
  }

  const files = fs.readdirSync(backupsDir);

  const backups: BackupInfo[] = [];

  for (const file of files) {
    if (file === ".gitkeep") continue;
    const filePath = path.join(backupsDir, file);
    try {
      const stats = fs.statSync(filePath);
      if (stats.isFile()) {
        const sizeKB = stats.size / 1024;
        const sizeMB = sizeKB / 1024;
        const sizeFormatted =
          sizeMB >= 1
            ? `${sizeMB.toFixed(2)} MB`
            : `${sizeKB.toFixed(1)} KB`;

        backups.push({
          filename: file,
          filepath: filePath,
          size: stats.size,
          sizeFormatted,
          createdAt: stats.mtime.toISOString(),
          url: `/backups/${file}`,
        });
      }
    } catch {
      // skip if can't read
    }
  }

  // Sort by date descending (newest first)
  backups.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return backups;
}

export async function deleteBackup(filename: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Prevent path traversal
    const sanitized = path.basename(filename);
    if (!sanitized || sanitized === ".gitkeep") {
      return { success: false, error: "Invalid filename" };
    }

    const filePath = path.join(process.cwd(), "public", "backups", sanitized);
    if (!fs.existsSync(filePath)) {
      return { success: false, error: "File tidak ditemukan" };
    }

    fs.unlinkSync(filePath);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus backup" };
  }
}
