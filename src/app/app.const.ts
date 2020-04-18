export function buildStateName(
  parentStateName: string,
  stateName: string
): string {
  return parentStateName + ':' + stateName;
}

export function getParentStateName(stateName: string): string {
  const parentParts = stateName.split(':');
  parentParts.pop();
  return parentParts.join(':');
}

export const ROOT_STATE_NAME = 'app';
export const WELCOME_STATE_NAME = buildStateName(ROOT_STATE_NAME, 'welcome');
