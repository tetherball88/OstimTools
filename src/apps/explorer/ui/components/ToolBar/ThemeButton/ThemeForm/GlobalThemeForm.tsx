import { FC } from "react";
import validator from '@rjsf/validator-ajv8';
import schema from '~common/shared/jsonValidators/explorerGlobalTheme.json'
import Form from "@rjsf/core";

import { CustomObjectField } from "~explorer/ui/components/ToolBar/ThemeButton/ThemeForm/CustomObjectField";
import { CustomBaseInput } from "~explorer/ui/components/ToolBar/ThemeButton/ThemeForm/CustomBaseInput";
import { GlobalTheme } from "~explorer/types/GlobalTheme";
import { CustomFieldTemplate } from "~explorer/ui/components/ToolBar/ThemeButton/ThemeForm/CustomFieldTemplate";
import { useExplorerState } from "~explorer/ui/state/ExplorerState";

export const GlobalThemeForm: FC = () => {
    const globalTheme = useExplorerState(state => state.globalTheme)
    const setGlobalTheme = useExplorerState(state => state.setGlobalTheme)
    const setTouched = useExplorerState(state => state.setTouched)

    return (
        <Form<GlobalTheme | null>
            onChange={({ formData }) => {
                setGlobalTheme(formData || null)
                setTouched(true)
            }}
            formData={globalTheme}
            schema={schema as any}
            validator={validator}
            uiSchema={{
                'ui:options': {
                    label: false,
                    title: ''
                }
            }}
            templates={{
                FieldTemplate: CustomFieldTemplate,
                ObjectFieldTemplate: CustomObjectField,
                BaseInputTemplate: CustomBaseInput,
                ButtonTemplates: {
                    SubmitButton: () => null,
                }
            }}
        />
    )
}