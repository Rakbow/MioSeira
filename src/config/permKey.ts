export const PERM_KEY = {
    ENTITY: {
        STATUS_UPDATE: 'entity:status:update',
        DETAIL_UPDATE: 'entity:detail:update',
        MANAGE: 'entity:manage',
    },
    ENTRY : {
        QUERY_LIST: 'entity:entry:list',
        CREATE: 'entity:entry:add',
        UPDATE: 'entity:entry:update',
        DELETE: 'entity:entry:delete',
        IMAGE_UPLOAD: 'entity:entry:image'
    },
    ITEM: {
        QUERY_LIST: 'entity:item:list',
        CREATE: 'entity:item:add',
        UPDATE: 'entity:item:update',
        DELETE: 'entity:item:delete',
    },
    INDEX: {
        CREATE: 'entity:index:add',
        ADD_ITEM: 'entity:index:add-item',
    },
    RESOURCE: {
        IMAGE: {
            UPLOAD: 'resource:image:upload',
            UPDATE: 'resource:image:update',
            DELETE: 'resource:image:delete'
        },
        LOCAL_FILE: {
            OPEN_PATH: 'resource:file:local-path',
            UPDATE_FLAG: 'resource:file:local-flag-update'
        }
    },
    ROLE: {
        QUERY_LIST: 'entity:role:list',
        CREATE: 'entity:role:add',
        UPDATE: 'entity:role:update',
        FRESH: 'entity:role:fresh'

    },
    RELATION: {
        QUERY_LIST: 'entity:relation:list',
        CREATE: 'entity:relation:add',
        UPDATE: 'entity:relation:update',
        DELETE: 'entity:relation:delete'
    }
}