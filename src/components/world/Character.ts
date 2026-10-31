import { clamp, ellipse, lerp, line, mixColor, polygon, type Point } from './geometry';

export type CharacterPose =
  'idle' | 'look-up' | 'walk' | 'inspect' | 'reach' | 'react' | 'point' | 'sit' | 'turn';
export type CharacterOptions = {
  x: number;
  y: number;
  height: number;
  day: number;
  time: number;
  pose: CharacterPose;
  walk: number;
  gaze: Point;
  shield: boolean;
  collected: number;
  adult?: number;
  reflected?: boolean;
  helmet?: number;
  opacity?: number;
  direction?: number;
};

/** Original articulated silhouette: a copper scarf and a loose field jacket persist at every age. */
export function drawCharacter(ctx: CanvasRenderingContext2D, options: CharacterOptions) {
  const { x, y, height, day, time, pose, gaze, shield, collected } = options;
  const adult = options.adult ?? 0;
  const seated = pose === 'sit' ? 1 : 0;
  const unit = height / 110;
  const facing = options.reflected ? -1 : (options.direction ?? 1);
  const gait = Math.sin(time * 5.1) * options.walk;
  const breathing = Math.sin(time * 1.35) * 0.65;
  const jacket = mixColor('#203b4d', '#627989', day);
  const trousers = mixColor('#122434', '#39485b', day);
  const skin = mixColor('#b99780', '#c19b7c', day);
  const hair = mixColor('#111b2a', '#283345', day);
  const rim = mixColor('#a0c2cf', '#f1d6aa', day);
  const scarf = mixColor('#d7aa65', '#bf804b', day);
  const lean = pose === 'inspect' ? 0.13 : pose === 'reach' ? -0.06 : options.walk * 0.025;
  const hipY = -43 - adult * 8 + seated * 21;
  const bodyY = -75 - adult * 5 + seated * 20 + breathing;
  const headY = -91 - adult * 6 + seated * 20 + breathing;
  const lookUp = pose === 'look-up' || pose === 'point' || pose === 'reach';
  const headAngle =
    (lookUp ? -0.18 : clamp(gaze.y, -0.4, 0.4) * 0.16) +
    gaze.x * 0.08 +
    (pose === 'turn' ? 0.08 : 0);
  const root = { x: 0, y: hipY };
  const leftKnee = { x: -6 + gait * 7 + seated * 16, y: -22 + Math.max(0, gait) * 4 + seated * 9 };
  const rightKnee = { x: 6 - gait * 7 + seated * 15, y: -22 + Math.max(0, -gait) * 4 + seated * 9 };
  const leftFoot = { x: -8 - gait * 11 + seated * 13, y: -Math.max(0, gait) * 5 };
  const rightFoot = { x: 8 + gait * 11 + seated * 15, y: -Math.max(0, -gait) * 5 };

  ctx.save();
  ctx.globalAlpha *= options.opacity ?? 1;
  ctx.translate(x, y);
  ctx.scale(unit * facing, unit);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // A real shadow roots the character in the world rather than placing a mascot over it.
  ellipse(
    ctx,
    5 + day * 13,
    2,
    19 + day * 9,
    3.1,
    day > 0.5 ? 'rgba(60,70,76,.15)' : 'rgba(0,8,18,.4)',
    -0.05,
    true,
  );
  const limb = (a: Point, b: Point, c: Point, width: number, color: string) => {
    line(ctx, [a, b, c], color, width);
  };
  limb({ x: -5, y: root.y }, leftKnee, leftFoot, 6.6, trousers);
  limb({ x: 5, y: root.y }, rightKnee, rightFoot, 6.8, trousers);
  line(ctx, [leftFoot, { x: leftFoot.x + 6.5, y: leftFoot.y }], '#122131', 6);
  line(ctx, [rightFoot, { x: rightFoot.x + 7, y: rightFoot.y }], '#122131', 6);
  line(
    ctx,
    [
      { x: -8, y: -2 },
      { x: -2, y: -2 },
    ],
    rim,
    0.7,
  );
  ctx.translate(0, hipY);
  ctx.rotate(lean);
  ctx.translate(0, -hipY);

  // Far arm, shoulder, hand. The same little reach is echoed by the engineer in the mirror.
  let farElbow = { x: -15, y: bodyY + 16 - gait * 5 };
  let farHand = { x: -14, y: bodyY + 32 - gait * 8 };
  let nearElbow = { x: 16, y: bodyY + 18 + gait * 5 };
  let nearHand = { x: 16, y: bodyY + 34 + gait * 8 };
  if (pose === 'inspect') {
    nearElbow = { x: 24, y: bodyY + 14 };
    nearHand = { x: 29, y: bodyY + 4 };
    farElbow = { x: -5, y: bodyY + 20 };
    farHand = { x: 14, y: bodyY + 21 };
  }
  if (pose === 'point' || pose === 'reach') {
    nearElbow = { x: 22, y: bodyY + (pose === 'point' ? 0 : 8) };
    nearHand = { x: 35, y: bodyY - (pose === 'point' ? 17 : 6) };
  }
  if (pose === 'react') {
    nearElbow = { x: 22, y: bodyY - 1 };
    nearHand = { x: 25, y: bodyY - 21 };
    farElbow = { x: -21, y: bodyY + 1 };
    farHand = { x: -24, y: bodyY - 17 };
  }
  if (pose === 'turn') {
    nearElbow = { x: 22, y: bodyY + 2 };
    nearHand = { x: 21 + Math.sin(time * 5) * 3, y: bodyY - 14 };
  }
  limb({ x: -8, y: bodyY + 4 }, farElbow, farHand, 5.8, mixColor(jacket, '#172c3d', 0.3));
  ellipse(ctx, farHand.x, farHand.y, 2.6, 3, skin, 0, true);
  polygon(
    ctx,
    [
      { x: -9, y: bodyY },
      { x: 7, y: bodyY - 1 },
      { x: 12, y: bodyY + 14 },
      { x: 13, y: hipY + 6 },
      { x: -12, y: hipY + 5 },
      { x: -10, y: bodyY + 14 },
    ],
    jacket,
  );
  line(
    ctx,
    [
      { x: 6, y: bodyY + 1 },
      { x: 10, y: bodyY + 20 },
      { x: 10, y: hipY + 3 },
    ],
    rim,
    0.8,
  );
  line(
    ctx,
    [
      { x: -9, y: hipY + 3 },
      { x: 10, y: hipY + 5 },
    ],
    '#4d6a78',
    0.7,
  );
  // Seam, pocket, and a small explorer satchel keep the silhouette specific at modest resolution.
  line(
    ctx,
    [
      { x: -5, y: bodyY + 12 },
      { x: -4, y: bodyY + 24 },
      { x: 2, y: bodyY + 24 },
    ],
    mixColor(jacket, rim, 0.25),
    0.8,
  );
  line(
    ctx,
    [
      { x: 0, y: bodyY + 1 },
      { x: -8, y: hipY + 1 },
    ],
    '#ab9978',
    1.3,
  );
  ctx.fillStyle = mixColor('#596354', '#8a8068', day);
  ctx.fillRect(-15, hipY - 1, 11, 12);
  ctx.strokeStyle = '#adb99f';
  ctx.lineWidth = 0.6;
  ctx.strokeRect(-15, hipY - 1, 11, 12);
  limb({ x: 8, y: bodyY + 3 }, nearElbow, nearHand, 6.4, jacket);
  line(
    ctx,
    [
      { x: nearElbow.x + 2, y: nearElbow.y - 2 },
      { x: nearHand.x + 1, y: nearHand.y - 2 },
    ],
    rim,
    0.7,
  );
  ellipse(ctx, nearHand.x, nearHand.y, 2.7, 3.2, skin, 0, true);
  ctx.fillStyle = skin;
  ctx.fillRect(-1, headY + 8, 5, 6);

  ctx.save();
  ctx.translate(1, headY);
  ctx.rotate(headAngle);
  const headR = lerp(10.5, 8.9, adult);
  // Hair is a drawn shape and soft ponytail, never a photo or image sprite.
  ellipse(ctx, -1, -1, headR + 1.2, headR + 2, hair, -0.12, true);
  ctx.beginPath();
  ctx.moveTo(3, -8);
  ctx.bezierCurveTo(12, -7, 10, 0, 13, 3);
  ctx.lineTo(10, 5);
  ctx.bezierCurveTo(9, 11, 2, 11, 0, 6);
  ctx.lineTo(-1, -4);
  ctx.fillStyle = skin;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-7, -9);
  ctx.bezierCurveTo(-2, -17, 12, -12, 10, -4);
  ctx.bezierCurveTo(4, -3, 4, -8, -1, -4);
  ctx.lineTo(-3, 5);
  ctx.lineTo(-9, 3);
  ctx.closePath();
  ctx.fillStyle = hair;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-9, -4);
  ctx.bezierCurveTo(-21, -9, -20, 11, -15, 15);
  ctx.bezierCurveTo(-16, 5, -9, 7, -8, 1);
  ctx.fillStyle = hair;
  ctx.fill();
  line(
    ctx,
    [
      { x: -8, y: -9 },
      { x: -3, y: -12 },
      { x: 4, y: -10 },
    ],
    rim,
    0.75,
  );
  ellipse(ctx, 7, 0.2, 0.8, 1, '#162534', 0, true);
  ellipse(ctx, -7, -3, 1.6, 2, scarf, 0, true);
  if ((options.helmet ?? 0) > 0) {
    ctx.globalAlpha *= options.helmet ?? 0;
    ellipse(ctx, 2, -1, 17, 18, 'rgba(176,221,230,.55)');
    line(
      ctx,
      [
        { x: 13, y: -13 },
        { x: 17, y: -7 },
        { x: 18, y: 0 },
      ],
      'rgba(234,250,244,.65)',
      1,
    );
  }
  ctx.restore();
  // The small scarf is the recognizable motif in the girl, student, and present-day reflection.
  polygon(
    ctx,
    [
      { x: -5, y: headY + 10 },
      { x: 7, y: headY + 11 },
      { x: 6, y: headY + 15 },
      { x: -6, y: headY + 14 },
    ],
    scarf,
  );
  ctx.beginPath();
  ctx.moveTo(-5, headY + 14);
  ctx.quadraticCurveTo(-18, headY + 21 + Math.sin(time * 2) * 2, -18, headY + 32);
  ctx.lineTo(-13, headY + 30);
  ctx.quadraticCurveTo(-13, headY + 21, -2, headY + 16);
  ctx.fillStyle = scarf;
  ctx.fill();

  if (shield) {
    ctx.save();
    ctx.translate(-17, hipY + 10);
    ctx.rotate(-0.15);
    polygon(
      ctx,
      [
        { x: -6, y: -7 },
        { x: 6, y: -7 },
        { x: 5, y: 3 },
        { x: 0, y: 8 },
        { x: -5, y: 3 },
      ],
      mixColor('#31595c', '#c4d4cc', day),
      '#b9d7c8',
    );
    line(
      ctx,
      [
        { x: -2.8, y: -1 },
        { x: -0.3, y: 1.5 },
        { x: 3.4, y: -3 },
      ],
      '#cce9d7',
      0.9,
    );
    ctx.restore();
  }
  for (let i = 0; i < Math.min(4, collected); i++) {
    const angle = -1.5 + i * 0.36;
    const radius = 17;
    ellipse(
      ctx,
      -10 + Math.cos(angle) * radius,
      hipY + 8 + Math.sin(angle) * radius,
      1.2,
      1.2,
      '#efce8d',
      0,
      true,
    );
  }
  ctx.restore();
}
