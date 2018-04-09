
// ------------------------------------ Players -----------------------------------------------------

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

// ------------------------------------ Touraments -----------------------------------------------------


export const DEFAULT_TOURNAMENTS_OPTIONS = {
    limit: 10,
    from: 0,
    sort: "DESC",
    order: "date",
    getTotal: false
}

export const TOURNAMENTS_CONTRACT = {
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
        options: ["id","date","title","sets","entrants"]
    },
    getTotal: {
        type: "bool"
    }
}

// ------------------------------------ Sets -----------------------------------------------------

export const DEFAULT_SETS_OPTIONS = {
    limit: 10,
    from: 0,
    sort: "DESC",
    order: "id",
    getTotal: false
}

export const SETS_CONTRACT = {
    limit: {
        type: "number",
        minimum: 1,
        maximum: 999999999
    },
    from: {
        type: "number",
        minimum: 0,
        maximum: 999999999
    },
    sort: {
        type: "string",
        options: ["ASC", "DESC"]
    },
    order: {
        type: "string",
        options: ["id"]
    },
    getTotal: {
        type: "bool"
    }
}