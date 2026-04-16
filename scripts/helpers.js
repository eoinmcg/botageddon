import chalk from 'chalk';

export function chalkError(message, emoji = '❌') {
  console.log('');
  console.error(emoji + ' ' + chalk.bgRed.white.bold('Error: ' + message));
}

export function chalkSuccess(message, emoji = '✅') {
  console.log('');
  console.error(emoji + ' ' + chalk.bgGreen.white.bold(' ' + message));
}

export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}
