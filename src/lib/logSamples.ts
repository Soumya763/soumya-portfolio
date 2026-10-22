// Sample log lines written in exactly the formats the platform's Logstash
// Grok patterns expect (logstash/pipelines/*.conf). The firewall and DNS
// formats match scripts/generate_logs.py. Hostnames/IPs are illustrative.

export type Segment = { t: string; f?: string };

export type LogSample = {
  id: string;
  label: string;
  input: string;
  pipeline: string;
  index: string;
  segments: Segment[];
  pattern: string;
  doc: [string, string][];
  rule: string;
};

export const LOG_SAMPLES: LogSample[] = [
  {
    id: "firewall",
    label: "Firewall",
    input: "UDP 5001",
    pipeline: "firewall_syslog.conf",
    index: "events-firewall-YYYY.MM.dd",
    segments: [
      { t: "<12>Oct 22 09:14:03 " },
      { t: "FW-CORE-01", f: "source_name" },
      { t: " kernel: " },
      { t: "DROP", f: "event_action" },
      { t: " " },
      { t: "TCP", f: "protocol" },
      { t: " " },
      { t: "192.168.1.47", f: "source.ip" },
      { t: ":" },
      { t: "51544", f: "source.port" },
      { t: " -> " },
      { t: "203.0.113.50", f: "destination.ip" },
      { t: ":" },
      { t: "445", f: "destination.port" },
    ],
    pattern:
      "^<%{NUMBER:syslog_priority}>%{MONTH:month} +%{MONTHDAY:day} %{TIME:time} %{HOSTNAME:source_name} %{DATA:process}: %{WORD:event_action} %{WORD:protocol} %{IP:source_ip}:%{NUMBER:source_port} -> %{IP:destination_ip}:%{NUMBER:destination_port}",
    doc: [
      ["event_category", "network"],
      ["source_type", "firewall"],
      ["event_action", "drop"],
      ["protocol", "TCP"],
      ["source.ip", "192.168.1.47"],
      ["source.port", "51544"],
      ["destination.ip", "203.0.113.50"],
      ["destination.port", "445"],
      ["event_type", "firewall_connection_denied"],
      ["severity", "medium"],
    ],
    rule: "drop / deny / block / reject → firewall_connection_denied, severity medium. allow / pass → low.",
  },
  {
    id: "windows",
    label: "Windows",
    input: "UDP 5002",
    pipeline: "windows.conf",
    index: "events-windows-YYYY.MM.dd",
    segments: [
      { t: "<13>Oct 22 09:14:11 " },
      { t: "WS-FIN-07", f: "source_name" },
      { t: " Security: EventID=" },
      { t: "4625", f: "windows.event_id" },
      { t: " User=" },
      { t: "j.rao", f: "windows.username" },
      { t: " SourceIP=" },
      { t: "10.0.4.23", f: "source.ip" },
      { t: " Action=" },
      { t: "FAILED", f: "event_action" },
    ],
    pattern:
      "<%{NUMBER:syslog_priority}>%{MONTH:month} +%{MONTHDAY:day} %{TIME:time} %{HOSTNAME:source_name} Security: EventID=%{NUMBER:event_id} User=%{USERNAME:username} SourceIP=%{IP:source_ip} Action=%{WORD:action}",
    doc: [
      ["event_category", "authentication"],
      ["source_type", "windows"],
      ["log_source", "windows_event_log"],
      ["windows.event_id", "4625"],
      ["windows.username", "j.rao"],
      ["source.ip", "10.0.4.23"],
      ["event_action", "failed"],
      ["event_type", "windows_login_failed"],
      ["severity", "medium"],
    ],
    rule: "Action=failed → windows_login_failed, severity medium. Anything else → windows_login, low.",
  },
  {
    id: "dns",
    label: "DNS",
    input: "UDP 5004",
    pipeline: "dns.conf",
    index: "events-dns-YYYY.MM.dd",
    segments: [
      { t: "<13>Oct 22 09:14:20 NS-01 named[2345]: query: " },
      { t: "c2-server.com", f: "dns.query" },
      { t: " " },
      { t: "A", f: "dns.query_type" },
      { t: " IN " },
      { t: "192.168.1.88", f: "source.ip" },
    ],
    pattern:
      "query:\\s+(?<dns_query>[\\w\\-.]+)\\s+(?<query_type_raw>\\w+)\\s+IN\\s+(?<client_ip>\\d+\\.\\d+\\.\\d+\\.\\d+)",
    doc: [
      ["event_category", "network"],
      ["event_action", "query"],
      ["source_type", "dns"],
      ["protocol", "UDP"],
      ["dns.query", "c2-server.com"],
      ["dns.query_type", "A"],
      ["source.ip", "192.168.1.88"],
      ["event_type", "dns_query_suspicious"],
      ["severity", "medium"],
    ],
    rule: "Query matches malware | c2 | trojan | ransomware | botnet | phishing | exploit | suspicious → dns_query_suspicious, medium.",
  },
  {
    id: "proxy",
    label: "Proxy",
    input: "UDP 5003",
    pipeline: "proxy.conf",
    index: "events-proxy-YYYY.MM.dd",
    segments: [
      { t: "<14>Oct 22 09:14:26 " },
      { t: "PRX-01", f: "source_name" },
      { t: " proxy: " },
      { t: "GET", f: "http.request.method" },
      { t: " " },
      { t: "http://downloads.example.org/setup.exe", f: "url.original" },
      { t: " " },
      { t: "403", f: "http.response.status_code" },
      { t: " 512 " },
      { t: "10.0.4.31", f: "source.ip" },
    ],
    pattern:
      "<%{NUMBER:priority}>%{MONTH:month} +%{MONTHDAY:day} %{TIME:time} %{HOSTNAME:source_name} proxy: %{WORD:method} %{URI:url} %{NUMBER:status} %{NUMBER:bytes} %{IP:source_ip}",
    doc: [
      ["event_category", "web"],
      ["source_type", "proxy"],
      ["http.request.method", "GET"],
      ["url.original", "http://downloads.example.org/setup.exe"],
      ["http.response.status_code", "403"],
      ["source.ip", "10.0.4.31"],
      ["event_type", "proxy_request_error"],
      ["severity", "medium"],
    ],
    rule: "HTTP status ≥ 400 → proxy_request_error, severity medium. Otherwise proxy_request, low.",
  },
  {
    id: "json",
    label: "JSON",
    input: "TCP 5000",
    pipeline: "logstash.config",
    index: "security-events-YYYY.MM.dd",
    segments: [
      { t: '{"event_type": "' },
      { t: "custom_event", f: "event_type" },
      { t: '", "source_ip": "' },
      { t: "10.0.4.12", f: "source_ip" },
      { t: '", "message": "already structured"}' },
    ],
    pattern: "codec => json   (no Grok: the event is already structured)",
    doc: [
      ["event_type", "custom_event"],
      ["source_ip", "10.0.4.12"],
      ["message", "already structured"],
      ["ingestion_source", "logstash"],
    ],
    rule: "No classification: the JSON pipeline tags ingestion_source and indexes the event as-is.",
  },
];
