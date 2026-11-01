'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { projects, skills } from '@/data/portfolio';

type Props = {
  progressRef: { current: number };
  sceneId: string;
  theme: 'dark' | 'light';
  reducedMotion: boolean;
  onInspect: () => void;
  onDiscover: () => void;
  onProject: (id: string) => void;
  onSkill: (index: number) => void;
};

/** A persistent, raycastable observatory. Every model is made for this portfolio. */
export default function OrbitalStage(props: Props) {
  const router = useRouter();
  const host = useRef<HTMLDivElement>(null);
  const live = useRef(props);
  const skillButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const projectLinks = useRef<(HTMLAnchorElement | null)[]>([]);
  const rotate = useRef<(delta: number) => void>(() => {});
  const reset = useRef<() => void>(() => {});
  const [label, setLabel] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    live.current = props;
  }, [props]);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    void import('three')
      .then((T) => {
        if (disposed || !host.current) return;
        const element = host.current;
        let renderer: InstanceType<typeof T.WebGLRenderer>;
        try {
          renderer = new T.WebGLRenderer({
            alpha: true,
            antialias: true,
            powerPreference: 'low-power',
          });
        } catch {
          return;
        }
        renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.6));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = T.SRGBColorSpace;
        renderer.domElement.setAttribute('aria-hidden', 'true');
        renderer.domElement.className = 'orbital-webgl';
        element.prepend(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(37, 1, 0.1, 80);
        camera.position.set(0, 0.25, 7.6);
        const rig = new T.Group();
        rig.rotation.set(0.15, 0, -0.22);
        scene.add(rig);
        const uniforms = {
          uTime: { value: 0 },
          uDay: { value: 0 },
          uCyber: { value: 0 },
          uPulse: { value: 0 },
        };
        const material = new T.ShaderMaterial({
          uniforms,
          vertexShader: `varying vec3 vNormal; varying vec3 vPosition;
          void main(){vNormal=normalize(normalMatrix*normal);vPosition=position;
          gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
          fragmentShader: `precision highp float; varying vec3 vNormal; varying vec3 vPosition;
          uniform float uTime; uniform float uDay; uniform float uCyber; uniform float uPulse;
          float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
          void main(){
            vec3 n=normalize(vNormal); float light=max(dot(n,normalize(vec3(-.7,.65,1.))),0.);
            float grain=hash(floor(vPosition*165.))*.065;
            float bands=sin(vPosition.y*45.+sin(vPosition.x*9.+uTime*.13)*1.8)*.5+.5;
            float engraving=step(.94,bands)*.07;
            vec3 ink=mix(vec3(.038,.062,.045),vec3(.16,.19,.12),uDay);
            vec3 copper=mix(vec3(.94,.35,.15),vec3(.76,.30,.12),uDay);
            vec3 color=mix(ink,copper,pow(light,2.1));
            color+=pow(1.-max(n.z,0.),3.)*vec3(.58,.39,.16)*.3;
            float lat=abs(sin(vPosition.y*27.)); float lon=abs(sin(atan(vPosition.z,vPosition.x)*18.));
            float grid=(1.-smoothstep(.012,.035,min(lat,lon)))*.24;
            color+=grid*vec3(.74,.75,.55);
            float scan=pow(max(0.,sin(vPosition.y*75.+uTime*1.8)),14.);
            color=mix(color,vec3(.17,.44,.29)+grid*.3+scan*.08,uCyber*.75);
            color+=(grain-engraving)+uPulse*.14;
            gl_FragColor=vec4(color,1.);
          }`,
        });
        const core = new T.Mesh(new T.SphereGeometry(1.35, 64, 40), material);
        core.userData.kind = 'inspect';
        rig.add(core);
        const orbitMaterial = new T.LineBasicMaterial({
          color: 0xc7c5a8,
          transparent: true,
          opacity: 0.48,
        });
        const rings: InstanceType<typeof T.LineLoop>[] = [];
        for (let i = 0; i < 3; i++) {
          const points = Array.from({ length: 160 }, (_, j) => {
            const a = (j / 160) * Math.PI * 2,
              radius = 1.95 + i * 0.3;
            return new T.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
          });
          const ring = new T.LineLoop(new T.BufferGeometry().setFromPoints(points), orbitMaterial);
          ring.rotation.x = 0.35 + i * 0.27;
          ring.rotation.z = i * 0.2;
          rig.add(ring);
          rings.push(ring);
        }
        const bodyMat = new T.MeshStandardMaterial({
          color: 0xe3d9b8,
          roughness: 0.42,
          metalness: 0.65,
        });
        const panelMat = new T.MeshStandardMaterial({
          color: 0x5f7871,
          roughness: 0.4,
          metalness: 0.65,
        });
        const probeGeometry = new T.BoxGeometry(0.15, 0.16, 0.15);
        const solarGeometry = new T.BoxGeometry(0.3, 0.012, 0.2);
        const satellites = projects.map((project, i) => {
          const satellite = new T.Group();
          satellite.userData.project = project;
          const body = new T.Mesh(probeGeometry, bodyMat);
          satellite.add(body);
          for (const side of [-1, 1]) {
            const panel = new T.Mesh(solarGeometry, panelMat);
            panel.position.x = side * 0.23;
            satellite.add(panel);
            const grid = new T.LineSegments(new T.EdgesGeometry(solarGeometry), orbitMaterial);
            grid.position.copy(panel.position);
            satellite.add(grid);
          }
          satellite.rotation.set(i * 0.2, i * 0.7, i * 0.3);
          const hit = new T.Mesh(
            new T.SphereGeometry(0.25, 8, 6),
            new T.MeshBasicMaterial({ visible: false }),
          );
          hit.userData.project = project;
          satellite.add(hit);
          rig.add(satellite);
          return satellite;
        });
        const graph = new T.Group();
        rig.add(graph);
        const nodeMat = new T.MeshStandardMaterial({ color: 0xefbda1, roughness: 0.5 });
        const nodes = Array.from({ length: skills.length }, (_, i) => {
          const node = new T.Mesh(new T.OctahedronGeometry(i === 4 ? 0.19 : 0.105), nodeMat);
          node.position.set(
            ((i % 4) - 1.5) * 0.85,
            (1 - Math.floor(i / 4)) * 0.95,
            Math.sin(i * 2) * 0.4,
          );
          node.userData.kind = 'inspect';
          graph.add(node);
          return node;
        });
        const networkLines = new T.LineSegments(
          new T.BufferGeometry().setFromPoints(
            nodes.flatMap((node, i) =>
              i < nodes.length - 1 ? [node.position, nodes[i + 1].position] : [],
            ),
          ),
          orbitMaterial,
        );
        graph.add(networkLines);
        scene.add(new T.HemisphereLight(0xf6e8c9, 0x24352c, 2.5));
        const key = new T.DirectionalLight(0xffe6c1, 4);
        key.position.set(-3, 4, 5);
        scene.add(key);
        const rim = new T.DirectionalLight(0xc8ddd5, 2);
        rim.position.set(4, -1, -2);
        scene.add(rim);
        const raycaster = new T.Raycaster(),
          pointer = new T.Vector2();
        let width = 1,
          height = 1,
          frame = 0,
          last = 0,
          time = 0,
          dragging = false,
          downX = 0,
          downY = 0,
          lastX = 0;
        let targetRotation = 0.3,
          rotation = 0.3,
          velocity = 0,
          pulse = 0,
          previousId = '',
          hovered = '';
        let coreWeight = 1,
          graphWeight = 0;
        const satelliteWeights = projects.map(() => 0);
        let force = true;
        const seen = new Set<number>();
        function resize() {
          const bounds = element.getBoundingClientRect();
          width = bounds.width;
          height = bounds.height;
          renderer.setSize(width, height);
          camera.aspect = width / Math.max(1, height);
          camera.updateProjectionMatrix();
          force = true;
        }
        const observer = new ResizeObserver(resize);
        observer.observe(element);
        resize();
        const cast = (event: PointerEvent) => {
          const rect = element.getBoundingClientRect();
          pointer.set(
            ((event.clientX - rect.left) / width) * 2 - 1,
            (-(event.clientY - rect.top) / height) * 2 + 1,
          );
          raycaster.setFromCamera(pointer, camera);
          const projectScene = ['workshop', 'universe'].includes(live.current.sceneId);
          const targets = projectScene
            ? satellites.flatMap((s) => s.children)
            : graph.visible
              ? nodes
              : [core];
          return raycaster.intersectObjects(targets, false)[0];
        };
        const down = (event: PointerEvent) => {
          if (event.target !== renderer.domElement) return;
          dragging = true;
          downX = lastX = event.clientX;
          downY = event.clientY;
          velocity = 0;
          element.setPointerCapture(event.pointerId);
        };
        const move = (event: PointerEvent) => {
          if (dragging) {
            const delta = (event.clientX - lastX) * 0.009;
            targetRotation += delta;
            velocity = delta;
            lastX = event.clientX;
            force = true;
            return;
          }
          const hit = cast(event);
          const project = hit?.object.userData.project;
          const next = project?.title || (hit ? 'Inspect this world' : '');
          if (next !== hovered) {
            hovered = next;
            setLabel(next);
            element.dataset.cursor = next ? 'INSPECT' : 'DRAG';
          }
        };
        const up = (event: PointerEvent) => {
          if (!dragging) return;
          dragging = false;
          if (element.hasPointerCapture(event.pointerId))
            element.releasePointerCapture(event.pointerId);
          if (Math.hypot(event.clientX - downX, event.clientY - downY) > 6) return;
          const hit = cast(event);
          if (!hit) return;
          pulse = 1;
          force = true;
          const project = hit.object.userData.project;
          if (project) {
            live.current.onProject(project.id);
            router.push(`/missions/${project.id}/`);
            return;
          }
          if (live.current.sceneId === 'night') {
            seen.add(Math.round((targetRotation % (Math.PI * 2)) * 10));
            if (seen.size >= 3) live.current.onDiscover();
          } else live.current.onInspect();
        };
        const cancel = () => {
          dragging = false;
        };
        const lost = (event: Event) => {
          event.preventDefault();
          renderer.domElement.style.opacity = '0';
          setReady(false);
        };
        element.addEventListener('pointerdown', down);
        element.addEventListener('pointermove', move);
        element.addEventListener('pointerup', up);
        element.addEventListener('pointercancel', cancel);
        renderer.domElement.addEventListener('webglcontextlost', lost);
        rotate.current = (delta) => {
          targetRotation += delta;
          force = true;
        };
        reset.current = () => {
          targetRotation = 0.3;
          velocity = 0;
          pulse = 0.5;
          force = true;
        };
        function draw(now: number) {
          frame = requestAnimationFrame(draw);
          if (document.hidden || now - last < 33) return;
          const dt = Math.min(0.06, (now - last) / 1000);
          last = now;
          const settings = live.current,
            id = settings.sceneId;
          const changed = id !== previousId;
          if (changed) {
            previousId = id;
            force = true;
            setLabel('');
          }
          const targetDay = settings.theme === 'light' ? 1 : 0;
          const day = uniforms.uDay.value;
          const themeMoving = Math.abs(day - targetDay) > 0.001;
          uniforms.uDay.value = settings.reducedMotion
            ? targetDay
            : T.MathUtils.lerp(day, targetDay, dt * 4);
          if (!settings.reducedMotion) {
            time += dt;
            if (!dragging) {
              targetRotation += velocity;
              velocity *= 0.9;
            }
            rotation = T.MathUtils.lerp(rotation, targetRotation, dt * 9);
          } else {
            rotation = targetRotation;
            velocity = 0;
          }
          if (settings.reducedMotion && !force && !themeMoving && !changed) return;
          force = false;
          const isNetwork = ['forest', 'engine', 'failure', 'cyberspace', 'lab'].includes(id);
          const isSpace = ['rocket', 'launch', 'space', 'workshop', 'universe'].includes(id);
          const isQuiet = ['door', 'flight-path', 'mirror', 'human', 'contact'].includes(id);
          const blend = settings.reducedMotion ? 1 : Math.min(1, dt * 5);
          coreWeight = T.MathUtils.lerp(
            coreWeight,
            (!isNetwork || id === 'cyberspace') && !isQuiet ? 1 : 0,
            blend,
          );
          graphWeight = T.MathUtils.lerp(graphWeight, isNetwork ? 1 : 0, blend);
          core.visible = coreWeight > 0.005;
          graph.visible = graphWeight > 0.005;
          graph.scale.setScalar(Math.max(0.001, graphWeight));
          core.scale.setScalar(
            (isSpace || id === 'cyberspace' ? 0.55 : 0.9) * Math.max(0.001, coreWeight),
          );
          rig.position.y = 0.45;
          element.dataset.rotation = rotation.toFixed(3);
          element.dataset.scene = id;
          rig.scale.setScalar(isQuiet ? 0.55 : 1);
          rig.rotation.y = rotation + (settings.reducedMotion ? 0 : time * 0.025);
          rig.rotation.x = 0.15 + Math.sin(settings.progressRef.current * 0.3) * 0.2;
          core.rotation.y = time * 0.035;
          uniforms.uTime.value = time;
          uniforms.uCyber.value = T.MathUtils.lerp(
            uniforms.uCyber.value,
            id === 'cyberspace' ? 1 : 0,
            blend,
          );
          pulse = Math.max(0, pulse - dt * 1.8);
          uniforms.uPulse.value = pulse;
          rings.forEach((ring, i) => {
            ring.visible = !isQuiet;
            ring.rotation.z = i * 0.2 + settings.progressRef.current * 0.07;
          });
          satellites.forEach((satellite, i) => {
            satelliteWeights[i] = T.MathUtils.lerp(
              satelliteWeights[i],
              isSpace || (id === 'night' && i < 3) ? 1 : 0,
              blend,
            );
            satellite.visible = satelliteWeights[i] > 0.005;
            const angle =
              (i / projects.length) * Math.PI * 2 + time * (settings.reducedMotion ? 0 : 0.018);
            const radius = id === 'universe' ? 2.1 + (i % 3) * 0.18 : 2.2;
            satellite.position.set(
              Math.cos(angle) * radius,
              Math.sin(angle) * radius * 0.64,
              Math.sin(angle * 2 + i) * 0.65,
            );
            satellite.scale.setScalar(
              (['workshop', 'universe'].includes(id) ? 1.15 : 0.7) *
                Math.max(0.001, satelliteWeights[i]),
            );
          });
          const color = settings.theme === 'light' ? 0x4c5a43 : 0xc7c5a8;
          orbitMaterial.color.setHex(color);
          nodeMat.color.setHex(settings.theme === 'light' ? 0x9e472a : 0xefbda1);
          renderer.render(scene, camera);
          nodes.forEach((node, i) => {
            const button = skillButtons.current[i];
            if (!button) return;
            const point = node.getWorldPosition(new T.Vector3()).project(camera);
            button.style.left = `${(point.x * 0.5 + 0.5) * width}px`;
            button.style.top = `${(-point.y * 0.5 + 0.5) * height}px`;
          });
          satellites.forEach((satellite, i) => {
            const link = projectLinks.current[i];
            if (!link) return;
            const position = satellite.getWorldPosition(new T.Vector3()).project(camera);
            link.style.left = `${(position.x * 0.5 + 0.5) * width}px`;
            link.style.top = `${(-position.y * 0.5 + 0.5) * height}px`;
            link.style.visibility = position.z < 1 && position.z > -1 ? 'visible' : 'hidden';
          });
        }
        frame = requestAnimationFrame(draw);
        setReady(true);
        cleanup = () => {
          cancelAnimationFrame(frame);
          observer.disconnect();
          element.removeEventListener('pointerdown', down);
          element.removeEventListener('pointermove', move);
          element.removeEventListener('pointerup', up);
          element.removeEventListener('pointercancel', cancel);
          renderer.domElement.removeEventListener('webglcontextlost', lost);
          const geometries = new Set<InstanceType<typeof T.BufferGeometry>>();
          const materials = new Set<InstanceType<typeof T.Material>>();
          scene.traverse((object) => {
            const mesh = object as InstanceType<typeof T.Mesh>;
            if (mesh.geometry) geometries.add(mesh.geometry);
            if (mesh.material)
              (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).forEach((m) =>
                materials.add(m),
              );
          });
          geometries.forEach((g) => g.dispose());
          materials.forEach((m) => m.dispose());
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
        };
      })
      .catch(() => {
        /* The illustrated world and all semantic controls remain available. */
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, [router]);

  return (
    <div
      ref={host}
      className={`orbital-stage ${ready ? 'is-ready' : ''} ${['door', 'flight-path', 'mirror', 'human', 'contact'].includes(props.sceneId) ? 'is-quiet' : ''}`}
      data-cursor="DRAG"
      role="group"
      aria-label="Interactive orbital observatory"
    >
      {ready && ['workshop', 'universe'].includes(props.sceneId) && (
        <nav className="orbital-projects" aria-label="Project satellites">
          {projects.map((project, i) => (
            <a
              key={project.id}
              ref={(node) => {
                projectLinks.current[i] = node;
              }}
              className="orbital-project-link"
              href={`/missions/${project.id}/`}
              aria-label={`Open project satellite — ${project.title}`}
              onClick={() => props.onProject(project.id)}
              data-cursor="OPEN"
            >
              <span>{project.title} ↗</span>
            </a>
          ))}
        </nav>
      )}
      {ready && props.sceneId === 'engine' && (
        <div className="orbital-skills" role="group" aria-label="Skill constellation">
          {skills.map((skill, i) => (
            <button
              key={skill.id}
              ref={(node) => {
                skillButtons.current[i] = node;
              }}
              className="orbital-skill"
              aria-label={`Inspect skill constellation — ${skill.name}`}
              onClick={() => props.onSkill(i)}
              data-cursor="INSPECT"
            >
              <span className="orbital-skill-name">{skill.name} ↗</span>
            </button>
          ))}
        </div>
      )}
      <span className="orbital-hover" aria-live="polite">
        {label}
      </span>
      {ready && (
        <div className="orbital-controls" role="group" aria-label="Observatory rotation">
          <span>DRAG TO ORBIT</span>
          <button onClick={() => rotate.current(-0.4)} aria-label="Rotate observatory left">
            ←
          </button>
          <button onClick={() => reset.current()} aria-label="Reset observatory rotation">
            ↺
          </button>
          <button onClick={() => rotate.current(0.4)} aria-label="Rotate observatory right">
            →
          </button>
        </div>
      )}
    </div>
  );
}
