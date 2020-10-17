import { ObjectTree } from './../objects-client/models/object-tree';
import { StateService } from '@uirouter/angular';
import { ObjectsCommonService } from './../objects-client/services/objects-common.service';
import { buildStateName, ROOT_STATE_NAME } from '../app.const';
export const ADMIN_ROUTE_NAME = buildStateName(ROOT_STATE_NAME, 'admin');
export const ADMIN_OBJECTS_LIST_ROUTE_NAME = buildStateName(
  ADMIN_ROUTE_NAME,
  'objects-list'
);
export const OBJECT_TREE_TOKEN = 'objectTree';
