const FORWARDS = ['ST', 'CF', 'LST', 'RST'];
const WINGERS_R = ['RW', 'RM'];
const WINGERS_L = ['LW', 'LM'];
const ALL_MIDS = ['CAM', 'CM', 'LCM', 'RCM', 'CDM', 'RDM', 'LDM'];
export const CENTER_BACKS = ['CB', 'RCB', 'LCB'];
const RIGHT_BACKS = ['RB', 'RWB'];
const LEFT_BACKS = ['LB', 'LWB'];

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
  CB: CENTER_BACKS,
  RCB: CENTER_BACKS,
  LCB: CENTER_BACKS,
  RB: RIGHT_BACKS,
  LB: LEFT_BACKS,
  RWB: RIGHT_BACKS,
  LWB: LEFT_BACKS,
};

export const isForward = (pos: string) => ['ST', 'CF', 'RW', 'LW', 'LST', 'RST'].includes(pos);
export const isMidfielder = (pos: string) => [
  'CAM', 'CM', 'CDM', 'RM', 'LM', 'LCM', 'RCM', 'RDM', 'LDM'
].includes(pos);
export const isDefender = (pos: string) => [
  'CB', 'RB', 'LB', 'RWB', 'LWB', 'RCB', 'LCB'
].includes(pos);
