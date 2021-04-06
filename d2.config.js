const config = {
    type: 'app',
    title: 'Standalone Action Tracker',
    author: 'HISP Tanzania',
    entryPoints: {
        app: './src/App',
    },
   customAttributes:{
       authorities: [
           "SAT_VIEW_BOTTLENECKS",
           "SAT_CREATE_BOTTLENECKS",
           "SAT_EDIT_BOTTLENECKS",
           "SAT_DELETE_BOTTLENECKS",

           "SAT_VIEW_ACTIONS",
           "SAT_CREATE_ACTIONS",
           "SAT_EDIT_ACTIONS",
           "SAT_DELETE_ACTIONS",

           "SAT_VIEW_GAPS",
           "SAT_CREATE_GAPS",
           "SAT_EDIT_GAPS",
           "SAT_DELETE_GAPS",

           "SAT_VIEW_POSSIBLE_SOLUTIONS",
           "SAT_CREATE_POSSIBLE_SOLUTIONS",
           "SAT_EDIT_POSSIBLE_SOLUTIONS",
           "SAT_DELETE_POSSIBLE_SOLUTIONS",

           "SAT_VIEW_ACTION_STATUS",
           "SAT_CREATE_ACTION_STATUS",
           "SAT_EDIT_ACTION_STATUS",
           "SAT_DELETE_ACTION_STATUS"
       ]
   }
}
module.exports = config
