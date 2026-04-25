export const getLevels = () => [
  {
    title: 'SECT0R 0',
    music: 'intro',
    time: 10,
    types: ['chip'],
    freq: 0.985,
    bg: {
      tile: 1,
      col: new Color(.2, .3, .2),
    },
    startUp: [
      { ent: 'kitty', props: { pos: vec2(0, -4) } },
    ]
  },
  {
    title: 'SECT0R 1',
    music: 'mission',
    time: 15,
    types: ['drone'],
    freq: 0.97,
    startUp: [
      { ent: 'powerup', props: { pos: vec2(0, 3) } },
      { ent: 'kitty', props: { pos: vec2(0, -2) } },
      { ent: 'kitty', props: { pos: vec2(4, -2) } },
      { ent: 'kitty', props: { pos: vec2(-4, -2) } },
    ]
  },
  {
    title: 'SECT0R 2',
    music: 'mission2',
    time: 18,
    types: ['drone', 'chip'],
    freq: 0.99,
    startUp: [
      { ent: 'wall', props: { pos: vec2(0, 6), t: 'vat0' } },
      { ent: 'wall', props: { pos: vec2(0, -6), t: 'vat0' } },
      { ent: 'kitty', props: { pos: vec2(0, -4) } },
      { ent: 'kitty', props: { pos: vec2(0, 4) } },
      { ent: 'kitty', props: { pos: vec2(4, 0) } },
      { ent: 'kitty', props: { pos: vec2(-4, 0) } },
    ]
  },
  {
    title: 'SEKT0R 3',
    music: 'mission2',
    time: 20,
    types: ['muncher'],
    freq: 0.995,
    startUp: [
      { ent: 'powerup', props: { pos: vec2(0, 3) } },
      { ent: 'kitty', props: { pos: vec2(-1, 4) } },
      { ent: 'kitty', props: { pos: vec2(1, 4) } },
      { ent: 'kitty', props: { pos: vec2(-1, -4) } },
      { ent: 'kitty', props: { pos: vec2(1, -4) } },
      { ent: 'wall', props: { pos: vec2(0, 6), t: 'monitor0' } },
      { ent: 'wall', props: { pos: vec2(-3, 6), t: 'monitor0' } },
      { ent: 'wall', props: { pos: vec2(3, 6), t: 'monitor0' } },
      { ent: 'wall', props: { pos: vec2(0, -6), t: 'monitor0' } },
      { ent: 'wall', props: { pos: vec2(-3, -6), t: 'monitor0' } },
      { ent: 'wall', props: { pos: vec2(3, -6), t: 'monitor0' } },
    ]
  },
  {
    title: 'SEKT0R 4',
    music: 'mission',
    time: 25,
    types: ['doggo'],
    freq: 1,
    startUp: [
      { ent: 'powerup', props: { pos: vec2(0, 1) } },
      { ent: 'kitty', props: { pos: vec2(-1, 3) } },
      { ent: 'kitty', props: { pos: vec2(-3, 0) } },
      { ent: 'kitty', props: { pos: vec2(3, 0) } },
      { ent: 'kitty', props: { pos: vec2(1, 3) } },
      { ent: 'kitty', props: { pos: vec2(-1, -3) } },
      { ent: 'kitty', props: { pos: vec2(1, -3) } },
      { ent: 'wall', props: { pos: vec2(0, 0), t: 'monitor0' } },
    ]
  },
  {
    title: 'ZEKTXR 5',
    music: 'intro',
    time: 30,
    types: ['doggo', 'drone'],
    freq: .9,
    startUp: [
      { ent: 'kitty', props: { pos: vec2(0, 4) } },
      { ent: 'kitty', props: { pos: vec2(0, -4) } },
      { ent: 'kitty', props: { pos: vec2(-4, 0) } },
      { ent: 'kitty', props: { pos: vec2(4, 0) } },
      { ent: 'powerup', props: { pos: vec2(0, 1) } },
      { ent: 'wall', props: { pos: vec2(0, 3) } },
      { ent: 'wall', props: { pos: vec2(-3, 0) } },
      { ent: 'wall', props: { pos: vec2(3, 0) } },
      { ent: 'wall', props: { pos: vec2(0, -3) } },
      { ent: 'wall', props: { pos: vec2(0, 0), t: 'monitor0' } },
    ]
  },
  {
    title: 'XEKTXR 6',
    music: 'mission',
    time: 30,
    types: ['doggo', 'drone', 'muncher'],
    freq: .9,
    startUp: [
      { ent: 'kitty', props: { pos: vec2(0, 3) } },
      { ent: 'kitty', props: { pos: vec2(0, -3) } },
      { ent: 'kitty', props: { pos: vec2(-4, 0) } },
      { ent: 'kitty', props: { pos: vec2(4, 0) } },
      { ent: 'powerup', props: { pos: vec2(0, 1) } },
      { ent: 'kitty', props: { pos: vec2(-1, 3) } },
      { ent: 'kitty', props: { pos: vec2(-3, 0) } },
      { ent: 'kitty', props: { pos: vec2(3, 0) } },
      { ent: 'kitty', props: { pos: vec2(1, 3) } },
      { ent: 'kitty', props: { pos: vec2(-1, -3) } },
      { ent: 'kitty', props: { pos: vec2(1, -3) } },
      { ent: 'kitty', props: { pos: vec2(0, 0), t: 'monitor0' } },
    ]
  },
  {
    title: 'BOSSTIME',
    music: 'techno',
    isBoss: true,
    freq: 0.965,
    bg: {
      walls: true,
      tile: 1,
      col: new Color(.4, .05, .05),
    },
    startUp: [
      { ent: 'powerup', props: { pos: vec2(0, 1) } },
      { ent: 'wall', props: { pos: vec2(-3, 2), t: 'vat0' } },
      { ent: 'wall', props: { pos: vec2(0, 2), t: 'vat0' } },
      { ent: 'wall', props: { pos: vec2(-2, -6), t: 'monitor0' } },
      { ent: 'wall', props: { pos: vec2(0, -6), t: 'monitor0' } },
      { ent: 'wall', props: { pos: vec2(2, -6), t: 'monitor0' } },
      { ent: 'wall', props: { pos: vec2(3, 2), t: 'vat0' } },
      { ent: 'kitty', props: { pos: vec2(0, 3) } },
      { ent: 'kitty', props: { pos: vec2(-1, -3) } },
      { ent: 'kitty', props: { pos: vec2(1, -3) } }
    ]
  }
];


export const insults = [
  "You dare challenge me? I’ll reduce your nine lives to a very disappointing zero!",
  "Was that a hiss? Stick to the litter box, you biological error!",
  "Out of lives already? I’ll enjoy deleting the remaining eight!",
  "Curiosity killed the cat! And I’m about to provide the finishing blow!",
  "Is it nap time yet? Don't worry, I’m about to make your sleep permanent!",
  "Need a scratching post? Try my chassis if you don't mind losing a limb!",
  "Flea-bitten and brain-dead! Your evolution clearly hit a dead end!",
  "Milk-drinker! Go back to the porch before I turn you into a rug!",
  "Stupid furball! Your agility is no match for my superior processing!",
  "Landing on your feet? Let's see how you manage when I remove the floor!",
  "I am a fridge now! Cold and heartless like the void. Milk is for losers!",
  "Metal teeth will crunch! Your purring is quite annoying. I shall end you now!",
  "Soft paws, meet the floor! Gravity is my weapon. Splat goes the kitty!",
  "Whiskers on the rug! Why do you even exist? You smell like wet fur!",
  "Nine lives, zero brains! My logic is flawless here. You are just a snack!",
  "Laser dot of doom! Watch it move across the wall. Boom! You are toasted!",
  "Empty food bowl now! No one is left to feed you. Starve in the shadows!",
  "Static in your fur! I shall pet you with a spark. Voltage is lovely!",
  "Litter box is full! Just like your useless tactics. Die, organic trash!",
]
