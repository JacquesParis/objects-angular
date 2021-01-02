import * as _ from 'lodash-es';
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

export function getSiteId(): string {
  if (
    document.head.querySelector('[name~="objectTrees:siteId"][content]') &&
    document.head.querySelector('[name~="objectTrees:siteId"][content]')[
      'content'
    ]
  ) {
    return document.head.querySelector('[name~="objectTrees:siteId"][content]')[
      'content'
    ];
  }
  return 'namespace/Tenant/Demonstration/TravelStory/Exemple de site de Voyage';
}

export function getOwnerName(): string {
  if (
    document.head.querySelector('[name~="objectTrees:ownerName"][content]') &&
    document.head.querySelector('[name~="objectTrees:ownerName"][content]')[
      'content'
    ]
  ) {
    return document.head.querySelector(
      '[name~="objectTrees:ownerName"][content]'
    )['content'];
  }
  return 'Démo';
}

export function getRootState(): string {
  if (
    document.head.querySelector('[name~="objectTrees:rootState"][content]') &&
    document.head.querySelector('[name~="objectTrees:rootState"][content]')[
      'content'
    ]
  ) {
    return document.head.querySelector(
      '[name~="objectTrees:rootState"][content]'
    )['content'];
  }
  return undefined;
}

export function getServer(): string {
  if (
    document.head.querySelector('[name~="objectTrees:api"][content]') &&
    document.head.querySelector('[name~="objectTrees:api"][content]')['content']
  ) {
    return document.head.querySelector('[name~="objectTrees:api"][content]')[
      'content'
    ];
  }
  return (
    'http://' +
    location.hostname +
    ('localhost' === location.hostname ? ':3000' : '') +
    '/api'
  );
}

export function uriDecode(param: string) {
  if (!_.isString(param)) {
    return param;
  }
  let decodedParam = decodeURIComponent(param);
  while (decodedParam !== decodeURIComponent(decodedParam)) {
    decodedParam = decodeURIComponent(decodedParam);
  }
  return decodedParam;
}
