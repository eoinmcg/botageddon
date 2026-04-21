// export const levels = [
//   {
//     title: 'Wave 1',
//     music: 'intro',
//     time: 10,
//     types: ['drone', 'muncher'],
//     freq: .991,
//     startUp: [
//       { ent: 'drone', props: {} },
//       { ent: 'powerup', props: { pos: vec2(0, 3) } },
//       { ent: 'kitty', props: { pos: vec2(-1.5, -5) } },
//       { ent: 'kitty', props: { pos: vec2(1.5, -5) } },
//       { ent: 'wall', props: { pos: vec2(-1, 5) } },
//       { ent: 'wall', props: { pos: vec2(0, 5) } },
//       { ent: 'wall', props: { pos: vec2(1, 5) } },
//     ]
//
//   }
//
// ]

export const levels = [
  {
    title: 'Wave 1',
    music: 'intro',
    time: 12,
    types: ['drone'],          // only fodder
    freq: 0.985,               // light pressure
    startUp: [
      { ent: 'kitty', props: { pos: vec2(-0, 3) } },
      { ent: 'kitty', props: { pos: vec2(-1, -3) } },
      { ent: 'kitty', props: { pos: vec2(1, -3) } }
    ]
  },
  {
    title: 'Wave 2',
    music: 'mission',
    time: 15,
    types: ['drone', 'dancer'],   // dancer = charger/zig-zag?
    freq: 0.97,
    startUp: [
      { ent: 'powerup', props: { pos: vec2(0, 3) } },
      { ent: 'kitty', props: { pos: vec2(0, -5) } }
    ]
  },
  {
    title: 'Wave 3',
    music: 'mission2',
    time: 18,
    types: ['drone', 'dancer', 'muncher'],
    freq: 0.955,
    startUp: [
      // { ent: 'turret', props: { pos: vec2(-1.5, 5) } },
      // { ent: 'turret', props: { pos: vec2(1.5, 5) } },
      { ent: 'kitty', props: { pos: vec2(0, -5) } }
    ]
  },
  {
    title: 'Wave 4',
    music: 'boss',
    time: 20,
    types: ['drone', 'dancer'],
    freq: 0.965,
    startUp: [
      { ent: 'claw', props: {} },          // mini-boss
      { ent: 'powerup', props: { pos: vec2(0, 3) } },
      { ent: 'kitty', props: { pos: vec2(-1, -5) } },
      { ent: 'kitty', props: { pos: vec2(1, -5) } }
    ]
  }

]
