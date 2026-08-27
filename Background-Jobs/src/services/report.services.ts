export interface Report {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  data?: string;
  createdAt: Date;
  topic: string;
}

export const reportsStore = new Map<string, Report>();

export async function buildReport(id: string, topic: string) {
	const data = "";

	const report = reportsStore.get(id);

	if (!report) {
		throw new Error(`Report with ID ${id} not found in store.`);
	}

	report.status = "completed";
	report.data = data;

	return;
}

export function failedReport(id: string, errorMsg: string) {
	const report = reportsStore.get(id);

	if (!report) {
		console.warn(`[failedReport] Report with ID ${id} not found in store.`);
		return;
	}

	report.status = "failed";
	report.data = errorMsg;
}

export function summary() : string {
	const counts = { pending: 0, processing: 0, failed: 0, completed: 0 };

  for (const report of reportsStore.values()) {
    if (report.status in counts) {
      counts[report.status as keyof typeof counts]++;
    }
  }

  return [
    `Pending Reports: ${counts.pending}`,
    `Processing Reports: ${counts.processing}`,
    `Failed Reports: ${counts.failed}`,
    `Completed Reports: ${counts.completed}`,
  ].join("\n");
}
