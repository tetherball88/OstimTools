import { FieldValues, useFieldArray } from "react-hook-form";
import { AddonConfig } from "./AddonConfig";

class Wrapper<T extends FieldValues> {
    // wrapped has no explicit return type so we can infer it
    wrapped() {
        return useFieldArray<T>({} as any)
    }
}

export type ModsToConnectField = ReturnType<Wrapper<AddonConfig>['wrapped']>