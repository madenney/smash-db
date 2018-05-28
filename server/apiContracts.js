

// ------------------------------------ Search -----------------------------------------------------

export const DEFAULT_SEARCH_OPTIONS = {
    limit: 10,
    sort: "ASC",
    order: "rank",
    players: true,
    tournaments: false,
    regions: false
}

export const SEARCH_CONTRACT = {
    input: {
        type: "string",
        isRequired: true
    },
    limit: {
        type: "number",
        minimum: 1,
        maximum: 999999
    },
    sort: {
        type: "string",
        options: ["ASC", "DESC"]
    },
    order: {
        type: "string",
        options: ["rank","id","tag"]
    },
    players: {
        type: "bool"
    },
    tournaments: {
        type: "bool"
    },
    regions: {
        type: "bool"
    }
}

// ------------------------------------ Player Profile -----------------------------------------------------

export const DEFAULT_PLAYER_PROFILE_OPTIONS = {
    getHistory: false
}

export const PLAYER_PROFILE_CONTRACT = {
    id: {
        type: "number",
        isRequired: true
    },
    getHistory: {
        type: "bool"
    }
}

// ------------------------------------ HEAD2HEAD -----------------------------------------------------

export const HEAD2HEAD_CONTRACT = {
    id1: {
        type: "number",
        isRequired: true
    },
    id2: {
        type: "number",
        isRequired: true
    }
}

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