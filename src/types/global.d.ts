interface Attribute<T> {
    label: string;
    value: T;
}

interface User {
    id: string;
    name: string;
    type: number;
    avatar: string;
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

interface SearchResult {
    data: any[];
    total: number;
    time: string;
}