export interface ActivityEntry {
  time: string;
  action: string;
  target: string;
}

export const activityFeed: ActivityEntry[] = [
  { time: "12:04", action: "reviewed PR #47 on", target: "codelens" },
  { time: "11:30", action: "deployed", target: "rasad v0.1.1" },
  { time: "11:15", action: "merged feature branch on", target: "gogaa-cli" },
  { time: "10:42", action: "processed 34 new patterns in", target: "codelens" },
  { time: "10:10", action: "ran 1,418 tests on", target: "gogaa" },
  { time: "09:55", action: "shipped email template for", target: "openevent" },
  { time: "09:30", action: "triaged 12 client emails via", target: "openevent AI" },
  { time: "09:15", action: "synced git mirrors to", target: "gitea" },
  { time: "09:00", action: "started daily session on", target: "command center" },
  { time: "08:45", action: "health check passed on", target: "wadwarehouse" },
  { time: "08:30", action: "updated CLAUDE.md for", target: "portfolio-site" },
  { time: "08:00", action: "system boot complete:", target: "all services online" },
];
