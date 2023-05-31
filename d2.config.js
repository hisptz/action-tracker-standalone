const config = {
    type: 'app',
    title: 'Standalone Action Tracker',
    entryPoints: {
        app: './src/App.tsx',
    },
    dataStoreNamespace: 'Standalone_Action_Tracker',
    customAuthorities: [
        "SAT_VIEW_BOTTLENECKS",
        "SAT_CREATE_BOTTLENECKS",
        "SAT_UPDATE_BOTTLENECKS",
        "SAT_DELETE_BOTTLENECKS",

        "SAT_VIEW_ACTIONS",
        "SAT_CREATE_ACTIONS",
        "SAT_UPDATE_ACTIONS",
        "SAT_DELETE_ACTIONS",

        "SAT_VIEW_GAPS",
        "SAT_CREATE_GAPS",
        "SAT_UPDATE_GAPS",
        "SAT_DELETE_GAPS",

        "SAT_VIEW_POSSIBLE_SOLUTIONS",
        "SAT_CREATE_POSSIBLE_SOLUTIONS",
        "SAT_UPDATE_POSSIBLE_SOLUTIONS",
        "SAT_DELETE_POSSIBLE_SOLUTIONS",

        "SAT_VIEW_ACTION_STATUS",
        "SAT_CREATE_ACTION_STATUS",
        "SAT_UPDATE_ACTION_STATUS",
        "SAT_DELETE_ACTION_STATUS",

        "SAT_MANAGE_ACTION_STATUS_OPTIONS",
        "SAT_MANAGE_CHALLENGE_METHODS",
        "SAT_MANAGE_PLANNING_PERIOD",
        "SAT_MANAGE_TRACKING_PERIOD",
        "SAT_MANAGE_PLANNING_ORG_UNIT_LEVEL"
    ]
}
module.exports = config
