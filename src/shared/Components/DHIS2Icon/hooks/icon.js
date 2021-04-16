import {useEffect, useState} from "react";
import {useDataQuery} from "@dhis2/app-runtime";


const iconQuery = {
    icon: {
        resource: 'icons',
        id: ({id}) => id
    }
}

export default function useDHIS2Icon(iconName = '') {
    const [icon, setIcon] = useState();
    const {data, error, loading, refetch} = useDataQuery(iconQuery, {
        variables: {id: `${iconName}/icon.svg`},
        lazy: true
    });

    useEffect(() => {
        function fetch() {
            if (iconName) {
                refetch({id: `${iconName}/icon.svg`})
            }
        }

        fetch();
    }, [iconName]);
    useEffect(() => {
        async function getIcon() {
            if (data) {
                if (data.icon) {
                    if (data.icon instanceof Blob) {
                        setIcon(await data.icon.text());
                    } else {
                        setIcon(data.icon);
                    }
                }
            }
        }

        getIcon();
    }, [data, loading, error]);
    return {icon};
}
