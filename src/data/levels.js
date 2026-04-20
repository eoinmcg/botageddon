export const levels = [
  {
    title: 'Wave 1',
    music: 'intro',
    time: 10,
    types: ['drone', 'muncher'],
    freq: .991,
    startUp: [
      { ent: 'drone', props: {} },
      { ent: 'powerup', props: { pos: vec2(0, 3) } },
      { ent: 'kitty', props: { pos: vec2(-1.5, -5) } },
      { ent: 'kitty', props: { pos: vec2(1.5, -5) } },
      { ent: 'wall', props: { pos: vec2(-1, 5) } },
      { ent: 'wall', props: { pos: vec2(0, 5) } },
      { ent: 'wall', props: { pos: vec2(1, 5) } },
    ]

  }

]
