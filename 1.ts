import * as csv from 'csv';

import { readFile, writeFile } from "./src/common/nodejs/utils"

async function run () {
    const content = await readFile("C:\\Users\\sokol\\Downloads\\LazyVoiceFinder_export.csv")
     csv.parse(content, {
        relax_quotes: true,
        columns: true,
    }, (arg1, arg2) => {
        csv.stringify(arg2, {
            columns: ["State", "Plugin", "File Name", "Voice Type", "Dialogue 1 - English", "Dialogue 2 - English"],
            delimiter: ',',
            header: true,
            quoted: true,
            
        }, (error, output) => {
            writeFile("C:\\Users\\sokol\\Downloads\\output.csv", output)
        })
    })

    // console.log(parser)
}

run()