const metadataMutation = {
    type: "create",
    resource: "metadata",
    data: ({data}: any) => data
}

export function useManageDataField(type: "dataElement" | "attribute", {
    instanceId
}: {
    instanceId: string
}) {
    const instanceType = type === "dataElement" ? "programStage" : "program";

}
