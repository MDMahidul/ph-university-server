// create an array of object
export type TErrorSource={
path:string | number;
message:string;
}[];

export type TGenereicErrorResponse={
    statusCode:number;
    message:string;
    errorSources:TErrorSource;
}