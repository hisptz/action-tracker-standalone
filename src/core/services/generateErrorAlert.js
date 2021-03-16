export default function generateErrorAlert(show, error) {
    error && show({message: error?.message || error?.toString(), type: {critical: true}})
}
