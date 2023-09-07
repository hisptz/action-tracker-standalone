const config = {
    type: 'app',
    title: 'Real Time Supervision tool',
    entryPoints: {
        app: './src/App.tsx',
    },
    dataStoreNamespace: 'hisptz-standalone-action-tracker',
    customAuthorities: [
        'Standalone Action Tracker - Planning',
        'Standalone Action Tracker - Tracking',
        'Standalone Action Tracker - Configure'
    ]
}
module.exports = config
