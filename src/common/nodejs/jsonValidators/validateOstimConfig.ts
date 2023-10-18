import { Validator } from 'jsonschema'

import schema from './ostimConfigJsonSchema.json'
import { logger } from '~common/nodejs/utils'

const ostimConfigValidator = new Validator

export const validateOstimConfig = (ostimConfig?: any)  => {
    const res = ostimConfigValidator.validate(ostimConfig, schema)

    if(!res.valid) {
        res.errors.forEach(err => logger.error(err.stack))
    }

    return res.valid
}