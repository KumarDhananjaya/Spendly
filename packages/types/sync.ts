export interface ChangeEvent {
    id: string;
    entity: "expense" | "category" | "budget";
    action: "create" | "update" | "delete";
    payload: any;
    timestamp: number;
}

export interface SyncPayload {
    lastSyncAt: number;
    changes: ChangeEvent[];
}

export interface SyncResponse {
    lastSyncAt: number;
    changes: ChangeEvent[];
}
