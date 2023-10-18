import { FC, useEffect, useState } from "react";
import { ConfirmProvider } from "material-ui-confirm";
import { PacksList } from "./components/PacksList";
import { useBridgeState } from "~bridge/ui/state/store";

export const Packs: FC = () => {
    const [loading, setLoading] = useState(true);
    const loadApp = useBridgeState(state => state.loadApp)

    useEffect(() => {
        (async() => {
            await loadApp()
            setLoading(false);
        })()
    }, [])

    if(loading) {
        return <>"Loading configs from file system..."</>
    }

    return (
        <ConfirmProvider>
            <PacksList />
        </ConfirmProvider>
    )
}