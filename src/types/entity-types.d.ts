interface ImageDTO {
    type: number;
    name: string;
    detail: string;
    size: string;
    file: File | null;
    objectURL: string;
}

interface ImageUpdateDTO {
    id: number;
    url: string;
    type: number;
    name: string;
    nameZh: string;
    detail: string;
    thumb: string;
}

interface ImageDeleteMiniDTO {
    id: number;
    url: string;
}

interface RelatedEntity {
    entityType: number;
    entityId: number;
    name: string;
    subName: string;

    remark: string;

    role: Attribute<number>;
}

interface PersonnelGroup {
    role: Attribute<number>;
    entities: RelatedEntity[];
}

interface RelationConfig {
    key: number[];
    type: number;
    subConfigs: any[];
}

interface ItemSpecParams {
    length: number; // mm
    width: number;  // mm
    height: number; // mm
    weight: number; // g
}

interface FileRelatedDeleteDTO {
    entityType: number;
    entityId: number;
    ids: number[];
}

interface ImageDeleteDTO {
    entityType: number;
    entityId: number;
    images: ImageDeleteMiniDTO[];
}