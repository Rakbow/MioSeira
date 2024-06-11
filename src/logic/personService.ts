export interface Role {
    label: string;
    value: number;
}

export interface Person {
    label: string;
    value: number;
}

export interface Personnel {
    role: Role;
    person: Person;
}

export interface PersonnelGroup {
    role: Role;
    persons: Person[];
}

export const groupPersonnel = (personnelList: Personnel[]): PersonnelGroup[] => {
    return personnelList.reduce((acc: PersonnelGroup[], current: Personnel) => {
        const {role, person} = current;
        const existingGroup = acc.find(group => group.role.value === role.value);
        if (existingGroup)
            existingGroup.persons.push(person);
        else
            acc.push({role, persons: [person]});
        return acc;
    }, []);
}