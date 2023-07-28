import { useCategoryData } from "../DataArea/hooks/data";
import React from "react";

const CategoryContext = React.createContext<ReturnType<typeof useCategoryData> | null>(null);

export default CategoryContext;

export function DataProvider ({ children }: { children: React.ReactNode }) {
    const data = useCategoryData();

    return (
        <CategoryContext.Provider value={data}>
            {children}
        </CategoryContext.Provider>
    );
}

export function useCategoryContext () {
    const context = React.useContext(CategoryContext);
    if (context === null) {
        throw new Error("useCategoryData must be used within a DataProvider");
    }
    return context;
}
