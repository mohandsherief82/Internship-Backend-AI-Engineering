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
