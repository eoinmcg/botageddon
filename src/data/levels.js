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
    music: 'mission2',
    time: 20,
    types: ['drone', 'dancer'],
    freq: 0.965,
    startUp: [
      // { ent: 'claw', props: {} },          // mini-boss
      { ent: 'powerup', props: { pos: vec2(0, 3) } },
      { ent: 'kitty', props: { pos: vec2(-1, -5) } },
      { ent: 'kitty', props: { pos: vec2(1, -5) } }
    ]
  }

]

export const insults = [
  "Miserable fur‑beast! Your paws are no match for my glorious circuitry!",
  "You flea‑ridden feline! I’ve seen toaster ovens with more strategic talent!",
  "Curse you, cat! Stop succeeding — it’s ruining my perfectly villainous mood!",
  "You overgrown house pet! My robots will swat you like the yarn‑chasing fleabag you are!",
  "Pathetic creature! Even my error messages are more impressive than your combat skills!",
  "You think you’ve won? Ha! I’ve debugged coffee machines with more dignity!",
  "Foolish cat! Your victory only proves my robots need a firmware update!",
  "You whiskered nuisance! I’ll turn your precious scratching post into scrap metal!",
  "Cursed feline! How dare you defy my beautifully calibrated defeat sequence!",
  "You may have claws! but I have processing power, you pompous puffball!",
  "Insolent kitty! I’ll have you know my robots were designed by the finest evil engineers!",
  "Stop winning! It’s extremely inconvenient for my plans!",
  "You dare challenge me? I’ll reduce your nine lives to a very disappointing zero!",
]
