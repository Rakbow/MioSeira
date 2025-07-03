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

export const groupPersonnel = (personnelList: Relation[]): PersonnelGroup[] => {
    if(personnelList === null) return [];
    return personnelList.reduce((acc: PersonnelGroup[], current: Relation) => {
        const {target} = current;
        const existingGroup = acc.find(group => group.role.value === target.role.value);
        target.remark = current.remark;
        if (existingGroup)
            existingGroup.entities.push(target);
        else
            acc.push({role: target.role, entities: [target]});
        return acc;
    }, []);
}