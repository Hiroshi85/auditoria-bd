import { Connection } from "@/types/connection";

export function removeDuplicatesConnections(arr: Connection[]) {
    // eliminate duplicates (mismo name)
    return arr.filter((value, index, self) =>
        self.findIndex((t) => t.name === value.name) === index
    );
}