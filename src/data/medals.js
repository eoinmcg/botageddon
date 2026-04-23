import { NewgroundsMedal } from "../lib/newgrounds";

let medalData = [
  {
    name: 'Achiever',
    info: 'Get a new HiScore',
    icon: '💸',
    id: 87234,
  },
  {
    name: 'Sharpshooter',
    info: 'More than 70% accuracy',
    icon: '🎯',
    id: 87235,
  },
  {
    name: 'Smash TV',
    info: 'Break a monitor',
    icon: '📺',
    id: 87235,
  },
  {
    name: 'Robolover',
    info: 'Finish level with no kills',
    icon: '🤖',
    id: 87235,
  },
  {
    name: 'Champion',
    info: 'Beat the game',
    icon: '🏆',
    id: 87237,
  },
];

export default function generateMedals(gameTitle, g) {
  const medals = [];
  medalData.forEach((medal, i) => {
    medals.push(new NewgroundsMedal(i, medal.name, medal.info, medal.icon, false, g, medal.id));
  });
  medalsInit(gameTitle);
  return medals;
}
