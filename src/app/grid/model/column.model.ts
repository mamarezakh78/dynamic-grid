
export class Column {

    constructor(data: Partial<Column>) {
        Object.assign(this, data);

        this.type = "text";
    }

    label: string;
    key: string;
    protected type: string;
    hasSort: boolean;

    get columnType(): string {
        return this.type;
    }
}


export class ActionColumn extends Column {

    constructor(data: Partial<ActionColumn>) {
        super(data);

        this.type = "action";

        Object.assign(this, data);
    }

    actionList: ActionOption[];
}


export interface ActionOption {
    label: string;
    onClick: (row?: any) => any;
}


export interface GridRow {
    data: any;
    rowId: number;
    rowSelected?: boolean;
}