export const trimStrings = (obj: Record<string, any>): Record<string, any> => {
    return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
            key,
            typeof value === "string" ? value.trim() : value,
        ]),
    );
}