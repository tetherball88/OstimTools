import { FC } from "react";
import { ConfirmProvider } from "material-ui-confirm";
import { PacksList } from "./components/PacksList";
import { PacksStateProvider } from "./state/PacksState";

export const Packs: FC = () => {
    return (
        <PacksStateProvider>
            <ConfirmProvider>
                <PacksList />
            </ConfirmProvider>
        </PacksStateProvider>
    )
}