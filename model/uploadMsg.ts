export enum EFileState {
    Complete = 0,
    Fail = 1,
    FileExist = 2,
    Created = 3,
    ChunkAdded = 4
}

export interface IFileUploadMsg {
    state: EFileState;
    data: string;
}
