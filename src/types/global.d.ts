interface Attribute<T> {
    label: string;
    value: T;
}

interface User {
    id: string;
    name: string;
    type: number;
    headerUrl: string;
}

interface UserState {
    user: User | null;
    ticket: string | null;
}

interface Entity {
    type: number;
    subType: number;
    id: number;
}

interface RButtonProps {
    icon: string;
    tip: string;
    severity: string;
}