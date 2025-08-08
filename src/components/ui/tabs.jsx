import { forwardRef, useId } from "react";
import React from "react";
import { cn } from "../../lib/utils";

function TabsRoot({ defaultValue, value, onValueChange, children, className }) {
    const controlled = value !== undefined;
    const [internal, setInternal] = React.useState(defaultValue || "");
    const current = controlled ? value : internal;

    const setValue = (v) => {
        if (!controlled) setInternal(v);
        onValueChange?.(v);
    };

    return (
        <TabsContext.Provider value={{ value: current, setValue }}>
            <div className={cn("w-full", className)}>{children}</div>
        </TabsContext.Provider>
    );
}

const TabsContext = React.createContext({ value: "", setValue: (_v) => {} });
function useTabs() {
    const ctx = React.useContext(TabsContext);
    if (!ctx) throw new Error("Tabs components must be used within Tabs");
    return ctx;
}

function TabsList({ children, className }) {
    const { value } = useTabs();
    return (
        <div
            role="tablist"
            aria-orientation="horizontal"
            className={cn(
                "inline-flex h-10 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground",
                className
            )}
            data-value={value}
        >
            {children}
        </div>
    );
}

function TabsTrigger({ value, children, className, ...props }) {
    const { value: current, setValue } = useTabs();
    const selected = current === value;
    const id = useId();
    return (
        <button
            id={`tab-${id}`}
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${id}`}
            onClick={() => setValue(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                selected
                    ? "bg-background text-foreground shadow"
                    : "text-muted-foreground hover:text-foreground",
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}

function TabsContent({ value, children, className }) {
    const { value: current } = useTabs();
    if (current !== value) return null;
    return (
        <div role="tabpanel" className={cn("mt-4", className)}>
            {children}
        </div>
    );
}

export const Tabs = Object.assign(TabsRoot, {
    List: TabsList,
    Trigger: TabsTrigger,
    Content: TabsContent,
});
