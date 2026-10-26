import type { Format, FormatLabels } from "./types.js";

export function formatId(id: number): string {
    return `TRK-${id}`;
}

const formatLabels: FormatLabels = {
    vinyl: "Vinyl record",
    cd: "Compact disc",
    digital: "Digital download",
    cassette: "Cassette"
};

export function describeFormat(format: Format): string {
    return formatLabels[format];
}

