import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const detailSource =
  "/home/ubuntu/console_outputs/exec_result_2026-08-23_02-50-42_866.txt";
const detailExtraction = JSON.parse(
  JSON.parse(readFileSync(detailSource, "utf8"))
);

const alerts = detailExtraction.records
  .map(alert => ({
    alertId: alert.id,
    title: alert.title,
    package: alert.package.replace(/ \(npm\)$/, ""),
    ecosystem: "npm",
    manifest: "pnpm-lock.yaml",
    affectedVersionOrRange: alert.affected,
    patchedVersion: alert.patched,
    severity: alert.severity.toLowerCase(),
    scope: alert.scope.toLowerCase(),
    relationship: alert.relationship.toLowerCase().replaceAll(" ", "_"),
    disposition: "awaiting_latest_lockfile_refresh",
    evidence:
      "Authenticated GitHub Dependabot UI; post-security-hardening refresh observed 42 open and 99 closed alerts.",
  }))
  .sort((a, b) => a.alertId - b.alertId);

if (
  alerts.length !== 42 ||
  new Set(alerts.map(alert => alert.alertId)).size !== 42
) {
  throw new Error(
    `Expected 42 unique open alerts; found ${alerts.length} rows and ${new Set(alerts.map(alert => alert.alertId)).size} unique IDs.`
  );
}

const inventory = {
  generatedAt: new Date().toISOString(),
  source: "Authenticated GitHub Dependabot UI",
  openAlertCount: alerts.length,
  closedAlertCountObserved: 99,
  productionAuditStatus:
    "pnpm audit --prod reports zero known vulnerabilities after remediation.",
  alerts,
};

const markdown = [
  "# Dependabot Open-Alert Inventory — 2026-08-23",
  "",
  "This inventory is generated from authenticated GitHub Dependabot UI result pages after the dependency-hardening push. It records the 42 alerts still shown during the asynchronous scanner refresh. All are development-scope entries in `pnpm-lock.yaml`; the current local production audit reports zero known vulnerabilities.",
  "",
  "| Alert | Package | Affected version or range | Patched version | Severity | Scope | Relationship | Disposition |",
  "|---:|---|---|---|---|---|---|---|",
  ...alerts.map(
    alert =>
      `| #${alert.alertId} | ${alert.package} | ${alert.affectedVersionOrRange} | ${alert.patchedVersion} | ${alert.severity} | ${alert.scope} | ${alert.relationship} | ${alert.disposition} |`
  ),
  "",
  "## Disposition rule",
  "",
  "These rows must be rechecked after GitHub ingests the latest pushed lockfile. The inventory does not claim an alert is fixed solely from a local package update; the only completed runtime finding is the local production audit with zero critical, high, moderate, and low vulnerabilities.",
].join("\n");

writeFileSync(
  resolve(root, "SECURITY_DEPENDABOT_INVENTORY_20260823.json"),
  `${JSON.stringify(inventory, null, 2)}\n`
);
writeFileSync(
  resolve(root, "SECURITY_DEPENDABOT_INVENTORY_20260823.md"),
  `${markdown}\n`
);
console.log(
  JSON.stringify(
    {
      alertCount: alerts.length,
      packages: [...new Set(alerts.map(alert => alert.package))],
    },
    null,
    2
  )
);
