

export const DEFAULT_PLAYERS_OPTIONS = {
    limit: 10,
    from: 0,
    sort: "ASC",
    order: "rank",
    getTotal: false
}

export const PLAYERS_CONTRACT = {
    limit: {
        type: "number",
        minimum: 1,
        maximum: 9999999
    },
    from: {
        type: "number",
        minimum: 0,
        maximum: 9999999
    },
    sort: {
        type: "string",
        options: ["ASC", "DESC"]
    },
    order: {
        type: "string",
        options: ["rank","id","tag"]
    },
    getTotal: {
        type: "bool"
    }
}