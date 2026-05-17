// Luchademia "Lucha Arcade" tokens — port of luchademia-system.jsx
// Dark = warm oxblood + championship gold. Light = warm bone + deep ink.

export type Theme = {
  mode: 'dark' | 'light';

  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  border: string;
  borderHi: string;

  text: string;
  textDim: string;
  textMuted: string;
  textInk: string;

  gold: string;
  goldDeep: string;
  blood: string;
  bloodDeep: string;
  vital: string;
  vitalDeep: string;
  electric: string;

  hpHi: string;
  hpMid: string;
  hpLow: string;

  tintAttack: string;
  tintAttackBorder: string;
  tintDanger: string;
  tintDangerBorder: string;
  tintGold: string;
  tintGoldBorder: string;
};

export const LD_DARK: Theme = {
  mode: 'dark',

  bg: '#0A0608',
  surface: '#160E11',
  surface2: '#1F1418',
  surface3: '#2A1B20',
  border: '#33222A',
  borderHi: '#4B2E37',

  text: '#F5EFE6',
  textDim: '#A89890',
  textMuted: '#6A5A55',
  textInk: '#0A0608',

  gold: '#E8B341',
  goldDeep: '#A87A20',
  blood: '#D8233A',
  bloodDeep: '#7A1422',
  vital: '#3FB66F',
  vitalDeep: '#1F6F40',
  electric: '#E84A8A',

  hpHi: '#3FB66F',
  hpMid: '#E8B341',
  hpLow: '#D8233A',

  tintAttack: 'rgba(63,182,111,0.14)',
  tintAttackBorder: 'rgba(63,182,111,0.45)',
  tintDanger: 'rgba(216,35,58,0.16)',
  tintDangerBorder: 'rgba(216,35,58,0.5)',
  tintGold: 'rgba(232,179,65,0.14)',
  tintGoldBorder: 'rgba(232,179,65,0.45)',
};

export const LD_LIGHT: Theme = {
  mode: 'light',

  bg: '#F4EEDF',
  surface: '#FBF6EA',
  surface2: '#ECE3CE',
  surface3: '#DBCFB3',
  border: '#C6B79A',
  borderHi: '#9A8869',

  text: '#1A0B0E',
  textDim: '#5A4A44',
  textMuted: '#8A7B72',
  textInk: '#1A0B0E',

  gold: '#A87518',
  goldDeep: '#6F4D0F',
  blood: '#B61628',
  bloodDeep: '#791018',
  vital: '#1A7846',
  vitalDeep: '#0F5530',
  electric: '#B61B68',

  hpHi: '#1A7846',
  hpMid: '#A87518',
  hpLow: '#B61628',

  tintAttack: 'rgba(26,120,70,0.14)',
  tintAttackBorder: 'rgba(26,120,70,0.4)',
  tintDanger: 'rgba(182,22,40,0.12)',
  tintDangerBorder: 'rgba(182,22,40,0.45)',
  tintGold: 'rgba(168,117,24,0.14)',
  tintGoldBorder: 'rgba(168,117,24,0.45)',
};
