import { UseFormReturn } from 'react-hook-form';
import { invokeValidateInputPath, invokeValidateSlalJsonPath } from '~bridge/events/invokers';

import { ModuleSpecificConfig } from '~bridge/types';

export const useRegisterFields = (methods: UseFormReturn<ModuleSpecificConfig, any>) => {
    methods.register('module.name', {
        required: 'Module name field is required.',
        pattern: {
            value: /\w+/,
            message: 'Name should include only letters and digits.'
        }
    });

    methods.register('module.inputPath', {
        required: 'Input path is essential to copy hkx animations\'s files.',
        validate: async (val) => {
            const valid = await invokeValidateInputPath(val);
            return valid ? true : 'No animations\' files were found within this folder. Please provde path to folder with hkx files.'
        }
    });

    methods.register('module.slalJsonConfig', {
        required: 'Slal config is essential for first run.',
        validate: async (val) => {
            const msg = await invokeValidateSlalJsonPath(val);
            return !msg ? true : msg
        }
    })

    methods.register('module.nemesisPrefix', {
        required: 'Nemesis prefix is required.',
        maxLength: {
            value: 6,
            message: 'Maximum 6 symbols'
        },
        pattern: {
            value: /^[\w\d]+$/,
            message: 'Only letters and digits are allowed'
        }
    })
}