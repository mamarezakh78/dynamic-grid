
export class Column {

    constructor(data: Partial<Column>) {
        Object.assign(this, data);
    }

    label: string;
    key: string;
    protected type: string;
}


export class ActionColumn extends Column {

    constructor(data: Partial<ActionColumn>) {
        super(data);

        this.type = "action";

        Object.assign(this, data);
    }

    actionList: ActionOption[];
}


export class ActionOption {
    label: string;
    onClick: (row: any) => any;
}