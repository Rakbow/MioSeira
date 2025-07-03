export class PColumn {
    field: string = "";
    header: string = "";

    constructor(field: string, header: string) {
        this.field = field;
        this.header = header;
    }

}

export class PToast {
    severity: string = '';
    summary: string = '';
    detail: string = '';
    life: number = 3000;

    success(message: string): PToast {
        this.severity = 'success';
        this.summary = message;
        return this;
    }

    error(message: string): PToast {
        this.severity = 'error';
        this.summary = message;
        return this;
    }

}