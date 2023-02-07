import { jsonParsedXmlOption } from "~connectAddon/nodejs/utils";
import { JsonParsedXmlOption } from "~connectAddon/types";

export const createOption = (id: string, text: string): JsonParsedXmlOption => {
    const newOption: JsonParsedXmlOption = JSON.parse(JSON.stringify(jsonParsedXmlOption));
    newOption.$.go = id;
    newOption.$.text = text;

    return newOption;
}