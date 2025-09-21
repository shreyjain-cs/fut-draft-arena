const FORWARDS = ['ST', 'CF', 'LST', 'RST'];
const WINGERS_R = ['RW', 'RM'];
const WINGERS_L = ['LW', 'LM'];
const ALL_MIDS = ['CAM', 'CM', 'LCM', 'RCM', 'CDM', 'RDM', 'LDM'];
const DEFENDERS = ['CB', 'RCB', 'LCB', 'RB', 'LB'];

export const POSITION_GROUPS = {
  // Forwards
  ST: FORWARDS,
  CF: FORWARDS,
  LST: FORWARDS,
  RST: FORWARDS,

  // Wingers
  RW: WINGERS_R,
  RM: WINGERS_R,
  LW: WINGERS_L,
  LM: WINGERS_L,

  // Midfielders
  CAM: ALL_MIDS,
  CM: ALL_MIDS,
  LCM: ALL_MIDS,
  RCM: ALL_MIDS,
  CDM: ALL_MIDS,
  RDM: ALL_MIDS,
  LDM: ALL_MIDS,

  // Defenders
  CB: DEFENDERS,
  RCB: DEFENDERS,
  LCB: DEFENDERS,
  RB: DEFENDERS,
  LB: DEFENDERS,
};

export const isForward = (pos: string) => ['ST', 'CF', 'RW', 'LW', 'LST', 'RST'].includes(pos);
export const isMidfielder = (pos: string) => [
  'CAM', 'CM', 'CDM', 'RM', 'LM', 'LCM', 'RCM', 'RDM', 'LDM'
].includes(pos);
export const isDefender = (pos: string) => [
  'CB', 'RB', 'LB', 'RWB', 'LWB', 'RCB', 'LCB'
].includes(pos);
