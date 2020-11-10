export function buildStateName(
  parentStateName: string,
  stateName: string
): string {
  return parentStateName + ':' + stateName;
}

export function buildStateAndRootHref(
  parentStateName: string,
  stateName: string
): { stateName: string; url: string; href: string } {
  return {
    stateName: buildStateName(parentStateName, stateName),
    url: '/' + stateName,
    href: '#/' + stateName,
  };
}

export function buildStateAndHref(
  parentStateAndHref: { stateName: string; url: string; href: string },
  stateName: string
): { stateName: string; url: string; href: string } {
  return {
    stateName: buildStateName(parentStateAndHref.stateName, stateName),
    url: '/' + stateName,
    href: parentStateAndHref.href + '/' + stateName,
  };
}

export function getParentStateName(stateName: string): string {
  const parentParts = stateName.split(':');
  parentParts.pop();
  return parentParts.join(':');
}

export const ROOT_STATE_NAME = 'app';
export const WELCOME_STATE_NAME = buildStateName(ROOT_STATE_NAME, 'welcome');
