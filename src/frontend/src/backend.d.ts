import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Note {
    id: bigint;
    title: string;
    body: string;
}
export interface backendInterface {
    add(a: bigint, b: bigint): Promise<bigint>;
    addNote(title: string, body: string): Promise<bigint>;
    echo(message: string): Promise<string>;
    getCount(): Promise<bigint>;
    getNotes(): Promise<Array<Note>>;
    greet(name: string): Promise<string>;
    increment(): Promise<bigint>;
}
