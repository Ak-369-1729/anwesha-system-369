'use client';

import { useState } from 'react';

type SecurityLabProps = { onAward: (id: string, points: number) => void };

const nodes = [
  { id: 'GW-01', role: 'Gateway', concept: 'AUTHENTICATION', x: 14, y: 25 },
  { id: 'ID-02', role: 'Identity', concept: 'ACCESS CONTROL', x: 37, y: 13 },
  { id: 'AP-03', role: 'Service', concept: 'SECURE SYSTEM DESIGN', x: 62, y: 20 },
  { id: 'DB-04', role: 'Database', concept: 'LEAST PRIVILEGE', x: 84, y: 35 },
  { id: 'MQ-05', role: 'Event bus', concept: 'TRUST BOUNDARIES', x: 47, y: 42 },
  { id: 'SV-06', role: 'Service', concept: 'ZERO TRUST', x: 20, y: 62 },
  { id: 'WK-07', role: 'Worker', concept: 'ANOMALY DETECTION', x: 68, y: 61 },
  { id: 'LG-08', role: 'Log sink', concept: 'AUDITABILITY', x: 40, y: 81 },
  { id: 'CA-09', role: 'Cache', concept: 'THREAT MODELING', x: 84, y: 82 },
  { id: 'RP-10', role: 'Replica', concept: 'DEFENSE IN DEPTH', x: 10, y: 87 },
];

const edges = [
  [0, 1],
  [0, 4],
  [0, 5],
  [1, 2],
  [1, 4],
  [2, 3],
  [2, 4],
  [3, 6],
  [4, 5],
  [4, 6],
  [4, 7],
  [5, 7],
  [5, 9],
  [6, 7],
  [6, 8],
  [7, 9],
  [7, 8],
];

export function SecurityLab({ onAward }: SecurityLabProps) {
  const [compromised, setCompromised] = useState(6);
  const [selected, setSelected] = useState<number | null>(null);
  const [contained, setContained] = useState(false);
  const [message, setMessage] = useState(
    'One node is sending traffic outside its trust boundary. Inspect the telemetry, then isolate the anomaly.',
  );

  const selectedNode = selected === null ? null : nodes[selected];
  const isThreat = selected === compromised;

  function inspect(index: number) {
    setSelected(index);
    setMessage(
      index === compromised
        ? contained
          ? 'This node is isolated. Its outgoing connections are disabled.'
          : `${nodes[index].id}: unusual egress and repeated authorization failures. This behavior breaks the expected service policy.`
        : `${nodes[index].id}: traffic is within the expected policy. Look for a node with both denied requests and unusual egress.`,
    );
  }

  function isolate() {
    if (selected === null || contained) return;
    if (selected !== compromised) {
      setMessage(
        'Policy check: this node is healthy. Isolation was not applied. Inspect the anomalous telemetry before changing the network.',
      );
      return;
    }
    setContained(true);
    setMessage(
      'THREAT CONTAINED. Outgoing edges revoked. The rest of the network remains available. +100 signal on your first successful containment.',
    );
    onAward('cyber-threat', 100);
  }

  function reset() {
    setCompromised(
      (old) => (old + 1 + Math.floor(Math.random() * (nodes.length - 1))) % nodes.length,
    );
    setSelected(null);
    setContained(false);
    setMessage(
      'New simulation initialized. Inspect the telemetry and isolate the node crossing its trust boundary.',
    );
  }

  return (
    <div className={`security-lab${contained ? ' contained' : ''}`}>
      <div className="security-topline">
        <span>
          <i className={contained ? 'status-dot' : 'status-dot alert'} />
          {contained ? 'PERIMETER SECURE' : 'ANOMALY DETECTED'}
        </span>
        <span>SIMULATED NETWORK / 10 NODES</span>
      </div>
      <div className="security-workspace">
        <div
          className="network-map"
          role="group"
          aria-label="Network topology. Select a node to inspect its telemetry."
        >
          <svg
            className="network-edges"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {edges.map(([from, to]) => (
              <line
                key={`${from}-${to}`}
                x1={nodes[from].x}
                y1={nodes[from].y}
                x2={nodes[to].x}
                y2={nodes[to].y}
                className={
                  contained && (from === compromised || to === compromised) ? 'edge-isolated' : ''
                }
              />
            ))}
          </svg>
          {nodes.map((node, index) => {
            const anomaly = index === compromised;
            return (
              <button
                key={node.id}
                type="button"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                className={`network-node${anomaly ? ' anomaly' : ''}${selected === index ? ' selected' : ''}${anomaly && contained ? ' isolated' : ''}`}
                onClick={() => inspect(index)}
                aria-pressed={selected === index}
                aria-label={`${node.id}, ${node.role}. ${anomaly ? (contained ? 'Isolated' : 'Unusual egress detected') : 'Normal traffic'}`}
                data-cursor="INSPECT"
              >
                <span className="node-mark" aria-hidden="true">
                  {anomaly && contained ? '✓' : anomaly ? '!' : '+'}
                </span>
                <span className="node-label">{node.id}</span>
              </button>
            );
          })}
          <span className="network-coordinate" aria-hidden="true">
            TRUST ZONE 36.9
          </span>
        </div>
        <div className="node-inspector">
          <p className="eyebrow">NODE TELEMETRY</p>
          <h3>{selectedNode ? selectedNode.id : 'Inspect a node'}</h3>
          <p className="inspector-role">
            {selectedNode?.role || 'Select any point in the topology.'}
          </p>
          <dl className="node-metrics">
            <div>
              <dt>POLICY</dt>
              <dd>
                {selectedNode
                  ? isThreat
                    ? contained
                      ? 'ISOLATED'
                      : 'VIOLATION'
                    : 'WITHIN BOUNDS'
                  : '—'}
              </dd>
            </div>
            <div>
              <dt>DENIED / MIN</dt>
              <dd>{selectedNode ? (isThreat ? '369' : String(1 + ((selected || 0) % 3))) : '—'}</dd>
            </div>
            <div>
              <dt>EGRESS</dt>
              <dd>
                {selectedNode
                  ? isThreat
                    ? contained
                      ? 'REVOKED'
                      : 'UNKNOWN HOST'
                    : 'ALLOWLISTED'
                  : '—'}
              </dd>
            </div>
          </dl>
          <p className="node-concept">{selectedNode?.concept || 'OBSERVE → REASON → CONTAIN'}</p>
          <button
            type="button"
            className="button isolate-button"
            onClick={isolate}
            disabled={selected === null || contained}
          >
            {contained ? '✓ THREAT CONTAINED' : 'ISOLATE SELECTED NODE'}
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
      <p className="security-message" role="status">
        {message}
      </p>
      <div className="security-footer">
        <span>Educational simulation · runs entirely on this device</span>
        <button type="button" onClick={reset}>
          RESET SIMULATION ↻
        </button>
      </div>
    </div>
  );
}

export default SecurityLab;
