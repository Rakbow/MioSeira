export interface Role {
    label: string;
    value: number;
}

export interface RelatedEntity {
    label: string;
    value: number;
    remark: string;
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
    return personnelList.reduce((acc: PersonnelGroup[], current: Relation) => {
        const {role, target, remark} = current;
        const existingGroup = acc.find(group => group.role.value === role.value);
        target.remark = current.remark;
        if (existingGroup)
            existingGroup.entities.push(target);
        else
            acc.push({role, entities: [target]});
        return acc;
    }, []);
}