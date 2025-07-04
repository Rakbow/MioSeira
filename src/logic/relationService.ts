export interface Role {
    label: string;
    value: number;
}

export interface RelatedEntity {
    entityType: number;
    entityId: number;
    name: string;
    subName: string;

    remark: string;

    role: Role;
}

export interface Relation {
    role: Role;
    target: RelatedEntity;
    remark: string;
}

export interface PersonnelGroup {
    role: Role;
    entities: RelatedEntity[];
}