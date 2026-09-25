export async function register() {
  if (
    process.env.NEXT_RUNTIME === "nodejs" &&
    process.env.NODE_ENV === "development" &&
    !process.env.SYNC_CMS_DISABLED
  ) {
    try {
      const { startWatcher } = await import(
        "../scripts/sync-hardcode-to-cms.mjs"
      );
      startWatcher();
    } catch (err) {
      console.error("[sync-cms] gagal menjalankan watcher:", err.message);
    }
  }
}
