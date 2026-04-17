export const levels = [

  {
    title: 'Wave 1',
    music: 'intro',
    time: 50,
    types: ['drone', 'dancer'],
    startUp: [
      { ent: 'drone', props: {} },
      { ent: 'kitty', props: { pos: vec2(-1.5, -5) } },
      { ent: 'kitty', props: { pos: vec2(1.5, -5) } },
      { ent: 'wall', props: { pos: vec2(-1, 5) } },
      { ent: 'wall', props: { pos: vec2(0, 5) } },
      { ent: 'wall', props: { pos: vec2(1, 5) } },
    ]

  }

]
